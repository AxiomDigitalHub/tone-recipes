/**
 * Precompute the per-recipe verification summary.
 *
 * Writes `src/data/recipe-verification.json`, a small slug → summary map that
 * recipe *cards* read. The recipe page itself calls `verifyRecipe()` live
 * (it's a server component, so there is no bundle cost and no staleness risk);
 * this file exists only so a client-side card can show the same verdict
 * without pulling three preset generators and the DSP cost table into the
 * browser.
 *
 * Because it is committed, a change in the corpus's defect rate shows up as a
 * reviewable diff rather than a silent shift — which is the point of
 * publishing the number at all.
 *
 *   npx tsx scripts/generate-verification-data.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { toneRecipes } from "../src/lib/data";
import { verifyRecipe } from "../src/lib/recipe-verification";
import { getVerificationLevel } from "../src/lib/verification";

interface Summary {
  level: "complete" | "partial" | "unbuilt";
  /** Platforms whose preset contains every block in the chain. */
  completePlatforms: string[];
  droppedCount: number;
  substitutedCount: number;
}

// The generators warn about skipped blocks; we're counting them, not debugging.
const realWarn = console.warn;
console.warn = () => {};

const out: Record<string, Summary> = {};
const tally = { complete: 0, partial: 0, unbuilt: 0 };

for (const recipe of toneRecipes) {
  const v = verifyRecipe(recipe);
  const level = getVerificationLevel(recipe);
  tally[level]++;
  out[recipe.slug] = {
    level,
    completePlatforms: v.presets
      .filter((p) => p.built && !p.droppedBlocks.length && !p.substitutedBlocks.length)
      .map((p) => p.platform),
    droppedCount: v.presets.reduce((n, p) => n + p.droppedBlocks.length, 0),
    substitutedCount: v.presets.reduce((n, p) => n + p.substitutedBlocks.length, 0),
  };
}

console.warn = realWarn;

const target = join(process.cwd(), "src/data/recipe-verification.json");
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");

console.log(`wrote ${target}`);
console.log(`  ${toneRecipes.length} recipes`);
console.log(`  complete: ${tally.complete}   partial: ${tally.partial}   unbuilt: ${tally.unbuilt}`);
