/**
 * Mapping from human-readable Helix block names (as used in our seed data)
 * to internal Helix model IDs (HD2_<Category><ModelName> format).
 *
 * These IDs are used in .hlx preset files to identify specific amp models,
 * effects, cabs, etc.
 */
export const HELIX_MODEL_MAP: Record<string, string> = {
  // ── Amps ──────────────────────────────────────────────────────────────
  "US Double Nrm": "HD2_AmpUSDoubleNrm",
  "US Deluxe Vib": "HD2_AmpUSDeluxeVib",
  "US Deluxe Nrm": "HD2_AmpUSDeluxeNrm",
  "US Small Tweed": "HD2_AmpTweedBluesBrt",
  "Brit Plexi Brt": "HD2_AmpBritPlexiBrt",
  "Brit Plexi Nrm": "HD2_AmpBritPlexiNrm",
  "Brit 2204": "HD2_AmpBrit2204",
  "Brit J45 Nrm": "HD2_AmpBritJ45Nrm",
  "Brit J-800": "HD2_AmpBrit2204",
  "Essex A30": "HD2_AmpEssexA30",
  "A30 Fawn Brt": "HD2_AmpA30FawnBrt",
  "A30 Fawn Nrm": "HD2_AmpA30FawnNrm",
  "Derailed Ingrid": "HD2_AmpDerailedIngrid",
  "Cali Rectifire": "HD2_AmpCaliRectifire",
  "Cali Texas Ch1": "HD2_AmpCaliTexasCh1",
  "PV Panama": "HD2_AmpPVPanama",
  "Mesa .22": "HD2_AmpCaliIVR1",
  "Vibro Verb": "HD2_AmpUSDeluxeVib", // Vibro Verb mapped to closest Fender model
  "Laney Supergroup": "HD2_AmpBritJ45Brt", // Laney Supergroup approximation

  // ── Legacy Cabs (kept for backward compatibility with unmapped names) ──
  "2x12 Mail C12Q": "HD2_Cab2x12MailC12Q",
  "2x12 US Deluxe": "HD2_Cab2x12DoubleC12N",
  "2x12 Two Rock": "HD2_Cab2x12SilverBell",
  "2x10 US Deluxe": "HD2_Cab1x12USDeluxe",
  "2x10 Fender": "HD2_Cab2x12DoubleC12N",
  "1x15 Ampeg": "HD2_Cab2x15Brute",
  "1x8 Small Tweed": "HD2_Cab1x10PrincessCopperhead",
  "1x8 Champ": "HD2_Cab1x10PrincessCopperhead",
  "4x10 Tweed": "HD2_Cab4x10TweedP10R",
  "4x10 Bassman": "HD2_Cab4x10TweedP10R",

  // ── Distortion / Drive ────────────────────────────────────────────────
  "Scream 808": "HD2_DistScream808",
  "Minotaur": "HD2_DistMinotaur",
  "Arbitrator Fuzz": "HD2_DistArbitratorFuzz",
  "Triangle Fuzz": "HD2_DistTriangleFuzz",
  "Deez One Vintage": "HD2_DistDeezOneVintage",
  "Muff Fuzz": "HD2_DistRamsHead",
  "Kinky Boost": "HD2_DistKinkyBoost",
  "Distortion+": "HD2_DistStuporOD",
  "Deluxe Comp": "HD2_CompressorDeluxeComp",
  // ── Verified from real HX Edit exports ───────────────────────────────
  // Captured from a user export 2026-04-26. Block-specific param shapes:
  // - Volume Pedal: { Pedal: 0-1, VolumeTaper: boolean }
  // - Heir Apparent: { Gain, Tone, Level, Presence, Clipping: int,
  //   GainMod: int, Voltage: boolean }
  "Volume Pedal": "HD2_VolPanVol",
  "Heir Apparent": "HD2_DistHeirApparent",

  // ── Modulation ────────────────────────────────────────────────────────
  "70s Chorus": "HD2_Chorus70sChorus",
  "Script Mod Phase": "HD2_PhaserScriptModPhase",
  "Elephant Man": "HD2_DelayElephantMan",
  "Optical Trem": "HD2_TremoloOpticalTrem",

  // ── Delay ─────────────────────────────────────────────────────────────
  "Simple Delay": "HD2_DelaySimpleDelay",
  "Transistor Tape": "HD2_DelayTransistorTape",
  "Digital Delay": "HD2_DelayVintageDigitalV2",

  // ── Reverb ────────────────────────────────────────────────────────────
  "Plate Reverb": "HD2_ReverbPlate",

  // ── Wah ───────────────────────────────────────────────────────────────
  "Chrome": "HD2_WahChrome",

  // ── Pitch ─────────────────────────────────────────────────────────────
  "Pitch Wham": "HD2_PitchPitchWham",

  // ── Additional Amps (used in recipe translations) ─────────────────────
  "Soup Pro": "HD2_AmpSoupPro",
  "WhoWatt 100": "HD2_AmpWhoWatt100",
  "Tweed Blues Nrm": "HD2_AmpTweedBluesNrm",
  "US DLX 64": "HD2_AmpUSDeluxeVib",
  "Essex A30 TB": "HD2_AmpA30FawnBrt",
  "Brit 2203": "HD2_AmpBrit2203",
  "Cali 2C+ Lead": "HD2_AmpCaliIVLead",
  "Cali IV Lead": "HD2_AmpCaliIVLead",
  "Cali Texas Ch2": "HD2_AmpCaliTexasCh1",
  "Das Benzin Lead": "HD2_AmpDasBenzinMega",
  "Ampeg SVT Nrm": "HD2_AmpSVBeastNrm",
  "Deranged Master": "HD2_DistDerangedMaster",
  "Cartographer": "HD2_AmpCartographer",

  // ── Cabs (Legacy format: HD2_Cab) ──────────────────────────────────────
  "1x6 Soup Pro": "HD2_Cab1x6x9SoupProEllipse",
  "1x12 Field Coil": "HD2_Cab1x12FieldCoil",
  "1x12 Blue Bell": "HD2_Cab1x12BlueBell",
  "1x12 US Deluxe": "HD2_Cab1x12USDeluxe",
  "1x12 Cali EXT": "HD2_Cab1x12Lead80",
  "1x12 Mesa": "HD2_Cab1x12Lead80",
  "1x15 Ampeg B-15": "HD2_Cab2x15Brute",
  "1x15 Vibroverb": "HD2_Cab2x12DoubleC12N",
  "2x12 Blue Bell": "HD2_Cab2x12BlueBell",
  "2x12 Double C12N": "HD2_Cab2x12DoubleC12N",
  "2x12 Twin": "HD2_Cab2x12DoubleC12N",
  "4x10 Tweed P10R": "HD2_Cab4x10TweedP10R",
  "4x12 Greenback 25": "HD2_Cab4x12Greenback25",
  "4x12 XXL V30": "HD2_Cab4x12UberV30",
  "4x12 Uber V30": "HD2_Cab4x12UberV30",
  "4x12 Uber": "HD2_Cab4x12UberV30",
  "4x12 Greenback25": "HD2_Cab4x12Greenback25",
  "4x12 Green 25": "HD2_Cab4x12Greenback25",
  "4x12 Green": "HD2_Cab4x12Greenback25",
  "4x12 Cali V30": "HD2_Cab4X12CaliV30",
  "4x12 V30": "HD2_Cab4X12CaliV30",
  "4x12 1960 T75": "HD2_Cab4x121960T75",
  "4x12 WhoWatt": "HD2_Cab4x12WhoWatt100",
  "8x10 SVT": "HD2_Cab8x10SVBeast",

  // ── Additional Drive/Comp ────────────────────────────────────────────
  "Compulsive Drv": "HD2_DistCompulsiveDrive",
  "Vermin Dist": "HD2_DistVerminDist",
  "LA Studio Comp": "HD2_CompressorLAStudioComp",

  // ── Additional Modulation ────────────────────────────────────────────
  "PlastiChorus": "HD2_ChorusPlastiChorus",
  "Chorus CE-1": "HD2_Chorus70sChorus",
  "Searchlights": "HD2_ReverbSearchlights",

  // ── Additional Delay ─────────────────────────────────────────────────
  "Cosmos Echo": "HD2_DelayCosmosEcho",

  // ── Additional Reverb ────────────────────────────────────────────────
  "Glitz": "HD2_ReverbGlitz",
  "Plate": "HD2_ReverbPlate",
  "Spring": "HD2_ReverbSpring",

  // ── Additional Wah ───────────────────────────────────────────────────
  "Teardrop 310": "HD2_WahTeardrop310",

  // ── EQ ────────────────────────────────────────────────────────────────
  "Parametric": "HD2_EQParametric",
  "Parametric EQ": "HD2_EQParametric",
  "Graphic EQ": "HD2_EQGraphic10Band",

  // ── Non-Helix platform block names (from other platforms in the data)
  // These appear in quad_cortex / fractal / katana / kemper translations
  // but we map them here as best-effort for any cross-reference usage.

  // Quad Cortex / Fractal / Katana / Kemper amp names
  "1959 SLP": "HD2_AmpBritPlexiBrt",
  "JCM800": "HD2_AmpBrit2204",
  "JTM45": "HD2_AmpBritJ45Nrm",
  "Marshall Major": "HD2_AmpBritPlexiBrt",
  "Twin Reverb": "HD2_AmpUSDoubleNrm",
  "Bassman": "HD2_AmpUSDeluxeNrm",
  "AC30 TB": "HD2_AmpEssexA30",
  "Two Rock": "HD2_AmpDerailedIngrid",
  "Champ": "HD2_AmpTweedBluesBrt",
  "Silvertone": "HD2_AmpTweedBluesBrt",
  "Hiwatt DR103": "HD2_AmpBritPlexiBrt",
  "Mesa Mark IIC+": "HD2_AmpCaliRectifire",
  "Mesa Mark I": "HD2_AmpCaliTexasCh1",
  "Randall Century": "HD2_AmpPVPanama",

  // Quad Cortex / Fractal / Katana drive/effect names
  "TS808 OD": "HD2_DistScream808",
  "TS808": "HD2_DistScream808",
  "Blues Driver": "HD2_DistMinotaur",
  "DS-1": "HD2_DistDeezOneVintage",
  "Fuzz Face": "HD2_DistArbitratorFuzz",
  "Small Clone": "HD2_Chorus70sChorus",
  "Rangemaster": "HD2_DistKinkyBoost",
  "Treble Boost": "HD2_DistKinkyBoost",
  "Mid Boost": "HD2_DistKinkyBoost",

  // Quad Cortex / Fractal / Katana wah names
  "Wah": "HD2_WahChrome",
  "Pedal Wah": "HD2_WahChrome",

  // Quad Cortex / Fractal / Katana delay names
  "Tape Delay": "HD2_DelayTransistorTape",
  "Tape Echo": "HD2_DelayTransistorTape",
  "Analog Delay": "HD2_DelaySimpleDelay",

  // Quad Cortex / Fractal / Katana mod names
  "CE-1": "HD2_Chorus70sChorus",
  "CE-1 Chorus": "HD2_Chorus70sChorus",
  "Chorus (CE-1)": "HD2_Chorus70sChorus",
  "Phase 90": "HD2_PhaserScriptModPhase",
  "Phaser": "HD2_PhaserScriptModPhase",

  // Quad Cortex / Fractal / Katana tremolo names
  "Tremolo": "HD2_TremoloOpticalTrem",

  // Quad Cortex / Fractal / Katana reverb names
  "Spring Reverb": "HD2_ReverbSpring",

  // Quad Cortex / Fractal / Katana pitch names
  "Whammy": "HD2_PitchPitchWham",
  "Pitch Shifter": "HD2_PitchPitchWham",

};

