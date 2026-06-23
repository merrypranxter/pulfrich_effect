#version 300 es

// A simple pass-through vertex shader. It takes a 2D position and
// generates clip-space coordinates. It also computes a texture coordinate
// by mapping from [-1,1] to [0,1].

layout(location = 0) in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
