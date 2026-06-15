# Helix distortion-pedal scale migration

Rescales Helix **Distortion** block knobs (Gain/Drive/Tone/Level/etc.) from 0–1 to the Helix-native 0–10 scale. Switches (Bright, Clipping, GainMod) and booleans (Voltage) are left untouched.

- **Blocks rescaled:** 0
- **Knob values changed:** 0
- **Flagged (mixed-scale — NOT edited, review):** 2

## Flagged for manual review (mixed scale — left unchanged)

Some knobs are >1 (0–10) while others are ≤1. The low value may be an intentional 0–10 setting (e.g. a Tube Screamer as a clean boost) or a 0–1 holdover — needs a human ear, so the migration did not touch these.

- **srv-pride-and-joy-rhythm** — Scream 808: `Gain 1, Tone 6, Level 10`
- **hetfield-enter-sandman-tight-rhythm** — Scream 808: `Gain 0.52, Tone 5, Level 8`

## All rescaled blocks

| Recipe | Pedal | Before | After |
|---|---|---|---|
