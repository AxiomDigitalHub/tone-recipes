/**
 * Gear drawings: every pedal, amp, cab, mic and dial as SVG.
 *
 * A line-for-line port of `generator/gear.py` from the redesign handoff
 * (the "studio" style, which is the only one the site uses). Geometry and
 * colours must stay exactly as drawn there; tests/gear-golden.test.ts
 * compares this output against the Python generator's.
 *
 * These are original designs. Do not add maker logos or copy a real
 * pedal's look.
 *
 * Pure string building, no React, so it runs on the server and in tests.
 * Render through <Gear> and <Dial> (src/components/gear).
 */

const INK = "#0A0908";
const AMBER = "#E4A235";
const OUT = "#1A1512";
const CREAM = "#F4F1EA";

export type GearKind =
  | "vol"
  | "comp"
  | "drive"
  | "drive2"
  | "fuzz"
  | "mod"
  | "delay"
  | "delay2"
  | "reverb"
  | "eq"
  | "amp"
  | "head"
  | "preamp"
  | "cab"
  | "mic";

export const GEAR_KINDS: GearKind[] = [
  "vol", "comp", "drive", "drive2", "fuzz", "mod", "delay", "reverb", "eq",
  "delay2", "amp", "head", "preamp", "cab", "mic",
];

export const GEAR_NAMES: Record<GearKind, string> = {
  vol: "Volume pedal",
  comp: "Compressor",
  drive: "Overdrive",
  drive2: "Boost",
  fuzz: "Fuzz",
  mod: "Chorus",
  delay: "Delay",
  delay2: "Delay, second colourway",
  reverb: "Reverb",
  eq: "EQ",
  amp: "Combo amp",
  head: "Amp head",
  preamp: "Preamp",
  cab: "Cab",
  mic: "Ribbon mic",
};

export interface GearFonts {
  sans: string;
  mono: string;
}

/** The site's fonts (next/font variables set in src/app/layout.tsx). */
export const SITE_FONTS: GearFonts = {
  sans: "var(--font-sans-flex), Arial, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, Menlo, monospace",
};

export interface GearOptions {
  /**
   * Control values on a 0 to 10 scale, in the order the drawing lays them
   * out. comp: sustain, level. drive/drive2: drive, tone, level.
   * mod: rate, depth. reverb: mix, decay, pre. fuzz: fuzz, volume.
   * delay/delay2: time, repeats, mix. eq: five sliders, low to high.
   * amp/head/preamp: six knobs, left to right.
   */
  vals?: number[];
  /** Name printed on the face. Defaults to the generic name. */
  title?: string;
  /** Delay readout text (milliseconds). */
  disp?: string;
  /** Enclosure colour override. */
  color?: string;
  /** Grille cloth colour (amp, head, cab). */
  cloth?: string;
  /** Draw cable stubs to the canvas edges. Off on recipe pages. */
  chain?: boolean;
  fonts?: GearFonts;
}

export interface Drawing {
  vw: number;
  vh: number;
  /** `<defs>` plus the artwork, ready to drop inside an `<svg>`. */
  inner: string;
}

// ── colour helpers ─────────────────────────────────────────────────────

