/**
 * Educational tips explaining why gear is ordered in a specific way
 * in the signal chain. Used by ChainTooltip to show "?" icons between nodes.
 */

interface ChainTipRule {
  fromCategory: string;
  fromSubcategory?: string;
  toCategory: string;
  toSubcategory?: string;
  tip: string;
}

const CHAIN_TIPS: ChainTipRule[] = [
  // Overdrive → Preamp
  {
    fromCategory: "effect",
    fromSubcategory: "overdrive",
    toCategory: "preamp",
    tip: "Overdrive pedals placed before the amp push the preamp stage harder, creating natural tube saturation. This is different from putting distortion after the preamp.",
  },
  // Fuzz → Preamp
  {
    fromCategory: "effect",
    fromSubcategory: "fuzz",
    toCategory: "preamp",
    tip: "Fuzz pedals almost always go first in the chain (or right after the guitar). They're designed to see the guitar's impedance directly. Placing buffers or other pedals before a fuzz can change its character.",
  },
  // Compressor → Overdrive
  {
    fromCategory: "effect",
    fromSubcategory: "compressor",
    toCategory: "effect",
    toSubcategory: "overdrive",
    tip: "Compression before drive evens out your playing dynamics before the signal hits the gain stage. This creates a more consistent, sustained drive tone.",
  },
  // Compressor → Fuzz
  {
    fromCategory: "effect",
    fromSubcategory: "compressor",
    toCategory: "effect",
    toSubcategory: "fuzz",
    tip: "Compression before drive evens out your playing dynamics before the signal hits the gain stage. This creates a more consistent, sustained drive tone.",
  },
  // Compressor → Distortion
  {
    fromCategory: "effect",
    fromSubcategory: "compressor",
    toCategory: "effect",
    toSubcategory: "distortion",
    tip: "Compression before drive evens out your playing dynamics before the signal hits the gain stage. This creates a more consistent, sustained drive tone.",
  },
  // Preamp → Wet Effect
  {
    fromCategory: "preamp",
    toCategory: "wet_effect",
    tip: "Time-based effects (delay, reverb) placed after the amp keep the repeats clean and distinct. Putting delay before distortion creates a muddy, washed-out sound.",
  },
  // Preamp → Cabinet
  {
    fromCategory: "preamp",
    toCategory: "cabinet",
    tip: "The cabinet shapes the amp's raw signal into the tone you hear. Different speakers dramatically change the character — Greenbacks for midrange warmth, V30s for modern aggression.",
  },
  // Cabinet → Microphone
  {
    fromCategory: "cabinet",
    toCategory: "microphone",
    tip: "Mic placement is the final tone shaper. On-axis (pointed at the speaker center) is brighter and more present. Off-axis (angled or toward the edge) is warmer and darker.",
  },
  // Wet Effect → Cabinet
  {
    fromCategory: "wet_effect",
    toCategory: "cabinet",
    tip: "In some setups, effects like delay go after the preamp but before the cab sim. This is common on modelers where you want the cab to shape the delayed signal too.",
  },
  // Wah → Effect (generic)
  {
    fromCategory: "effect",
    fromSubcategory: "wah",
    toCategory: "effect",
    tip: "Wah pedals are typically placed early in the chain so they filter the raw guitar signal. Placing a wah after distortion creates a more dramatic, synth-like sweep.",
  },
  // Guitar → Effect (fuzz specifically)
  {
    fromCategory: "guitar",
    toCategory: "effect",
    toSubcategory: "fuzz",
    tip: "Fuzz pedals almost always go first in the chain (or right after the guitar). They're designed to see the guitar's impedance directly. Placing buffers or other pedals before a fuzz can change its character.",
  },
  // Power Amp → Cabinet
  {
    fromCategory: "power_amp",
    toCategory: "cabinet",
    tip: "The power amp adds its own coloring — sag, compression, and harmonic richness — before the signal reaches the speaker cabinet.",
  },
  // Effect (distortion) → Preamp
  {
    fromCategory: "effect",
    fromSubcategory: "distortion",
    toCategory: "preamp",
    tip: "Distortion pedals before the amp can act as a boost or provide their own clipping character. The amp's preamp then further shapes (or adds to) the distorted signal.",
  },
  // Effect (boost) → Preamp
  {
    fromCategory: "effect",
    fromSubcategory: "boost",
    toCategory: "preamp",
    tip: "A clean boost before the amp drives the preamp tubes harder without adding its own distortion character. It's a simple way to push a clean amp into natural breakup.",
  },
];

/**
 * Returns an educational tip about why two pieces of gear are ordered
 * in a specific way in the signal chain.
 *
 * @param fromCategory - The category of the preceding node (e.g., "effect", "preamp")
 * @param toCategory - The category of the following node
 * @param fromSubcategory - Optional subcategory of the preceding node (e.g., "overdrive", "fuzz")
 * @param toSubcategory - Optional subcategory of the following node
 * @returns The educational tip string, or null if no tip exists for this transition
 */
export function getChainTip(
  fromCategory: string,
  toCategory: string,
  fromSubcategory?: string | null,
  toSubcategory?: string | null,
): string | null {
  const normalizedFromSub = fromSubcategory?.toLowerCase() ?? undefined;
  const normalizedToSub = toSubcategory?.toLowerCase() ?? undefined;

  // First pass: try to match with both subcategories (most specific)
  for (const rule of CHAIN_TIPS) {
    if (
      rule.fromCategory === fromCategory &&
      rule.toCategory === toCategory &&
      rule.fromSubcategory &&
      rule.toSubcategory &&
      rule.fromSubcategory === normalizedFromSub &&
      rule.toSubcategory === normalizedToSub
    ) {
      return rule.tip;
    }
  }

  // Second pass: match with fromSubcategory only
  for (const rule of CHAIN_TIPS) {
    if (
      rule.fromCategory === fromCategory &&
      rule.toCategory === toCategory &&
      rule.fromSubcategory &&
      !rule.toSubcategory &&
      rule.fromSubcategory === normalizedFromSub
    ) {
      return rule.tip;
    }
  }

  // Third pass: match with toSubcategory only
  for (const rule of CHAIN_TIPS) {
    if (
      rule.fromCategory === fromCategory &&
      rule.toCategory === toCategory &&
      !rule.fromSubcategory &&
      rule.toSubcategory &&
      rule.toSubcategory === normalizedToSub
    ) {
      return rule.tip;
    }
  }

  // Fourth pass: match on categories only (least specific)
  for (const rule of CHAIN_TIPS) {
    if (
      rule.fromCategory === fromCategory &&
      rule.toCategory === toCategory &&
      !rule.fromSubcategory &&
      !rule.toSubcategory
    ) {
      return rule.tip;
    }
  }

  return null;
}
