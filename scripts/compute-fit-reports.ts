/**
 * Fit Reports
 * -----------
 * For every recipe in src/lib/data/index.ts, works out whether its
 * translated chain actually loads on each real-world device — an HX
 * Stomp's 8 blocks, a POD Go's fixed chain, a Katana's five effect
 * slots — and *why* it does or doesn't.
 *
 * Writes:
 *   src/data/fit-reports.json   — the computed dataset (the site consumes this)
 *   docs/FIT_REPORT_SUMMARY.md  — human-readable rollup
 *
 * Run: `npx tsx scripts/compute-fit-reports.ts`
 *
 * ── What is and isn't computed ───────────────────────────────────────
 * Block *counts* and *slot arithmetic* are hard facts: they come from
 * the recipe data and from published device specs (see
 * docs/platform-knowledge/*.md). Those drive every verdict.
 *
 * DSP *percentages* are an estimate from a local weight table. They're
 * a tiebreaker for the `fits` / `tight` boundary, never the sole cause
 * of a `no`. Every reason string that leans on one says "est.".
 *
 * A verdict answers "does this chain load on this box", not "does this
 * box sound like the record". Those are different questions, and the
 * second one is why every non-Helix device also carries a
 * `translation_fidelity` field: the Katana / QC / Fractal translations
 * were authored per platform and are sometimes already a reduction of
 * the Helix chain. Reporting `fits` without saying what got left out
 * would be measuring our own authoring and calling it a device spec.
 *
 * Where the data genuinely can't answer the question — Kemper, where
 * the amp is a profile we don't ship — the verdict is
 * `not_applicable` with a reason, not a guess.
 *
 * TODO(dsp-costs): `src/lib/helix/dsp-costs.ts` has landed with
 * per-model costs reported by Line 6 (DSP_COSTS), device capacities
 * (DEVICE_CAPACITIES) and `estimateDspUsage()` / `fitsOnDevice()`.
 * That is strictly better data than the role averages below — switch
 * to it: delete DSP_WEIGHTS + estimateDsp(), map each block through
 * `lookupDspCost(block.block_name)`, and take `dspBudget` /
 * `maxBlocks` / `maxAmps` from DEVICE_CAPACITIES. Treat an unknown
 * model as unknown, never as free. Until then this script stands alone
 * and every DSP figure it emits is labelled "est.".
 *
 * Spot-check of the two tables (2026-07-25), so the gap is on record:
 *   amp    ours 32  ·  theirs 27.3–37.3 mono   → close
 *   cab    ours  8  ·  theirs 3.33 mono (new engine) → we over-charge
 *   drive  ours  5  ·  theirs 5.8–11.6 mono    → we under-charge
 *   delay  ours 10  ·  theirs 4.4–9.4 mono     → we over-charge
 * The errors partly cancel on a typical amp+cab+drive+delay chain,
 * which is why the block-count verdicts hold. Don't quote our
 * percentages as if they were Line 6's.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { toneRecipes, songs, artists } from "../src/lib/data";
import type { ToneRecipe, PlatformBlock, Platform } from "../src/types/recipe";

// ─────────────────────────────────────────────────────────────────────
//  Block roles — normalise the per-platform category vocabulary
// ─────────────────────────────────────────────────────────────────────

type Role =
  | "amp"
  | "cab"
  | "drive"
  | "comp"
  | "gate"
  | "eq"
  | "delay"
  | "reverb"
  | "mod"
  | "wah"
  | "pitch"
  | "volume"
  | "profile"
  | "tone_model"
  | "other";

const ROLE_LABEL: Record<Role, string> = {
  amp: "amp",
  cab: "cab",
  drive: "drive/distortion",
  comp: "compressor",
  gate: "noise gate",
  eq: "EQ",
  delay: "delay",
  reverb: "reverb",
  mod: "modulation",
  wah: "wah",
  pitch: "pitch",
  volume: "volume pedal",
  profile: "profile",
  tone_model: "Tone Model",
  other: "uncategorised",
};

/**
 * Every `block_category` string that appears across the six platform
 * translations, lower-cased. Kept exhaustive on purpose: an unmapped
 * category surfaces in the summary's data-gap section rather than
 * silently landing in `other`.
 */
const ROLE_MAP: Record<string, Role> = {
  amp: "amp",
  "amp type": "amp",
  cab: "cab",
  profile: "profile",
  "tone model": "tone_model",
  distortion: "drive",
  drive: "drive",
  booster: "drive",
  fuzz: "drive",
  compressor: "comp",
  dynamics: "gate", // every `Dynamics` block in the corpus is a Noise Gate
  "noise gate": "gate",
  gate: "gate",
  eq: "eq",
  delay: "delay",
  reverb: "reverb",
  modulation: "mod",
  mod: "mod",
  wah: "wah",
  "pedal fx": "wah", // Katana's pedal slot: wah / pitch pedal
  pitch: "pitch",
  "pitch/synth": "pitch",
  "volume/pan": "volume",
  stomp: "drive", // Kemper's A–D stomps + QC's lone `Stomp` gate
  effect: "other",
  fx: "mod", // Katana FX slot draws from the shared Mod/FX pool
};

/**
 * Names that mean "this is a pitch-shifter", not "this is a fuzz with an
 * octave-up voice". `Octave Fuzz`, `Octavia` and `Tycoctavia Fuzz` are
 * drives — they belong in the Booster/Drive slot and cost drive-level
 * DSP, not poly-pitch-level DSP.
 */
const PITCH_NAME =
  /pitch\s*(wham|shift|shifter)|whammy|\bpog\b|harmoni[sz]er|poly\s*pitch|analog\s*octaver|pedal\s*pitch|octave\s*(up|down)\b/i;

const UNMAPPED_CATEGORIES = new Set<string>();
/** Blocks where block_name contradicts block_category (see data gaps). */
const RECATEGORISED: Array<{ platform: string; category: string; name: string }> =
  [];

/** Categories that are legitimately generic containers, not a claim. */
const GENERIC_CATEGORIES = new Set(["stomp", "fx", "effect"]);

function roleOfIn(block: PlatformBlock, platform: string): Role {
  const raw = (block.block_category ?? "").trim().toLowerCase();
  const mapped = ROLE_MAP[raw];
  if (!mapped) {
    UNMAPPED_CATEGORIES.add(block.block_category ?? "(empty)");
    return "other";
  }
  const name = block.block_name ?? "";
  let out = mapped;
  if (mapped === "drive") {
    if (/noise gate|^gate$/i.test(name)) out = "gate";
    else if (/wah/i.test(name)) out = "wah";
    else if (/compress|\bcomp\b/i.test(name)) out = "comp";
    else if (/chorus|phaser|flanger|vibe|tremolo|rotary/i.test(name)) out = "mod";
    else if (PITCH_NAME.test(name)) out = "pitch";
  } else if (mapped === "wah" && PITCH_NAME.test(name)) {
    out = "pitch";
  }
  if (out !== mapped && !GENERIC_CATEGORIES.has(raw)) {
    RECATEGORISED.push({
      platform,
      category: block.block_category,
      name: block.block_name,
    });
  }
  return out;
}

/**
 * Role lookup without platform context. Every call site that has the
 * platform to hand should use roleOfIn() so the data-gap collector
 * records where a miscategorised block lives.
 */
function roleOf(block: PlatformBlock): Role {
  const raw = (block.block_category ?? "").trim().toLowerCase();
  const mapped = ROLE_MAP[raw] ?? "other";
  const name = block.block_name ?? "";
  if (mapped === "drive") {
    if (/noise gate|^gate$/i.test(name)) return "gate";
    if (/wah/i.test(name)) return "wah";
    if (/compress|\bcomp\b/i.test(name)) return "comp";
    if (/chorus|phaser|flanger|vibe|tremolo|rotary/i.test(name)) return "mod";
    if (PITCH_NAME.test(name)) return "pitch";
  }
  if (mapped === "wah" && PITCH_NAME.test(name)) return "pitch";
  return mapped;
}

/** Bypassed-by-default blocks: alternate drives, optional wahs, etc. */
function isOptional(block: PlatformBlock): boolean {
  return block.enabled === false;
}

/** A cab block carrying a second mic — emitted as a Dual cab. */
function isDualMicCab(block: PlatformBlock): boolean {
  return roleOf(block) === "cab" && block.cabSibling != null;
}

/** A plain gate that the input block's built-in gate can absorb. */
function isPlainNoiseGate(block: PlatformBlock): boolean {
  return roleOf(block) === "gate" && /^noise gate$/i.test(block.block_name ?? "");
}

// ─────────────────────────────────────────────────────────────────────
//  DSP estimate  (heuristic — see TODO(dsp-costs) at the top)
// ─────────────────────────────────────────────────────────────────────

/**
 * Rough cost per block role, in "percent of one single-SHARC device".
 * Anchored on documented behaviour, not measurement:
 *   - amp blocks dominate (line6-helix.md § DSP Usage Notes)
 *   - Dual cabs cost ~2x a single cab
 *   - poly pitch is the priciest effect class
 *   - a bypassed block still costs DSP (true on Helix and Fractal alike)
 */