function h2r(h: string): number[] {
  const s = h.replace(/^#/, "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
/** Python's round(): halves go to the even neighbour. */
function pyRound(v: number): number {
  const fl = Math.floor(v);
  const diff = v - fl;
  if (diff < 0.5) return fl;
  if (diff > 0.5) return fl + 1;
  return fl % 2 === 0 ? fl : fl + 1;
}
function r2h(c: number[]): string {
  return (
    "#" +
    c
      .map((v) =>
        Math.max(0, Math.min(255, pyRound(v)))
          .toString(16)
          .toUpperCase()
          .padStart(2, "0"),
      )
      .join("")
  );
}
function mix(a: string, b: string, t: number): string {
  const A = h2r(a);
  const B = h2r(b);
  return r2h([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * t));
}
const li = (c: string, t: number) => mix(c, "#FFFFFF", t);
const dk = (c: string, t: number) => mix(c, "#000000", t);
function lum(c: string): number {
  const [r, g, b] = h2r(c);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
/** Two decimals, trailing zeros trimmed. */
function f(v: number): string {
  let s = v.toFixed(2);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s === "-0" ? "0" : s;
}
const rad = (deg: number) => (deg * Math.PI) / 180;
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type Stop = [number, string];

// ── drawing context ────────────────────────────────────────────────────

class P {
  defs = new Map<string, string>();
  o: string[] = [];
  on: string;
  constructor(
    public u: string,
    public color: string,
    public fonts: GearFonts,
  ) {
    this.on = lum(color) > 0.52 ? INK : CREAM;
  }
  d(key: string, markup: string): string {
    const i = `${this.u}-${key}`;
    if (!this.defs.has(i)) this.defs.set(i, markup.replaceAll("ID", i));
    return i;
  }
  add(m: string) {
    this.o.push(m);
  }
  blur(n: number) {
    return this.d(
      `b${n}`,
      `<filter id="ID" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${n}"></feGaussianBlur></filter>`,
    );
  }
  lin(key: string, stops: Stop[], x2 = 0, y2 = 1) {
    const st = stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"></stop>`).join("");
    return this.d(key, `<linearGradient id="ID" x1="0" y1="0" x2="${x2}" y2="${y2}">${st}</linearGradient>`);
  }
  rad(key: string, stops: Stop[], cx = 0.5, cy = 0.3, r = 0.75) {
    const st = stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"></stop>`).join("");
    return this.d(key, `<radialGradient id="ID" cx="${cx}" cy="${cy}" r="${r}">${st}</radialGradient>`);
  }
  metal() {
    return this.lin("mt", [[0, "#FFFFFF"], [0.45, "#CFCDC7"], [1, "#85837D"]]);
  }
  grain() {
    return this.d(
      "gr",
      '<filter id="ID" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4"></feTurbulence><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.5 -0.7"></feColorMatrix><feComposite in2="SourceGraphic" operator="in"></feComposite></filter>',
    );
  }
  out(vw: number, vh: number): Drawing {
    return {
      vw,
      vh,
      inner: `<defs>${[...this.defs.values()].join("")}</defs>${this.o.join("")}`,
    };
  }
}

interface TextOpts {
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: string;
  ls?: number;
  op?: number;
}
function text(p: P, x: number, y: number, s: string, o: TextOpts = {}) {
  const { size = 6, weight = 600, fill, anchor = "middle", ls = 0.6, op = 1 } = o;
  p.add(
    `<text x="${f(x)}" y="${f(y)}" font-family="${p.fonts.sans}" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" text-anchor="${anchor}" fill="${fill || p.on}" opacity="${op}">${esc(s)}</text>`,
  );
}

function box(p: P, x: number, y: number, w: number, h: number, rx = 12, wall = 8) {
  const c = p.color;
  const b = p.blur(7);
  p.add(`<rect x="${x + 5}" y="${y + 18}" width="${w - 10}" height="${h + wall - 2}" rx="${rx}" fill="#000" opacity=".34" filter="url(#${b})"></rect>`);
  p.add(`<rect x="${x}" y="${y + wall}" width="${w}" height="${h}" rx="${rx}" fill="${dk(c, 0.45)}" stroke="${OUT}" stroke-width="1.5"></rect>`);
  const g = p.lin("bd" + c.slice(1), [[0, li(c, 0.18)], [0.5, c], [1, dk(c, 0.16)]]);
  p.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${g})" stroke="${OUT}" stroke-width="1.5"></rect>`);
  const gr = p.grain();
  p.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#000" opacity=".16" filter="url(#${gr})"></rect>`);
  const bv = p.d(
    "bev",
    '<linearGradient id="ID" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"></stop><stop offset=".3" stop-color="#fff" stop-opacity="0"></stop><stop offset=".7" stop-color="#000" stop-opacity="0"></stop><stop offset="1" stop-color="#000" stop-opacity=".3"></stop></linearGradient>',
  );
  p.add(`<rect x="${x + 2.4}" y="${y + 2.4}" width="${w - 4.8}" height="${h - 4.8}" rx="${rx - 2}" fill="none" stroke="url(#${bv})" stroke-width="1.6"></rect>`);
}

type KnobKind = "black" | "cream" | "silver" | "amber";
const KN: Record<KnobKind, [string, string, string, string]> = {
  black: ["#121010", "#55514D", "#1C1A18", "#F4F1EA"],
  cream: ["#BDB296", "#FFFCF2", "#D6CBAE", INK],
  silver: ["#7F7D78", "#FFFFFF", "#A5A39D", INK],
  amber: [dk(AMBER, 0.4), li(AMBER, 0.35), dk(AMBER, 0.1), INK],
};

/** Knob angle is -135 + value / 10 * 270 degrees. */
function knob(
  p: P,
  cx: number,
  cy: number,
  r: number,
  val = 5,
  kind: KnobKind = "black",
  label: string | null = null,
  ticks = true,
) {
  const ang = -135 + (val / 10) * 270;
  const [sk, c1, c2, pt] = KN[kind];
  if (ticks) {
    for (let i = 0; i < 11; i++) {
      const a = rad(-135 + 27 * i - 90);
      p.add(`<circle cx="${f(cx + (r + 4.6) * Math.cos(a))}" cy="${f(cy + (r + 4.6) * Math.sin(a))}" r="${f(Math.max(0.55, r * 0.045))}" fill="${p.on}" opacity=".7"></circle>`);
    }
  }
  const b = p.blur(3);
  p.add(`<ellipse cx="${cx}" cy="${f(cy + r * 0.42)}" rx="${f(r * 1.02)}" ry="${f(r * 0.95)}" fill="#000" opacity=".45" filter="url(#${b})"></ellipse>`);
  const gs = p.lin("ks" + kind, [[0, li(sk, 0.22)], [1, dk(sk, 0.25)]]);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gs})" stroke="${OUT}" stroke-width="1"></circle>`);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${f(r - 1.5)}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2.2" stroke-dasharray="1.1 1.7"></circle>`);
  const gc = p.rad("kc" + kind, [[0, c1], [1, c2]]);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${f(r * 0.72)}" fill="url(#${gc})" stroke="#000" stroke-opacity=".55" stroke-width=".8"></circle>`);
  p.add(`<ellipse cx="${cx}" cy="${f(cy - r * 0.4)}" rx="${f(r * 0.4)}" ry="${f(r * 0.16)}" fill="#fff" opacity=".22"></ellipse>`);
  p.add(`<line x1="${cx}" y1="${f(cy - r * 0.18)}" x2="${cx}" y2="${f(cy - r * 0.93)}" stroke="${pt}" stroke-width="${f(r * 0.15)}" stroke-linecap="round" transform="rotate(${f(ang)} ${cx} ${cy})"></line>`);
  if (label) text(p, cx, cy + r + 11.5, label, { size: Math.max(5.2, Math.min(6.4, r * 0.38)) });
}

