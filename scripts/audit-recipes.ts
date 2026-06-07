/**
 * Recipe quality audit
 * --------------------
 * Grades every recipe in src/lib/data/index.ts against the rules in
 * docs/RECIPE_STANDARD.md and writes a report to
 * docs/RECIPE_AUDIT_REPORT.md.
 *
 * Run: `npx tsx scripts/audit-recipes.mts`
 *
 * Each rule has:
 *   slug — matches the rule slug in RECIPE_STANDARD.md
 *   severity — error | warn | info
 *   check(recipe) → string | null  (null = pass; string = failure reason)
 *
 * Don't add a rule here without also adding it to RECIPE_STANDARD.md
 * — and vice versa. The doc is the spec; this script is the
 * enforcement.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { toneRecipes } from "../src/lib/data";
import { getCanonicalParams } from "../src/lib/parameters/canonical";
import type {
  ToneRecipe,
  PlatformTranslation,
  PlatformBlock,
  Platform,
} from "../src/types/recipe";

type Severity = "error" | "warn" | "info";

interface Rule {
  slug: string;
  severity: Severity;
  description: string;
  check: (r: ToneRecipe) => string | null;
}

const VALID_TONE_CONTEXTS = new Set([
  "full_song",
  "verse",
  "chorus",
  "solo",
  "bridge",
  "intro",
  "intro_riff",
  "outro",
  "riff",
  "clean",
  "lead",
  "rhythm",
]);

// Platforms exempt from the "≥3 blocks per translation" rule. TONEX
// translations are legitimately a single ToneNET search-query block
// (see TONE_ENGINEERING_BIBLE § 8 — capture-driven, not model-driven).
const THIN_OK_PLATFORMS = new Set(["tonex"]);

const REQUIRED_GUITAR_SPEC_FIELDS: (keyof ToneRecipe["guitar_specs"])[] = [
  "body_type",
  "model_name",
  "pickup_config",
  "pickup_position",
  "string_count",
  "scale_length",
  "tuning",
  "string_gauge",
];

const REQUIRED_ORIGINAL_GEAR_FIELDS: (keyof ToneRecipe["original_gear"])[] = [
  "guitar",
  "amp",
  "cabinet",
  "microphone",
];

const HELIX_AMP_INTERNALS = ["Bias", "BiasX", "Sag", "Hum", "Ripple"];

/**
 * Utility-block categories that should mirror across modeller platforms.
 * If Helix has one of these, the other supported translations should
 * too — otherwise the recipe ships an uneven set of presets where one
 * platform has reverb baked in and another doesn't.
 *
 * The exemption matrix below records the platform × category pairs
 * where mirroring is wrong-by-design (e.g. Kemper bakes the cab into
 * the captured profile, so a separate Cab block on Kemper would be
 * incorrect).
 */
const UTILITY_MIRROR_CATEGORIES = [
  "Compressor",
  "Reverb",
  "Delay",
  "EQ",
  "Cab",
] as const;

type UtilityCategory = (typeof UTILITY_MIRROR_CATEGORIES)[number];

const MIRROR_PLATFORMS: Platform[] = [
  "quad_cortex",
  "katana",
  "fractal",
  "kemper",
];

// Pairs that are exempt from mirror checks (correct by design).
const MIRROR_EXEMPTIONS: Record<Platform, Set<UtilityCategory>> = {
  pedalboard: new Set(),
  helix: new Set(),
  quad_cortex: new Set(),
  // Katana Gen 1/2 has no separate compressor block (built into amp
  // section); EQ lives in the Pedal FX slot and isn't always called
  // out as its own block; cab voicing is baked into the Amp Type.
  katana: new Set(["Compressor", "EQ", "Cab"]),
  fractal: new Set(),
  // Kemper's captured Profile bakes cab + amp + post-EQ together — see
  // rule G3 (`kemper-cab-not-separate`).
  kemper: new Set(["Cab", "EQ"]),
  tonex: new Set(["Compressor", "Reverb", "Delay", "EQ", "Cab"]),
};

