/**
 * One-shot fixer for `translations-canonical-knob-order` audit failures.
 *
 * Walks src/lib/data/index.ts, finds every `settings: { ... }` object
 * literal nested inside a `chain_blocks` array under a known platform
 * key (helix / quad_cortex / katana / fractal / kemper / tonex),
 * looks up the canonical knob order for that (platform, category) pair
 * via `getCanonicalParams`, and reorders the literal's properties so
 * canonical keys appear in canonical order. Non-canonical keys keep
 * their original relative order and stay at the end.
 *
 * The reorder is a SURGICAL text splice — we recompute only the bytes
 * inside the literal's `{` … `}` and re-emit them with the original
 * file's indentation. Comments and formatting outside that span are
 * untouched.
 *
 * Run: `npx tsx scripts/fix-knob-order.ts`
 *      `npx tsx scripts/fix-knob-order.ts --dry-run`  → reports changes
 *
 * After running, re-run the audit to confirm:
 *      `npx tsx scripts/audit-recipes.ts`
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as ts from "typescript";
import { getCanonicalParams } from "../src/lib/parameters/canonical";
import type { Platform } from "../src/types/recipe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SOURCE_PATH = resolve(__dirname, "..", "src", "lib", "data", "index.ts");

const PLATFORMS = new Set<Platform>([
  "helix",
  "quad_cortex",
  "katana",
  "fractal",
  "kemper",
  "tonex",
  "pedalboard",
]);

interface Edit {
  start: number;
  end: number;
  replacement: string;
  recipeSlug: string;
  platform: Platform;
  category: string;
  oldOrder: string[];
  newOrder: string[];
}

const dryRun = process.argv.includes("--dry-run");

const source = readFileSync(SOURCE_PATH, "utf8");
const sourceFile = ts.createSourceFile(
  SOURCE_PATH,
  source,
  ts.ScriptTarget.ES2020,
  /* setParentNodes */ true,
);

const edits: Edit[] = [];

/** Walk up parent chain to find:
 *  - the nearest `slug: "..."` PropertyAssignment (recipe identity)
 *  - the nearest `helix:` / `quad_cortex:` / etc. PropertyAssignment
 *    (platform context)
 *  - the nearest `block_category: "..."` (category context)
 */
function findContext(
  settingsObjLit: ts.ObjectLiteralExpression,
): { slug: string; platform: Platform; category: string } | null {
  // The `settings` literal sits inside an ObjectLiteralExpression
  // that represents one chain_blocks entry. That outer literal has
  // a `block_category` property. The whole chain_blocks array is the
  // value of a property named after the platform.
  const blockObj = settingsObjLit.parent.parent; // PropertyAssignment → ObjectLiteralExpression
  if (!ts.isObjectLiteralExpression(blockObj)) return null;

  let category = "";
  for (const p of blockObj.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      ts.isIdentifier(p.name) &&
      p.name.text === "block_category" &&
      ts.isStringLiteral(p.initializer)
    ) {
      category = p.initializer.text;
      break;
    }
  }
  if (!category) return null;

  // Walk up to find platform PropertyAssignment.
  let cursor: ts.Node = blockObj;
  let platform: Platform | null = null;
  while (cursor.parent) {
    cursor = cursor.parent;
    if (
      ts.isPropertyAssignment(cursor) &&
      ts.isIdentifier(cursor.name) &&
      PLATFORMS.has(cursor.name.text as Platform)
    ) {
      platform = cursor.name.text as Platform;
      break;
    }
  }
  if (!platform) return null;

  // Walk further up to find the recipe's slug PropertyAssignment.
  let slug = "";
  while (cursor.parent) {
    cursor = cursor.parent;
    if (ts.isObjectLiteralExpression(cursor)) {
      for (const p of cursor.properties) {
        if (
          ts.isPropertyAssignment(p) &&
          ts.isIdentifier(p.name) &&
          p.name.text === "slug" &&
          ts.isStringLiteral(p.initializer)
        ) {
          slug = p.initializer.text;
          break;
        }
      }
      if (slug) break;
    }
  }

  return { slug, platform, category };
}

/** Inside the `settings: { ... }` literal, build a new {…} text with
 *  canonical keys reordered first (in canonical order), then any
 *  non-canonical keys preserved in their original relative order.
 *  Whitespace style mirrors whether the original literal was multi-line
 *  (uses the original's indent) or single-line (compact `{ k: v, ... }`).
 */
