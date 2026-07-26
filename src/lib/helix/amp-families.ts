/**
 * Helix amp model -> family taxonomy, and base-amp selection for a set.
 *
 * WHY THIS EXISTS
 * ---------------
 * A Set Pack is one preset with N snapshots, and a preset has ONE amp block
 * (two at most, and the second one costs a third of a DSP). So the moment a
 * setlist asks for an AC30 song, a Twin song and a Plexi song, something has
 * to give: we pick a single base amp and cover the rest with drive, EQ and
 * gain staging. This module encodes which substitutions are musically honest
 * and which ones are lies.
 *
 * The families are voicing families, not manufacturer families. A Mesa
 * Lonestar clean channel sits with the blackface Fenders because that is what
 * it sounds like and what it replaces; a Marshall JTM-45 sits with the
 * plexis even though its circuit is a Bassman.
 *
 * Sourcing: model->real-gear pairings come from Line 6's official model list
 * as captured in docs/platform-knowledge/line6-helix.md and cross-checked
 * against docs/TONE_ENGINEERING_BIBLE.md §3. The family assignments and the
 * adjacency weights are OUR editorial judgement — they are not measured, and
 * they are the part a human should argue with.
 */

import { lookupDspCost } from "./dsp-costs";

export type AmpFamily =
  | "vox"
  | "fender_blackface"
  | "fender_tweed"
  | "marshall_plexi"
  | "marshall_jcm"
  | "recto"
  | "mesa_mark"
  | "hiwatt"
  | "orange"
  | "ac_boutique"
  | "dumble_style"
  | "bassman"
  | "champ"
  | "modern_high_gain"
  | "acoustic"
  | "other";

export interface AmpFamilyProfile {
  family: AmpFamily;
  label: string;
  /** What the family does well, and what it can cover on a setlist. */
  voicing_notes: string;
  /**
   * Members worth using as the single base amp for a whole set, best first.
   * Chosen for pedal-platform behaviour (clean headroom that still breaks up
   * musically when a drive hits it), not for maximum gain.
   */
  recommendedBases: string[];
}

