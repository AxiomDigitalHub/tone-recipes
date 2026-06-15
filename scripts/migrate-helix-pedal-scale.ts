/**
 * Migration: rescale Helix DISTORTION (drive/fuzz/boost) block knobs from the
 * normalized 0–1 scale to the Helix-native 0–10 scale.
 *
 * Same class of bug as the amp blocks (see migrate-helix-amp-scale.ts), but
 * scoped to `block_category: "Distortion"` and limited to a KNOB allowlist —
 * these blocks also contain switches (Bright, Clipping, GainMod) and booleans
 * (Voltage) that must NOT be scaled.
 *
 * Per-block detection: if every allowlisted knob is ≤ 1, the block is normalized
 * and gets scaled ×10. If any knob is already > 1 the block is skipped — and if
 * it's *mixed* (some knobs >1, some ≤1) it is reported as flagged, never edited,
 * because a low value may be an intentional 0–10 setting (e.g. a Tube Screamer
 * used as a clean boost with Gain ~0.5).
 *
 *   npx tsx scripts/migrate-helix-pedal-scale.ts          # dry run: report only
 *   npx tsx scripts/migrate-helix-pedal-scale.ts --apply  # rewrites data file
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { toneRecipes } from "../src/lib/data";

const APPLY = process.argv.includes("--apply");
const DATA_FILE = join(process.cwd(), "src/lib/data/index.ts");
const REPORT_FILE = join(process.cwd(), "docs/HELIX_PEDAL_SCALE_MIGRATION.md");

// Continuous drive-pedal knobs that live on Helix's 0–10 scale.
const KNOBS = new Set([
  "Gain", "Drive", "Tone", "Level", "Bass", "Mid", "Treble", "Presence",
  "Boost", "Sustain", "Volume", "Output", "Body", "Contour", "Tight",
  "Fuzz", "Dist", "Distortion", "Focus", "Filter", "Comp",
]);
// Explicitly NOT knobs (switches / modes / booleans) — never scaled.
const NON_KNOBS = new Set(["Bright", "Clipping", "GainMod", "Voltage", "Mode", "Type", "Voice", "Octave"]);

const fmt = (n: number) => String(Math.round(n * 100) / 100);

function siblingDrive(slug: string): Record<string, unknown> | null {
  const r = toneRecipes.find((x) => x.slug === slug);
  if (!r) return null;
  for (const p of ["quad_cortex", "fractal"] as const) {
    const blk = (r.platform_translations?.[p] as any)?.chain_blocks?.find((b: any) =>
      /distortion|overdrive|drive|fuzz|boost/i.test(b.block_category ?? "") ||
      /distortion|overdrive|drive|fuzz|boost/i.test(b.block_name ?? ""),
    );
    if (blk?.settings) return blk.settings;
  }
  return null;
}

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
function numericInit(init: ts.Expression): [number, ts.Node] | null {
  if (ts.isNumericLiteral(init)) return [parseFloat(init.text), init];
  if (ts.isPrefixUnaryExpression(init) && init.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(init.operand))
    return [-parseFloat(init.operand.text), init];
  return null;
}

type Edit = { start: number; end: number; text: string };
type Change = { slug: string; block: string; gear: string; before: Record<string, string>; after: Record<string, string> };
const edits: Edit[] = [];
const changes: Change[] = [];
const flaggedMixed: { slug: string; block: string; knobs: Record<string, number> }[] = [];

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
  const translations = asObject(getProp(recipeNode, "platform_translations"));
  const helix = translations && asObject(getProp(translations, "helix"));
  const blocks = helix && asArray(getProp(helix, "chain_blocks"));
  if (!blocks) continue;

  for (const blockNode of blocks.elements) {
    if (!ts.isObjectLiteralExpression(blockNode)) continue;
    if (strVal(getProp(blockNode, "block_category")) !== "Distortion") continue;
    const settings = asObject(getProp(blockNode, "settings"));
    if (!settings) continue;

    const knobProps: { key: string; value: number; node: ts.Node }[] = [];
    for (const p of settings.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = propName(p);
      if (!key || !KNOBS.has(key) || NON_KNOBS.has(key)) continue;
      const num = numericInit(p.initializer);
      if (num) knobProps.push({ key, value: num[0], node: num[1] });
    }
    if (knobProps.length === 0) continue;

    const le1 = knobProps.filter((k) => k.value <= 1);
    const gt1 = knobProps.filter((k) => k.value > 1);
    const block = strVal(getProp(blockNode, "block_name")) ?? "";
    if (gt1.length > 0) {
      // already 0–10, or mixed (skip either way; flag the mixed ones)
      if (le1.length > 0)
        flaggedMixed.push({ slug, block, knobs: Object.fromEntries(knobProps.map((k) => [k.key, k.value])) });
      continue;
    }

    const gear = strVal(getProp(blockNode, "original_gear")) ?? "";
    const before: Record<string, string> = {};
    const after: Record<string, string> = {};
    for (const { key, value, node } of knobProps) {
      const scaled = Math.round(value * 10 * 100) / 100;
      before[key] = node.getText(sf);
      after[key] = fmt(scaled);
      edits.push({ start: node.getStart(sf), end: node.getEnd(), text: fmt(scaled) });
    }
    changes.push({ slug, block, gear, before, after });
  }
}

edits.sort((a, b) => b.start - a.start);
let out = source;
for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

const tone = (rec: Record<string, string>) => Object.entries(rec).map(([k, v]) => `${k} ${v}`).join(", ");
let md = `# Helix distortion-pedal scale migration\n\n`;
md += `Rescales Helix **Distortion** block knobs (Gain/Drive/Tone/Level/etc.) from 0–1 to the Helix-native 0–10 scale. Switches (Bright, Clipping, GainMod) and booleans (Voltage) are left untouched.\n\n`;
md += `- **Blocks rescaled:** ${changes.length}\n`;
md += `- **Knob values changed:** ${edits.length}\n`;
md += `- **Flagged (mixed-scale — NOT edited, review):** ${flaggedMixed.length}\n\n`;
if (flaggedMixed.length) {
  md += `## Flagged for manual review (mixed scale — left unchanged)\n\n`;
  md += `Some knobs are >1 (0–10) while others are ≤1. The low value may be an intentional 0–10 setting (e.g. a Tube Screamer as a clean boost) or a 0–1 holdover — needs a human ear, so the migration did not touch these.\n\n`;
  for (const f of flaggedMixed) md += `- **${f.slug}** — ${f.block}: \`${tone(Object.fromEntries(Object.entries(f.knobs).map(([k, v]) => [k, String(v)])) )}\`\n`;
  md += `\n`;
}
md += `## All rescaled blocks\n\n| Recipe | Pedal | Before | After |\n|---|---|---|---|\n`;
for (const c of changes) md += `| ${c.slug} | ${c.block} | ${tone(c.before)} | ${tone(c.after)} |\n`;
writeFileSync(REPORT_FILE, md);

console.log(`Distortion blocks rescaled: ${changes.length}`);
console.log(`Knob values changed: ${edits.length}`);
console.log(`Flagged mixed (untouched): ${flaggedMixed.length}`);
console.log(`Report: ${REPORT_FILE}`);
if (APPLY) { writeFileSync(DATA_FILE, out); console.log(`APPLIED to ${DATA_FILE}`); }
else console.log(`DRY RUN — re-run with --apply to write.`);