function reorderLiteral(
  literal: ts.ObjectLiteralExpression,
  canonical: string[],
): { newText: string; oldOrder: string[]; newOrder: string[] } | null {
  const originalText = source.slice(literal.pos, literal.end);
  const properties: { key: string; raw: string }[] = [];

  for (const p of literal.properties) {
    if (!ts.isPropertyAssignment(p)) return null; // bail on shorthand/spread
    let key: string;
    if (ts.isIdentifier(p.name)) key = p.name.text;
    else if (ts.isStringLiteral(p.name)) key = p.name.text;
    else return null;
    const raw = source.slice(p.pos, p.end).replace(/^\s*[\r\n]+/, "");
    properties.push({ key, raw: raw.trim() });
  }

  if (properties.length === 0) return null;

  const oldOrder = properties.map((p) => p.key);
  const inCanonical = new Set(canonical);
  const canonicalPresent = canonical.filter((c) =>
    properties.some((p) => p.key === c),
  );
  const nonCanonical = properties
    .filter((p) => !inCanonical.has(p.key))
    .map((p) => p.key);
  const settingsCanonicalOrder = oldOrder.filter((k) => inCanonical.has(k));

  if (settingsCanonicalOrder.join("|") === canonicalPresent.join("|")) {
    return null; // already in canonical order
  }

  const newOrder = [...canonicalPresent, ...nonCanonical];
  const byKey = new Map(properties.map((p) => [p.key, p.raw]));
  const reorderedRaws = newOrder.map((k) => byKey.get(k)!);

  // Detect whether the original was multi-line. If so, emit multi-line
  // with the original's leading-line indent; else single-line.
  const isMultiLine = /\n/.test(originalText);

  let newText: string;
  if (isMultiLine) {
    // Find the indent used inside the literal (look at the first inner
    // line's leading whitespace).
    const innerMatch = originalText.match(/\{\s*\n([ \t]*)/);
    const indent = innerMatch?.[1] ?? "      ";
    const closingMatch = originalText.match(/\n([ \t]*)\}\s*$/);
    const closingIndent = closingMatch?.[1] ?? "    ";
    newText =
      "{\n" +
      reorderedRaws.map((r) => indent + r).join(",\n") +
      ",\n" +
      closingIndent +
      "}";
  } else {
    newText = "{ " + reorderedRaws.join(", ") + " }";
  }

  return { newText, oldOrder, newOrder };
}

function visit(node: ts.Node): void {
  if (
    ts.isPropertyAssignment(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === "settings" &&
    ts.isObjectLiteralExpression(node.initializer)
  ) {
    const literal = node.initializer;
    const ctx = findContext(literal);
    if (ctx) {
      const canonical = getCanonicalParams(ctx.platform, ctx.category);
      if (canonical.length > 0) {
        const result = reorderLiteral(literal, canonical);
        if (result) {
          edits.push({
            start: literal.pos + (source.slice(literal.pos).match(/^\s*/)?.[0]
              .length ?? 0),
            end: literal.end,
            replacement: result.newText,
            recipeSlug: ctx.slug,
            platform: ctx.platform,
            category: ctx.category,
            oldOrder: result.oldOrder,
            newOrder: result.newOrder,
          });
        }
      }
    }
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

// Apply edits in reverse order so offsets stay valid.
edits.sort((a, b) => b.start - a.start);

console.log(`\nfix-knob-order — found ${edits.length} blocks to reorder\n`);
for (const e of edits.slice(0, 8)) {
  console.log(
    `  ${e.recipeSlug} · ${e.platform} ${e.category}\n    [${e.oldOrder.join(", ")}]\n → [${e.newOrder.join(", ")}]\n`,
  );
}
if (edits.length > 8) {
  console.log(`  …and ${edits.length - 8} more.\n`);
}

if (dryRun) {
  console.log("--dry-run: no changes written.\n");
  process.exit(0);
}

let next = source;
for (const e of edits) {
  next = next.slice(0, e.start) + e.replacement + next.slice(e.end);
}

writeFileSync(SOURCE_PATH, next, "utf8");
console.log(`Wrote ${edits.length} fixes to ${SOURCE_PATH}\n`);
console.log("Next: re-run the audit:\n  npx tsx scripts/audit-recipes.ts\n");
