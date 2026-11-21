import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { getPostSlugs } from "@/lib/blog";
import { getNewsSlugs } from "@/lib/news";
import { artists, gearItems, songs, toneRecipes } from "@/lib/data";
import { getAllPlatforms } from "@/lib/data/platforms";

/**
 * Every internal markdown link in content/blog and content/news must point
 * at a page that exists. Drafted posts kept linking to slugs that were never
 * written ("/blog/delay-block-guide", "/platforms/nux", ...). The 2026-11-20
 * GSC export showed 44 URLs returning 404 to Googlebot, and most came from
 * exactly these links.
 *
 * If this fails: point the link at a real page, or unlink the text. Don't add
 * a redirect for a page that never existed.
 */

const ROOT = process.cwd();
const APP = path.join(ROOT, "src/app");

const dynamic: Record<string, Set<string>> = {
  blog: new Set(getPostSlugs()),
  news: new Set(getNewsSlugs()),
  recipe: new Set(toneRecipes.map((r) => r.slug)),
  song: new Set(songs.map((s) => s.slug)),
  artist: new Set(artists.map((a) => a.slug)),
  gear: new Set(gearItems.map((g) => g.slug)),
  platforms: new Set(getAllPlatforms().map((p) => p.id)),
};

/** A static route exists if src/app/<path> holds a page or route file. */
function staticRouteExists(p: string): boolean {
  const dir = path.join(APP, p);
  return ["page.tsx", "page.ts", "route.ts", "page.mdx"].some((f) =>
    fs.existsSync(path.join(dir, f)),
  );
}

function resolves(href: string): boolean {
  const clean = href.split(/[?#]/)[0].replace(/\/+$/, "");
  if (clean === "") return true; // homepage or a bare #anchor
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 2 && dynamic[parts[0]]) return dynamic[parts[0]].has(parts[1]);
  if (/\.(png|jpe?g|webp|avif|gif|svg|pdf|hlx|json|xml|txt|mp3|wav)$/i.test(clean)) {
    return fs.existsSync(path.join(ROOT, "public", clean)) || staticRouteExists(clean);
  }
  return staticRouteExists(clean);
}

function contentFiles(dir: string): string[] {
  const abs = path.join(ROOT, dir);
  return fs
    .readdirSync(abs)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => path.join(dir, f));
}

const LINK = /\]\((\/[^)\s]*)\)|href="(\/[^"]*)"/g;

describe("internal links in content", () => {
  const broken: string[] = [];
  for (const file of [...contentFiles("content/blog"), ...contentFiles("content/news")]) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const m of text.matchAll(LINK)) {
      const href = m[1] ?? m[2];
      if (!resolves(href)) broken.push(`${file} -> ${href}`);
    }
  }

  it("all resolve to an existing page", () => {
    expect(broken).toEqual([]);
  });
});
