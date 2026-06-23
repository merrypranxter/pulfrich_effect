// Example: Implement temporal filtering using ping–pong framebuffers. The
// current frame is blended with the previous frame to simulate a delayed eye.
import { compileShader, createProgram, createFullScreenQuad } from '../src/js/utils.js';

// Helper to load shader source files.
async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.text();
}

async function init() {
  const canvas = document.getElementById('glcanvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL2 required');
    return;
  }
  // Load base shaders for the scene pass.
  const vertSrc = await loadText('../src/shaders/vertex.glsl');
  const sceneFragSrc = await loadText('../src/shaders/fragment.glsl');
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const sceneFrag = compileShader(gl, gl.FRAGMENT_SHADER, sceneFragSrc);
  const sceneProgram = createProgram(gl, vert, sceneFrag);
  const u_time_scene = gl.getUniformLocation(sceneProgram, 'u_time');

  // Feedback shader: blends previous and current frames.
  const feedbackFragSrc = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  uniform sampler2D u_prev;
  uniform sampler2D u_scene;
  uniform float u_alpha;
  out vec4 fragColor;
  void main() {
    vec4 prevColor = texture(u_prev, v_uv);
    vec4 sceneColor = texture(u_scene, v_uv);
    // Exponential moving average: weight current more when u_alpha closer to 1.
    fragColor = mix(prevColor, sceneColor, u_alpha);
  }
  `;
  const feedbackFrag = compileShader(gl, gl.FRAGMENT_SHADER, feedbackFragSrc);
  const feedbackProgram = createProgram(gl, vert, feedbackFrag);
  const u_prev = gl.getUniformLocation(feedbackProgram, 'u_prev');
  const u_scene = gl.getUniformLocation(feedbackProgram, 'u_scene');
  const u_alpha = gl.getUniformLocation(feedbackProgram, 'u_alpha');

  // Create full‑screen quad VAO once.
  const quad = createFullScreenQuad(gl);

  // Create two textures and FBOs for ping–pong.
  const pingPong = [];
  const textures = [];
  for (let i = 0; i < 2; i++) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    pingPong.push(fbo);
    textures.push(tex);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  let curr = 0;
  let prev = 1;

  // Animation loop.
  let startTime = performance.now();
  function render() {
    const time = (performance.now() - startTime) * 0.001;
    // Render scene to current FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, pingPong[curr]);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(sceneProgram);
    gl.bindVertexArray(quad);
    gl.uniform1f(u_time_scene, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Render feedback mix to default framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(feedbackProgram);
    gl.bindVertexArray(quad);
    // Bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[prev]);
    gl.uniform1i(u_prev, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[curr]);
    gl.uniform1i(u_scene, 1);
    // Alpha determines how quickly the delayed image catches up.
    const alpha = 0.5 + 0.4 * Math.sin(time * 0.3);
    gl.uniform1f(u_alpha, alpha);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Swap ping and pong
    const temp = curr;
    curr = prev;
    prev = temp;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', init);
