/**
 * Shape adapter: our recipe data → the preview block shape.
 *
 * Our recipes have `signal_chain[]` (physical rig) and
 * `platform_translations[platform].chain_blocks[]` (per-platform). The
 * preview visuals want a flat `PreviewBlockData[]` with variant (source /
 * pedal / amp / cab), color, controls, values, ranges.
 *
 * This file is the only place that knows about both shapes. Keep the
 * `PreviewBlockData` contract stable so the visual layer can iterate
 * without touching data.
 */

import type { ToneRecipe, PlatformTranslation, Platform } from "@/types/recipe";
import type { PreviewBlockData } from "./PreviewBlocks";
import { lookupParam } from "@/lib/parameters/registry";

const PEDAL_COLOR_BY_GEAR: Record<string, PreviewBlockData["color"]> = {
  "Ibanez TS808": "green",
  "Ibanez Tube Screamer": "green",
  "Electro-Harmonix Big Muff Pi": "black",
  "Big Muff": "black",
  "Dallas-Arbiter Fuzz Face": "red",
  "Fuzz Face": "red",
  "Boss DS-1": "orange",
  "Boss BD-2": "blue",
  "Blues Driver": "blue",
  "Klon Centaur": "cream",
  Klon: "cream",
  "ProCo RAT": "black",
  RAT: "black",
  "MXR Digital Delay": "silver",
  "Boss DD-3": "silver",
  "Strymon Timeline": "silver",
  "Electro-Harmonix Electric Mistress": "purple",
  Tonebender: "cream",
  "Dunlop Cry Baby": "black",
  "Cry Baby": "black",
};

const COLOR_BY_CATEGORY: Record<string, PreviewBlockData["color"]> = {
  Drive: "green",
  Distortion: "orange",
  Fuzz: "red",
  Booster: "cream",
  Compressor: "silver",
  Delay: "silver",
  Reverb: "blue",
  Modulation: "purple",
  Wah: "black",
  "Volume/Pan": "black",
  Pitch: "purple",
  EQ: "black",
};

function pickColor(name: string, category: string): PreviewBlockData["color"] {
  // Exact gear match first, then category fallback.
  if (name && PEDAL_COLOR_BY_GEAR[name]) return PEDAL_COLOR_BY_GEAR[name];
  // Partial match on gear name (e.g. "Klon KTR" → Klon → cream)
  const exact = Object.keys(PEDAL_COLOR_BY_GEAR).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );
  if (exact) return PEDAL_COLOR_BY_GEAR[exact];
  return COLOR_BY_CATEGORY[category] ?? "black";
}

function variantFor(category: string): PreviewBlockData["variant"] {
  const c = (category || "").toLowerCase();
  if (c.includes("guitar") || c.includes("input")) return "source";
  if (c.includes("cab") || c.includes("mic") || c.includes("cabinet"))
    return "cab";
  if (c.includes("amp")) return "amp";
  return "pedal";
}

/** Parse values that might come as strings like "+6dB", "-2.5", "5-6", etc. */
function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;
  const m = value.match(/([+-]?\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
}

/**
 * Convert a recipe + selected platform into an array of PreviewBlockData
 * suitable for rendering. Uses the platform-translation blocks if available
 * (so "Helix" shows Helix-specific amp models + settings), falling back to
 * `signal_chain` when a platform block isn't present.
 */
export function recipeToBlocks(
  recipe: ToneRecipe,
  platform: Platform | "physical",
): PreviewBlockData[] {
  const blocks: PreviewBlockData[] = [];

  // 1. Input / guitar source — always first
  if (recipe.guitar_specs) {
    const g = recipe.guitar_specs;
    blocks.push({
      variant: "source",
      kind: "input src",
      name: g.model_name || "Guitar",
      sub: [
        g.pickup_config ? `${g.pickup_config} · ${g.pickup_position}` : null,
        g.tuning ? g.tuning : null,
        g.string_gauge ? g.string_gauge : null,
      ]
        .filter(Boolean)
        .join(" · "),
      controls: [],
      values: {},
    });
  }

  // 2. Signal chain blocks
  if (platform === "physical") {
    // Physical recipe: use the signal_chain directly
    for (const node of recipe.signal_chain ?? []) {
      blocks.push(nodeToBlock(node));
    }
  } else {
    // Modeler: use the platform translation's chain_blocks
    const translation = recipe.platform_translations?.[platform] as
      | PlatformTranslation
      | undefined;
    if (translation?.chain_blocks) {
      for (const block of translation.chain_blocks) {
        blocks.push(platformBlockToBlock(block));
      }
    } else {
      // Fallback to physical chain if no translation exists
      for (const node of recipe.signal_chain ?? []) {
        blocks.push(nodeToBlock(node));
      }
    }
  }

  return blocks;
}

/** Convert a physical-rig signal chain node to a preview block. */
function nodeToBlock(
  node: NonNullable<ToneRecipe["signal_chain"]>[number],
): PreviewBlockData {
  const variant = variantFor(node.category);
  const settings = node.settings ?? {};

  const controls: string[] = [];
  const values: Record<string, number> = {};
  const ranges: Record<string, { min?: number; max?: number }> = {};

  for (const [key, raw] of Object.entries(settings)) {
    const n = parseNumber(raw);
    if (n === undefined) continue;
    // Look up registry metadata for range (fallback to 0–10 amp range)
    const meta = lookupParam(key, node.category);
    if (meta?.kind === "text") continue;
    controls.push(key);
    values[key] = n;
    if (meta) ranges[key] = { min: meta.min, max: meta.max };
  }

  return {
    variant,
    name: node.gear_name || node.subcategory || node.category,
    sub: summarizeNode(node),
    color: pickColor(node.gear_name ?? "", node.category),
    controls,
    values,
    ranges,
    kind: variant === "source" ? "input src" : variant === "cab" ? "cabinet / mic" : undefined,
  };
}

/** Convert a platform-specific chain block (Helix / QC / etc.) to preview block. */
function platformBlockToBlock(
  block: PlatformTranslation["chain_blocks"][number],
): PreviewBlockData {
  const variant = variantFor(block.block_category || "");
  const settings = block.settings ?? {};

  const controls: string[] = [];
  const values: Record<string, number> = {};
  const ranges: Record<string, { min?: number; max?: number }> = {};

  for (const [key, raw] of Object.entries(settings)) {
    const n = parseNumber(raw);
    if (n === undefined) continue;
    const meta = lookupParam(key, block.block_category);
    if (meta?.kind === "text") continue;
    controls.push(key);
    values[key] = n;
    if (meta) ranges[key] = { min: meta.min, max: meta.max };
  }

  return {
    variant,
    name: block.block_name || block.original_gear || "Block",
    sub: block.original_gear ? `← ${block.original_gear}` : block.block_category || "",
    color: pickColor(block.block_name ?? "", block.block_category ?? ""),
    controls,
    values,
    ranges,
    kind: variant === "source" ? "input src" : variant === "cab" ? "cabinet / mic" : undefined,
  };
}

function summarizeNode(
  node: NonNullable<ToneRecipe["signal_chain"]>[number],
): string {
  const bits: string[] = [];
  if (node.subcategory) bits.push(node.subcategory);
  if (node.is_in_effects_loop) bits.push("FX loop");
  if (bits.length === 0 && node.category) bits.push(node.category);
  return bits.join(" · ");
}
