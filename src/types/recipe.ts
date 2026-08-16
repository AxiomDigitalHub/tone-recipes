export interface GuitarSpecs {
  body_type: "solid" | "semi_hollow" | "hollow";
  model_name: string;
  // "H" = a single humbucker (e.g. an ESP with one bridge 'bucker, a Les Paul
  // Junior-style layout). Distinct from "single" (single-coil) and "P90".
  pickup_config: "SSS" | "HSS" | "HH" | "HSH" | "SS" | "P90" | "single" | "H";
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
  settings: Record<string, string | number | boolean>;
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
  settings: Record<string, string | number | boolean>;
  notes: string;
  /**
   * Whether the block is bypassed by default. Used for multi-drive
   * stacks where 2-3 drive options live in the chain and the user
   * stomps the one they want. Undefined = enabled (default behavior).
   */
  enabled?: boolean;
  /**
   * For dual-mic cabs: an additional mic config that gets emitted as
   * a sibling `cab0` object on the same DSP, with the cab block
   * promoted to `@type: 4` using the WithPan model variant.
   *
   * Only valid on cab blocks. The recipe's `block_name` should resolve
   * to a model ID with a known WithPan variant (e.g. "4x12 Greenback 25"
   * → HD2_CabMicIr_4x12Greenback25WithPan). If no WithPan variant
   * exists in the inventory, the sibling is dropped and a warning is
   * logged — the file falls back to single-mic legacy format.
   *
   * Settings shape mirrors the WithPan cab params:
   *   { Mic: int, Position: 0-1, Distance: int, Angle: 0|1, Pan: 0-1,
   *     LowCut: Hz, HighCut: Hz, Level: dB, Delay: int }
   */
  cabSibling?: Record<string, string | number | boolean>;
}

export interface PlatformTranslation {
  chain_blocks: PlatformBlock[];
  notes: string;
}

export type Platform = "pedalboard" | "helix" | "quad_cortex" | "tonex" | "fractal" | "kemper" | "katana";

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
  /**
   * How well-established it is that *this player* played *this part*.
   *
   * The corpus is already scrupulous about this distinction in prose — it
   * debunks the Strokes' "Crate VC30" myth by name — but the distinction was
   * never a field, so a documented rig and a plausible guess rendered
   * identically. Per `docs/CORPUS_QC_SCORECARD.md` finding #2:
   *
   * - `documented` — named for this part in credits or an interview
   * - `pool` — credited on the record, but the label never says who played
   *   this particular part (e.g. Bethel credits electric guitar as an
   *   unordered pool). Plausible-from-the-pool is not documented.
   * - `tribute` — no usable documentation; reconstructed from the recording
   *
   * Absent means "not yet reviewed", which the page states plainly rather
   * than defaulting to the flattering answer.
   */
  attribution_confidence?: "documented" | "pool" | "tribute";
  /** ISO date (YYYY-MM-DD) the recipe was first published. Feeds sitemap lastmod. */
  created_at?: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful edit (audit fixes, gear corrections). */
  updated_at?: string;
  /**
   * Self-produced audio demo of THIS recipe's tone — a DI run through the
   * actual preset (see scripts/render-recipe-audio.mjs). Its presence is what
   * turns an *asserted* recipe into a *verified* one: the rendered clip is the
   * proof, and `rendered_at` is the honest "last tested" trust signal that
   * replaces the seeded reviews. Optional; recipes without a demo render no
   * player and emit no AudioObject/VideoObject schema.
   *
   * Usually supplied via the src/data/audio-demos.json manifest the render
   * script writes, not hand-set here.
   */
  audio_demo?: RecipeAudioDemo;
}

export interface RecipeAudioDemo {
  /** Public path to the rendered clip, e.g. /audio/cobain-teen-spirit-grunge.mp3 */
  audio_url: string;
  /** Optional waveform/visualizer video (for VideoObject + a richer embed). */
  video_url?: string;
  /** One line, e.g. "DI through the Helix preset — clean verse into the chorus hook." */
  caption: string;
  /** ISO date (YYYY-MM-DD) the clip was rendered. Doubles as the "verified" date. */
  rendered_at: string;
  /** Clip length in seconds (drives AudioObject/VideoObject `duration`). */
  duration_sec?: number;
  /** Honest provenance: what was played + the rig, e.g. "Strat DI → Helix Native 3.8". */
  source_note?: string;
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
  spotify_track_id?: string;
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
