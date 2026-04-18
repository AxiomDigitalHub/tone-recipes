/**
 * Master-volume audit script.
 *
 * Context: as of 2026-04-17 almost half of the recipes in our catalog had
 * Master = 1 on amp blocks, which is nearly silent / power-amp bypassed.
 * For a modeled amp the convention is Master at 10, Channel Volume sets
 * loudness — that's how Van Halen / SRV / most Marshall-style rigs are
 * actually dialed. Master = 1 is almost certainly a baseline pipeline
 * default that escaped without review.
 *
 * This script doesn't change anything. It produces a report listing every
 * recipe/platform/block where Master is below 7, so you (the editor) can
 * decide recipe-by-recipe whether to bump it. When you're ready to edit:
 *
 *   1. Run: npx tsx scripts/audit-master-volume.ts
 *   2. Review the output.
 *   3. For each recipe you want to fix, edit src/lib/data/index.ts directly
 *      or patch via a follow-up script.
 *
 * A future version of this script could accept a --apply flag that rewrites
 * the data automatically once you've decided on a blanket rule. Left as
 * read-only for now since the generated .hlx files go to real customers.
 */

import { toneRecipes } from "../src/lib/data";

interface Row {
  recipe: string;
  platform: string;
  blockName: string;
  blockCategory: string;
  master: number;
  chVol?: number;
  mv?: number;
}

const rows: Row[] = [];

for (const r of toneRecipes) {
  for (const [platform, pt] of Object.entries(r.platform_translations ?? {})) {
    for (const b of pt?.chain_blocks ?? []) {
      const settings = b.settings ?? {};
      const master = settings.Master;
      if (typeof master !== "number") continue;
      rows.push({
        recipe: r.slug,
        platform,
        blockName: b.block_name || "?",
        blockCategory: b.block_category || "?",
        master,
        chVol: typeof settings["Ch Vol"] === "number" ? (settings["Ch Vol"] as number) : undefined,
        mv: typeof settings.MV === "number" ? (settings.MV as number) : undefined,
      });
    }
  }
}

const low = rows.filter((r) => r.master < 7).sort((a, b) => a.master - b.master);
const ok = rows.filter((r) => r.master >= 7);

function fmt(n: number | undefined): string {
  return typeof n === "number" ? n.toString().padStart(4) : "   —";
}

console.log("=".repeat(90));
console.log("MASTER VOLUME AUDIT");
console.log("=".repeat(90));
console.log(`Total amp blocks with Master parameter: ${rows.length}`);
console.log(`  Master ≥ 7 (probably fine):  ${ok.length}`);
console.log(`  Master < 7 (review these):    ${low.length}`);
console.log();

console.log("RECIPES WITH LOW MASTER (candidates to fix):");
console.log("-".repeat(90));
console.log(
  "Master  ChVol   MV   Platform      Recipe / Amp block",
);
console.log("-".repeat(90));
for (const r of low) {
  console.log(
    `${fmt(r.master)}  ${fmt(r.chVol)}  ${fmt(r.mv)}   ${r.platform.padEnd(13)} ${r.recipe} / ${r.blockName}`,
  );
}

console.log();
console.log("RECOMMENDED RULE OF THUMB:");
console.log("  - Marshall / Plexi / modern high-gain: Master 10, Ch Vol 5-8");
console.log("  - Fender clean (Deluxe, Twin): Master 7-10, Ch Vol 5-8");
console.log("  - Bedroom-volume preference overrides the above — some recipes");
console.log("    intentionally dial Master lower to prevent bedroom breakup.");
console.log();
console.log("Update src/lib/data/index.ts once you've decided.");
