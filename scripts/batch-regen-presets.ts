/**
 * Batch-regenerate every .hlx in public/presets/ from the current
 * recipe data, run a deterministic QC pass against the output, and
 * print a summary.
 *
 * Maps a .hlx filename → recipe slug (cleaning trailing version
 * suffixes like "-v2" or "-clean-build" so we can find the right
 * recipe). For each recipe with a Helix translation, regenerates
 * the .hlx in place.
 *
 * Deterministic QC catches the bugs we already know about:
 *   - LowCut / HighCut clamped to 1
 *   - Threshold === 0 in compressor (signed-dB clamp)
 *   - Mix < 0.01 (the /100 bug)
 *   - HD2_DistMinotaur on a non-Minotaur block
 *   - Made-up Mica/Positiona/Micb/Positionb keys
 *   - Multi-drive stacks with > 1 enabled drive
 *
 * Usage: npx tsx scripts/batch-regen-presets.ts
 *        npx tsx scripts/batch-regen-presets.ts --dry-run
 */
import fs from "fs";
import path from "path";
import { generateHelixPreset } from "../src/lib/helix/generate-hlx";
import { getRecipeBySlug, toneRecipes } from "../src/lib/data";

const PRESETS_DIR = path.join(process.cwd(), "public", "presets");
const DRY_RUN = process.argv.includes("--dry-run");

interface QcFinding {
  block: string;
  param?: string;
  value?: unknown;
  message: string;
  severity: "critical" | "warn";
}

function qcCheck(hlxJson: string, recipeBlocks: { block_name: string }[]): QcFinding[] {
  const f: QcFinding[] = [];
  const data = JSON.parse(hlxJson);
  const dsp0 = data.data?.tone?.dsp0 ?? {};

  for (let i = 0; i < recipeBlocks.length; i++) {
    const key = `block${i}`;
    const block = dsp0[key];
    const recipeName = recipeBlocks[i]?.block_name ?? "?";
    if (!block) continue;
    const model = block["@model"];

    // Minotaur fallback on non-Minotaur recipe
    if (model === "HD2_DistMinotaur" && recipeName !== "Minotaur") {
      f.push({ block: key, message: `model fallback to Minotaur (recipe: "${recipeName}")`, severity: "critical" });
    }

    // Made-up cab keys
    for (const k of Object.keys(block)) {
      if (k === "Mica" || k === "Micb" || k === "Positiona" || k === "Positionb" || k === "Earlyreflections") {
        f.push({ block: key, param: k, message: `mangled cab param key (should be Mic/Position)`, severity: "critical" });
      }
    }

    // Hz clamp bug — LowCut/HighCut === 1 means it got divided then clamped
    if (block.LowCut === 1) {
      f.push({ block: key, param: "LowCut", value: 1, message: "Hz value clamped — likely /10 + clamp bug", severity: "critical" });
    }
    if (block.HighCut === 1) {
      f.push({ block: key, param: "HighCut", value: 1, message: "Hz value clamped — likely /10 + clamp bug", severity: "critical" });
    }

    // Compressor clamp/scale bugs
    if (model === "HD2_CompressorDeluxeComp") {
      if (block.Threshold === 0) {
        f.push({ block: key, param: "Threshold", message: "Threshold=0 (signed-dB clamped to zero)", severity: "critical" });
      }
      if (typeof block.Mix === "number" && block.Mix < 0.01 && block.Mix > 0) {
        f.push({ block: key, param: "Mix", value: block.Mix, message: "Mix < 0.01 (likely /100 bug)", severity: "critical" });
      }
      if (typeof block.Ratio === "number" && block.Ratio < 1 && block.Ratio > 0) {
        f.push({ block: key, param: "Ratio", value: block.Ratio, message: "Ratio < 1 (likely /10 bug)", severity: "critical" });
      }
    }

    // Reverb / delay Mix /100 bug
    if (model && (model.startsWith("HD2_Reverb") || model.startsWith("HD2_Delay"))) {
      if (typeof block.Mix === "number" && block.Mix < 0.01 && block.Mix > 0) {
        f.push({ block: key, param: "Mix", value: block.Mix, message: "Mix < 0.01 (likely /100 bug)", severity: "critical" });
      }
      if (typeof block.Feedback === "number" && block.Feedback >= 0.95) {
        f.push({ block: key, param: "Feedback", value: block.Feedback, message: "Feedback ≥ 0.95 (self-oscillation)", severity: "critical" });
      }
    }
  }

  // Multi-drive: > 1 enabled drive
  const enabledDrives = recipeBlocks
    .map((b, i) => ({ b, i, hlx: dsp0[`block${i}`] }))
    .filter(({ hlx }) => hlx && typeof hlx["@model"] === "string" && hlx["@model"].startsWith("HD2_Dist") && hlx["@enabled"] === true);
  if (enabledDrives.length > 1) {
    f.push({ block: "(chain)", message: `${enabledDrives.length} drive blocks enabled simultaneously`, severity: "warn" });
  }

  return f;
}

