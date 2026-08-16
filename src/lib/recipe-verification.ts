/**
 * Per-recipe verification facts — machine-computed, never asserted.
 * ------------------------------------------------------------------
 * Everything in here is something a program actually checked at build time.
 * Nothing in here implies a human plugged in a guitar, because nobody did.
 *
 * The governing constraint is `docs/GAME_THEORY_2026-07-30.md` §7: our
 * verification claim must stay inside the machine-executable set —
 * test-import, DSP budget, model-ID resolution, source tier, attribution
 * confidence — stated precisely, with the gaps named. "Hardware-tested"
 * would be a cheap lie that hands back the only advantage we have, and a
 * claim that is expensive to fake is the only signal that survives a market
 * flooded with free, unverifiable presets.
 *
 * This module deliberately reads the *same* chain plan the downloadable
 * file is emitted from (`planHelixChain`), so the numbers on the page
 * describe the artifact rather than a parallel guess about it.
 */

import type { ToneRecipe, Platform } from "@/types/recipe";
import { planHelixChain, generateHelixPreset, slugifyPresetName } from "@/lib/helix/generate-hlx";
import { generateQCPreset } from "@/lib/quadcortex/generate-qc";
import { generateKatanaTSL } from "@/lib/katana/generate-tsl";
import { QC_MODEL_MAP } from "@/lib/quadcortex/model-map";
import {
  KATANA_EFFECT_MAP,
  KATANA_AMP_TYPES,
  isAmpCategory as isKatanaAmpCategory,
  isCabCategory as isKatanaCabCategory,
  resolveKatanaEffect,
} from "@/lib/katana/model-map";
import {
  fitsOnDevice,
  type BlockSpec,
  type HelixDevice,
  type DspConfidence,
} from "@/lib/helix/dsp-costs";

/* -------------------------------------------------------------------------- */
/*  Source tiers                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Publications that do original gear reporting — interviews with the player
 * or their tech, studio teardowns, rig rundowns. A claim sourced here is
 * traceable to someone who asked.
 */
const PRIMARY_SOURCE_HOSTS = new Set([
  "premierguitar.com",
  "guitarworld.com",
  "musicradar.com",
  "guitarplayer.com",
  "vintageguitar.com",
  "soundonsound.com",
  "mixonline.com",
  "tapeop.com",
  "guitar.com",
  "loudersound.com",
  "mixdownmag.com.au",
  "gearnews.com",
  "geargods.net",
  "groundguitar.com",
  "uberproaudio.com",
  "gilmourish.com",
  "slashparadise.com",
  "reverb.com",
  "thomann.de",
  "uaudio.com",
]);

/**
 * Manufacturer domains. Authoritative for what a product *is* (specs, model
 * lists, manuals), not for what a given player used on a given record.
 */
const MANUFACTURER_SOURCE_HOSTS = new Set([
  "line6.com",
  "marshall.com",
  "fender.com",
  "boss.info",
  "roland.com",
  "rolandcorp.com.au",
  "neuraldsp.com",
  "strymon.net",
  "toontrack.com",
]);

/**
 * Aggregators, tab sites, video, and wikis. Useful for orientation, but they
 * are downstream of somebody else's reporting and frequently wrong about
 * specifics. A recipe standing only on these is our soft underbelly, and the
 * page should say so rather than let the reader assume otherwise.
 */
const AGGREGATOR_SOURCE_HOSTS = new Set([
  "equipboard.com",
  "en.wikipedia.org",
  "wikipedia.org",
  "songsterr.com",
  "youtube.com",
  "tabs.ultimate-guitar.com",
  "ultimate-guitar.com",
  "songbpm.com",
  "gtdb.org",
  "guitarchalk.com",
  "guitarlobby.com",
  "musicstrive.com",
  "guitarlessons365.com",
  "guitargangsters.net",
]);

export type SourceTier = "primary" | "manufacturer" | "aggregator" | "unclassified";

