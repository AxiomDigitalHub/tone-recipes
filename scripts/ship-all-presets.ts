/**
 * Generate .hlx files for every recipe in the data file that has a
 * Helix platform translation, and ship them all to public/presets/.
 *
 * Usage:
 *   npx tsx scripts/ship-all-presets.ts             # full sweep
 *   npx tsx scripts/ship-all-presets.ts --dry-run   # preview
 *
 * The script walks `toneRecipes` from src/lib/data/index.ts, filters
 * to recipes with a `platform_translations.helix` block, runs each
 * through `generateHelixPreset`, and writes the output to
 * `public/presets/<recipe-slug>.hlx`.
 *
 * Failures (skipped blocks, no helix translation, etc.) are logged
 * but don't abort the run. The summary at the end lists every preset
 * shipped + any that needed manual attention.
 */
import fs from "fs";
import path from "path";
import { generateHelixPreset } from "../src/lib/helix/generate-hlx";
import { toneRecipes } from "../src/lib/data";

const DRY_RUN = process.argv.includes("--dry-run");
const PRESETS_DIR = path.join(process.cwd(), "public", "presets");
fs.mkdirSync(PRESETS_DIR, { recursive: true });

const written: string[] = [];
const skipped: { slug: string; reason: string }[] = [];

for (const recipe of toneRecipes) {
  const helix = recipe.platform_translations?.helix;
  if (!helix) {
    skipped.push({ slug: recipe.slug, reason: "no helix translation" });
    continue;
  }
  if (!helix.chain_blocks || helix.chain_blocks.length === 0) {
    skipped.push({ slug: recipe.slug, reason: "empty chain_blocks" });
    continue;
  }

  try {
    const out = generateHelixPreset(helix, recipe.title);
    const filename = `${recipe.slug}.hlx`;
    const outPath = path.join(PRESETS_DIR, filename);
    if (!DRY_RUN) {
      fs.writeFileSync(outPath, out);
    }
    written.push(`${recipe.slug} (${out.length} bytes)`);
  } catch (e) {
    skipped.push({ slug: recipe.slug, reason: `error: ${e}` });
  }
}

console.log(`\n=== Summary ===`);
console.log(`Recipes processed: ${toneRecipes.length}`);
console.log(`Presets ${DRY_RUN ? "would be " : ""}written: ${written.length}`);
console.log(`Skipped: ${skipped.length}`);
if (skipped.length > 0) {
  console.log(`\nSkipped recipes:`);
  for (const s of skipped) console.log(`  ${s.slug}: ${s.reason}`);
}
console.log(`\nOutput dir: ${PRESETS_DIR}`);
