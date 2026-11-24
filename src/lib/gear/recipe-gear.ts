/**
 * Recipe data → gear drawings and dials (redesign step 3).
 *
 * The recipe page draws every block of a signal chain as a piece of gear
 * with its knobs at the recipe's stored settings, and breaks every setting
 * out as a dial. This file is the only place that decides which drawing a
 * block gets, which stored setting drives which knob, and where a dial
 * sits in its range.
 *
 * Pure and server-safe. Used by both server and client components.
 */

import type { PreviewBlockData } from "@/components/v3/preview-helpers";
import type { GearKind } from "./draw";

type Range = { min?: number; max?: number; neutral?: number; unit?: string };

export interface GearPick {
  kind: GearKind;
  /** 0 to 10, in the drawing's knob order. */
  vals?: number[];
  /** Printed on the pedal face when the generic name would be wrong. */
  title?: string;
  /** Delay readout, milliseconds. */
  disp?: string;
}

export interface DialSpec {
  key: string;
  label: string;
  /** The value as printed, with its unit. */
  display: string;
  /** Position in range, 0 to 1. */
  frac: number;
}

const hay = (b: PreviewBlockData) =>
  `${b.name} ${b.sub} ${b.category ?? ""}`.toLowerCase();

// ── ranges ─────────────────────────────────────────────────────────────

/** Bounds for a control: registry metadata first, then the value's scale. */
function bounds(key: string, v: number, r?: Range): { min: number; max: number; log: boolean } {
  const unit = (r?.unit || "").toLowerCase();
  if (r && r.min !== undefined && r.max !== undefined && r.max > r.min) {
    // Guard against a registry scale the value does not use (some platforms
    // run 0 to 100 where the registry says 0 to 10, or 0 to 1).
    if (v >= r.min && v <= r.max) {
      const log = unit === "hz" && r.min > 0 && r.max / r.min >= 50;
      return { min: r.min, max: r.max, log };
    }
  }
  const k = key.toLowerCase();
  if (unit === "hz" || /cut|freq|hz/.test(k)) {
    if (v >= 10) return { min: 20, max: 20000, log: true };
  }
  if (unit === "db" || v < 0) {
    const m = Math.max(12, Math.ceil(Math.abs(v) / 6) * 6);
    return { min: -m, max: m, log: false };
  }
  if (v <= 1) return { min: 0, max: 1, log: false };
  if (v <= 10) return { min: 0, max: 10, log: false };
  if (v <= 100) return { min: 0, max: 100, log: false };
  const p = Math.pow(10, Math.ceil(Math.log10(v)));
  return { min: 0, max: p, log: false };
}

function fracOf(key: string, v: number, r?: Range): number {
  const { min, max, log } = bounds(key, v, r);
  if (log && v > 0) {
    return clamp01((Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)));
  }
  return clamp01((v - min) / (max - min));
}
const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);

// ── labels and values ──────────────────────────────────────────────────

