// Example: Render multiple moving bands with varying speeds and widths.
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
    float band(float x, float pos, float width) {\n
      float left = pos - width * 0.5;\n
      float right = pos + width * 0.5;\n
      return smoothstep(left, left + 0.01, x) - smoothstep(right - 0.01, right, x);\n
    }\n
    void main() {\n
      float x = v_uv.x;\n
      float t = u_time;\n
      // Define three bands with different speeds and widths\n
      float b1 = band(fract(x + 0.4 * t), 0.3, 0.1);\n
      float b2 = band(fract(x + 0.2 * t), 0.6, 0.05);\n
      float b3 = band(fract(x - 0.3 * t), 0.8, 0.15);\n
      // Combine bands with different colors\n
      vec3 color = vec3(0.0);\n
      color += b1 * vec3(1.0, 0.3, 0.3);\n
      color += b2 * vec3(0.3, 1.0, 0.3);\n
      color += b3 * vec3(0.3, 0.3, 1.0);\n
      // Add subtle background gradient\n
      color += vec3(0.05) * v_uv.y;\n
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
