/**
 * Data access layer.
 *
 * Each function checks whether Supabase is configured.
 *   - If yes  -> queries Supabase
 *   - If no   -> falls back to the static data in @/lib/data
 *
 * The return types match the existing app types in @/types/recipe.ts so
 * consuming code does not need to change.
 */

import type {
  Artist,
  Song,
  GearItem,
  ToneRecipe,
  SignalChainNode,
  PlatformTranslation,
  PlatformBlock,
  Platform,
  GuitarSpecs,
  OriginalGear,
} from "@/types/recipe";
import { isSupabaseConfigured, createClient } from "./client";
import {
  artists as staticArtists,
  songs as staticSongs,
  gearItems as staticGear,
  toneRecipes as staticRecipes,
  getArtistBySlug as staticGetArtistBySlug,
  getSongBySlug as staticGetSongBySlug,
  getRecipeBySlug as staticGetRecipeBySlug,
  getRecipesBySongSlug as staticGetRecipesBySongSlug,
  getSongsByArtistSlug as staticGetSongsByArtistSlug,
  getGearBySlug as staticGetGearBySlug,
  getAllGenres as staticGetAllGenres,
  searchRecipes as staticSearchRecipes,
} from "@/lib/data";

// ---------------------------------------------------------------------------
// Helpers to map DB rows -> app types
// ---------------------------------------------------------------------------

function mapArtist(row: Record<string, unknown>): Artist {
  return {
    name: row.name as string,
    slug: row.slug as string,
    bio: (row.bio as string) ?? "",
    genres: (row.genres as string[]) ?? [],
    image_url: (row.image_url as string) ?? undefined,
  };
}

function mapSong(row: Record<string, unknown>, artistSlug?: string): Song {
  return {
    artist_slug: artistSlug ?? (row.artist_slug as string) ?? "",
    title: row.title as string,
    slug: row.slug as string,
    album: (row.album as string) ?? "",
    year: row.year as number,
    genres: (row.genres as string[]) ?? [],
    difficulty: row.difficulty as Song["difficulty"],
    external_tab_url: (row.external_tab_url as string) ?? undefined,
    external_video_url: (row.external_video_url as string) ?? undefined,
  };
}

function mapGearItem(
  row: Record<string, unknown>,
  equivalents?: Record<string, string>,
): GearItem {
  return {
    name: row.name as string,
    slug: row.slug as string,
    type: row.type as GearItem["type"],
    subcategory: (row.subcategory as string) ?? undefined,
    manufacturer: row.manufacturer as string,
    icon_type: row.icon_type as string,
    icon_color: row.icon_color as string,
    description: (row.description as string) ?? "",
    default_settings:
      (row.default_settings as Record<string, unknown>) ?? undefined,
    modeler_equivalents: equivalents ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Artists
// ---------------------------------------------------------------------------

export async function getArtists(): Promise<Artist[]> {
  if (!isSupabaseConfigured()) return staticArtists;
  const { data, error } = await createClient()
    .from("artists")
    .select("*")
    .order("name");
  if (error || !data) return staticArtists;
  return data.map((r) => mapArtist(r as Record<string, unknown>));
}

export async function getArtistBySlug(
  slug: string,
): Promise<Artist | undefined> {
  if (!isSupabaseConfigured()) return staticGetArtistBySlug(slug);
  const { data, error } = await createClient()
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return staticGetArtistBySlug(slug);
  return mapArtist(data as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Songs
// ---------------------------------------------------------------------------

export async function getSongs(): Promise<Song[]> {
  if (!isSupabaseConfigured()) return staticSongs;
  const { data, error } = await createClient()
    .from("songs")
    .select("*, artists!inner(slug)")
    .order("title");
  if (error || !data) return staticSongs;
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    const artist = row.artists as Record<string, unknown> | undefined;
    return mapSong(row, artist?.slug as string);
  });
}

export async function getSongBySlug(slug: string): Promise<Song | undefined> {
  if (!isSupabaseConfigured()) return staticGetSongBySlug(slug);
  const { data, error } = await createClient()
    .from("songs")
    .select("*, artists!inner(slug)")
    .eq("slug", slug)
    .single();
  if (error || !data) return staticGetSongBySlug(slug);
  const row = data as Record<string, unknown>;
  const artist = row.artists as Record<string, unknown> | undefined;
  return mapSong(row, artist?.slug as string);
}

export async function getSongsByArtistSlug(
  artistSlug: string,
): Promise<Song[]> {
  if (!isSupabaseConfigured()) return staticGetSongsByArtistSlug(artistSlug);
  const { data, error } = await createClient()
    .from("songs")
    .select("*, artists!inner(slug)")
    .eq("artists.slug", artistSlug)
    .order("year");
  if (error || !data) return staticGetSongsByArtistSlug(artistSlug);
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    return mapSong(row, artistSlug);
  });
}

