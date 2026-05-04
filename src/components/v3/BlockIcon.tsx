/**
 * <BlockIcon> — tiny category glyph for schematic tiles.
 *
 * These are simple line-art SVGs, currentColor-driven so the tile's
 * color theme controls them. Designed to read at ~28px inside an
 * ~80px tile.
 */

import type { PreviewBlockData } from "./PreviewBlocks";

type IconKey =
  | "drive"
  | "comp"
  | "dist"
  | "fuzz"
  | "delay"
  | "reverb"
  | "mod"
  | "wah"
  | "eq"
  | "volume"
  | "amp"
  | "cab"
  | "pitch"
  | "guitar"
  | "generic";

/** Match the guitar's `model_name` to one of the silhouette SVGs in
 *  /public/images/guitars/. Rules go specific → generic; the last
 *  `Strat.svg` is the safe default (the most common body shape on the
 *  site). Filenames match the actual files on disk, including the
 *  `Explorere.svg` typo. */
export function guitarAssetFor(name: string): string {
  const n = (name || "").toLowerCase();
  if (/bigsby/.test(n) && /tele/.test(n)) return "Bigsby Tele.svg";
  if (/tele(caster)?/.test(n)) return "Tele.svg";
  if (/flying\s*v/.test(n)) return "Flying V.svg";
  if (/explorer/.test(n)) return "Explorere.svg";
  if (/warlock/.test(n)) return "Warlock.svg";
  if (/\b(es[-\s]?3[345]5|lucille|335|345|355)\b/.test(n)) return "335.svg";
  if (/\bsg\b/.test(n)) return "SG.svg";
  if (/les\s*paul|\blp\b|pearly\s*gates|arm\s*the\s*homeless/.test(n))
    return "LP.svg";
  if (/dinky|charvel|ibanez\s*js|super[-\s]?strat/.test(n)) return "Dinky.svg";
  if (/strat(ocaster)?|frankenstrat|brownie|number\s*one/.test(n))
    return "Strat.svg";
  return "Strat.svg";
}

export function iconKeyFor(block: PreviewBlockData): IconKey {
  const name = (block.name || "").toLowerCase();
  const sub = (block.sub || "").toLowerCase();
  const hay = `${name} ${sub}`;
  if (block.variant === "amp") return "amp";
  if (block.variant === "cab") return "cab";
  if (block.variant === "source") return "guitar";
  if (/comp/.test(hay)) return "comp";
  if (/volume|vol |pan/.test(hay)) return "volume";
  if (/fuzz/.test(hay)) return "fuzz";
  if (/dist/.test(hay)) return "dist";
  if (/drive|screamer|808|overdrive|klon|bd-?2|blues|rat/.test(hay)) return "drive";
  if (/delay|echo/.test(hay)) return "delay";
  if (/reverb|hall|plate|spring/.test(hay)) return "reverb";
  if (/chorus|flang|phase|trem|vibe|mod /.test(hay)) return "mod";
  if (/wah|filter/.test(hay)) return "wah";
  if (/eq|graphic|parametric/.test(hay)) return "eq";
  if (/pitch|octav|whammy|harmonizer/.test(hay)) return "pitch";
  return "generic";
}