// Recipes where a pre-amp compressor on Helix is wrong-by-design and the
// `helix-comp-present` rule should not fire. High-gain metal tones get
// their attack-tightening from a drive/boost block (Tube Screamer-style)
// plus a noise gate and the amp's own saturation — a compressor in front
// of the amp would smear the percussive pick attack the style depends on.
// See RECIPE_STANDARD.md → "Compressor exemptions".
const HELIX_COMP_EXEMPT_SLUGS = new Set<string>([
  "dimebag-walk-groove-metal",
]);

// Categories that always indicate a drive/boost block.
const DRIVE_CATEGORIES = new Set(["Distortion", "Booster", "Drive"]);

// Pattern for identifying drive-flavored blocks inside generic-slot
// categories like Kemper "Stomp" (which also hosts comp/wah/EQ).
const DRIVE_NAME_RE =
  /\b(drive|boost|screamer|tube|distort|fuzz|klon|rat|ds-?\d|ts-?\d|overdrive|od-?\d|metal|muff)\b/i;

function isDriveBlock(b: PlatformBlock): boolean {
  if (DRIVE_CATEGORIES.has(b.block_category)) return true;
  if (b.block_category === "Stomp" && DRIVE_NAME_RE.test(b.block_name ?? ""))
    return true;
  return false;
}

function blocksByCategory(
  blocks: PlatformBlock[] | undefined,
  category: string,
): PlatformBlock[] {
  if (!blocks) return [];
  const target = category.toLowerCase();
  return blocks.filter((b) => b.block_category?.toLowerCase() === target);
}

/**
 * Kemper convention: every stomp-slot block uses `block_category: "Stomp"`
 * — comp, drive, EQ, gate, pitch all live there, with the type encoded
 * in the block name. For mirror checks we need to look INSIDE the Stomp
 * category to find comp/reverb/delay/EQ.
 *
 * (Reverb and Delay on Kemper actually have their own dedicated slots
 * with categories "Reverb"/"Delay", so the Stomp-by-name lookup is
 * really only needed for Compressor and EQ.)
 */
const KEMPER_STOMP_NAME_PATTERNS: Record<string, RegExp> = {
  Compressor: /\b(compressor|comp|squash|squeeze|optical)\b/i,
  EQ: /\b(eq|graphic|parametric|tilt|studio eq)\b/i,
};

function platformHasCategory(
  platform: Platform,
  translation: PlatformTranslation,
  category: string,
): boolean {
  if (blocksByCategory(translation.chain_blocks, category).length > 0) {
    return true;
  }
  // Kemper stomp-slot semantic lookup
  if (platform === "kemper") {
    const namePattern = KEMPER_STOMP_NAME_PATTERNS[category];
    if (namePattern) {
      return blocksByCategory(translation.chain_blocks, "Stomp").some((b) =>
        namePattern.test(b.block_name ?? ""),
      );
    }
  }
  return false;
}

function platformExists(
  r: ToneRecipe,
  platform: Platform,
): PlatformTranslation | undefined {
  return r.platform_translations[platform];
}

const HELIX_CAB_FULL_PARAMS = [
  "Mic",
  "Position",
  "Distance",
  "Angle",
  "Pan",
  "LowCut",
  "HighCut",
  "Level",
  "Delay",
];

const COUNT_FLEX_PHRASES = [
  /\b\d+\s+(recipes?|songs?|stories?|articles?|tracks?)\s+(filed|translated|verified|published|written)\b/i,
  /verified\s+by\s+\d+\s+/i,
  /\b\d+\s+(?:tone|sound|tones|sounds)\s+filed\b/i,
];

