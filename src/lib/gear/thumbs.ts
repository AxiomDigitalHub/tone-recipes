/**
 * Thumbnail system for Learn, Guide and News (redesign step 6).
 *
 * Each thumbnail = drawing + framing + pattern + colour. Ported from the
 * handoff's build.py (PAL, pat, FRAME, thumb).
 *
 * - Pattern follows the topic: drive and compression = waveform, delay and
 *   reverb = ripples, amps = tolex, cabs and mics = cloth, signal chain =
 *   path. Everything else takes dots, stripes or plain.
 * - Drawing = the post's main gear.
 * - Framing and colour come from a stable hash of the post slug, so they
 *   never change between builds and neighbours differ.
 * - Front matter can override any part by hand:
 *     thumb: { gear: delay, pattern: ripple, frame: tilt, color: teal }
 */
import type { GearKind } from "./draw";

export const PAL = {
  amber: ["#F3C567", "#B9770F"],
  teal: ["#A9D9CC", "#2D5A50"],
  blue: ["#BCD3EA", "#3E6C9C"],
  pink: ["#F1C1BC", "#B4473A"],
  lilac: ["#D2C8EC", "#6A58A8"],
  sand: ["#D8CDB6", "#9C8F74"],
  green: ["#C5DDB0", "#4F7A36"],
  char: ["#2A2725", "#EFE7D2"],
} as const;
export type ThumbColor = keyof typeof PAL;

export type ThumbPattern = "wave" | "ripple" | "path" | "dots" | "stripes" | "plain" | "tolex" | "cloth";
const PATTERN_DEFAULT_COLOR: Record<ThumbPattern, ThumbColor> = {
  wave: "amber", ripple: "teal", path: "blue", dots: "pink",
  stripes: "lilac", plain: "sand", tolex: "char", cloth: "sand",
};

export const FRAME = {
  front: "",
  tilt: "rotate(-10deg) scale(1.08)",
  tiltR: "rotate(12deg) scale(1.08)",
  close: "translate(0, 50%) scale(2.3)",
  foot: "translate(0, -56%) scale(2.2)",
  corner: "translate(24%, 26%) rotate(-18deg) scale(1.7)",
  edge: "translate(-40%, 6%) rotate(8deg) scale(1.6)",
  top: "translate(0, 44%) rotate(180deg) scale(1.5)",
} as const;
export type ThumbFrame = keyof typeof FRAME;

export type ThumbTopic = "drive" | "time" | "amps" | "cabs" | "chain" | "other";

export const TOPICS: { id: Exclude<ThumbTopic, "other">; title: string; blurb: string; pattern: ThumbPattern; gear: { kind: GearKind; color?: string; cloth?: string }[] }[] = [
  { id: "drive", title: "Drive, fuzz and compression", blurb: "Gain staging, stacking, where the squeeze goes.", pattern: "wave", gear: [{ kind: "comp" }, { kind: "drive" }, { kind: "fuzz" }] },
  { id: "time", title: "Delay and reverb", blurb: "Tap tempo, note values, trails.", pattern: "ripple", gear: [{ kind: "delay" }, { kind: "reverb" }] },
  { id: "amps", title: "Amps", blurb: "Channels, headroom, bias and sag.", pattern: "tolex", gear: [{ kind: "head", color: "#D9CDB4", cloth: "#6B5B45" }, { kind: "preamp" }] },
  { id: "cabs", title: "Cabs, mics and IRs", blurb: "Speakers, mic position, room correction.", pattern: "cloth", gear: [{ kind: "cab" }, { kind: "mic" }] },
  { id: "chain", title: "The whole signal chain", blurb: "Block order, volume pedals, buffers.", pattern: "path", gear: [{ kind: "vol" }, { kind: "eq" }, { kind: "mod" }] },
];
export const TOPIC_TITLE: Record<ThumbTopic, string> = {
  drive: "Drive, fuzz and compression",
  time: "Delay and reverb",
  amps: "Amps",
  cabs: "Cabs, mics and IRs",
  chain: "The whole signal chain",
  other: "More guides",
};

