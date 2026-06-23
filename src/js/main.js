// Main entry point for the Pulfrich effect demo. This file sets up a WebGL2
// context, loads shader sources, compiles them, and performs a basic render
// loop. It demonstrates how to load external GLSL files via fetch and use
// helper functions defined in utils.js.

import { compileShader, createProgram, createFullScreenQuad } from './utils.js';

/**
 * Fetch a text resource from a relative path.
 *
 * @param {string} url The relative path to the resource.
 * @returns {Promise<string>} The fetched text content.
 */
async function loadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.text();
}

async function init() {
  const canvas = document.getElementById('glcanvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL2 is not supported in this browser.');
    return;
  }

  // Load and compile shaders.
  const [vertSrc, fragSrc] = await Promise.all([
    loadText('../shaders/vertex.glsl'),
    loadText('../shaders/fragment.glsl'),
  ]);
  const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = createProgram(gl, vertShader, fragShader);

  // Look up uniform and attribute locations.
  const timeLoc = gl.getUniformLocation(program, 'u_time');

  // Set up geometry.
  const quadVAO = createFullScreenQuad(gl);

  // Animation loop.
  let startTime = performance.now();
  function render() {
    const elapsed = (performance.now() - startTime) * 0.001; // seconds
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(quadVAO);
    gl.uniform1f(timeLoc, elapsed);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', init);