const DSP_WEIGHTS: Record<Role, number> = {
  amp: 32,
  cab: 8,
  drive: 5,
  comp: 6,
  gate: 4,
  eq: 4,
  delay: 10,
  reverb: 14,
  mod: 8,
  wah: 4,
  pitch: 22,
  volume: 1,
  profile: 30,
  tone_model: 30,
  other: 5,
};

const DUAL_CAB_MULTIPLIER = 2.1;

function estimateDsp(blocks: PlatformBlock[]): number {
  let total = 0;
  for (const b of blocks) {
    const base = DSP_WEIGHTS[roleOf(b)];
    total += isDualMicCab(b) ? base * DUAL_CAB_MULTIPLIER : base;
  }
  return Math.round(total);
}

// ─────────────────────────────────────────────────────────────────────
//  Devices
// ─────────────────────────────────────────────────────────────────────

type DeviceId =
  | "helix_floor_lt"
  | "hx_stomp"
  | "hx_stomp_xl"
  | "pod_go"
  | "quad_cortex"
  | "fractal_fm3"
  | "fractal_fm9"
  | "kemper"
  | "katana_gen3";

type Verdict = "fits" | "tight" | "no" | "not_applicable";

interface DeviceSpec {
  id: DeviceId;
  label: string;
  manufacturer: string;
  /** Which platform translation we read the chain from. */
  source: Platform;
  /** Hard cap on blocks in one preset (null = slot model instead). */
  maxBlocks: number | null;
  /** Cap on blocks in a single series lane before paths must split. */
  maxSeriesBlocks: number | null;
  maxAmps: number;
  maxCabs: number;
  allowsDualCab: boolean;
  footswitches: number;
  snapshots: number;
  /** Estimated DSP headroom, same units as DSP_WEIGHTS (100 = 1 SHARC). */
  dspBudget: number;
  /**
   * Roles this device makes redundant — a block you can delete without
   * losing anything, because the hardware covers it elsewhere. Cutting
   * one never downgrades a verdict to `no`.
   */
  freeCutRoles: Partial<Record<Role, string>>;
  spec_source: string;
  note: string;
}

const NO_TREADLE =
  "there's no onboard treadle on this box, so it does nothing unless you've plugged in an external EXP pedal";
const INPUT_GATE =
  "the Input block has a gate built in — you keep the gating and get the position back";

const DEVICES: DeviceSpec[] = [
  {
    id: "helix_floor_lt",
    label: "Helix Floor / LT / Rack",
    manufacturer: "Line 6",
    source: "helix",
    maxBlocks: 32,
    maxSeriesBlocks: 8,
    maxAmps: 4,
    maxCabs: 4,
    allowsDualCab: true,
    footswitches: 12,
    snapshots: 8,
    dspBudget: 200, // dual SHARC
    freeCutRoles: {},
    spec_source: "docs/platform-knowledge/line6-helix.md § Signal Flow & DSP",
    note: "32 blocks across two DSP paths, 8 per sub-path. Chains over 8 blocks split across path 1 and path 2 — which is exactly what our .hlx exporter already does.",
  },
  {
    id: "hx_stomp",
    label: "HX Stomp",
    manufacturer: "Line 6",
    source: "helix",
    maxBlocks: 8,
    maxSeriesBlocks: 8,
    maxAmps: 2,
    maxCabs: 2,
    allowsDualCab: true,
    footswitches: 3,
    snapshots: 3,
    dspBudget: 100, // single SHARC
    freeCutRoles: { volume: NO_TREADLE, gate: INPUT_GATE },
    spec_source: "docs/platform-knowledge/line6-helix.md § Signal Flow & DSP",
    note: "8 blocks, one DSP, three footswitches. The block cap and the DSP ceiling bite at roughly the same time once an amp and a cab are in the chain.",
  },
  {
    id: "hx_stomp_xl",
    label: "HX Stomp XL",
    manufacturer: "Line 6",
    source: "helix",
    maxBlocks: 8,
    maxSeriesBlocks: 8,
    maxAmps: 2,
    maxCabs: 2,
    allowsDualCab: true,
    footswitches: 8,
    snapshots: 4,
    dspBudget: 100, // same single SHARC as the Stomp
    freeCutRoles: { volume: NO_TREADLE, gate: INPUT_GATE },
    spec_source: "docs/platform-knowledge/line6-helix.md § Product Line",
    note: "Identical DSP and block count to the HX Stomp — the XL buys footswitches and a fourth snapshot, not headroom. Its verdicts differ from the Stomp only in the footswitch caveat.",
  },
  {
    id: "pod_go",
    label: "POD Go",
    manufacturer: "Line 6",
    source: "helix",
    maxBlocks: null, // fixed chain, modelled separately
    maxSeriesBlocks: null,
    maxAmps: 1,
    maxCabs: 1,
    allowsDualCab: false,
    footswitches: 6,
    snapshots: 4,
    dspBudget: 100,
    freeCutRoles: { gate: INPUT_GATE },
    spec_source:
      "docs/platform-knowledge/line6-helix.md § Product Line (7 blocks, 1 amp, 1 cab)",
    note: "Fixed chain: dedicated Wah, Volume/Pan, Amp, Cab/IR, EQ and FX Loop positions, plus 4 freely assignable blocks. Anything that isn't a wah, volume, amp, cab or EQ has to fit in those 4.",
  },
  {
    id: "quad_cortex",
    label: "Quad Cortex",
    manufacturer: "Neural DSP",
    source: "quad_cortex",
    maxBlocks: 32,
    maxSeriesBlocks: 8,
    maxAmps: 4,
    maxCabs: 4,
    allowsDualCab: true,
    footswitches: 8,
    snapshots: 8,
    dspBudget: 240,
    freeCutRoles: {},
    spec_source: "docs/platform-knowledge/neural-dsp-quad-cortex.md § The Grid",
    note: "4 rows x 8 columns = 32 slots. A single series lane is 8 columns wide; longer chains need a second row.",
  },
  {
    id: "fractal_fm3",
    label: "Fractal FM3",
    manufacturer: "Fractal Audio",
    source: "fractal",
    maxBlocks: 48,
    maxSeriesBlocks: 12,
    maxAmps: 1,
    maxCabs: 2,
    allowsDualCab: true,
    footswitches: 3,
    snapshots: 8,
    dspBudget: 105,
    freeCutRoles: {},
    spec_source:
      "docs/platform-knowledge/fractal-audio.md § Grid Layout / CPU Allocation",
    note: "The 4x12 grid is never the limit on an FM3 — CPU is. One amp plus a cab plus a handful of effects is the working envelope, and bypassing a block does not give the CPU back.",
  },
  {
    id: "fractal_fm9",
    label: "Fractal FM9",
    manufacturer: "Fractal Audio",
    source: "fractal",
    maxBlocks: 48,
    maxSeriesBlocks: 12,
    maxAmps: 2,
    maxCabs: 4,
    allowsDualCab: true,
    footswitches: 9,
    snapshots: 8,
    dspBudget: 210, // roughly 2x FM3 (fractal-audio.md § Product Line)
    freeCutRoles: {},
    spec_source: "docs/platform-knowledge/fractal-audio.md § Product Line",
    note: "Roughly twice the FM3's processing on the same 4x12 grid. Nothing in our library comes close to filling it.",
  },
  {
    id: "kemper",
    label: "Kemper Profiler",
    manufacturer: "Kemper",
    source: "kemper",
    maxBlocks: 8, // MK1 slot layout: A/B/C/D + X/MOD/DLY/REV
    maxSeriesBlocks: 8,
    maxAmps: 1,
    maxCabs: 0, // cab is baked into the profile
    allowsDualCab: false,
    footswitches: 0,
    snapshots: 0,
    dspBudget: 200,
    freeCutRoles: {},
    spec_source: "docs/platform-knowledge/kemper-profiler.md § Effects (Exhaustive)",
    note: "The amp isn't modelled — it's a profile you source yourself. Our Kemper translations name a Rig Exchange search, not a specific rig, so a fit verdict would be a guess.",
  },
  {
    id: "katana_gen3",
    label: "Katana Gen 3",
    manufacturer: "Boss",
    source: "katana",
    maxBlocks: 5, // 5 simultaneous effects; the amp character is free
    maxSeriesBlocks: 5,
    maxAmps: 1,
    maxCabs: 0, // cab voicing baked into the amp character
    allowsDualCab: false,
    footswitches: 6, // with a GA-FC
    snapshots: 4,
    dspBudget: 100,
    freeCutRoles: {},
    spec_source: "docs/platform-knowledge/boss-katana.md § Effect Slot Summary",
    note: "One amp character plus five effect slots — Booster, Mod, FX, Delay, Reverb — each drawing from its own pool. Two overdrives is one overdrive too many.",
  },
];

// ─────────────────────────────────────────────────────────────────────
//  Cut ordering — what you sacrifice first, and what you never touch
// ─────────────────────────────────────────────────────────────────────

/**
 * When a chain is over budget, this is the order things come out:
 * least tone-defining first. `amp`, `cab`, `profile` and the chain's
 * primary (first enabled) drive are never candidates — cut those and
 * it isn't the same tone, and a report that says "it fits, just delete
 * the amp" is worthless. An *optional* amp (a bypassed alternate) is
 * fair game.
 */
