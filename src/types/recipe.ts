export interface GuitarSpecs {
  body_type: "solid" | "semi_hollow" | "hollow";
  model_name: string;
  pickup_config: "SSS" | "HSS" | "HH" | "HSH" | "SS" | "P90" | "single";
  pickup_position: string;
  string_count: number;
  scale_length: string;
  tuning: string;
  tuning_custom?: string;
  string_gauge: string;
  notable_mods?: string;
  gear_id?: string;
}

export interface SignalChainNode {
  position: number;
  category: "guitar" | "effect" | "preamp" | "wet_effect" | "power_amp" | "cabinet" | "microphone";
  subcategory: string | null;
  gear_slug: string | null;
  gear_name: string;
  icon_type: string;
  icon_color: string;
  is_in_effects_loop: boolean;
  settings: Record<string, string | number>;
  notes: string;
}

export interface OriginalGear {
  guitar: string;
  effects: string[];
  amp: string;
  cabinet: string;
  microphone: string;
  other_notes?: string;
}

export interface PlatformBlock {
  position: number;
  block_name: string;
  block_category: string;
  original_gear: string;
  settings: Record<string, string | number>;
  notes: string;
}

export interface PlatformTranslation {
  chain_blocks: PlatformBlock[];
  notes: string;
}

export type Platform = "physical" | "helix" | "quad_cortex" | "tonex" | "fractal" | "kemper" | "katana";

export interface ToneRecipe {
  id: string;
  song_slug: string;
  title: string;
  slug: string;
  description: string;
  tone_context: string;
  guitar_specs: GuitarSpecs;
  signal_chain: SignalChainNode[];
  original_gear: OriginalGear;
  tags: string[];
  sources: string[];
  platform_translations: Partial<Record<Platform, PlatformTranslation>>;
  is_editorial: boolean;
  view_count: number;
  rating_avg: number;
  rating_count: number;
}

export interface Artist {
  name: string;
  slug: string;
  bio: string;
  genres: string[];
  image_url?: string;
}

export interface Song {
  artist_slug: string;
  title: string;
  slug: string;
  album: string;
  album_art_url?: string;
  year: number;
  genres: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  external_tab_url?: string;
  external_video_url?: string;
}

export interface GearItem {
  name: string;
  slug: string;
  type: "guitar" | "effect" | "amp" | "cabinet" | "microphone";
  subcategory?: string;
  manufacturer: string;
  icon_type: string;
  icon_color: string;
  description: string;
  default_settings?: Record<string, unknown>;
  modeler_equivalents?: Record<string, string>;
}
