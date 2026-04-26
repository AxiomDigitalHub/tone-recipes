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

/** Helix-convention color map — effect TYPE drives the color, not the
 *  individual gear. Every drive is yellow, every comp is teal, every
 *  delay is green, etc. Matches how Line 6 HX Edit color-codes the
 *  signal path in the hardware editor.
 *
 *  Loose keyword matching — categories arrive inconsistently from the
 *  data (e.g. "Drive" vs "Overdrive" vs "Distortion"), so we normalize
 *  and match against a stable set of category buckets. */
const HELIX_CATEGORY_COLOR: Array<[RegExp, PreviewBlockData["color"]]> = [
  [/amp|preamp|head/i, "red"],
  [/cab(inet)?|mic|\bir\b|impulse/i, "magenta"],
  [/comp(ressor)?|dynamic/i, "teal"],
  [/wah|filter|auto\s*wah|envelope/i, "teal"],
  [/\beq\b|graphic|parametric|tone\s*block/i, "orange"],
  [/dist(ortion)?|overdriv|drive|fuzz|boost|booster|screamer|klon|rat|muff/i, "yellow"],
  [/delay|echo/i, "green"],
  [/reverb|hall|plate|spring|room|verb/i, "blue"],
  [/mod(ulation)?|chorus|flang|phase|trem|vibe|rotary|leslie/i, "purple"],
  [/pitch|octav|whammy|harmon|synth/i, "magenta"],
  [/volume|expression|pan|gain\s*block|utility/i, "silver"],
];

function pickColor(
  _name: string,
  category: string,
): PreviewBlockData["color"] {
  const cat = category || "";
  for (const [re, color] of HELIX_CATEGORY_COLOR) {
    if (re.test(cat)) return color;
  }
  // Fall back to scanning the gear name as a last resort — handles
  // "Ibanez Tube Screamer" in an untyped row.
  const hay = _name || "";
  for (const [re, color] of HELIX_CATEGORY_COLOR) {
    if (re.test(hay)) return color;
  }
  return "black";
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
  const ranges: Record<
    string,
    { min?: number; max?: number; neutral?: number; unit?: string }
  > = {};

  for (const [key, raw] of Object.entries(settings)) {
    const n = parseNumber(raw);
    if (n === undefined) continue;
    const meta = lookupParam(key, node.category);
    if (meta?.kind === "text") continue;
    controls.push(key);
    values[key] = n;
    if (meta)
      ranges[key] = {
        min: meta.min,
        max: meta.max,
        neutral: meta.neutral,
        unit: meta.unit,
      };
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
    notes: node.notes || undefined,
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
  const ranges: Record<
    string,
    { min?: number; max?: number; neutral?: number; unit?: string }
  > = {};

  for (const [key, raw] of Object.entries(settings)) {
    const n = parseNumber(raw);
    if (n === undefined) continue;
    const meta = lookupParam(key, block.block_category);
    if (meta?.kind === "text") continue;
    controls.push(key);
    values[key] = n;
    if (meta)
      ranges[key] = {
        min: meta.min,
        max: meta.max,
        neutral: meta.neutral,
        unit: meta.unit,
      };
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
    notes: block.notes || undefined,
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