/**
 * Resolve a block name to its Helix model ID, or null if unverified.
 *
 * Rule: every model ID in HELIX_MODEL_MAP must come from a real Helix
 * preset file (HX Edit export). Speculating model IDs based on naming
 * patterns is not allowed — HX Edit rejects unknown IDs at load time
 * and the entire preset becomes unloadable. If a block isn't in the
 * map, the generator skips it (preserves loadability) rather than
 * falling back to a wrong-model ID.
 *
 * To add support for a new block: capture a real Helix preset that
 * uses it, copy the @model verbatim into HELIX_MODEL_MAP.
 */
export function resolveModelId(blockName: string): string | null {
  return HELIX_MODEL_MAP[blockName] ?? null;
}

/**
 * Determine a Helix block category prefix from a block_category string.
 * Used when constructing a best-guess model ID for unmapped blocks.
 */
export function categoryToPrefix(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("amp")) return "Amp";
  if (lower.includes("cab")) return "Cab";
  if (lower.includes("dist") || lower.includes("drive") || lower.includes("boost") || lower.includes("stomp")) return "Dist";
  if (lower.includes("delay")) return "Delay";
  if (lower.includes("reverb")) return "Reverb";
  if (lower.includes("mod") || lower.includes("chorus") || lower.includes("flang") || lower.includes("phas")) return "Mod";
  if (lower.includes("wah")) return "Wah";
  if (lower.includes("pitch")) return "Pitch";
  if (lower.includes("eq")) return "EQ";
  if (lower.includes("comp") || lower.includes("dyn")) return "Comp";
  if (lower.includes("trem")) return "Trem";
  return "Dist";
}

