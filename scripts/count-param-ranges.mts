/**
 * Measures the `settings-outside-unverified-range` ledger in
 * docs/PARAM_RANGE_AUDIT.md.
 *
 * Added 2026-09-06 by the weekly audit. The ledger was hand-counted once on
 * 2026-08-05 (2,666 values) and had no regeneration path, so it could not show
 * whether the debt was shrinking or growing. It was growing: the same
 * measurement on 2026-09-06 returned 3,059. The catalog gained 20 recipes over
 * that month while zero additional ranges were marked `rangeVerified`, so the
 * ledger grows with the corpus by construction.
 *
 * Read the two totals as different things:
 *   - VERIFIED out-of-range is a real defect count and must stay 0. The audit
 *     already raises it as an error; this script just makes it visible.
 *   - UNVERIFIED out-of-range is the ledger — ranges that need checking
 *     against hardware, not bad data. Falling is progress; rising alongside
 *     recipe count is the status quo, not a regression.
 *
 * Usage: npx tsx scripts/count-param-ranges.mts
 */
import { toneRecipes } from "../src/lib/data";
import { lookupParam } from "../src/lib/parameters/registry";

let verified = 0;
let unverified = 0;
const byParam = new Map<string, number>();
const byPlatform = new Map<string, number>();

for (const r of toneRecipes) {
  for (const [platform, t] of Object.entries((r as any).platform_translations ?? {})) {
    for (const block of (t as any)?.chain_blocks ?? []) {
      for (const [key, value] of Object.entries(block.settings ?? {})) {
        if (typeof value !== "number") continue;
        const meta = lookupParam(key, block.block_category);
        // Unknown params render as plain numbers and have no range to violate;
        // "text" params aren't controls. Same exclusions as audit-recipes.ts.
        if (!meta || meta.kind === "text") continue;
        if (value < meta.min || value > meta.max) {
          if (meta.rangeVerified) {
            verified++;
          } else {
            unverified++;
            byParam.set(key, (byParam.get(key) ?? 0) + 1);
            byPlatform.set(platform, (byPlatform.get(platform) ?? 0) + 1);
          }
        }
      }
    }
  }
}

console.log(`Recipes: ${toneRecipes.length}`);
console.log(`Out-of-range, VERIFIED ranges (must be 0): ${verified}`);
console.log(`Out-of-range, UNVERIFIED ranges (the ledger): ${unverified}`);

console.log("\nTop parameters:");
[...byParam.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(5)}  ${k}`));

console.log("\nBy platform:");
[...byPlatform.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(5)}  ${k}`));

if (verified > 0) {
  console.error(`\nFAIL: ${verified} value(s) out of a VERIFIED range.`);
  process.exit(1);
}
