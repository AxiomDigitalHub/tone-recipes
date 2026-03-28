/**
 * Database row types matching the Supabase schema.
 * These are the "wire" types returned from queries.
 * The existing app types in @/types/recipe.ts remain the canonical shape
 * used by components -- the query layer maps between the two.
 */

export interface DbArtist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  genres: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSong {
  id: string;
  artist_id: string;
  title: string;
  slug: string;
  album: string;
  year: number;
  genres: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  external_tab_url: string | null;
  external_video_url: string | null;
  spotify_track_id: string | null;
  created_at: string;
}

export interface DbGearItem {
  id: string;
  name: string;
  slug: string;
  type: "guitar" | "effect" | "amp" | "cabinet" | "microphone";
  subcategory: string | null;
  manufacturer: string;
  icon_type: string;
  icon_color: string;
  description: string;
  default_settings: Record<string, unknown> | null;
  created_at: string;
}

export interface DbGearModelerEquivalent {
  id: string;
  gear_id: string;
  platform: string;
  equivalent_name: string;
}

export interface DbToneRecipe {
  id: string;
  song_id: string;
  title: string;
  slug: string;
  description: string;
  tone_context: string;
  guitar_specs: Record<string, unknown>;
  original_gear: Record<string, unknown>;
  tags: string[];
  sources: string[];
  is_editorial: boolean;
  view_count: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbSignalChainNode {
  id: string;
  recipe_id: string;
  position: number;
  category: string;
  subcategory: string | null;
  gear_id: string | null;
  gear_name: string;
  icon_type: string;
  icon_color: string;
  is_in_effects_loop: boolean;
  settings: Record<string, string | number>;
  notes: string;
}

export interface DbPlatformTranslation {
  id: string;
  recipe_id: string;
  platform: string;
  notes: string;
}

export interface DbPlatformBlock {
  id: string;
  translation_id: string;
  position: number;
  block_name: string;
  block_category: string;
  original_gear: string;
  settings: Record<string, string | number>;
  notes: string;
}

/** Supabase generated-types shorthand for use with createClient<Database>() */
export interface Database {
  public: {
    Tables: {
      artists: { Row: DbArtist };
      songs: { Row: DbSong };
      gear_items: { Row: DbGearItem };
      gear_modeler_equivalents: { Row: DbGearModelerEquivalent };
      tone_recipes: { Row: DbToneRecipe };
      signal_chain_nodes: { Row: DbSignalChainNode };
      platform_translations: { Row: DbPlatformTranslation };
      platform_blocks: { Row: DbPlatformBlock };
    };
  };
}
