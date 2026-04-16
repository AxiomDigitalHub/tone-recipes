/**
 * Worship Set Pack Generator
 *
 * Generates a single Helix .hlx preset with 8 snapshots designed to cover
 * an entire worship setlist. Based on analysis of Worship Tutorials, Sunday
 * Shred, and GuitarforHISGLORY presets, plus the Set Patch Strategy research.
 *
 * Signal chain:
 *   Compressor → Klon (Minotaur) → Scream 808 → Essex A30 → 2x12 Blue Bell →
 *   70s Chorus → Transistor Tape (1/4) → Digital Delay (dotted 1/8) →
 *   Plate Reverb → Glitz Reverb
 *
 * Snapshot layout (names match the Helix snapshot LCD — 8 chars max):
 *   1. CLEAN    - Base clean, subtle reverb + quarter note delay
 *   2. DRIVE    - Light overdrive (Klon on), amp pushed slightly
 *   3. DRIVE+   - Medium drive (Klon + 808 stacked)
 *   4. LEAD     - Full drive, mid boost, solo delay
 *   5. CLN AMBI - Clean + big ambient reverb + dotted eighth delay
 *   6. AMB DRV  - Light drive + full ambient effects
 *   7. ROCK     - Heavier crunch for rock-influenced worship songs
 *   8. SWELLS   - Volume swells with max reverb + shimmer + delay
 */

/* ------------------------------------------------------------------ */
/*  Block definitions (the full signal chain)                          */
/* ------------------------------------------------------------------ */

interface BlockDef {
  key: string;           // "block0", "block1", etc.
  model: string;         // Helix model ID
  type: number;          // 0=stomp, 1=amp, 2=cab, 7=time-based
  position: number;      // position on DSP path
  defaultEnabled: boolean;
  defaultParams: Record<string, number | boolean>;
}