export const AMP_FAMILIES: Record<AmpFamily, AmpFamilyProfile> = {
  vox: {
    family: "vox",
    label: "Vox AC-family (EL84 chime)",
    voicing_notes:
      "Upper-mid chime, early compression, and a top end that cuts without " +
      "getting brittle. The default modern-worship platform: it stays clear " +
      "under a delay wash and takes a transparent overdrive better than any " +
      "other family. Covers Hillsong/Bethel/Elevation cleans and edge-of-" +
      "breakup, U2-style delay parts, Beatles/Britpop jangle, and most " +
      "Coldplay. Struggles with scooped modern metal and with true Fender " +
      "sparkle-clean at high volume (it breaks up too early).",
    recommendedBases: ["Essex A30", "A30 Fawn Brt", "Essex A15"],
  },
  fender_blackface: {
    family: "fender_blackface",
    label: "Fender blackface (Deluxe / Twin / Princeton / Super)",
    voicing_notes:
      "Scooped mids, deep clean headroom, glassy top. The reference clean " +
      "platform — everything stacks on it, which is why it is the safest " +
      "base when a set is mostly clean with pedal-driven dirt. Covers " +
      "worship cleans, John Mayer, SRV-adjacent clean tones, country, " +
      "and any part where the amp is supposed to disappear. Cannot " +
      "convincingly do Marshall crunch on its own; needs a real drive " +
      "block for anything past edge-of-breakup.",
    recommendedBases: ["US Deluxe Nrm", "US Double Nrm", "US Princess"],
  },
  fender_tweed: {
    family: "fender_tweed",
    label: "Fender tweed (5E3 Deluxe and cousins)",
    voicing_notes:
      "Mid-forward, loose, compresses and sags the moment you dig in. Great " +
      "for roots, blues, Americana and dirty-clean rhythm; the sag is a " +
      "feature live and a liability under a heavy delay. Covers Neil Young, " +
      "early rock and roll, Larry Carlton-ish grit. Poor choice as a set " +
      "base for ambient worship — not enough clean headroom.",
    recommendedBases: ["Fullerton Nrm", "Mail Order Twin"],
  },
  bassman: {
    family: "bassman",
    label: "Tweed Bassman (4x10 lineage)",
    voicing_notes:
      "The bridge between Fender and Marshall: bigger low end than a tweed " +
      "Deluxe, firmer than a blackface, breaks into a thick midrange crunch. " +
      "A genuinely versatile set base when the setlist mixes clean verses " +
      "with rock choruses. Covers blues-rock, classic rock rhythm, and " +
      "doubles as a plexi stand-in with a boost in front.",
    recommendedBases: ["Tweed Blues Nrm", "Tweed Blues Brt"],
  },
  champ: {
    family: "champ",
    label: "Small vintage combo (Champ / Supro / EH-185)",
    voicing_notes:
      "Single-ended, low wattage, compressed and gritty with almost no clean " +
      "headroom. A texture, not a platform. Covers slide, lo-fi overdubs, " +
      "White Stripes-style raunch and small-room blues. Do not build a set " +
      "on it — it will not stay clean behind a vocal.",
    recommendedBases: ["US Small Tweed", "Soup Pro"],
  },
  marshall_plexi: {
    family: "marshall_plexi",
    label: "Marshall plexi era (JTM-45 / JTM-50 / Super Lead / Park)",
    voicing_notes:
      "Midrange push, hard-clipping top end, and gain that lives in the " +
      "power section — so it cleans up with the guitar volume knob. Covers " +
      "classic rock top to bottom (Page, Hendrix, AC/DC with a boost) and " +
      "the heavier end of a worship set. Usable as a set base if you ride " +
      "guitar volume; harsh as a pure clean platform.",
    recommendedBases: ["Brit Plexi Brt", "Brit J45 Nrm", "Brit Trem Nrm"],
  },
  marshall_jcm: {
    family: "marshall_jcm",
    label: "Marshall master-volume (JCM-800 / Silver Jubilee)",
    voicing_notes:
      "Tighter and more aggressive than a plexi, with preamp gain on tap and " +
      "a firm low end. Covers 80s rock and hard rock rhythm, punk, and " +
      "modern rock worship. Reliable under high gain, mediocre at glassy " +
      "clean — pair with a snapshot-level gain drop rather than expecting " +
      "the clean channel to carry a whole set.",
    recommendedBases: ["Brit 2204", "Brit 2203"],
  },
  recto: {
    family: "recto",
    label: "Mesa Rectifier and derivatives",
    voicing_notes:
      "Scooped, saturated, huge low end, loose feel. Built for downtuned " +
      "modern rock and metal rhythm. Covers nu-metal, modern hard rock, and " +
      "the heaviest end of a rock worship set. A poor set base: its clean " +
      "channel is flat and it eats mix space.",
    recommendedBases: ["Cali Rectifire"],
  },
  mesa_mark: {
    family: "mesa_mark",
    label: "Mesa Mark series (IIC+ / IV / Lonestar drive)",
    voicing_notes:
      "Graphic-EQ-shaped, tight, mid-focused lead voice with a fast attack. " +
      "Covers Metallica-era rhythm, Petrucci-style lead, and precise high-" +
      "gain articulation. The Lonestar channels sit here for their drive " +
      "voice; the Lonestar clean is closer to blackface Fender.",
    recommendedBases: ["Cali IV Rhyth 2", "Cali IV Lead", "Cali Texas Ch2"],
  },
  hiwatt: {
    family: "hiwatt",
    label: "Hiwatt (DR-103)",
    voicing_notes:
      "Enormous clean headroom, flat and honest, with a stiff low end and no " +
      "compression to hide behind. Covers Townshend and Gilmour, and it is a " +
      "superb pedal platform precisely because it does not colour what you " +
      "put in front of it. Unforgiving of sloppy playing and of cheap-" +
      "sounding drive blocks.",
    recommendedBases: ["WhoWatt 100"],
  },
  orange: {
    family: "orange",
    label: "Orange (OR80 / Rockerverb)",
    voicing_notes:
      "Thick, woolly midrange with a soft top end. Covers stoner rock, " +
      "fuzz-forward parts, and heavy rhythm that needs to sound big without " +
      "sounding modern. Not a clean platform.",
    recommendedBases: ["Mandarin Rocker", "Mandarin 80"],
  },
  ac_boutique: {
    family: "ac_boutique",
    label: "Class-A boutique (Matchless / Divided by 13 / Dr Z)",
    voicing_notes:
      "AC30 DNA with better headroom, tighter low end and a more even top. " +
      "Everything the Vox family covers, plus it stays clean longer, which " +
      "makes it the best drop-in when a set needs chime AND clean headroom. " +
      "The most expensive-sounding clean platform in the box.",
    recommendedBases: ["Matchstick Ch2", "Divided Duo", "Interstate Zed"],
  },
  dumble_style: {
    family: "dumble_style",
    label: "D-style / boutique touch amps",
    voicing_notes:
      "Smooth mid-hump, very touch-sensitive, compresses gracefully as you " +
      "push it. Covers Mayer, Robben Ford, Larry Carlton, and lead lines " +
      "that need to sing without a separate boost. Works well as a set base " +
      "when the setlist is lead-heavy; its built-in mid push can crowd a " +
      "dense band mix on rhythm parts.",
    recommendedBases: ["Line 6 Litigator", "Grammatico GSG", "Derailed Ingrid"],
  },
  modern_high_gain: {
    family: "modern_high_gain",
    label: "Modern high gain (Soldano / Bogner / Friedman / 5150 / Revv / Diezel)",
    voicing_notes:
      "Tight, saturated, noise-gate-friendly gain with a modern EQ curve. " +
      "Covers metal, metalcore, modern hard rock, and any part that needs " +
      "to stay articulate at high gain. Most of these have genuinely usable " +
      "clean channels (Archetype Clean, Placater Clean, Solo Lead Clean), " +
      "which makes a few of them viable as a two-snapshot set base for a " +
      "rock-leaning setlist.",
    recommendedBases: ["Archetype Clean", "Revv Gen Purple", "Placater Clean"],
  },
  acoustic: {
    family: "acoustic",
    label: "Acoustic amplification",
    voicing_notes:
      "Helix ships no acoustic amp model. Acoustic tones are built from a " +
      "clean path with no amp block plus the Acoustic Sim EQ, or from an " +
      "acoustic IR. This family exists so that a set containing an acoustic " +
      "song is classified honestly rather than being forced onto a Fender " +
      "clean.",
    recommendedBases: [],
  },
  other: {
    family: "other",
    label: "Unclassified / original designs",
    voicing_notes:
      "Line 6 originals and one-off circuits with no single real-world " +
      "lineage, plus bass amps. Judge these by ear per song; they are not " +
      "reliable substitutes for a named family.",
    recommendedBases: ["Line 6 Litigator"],
  },
};