const RULES: Rule[] = [
  // ── A. Top-level metadata ────────────────────────────────────────────
  {
    slug: "meta-required",
    severity: "error",
    description: "All required top-level fields present",
    check: (r) => {
      const missing: string[] = [];
      if (!r.id) missing.push("id");
      if (!r.slug) missing.push("slug");
      if (!r.song_slug) missing.push("song_slug");
      if (!r.title) missing.push("title");
      if (!r.description) missing.push("description");
      if (!r.tone_context) missing.push("tone_context");
      if (!r.guitar_specs) missing.push("guitar_specs");
      if (!r.signal_chain) missing.push("signal_chain");
      if (!r.original_gear) missing.push("original_gear");
      if (!r.tags) missing.push("tags");
      if (!r.platform_translations) missing.push("platform_translations");
      return missing.length ? `missing: ${missing.join(", ")}` : null;
    },
  },
  {
    slug: "description-substantive",
    severity: "error",
    description: "Description is between 120 and 600 characters",
    check: (r) => {
      const len = r.description?.length ?? 0;
      if (len < 120) return `description too short (${len} chars, need ≥120)`;
      if (len > 600) return `description too long (${len} chars, max 600)`;
      return null;
    },
  },
  {
    slug: "description-no-count-flexing",
    severity: "warn",
    description: "Description does not count-flex (X recipes filed, etc.)",
    check: (r) => {
      const desc = r.description ?? "";
      for (const pattern of COUNT_FLEX_PHRASES) {
        if (pattern.test(desc)) {
          return `count-flex phrase matches: ${pattern.source}`;
        }
      }
      return null;
    },
  },
  {
    slug: "tags-min",
    severity: "error",
    description: "At least 2 tags",
    check: (r) =>
      (r.tags?.length ?? 0) < 2
        ? `${r.tags?.length ?? 0} tag(s), need ≥2`
        : null,
  },
  {
    slug: "sources-min",
    severity: "warn",
    description: "At least one source URL",
    check: (r) =>
      (r.sources?.length ?? 0) < 1 ? "no sources cited" : null,
  },
  {
    slug: "tone-context-valid",
    severity: "error",
    description: "tone_context is one of the canonical values",
    check: (r) =>
      VALID_TONE_CONTEXTS.has(r.tone_context)
        ? null
        : `invalid tone_context: "${r.tone_context}"`,
  },

  // ── B. Guitar specs ─────────────────────────────────────────────────
  {
    slug: "guitar-specs-required",
    severity: "error",
    description: "All required guitar_specs fields populated",
    check: (r) => {
      if (!r.guitar_specs) return "guitar_specs missing";
      const missing = REQUIRED_GUITAR_SPEC_FIELDS.filter((f) => {
        const v = r.guitar_specs[f];
        return v == null || v === "";
      });
      return missing.length ? `missing: ${missing.join(", ")}` : null;
    },
  },

  // ── C. Original signal chain ────────────────────────────────────────
  {
    slug: "signal-chain-min-blocks",
    severity: "error",
    description: "Signal chain has at least 3 blocks",
    check: (r) =>
      (r.signal_chain?.length ?? 0) < 3
        ? `${r.signal_chain?.length ?? 0} block(s), need ≥3`
        : null,
  },
  {
    slug: "signal-chain-has-amp",
    severity: "error",
    description: "Signal chain includes a preamp block",
    check: (r) => {
      const hasAmp = r.signal_chain?.some((b) => b.category === "preamp");
      return hasAmp ? null : "no preamp block in signal_chain";
    },
  },
  {
    slug: "signal-chain-has-cab-or-mic",
    severity: "warn",
    description: "Signal chain includes a cabinet or microphone block",
    check: (r) => {
      const hasCabOrMic = r.signal_chain?.some(
        (b) => b.category === "cabinet" || b.category === "microphone",
      );
      return hasCabOrMic ? null : "no cabinet or microphone in signal_chain";
    },
  },
  {
    slug: "signal-chain-block-notes",
    severity: "warn",
    description: "Every signal-chain block has notes",
    check: (r) => {
      const empty = (r.signal_chain ?? []).filter(
        (b) => !b.notes || b.notes.trim().length < 5,
      );
      if (empty.length === 0) return null;
      return `${empty.length} block(s) missing notes (positions: ${empty
        .map((b) => b.position)
        .join(", ")})`;
    },
  },

  // ── D. Original gear ────────────────────────────────────────────────
  {
    slug: "original-gear-required",
    severity: "error",
    description: "original_gear has guitar, amp, cabinet, microphone",
    check: (r) => {
      if (!r.original_gear) return "original_gear missing";
      const missing = REQUIRED_ORIGINAL_GEAR_FIELDS.filter((f) => {
        const v = r.original_gear[f];
        return v == null || v === "";
      });
      return missing.length ? `missing: ${missing.join(", ")}` : null;
    },
  },
  {
    slug: "original-gear-effects",
    severity: "warn",
    description: "original_gear.effects is an array",
    check: (r) => {
      if (!r.original_gear) return null; // covered by required check
      return Array.isArray(r.original_gear.effects)
        ? null
        : "original_gear.effects is not an array";
    },
  },

  // ── E. Platform translations — global ───────────────────────────────
  {
    slug: "translations-required-platforms",
    severity: "error",
    description: "Has helix, quad_cortex, and katana translations",
    check: (r) => {
      const required = ["helix", "quad_cortex", "katana"] as const;
      const missing = required.filter((p) => !r.platform_translations[p]);
      return missing.length
        ? `missing translations: ${missing.join(", ")}`
        : null;
    },
  },
  {
    slug: "translations-each-has-blocks",
    severity: "error",
    description:
      "Each platform translation has ≥3 chain_blocks (TONEX exempt — single ToneNET block by design)",
    check: (r) => {
      const thin = Object.entries(r.platform_translations)
        .filter(
          ([p, t]) =>
            !THIN_OK_PLATFORMS.has(p) && (t?.chain_blocks?.length ?? 0) < 3,
        )
        .map(([p, t]) => `${p}(${t?.chain_blocks?.length ?? 0})`);
      return thin.length ? `thin chains: ${thin.join(", ")}` : null;
    },
  },
  {
    slug: "translations-each-has-notes",
    severity: "warn",
    description: "Each platform translation has top-level notes",
    check: (r) => {
      const empty = Object.entries(r.platform_translations)
        .filter(([, t]) => !t?.notes || t.notes.trim().length < 5)
        .map(([p]) => p);
      return empty.length ? `no notes: ${empty.join(", ")}` : null;
    },
  },
  {
    slug: "translations-block-notes",
    severity: "warn",
    description: "Every block in every translation has notes",
    check: (r) => {
      const offenders: string[] = [];
      for (const [platform, t] of Object.entries(r.platform_translations)) {
        const tt = t as PlatformTranslation | undefined;
        const empty = (tt?.chain_blocks ?? []).filter(
          (b) => !b.notes || b.notes.trim().length < 5,
        );
        if (empty.length) {
          offenders.push(`${platform}: ${empty.length} block(s)`);
        }
      }
      return offenders.length ? offenders.join("; ") : null;
    },
  },

  // ── E (cont). Cross-platform consistency rules ──────────────────────
  {
    slug: "translations-canonical-knob-order",
    severity: "warn",
    description:
      "Block settings appear in canonical knob order (matches the device's physical front panel)",
    check: (r) => {
      const offenders: string[] = [];
      for (const [platform, t] of Object.entries(r.platform_translations)) {
        const tt = t as PlatformTranslation | undefined;
        for (const block of tt?.chain_blocks ?? []) {
          const canonical = getCanonicalParams(
            platform as Platform,
            block.block_category,
          );
          if (canonical.length === 0) continue;
          const settingKeys = Object.keys(block.settings ?? {});
          // Filter both sides to canonical-only keys, preserving each
          // side's own order. If the relative order of canonical keys
          // in `settings` doesn't match canonical, flag it.
          const inCanonical = new Set(canonical);
          const settingsCanonicalOrder = settingKeys.filter((k) =>
            inCanonical.has(k),
          );
          const canonicalPresent = canonical.filter((c) =>
            settingKeys.includes(c),
          );
          if (
            settingsCanonicalOrder.join("|") !== canonicalPresent.join("|")
          ) {
            offenders.push(
              `${platform} pos ${block.position} (${block.block_category}): got [${settingsCanonicalOrder.join(", ")}], expected [${canonicalPresent.join(", ")}]`,
            );
          }
        }
      }
      return offenders.length ? offenders.join("; ") : null;
    },
  },
  {
    slug: "translations-utility-mirror",
    severity: "warn",
    description:
      "Utility blocks (comp/reverb/delay/EQ/cab) present on Helix mirror across other modeller translations (with platform-aware exemptions)",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null; // mirror is anchored on Helix
      const offenders: string[] = [];
      for (const category of UTILITY_MIRROR_CATEGORIES) {
        const helixHas = blocksByCategory(helix.chain_blocks, category).length > 0;
        if (!helixHas) continue;
        for (const platform of MIRROR_PLATFORMS) {
          const t = platformExists(r, platform);
          if (!t) continue; // only check platforms the recipe defines
          if (MIRROR_EXEMPTIONS[platform].has(category)) continue;
          if (!platformHasCategory(platform, t, category)) {
            offenders.push(`${platform} missing ${category}`);
          }
        }
      }
      return offenders.length ? offenders.join("; ") : null;
    },
  },
  {
    slug: "katana-kemper-multidrive-default-off",
    severity: "info",
    description:
      "When Helix ships a multi-drive stack (≥2 drive blocks), Katana Booster + Kemper Stomp drive blocks default OFF so the player picks the flavor",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const helixDriveCount = helix.chain_blocks.filter(isDriveBlock).length;
      if (helixDriveCount < 2) return null;

      const offenders: string[] = [];
      const katana = r.platform_translations.katana;
      if (katana) {
        for (const b of katana.chain_blocks) {
          if (isDriveBlock(b) && b.enabled !== false) {
            offenders.push(
              `katana ${b.block_category} pos ${b.position} default-on`,
            );
          }
        }
      }
      const kemper = r.platform_translations.kemper;
      if (kemper) {
        for (const b of kemper.chain_blocks) {
          if (isDriveBlock(b) && b.enabled !== false) {
            offenders.push(
              `kemper ${b.block_category} pos ${b.position} default-on`,
            );
          }
        }
      }
      return offenders.length ? offenders.join("; ") : null;
    },
  },

  // ── F. Helix-specific quality rules ─────────────────────────────────
  {
    slug: "helix-block-count",
    severity: "warn",
    description: "Helix translation has ≥6 blocks",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const n = helix.chain_blocks?.length ?? 0;
      return n < 6 ? `${n} blocks, recommend ≥6` : null;
    },
  },
  {
    slug: "helix-comp-present",
    severity: "warn",
    description:
      "Helix chain includes a Compressor block before the Amp (after volume pedal / noise gate is OK)",
    check: (r) => {
      if (HELIX_COMP_EXEMPT_SLUGS.has(r.slug)) return null;
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const comp = helix.chain_blocks.find(
        (b) => b.block_category?.toLowerCase() === "compressor",
      );
      if (!comp) return "no Compressor block";
      const amp = helix.chain_blocks.find(
        (b) => b.block_category?.toLowerCase() === "amp",
      );
      if (!amp) return null; // amp-presence is checked elsewhere
      if (comp.position >= amp.position) {
        return `Compressor at position ${comp.position}, after Amp at ${amp.position}`;
      }
      return null;
    },
  },
  {
    slug: "helix-amp-internals",
    severity: "warn",
    description: "Helix amp block has Bias/BiasX/Sag/Hum/Ripple internals",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const amp = helix.chain_blocks.find(
        (b) => b.block_category?.toLowerCase() === "amp",
      );
      if (!amp) return "no amp block (separate check covers this)";
      const missing = HELIX_AMP_INTERNALS.filter(
        (k) => !(k in (amp.settings ?? {})),
      );
      return missing.length
        ? `amp internals missing: ${missing.join(", ")}`
        : null;
    },
  },
  {
    slug: "helix-cab-full-params",
    severity: "warn",
    description:
      "Helix cab block has Mic/Position/Distance/Angle/Pan/LowCut/HighCut/Level/Delay",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const cab = helix.chain_blocks.find(
        (b) => b.block_category?.toLowerCase() === "cab",
      );
      if (!cab) return "no cab block";
      const missing = HELIX_CAB_FULL_PARAMS.filter(
        (k) => !(k in (cab.settings ?? {})),
      );
      return missing.length
        ? `cab params missing: ${missing.join(", ")}`
        : null;
    },
  },
  {
    slug: "helix-reverb-cuts",
    severity: "warn",
    description: "Helix reverb has LowCut (80-300 Hz) + HighCut (5-9 kHz)",
    check: (r) => {
      const helix = r.platform_translations.helix;
      if (!helix) return null;
      const reverb = helix.chain_blocks.find(
        (b) => b.block_category?.toLowerCase() === "reverb",
      );
      if (!reverb) return null; // not all recipes need reverb
      const lowCut = Number(reverb.settings?.LowCut);
      const highCut = Number(reverb.settings?.HighCut);
      const issues: string[] = [];
      if (!Number.isFinite(lowCut))
        issues.push("no LowCut");
      else if (lowCut < 80 || lowCut > 300)
        issues.push(`LowCut=${lowCut} (expected 80-300 Hz)`);
      if (!Number.isFinite(highCut)) issues.push("no HighCut");
      else if (highCut < 5000 || highCut > 9000)
        issues.push(`HighCut=${highCut} (expected 5000-9000 Hz)`);
      return issues.length ? issues.join("; ") : null;
    },
  },
];

