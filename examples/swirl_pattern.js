import { compileShader, createProgram, createFullScreenQuad } from '../src/js/utils.js';

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

  const vertSrc = await loadText('../src/shaders/vertex.glsl');
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  // Create a fragment shader that generates a swirling radial pattern.
  const fragSrc = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  uniform float u_time;
  out vec4 fragColor;
  void main() {
    vec2 p = v_uv - vec2(0.5);
    float r = length(p);
    float theta = atan(p.y, p.x);
    // Radial waves modulated by angle and time
    float waves = sin(10.0 * r - u_time * 2.0);
    float twist = sin(6.0 * theta + u_time);
    float intensity = 0.5 + 0.5 * (waves + twist) * 0.5;
    vec3 color = mix(vec3(0.05, 0.0, 0.1), vec3(0.8, 0.3, 1.0), intensity);
    fragColor = vec4(color, 1.0);
  }
  `;
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = createProgram(gl, vert, frag);
  const u_time = gl.getUniformLocation(program, 'u_time');
  const quad = createFullScreenQuad(gl);
  let start = performance.now();
  function render() {
    const t = (performance.now() - start) * 0.001;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(quad);
    gl.uniform1f(u_time, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
window.addEventListener('DOMContentLoaded', init);
