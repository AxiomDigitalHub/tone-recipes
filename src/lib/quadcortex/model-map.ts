/**
 * Mapping from human-readable block names (as used in our seed data)
 * to Neural DSP Quad Cortex model identifiers.
 *
 * QC model names follow the pattern used in its JSON preset format.
 */
export const QC_MODEL_MAP: Record<string, string> = {
  // -- Amps ---------------------------------------------------------------
  "US Double Nrm": "Twin Reverb",
  "US Deluxe Vib": "Deluxe Reverb",
  "US Deluxe Nrm": "Deluxe Reverb",
  "US Small Tweed": "Tweed Champ",
  "Brit Plexi Brt": "1959 SLP Bright",
  "Brit Plexi Nrm": "1959 SLP Normal",
  "Brit 2204": "JCM800 2204",
  "Brit J45 Nrm": "JTM45",
  "Brit J-800": "JCM800",
  "Essex A30": "AC30 Top Boost",
  "Derailed Ingrid": "Two Rock Custom",
  "Cali Rectifire": "Mesa Dual Rectifier",
  "Cali Texas Ch1": "Mesa Lone Star",
  "PV Panama": "5150 Block Letter",
  "Mesa .22": "Mesa Mark IIC+",
  "Vibro Verb": "Vibro-King",
  "Laney Supergroup": "Supro Thunderbolt",

  // QC-native amp names (pass through)
  "1959 SLP": "1959 SLP Bright",
  "JCM800": "JCM800 2204",
  "JTM45": "JTM45",
  "Twin Reverb": "Twin Reverb",
  "Bassman": "Bassman",
  "AC30 TB": "AC30 Top Boost",
  "Two Rock": "Two Rock Custom",
  "Champ": "Tweed Champ",
  "Silvertone": "Silvertone 1484",
  "Hiwatt DR103": "Hiwatt DR103",
  "Mesa Mark IIC+": "Mesa Mark IIC+",
  "Mesa Mark I": "Mesa Mark I",
  "Randall Century": "Randall Satan",
  "Marshall Major": "1959 SLP Bright",

  // -- Cabs ----------------------------------------------------------------
  "4x12 Greenback25": "4x12 Green 25W",
  "4x12 Green 25": "4x12 Green 25W",
  "4x12 Green": "4x12 Green 20W",
  "4x12 Cali V30": "4x12 V30",
  "4x12 V30": "4x12 V30",
  "2x12 Blue Bell": "2x12 Blue Alnico",
  "2x12 Double C12N": "2x12 C12N",
  "2x12 Mail C12Q": "2x12 C12Q",
  "2x12 US Deluxe": "2x12 Jensen",
  "2x12 Two Rock": "2x12 Two Rock",
  "2x12 Twin": "2x12 Jensen Twin",
  "2x10 US Deluxe": "2x10 Jensen",
  "2x10 Fender": "2x10 Jensen",
  "1x15 Ampeg": "1x15 Ampeg",
  "1x15 Vibroverb": "1x15 Jensen",
  "1x12 US Deluxe": "1x12 Jensen",
  "1x12 Cali EXT": "1x12 EVM12L",
  "1x12 Mesa": "1x12 EVM12L",
  "1x8 Small Tweed": "1x8 Champ",
  "1x8 Champ": "1x8 Champ",
  "4x10 Tweed": "4x10 Jensen",
  "4x10 Bassman": "4x10 Jensen",

  // -- Drives / Stomps -----------------------------------------------------
  "Scream 808": "TS808 OD",
  "TS808 OD": "TS808 OD",
  "TS808": "TS808 OD",
  "Minotaur": "Klon Centaur",
  "Arbitrator Fuzz": "Fuzz Face",
  "Fuzz Face": "Fuzz Face",
  "Triangle Fuzz": "Big Muff",
  "Muff Fuzz": "Big Muff",
  "Deez One Vintage": "Boss DS-1",
  "DS-1": "Boss DS-1",
  "Kinky Boost": "Rangemaster",
  "Rangemaster": "Rangemaster",
  "Treble Boost": "Rangemaster",
  "Mid Boost": "Rangemaster",
  "Distortion+": "DOD 250",
  "Blues Driver": "Blues Driver",
  "Deluxe Comp": "Optical Compressor",

  // -- Modulation -----------------------------------------------------------
  "70s Chorus": "CE-1 Chorus",
  "CE-1": "CE-1 Chorus",
  "CE-1 Chorus": "CE-1 Chorus",
  "Chorus (CE-1)": "CE-1 Chorus",
  "Small Clone": "CE-1 Chorus",
  "Script Mod Phase": "Phase 90",
  "Phase 90": "Phase 90",
  "Phaser": "Phase 90",
  "Elephant Man": "DMM Delay",
  "Optical Trem": "Harmonic Tremolo",
  "Tremolo": "Harmonic Tremolo",

  // -- Delay ----------------------------------------------------------------
  "Simple Delay": "Digital Delay",
  "Transistor Tape": "Tape Delay",
  "Digital Delay": "Digital Delay",
  "Tape Delay": "Tape Delay",
  "Tape Echo": "Tape Delay",
  "Analog Delay": "Analog Delay",

  // -- Reverb ---------------------------------------------------------------
  "Plate Reverb": "Plate Reverb",
  "Spring Reverb": "Spring Reverb",

  // -- Wah ------------------------------------------------------------------
  "Chrome": "Cry Baby Wah",
  "Wah": "Cry Baby Wah",
  "Pedal Wah": "Cry Baby Wah",

  // -- Pitch ----------------------------------------------------------------
  "Pitch Wham": "Whammy",
  "Whammy": "Whammy",
  "Pitch Shifter": "Pitch Shifter",

  // -- EQ -------------------------------------------------------------------
  "Parametric EQ": "Parametric EQ",
  "Graphic EQ": "Graphic EQ",
};

/** Fallback model name used when a block name is not in the map. */
export const QC_FALLBACK_MODEL = "TS808 OD";

/**
 * Resolve a block name to a Quad Cortex model name.
 */
export function resolveQCModel(blockName: string): string {
  return QC_MODEL_MAP[blockName] ?? QC_FALLBACK_MODEL;
}

/**
 * Determine a QC block type string from a category.
 */
export function categoryToQCType(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("amp")) return "amp";
  if (lower.includes("cab") || lower.includes("ir")) return "cab";
  if (lower.includes("dist") || lower.includes("drive") || lower.includes("boost") || lower.includes("stomp")) return "stomp";
  if (lower.includes("delay")) return "delay";
  if (lower.includes("reverb")) return "reverb";
  if (lower.includes("mod") || lower.includes("chorus") || lower.includes("flang") || lower.includes("phas")) return "mod";
  if (lower.includes("wah")) return "wah";
  if (lower.includes("pitch")) return "pitch";
  if (lower.includes("eq")) return "eq";
  if (lower.includes("comp") || lower.includes("dyn")) return "compressor";
  if (lower.includes("trem")) return "mod";
  return "stomp";
}
