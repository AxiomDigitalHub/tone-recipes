import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getArtistBySlug, getRecipeBySlug, getRecipesBySongSlug, getSongBySlug, songs, toneRecipes } from "@/lib/data";
import { songHref } from "@/lib/song-href";
import { browseIndexing } from "@/lib/browse-seo";
import { recipeH1Text, recipeSeoDescription, recipeSeoTitle } from "@/lib/recipe-seo";

const root = path.resolve(__dirname, "..");

describe("SEO fix 5: song links", () => {
  it("a one-recipe song has no /song/ link", () => {
    const one = songs.find((s) => getRecipesBySongSlug(s.slug).length === 1);
    expect(one).toBeDefined();
    expect(songHref(one!.slug)).toBeNull();
  });

  it("a song with no recipe has no /song/ link", () => {
    const none = songs.find((s) => getRecipesBySongSlug(s.slug).length === 0);
    if (none) expect(songHref(none.slug)).toBeNull();
  });

  it("recipe and artist pages build song links only through songHref", () => {
    for (const f of ["src/app/recipe/[slug]/page.tsx", "src/app/artist/[slug]/page.tsx"]) {
      const src = readFileSync(path.join(root, f), "utf8");
      expect(src).not.toMatch(/href=\{`\/song\//);
    }
  });
});

describe("SEO fix 5: browse indexing", () => {
  it("/browse?platform=helix canonicals to /browse while Helix covers every recipe", () => {
    expect(toneRecipes.every((r) => r.platform_translations?.helix)).toBe(true);
    expect(browseIndexing({ platform: "helix" }, 1, toneRecipes)).toEqual({ canonical: "/browse" });
  });

  it("a platform that covers fewer recipes keeps its own canonical", () => {
    const partial = [{ platform_translations: { helix: { chain_blocks: [], notes: "" } } }, { platform_translations: {} }];
    expect(browseIndexing({ platform: "helix" }, 1, partial).canonical).toBe("/browse?platform=helix");
  });

  it("2+ facets is noindex,follow", () => {
    expect(browseIndexing({ era: "1980", genre: "rock" }, 1, toneRecipes)).toEqual({
      canonical: "/browse?era=1980&genre=rock",
      robots: { index: false, follow: true },
    });
  });

  it("page 2 is noindex,follow with its own canonical", () => {
    expect(browseIndexing({}, 2, toneRecipes)).toEqual({
      canonical: "/browse?page=2",
      robots: { index: false, follow: true },
    });
  });

  it("/browse and single era or genre facets stay indexable", () => {
    expect(browseIndexing({}, 1, toneRecipes).robots).toBeUndefined();
    expect(browseIndexing({ era: "1980" }, 1, toneRecipes)).toEqual({ canonical: "/browse?era=1980" });
    expect(browseIndexing({ genre: "rock" }, 1, toneRecipes)).toEqual({ canonical: "/browse?genre=rock" });
  });
});

describe("SEO fix 1: recipe titles and descriptions", () => {
  const rows = toneRecipes.map((r) => {
    const song = getSongBySlug(r.song_slug);
    const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
    return { r, title: recipeSeoTitle(r, song, artist), desc: recipeSeoDescription(r, song, artist) };
  });

  it("every title fits in 60 and every description in 150", () => {
    for (const { title, desc } of rows) {
      expect(title.length).toBeLessThanOrEqual(60);
      expect(desc.length).toBeLessThanOrEqual(150);
    }
  });

  it("no two recipes share a title", () => {
    expect(new Set(rows.map((x) => x.title)).size).toBe(rows.length);
  });

  it("matches the doc's Pride and Joy example", () => {
    const r = getRecipeBySlug("srv-pride-and-joy-rhythm")!;
    const song = getSongBySlug(r.song_slug);
    const artist = getArtistBySlug(song!.artist_slug);
    expect(recipeSeoTitle(r, song, artist)).toBe("Pride and Joy Guitar Tone (Stevie Ray Vaughan): Helix Preset");
    expect(recipeH1Text(r, song, artist)).toBe("Pride and Joy by Stevie Ray Vaughan: guitar tone recipe");
  });
});