/**
 * Resolve a .hlx filename to a recipe slug. Filenames don't always
 * exactly match the recipe slug (recipes evolved beyond the original
 * preset names), so we fall back to substring matching against the
 * full recipe list.
 */
function resolveSlug(filename: string): string | null {
  const cleaned = filename
    .replace(/\.hlx$/, "")
    .replace(/-v\d+$/, "")
    .replace(/-clean-build$/, "")
    .replace(/-delay$/, "")
    // Drop common artist-name prefixes (john-, the-) so substring
    // matches catch e.g. "john-mayer-gravity-clean" → "mayer-gravity-*"
    .replace(/^(john|the|jimi|david|alex|brian|billy|eric|carlos|chuck)-/, "");

  // 1. Exact match
  if (getRecipeBySlug(cleaned)) return cleaned;

  // 2. Recipe slug starts with the filename slug
  const startsWith = toneRecipes.find((r) => r.slug.startsWith(cleaned + "-"));
  if (startsWith) return startsWith.slug;

  // 3. Filename slug is contained inside a recipe slug
  const contains = toneRecipes.find((r) => r.slug.includes(cleaned));
  if (contains) return contains.slug;

  // 4. Reverse — any recipe slug whose key terms all appear in the filename
  const tokens = cleaned.split("-").filter((t) => t.length > 2);
  const tokenMatch = toneRecipes.find((r) =>
    tokens.every((t) => r.slug.includes(t)),
  );
  if (tokenMatch) return tokenMatch.slug;

  return null;
}

const hlxFiles = fs.readdirSync(PRESETS_DIR).filter((f) => f.endsWith(".hlx"));
console.log(`\nFound ${hlxFiles.length} .hlx files in public/presets/\n`);

let regenerated = 0;
let skipped = 0;
let totalCritical = 0;
let totalWarn = 0;

for (const filename of hlxFiles) {
  const slug = resolveSlug(filename);
  const recipe = slug ? getRecipeBySlug(slug) : null;

  if (!slug || !recipe) {
    console.log(`✗ ${filename} — no recipe match`);
    skipped++;
    continue;
  }
  const helix = recipe.platform_translations?.helix;
  if (!helix) {
    console.log(`✗ ${filename} — recipe has no helix translation`);
    skipped++;
    continue;
  }

  const out = generateHelixPreset(helix, recipe.title);
  const findings = qcCheck(out, helix.chain_blocks);
  const crits = findings.filter((x) => x.severity === "critical");
  const warns = findings.filter((x) => x.severity === "warn");
  totalCritical += crits.length;
  totalWarn += warns.length;

  if (!DRY_RUN) {
    fs.writeFileSync(path.join(PRESETS_DIR, filename), out);
  }

  const status = crits.length > 0 ? "FAIL" : warns.length > 0 ? "WARN" : "PASS";
  console.log(`${status === "PASS" ? "✓" : status === "WARN" ? "⚠" : "✗"} ${filename} (${slug}) — ${status}${crits.length || warns.length ? ` (${crits.length} crit, ${warns.length} warn)` : ""}`);
  for (const x of crits) {
    console.log(`    [crit] ${x.block}${x.param ? `.${x.param}` : ""}: ${x.message}${x.value !== undefined ? ` (=${x.value})` : ""}`);
  }
  for (const x of warns) {
    console.log(`    [warn] ${x.block}${x.param ? `.${x.param}` : ""}: ${x.message}`);
  }
  regenerated++;
}

console.log(`\n--- Summary ---`);
console.log(`Regenerated: ${regenerated}${DRY_RUN ? " (dry-run, nothing written)" : ""}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total critical findings: ${totalCritical}`);
console.log(`Total warnings: ${totalWarn}`);
console.log(`Verdict: ${totalCritical === 0 ? "ALL CLEAR" : "BUGS REMAIN"}\n`);
