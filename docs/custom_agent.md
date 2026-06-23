---
# Copilot Custom Agent for the pulfrich_effect repository
# https://gh.io/customagents/config

name: pulfrich_effect
description: |
  A creative coding shader project: One eye sees a darker image. Moving objects appear displaced in depth because the dark eye has slower temporal integration. Simulated with temporal filtering: one eye gets a blurred/delayed frame, the other gets the current frame, both viewing a moving scene. A rare but real depth cue.
  Archetype: GPGPU_GRID_SIM
  Batch: E
---

# My Agent

## What this project does

One eye sees a darker image. Moving objects appear displaced in depth because the dark eye has slower temporal integration. Simulated with temporal filtering: one eye gets a blurred/delayed frame, the other gets the current frame, both viewing a moving scene. A rare but real depth cue.

## Tech stack

- WebGL2 (no frameworks)
- Vanilla JS modules
- GLSL shaders (fragment + vertex)
- FBO ping-pong for feedback effects (where applicable)
- Archetype: GPGPU_GRID_SIM

## How to run

Open `index.html` in any modern browser. No build step required.

## Files of note

- `index.html` — entry point
- `src/js/main.js` — renderer loop
- `src/shaders/*.glsl` — GPU programs
- `docs/` — design notes and references

## Design constraints

- 60 fps on mid-range hardware
- Mobile-friendly touch controls where applicable
- Self-contained, no external dependencies
