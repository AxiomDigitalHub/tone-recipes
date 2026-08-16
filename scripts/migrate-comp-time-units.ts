/**
 * Migration: put every compressor Attack / Release value in milliseconds.
 *
 * Background
 * ----------
 * `Attack` and `Release` are written two ways across the corpus — 176 values
 * in seconds (`Attack: 0.04`) and 1,243 in milliseconds (`Attack: 40`) — the
 * same parameter, the same meaning, two scales. That inconsistency had two
 * visible consequences:
 *
 * 1. **The page lied.** `src/lib/parameters/registry.ts` declared Attack and
 *    Release as `min 0, max 1, unit "s"`, so a 60 ms attack rendered as
 *    "Attack 60s" — on a knob whose range says 0–1. `/about` promises "every
 *    knob value reads in the actual unit your modeler expects", and this was
 *    the loudest counterexample on the site.
 *
 * 2. **The preset was wrong.** `scaleParamValue()` had no rule for attack or
 *    release, so any value above 10 fell through to a final
 *    `Math.min(1, num)` clamp. Every millisecond-scale value became **1.0** —
 *    maximum attack, maximum release — in every generated .hlx. A compressor
 *    with maximum attack does essentially nothing to a transient.
 *
 * Which unit is correct
 * ---------------------
 * Ground truth from `data/helix-corpus/models.json`, built from 256 real
 * presets: Helix stores these as *seconds* as a float —
 * `HD2_CompressorDeluxeComp` shows `Attack 0.0001..0.072` and
 * `Release 0.064..2.009`. So the .hlx wants seconds, and the corpus's
 * millisecond values are the human-readable form.
 *
 * The fix is therefore split in two, and this script is only the first half:
 *
 * - **Here:** normalise the corpus so Attack/Release are always milliseconds
 *   (the form a player reads off their unit), by multiplying the 176
 *   seconds-scale values by 1000.
 * - **In `model-map.ts`:** convert ms → seconds when emitting the .hlx, and
 *   stop clamping to 1.
 * - **In `registry.ts`:** declare the parameters as `ms` with a range that
 *   matches the hardware.
 *
 * Attack/Release appear only on compressor blocks in this corpus
 * (`HD2_CompressorDeluxeComp`, `HD2_CompressorLAStudioComp`), so there is no
 * collision with the discrete "Attack" voicing switch some drive models carry.
 * The script asserts that before touching anything.
 *
 *   npx tsx scripts/migrate-comp-time-units.ts          # dry run: report only
 *   npx tsx scripts/migrate-comp-time-units.ts --apply  # rewrites the corpus
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const APPLY = process.argv.includes("--apply");
const DATA_FILE = join(process.cwd(), "src/lib/data/index.ts");
const REPORT_FILE = join(process.cwd(), "docs/COMP_TIME_UNIT_MIGRATION.md");

/** Params this migration touches. */
const TIME_PARAMS = new Set(["Attack", "Release"]);

/**
 * Below this, a value is read as seconds and converted. Above it, the value is
 * already milliseconds and is left alone. 1 is the right cut because no real
 * compressor is set to a 1 ms release, and a 1-second attack would be written
 * as 1000 under the target convention.
 */
const SECONDS_CUTOFF = 1;

/**
 * Block names that legitimately carry a non-time `Attack` (a discrete voicing
 * switch, not a duration). If one of these ever shows up carrying Attack, the
 * migration stops rather than silently dividing a switch position.
 */
const NON_TIME_ATTACK_BLOCKS = new Set([
  "Horizon Drive",
  "Obsidian 7000",
]);

const source = readFileSync(DATA_FILE, "utf8");
const sf = ts.createSourceFile(DATA_FILE, source, ts.ScriptTarget.Latest, true);

const propName = (p: ts.ObjectLiteralElementLike): string | undefined => {
  if (!ts.isPropertyAssignment(p)) return undefined;
  const n = p.name;
  if (ts.isIdentifier(n) || ts.isStringLiteral(n)) return n.text;
  return undefined;
};
const getProp = (obj: ts.ObjectLiteralExpression, name: string) =>
  obj.properties.find((p) => propName(p) === name) as ts.PropertyAssignment | undefined;
const asObject = (n?: ts.Node) =>
  n && ts.isPropertyAssignment(n) && ts.isObjectLiteralExpression(n.initializer)
    ? n.initializer
    : undefined;
const asArray = (n?: ts.Node) =>
  n && ts.isPropertyAssignment(n) && ts.isArrayLiteralExpression(n.initializer)
    ? n.initializer
    : undefined;
const strVal = (n?: ts.PropertyAssignment) =>
  n && ts.isStringLiteral(n.initializer) ? n.initializer.text : undefined;

type Edit = { start: number; end: number; text: string };
type Change = {
  slug: string;
  platform: string;
  block: string;
  param: string;
  before: number;
  after: number;
};

const edits: Edit[] = [];
const changes: Change[] = [];
let alreadyMs = 0;

