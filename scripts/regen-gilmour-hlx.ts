/**
 * Regenerate the Gilmour Comfortably Numb solo .hlx from the recipe
 * data so we can QC the post-fix output.
 *
 * Usage: npx tsx scripts/regen-gilmour-hlx.ts
 */
import fs from "fs";
import path from "path";
import { generateHelixPreset } from "../src/lib/helix/generate-hlx";
import { getRecipeBySlug } from "../src/lib/data";

const slug = process.argv[2] ?? "gilmour-comfortably-numb-solo";
const recipe = getRecipeBySlug(slug);
if (!recipe) {
  console.error(`No recipe with slug "${slug}"`);
  process.exit(1);
}
const helix = recipe.platform_translations?.helix;
if (!helix) {
  console.error(`Recipe "${slug}" has no helix translation`);
  process.exit(1);
}

const out = generateHelixPreset(helix, recipe.title);
const outPath = path.join(
  process.cwd(),
  "scripts",
  `_regen-${slug}.hlx`,
);
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${out.length} bytes)`);