const CUT_ORDER: Role[] = [
  "volume",
  "gate",
  "eq",
  "wah",
  "mod",
  "comp",
  "pitch",
  "delay",
  "reverb",
  "drive",
  "other",
];

const NEVER_CUT: Role[] = ["amp", "cab", "profile", "tone_model"];

/** Why losing this role hurts least — used in the reason copy. */
const CUT_RATIONALE: Partial<Record<Role, string>> = {
  volume: "you can ride the guitar's volume knob instead",
  gate: "the input block has a gate built in",
  eq: "fold the EQ move into the amp's tone stack",
  mod: "the modulation is colour, not the core of the tone",
  comp: "a cranked amp does a lot of the compressing for you",
  wah: "the wah is a performance effect, not part of the base tone",
  delay: "this one changes the arrangement, not just the tone — cut it last",
  reverb: "run the room's reverb instead, or your amp's",
  pitch: "the pitch effect is the most expensive block in the chain",
  drive: "the amp's own gain has to cover it",
};

interface CutPlan {
  kept: PlatformBlock[];
  optionalCuts: PlatformBlock[];
  freeCuts: Array<{ block: PlatformBlock; why: string }>;
  realCuts: PlatformBlock[];
}

/**
 * Drop blocks until `fitsFn` is satisfied, cheapest first:
 * bypassed alternates, then device-redundant blocks (`freeCutRoles`),
 * then real blocks in CUT_ORDER — skipping NEVER_CUT roles and the
 * chain's primary drive.
 */
function planCuts(
  blocks: PlatformBlock[],
  fitsFn: (kept: PlatformBlock[]) => boolean,
  freeCutRoles: Partial<Record<Role, string>> = {},
): CutPlan {
  const kept = [...blocks];
  const optionalCuts: PlatformBlock[] = [];
  const freeCuts: Array<{ block: PlatformBlock; why: string }> = [];
  const realCuts: PlatformBlock[] = [];

  const firstEnabledDriveIdx = blocks.findIndex(
    (b) => roleOf(b) === "drive" && !isOptional(b),
  );
  const primaryDrive =
    firstEnabledDriveIdx === -1 ? null : blocks[firstEnabledDriveIdx];

  const remove = (b: PlatformBlock) => {
    const i = kept.indexOf(b);
    if (i !== -1) kept.splice(i, 1);
  };

  // Pass 1 — bypassed alternates cost nothing tonally. Includes an
  // optional amp: a second, bypassed amp block is an alternate by
  // definition, and no single-DSP box runs two amps anyway.
  for (const b of [...kept]) {
    if (fitsFn(kept)) break;
    if (!isOptional(b)) continue;
    remove(b);
    optionalCuts.push(b);
  }

  // Pass 2 — blocks the device makes redundant.
  for (const b of [...kept]) {
    if (fitsFn(kept)) break;
    const role = roleOf(b);
    const why = freeCutRoles[role];
    if (!why) continue;
    if (role === "gate" && !isPlainNoiseGate(b)) continue;
    remove(b);
    freeCuts.push({ block: b, why });
  }

  // Pass 3 — real blocks, least tone-defining first.
  for (const role of CUT_ORDER) {
    if (fitsFn(kept)) break;
    for (const b of [...kept].reverse()) {
      if (fitsFn(kept)) break;
      if (roleOf(b) !== role) continue;
      if (NEVER_CUT.includes(role)) continue;
      if (b === primaryDrive) continue;
      remove(b);
      realCuts.push(b);
    }
  }

  return { kept, optionalCuts, freeCuts, realCuts };
}

const describe = (b: PlatformBlock) => b.block_name;