/**
 * Parameters whose values are stored in real units (Hz, dB, seconds,
 * integer indices, ratio numbers) in the .hlx format and pass through
 * VERBATIM. Lookup is case-insensitive on the trimmed input name.
 *
 * Verified against scripts/reference-preset-with-blocks.hlx, where
 * e.g. `Threshold: -37.099`, `Knee: 6`, `Ratio: 3`, `LowCut: 19.899`,
 * `HighCut: 16000`, `Mic: 2`, `Distance: 1`, `SyncSelect1: 6`.
 */
const RAW_UNIT_PARAMS = new Set([
  // Frequency cuts (Hz)
  "lowcut", "highcut",
  // Compressor real-unit params
  "ratio", "knee",
  // Discrete mic indices (single-mic format only — MicA/MicB are deprecated)
  "mic",
  // Cab placement
  "distance", "delay",
  // Discrete model selectors
  "headcaseselect", "syncselect", "syncselect1", "syncselect2",
  "mode", "speaker", "type", "clipping", "gainmod",
  // Tempo / BPM
  "tempo", "bpm",
]);

/**
 * Params that can be negative (signed dB). Pass through as-is.
 */
const SIGNED_DB_PARAMS = new Set([
  "threshold", "level", "gain",
]);

/**
 * Params that older recipes encode on a 0-100 percent scale (Feedback: 35
 * meaning 35%, Mix: 30 meaning 30%, etc.). Pro-template recipes use 0-1
 * floats here. The scaler below handles both: 0-1 inputs pass through,
 * (1, 100] inputs are divided by 100, > 100 clamps.
 *
 * The previous implementation did the opposite of correct — it divided
 * Mix by 100 even when the value was already 0.74, giving 0.0074. This
 * set fires only when the input is clearly > 1.
 */
