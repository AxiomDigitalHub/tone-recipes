import type { PlatformTranslation } from "@/types/recipe";
import { resolveModelId, scaleParamValue, normalizeParamName } from "./model-map";

/**
 * Map block_category to Helix @type integer.
 */
function getBlockType(category: string): number {
  const lower = category.toLowerCase();
  if (lower.includes("amp") || lower.includes("preamp")) return 1;
  if (lower.includes("cab") || lower.includes("ir")) return 4;
  if (
    lower.includes("delay") || lower.includes("reverb") ||
    lower.includes("mod") || lower.includes("chorus") ||
    lower.includes("flang") || lower.includes("phas") || lower.includes("trem")
  ) return 7;
  return 0;
}

/** DT amp section (DT25/DT50 integration) */
const DT_SECTION = {
  "@dt_topology": 0,
  "@dt_tubeconfig": 0,
  "@model": "@dt",
  "@dt_channel": 0,
  "@dt_reverb": true,
  "@dt_poweramp": 1,
  "@dt_12ax7boost": 0,
  "@dt_bplusvoltage": 0,
  "@dt_feedbackcap": 0,
  "@dt_revmix": 0.25,
};

/** Powercab section */
const POWERCAB_SECTION = {
  "@model": "@powercab",
  "@powercab_color": 0,
  "@powercab_mic": 0,
  "@powercab_flatlevel": 0,
  "@powercab_irlevel": -18,
  "@powercab_hicut": 20100,
  "@powercab_lowcut": 19.9,
  "@powercab_distance": 3,
  "@powercab_speakerlevel": -15,
  "@powercab_userir": 0,
  "@powercab_speaker": 0,
};

/** DSP path infrastructure (split/join/inputs/outputs) */
function makeDspInfrastructure(isPath1: boolean) {
  return {
    inputA: {
      "@input": isPath1 ? 1 : 0,
      "@model": isPath1 ? "HD2_AppDSPFlow1Input" : "HD2_AppDSPFlow1Input",
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
      "@output": isPath1 ? 1 : 0,
      pan: 0.5,
      gain: 0,
    },
    outputB: {
      "@model": "HD2_AppDSPFlowOutput",
      "@output": 0,
      pan: 0.5,
      gain: 0,
    },
    split: {
      "@model": "HD2_AppDSPFlowSplitY",
      "@position": 0,
      "@enabled": true,
    },
    join: {
      "@model": "HD2_AppDSPFlowJoin",
      "@position": 8,
      "@enabled": true,
    },
  };
}

/**
 * Generate a valid Helix .hlx preset file.
 * Reverse-engineered from real HX Edit v3.80 exports.
 */
export function generateHelixPreset(
  translation: PlatformTranslation,
  presetName: string,
): string {
  const blocks = translation.chain_blocks;

  // Start with DSP infrastructure
  const dsp0: Record<string, unknown> = makeDspInfrastructure(true);

  // Snapshot block states
  const snapshotDsp0: Record<string, boolean> = { split: true };

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

    if (blockType === 1) entry["@bypassvolume"] = 1;
    if (blockType === 7) {
      entry["@trails"] = false;
      entry["@stereo"] = true;
    }

    for (const [key, value] of Object.entries(block.settings)) {
      const paramKey = normalizeParamName(key);
      const scaledValue = scaleParamValue(key, value);
      entry[paramKey] = parseFloat(scaledValue.toFixed(6));
    }

    dsp0[blockKey] = entry;
    snapshotDsp0[blockKey] = true;
  }

  // Cursor group = first block if any, empty string if none
  const cursorGroup = blocks.length > 0 ? "block0" : "";

  // Snapshot builder
  function makeSnapshot(name: string, index: number) {
    const isFirst = index === 0;
    const snap: Record<string, unknown> = {
      "@name": name,
      "@tempo": 120,
      "@valid": isFirst,
      "@pedalstate": 2,
      "@ledcolor": 0,
      "@custom_name": false,
    };
    // Only first snapshot gets blocks/controllers
    if (isFirst && blocks.length > 0) {
      snap.blocks = { dsp0: snapshotDsp0 };
      snap.controllers = {};
    }
    return snap;
  }

  const hlx = {
    data: {
      meta: {
        name: presetName.slice(0, 32),
        application: "HX Edit",
        build_sha: "39f7f9a",
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
          "@variax_str1tuning": 0, "@variax_str2tuning": 0,
          "@variax_str3tuning": 0, "@variax_str4tuning": 0,
          "@variax_str5tuning": 0, "@variax_str6tuning": 0,
          "@variax_str1level": 1, "@variax_str2level": 1,
          "@variax_str3level": 1, "@variax_str4level": 1,
          "@variax_str5level": 1, "@variax_str6level": 1,
          "@variax_toneknob": -0.1,
          "@variax_volumeknob": -0.1,
        },
        dtdual: { ...DT_SECTION },
        dt0: { ...DT_SECTION },
        dt1: { ...DT_SECTION },
        powercabdual: { ...POWERCAB_SECTION },
        powercab0: { ...POWERCAB_SECTION },
        powercab1: { ...POWERCAB_SECTION },
        global: {
          "@model": "@global_params",
          "@topology0": "A",
          "@topology1": "A",
          "@cursor_dsp": 0,
          "@cursor_path": 0,
          "@cursor_position": 0,
          "@cursor_group": cursorGroup,
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
        snapshot0: makeSnapshot("SNAPSHOT 1", 0),
        snapshot1: makeSnapshot("SNAPSHOT 2", 1),
        snapshot2: makeSnapshot("SNAPSHOT 3", 2),
        snapshot3: makeSnapshot("SNAPSHOT 4", 3),
        snapshot4: makeSnapshot("SNAPSHOT 5", 4),
        snapshot5: makeSnapshot("SNAPSHOT 6", 5),
        snapshot6: makeSnapshot("SNAPSHOT 7", 6),
        snapshot7: makeSnapshot("SNAPSHOT 8", 7),
        dsp0,
        dsp1: makeDspInfrastructure(false),
      },
    },
    // Root-level meta (separate from data.meta)
    meta: {
      original: 0,
      pbn: 0,
      premium: 0,
    },
    schema: "L6Preset" as const,
    version: 6,
  };

  return JSON.stringify(hlx, null, 2);
}

export function slugifyPresetName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