/* ------------------------------------------------------------------ */
/*  Model -> family                                                    */
/* ------------------------------------------------------------------ */

/**
 * Every guitar amp model in the Helix 3.80 list, keyed by canonical Line 6
 * display name (same spelling as docs/TONE_ENGINEERING_BIBLE.md §3 and
 * src/lib/helix/model-map.ts).
 */
export const AMP_MODEL_FAMILIES: Record<string, AmpFamily> = {
  // ── Fender blackface ────────────────────────────────────────────────
  "US Princess": "fender_blackface",
  "US Deluxe Nrm": "fender_blackface",
  "US Deluxe Vib": "fender_blackface",
  "US Double Nrm": "fender_blackface",
  "US Double Vib": "fender_blackface",
  "US Super Nrm": "fender_blackface",
  "US Super Vib": "fender_blackface",
  // Mesa Lonestar Ch1 is a blackface-derived clean, not a Mark voice.
  "Cali Texas Ch1": "fender_blackface",
  // Roland JC-120: solid state, but it occupies the same role — the
  // headroom-forever clean platform.
  "Jazz Rivet 120": "fender_blackface",

  // ── Fender tweed ────────────────────────────────────────────────────
  "Fullerton Nrm": "fender_tweed",
  "Fullerton Brt": "fender_tweed",
  "Fullerton Jump": "fender_tweed",
  "Mail Order Twin": "fender_tweed",
  "Voltage Queen": "fender_tweed",

  // ── Bassman ─────────────────────────────────────────────────────────
  "Tweed Blues Nrm": "bassman",
  "Tweed Blues Brt": "bassman",
  "US Dripman Nrm": "bassman",

  // ── Small vintage combos ────────────────────────────────────────────
  "US Small Tweed": "champ",
  "Soup Pro": "champ",
  "Stone Age 185": "champ",

  // ── Vox ─────────────────────────────────────────────────────────────
  // NOTE: docs/platform-knowledge/line6-helix.md lists an "Essex A30 TB" as a
  // separate model. No such model exists in the 3.80 amp list — Essex A30 IS
  // the top-boost AC-30. Same doc also lists "Brit Jub Rhyth/Clip/Nrm"
  // (Silver Jubilee) and "Cali 2C+ Nrm/Lead" (Mark IIC+), which likewise do
  // not exist on Helix. They are omitted here deliberately; do not re-add
  // them from that doc.
  "Essex A15": "vox",
  "Essex A30": "vox",
  "A30 Fawn Nrm": "vox",
  "A30 Fawn Brt": "vox",

  // ── Class-A boutique ────────────────────────────────────────────────
  "Matchstick Ch1": "ac_boutique",
  "Matchstick Ch2": "ac_boutique",
  "Matchstick Jump": "ac_boutique",
  "Divided Duo": "ac_boutique",
  "Interstate Zed": "ac_boutique",

  // ── Marshall, plexi era ─────────────────────────────────────────────
  // JTM-45 is circuit-wise a Bassman; it lives here because it is used as
  // the early-Marshall voice, and the adjacency table keeps it close to
  // the Bassman family anyway.
  "Brit J45 Nrm": "marshall_plexi",
  "Brit J45 Brt": "marshall_plexi",
  "Brit Trem Nrm": "marshall_plexi",
  "Brit Trem Brt": "marshall_plexi",
  "Brit Trem Jump": "marshall_plexi",
  "Brit Plexi Nrm": "marshall_plexi",
  "Brit Plexi Brt": "marshall_plexi",
  "Brit Plexi Jump": "marshall_plexi",
  "Brit P75 Nrm": "marshall_plexi",
  "Brit P75 Brt": "marshall_plexi",

  // ── Marshall, master volume ─────────────────────────────────────────
  "Brit 2203": "marshall_jcm",
  "Brit 2204": "marshall_jcm",
  "Line 6 2204 Mod": "marshall_jcm",

  // ── Hiwatt ──────────────────────────────────────────────────────────
  "WhoWatt 100": "hiwatt",

  // ── Orange ──────────────────────────────────────────────────────────
  "Mandarin 80": "orange",
  "Mandarin Rocker": "orange",

  // ── Mesa Mark ───────────────────────────────────────────────────────
  "Cali IV Rhyth 1": "mesa_mark",
  "Cali IV Rhyth 2": "mesa_mark",
  "Cali IV Lead": "mesa_mark",
  "Cali Texas Ch2": "mesa_mark",

  // ── Rectifier ───────────────────────────────────────────────────────
  "Cali Rectifire": "recto",
  "Line 6 Fatality": "recto",

  // ── D-style / touch amps ────────────────────────────────────────────
  // Derailed Ingrid is really a Trainwreck Express, not a Dumble, but it
  // fills the same touch-sensitive boutique role in our recipes and the
  // Bible already labels it Dumble/Two Rock.
  "Derailed Ingrid": "dumble_style",
  "Grammatico Nrm": "dumble_style",
  "Grammatico Brt": "dumble_style",
  "Grammatico Jump": "dumble_style",
  "Grammatico GSG": "dumble_style",
  "Line 6 Litigator": "dumble_style",

  // ── Modern high gain ────────────────────────────────────────────────
  "German Mahadeva": "modern_high_gain",
  "German Ubersonic": "modern_high_gain",
  "German Xtra Blue": "modern_high_gain",
  "German Xtra Red": "modern_high_gain",
  "Das Benzin Mega": "modern_high_gain",
  "Das Benzin Lead": "modern_high_gain",
  "Solo Lead Clean": "modern_high_gain",
  "Solo Lead Crunch": "modern_high_gain",
  "Solo Lead OD": "modern_high_gain",
  "Placater Clean": "modern_high_gain",
  "Placater Dirty": "modern_high_gain",
  "PV Panama": "modern_high_gain",
  "PV Vitriol Clean": "modern_high_gain",
  "PV Vitriol Crunch": "modern_high_gain",
  "PV Vitriol Lead": "modern_high_gain",
  "EV Panama Blue": "modern_high_gain",
  "EV Panama Red": "modern_high_gain",
  "Revv Gen Purple": "modern_high_gain",
  "Revv Gen Red": "modern_high_gain",
  "ANGL Meteor": "modern_high_gain",
  "Archetype Clean": "modern_high_gain",
  "Archetype Lead": "modern_high_gain",
  "Line 6 Elektrik": "modern_high_gain",
  "Line 6 Epic": "modern_high_gain",
  "Line 6 Badonk": "modern_high_gain",
  "Line 6 Doom": "modern_high_gain",
  "Line 6 Kinetic": "modern_high_gain",
  "Line 6 Oblivion": "modern_high_gain",

  // ── Originals with no clear lineage ─────────────────────────────────
  Cartographer: "other",
  "Line 6 Elmsley": "other",
  "Line 6 Clarity": "other",
  "Line 6 Aristocrat": "other",
  "Line 6 Carillon": "other",
  "Line 6 Voltage": "other",
  "Line 6 Ventoux": "other",
  "Studio Tube Pre": "other",
};