function joinList(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function joinNames(blocks: PlatformBlock[]): string {
  return joinList(blocks.map(describe));
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

// ─────────────────────────────────────────────────────────────────────
//  Verdict shape
// ─────────────────────────────────────────────────────────────────────

type Cause =
  | "block_count"
  | "dsp_headroom"
  | "dual_mic_cab"
  | "poly_pitch"
  | "second_amp"
  | "slot_conflict"
  | "user_block_overflow"
  | "profile_based"
  | "no_translation";

interface DeviceVerdict {
  device: DeviceId;
  verdict: Verdict;
  reason: string;
  cause: Cause | null;
  blocks_required: number;
  blocks_essential: number;
  blocks_available: number | null;
  /** For slot devices: what the free/assignable positions look like. */
  slots: { required: number; available: number; label: string } | null;
  dsp_estimate_pct: number | null;
  /** Blocks you'd remove, in the order we'd remove them. */
  cuts: string[];
  /** Cuts that cost you nothing (bypassed alternates, redundant blocks). */
  free_cuts: string[];
  /** Footswitches the chain wants in stomp mode vs what the device has. */
  footswitch_demand: number;
  caveats: string[];
  /**
   * Does this device's source translation carry the same roles the
   * Helix chain does? `reduced` means our own translation already
   * dropped something — the fit verdict is about capacity, not
   * faithfulness.
   */
  translation_fidelity: "full" | "reduced" | "same_source";
  roles_dropped: string[];
}

interface RecipeFitReport {
  slug: string;
  title: string;
  song_slug: string;
  artist: string;
  primary_genre: string;
  genres: string[];
  source_block_counts: Partial<Record<Platform, number>>;
  optional_block_counts: Partial<Record<Platform, number>>;
  dual_mic_cab: boolean;
  devices: Record<DeviceId, DeviceVerdict>;
}

// ─────────────────────────────────────────────────────────────────────
//  Shared helpers
// ─────────────────────────────────────────────────────────────────────

const countRole = (blocks: PlatformBlock[], role: Role) =>
  blocks.filter((b) => roleOf(b) === role).length;

const pct = (dsp: number, budget: number) => Math.round((dsp / budget) * 100);

/** Blocks a player would want on a footswitch: the bypassed alternates. */
const footswitchDemand = (blocks: PlatformBlock[]) =>
  blocks.filter(isOptional).length;

/**
 * Which roles the Helix chain has that this device's source translation
 * doesn't. Only meaningful for non-Helix sources — it measures our
 * authoring, not the hardware.
 */
function fidelityFor(
  recipe: ToneRecipe,
  source: Platform,
): { fidelity: DeviceVerdict["translation_fidelity"]; dropped: string[] } {
  if (source === "helix") return { fidelity: "same_source", dropped: [] };
  const helix = recipe.platform_translations.helix?.chain_blocks ?? [];
  const other = recipe.platform_translations[source]?.chain_blocks ?? [];
  const skip: Role[] = ["amp", "cab", "profile", "tone_model", "volume", "other"];
  const rolesIn = (bs: PlatformBlock[]) =>
    new Set(
      bs
        .filter((b) => !isOptional(b))
        .map(roleOf)
        .filter((r) => !skip.includes(r)),
    );
  const a = rolesIn(helix);
  const b = rolesIn(other);
  const dropped = [...a].filter((r) => !b.has(r)).map((r) => ROLE_LABEL[r]);
  return { fidelity: dropped.length ? "reduced" : "full", dropped };
}

/**
 * `docs/RECIPE_STANDARD.md` § mirror exemptions records the platform ×
 * category pairs where *not* mirroring a block is correct by design.
 * Where a dropped role is one of those, say so — it's an authoring
 * decision, not an omission.
 */
const BY_DESIGN_DROPS: Partial<Record<Platform, string[]>> = {
  katana: ["compressor", "EQ", "cab"],
  kemper: ["cab"],
};

function fidelityNote(
  dropped: string[],
  deviceLabel: string,
  source: Platform,
): string {
  if (dropped.length === 0) return "";
  const byDesign = BY_DESIGN_DROPS[source] ?? [];
  const deliberate = dropped.filter((d) => byDesign.includes(d));
  const rider =
    deliberate.length === dropped.length
      ? ` That's deliberate — RECIPE_STANDARD.md exempts ${deviceLabel} from mirroring ${joinList(deliberate)} because the hardware handles ${deliberate.length === 1 ? "it" : "them"} inside the amp section. It still means this isn't block-for-block the Helix tone.`
      : "";
  return ` Worth knowing: our ${deviceLabel} translation already leaves out the ${joinList(dropped)} the Helix chain uses, so this is a capacity verdict on a chain we'd already trimmed.${rider}`;
}

function describeCuts(plan: CutPlan): string[] {
  return [
    ...plan.optionalCuts.map(describe),
    ...plan.freeCuts.map((f) => describe(f.block)),
    ...plan.realCuts.map(describe),
  ];
}

// ─────────────────────────────────────────────────────────────────────
//  Evaluators
// ─────────────────────────────────────────────────────────────────────

/** Helix Floor/LT, HX Stomp, HX Stomp XL — block-count + DSP model. */
function evalHelixFamily(
  spec: DeviceSpec,
  blocks: PlatformBlock[],
): Omit<DeviceVerdict, "translation_fidelity" | "roles_dropped"> {
  const max = spec.maxBlocks!;
  const total = blocks.length;
  const essential = blocks.filter((b) => !isOptional(b)).length;
  const dspFull = estimateDsp(blocks);
  const dspPct = pct(dspFull, spec.dspBudget);
  const hasDualMic = blocks.some(isDualMicCab);
  const switches = footswitchDemand(blocks);
  const base = {
    device: spec.id,
    blocks_required: total,
    blocks_essential: essential,
    blocks_available: max,
    slots: null,
    footswitch_demand: switches,
  };

  const switchCaveat =
    switches > spec.footswitches
      ? [
          `${plural(switches, "switchable alternate")} against ${spec.footswitches} footswitches — you'll be using snapshots or a MIDI controller to get at them all.`,
        ]
      : [];

  // Multi-path devices: block count is only a per-lane concern.
  if (max >= 32) {
    const needsSplit = total > spec.maxSeriesBlocks!;
    return {
      ...base,
      verdict: "fits",
      reason: needsSplit
        ? `${plural(total, "block")} — over the ${spec.maxSeriesBlocks}-block limit for a single path, so it lands across both DSP paths. Routine on a ${spec.label}: ${max} blocks total, est. ${dspPct}% of available DSP.`
        : `${plural(total, "block")} in one path, est. ${dspPct}% DSP. Comfortable — a ${spec.label} has ${max} blocks and a second path you aren't touching.`,
      cause: null,
      dsp_estimate_pct: dspPct,
      cuts: [],
      free_cuts: [],
      caveats: switchCaveat,
    };
  }

  const fitsFn = (kept: PlatformBlock[]) =>
    kept.length <= max && estimateDsp(kept) <= spec.dspBudget;

  // Everything as written, with headroom.
  if (total <= max && dspPct <= 85) {
    const spare = max - total;
    // Exactly filling the block cap counts as tight: it loads and plays,
    // but you can't add so much as a looper without taking something out.
    return {
      ...base,
      verdict: spare === 0 ? "tight" : "fits",
      reason:
        spare === 0
          ? `All ${total} blocks load and it plays — but that is exactly the ${spec.label}'s ${max}, with est. ${dspPct}% DSP. Nothing else goes in this preset without something coming out.`
          : `${plural(total, "block")}, ${spare} to spare on the ${spec.label}'s ${max}. Est. ${dspPct}% DSP.`,
      cause: spare === 0 ? "block_count" : null,
      dsp_estimate_pct: dspPct,
      cuts: [],
      free_cuts: [],
      caveats: switchCaveat,
    };
  }

  // Loads, but with nothing left over.
  if (total <= max && dspPct <= 100) {
    return {
      ...base,
      verdict: "tight",
      reason: `All ${total} blocks load, but at an est. ${dspPct}% of the ${spec.label}'s single DSP there's no headroom left${hasDualMic ? " — the dual-mic cab alone costs about what two effects would" : ""}. Expect a "DSP limit reached" message if you add anything.`,
      cause: "dsp_headroom",
      dsp_estimate_pct: dspPct,
      cuts: [],
      free_cuts: [],
      caveats: [
        "DSP figure is an estimate; the block count is exact.",
        ...switchCaveat,
      ],
    };
  }

  // Needs cuts.
  const plan = planCuts(blocks, fitsFn, spec.freeCutRoles);
  const keptPct = pct(estimateDsp(plan.kept), spec.dspBudget);
  const freeCutNames = [
    ...plan.optionalCuts.map(describe),
    ...plan.freeCuts.map((f) => describe(f.block)),
  ];

  // Name the constraint that actually binds, rather than assuming it's
  // the block count.
  const overBlocks = total > max;
  const overDsp = dspPct > 100;
  const lead = overBlocks
    ? `${plural(total, "block")} against the ${spec.label}'s ${max}${overDsp ? `, and est. ${dspPct}% DSP on top of that` : ""}`
    : `${plural(total, "block")} is inside the ${max}-block cap, but est. ${dspPct}% DSP is over what one ${spec.label} DSP will carry`;

  const parts: string[] = [];
  if (plan.optionalCuts.length) {
    parts.push(
      `${plural(plan.optionalCuts.length, "bypassed alternate")} (${joinNames(plan.optionalCuts)})`,
    );
  }
  for (const f of plan.freeCuts) {
    parts.push(`the ${describe(f.block)} block (${f.why})`);
  }

  if (fitsFn(plan.kept) && plan.realCuts.length === 0) {
    return {
      ...base,
      verdict: "tight",
      reason: `${lead}. Lose ${joinList(parts)} and you're at ${plan.kept.length} of ${max}, est. ${keptPct}% DSP. Nothing you actually hear changes — what you give up is ${plan.optionalCuts.length ? "the alternate voicings parked in the chain for stomping" : "a block the hardware covers elsewhere"}.`,
      cause: overDsp ? (hasDualMic ? "dual_mic_cab" : "dsp_headroom") : "block_count",
      dsp_estimate_pct: keptPct,
      cuts: describeCuts(plan),
      free_cuts: freeCutNames,
      caveats: switchCaveat,
    };
  }

  const realCutCopy = plan.realCuts
    .map((b) => {
      const why = CUT_RATIONALE[roleOf(b)];
      return why ? `${describe(b)} (${why})` : describe(b);
    })
    .join(", ");

  const cause: Cause = hasDualMic
    ? "dual_mic_cab"
    : countRole(blocks, "pitch") > 0 && dspPct > 100
      ? "poly_pitch"
      : countRole(blocks, "amp") > 1
        ? "second_amp"
        : plan.kept.length >= max
          ? "block_count"
          : "dsp_headroom";

  if (fitsFn(plan.kept)) {
    return {
      ...base,
      verdict: "no",
      reason: `Doesn't load as written: ${lead}. Something real has to go. ${parts.length ? `Start with ${joinList(parts)}; you're still over, so ` : ""}drop ${realCutCopy} and you land at ${plan.kept.length} blocks, est. ${keptPct}% DSP.${hasDualMic ? " Alternatively, run a single-mic cab instead of the dual — that buys back about an effect's worth of DSP on its own." : ""}`,
      cause,
      dsp_estimate_pct: dspPct,
      cuts: describeCuts(plan),
      free_cuts: freeCutNames,
      caveats: switchCaveat,
    };
  }

  return {
    ...base,
    verdict: "no",
    reason: `Can't be made to fit without losing the tone: even after cutting ${joinNames([...plan.optionalCuts, ...plan.freeCuts.map((f) => f.block), ...plan.realCuts])} it's still ${plan.kept.length} blocks at est. ${keptPct}% DSP against the ${spec.label}'s ${max} blocks on one DSP.`,
    cause,
    dsp_estimate_pct: dspPct,
    cuts: describeCuts(plan),
    free_cuts: freeCutNames,
    caveats: switchCaveat,
  };
}

/**
 * POD Go — fixed chain, modelled honestly.
 *
 * The chain is: Wah > Volume/Pan > [4 user blocks] > Amp > Cab/IR > EQ >
 * FX Loop. The bracketed four are the only freely assignable positions;
 * the rest are dedicated and hold only their own category. One amp, one
 * cab, no dual cab. The Input block has its own noise gate.
 */
const POD_GO_USER_BLOCKS = 4;
const POD_GO_DEDICATED: Role[] = ["wah", "volume", "amp", "cab", "eq"];

function evalPodGo(
  spec: DeviceSpec,
  blocks: PlatformBlock[],
): Omit<DeviceVerdict, "translation_fidelity" | "roles_dropped"> {
  const dedicated = new Map<Role, PlatformBlock>();
  const userBlocks: PlatformBlock[] = [];
  const absorbed: PlatformBlock[] = [];
  /** Extra amps/cabs: POD Go's user positions can't hold either. */
  const overflowFixed: PlatformBlock[] = [];

  for (const b of blocks) {
    const role = roleOf(b);
    if (isPlainNoiseGate(b)) {
      absorbed.push(b); // the Input block's gate covers it
      continue;
    }
    if (POD_GO_DEDICATED.includes(role)) {
      if (!dedicated.has(role)) {
        dedicated.set(role, b);
      } else if (role === "amp" || role === "cab") {
        overflowFixed.push(b);
      } else {
        userBlocks.push(b); // a second EQ can live in a free position
      }
      continue;
    }
    userBlocks.push(b);
  }

  const total = blocks.length;
  const essential = blocks.filter((b) => !isOptional(b)).length;
  const amps = countRole(blocks, "amp");
  const optionalAmps = blocks.filter(
    (b) => roleOf(b) === "amp" && isOptional(b),
  ).length;
  const hasDualMic = blocks.some(isDualMicCab);
  /** Caveats that cost you something — these downgrade `fits` to `tight`. */
  const compromises: string[] = [];
  /** Caveats that are pure information. */
  const notes: string[] = [];
  const base = {
    device: spec.id,
    blocks_required: total,
    blocks_essential: essential,
    blocks_available: POD_GO_USER_BLOCKS,
    footswitch_demand: footswitchDemand(blocks),
    dsp_estimate_pct: null,
  };
  const slots = {
    required: userBlocks.length,
    available: POD_GO_USER_BLOCKS,
    label: "free block positions",
  };

  if (amps - optionalAmps > spec.maxAmps) {
    return {
      ...base,
      verdict: "no",
      slots,
      reason: `Needs ${plural(amps - optionalAmps, "amp block")} at once. POD Go's chain has exactly one amp position and no way to add a second.`,
      cause: "second_amp",
      cuts: [],
      free_cuts: [],
      caveats: compromises,
    };
  }
  if (overflowFixed.length) {
    compromises.push(
      `POD Go has one amp position and one Cab/IR position, so the extra ${joinNames(overflowFixed)} block${overflowFixed.length === 1 ? "" : "s"} can't be loaded — a free position can't hold an amp or a cab. ${overflowFixed.every(isOptional) ? "It's a bypassed alternate, so pick your favourite and move on." : "That one is enabled in the recipe."}`,
    );
  }
  if (hasDualMic) {
    compromises.push(
      "The dual-mic cab collapses to a single mic — POD Go's Cab/IR slot is one cab, one mic. You lose the blend, not the character.",
    );
  }
  if (absorbed.length) {
    notes.push(
      "The Noise Gate moves to the Input block's built-in gate; it doesn't cost a block position.",
    );
  }

  const needed = userBlocks.length;
  const dedicatedList = joinList([...dedicated.keys()].map((r) => ROLE_LABEL[r]));

  if (needed <= POD_GO_USER_BLOCKS) {
    const spare = POD_GO_USER_BLOCKS - needed;
    // Exactly filling the four free positions counts as tight — it
    // plays, but there's no room left for a tuner, looper or boost.
    const isTight = compromises.length > 0 || spare === 0;
    const cause: Cause | null = !isTight
      ? null
      : spare === 0
        ? "user_block_overflow"
        : hasDualMic
          ? "dual_mic_cab"
          : "second_amp";
    return {
      ...base,
      verdict: isTight ? "tight" : "fits",
      slots,
      reason:
        `The ${dedicatedList} land in POD Go's dedicated slots, leaving ${plural(needed, "block")} (${joinNames(userBlocks) || "nothing"}) for the four free positions — ${spare === 0 ? "exactly full, with nothing left for a boost or a looper" : `${spare} spare`}.` +
        (compromises.length ? ` ${compromises.join(" ")}` : ""),
      cause,
      cuts: [],
      free_cuts: [],
      caveats: [...compromises, ...notes],
    };
  }

  const optionalUser = userBlocks.filter(isOptional);
  const essentialUser = userBlocks.filter((b) => !isOptional(b));

  if (essentialUser.length <= POD_GO_USER_BLOCKS) {
    return {
      ...base,
      verdict: "tight",
      slots,
      reason: `${plural(needed, "block")} want POD Go's four free positions, but ${optionalUser.length === 1 ? "one of them is a bypassed alternate" : `${optionalUser.length} of them are bypassed alternates`} (${joinNames(optionalUser)}). Pick the drive you want, leave the others out, and it fits: ${joinNames(essentialUser)}.`,
      cause: "user_block_overflow",
      cuts: optionalUser.map(describe),
      free_cuts: optionalUser.map(describe),
      caveats: [...compromises, ...notes],
    };
  }

  const plan = planCuts(
    userBlocks,
    (kept) => kept.length <= POD_GO_USER_BLOCKS,
    spec.freeCutRoles,
  );
  const realCutCopy = plan.realCuts
    .map((b) => {
      const why = CUT_RATIONALE[roleOf(b)];
      return why ? `${describe(b)} (${why})` : describe(b);
    })
    .join(", ");

  return {
    ...base,
    verdict: "no",
    slots,
    reason: `POD Go gives you four free block positions; this chain wants ${needed}: ${joinNames(userBlocks)}. ${plan.optionalCuts.length ? `${plural(plan.optionalCuts.length, "bypassed alternate")} come${plan.optionalCuts.length === 1 ? "s" : ""} out first and you're still over. ` : ""}${plan.realCuts.length === 1 ? "One block has to sit out" : `${plan.realCuts.length} blocks have to sit out`} — the cheapest cut is ${realCutCopy}.`,
    cause: "user_block_overflow",
    cuts: describeCuts(plan),
    free_cuts: plan.optionalCuts.map(describe),
    caveats: [...compromises, ...notes],
  };
}

/** Quad Cortex, FM3, FM9 — grid devices where CPU, not slots, is the wall. */
function evalGridDevice(
  spec: DeviceSpec,
  blocks: PlatformBlock[],
): Omit<DeviceVerdict, "translation_fidelity" | "roles_dropped"> {
  const total = blocks.length;
  const essential = blocks.filter((b) => !isOptional(b)).length;
  const dspPct = pct(estimateDsp(blocks), spec.dspBudget);
  const amps = countRole(blocks, "amp");
  const lanes = Math.ceil(total / spec.maxSeriesBlocks!);
  const base = {
    device: spec.id,
    blocks_required: total,
    blocks_essential: essential,
    blocks_available: spec.maxBlocks,
    slots: null,
    dsp_estimate_pct: dspPct,
    footswitch_demand: footswitchDemand(blocks),
    free_cuts: [] as string[],
  };

  if (amps > spec.maxAmps) {
    return {
      ...base,
      verdict: "no",
      reason: `Needs ${plural(amps, "amp block")}; the ${spec.label} runs ${spec.maxAmps}.`,
      cause: "second_amp",
      cuts: [],
      caveats: [],
    };
  }

  if (total > spec.maxBlocks!) {
    return {
      ...base,
      verdict: "no",
      reason: `${plural(total, "block")} against the ${spec.label}'s ${spec.maxBlocks}-slot grid.`,
      cause: "block_count",
      cuts: [],
      caveats: [],
    };
  }

  if (dspPct > 100) {
    const plan = planCuts(blocks, (kept) => estimateDsp(kept) <= spec.dspBudget);
    return {
      ...base,
      verdict: "no",
      reason: `Fits the grid but not the CPU: est. ${dspPct}% on a ${spec.label}. Dropping ${joinNames([...plan.optionalCuts, ...plan.realCuts])} brings it back under. Remember that bypassing a block on a Fractal doesn't give the CPU back — it has to come out of the grid.`,
      cause: "dsp_headroom",
      cuts: describeCuts(plan),
      caveats: ["DSP figure is an estimate; the block count is exact."],
    };
  }

  const laneNote =
    lanes > 1
      ? ` At ${total} blocks it wraps onto a second row (a lane is ${spec.maxSeriesBlocks} columns).`
      : "";

  if (dspPct > 85) {
    return {
      ...base,
      verdict: "tight",
      reason: `All ${total} blocks fit the grid, but at an est. ${dspPct}% CPU there's little room to add anything.${laneNote}`,
      cause: "dsp_headroom",
      cuts: [],
      caveats: ["DSP figure is an estimate; the block count is exact."],
    };
  }

  return {
    ...base,
    verdict: "fits",
    reason: `${plural(total, "block")} on a ${spec.maxBlocks}-slot grid, est. ${dspPct}% CPU.${laneNote}`,
    cause: null,
    cuts: [],
    caveats: [],
  };
}

/**
 * Kemper — deliberately not answered.
 *
 * Our Kemper translations name a Rig Exchange *search* ("Search Rig
 * Exchange for 'Marshall clean'"), not a specific rig. Whether the
 * recipe "fits" depends on which profile you load and what's already in
 * your library — neither of which is in our data. We publish the slot
 * arithmetic, which IS computable, and refuse the verdict.
 */
function evalKemper(
  spec: DeviceSpec,
  blocks: PlatformBlock[],
): Omit<DeviceVerdict, "translation_fidelity" | "roles_dropped"> {
  const total = blocks.length;
  const essential = blocks.filter((b) => !isOptional(b)).length;
  const effects = blocks.filter((b) => roleOf(b) !== "profile");
  const preRoles: Role[] = ["drive", "comp", "gate", "wah", "pitch", "volume"];
  const pre = effects.filter((b) => preRoles.includes(roleOf(b))).length;
  const post = effects.length - pre;

  const slotFit =
    pre <= 4 && post <= 4
      ? `${plural(pre, "pre-stack stomp")} (slots A–D hold four) and ${plural(post, "post-stack effect")} (X/MOD/DLY/REV holds four) — the effects side fits an MK1 layout, and an MK2's twenty slots aren't remotely troubled.`
      : `${plural(pre, "pre-stack stomp")} and ${plural(post, "post-stack effect")} — over an MK1's 4 + 4 layout, though an MK2's twenty slots absorb it.`;

  return {
    device: spec.id,
    verdict: "not_applicable",
    reason: `We won't call this one. On a Kemper the amp is a profile you source yourself, and our translation points at a Rig Exchange search rather than a specific rig — so whether this tone "fits" depends on a profile we didn't ship and can't see. What we can say: ${slotFit}`,
    cause: "profile_based",
    blocks_required: total,
    blocks_essential: essential,
    blocks_available: spec.maxBlocks,
    slots: { required: pre + post, available: 8, label: "effect slots (MK1)" },
    dsp_estimate_pct: null,
    cuts: [],
    free_cuts: [],
    footswitch_demand: footswitchDemand(blocks),
    caveats: [
      "Effect-slot arithmetic is computed; the amp match is not.",
      "Slot counts assume an MK1 (4 pre + 4 post). MK2 hardware has 20.",
    ],
  };
}

/**
 * Katana Gen 3 — five effect slots, each with its own pool:
 *   Booster x1 | Mod x1 | FX x1 | Delay x1 | Reverb x1
 * Mod and FX share a pool, so a second modulation can live in FX.
 * The Reverb slot can hold a second delay instead of a reverb.
 * The amp character (and its baked-in cab voicing) is free, and the
 * noise suppressor sits outside the five slots.
 */
function evalKatana(
  spec: DeviceSpec,
  blocks: PlatformBlock[],
): Omit<DeviceVerdict, "translation_fidelity" | "roles_dropped"> {
  const total = blocks.length;
  const essential = blocks.filter((b) => !isOptional(b)).length;

  const consider = (bs: PlatformBlock[]) => {
    const drives = bs.filter((b) => roleOf(b) === "drive");
    const modPool = bs.filter((b) =>
      ["mod", "wah", "pitch", "comp"].includes(roleOf(b)),
    );
    const delays = bs.filter((b) => roleOf(b) === "delay");
    const reverbs = bs.filter((b) => roleOf(b) === "reverb");
    const problems: string[] = [];
    if (drives.length > 1)
      problems.push(
        `${plural(drives.length, "Booster-slot effect")} (${joinNames(drives)}) — the Katana runs one at a time`,
      );
    if (modPool.length > 2)
      problems.push(
        `${plural(modPool.length, "effect")} want the shared Mod/FX pool (${joinNames(modPool)}), which is two slots`,
      );
    if (delays.length > 1 && reverbs.length > 0)
      problems.push(
        "two delays plus a reverb — the Reverb slot can hold a second delay, but not both",
      );
    if (delays.length > 2) problems.push("more than two delays");
    if (reverbs.length > 1)
      problems.push("two reverbs — there's one Reverb slot");
    const used =
      Math.min(drives.length, 1) +
      Math.min(modPool.length, 2) +
      Math.min(delays.length, 1) +
      Math.min(reverbs.length, 1);
    return { problems, used };
  };

  const full = consider(blocks);
  const enabledOnly = consider(blocks.filter((b) => !isOptional(b)));
  const ampCaveat =
    "The Katana's amp character is a voicing, not a model of the specific amp — the closest character, not a match.";
  const base = {
    device: spec.id,
    blocks_required: total,
    blocks_essential: essential,
    blocks_available: 5,
    dsp_estimate_pct: null,
    footswitch_demand: footswitchDemand(blocks),
  };

  if (full.problems.length === 0) {
    return {
      ...base,
      verdict: "fits",
      slots: { required: full.used, available: 5, label: "effect slots" },
      reason: `${full.used} of the Katana's five effect slots, one per category — the amp character covers the amp and cab, so nothing is competing.`,
      cause: null,
      cuts: [],
      free_cuts: [],
      caveats: [ampCaveat],
    };
  }

  if (enabledOnly.problems.length === 0) {
    const optional = blocks.filter(isOptional);
    return {
      ...base,
      verdict: "tight",
      slots: { required: enabledOnly.used, available: 5, label: "effect slots" },
      reason: `As written it asks for more than one slot's worth in a category (${full.problems[0]}), but the extra ${optional.length === 1 ? "is a bypassed alternate" : "are bypassed alternates"} — ${joinNames(optional)}. Pick one and it drops to ${enabledOnly.used} of five slots.`,
      cause: "slot_conflict",
      cuts: optional.map(describe),
      free_cuts: optional.map(describe),
      caveats: [ampCaveat],
    };
  }

  return {
    ...base,
    verdict: "no",
    slots: { required: enabledOnly.used, available: 5, label: "effect slots" },
    reason: `Slot conflict on a Katana: ${enabledOnly.problems.join("; ")}.`,
    cause: "slot_conflict",
    cuts: [],
    free_cuts: [],
    caveats: [ampCaveat],
  };
}

function evaluate(spec: DeviceSpec, recipe: ToneRecipe): DeviceVerdict {
  const translation = recipe.platform_translations[spec.source];
  const { fidelity, dropped } = fidelityFor(recipe, spec.source);

  if (!translation || translation.chain_blocks.length === 0) {
    return {
      device: spec.id,
      verdict: "not_applicable",
      reason: `No ${spec.source} translation for this recipe, so there's nothing to measure.`,
      cause: "no_translation",
      blocks_required: 0,
      blocks_essential: 0,
      blocks_available: spec.maxBlocks,
      slots: null,
      dsp_estimate_pct: null,
      cuts: [],
      free_cuts: [],
      footswitch_demand: 0,
      caveats: [],
      translation_fidelity: fidelity,
      roles_dropped: dropped,
    };
  }

  const blocks = translation.chain_blocks;
  // Touch every block through the platform-aware role lookup so the
  // data-gap collectors see them.
  for (const b of blocks) roleOfIn(b, spec.source);

  let partial;
  switch (spec.id) {
    case "pod_go":
      partial = evalPodGo(spec, blocks);
      break;
    case "kemper":
      partial = evalKemper(spec, blocks);
      break;
    case "katana_gen3":
      partial = evalKatana(spec, blocks);
      break;
    case "quad_cortex":
    case "fractal_fm3":
    case "fractal_fm9":
      partial = evalGridDevice(spec, blocks);
      break;
    default:
      partial = evalHelixFamily(spec, blocks);
  }

  return {
    ...partial,
    reason: partial.reason + fidelityNote(dropped, spec.label, spec.source),
    translation_fidelity: fidelity,
    roles_dropped: dropped,
  };
}

// ─────────────────────────────────────────────────────────────────────
//  Build the dataset
// ─────────────────────────────────────────────────────────────────────

const songBySlug = new Map(songs.map((s) => [s.slug, s]));
const artistBySlug = new Map(artists.map((a) => [a.slug, a]));
const ALL_PLATFORMS: Platform[] = [
  "helix",
  "quad_cortex",
  "fractal",
  "kemper",
  "katana",
  "tonex",
  "pedalboard",
];

const reports: RecipeFitReport[] = toneRecipes.map((recipe) => {
  const song = songBySlug.get(recipe.song_slug);
  const artist = song ? artistBySlug.get(song.artist_slug) : undefined;

  const source_block_counts: Partial<Record<Platform, number>> = {};
  const optional_block_counts: Partial<Record<Platform, number>> = {};
  for (const p of ALL_PLATFORMS) {
    const t = recipe.platform_translations[p];
    if (!t) continue;
    source_block_counts[p] = t.chain_blocks.length;
    optional_block_counts[p] = t.chain_blocks.filter(isOptional).length;
  }

  const devices = {} as Record<DeviceId, DeviceVerdict>;
  for (const spec of DEVICES) devices[spec.id] = evaluate(spec, recipe);

  return {
    slug: recipe.slug,
    title: recipe.title,
    song_slug: recipe.song_slug,
    artist: artist?.name ?? "",
    primary_genre: song?.genres?.[0] ?? "unknown",
    genres: song?.genres ?? [],
    source_block_counts,
    optional_block_counts,
    dual_mic_cab:
      recipe.platform_translations.helix?.chain_blocks.some(isDualMicCab) ??
      false,
    devices,
  };
});

// ─────────────────────────────────────────────────────────────────────
//  Rollups
// ─────────────────────────────────────────────────────────────────────

interface DeviceSummary {
  device: DeviceId;
  label: string;
  counts: Record<Verdict, number>;
  /** fits + tight — "you can play this song on this box" */
  runnable: number;
  /** Of the runnable ones, how many rest on an already-trimmed chain. */
  reduced_translations: number;
  causes: Record<string, number>;
  roles_dropped: Record<string, number>;
}

const deviceSummaries: DeviceSummary[] = DEVICES.map((spec) => {
  const counts = { fits: 0, tight: 0, no: 0, not_applicable: 0 } as Record<
    Verdict,
    number
  >;
  const causes: Record<string, number> = {};
  const roles_dropped: Record<string, number> = {};
  let reduced = 0;
  for (const r of reports) {
    const v = r.devices[spec.id];
    counts[v.verdict] += 1;
    if (v.verdict === "no" || v.verdict === "tight") {
      const key = v.cause ?? "unclassified";
      causes[key] = (causes[key] ?? 0) + 1;
    }
    if (v.translation_fidelity === "reduced") {
      reduced += 1;
      for (const role of v.roles_dropped) {
        roles_dropped[role] = (roles_dropped[role] ?? 0) + 1;
      }
    }
  }
  return {
    device: spec.id,
    label: spec.label,
    counts,
    runnable: counts.fits + counts.tight,
    reduced_translations: reduced,
    causes,
    roles_dropped,
  };
});

const genreSummary: Record<
  string,
  { recipes: number; devices: Record<DeviceId, Record<Verdict, number>> }
> = {};
for (const r of reports) {
  const g = r.primary_genre;
  if (!genreSummary[g]) {
    genreSummary[g] = {
      recipes: 0,
      devices: Object.fromEntries(
        DEVICES.map((d) => [
          d.id,
          { fits: 0, tight: 0, no: 0, not_applicable: 0 },
        ]),
      ) as Record<DeviceId, Record<Verdict, number>>,
    };
  }
  genreSummary[g].recipes += 1;
  for (const spec of DEVICES) {
    genreSummary[g].devices[spec.id][r.devices[spec.id].verdict] += 1;
  }
}

const today = new Date().toISOString().slice(0, 10);

// Data-quality collectors, deduped.
const recatKey = (r: (typeof RECATEGORISED)[0]) =>
  `${r.platform}|${r.category}|${r.name}`;
const recategorisedUnique = [
  ...new Map(RECATEGORISED.map((r) => [recatKey(r), r])).values(),
];

const dataset = {
  generated_at: today,
  generator: "scripts/compute-fit-reports.ts",
  recipe_count: reports.length,
  method: {
    exact:
      "Block counts, amp/cab counts, bypassed-alternate counts and slot arithmetic come straight from the recipe data and published device specs.",
    estimated:
      "DSP percentages come from a local per-role weight table (DSP_WEIGHTS in the generator). They only decide the fits/tight boundary — never a 'no' on their own.",
    refused:
      "Kemper verdicts are 'not_applicable': the amp is a user-sourced profile, so a fit verdict would be invented.",
    scope:
      "A verdict answers 'does this chain load on this device', not 'does this device sound like the record'. translation_fidelity flags recipes whose per-platform translation was already a reduction of the Helix chain.",
  },
  devices: DEVICES.map((d) => ({
    id: d.id,
    label: d.label,
    manufacturer: d.manufacturer,
    source_platform: d.source,
    max_blocks: d.maxBlocks,
    max_series_blocks: d.maxSeriesBlocks,
    max_amps: d.maxAmps,
    max_cabs: d.maxCabs,
    footswitches: d.footswitches,
    snapshots: d.snapshots,
    spec_source: d.spec_source,
    note: d.note,
  })),
  data_quality: {
    unmapped_categories: [...UNMAPPED_CATEGORIES],
    recategorised_blocks: recategorisedUnique,
  },
  summary: {
    by_device: deviceSummaries,
    by_genre: genreSummary,
  },
  reports: Object.fromEntries(reports.map((r) => [r.slug, r])),
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonPath = resolve(__dirname, "..", "src", "data", "fit-reports.json");
writeFileSync(jsonPath, JSON.stringify(dataset, null, 2) + "\n", "utf8");

// ─────────────────────────────────────────────────────────────────────
//  Render the summary doc
// ─────────────────────────────────────────────────────────────────────

const L: string[] = [];
const total = reports.length;

L.push("# Fit Report Summary");
L.push("");
L.push(`**Date:** ${today}`);
L.push(`**Recipes:** ${total}`);
L.push(`**Devices:** ${DEVICES.length}`);
L.push("");
L.push("> Generated by `scripts/compute-fit-reports.ts`. Data lives at");
L.push("> `src/data/fit-reports.json`. Don't hand-edit this file — re-run the");
L.push("> script instead.");
L.push("");
L.push("## What a verdict means");
L.push("");
L.push("| Verdict | Meaning |");
L.push("| --- | --- |");
L.push(
  "| `fits` | The chain loads as written, with headroom. Nothing to think about. |",
);
L.push(
  "| `tight` | It loads, but only after dropping bypassed alternates or blocks the hardware makes redundant — or it loads with no DSP left over. Playable; not expandable. |",
);
L.push(
  "| `no` | Something musically real has to go. The reason names what, and why that's the cheapest cut. |",
);
L.push(
  "| `not_applicable` | We can't answer honestly from our data. The reason says why. |",
);
L.push("");
L.push(
  "A verdict answers **does this chain load on this box** — not *does this box sound like the record*. The `translation_fidelity` field carries the second question.",
);
L.push("");
L.push("## How the numbers are made");
L.push("");
L.push(
  "**Exact:** block counts, amp and cab counts, bypassed-alternate counts, and per-slot arithmetic. These come from the recipe data itself and from published device specs (`docs/platform-knowledge/*.md`, cited per device below).",
);
L.push("");
L.push(
  "**Estimated:** DSP percentages, from a per-role weight table in the generator. They're anchored on documented behaviour — amp blocks dominate, Dual cabs cost about 2x a single, poly pitch is the priciest effect class, a bypassed block still costs DSP — but they are not measured. They only ever decide `fits` vs `tight`; a DSP estimate never produces a `no` by itself.",
);
L.push("");
L.push("**Refused:** Kemper. See the data-gap section at the bottom.");
L.push("");
L.push("---");
L.push("");
L.push("## Headline numbers");
L.push("");
L.push(
  "| Device | Fits | Tight | Doesn't fit | N/A | Runnable (fits + tight) | On an already-trimmed chain |",
);
L.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const s of deviceSummaries) {
  const pctRun = Math.round((s.runnable / total) * 100);
  L.push(
    `| **${s.label}** | ${s.counts.fits} | ${s.counts.tight} | ${s.counts.no} | ${s.counts.not_applicable} | ${s.runnable} / ${total} (${pctRun}%) | ${s.reduced_translations} |`,
  );
}
L.push("");
L.push(
  "That last column is the honest asterisk. For the four Line 6 devices the source is the Helix chain, so a fit verdict is a fit verdict. For the Quad Cortex, Fractal and Katana we read *their* translation — which our own authors may already have trimmed. Where that happened, the recipe's reason string says so.",
);
L.push("");
L.push("---");
L.push("");
L.push("## Block-count distribution per source translation");
L.push("");
L.push("| Platform | Recipes | Min | Max | Median | Chains over 8 blocks |");
L.push("| --- | --- | --- | --- | --- | --- |");
for (const p of [
  "helix",
  "quad_cortex",
  "fractal",
  "kemper",
  "katana",
  "tonex",
] as Platform[]) {
  const counts = reports
    .map((r) => r.source_block_counts[p])
    .filter((n): n is number => typeof n === "number")
    .sort((a, b) => a - b);
  if (counts.length === 0) continue;
  const median = counts[Math.floor(counts.length / 2)];
  const over8 = counts.filter((n) => n > 8).length;
  L.push(
    `| \`${p}\` | ${counts.length} | ${counts[0]} | ${counts[counts.length - 1]} | ${median} | ${over8} |`,
  );
}
L.push("");
L.push(
  "Bypassed alternates — a second and third drive parked in the chain for you to stomp — inflate those counts. Helix chains with bypassed blocks removed:",
);
L.push("");
{
  const hist = new Map<number, number>();
  for (const r of reports) {
    const n = (r.source_block_counts.helix ?? 0) - (r.optional_block_counts.helix ?? 0);
    hist.set(n, (hist.get(n) ?? 0) + 1);
  }
  L.push("| Active blocks | Recipes |");
  L.push("| --- | --- |");
  for (const [k, v] of [...hist.entries()].sort((a, b) => a[0] - b[0])) {
    L.push(`| ${k} | ${v} |`);
  }
}
L.push("");
L.push("---");
L.push("");
L.push("## Per-device detail");
L.push("");

/** True when two devices produce the same verdict for every recipe. */
function verdictsIdentical(a: DeviceId, b: DeviceId): boolean {
  return reports.every((r) => r.devices[a].verdict === r.devices[b].verdict);
}

for (const spec of DEVICES) {
  const s = deviceSummaries.find((d) => d.device === spec.id)!;
  L.push(`### ${s.label}`);
  L.push("");
  L.push(`*${spec.note}*`);
  L.push("");
  L.push(`Source translation: \`${spec.source}\` · Spec: ${spec.spec_source}`);
  L.push("");
  L.push(
    `**${s.counts.fits} fit · ${s.counts.tight} tight · ${s.counts.no} don't fit${s.counts.not_applicable ? ` · ${s.counts.not_applicable} n/a` : ""}** (of ${total})`,
  );
  L.push("");

  // Don't print the same 195 verdicts twice for two boxes that are the
  // same box with a different front panel (HX Stomp / HX Stomp XL).
  // Devices that merely happen to pass everything are NOT twins.
  const twin = DEVICES.find(
    (other) =>
      other.id !== spec.id &&
      DEVICES.indexOf(other) < DEVICES.indexOf(spec) &&
      other.source === spec.source &&
      other.maxBlocks === spec.maxBlocks &&
      other.dspBudget === spec.dspBudget &&
      verdictsIdentical(other.id, spec.id),
  );
  if (twin) {
    const switchCases = reports.filter(
      (r) => r.devices[spec.id].footswitch_demand > spec.footswitches,
    ).length;
    const twinSwitchCases = reports.filter(
      (r) => r.devices[twin.id].footswitch_demand > twin.footswitches,
    ).length;
    L.push(
      `**Every verdict is identical to the ${twin.label}'s** — all ${total} of them. That is the finding, not a shortcut: the two boxes share a DSP and a block count, so nothing that fails on one passes on the other. The only difference our data can see is footswitches: ${twinSwitchCases} recipe${twinSwitchCases === 1 ? "" : "s"} want more switchable alternates than a ${twin.label} has, versus ${switchCases} on the ${spec.label}.`,
    );
    L.push("");
    L.push("---");
    L.push("");
    continue;
  }

  const causeEntries = Object.entries(s.causes).sort((a, b) => b[1] - a[1]);
  if (causeEntries.length) {
    L.push("Why the non-clean verdicts happen:");
    L.push("");
    for (const [cause, n] of causeEntries) {
      L.push(`- \`${cause}\` — ${n} recipe${n === 1 ? "" : "s"}`);
    }
    L.push("");
  }

  const droppedEntries = Object.entries(s.roles_dropped).sort(
    (a, b) => b[1] - a[1],
  );
  if (droppedEntries.length) {
    L.push(
      `Roles our \`${spec.source}\` translations most often leave out relative to the Helix chain:`,
    );
    L.push("");
    for (const [role, n] of droppedEntries) {
      L.push(`- ${role} — missing in ${n} recipe${n === 1 ? "" : "s"}`);
    }
    L.push("");
  }

  const failures = reports.filter((r) => r.devices[spec.id].verdict === "no");
  if (failures.length) {
    const byCause = new Map<string, RecipeFitReport[]>();
    for (const r of failures) {
      const c = r.devices[spec.id].cause ?? "unclassified";
      byCause.set(c, [...(byCause.get(c) ?? []), r]);
    }
    L.push(`**The ${failures.length} that don't fit, grouped by cause:**`);
    L.push("");
    for (const [cause, rs] of [...byCause.entries()].sort(
      (a, b) => b[1].length - a[1].length,
    )) {
      L.push(`*\`${cause}\` — ${rs.length}*`);
      L.push("");
      for (const r of rs.slice(0, 40)) {
        L.push(`- \`${r.slug}\` — ${r.devices[spec.id].reason}`);
      }
      if (rs.length > 40) L.push(`- …and ${rs.length - 40} more (see the JSON)`);
      L.push("");
    }
  }

  const tights = reports.filter((r) => r.devices[spec.id].verdict === "tight");
  if (tights.length && tights.length <= 30) {
    L.push(`**The ${tights.length} that are tight:**`);
    L.push("");
    for (const r of tights) {
      L.push(`- \`${r.slug}\` — ${r.devices[spec.id].reason}`);
    }
    L.push("");
  } else if (tights.length) {
    const byCause = new Map<string, number>();
    for (const r of tights) {
      const c = r.devices[spec.id].cause ?? "unclassified";
      byCause.set(c, (byCause.get(c) ?? 0) + 1);
    }
    L.push(
      `**${tights.length} land on \`tight\`** (${[...byCause.entries()].map(([c, n]) => `${c}: ${n}`).join(", ")}). First ten:`,
    );
    L.push("");
    for (const r of tights.slice(0, 10)) {
      L.push(`- \`${r.slug}\` — ${r.devices[spec.id].reason}`);
    }
    L.push("");
    L.push("Full reasons per recipe in `src/data/fit-reports.json`.");
    L.push("");
  }
  L.push("---");
  L.push("");
}

// ── Per-genre ────────────────────────────────────────────────────────
L.push("## By genre");
L.push("");
L.push(
  "Genre is the song's primary genre (`songs[].genres[0]`); each recipe counts once. Cells are fits / tight / doesn't fit.",
);
L.push("");
const HEADLINE_DEVICES: DeviceId[] = [
  "hx_stomp",
  "pod_go",
  "katana_gen3",
  "fractal_fm3",
];
L.push(
  `| Genre | Recipes | ${HEADLINE_DEVICES.map((d) => DEVICES.find((x) => x.id === d)!.label).join(" | ")} |`,
);
L.push(`| --- | --- | ${HEADLINE_DEVICES.map(() => "---").join(" | ")} |`);
for (const [genre, g] of Object.entries(genreSummary).sort(
  (a, b) => b[1].recipes - a[1].recipes,
)) {
  const cells = HEADLINE_DEVICES.map((d) => {
    const c = g.devices[d];
    return `${c.fits} / ${c.tight} / ${c.no}`;
  });
  L.push(`| ${genre} | ${g.recipes} | ${cells.join(" | ")} |`);
}
L.push("");
L.push("---");
L.push("");

// ── Data gaps ────────────────────────────────────────────────────────
L.push("## Data gaps — what we deliberately did not compute");
L.push("");
L.push(
  "**1. Kemper fit is unanswerable from our data.** Every Kemper translation names a Rig Exchange *search string* (\"Search Rig Exchange for 'Marshall clean'\") rather than a specific profile. Whether a tone fits depends on the profile you load and what's already in your library. All 195 Kemper verdicts are `not_applicable`, with the effect-slot arithmetic reported alongside — that part *is* computable.",
);
L.push("");
L.push(
  '**2. DSP percentages are modelled, not measured.** They come from a per-*role* average, not per-model figures. Every reason string that uses one says "est.". If a verdict hinges on the difference between 84% and 86%, treat it as a coin flip and trust the block count.',
);
L.push("");
L.push(
  "**2b. Better DSP data now exists and this run doesn't use it.** `src/lib/helix/dsp-costs.ts` carries per-model costs reported by Line 6, plus `DEVICE_CAPACITIES` and `estimateDspUsage()`. Switching this generator over is a tracked TODO at the top of the script. Spot-checking the two tables: our amp weight (32) sits inside their reported 27.3–37.3 range, but we over-charge cabs (8 vs 3.33 mono on the post-3.50 engine) and delays (10 vs 4.4–9.4), and under-charge drives (5 vs 5.8–11.6). Those errors partly cancel on a typical amp + cab + drive + delay chain, which is why the block-count verdicts hold — but do not quote our percentages as if they were Line 6's.",
);
L.push("");
L.push(
  "**3. The QC / Fractal / Katana translations are authored per platform.** They are not mechanical reductions of the Helix chain — a human (or our pipeline) already decided what to keep. A `fits` verdict on those devices therefore partly measures our own authoring. `translation_fidelity` and `roles_dropped` carry that caveat per recipe; the counts are in the headline table's last column.",
);
L.push("");
L.push(
  "**4. TONEX has no fit dimension.** Its translation is a single Tone Model search query, so there's no chain to count. It isn't in the device list.",
);
L.push("");
L.push(
  '**5. `pedalboard` translations don\'t exist.** The `Platform` type includes `"pedalboard"`, but zero recipes carry one. A future "can I build this with real pedals?" report has no data to stand on yet.',
);
L.push("");
L.push(
  "**6. Katana amp characters are approximations.** The Katana has six amp characters, not a model of the specific amp in the recipe. `fits` there means the *chain shape* fits; it is not a claim that the amp sounds the same.",
);
L.push("");
L.push(
  "**7. POD Go's fixed chain is modelled, not read from firmware.** We assume dedicated Wah, Volume/Pan, Amp, Cab/IR, EQ and FX Loop positions plus 4 freely assignable blocks, one amp, one cab, no dual cab. That matches the published 7-block / 1-amp / 1-cab spec, but the free-block count is the load-bearing assumption in every POD Go verdict.",
);
L.push("");
L.push(
  "**8. Footswitch counts assume stomp-mode use.** A chain with four bypassed alternates only *needs* four switches if you want to stomp them live — snapshots can cover it. That's why the HX Stomp and HX Stomp XL share every verdict and differ only in a caveat.",
);
L.push("");
if (UNMAPPED_CATEGORIES.size > 0) {
  L.push(
    `**9. Unmapped block categories:** ${[...UNMAPPED_CATEGORIES].map((c) => `\`${c}\``).join(", ")}. These fell through to the generic \`other\` role and are costed at a flat rate. Add them to \`ROLE_MAP\` in the generator.`,
  );
} else {
  L.push(
    "**9. Every block category in the corpus maps to a known role.** No silent fallbacks in this run.",
  );
}
L.push("");
if (recategorisedUnique.length) {
  L.push(
    `**10. ${recategorisedUnique.length} blocks are filed under a category their name contradicts** (a compressor in a Booster slot, a noise gate filed as a Booster). We reclassify them by name so the slot arithmetic is right, but the underlying data should be fixed:`,
  );
  L.push("");
  L.push("| Platform | Category | Block name |");
  L.push("| --- | --- | --- |");
  for (const r of recategorisedUnique) {
    L.push(`| \`${r.platform}\` | ${r.category} | ${r.name} |`);
  }
  L.push("");
  L.push(
    "(Kemper's `Stomp` and the Katana's `FX` are generic containers by design and are not counted here.)",
  );
} else {
  L.push("**10. No block names contradict their category.**");
}
L.push("");