export interface ClassifiedSource {
  url: string;
  host: string;
  tier: SourceTier;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function classifySource(url: string): ClassifiedSource {
  const host = hostOf(url);
  let tier: SourceTier = "unclassified";
  if (PRIMARY_SOURCE_HOSTS.has(host)) tier = "primary";
  else if (MANUFACTURER_SOURCE_HOSTS.has(host)) tier = "manufacturer";
  else if (AGGREGATOR_SOURCE_HOSTS.has(host)) tier = "aggregator";
  return { url, host, tier };
}

/* -------------------------------------------------------------------------- */
/*  Preset build check                                                        */
/* -------------------------------------------------------------------------- */

/** Platforms we emit a real, loadable preset file for. */
export const BUILDABLE_PLATFORMS = ["helix", "quad_cortex", "katana"] as const;
export type BuildablePlatform = (typeof BUILDABLE_PLATFORMS)[number];

export interface PresetBuildResult {
  platform: BuildablePlatform;
  /** The generator ran and produced a non-empty file. */
  built: boolean;
  /** Bytes of the emitted file. */
  bytes: number;
  /** Thrown error message, when the generator failed outright. */
  error?: string;
  /**
   * Blocks the recipe names that are absent from the emitted file. Helix has
   * no fallback model, so an unresolved name is simply not written.
   */
  droppedBlocks: string[];
  /**
   * Blocks whose name is not in the platform's model map and which therefore
   * come out as something else. This is the quieter failure and the one worth
   * naming loudest: the file loads cleanly and sounds wrong, so nothing warns
   * the player except their own ears.
   */
  substitutedBlocks: string[];
  /**
   * Blocks the target hardware has no equivalent slot for, omitted by design
   * rather than by defect (a Katana has no cab block). Not a fault; listed so
   * the block count on the page reconciles.
   */
  omittedByDesign: string[];
}

/** Names that are structural, not models — never expected in a model map. */
function isStructuralBlock(category: string): boolean {
  const c = category.toLowerCase();
  return c.includes("split") || c.includes("merge") || c.includes("input") || c.includes("output");
}

/** Katana's fixed chain: Booster → Mod → FX → Delay → Reverb. Five slots, no more. */
const KATANA_SLOT_COUNT = 5;

/**
 * Which blocks fail to survive each platform's generator, mirroring what that
 * generator actually does rather than guessing from a single map lookup:
 *
 * - **Helix** resolves every block through `resolveModelId` and writes nothing
 *   when it returns null.
 * - **QC** resolves every block, cabs included, through `resolveQCModel`,
 *   which falls back to a fixed model.
 * - **Katana** routes amps through one map, discards cabs (the hardware has no
 *   cab block), and squeezes what's left into five fixed slots — so it can
 *   both substitute *and* drop, for different reasons.
 */
function analyzeBlocks(
  platform: BuildablePlatform,
  translation: NonNullable<ToneRecipe["platform_translations"]["helix"]>,
): Pick<PresetBuildResult, "droppedBlocks" | "substitutedBlocks" | "omittedByDesign"> {
  const chain = translation.chain_blocks.filter((b) => !isStructuralBlock(b.block_category));

  if (platform === "helix") {
    const plan = planHelixChain(translation);
    return {
      droppedBlocks: plan.skipped
        .filter((b) => !isStructuralBlock(b.block_category))
        .map((b) => b.block_name),
      substitutedBlocks: [],
      omittedByDesign: [],
    };
  }

  if (platform === "quad_cortex") {
    return {
      droppedBlocks: [],
      substitutedBlocks: chain.filter((b) => !(b.block_name in QC_MODEL_MAP)).map((b) => b.block_name),
      omittedByDesign: [],
    };
  }

  // Katana.
  const substituted: string[] = [];
  const omitted: string[] = [];

  const amp = chain.find((b) => isKatanaAmpCategory(b.block_category));
  if (amp && !(amp.block_name in KATANA_AMP_TYPES)) substituted.push(amp.block_name);

  // Cabs have nowhere to go on a Katana — the power amp and speaker are the
  // cab. Omitted by design, not lost.
  for (const b of chain) {
    if (isKatanaCabCategory(b.block_category)) omitted.push(b.block_name);
  }

  const effects = chain.filter(
    (b) => !isKatanaAmpCategory(b.block_category) && !isKatanaCabCategory(b.block_category),
  );
  for (const b of effects) {
    if (!(b.block_name in KATANA_EFFECT_MAP)) substituted.push(b.block_name);
  }

  // Replay the generator's slot assignment to find what falls off the end.
  const slots: Record<string, boolean> = {
    Booster: false, Mod: false, FX: false, Delay: false, Reverb: false,
  };
  const dropped: string[] = [];
  let filled = 0;
  for (const block of effects) {
    const cat = resolveKatanaEffect(block.block_name).category.toUpperCase();
    let slot: string | null = null;
    if ((cat.includes("OD") || cat.includes("DS") || cat.includes("COMP") || cat.includes("BOOST")) && !slots.Booster) slot = "Booster";
    else if ((cat.includes("MOD") || cat.includes("PEDAL")) && !slots.Mod) slot = "Mod";
    else if (cat.includes("DELAY") && !slots.Delay) slot = "Delay";
    else if (cat.includes("REVERB") && !slots.Reverb) slot = "Reverb";
    else if (!slots.FX) slot = "FX";

    if (slot) {
      slots[slot] = true;
      filled++;
    } else {
      dropped.push(block.block_name);
    }
  }
  void filled;
  void KATANA_SLOT_COUNT;

  return { droppedBlocks: dropped, substitutedBlocks: substituted, omittedByDesign: omitted };
}

function buildOne(
  recipe: ToneRecipe,
  platform: BuildablePlatform,
): PresetBuildResult | null {
  const translation = recipe.platform_translations?.[platform as Platform];
  if (!translation) return null;

  const name = slugifyPresetName(recipe.title);
  const empty = { droppedBlocks: [], substitutedBlocks: [], omittedByDesign: [] };

  try {
    const file =
      platform === "helix"
        ? generateHelixPreset(translation, name)
        : platform === "quad_cortex"
          ? generateQCPreset(translation, name)
          : generateKatanaTSL(translation, name);

    return {
      platform,
      built: file.length > 0,
      bytes: file.length,
      ...analyzeBlocks(platform, translation),
    };
  } catch (e) {
    return {
      platform,
      built: false,
      bytes: 0,
      error: e instanceof Error ? e.message : String(e),
      ...empty,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  DSP budget                                                                */
/* -------------------------------------------------------------------------- */

export interface DspFacts {
  device: HelixDevice;
  /** Highest per-path utilisation — the number that actually bites. */
  worstPathPercent: number;
  fits: boolean;
  detail: string;
  confidence: DspConfidence;
  /** Models with no published cost data. Their cost is counted as zero. */
  unknownModels: string[];
}

function isAmpCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c.includes("amp") || c.includes("preamp");
}

function isCabCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c.includes("cab") || c.includes("ir");
}

/**
 * DSP cost of the chain as the generator actually lays it out — including
 * which SHARC chip each block lands on, since the two do not pool and a
 * naive single-path estimate is the exact mistake that wastes half a Helix.
 */
function dspFactsFor(
  recipe: ToneRecipe,
  device: HelixDevice = "helix_lt",
): DspFacts | null {
  const translation = recipe.platform_translations?.helix;
  if (!translation) return null;

  let plan;
  try {
    plan = planHelixChain(translation);
  } catch {
    return null;
  }
  if (plan.dsp0Slots.length === 0 && plan.dsp1Slots.length === 0) return null;

  const toSpec = (slot: { block: { block_name: string; block_category: string; cabSibling?: unknown } }, path: 1 | 2): BlockSpec => ({
    model: slot.block.block_name,
    path,
    ...(isAmpCategory(slot.block.block_category) ? { variant: "amp" as const } : {}),
    ...(isCabCategory(slot.block.block_category) && slot.block.cabSibling != null
      ? { dualCab: true }
      : {}),
  });

  const specs: BlockSpec[] = [
    ...plan.dsp0Slots.map((s) => toSpec(s, 1)),
    ...plan.dsp1Slots.map((s) => toSpec(s, 2)),
  ];
  if (plan.cabSibling) specs.push(toSpec(plan.cabSibling, 1));

  const verdict = fitsOnDevice(specs, device);
  return {
    device,
    worstPathPercent: Math.round(verdict.usage.worstPathPercent * 10) / 10,
    fits: verdict.fits,
    detail: verdict.detail,
    confidence: verdict.usage.confidence,
    unknownModels: verdict.usage.unknownModels,
  };
}

/* -------------------------------------------------------------------------- */
/*  The whole picture                                                         */
/* -------------------------------------------------------------------------- */

export interface RecipeVerification {
  presets: PresetBuildResult[];
  /** Platforms that get a model/capture pointer rather than a preset file. */
  pointerPlatforms: Platform[];
  dsp: DspFacts | null;
  sources: ClassifiedSource[];
  primarySourceCount: number;
  /** True when every cited source is an aggregator, tab site, video, or wiki. */
  aggregatorOnly: boolean;
  attribution: AttributionConfidence;
  hasAudio: boolean;
  /**
   * The honest other half. Listing what we did NOT check is what makes the
   * checked list worth anything — silence is rationally read as bad news.
   */
  notChecked: string[];
}

export type AttributionConfidence = "documented" | "pool" | "tribute" | "unstated";

export const ATTRIBUTION_LABELS: Record<AttributionConfidence, { label: string; detail: string }> = {
  documented: {
    label: "Documented",
    detail: "The player is named for this specific part in credits or an interview.",
  },
  pool: {
    label: "Credited pool",
    detail:
      "The player is credited on the record, but the label never says who played this particular part. Our attribution is the most likely of several credited guitarists — not a documented fact.",
  },
  tribute: {
    label: "Reconstruction",
    detail:
      "No usable gear documentation exists. This chain is reverse-engineered from the recording by ear and inference.",
  },
  unstated: {
    label: "Not yet rated",
    detail: "This recipe predates the attribution-confidence field and hasn't been reviewed for it.",
  },
};

/** Platforms we translate but do not emit a file for. */
const POINTER_PLATFORMS: Platform[] = ["tonex", "kemper", "fractal"];

export function verifyRecipe(recipe: ToneRecipe): RecipeVerification {
  const presets = BUILDABLE_PLATFORMS.map((p) => buildOne(recipe, p)).filter(
    (r): r is PresetBuildResult => r !== null,
  );

  const sources = (recipe.sources ?? []).map(classifySource);
  const primarySourceCount = sources.filter(
    (s) => s.tier === "primary" || s.tier === "manufacturer",
  ).length;

  const pointerPlatforms = POINTER_PLATFORMS.filter(
    (p) => recipe.platform_translations?.[p] != null,
  );

  const notChecked = [
    "Nobody played this through a real amp. There is no human listening test behind any number on this page.",
    "The settings are reasoned from the sources below, not measured off the record.",
  ];
  if (!recipe.audio_demo) {
    notChecked.push("No audio has been rendered for this recipe yet, so you cannot hear it before you load it.");
  }
  if (pointerPlatforms.length > 0) {
    notChecked.push(
      `${pointerPlatforms.length} platform${pointerPlatforms.length === 1 ? "" : "s"} on this page (${pointerPlatforms
        .map(platformLabel)
        .join(", ")}) get a model pointer, not a preset file — nothing was built or checked for them.`,
    );
  }

  return {
    presets,
    pointerPlatforms,
    dsp: dspFactsFor(recipe),
    sources,
    primarySourceCount,
    aggregatorOnly: sources.length > 0 && primarySourceCount === 0,
    attribution: recipe.attribution_confidence ?? "unstated",
    hasAudio: recipe.audio_demo != null,
    notChecked,
  };
}

export function platformLabel(platform: Platform | BuildablePlatform): string {
  const labels: Record<string, string> = {
    helix: "Helix",
    quad_cortex: "Quad Cortex",
    katana: "Katana",
    tonex: "TONEX",
    kemper: "Kemper",
    fractal: "Fractal",
    pedalboard: "Pedalboard",
  };
  return labels[platform] ?? platform;
}
