/**
 * Helix / HX family DSP cost model.
 *
 * WHY THIS EXISTS
 * ---------------
 * Line 6 never publishes DSP cost per model. The device just greys out
 * anything that won't fit ("Grayed out items cannot be accommodated and are
 * skipped over" — Helix 3.80 Owner's Manual, "Dynamic DSP"). That is fine
 * when a human is standing at the pedal, and useless when we are generating
 * .hlx presets server-side. Set Builder needs to know *before* it writes a
 * file whether the chain will load on the player's device.
 *
 * WHAT THE NUMBERS MEAN
 * ---------------------
 * Every cost below is a PERCENTAGE OF ONE DSP. It is a relative allocation,
 * not an absolute measure of processing horsepower:
 *
 *   "The values in the tables below are the upper limit of DSP reserved for
 *    each block. The numbers are not an indication of the processing
 *    horsepower required but only describe how much DSP is 'blocked out' by
 *    Line 6 when determining how many blocks to allow in a preset."
 *    — Ben Vesco, Helix DSP Allocations (firmware 3.80.0)
 *
 * One DSP == 100 units. Helix Floor / LT / Rack have two SHARC DSPs, one per
 * primary path, and DSP CANNOT be shared across paths:
 *
 *   "Each of Helix's two primary paths utilizes its own DSP. If all of your
 *    blocks are on paths 1A and 1B, you're only using half its horsepower!"
 *    — Helix 3.80 Owner's Manual, "Tips to Optimize DSP"
 *
 * HX Stomp / Stomp XL / HX Effects have one SHARC and therefore one 100-unit
 * budget. HX Effects and HX Stomp are confirmed by Line 6 forum staff to have
 * "the exact same processor and the same DSP allocation".
 *
 * CONFIDENCE
 * ----------
 *   "measured"  — we (or a cited source) reproduced the number on hardware.
 *                 Nothing in this file is marked measured yet. Do not fake it.
 *   "reported"  — from Ben Vesco's community table (3.80.0), the most complete
 *                 dataset in existence, derived by iterative trial and error
 *                 against real units and acknowledged by Line 6 staff on the
 *                 official forum. Treat as good to ~1 unit, not gospel.
 *   "estimated" — our own inference, flagged inline. Treat as a hint only.
 *
 * Sources are listed in docs/HELIX_DSP_BUDGET.md. Firmware baseline: 3.80.
 * These allocations change between firmware releases (3.50's new cab engine
 * cut cab cost from 9.60 to 3.33; 3.10's oversampling bump raised amp cost).
 * Re-verify after every major Line 6 firmware release.
 */

/** How much we trust a given cost number. */
export type DspConfidence = "measured" | "reported" | "estimated";

export type DspBlockCategory =
  | "amp"
  | "amp_bass"
  | "preamp"
  | "cab"
  | "ir"
  | "distortion"
  | "dynamics"
  | "eq"
  | "filter"
  | "looper"
  | "modulation"
  | "delay"
  | "reverb"
  | "pitch"
  | "wah"
  | "volume_pan";

export interface DspCost {
  category: DspBlockCategory;
  /** Cost of the mono version, as a percentage of one DSP. */
  mono: number;
  /**
   * Cost of the stereo version. Roughly 2x mono for most effects.
   *
   * Some models only exist in one width — the rotaries are stereo-only, Poly
   * Detune is mono-only. Where the source table has no value for a width, we
   * repeat the width that does exist rather than inventing one, so `mono` and
   * `stereo` being equal usually means "there is only one version of this
   * block". That errs conservative: you never under-count.
   */
  stereo: number;
  /**
   * Amps only: cost of the Preamp-only variant of the same model. Always
   * cheaper than the full Amp block — this is the single biggest DSP lever
   * available when a chain doesn't fit.
   */
  preamp?: number;
  /**
   * True for the blocks Line 6 caps at one per path (Helix) or one per preset
   * (HX Stomp / Stomp XL) regardless of remaining DSP: Feedbacker, Poly
   * Sustain, Poly Detune, Poly Pitch, Poly Wham, Poly Capo, 12 String.
   */
  poly?: boolean;
  /** Model lives in the Legacy subcategory (M-series / DL4 / DM4 / FM4 / MM4). */
  legacy?: boolean;
  /** Internal .hlx model ID, where we have verified it from a real preset. */
  modelId?: string;
  /** Real-world gear the model is based on, as labelled by the source table. */
  basedOn?: string;
  confidence: DspConfidence;
}

/** One DSP chip's total budget, in the same units as every cost below. */
export const DSP_BUDGET_PER_CHIP = 100;

/**
 * Cost of a single Cab block on the 3.50+ cab engine, mono. Amp+Cab blocks
 * are modelled as (full amp cost + this). Dual cabs cost roughly 2x.
 */
export const CAB_NEW_SINGLE_MONO = 3.33;
export const CAB_NEW_SINGLE_STEREO = 6.67;

/**
 * Every preset, on every device in the family, is capped at 64 controller
 * assignments — and snapshot-varying parameters count against that cap:
 *
 *   "Each preset can have up to 64 controller assignments, including
 *    parameters controlled by Snapshots. If you attempt to add a 65th,
 *    'Too many controller assignments!' appears in the header."
 *    — Helix 3.80 Owner's Manual, "Controller Assign"
 *
 * This is a per-PARAMETER cap, not per-snapshot: one parameter that varies
 * across all 8 snapshots costs ONE assignment, not eight. Block bypass states
 * are stored per-snapshot for free and do NOT consume an assignment. Wah and
 * Volume on EXP 1 / EXP 2 occupy two of the 64 by default.
 */
export const CONTROLLER_ASSIGNMENT_CAP = 64;

/* ------------------------------------------------------------------ */
/*  Per-model costs                                                    */
/* ------------------------------------------------------------------ */

/**
 * Keyed by canonical Line 6 display name, matching the naming used in
 * docs/TONE_ENGINEERING_BIBLE.md §3 and src/lib/helix/model-map.ts.
 * Legacy-subcategory models are suffixed " (Legacy)" to disambiguate them
 * from the HX model of the same name (e.g. "Ping Pong" vs
 * "Ping Pong (Legacy)", "Plate (Legacy)" — note that the reverb our recipes
 * call "Plate" IS the Legacy one, model ID HD2_ReverbPlate).
 *
 * Use lookupDspCost() rather than indexing this directly: it also resolves
 * model IDs and is insensitive to case and punctuation.
 */