// ─────────────────────────────────────────────────────────────────────
//  Run rules
// ─────────────────────────────────────────────────────────────────────

interface RuleResult {
  rule: Rule;
  reason: string;
}

interface RecipeReport {
  recipe: ToneRecipe;
  errors: RuleResult[];
  warns: RuleResult[];
  infos: RuleResult[];
}

function gradeRecipe(r: ToneRecipe): RecipeReport {
  const errors: RuleResult[] = [];
  const warns: RuleResult[] = [];
  const infos: RuleResult[] = [];
  for (const rule of RULES) {
    let reason: string | null = null;
    try {
      reason = rule.check(r);
    } catch (err) {
      reason = `check threw: ${(err as Error).message}`;
    }
    if (reason) {
      const result: RuleResult = { rule, reason };
      if (rule.severity === "error") errors.push(result);
      else if (rule.severity === "warn") warns.push(result);
      else infos.push(result);
    }
  }
  return { recipe: r, errors, warns, infos };
}

const reports = toneRecipes.map(gradeRecipe);

// ─────────────────────────────────────────────────────────────────────
//  Summarize
// ─────────────────────────────────────────────────────────────────────

const total = reports.length;
const cleanCount = reports.filter(
  (r) => r.errors.length === 0 && r.warns.length === 0,
).length;
const errCount = reports.filter((r) => r.errors.length > 0).length;
const warnOnlyCount = reports.filter(
  (r) => r.errors.length === 0 && r.warns.length > 0,
).length;