// ---------------------------------------------------------------------------
// Gear
// ---------------------------------------------------------------------------

export async function getGearItems(): Promise<GearItem[]> {
  if (!isSupabaseConfigured()) return staticGear;
  const { data, error } = await createClient()
    .from("gear_items")
    .select("*, gear_modeler_equivalents(*)")
    .order("name");
  if (error || !data) return staticGear;
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    const eqs = (row.gear_modeler_equivalents ?? []) as Array<
      Record<string, unknown>
    >;
    const equivalents: Record<string, string> = {};
    for (const eq of eqs) {
      equivalents[eq.platform as string] = eq.equivalent_name as string;
    }
    return mapGearItem(row, Object.keys(equivalents).length ? equivalents : undefined);
  });
}

export async function getGearBySlug(
  slug: string,
): Promise<GearItem | undefined> {
  if (!isSupabaseConfigured()) return staticGetGearBySlug(slug);
  const { data, error } = await createClient()
    .from("gear_items")
    .select("*, gear_modeler_equivalents(*)")
    .eq("slug", slug)
    .single();
  if (error || !data) return staticGetGearBySlug(slug);
  const row = data as Record<string, unknown>;
  const eqs = (row.gear_modeler_equivalents ?? []) as Array<
    Record<string, unknown>
  >;
  const equivalents: Record<string, string> = {};
  for (const eq of eqs) {
    equivalents[eq.platform as string] = eq.equivalent_name as string;
  }
  return mapGearItem(row, Object.keys(equivalents).length ? equivalents : undefined);
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

async function assembleRecipe(
  row: Record<string, unknown>,
): Promise<ToneRecipe> {
  const client = createClient();
  const recipeId = row.id as string;

  // Fetch signal chain nodes
  const { data: chainData } = await client
    .from("signal_chain_nodes")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("position");

  const signal_chain: SignalChainNode[] = (chainData ?? []).map((n) => {
    const node = n as Record<string, unknown>;
    // Resolve gear_slug from gear_id if we have one
    return {
      position: node.position as number,
      category: node.category as SignalChainNode["category"],
      subcategory: (node.subcategory as string) ?? null,
      gear_slug: null, // will be resolved below if gear_id exists
      gear_name: node.gear_name as string,
      icon_type: node.icon_type as string,
      icon_color: node.icon_color as string,
      is_in_effects_loop: (node.is_in_effects_loop as boolean) ?? false,
      settings: (node.settings as Record<string, string | number>) ?? {},
      notes: (node.notes as string) ?? "",
    };
  });

  // Fetch platform translations with blocks
  const { data: translationData } = await client
    .from("platform_translations")
    .select("*, platform_blocks(*)")
    .eq("recipe_id", recipeId);

  const platform_translations: Partial<Record<Platform, PlatformTranslation>> =
    {};
  for (const t of translationData ?? []) {
    const trans = t as Record<string, unknown>;
    const blocks = (
      (trans.platform_blocks ?? []) as Array<Record<string, unknown>>
    )
      .sort(
        (a, b) => (a.position as number) - (b.position as number),
      )
      .map(
        (b): PlatformBlock => ({
          position: b.position as number,
          block_name: b.block_name as string,
          block_category: b.block_category as string,
          original_gear: (b.original_gear as string) ?? "",
          settings: (b.settings as Record<string, string | number>) ?? {},
          notes: (b.notes as string) ?? "",
        }),
      );
    platform_translations[trans.platform as Platform] = {
      chain_blocks: blocks,
      notes: (trans.notes as string) ?? "",
    };
  }

  // Look up the song slug
  let songSlug = "";
  if (row.song_id) {
    const { data: songData } = await client
      .from("songs")
      .select("slug")
      .eq("id", row.song_id as string)
      .single();
    if (songData) songSlug = (songData as Record<string, unknown>).slug as string;
  }

  return {
    id: recipeId,
    song_slug: songSlug,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? "",
    tone_context: (row.tone_context as string) ?? "full_song",
    guitar_specs: row.guitar_specs as GuitarSpecs,
    signal_chain,
    original_gear: row.original_gear as OriginalGear,
    tags: (row.tags as string[]) ?? [],
    sources: (row.sources as string[]) ?? [],
    platform_translations,
    is_editorial: (row.is_editorial as boolean) ?? false,
    view_count: (row.view_count as number) ?? 0,
    rating_avg: (row.rating_avg as number) ?? 0,
    rating_count: (row.rating_count as number) ?? 0,
  };
}

export async function getRecipes(): Promise<ToneRecipe[]> {
  if (!isSupabaseConfigured()) return staticRecipes;
  const { data, error } = await createClient()
    .from("tone_recipes")
    .select("*")
    .order("title");
  if (error || !data) return staticRecipes;
  return Promise.all(
    data.map((r) => assembleRecipe(r as Record<string, unknown>)),
  );
}

export async function getRecipeBySlug(
  slug: string,
): Promise<ToneRecipe | undefined> {
  if (!isSupabaseConfigured()) return staticGetRecipeBySlug(slug);
  const { data, error } = await createClient()
    .from("tone_recipes")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return staticGetRecipeBySlug(slug);
  return assembleRecipe(data as Record<string, unknown>);
}

export async function getRecipesBySongSlug(
  songSlug: string,
): Promise<ToneRecipe[]> {
  if (!isSupabaseConfigured()) return staticGetRecipesBySongSlug(songSlug);
  // First resolve song_id from slug
  const { data: songData } = await createClient()
    .from("songs")
    .select("id")
    .eq("slug", songSlug)
    .single();
  if (!songData) return staticGetRecipesBySongSlug(songSlug);
  const songId = (songData as Record<string, unknown>).id as string;
  const { data, error } = await createClient()
    .from("tone_recipes")
    .select("*")
    .eq("song_id", songId)
    .order("title");
  if (error || !data) return staticGetRecipesBySongSlug(songSlug);
  return Promise.all(
    data.map((r) => assembleRecipe(r as Record<string, unknown>)),
  );
}

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

export async function getAllGenres(): Promise<string[]> {
  if (!isSupabaseConfigured()) return staticGetAllGenres();
  const { data, error } = await createClient()
    .from("songs")
    .select("genres");
  if (error || !data) return staticGetAllGenres();
  const genreSet = new Set<string>();
  for (const row of data) {
    for (const g of (row as Record<string, unknown>).genres as string[]) {
      genreSet.add(g);
    }
  }
  return Array.from(genreSet).sort();
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export async function searchRecipes(query: string): Promise<ToneRecipe[]> {
  if (!isSupabaseConfigured()) return staticSearchRecipes(query);
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  // For a basic search, use ilike on title + description.
  // A proper full-text search index can come later.
  const { data, error } = await createClient()
    .from("tone_recipes")
    .select("*")
    .or(`title.ilike.%${lower}%,description.ilike.%${lower}%`)
    .order("title");
  if (error || !data) return staticSearchRecipes(query);
  return Promise.all(
    data.map((r) => assembleRecipe(r as Record<string, unknown>)),
  );
}
