/**
 * Parameter metadata registry — single source of truth for how any named
 * setting should be rendered and what its "neutral" / default value is.
 *
 * Used by:
 *   1. <SettingDisplay>  → decides knob vs fader vs plain text, picks the
 *                          range, and draws the neutral marker.
 *   2. (future) .hlx / .tsl preset generators → fills in every parameter a
 *                          block expects, using the recipe's value if set or
 *                          the registry neutral if not. Guarantees the
 *                          exported preset is fully dialed in instead of
 *                          relying on whatever default the hardware happens
 *                          to use for missing fields.
 *   3. Future docs / tooltips → `description` explains the parameter in one
 *                          sentence for the reader.
 *
 * Why a TS config instead of a database:
 *   - ~80 parameter names in active use, changing rarely.
 *   - Version-controlled alongside the code that consumes it.
 *   - No network round-trip; ships as part of the bundle.
 *   - Compile-time checking catches typos that a DB wouldn't.
 *   Migrating to a DB later if a non-engineer needs an admin UI is a 1-day
 *   port, not a lock-in.
 *
 * Adding a parameter:
 *   1. Add an entry to PARAM_REGISTRY below.
 *   2. If the parameter's meaning differs by block category (e.g. Level on a
 *      compressor vs Level on a delay), scope the override via BLOCK_OVERRIDES.
 *   3. Run the preview at /dev/knobs to confirm the visual.
 */

export type ParamKind = "knob" | "fader" | "switch" | "text";

export interface ParamMeta {
  /** How to render this parameter. */
  kind: ParamKind;
  /** Minimum control value. Ignored for "text". */
  min: number;
  /** Maximum control value. Ignored for "text". */
  max: number;
  /** Neutral / default position. Where the control has no audible effect
   *  (EQ flat, drive at 0) or sits at its factory starting point.
   *  Rendered as a marker on the knob body so readers can instantly tell
   *  whether the recipe pushes the control or leaves it neutral. Also
   *  serves as the fallback value when a recipe doesn't specify the param
   *  and the preset generator needs something to write. */
  neutral: number;
  /** Optional suffix rendered after the value, e.g. "dB", "Hz", "ms". */
  unit?: string;
  /** One-sentence explainer for tooltips / editor / generated docs. */
  description?: string;
}

/* -------------------------------------------------------------------------- */
/*  Registry                                                                   */
/* -------------------------------------------------------------------------- */

/** Flat registry — keyed by the parameter name as it appears in recipe data.
 *  Case-sensitive lookup; alias spellings get separate entries. */