// Per-rule failure counts
const ruleStats = new Map<string, { rule: Rule; count: number }>();
for (const rep of reports) {
  for (const result of [...rep.errors, ...rep.warns, ...rep.infos]) {
    const existing = ruleStats.get(result.rule.slug);
    if (existing) existing.count += 1;
    else ruleStats.set(result.rule.slug, { rule: result.rule, count: 1 });
  }
}
const sortedRuleStats = [...ruleStats.values()].sort(
  (a, b) => b.count - a.count,
);

// ─────────────────────────────────────────────────────────────────────
//  Render report
// ─────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

const lines: string[] = [];
lines.push("# Recipe Audit Report");
lines.push("");
lines.push(`**Date:** ${today}`);
lines.push(`**Recipes:** ${total}`);
lines.push(`**Clean (no errors, no warns):** ${cleanCount}`);
lines.push(`**Warn-only:** ${warnOnlyCount}`);
lines.push(`**With errors:** ${errCount}`);
lines.push("");
lines.push("> Generated by `scripts/audit-recipes.mts`. Spec lives at");
lines.push("> [docs/RECIPE_STANDARD.md](RECIPE_STANDARD.md). Don't hand-edit");
lines.push("> this file — re-run the audit instead.");
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Failures by rule (most-frequent first)");
lines.push("");
lines.push("| Rule | Severity | Recipes failing | Description |");
lines.push("| --- | --- | --- | --- |");
for (const { rule, count } of sortedRuleStats) {
  lines.push(
    `| \`${rule.slug}\` | ${rule.severity} | ${count} / ${total} | ${rule.description} |`,
  );
}
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Per-recipe results");
lines.push("");

