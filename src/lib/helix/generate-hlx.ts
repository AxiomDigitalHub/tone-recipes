import type { PlatformTranslation } from "@/types/recipe";
import { resolveModelId, scaleParamValue, normalizeParamName, withPanVariant } from "./model-map";

/**
 * Param keys (post-normalization) that must be emitted as JSON booleans
 * rather than 0/1 numbers. Verified against real Helix exports.
 */
const BOOLEAN_PARAMS = new Set([
  "TempoSync1", "TempoSync2",
  "Voltage", "VolumeTaper",
]);

/**
 * Legacy single-mic cabs (@type: 2) only accept these 5 params.
 * Mic / Position / Pan / Angle / Delay belong only to the WithPan
 * dual-cab format (@type: 4 with sibling cab0). Emitting the WithPan
 * params on a legacy cab is silently ignored by HX Edit but pollutes
 * the file. Verified against the factory corpus + a 2026-04-26 user
 * export.
 */
const LEGACY_CAB_PARAMS = new Set([
  "LowCut", "HighCut", "Distance", "Level", "EarlyReflections",
]);

/**
 * Map block_category to Helix @type integer.
 *
 * - amps use @type: 1
 * - cabs use @type: 2 (legacy single-cab format). The newer @type: 4
 *   "WithPan" format requires a sibling cab0/cab1 block for dual-mic
 *   blending; without that sibling, HX Edit rejects the file. We use
 *   single-mic legacy cabs until the dual-cab emitter is built.
 * - delays / reverbs / modulation use @type: 7
 * - stomps (comp, drive, fuzz, wah, volume) use @type: 0
 */
function getBlockType(category: string): number {
  const lower = category.toLowerCase();
  if (lower.includes("amp") || lower.includes("preamp")) return 1;
  if (lower.includes("cab") || lower.includes("ir")) return 2;
  if (
    lower.includes("delay") || lower.includes("reverb") ||
    lower.includes("mod") || lower.includes("chorus") ||
    lower.includes("flang") || lower.includes("phas") || lower.includes("trem")
  ) return 7;
  // Volume/Pan, compressor, distortion, wah, EQ — all stomp-class
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
      "@no_snapshot_bypass": false,
      BalanceA: 0.5,
      BalanceB: 0.5,
      bypass: false,
    },
    join: {
      "@model": "HD2_AppDSPFlowJoin",
      "@position": 8,
      "@enabled": true,
      "@no_snapshot_bypass": false,
      "A Level": 0,
      "B Level": 0,
      "A Pan": 0,
      "B Pan": 1,
      "B Polarity": false,
      Level: 0,
    },
  };
}

/**
 * Generate a valid Helix .hlx preset file.
 * Reverse-engineered from real HX Edit v3.80 exports.
 */
/**
 * Build a single block entry from a recipe block + resolved model ID,
 * honoring the @position the caller assigns. Returns the entry plus a
 * boolean indicating whether the block is enabled by default.
 */
function buildBlockEntry(
  block: PlatformTranslation["chain_blocks"][0],
  modelId: string,
  position: number,
  typeOverride?: number,
): { entry: Record<string, unknown>; isEnabled: boolean } {
  // Caller can override the @type when promoting a legacy cab to its
  // WithPan variant (cab2 → cab4). The override determines both the
  // emitted @type AND which param-filter applies.
  const blockType = typeOverride ?? getBlockType(block.block_category);
  const isEnabled = block.enabled !== false;

  const entry: Record<string, unknown> = {
    "@model": modelId,
    "@position": position,
    "@enabled": isEnabled,
    "@path": 0,
    "@type": blockType,
    "@no_snapshot_bypass": false,
  };

  if (blockType === 0 || blockType === 7) entry["@stereo"] = false;
  if (blockType === 1) entry["@bypassvolume"] = 1;
  if (blockType === 7) entry["@trails"] = true;

  // Legacy single-mic cabs (@type: 2) reject params that belong to
  // the WithPan dual-cab format. Filter the recipe's settings down to
  // the 5 valid keys before emitting; the others (Mic, Position, etc.)
  // are silently dropped during import anyway and just clutter the file.
  const isLegacyCab = blockType === 2;

  for (const [key, value] of Object.entries(block.settings)) {
    const paramKey = normalizeParamName(key);
    if (isLegacyCab && !LEGACY_CAB_PARAMS.has(paramKey)) continue;
    if (typeof value === "boolean") {
      entry[paramKey] = value;
      continue;
    }
    const scaledValue = scaleParamValue(key, value);
    if (BOOLEAN_PARAMS.has(paramKey)) {
      entry[paramKey] = scaledValue >= 0.5;
    } else {
      entry[paramKey] = parseFloat(scaledValue.toFixed(6));
    }
  }

  return { entry, isEnabled };
}

