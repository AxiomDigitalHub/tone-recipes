/**
 * Compiles every blog MDX through @mdx-js/mdx (same engine next-mdx-remote uses)
 * and reports failures with file:line:col before they reach Vercel.
 *
 * Why this exists:
 *   Vercel's prerender runs the real MDX compiler. The dev server does not
 *   compile every post on every save, so MDX-only bugs (unescaped `<` before
 *   a digit, unterminated strings inside JSX expressions, stray `{`) sneak
 *   through and only surface in CI ~6 minutes later. This script catches
 *   them in <5 seconds.
 *
 * Past breakages this would have caught:
 *   - 2754f0f5  inch marks inside <FAQ questions={[...]}> — `1/8"` mid-string
 *   - f9dcf4c   <0.1% in a markdown table cell — JSX parser saw `<` + `0`
 *
 * Usage:
 *   npx tsx scripts/validate-mdx.ts            # all posts in content/blog/
 *   npx tsx scripts/validate-mdx.ts --changed  # only staged + unstaged MDX
 *   npx tsx scripts/validate-mdx.ts path/to/file.mdx [more.mdx ...]
 *
 * Exit codes:
 *   0 = all files compile
 *   1 = one or more files failed
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");

function listAllBlogPosts(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(BLOG_DIR, f));
}

function listChangedMdx(): string[] {
  const out = execSync("git status --porcelain -- '*.mdx'", {
    cwd: ROOT,
    encoding: "utf-8",
  });
  return out
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter((p) => p.endsWith(".mdx") && p.startsWith("content/blog/"))
    .map((p) => path.join(ROOT, p));
}

function pickFiles(argv: string[]): string[] {
  if (argv.includes("--changed")) {
    const changed = listChangedMdx();
    if (changed.length === 0) {
      console.log("No changed MDX files in content/blog/.");
    }
    return changed;
  }
  const explicit = argv.filter((a) => !a.startsWith("--"));
  if (explicit.length > 0) {
    return explicit.map((p) => path.resolve(p));
  }
  return listAllBlogPosts();
}

type Failure = {
  file: string;
  message: string;
  line?: number;
  column?: number;
};

/**
 * Frontmatter type checks. Catches the class of bug where a tag like
 * `2555` (Marshall model number) parses as a YAML integer, then later
 * code does `tag.toLowerCase()` and crashes the prerender — happened
 * 2026-05-11 on `marshall-sj20h-vs-sv20h-jubilee-vs-jcm800.mdx`.
 * Only checks fields that are read by downstream code that calls
 * string methods. Anything more would be over-fitting.
 */
function checkFrontmatter(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  const stringField = (name: string, required = true) => {
    const v = data[name];
    if (v === undefined || v === null || v === "") {
      if (required) errors.push(`${name}: missing or empty`);
      return;
    }
    if (typeof v !== "string") {
      errors.push(`${name}: expected string, got ${typeof v} (${JSON.stringify(v)})`);
    }
  };

  stringField("title");
  stringField("description");
  stringField("author");
  stringField("author_slug");
  stringField("category");

  // tags must be a string[]; YAML readily parses bare numbers as ints
  // (the 2026-05-11 breakage) and bare booleans as bools, both of which
  // crash .toLowerCase() downstream. Wrap such values in quotes in the
  // source: `- "2555"` instead of `- 2555`.
  const tags = data.tags;
  if (tags !== undefined && tags !== null) {
    if (!Array.isArray(tags)) {
      errors.push(`tags: expected array, got ${typeof tags}`);
    } else {
      for (let i = 0; i < tags.length; i++) {
        if (typeof tags[i] !== "string") {
          errors.push(
            `tags[${i}]: expected string, got ${typeof tags[i]} (${JSON.stringify(tags[i])}) — quote it in YAML, e.g. "- \\"${tags[i]}\\""`,
          );
        }
      }
    }
  }

  return errors;
}

async function validate(file: string): Promise<Failure | null> {
  const raw = fs.readFileSync(file, "utf-8");
  const { content, data } = matter(raw);

  // 1. Frontmatter type checks (cheap, catches non-MDX bugs).
  const fmErrors = checkFrontmatter(data);
  if (fmErrors.length > 0) {
    return {
      file,
      message: `frontmatter:\n      ${fmErrors.join("\n      ")}`,
    };
  }

  // 2. MDX compile (catches JSX parser failures).
  try {
    await compile(content, { format: "mdx" });
    return null;
  } catch (err: any) {
    return {
      file,
      message: err.reason ?? err.message ?? String(err),
      line: err.line,
      column: err.column,
    };
  }
}

async function main() {
  const files = pickFiles(process.argv.slice(2));
  if (files.length === 0) {
    process.exit(0);
  }

  console.log(`Validating ${files.length} MDX file(s)...`);
  const failures: Failure[] = [];

  for (const file of files) {
    const result = await validate(file);
    if (result) failures.push(result);
  }

  if (failures.length === 0) {
    console.log(`OK — ${files.length} file(s) compile cleanly.`);
    process.exit(0);
  }

  console.error(`\nFAILED — ${failures.length} of ${files.length} file(s) won't prerender:\n`);
  for (const f of failures) {
    const rel = path.relative(ROOT, f.file);
    const loc = f.line ? `:${f.line}${f.column ? `:${f.column}` : ""}` : "";
    console.error(`  ${rel}${loc}`);
    console.error(`    ${f.message}\n`);
  }
  console.error(
    "Common fixes:\n" +
      "  `<` before a digit/space  → `&lt;` or backslash-escape `\\<`\n" +
      "  unterminated string in JSX expression → use prime ″ for inches, escape \\\"\n" +
      "  stray `{` in prose → `\\{` or wrap in backticks\n" +
      "  numeric tag like `- 2555` → quote it: `- \"2555\"`\n",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("validate-mdx crashed:", err);
  process.exit(2);
});