export const PARAM_REGISTRY: Record<string, ParamMeta> = {
  /* ── EQ controls — neutral = center = flat response ── */
  Bass: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Low-frequency shelf. 5 = flat." },
  Middle: { kind: "knob", min: 0, max: 10, neutral: 5 },
  Mid: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Midrange band. 5 = flat." },
  Treble: { kind: "knob", min: 0, max: 10, neutral: 5, description: "High-frequency shelf. 5 = flat." },
  Presence: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Upper-mid / high clarity after the power stage." },
  Low: { kind: "knob", min: 0, max: 10, neutral: 5 },
  High: { kind: "knob", min: 0, max: 10, neutral: 5 },
  Tone: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Pedal tone filter. 5 = flat." },
  Cut: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Vox-style cut. Higher value cuts more treble." },
  Resonance: { kind: "knob", min: 0, max: 10, neutral: 5 },

  /* ── Gain / drive — neutral = 0 (no drive added) ── */
  Gain: { kind: "knob", min: 0, max: 10, neutral: 0, description: "Preamp drive. 0 = clean reference." },
  Drive: { kind: "knob", min: 0, max: 10, neutral: 0 },
  "Pre Gain": { kind: "knob", min: 0, max: 10, neutral: 0 },
  "Lead Drive": { kind: "knob", min: 0, max: 10, neutral: 0 },
  "Lead Gain": { kind: "knob", min: 0, max: 10, neutral: 0 },
  Sustain: { kind: "knob", min: 0, max: 10, neutral: 0, description: "Compressor-style sustain / feedback. 0 = off." },
  Fuzz: { kind: "knob", min: 0, max: 10, neutral: 0 },
  Dist: { kind: "knob", min: 0, max: 10, neutral: 0 },
  Distortion: { kind: "knob", min: 0, max: 10, neutral: 0 },
  Boost: { kind: "knob", min: 0, max: 10, neutral: 0 },

  /* ── Volume / level — neutral = 5 (unity-ish on a 0-10 scale) ── */
  Volume: { kind: "knob", min: 0, max: 10, neutral: 5 },
  Master: { kind: "knob", min: 0, max: 10, neutral: 5 },
  "Ch Vol": { kind: "knob", min: 0, max: 10, neutral: 5, description: "Channel volume (Helix amp models)." },
  MV: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Master Volume." },
  Level: { kind: "knob", min: 0, max: 10, neutral: 5 },
  Output: { kind: "knob", min: 0, max: 10, neutral: 5 },
  Post: { kind: "knob", min: 0, max: 10, neutral: 5, description: "Post gain / master (Peavey-style)." },

  /* ── Amp tube internals (Helix 0–1 controls) — neutral = 0.5 (factory) ── */
  Sag: { kind: "knob", min: 0, max: 1, neutral: 0.5, description: "Power-section compression / sag under load." },
  Bias: { kind: "knob", min: 0, max: 1, neutral: 0.5 },
  BiasX: { kind: "knob", min: 0, max: 1, neutral: 0.5 },
  Ripple: { kind: "knob", min: 0, max: 1, neutral: 0.5, description: "Power-supply ripple simulation." },
  Hum: { kind: "knob", min: 0, max: 1, neutral: 0.5 },

  /* ── Compressor ── */
  Threshold: { kind: "fader", min: -60, max: 0, neutral: 0, unit: "dB", description: "Level above which compression kicks in. 0 = no compression." },
  Ratio: { kind: "knob", min: 1, max: 20, neutral: 1, unit: ":1", description: "1:1 = no compression." },
  Knee: { kind: "knob", min: 0, max: 12, neutral: 0, unit: "dB", description: "Soft-knee transition width." },
  Attack: { kind: "knob", min: 0, max: 1, neutral: 0, unit: "s" },
  Release: { kind: "knob", min: 0, max: 1, neutral: 0.3, unit: "s" },
  Mix: { kind: "knob", min: 0, max: 1, neutral: 1, description: "Wet/dry mix. 1 = fully wet." },
  "Peak Reduction": { kind: "knob", min: 0, max: 10, neutral: 0 },

  /* ── Delay ── */
  Time: { kind: "fader", min: 0, max: 2000, neutral: 400, unit: "ms" },
  "Delay 1": { kind: "fader", min: 0, max: 2000, neutral: 400, unit: "ms" },
  "Delay 2": { kind: "fader", min: 0, max: 2000, neutral: 400, unit: "ms" },
  "Delay Time": { kind: "fader", min: 0, max: 2000, neutral: 400, unit: "ms" },
  Feedback: { kind: "knob", min: 0, max: 1, neutral: 0.3, description: "Echo repeats. 0 = single repeat." },
  "Feedback 1": { kind: "knob", min: 0, max: 1, neutral: 0.3 },
  "Feedback 2": { kind: "knob", min: 0, max: 1, neutral: 0.3 },
  TempoSync1: { kind: "switch", min: 0, max: 1, neutral: 0 },

  /* ── Reverb ── */
  Decay: { kind: "knob", min: 0, max: 10, neutral: 3, unit: "s", description: "Reverb tail length." },
  "Pre Delay": { kind: "fader", min: 0, max: 500, neutral: 20, unit: "ms" },
  EarlyReflections: { kind: "knob", min: 0, max: 1, neutral: 0.5 },
  Reverb: { kind: "knob", min: 0, max: 10, neutral: 2 },

  /* ── EQ blocks / cab filters — frequency sweeps ── */
  LowCut: { kind: "fader", min: 20, max: 500, neutral: 20, unit: "Hz", description: "High-pass filter. 20 = off." },
  HighCut: { kind: "fader", min: 2000, max: 20000, neutral: 20000, unit: "Hz", description: "Low-pass filter. 20000 = off." },
  "Low Freq": { kind: "fader", min: 20, max: 500, neutral: 100, unit: "Hz" },
  "Mid Freq": { kind: "fader", min: 200, max: 5000, neutral: 800, unit: "Hz" },
  "High Freq": { kind: "fader", min: 2000, max: 20000, neutral: 8000, unit: "Hz" },

  /* ── Katana 5-band EQ centers (gain in dB at each band) ── */
  "80Hz": { kind: "fader", min: -12, max: 12, neutral: 0, unit: "dB" },
  "240Hz": { kind: "fader", min: -12, max: 12, neutral: 0, unit: "dB" },
  "750Hz": { kind: "fader", min: -12, max: 12, neutral: 0, unit: "dB" },
  "2200Hz": { kind: "fader", min: -12, max: 12, neutral: 0, unit: "dB" },
  "6600Hz": { kind: "fader", min: -12, max: 12, neutral: 0, unit: "dB" },

  /* ── Modulation (chorus / phaser / flanger / tremolo) ── */
  Depth: { kind: "knob", min: 0, max: 1, neutral: 0, description: "Modulation depth. 0 = off." },
  Rate: { kind: "knob", min: 0, max: 10, neutral: 3, unit: "Hz" },
  Speed: { kind: "knob", min: 0, max: 10, neutral: 3, unit: "Hz" },
  Intensity: { kind: "knob", min: 0, max: 10, neutral: 0 },

  /* ── Cab / mic — mostly text/choice params ── */
  Distance: { kind: "text", min: 0, max: 0, neutral: 0, description: "Mic distance from the cab." },
  Angle: { kind: "text", min: 0, max: 0, neutral: 0, description: "Mic angle off-axis." },
  Mic: { kind: "text", min: 0, max: 0, neutral: 0 },
  MicA: { kind: "text", min: 0, max: 0, neutral: 0 },
  MicB: { kind: "text", min: 0, max: 0, neutral: 0 },
  PositionA: { kind: "text", min: 0, max: 0, neutral: 0 },
  PositionB: { kind: "text", min: 0, max: 0, neutral: 0 },

  /* ── Volume / Pedal / Pitch ── */
  "Pedal Position": { kind: "text", min: 0, max: 0, neutral: 0 },
  "Volume Max": { kind: "knob", min: 0, max: 10, neutral: 10 },
  "Volume Min": { kind: "knob", min: 0, max: 10, neutral: 0 },
  Position: { kind: "text", min: 0, max: 0, neutral: 0 },
  Mode: { kind: "text", min: 0, max: 0, neutral: 0 },
  "Pitch Range": { kind: "text", min: 0, max: 0, neutral: 0 },
  Pitch: { kind: "knob", min: -24, max: 24, neutral: 0, unit: "st", description: "Pitch shift in semitones. 0 = no shift." },
};

