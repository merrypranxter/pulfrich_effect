// Example: Modify the base fragment shader to cycle colors over time.
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
  // Load vertex shader
  const vertSrc = await loadText('../src/shaders/vertex.glsl');
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  // Create a fragment shader that cycles hue over time
  const fragSrc = `#version 300 es\n
    precision highp float;\n
    in vec2 v_uv;\n
    uniform float u_time;\n
    out vec4 fragColor;\n
    // Convert HSV to RGB\n
    vec3 hsv2rgb(vec3 c) {\n
      vec3 p = abs(fract(c.xxx + vec3(0.0, 1.0/3.0, 2.0/3.0)) * 6.0 - 3.0);\n
      return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);\n
    }\n
    void main() {\n
      float speed = 0.5;\n
      float x = fract(v_uv.x + speed * u_time);\n
      float band = smoothstep(0.49, 0.5, x) - smoothstep(0.5, 0.51, x);\n
      float intensity = band;\n
      // Cycle hue over time; saturation and value fixed.\n
      float hue = fract(u_time * 0.1);\n
      vec3 rgb = hsv2rgb(vec3(hue, 1.0, intensity));\n
      fragColor = vec4(rgb, 1.0);\n
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
