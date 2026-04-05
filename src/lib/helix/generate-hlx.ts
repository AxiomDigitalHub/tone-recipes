import type { PlatformTranslation } from "@/types/recipe";
import { resolveModelId, scaleParamValue, normalizeParamName } from "./model-map";

/**
 * Map block_category to Helix @type integer.
 * 0 = stomp/drive/comp/eq/pitch/wah
 * 1 = amp
 * 4 = cab/IR
 * 7 = delay/reverb/modulation
 */
function getBlockType(category: string): number {
  const lower = category.toLowerCase();
  if (lower.includes("amp") || lower.includes("preamp")) return 1;
  if (lower.includes("cab") || lower.includes("ir")) return 4;
  if (
    lower.includes("delay") ||
    lower.includes("reverb") ||
    lower.includes("mod") ||
    lower.includes("chorus") ||
    lower.includes("flang") ||
    lower.includes("phas") ||
    lower.includes("trem")
  )
    return 7;
  return 0; // stomp/drive/comp/eq/pitch/wah
}

/**
 * Generate a valid Helix .hlx preset file from a PlatformTranslation.
 *
 * Reverse-engineered from real HX Edit exports. The format is strict —
 * HX Edit will reject files with wrong field types or missing keys.
 */
export function generateHelixPreset(
  translation: PlatformTranslation,
  presetName: string,
): string {
  const blocks = translation.chain_blocks;

  // Build DSP0 blocks
  const dsp0: Record<string, unknown> = {
    inputA: {
      "@input": 1,
      "@model": "HD2_AppDSPFlow1Input",
      noiseGate: false,
      decay: 0.5,
      threshold: -48,
    },
    inputB: {
      "@input": 0,
      "@model": "HD2_AppDSPFlow2Input",
      noiseGate: false,
      decay: 0.5,
      threshold: -48,
    },
  };

  // Snapshot block states
  const snapshotBlocks: Record<string, boolean> = { split: true };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockKey = `block${i}`;
    const modelId = resolveModelId(block.block_name);
    const blockType = getBlockType(block.block_category);

    const entry: Record<string, unknown> = {
      "@model": modelId,
      "@position": i,
      "@enabled": true,
      "@path": 0,
      "@type": blockType,
      "@stereo": false,
      "@no_snapshot_bypass": false,
    };

    // Amp blocks get extra fields
    if (blockType === 1) {
      entry["@bypassvolume"] = 1;
    }

    // Delay/reverb blocks get trails
    if (blockType === 7) {
      entry["@trails"] = false;
      entry["@stereo"] = true;
    }

    // Convert settings to flat float values (not wrapped in @value objects)
    for (const [key, value] of Object.entries(block.settings)) {
      const paramKey = normalizeParamName(key);
      const scaledValue = scaleParamValue(key, value);
      entry[paramKey] = parseFloat(scaledValue.toFixed(6));
    }

    dsp0[blockKey] = entry;
    snapshotBlocks[blockKey] = true;
  }

  // Output blocks
  dsp0["outputA"] = {
    "@model": "HD2_AppDSPFlowOutput",
    "@output": 1,
    pan: 0.5,
    gain: 0,
  };
  dsp0["outputB"] = {
    "@model": "HD2_AppDSPFlowOutput",
    "@output": 0,
    pan: 0.5,
    gain: 0,
  };

  // Build snapshot with proper structure
  function makeSnapshot(name: string, valid: boolean, ledColor: number) {
    return {
      "@name": name,
      "@tempo": 120,
      "@valid": valid,
      blocks: valid ? { dsp0: snapshotBlocks } : {},
      "@pedalstate": 2,
      "@ledcolor": ledColor,
      controllers: {},
      "@custom_name": valid,
    };
  }

  // Build the full HLX structure matching real HX Edit output
  const hlx = {
    data: {
      meta: {
        name: presetName.slice(0, 32),
        application: "HX Edit",
        build_sha: "v3.80",
        modifieddate: Math.floor(Date.now() / 1000),
        appversion: 58851328,
      },
      device: 2162692,
      tone: {
        variax: {
          "@model": "@variax",
          "@variax_model": 0,
          "@variax_magmode": true,
          "@variax_customtuning": false,
          "@variax_lockctrls": 0,
          "@variax_str1tuning": 0,
          "@variax_str2tuning": 0,
          "@variax_str3tuning": 0,
          "@variax_str4tuning": 0,
          "@variax_str5tuning": 0,
          "@variax_str6tuning": 0,
          "@variax_str1level": 1,
          "@variax_str2level": 1,
          "@variax_str3level": 1,
          "@variax_str4level": 1,
          "@variax_str5level": 1,
          "@variax_str6level": 1,
          "@variax_toneknob": -0.1,
          "@variax_volumeknob": -0.1,
        },
        global: {
          "@model": "@global_params",
          "@topology0": "A",
          "@topology1": "A",
          "@cursor_dsp": 0,
          "@cursor_path": 0,
          "@cursor_position": 0,
          "@cursor_group": "block0",
          "@current_snapshot": 0,
          "@tempo": 120,
          "@pedalstate": 2,
          "@guitarpad": 0,
          "@guitarinputZ": 0,
          "@DtSelect": 2,
          "@PowercabMode": 0,
          "@PowercabSelect": 2,
          "@PowercabVoicing": 0,
        },
        snapshot0: makeSnapshot("SNAPSHOT 1", true, 0),
        snapshot1: makeSnapshot("SNAPSHOT 2", false, 0),
        snapshot2: makeSnapshot("SNAPSHOT 3", false, 0),
        snapshot3: makeSnapshot("SNAPSHOT 4", false, 0),
        snapshot4: makeSnapshot("SNAPSHOT 5", false, 0),
        snapshot5: makeSnapshot("SNAPSHOT 6", false, 0),
        snapshot6: makeSnapshot("SNAPSHOT 7", false, 0),
        snapshot7: makeSnapshot("SNAPSHOT 8", false, 0),
        dsp0,
        dsp1: {
          inputA: {
            "@input": 0,
            "@model": "HD2_AppDSPFlow1Input",
            noiseGate: false,
            decay: 0.5,
            threshold: -48,
          },
          inputB: {
            "@input": 0,
            "@model": "HD2_AppDSPFlow2Input",
            noiseGate: false,
            decay: 0.5,
            threshold: -48,
          },
          outputA: {
            "@model": "HD2_AppDSPFlowOutput",
            "@output": 0,
            pan: 0.5,
            gain: 0,
          },
          outputB: {
            "@model": "HD2_AppDSPFlowOutput",
            "@output": 0,
            pan: 0.5,
            gain: 0,
          },
        },
      },
    },
    schema: "L6Preset",
    version: 6,
  };

  return JSON.stringify(hlx, null, 2);
}

/**
 * Slugify a preset name into a safe filename.
 */
export function slugifyPresetName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