/**
 * Bass amp models. Classified "other" for family purposes and excluded from
 * base-amp candidacy so a bass amp never gets proposed for a guitar set.
 */
export const BASS_AMP_MODELS: readonly string[] = [
  "Ampeg B-15NF",
  "Ampeg SVT Nrm",
  "Ampeg SVT Brt",
  "Ampeg SVT-4 PRO",
  "Agua Sledge",
  "Agua 51",
  "Mandarin 200",
  "Cali Bass",
  "Cali 400 Ch1",
  "Cali 400 Ch2",
  "G Cougar 800",
  "Del Sol 300",
  "Woody Blue",
  "Busy One",
  "Busy One Ch1",
  "Busy One Ch2",
  "Busy One Jump",
  "MOO)))N Ch1",
  "MOO)))N Ch2",
  "MOO)))N Jump",
];

function normalizeAmpKey(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const FAMILY_INDEX: Record<string, AmpFamily> = (() => {
  const index: Record<string, AmpFamily> = {};
  for (const [name, family] of Object.entries(AMP_MODEL_FAMILIES)) {
    index[normalizeAmpKey(name)] = family;
  }
  for (const name of BASS_AMP_MODELS) {
    index[normalizeAmpKey(name)] = "other";
  }
  // Also answer to raw .hlx model IDs: HD2_AmpUSDoubleNrm -> "usdoublenrm".
  for (const [name, family] of Object.entries(AMP_MODEL_FAMILIES)) {
    index[normalizeAmpKey(`HD2_Amp${name}`)] = family;
    index[normalizeAmpKey(`HD2_Preamp${name}`)] = family;
  }
  return index;
})();

const BASS_SET = new Set(BASS_AMP_MODELS.map(normalizeAmpKey));

/** Family for a display name or .hlx model ID; undefined if we don't know it. */
export function ampFamilyOf(model: string): AmpFamily | undefined {
  if (!model) return undefined;
  const direct = FAMILY_INDEX[normalizeAmpKey(model)];
  if (direct) return direct;
  const stripped = model.replace(/^(?:HD2|VIC|L6SPB)_(?:Preamp|Amp)?/, "");
  return FAMILY_INDEX[normalizeAmpKey(stripped)];
}

export function isBassAmp(model: string): boolean {
  const stripped = model.replace(/^(?:HD2|VIC|L6SPB)_(?:Preamp|Amp)?/, "");
  return (
    BASS_SET.has(normalizeAmpKey(model)) || BASS_SET.has(normalizeAmpKey(stripped))
  );
}

/* ------------------------------------------------------------------ */
/*  Substitution affinity                                              */
/* ------------------------------------------------------------------ */

/**
 * How well family A stands in for family B, 0..1. Editorial, not measured.
 * 1.0 is the same family; 0.8+ means most listeners won't flag the swap in a
 * band mix; 0.5-0.7 means "gets you there with a drive block and an EQ move";
 * below 0.4 means don't pretend.
 *
 * Only one direction of each pair is listed; the table is symmetrised below.
 */
const AFFINITY_PAIRS: Array<[AmpFamily, AmpFamily, number]> = [
  ["vox", "ac_boutique", 0.88],
  ["vox", "marshall_plexi", 0.55],
  ["vox", "fender_blackface", 0.45],
  ["vox", "hiwatt", 0.5],
  ["vox", "dumble_style", 0.45],

  ["ac_boutique", "marshall_plexi", 0.55],
  ["ac_boutique", "fender_blackface", 0.55],
  ["ac_boutique", "dumble_style", 0.55],
  ["ac_boutique", "hiwatt", 0.5],

  ["fender_blackface", "fender_tweed", 0.6],
  ["fender_blackface", "bassman", 0.6],
  ["fender_blackface", "champ", 0.45],
  ["fender_blackface", "dumble_style", 0.65],
  ["fender_blackface", "hiwatt", 0.65],

  ["fender_tweed", "bassman", 0.8],
  ["fender_tweed", "champ", 0.72],
  ["fender_tweed", "marshall_plexi", 0.5],

  ["bassman", "marshall_plexi", 0.68],
  ["bassman", "champ", 0.5],

  ["marshall_plexi", "marshall_jcm", 0.78],
  ["marshall_plexi", "hiwatt", 0.62],
  ["marshall_plexi", "orange", 0.6],
  ["marshall_plexi", "dumble_style", 0.5],

  ["marshall_jcm", "modern_high_gain", 0.62],
  ["marshall_jcm", "recto", 0.5],
  ["marshall_jcm", "orange", 0.55],
  ["marshall_jcm", "mesa_mark", 0.5],

  ["recto", "modern_high_gain", 0.78],
  ["recto", "mesa_mark", 0.6],
  ["recto", "orange", 0.45],

  ["mesa_mark", "modern_high_gain", 0.72],

  ["hiwatt", "dumble_style", 0.5],

  ["dumble_style", "modern_high_gain", 0.4],
];

const AFFINITY: Partial<Record<AmpFamily, Partial<Record<AmpFamily, number>>>> =
  (() => {
    const table: Partial<Record<AmpFamily, Partial<Record<AmpFamily, number>>>> =
      {};
    const set = (a: AmpFamily, b: AmpFamily, v: number) => {
      const row = table[a] ?? (table[a] = {});
      row[b] = v;
    };
    for (const [a, b, v] of AFFINITY_PAIRS) {
      set(a, b, v);
      set(b, a, v);
    }
    return table;
  })();

/** How well `candidate` covers a song that wants `wanted`. 0..1. */
export function familyAffinity(
  candidate: AmpFamily,
  wanted: AmpFamily,
): number {
  if (candidate === wanted) return 1;
  // "other" and "acoustic" are deliberately not substitutable.
  if (candidate === "other" || wanted === "other") return 0.2;
  if (candidate === "acoustic" || wanted === "acoustic") return 0.1;
  return AFFINITY[candidate]?.[wanted] ?? 0.25;
}

/* ------------------------------------------------------------------ */
/*  Base amp selection                                                 */
/* ------------------------------------------------------------------ */

export interface BaseAmpCandidateScore {
  amp: string;
  family: AmpFamily;
  /** Mean affinity across the requested models, 0..1. */
  score: number;
}

export interface BaseAmpPick {
  /** Helix display name of the amp to build the preset around. */
  amp: string;
  family: AmpFamily;
  /** Mean affinity across the requested models, 0..1. */
  score: number;
  /** Requested models this base covers convincingly (affinity >= 0.7). */
  covered: string[];
  /** Requested models it covers with effort — expect a drive/EQ move (0.4-0.7). */
  compromised: string[];
  /** Requested models it genuinely cannot do (< 0.4). Consider a 2nd amp block. */
  uncovered: string[];
  /** Requested names we could not resolve to any known amp model. */
  unknown: string[];
  /** Next-best options, for a UI that wants to offer a choice. */
  runnersUp: BaseAmpCandidateScore[];
  rationale: string;
}

const FALLBACK_BASE_AMP = "Essex A30";

const CANONICAL_BY_KEY: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const name of Object.keys(AMP_MODEL_FAMILIES)) {
    map[normalizeAmpKey(name)] = name;
    map[normalizeAmpKey(`HD2_Amp${name}`)] = name;
    map[normalizeAmpKey(`HD2_Preamp${name}`)] = name;
  }
  return map;
})();

