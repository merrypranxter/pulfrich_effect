# Pulfrich Effect Project Design

This document describes the design goals and architecture for the **Pulfrich Effect** creative coding project. The goal of the simulation is to mimic a fascinating optical illusion in which moving objects appear displaced in depth when viewed by eyes with different light levels. The effect is reproduced by applying temporal filtering to one eye's image while leaving the other eye's image unfiltered.

## Concept

When one eye sees a darker scene than the other, its neural response integrates over a longer time. This delay causes moving objects to be perceived at slightly different positions between the two eyes, giving rise to illusory depth. In this simulation:

* **Left eye** receives the current frame.
* **Right eye** receives a time‑blurred version of the frame using an FBO ping‑pong technique.
* Both images are presented side‑by‑side (or via anaglyph/VR) to demonstrate the apparent depth shift.

This project does **not** include stereo viewing code by default; instead it lays the groundwork for such experiments.

## Goals

* Maintain **60 fps** on mid‑range hardware.
* Keep the code self‑contained and free of heavy frameworks.
* Use **WebGL 2.0** and GLSL for portability.
* Provide **mobile‑friendly** canvas sizing and touch controls (future work).

## File Structure

* `index.html` — Main entry point that sets up the canvas and loads the JavaScript modules.
* `src/js/main.js` — Initializes WebGL, loads shader files, and runs the render loop.
* `src/js/utils.js` — Helper functions to compile shaders and create geometry.
* `src/shaders/vertex.glsl` — Pass‑through vertex shader.
* `src/shaders/fragment.glsl` — Simple fragment shader demonstrating movement.
* `examples/temporal_filter.js` — (See below) Demonstrates ping‑pong FBOs for temporal blur.

## Temporal Filtering

The core of the Pulfrich effect is the temporal blur applied to one eye. In WebGL this can be implemented by rendering the scene into an offscreen framebuffer and then mixing it with the previous frame in a feedback loop. The `examples/temporal_filter.js` script shows how to set up two framebuffers and alternate between them each frame.

## Future Improvements

There are many directions to expand this project:

* **Stereo presentation:** Render two side‑by‑side canvases or use WebXR to deliver separate images to each eye.
* **Adjustable blur:** Allow the user to change the temporal integration time interactively.
* **Complex scenes:** Instead of a simple moving band, render 3D objects or particle systems.
* **Different modalities:** Experiment with color filters, motion trajectories, or multi‑eye setups.

Feel free to iterate and contribute your own examples or enhancements!
