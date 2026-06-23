#version 300 es
precision highp float;

// Varyings from vertex shader.
in vec2 v_uv;

// Time uniform (in seconds).
uniform float u_time;

// Output color.
out vec4 fragColor;

// This fragment shader renders a moving band that oscillates horizontally.
// It serves as a starting point for the Pulfrich effect. Additional temporal
// filtering can be implemented in a secondary pass (see examples/temporal_filter.js).

void main() {
  // Create a moving coordinate that oscillates over time.
  float speed = 0.5;
  float x = fract(v_uv.x + speed * u_time);
  // Generate a narrow bright band.
  float band = smoothstep(0.49, 0.5, x) - smoothstep(0.5, 0.51, x);
  // Fade band intensity for a softer look.
  float intensity = band * 0.8;
  // Composite a subtle background gradient.
  vec3 background = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.1, 0.2), v_uv.y);
  vec3 color = background + intensity * vec3(0.8, 0.8, 1.0);
  fragColor = vec4(color, 1.0);
}