/**
 * Canonical Line 6 display name for a display name or .hlx model ID, so that
 * "HD2_AmpEssexA30" and "essex a30" both become "Essex A30".
 */
export function canonicalAmpName(model: string): string | undefined {
  if (!model) return undefined;
  const direct = CANONICAL_BY_KEY[normalizeAmpKey(model)];
  if (direct) return direct;
  const stripped = model.replace(/^(?:HD2|VIC|L6SPB)_(?:Preamp|Amp)?/, "");
  return CANONICAL_BY_KEY[normalizeAmpKey(stripped)];
}

function candidatePool(requested: string[]): string[] {
  const pool = new Set<string>();
  for (const profile of Object.values(AMP_FAMILIES)) {
    for (const amp of profile.recommendedBases) pool.add(amp);
  }
  for (const model of requested) {
    const canonical = canonicalAmpName(model);
    if (canonical && !isBassAmp(canonical)) pool.add(canonical);
  }
  return [...pool];
}

/**
 * Pick the single amp to build a Set Pack around.
 *
 * Scoring is the mean substitution affinity from the candidate's family to
 * every requested model's family, with two nudges: a small bonus if the
 * candidate is one of the amps the set actually asked for (players trust a
 * name they recognise), and a DSP tiebreak so that between two equally good
 * amps we pick the cheaper one and leave room for reverb.
 *
 * Bass amps are never proposed. Requested models we don't recognise are
 * reported in `unknown` and excluded from scoring rather than silently
 * dragging the score down.
 */