export function generateHelixPreset(
  translation: PlatformTranslation,
  presetName: string,
): string {
  const blocks = translation.chain_blocks;

  // Filter to verified model IDs only (no silent Minotaur fallbacks).
  const renderable = blocks
    .map((block) => ({ block, modelId: resolveModelId(block.block_name) }))
    .filter((x): x is { block: typeof blocks[0]; modelId: string } => x.modelId !== null);
  const skipped = blocks.filter((b) => resolveModelId(b.block_name) === null);

  // Amp+cab combo (scaffolding — currently disabled by default).
  // Factory corpus shows 34/256 presets use a single-DSP topology where
  // the cab is emitted as a sibling `cab0` object referenced via @cab
  // from the amp block, rather than as a separate chain block. That
  // frees a chain position and is the dominant topology for 9-block
  // chains.
  //
  // We're not enabling it by default because the verified-working user
  // export uses split-DSP with the cab as a regular chain block on dsp1,
  // and changing topology mid-stabilization risks new issues. To opt in
  // for a specific recipe, set `useCabSibling: true` on the platform
  // translation's `helix` block (not yet wired through the type system).
  const useAmpCabCombo = false;
  const ampIndex = renderable.findIndex(({ block }) => getBlockType(block.block_category) === 1);
  const cabAfterAmp = useAmpCabCombo && ampIndex !== -1 && ampIndex + 1 < renderable.length
    && getBlockType(renderable[ampIndex + 1].block.block_category) === 2;

  let cabSibling: { block: typeof renderable[0]["block"]; modelId: string } | null = null;
  let chainAfterCabPull = renderable;
  if (cabAfterAmp) {
    cabSibling = renderable[ampIndex + 1];
    chainAfterCabPull = [
      ...renderable.slice(0, ampIndex + 1),
      ...renderable.slice(ampIndex + 2),
    ];
  }

  // Helix LT caps each DSP path at 8 positions (0-7); position 8 is the
  // join. Chains with ≥ 8 blocks split across dsp0 and dsp1 by default.
  //
  // Split-point selection — three layouts, in order of priority:
  //
  // 1. DUAL-MIC CAB (any cab block has cabSibling): split AFTER the AMP.
  //    The amp goes to dsp0 @position 7. Cab + cab0 sibling go to dsp1
  //    starting at @position 0. The amp's @cab: "cab0" reference points
  //    cross-DSP to the cab0 on dsp1. Verified-working topology from a
  //    2026-04-26 user export.
  //
  // 2. STANDARD AMP+CAB (no sibling): split AFTER the CAB. The amp+cab
  //    pair stays together at the end of dsp0 (amp @6, cab @7). Wet
  //    section (delay/reverb/EQ) goes to dsp1.
  //
  // 3. NO CAB IN CHAIN: split AFTER the AMP.
  const ampIdxAfter = chainAfterCabPull.findIndex(({ block }) => getBlockType(block.block_category) === 1);
  const cabIdxAfter = chainAfterCabPull.findIndex(({ block }) => getBlockType(block.block_category) === 2 || getBlockType(block.block_category) === 4);
  const hasDualMicCab = chainAfterCabPull.some(({ block }) => block.cabSibling != null);

  let splitBoundary: number;
  if (hasDualMicCab) {
    // Dual-mic forces split after the amp (cab moves to dsp1 with sibling)
    splitBoundary = ampIdxAfter;
  } else if (cabIdxAfter !== -1) {
    splitBoundary = cabIdxAfter;
  } else {
    splitBoundary = ampIdxAfter;
  }
  const needsSplit = (hasDualMicCab || chainAfterCabPull.length >= 8) && splitBoundary !== -1;

  // Slot blocks into dsp0 and dsp1
  const dsp0Slots: Array<{ block: typeof renderable[0]["block"]; modelId: string; position: number }> = [];
  const dsp1Slots: Array<{ block: typeof renderable[0]["block"]; modelId: string; position: number }> = [];

  if (needsSplit) {
    const dsp0Blocks = chainAfterCabPull.slice(0, splitBoundary + 1);
    const hasCabOnDsp0 = !hasDualMicCab && cabIdxAfter !== -1;
    const ampIdxOnDsp0 = dsp0Blocks.findIndex(({ block }) => getBlockType(block.block_category) === 1);

    for (let i = 0; i < dsp0Blocks.length; i++) {
      const { block, modelId } = dsp0Blocks[i];
      let position = i;
      if (hasCabOnDsp0 && i === splitBoundary) {
        position = 7; // cab pinned to the very end
      } else if (hasCabOnDsp0 && i === ampIdxOnDsp0 && ampIdxOnDsp0 !== splitBoundary) {
        position = 6; // amp right before the cab
      } else if (!hasCabOnDsp0 && i === splitBoundary) {
        position = 7; // amp pinned to end (no cab on dsp0, OR dual-mic case)
      }
      dsp0Slots.push({ block, modelId, position });
    }

    // dsp1 placement. For dual-mic: cab goes at @position 0 (start),
    // sibling cab0 emits alongside it (same position), then post-amp
    // blocks (delay, reverb, EQ) fill remaining positions with the
    // last-two-pinned-to-6-and-7 pattern.
    //
    // For non-dual-mic split (cab on dsp0): dsp1 holds only post-amp
    // blocks. Same last-two-pinned pattern.
    const postBoundary = chainAfterCabPull.slice(splitBoundary + 1);
    for (let i = 0; i < postBoundary.length; i++) {
      const { block, modelId } = postBoundary[i];
      let position: number;
      if (hasDualMicCab && i === 0 && (getBlockType(block.block_category) === 2 || getBlockType(block.block_category) === 4)) {
        position = 0; // dual-mic cab pinned to start of dsp1
      } else if (i === postBoundary.length - 1) {
        position = 7;
      } else if (i === postBoundary.length - 2) {
        position = 6;
      } else {
        position = i;
      }
      dsp1Slots.push({ block, modelId, position });
    }
  } else {
    // Single-DSP linear chain — fits within 8 positions
    for (let i = 0; i < chainAfterCabPull.length; i++) {
      const { block, modelId } = chainAfterCabPull[i];
      dsp0Slots.push({ block, modelId, position: i });
    }
  }

  /**
   * Emit one DSP's blocks. If a cab block in the slot list has
   * `cabSibling` set, promote it to the WithPan variant + emit a
   * sibling `cab0` object on the same DSP. Used for dual-mic cab
   * configurations matching the verified-working Helix LT layout.
   */
  function buildDsp(
    dsp: Record<string, unknown>,
    snapshot: Record<string, boolean>,
    slots: typeof dsp0Slots,
  ): { siblingEmitted: boolean } {
    let siblingEmitted = false;
    let blockIndex = 0;
    for (const slot of slots) {
      const { block, modelId, position } = slot;
      const isCab = getBlockType(block.block_category) === 2;
      const wantsSibling = isCab && block.cabSibling != null;

      // For dual-mic, swap to the WithPan model variant (if available)
      // and emit the in-chain cab as @type: 4 instead of legacy 2.
      let useModelId = modelId;
      let useType: number | null = null;
      if (wantsSibling) {
        const wpId = withPanVariant(modelId);
        if (wpId) {
          useModelId = wpId;
          useType = 4;
        } else {
          console.warn(
            `[generateHelixPreset] cabSibling requested for "${block.block_name}" but no WithPan variant in inventory — falling back to single-mic legacy.`,
          );
        }
      }

      const { entry, isEnabled } = buildBlockEntry(block, useModelId, position, useType ?? undefined);
      dsp[`block${blockIndex}`] = entry;
      snapshot[`block${blockIndex}`] = isEnabled;
      blockIndex++;

      // Emit the cab0 sibling on this DSP if requested + supported
      if (wantsSibling && useType === 4) {
        const siblingFakeBlock = {
          ...block,
          settings: block.cabSibling!,
        };
        // Sibling shares model + position with the in-chain cab
        const { entry: siblingEntry } = buildBlockEntry(
          siblingFakeBlock,
          useModelId,
          position,
          4,
        );
        dsp.cab0 = siblingEntry;
        siblingEmitted = true;
      }
    }
    return { siblingEmitted };
  }

  // Build dsp0
  const dsp0: Record<string, unknown> = makeDspInfrastructure(true);
  const snapshotDsp0: Record<string, boolean> = {};
  const dsp0Cab = buildDsp(dsp0, snapshotDsp0, dsp0Slots);

  // Build dsp1
  const dsp1: Record<string, unknown> = makeDspInfrastructure(false);
  const snapshotDsp1: Record<string, boolean> = {};
  const dsp1Cab = buildDsp(dsp1, snapshotDsp1, dsp1Slots);

  // If we emitted a dual-mic cab on either DSP, the AMP block
  // (wherever it lives) needs `@cab: "cab0"` so HX Edit links the
  // amp's output to the cab pair correctly. Verified from the
  // 2026-04-26 user export.
  const cabSiblingEmitted = dsp0Cab.siblingEmitted || dsp1Cab.siblingEmitted;
  if (cabSiblingEmitted) {
    const ampBlockKey = Object.keys(dsp0).find((k) => {
      const b = dsp0[k] as Record<string, unknown>;
      return b && b["@type"] === 1;
    });
    if (ampBlockKey) {
      (dsp0[ampBlockKey] as Record<string, unknown>)["@cab"] = "cab0";
    }
  }

  // Re-route DSPs when the chain is split: dsp0 → dsp1 → Multi.
  // Otherwise keep dsp0 → Multi (single-DSP topology).
  if (needsSplit) {
    (dsp0.outputA as Record<string, unknown>)["@output"] = 2; // route to dsp1
    (dsp1.inputA as Record<string, unknown>)["@input"] = 0; // receive from dsp0
    (dsp1.outputA as Record<string, unknown>)["@output"] = 1; // Multi out
  }

  // Attach the cab sibling (cab0) when we pulled a cab out of the chain
  // for the amp+cab combo. The amp block on dsp0 needs an @cab reference
  // pointing to the cab0 object on the same dsp.
  if (cabSibling) {
    // Find the amp block in dsp0 (it's the last @type: 1 entry)
    const ampBlockKey = Object.keys(dsp0).find((k) => {
      const b = dsp0[k] as Record<string, unknown>;
      return b && b["@type"] === 1;
    });
    if (ampBlockKey) {
      (dsp0[ampBlockKey] as Record<string, unknown>)["@cab"] = "cab0";
    }
    // Build the cab0 sibling — same buildBlockEntry shape as a chain
    // cab block, but with @position taken from the amp's position
    // (the cab logically occupies the slot right after the amp).
    const ampPosition = ampBlockKey
      ? ((dsp0[ampBlockKey] as Record<string, unknown>)["@position"] as number)
      : 0;
    const { entry: cabEntry } = buildBlockEntry(
      cabSibling.block,
      cabSibling.modelId,
      ampPosition,
    );
    // Cab siblings use @type: 4 (with-pan format) per factory convention
    cabEntry["@type"] = 4;
    dsp0.cab0 = cabEntry;
  }

  // Cursor group = first block if any, empty string if none
  const cursorGroup = dsp0Slots.length > 0 ? "block0" : "";

  // Server-side warning when blocks get dropped. Visible in Vercel
  // runtime logs; helps us spot which recipes need real Helix preset
  // captures so we can add their model IDs to the map.
  if (skipped.length > 0) {
    console.warn(
      `[generateHelixPreset] "${presetName}": skipped ${skipped.length} unverified block(s):`,
      skipped.map((s) => s.block_name).join(", "),
    );
  }

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
    // Only first snapshot gets blocks and controllers
    if (isFirst && blocks.length > 0) {
      // Snapshot bypass map needs entries for both DSP paths when the
      // chain is split. Empty objects are fine when a path has no blocks.
      const blocksMap: Record<string, Record<string, boolean>> = {};
      if (Object.keys(snapshotDsp0).length > 0) blocksMap.dsp0 = snapshotDsp0;
      if (Object.keys(snapshotDsp1).length > 0) blocksMap.dsp1 = snapshotDsp1;
      snap.blocks = blocksMap;
      snap.controllers = {};
    }
    return snap;
  }

  const hlx = {
    data: {
      meta: {
        // Helix display caps preset names at 32 chars. Trim AFTER the
        // slice so we don't ship a name with a trailing space when the
        // 32nd char of the input happens to be a word boundary.
        name: presetName.slice(0, 32).trim(),
        application: "HX Edit",
        // build_sha + appversion captured from a real HX Edit export
        // 2026-04-26. Older values caused HX Edit to refuse to open
        // the preset on Helix LT — this is the firmware version the
        // user's HX Edit is currently running.
        build_sha: "7d01f5e",
        modifieddate: Math.floor(Date.now() / 1000),
        appversion: 58851328,
      },
      device: 2162692, // Helix LT
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
        // controller + footswitch are required top-level keys per a
        // verified HX Edit export. Empty objects mean "no expression
        // pedal or footswitch label assignments" — HX Edit accepts
        // this and lets the user assign them after import.
        controller: {},
        footswitch: {},
        dsp0,
        dsp1,
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
