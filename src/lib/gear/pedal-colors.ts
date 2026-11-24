/**
 * Enclosure colours for recipe pedal drawings, matched to the real pedal
 * the block names: a TS808 is green, a DS-1 is orange, a Klon is gold.
 *
 * Colour only. The drawings stay our own generic boxes with no maker
 * marks (handoff: original designs, no logos, no copied pedal faces).
 *
 * Matched on the block's display name, so it covers both the real pedal
 * on the Pedalboard view ("Ibanez Tube Screamer TS808") and the modeler's
 * name for it ("Scream 808" on Helix, "Green 808" on Quad Cortex).
 * First match wins. A name that matches nothing keeps the family colour
 * from draw.ts. Add a row only when the pedal's colour is well known.
 */

const GREEN = "#4C9F68";
const YELLOW = "#EEC233";
const ORANGE = "#E97C2A";
const RED = "#C3312A";
const GOLD = "#C8A951";
const BLACK = "#1F1E1D";
const SILVER = "#C4C6C8";
const GREY = "#8F9193";
const CREAM = "#EDE6D2";
const WHITE = "#ECEAE4";
const BLUE = "#2F66B0";
const LIGHT_BLUE = "#7FB6DD";
const PURPLE = "#6F4FA6";

const PEDAL_COLORS: [RegExp, string][] = [
  // Ibanez Tube Screamer family and the Maxon originals.
  [/tube ?screamer|\bts-?(808|9|10)\b|\bt808|scream 808|green (scream|808)|t-scream|ts boost|\bod-?8(08|20)\b/, GREEN],
  // Klon Centaur.
  [/klon|centaur|minotaur|myth drive/, GOLD],
  // Boss.
  [/\bds-?1\b|chief ds1|deez one|\bone ds\b/, ORANGE],
  [/\bsd-?1\b|super o(d|verdrive)|stupor od|\bod-?1\b/, YELLOW],
  [/\bbd-?2|blues driv/, BLUE],
  [/\bcs-?[23]\b/, BLUE],
  [/\bce-?[23]\b|\bch-?1\b/, LIGHT_BLUE],
  [/\bce-?1\b/, GREY],
  [/\bdd-?[23]\b/, WHITE],
  [/\bbf-?2\b|\bfz-?2\b/, PURPLE],
  [/\btr-?2\b/, GREEN],
  [/\bns-?2\b|\bge-?7\b/, WHITE],
  [/\brv-?6\b/, GREY],
  [/\bhm-?2\b|swedish chainsaw/, BLACK],
  // MXR.
  [/distortion ?\+|dist\+|mxr d\+|plus (ds|distortion)/, YELLOW],
  [/phase (90|95|100)|script (mod )?phase|phaser 90e/, ORANGE],
  [/dyna ?comp|red squeeze/, RED],
  [/micro amp/, CREAM],
  [/(10|ten)[- ]band/, BLUE],
  // ProCo RAT.
  [/\brat\b|vermin|ratatouille/, BLACK],
  [/shredmaster/, BLACK],
  // Electro-Harmonix Big Muff. Green Russian before the silver ones.
  [/green russian/, "#5A6B45"],
  [/dark dove/, BLACK],
  [/muff|\bpi fuzz|fuzz pi\b|triangle fuzz|ram'?s head|bighorn/, SILVER],
  [/memory man/, SILVER],
  // Fuzz Face.
  [/fuzz face|arbitrator|facial fuzz|face fuzz/, RED],
  // Dallas Rangemaster.
  [/range ?master|deranged master|range lord/, GREY],
  [/colorsound power ?boost/, ORANGE],
  // DigiTech Whammy.
  [/whammy|pitch wham|\bwham\b/, RED],
  // Others with a colour most players know.
  [/\bocd\b|compulsive dr/, CREAM],
  [/king of tone|tone sovereign/, PURPLE],
  [/ross comp/, GREY],
  [/bigsky/, "#3D7FC1"],
  [/\bdl-?4\b/, GREEN],
];

/** The real pedal's enclosure colour for a block name, when we know it. */
export function pedalColor(name: string): string | undefined {
  const n = name.toLowerCase();
  for (const [re, color] of PEDAL_COLORS) if (re.test(n)) return color;
  return undefined;
}