const BLOCKS: BlockDef[] = [
  {
    key: "block0",
    model: "HD2_CompressorDeluxeComp",
    type: 0,
    position: 0,
    defaultEnabled: true,
    defaultParams: {
      Threshold: -36, Ratio: 2, Knee: 6, Attack: 0.012,
      Release: 0.1, Mix: 0.74, Level: 0, bypass: false,
    },
  },
  {
    key: "block1",
    model: "HD2_DistMinotaur",
    type: 0,
    position: 1,
    defaultEnabled: false,
    defaultParams: {
      Gain: 0.3, Tone: 0.55, Level: 0.5, bypass: false,
    },
  },
  {
    key: "block2",
    model: "HD2_DistScream808",
    type: 0,
    position: 2,
    defaultEnabled: false,
    defaultParams: {
      Gain: 0.35, Tone: 0.5, Level: 0.5, bypass: false,
    },
  },
  {
    key: "block3",
    model: "HD2_AmpEssexA30",
    type: 1,
    position: 3,
    defaultEnabled: true,
    defaultParams: {
      Drive: 0.35, Bass: 0.5, Mid: 0.55, Treble: 0.6,
      Presence: 0.5, ChVol: 0.6, Master: 1,
      Bias: 0.55, BiasX: 0.5, Sag: 0.5, Hum: 0.5, Ripple: 0.5,
    },
  },
  {
    key: "block4",
    model: "HD2_Cab2x12BlueBell",
    type: 2,
    position: 4,
    defaultEnabled: true,
    defaultParams: {
      Mic: 5, Distance: 1, Position: 0.49,
      LowCut: 19.9, HighCut: 16000,
    },
  },
  {
    key: "block5",
    model: "HD2_Chorus70sChorus",
    type: 7,
    position: 5,
    defaultEnabled: false,
    defaultParams: {
      Speed: 0.3, Depth: 0.4, Mix: 0.35, Level: 0,
      Predelay: 0, TempoSync1: 0, bypass: false,
    },
  },
  {
    key: "block6",
    model: "HD2_DelayTransistorTape",
    type: 7,
    position: 6,
    defaultEnabled: true,
    defaultParams: {
      Time: 0.5, Feedback: 0.35, Mix: 0.25, Level: 0,
      Headroom: 0, Flutter: 0.3, WowFlutter: 0.15,
      TempoSync1: 0, bypass: false,
    },
  },
  {
    key: "block7",
    model: "HD2_DelayVintageDigitalV2",
    type: 7,
    position: 7,
    defaultEnabled: false,
    defaultParams: {
      Time: 0.375, Feedback: 0.4, Mix: 0.3, Level: 0,
      Modulation: 0, TempoSync1: 0, bypass: false,
    },
  },
  {
    key: "block8",
    model: "HD2_ReverbPlate",
    type: 7,
    position: 8,
    defaultEnabled: true,
    defaultParams: {
      Decay: 0.43, Mix: 0.23, Predelay: 0.07,
      LowCut: 125, HighCut: 6500, Level: 0, bypass: false,
    },
  },
  {
    key: "block9",
    model: "HD2_ReverbGlitz",
    type: 7,
    position: 9,
    defaultEnabled: false,
    defaultParams: {
      Decay: 0.7, Mix: 0.4, Predelay: 0.05,
      LowCut: 200, HighCut: 5000, Level: 0, bypass: false,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Snapshot definitions                                               */
/* ------------------------------------------------------------------ */

interface SnapshotDef {
  name: string;
  ledColor: number;
  blockOverrides: Record<string, {
    enabled: boolean;
    params?: Record<string, number | boolean>;
  }>;
}

const SNAPSHOTS: SnapshotDef[] = [
  {
    name: "CLEAN",
    ledColor: 2, // green
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: false },   // Klon off
      block2: { enabled: false },   // 808 off
      block3: { enabled: true, params: { Drive: 0.30, ChVol: 0.6 } },
      block4: { enabled: true },
      block5: { enabled: false },   // Chorus off
      block6: { enabled: true, params: { Mix: 0.2 } },   // Quarter note delay subtle
      block7: { enabled: false },   // Dotted eighth off
      block8: { enabled: true, params: { Mix: 0.2 } },   // Plate subtle
      block9: { enabled: false },   // Glitz off
    },
  },
  {
    name: "DRIVE",
    ledColor: 4, // yellow
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: true, params: { Gain: 0.3 } },   // Klon ON low gain
      block2: { enabled: false },
      block3: { enabled: true, params: { Drive: 0.40, ChVol: 0.62 } }, // Amp pushed slightly
      block4: { enabled: true },
      block5: { enabled: false },
      block6: { enabled: true, params: { Mix: 0.22 } },
      block7: { enabled: false },
      block8: { enabled: true, params: { Mix: 0.23 } },
      block9: { enabled: false },
    },
  },
  {
    name: "DRIVE+",
    ledColor: 6, // orange
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: true, params: { Gain: 0.35 } },  // Klon ON
      block2: { enabled: true, params: { Gain: 0.3 } },   // 808 stacked ON
      block3: { enabled: true, params: { Drive: 0.45, ChVol: 0.64 } },
      block4: { enabled: true },
      block5: { enabled: false },
      block6: { enabled: true, params: { Mix: 0.22 } },
      block7: { enabled: false },
      block8: { enabled: true, params: { Mix: 0.25 } },
      block9: { enabled: false },
    },
  },
  {
    name: "LEAD",
    ledColor: 8, // red
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: true, params: { Gain: 0.4, Level: 0.6 } }, // Klon hotter + level boost
      block2: { enabled: true, params: { Gain: 0.35 } },
      block3: { enabled: true, params: { Drive: 0.50, ChVol: 0.68 } },
      block4: { enabled: true },
      block5: { enabled: false },
      block6: { enabled: true, params: { Mix: 0.25, Feedback: 0.4 } }, // More delay for lead
      block7: { enabled: true, params: { Mix: 0.2 } },  // Dotted eighth adds space
      block8: { enabled: true, params: { Mix: 0.28 } },
      block9: { enabled: false },
    },
  },
  {
    name: "CLN AMBI",
    ledColor: 1, // blue
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: false },
      block2: { enabled: false },
      block3: { enabled: true, params: { Drive: 0.28, ChVol: 0.58 } }, // Extra clean
      block4: { enabled: true },
      block5: { enabled: true, params: { Mix: 0.3 } },   // Chorus ON
      block6: { enabled: true, params: { Mix: 0.2 } },
      block7: { enabled: true, params: { Mix: 0.35, Feedback: 0.45 } }, // Big dotted eighth
      block8: { enabled: true, params: { Mix: 0.3, Decay: 0.55 } },
      block9: { enabled: true, params: { Mix: 0.35, Decay: 0.7 } },    // Glitz ON
    },
  },
  {
    name: "AMB DRV",
    ledColor: 3, // cyan
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: true, params: { Gain: 0.3 } },
      block2: { enabled: false },
      block3: { enabled: true, params: { Drive: 0.38, ChVol: 0.62 } },
      block4: { enabled: true },
      block5: { enabled: true, params: { Mix: 0.25 } },
      block6: { enabled: true, params: { Mix: 0.22 } },
      block7: { enabled: true, params: { Mix: 0.3, Feedback: 0.4 } },
      block8: { enabled: true, params: { Mix: 0.28, Decay: 0.5 } },
      block9: { enabled: true, params: { Mix: 0.3, Decay: 0.65 } },
    },
  },
  {
    name: "ROCK",
    ledColor: 7, // purple
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: true, params: { Gain: 0.45, Level: 0.55 } },
      block2: { enabled: true, params: { Gain: 0.4 } },
      block3: { enabled: true, params: { Drive: 0.55, ChVol: 0.65 } }, // Push the AC30 harder
      block4: { enabled: true },
      block5: { enabled: false },
      block6: { enabled: true, params: { Mix: 0.18 } },  // Subtle delay
      block7: { enabled: false },
      block8: { enabled: true, params: { Mix: 0.2 } },
      block9: { enabled: false },
    },
  },
  {
    name: "SWELLS",
    ledColor: 5, // white/light blue
    blockOverrides: {
      block0: { enabled: true },
      block1: { enabled: false },
      block2: { enabled: false },
      block3: { enabled: true, params: { Drive: 0.25, ChVol: 0.55 } }, // Very clean
      block4: { enabled: true },
      block5: { enabled: true, params: { Mix: 0.4 } },   // Lush chorus
      block6: { enabled: true, params: { Mix: 0.3, Feedback: 0.5 } },  // Big delay
      block7: { enabled: true, params: { Mix: 0.4, Feedback: 0.5 } },  // Big dotted eighth
      block8: { enabled: true, params: { Mix: 0.4, Decay: 0.7 } },     // Max plate
      block9: { enabled: true, params: { Mix: 0.5, Decay: 0.85 } },    // Glitz full shimmer
    },
  },
];

