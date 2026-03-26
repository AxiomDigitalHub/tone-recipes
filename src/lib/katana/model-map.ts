/**
 * Mapping from human-readable block names to Boss Katana amp type values
 * and effect parameter identifiers used in .tsl (Tone Studio Liveset) files.
 *
 * The Katana uses numeric identifiers for amp types and string-based
 * effect type identifiers in its XML preset format.
 */

/**
 * Katana amp type enum values used in TSL presets.
 * These map to the amp variation selector in Boss Tone Studio.
 */
export const KATANA_AMP_TYPES: Record<string, { type: string; variation: string }> = {
  // Helix amp names -> Katana amp type
  "US Double Nrm": { type: "CLEAN", variation: "Twin" },
  "US Deluxe Vib": { type: "CLEAN", variation: "Twin" },
  "US Deluxe Nrm": { type: "CLEAN", variation: "Twin" },
  "US Small Tweed": { type: "CLEAN", variation: "Tweed" },
  "Brit Plexi Brt": { type: "LEAD", variation: "Plexi" },
  "Brit Plexi Nrm": { type: "CRUNCH", variation: "Plexi" },
  "Brit 2204": { type: "LEAD", variation: "Marshall" },
  "Brit J45 Nrm": { type: "CRUNCH", variation: "Vintage" },
  "Brit J-800": { type: "LEAD", variation: "Marshall" },
  "Essex A30": { type: "CRUNCH", variation: "VOX" },
  "Derailed Ingrid": { type: "CLEAN", variation: "Boutique" },
  "Cali Rectifire": { type: "BROWN", variation: "Rectifier" },
  "Cali Texas Ch1": { type: "LEAD", variation: "Mesa" },
  "PV Panama": { type: "BROWN", variation: "5150" },
  "Mesa .22": { type: "LEAD", variation: "Mesa" },
  "Vibro Verb": { type: "CLEAN", variation: "Twin" },
  "Laney Supergroup": { type: "CRUNCH", variation: "Vintage" },

  // QC / Fractal / Katana native amp names
  "1959 SLP": { type: "LEAD", variation: "Plexi" },
  "JCM800": { type: "LEAD", variation: "Marshall" },
  "JTM45": { type: "CRUNCH", variation: "Vintage" },
  "Twin Reverb": { type: "CLEAN", variation: "Twin" },
  "Bassman": { type: "CLEAN", variation: "Tweed" },
  "AC30 TB": { type: "CRUNCH", variation: "VOX" },
  "Two Rock": { type: "CLEAN", variation: "Boutique" },
  "Champ": { type: "CLEAN", variation: "Tweed" },
  "Silvertone": { type: "CRUNCH", variation: "Vintage" },
  "Hiwatt DR103": { type: "CRUNCH", variation: "Vintage" },
  "Mesa Mark IIC+": { type: "LEAD", variation: "Mesa" },
  "Mesa Mark I": { type: "LEAD", variation: "Mesa" },
  "Randall Century": { type: "BROWN", variation: "5150" },
  "Marshall Major": { type: "LEAD", variation: "Plexi" },
};

/** Default amp type when no match is found. */
export const KATANA_DEFAULT_AMP = { type: "CRUNCH", variation: "Vintage" };

/**
 * Katana effect type mappings from our block names to TSL effect identifiers.
 */