let recipesArray: ts.ArrayLiteralExpression | undefined;
sf.forEachChild((node) => {
  if (!ts.isVariableStatement(node)) return;
  for (const d of node.declarationList.declarations) {
    if (
      ts.isIdentifier(d.name) &&
      d.name.text === "toneRecipes" &&
      d.initializer &&
      ts.isArrayLiteralExpression(d.initializer)
    )
      recipesArray = d.initializer;
  }
});
if (!recipesArray) throw new Error("Could not locate toneRecipes array literal");

for (const recipeNode of recipesArray.elements) {
  if (!ts.isObjectLiteralExpression(recipeNode)) continue;
  const slug = strVal(getProp(recipeNode, "slug")) ?? "(unknown)";

  const translations = asObject(getProp(recipeNode, "platform_translations"));
  if (!translations) continue;

  for (const platProp of translations.properties) {
    const platform = propName(platProp);
    if (!platform) continue;
    const plat = asObject(platProp);
    const blocks = plat && asArray(getProp(plat, "chain_blocks"));
    if (!blocks) continue;

    for (const blockNode of blocks.elements) {
      if (!ts.isObjectLiteralExpression(blockNode)) continue;
      const blockName = strVal(getProp(blockNode, "block_name")) ?? "";
      const settings = asObject(getProp(blockNode, "settings"));
      if (!settings) continue;

      for (const p of settings.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = propName(p);
        if (!key || !TIME_PARAMS.has(key)) continue;
        if (!ts.isNumericLiteral(p.initializer)) continue;

        if (NON_TIME_ATTACK_BLOCKS.has(blockName)) {
          throw new Error(
            `${slug} / ${platform} / "${blockName}" carries ${key}, which is a voicing ` +
              `switch on that model, not a duration. Refusing to migrate — handle it by hand.`,
          );
        }

        const value = parseFloat(p.initializer.text);
        if (value > SECONDS_CUTOFF) {
          alreadyMs++;
          continue;
        }

        // Seconds → milliseconds. Round to kill float noise (0.06*1000 = 60.000000000000006).
        const ms = Math.round(value * 1000 * 100) / 100;
        edits.push({
          start: p.initializer.getStart(sf),
          end: p.initializer.getEnd(),
          text: String(ms),
        });
        changes.push({ slug, platform, block: blockName, param: key, before: value, after: ms });
      }
    }
  }
}

// --- apply -----------------------------------------------------------------
edits.sort((a, b) => b.start - a.start);
let out = source;
for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

if (APPLY) {
  writeFileSync(DATA_FILE, out, "utf8");
}

// --- report ----------------------------------------------------------------
const byPlatform = new Map<string, number>();
for (const c of changes) byPlatform.set(c.platform, (byPlatform.get(c.platform) ?? 0) + 1);

const lines: string[] = [
  "# Compressor time-unit migration — Attack / Release to milliseconds",
  "",
  `**Run:** ${APPLY ? "applied" : "dry run"}`,
  `**Values converted (seconds → ms):** ${changes.length}`,
  `**Values already in ms (untouched):** ${alreadyMs}`,
  "",
  "## Why",
  "",
  "`Attack` and `Release` were written in two scales across the corpus. The",
  "registry declared them `min 0, max 1, unit \"s\"`, so a 60 ms attack rendered",
  'as **"Attack 60s"**, and `scaleParamValue()` — which had no rule for either',
  "parameter — clamped every millisecond-scale value to **1.0** in the generated",
  ".hlx. Every compressor in every downloadable Helix preset was shipping with",
  "maximum attack and maximum release.",
  "",
  "Ground truth for the target unit comes from `data/helix-corpus/models.json`",
  "(256 real presets): `HD2_CompressorDeluxeComp` shows `Attack 0.0001..0.072`",
  "and `Release 0.064..2.009` — seconds, as floats. The corpus stores the",
  "human-readable millisecond form; the generator converts on the way out.",
  "",
  "## Converted by platform",
  "",
  "| Platform | Values |",
  "|---|---|",
  ...[...byPlatform.entries()].sort().map(([p, n]) => `| \`${p}\` | ${n} |`),
  "",
  "## Every change",
  "",
  "| Recipe | Platform | Block | Param | Before | After |",
  "|---|---|---|---|---|---|",
  ...changes.map(
    (c) =>
      `| \`${c.slug}\` | ${c.platform} | ${c.block} | ${c.param} | ${c.before} | ${c.after} |`,
  ),
  "",
];

writeFileSync(REPORT_FILE, lines.join("\n"), "utf8");

console.log(`Compressor time-unit migration · ${APPLY ? "APPLIED" : "dry run"}`);
console.log(`  seconds → ms: ${changes.length}`);
console.log(`  already ms:   ${alreadyMs}`);
console.log(`  report:       docs/COMP_TIME_UNIT_MIGRATION.md`);
if (!APPLY) console.log("\n  Re-run with --apply to write src/lib/data/index.ts");