export function BlockIcon({
  block,
  size = 28,
}: {
  block: PreviewBlockData;
  size?: number;
}) {
  const k = iconKeyFor(block);
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (k) {
    case "drive":
      // lightning bolt
      return (
        <svg {...common}>
          <path d="M18 4 L8 18 L14 18 L12 28 L24 13 L17 13 Z" />
        </svg>
      );
    case "dist":
      // classic clipped sine — a single tall pulse with a chopped top.
      // Reads as "hard distortion" at small sizes without the stacked
      // peaks fighting for pixels.
      return (
        <svg {...common}>
          <path d="M4 22 L10 22 L10 10 L22 10 L22 22 L28 22" />
        </svg>
      );
    case "fuzz":
      // jagged clipped wave
      return (
        <svg {...common}>
          <path d="M4 20 L7 8 L10 24 L13 10 L16 22 L19 8 L22 24 L25 10 L28 20" />
        </svg>
      );
    case "comp":
      // envelope tapering down
      return (
        <svg {...common}>
          <path d="M4 16 C 8 4, 12 28, 16 16 C 20 12, 24 20, 28 16" />
          <path d="M4 16 L28 16" strokeDasharray="1 3" strokeWidth={0.9} />
        </svg>
      );
    case "volume":
      // fader track + cap
      return (
        <svg {...common}>
          <path d="M16 4 L16 28" />
          <rect x="11" y="14" width="10" height="5" rx="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "delay":
      // two echoing taps
      return (
        <svg {...common}>
          <circle cx="10" cy="16" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="16" r="1.8" opacity="0.7" />
          <circle cx="24" cy="16" r="1.2" opacity="0.4" />
        </svg>
      );
    case "reverb":
      // Concentric ripples — a point source with three fading circles,
      // reading as "sound expanding into a space." Cleaner than the
      // half-arc ground plane version at tile size.
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="6.5" opacity="0.55" />
          <circle cx="16" cy="16" r="10.5" opacity="0.32" />
          <circle cx="16" cy="16" r="14" opacity="0.18" />
        </svg>
      );
    case "mod":
      // smooth sine wave
      return (
        <svg {...common}>
          <path d="M4 16 C 8 6, 12 26, 16 16 S 24 6, 28 16" />
        </svg>
      );
    case "wah":
      // open frequency bracket
      return (
        <svg {...common}>
          <path d="M6 8 L14 16 L6 24" />
          <path d="M18 10 L26 16 L18 22" opacity="0.6" />
        </svg>
      );
    case "eq":
      // three-band sliders
      return (
        <svg {...common}>
          <path d="M8 4 L8 28" />
          <path d="M16 4 L16 28" />
          <path d="M24 4 L24 28" />
          <rect x="5" y="10" width="6" height="3" fill="currentColor" stroke="none" />
          <rect x="13" y="18" width="6" height="3" fill="currentColor" stroke="none" />
          <rect x="21" y="14" width="6" height="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "pitch":
      // two notes / octave
      return (
        <svg {...common}>
          <path d="M10 22 L10 8 L22 6 L22 20" />
          <circle cx="8" cy="22" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "amp":
      // amp head with vent slots
      return (
        <svg {...common}>
          <rect x="4" y="8" width="24" height="16" rx="1.5" />
          <path d="M8 14 L14 14 M8 18 L14 18" />
          <circle cx="22" cy="14" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="22" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "cab":
      // 2x2 speaker cab (stack face) — more hardware-legible than a single cone
      return (
        <svg {...common}>
          <rect x="5" y="4" width="22" height="24" rx="1" />
          <circle cx="11" cy="11" r="3.2" />
          <circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="21" cy="11" r="3.2" />
          <circle cx="21" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="11" cy="21" r="3.2" />
          <circle cx="11" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="21" cy="21" r="3.2" />
          <circle cx="21" cy="21" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "guitar": {
      // Live site's guitar silhouettes in /public/images/guitars/ —
      // model-aware picker so a Strat recipe shows a Strat, a Les Paul
      // recipe shows an LP, etc. Rendered as <img> at full height with
      // auto width (SVGs are tall/narrow, ~75×233 viewBox).
      const file = guitarAssetFor(block.name);
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/guitars/${encodeURI(file)}`}
          alt=""
          aria-hidden="true"
          style={{
            height: size,
            width: "auto",
            display: "block",
            transform: "rotate(45deg)",
            transformOrigin: "center",
          }}
        />
      );
    }
    case "generic":
    default:
      // simple signal-flow dot
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="4" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="10" opacity="0.3" />
        </svg>
      );
  }
}
