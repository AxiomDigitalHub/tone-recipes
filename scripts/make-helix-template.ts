/**
 * Generate a clean blank Helix preset template (`.hlx`) that loads
 * cleanly in HX Edit on Helix LT firmware ≥ 3.82.
 *
 * Use cases:
 *  - Starting point for hand-building a preset in HX Edit (load → edit
 *    → save). Saves you the "add Volume Pedal at start, set up snapshots,
 *    configure I/O routing, etc." overhead.
 *  - Baseline for unit-testing the generator (round-trip the template
 *    through HX Edit and confirm it survives unchanged).
 *  - Reference for structural correctness — every required key, every
 *    routing default, every snapshot, every powercab section.
 *
 * Two preset variants:
 *
 *   1. "Empty" — no blocks. Just the structural skeleton (DSP infrastructure,
 *      snapshots, controller/footswitch keys, firmware metadata). Will
 *      open as an empty path on the LT.
 *
 *   2. "Starter" — pre-loaded with the verified-template signal chain:
 *      Volume Pedal → Deluxe Comp → (placeholder amp slot) → Cab →
 *      Delay → Plate Reverb. The amp/cab/delay/reverb default to
 *      sensible factory-preset values. Perfect launchpad for any tone.
 *
 * Usage:
 *   npx tsx scripts/make-helix-template.ts                   # writes empty.hlx
 *   npx tsx scripts/make-helix-template.ts --variant starter # writes starter.hlx
 *   npx tsx scripts/make-helix-template.ts --name "My Preset"
 *
 * Output goes to data/helix-templates/.
 */
import fs from "fs";
import path from "path";
import { generateHelixPreset } from "../src/lib/helix/generate-hlx";
import type { PlatformTranslation } from "../src/types/recipe";

const args = process.argv.slice(2);
const variant = args.includes("--variant") ? args[args.indexOf("--variant") + 1] : "empty";
const customName = args.includes("--name") ? args[args.indexOf("--name") + 1] : null;

const OUT_DIR = path.join(process.cwd(), "data", "helix-templates");
fs.mkdirSync(OUT_DIR, { recursive: true });

/** EMPTY template — no blocks, just structural skeleton. */
const emptyTranslation: PlatformTranslation = {
  chain_blocks: [],
  notes: "Empty Helix template — load and add blocks in HX Edit.",
};

/** STARTER template — full verified-template signal chain at neutral settings. */
const starterTranslation: PlatformTranslation = {
  chain_blocks: [
    {
      position: 1,
      block_name: "Volume Pedal",
      block_category: "Volume/Pan",
      original_gear: "Volume pedal",
      settings: { Pedal: 1.0, VolumeTaper: false },
      notes: "Assigned to EXP 1. Linear taper.",
    },
    {
      position: 2,
      block_name: "Deluxe Comp",
      block_category: "Compressor",
      original_gear: "Studio compressor",
      settings: {
        Threshold: -36, Ratio: 2, Knee: 6,
        Attack: 0.038, Release: 0.20, Mix: 0.74, Level: 0,
      },
      notes: "Canonical 2:1 / -36 dB transparent compression.",
    },
    {
      position: 3,
      block_name: "Scream 808",
      block_category: "Distortion",
      original_gear: "Ibanez TS808",
      enabled: false,
      settings: { Gain: 0.5, Tone: 0.5, Level: 0.65 },
      notes: "Default-off TS808 in the drive slot. Stomp on, dial in.",
    },
    {
      position: 4,
      block_name: "US Deluxe Nrm",
      block_category: "Amp",
      original_gear: "Fender Deluxe Reverb (normal channel)",
      settings: {
        Drive: 0.5, Bass: 0.5, Mid: 0.5, Treble: 0.5, Presence: 0.5,
        ChVol: 0.7, Master: 1.0,
        Bias: 0.5, Sag: 0.5, Hum: 0.5, Ripple: 0.5, BiasX: 0.5,
      },
      notes: "Neutral Fender Deluxe — known-good amp model with full internals.",
    },
    {
      position: 5,
      block_name: "1x12 US Deluxe",
      block_category: "Cab",
      original_gear: "Fender Deluxe 1x12",
      settings: {
        Mic: 5, Position: 0.49, Distance: 1, Angle: 0, Pan: 0.5,
        LowCut: 19.9, HighCut: 20100, Level: 0, Delay: 0,
      },
      notes: "Single ribbon mic at near-center. Full-range cuts.",
    },
    {
      position: 6,
      block_name: "Simple Delay",
      block_category: "Delay",
      original_gear: "Digital delay",
      enabled: false,
      settings: { Time: 0.4, Feedback: 0.30, Mix: 0.25 },
      notes: "Default-off digital delay. Stomp on for repeats.",
    },
    {
      position: 7,
      block_name: "Plate",
      block_category: "Reverb",
      original_gear: "Studio plate",
      settings: { Decay: 0.5, Predelay: 0.05, Mix: 0.20, LowCut: 100, HighCut: 8000 },
      notes: "Subtle plate reverb. Mix=0.20 keeps the dry note in front.",
    },
  ],
  notes:
    "Starter template — verified blocks, neutral settings. Replace blocks one at a time in HX Edit to dial in your tone, or use this as the baseline for a tone-recipe rewrite.",
};

const translation = variant === "starter" ? starterTranslation : emptyTranslation;
const presetName = customName ?? (variant === "starter" ? "Helix Starter Template" : "Helix Empty Template");

const output = generateHelixPreset(translation, presetName);

const filename = `${variant}.hlx`;
const outPath = path.join(OUT_DIR, filename);
fs.writeFileSync(outPath, output);

console.log(`Wrote ${outPath} (${output.length} bytes)`);
console.log(`Variant: ${variant}`);
console.log(`Blocks: ${translation.chain_blocks.length}`);
console.log(`Preset name: ${presetName}`);
console.log();
console.log("Import in HX Edit: File → Import Preset → select this file");
console.log("Or copy to USER setlist on the Helix LT.");
