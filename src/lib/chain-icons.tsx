import {
  Guitar,
  Zap,
  Waves,
  Volume2,
  Repeat,
  Speaker,
  Mic,
  Gauge,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * Maps signal chain categories/subcategories to Lucide icons.
 * Subcategory takes priority when available.
 */

const SUBCATEGORY_ICONS: Record<string, ComponentType<LucideProps>> = {
  overdrive: Zap,
  distortion: Zap,
  fuzz: Zap,
  boost: Zap,
  compressor: Gauge,
  wah: Waves,
  chorus: Waves,
  flanger: Waves,
  phaser: Waves,
  tremolo: Waves,
  vibrato: Waves,
  "uni-vibe": Waves,
  delay: Repeat,
  reverb: Repeat,
  echo: Repeat,
  modulation: Waves,
};

const CATEGORY_ICONS: Record<string, ComponentType<LucideProps>> = {
  guitar: Guitar,
  effect: Zap,
  preamp: Volume2,
  power_amp: Volume2,
  wet_effect: Repeat,
  cabinet: Speaker,
  microphone: Mic,
};

export function getChainIcon(
  category: string,
  subcategory?: string | null
): ComponentType<LucideProps> {
  // Try subcategory first for more specific icon
  if (subcategory) {
    const sub = subcategory.toLowerCase();
    if (SUBCATEGORY_ICONS[sub]) return SUBCATEGORY_ICONS[sub];
  }

  return CATEGORY_ICONS[category] || Zap;
}

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

  return labels[category] || category;
}
