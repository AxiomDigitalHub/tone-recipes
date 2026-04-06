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
  "US Small Tweed": "HD2_AmpUSSmallTweed",
  "Brit Plexi Brt": "HD2_AmpBritPlexiBrt",
  "Brit Plexi Nrm": "HD2_AmpBritPlexiNrm",
  "Brit 2204": "HD2_AmpBrit2204",
  "Brit J45 Nrm": "HD2_AmpBritJ45Nrm",
  "Brit J-800": "HD2_AmpBritJ800",
  "Essex A30": "HD2_AmpEssexA30",
  "Derailed Ingrid": "HD2_AmpDerailedIngrid",
  "Cali Rectifire": "HD2_AmpCaliRectifire",
  "Cali Texas Ch1": "HD2_AmpCaliTexasCh1",
  "PV Panama": "HD2_AmpPVPanama",
  "Mesa .22": "HD2_AmpCaliMkIV",
  "Vibro Verb": "HD2_AmpUSDeluxeVib", // Vibro Verb mapped to closest Fender model
  "Laney Supergroup": "HD2_AmpBritJ45Brt", // Laney Supergroup approximation

  // ── Cabs ──────────────────────────────────────────────────────────────
  "4x12 Greenback25": "HD2_Cab4x12Greenback25",
  "4x12 Green 25": "HD2_Cab4x12Green25",
  "4x12 Green": "HD2_Cab4x12Green20",
  "4x12 Cali V30": "HD2_Cab4x12CaliV30",
  "4x12 V30": "HD2_Cab4x12V30",
  "2x12 Blue Bell": "HD2_Cab2x12BlueBell",
  "2x12 Double C12N": "HD2_Cab2x12DoubleC12N",
  "2x12 Mail C12Q": "HD2_Cab2x12MailC12Q",
  "2x12 US Deluxe": "HD2_Cab2x12USDeluxe",
  "2x12 Two Rock": "HD2_Cab2x12TwoRock",
  "2x12 Twin": "HD2_Cab2x12Twin",
  "2x10 US Deluxe": "HD2_Cab2x10USDeluxe",
  "2x10 Fender": "HD2_Cab2x10Fender",
  "1x15 Ampeg": "HD2_Cab1x15Ampeg",
  "1x15 Vibroverb": "HD2_Cab1x15Vibroverb",
  "1x12 US Deluxe": "HD2_Cab1x12USDeluxe",
  "1x12 Cali EXT": "HD2_Cab1x12CaliEXT",
  "1x12 Mesa": "HD2_Cab1x12Mesa",
  "1x8 Small Tweed": "HD2_Cab1x8SmallTweed",
  "1x8 Champ": "HD2_Cab1x8Champ",
  "4x10 Tweed": "HD2_Cab4x10Tweed",
  "4x10 Bassman": "HD2_Cab4x10Bassman",

  // ── Distortion / Drive ────────────────────────────────────────────────
  "Scream 808": "HD2_DistScream808",
  "Minotaur": "HD2_DistMinotaur",
  "Arbitrator Fuzz": "HD2_DistArbitratorFuzz",
  "Triangle Fuzz": "HD2_DistTriangleFuzz",
  "Deez One Vintage": "HD2_DistDeezOneVintage",
  "Muff Fuzz": "HD2_DistMuffFuzz",
  "Kinky Boost": "HD2_DistKinkyBoost",
  "Distortion+": "HD2_DistDistortionPlus",
  "Deluxe Comp": "HD2_CompDeluxeComp",

  // ── Modulation ────────────────────────────────────────────────────────
  "70s Chorus": "HD2_Chorus70sChorus",
  "Script Mod Phase": "HD2_PhaserScriptModPhase",
  "Elephant Man": "HD2_DelayElephantMan",
  "Optical Trem": "HD2_TremOpticalTrem",

  // ── Delay ─────────────────────────────────────────────────────────────
  "Simple Delay": "HD2_DelaySimple",
  "Transistor Tape": "HD2_DelayTransistorTape",
  "Digital Delay": "HD2_DelayDigital",

  // ── Reverb ────────────────────────────────────────────────────────────
  "Plate Reverb": "HD2_ReverbPlate",

  // ── Wah ───────────────────────────────────────────────────────────────
  "Chrome": "HD2_WahChrome",

  // ── Pitch ─────────────────────────────────────────────────────────────
  "Pitch Wham": "HD2_PitchWham",

  // ── Additional Amps (used in recipe translations) ─────────────────────
  "Soup Pro": "HD2_AmpSoupPro",
  "WhoWatt 100": "HD2_AmpWhoWatt100",
  "Tweed Blues Nrm": "HD2_AmpTweedBluesNrm",
  "US DLX 64": "HD2_AmpUSDeluxe64",
  "Essex A30 TB": "HD2_AmpEssexA30TB",
  "Brit 2203": "HD2_AmpBrit2203",
  "Cali 2C+ Lead": "HD2_AmpCali2CLead",
  "Cali IV Lead": "HD2_AmpCaliIVLead",
  "Cali Texas Ch2": "HD2_AmpCaliTexasCh2",
  "Das Benzin Lead": "HD2_AmpDasBenzinLead",
  "Ampeg SVT Nrm": "HD2_AmpAmpegSVTNrm",
  "Deranged Master": "HD2_AmpDerangedMaster",
  "Cartographer": "HD2_AmpCartographer",

  // ── Cabs (Dual/non-legacy format: HD2_CabMicIr_) ──────────────────────
  "1x12 Field Coil": "HD2_CabMicIr_1x12FieldCoilWithPan",
  "1x12 US Deluxe": "HD2_CabMicIr_1x12USDeluxeWithPan",
  "1x12 Cali EXT": "HD2_CabMicIr_1x12CaliEXTWithPan",
  "1x12 Mesa": "HD2_CabMicIr_1x12MesaWithPan",
  "1x15 Ampeg B-15": "HD2_CabMicIr_1x15AmpegB15WithPan",
  "1x15 Vibroverb": "HD2_CabMicIr_1x15VibroverbWithPan",
  "2x12 Blue Bell": "HD2_CabMicIr_2x12BlueBellWithPan",
  "2x12 Double C12N": "HD2_CabMicIr_2x12DoubleC12NWithPan",
  "2x12 Twin": "HD2_CabMicIr_2x12TwinWithPan",
  "4x10 Tweed P10R": "HD2_CabMicIr_4x10TweedP10RWithPan",
  "4x12 Greenback 25": "HD2_CabMicIr_4x12Greenback25WithPan",
  "4x12 XXL V30": "HD2_CabMicIr_4x12XXLV30WithPan",
  "4x12 Greenback25": "HD2_CabMicIr_4x12Greenback25WithPan",
  "4x12 Green 25": "HD2_CabMicIr_4x12Green25WithPan",
  "4x12 Green": "HD2_CabMicIr_4x12Green20WithPan",
  "4x12 Cali V30": "HD2_CabMicIr_4x12CaliV30WithPan",
  "4x12 V30": "HD2_CabMicIr_4x12V30WithPan",

  // ── Additional Drive/Comp ────────────────────────────────────────────
  "Compulsive Drv": "HD2_DistCompulsiveDrive",
  "Vermin Dist": "HD2_DistVermin",
  "LA Studio Comp": "HD2_CompLAStudioComp",

  // ── Additional Modulation ────────────────────────────────────────────
  "PlastiChorus": "HD2_ChorusPlastiChorus",
  "Chorus CE-1": "HD2_Chorus70sChorus",
  "Searchlights": "HD2_TremSearchlights",

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
  "Champ": "HD2_AmpUSSmallTweed",
  "Silvertone": "HD2_AmpUSSmallTweed",
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
  "Analog Delay": "HD2_DelaySimple",

  // Quad Cortex / Fractal / Katana mod names
  "CE-1": "HD2_Chorus70sChorus",
  "CE-1 Chorus": "HD2_Chorus70sChorus",
  "Chorus (CE-1)": "HD2_Chorus70sChorus",
  "Phase 90": "HD2_PhaserScriptModPhase",
  "Phaser": "HD2_PhaserScriptModPhase",

  // Quad Cortex / Fractal / Katana tremolo names
  "Tremolo": "HD2_TremOpticalTrem",

  // Quad Cortex / Fractal / Katana reverb names
  "Spring Reverb": "HD2_ReverbSpring",

  // Quad Cortex / Fractal / Katana pitch names
  "Whammy": "HD2_PitchWham",
  "Pitch Shifter": "HD2_PitchWham",

};

