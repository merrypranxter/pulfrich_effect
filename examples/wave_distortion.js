// Example: Create wavy distortions across the band using sine functions.
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
  const fragSrc = `#version 300 es\n
    precision highp float;\n
    in vec2 v_uv;\n
    uniform float u_time;\n
    out vec4 fragColor;\n
    void main() {\n
      // Apply a sinusoidal distortion to the horizontal coordinate based on y and time\n
      float freq = 10.0;\n
      float amplitude = 0.05;\n
      float distortedX = v_uv.x + amplitude * sin(v_uv.y * freq + u_time * 2.0 * 3.14159);\n
      distortedX = fract(distortedX);\n
      // Compute a band on the distorted coordinate\n
      float band = smoothstep(0.49, 0.5, distortedX) - smoothstep(0.5, 0.51, distortedX);\n
      float intensity = band;\n
      vec3 color = vec3(intensity);\n
      fragColor = vec4(color, 1.0);\n
    }\n
  `;
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = createProgram(gl, vert, frag);
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const quad = createFullScreenQuad(gl);
  let start = performance.now();
  function render() {
    const t = (performance.now() - start) * 0.001;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(quad);
    gl.uniform1f(timeLoc, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', init);