function fsw(p: P, cx: number, cy: number, r = 17) {
  const pts = Array.from({ length: 6 }, (_, i) =>
    `${f(cx + r * 0.74 * Math.cos(rad(30 + 60 * i)))},${f(cy + r * 0.74 * Math.sin(rad(30 + 60 * i)))}`,
  ).join(" ");
  const b = p.blur(3);
  const m = p.metal();
  p.add(`<ellipse cx="${cx}" cy="${f(cy + r * 0.4)}" rx="${r}" ry="${f(r * 0.9)}" fill="#000" opacity=".4" filter="url(#${b})"></ellipse>`);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${m})" stroke="${OUT}" stroke-width="1"></circle>`);
  const m2 = p.lin("mt2", [[0, "#E9E7E2"], [1, "#77756F"]]);
  p.add(`<polygon points="${pts}" fill="url(#${m2})" stroke="#000" stroke-opacity=".5" stroke-width=".8"></polygon>`);
  const d = p.rad("dome", [[0, "#FFFFFF"], [0.55, "#BDBBB5"], [1, "#6E6C67"]], 0.5, 0.28, 0.8);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${f(r * 0.47)}" fill="url(#${d})" stroke="#000" stroke-opacity=".55" stroke-width=".8"></circle>`);
  p.add(`<ellipse cx="${cx}" cy="${f(cy - r * 0.22)}" rx="${f(r * 0.24)}" ry="${f(r * 0.1)}" fill="#fff" opacity=".8"></ellipse>`);
}

function led(p: P, cx: number, cy: number, r = 3, color = "#E5382B") {
  const b = p.blur(3);
  const m = p.metal();
  p.add(`<circle cx="${cx}" cy="${cy}" r="${r * 3}" fill="${color}" opacity=".55" filter="url(#${b})"></circle>`);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${f(r * 1.55)}" fill="url(#${m})" stroke="${OUT}" stroke-width=".8"></circle>`);
  const g = p.rad("led" + color.slice(1), [[0, "#FFFFFF"], [0.35, li(color, 0.35)], [1, dk(color, 0.25)]], 0.5, 0.3, 0.7);
  p.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g})"></circle>`);
}

function screws(p: P, x: number, y: number, w: number, h: number, inset = 10) {
  const pts: [number, number][] = [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + h - inset],
    [x + w - inset, y + h - inset],
  ];
  for (const [sx, sy] of pts) {
    const m = p.metal();
    p.add(`<circle cx="${sx}" cy="${sy}" r="2.6" fill="url(#${m})" stroke="#000" stroke-opacity=".6" stroke-width=".7"></circle><line x1="${sx - 1.6}" y1="${sy - 1}" x2="${sx + 1.6}" y2="${sy + 1}" stroke="#000" stroke-opacity=".6" stroke-width=".8"></line>`);
  }
}

