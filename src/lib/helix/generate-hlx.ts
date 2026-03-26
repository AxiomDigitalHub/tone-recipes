import type { PlatformTranslation } from "@/types/recipe";
import {
  resolveModelId,
  scaleParamValue,
  normalizeParamName,
} from "./model-map";

/**
 * Build a single HLX block object from a PlatformBlock.
 */
function buildBlock(
  blockName: string,
  settings: Record<string, string | number>,
  path: number,
  position: number,
  enabled: boolean,
): Record<string, unknown> {
  const modelId = resolveModelId(blockName);

  const block: Record<string, unknown> = {
    "@model": modelId,
    "@path": path,
    "@position": position,
    "@enabled": enabled,
  };

  // Convert each setting to a Helix parameter with { "@value": number }
  for (const [key, value] of Object.entries(settings)) {
    const paramKey = normalizeParamName(key);
    const scaledValue = scaleParamValue(key, value);
    block[paramKey] = { "@value": parseFloat(scaledValue.toFixed(4)) };
  }

  return block;
}

/**
 * Check if a block category represents a cab/IR block.
 */
function isCabCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return lower === "cab" || lower === "cabinet" || lower === "ir";
}

/**
 * Check if a block category represents an amp block.
 */
function isAmpCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return (
    lower === "amp" ||
    lower === "amp type" ||
    lower === "preamp" ||
    lower === "power amp"
  );
}

/**
 * Generate a valid Helix .hlx preset JSON string from a PlatformTranslation
 * and a preset name.
 *
 * The HLX format is a JSON document with a specific schema understood by
 * Line 6's HX Edit software and the Helix hardware.
 *
 * Blocks are placed sequentially on DSP path 0 (dsp0).
 * A single default snapshot is included.
 */
export function generateHelixPreset(
  translation: PlatformTranslation,
  presetName: string,
): string {
  // Build DSP0 block entries
  const dsp0: Record<string, unknown> = {
    inputA: {
      "@model": "HD2_AppDSPFlow1Input",
      "@input": 1,
      "@input_gate": false,
    },
  };

  // Place each chain block sequentially
  const blocks = translation.chain_blocks;
  const snapshotBlocks: Record<string, unknown> = {};

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockKey = `block${i}`;
    const enabled = true;

    // Determine if this is a cab that should be merged with the preceding amp
    // In Helix, amp+cab are often a single "Amp+Cab" block, but we keep them
    // separate for maximum flexibility in the preset.

    dsp0[blockKey] = buildBlock(
      block.block_name,
      block.settings,
      0,
      i,
      enabled,
    );

    // Add block reference to snapshot
    snapshotBlocks[blockKey] = {
      "@enabled": enabled,
    };
  }

  // Output block
  dsp0["outputA"] = {
    "@model": "HD2_AppDSPFlowOutput",
    "@output": 1,
    "Level": { "@value": 0.5 },
    "Pan": { "@value": 0.5 },
  };

  // Build the full HLX structure
  const hlx = {
    schema: "L6Preset",
    version: 6,
    meta: {
      original: 0,
      pbn: 0,
      premium: 0,
    },
    data: {
      meta: {
        name: presetName.slice(0, 32), // Helix preset names max 32 chars
      },
      tone: {
        global: {
          "@topology0": 0,
          "@topology1": 0,
          "@cursor_dsp": 0,
          "@cursor_path": 0,
          "@cursor_position": 0,
          "@tempo": 120,
          "@current_snapshot": 0,
        },
        dsp0,
        dsp1: {
          inputA: {
            "@model": "HD2_AppDSPFlow2Input",
            "@input": 0,
          },
          outputA: {
            "@model": "HD2_AppDSPFlowOutput",
            "@output": 0,
            "Level": { "@value": 0.5 },
            "Pan": { "@value": 0.5 },
          },
        },
        snapshot0: {
          name: "Default",
          "@ledcolor": 0,
          blocks: snapshotBlocks,
          controllers: {},
        },
        snapshot1: { name: "EMPTY", "@ledcolor": 0, blocks: {}, controllers: {} },
        snapshot2: { name: "EMPTY", "@ledcolor": 0, blocks: {}, controllers: {} },
        snapshot3: { name: "EMPTY", "@ledcolor": 0, blocks: {}, controllers: {} },
      },
    },
  };

  return JSON.stringify(hlx, null, 2);
}

/**
 * Slugify a preset name into a safe filename.
 * E.g. "Comfortably Numb (Lead)" -> "comfortably-numb-lead"
 */
export function slugifyPresetName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