/** FNV-1a. Stable across builds and platforms. */
export function hashSlug(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

interface PostLike {
  slug: string;
  title: string;
  tags?: string[];
  category?: string;
  thumb?: Partial<{ gear: string; pattern: string; frame: string; color: string }>;
}

const GEAR_RULES: [RegExp, GearKind, ThumbTopic][] = [
  [/\bdelay|echo|tap tempo|repeats/, "delay", "time"],
  [/reverb|spring tank|plate|shimmer|ambien/, "reverb", "time"],
  [/fuzz|big muff|tone ?bender/, "fuzz", "drive"],
  [/compress|sustainer|limiter|noise gate|\bgate\b/, "comp", "drive"],
  [/\bklon|boost|treble booster/, "drive2", "drive"],
  [/overdrive|distortion|tube screamer|\bdrive\b|gain stag|stack(ing|ed)? /, "drive", "drive"],
  [/\bmic\b|microphone|sm57|ribbon/, "mic", "cabs"],
  [/\bir\b|\birs\b|impulse response|cab(inet)?s?\b|speaker|celestion|greenback|alnico|recone/, "cab", "cabs"],
  [/preamp/, "preamp", "amps"],
  [/\bamps?\b|amplifier|headroom|bias|sag\b|tube|valve|channel|marshall|fender|vox|mesa|plexi|jcm|deluxe|twin|combo/, "head", "amps"],
  [/chorus|flang|phas|tremolo|vibrato|univibe|modulation|rotary/, "mod", "chain"],
  [/\beq\b|equali[sz]|frequency|low cut|high cut|mids?\b/, "eq", "chain"],
  [/volume pedal|expression|buffer|cable|signal chain|pedalboard|block order|routing|path|snapshot|preset|true bypass|patch/, "vol", "chain"],
];

/** Topic and main gear for a post, from its title, then its tags. */
export function classify(post: PostLike): { gear: GearKind; topic: ThumbTopic } {
  const title = post.title.toLowerCase();
  for (const [re, gear, topic] of GEAR_RULES) if (re.test(title)) return { gear, topic };
  const tags = (post.tags ?? []).join(" ").toLowerCase().replace(/-/g, " ");
  for (const [re, gear, topic] of GEAR_RULES) if (re.test(tags)) return { gear, topic };
  return { gear: "drive2", topic: "other" };
}

const TOPIC_PATTERN: Record<Exclude<ThumbTopic, "other">, ThumbPattern> = {
  drive: "wave", time: "ripple", amps: "tolex", cabs: "cloth", chain: "path",
};
const OTHER_PATTERNS: ThumbPattern[] = ["dots", "stripes", "plain"];
const FRAMES = Object.keys(FRAME) as ThumbFrame[];
const COLORS: ThumbColor[] = ["amber", "teal", "blue", "pink", "lilac", "sand", "green"];
const GEAR_KINDS = new Set<string>(["vol", "comp", "drive", "drive2", "fuzz", "mod", "delay", "delay2", "reverb", "eq", "amp", "head", "preamp", "cab", "mic"]);
const PATTERNS = new Set<string>(["wave", "ripple", "path", "dots", "stripes", "plain", "tolex", "cloth"]);

export interface ThumbSpec {
  gear: GearKind;
  pattern: ThumbPattern;
  frame: ThumbFrame;
  /** null = the pattern's own ground (tolex and cloth carry their own). */
  color: ThumbColor | null;
  topic: ThumbTopic;
}

/** The thumbnail for a post: classified, hashed, then front matter overrides. */
export function thumbFor(post: PostLike): ThumbSpec {
  const { gear, topic } = classify(post);
  const h = hashSlug(post.slug);
  const pattern = topic === "other" ? OTHER_PATTERNS[h % OTHER_PATTERNS.length] : TOPIC_PATTERN[topic];
  const spec: ThumbSpec = {
    gear,
    pattern,
    frame: FRAMES[(h >>> 4) % FRAMES.length],
    color: pattern === "tolex" || pattern === "cloth" ? null : COLORS[(h >>> 9) % COLORS.length],
    topic,
  };
  const o = post.thumb;
  if (o) {
    if (o.gear && GEAR_KINDS.has(o.gear)) spec.gear = o.gear as GearKind;
    if (o.pattern && PATTERNS.has(o.pattern)) {
      spec.pattern = o.pattern as ThumbPattern;
      if (spec.pattern === "tolex" || spec.pattern === "cloth") spec.color = null;
    }
    if (o.frame && o.frame in FRAME) spec.frame = o.frame as ThumbFrame;
    if (o.color && o.color in PAL) spec.color = o.color as ThumbColor;
  }
  return spec;
}

/** Background colour and SVG markup (viewBox 0 0 400 300) for a pattern. */
export function drawPattern(kind: ThumbPattern, uid: string, color?: ThumbColor | null): { bg: string; inner: string } {
  const [bg, fg] = PAL[color || PATTERN_DEFAULT_COLOR[kind]];
  if (kind === "wave") {
    let rows = "";
    for (let r = 0; r < 6; r++) {
      const y0 = 30 + r * 48;
      const pts: string[] = [];
      for (let x = 0; x <= 400; x += 4) {
        const g = 0.5 + (2.2 * x) / 400;
        const v = Math.max(-1, Math.min(1, Math.sin(x / 9.0 + r) * g));
        pts.push(`${x},${(y0 - v * 15).toFixed(1)}`);
      }
      rows += `<polyline points="${pts.join(" ")}" fill="none" stroke="${fg}" stroke-width="2" stroke-linejoin="round" opacity=".55"></polyline>`;
    }
    return { bg, inner: rows };
  }
  if (kind === "ripple") {
    let c = "";
    for (let i = 0; i < 13; i++) c += `<circle cx="200" cy="150" r="${18 + i * 22}" fill="none" stroke="${fg}" stroke-width="2" opacity="${Math.max(0.12, 0.6 - i * 0.045).toFixed(2)}"></circle>`;
    return { bg, inner: c };
  }
  if (kind === "tolex") {
    return {
      bg: "#2A2725",
      inner: `<defs><filter id="${uid}t" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="7"></feTurbulence><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75"></feColorMatrix></filter></defs><rect width="400" height="300" filter="url(#${uid}t)" opacity=".2"></rect><rect x="12" y="12" width="376" height="276" rx="14" fill="none" stroke="#EFE7D2" stroke-width="2" opacity=".85"></rect>`,
    };
  }
  if (kind === "cloth") {
    return {
      bg: "#C9BDA4",
      inner: `<defs><pattern id="${uid}c" patternUnits="userSpaceOnUse" width="10" height="10"><path d="M0,2.5 H10 M0,7.5 H10" stroke="#9C8F74" stroke-width="2"></path><path d="M2.5,0 V10 M7.5,0 V10" stroke="#E6DDC8" stroke-width="1.4"></path></pattern></defs><rect width="400" height="300" fill="url(#${uid}c)" opacity=".8"></rect>`,
    };
  }
  if (kind === "path") {
    let dots = "";
    for (let i = 0; i < 10; i++) for (let j = 0; j < 8; j++) dots += `<circle cx="${20 + i * 40}" cy="${20 + j * 40}" r="1.6" fill="${fg}" opacity=".45"></circle>`;
    return {
      bg,
      inner: `${dots}<path d="M-10,230 C80,230 90,70 200,70 S320,230 410,230" fill="none" stroke="${fg}" stroke-width="3" opacity=".55"></path><path d="M-10,250 C80,250 90,90 200,90 S320,250 410,250" fill="none" stroke="${fg}" stroke-width="1.5" opacity=".35"></path>`,
    };
  }
  if (kind === "dots") {
    let d = "";
    for (let i = 0; i < 15; i++) for (let j = 0; j < 13; j++) d += `<circle cx="${14 + i * 28 + (j % 2 ? 14 : 0)}" cy="${14 + j * 24}" r="4.5" fill="${fg}" opacity=".28"></circle>`;
    return { bg, inner: d };
  }
  if (kind === "stripes") {
    let l = "";
    for (let i = 0; i < 24; i++) l += `<line x1="${-300 + i * 36}" y1="320" x2="${20 + i * 36}" y2="-20" stroke="${fg}" stroke-width="12" opacity=".2"></line>`;
    return { bg, inner: l };
  }
  return { bg, inner: "" };
}