const PERCENT_SCALE_PARAMS = new Set([
  "mix", "feedback", "wet", "wetdry", "wet/dry",
]);

/**
 * Scale a parameter value to the format Helix expects in .hlx files.
 *
 * Rules, in order:
 * 1. Real-unit params (Hz, ratios, integer indices) → pass through.
 * 2. Signed-dB params → pass through (preserves negatives).
 * 3. Booleans-as-strings → 0/1.
 * 4. Percentage strings ("50%") → divided by 100.
 * 5. Numbers already in [0, 1] → pass through.
 * 6. Numbers in (1, 10] → assumed legacy 0–10 knob, divided by 10.
 * 7. Anything else → clamped to [0, 1] (last-resort safety).
 *
 * The previous implementation aggressively divided every >1 value by
 * 10 and matched any param containing "mix" against a /100 rule. Both
 * destroyed pro-template recipes that already encode values correctly
 * (Threshold=-36 dB became 0; LowCut=19.9 Hz became 1; Mix=0.74 became
 * 0.0074). Both heuristics are removed.
 */
export function scaleParamValue(paramName: string, value: string | number): number {
  const lower = paramName.toLowerCase().trim();

  // Parse string inputs first
  let num: number;
  if (typeof value === "string") {
    const v = value.trim();
    if (v.endsWith("%")) {
      const n = parseFloat(v) / 100;
      return Math.max(0, Math.min(1, n));
    }
    const lv = v.toLowerCase();
    if (lv === "on" || lv === "true") return 1;
    if (lv === "off" || lv === "false") return 0;
    // Strip trailing unit suffix (ms, hz, db, s) for parsing
    const stripped = v.replace(/\s*(ms|hz|db|s)$/i, "");
    num = parseFloat(stripped);
    if (isNaN(num)) return 0.5;
  } else {
    num = value;
  }

  // Real-unit and signed-dB params: pass through verbatim
  if (RAW_UNIT_PARAMS.has(lower)) return num;
  if (SIGNED_DB_PARAMS.has(lower)) return num;

  // Already in 0–1 range — pro template values land here
  if (num >= 0 && num <= 1) return num;

  // Time params encoded as raw ms (e.g. 440 meaning 440ms): legacy
  // recipes used this format. Convert to the 0-1 normalized scale
  // Helix uses internally (rough heuristic: 1.0 ≈ 1 second).
  if (lower === "time" || lower === "delaytime" || lower === "predelay") {
    if (num > 1 && num <= 4000) return Math.max(0, Math.min(1, num / 1000));
    return Math.max(0, Math.min(1, num));
  }

  // Percent-scale params (Mix, Feedback) on legacy recipes
  if (PERCENT_SCALE_PARAMS.has(lower)) {
    if (num > 1 && num <= 100) return num / 100;
    return Math.max(0, Math.min(1, num));
  }

  // Legacy 0–10 knob value (Drive: 7, Bass: 5, etc.)
  if (num > 1 && num <= 10) {
    return Math.max(0, Math.min(1, num / 10));
  }

  // Out of any recognized range — clamp as last resort
  return Math.max(0, Math.min(1, num));
}

