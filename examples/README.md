# Examples

This folder contains small, self‑contained scripts that explore different aspects of the Pulfrich effect project. Each example can be imported into your own projects or run directly by replacing `src/js/main.js` in `index.html` with the example file. These scripts assume the presence of helper functions in `src/js/utils.js` and the vertex shader in `src/shaders/vertex.glsl`.

## Files

| File                   | Description                                               |
|------------------------|-----------------------------------------------------------|
| `simple_draw.js`       | Draws a static gradient using the provided shaders.       |
| `temporal_filter.js`   | Demonstrates ping‑pong framebuffers for temporal blur.    |
| `color_cycle.js`       | Cycles the color of the moving band over time.            |
| `multi_band.js`        | Shows multiple moving bands with varying speeds.          |
| `wave_distortion.js`   | Applies a sinusoidal distortion to the moving band.       |

To use an example, open `index.html` in your browser and change the script tag to load the desired example. For example:

```html
<!-- Replace main.js with color_cycle.js -->
<script type="module" src="examples/color_cycle.js"></script>
```

These examples are intentionally concise and educational. Feel free to experiment and modify them to deepen your understanding of WebGL.
