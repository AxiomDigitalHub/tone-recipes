# Helix Factory Preset Corpus

Harvested from 256 Line 6 Helix factory presets via `scripts/harvest-helix-factory.ts`. This is the ground-truth dataset the recipe generator and QC agent reference for verified model IDs, param shapes, and routing patterns — so we never have to guess again.

## Files

| File | What it contains |
|---|---|
| `models.json` | Every block model ID seen in the corpus (331 unique). For each model: usage count, observed `@type` values, observed param keys with type info, value ranges, and example filenames. This is the canonical "what params does X support" table. |
| `presets.json` | Per-preset summary: filename, decoded title/song guess, firmware metadata, block count per DSP, routing topology, ordered model list. Lets us answer "which factory preset uses block X" in one query. |
| `routing.json` | Frequency table of every routing topology seen (80 unique). Format: `dsp0Out=<n>|dsp1In=<n>|dsp1Out=<n>|dsp0=<n>b|dsp1=<n>b`. The most common topologies are the canonical layouts the generator should mimic. |
| `filename-guesses.json` | Per-filename → guessed song / artist / amp / category. Pattern-matched against known songs (`$$$ For Nothin'` → Money for Nothing) and amp model names. |

## Re-running the harvest

```bash
npx tsx scripts/harvest-helix-factory.ts
# OR with a custom folder:
npx tsx scripts/harvest-helix-factory.ts /path/to/.hlx/folder
```

Drop new factory `.hlx` files into `~/Downloads/Helix Presets/` (or any folder you point the script at) and re-run. The output will replace the JSON files in this directory.

## Top findings

### Topology distribution

| Topology | Count | Description |
|---|---|---|
| `dsp0=8b dsp1=0b, single-DSP` | 42 | Most common — 8 effect blocks on dsp0 alone, dsp1 is passthrough |
| `dsp0=9b dsp1=0b, single-DSP` | 34 | 8 effect blocks + 1 cab-sibling (`cab0`) all on dsp0 |
| `dsp0=7b dsp1=0b, single-DSP` | 24 | Slim chain on one DSP |
| `dsp0=0b dsp1=0b` | 24 | Empty / looper-only template presets |
| `dsp0=9b dsp1=1b, split-DSP` | 8 | Two-DSP chain, `dsp0Out=2 → dsp1In=0 → dsp1Out=1 (Multi)` |

**Implication:** Single-DSP linear is the dominant pattern; chains > 7 effect blocks more often use a `cab0` sibling on dsp0 than they split across DSPs.

### `@type` values

- `@type: 0` — stomp class (compressors, distortion, fuzz, EQ, wah, volume/pan, gate, pitch)
- `@type: 1` — amp
- `@type: 2` — legacy single-mic cab
- `@type: 3` — preamp
- `@type: 4` — newer-firmware cab (used by both `*WithPan` and some non-WithPan models)
- `@type: 6` — looper
- `@type: 7` — time-based effects (delay, reverb, modulation)

Several cab models appear with **both** `@type: 2` AND `@type: 4` across different presets — context-dependent. Models with `WithPan` in the name only ever appear as `@type: 4`.

### Cab block format reference

A cab can appear in two forms:

1. **Standalone in-chain cab** (`@type: 2`): a regular block at a `@position` in the chain.
2. **Amp-attached cab** (`@type: 4` typically): the cab lives in a separate top-level `cab0` (or `cab1`) object on the same DSP, and the amp block contains a `@cab: "cab0"` reference linking to it. The dual-mic `WithPan` format always uses this shape.

### Firmware metadata observed

Most presets in the corpus emit `appversion: 58851328`, `build_sha: "7d01f5e"` — matching the Helix LT firmware the user is currently on. A small minority emit older firmware values; HX Edit upgrades these on import.

### Verified model IDs (top 30 by frequency)

See `models.json` for the full 331-entry list. Highlights:

- **Volume Pedal** → `HD2_VolPanVol` (×193)
- **Looper** → `HD2_Looper` (×93)
- **LA Studio Comp** → `HD2_CompressorLAStudioComp` (×55)
- **Simple Delay** → `HD2_DelaySimpleDelay` (×52)
- **Scream 808** → `HD2_DistScream808` (×41)
- **Deluxe Comp** → `HD2_CompressorDeluxeComp` (×37)
- **Transistor Tape** → `HD2_DelayTransistorTape` (×36)
- **JC-120 (Roland)** → `HD2_AmpJazzRivet120` (×20)
- **DynAmbience** → `VIC_ReverbDynAmbience` (×23)
- **DynPlate** → `VIC_DynPlate` (×8)
- … and 321 more.

## How the rest of the system uses this

- `src/lib/helix/model-map.ts` — every entry in `HELIX_MODEL_MAP` should be sourced from `models.json` here. When adding a new block to a recipe, look up the model ID + observed param keys here first; never invent.
- `src/lib/helix/generate-hlx.ts` — the routing and topology choices the generator makes should match a topology that appears in `routing.json`. If a new topology is needed, capture a real factory preset that uses it before shipping.
- `.claude/agents/helix-preset-qc.md` — the QC agent's "verified model IDs" table is generated from the most-common entries in `models.json`. Lessons learned about format / topology come from observing patterns in `presets.json` and `routing.json`.