/* -------------------------------------------------------------------------- */
/*  Block-category overrides                                                   */
/* -------------------------------------------------------------------------- */

/** When a parameter name means something different inside a specific block
 *  category, the override here takes precedence over the base registry entry.
 *
 *  Example: "Level" on a Compressor is a make-up gain (typically 0–10 with
 *  neutral at 5) while "Level" on a Distortion pedal is still 0–10 but sits
 *  more comfortably at a lower neutral. Where the meaning is truly distinct,
 *  carve out an override; otherwise leave it to the base entry. */
export const BLOCK_OVERRIDES: Record<string, Record<string, Partial<ParamMeta>>> = {
  // On an amp-model compressor like Helix "Deluxe Comp" the Level control is
  // make-up gain — a bipolar dB trim centered at 0. The knob should show a
  // center-detent marker and format the value as "+3 dB" / "-6 dB".
  Compressor: {
    Level: { min: -12, max: 12, neutral: 0, unit: "dB" },
  },

  // Cab block "Level" is the cab output trim — bipolar dB, defaults to 0.
  // Helix range runs roughly -60 dB to +12 dB; widened to match.
  Cab: {
    Level: { min: -60, max: 12, neutral: 0, unit: "dB" },
  },

  // Booster / Distortion / Drive pedals: Level is a 0–10 unity-ish output
  // gain. Neutral at 5 already matches the base, left explicit for clarity.
  Booster: {
    Level: { min: 0, max: 10, neutral: 5 },
  },
  Distortion: {
    Level: { min: 0, max: 10, neutral: 5 },
  },
  Drive: {
    Level: { min: 0, max: 10, neutral: 5 },
  },

  Modulation: {
    // Modulation depth as 0–10 instead of 0–1 in some blocks.
    Depth: { max: 10, neutral: 0 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Lookup                                                                     */
/* -------------------------------------------------------------------------- */

/** Get the effective metadata for a parameter inside a given block category.
 *  Returns undefined if the parameter is unknown — callers should fall back
 *  to plain numeric display in that case. */
export function lookupParam(
  name: string,
  blockCategory?: string,
): ParamMeta | undefined {
  const base = PARAM_REGISTRY[name];
  if (!base) return undefined;

  if (blockCategory) {
    const override = BLOCK_OVERRIDES[blockCategory]?.[name];
    if (override) {
      return { ...base, ...override };
    }
  }
  return base;
}