/** Fallback model ID used when a block name isn't in the map. */
export const FALLBACK_MODEL_ID = "HD2_DistMinotaur";

/**
 * Resolve a block name to its Helix model ID.
 * Falls back to a generic model if the name is unmapped.
 */
export function resolveModelId(blockName: string): string {
  return HELIX_MODEL_MAP[blockName] ?? FALLBACK_MODEL_ID;
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
 * Parameters that use a 0-10 integer scale in our data but need
 * to be normalized to 0.0-1.0 for the HLX format.
 */
const PARAM_MAX_VALUE: Record<string, number> = {
  // Most knobs in our data are 0-10
  default: 10,
  // Some params are percentage-based (0-100)
  mix: 100,
  "wet/dry": 100,
  // BPM-style params stay as-is (not scaled)
  time: -1,
  bpm: -1,
  tempo: -1,
};

/**
 * Scale a parameter value from our human-readable format to the
 * Helix 0.0-1.0 range used in .hlx files.
 *
 * - Numeric values assumed to be on a 0-10 scale are divided by 10.
 * - String values like "7" are parsed first.
 * - Values that look like percentages (e.g. "50%") are divided by 100.
 * - Time/BPM values are passed through as-is (clamped to 0-1 if > 1).
 */
export function scaleParamValue(paramName: string, value: string | number): number {
  const lower = paramName.toLowerCase();

  // Parse string values
  let num: number;
  if (typeof value === "string") {
    // Handle percentage strings
    if (value.endsWith("%")) {
      num = parseFloat(value) / 100;
      return Math.max(0, Math.min(1, num));
    }
    // Handle "on"/"off" toggle strings
    if (value.toLowerCase() === "on" || value.toLowerCase() === "true") return 1;
    if (value.toLowerCase() === "off" || value.toLowerCase() === "false") return 0;
    num = parseFloat(value);
    if (isNaN(num)) return 0.5; // default for unparseable values
  } else {
    num = value;
  }

  // Check for special param names that shouldn't be scaled
  for (const key of Object.keys(PARAM_MAX_VALUE)) {
    if (lower.includes(key) && PARAM_MAX_VALUE[key] === -1) {
      // Time-based params: clamp to 0-1 if already in that range,
      // otherwise assume it's milliseconds and normalize roughly
      return Math.max(0, Math.min(1, num > 1 ? num / 2000 : num));
    }
    if (lower.includes(key) && PARAM_MAX_VALUE[key] !== 10) {
      return Math.max(0, Math.min(1, num / PARAM_MAX_VALUE[key]));
    }
  }

  // Default: assume 0-10 scale
  if (num > 1) {
    return Math.max(0, Math.min(1, num / 10));
  }

  // Already in 0-1 range
  return Math.max(0, Math.min(1, num));
}

/**
 * Normalize a parameter name from our human-readable format to a
 * Helix-style snake_case key (e.g. "Drive" -> "Drive", "Bass" -> "Bass").
 *
 * Helix uses PascalCase param names in the HLX JSON.
 */
export function normalizeParamName(name: string): string {
  // Remove special characters, capitalize first letter of each word
  return name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
