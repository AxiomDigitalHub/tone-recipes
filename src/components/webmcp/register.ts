import {
  toneRecipes,
  artists,
  songs,
  gearItems,
  getRecipeBySlug,
  getArtistBySlug,
  getSongBySlug,
} from "@/lib/data";
import type { Platform, ToneRecipe } from "@/types/recipe";

// ---------------------------------------------------------------------------
// WebMCP tool registration — https://webmachinelearning.github.io/webmcp/
//
// Exposes the site's core read paths (search, recipe detail, platform
// settings) to in-browser AI agents via navigator.modelContext. This module
// is dynamically imported by WebMcpProvider ONLY when the API exists, so the
// full @/lib/data payload never ships to regular visitors.
// ---------------------------------------------------------------------------

interface ToolContent {
  content: Array<{ type: "text"; text: string }>;
}

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<ToolContent>;
}

export interface ModelContext {
  provideContext?: (context: { tools: ModelContextTool[] }) => unknown;
  registerTool?: (tool: ModelContextTool) => unknown;
}

const PLATFORMS: Platform[] = [
  "pedalboard",
  "helix",
  "quad_cortex",
  "tonex",
  "fractal",
  "kemper",
  "katana",
];

function asText(data: unknown): ToolContent {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function absUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

function recipeSummary(r: ToneRecipe) {
  const song = getSongBySlug(r.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  return {
    title: r.title,
    slug: r.slug,
    song: song?.title,
    artist: artist?.name,
    description: r.description,
    tags: r.tags,
    platforms: Object.keys(r.platform_translations),
    url: absUrl(`/recipe/${r.slug}`),
  };
}

const tools: ModelContextTool[] = [
  {
    name: "search-tones",
    description:
      "Search Fader & Knob's catalog of guitar tone recipes, artists, songs, and gear. Returns matches with titles, descriptions, and page URLs. Use this first when looking for a specific tone, artist, song, or piece of gear.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Free-text search, e.g. an artist name ('SRV'), song title ('Comfortably Numb'), gear ('Tube Screamer'), or style ('blues').",
        },
        limit: {
          type: "number",
          description: "Max results per category (default 5).",
        },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const query = String(input.query ?? "").toLowerCase().trim();
      const limit = Math.min(Math.max(Number(input.limit) || 5, 1), 20);
      if (!query) return asText({ error: "query is required" });

      const recipes = toneRecipes
        .filter((r) =>
          [r.title, r.description, ...r.tags].join(" ").toLowerCase().includes(query),
        )
        .slice(0, limit)
        .map(recipeSummary);

      const matchedArtists = artists
        .filter((a) => a.name.toLowerCase().includes(query))
        .slice(0, limit)
        .map((a) => ({
          name: a.name,
          genres: a.genres,
          url: absUrl(`/artist/${a.slug}`),
        }));

      const matchedSongs = songs
        .filter((s) => s.title.toLowerCase().includes(query))
        .slice(0, limit)
        .map((s) => {
          const recipe = toneRecipes.find((r) => r.song_slug === s.slug);
          return {
            title: s.title,
            artist: getArtistBySlug(s.artist_slug)?.name ?? s.artist_slug,
            year: s.year,
            recipe_slug: recipe?.slug,
            url: absUrl(recipe ? `/recipe/${recipe.slug}` : `/artist/${s.artist_slug}`),
          };
        });

      const gear = gearItems
        .filter((g) => `${g.name} ${g.manufacturer}`.toLowerCase().includes(query))
        .slice(0, limit)
        .map((g) => ({
          name: g.name,
          manufacturer: g.manufacturer,
          type: g.type,
          url: absUrl(`/gear/${g.slug}`),
        }));

      return asText({ recipes, artists: matchedArtists, songs: matchedSongs, gear });
    },
  },
  {
    name: "list-tone-recipes",
    description:
      "List tone recipes, optionally filtered by artist name, tag (genre/style), or supported platform (helix, quad_cortex, tonex, fractal, kemper, katana, pedalboard). Returns compact summaries with URLs.",
    inputSchema: {
      type: "object",
      properties: {
        artist: { type: "string", description: "Filter by artist name (substring match)." },
        tag: { type: "string", description: "Filter by tag, e.g. 'blues', 'high-gain', 'worship'." },
        platform: {
          type: "string",
          enum: PLATFORMS,
          description: "Only recipes with a translation for this platform.",
        },
        limit: { type: "number", description: "Max results (default 20)." },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const artistQ = String(input.artist ?? "").toLowerCase().trim();
      const tagQ = String(input.tag ?? "").toLowerCase().trim();
      const platformQ = String(input.platform ?? "").trim() as Platform;
      const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);

      let results = toneRecipes;
      if (artistQ) {
        const artistSlugs = new Set(
          artists.filter((a) => a.name.toLowerCase().includes(artistQ)).map((a) => a.slug),
        );
        const songSlugs = new Set(
          songs.filter((s) => artistSlugs.has(s.artist_slug)).map((s) => s.slug),
        );
        results = results.filter((r) => songSlugs.has(r.song_slug));
      }
      if (tagQ) {
        results = results.filter((r) => r.tags.some((t) => t.toLowerCase().includes(tagQ)));
      }
      if (platformQ) {
        results = results.filter((r) => platformQ in r.platform_translations);
      }

      return asText(results.slice(0, limit).map(recipeSummary));
    },
  },
  {
    name: "get-tone-recipe",
    description:
      "Get a tone recipe's full details by slug: the song/artist it recreates, the original gear, the full signal chain with settings and notes, tags, and which modeler platforms have downloadable translations. Get slugs from search-tones or list-tone-recipes.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Recipe slug, e.g. 'cobain-teen-spirit-grunge'." },
      },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const recipe = getRecipeBySlug(String(input.slug ?? "").trim());
      if (!recipe) {
        return asText({
          error: `No recipe found for slug '${String(input.slug)}'. Use search-tones or list-tone-recipes to find valid slugs.`,
        });
      }
      const song = getSongBySlug(recipe.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
      return asText({
        title: recipe.title,
        slug: recipe.slug,
        song: song ? { title: song.title, album: song.album, year: song.year } : undefined,
        artist: artist?.name,
        description: recipe.description,
        tone_context: recipe.tone_context,
        guitar_specs: recipe.guitar_specs,
        original_gear: recipe.original_gear,
        signal_chain: recipe.signal_chain.map((n) => ({
          position: n.position,
          category: n.category,
          gear: n.gear_name,
          settings: n.settings,
          notes: n.notes,
        })),
        tags: recipe.tags,
        platforms_available: Object.keys(recipe.platform_translations),
        audio_demo: recipe.audio_demo
          ? { url: absUrl(recipe.audio_demo.audio_url), caption: recipe.audio_demo.caption }
          : undefined,
        url: absUrl(`/recipe/${recipe.slug}`),
      });
    },
  },
  {
    name: "get-platform-settings",
    description:
      "Get a tone recipe's exact block-by-block settings for a specific modeler platform (helix, quad_cortex, tonex, fractal, kemper, katana) or a physical pedalboard. Use get-tone-recipe first to see which platforms a recipe supports.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Recipe slug." },
        platform: { type: "string", enum: PLATFORMS, description: "Target platform." },
      },
      required: ["slug", "platform"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const recipe = getRecipeBySlug(String(input.slug ?? "").trim());
      if (!recipe) {
        return asText({ error: `No recipe found for slug '${String(input.slug)}'.` });
      }
      const platform = String(input.platform ?? "").trim() as Platform;
      const translation = recipe.platform_translations[platform];
      if (!translation) {
        return asText({
          error: `'${recipe.title}' has no ${platform} translation.`,
          platforms_available: Object.keys(recipe.platform_translations),
        });
      }
      return asText({
        recipe: recipe.title,
        platform,
        notes: translation.notes,
        blocks: translation.chain_blocks.map((b) => ({
          position: b.position,
          block: b.block_name,
          category: b.block_category,
          recreates: b.original_gear,
          settings: b.settings,
          notes: b.notes,
          bypassed_by_default: b.enabled === false || undefined,
        })),
        url: absUrl(`/recipe/${recipe.slug}`),
      });
    },
  },
  {
    name: "open-page",
    description:
      "Navigate the browser to a page on this site, e.g. a recipe URL from search results, /browse, /pricing, or /request to request a new tone. Accepts site-relative paths only.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Site-relative path starting with '/', e.g. '/recipe/cobain-teen-spirit-grunge'.",
        },
      },
      required: ["path"],
    },
    execute: async (input) => {
      const path = String(input.path ?? "").trim();
      if (!path.startsWith("/") || path.startsWith("//")) {
        return asText({ error: "path must be a site-relative path starting with '/'" });
      }
      const url = new URL(path, window.location.origin);
      if (url.origin !== window.location.origin) {
        return asText({ error: "External URLs are not allowed." });
      }
      window.location.assign(url.toString());
      return asText({ ok: true, navigated_to: url.toString() });
    },
  },
];

export function registerWebMcpTools(modelContext: ModelContext): void {
  if (typeof modelContext.provideContext === "function") {
    modelContext.provideContext({ tools });
  } else if (typeof modelContext.registerTool === "function") {
    for (const tool of tools) modelContext.registerTool(tool);
  }
}
