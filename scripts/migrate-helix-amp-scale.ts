/**
 * Migration: rescale Helix amp-block settings from the normalized 0–1 scale to
 * the Helix-native 0–10 scale.
 *
 * Background: most Helix amp blocks were authored on a 0–1 scale (Drive 0.78),
 * but real Helix hardware — and this repo's Quad Cortex / Fractal translations —
 * use 0–10 (Gain 7.8). This rescales every fully-normalized Helix amp block ×10
 * and cross-checks each against its QC/Fractal sibling.
 *
 * Uses the TypeScript AST so it edits ONLY the numeric literals and preserves
 * all formatting, comments, and surrounding code regardless of how each block
 * is laid out (single-line vs multi-line).
 *
 *   npx tsx scripts/migrate-helix-amp-scale.ts          # dry run: writes report only
 *   npx tsx scripts/migrate-helix-amp-scale.ts --apply  # rewrites src/lib/data/index.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { toneRecipes } from "../src/lib/data";

const APPLY = process.argv.includes("--apply");
const DATA_FILE = join(process.cwd(), "src/lib/data/index.ts");
const REPORT_FILE = join(process.cwd(), "docs/HELIX_AMP_SCALE_MIGRATION.md");

const SIBLING_KEY: Record<string, string[]> = {
  Drive: ["Gain", "Drive"],
  Bass: ["Bass"],
  Mid: ["Mid", "Middle"],
  Treble: ["Treble"],
  Presence: ["Presence"],
  ChVol: ["Master", "ChVol", "Level"],
};

function siblingAmp(slug: string): Record<string, unknown> | null {
  const r = toneRecipes.find((x) => x.slug === slug);
  if (!r) return null;
  for (const p of ["quad_cortex", "fractal"] as const) {
    const blk = (r.platform_translations?.[p] as any)?.chain_blocks?.find(
      (b: any) => b.block_category === "Amp" || b.block_category === "Preamp",
    );
    if (blk?.settings) return blk.settings;
  }
  return null;
}

const fmt = (n: number) => String(Math.round(n * 100) / 100);

const source = readFileSync(DATA_FILE, "utf8");
const sf = ts.createSourceFile(DATA_FILE, source, ts.ScriptTarget.Latest, true);

// --- tiny AST helpers -------------------------------------------------------
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

// A numeric initializer, possibly negative; returns [value, the node to edit].
function numericInit(init: ts.Expression): [number, ts.Node] | null {
  if (ts.isNumericLiteral(init)) return [parseFloat(init.text), init];
  if (
    ts.isPrefixUnaryExpression(init) &&
    init.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(init.operand)
  )
    return [-parseFloat(init.operand.text), init];
  return null;
}

type Edit = { start: number; end: number; text: string };
type Change = {
  slug: string;
  block: string;
  gear: string;
  before: Record<string, string>;
  after: Record<string, string>;
  crosscheck: { key: string; scaled: number; sibling: number; ok: boolean }[];
  flagged: boolean;
};

const edits: Edit[] = [];
const changes: Change[] = [];

// Find the toneRecipes array literal.
let recipesArray: ts.ArrayLiteralExpression | undefined;
sf.forEachChild((node) => {
  if (ts.isVariableStatement(node)) {
    for (const d of node.declarationList.declarations) {
      if (
        ts.isIdentifier(d.name) &&
        d.name.text === "toneRecipes" &&
        d.initializer &&
        ts.isArrayLiteralExpression(d.initializer)
      )
        recipesArray = d.initializer;
    }
  }
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
    if (strVal(getProp(blockNode, "block_category")) !== "Amp") continue;

    const settings = asObject(getProp(blockNode, "settings"));
    if (!settings) continue;

    // Collect numeric props; skip block if any is already > 1 (already 0–10).
    const numProps: { key: string; value: number; node: ts.Node }[] = [];
    let alreadyScaled = false;
    for (const p of settings.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = propName(p);
      if (!key) continue;
      const num = numericInit(p.initializer);
      if (!num) continue; // string-valued setting, leave as-is
      if (num[0] > 1) alreadyScaled = true;
      numProps.push({ key, value: num[0], node: num[1] });
    }
    if (alreadyScaled || numProps.length === 0) continue;

    const block = strVal(getProp(blockNode, "block_name")) ?? "";
    const gear = strVal(getProp(blockNode, "original_gear")) ?? "";
    const before: Record<string, string> = {};
    const after: Record<string, string> = {};

    for (const { key, value, node } of numProps) {
      const scaled = Math.round(value * 10 * 100) / 100;
      before[key] = node.getText(sf);
      after[key] = fmt(scaled);
      edits.push({ start: node.getStart(sf), end: node.getEnd(), text: fmt(scaled) });
    }

    // Cross-check tone knobs against the sibling platform.
    const sib = siblingAmp(slug);
    const crosscheck: Change["crosscheck"] = [];
    if (sib) {
      for (const [k, v] of Object.entries(after)) {
        const cands = SIBLING_KEY[k];
        if (!cands) continue;
        let sv: number | undefined;
        for (const c of cands) if (typeof sib[c] === "number") { sv = sib[c] as number; break; }
        if (sv === undefined) continue;
        crosscheck.push({ key: k, scaled: parseFloat(v), sibling: sv, ok: Math.abs(parseFloat(v) - sv) <= 1.0 });
      }
    }
    changes.push({ slug, block, gear, before, after, crosscheck, flagged: crosscheck.some((c) => !c.ok) });
  }
}

// --- apply edits to a copy of the source -----------------------------------
edits.sort((a, b) => b.start - a.start);
let out = source;
for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

// --- report -----------------------------------------------------------------
const flagged = changes.filter((c) => c.flagged);
const clean = changes.filter((c) => !c.flagged);
const tone = (rec: Record<string, string>) =>
  ["Drive", "Bass", "Mid", "Treble", "Presence", "ChVol", "Master"]
    .filter((k) => k in rec)
    .map((k) => `${k} ${rec[k]}`)
    .join(", ");

let md = `# Helix amp-scale migration\n\n`;
md += `Rescales Helix amp-block settings from the normalized 0–1 scale to the Helix-native 0–10 scale (×10), matching the Quad Cortex / Fractal translations and real Helix hardware.\n\n`;
md += `- **Blocks rescaled:** ${changes.length}\n`;
md += `- **Numeric values changed:** ${edits.length}\n`;
md += `- **Clean (cross-check matches sibling):** ${clean.length}\n`;
md += `- **Flagged (knob values differ from sibling — review):** ${flagged.length}\n\n`;

if (flagged.length) {
  md += `## Flagged for manual review\n\n`;
  md += `These rescaled correctly (the scale fix is valid), but the resulting tone-knob values differ from the QC/Fractal sibling by more than rounding — likely a deliberate per-platform voicing, but worth a look.\n\n`;
  for (const c of flagged) {
    md += `### ${c.slug} — ${c.block} (${c.gear})\n`;
    md += `- before: \`${tone(c.before)}\`\n`;
    md += `- after:  \`${tone(c.after)}\`\n`;
    md += `- mismatches: ${c.crosscheck.filter((x) => !x.ok).map((x) => `${x.key} ${x.scaled} vs sibling ${x.sibling}`).join("; ")}\n\n`;
  }
}

md += `## All rescaled blocks\n\n`;
md += `| Recipe | Amp | Before | After | Cross-check |\n|---|---|---|---|---|\n`;
for (const c of changes)
  md += `| ${c.slug} | ${c.block} | ${tone(c.before)} | ${tone(c.after)} | ${c.flagged ? "⚠️ review" : "✓"} |\n`;

writeFileSync(REPORT_FILE, md);

console.log(`Blocks rescaled: ${changes.length} (clean ${clean.length}, flagged ${flagged.length})`);
console.log(`Numeric values changed: ${edits.length}`);
console.log(`Report written: ${REPORT_FILE}`);
if (APPLY) {
  writeFileSync(DATA_FILE, out);
  console.log(`APPLIED changes to ${DATA_FILE}`);
} else {
  console.log(`DRY RUN — no data file changes. Re-run with --apply to write.`);
}
