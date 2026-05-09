/**
 * One-shot fixer: insert a Compressor block at position 1 of any
 * QC / Fractal / Kemper translation that's currently missing one.
 *
 * Strategy: locate each `quad_cortex: { chain_blocks: [` /
 * `fractal: { ... }` / `kemper: { ... }` block, scan its existing
 * blocks for a Compressor (block_category === "Compressor"), and if
 * absent, insert a platform-appropriate Compressor literal right at
 * the top of `chain_blocks`. Renumber the remaining blocks' positions.
 *
 * Run: `npx tsx scripts/fix-missing-comp.ts`
 *      `npx tsx scripts/fix-missing-comp.ts --dry-run`
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SOURCE_PATH = resolve(__dirname, "..", "src", "lib", "data", "index.ts");

type Platform = "quad_cortex" | "fractal" | "kemper";

const COMP_TEMPLATES: Record<Platform, string> = {
  quad_cortex: `{ position: 1, block_name: "Studio Comp", block_category: "Compressor", original_gear: "Studio compressor", settings: { Threshold: -34, Ratio: 2, Attack: 38, Release: 200, Mix: 50, Level: 0 }, notes: "Light parallel comp evens out picking dynamics. Mix at 50% keeps the natural attack present." }`,
  fractal: `{ position: 1, block_name: "Studio Comp", block_category: "Compressor", original_gear: "Studio compressor", settings: { Threshold: -34, Ratio: 2, Attack: 38, Release: 200, Mix: 0.5, Level: 0 }, notes: "Light parallel comp evens out picking dynamics. Mix at 0.5 keeps the natural attack present." }`,
  kemper: `{
            position: 1,
            block_name: "Compressor",
            block_category: "Compressor",
            original_gear: "Studio compressor",
            settings: { Intensity: 3.0, Attack: 0.04, Volume: 0.0 },
            notes: "Slot A. Light comp evens out picking dynamics."
          }`,
};

const dryRun = process.argv.includes("--dry-run");

const source = readFileSync(SOURCE_PATH, "utf8");
const sourceFile = ts.createSourceFile(
  SOURCE_PATH,
  source,
  ts.ScriptTarget.ES2020,
  true,
);

interface Edit {
  start: number;
  end: number;
  replacement: string;
  recipeSlug: string;
  platform: Platform;
}

const edits: Edit[] = [];

function findRecipeSlug(node: ts.Node): string {
  let cursor: ts.Node | undefined = node;
  while (cursor && cursor.parent) {
    cursor = cursor.parent;
    if (ts.isObjectLiteralExpression(cursor)) {
      for (const p of cursor.properties) {
        if (
          ts.isPropertyAssignment(p) &&
          ts.isIdentifier(p.name) &&
          p.name.text === "slug" &&
          ts.isStringLiteral(p.initializer)
        ) {
          return p.initializer.text;
        }
      }
    }
  }
  return "(unknown)";
}

function visit(node: ts.Node): void {
  if (
    ts.isPropertyAssignment(node) &&
    ts.isIdentifier(node.name) &&
    (node.name.text === "quad_cortex" ||
      node.name.text === "fractal" ||
      node.name.text === "kemper") &&
    ts.isObjectLiteralExpression(node.initializer)
  ) {
    const platform = node.name.text as Platform;
    // Find chain_blocks array.
    let chainBlocksProp: ts.PropertyAssignment | undefined;
    for (const p of node.initializer.properties) {
      if (
        ts.isPropertyAssignment(p) &&
        ts.isIdentifier(p.name) &&
        p.name.text === "chain_blocks" &&
        ts.isArrayLiteralExpression(p.initializer)
      ) {
        chainBlocksProp = p;
        break;
      }
    }
    if (!chainBlocksProp || !ts.isArrayLiteralExpression(chainBlocksProp.initializer))
      return ts.forEachChild(node, visit);

    // Check if any element has block_category: "Compressor"
    // (mirror the audit's logic — for Kemper, also check Stomp blocks
    // whose block_name matches the comp pattern: /\b(compressor|comp|squash|squeeze|optical)\b/i).
    const elements = chainBlocksProp.initializer.elements;
    const COMP_NAME_RE = /\b(compressor|comp|squash|squeeze|optical)\b/i;
    let hasComp = false;
    for (const el of elements) {
      if (ts.isObjectLiteralExpression(el)) {
        let elCategory = "";
        let elName = "";
        for (const p of el.properties) {
          if (
            ts.isPropertyAssignment(p) &&
            ts.isIdentifier(p.name) &&
            ts.isStringLiteral(p.initializer)
          ) {
            if (p.name.text === "block_category") elCategory = p.initializer.text;
            if (p.name.text === "block_name") elName = p.initializer.text;
          }
        }
        if (elCategory === "Compressor") {
          hasComp = true;
          break;
        }
        if (
          platform === "kemper" &&
          elCategory === "Stomp" &&
          COMP_NAME_RE.test(elName)
        ) {
          hasComp = true;
          break;
        }
      }
    }

    if (!hasComp) {
      // Insert a Compressor block at the start of the array, before the
      // first element (or before the closing bracket if empty).
      const slug = findRecipeSlug(node);
      const arr = chainBlocksProp.initializer;
      // Insertion point: just after the opening `[`.
      const openBracketEnd = arr.getStart(sourceFile) + 1;

      // Determine indent style by looking at the first element.
      let indent = "          ";
      if (elements.length > 0) {
        const firstEl = elements[0];
        const firstStart = firstEl.getStart(sourceFile);
        const lineStart = source.lastIndexOf("\n", firstStart) + 1;
        indent = source.slice(lineStart, firstStart);
      }

      const template = COMP_TEMPLATES[platform];
      const replacement = `\n${indent}${template},`;

      // Now we need to renumber existing blocks (position: N → N+1).
      // We'll do this as a single replacement by including the entire
      // chain_blocks array in the edit.
      const fullArrText = source.slice(arr.getStart(sourceFile), arr.end);
      const newArrText = fullArrText.replace(/^\[/, `[\n${indent}${template},`);

      // Renumber position: N → position: N+1 for each existing block.
      // Walk the AST to gather all PropertyAssignment for "position" inside this array,
      // and shift each by +1 via text replacement.
      // Simpler approach: use a scoped regex on the array text.

      // We'll do per-element renumbering via regex on the string.
      // For each `position: <num>` in the array (excluding our prepended
      // one which we'll handle specially), increment by 1.
      // Strategy: capture the original first-onward portion and shift each.
      // But we already prepended `position: 1`. Remaining numbered blocks
      // were 1, 2, 3, ... — they need to become 2, 3, 4, ...
      // Trick: shift in reverse order (highest first) to avoid double-shifting.

      // Compute positions we need to shift:
      const positionMatches: Array<{ start: number; end: number; oldNum: number }> = [];
      for (const el of elements) {
        if (ts.isObjectLiteralExpression(el)) {
          for (const p of el.properties) {
            if (
              ts.isPropertyAssignment(p) &&
              ts.isIdentifier(p.name) &&
              p.name.text === "position" &&
              ts.isNumericLiteral(p.initializer)
            ) {
              positionMatches.push({
                start: p.initializer.getStart(sourceFile),
                end: p.initializer.end,
                oldNum: parseInt(p.initializer.text, 10),
              });
            }
          }
        }
      }
      // Sort descending by start so later edits don't invalidate earlier ones.
      positionMatches.sort((a, b) => b.start - a.start);
      let shiftedSource = source;
      for (const m of positionMatches) {
        const newNum = m.oldNum + 1;
        shiftedSource =
          shiftedSource.slice(0, m.start) +
          String(newNum) +
          shiftedSource.slice(m.end);
      }
      // Now shiftedSource has the renumbered positions but doesn't
      // include our prepended Compressor. Compute the splice for the
      // prepend operation.
      const editStart = openBracketEnd;
      const replacementText = `\n${indent}${template},`;

      edits.push({
        start: editStart,
        end: editStart,
        replacement: replacementText,
        recipeSlug: slug,
        platform,
      });
      // Also create renumber edits.
      for (const m of positionMatches) {
        edits.push({
          start: m.start,
          end: m.end,
          replacement: String(m.oldNum + 1),
          recipeSlug: slug,
          platform,
        });
      }
    }
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

// Apply edits in reverse order of start position.
edits.sort((a, b) => b.start - a.start);

console.log(`\nfix-missing-comp — ${edits.length} edits across ${
  new Set(edits.filter(e => e.replacement.includes("Studio Comp") || e.replacement.includes('"Compressor"')).map(e => `${e.recipeSlug}:${e.platform}`)).size
} (recipe, platform) pairs\n`);

const insertEdits = edits.filter(e => e.start === e.end);
console.log(`Compressor block insertions: ${insertEdits.length}`);
for (const e of insertEdits.slice(0, 20)) {
  console.log(`  ${e.recipeSlug} · ${e.platform}`);
}

if (dryRun) {
  console.log("\n--dry-run: no changes written.\n");
  process.exit(0);
}

let next = source;
for (const e of edits) {
  next = next.slice(0, e.start) + e.replacement + next.slice(e.end);
}

writeFileSync(SOURCE_PATH, next, "utf8");
console.log(`\nWrote ${edits.length} edits to ${SOURCE_PATH}\n`);
console.log("Next: re-run audit:\n  npx tsx scripts/audit-recipes.ts\n");