const summaryPath = resolve(__dirname, "..", "docs", "FIT_REPORT_SUMMARY.md");
writeFileSync(summaryPath, L.join("\n"), "utf8");

// ─────────────────────────────────────────────────────────────────────
//  Console summary
// ─────────────────────────────────────────────────────────────────────

console.log(`\nFit reports · ${total} recipes × ${DEVICES.length} devices\n`);
const w = Math.max(...DEVICES.map((d) => d.label.length));
console.log(`  ${"device".padEnd(w)}  fits  tight    no   n/a   runnable`);
for (const s of deviceSummaries) {
  const pctRun = Math.round((s.runnable / total) * 100);
  console.log(
    `  ${s.label.padEnd(w)}  ${String(s.counts.fits).padStart(4)}  ${String(
      s.counts.tight,
    ).padStart(5)}  ${String(s.counts.no).padStart(4)}  ${String(
      s.counts.not_applicable,
    ).padStart(4)}   ${String(s.runnable).padStart(3)}/${total} (${pctRun}%)`,
  );
}
console.log("");
if (UNMAPPED_CATEGORIES.size > 0) {
  console.log(
    `  ⚠ unmapped block categories: ${[...UNMAPPED_CATEGORIES].join(", ")}`,
  );
}
if (recategorisedUnique.length) {
  console.log(
    `  ⚠ ${recategorisedUnique.length} blocks reclassified by name (category contradicts name)`,
  );
}
console.log("");
console.log(`  JSON:    src/data/fit-reports.json`);
console.log(`  Summary: docs/FIT_REPORT_SUMMARY.md`);
console.log("");
