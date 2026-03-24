import {
  Guitar,
  Zap,
  Waves,
  Volume2,
  Repeat,
  Speaker,
  Mic,
  Gauge,
  Clock,
  Orbit,
  SlidersHorizontal,
  Footprints,
  Disc3,
  Activity,
  AudioLines,
  type LucideProps,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

/* ------------------------------------------------------------------ */
/*  Custom SVG icons for categories Lucide doesn't cover well          */
/* ------------------------------------------------------------------ */

/** Wah pedal — foot/rocker shape */
function WahIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M4 18 L12 6 L20 18" />
      <path d="M7 18 L17 18" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Reverb — expanding ripple arcs */
function ReverbIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M6 12 C6 12, 8 6, 12 6 C16 6, 18 12, 18 12" />
      <path d="M4 12 C4 12, 7 3, 12 3 C17 3, 20 12, 20 12" />
      <path d="M8 12 C8 12, 9 9, 12 9 C15 9, 16 12, 16 12" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M8 12 C8 12, 9 15, 12 15 C15 15, 16 12, 16 12" />
      <path d="M6 12 C6 12, 8 18, 12 18 C16 18, 18 12, 18 12" />
    </svg>
  );
}

/** Fuzz — jagged/clipped waveform */
function FuzzIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <polyline points="2,12 5,12 7,5 9,19 11,5 13,19 15,5 17,19 19,12 22,12" />
    </svg>
  );
}

/** Pitch shift — up/down arrows with note */
function PitchIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M7 4 L7 20" />
      <path d="M4 7 L7 4 L10 7" />
      <path d="M17 20 L17 4" />
      <path d="M14 17 L17 20 L20 17" />
      <path d="M12 12 L12 12" />
    </svg>
  );
}

/** Compressor / Dynamics — squeeze/threshold shape */
function DynamicsIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M3 20 L10 10 L14 13 L21 4" />
      <path d="M3 20 L21 20" />
      <path d="M3 4 L3 20" />
      <line x1="10" y1="10" x2="10" y2="20" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}

/** Boost — simple gain arrow */
function BoostIcon(props: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 19 L12 5" />
      <path d="M5 12 L12 5 L19 12" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

type IconComponent = ComponentType<LucideProps> | ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

/**
 * Subcategory → icon mapping (most specific).
 * Inspired by Helix / QC / Katana editor iconography.
 */
const SUBCATEGORY_ICONS: Record<string, IconComponent> = {
  // Gain stages — lightning bolt
  overdrive: Zap,
  distortion: Zap,

  // Fuzz — jagged clipped wave (distinct from OD/dist)
  fuzz: FuzzIcon,

  // Boost — upward arrow
  boost: BoostIcon,

  // Dynamics — compression curve
  compressor: DynamicsIcon,
  gate: DynamicsIcon,
  limiter: DynamicsIcon,

  // Modulation — spinning/orbit
  chorus: Orbit,
  flanger: Orbit,
  phaser: Orbit,
  tremolo: Activity,
  vibrato: Activity,
  "uni-vibe": Orbit,
  modulation: Orbit,

  // Wah / Filter — rocker pedal shape
  wah: WahIcon,
  filter: WahIcon,
  "auto-wah": WahIcon,

  // Time-based
  delay: Clock,
  echo: Clock,
  reverb: ReverbIcon,

  // Pitch
  pitch: PitchIcon,
  "pitch-shift": PitchIcon,
  octave: PitchIcon,
  harmonizer: PitchIcon,
  whammy: PitchIcon,

  // EQ
  eq: SlidersHorizontal,
  equalizer: SlidersHorizontal,
};

/**
 * Category → icon mapping (fallback).
 * Includes both physical chain categories AND platform block_category values.
 */
const CATEGORY_ICONS: Record<string, IconComponent> = {
  // Physical chain categories
  guitar: Guitar,
  effect: Zap,
  preamp: Volume2,
  power_amp: AudioLines,
  wet_effect: Clock,
  cabinet: Speaker,
  microphone: Mic,

  // Platform block_category values (Helix / QC / Katana / TONEX)
  amp: Volume2,
  "amp type": Volume2,
  cab: Speaker,
  drive: Zap,
  distortion: Zap,
  stomp: Zap,
  booster: BoostIcon,
  dynamics: DynamicsIcon,
  modulation: Orbit,
  mod: Orbit,
  delay: Clock,
  reverb: ReverbIcon,
  wah: WahIcon,
  pitch: PitchIcon,
  "pitch/synth": PitchIcon,
  fx: Zap,
  "pedal fx": Zap,
  "tone model": Volume2,
  eq: SlidersHorizontal,
  filter: WahIcon,
};

export function getChainIcon(
  category: string,
  subcategory?: string | null
): IconComponent {
  // Try subcategory first (case-insensitive)
  if (subcategory) {
    const sub = subcategory.toLowerCase();
    if (SUBCATEGORY_ICONS[sub]) return SUBCATEGORY_ICONS[sub];
  }
  // Try category (case-insensitive)
  const cat = category.toLowerCase();
  if (CATEGORY_ICONS[cat]) return CATEGORY_ICONS[cat];
  // Try category as subcategory (platform block_category often matches subcategory names)
  if (SUBCATEGORY_ICONS[cat]) return SUBCATEGORY_ICONS[cat];
  return Zap;
}

/**
 * Human-readable label for the node.
 */
export function getChainIconLabel(
  category: string,
  subcategory?: string | null
): string {
  if (subcategory) return subcategory;

  const labels: Record<string, string> = {
    guitar: "Guitar",
    effect: "Effect",
    preamp: "Amp",
    power_amp: "Power",
    wet_effect: "Wet FX",
    cabinet: "Cabinet",
    microphone: "Mic",
  };

  // Try exact match first, then lowercase
  return labels[category] || labels[category.toLowerCase()] || category;
}
