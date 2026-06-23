// Utility functions for shader compilation and program linking.
// These helpers keep the main rendering code clean and easy to follow.

/**
 * Compile a WebGL shader.
 *
 * @param {WebGL2RenderingContext} gl The WebGL context.
 * @param {number} type Either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @param {string} source GLSL source code.
 * @returns {WebGLShader} The compiled shader.
 */
export function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Could not compile shader:\n${info}`);
  }
  return shader;
}

/**
 * Link a WebGL program from compiled vertex and fragment shaders.
 *
 * @param {WebGL2RenderingContext} gl The WebGL context.
 * @param {WebGLShader} vertShader Compiled vertex shader.
 * @param {WebGLShader} fragShader Compiled fragment shader.
 * @returns {WebGLProgram} The linked program.
 */
export function createProgram(gl, vertShader, fragShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link program:\n${info}`);
  }
  return program;
}

/**
 * Create a full-screen quad VAO. The quad covers clip space [-1,1]^2.
 *
 * @param {WebGL2RenderingContext} gl The WebGL context.
 * @returns {WebGLVertexArrayObject} The vertex array object for the quad.
 */
export function createFullScreenQuad(gl) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  // Four corners of a full-screen quad
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const positionLoc = 0;
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vao;
}
