import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

interface Row {
  file: string;
  category: string;
  hasCTA: boolean;
  isToneRecipe: boolean;
}

const rows: Row[] = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  let category = "";
  if (fmMatch) {
    const catMatch = fmMatch[1].match(/category:\s*['"]?([^'"\n]+?)['"]?\s*$/im);
    if (catMatch) category = catMatch[1].trim().replace(/['"]/g, "");
  }
  const hasCTA = raw.includes("<SaveThisTone");
  const isToneRecipe =
    category.toLowerCase().includes("tone-recipe") ||
    category.toLowerCase().includes("tone recipe") ||
    /recipe|tone/.test(f.toLowerCase());
  rows.push({
    file: f.replace(".mdx", ""),
    category,
    hasCTA,
    isToneRecipe,
  });
}

const missing = rows.filter((r) => r.isToneRecipe && !r.hasCTA);
console.log(`Tone-recipe posts missing SaveThisTone CTA: ${missing.length}\n`);
for (const r of missing) {
  console.log(`  ${r.file}  [${r.category}]`);
}
