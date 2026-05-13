/**
 * Compiles every blog MDX through @mdx-js/mdx (same engine next-mdx-remote uses)
 * AND validates frontmatter against the Zod contract in src/lib/blog.schema.ts.
 * Reports both kinds of failure with file:line:col before they reach Vercel.
 *
 * Why this exists:
 *   1. Vercel's prerender runs the real MDX compiler. The dev server does not
 *      compile every post on every save, so MDX-only bugs (unescaped `<` before
 *      a digit, unterminated strings inside JSX expressions, stray `{`) sneak
 *      through and only surface in CI ~6 minutes later. This script catches
 *      them in <5 seconds.
 *   2. Frontmatter typos (auther: instead of author:, missing image_alt,
 *      forgotten takeaways) used to ship silently and degrade SEO/AEO without
 *      anyone noticing. The Zod schema in src/lib/blog.schema.ts is the
 *      authoritative contract; this script enforces it.
 *
 * Past breakages this would have caught:
 *   - 2754f0f5  inch marks inside <FAQ questions={[...]}> — `1/8"` mid-string
 *   - f9dcf4c   <0.1% in a markdown table cell — JSX parser saw `<` + `0`
 *   - 2026-05-11  numeric tag `- 2555` (now caught by Zod array<string>)
 *
 * Usage:
 *   npx tsx scripts/validate-mdx.mts            # all posts in content/blog/
 *   npx tsx scripts/validate-mdx.mts --changed  # only staged + unstaged MDX
 *   npx tsx scripts/validate-mdx.mts --strict   # treat warnings as errors
 *   npx tsx scripts/validate-mdx.mts path/to/file.mdx [more.mdx ...]
 *
 * Exit codes:
 *   0 = all files compile AND pass schema (warnings allowed unless --strict)
 *   1 = one or more files have schema errors or MDX compile failures
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

// Dynamic import — the schema lives in `src/lib/blog.schema.ts` (CommonJS-
// transpiled by tsx) while this script is `.mts` (ESM). Static `import …
// from "../src/lib/blog.schema"` resolves to a CJS namespace whose named
// exports aren't visible across the ESM↔CJS boundary. Dynamic import
// awaits the same module object but lets us destructure properly.
const schemaModule = await import("../src/lib/blog.schema");
const {
  BlogFrontmatterSchema,
  RECOMMENDED_FIELDS,
  FAQ_REQUIRED_CATEGORIES,
} = schemaModule;
type BlogCategory = (typeof schemaModule.BLOG_CATEGORY_SLUGS)[number];

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

type Issue = {
  file: string;
  severity: "error" | "warning";
  message: string;
  line?: number;
  column?: number;
};

/**
 * Runs the Zod contract against parsed frontmatter. Returns a list of errors
 * (schema violations) and warnings (missing recommended fields). The Zod
 * schema is the single source of truth — if a field's missing here, add it
 * to src/lib/blog.schema.ts, not to this function.
 */
function checkFrontmatter(
  data: Record<string, unknown>,
  body: string,
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Schema validation — required + format checks for every defined field.
  const result = BlogFrontmatterSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      errors.push(`${path}: ${issue.message}`);
    }
  }

  // 2. Recommended-field warnings — present-but-empty or missing optional
  //    fields that we want on every post.
  for (const field of RECOMMENDED_FIELDS) {
    const v = data[field];
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) {
      warnings.push(
        `${field}: missing — AEO surface is smaller than it could be (see src/lib/blog.schema.ts)`,
      );
    }
  }

  // 3. Conditional rule: posts in FAQ-recommended categories must have either
  //    a frontmatter `faq:` block OR a <FAQ> component in the body. Otherwise
  //    they emit no FAQPage JSON-LD at all.
  const category = typeof data.category === "string" ? (data.category as BlogCategory) : null;
  const hasFaqFrontmatter = Array.isArray(data.faq) && (data.faq as unknown[]).length > 0;
  const hasFaqComponent = /<FAQ[\s>]/.test(body);
  if (category && FAQ_REQUIRED_CATEGORIES.includes(category)) {
    if (!hasFaqFrontmatter && !hasFaqComponent) {
      warnings.push(
        `faq: missing — category "${category}" should emit FAQPage JSON-LD (add 'faq:' to frontmatter, preferred)`,
      );
    }
  }

  // 4. Anti-pattern warning: post has BOTH frontmatter faq: AND <FAQ> in
  //    body. This emits the same questions as JSON-LD twice. Pick one.
  if (hasFaqFrontmatter && hasFaqComponent) {
    warnings.push(
      `faq: duplicate — frontmatter faq: AND <FAQ> in body both emit FAQPage JSON-LD. Remove the <FAQ> tag.`,
    );
  }

  // 5. Stale-content warning: post is older than 365 days and has no
  //    `updated:` field. dateModified equals datePublished, which is a
  //    weakening freshness signal as time passes.
  if (typeof data.date === "string" && !data.updated) {
    const ageDays = (Date.now() - new Date(data.date).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 365) {
      warnings.push(
        `updated: missing on ${Math.floor(ageDays)}-day-old post — Article schema dateModified is stale`,
      );
    }
  }

  // 6. SERP snippet warning: description over 200 chars will be truncated
  //    in Google's SERP snippet. The Zod schema's hard cap is 350 (anything
  //    above that is almost certainly the lede pasted in by mistake). The
  //    soft cap is 200, where Google starts cutting off the snippet.
  if (typeof data.description === "string" && data.description.length > 200) {
    warnings.push(
      `description: ${data.description.length} chars — Google truncates SERP snippets around 155-200 chars`,
    );
  }

  return { errors, warnings };
}