/** "ChVol" → "Ch vol", "LowCut" → "Low cut", "BiasX" → "Bias X". */
export function controlLabel(key: string): string {
  const words = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/);
  return words
    .map((w, i) => {
      if (w.length === 1 || /^[A-Z0-9]{2,3}$/.test(w)) return w.toUpperCase();
      const lower = w.toLowerCase();
      return i === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(" ");
}

function trim(n: number, digits: number): string {
  return String(Number(n.toFixed(digits)));
}

export function controlDisplay(v: number, r?: Range): string {
  const unit = r?.unit || "";
  const u = unit.toLowerCase();
  if (u === "hz") {
    return v >= 1000 ? `${trim(v / 1000, 1)} kHz` : `${trim(v, 1)} Hz`;
  }
  let num: string;
  if (!unit && r?.min === 0 && r?.max === 10 && v >= 0 && v <= 10) {
    num = v === 10 ? "10" : v.toFixed(1);
  } else if (Number.isInteger(v)) {
    num = String(v);
  } else if (Math.abs(v) < 1) {
    num = trim(v, 2);
  } else {
    num = trim(v, 1);
  }
  if (!unit) return num;
  return unit === "%" ? `${num}%` : `${num} ${unit}`;
}

/** Every numeric setting on a block, as dials in stored order. */
export function dialsFor(block: PreviewBlockData): DialSpec[] {
  return block.controls
    .filter((key) => Number.isFinite(block.values[key]))
    .map((key) => {
      const v = block.values[key];
      const r = block.ranges?.[key];
      return { key, label: controlLabel(key), display: controlDisplay(v, r), frac: fracOf(key, v, r) };
    });
}

/**
 * Where to break an amp's dials into two rows: after Master, when there
 * is more below it (bias, sag and the rest).
 */
export function dialBreak(block: PreviewBlockData, dials: DialSpec[]): number | null {
  if (block.variant !== "amp" || dials.length <= 7) return null;
  const i = dials.findIndex((d) => /^master/i.test(d.key));
  return i >= 0 && i < dials.length - 1 ? i + 1 : null;
}

// ── knob slots ─────────────────────────────────────────────────────────

/** First control whose name matches, as a 0 to 10 knob value. */
function slot(block: PreviewBlockData, used: Set<string>, re: RegExp): number | undefined {
  const key = block.controls.find((k) => !used.has(k) && re.test(k) && Number.isFinite(block.values[k]));
  if (!key) return undefined;
  used.add(key);
  return fracOf(key, block.values[key], block.ranges?.[key]) * 10;
}

/** Fill named slots; an unmatched slot takes the next unused control, else noon. */
function slots(block: PreviewBlockData, patterns: RegExp[]): number[] | undefined {
  const used = new Set<string>();
  const out = patterns.map((re) => slot(block, used, re));
  if (out.every((v) => v === undefined)) return undefined;
  const rest = block.controls.filter((k) => !used.has(k) && Number.isFinite(block.values[k]));
  return out.map((v) => {
    if (v !== undefined) return v;
    const k = rest.shift();
    return k ? fracOf(k, block.values[k], block.ranges?.[k]) * 10 : 5;
  });
}

const GAIN = /^(gain|drive|dist|distortion|fuzz|sustain|overdrive|boost|amount)/i;
const TONE = /^(tone|treble|filter|color|colour|bright|eq|hi|high)/i;
const LEVEL = /^(level|volume|vol|output|out|master)/i;

function delayReadout(block: PreviewBlockData): string {
  const key = block.controls.find((k) => /^(time|delay|left ?time|l ?time)/i.test(k));
  if (!key) return "---";
  const v = block.values[key];
  const unit = (block.ranges?.[key]?.unit || "").toLowerCase();
  if (!Number.isFinite(v) || v <= 0) return "---";
  if (unit === "ms") return String(Math.round(v));
  if (unit === "s") return String(Math.round(v * 1000));
  // No unit on record: a time above 20 is milliseconds; anything smaller is
  // a note division or a 0 to 1 knob and has no honest readout.
  return v > 20 ? String(Math.round(v)) : "---";
}

/** Tilt EQ: a straight line through the five sliders, level at 0.5. */
function tiltVals(block: PreviewBlockData): number[] | undefined {
  const key = block.controls.find((k) => /^tilt/i.test(k));
  if (!key) return undefined;
  const slope = (fracOf(key, block.values[key], block.ranges?.[key]) - 0.5) * 2;
  return [-2, -1, 0, 1, 2].map((s) => Math.max(0, Math.min(10, 5 + s * slope * 1.75)));
}

const COMBO = /combo|deluxe|twin|vibrolux|vibroverb|princeton|champ|bassman|tweed|ac ?30|ac ?15|vox|matchless|jazz ?chorus|jc-?120|blues junior|supro|1x1[02]|2x1[02]|katana/i;
const MIC = /\bmic(rophone)?\b|sm ?57|sm ?58|md ?421|\bu ?[68]7\b|r-?121|ribbon|condenser|royer|sennheiser|neumann|shure|\be609\b/i;

/**
 * Pick the drawing for one block and set its knobs from the recipe.
 * `drivesBefore` and `delaysBefore` count earlier blocks of the same family
 * in the chain, so neighbours get different colourways.
 */
export function gearFor(block: PreviewBlockData, drivesBefore = 0, delaysBefore = 0): GearPick {
  const h = hay(block);

  if (block.variant === "amp") {
    const vals = slots(block, [
      /^(drive|gain|volume|vol|pre)/i,
      /^(bass|low)/i,
      /^mid/i,
      /^(treble|high|hi)/i,
      /^(presence|pres|bright|cut|reverb)/i,
      /^(ch ?vol|channel|master|output|level)/i,
    ]);
    if (/pre-?amp/.test(block.name.toLowerCase())) return { kind: "preamp", vals };
    return { kind: COMBO.test(h) ? "amp" : "head", vals };
  }
  if (block.variant === "cab") {
    return { kind: MIC.test(block.name) && !/cab|\dx\d/i.test(block.name) ? "mic" : "cab" };
  }

  // TONEX tone models and Kemper profiles are captures of an amp.
  if (/tone ?model|profile|capture/i.test(block.category ?? "")) {
    return { kind: COMBO.test(h) ? "amp" : "head" };
  }

  // Pedals, by family.
  if (/volume|expression|\bpan\b|gain block/.test(h) && block.controls.length <= 2) return { kind: "vol" };
  if (/wah|cry ?baby/.test(h)) return { kind: "vol", title: "WAH" };
  if (/gate|suppress/.test(h)) {
    return { kind: "comp", title: "GATE", vals: slots(block, [/^(thresh|sens|reduction|depth)/i, /^(decay|release|level|output)/i]) };
  }
  if (/comp(ressor)?|squeeze|limiter|dynamic|sustainer/.test(h)) {
    return { kind: "comp", vals: slots(block, [/^(sens|sustain|thresh|comp|ratio|peak|amount)/i, LEVEL]) };
  }
  if (/fuzz|muff|tone ?bender|face/.test(h)) {
    return { kind: "fuzz", vals: slots(block, [GAIN, LEVEL]) };
  }
  if (/delay|echo|tape/.test(h)) {
    return {
      kind: delaysBefore % 2 === 0 ? "delay" : "delay2",
      vals: slots(block, [/^(time|delay)/i, /^(feedback|repeats|regen)/i, /^(mix|level|blend|wet)/i]),
      disp: delayReadout(block),
    };
  }
  if (/reverb|hall|plate|spring|room|verb|shimmer|ambien/.test(h)) {
    const title = /spring/.test(h) ? undefined : /plate/.test(h) ? "PLATE" : /hall/.test(h) ? "HALL" : /room/.test(h) ? "ROOM" : "REVERB";
    return { kind: "reverb", title, vals: slots(block, [/^(mix|level|blend|wet|reverb)/i, /^(decay|time|dwell|size|length)/i, /^(pre|tone|damp)/i]) };
  }
  if (/\beq\b|graphic|parametric|tilt|equali/.test(h)) {
    const tilt = tiltVals(block);
    if (tilt) return { kind: "eq", vals: tilt };
    const bands = block.controls
      .filter((k) => !/^(level|output|volume|mix)/i.test(k) && !/freq|hz$|^q$|cut/i.test(k) && Number.isFinite(block.values[k]))
      .slice(0, 5)
      .map((k) => fracOf(k, block.values[k], block.ranges?.[k]) * 10);
    const title = /graphic/.test(h) ? "GRAPHIC EQ" : /parametric/.test(h) ? "PARA EQ" : "EQ";
    return { kind: "eq", title, vals: bands.length === 5 ? bands : [5, 5, 5, 5, 5] };
  }
  if (/chorus|flang|phase|trem|vibe|vibrato|rotary|leslie|modulat|pitch|octav|whammy|harmon|synth|filter|envelope/.test(h)) {
    const title = /flang/.test(h) ? "FLANGER" : /phase/.test(h) ? "PHASER" : /trem/.test(h) ? "TREMOLO"
      : /rotary|leslie/.test(h) ? "ROTARY" : /vibrato/.test(h) ? "VIBRATO" : /vibe/.test(h) ? "VIBE"
      : /octav/.test(h) ? "OCTAVE" : /pitch|whammy|harmon/.test(h) ? "PITCH" : /synth/.test(h) ? "SYNTH"
      : /filter|envelope/.test(h) ? "FILTER" : undefined;
    return { kind: "mod", title, vals: slots(block, [/^(rate|speed|freq|interval|sens)/i, /^(depth|intensity|mix|level|blend|amount)/i]) };
  }
  if (/dist(ortion)?|overdriv|drive|screamer|808|klon|centaur|minotaur|rat\b|bd-?2|blues|boost|booster|gain/.test(h)) {
    // By the block's own name, or a Klon behind it. "Tube Screamer (warm
    // boost)" is still an overdrive.
    const boost = /boost|klon|centaur|minotaur/i.test(block.name) || /klon|centaur/.test(h);
    const vals = slots(block, [GAIN, TONE, LEVEL]);
    if (boost || drivesBefore % 2 === 1) return { kind: "drive2", vals, title: boost ? undefined : "OVERDRIVE" };
    // By name, not category: Helix files every overdrive under "Distortion".
    const dist = /dist|\brat\b|metal|ds-?\d/i.test(`${block.name} ${block.sub}`);
    return { kind: "drive", vals, title: dist ? "DISTORTION" : undefined };
  }
  // Anything else: the plain box, named for what it is.
  return {
    kind: "drive2",
    title: (block.category || "EFFECT").toUpperCase().slice(0, 12),
    vals: slots(block, [GAIN, TONE, LEVEL]),
  };
}

/** Run gearFor over a chain, keeping the family counts. Source blocks are skipped. */
export function gearForChain(blocks: PreviewBlockData[]): (GearPick | null)[] {
  let drives = 0;
  let delays = 0;
  return blocks.map((b) => {
    if (b.variant === "source") return null;
    const pick = gearFor(b, drives, delays);
    if (pick.kind === "drive" || pick.kind === "drive2") drives++;
    if (pick.kind === "delay" || pick.kind === "delay2") delays++;
    return pick;
  });
}

/** Short type caption under a drawing: "Compressor", "Drive", "Amp". */
export function gearTypeLabel(block: PreviewBlockData, pick: GearPick): string {
  if (block.variant === "amp") return pick.kind === "preamp" ? "Preamp" : "Amp";
  if (pick.kind === "amp" || pick.kind === "head") return "Amp";
  if (block.variant === "cab") return pick.kind === "mic" ? "Mic" : "Cab";
  switch (pick.kind) {
    case "vol": return pick.title === "WAH" ? "Wah" : "Volume";
    case "comp": return pick.title === "GATE" ? "Gate" : "Compressor";
    case "fuzz": return "Fuzz";
    case "delay":
    case "delay2": return "Delay";
    case "reverb": return "Reverb";
    case "eq": return "EQ";
    case "mod": return pick.title ? pick.title.charAt(0) + pick.title.slice(1).toLowerCase() : "Chorus";
    default: return "Drive";
  }
}