export const KATANA_EFFECT_MAP: Record<string, { category: string; type: string }> = {
  // Drives
  "Scream 808": { category: "OD/DS", type: "OD/DS_TS Screamer" },
  "TS808 OD": { category: "OD/DS", type: "OD/DS_TS Screamer" },
  "TS808": { category: "OD/DS", type: "OD/DS_TS Screamer" },
  "Minotaur": { category: "OD/DS", type: "OD/DS_Overdrive" },
  "Blues Driver": { category: "OD/DS", type: "OD/DS_Blues Driver" },
  "Arbitrator Fuzz": { category: "OD/DS", type: "OD/DS_Fuzz Face" },
  "Fuzz Face": { category: "OD/DS", type: "OD/DS_Fuzz Face" },
  "Triangle Fuzz": { category: "OD/DS", type: "OD/DS_Muff Fuzz" },
  "Muff Fuzz": { category: "OD/DS", type: "OD/DS_Muff Fuzz" },
  "Deez One Vintage": { category: "OD/DS", type: "OD/DS_DS-1" },
  "DS-1": { category: "OD/DS", type: "OD/DS_DS-1" },
  "Kinky Boost": { category: "OD/DS", type: "OD/DS_Booster" },
  "Rangemaster": { category: "OD/DS", type: "OD/DS_Booster" },
  "Treble Boost": { category: "OD/DS", type: "OD/DS_Booster" },
  "Mid Boost": { category: "OD/DS", type: "OD/DS_Booster" },
  "Distortion+": { category: "OD/DS", type: "OD/DS_Distortion" },
  "Deluxe Comp": { category: "COMP", type: "COMP_Compressor" },

  // Modulation
  "70s Chorus": { category: "MOD", type: "MOD_CE-1" },
  "CE-1": { category: "MOD", type: "MOD_CE-1" },
  "CE-1 Chorus": { category: "MOD", type: "MOD_CE-1" },
  "Chorus (CE-1)": { category: "MOD", type: "MOD_CE-1" },
  "Small Clone": { category: "MOD", type: "MOD_CE-1" },
  "Script Mod Phase": { category: "MOD", type: "MOD_Phaser" },
  "Phase 90": { category: "MOD", type: "MOD_Phaser" },
  "Phaser": { category: "MOD", type: "MOD_Phaser" },
  "Elephant Man": { category: "MOD", type: "MOD_Flanger" },
  "Optical Trem": { category: "MOD", type: "MOD_Tremolo" },
  "Tremolo": { category: "MOD", type: "MOD_Tremolo" },

  // Delay
  "Simple Delay": { category: "DELAY", type: "DELAY_Digital" },
  "Transistor Tape": { category: "DELAY", type: "DELAY_Tape Echo" },
  "Digital Delay": { category: "DELAY", type: "DELAY_Digital" },
  "Tape Delay": { category: "DELAY", type: "DELAY_Tape Echo" },
  "Tape Echo": { category: "DELAY", type: "DELAY_Tape Echo" },
  "Analog Delay": { category: "DELAY", type: "DELAY_Analog" },

  // Reverb
  "Plate Reverb": { category: "REVERB", type: "REVERB_Plate" },
  "Spring Reverb": { category: "REVERB", type: "REVERB_Spring" },

  // Wah
  "Chrome": { category: "PEDAL_FX", type: "PEDAL_FX_Wah" },
  "Wah": { category: "PEDAL_FX", type: "PEDAL_FX_Wah" },
  "Pedal Wah": { category: "PEDAL_FX", type: "PEDAL_FX_Wah" },

  // Pitch
  "Pitch Wham": { category: "PEDAL_FX", type: "PEDAL_FX_Pitch Shifter" },
  "Whammy": { category: "PEDAL_FX", type: "PEDAL_FX_Pitch Shifter" },
  "Pitch Shifter": { category: "PEDAL_FX", type: "PEDAL_FX_Pitch Shifter" },

  // EQ
  "Parametric EQ": { category: "EQ", type: "EQ_Parametric" },
  "Graphic EQ": { category: "EQ", type: "EQ_Graphic" },
};

/** Default effect type when no match is found. */
export const KATANA_DEFAULT_EFFECT = { category: "OD/DS", type: "OD/DS_Overdrive" };

/**
 * Resolve a block name to a Katana amp type.
 */
export function resolveKatanaAmp(blockName: string): { type: string; variation: string } {
  return KATANA_AMP_TYPES[blockName] ?? KATANA_DEFAULT_AMP;
}

/**
 * Resolve a block name to a Katana effect type.
 */
export function resolveKatanaEffect(blockName: string): { category: string; type: string } {
  return KATANA_EFFECT_MAP[blockName] ?? KATANA_DEFAULT_EFFECT;
}

/**
 * Determine if a block category represents an amp.
 */
export function isAmpCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return lower === "amp" || lower === "amp type" || lower === "preamp" || lower === "power amp";
}

/**
 * Determine if a block category represents a cab/IR (skipped for Katana).
 */
export function isCabCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return lower === "cab" || lower === "cabinet" || lower === "ir";
}
