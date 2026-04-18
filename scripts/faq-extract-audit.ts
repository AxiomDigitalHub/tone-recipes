/**
 * Audit: how many tone blog posts have FAQ content our extractor picks up?
 *
 *   Before the 2026-04-18 switch, the extractor only handled H3-style
 *   questions and missed most posts (which use bold-text **Q?** format).
 *   This script confirms the switch works across the corpus.
 */

import fs from "node:fs";
import path from "node:path";
import { extractFAQFromMarkdown } from "../src/lib/blog/extract-faq";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

let postsWithFAQ = 0;
let totalQuestions = 0;
const summary: Array<{ slug: string; count: number }> = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
  const items = extractFAQFromMarkdown(content);
  if (items.length > 0) {
    postsWithFAQ++;
    totalQuestions += items.length;
    summary.push({ slug: f.replace(".mdx", ""), count: items.length });
  }
}

summary.sort((a, b) => b.count - a.count);

console.log(`FAQ-extraction audit: ${postsWithFAQ} posts have parseable FAQ sections`);
console.log(`Total FAQ questions that will now emit JSON-LD: ${totalQuestions}\n`);
console.log("Top 20 by question count:");
for (const r of summary.slice(0, 20)) {
  console.log(`  ${String(r.count).padStart(3)}  ${r.slug}`);
}
