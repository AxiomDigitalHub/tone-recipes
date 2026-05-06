/**
 * Canonical-params map: which parameters every block of a given
 * (platform, category) should ALWAYS surface — even when the recipe
 * data doesn't set them. Used by the print route so a Helix Cab
 * always shows LowCut / HighCut / Resonance even if the recipe was
 * shipped before those fields were standardized.
 *
 * Keep it boring — the ParamMeta + neutrals already live in
 * `src/lib/parameters/registry.ts`. This file only declares which
 * names are required per block category. Render code calls
 * `getCanonicalParams(platform, category)` and back-fills missing
 * values with `lookupParam(name, category).neutral`.
 *
 * Canonical lists are sourced from `docs/TONE_ENGINEERING_BIBLE.md`
 * § 3-8. When the bible adds a param, add it here AND to the
 * registry's neutral list in the same commit.
 */

import type { Platform } from "@/types/recipe";

type PlatformKey = Platform | "pedalboard";

/** Canonical Helix parameters per block category (Bible § 3). */
const HELIX_CANONICAL: Record<string, string[]> = {
  Compressor: [
    "Threshold",
    "Ratio",
    "Knee",
    "Attack",
    "Release",
    "Mix",
    "Level",
  ],
  Amp: [
    "Drive",
    "Bass",
    "Mid",
    "Treble",
    "Presence",
    "ChVol",
    "Master",
    "Bias",
    "BiasX",
    "Sag",
    "Hum",
    "Ripple",
    // "Cut" intentionally not canonical — it's a Vox-family control,
    // not present on Fender / Marshall / Mesa / Hiwatt models. Vox
    // recipes will include Cut in their settings explicitly; we don't
    // auto-fill it onto every amp.
  ],
  Cab: [
    "Mic",
    "Distance",
    "Position",
    "Angle",
    "LowCut",
    "HighCut",
    "Resonance",
    "Level",
    "Pan",
    "Delay",
  ],
  Reverb: ["Mix", "Decay", "Predelay", "LowCut", "HighCut", "Level"],
  Delay: ["Time", "Feedback", "Mix", "LowCut", "HighCut", "Level"],
  EQ: ["Tilt", "CenterFreq", "Level"],
  Distortion: ["Drive", "Gain", "Tone", "Level"],
  Booster: ["Drive", "Tone", "Boost", "Level"],
  Modulation: ["Rate", "Depth", "Mix", "Level"],
  "Volume/Pan": ["Pedal"],
  Wah: ["Position", "Mix", "Level"],
};

/** Canonical Quad Cortex parameters per block category. */
const QC_CANONICAL: Record<string, string[]> = {
  Amp: ["Gain", "Bass", "Mid", "Treble", "Presence", "Master", "Sag"],
  Cab: ["Mic", "Distance", "Position", "LowCut", "HighCut", "Level"],
  Drive: ["Drive", "Tone", "Level"],
  Compressor: ["Threshold", "Ratio", "Attack", "Release", "Mix", "Level"],
  Reverb: ["Decay", "Predelay", "Mix", "Level"],
  Delay: ["Time", "Feedback", "Mix", "Level"],
  Modulation: ["Rate", "Depth", "Mix"],
  Stomp: ["Drive", "Tone", "Level"],
};

/** Canonical Boss Katana parameters per block category. Order mirrors
 *  the physical Katana front panel left-to-right: AMP TYPE selector,
 *  then GAIN → VOLUME → BASS → MIDDLE → TREBLE → (PRESENCE on Gen 3) →
 *  MASTER. Presence is on Gen 3 only — bring it back when the recipe
 *  data sets it; the enrichment will surface it at neutral if missing. */
const KATANA_CANONICAL: Record<string, string[]> = {
  "Amp Type": [
    "Gain",
    "Volume",
    "Bass",
    "Middle",
    "Treble",
    "Presence",
    "Master",
  ],
  Amp: [
    "Gain",
    "Volume",
    "Bass",
    "Middle",
    "Treble",
    "Presence",
    "Master",
  ],
  Booster: ["Drive", "Bottom", "Tone", "Level"],
  Mod: ["Rate", "Depth", "Level"],
  FX: ["Rate", "Depth", "Level"],
  Delay: ["Time", "Feedback", "EffectLevel"],
  Reverb: ["Time", "PreDelay", "Tone", "EffectLevel"],
};

/** Canonical Fractal parameters. Sparse — Fractal exposes hundreds of
 *  params per block; we only declare the ones that should always appear
 *  for legibility. Recipe-specific params still render. */
const FRACTAL_CANONICAL: Record<string, string[]> = {
  Amp: ["Drive", "Bass", "Mid", "Treble", "Presence", "MV", "Cut"],
  Cab: ["Mic", "Distance", "LowCut", "HighCut", "Level"],
  Drive: ["Drive", "Tone", "Level"],
  Reverb: ["Mix", "Decay", "Predelay"],
  Delay: ["Time", "Feedback", "Mix"],
};

/** Canonical Kemper parameters per block category. Note: the Profile
 *  block carries the captured amp + cab together; we surface the
 *  user-tweakable post-Profile EQ and effects. */
const KEMPER_CANONICAL: Record<string, string[]> = {
  Profile: ["Gain", "Bass", "Middle", "Treble", "Presence"],
  Amp: ["Gain", "Bass", "Middle", "Treble", "Presence"],
  Stomp: ["Sustain", "Tone", "Volume"],
  Drive: ["Drive", "Tone", "Volume"],
  Reverb: ["Decay", "Predelay", "Mix"],
  Delay: ["Time", "Feedback", "Mix"],
};

/** Canonical TONEX parameters. TONEX is capture-driven — the Tone
 *  Model block typically has only a reference, no params. The post
 *  chain (compressor + EQ + reverb + delay) follows traditional
 *  modeling conventions. */
const TONEX_CANONICAL: Record<string, string[]> = {
  "Tone Model": [],
  Amp: ["Gain", "Bass", "Mid", "Treble", "Master"],
  Compressor: ["Threshold", "Ratio", "Attack", "Release", "Mix", "Level"],
  Reverb: ["Mix", "Decay", "Predelay"],
  Delay: ["Time", "Feedback", "Mix"],
};

const BY_PLATFORM: Record<PlatformKey, Record<string, string[]>> = {
  helix: HELIX_CANONICAL,
  quad_cortex: QC_CANONICAL,
  katana: KATANA_CANONICAL,
  fractal: FRACTAL_CANONICAL,
  kemper: KEMPER_CANONICAL,
  tonex: TONEX_CANONICAL,
  pedalboard: {}, // physical rigs render exactly what the recipe says
};

/** Get the canonical parameter list for a (platform, category) pair.
 *  Returns an empty list when the platform or category isn't in our
 *  map — caller should treat that as "render whatever's in the data,
 *  no enrichment." */
export function getCanonicalParams(
  platform: PlatformKey,
  blockCategory: string,
): string[] {
  return BY_PLATFORM[platform]?.[blockCategory] ?? [];
}
