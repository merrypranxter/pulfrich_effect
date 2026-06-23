# Pulfrich Effect

A creative coding shader project exploring the **Pulfrich effect** — an illusion in which moving objects appear displaced in depth when one eye perceives a darker image than the other. The simulation uses WebGL2 to render a simple moving pattern and demonstrates how temporal filtering produces a delayed image for one eye.

## Running the Demo

1. Clone or download this repository.
2. Open `index.html` in a modern browser (Chrome, Firefox, or Safari). There is no build step; everything runs client‑side.
3. You should see a moving band on a dark background. Explore the scripts in `examples/` for more complex effects such as temporal filtering and color cycling.

## Project Structure

```
.
├── index.html            — Page entry point
├── README.md             — Project overview (this file)
├── src
│   ├── js
│   │   ├── main.js       — Sets up WebGL and runs the base demo
│   │   └── utils.js      — Helper functions for shader compilation and geometry
│   └── shaders
│       ├── vertex.glsl   — Pass‑through vertex shader
│       └── fragment.glsl — Simple fragment shader with a moving band
├── examples
│   ├── README.md         — Description of example scripts
│   ├── simple_draw.js    — Renders a static frame
│   ├── temporal_filter.js— Demonstrates ping‑pong framebuffers
│   ├── color_cycle.js    — Cycles the band color over time
│   └── multi_band.js     — Shows multiple bands
└── docs
    └── design.md         — High‑level design notes
```

## Temporal Filtering

The **Pulfrich effect** arises because the dark eye integrates visual information over a longer time, effectively delaying its perception. In code, we emulate this by blending the current frame with the previous one. The script `examples/temporal_filter.js` sets up two framebuffers and alternates between them each frame to achieve a simple exponential moving average. Adjust the blending factor (`u_alpha`) to control the strength of the delay.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Pull requests are welcome! Feel free to submit additional examples, optimizations, or documentation improvements.
