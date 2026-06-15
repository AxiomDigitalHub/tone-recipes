/**
 * Migration: fix Helix effect-block UNIT inconsistencies, per the Line 6
 * Helix 3.80 Owner's Manual (pp. 32–33).
 *
 *   Mix      → 0–100%   (manual: "0% = bypass … 100% = all wet")  ×100
 *   Feedback → 0–100%   (delay repeats, percentage)               ×100
 *   Time     → ms       (manual: "a ms value … toggle ms/note")   ×1000  (Delay)
 *   Predelay → ms       (manual: "time before the reverb")        ×1000  (Reverb)
 *   Attack   → ms       (compressor, 1–1000ms)                    ×1000  (Compressor)
 *   Release  → ms       (compressor)                              ×1000  (Compressor)
 *
 * Each param's data is cleanly bimodal: a cluster of normalized values (≤1) and
 * a cluster already in the target unit (>1). We only convert the ≤1 cluster.
 *
 * Deliberately NOT touched (uncertain or already correct): Speed (valid Hz),
 * Depth/Rate (ambiguous), EQ gains (scale unconfirmed), Decay (valid seconds),
 * Level (0.0 dB), Cab Position/Angle (genuinely 0–1).
 *
 *   npx tsx scripts/migrate-helix-units.ts          # dry run: report only
 *   npx tsx scripts/migrate-helix-units.ts --apply  # rewrites data file
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const APPLY = process.argv.includes("--apply");
const DATA_FILE = join(process.cwd(), "src/lib/data/index.ts");
const REPORT_FILE = join(process.cwd(), "docs/HELIX_UNIT_MIGRATION.md");

// Rule: for `param` in any of `categories` (null = any), when value matches
// `when`, multiply by `factor`. `unit` is for the report only.
type Rule = { param: string; categories: string[] | null; factor: number; unit: string; when: (v: number) => boolean };
const le1 = (v: number) => v > 0 && v <= 1; // exclude exact 0 (0% = 0 either way; keeps re-runs idempotent)
const RULES: Rule[] = [
  { param: "Mix", categories: null, factor: 100, unit: "%", when: le1 },
  { param: "Feedback", categories: ["Delay"], factor: 100, unit: "%", when: le1 },
  { param: "Time", categories: ["Delay"], factor: 1000, unit: "ms", when: le1 },
  { param: "Predelay", categories: ["Reverb"], factor: 1000, unit: "ms", when: le1 },
  { param: "PreDelay", categories: ["Reverb"], factor: 1000, unit: "ms", when: le1 },
  { param: "Pre Delay", categories: ["Reverb"], factor: 1000, unit: "ms", when: le1 },
  { param: "Attack", categories: ["Compressor"], factor: 1000, unit: "ms", when: le1 },
  { param: "Release", categories: ["Compressor"], factor: 1000, unit: "ms", when: le1 },
];

const fmt = (n: number) => String(Math.round(n * 1000) / 1000);

const source = readFileSync(DATA_FILE, "utf8");
const sf = ts.createSourceFile(DATA_FILE, source, ts.ScriptTarget.Latest, true);

const propName = (p: ts.ObjectLiteralElementLike): string | undefined => {
  if (!ts.isPropertyAssignment(p)) return undefined;
  const n = p.name;
  return ts.isIdentifier(n) || ts.isStringLiteral(n) ? n.text : undefined;
};
const getProp = (obj: ts.ObjectLiteralExpression, name: string) =>
  obj.properties.find((p) => propName(p) === name) as ts.PropertyAssignment | undefined;
const asObject = (n?: ts.Node) =>
  n && ts.isPropertyAssignment(n) && ts.isObjectLiteralExpression(n.initializer) ? n.initializer : undefined;
const asArray = (n?: ts.Node) =>
  n && ts.isPropertyAssignment(n) && ts.isArrayLiteralExpression(n.initializer) ? n.initializer : undefined;
const strVal = (n?: ts.PropertyAssignment) =>
  n && ts.isStringLiteral(n.initializer) ? n.initializer.text : undefined;

type Edit = { start: number; end: number; text: string };
type Change = { slug: string; block: string; param: string; before: string; after: string; unit: string };
const edits: Edit[] = [];
const changes: Change[] = [];

let recipesArray: ts.ArrayLiteralExpression | undefined;
sf.forEachChild((node) => {
  if (ts.isVariableStatement(node))
    for (const d of node.declarationList.declarations)
      if (ts.isIdentifier(d.name) && d.name.text === "toneRecipes" && d.initializer && ts.isArrayLiteralExpression(d.initializer))
        recipesArray = d.initializer;
});
if (!recipesArray) throw new Error("Could not locate toneRecipes array literal");

for (const recipeNode of recipesArray.elements) {
  if (!ts.isObjectLiteralExpression(recipeNode)) continue;
  const slug = strVal(getProp(recipeNode, "slug")) ?? "(unknown)";
  const helix = asObject(getProp(asObject(getProp(recipeNode, "platform_translations")) ?? ts.factory.createObjectLiteralExpression(), "helix"));
  const blocks = helix && asArray(getProp(helix, "chain_blocks"));
  if (!blocks) continue;

  for (const blockNode of blocks.elements) {
    if (!ts.isObjectLiteralExpression(blockNode)) continue;
    const category = strVal(getProp(blockNode, "block_category")) ?? "";
    const settings = asObject(getProp(blockNode, "settings"));
    if (!settings) continue;
    const blockName = strVal(getProp(blockNode, "block_name")) ?? "";

    for (const p of settings.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = propName(p);
      if (!key) continue;
      const rule = RULES.find((r) => r.param === key && (r.categories === null || r.categories.includes(category)));
      if (!rule) continue;
      if (!ts.isNumericLiteral(p.initializer)) continue; // skip note-value strings/non-numeric
      const val = parseFloat(p.initializer.text);
      if (!rule.when(val)) continue;

      const scaled = Math.round(val * rule.factor * 1000) / 1000;
      edits.push({ start: p.initializer.getStart(sf), end: p.initializer.getEnd(), text: fmt(scaled) });
      changes.push({ slug, block: blockName, param: key, before: p.initializer.text, after: fmt(scaled), unit: rule.unit });
    }
  }
}

edits.sort((a, b) => b.start - a.start);
let out = source;
for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

// ---- report ----
const byParam = new Map<string, Change[]>();
for (const c of changes) (byParam.get(c.param) ?? byParam.set(c.param, []).get(c.param)!).push(c);

let md = `# Helix effect-block unit migration\n\n`;
md += `Fixes unit inconsistencies confirmed against the Line 6 Helix 3.80 Owner's Manual (pp. 32–33). Only normalized (≤1) values were converted; values already in the target unit were left as-is.\n\n`;
md += `- **Total values changed:** ${changes.length}\n\n`;
md += `| Param | Unit | Conversion | Values changed |\n|---|---|---|---|\n`;
for (const r of RULES) {
  const list = changes.filter((c) => c.param === r.param);
  if (list.length) md += `| ${r.param} | ${r.unit} | ×${r.factor} | ${list.length} |\n`;
}
md += `\n## Deliberately NOT changed\n\n`;
md += `- **Speed** (Modulation): \`0.3–6\` are valid **Hz** (manual p32) — correct.\n`;
md += `- **Depth / Rate** (Modulation): ambiguous scale (% vs Hz vs 0–10) — needs a human ear, not auto-scaled.\n`;
md += `- **EQ gains**: manual did not pin the dB scale; values left untouched.\n`;
md += `- **Decay** (seconds), **Level** (0.0 dB), **Cab Position/Angle** (0–1): correct as-is.\n\n`;

for (const r of RULES) {
  const list = changes.filter((c) => c.param === r.param);
  if (!list.length) continue;
  md += `## ${r.param} → ${r.unit} (×${r.factor}) — ${list.length} changes\n\n| Recipe | Block | Before | After |\n|---|---|---|---|\n`;
  for (const c of list) md += `| ${c.slug} | ${c.block} | ${c.before} | ${c.after}${r.unit === "%" ? "%" : r.unit} |\n`;
  md += `\n`;
}
writeFileSync(REPORT_FILE, md);

console.log(`Total values changed: ${changes.length}`);
for (const r of RULES) {
  const n = changes.filter((c) => c.param === r.param).length;
  if (n) console.log(`  ${r.param.padEnd(10)} ×${String(r.factor).padEnd(4)} → ${r.unit.padEnd(2)}  ${n} values`);
}
console.log(`Report: ${REPORT_FILE}`);
if (APPLY) { writeFileSync(DATA_FILE, out); console.log(`APPLIED to ${DATA_FILE}`); }
else console.log(`DRY RUN — re-run with --apply to write.`);