/**
 * Normalize a parameter name from our human-readable format to a
 * Helix-style snake_case key (e.g. "Drive" -> "Drive", "Bass" -> "Bass").
 *
 * Helix uses PascalCase param names in the HLX JSON.
 */
/** Known Helix param names that need exact casing */
const PARAM_NAME_MAP: Record<string, string> = {
  "biasx": "BiasX",
  "chvol": "ChVol",
  "ch vol": "ChVol",
  "lowcut": "LowCut",
  "low cut": "LowCut",
  "highcut": "HighCut",
  "high cut": "HighCut",
  "predelay": "Predelay",
  "pre delay": "Predelay",
  "temposync1": "TempoSync1",
  "temposync2": "TempoSync2",
  "syncselect1": "SyncSelect1",
  "syncselect2": "SyncSelect2",
  "headcaseselect": "HeadcaseSelect",
  "earlyreflections": "EarlyReflections",
  "pedalposition": "PedalPosition",
  "pedal position": "PedalPosition",
  "roomsize": "RoomSize",
  "bassfreq": "BassFreq",
  // Volume Pedal + Heir Apparent params (verified 2026-04-26)
  "pedal": "Pedal",
  "volumetaper": "VolumeTaper",
  "voltage": "Voltage",
  "gainmod": "GainMod",
  "clipping": "Clipping",
  "presence": "Presence",
};

/**
 * Normalize a parameter name for the .hlx output.
 *
 * Strategy:
 * 1. Explicit alias map (case-insensitive lookup) wins.
 * 2. If the input already has any uppercase letter past position 0,
 *    trust the author's casing — strip non-alphanumerics and pass
 *    through. This preserves PascalCase keys like `MicA`, `Position`,
 *    `EarlyReflections` that the previous implementation flattened.
 * 3. Otherwise (lowercase or space-separated), title-case each word.
 */
export function normalizeParamName(name: string): string {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (PARAM_NAME_MAP[lower]) return PARAM_NAME_MAP[lower];

  // Author already supplied PascalCase / camelCase — preserve it.
  if (/[A-Z]/.test(trimmed.slice(1))) {
    return trimmed.replace(/[^a-zA-Z0-9]/g, "");
  }

  // Lowercase or space-separated — title-case each word.
  return trimmed
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
