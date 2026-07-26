/**
 * One-shot: zero the seeded engagement stats in src/lib/data/index.ts.
 *
 * 35 recipes from the March batch shipped with `rating_avg` 4.3–4.7 and
 * `view_count` up to 3,456 while `rating_count` was 0 — i.e. an average
 * derived from no ratings, and view counts no one counted. Every other
 * recipe is all-zero, and nothing in the app writes these fields, so the
 * numbers were seed data that survived into production.
 *
 * That conflicts with the site's own honesty rules (no fabricated
 * community data), and the repo is public, so the seeding is readable by
 * anyone. This zeroes them. `getVerificationLevel()` in src/lib/verification.ts
 * requires rating_count >= 5 for "community_verified", so no badge
 * regresses — those recipes never qualified.
 *
 * Usage: npx tsx scripts/zero-seeded-stats.ts [--dry]
 */

import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "src", "lib", "data", "index.ts");
const dry = process.argv.includes("--dry");

const src = fs.readFileSync(DATA, "utf8");

let viewsZeroed = 0;
let ratingsZeroed = 0;

const out = src
  .replace(/^(\s*)view_count: (\d+),$/gm, (m, indent, n) => {
    if (n === "0") return m;
    viewsZeroed++;
    return `${indent}view_count: 0,`;
  })
  .replace(/^(\s*)rating_avg: ([\d.]+),$/gm, (m, indent, n) => {
    if (n === "0") return m;
    ratingsZeroed++;
    return `${indent}rating_avg: 0,`;
  });

console.log(`view_count values zeroed:  ${viewsZeroed}`);
console.log(`rating_avg values zeroed:  ${ratingsZeroed}`);

if (dry) {
  console.log("(dry run — nothing written)");
} else {
  fs.writeFileSync(DATA, out);
  console.log(`wrote ${DATA}`);
}