async function validate(file: string): Promise<Issue[]> {
  const issues: Issue[] = [];
  const raw = fs.readFileSync(file, "utf-8");
  const { content, data } = matter(raw);

  // 1. Frontmatter schema check (cheap, catches non-MDX bugs).
  const { errors, warnings } = checkFrontmatter(data, content);
  for (const err of errors) {
    issues.push({ file, severity: "error", message: `frontmatter: ${err}` });
  }
  for (const warn of warnings) {
    issues.push({ file, severity: "warning", message: `frontmatter: ${warn}` });
  }

  // 2. MDX compile (catches JSX parser failures). Skip if frontmatter has
  //    errors — the file isn't shippable anyway and the MDX error would
  //    just be noise.
  if (errors.length === 0) {
    try {
      await compile(content, { format: "mdx" });
    } catch (err: any) {
      issues.push({
        file,
        severity: "error",
        message: err.reason ?? err.message ?? String(err),
        line: err.line,
        column: err.column,
      });
    }
  }

  return issues;
}

async function main() {
  const argv = process.argv.slice(2);
  const strict = argv.includes("--strict");
  const files = pickFiles(argv);

  if (files.length === 0) {
    process.exit(0);
  }

  console.log(`Validating ${files.length} MDX file(s)...`);
  const allIssues: Issue[] = [];

  for (const file of files) {
    const issues = await validate(file);
    allIssues.push(...issues);
  }

  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  // Group by file for readable output.
  const byFile = new Map<string, Issue[]>();
  for (const i of allIssues) {
    if (!byFile.has(i.file)) byFile.set(i.file, []);
    byFile.get(i.file)!.push(i);
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):\n`);
    for (const [file, issues] of byFile) {
      const fileWarnings = issues.filter((i) => i.severity === "warning");
      if (fileWarnings.length === 0) continue;
      const rel = path.relative(ROOT, file);
      console.warn(`  ${rel}`);
      for (const w of fileWarnings) {
        console.warn(`    ⚠ ${w.message}`);
      }
    }
  }

  if (errors.length === 0) {
    if (warnings.length > 0 && strict) {
      console.error(
        `\nFAILED — --strict treats ${warnings.length} warning(s) as errors.`,
      );
      process.exit(1);
    }
    const tag = warnings.length > 0 ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : "";
    console.log(`\nOK — ${files.length} file(s) compile cleanly${tag}.`);
    process.exit(0);
  }

  console.error(`\nFAILED — ${errors.length} error(s) in ${files.length} file(s):\n`);
  for (const [file, issues] of byFile) {
    const fileErrors = issues.filter((i) => i.severity === "error");
    if (fileErrors.length === 0) continue;
    const rel = path.relative(ROOT, file);
    console.error(`  ${rel}`);
    for (const e of fileErrors) {
      const loc = e.line ? ` (line ${e.line}${e.column ? `, col ${e.column}` : ""})` : "";
      console.error(`    ✗ ${e.message}${loc}`);
    }
  }
  console.error(
    "\nCommon fixes:\n" +
      "  Schema errors    → fix the frontmatter to match src/lib/blog.schema.ts\n" +
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