function cable(p: P, d: string) {
  const b = p.blur(3);
  p.add(`<path d="${d}" fill="none" stroke="#000" stroke-width="5" opacity=".3" filter="url(#${b})" transform="translate(0 6)"></path>`);
  p.add(`<path d="${d}" fill="none" stroke="#161412" stroke-width="5.2" stroke-linecap="round"></path>`);
  p.add(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.2" stroke-linecap="round" transform="translate(0 -1.3)"></path>`);
}

function jacks(p: P, xl: number, xr: number, y: number, chain: boolean, power?: [number, number]) {
  const vw = 200;
  for (const [side, xe] of [["l", xl], ["r", xr]] as ["l" | "r", number][]) {
    const sgn = side === "l" ? -1 : 1;
    if (chain) {
      const edge = side === "l" ? 0 : vw;
      const px = xe + sgn * 22;
      cable(p, `M${edge},${y} L${f(px)},${y}`);
      const x0 = Math.min(px, xe + sgn * 7);
      p.add(`<rect x="${f(x0)}" y="${y - 5.5}" width="15" height="11" rx="2.5" fill="#2B2826" stroke="${OUT}" stroke-width="1"></rect>`);
    }
    const x0 = side === "l" ? xe - 8 : xe;
    const m = p.lin("mth", [[0, "#8A8882"], [0.5, "#F4F3EF"], [1, "#9B9993"]]);
    p.add(`<rect x="${x0}" y="${y - 9}" width="8" height="18" rx="2" fill="url(#${m})" stroke="${OUT}" stroke-width="1"></rect>`);
  }
  if (power) {
    const [x, y0] = power;
    p.add(`<rect x="${x - 8}" y="${y0 - 8}" width="16" height="10" rx="2" fill="#1B1917"></rect>`);
  }
}

function toggle(p: P, cx: number, cy: number, up = true) {
  const dy = up ? -9 : 9;
  const m = p.metal();
  const b = p.blur(3);
  p.add(`<circle cx="${cx}" cy="${cy + 2}" r="8" fill="#000" opacity=".4" filter="url(#${b})"></circle>`);
  const pts = Array.from({ length: 6 }, (_, i) =>
    `${f(cx + 7 * Math.cos(rad(60 * i)))},${f(cy + 7 * Math.sin(rad(60 * i)))}`,
  ).join(" ");
  p.add(`<polygon points="${pts}" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></polygon>`);
  p.add(`<circle cx="${cx}" cy="${cy}" r="3.4" fill="#55534E"></circle>`);
  p.add(`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + dy}" stroke="${OUT}" stroke-width="5.4" stroke-linecap="round"></line>`);
  p.add(`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + dy}" stroke="url(#${m})" stroke-width="3.6" stroke-linecap="round"></line>`);
  p.add(`<circle cx="${cx}" cy="${cy + dy}" r="1.2" fill="#fff"></circle>`);
}

/** Standard enclosure with jacks and screws. */
function std(p: P, chain: boolean, xl = 38, w = 124, y = 22, h = 200) {
  jacks(p, xl, xl + w, 104, chain, [xl + w / 2, y]);
  box(p, xl, y, w, h);
  screws(p, xl, y, w, h);
}

function name(p: P, y: number, s: string, o: { size?: number; sub?: string; ls?: number } = {}) {
  const { size = 15, sub, ls = 1.2 } = o;
  text(p, 100, y, s, { size, weight: 600, ls });
  if (sub) text(p, 100, y + 10, sub, { size: 5.4, weight: 500, ls: 1.1, op: 0.8 });
}

const COLORS: Record<GearKind, string> = {
  comp: "#B4473A",
  drive: "#E4A235",
  drive2: "#C9C1AE",
  fuzz: "#8E8C86",
  mod: "#6FA6C4",
  delay: "#2D5A50",
  reverb: "#9FCDBD",
  eq: "#26231F",
  vol: "#3A3835",
  amp: "#1E1C1A",
  cab: "#1E1C1A",
  delay2: "#E7DCC2",
  head: "#1E1C1A",
  preamp: "#26231F",
  mic: "#1E1C1A",
};

const SPK2 =
  '<radialGradient id="ID" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".34"></stop><stop offset=".28" stop-color="#000" stop-opacity=".2"></stop><stop offset=".85" stop-color="#000" stop-opacity=".16"></stop><stop offset="1" stop-color="#000" stop-opacity="0"></stop></radialGradient>';
const VIG =
  '<linearGradient id="ID" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"></stop><stop offset=".25" stop-color="#000" stop-opacity="0"></stop><stop offset="1" stop-color="#000" stop-opacity=".12"></stop></linearGradient>';
const CORNER = "M0,0 H17 Q13,5 9,9 Q5,13 0,17 Z";

function corners(p: P, m: string, at: [number, number, number][]) {
  for (const [cx, cy, rot] of at) {
    p.add(`<path d="${CORNER}" fill="url(#${m})" stroke="${OUT}" stroke-width="1" transform="translate(${cx} ${cy}) rotate(${rot})"></path>`);
  }
}

/**
 * Draw one piece of gear. `uid` must be unique on the page: it prefixes
 * every gradient and filter id.
 */
export function drawGear(kind: GearKind, uid: string, opts: GearOptions = {}): Drawing {
  const { title, disp, chain = false, cloth = "#BBB09A", fonts = SITE_FONTS } = opts;
  const CL = `<pattern id="ID" patternUnits="userSpaceOnUse" width="5" height="5"><rect width="5" height="5" fill="${cloth}"></rect><path d="M0,1.2 H5 M0,3.7 H5" stroke="${dk(cloth, 0.25)}" stroke-width="1"></path><path d="M1.2,0 V5 M3.7,0 V5" stroke="${li(cloth, 0.3)}" stroke-width=".7" opacity=".8"></path></pattern>`;
  const c = opts.color || COLORS[kind];
  const p = new P(uid, c, fonts);
  let vw = 200;
  const vh = 250;
  let v = opts.vals && opts.vals.length ? opts.vals : null;
  const t = title ? title : null;

  if (kind === "comp") {
    v = v || [6, 7];
    std(p, chain);
    led(p, 100, 44);
    knob(p, 70, 76, 18, v[0], "black", "SUSTAIN");
    knob(p, 130, 76, 18, v[1], "black", "LEVEL");
    name(p, 142, t || "COMPRESSOR", { size: 11.5, ls: 1.2, sub: "DYNAMICS" });
    fsw(p, 100, 188);
  } else if (kind === "drive" || kind === "drive2") {
    v = v || [4, 5, 7];
    std(p, chain);
    led(p, 100, 42);
    const kk: KnobKind = kind === "drive" ? "black" : "amber";
    knob(p, 68, 66, 16, v[0], kk, "DRIVE");
    knob(p, 132, 66, 16, v[2], kk, "LEVEL");
    knob(p, 100, 108, 11.5, v[1], kk, "TONE");
    if (kind === "drive") name(p, 152, t || "OVERDRIVE", { size: 12.5, ls: 1.6 });
    else name(p, 152, t || "BOOST", { size: 14, sub: "TRANSPARENT DRIVE" });
    fsw(p, 100, 190);
  } else if (kind === "mod") {
    v = v || [3, 6];
    std(p, chain);
    led(p, 100, 42, 3, "#4FA3FF");
    knob(p, 68, 72, 17, v[0], "cream", "RATE");
    knob(p, 132, 72, 17, v[1], "cream", "DEPTH");
    toggle(p, 100, 116);
    text(p, 100, 134, "VIBE / CHORUS", { size: 5.2 });
    name(p, 156, t || "CHORUS", { size: 13, ls: 3 });
    fsw(p, 100, 190);
  } else if (kind === "reverb") {
    v = v || [2, 5, 2];
    std(p, chain);
    led(p, 100, 40, 3, "#35C36B");
    knob(p, 100, 78, 23, v[1], "silver", "DECAY");
    knob(p, 60, 128, 10.5, v[0], "silver", "MIX");
    knob(p, 140, 128, 10.5, v[2], "silver", "PRE");
    name(p, 160, t || "SPRING", { size: 12.5, ls: 3 });
    fsw(p, 100, 192);
  } else if (kind === "fuzz") {
    v = v || [8, 6];
    jacks(p, 20, 180, 104, chain, [100, 26]);
    box(p, 20, 26, 160, 196, 14);
    screws(p, 20, 26, 160, 196);
    name(p, 62, t || "FUZZ", { size: 17, ls: 7 });
    led(p, 100, 84);
    knob(p, 62, 116, 23, v[0], "black", "FUZZ");
    knob(p, 138, 116, 23, v[1], "black", "VOLUME");
    fsw(p, 100, 188, 17);
  } else if (kind === "delay" || kind === "delay2") {
    v = v || [5, 4, 3];
    jacks(p, 14, 186, 104, chain, [100, 22]);
    box(p, 14, 22, 172, 200, 12);
    screws(p, 14, 22, 172, 200);
    const dtxt = esc(disp || "300");
    p.add('<rect x="62" y="42" width="76" height="27" rx="3" fill="#0B0D0B" stroke="#000" stroke-width="1.2"></rect>');
    p.add('<rect x="64" y="44" width="72" height="23" rx="2" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"></rect>');
    const b = p.blur(3);
    p.add(`<text x="92" y="63" font-family="${fonts.mono}" font-size="17" font-weight="700" text-anchor="middle" fill="#F5B94C" filter="url(#${b})" opacity=".8">${dtxt}</text>`);
    p.add(`<text x="92" y="63" font-family="${fonts.mono}" font-size="17" font-weight="700" text-anchor="middle" fill="#FFD27A">${dtxt}</text>`);
    p.add(`<text x="124" y="63" font-family="${fonts.mono}" font-size="7" font-weight="600" text-anchor="middle" fill="#F5B94C">ms</text>`);
    const kk: KnobKind = kind === "delay" ? "cream" : "black";
    knob(p, 52, 106, 14, v[0], kk, "TIME");
    knob(p, 100, 106, 14, v[1], kk, "REPEATS");
    knob(p, 148, 106, 14, v[2], kk, "MIX");
    name(p, 152, t || "DELAY", { size: 13, ls: 4 });
    led(p, 58, 166, 2.6);
    led(p, 142, 166, 2.6, "#F5B94C");
    fsw(p, 58, 192, 14);
    fsw(p, 142, 192, 14);
    text(p, 100, 195, "TAP", { size: 5.4, anchor: "middle" });
  } else if (kind === "eq") {
    v = v || [3.6, 4.3, 5, 5.7, 6.4];
    std(p, chain);
    led(p, 100, 40);
    p.add(`<line x1="54" y1="88" x2="146" y2="88" stroke="${p.on}" stroke-width=".6" opacity=".5"></line>`);
    v.forEach((val, i) => {
      const x = 62 + 19 * i;
      const cy = 122 - val * 6.8;
      p.add(`<rect x="${x - 1.6}" y="54" width="3.2" height="68" rx="1.6" fill="#050505" stroke="#4a4744" stroke-width=".6"></rect>`);
      const g = p.lin("sl", [[0, li(AMBER, 0.4)], [0.5, AMBER], [1, dk(AMBER, 0.3)]]);
      p.add(`<rect x="${x - 6}" y="${f(cy - 3.6)}" width="12" height="7.2" rx="1.6" fill="url(#${g})" stroke="${OUT}" stroke-width=".8"></rect><line x1="${x - 4}" y1="${f(cy)}" x2="${x + 4}" y2="${f(cy)}" stroke="${OUT}" stroke-width=".8"></line>`);
    });
    text(p, 62, 135, "LOW", { size: 5.2 });
    text(p, 138, 135, "HIGH", { size: 5.2 });
    name(p, 157, t || "TILT EQ", { size: 13, ls: 3 });
    fsw(p, 100, 192);
  } else if (kind === "vol") {
    jacks(p, 48, 152, 104, chain);
    box(p, 48, 18, 104, 208, 12);
    const g = p.lin("rub", [[0, "#34312E"], [1, "#141211"]]);
    p.add(`<rect x="57" y="27" width="86" height="170" rx="7" fill="url(#${g})" stroke="#000" stroke-width="1.2"></rect>`);
    for (let i = 0; i < 17; i++) {
      const yy = 37 + i * 9.2;
      p.add(`<rect x="64" y="${f(yy)}" width="72" height="4.2" rx="2.1" fill="#0A0908"></rect><rect x="64" y="${f(yy - 0.9)}" width="72" height="1" rx=".5" fill="#fff" opacity=".13"></rect>`);
    }
    text(p, 100, 213, t || "VOLUME", { size: 7.5, ls: 3 });
  } else if (kind === "amp") {
    vw = 290;
    v = v || [3.5, 5, 5.5, 6, 5, 5.5];
    if (chain) {
      cable(p, "M0,104 L40,104");
      cable(p, "M290,104 L250,104");
    }
    const b = p.blur(7);
    p.add(`<rect x="28" y="60" width="234" height="176" rx="10" fill="#000" opacity=".36" filter="url(#${b})"></rect>`);
    p.add('<rect x="46" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect><rect x="218" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect>');
    const m = p.metal();
    p.add(`<path d="M112,36 Q145,14 178,36" fill="none" stroke="${OUT}" stroke-width="9" stroke-linecap="round"></path><path d="M112,36 Q145,14 178,36" fill="none" stroke="#3B3835" stroke-width="6" stroke-linecap="round"></path>`);
    p.add(`<rect x="103" y="31" width="16" height="9" rx="2" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></rect><rect x="171" y="31" width="16" height="9" rx="2" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></rect>`);
    const g = p.lin("tol", [[0, li(c, 0.1)], [0.2, c], [1, dk(c, 0.4)]]);
    p.add(`<rect x="22" y="38" width="246" height="190" rx="11" fill="url(#${g})" stroke="${OUT}" stroke-width="1.5"></rect>`);
    const gr = p.grain();
    p.add(`<rect x="22" y="38" width="246" height="190" rx="11" fill="${lum(c) < 0.4 ? "#fff" : "#000"}" opacity=".1" filter="url(#${gr})"></rect>`);
    p.add('<rect x="24.5" y="40.5" width="241" height="185" rx="9" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"></rect>');
    // panel
    const pm = p.lin("pan", [[0, "#F3F1EB"], [0.5, "#CFCCC4"], [1, "#A9A69E"]]);
    p.add(`<rect x="36" y="52" width="218" height="34" rx="3" fill="url(#${pm})" stroke="${OUT}" stroke-width="1"></rect>`);
    p.add(`<circle cx="50" cy="69" r="4.6" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></circle><circle cx="50" cy="69" r="2" fill="#0A0908"></circle>`);
    p.on = INK;
    v.forEach((val, i) => knob(p, 76 + 27 * i, 69, 8, val, "black", null, false));
    led(p, 240, 69, 3.2, "#E5382B");
    // grille
    const cl = p.d("cloth", CL);
    p.add(`<rect x="36" y="94" width="218" height="122" rx="4" fill="url(#${cl})" stroke="${OUT}" stroke-width="1"></rect>`);
    p.rad("spk", [[0, "#000"], [0.6, "#000"], [1, "#000"]]);
    const sh = p.d("spk2", SPK2);
    p.add(`<circle cx="145" cy="155" r="54" fill="url(#${sh})"></circle>`);
    const vg = p.d("vig", VIG);
    p.add(`<rect x="36" y="94" width="218" height="122" rx="4" fill="url(#${vg})"></rect>`);
    p.add('<rect x="38.5" y="96.5" width="213" height="117" rx="3" fill="none" stroke="#EFE7D2" stroke-width="1.4"></rect>');
    p.add(`<rect x="46" y="103" width="34" height="9" rx="1.5" fill="url(#${m})" stroke="${OUT}" stroke-width=".7"></rect>`);
    corners(p, m, [[22, 38, 0], [268, 38, 90], [268, 228, 180], [22, 228, 270]]);
  } else if (kind === "cab") {
    vw = 250;
    if (chain) {
      cable(p, "M0,104 L40,104");
      cable(p, "M250,104 L220,104");
    }
    const b = p.blur(7);
    const m = p.metal();
    p.add(`<rect x="20" y="70" width="216" height="168" rx="10" fill="#000" opacity=".36" filter="url(#${b})"></rect>`);
    p.add('<rect x="36" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect><rect x="188" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect>');
    const g = p.lin("tol", [[0, li(c, 0.1)], [0.2, c], [1, dk(c, 0.4)]]);
    p.add(`<rect x="14" y="48" width="222" height="180" rx="11" fill="url(#${g})" stroke="${OUT}" stroke-width="1.5"></rect>`);
    const gr = p.grain();
    p.add(`<rect x="14" y="48" width="222" height="180" rx="11" fill="${lum(c) < 0.4 ? "#fff" : "#000"}" opacity=".1" filter="url(#${gr})"></rect>`);
    p.add('<rect x="16.5" y="50.5" width="217" height="175" rx="9" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"></rect>');
    const cl = p.d("cloth", CL);
    p.add(`<rect x="27" y="61" width="196" height="154" rx="4" fill="url(#${cl})" stroke="${OUT}" stroke-width="1"></rect>`);
    const sh = p.d("spk2", SPK2);
    p.add(`<circle cx="78" cy="138" r="46" fill="url(#${sh})"></circle><circle cx="172" cy="138" r="46" fill="url(#${sh})"></circle>`);
    const vg = p.d("vig", VIG);
    p.add(`<rect x="27" y="61" width="196" height="154" rx="4" fill="url(#${vg})"></rect>`);
    p.add('<rect x="29.5" y="63.5" width="191" height="149" rx="3" fill="none" stroke="#EFE7D2" stroke-width="1.4"></rect>');
    corners(p, m, [[14, 48, 0], [236, 48, 90], [236, 228, 180], [14, 228, 270]]);
  } else if (kind === "mic") {
    const m = p.metal();
    const b3 = p.blur(3);
    const mh = p.lin("mth", [[0, "#8A8882"], [0.5, "#F4F3EF"], [1, "#9B9993"]], 1, 0);
    p.add(`<ellipse cx="100" cy="238" rx="40" ry="6" fill="#000" opacity=".35" filter="url(#${b3})"></ellipse>`);
    p.add(`<ellipse cx="100" cy="233" rx="34" ry="6.5" fill="#1B1917" stroke="${OUT}" stroke-width="1.2"></ellipse><ellipse cx="100" cy="231" rx="26" ry="3.6" fill="#fff" opacity=".1"></ellipse>`);
    p.add(`<rect x="96.5" y="150" width="7" height="82" fill="url(#${mh})" stroke="${OUT}" stroke-width="1"></rect>`);
    // yoke
    const yoke = "M62,92 V132 Q62,152 82,152 H118 Q138,152 138,132 V92";
    p.add(`<path d="${yoke}" fill="none" stroke="${OUT}" stroke-width="7.5" stroke-linecap="round"></path><path d="${yoke}" fill="none" stroke="#D5D3CD" stroke-width="5" stroke-linecap="round"></path><path d="${yoke}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round" transform="translate(-1 -1)"></path>`);
    // body
    p.add(`<rect x="76" y="26" width="48" height="118" rx="20" fill="#000" opacity=".3" filter="url(#${b3})" transform="translate(0 5)"></rect>`);
    const bg = p.lin("rib", [[0, "#77746F"], [0.18, "#F1EFEA"], [0.5, "#C9C7C1"], [0.85, "#8C8A85"], [1, "#5E5C58"]], 1, 0);
    p.add(`<rect x="74" y="24" width="52" height="120" rx="22" fill="url(#${bg})" stroke="${OUT}" stroke-width="1.5"></rect>`);
    const cp = p.d("ribc", '<clipPath id="ID"><rect x="80" y="32" width="40" height="80" rx="16"></rect></clipPath>');
    p.add(`<rect x="80" y="32" width="40" height="80" rx="16" fill="#191715" stroke="${OUT}" stroke-width="1"></rect>`);
    const sl = Array.from({ length: 15 }, (_, i) =>
      `<rect x="80" y="${(36 + i * 5.2).toFixed(1)}" width="40" height="2.6" fill="url(#${bg})" opacity=".92"></rect>`,
    ).join("");
    p.add(`<g clip-path="url(#${cp})">${sl}<rect x="97.5" y="32" width="5" height="80" fill="url(#${bg})"></rect></g>`);
    p.add('<rect x="74" y="116" width="52" height="5" fill="#000" opacity=".28"></rect>');
    p.add('<rect x="88" y="126" width="24" height="8" rx="2" fill="#191715"></rect>');
    for (const sx of [66, 134]) {
      p.add(`<circle cx="${sx}" cy="92" r="6.5" fill="url(#${m})" stroke="${OUT}" stroke-width="1"></circle><circle cx="${sx}" cy="92" r="2.2" fill="#55534E"></circle>`);
    }
  } else if (kind === "head") {
    vw = 290;
    v = v || [3.5, 5, 5.5, 6, 5, 5.5];
    if (chain) {
      cable(p, "M0,104 L40,104");
      cable(p, "M290,104 L250,104");
    }
    const b = p.blur(7);
    const m = p.metal();
    const gr = p.grain();
    p.add(`<rect x="28" y="110" width="234" height="126" rx="10" fill="#000" opacity=".36" filter="url(#${b})"></rect>`);
    p.add('<rect x="46" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect><rect x="218" y="226" width="26" height="10" rx="2" fill="#0B0A09"></rect>');
    p.add(`<path d="M112,92 Q145,70 178,92" fill="none" stroke="${OUT}" stroke-width="9" stroke-linecap="round"></path><path d="M112,92 Q145,70 178,92" fill="none" stroke="#3B3835" stroke-width="6" stroke-linecap="round"></path>`);
    p.add(`<rect x="103" y="87" width="16" height="9" rx="2" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></rect><rect x="171" y="87" width="16" height="9" rx="2" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></rect>`);
    const g = p.lin("tol", [[0, li(c, 0.1)], [0.2, c], [1, dk(c, 0.4)]]);
    p.add(`<rect x="22" y="94" width="246" height="134" rx="11" fill="url(#${g})" stroke="${OUT}" stroke-width="1.5"></rect>`);
    p.add(`<rect x="22" y="94" width="246" height="134" rx="11" fill="#fff" opacity=".1" filter="url(#${gr})"></rect>`);
    p.add('<rect x="24.5" y="96.5" width="241" height="129" rx="9" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"></rect>');
    const cl = p.d("cloth", CL);
    p.add(`<rect x="36" y="108" width="218" height="60" rx="4" fill="url(#${cl})" stroke="${OUT}" stroke-width="1"></rect><rect x="38.5" y="110.5" width="213" height="55" rx="3" fill="none" stroke="#EFE7D2" stroke-width="1.4"></rect>`);
    p.add(`<rect x="46" y="117" width="34" height="9" rx="1.5" fill="url(#${m})" stroke="${OUT}" stroke-width=".7"></rect>`);
    const pm = p.lin("pan", [[0, "#F3F1EB"], [0.5, "#CFCCC4"], [1, "#A9A69E"]]);
    p.add(`<rect x="36" y="176" width="218" height="38" rx="3" fill="url(#${pm})" stroke="${OUT}" stroke-width="1"></rect>`);
    p.add(`<circle cx="50" cy="195" r="4.6" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></circle><circle cx="50" cy="195" r="2" fill="#0A0908"></circle>`);
    p.on = INK;
    v.forEach((val, i) => knob(p, 76 + 27 * i, 195, 9, val, "black", null, false));
    led(p, 240, 195, 3.2, "#E5382B");
    corners(p, m, [[22, 94, 0], [268, 94, 90], [268, 228, 180], [22, 228, 270]]);
  } else if (kind === "preamp") {
    vw = 290;
    v = v || [4, 6, 5, 5, 6, 7];
    if (chain) {
      cable(p, "M0,104 L60,104 L60,150");
      cable(p, "M290,104 L230,104 L230,150");
    }
    const b = p.blur(7);
    const m = p.metal();
    const gr = p.grain();
    p.add(`<rect x="16" y="140" width="258" height="80" rx="6" fill="#000" opacity=".36" filter="url(#${b})"></rect>`);
    p.add(`<rect x="10" y="126" width="270" height="8" rx="3" fill="${dk(c, 0.5)}" stroke="${OUT}" stroke-width="1.2"></rect>`);
    p.lin("mth", [[0, "#8A8882"], [0.5, "#F4F3EF"], [1, "#9B9993"]]);
    p.add(`<rect x="6" y="132" width="278" height="80" rx="4" fill="url(#${m})" stroke="${OUT}" stroke-width="1.5"></rect>`);
    const g = p.lin("pre", [[0, li(c, 0.16)], [0.5, c], [1, dk(c, 0.2)]]);
    p.add(`<rect x="28" y="132" width="234" height="80" fill="url(#${g})" stroke="${OUT}" stroke-width="1.2"></rect>`);
    p.add(`<rect x="28" y="132" width="234" height="80" fill="#000" opacity=".14" filter="url(#${gr})"></rect>`);
    for (const sx of [17, 273]) {
      for (const sy of [146, 198]) {
        p.add(`<ellipse cx="${sx}" cy="${sy}" rx="4.6" ry="3.2" fill="#0A0908"></ellipse>`);
      }
    }
    p.on = CREAM;
    p.add(`<circle cx="46" cy="172" r="5.4" fill="url(#${m})" stroke="${OUT}" stroke-width=".9"></circle><circle cx="46" cy="172" r="2.3" fill="#0A0908"></circle>`);
    text(p, 46, 192, "INPUT", { size: 5 });
    const labs = ["GAIN", "BASS", "MID", "TREBLE", "PRES", "MASTER"];
    v.forEach((val, i) => knob(p, 76 + 30 * i, 168, 10, val, "silver", labs[i], false));
    led(p, 248, 168, 3.2, "#F5B94C");
    text(p, 248, 192, "ON", { size: 5 });
    text(p, 145, 146, t || "PREAMP", { size: 6.5, ls: 4, op: 0.85 });
  }
  return p.out(vw, vh);
}

/**
 * The dial: an amber arc around a black knob. `frac` is 0 to 1 of the
 * parameter's range. Canvas is 64 by 64.
 */
export function drawDial(
  uid: string,
  frac: number,
  accent: string = AMBER,
  track: string = "#DCDFE2",
): Drawing {
  const p = new P(uid, "#FFFFFF", SITE_FONTS);
  const cx = 32;
  const cy = 32;
  const R = 27;
  const pt = (a: number) => `${f(cx + R * Math.sin(rad(a)))},${f(cy - R * Math.cos(rad(a)))}`;
  const a1 = -135 + 270 * Math.max(0, Math.min(1, frac));
  p.add(`<path d="M${pt(-135)} A${R},${R} 0 1 1 ${pt(135)}" fill="none" stroke="${track}" stroke-width="3" stroke-linecap="round"></path>`);
  if (frac > 0.004) {
    p.add(`<path d="M${pt(-135)} A${R},${R} 0 ${a1 + 135 > 180 ? 1 : 0} 1 ${pt(a1)}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"></path>`);
  }
  knob(p, cx, cy, 19, frac * 10, "black", null, false);
  return p.out(64, 64);
}