export function pickBaseAmp(models: string[]): BaseAmpPick {
  const unknown: string[] = [];
  const wanted: Array<{ model: string; family: AmpFamily }> = [];

  for (const model of models) {
    const family = ampFamilyOf(model);
    if (!family) {
      unknown.push(model);
      continue;
    }
    wanted.push({ model, family });
  }

  if (wanted.length === 0) {
    return {
      amp: FALLBACK_BASE_AMP,
      family: AMP_MODEL_FAMILIES[FALLBACK_BASE_AMP],
      score: 0,
      covered: [],
      compromised: [],
      uncovered: [],
      unknown,
      runnersUp: [],
      rationale:
        models.length === 0
          ? `No amps requested. Defaulting to ${FALLBACK_BASE_AMP}, the most broadly useful clean platform in the box.`
          : `None of the requested amps (${models.join(", ")}) resolved to a known Helix model. Defaulting to ${FALLBACK_BASE_AMP} — verify the model names against docs/TONE_ENGINEERING_BIBLE.md §3.`,
    };
  }

  const requestedNames = new Set(
    wanted
      .map((w) => canonicalAmpName(w.model))
      .filter((name): name is string => Boolean(name)),
  );

  const scored: BaseAmpCandidateScore[] = candidatePool(models)
    .map((amp) => {
      const family = AMP_MODEL_FAMILIES[amp];
      const mean =
        wanted.reduce((sum, w) => sum + familyAffinity(family, w.family), 0) /
        wanted.length;
      const familiarityBonus = requestedNames.has(amp) ? 0.04 : 0;
      return { amp, family, score: Math.min(1, mean + familiarityBonus) };
    })
    .sort((a, b) => {
      if (Math.abs(b.score - a.score) > 0.001) return b.score - a.score;
      const costA = lookupDspCost(a.amp)?.mono ?? 100;
      const costB = lookupDspCost(b.amp)?.mono ?? 100;
      if (Math.abs(costA - costB) > 0.01) return costA - costB;
      return a.amp.localeCompare(b.amp);
    });

  const best = scored[0];
  const covered: string[] = [];
  const compromised: string[] = [];
  const uncovered: string[] = [];

  for (const w of wanted) {
    const affinity = familyAffinity(best.family, w.family);
    if (affinity >= 0.7) covered.push(w.model);
    else if (affinity >= 0.4) compromised.push(w.model);
    else uncovered.push(w.model);
  }

  const profile = AMP_FAMILIES[best.family];
  const parts: string[] = [
    `${best.amp} (${profile.label}) covers ${covered.length}/${wanted.length} requested amps outright.`,
  ];
  if (compromised.length > 0) {
    parts.push(
      `${compromised.join(", ")} ${compromised.length === 1 ? "is" : "are"} reachable from it with a drive block and an EQ move.`,
    );
  }
  if (uncovered.length > 0) {
    parts.push(
      `${uncovered.join(", ")} ${uncovered.length === 1 ? "is" : "are"} genuinely out of reach — either accept the substitution or spend a second amp block (Helix Floor/LT/Rack only; on an HX Stomp a second amp costs roughly a third of the whole DSP budget).`,
    );
  }
  if (unknown.length > 0) {
    parts.push(`Unrecognised model name(s) ignored: ${unknown.join(", ")}.`);
  }
  const cost = lookupDspCost(best.amp);
  if (cost) {
    parts.push(
      `DSP: ${cost.mono}% as a full amp block, ${cost.preamp ?? "n/a"}% as a Preamp-only block.`,
    );
  }

  return {
    amp: best.amp,
    family: best.family,
    score: Math.round(best.score * 1000) / 1000,
    covered,
    compromised,
    uncovered,
    unknown,
    runnersUp: scored.slice(1, 4),
    rationale: parts.join(" "),
  };
}