export const DSP_COSTS: Record<string, DspCost> = {
  "WhoWatt 100": { category: "amp", mono: 35.05, stereo: 35.05, preamp: 19.96, modelId: "HD2_AmpWhoWatt100", basedOn: "Hiwatt® DR-103 Brill", confidence: "reported" },
  "Soup Pro": { category: "amp", mono: 19.41, stereo: 19.41, preamp: 18.28, modelId: "HD2_AmpSoupPro", basedOn: "Supro® S6616", confidence: "reported" },
  "Stone Age 185": { category: "amp", mono: 33.79, stereo: 33.79, preamp: 19.24, modelId: "HD2_AmpStoneAge185", basedOn: "Gibson® EH-185", confidence: "reported" },
  "Voltage Queen": { category: "amp", mono: 34.8, stereo: 34.8, preamp: 21.87, modelId: "HD2_AmpVoltageQueen", basedOn: "Victoria® Electro King", confidence: "reported" },
  "Tweed Blues Nrm": { category: "amp", mono: 31.01, stereo: 31.01, preamp: 16.08, modelId: "HD2_AmpTweedBluesNrm", basedOn: "Fender® Bassman® (normal channel)", confidence: "reported" },
  "Tweed Blues Brt": { category: "amp", mono: 30.99, stereo: 30.99, preamp: 16.08, modelId: "HD2_AmpTweedBluesBrt", basedOn: "Fender® Bassman® (bright channel)", confidence: "reported" },
  "Fullerton Nrm": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 16, basedOn: "1958 Fender® 5C3 Tweed Deluxe (normal channel)", confidence: "reported" },
  "Fullerton Brt": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 16, basedOn: "1958 Fender® 5C3 Tweed Deluxe (bright channel)", confidence: "reported" },
  "Fullerton Jump": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 21.33, basedOn: "1958 Fender® 5C3 Tweed Deluxe (jumped channel)", confidence: "reported" },
  "Grammatico Nrm": { category: "amp", mono: 39, stereo: 39, preamp: 18.67, basedOn: "2016 Grammatico LaGrange (normal channel)", confidence: "reported" },
  "Grammatico Brt": { category: "amp", mono: 39, stereo: 39, preamp: 18.67, basedOn: "2016 Grammatico LaGrange (bright channel)", confidence: "reported" },
  "Grammatico Jump": { category: "amp", mono: 39, stereo: 39, preamp: 24.67, basedOn: "2016 Grammatico LaGrange (jumped channels)", confidence: "reported" },
  "US Small Tweed": { category: "amp", mono: 16.12, stereo: 16.12, preamp: 15.83, basedOn: "Fender® Champ®", confidence: "reported" },
  "US Princess": { category: "amp", mono: 33.33, stereo: 33.33, preamp: 20, modelId: "HD2_AmpUSPrincess", basedOn: "Fender® Princeton Reverb", confidence: "reported" },
  "US Super Nrm": { category: "amp", mono: 29.33, stereo: 29.33, preamp: 17.33, basedOn: "Fender® Super Reverb (normal channel)", confidence: "reported" },
  "US Super Vib": { category: "amp", mono: 33.33, stereo: 33.33, preamp: 20, basedOn: "Fender® Super Reverb (vibrato channel)", confidence: "reported" },
  "US Deluxe Nrm": { category: "amp", mono: 29.63, stereo: 29.63, preamp: 13.55, modelId: "HD2_AmpUSDeluxeNrm", basedOn: "Fender® Deluxe Reverb® (normal channel)", confidence: "reported" },
  "US Deluxe Vib": { category: "amp", mono: 33.61, stereo: 33.61, preamp: 19.55, modelId: "HD2_AmpUSDeluxeVib", basedOn: "Fender® Deluxe Reverb® (vibrato channel)", confidence: "reported" },
  "US Double Nrm": { category: "amp", mono: 30.99, stereo: 30.99, preamp: 16.01, modelId: "HD2_AmpUSDoubleNrm", basedOn: "Fender® Twin Reverb® (normal channel)", confidence: "reported" },
  "US Double Vib": { category: "amp", mono: 33.32, stereo: 33.32, preamp: 18.76, modelId: "HD2_AmpUSDoubleVib", basedOn: "Fender® Twin Reverb® (vibrato channel)", confidence: "reported" },
  "Mail Order Twin": { category: "amp", mono: 33.35, stereo: 33.35, preamp: 22.27, modelId: "HD2_AmpMailOrderTwin", basedOn: "Silvertone® 1484", confidence: "reported" },
  "Divided Duo": { category: "amp", mono: 28.73, stereo: 28.73, preamp: 16.16, modelId: "HD2_AmpDividedDuo", basedOn: "÷13 JRT 9/15", confidence: "reported" },
  "Interstate Zed": { category: "amp", mono: 28.17, stereo: 28.17, preamp: 14.05, modelId: "HD2_AmpInterstateZed", basedOn: "Dr Z® Route 66", confidence: "reported" },
  "Derailed Ingrid": { category: "amp", mono: 33.67, stereo: 33.67, preamp: 18.8, modelId: "HD2_AmpDerailedIngrid", basedOn: "Trainwreck Circuits® Express", confidence: "reported" },
  "Grammatico GSG": { category: "amp", mono: 41.33, stereo: 41.33, preamp: 29.33, basedOn: "Grammatico GSG100", confidence: "reported" },
  "Jazz Rivet 120": { category: "amp", mono: 17.15, stereo: 17.15, preamp: 10.31, modelId: "HD2_AmpJazzRivet120", basedOn: "Roland® JC-120 Jazz Chorus", confidence: "reported" },
  "Essex A15": { category: "amp", mono: 27.32, stereo: 27.32, preamp: 14.8, modelId: "HD2_AmpEssexA15", basedOn: "Vox® AC-15", confidence: "reported" },
  "Essex A30": { category: "amp", mono: 30.32, stereo: 30.32, preamp: 16.05, modelId: "HD2_AmpEssexA30", basedOn: "Vox® AC-30 with top boost", confidence: "reported" },
  "A30 Fawn Nrm": { category: "amp", mono: 25.73, stereo: 25.73, preamp: 13.23, modelId: "HD2_AmpA30FawnNrm", basedOn: "Vox® AC-30 Fawn (normal channel)", confidence: "reported" },
  "A30 Fawn Brt": { category: "amp", mono: 25.83, stereo: 25.83, preamp: 13.43, modelId: "HD2_AmpA30FawnBrt", basedOn: "Vox® AC-30 Fawn (bright channel)", confidence: "reported" },
  "Matchstick Ch1": { category: "amp", mono: 28.67, stereo: 28.67, preamp: 14.53, modelId: "HD2_AmpMatchstickCh1", basedOn: "Matchless® DC30 (channel 1)", confidence: "reported" },
  "Matchstick Ch2": { category: "amp", mono: 27.67, stereo: 27.67, preamp: 13.67, modelId: "HD2_AmpMatchstickCh2", basedOn: "Matchless® DC30 (channel 2)", confidence: "reported" },
  "Matchstick Jump": { category: "amp", mono: 35.87, stereo: 35.87, preamp: 21.67, basedOn: "Matchless® DC30 (jumped)", confidence: "reported" },
  "Mandarin 80": { category: "amp", mono: 34.77, stereo: 34.77, preamp: 17.89, modelId: "HD2_AmpMandarin80", basedOn: "Orange® OR80", confidence: "reported" },
  "Mandarin Rocker": { category: "amp", mono: 38.33, stereo: 38.33, preamp: 17.89, modelId: "HD2_AmpMandarinRocker", basedOn: "Orange® Rockerverb", confidence: "reported" },
  "MOO)))N Ch1": { category: "amp", mono: 35.33, stereo: 35.33, preamp: 22.67, basedOn: "Sunn Model T (normal channel)", confidence: "reported" },
  "MOO)))N Ch2": { category: "amp", mono: 35.33, stereo: 35.33, preamp: 21.33, basedOn: "Sunn Model T (bright channel)", confidence: "reported" },
  "MOO)))N Jump": { category: "amp", mono: 38, stereo: 38, preamp: 25.33, modelId: "HD2_AmpMoonJump", basedOn: "Sunn Model T (jumped)", confidence: "reported" },
  "Brit J45 Nrm": { category: "amp", mono: 32.37, stereo: 32.37, preamp: 17.97, modelId: "HD2_AmpBritJ45Nrm", basedOn: "Marshall® JTM-45 (normal channel)", confidence: "reported" },
  "Brit J45 Brt": { category: "amp", mono: 32.37, stereo: 32.37, preamp: 17.93, modelId: "HD2_AmpBritJ45Brt", basedOn: "Marshall® JTM-45 (bright channel)", confidence: "reported" },
  "Brit Trem Nrm": { category: "amp", mono: 35.33, stereo: 35.33, preamp: 20.87, basedOn: "Marshall® Plexi Tremolo 50 (normal channel)", confidence: "reported" },
  "Brit Trem Brt": { category: "amp", mono: 35.33, stereo: 35.33, preamp: 20.87, modelId: "HD2_AmpBritTremBrt", basedOn: "Marshall® Plexi Tremolo 50 (bright channel)", confidence: "reported" },
  "Brit Trem Jump": { category: "amp", mono: 39.2, stereo: 39.2, preamp: 24.8, basedOn: "Marshall® Plexi Tremolo 50 (jumped)", confidence: "reported" },
  "Brit Plexi Nrm": { category: "amp", mono: 36.05, stereo: 36.05, preamp: 17.57, modelId: "HD2_AmpBritPlexiNrm", basedOn: "Marshall® Super Lead 100 (normal channel)", confidence: "reported" },
  "Brit Plexi Brt": { category: "amp", mono: 36.8, stereo: 36.8, preamp: 22.83, modelId: "HD2_AmpBritPlexiBrt", basedOn: "Marshall® Super Lead 100 (bright channel)", confidence: "reported" },
  "Brit Plexi Jump": { category: "amp", mono: 41.23, stereo: 41.23, preamp: 27.24, modelId: "HD2_AmpBritPlexiJump", basedOn: "Marshall® Super Lead 100 (jumped)", confidence: "reported" },
  "Brit P75 Nrm": { category: "amp", mono: 32.51, stereo: 32.51, preamp: 17.57, modelId: "HD2_AmpBritP75Nrm", basedOn: "Park® 75 (normal channel)", confidence: "reported" },
  "Brit P75 Brt": { category: "amp", mono: 32.51, stereo: 32.51, preamp: 17.57, modelId: "HD2_AmpBritP75Brt", basedOn: "Park® 75 (bright channel)", confidence: "reported" },
  "Brit 2203": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 26, modelId: "HD2_AmpBrit2203", basedOn: "Marshall JCM800 2203", confidence: "reported" },
  "Brit 2204": { category: "amp", mono: 35.41, stereo: 35.41, preamp: 24.61, modelId: "HD2_AmpBrit2204", basedOn: "Marshall® JCM-800", confidence: "reported" },
  "Placater Clean": { category: "amp", mono: 27.33, stereo: 27.33, preamp: 14, modelId: "HD2_AmpPlacaterClean", basedOn: "Friedman BE-100 (clean channel)", confidence: "reported" },
  "Placater Dirty": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 24.67, modelId: "HD2_AmpPlacaterDirty", basedOn: "Friedman BE-100 (BE/HBE channel)", confidence: "reported" },
  "Cartographer": { category: "amp", mono: 34, stereo: 34, preamp: 22.13, modelId: "HD2_AmpCartographer", basedOn: "Ben Adrian Cartographer", confidence: "reported" },
  "German Xtra Blue": { category: "amp", mono: 36, stereo: 36, preamp: 22.67, basedOn: "Bogner Ecstasy 101B (EL34) (blue channel)", confidence: "reported" },
  "German Xtra Red": { category: "amp", mono: 38.67, stereo: 38.67, preamp: 26.67, basedOn: "Bogner Ecstasy 101B (EL34) (red channel)", confidence: "reported" },
  "German Mahadeva": { category: "amp", mono: 37.69, stereo: 37.69, preamp: 23.35, modelId: "HD2_AmpGermanMahadeva", basedOn: "Bogner® Shiva", confidence: "reported" },
  "German Ubersonic": { category: "amp", mono: 34.97, stereo: 34.97, preamp: 19.35, basedOn: "Bogner® Überschall®", confidence: "reported" },
  "Cali Texas Ch1": { category: "amp", mono: 33.33, stereo: 33.33, preamp: 20, modelId: "HD2_AmpCaliTexasCh1", basedOn: "MESA/Boogie® Lonestar (channel 1)", confidence: "reported" },
  "Cali Texas Ch2": { category: "amp", mono: 37.33, stereo: 37.33, preamp: 24, basedOn: "MESA/Boogie® Lonestar (channel 2)", confidence: "reported" },
  "Cali IV Rhyth 1": { category: "amp", mono: 34.67, stereo: 34.67, preamp: 19, basedOn: "MESA/Boogie® Mark IV (channel I)", confidence: "reported" },
  "Cali IV Rhyth 2": { category: "amp", mono: 34.67, stereo: 34.67, preamp: 19, basedOn: "MESA/Boogie® Mark IV (channel II)", confidence: "reported" },
  "Cali IV Lead": { category: "amp", mono: 36.67, stereo: 36.67, preamp: 21, modelId: "HD2_AmpCaliIVLead", basedOn: "MESA/Boogie® Mark IV (lead channel)", confidence: "reported" },
  "Cali Rectifire": { category: "amp", mono: 35.63, stereo: 35.63, preamp: 23.67, modelId: "HD2_AmpCaliRectifire", basedOn: "MESA/Boogie® Dual Recti er®", confidence: "reported" },
  "Archetype Clean": { category: "amp", mono: 30.73, stereo: 30.73, preamp: 17.67, modelId: "HD2_AmpArchetypeClean", basedOn: "Paul Reed Smith® Archon® (clean channel)", confidence: "reported" },
  "Archetype Lead": { category: "amp", mono: 34, stereo: 34, preamp: 21, modelId: "HD2_AmpArchetypeLead", basedOn: "Paul Reed Smith® Archon® (lead channel)", confidence: "reported" },
  "ANGL Meteor": { category: "amp", mono: 33.33, stereo: 33.33, preamp: 22.87, modelId: "HD2_AmpANGLMeteor", basedOn: "ENGL® Fireball 100", confidence: "reported" },
  "Solo Lead Clean": { category: "amp", mono: 33.84, stereo: 33.84, preamp: 19.2, basedOn: "Soldano SLO-100 (clean channel)", confidence: "reported" },
  "Solo Lead Crunch": { category: "amp", mono: 33.84, stereo: 33.84, preamp: 19.2, basedOn: "Soldano SLO-100 (crunch channel)", confidence: "reported" },
  "Solo Lead OD": { category: "amp", mono: 38.08, stereo: 38.08, preamp: 23.41, modelId: "HD2_AmpSoloLeadOD", basedOn: "Soldano SLO-100 (overdrive channel)", confidence: "reported" },
  "EV Panama Blue": { category: "amp", mono: 40, stereo: 40, preamp: 29.33, basedOn: "EVH 5150III 100 [6L6] (Blue channel)", confidence: "reported" },
  "EV Panama Red": { category: "amp", mono: 49.33, stereo: 49.33, preamp: 38.67, basedOn: "EVH 5150III 100 [6L6] (Red channel)", confidence: "reported" },
  "PV Panama": { category: "amp", mono: 34.57, stereo: 34.57, preamp: 20.39, modelId: "HD2_AmpPVPanama", basedOn: "Peavey® 5150®", confidence: "reported" },
  "PV Vitriol Clean": { category: "amp", mono: 41.33, stereo: 41.33, preamp: 29.33, basedOn: "Peavey Invective (clean channel)", confidence: "reported" },
  "PV Vitriol Crunch": { category: "amp", mono: 49.33, stereo: 49.33, preamp: 35.33, basedOn: "Peavey Invective (crunch channel)", confidence: "reported" },
  "PV Vitriol Lead": { category: "amp", mono: 49.33, stereo: 49.33, preamp: 35.33, modelId: "HD2_AmpPVVitriolLead", basedOn: "Peavey Invective (lead channel)", confidence: "reported" },
  "Revv Gen Purple": { category: "amp", mono: 38.67, stereo: 38.67, preamp: 26.67, modelId: "HD2_AmpRevvGenPurple", basedOn: "Revv® Generator 120 (purple channel)", confidence: "reported" },
  "Revv Gen Red": { category: "amp", mono: 38.67, stereo: 38.67, preamp: 26.67, modelId: "HD2_AmpRevvGenRed", basedOn: "Revv® Generator 120 (red channel)", confidence: "reported" },
  "Das Benzin Mega": { category: "amp", mono: 33.33, stereo: 33.33, preamp: 21.33, modelId: "HD2_AmpDasBenzinMega", basedOn: "Diezel VH4 (mega channel)", confidence: "reported" },
  "Das Benzin Lead": { category: "amp", mono: 40, stereo: 40, preamp: 24.67, basedOn: "Diezel VH4 (lead channel)", confidence: "reported" },
  "Line 6 Clarity": { category: "amp", mono: 22.67, stereo: 22.67, preamp: 22, modelId: "HD2_AmpLine6Clarity", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Aristocrat": { category: "amp", mono: 31.33, stereo: 31.33, preamp: 31.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Carillon": { category: "amp", mono: 30, stereo: 30, preamp: 30, basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Voltage": { category: "amp", mono: 34, stereo: 34, preamp: 34, basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Kinetic": { category: "amp", mono: 30, stereo: 30, preamp: 30, modelId: "HD2_AmpLine6Kinetic", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Oblivion": { category: "amp", mono: 36, stereo: 36, preamp: 35.33, modelId: "HD2_AmpLine6Oblivion", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Ventoux": { category: "amp", mono: 24, stereo: 24, preamp: 24, modelId: "HD2_AmpLine6Ventoux", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Elmsley": { category: "amp", mono: 41.33, stereo: 41.33, preamp: 24, modelId: "HD2_AmpLine6Elmsley", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Elektrik": { category: "amp", mono: 23.93, stereo: 23.93, preamp: 18.83, modelId: "HD2_AmpLine6Elektrik", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Doom": { category: "amp", mono: 30.53, stereo: 30.53, preamp: 19.4, basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Epic": { category: "amp", mono: 27.93, stereo: 27.93, preamp: 23.01, modelId: "HD2_AmpLine6Epic", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 2204 Mod": { category: "amp", mono: 27.67, stereo: 27.67, preamp: 24.4, modelId: "HD2_AmpLine62204Mod", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Fatality": { category: "amp", mono: 29.13, stereo: 29.13, preamp: 23.99, basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Litigator": { category: "amp", mono: 22.67, stereo: 22.67, preamp: 22.47, modelId: "HD2_AmpLine6Litigator", basedOn: "Line 6 Original", confidence: "reported" },
  "Line 6 Badonk": { category: "amp", mono: 21.67, stereo: 21.67, preamp: 22, modelId: "HD2_AmpLine6Badonk", basedOn: "Line 6 Original", confidence: "reported" },
  "Ampeg B-15NF": { category: "amp_bass", mono: 28.29, stereo: 28.29, preamp: 15.08, basedOn: "Ampeg® B-15NF Porta ex®", confidence: "reported" },
  "Ampeg SVT Nrm": { category: "amp_bass", mono: 35.56, stereo: 35.56, preamp: 24.87, basedOn: "Ampeg® SVT® (normal channel)", confidence: "reported" },
  "Ampeg SVT Brt": { category: "amp_bass", mono: 35.47, stereo: 35.47, preamp: 24.73, basedOn: "Ampeg® SVT® (bright channel)", confidence: "reported" },
  "Ampeg SVT-4 PRO": { category: "amp_bass", mono: 22, stereo: 22, preamp: 21.8, basedOn: "Ampeg® SVT-4 PRO", confidence: "reported" },
  "US Dripman Nrm": { category: "amp_bass", mono: 33.33, stereo: 33.33, preamp: 22, basedOn: "Fender Bassman (Silver Panel)", confidence: "reported" },
  "Woody Blue": { category: "amp_bass", mono: 14.67, stereo: 14.67, preamp: 11, modelId: "HD2_AmpWoodyBlue", basedOn: "Acoustic® 360 bass amp", confidence: "reported" },
  "Agua Sledge": { category: "amp_bass", mono: 13.33, stereo: 13.33, preamp: 13.33, modelId: "HD2_AmpAguaSledge", basedOn: "Aguilar Tone Hammer", confidence: "reported" },
  "Agua 51": { category: "amp_bass", mono: 25.33, stereo: 25.33, preamp: 25.2, modelId: "HD2_AmpAgua51", basedOn: "Aguilar® DB751", confidence: "reported" },
  "Mandarin 200": { category: "amp_bass", mono: 29.33, stereo: 29.33, preamp: 18, basedOn: "Orange AD200 MkIII", confidence: "reported" },
  "Cali Bass": { category: "amp_bass", mono: 15.29, stereo: 15.29, preamp: 15.64, modelId: "HD2_AmpCaliBass", basedOn: "MESA/Boogie® M9 Carbine", confidence: "reported" },
  "Cali 400 Ch1": { category: "amp_bass", mono: 27.52, stereo: 27.52, preamp: 16.76, modelId: "HD2_AmpCali400Ch1", basedOn: "MESA/Boogie® Bass 400+ (channel 1)", confidence: "reported" },
  "Cali 400 Ch2": { category: "amp_bass", mono: 27.52, stereo: 27.52, preamp: 16.76, modelId: "HD2_AmpCali400Ch2", basedOn: "MESA/Boogie® Bass 400+ (channel 2)", confidence: "reported" },
  "G Cougar 800": { category: "amp_bass", mono: 20.4, stereo: 20.4, preamp: 14.67, modelId: "HD2_AmpGCougar800", basedOn: "Gallien-Krueger® GK 800RB", confidence: "reported" },
  "Del Sol 300": { category: "amp_bass", mono: 10.33, stereo: 10.33, preamp: 4.8, modelId: "HD2_AmpDelSol300", basedOn: "Sunn® Coliseum 300", confidence: "reported" },
  "Busy One Ch1": { category: "amp_bass", mono: 10.67, stereo: 10.67, preamp: 9.67, modelId: "HD2_AmpBusyOneCh1", basedOn: "Pearce BC-1 (channel 1)", confidence: "reported" },
  "Busy One Ch2": { category: "amp_bass", mono: 10.67, stereo: 10.67, preamp: 9.33, modelId: "HD2_AmpBusyOneCh2", basedOn: "Pearce BC-1 (channel 2)", confidence: "reported" },
  "Busy One Jump": { category: "amp_bass", mono: 18.67, stereo: 18.67, preamp: 18.33, basedOn: "Pearce BC-1 (jumped)", confidence: "reported" },
  "Studio Tube Pre": { category: "preamp", mono: 11.24, stereo: 11.24, preamp: 11.24, basedOn: "preamp only", confidence: "reported" },
  "Simple Delay": { category: "delay", mono: 4.43, stereo: 6.07, modelId: "HD2_DelaySimpleDelay", basedOn: "Line 6 Original", confidence: "reported" },
  "Mod/Chorus Echo": { category: "delay", mono: 4.43, stereo: 8.37, modelId: "HD2_DelayModChorusEcho", basedOn: "Line 6 Original", confidence: "reported" },
  "Dual Delay": { category: "delay", mono: 4.48, stereo: 9.33, modelId: "HD2_DelayDualDelay", basedOn: "Line 6 Original", confidence: "reported" },
  "Multitap 4": { category: "delay", mono: 7.34, stereo: 15.29, modelId: "HD2_DelayMultitap4", basedOn: "Line 6 Original", confidence: "reported" },
  "Multitap 6": { category: "delay", mono: 9.43, stereo: 19.64, modelId: "HD2_DelayMultitap6", basedOn: "Line 6 Original", confidence: "reported" },
  "Ping Pong": { category: "delay", mono: 2.62, stereo: 5.47, modelId: "HD2_DelayPingPong", basedOn: "Line 6 Original", confidence: "reported" },
  "Sweep Echo": { category: "delay", mono: 6.37, stereo: 12.09, modelId: "HD2_DelaySweepEcho", basedOn: "Line 6 Original", confidence: "reported" },
  "Ducked Delay": { category: "delay", mono: 3.81, stereo: 5.97, modelId: "HD2_DelayDuckedDelay", basedOn: "TC Electronic® 2290", confidence: "reported" },
  "Reverse Delay": { category: "delay", mono: 5.33, stereo: 9.33, modelId: "HD2_DelayReverseDelay", basedOn: "Line 6 Original", confidence: "reported" },
  "Vintage Digital": { category: "delay", mono: 5.24, stereo: 9.52, modelId: "HD2_DelayVintageDigitalV2", basedOn: "Line 6 Original", confidence: "reported" },
  "Vintage Swell": { category: "delay", mono: 5.4, stereo: 9.73, basedOn: "Line 6 Original", confidence: "reported" },
  "Pitch Echo": { category: "delay", mono: 9.6, stereo: 16.8, basedOn: "Line 6 Original", confidence: "reported" },
  "Transistor Tape": { category: "delay", mono: 8.25, stereo: 15.55, modelId: "HD2_DelayTransistorTape", basedOn: "Maestro® Echoplex EP-3", confidence: "reported" },
  "Cosmos Echo": { category: "delay", mono: 14.13, stereo: 25.6, modelId: "HD2_DelayCosmosEcho", basedOn: "Roland® RE-201 Space Echo", confidence: "reported" },
  "Harmony Delay": { category: "delay", mono: 8.63, stereo: 17.97, modelId: "HD2_DelayHarmonyDelay", basedOn: "Line 6 Original", confidence: "reported" },
  "Bucket Brigade": { category: "delay", mono: 7.52, stereo: 13.93, modelId: "HD2_DelayBucketBrigade", basedOn: "BOSS® DM-2", confidence: "reported" },
  "Adriatic Delay": { category: "delay", mono: 8.73, stereo: 16.48, modelId: "HD2_DelayAdriaticDelay", basedOn: "BOSS® DM-2 w/ Adrian Mod", confidence: "reported" },
  "Adriatic Swell": { category: "delay", mono: 8.53, stereo: 14.93, basedOn: "Line 6 Original", confidence: "reported" },
  "Elephant Man": { category: "delay", mono: 8.03, stereo: 14.09, modelId: "HD2_DelayElephantMan", basedOn: "Electro-Harmonix® Deluxe Memory Man", confidence: "reported" },
  "Multi Pass": { category: "delay", mono: 7.33, stereo: 8.67, modelId: "HD2_DelayMultiPass", basedOn: "Line 6 Original", confidence: "reported" },
  "Heliosphere": { category: "delay", mono: 16, stereo: 29.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Poly Sustain": { category: "delay", mono: 53.33, stereo: 62.49, poly: true, modelId: "VIC_DelayPolySustain", basedOn: "Line 6 Original", confidence: "reported" },
  "Glitch Delay (pre-3.10)": { category: "delay", mono: 6.67, stereo: 9.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Glitch Delay": { category: "delay", mono: 8.67, stereo: 13.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Euclidean Delay": { category: "delay", mono: 14, stereo: 14, basedOn: "Line 6 Original", confidence: "reported" },
  "ADT": { category: "delay", mono: 14.67, stereo: 24, basedOn: "Line 6 Original", confidence: "reported" },
  "Crisscross": { category: "delay", mono: 10.67, stereo: 12, modelId: "HD2_DelayCrissCross", basedOn: "Line 6 Original", confidence: "reported" },
  "Tesselator": { category: "delay", mono: 6.67, stereo: 8.67, basedOn: "Line 6 Original", confidence: "reported" },
  "Ratchet": { category: "delay", mono: 6.67, stereo: 8.67, basedOn: "Line 6 Original", confidence: "reported" },
  "Ping Pong (Legacy)": { category: "delay", mono: 2.11, stereo: 4.4, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic (Legacy)": { category: "delay", mono: 2.5, stereo: 5.2, legacy: true, basedOn: "TC Electronic® 2290", confidence: "reported" },
  "Stereo (Legacy)": { category: "delay", mono: 2.88, stereo: 6, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Digital (Legacy)": { category: "delay", mono: 2.88, stereo: 6, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Digital w/Mod (Legacy)": { category: "delay", mono: 3.01, stereo: 6.27, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Reverse (Legacy)": { category: "delay", mono: 5.33, stereo: 6.25, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Lo Res Delay (Legacy)": { category: "delay", mono: 2.94, stereo: 6.13, legacy: true, basedOn: "Line 6 Original 8-bit delay", confidence: "reported" },
  "Tube Echo (Legacy)": { category: "delay", mono: 7.04, stereo: 14.67, legacy: true, basedOn: "Maestro® Echoplex EP-1", confidence: "reported" },
  "Tape Echo (Legacy)": { category: "delay", mono: 7.04, stereo: 14.67, legacy: true, basedOn: "Maestro® Echoplex EP-3", confidence: "reported" },
  "Sweep Echo (Legacy)": { category: "delay", mono: 7.04, stereo: 14.67, legacy: true, basedOn: "Maestro® Echoplex EP-1 w/ L6 Mod", confidence: "reported" },
  "Echo Platter (Legacy)": { category: "delay", mono: 7.36, stereo: 15.33, legacy: true, basedOn: "Binson EchoRec", confidence: "reported" },
  "Analog Echo (Legacy)": { category: "delay", mono: 4.22, stereo: 8.8, legacy: true, basedOn: "BOSS® DM-2", confidence: "reported" },
  "Analog w/Mod (Legacy)": { category: "delay", mono: 4.32, stereo: 9, legacy: true, basedOn: "Electro-Harmonix® Deluxe Memory Man", confidence: "reported" },
  "Auto-Volume Echo (Legacy)": { category: "delay", mono: 3.71, stereo: 7.73, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Multi-Head (Legacy)": { category: "delay", mono: 6.4, stereo: 13.33, legacy: true, basedOn: "Roland® RE-101 Space Echo", confidence: "reported" },
  "Bubble Echo (Legacy)": { category: "delay", mono: 6.67, stereo: 7.81, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Phaze Eko (Legacy)": { category: "delay", mono: 6.67, stereo: 7.81, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Kinky Boost": { category: "distortion", mono: 6.8, stereo: 12.13, modelId: "HD2_DistKinkyBoost", basedOn: "Xotic® EP Booster", confidence: "reported" },
  "Deranged Master": { category: "distortion", mono: 6.93, stereo: 12.33, modelId: "HD2_DistDerangedMaster", basedOn: "Dallas Rangemaster Treble Booster", confidence: "reported" },
  "Minotaur": { category: "distortion", mono: 11.4, stereo: 21.67, modelId: "HD2_DistMinotaur", basedOn: "Klon® Centaur", confidence: "reported" },
  "Teemah!": { category: "distortion", mono: 7.4, stereo: 13.67, modelId: "HD2_DistTeemah", basedOn: "Paul Cochrane Timmy® Overdrive", confidence: "reported" },
  "Heir Apparent": { category: "distortion", mono: 10, stereo: 20, modelId: "HD2_DistHeirApparent", basedOn: "Analogman Prince of Tone", confidence: "reported" },
  "Tone Sovereign": { category: "distortion", mono: 20, stereo: 38, modelId: "HD2_DistToneSovereign", basedOn: "Analogman King of Tone V4", confidence: "reported" },
  "Alpaca Rouge": { category: "distortion", mono: 10.67, stereo: 19.33, basedOn: "Way Huge® Red Llama (modded)", confidence: "reported" },
  "Compulsive Drive": { category: "distortion", mono: 5.95, stereo: 10.77, modelId: "HD2_DistCompulsiveDrive", basedOn: "Fulltone® OCD", confidence: "reported" },
  "Dhyana Drive": { category: "distortion", mono: 8.67, stereo: 15.67, modelId: "HD2_DistDhyanaDrive", basedOn: "Hermida Zendrive", confidence: "reported" },
  "Horizon Drive": { category: "distortion", mono: 16, stereo: 29.33, modelId: "HD2_DistHorizonDrive", basedOn: "Horizon Devices Precision Drive", confidence: "reported" },
  "Valve Driver": { category: "distortion", mono: 12.71, stereo: 24.37, modelId: "HD2_DistValveDriver", basedOn: "Chandler Tube Driver", confidence: "reported" },
  "Top Secret OD": { category: "distortion", mono: 6.13, stereo: 11.04, modelId: "HD2_DistTopSecretOD", basedOn: "DOD® OD-250", confidence: "reported" },
  "Prize Drive": { category: "distortion", mono: 20, stereo: 38, modelId: "HD2_DistPrizeDrive", basedOn: "Nobels ODR-1", confidence: "reported" },
  "Scream 808": { category: "distortion", mono: 7.33, stereo: 13.44, modelId: "HD2_DistScream808", basedOn: "Ibanez® TS808 Tube Screamer®", confidence: "reported" },
  "Pillars": { category: "distortion", mono: 10.67, stereo: 20, basedOn: "Earthquaker Devices Plumes", confidence: "reported" },
  "Hedgehog D9": { category: "distortion", mono: 5.77, stereo: 10.43, modelId: "HD2_DistHedgehogD9", basedOn: "MAXON® SD9 Sonic Distortion", confidence: "reported" },
  "Stupor OD": { category: "distortion", mono: 7.71, stereo: 14.47, modelId: "HD2_DistStuporOD", basedOn: "BOSS® SD-1 Overdrive", confidence: "reported" },
  "Deez One Vintage": { category: "distortion", mono: 11.6, stereo: 21.87, modelId: "HD2_DistDeezOneVintage", basedOn: "BOSS© DS-1 Distortion", confidence: "reported" },
  "Deez One Mod": { category: "distortion", mono: 11.6, stereo: 21.87, modelId: "HD2_DistDeezOneMod", basedOn: "BOSS© DS-1 w/Keeley mod", confidence: "reported" },
  "Ratatouille Dist": { category: "distortion", mono: 11.33, stereo: 21.33, basedOn: "Pro Co RAT", confidence: "reported" },
  "Vermin Dist": { category: "distortion", mono: 5.99, stereo: 10.79, modelId: "HD2_DistVerminDist", basedOn: "Pro Co RAT", confidence: "reported" },
  "Vital Dist": { category: "distortion", mono: 20.67, stereo: 40, modelId: "HD2_DistVitalDist", basedOn: "Earthquaker Devices Life (Amplitude side)", confidence: "reported" },
  "Vital Boost": { category: "distortion", mono: 7.33, stereo: 12.67, basedOn: "Earthquaker Devices Life (Magnitude side)", confidence: "reported" },
  "KWB": { category: "distortion", mono: 10.73, stereo: 20.07, modelId: "HD2_DistKWB", basedOn: "Ben Adrian Kowloon Walled Bunny Distortion", confidence: "reported" },
  "Legendary Drive": { category: "distortion", mono: 21.33, stereo: 41.33, basedOn: "Carvin VLD1 Legacy Drive (high gain channel)", confidence: "reported" },
  "Swedish Chainsaw": { category: "distortion", mono: 7.33, stereo: 13.33, basedOn: "BOSS® HM-2 Heavy Metal Distortion (MIJ black label)", confidence: "reported" },
  "Arbitrator Fuzz": { category: "distortion", mono: 6.35, stereo: 11.72, modelId: "HD2_DistArbitratorFuzz", basedOn: "Arbiter® FuzzFace®", confidence: "reported" },
  "Pocket Fuzz": { category: "distortion", mono: 6.67, stereo: 12, modelId: "HD2_DistPocketFuzz", basedOn: "Jordan Boss Tone fuzz", confidence: "reported" },
  "Bighorn Fuzz": { category: "distortion", mono: 10.67, stereo: 20, basedOn: "1973 Electro-Harmonix® Ram's Head Big Muff Pi", confidence: "reported" },
  "Triangle Fuzz": { category: "distortion", mono: 10, stereo: 18.79, modelId: "HD2_DistTriangleFuzz", basedOn: "Electro-Harmonix® Big Mu π®", confidence: "reported" },
  "Dark Dove Fuzz": { category: "distortion", mono: 13.33, stereo: 25.33, basedOn: "Electro-Harmonix® Russian Big Muff", confidence: "reported" },
  "Ballistic Fuzz": { category: "distortion", mono: 16, stereo: 29.33, modelId: "HD2_DistBallisticFuzz", basedOn: "Euthymia ICBM fuzz", confidence: "reported" },
  "Industrial Fuzz": { category: "distortion", mono: 12.79, stereo: 23.47, modelId: "HD2_DistIndustrialFuzz", basedOn: "Z.Vex Fuzz Factory", confidence: "reported" },
  "Tycoctavia Fuzz": { category: "distortion", mono: 6.81, stereo: 12.57, modelId: "HD2_DistTycoctaviaFuzz", basedOn: "Tycobrahe® Octavia", confidence: "reported" },
  "Wringer Fuzz": { category: "distortion", mono: 15.76, stereo: 24.57, modelId: "HD2_DistWringerFuzz", basedOn: "Garbage's modded BOSS® FZ-2", confidence: "reported" },
  "Thrifter Fuzz": { category: "distortion", mono: 12, stereo: 22.73, basedOn: "Line 6 Original", confidence: "reported" },
  "Xenomorph Fuzz": { category: "distortion", mono: 13.33, stereo: 24.67, modelId: "HD2_DistXenomorphFuzz", basedOn: "Subdecay Harmonic Antagonizer", confidence: "reported" },
  "Megaphone": { category: "distortion", mono: 4.55, stereo: 6.87, modelId: "HD2_DistMegaphone", basedOn: "Megaphone", confidence: "reported" },
  "Bitcrusher": { category: "distortion", mono: 6.73, stereo: 12.2, modelId: "HD2_DistBitcrusher", basedOn: "Line 6 Original", confidence: "reported" },
  "Ampeg Scrambler": { category: "distortion", mono: 16.67, stereo: 31.67, modelId: "HD2_DistAmpegScramblerOD", basedOn: "Ampeg® Scrambler Bass Overdrive", confidence: "reported" },
  "ZeroAmp Bass DI": { category: "distortion", mono: 9.33, stereo: 16.67, modelId: "HD2_DistZeroAmpBassDI", basedOn: "Tech 21® SansAmp Bass Driver DI V1", confidence: "reported" },
  "Regal Bass DI": { category: "distortion", mono: 10, stereo: 18, modelId: "HD2_DistRegalBassDI", basedOn: "Noble Preamp bass DI", confidence: "reported" },
  "Obsidian 7000": { category: "distortion", mono: 10.51, stereo: 19.8, modelId: "HD2_DistObsidian7000", basedOn: "Darkglass Electronics® Microtubes B7K Ultra", confidence: "reported" },
  "Clawthorn Drive": { category: "distortion", mono: 17.87, stereo: 34.33, modelId: "HD2_DistClawthornDrive", basedOn: "Wounded Paw Battering Ram bass overdrive", confidence: "reported" },
  "Tube Drive (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Chandler Tube Driver", confidence: "reported" },
  "Screamer (Legacy)": { category: "distortion", mono: 10.13, stereo: 13.99, legacy: true, basedOn: "Ibanez® TS808 Tube Screamer®", confidence: "reported" },
  "Overdrive (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "DOD® OD-250", confidence: "reported" },
  "Classic Dist (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Pro Co RAT", confidence: "reported" },
  "Heavy Dist (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Boss® Metal Zone", confidence: "reported" },
  "Colordrive (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Colorsound® Overdriver", confidence: "reported" },
  "Buzz Saw (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Maestro® Fuzz Tone", confidence: "reported" },
  "Facial Fuzz (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Arbiter® FuzzFace®", confidence: "reported" },
  "Jumbo Fuzz (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Vox® Tone Bender", confidence: "reported" },
  "Fuzz Pi (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Electro-Harmonix® Big Mu π®", confidence: "reported" },
  "Jet Fuzz (Legacy)": { category: "distortion", mono: 9.33, stereo: 12.88, legacy: true, basedOn: "Roland® Jet Phaser", confidence: "reported" },
  "L6 Drive (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Colorsound® Overdriver w/ L6 Mod", confidence: "reported" },
  "L6 Distortion (Legacy)": { category: "distortion", mono: 8, stereo: 11.04, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Sub Oct Fuzz (Legacy)": { category: "distortion", mono: 8.67, stereo: 11.96, legacy: true, basedOn: "PAiA Roctave Divider", confidence: "reported" },
  "Octave Fuzz (Legacy)": { category: "distortion", mono: 10.67, stereo: 14.72, legacy: true, basedOn: "Tycobrahe® Octavia", confidence: "reported" },
  "Bronze Master (Legacy)": { category: "distortion", mono: 4.67, stereo: 6.44, legacy: true, basedOn: "Maestro® Bass Brassmaster", confidence: "reported" },
  "Killer Z (Legacy)": { category: "distortion", mono: 4.67, stereo: 6.44, legacy: true, basedOn: "BOSS® Metal Zone MT-2", confidence: "reported" },
  "Deluxe Comp": { category: "dynamics", mono: 2.33, stereo: 3.96, modelId: "HD2_CompressorDeluxeComp", basedOn: "Line 6 Original", confidence: "reported" },
  "Red Squeeze": { category: "dynamics", mono: 11.96, stereo: 16.31, modelId: "HD2_CompressorRedSqueeze", basedOn: "MXR® Dyna Comp", confidence: "reported" },
  "Ampeg Opto Comp": { category: "dynamics", mono: 8, stereo: 12.67, basedOn: "Ampeg Opto Comp", confidence: "reported" },
  "Kinky Comp": { category: "dynamics", mono: 7.13, stereo: 13.47, modelId: "HD2_CompressorKinkyComp", basedOn: "Xotic® SP Compressor", confidence: "reported" },
  "Rochester Comp": { category: "dynamics", mono: 6, stereo: 12, modelId: "HD2_CompressorRochesterComp", basedOn: "Ashly® CLX-52 (Sheehan mod)", confidence: "reported" },
  "LA Studio Comp": { category: "dynamics", mono: 7.71, stereo: 14.4, modelId: "HD2_CompressorLAStudioComp", basedOn: "Teletronix® LA-2A®", confidence: "reported" },
  "3-Band Comp": { category: "dynamics", mono: 5.33, stereo: 10.67, modelId: "HD2_Compressor3BandComp", basedOn: "Line 6 Original", confidence: "reported" },
  "Noise Gate": { category: "dynamics", mono: 3.87, stereo: 2.16, modelId: "HD2_GateNoiseGate", basedOn: "Line 6 Original", confidence: "reported" },
  "Hard Gate": { category: "dynamics", mono: 1.55, stereo: 2.91, modelId: "HD2_GateHardGate", basedOn: "Line 6 Original", confidence: "reported" },
  "Horizon Gate": { category: "dynamics", mono: 4, stereo: 6.67, modelId: "HD2_GateHorizonGate", basedOn: "Horizon Devices Precision Drive's gate", confidence: "reported" },
  "Autoswell": { category: "dynamics", mono: 2.4, stereo: 2.87, modelId: "HD2_CompressorAutoSwell", basedOn: "Line 6 Original", confidence: "reported" },
  "Feedbacker": { category: "dynamics", mono: 29.33, stereo: 35.79, poly: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Tube Comp (Legacy)": { category: "dynamics", mono: 4.4, stereo: 5.37, legacy: true, basedOn: "Teletronix® LA-2A®", confidence: "reported" },
  "Red Comp (Legacy)": { category: "dynamics", mono: 4.53, stereo: 5.53, legacy: true, basedOn: "MXR® Dyna Comp", confidence: "reported" },
  "Blue Comp (Legacy)": { category: "dynamics", mono: 4.53, stereo: 5.53, legacy: true, basedOn: "Boss® CS-1 Compression Sustainer", confidence: "reported" },
  "Blue Comp Treb (Legacy)": { category: "dynamics", mono: 4.53, stereo: 5.53, legacy: true, basedOn: "Boss® CS-1 Compression Sustainer w/ Treble ON", confidence: "reported" },
  "Vetta Comp (Legacy)": { category: "dynamics", mono: 4.4, stereo: 5.37, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Vetta Juice (Legacy)": { category: "dynamics", mono: 4.4, stereo: 5.37, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Boost Comp (Legacy)": { category: "dynamics", mono: 8, stereo: 9.76, legacy: true, basedOn: "MXR® Micro Amp", confidence: "reported" },
  "Simple EQ": { category: "eq", mono: 1.71, stereo: 2.17, basedOn: "Line 6 Original", confidence: "reported" },
  "Low Cut/High Cut": { category: "eq", mono: 2.67, stereo: 3, basedOn: "Line 6 Original", confidence: "reported" },
  "Low/High Shelf": { category: "eq", mono: 2.89, stereo: 3.61, basedOn: "Line 6 Original", confidence: "reported" },
  "Parametric": { category: "eq", mono: 3.25, stereo: 3.36, modelId: "HD2_EQParametric", basedOn: "Line 6 Original", confidence: "reported" },
  "Tilt": { category: "eq", mono: 2.67, stereo: 3, modelId: "HD2_EQSimpleTilt", basedOn: "Line 6 Original", confidence: "reported" },
  "10-Band Graphic": { category: "eq", mono: 2.43, stereo: 3.55, basedOn: "MXR® 10-Band Graphic EQ", confidence: "reported" },
  "Cali Q Graphic": { category: "eq", mono: 2.84, stereo: 3.99, basedOn: "MESA/Boogie® Mark IV Graphic EQ", confidence: "reported" },
  "Acoustic Sim": { category: "eq", mono: 9.33, stereo: 16.67, basedOn: "BOSS® AC-2 Acoustic Simulator", confidence: "reported" },
  "Mutant Filter": { category: "filter", mono: 2.39, stereo: 3.51, modelId: "HD2_FilterMutantFilter", basedOn: "Musitronics® Mu-Tron® III", confidence: "reported" },
  "Mystery Filter": { category: "filter", mono: 2.41, stereo: 3.48, basedOn: "Korg® A3", confidence: "reported" },
  "Autofilter": { category: "filter", mono: 3.73, stereo: 5.67, modelId: "HD2_FilterAutoFilter", basedOn: "Line 6 Original", confidence: "reported" },
  "Asheville Pattrn": { category: "filter", mono: 12.33, stereo: 17, modelId: "HD2_FilterAshevillePattrn", basedOn: "Moog® Moogerfooger® MF-105M MIDI MuRF Filter", confidence: "reported" },
  "Voice Box (Legacy)": { category: "filter", mono: 4, stereo: 4.26, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "V Tron (Legacy)": { category: "filter", mono: 4, stereo: 4.26, legacy: true, basedOn: "Musitronics® Mu-Tron® III w/ Voice Box", confidence: "reported" },
  "Q Filter (Legacy)": { category: "filter", mono: 2.81, stereo: 5.33, legacy: true, basedOn: "parked wah", confidence: "reported" },
  "Seeker (Legacy)": { category: "filter", mono: 3.1, stereo: 5.87, legacy: true, basedOn: "Z-Vex Seek Wah", confidence: "reported" },
  "Obi Wah (Legacy)": { category: "filter", mono: 3.17, stereo: 6, legacy: true, basedOn: "Oberheim® Voltage Controlled Sample and Hold", confidence: "reported" },
  "Tron Up (Legacy)": { category: "filter", mono: 3.24, stereo: 6.13, legacy: true, basedOn: "Musitronics® Mu-Tron® III", confidence: "reported" },
  "Tron Down (Legacy)": { category: "filter", mono: 3.24, stereo: 6.13, legacy: true, basedOn: "Musitronics® Mu-Tron® III", confidence: "reported" },
  "Throbber (Legacy)": { category: "filter", mono: 3.34, stereo: 6.33, legacy: true, basedOn: "Electrix® Filter Factory", confidence: "reported" },
  "Slow Filter (Legacy)": { category: "filter", mono: 3.34, stereo: 6.33, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Spin Cycle (Legacy)": { category: "filter", mono: 3.52, stereo: 6.67, legacy: true, basedOn: "Craig Anderton’s Wah/Anti-Wah", confidence: "reported" },
  "Comet Trails (Legacy)": { category: "filter", mono: 4.93, stereo: 9.33, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "6 Switch Looper": { category: "looper", mono: 7.04, stereo: 7.04, basedOn: "Line 6 Original", confidence: "reported" },
  "1 Switch Looper": { category: "looper", mono: 7.04, stereo: 7.04, basedOn: "Line 6 Original", confidence: "reported" },
  "Shuffling Looper": { category: "looper", mono: 10.67, stereo: 16, basedOn: "Line 6 Original", confidence: "reported" },
  "Optical Trem": { category: "modulation", mono: 2.28, stereo: 2.97, modelId: "HD2_TremoloOpticalTrem", basedOn: "Fender® optical tremolo circuit", confidence: "reported" },
  "60s Bias Trem": { category: "modulation", mono: 3.07, stereo: 4.68, modelId: "HD2_Tremolo60sBiasTrem", basedOn: "Vox® AC-15 Tremolo", confidence: "reported" },
  "Tremolo": { category: "modulation", mono: 1.93, stereo: 2.6, basedOn: "BOSS® PN-2", confidence: "reported" },
  "Harmonic Tremolo": { category: "modulation", mono: 3.33, stereo: 4.67, basedOn: "Line 6 Original", confidence: "reported" },
  "Bleat Chop Trem": { category: "modulation", mono: 1.6, stereo: 2.27, basedOn: "Lightfoot Labs© Goatkeeper", confidence: "reported" },
  "Script Mod Phase": { category: "modulation", mono: 3.07, stereo: 4.69, modelId: "HD2_PhaserScriptModPhase", basedOn: "MXR® Phase 90", confidence: "reported" },
  "Pebble Phaser": { category: "modulation", mono: 5.33, stereo: 9.33, basedOn: "Electro-Harmonix® Small Stone Phaser", confidence: "reported" },
  "Ubiquitous Vibe": { category: "modulation", mono: 3.92, stereo: 6.23, modelId: "HD2_PhaserUbiquitousVibe", basedOn: "Shin-ei Uni-Vibe®", confidence: "reported" },
  "FlexoVibe": { category: "modulation", mono: 3.33, stereo: 4.67, basedOn: "Line 6 Original", confidence: "reported" },
  "Deluxe Phaser": { category: "modulation", mono: 4.07, stereo: 6.93, basedOn: "Line 6 Original", confidence: "reported" },
  "Gray Flanger": { category: "modulation", mono: 9.93, stereo: 18.31, modelId: "HD2_FlangerGrayFlanger", basedOn: "MXR® 117 Flanger", confidence: "reported" },
  "Harmonic Flanger": { category: "modulation", mono: 9.19, stereo: 16.75, modelId: "HD2_FlangerHarmonicFlanger", basedOn: "A/DA Flanger", confidence: "reported" },
  "Courtesan Flange": { category: "modulation", mono: 9.35, stereo: 16.92, modelId: "HD2_FlangerCourtesanFlange", basedOn: "Electro-Harmonix® Deluxe EM", confidence: "reported" },
  "Dynamix Flanger": { category: "modulation", mono: 5.2, stereo: 7.07, basedOn: "Line 6 Original", confidence: "reported" },
  // data/helix-inventory.json maps BOTH "Chorus" and "70s Chorus" to
  // HD2_Chorus70sChorus. Only the latter is correct — the plain HX Chorus is
  // HD2_Chorus. Corrected here; the inventory still has the bad alias.
  "Chorus": { category: "modulation", mono: 4.49, stereo: 7.31, modelId: "HD2_Chorus", basedOn: "Line 6 Original", confidence: "reported" },
  "70s Chorus": { category: "modulation", mono: 6.92, stereo: 12.56, modelId: "HD2_Chorus70sChorus", basedOn: "BOSS® CE-1", confidence: "reported" },
  "PlastiChorus": { category: "modulation", mono: 7.33, stereo: 13.67, modelId: "HD2_ChorusPlastiChorus", basedOn: "Arion SCH-Z w/ L6 Mod", confidence: "reported" },
  "Ampeg Liquifier": { category: "modulation", mono: 12, stereo: 22.67, modelId: "HD2_ChorusAmpegLiquifier", basedOn: "Ampeg Liquifier chorus", confidence: "reported" },
  "Trinity Chorus": { category: "modulation", mono: 10.67, stereo: 10.12, modelId: "HD2_ChorusTrinityChorus", basedOn: "DyTronics Tri-Stereo Chorus", confidence: "reported" },
  "4-Voice Chorus": { category: "modulation", mono: 5.33, stereo: 6.67, basedOn: "Line 6 Original", confidence: "reported" },
  "Bubble Vibrato": { category: "modulation", mono: 7.01, stereo: 12.65, modelId: "HD2_VibratoBubbleVibrato", basedOn: "BOSS® VB-2 Vibrato", confidence: "reported" },
  "Vibe Rotary": { category: "modulation", mono: 13.43, stereo: 13.43, modelId: "HD2_RotaryVibeRotary", basedOn: "Fender® Vibratone", confidence: "reported" },
  "122 Rotary": { category: "modulation", mono: 13.35, stereo: 13.35, modelId: "HD2_Rotary122Rotary", basedOn: "Leslie® 122", confidence: "reported" },
  "145 Rotary": { category: "modulation", mono: 13.45, stereo: 13.45, modelId: "HD2_Rotary145Rotary", basedOn: "Leslie® 145", confidence: "reported" },
  "Triple Rotary": { category: "modulation", mono: 17.33, stereo: 17.33, basedOn: "Yamaha® RA-200", confidence: "reported" },
  "Retro Reel": { category: "modulation", mono: 6.67, stereo: 13.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Double Take": { category: "modulation", mono: 17.07, stereo: 18.8, basedOn: "Line 6 Original", confidence: "reported" },
  "Poly Detune": { category: "modulation", mono: 48, stereo: 48, poly: true, basedOn: "Line 6 Original", confidence: "reported" },
  "AM Ring Mod": { category: "modulation", mono: 3.37, stereo: 4.61, modelId: "HD2_RingModulatorAMRingMod", basedOn: "Line 6 Original", confidence: "reported" },
  "Pitch Ring Mod": { category: "modulation", mono: 10.67, stereo: 7.6, modelId: "HD2_RingModulatorPitchRingMod", basedOn: "Line 6 Original", confidence: "reported" },
  "Pattern Tremolo (Legacy)": { category: "modulation", mono: 2.67, stereo: 2.67, legacy: true, basedOn: "Lightfoot Labs© Goatkeeper", confidence: "reported" },
  "Panner (Legacy)": { category: "modulation", mono: 4.67, stereo: 4.67, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Bias Tremolo (Legacy)": { category: "modulation", mono: 6.67, stereo: 6.67, legacy: true, basedOn: "Vox® AC- 15 Tremolo", confidence: "reported" },
  "Opto Tremolo (Legacy)": { category: "modulation", mono: 4, stereo: 4, legacy: true, basedOn: "Fender® Deluxe Reverb® Tremolo", confidence: "reported" },
  "Script Phaser (Legacy)": { category: "modulation", mono: 3.67, stereo: 3.67, legacy: true, basedOn: "MXR® Phase 90", confidence: "reported" },
  "Panned Phaser (Legacy)": { category: "modulation", mono: 4.27, stereo: 4.27, legacy: true, basedOn: "Ibanez® Flying Pan", confidence: "reported" },
  "Barberpole Phaser (Legacy)": { category: "modulation", mono: 9.33, stereo: 9.33, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Dual Phaser (Legacy)": { category: "modulation", mono: 4, stereo: 4, legacy: true, basedOn: "Mu-Tron® Bi- Phase", confidence: "reported" },
  "U-Vibe (Legacy)": { category: "modulation", mono: 4, stereo: 4, legacy: true, basedOn: "Shin-ei Uni-Vibe®", confidence: "reported" },
  "Phaser (Legacy)": { category: "modulation", mono: 6.93, stereo: 6.93, legacy: true, basedOn: "MXR® Phase 90 w/ L6 Mod", confidence: "reported" },
  "Pitch Vibrato (Legacy)": { category: "modulation", mono: 3.27, stereo: 3.27, legacy: true, basedOn: "BOSS® VB-2 Vibrato", confidence: "reported" },
  "Dimension (Legacy)": { category: "modulation", mono: 5.33, stereo: 5.33, legacy: true, basedOn: "Roland® Dimension D", confidence: "reported" },
  "Analog Chorus (Legacy)": { category: "modulation", mono: 3.6, stereo: 3.6, legacy: true, basedOn: "BOSS® CE-1", confidence: "reported" },
  "Tri-Chorus (Legacy)": { category: "modulation", mono: 6.67, stereo: 6.67, legacy: true, basedOn: "DyTronics CS-5 Tri-Stereo Chorus", confidence: "reported" },
  "Analog Flanger (Legacy)": { category: "modulation", mono: 5.33, stereo: 5.33, legacy: true, basedOn: "MXR® 117 Flanger w/ L6 Mod", confidence: "reported" },
  "Jet Flanger (Legacy)": { category: "modulation", mono: 6, stereo: 6, legacy: true, basedOn: "A/DA Flanger w/ L6 Mod", confidence: "reported" },
  "AC Flanger (Legacy)": { category: "modulation", mono: 10.67, stereo: 10.67, legacy: true, basedOn: "MXR® 117 Flanger", confidence: "reported" },
  "80A Flanger (Legacy)": { category: "modulation", mono: 22.67, stereo: 22.67, legacy: true, basedOn: "A/DA Flanger", confidence: "reported" },
  "Frequency Shift (Legacy)": { category: "modulation", mono: 9.33, stereo: 9.33, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Ring Modulator (Legacy)": { category: "modulation", mono: 5.33, stereo: 5.33, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Rotary Drum (Legacy)": { category: "modulation", mono: 15, stereo: 15, legacy: true, basedOn: "Fender® Vibratone", confidence: "reported" },
  "Rotary Drum/Horn (Legacy)": { category: "modulation", mono: 15, stereo: 15, legacy: true, basedOn: "Leslie® 145", confidence: "reported" },
  "Tape Eater (Legacy)": { category: "modulation", mono: 6.67, stereo: 6.67, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Warble-matic (Legacy)": { category: "modulation", mono: 6.67, stereo: 6.67, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Random S&H (Legacy)": { category: "modulation", mono: 6.67, stereo: 6.67, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Sweeper (Legacy)": { category: "modulation", mono: 4, stereo: 4, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Pitch Wham": { category: "pitch", mono: 6.13, stereo: 8.8, modelId: "HD2_PitchPitchWham", basedOn: "Digitech Whammy®", confidence: "reported" },
  "Twin Harmony": { category: "pitch", mono: 8.8, stereo: 17.07, modelId: "HD2_PitchTwinHarmony", basedOn: "Eventide® H3000", confidence: "reported" },
  "Simple Pitch": { category: "pitch", mono: 7.07, stereo: 13.33, modelId: "HD2_PitchSimplePitch", basedOn: "Line 6 Original", confidence: "reported" },
  "Dual Pitch": { category: "pitch", mono: 9.47, stereo: 18.67, modelId: "HD2_PitchDualPitch", basedOn: "Line 6 Original", confidence: "reported" },
  "Boctaver": { category: "pitch", mono: 5.33, stereo: 10.67, basedOn: "BOSS® OC-2 Octaver", confidence: "reported" },
  "Poly Pitch": { category: "pitch", mono: 53.33, stereo: 62.48, poly: true, modelId: "L6SPB_PolyPitch", basedOn: "Line 6 Original", confidence: "reported" },
  "Poly Wham": { category: "pitch", mono: 53.33, stereo: 62.48, poly: true, modelId: "L6SPB_PolyWham", basedOn: "Line 6 Original", confidence: "reported" },
  "Poly Capo": { category: "pitch", mono: 48, stereo: 56.23, poly: true, basedOn: "Line 6 Original", confidence: "reported" },
  "12 String": { category: "pitch", mono: 50.67, stereo: 59.36, poly: true, modelId: "L6SPB_12String", basedOn: "Line 6 Original", confidence: "reported" },
  "3 OSC Synth": { category: "pitch", mono: 8.71, stereo: 18.13, basedOn: "Line 6 Original", confidence: "reported" },
  "3 Note Generator": { category: "pitch", mono: 9.67, stereo: 9.67, modelId: "HD2_Synth3NoteGenerator", basedOn: "Line 6 Original", confidence: "reported" },
  "4 OSC Generator": { category: "pitch", mono: 10, stereo: 10, basedOn: "Line 6 Original", confidence: "reported" },
  "Bass Octaver (Legacy)": { category: "pitch", mono: 6.67, stereo: 7.81, legacy: true, basedOn: "EBS OctaBass", confidence: "reported" },
  "Smart Harmony (Legacy)": { category: "pitch", mono: 7.33, stereo: 8.59, legacy: true, basedOn: "Eventide® H3000", confidence: "reported" },
  "Octisynth (Legacy)": { category: "pitch", mono: 4, stereo: 4.69, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Synth O Matic (Legacy)": { category: "pitch", mono: 6.67, stereo: 7.81, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Attack Synth (Legacy)": { category: "pitch", mono: 7.33, stereo: 8.59, legacy: true, basedOn: "Korg® X911 Guitar Synth", confidence: "reported" },
  "Synth String (Legacy)": { category: "pitch", mono: 8, stereo: 9.37, legacy: true, basedOn: "Roland® GR700 Guitar Synth", confidence: "reported" },
  "Growler (Legacy)": { category: "pitch", mono: 8, stereo: 9.37, legacy: true, basedOn: "R700 meets Mu-Tron® III", confidence: "reported" },
  "Buzz Wave (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Rez Synth (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Seismik Synth (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Analog Synth (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Synth Lead (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "String Theory (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Synth FX (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Saturn 5 Ring Mod (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Synth Harmony (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Double Bass (Legacy)": { category: "pitch", mono: 9.33, stereo: 10.93, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic Hall": { category: "reverb", mono: 20.67, stereo: 20.67, modelId: "VIC_ReverbDynHall", basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic Plate": { category: "reverb", mono: 24, stereo: 24, modelId: "VIC_DynPlate", basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic Room": { category: "reverb", mono: 21.33, stereo: 21.33, modelId: "VIC_ReverbDynRoom", basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic Ambience": { category: "reverb", mono: 13.33, stereo: 14, modelId: "VIC_ReverbDynAmbience", basedOn: "Line 6 Original", confidence: "reported" },
  "Dynamic Bloom": { category: "reverb", mono: 28, stereo: 28, modelId: "VIC_ReverbDynBloom", basedOn: "Line 6 Original", confidence: "reported" },
  "Shimmer": { category: "reverb", mono: 24, stereo: 24, basedOn: "Line 6 Original", confidence: "reported" },
  "Hot Springs": { category: "reverb", mono: 21.33, stereo: 21.33, basedOn: "Line 6 Original", confidence: "reported" },
  "Nonlinear": { category: "reverb", mono: 30.67, stereo: 34, modelId: "HD2_ReverbNonLinear", basedOn: "Line 6 Original", confidence: "reported" },
  "Glitz": { category: "reverb", mono: 11.33, stereo: 13.67, modelId: "HD2_ReverbGlitz", basedOn: "Line 6 Original", confidence: "reported" },
  "Ganymede": { category: "reverb", mono: 10, stereo: 17.67, modelId: "HD2_ReverbGanymede", basedOn: "Line 6 Original", confidence: "reported" },
  "Searchlights": { category: "reverb", mono: 16.67, stereo: 17.33, modelId: "HD2_ReverbSearchlights", basedOn: "Line 6 Original", confidence: "reported" },
  "Plateaux": { category: "reverb", mono: 13.33, stereo: 16.67, modelId: "HD2_ReverbPlateaux", basedOn: "Line 6 Original", confidence: "reported" },
  "Double Tank": { category: "reverb", mono: 18.33, stereo: 19, modelId: "HD2_ReverbDoubleTank", basedOn: "Line 6 Original", confidence: "reported" },
  "Plate (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, modelId: "HD2_ReverbPlate", basedOn: "Line 6 Original", confidence: "reported" },
  "Room (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, modelId: "HD2_ReverbRoom", basedOn: "Line 6 Original", confidence: "reported" },
  "Chamber (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Hall (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, modelId: "HD2_ReverbHall", basedOn: "Line 6 Original", confidence: "reported" },
  "Echo (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Tile (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Cave (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Ducking (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Octo (Legacy)": { category: "reverb", mono: 7.35, stereo: 10.57, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "63 Spring (Legacy)": { category: "reverb", mono: 12.4, stereo: 17.84, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Spring (Legacy)": { category: "reverb", mono: 12.51, stereo: 18, legacy: true, modelId: "HD2_ReverbSpring", basedOn: "Line 6 Original", confidence: "reported" },
  "Particle Verb (Legacy)": { category: "reverb", mono: 9.6, stereo: 13.81, legacy: true, basedOn: "Line 6 Original", confidence: "reported" },
  "Cab (new engine, single)": { category: "cab", mono: 3.33, stereo: 6.67, basedOn: "all new speaker sims", confidence: "reported" },
  "Cab (legacy, single)": { category: "cab", mono: 9.6, stereo: 19.2, basedOn: "all legacy speaker sims", confidence: "reported" },
  "IR 1024": { category: "ir", mono: 3.33, stereo: 6.67, basedOn: "IR 1024 single/dual", confidence: "reported" },
  "IR 2048": { category: "ir", mono: 3.33, stereo: 4.85, basedOn: "IR 2048 single only", confidence: "reported" },
  "IR (legacy)": { category: "ir", mono: 9.33, stereo: 17.33, basedOn: "all impulse responses", confidence: "reported" },
  "Vol/Pan Volume": { category: "volume_pan", mono: 0.47, stereo: 0.61, basedOn: "Line 6 Original", confidence: "reported" },
  "Vol/Pan Gain": { category: "volume_pan", mono: 0.47, stereo: 0.68, basedOn: "Line 6 Original", confidence: "reported" },
  "Vol/Pan Pan": { category: "volume_pan", mono: 0.38, stereo: 0.69, basedOn: "Line 6 Original", confidence: "reported" },
  "Stereo Width": { category: "volume_pan", mono: 0.79, stereo: 1.47, basedOn: "Line 6 Original", confidence: "reported" },
  "Stereo Imager": { category: "volume_pan", mono: 3.61, stereo: 6.67, modelId: "HD2_VolPanStereoImager", basedOn: "Line 6 Original", confidence: "reported" },
  "UK Wah 846": { category: "wah", mono: 3.8, stereo: 3.99, modelId: "HD2_WahUKWah846", basedOn: "Vox® V846", confidence: "reported" },
  "Teardrop 310": { category: "wah", mono: 3.8, stereo: 3.99, modelId: "HD2_WahTeardrop310", basedOn: "Dunlop® Crybaby® Fasel model 310", confidence: "reported" },
  "Fassel": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahFassel", basedOn: "Dunlop® Cry Baby® Super", confidence: "reported" },
  "Weeper": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahWeeper", basedOn: "Arbiter® Cry Baby", confidence: "reported" },
  "Chrome": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahChrome", basedOn: "Vox® V847", confidence: "reported" },
  "Chrome Custom": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahChromeCustom", basedOn: "Modded Vox® V847", confidence: "reported" },
  "Throaty": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahThroaty", basedOn: "RMC Real McCoy 1", confidence: "reported" },
  "Vetta Wah": { category: "wah", mono: 1.71, stereo: 3.99, basedOn: "Line 6 Original", confidence: "reported" },
  "Colorful": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahColorful", basedOn: "Colorsound® Wah-fuzz", confidence: "reported" },
  "Conductor": { category: "wah", mono: 1.71, stereo: 3.99, modelId: "HD2_WahConductor", basedOn: "Maestro® Boomerang", confidence: "reported" },
  "Teardrop Bass Q": { category: "wah", mono: 4, stereo: 4, basedOn: "Dunlop 105Q bass wah", confidence: "reported" },
};

/* ------------------------------------------------------------------ */
/*  Device capacities                                                  */
/* ------------------------------------------------------------------ */

export type HelixDevice =
  | "helix_floor"
  | "helix_lt"
  | "helix_rack"
  | "hx_stomp"
  | "hx_stomp_xl"
  | "hx_effects";

export interface DeviceCapacity {
  id: HelixDevice;
  label: string;
  /** .hlx device ID, where verified from real presets (Bible §3). */
  deviceId?: number;
  /** Number of independent SHARC DSPs. Budgets do NOT pool across chips. */
  dspChips: number;
  /** Independent primary paths. On dual-DSP units, one path per chip. */
  paths: number;
  /** Total block locations across the whole preset. */
  maxBlocks: number;
  /** Block locations available on one primary path (Helix: 8 per sub-path). */
  maxBlocksPerPath: number;
  /** Amp / Amp+Cab / Preamp blocks, whole preset. */
  maxAmps: number;
  maxAmpsPerPath: number;
  /** Single Cab blocks (an Amp+Cab counts as one). */
  maxSingleCabs: number;
  /** Dual Cab blocks. One Dual costs the budget of two Singles. */
  maxDualCabs: number;
  /** Poly / high-DSP blocks — a hard count cap, independent of DSP. */
  maxPolyBlocks: number;
  maxPolyBlocksPerPath: number;
  maxSnapshots: number;
  /** Always 64 across the family. See CONTROLLER_ASSIGNMENT_CAP. */
  controllerAssignmentCap: number;
  /** HX Effects has no amp or cab modelling at all. */
  supportsAmpBlocks: boolean;
  notes: string;
}

/**
 * Block-count and category caps are quoted from the 3.80 owner's manuals
 * (Helix, HX Stomp, HX Stomp XL, HX Effects), so they are hard facts.
 * The claim that each single-DSP unit gets the same 100-unit budget as one
 * Helix path is the community consensus, not a Line 6 statement — see
 * docs/HELIX_DSP_BUDGET.md, "What we could not verify".
 */
export const DEVICE_CAPACITIES: Record<HelixDevice, DeviceCapacity> = {
  helix_floor: {
    id: "helix_floor",
    label: "Helix Floor",
    deviceId: 2162689,
    dspChips: 2,
    paths: 2,
    maxBlocks: 32,
    maxBlocksPerPath: 16,
    maxAmps: 4,
    maxAmpsPerPath: 2,
    maxSingleCabs: 4,
    maxDualCabs: 2,
    maxPolyBlocks: 2,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 8,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: true,
    notes:
      "Two SHARCs, one per primary path. A preset living entirely on path 1 " +
      "uses half the unit. Each of paths 1A/1B/2A/2B holds 8 block locations.",
  },
  helix_lt: {
    id: "helix_lt",
    label: "Helix LT",
    deviceId: 2162692,
    dspChips: 2,
    paths: 2,
    maxBlocks: 32,
    maxBlocksPerPath: 16,
    maxAmps: 4,
    maxAmpsPerPath: 2,
    maxSingleCabs: 4,
    maxDualCabs: 2,
    maxPolyBlocks: 2,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 8,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: true,
    notes:
      "Identical DSP and block budget to Helix Floor. The LT gives up I/O " +
      "(fewer sends/returns, no mic in, no Variax VDI), not processing.",
  },
  helix_rack: {
    id: "helix_rack",
    label: "Helix Rack",
    dspChips: 2,
    paths: 2,
    maxBlocks: 32,
    maxBlocksPerPath: 16,
    maxAmps: 4,
    maxAmpsPerPath: 2,
    maxSingleCabs: 4,
    maxDualCabs: 2,
    maxPolyBlocks: 2,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 8,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: true,
    notes:
      "Same engine and budget as Helix Floor. We have no verified .hlx " +
      "device ID for the Rack in our corpus.",
  },
  hx_stomp: {
    id: "hx_stomp",
    label: "HX Stomp",
    deviceId: 2162694,
    dspChips: 1,
    paths: 1,
    maxBlocks: 8,
    maxBlocksPerPath: 8,
    maxAmps: 2,
    maxAmpsPerPath: 2,
    maxSingleCabs: 2,
    maxDualCabs: 1,
    maxPolyBlocks: 1,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 3,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: true,
    notes:
      "8 blocks since firmware 3.00 (6 before). Path 1A/1B are parallel " +
      "branches sharing the single DSP, not extra headroom. Only 3 snapshots " +
      "— the tightest constraint for set-length presets.",
  },
  hx_stomp_xl: {
    id: "hx_stomp_xl",
    label: "HX Stomp XL",
    deviceId: 2162696,
    dspChips: 1,
    paths: 1,
    maxBlocks: 8,
    maxBlocksPerPath: 8,
    maxAmps: 2,
    maxAmpsPerPath: 2,
    maxSingleCabs: 2,
    maxDualCabs: 1,
    maxPolyBlocks: 1,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 4,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: true,
    notes:
      "Same DSP and same 8-block ceiling as the HX Stomp. The XL buys " +
      "footswitches and a 4th snapshot, not processing power.",
  },
  hx_effects: {
    id: "hx_effects",
    label: "HX Effects",
    dspChips: 1,
    paths: 1,
    maxBlocks: 9,
    maxBlocksPerPath: 9,
    maxAmps: 0,
    maxAmpsPerPath: 0,
    maxSingleCabs: 0,
    maxDualCabs: 0,
    maxPolyBlocks: 2,
    maxPolyBlocksPerPath: 1,
    maxSnapshots: 4,
    controllerAssignmentCap: CONTROLLER_ASSIGNMENT_CAP,
    supportsAmpBlocks: false,
    notes:
      "Line 6 forum staff: HX Effects and HX Stomp have 'the exact same " +
      "processor and the same DSP allocation'. No amp or cab models at all, " +
      "so the whole budget goes to effects — 9 blocks and IR blocks are " +
      "supported. Its manual still phrases poly limits as 'one per path max'.",
  },
};

/* ------------------------------------------------------------------ */
/*  Lookup                                                             */
/* ------------------------------------------------------------------ */

function normalizeKey(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Strip the .hlx model-ID scaffolding so "HD2_AmpUSDoubleNrm" -> "usdoublenrm". */
function stripModelIdPrefix(input: string): string {
  const withoutNamespace = input.replace(/^(?:HD2|VIC|L6SPB|Victoria)_/, "");
  const withoutCategory = withoutNamespace.replace(
    /^(?:CabMicIr_|Preamp|Amp|Cab|Dist|Delay|Reverb|Chorus|Compressor|Gate|EQ|Filter|Flanger|Phaser|Tremolo|Rotary|Vibrato|RingModulator|Pitch|Synth|Wah|VolPan|Looper)/,
    "",
  );
  return normalizeKey(withoutCategory.replace(/WithPan$/, ""));
}

/**
 * Extra names that should resolve to an existing entry: model IDs the source
 * table doesn't carry, and the names our own Bible / recipe data uses where it
 * differs from Line 6's official model name.
 */
const COST_ALIASES: Record<string, string> = {
  // Bible/recipe naming -> Line 6 naming
  "Ram's Head": "Bighorn Fuzz",
  "Rams Head": "Bighorn Fuzz",
  HD2_DistRamsHead: "Bighorn Fuzz",
  "Brit J-800": "Brit 2204",
  "Vintage Digital V2": "Vintage Digital",
  HD2_DelayVintageDigitalV2: "Vintage Digital",
  "10-Band Graphic EQ": "10-Band Graphic",
  HD2_EQGraphic10Band: "10-Band Graphic",
  "Cali Q": "Cali Q Graphic",
  HD2_CaliQ: "Cali Q Graphic",
  HD2_EQSimpleTilt: "Tilt",
  HD2_EQLowCutHighCut: "Low Cut/High Cut",
  HD2_EQLowShelfHighShelf: "Low/High Shelf",
  HD2_EQSimple3Band: "Simple EQ",
  // Vol/Pan model IDs
  HD2_VolPanVol: "Vol/Pan Volume",
  HD2_VolPanGain: "Vol/Pan Gain",
  HD2_VolPanPan: "Vol/Pan Pan",
  HD2_VolPanStereoImager: "Stereo Imager",
  // Reverbs: our recipes name the Legacy models bare
  HD2_ReverbHxSpring: "Hot Springs",
  HD2_ReverbNonLinear: "Nonlinear",
  VIC_DynPlate: "Dynamic Plate",
  VIC_ReverbDynHall: "Dynamic Hall",
  VIC_ReverbDynRoom: "Dynamic Room",
  VIC_ReverbDynAmbience: "Dynamic Ambience",
  VIC_ReverbDynBloom: "Dynamic Bloom",
  "Dyn Ambience": "Dynamic Ambience",
  "Dyn Room": "Dynamic Room",
  "Dyn Hall": "Dynamic Hall",
  "Dyn Plate": "Dynamic Plate",
  // Poly / synth model IDs
  L6SPB_PolyPitch: "Poly Pitch",
  L6SPB_PolyWham: "Poly Wham",
  L6SPB_12String: "12 String",
  VIC_DelayPolySustain: "Poly Sustain",
  VIC_PitchTwelveString: "12 String",
  // Misc
  "Teemah": "Teemah!",
  HD2_DistTeemah: "Teemah!",
  HD2_CompressorAutoSwell: "Autoswell",
  HD2_Compressor3BandComp: "3-Band Comp",
  HD2_GateNoiseGate: "Noise Gate",
  HD2_GateHardGate: "Hard Gate",
  HD2_GateHorizonGate: "Horizon Gate",
  HD2_FilterAshevillePattrn: "Asheville Pattrn",
  HD2_FilterAutoFilter: "Autofilter",
  HD2_FilterMutantFilter: "Mutant Filter",
  HD2_FilterMysterFilter: "Mystery Filter",
  HD2_DelayCrissCross: "Crisscross",
  HD2_DelayModChorusEcho: "Mod/Chorus Echo",
  HD2_PhaserUbiquitousVibe: "Ubiquitous Vibe",
  HD2_RotaryVibeRotary: "Vibe Rotary",
  HD2_Rotary122Rotary: "122 Rotary",
  HD2_Rotary145Rotary: "145 Rotary",
  HD2_RingModulatorAMRingMod: "AM Ring Mod",
  HD2_RingModulatorPitchRingMod: "Pitch Ring Mod",
  HD2_Tremolo60sBiasTrem: "60s Bias Trem",
  HD2_TremoloOpticalTrem: "Optical Trem",
  HD2_TremoloHarmonic: "Harmonic Tremolo",
  HD2_TremoloTremolo: "Tremolo",
  HD2_TremoloPattern: "Bleat Chop Trem",
  HD2_DistAmpegScramblerOD: "Ampeg Scrambler",
  HD2_DistZeroAmpBassDI: "ZeroAmp Bass DI",
  HD2_DistKWB: "KWB",
  HD2_Synth3NoteGenerator: "3 Note Generator",
  HD2_Looper: "1 Switch Looper",
};

const COST_INDEX: Record<string, DspCost> = (() => {
  const index: Record<string, DspCost> = {};
  for (const [name, cost] of Object.entries(DSP_COSTS)) {
    const primary = normalizeKey(name);
    if (!(primary in index)) index[primary] = cost;
    // "Plate (Legacy)" should also answer to a bare "Plate" lookup when no
    // HX model of that name exists.
    const bare = normalizeKey(name.replace(/\s*\(Legacy\)$/, ""));
    if (!(bare in index)) index[bare] = cost;
    if (cost.modelId) {
      const id = normalizeKey(cost.modelId);
      if (!(id in index)) index[id] = cost;
      const stripped = stripModelIdPrefix(cost.modelId);
      if (stripped && !(stripped in index)) index[stripped] = cost;
    }
  }
  for (const [alias, target] of Object.entries(COST_ALIASES)) {
    const cost = DSP_COSTS[target];
    if (!cost) continue;
    const key = normalizeKey(alias);
    if (!(key in index)) index[key] = cost;
  }
  return index;
})();

/**
 * Individual cab models have no individual cost: the source table lists ONE
 * row for every new-engine speaker sim and ONE for every legacy one, which
 * matches Line 6's own wording ("The IR-based Cab blocks and IR blocks
 * (firmware version 3.50 and later) utilize significantly less DSP than the
 * original Legacy Cab blocks"). So we resolve any cab model to its format.
 *
 * Format is readable off the model ID: HD2_CabMicIr_* is the 3.50+ IR-based
 * cab engine, plain HD2_Cab* is the original legacy format. A bare display
 * name like "2x12 Blue Bell" is assumed new-engine, because that is what we
 * generate.
 */
function resolveCabCost(model: string): DspCost | undefined {
  if (/^(?:HD2|VIC)_CabMicIr_/i.test(model)) {
    return DSP_COSTS["Cab (new engine, single)"];
  }
  if (/^(?:HD2|VIC)_Cab/i.test(model)) {
    return DSP_COSTS["Cab (legacy, single)"];
  }
  if (/^\s*\d+\s*x\s*\d+/i.test(model)) {
    return DSP_COSTS["Cab (new engine, single)"];
  }
  return undefined;
}

/**
 * Resolve a Helix display name ("US Double Nrm", "Glitz") or a raw .hlx model
 * ID ("HD2_AmpUSDoubleNrm", "HD2_CabMicIr_2x12BlueBellWithPan") to its cost
 * entry. Case- and punctuation-insensitive. Returns undefined for models we
 * have no data on — callers must treat that as "unknown", never as "free".
 */
export function lookupDspCost(model: string): DspCost | undefined {
  if (!model) return undefined;
  return (
    COST_INDEX[normalizeKey(model)] ??
    COST_INDEX[stripModelIdPrefix(model)] ??
    resolveCabCost(model)
  );
}

/* ------------------------------------------------------------------ */
/*  Usage estimation                                                   */
/* ------------------------------------------------------------------ */

/** How an amp model is instantiated. Drives which cost column we use. */
export type AmpVariant = "amp_cab" | "amp" | "preamp";

export interface BlockSpec {
  /** Display name or .hlx model ID. */
  model: string;
  /** Stereo instance of the block. Roughly doubles the cost. */
  stereo?: boolean;
  /**
   * Amps only. "amp_cab" is the combined Amp+Cab block (amp cost plus one
   * new-engine single cab); "amp" is the amp block alone; "preamp" is the
   * Preamp-only variant. Defaults to "amp_cab" for amp models, because that
   * is what our generated presets use.
   */
  variant?: AmpVariant;
  /** Cab blocks only: Dual cabs cost roughly twice a Single. */
  dualCab?: boolean;
  /** Primary path. Ignored (forced to 1) on single-DSP devices. */
  path?: 1 | 2;
}

export interface PathUsage {
  path: 1 | 2;
  /** Percentage of that path's DSP consumed. 100 is full. */
  usedPercent: number;
  blockCount: number;
  ampCount: number;
  cabCount: number;
  polyCount: number;
}

export interface DspUsageEstimate {
  device: HelixDevice;
  capacity: DeviceCapacity;
  paths: PathUsage[];
  /** Highest per-path utilisation — the number that actually bites. */
  worstPathPercent: number;
  totalBlocks: number;
  totalAmps: number;
  totalCabs: number;
  totalPolyBlocks: number;
  /** Models we have no cost data for. Their cost is counted as 0. */
  unknownModels: string[];
  /** Lowest confidence contributing to the estimate. */
  confidence: DspConfidence;
}

function costOf(spec: BlockSpec, entry: DspCost): number {
  const isAmp =
    entry.category === "amp" ||
    entry.category === "amp_bass" ||
    entry.category === "preamp";

  if (isAmp) {
    const variant: AmpVariant = spec.variant ?? "amp_cab";
    if (variant === "preamp" && entry.preamp !== undefined) return entry.preamp;
    const ampOnly = entry.mono;
    return variant === "amp_cab" ? ampOnly + CAB_NEW_SINGLE_MONO : ampOnly;
  }

  const base = spec.stereo ? entry.stereo : entry.mono;
  if ((entry.category === "cab" || entry.category === "ir") && spec.dualCab) {
    return base * 2;
  }
  return base;
}

const CONFIDENCE_RANK: Record<DspConfidence, number> = {
  measured: 0,
  reported: 1,
  estimated: 2,
};

/**
 * Add up what a chain costs on a given device.
 *
 * Blocks with no path set land on path 1, which is also what a naive
 * generated preset does — and is exactly the mistake that wastes half a
 * Helix. Compare paths[0].usedPercent against paths[1].usedPercent before
 * blaming the DSP.
 */
export function estimateDspUsage(
  blocks: BlockSpec[],
  device: HelixDevice,
): DspUsageEstimate {
  const capacity = DEVICE_CAPACITIES[device];
  const pathCount = capacity.paths;
  const paths: PathUsage[] = [];
  for (let i = 0; i < pathCount; i += 1) {
    paths.push({
      path: (i + 1) as 1 | 2,
      usedPercent: 0,
      blockCount: 0,
      ampCount: 0,
      cabCount: 0,
      polyCount: 0,
    });
  }

  const unknownModels: string[] = [];
  let confidence: DspConfidence = "measured";

  for (const spec of blocks) {
    const requested = spec.path ?? 1;
    const index = Math.min(Math.max(requested, 1), pathCount) - 1;
    const usage = paths[index];
    usage.blockCount += 1;

    const entry = lookupDspCost(spec.model);
    if (!entry) {
      if (!unknownModels.includes(spec.model)) unknownModels.push(spec.model);
      confidence = "estimated";
      continue;
    }

    if (CONFIDENCE_RANK[entry.confidence] > CONFIDENCE_RANK[confidence]) {
      confidence = entry.confidence;
    }

    usage.usedPercent += costOf(spec, entry);

    const isAmp =
      entry.category === "amp" ||
      entry.category === "amp_bass" ||
      entry.category === "preamp";
    if (isAmp) {
      usage.ampCount += 1;
      // An Amp+Cab block also consumes one of the cab slots.
      if ((spec.variant ?? "amp_cab") === "amp_cab") usage.cabCount += 1;
    }
    if (entry.category === "cab" || entry.category === "ir") {
      usage.cabCount += spec.dualCab ? 2 : 1;
    }
    if (entry.poly) usage.polyCount += 1;
  }

  for (const usage of paths) {
    usage.usedPercent = Math.round(usage.usedPercent * 100) / 100;
  }

  return {
    device,
    capacity,
    paths,
    worstPathPercent: paths.reduce((max, p) => Math.max(max, p.usedPercent), 0),
    totalBlocks: blocks.length,
    totalAmps: paths.reduce((n, p) => n + p.ampCount, 0),
    totalCabs: paths.reduce((n, p) => n + p.cabCount, 0),
    totalPolyBlocks: paths.reduce((n, p) => n + p.polyCount, 0),
    unknownModels,
    confidence,
  };
}

/* ------------------------------------------------------------------ */
/*  Fit verdict                                                        */
/* ------------------------------------------------------------------ */

/**
 * Why a chain doesn't fit. Order matters: we report the FIRST hard structural
 * violation before the DSP number, because "you used three amps" is more
 * actionable than "you're at 140%".
 */
export type LimitingFactor =
  | "none"
  | "unsupported_category"
  | "block_count"
  | "amp_count"
  | "cab_count"
  | "poly_count"
  | "dsp";

export interface FitVerdict {
  fits: boolean;
  limitingFactor: LimitingFactor;
  /** Human-readable explanation, safe to surface in product UI. */
  detail: string;
  /** Remaining DSP on the most loaded path. Negative means over budget. */
  headroomPercent: number;
  /** Remaining block locations on the most loaded path. */
  headroomBlocks: number;
  /** True when the verdict rests on models we have no cost data for. */
  hasUnknownModels: boolean;
  usage: DspUsageEstimate;
}

/**
 * Decide whether a chain will actually load on a device, and say what stops
 * it. Block count and DSP are genuinely different constraints: an HX Stomp
 * chain of eight cheap blocks (comp, two drives, amp+cab, EQ, delay, reverb)
 * hits the block ceiling with DSP to spare, while a four-block chain built
 * around Poly Pitch plus a big amp runs out of DSP with four slots unused.
 */
export function fitsOnDevice(
  blocks: BlockSpec[],
  device: HelixDevice,
): FitVerdict {
  const usage = estimateDspUsage(blocks, device);
  const cap = usage.capacity;

  const worstPath = usage.paths.reduce((worst, p) =>
    p.usedPercent > worst.usedPercent ? p : worst,
  );
  const fullestByBlocks = usage.paths.reduce((worst, p) =>
    p.blockCount > worst.blockCount ? p : worst,
  );

  const headroomPercent =
    Math.round((DSP_BUDGET_PER_CHIP - worstPath.usedPercent) * 100) / 100;
  const headroomBlocks = cap.maxBlocksPerPath - fullestByBlocks.blockCount;
  const hasUnknownModels = usage.unknownModels.length > 0;

  const verdict = (
    limitingFactor: LimitingFactor,
    detail: string,
  ): FitVerdict => ({
    fits: limitingFactor === "none",
    limitingFactor,
    detail,
    headroomPercent,
    headroomBlocks,
    hasUnknownModels,
    usage,
  });

  if (!cap.supportsAmpBlocks && usage.totalAmps > 0) {
    return verdict(
      "unsupported_category",
      `${cap.label} has no amp or cab models. Remove the ${usage.totalAmps} amp block(s) or target a different device.`,
    );
  }

  if (usage.totalBlocks > cap.maxBlocks) {
    return verdict(
      "block_count",
      `${usage.totalBlocks} blocks exceeds the ${cap.maxBlocks}-block ceiling on ${cap.label}. This is a hard count limit, not a DSP limit — cheaper models will not help.`,
    );
  }

  if (fullestByBlocks.blockCount > cap.maxBlocksPerPath) {
    return verdict(
      "block_count",
      `Path ${fullestByBlocks.path} holds ${fullestByBlocks.blockCount} blocks; ${cap.label} allows ${cap.maxBlocksPerPath} per path.`,
    );
  }

  if (usage.totalAmps > cap.maxAmps) {
    return verdict(
      "amp_count",
      `${usage.totalAmps} amp/preamp blocks exceeds the ${cap.maxAmps} allowed on ${cap.label}.`,
    );
  }

  const ampOffender = usage.paths.find((p) => p.ampCount > cap.maxAmpsPerPath);
  if (ampOffender) {
    return verdict(
      "amp_count",
      `Path ${ampOffender.path} has ${ampOffender.ampCount} amp blocks; ${cap.maxAmpsPerPath} per path is the limit.`,
    );
  }

  if (usage.totalCabs > cap.maxSingleCabs) {
    return verdict(
      "cab_count",
      `${usage.totalCabs} cab/IR slots exceeds the ${cap.maxSingleCabs} single-cab equivalents allowed on ${cap.label} (a Dual Cab counts as two).`,
    );
  }

  if (usage.totalPolyBlocks > cap.maxPolyBlocks) {
    return verdict(
      "poly_count",
      `${usage.totalPolyBlocks} poly/high-DSP blocks exceeds the ${cap.maxPolyBlocks} allowed on ${cap.label}. Line 6 caps these by count regardless of free DSP.`,
    );
  }

  const polyOffender = usage.paths.find(
    (p) => p.polyCount > cap.maxPolyBlocksPerPath,
  );
  if (polyOffender) {
    return verdict(
      "poly_count",
      `Path ${polyOffender.path} has ${polyOffender.polyCount} poly blocks; only ${cap.maxPolyBlocksPerPath} per path is allowed.`,
    );
  }

  if (worstPath.usedPercent > DSP_BUDGET_PER_CHIP) {
    return verdict(
      "dsp",
      `Path ${worstPath.path} is at ${worstPath.usedPercent}% of its DSP (limit 100%). ` +
        (cap.dspChips > 1
          ? "Move blocks to the other path, or "
          : "") +
        "swap the amp for its Preamp-only variant, use mono instead of stereo effects, or drop a poly/reverb block.",
    );
  }

  return verdict(
    "none",
    `Fits on ${cap.label}: worst path at ${worstPath.usedPercent}% DSP, ${headroomBlocks} block slot(s) free.` +
      (hasUnknownModels
        ? ` WARNING: ${usage.unknownModels.length} model(s) have no cost data and were counted as free — treat this verdict as provisional.`
        : ""),
  );
}

/* ------------------------------------------------------------------ */
/*  Helix Stadium                                                      */
/* ------------------------------------------------------------------ */

/**
 * Helix Stadium (2025 hardware, Agoura engine, Proxy cloning as of firmware
 * 1.3 in March 2026) is deliberately NOT in DEVICE_CAPACITIES: its costs are
 * on a different engine and we have no allocation table for it. Nothing in
 * this module should be applied to a Stadium preset.
 *
 * What Line 6 documents for it: 48 block locations across four paths, up to
 * four amps (two per path), up to eight cabs (four per path), one poly block
 * per path, one looper — and the same "Dynamic DSP" grey-out behaviour, still
 * with independent DSP per primary path. Agoura amp models are explicitly
 * called out as varying more in cost than the SHARC-era ones.
 *
 * Set Builder should keep targeting the classic line, which is the installed
 * base. Revisit when a Stadium allocation table exists.
 */
export const HELIX_STADIUM_NOTE = {
  supported: false,
  maxBlocks: 48,
  paths: 4,
  maxAmps: 4,
  maxAmpsPerPath: 2,
  maxCabs: 8,
  maxCabsPerPath: 4,
  maxPolyBlocksPerPath: 1,
  engine: "Agoura (replaces SHARC)",
  confidence: "reported" as DspConfidence,
  source: "Line 6 Helix Stadium manual, 'Dynamic DSP'",
} as const;
