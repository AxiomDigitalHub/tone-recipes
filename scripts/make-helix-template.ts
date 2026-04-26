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

/**
 * STARTER template — verified blocks at neutral settings, structured to
 * match the layout a real player would build on Helix LT:
 *
 *   dsp0:  Volume → Comp → Scream 808 (off) → Amp → Cab
 *   dsp1:  Delay (off) → Dynamic Room → Tilt EQ
 *
 * The chain is 8 blocks total. The generator splits at the cab boundary,
 * leaving 3 free positions on dsp0 (room for noise gate, more drives,
 * a wah) and 5 free positions on dsp1 (room for modulation, additional
 * delays/reverbs, a final volume).
 *
 * The final Tilt EQ is the global "make-it-brighter / make-it-darker"
 * knob — handy when moving between rooms, headphones, or different
 * monitoring rigs.
 */
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
        // Legacy @type: 2 cab — only 5 valid params. Mic / Position /
        // Pan / Angle / Delay belong to the WithPan dual-cab format
        // and are silently dropped by HX Edit on a legacy cab.
        LowCut: 19.9, HighCut: 20100, Distance: 1, Level: 0,
        EarlyReflections: 0,
      },
      notes: "Legacy single-mic cab. For richer dual-mic, swap to a WithPan model + cab0 sibling.",
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
      block_name: "Dynamic Room",
      block_category: "Reverb",
      original_gear: "Studio room",
      settings: {
        Decay: 0.5, PreDelay: 0.01, Mix: 0.30,
        LowCut: 100, HighCut: 10000,
        BassFreq: 100, BassBoost: 0,
        Diffusion: 0.5, ERLevel: 0.8,
        MatrFreq: 0.333, Damping: 3720, Level: 0,
      },
      notes: "VIC_ReverbDynRoom — newer-firmware Dynamic Room with rich modulation. More adaptive than the legacy plate.",
    },
    {
      position: 8,
      block_name: "Tilt",
      block_category: "EQ",
      original_gear: "Tilt EQ (Line 6 original)",
      settings: { Tilt: 0.5, CenterFreq: 1000, Level: 0 },
      notes:
        "Global brightness/darkness knob at the END of the chain. Tilt < 0.5 = darker (cuts highs, boosts lows), Tilt > 0.5 = brighter. CenterFreq sets the pivot. Use this to adapt the preset to different rooms / monitors / headphones without retouching the amp EQ.",
    },
  ],
  notes:
    "Starter template — verified blocks, neutral settings, room to grow. Splits across both DSPs so you can add more blocks without restructuring. Tilt EQ at the end for global brightness/darkness adjustment.",
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
