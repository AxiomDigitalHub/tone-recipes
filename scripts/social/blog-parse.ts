import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BLOG_DIR } from "./paths";

export interface Table {
  heading: string | null;
  header: string[];
  rows: string[][];
}
export interface Grid {
  title: string;
  subtitle: string | null;
  knobs: { name: string; value: string; display: string | null }[];
}
export interface ParsedBlog {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  tables: Table[];
  grids: Grid[];
  takeaways: string[];
}

/** Strip inline markdown so a cell renders as plain text. */
export function plainCell(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(plainCell);
}

export function parseTables(body: string): Table[] {
  const lines = body.split("\n");
  const tables: Table[] = [];
  let heading: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{2,4}\s+(.*)$/);
    if (h) heading = plainCell(h[1]);
    if (/^\s*\|/.test(lines[i]) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(lines[i]);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && /^\s*\|/.test(lines[j])) {
        const r = splitRow(lines[j]);
        if (r.length === header.length) rows.push(r);
        j++;
      }
      tables.push({ heading, header, rows });
      i = j - 1;
    }
  }
  return tables;
}

export function parseGrids(body: string): Grid[] {
  const grids: Grid[] = [];
  const re = /<SettingsGrid([^>]*)>([\s\S]*?)<\/SettingsGrid>/g;
  for (const m of body.matchAll(re)) {
    const attrs = m[1];
    const title = attrs.match(/title="([^"]*)"/)?.[1] ?? "Settings";
    const subtitle = attrs.match(/subtitle="([^"]*)"/)?.[1] ?? null;
    const knobs: Grid["knobs"] = [];
    for (const k of m[2].matchAll(/<Knob\s+([^>]*?)\/>/g)) {
      const a = k[1];
      const name = a.match(/name="([^"]*)"/)?.[1];
      const value = a.match(/value=\{([^}]*)\}/)?.[1] ?? a.match(/value="([^"]*)"/)?.[1];
      const display = a.match(/display="([^"]*)"/)?.[1] ?? null;
      if (name && value !== undefined) knobs.push({ name, value: value.trim(), display });
    }
    grids.push({ title, subtitle, knobs });
  }
  return grids;
}

export function parseBlog(slug: string): ParsedBlog {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  const takeaways = Array.isArray(data.takeaways) ? data.takeaways.map((t: unknown) => String(t).replace(/\s+/g, " ").trim()) : [];
  return { slug, frontmatter: data, body: content, tables: parseTables(content), grids: parseGrids(content), takeaways };
}

/** A "settings table": ≥2 columns, ≥2 rows, ≥50% of value cells contain a digit. */
export function isSettingsTable(t: Table): boolean {
  if (t.header.length < 2 || t.rows.length < 2) return false;
  const cells = t.rows.flatMap((r) => r.slice(1));
  const withDigit = cells.filter((c) => /\d/.test(c)).length;
  return withDigit / Math.max(1, cells.length) >= 0.5;
}

export const PERSONA_TESTING_RE = /\b(I tested|we tested|I've owned|I have owned|in my studio|I tried)\b/i;
