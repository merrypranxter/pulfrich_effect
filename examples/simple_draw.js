// Simple example that draws a static gradient using the base shaders.
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
  const [vertSrc, fragSrc] = await Promise.all([
    loadText('../src/shaders/vertex.glsl'),
    loadText('../src/shaders/fragment.glsl'),
  ]);
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = createProgram(gl, vert, frag);
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const quad = createFullScreenQuad(gl);
  gl.useProgram(program);
  gl.bindVertexArray(quad);
  gl.uniform1f(timeLoc, 0.0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

window.addEventListener('DOMContentLoaded', init);