/* ------------------------------------------------------------------ */
/*  DT / Powercab / Infrastructure (same as generate-hlx.ts)           */
/* ------------------------------------------------------------------ */

const DT_SECTION = {
  "@dt_topology": 0, "@dt_tubeconfig": 0, "@model": "@dt",
  "@dt_channel": 0, "@dt_reverb": true, "@dt_poweramp": 1,
  "@dt_12ax7boost": 0, "@dt_bplusvoltage": 0, "@dt_feedbackcap": 0, "@dt_revmix": 0.25,
};

const POWERCAB_SECTION = {
  "@model": "@powercab", "@powercab_color": 0, "@powercab_mic": 0,
  "@powercab_flatlevel": 0, "@powercab_irlevel": -18, "@powercab_hicut": 20100,
  "@powercab_lowcut": 19.9, "@powercab_distance": 3, "@powercab_speakerlevel": -15,
  "@powercab_userir": 0, "@powercab_speaker": 0,
};

function makeDspInfrastructure(isPath1: boolean) {
  return {
    inputA: {
      "@input": isPath1 ? 1 : 0,
      "@model": "HD2_AppDSPFlow1Input",
      noiseGate: false, decay: 0.5, threshold: -48,
    },
    inputB: {
      "@input": 0, "@model": "HD2_AppDSPFlow2Input",
      noiseGate: false, decay: 0.5, threshold: -48,
    },
    outputA: { "@model": "HD2_AppDSPFlowOutput", "@output": isPath1 ? 1 : 0, pan: 0.5, gain: 0 },
    outputB: { "@model": "HD2_AppDSPFlowOutput", "@output": 0, pan: 0.5, gain: 0 },
    split: {
      "@model": "HD2_AppDSPFlowSplitY", "@position": 0, "@enabled": true,
      "@no_snapshot_bypass": false, BalanceA: 0.5, BalanceB: 0.5, bypass: false,
    },
    join: {
      "@model": "HD2_AppDSPFlowJoin", "@position": 10, "@enabled": true,
      "@no_snapshot_bypass": false, "A Level": 0, "B Level": 0,
      "A Pan": 0, "B Pan": 1, "B Polarity": false, Level: 0,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Generator                                                          */
/* ------------------------------------------------------------------ */

export function generateWorshipSetPack(presetName: string = "FK Worship"): string {
  // Build DSP0 with all blocks
  const dsp0: Record<string, unknown> = makeDspInfrastructure(true);

  for (const block of BLOCKS) {
    const entry: Record<string, unknown> = {
      "@model": block.model,
      "@position": block.position,
      "@enabled": block.defaultEnabled,
      "@path": 0,
      "@type": block.type,
      "@no_snapshot_bypass": false,
    };

    if (block.type === 0 || block.type === 7) entry["@stereo"] = false;
    if (block.type === 1) entry["@bypassvolume"] = 1;
    if (block.type === 7) entry["@trails"] = true;

    for (const [key, value] of Object.entries(block.defaultParams)) {
      if (key === "bypass") continue; // bypass is not a param, it's enable state
      entry[key] = typeof value === "number" ? parseFloat(value.toFixed(6)) : value;
    }

    dsp0[block.key] = entry;
  }

  // Build snapshots
  function makeSnapshot(snapDef: SnapshotDef, index: number) {
    const snap: Record<string, unknown> = {
      "@name": snapDef.name,
      "@tempo": 120,
      "@valid": true,  // ALL snapshots are valid in a set pack
      "@pedalstate": 2,
      "@ledcolor": snapDef.ledColor,
      "@custom_name": true,
    };

    // Block enable/disable states for this snapshot
    const blockStates: Record<string, Record<string, unknown>> = {};

    for (const block of BLOCKS) {
      const override = snapDef.blockOverrides[block.key];
      if (!override) continue;

      const blockSnap: Record<string, unknown> = {
        "@enabled": override.enabled,
      };

      // Add param overrides if any
      if (override.params) {
        for (const [key, value] of Object.entries(override.params)) {
          blockSnap[key] = typeof value === "number" ? parseFloat(value.toFixed(6)) : value;
        }
      }

      blockStates[block.key] = blockSnap;
    }

    snap.blocks = { dsp0: blockStates };
    snap.controllers = {};

    return snap;
  }

  const hlx = {
    data: {
      meta: {
        name: presetName.slice(0, 32),
        application: "HX Edit",
        build_sha: "39f7f9a",
        modifieddate: Math.floor(Date.now() / 1000),
        appversion: 58785792,
      },
      device: 2162692,
      tone: {
        variax: {
          "@model": "@variax", "@variax_model": 0, "@variax_magmode": true,
          "@variax_customtuning": false, "@variax_lockctrls": 0,
          "@variax_str1tuning": 0, "@variax_str2tuning": 0,
          "@variax_str3tuning": 0, "@variax_str4tuning": 0,
          "@variax_str5tuning": 0, "@variax_str6tuning": 0,
          "@variax_str1level": 1, "@variax_str2level": 1,
          "@variax_str3level": 1, "@variax_str4level": 1,
          "@variax_str5level": 1, "@variax_str6level": 1,
          "@variax_toneknob": -0.1, "@variax_volumeknob": -0.1,
        },
        dtdual: { ...DT_SECTION },
        dt0: { ...DT_SECTION },
        dt1: { ...DT_SECTION },
        powercabdual: { ...POWERCAB_SECTION },
        powercab0: { ...POWERCAB_SECTION },
        powercab1: { ...POWERCAB_SECTION },
        global: {
          "@model": "@global_params",
          "@topology0": "A", "@topology1": "A",
          "@cursor_dsp": 0, "@cursor_path": 0,
          "@cursor_position": 0, "@cursor_group": "block0",
          "@current_snapshot": 0, "@tempo": 120,
          "@pedalstate": 2, "@guitarpad": 0, "@guitarinputZ": 0,
          "@DtSelect": 2, "@PowercabMode": 0,
          "@PowercabSelect": 2, "@PowercabVoicing": 0,
        },
        snapshot0: makeSnapshot(SNAPSHOTS[0], 0),
        snapshot1: makeSnapshot(SNAPSHOTS[1], 1),
        snapshot2: makeSnapshot(SNAPSHOTS[2], 2),
        snapshot3: makeSnapshot(SNAPSHOTS[3], 3),
        snapshot4: makeSnapshot(SNAPSHOTS[4], 4),
        snapshot5: makeSnapshot(SNAPSHOTS[5], 5),
        snapshot6: makeSnapshot(SNAPSHOTS[6], 6),
        snapshot7: makeSnapshot(SNAPSHOTS[7], 7),
        dsp0,
        dsp1: makeDspInfrastructure(false),
      },
    },
    meta: { original: 0, pbn: 0, premium: 0 },
    schema: "L6Preset" as const,
    version: 6,
  };

  return JSON.stringify(hlx, null, 2);
}

/** Snapshot names for the Setlist Mapper */
export const WORSHIP_SNAPSHOTS = SNAPSHOTS.map((s) => s.name);

/** Block names for documentation */
export const WORSHIP_CHAIN = [
  "Deluxe Comp", "Minotaur (Klon)", "Scream 808",
  "Essex A30 (AC30)", "2x12 Blue Bell", "70s Chorus",
  "Transistor Tape Delay (1/4)", "Vintage Digital Delay (dotted 1/8)",
  "Plate Reverb", "Glitz Reverb (Shimmer)",
];