const sortedReports = [...reports].sort((a, b) => {
  if (b.errors.length !== a.errors.length)
    return b.errors.length - a.errors.length;
  if (b.warns.length !== a.warns.length)
    return b.warns.length - a.warns.length;
  return a.recipe.slug.localeCompare(b.recipe.slug);
});

for (const rep of sortedReports) {
  const status =
    rep.errors.length > 0
      ? `❌ ${rep.errors.length} error${rep.errors.length === 1 ? "" : "s"}`
      : rep.warns.length > 0
        ? `⚠ ${rep.warns.length} warn${rep.warns.length === 1 ? "" : "s"}`
        : "✓ clean";
  lines.push(`### \`${rep.recipe.slug}\` — ${status}`);
  lines.push("");
  lines.push(`*${rep.recipe.title}*`);
  lines.push("");
  if (rep.errors.length === 0 && rep.warns.length === 0) {
    lines.push("Passes every rule.");
    lines.push("");
    continue;
  }
  if (rep.errors.length > 0) {
    lines.push("**Errors:**");
    for (const e of rep.errors) {
      lines.push(`- \`${e.rule.slug}\` — ${e.reason}`);
    }
    lines.push("");
  }
  if (rep.warns.length > 0) {
    lines.push("**Warnings:**");
    for (const w of rep.warns) {
      lines.push(`- \`${w.rule.slug}\` — ${w.reason}`);
    }
    lines.push("");
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = resolve(__dirname, "..", "docs", "RECIPE_AUDIT_REPORT.md");
writeFileSync(outPath, lines.join("\n"), "utf8");

// ─────────────────────────────────────────────────────────────────────
//  Console summary
// ─────────────────────────────────────────────────────────────────────

console.log(`\nRecipe audit · ${total} recipes\n`);
console.log(`  Clean:        ${cleanCount}`);
console.log(`  Warn-only:    ${warnOnlyCount}`);
console.log(`  With errors:  ${errCount}`);
console.log("");
console.log(`Report:  docs/RECIPE_AUDIT_REPORT.md`);
console.log("");
console.log("Top offending rules:");
for (const { rule, count } of sortedRuleStats.slice(0, 6)) {
  console.log(
    `  [${rule.severity.padEnd(5)}] ${rule.slug.padEnd(34)} ${count}/${total}`,
  );
}
console.log("");
