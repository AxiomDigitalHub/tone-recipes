-- 001_initial_schema.sql
-- Relational schema for tone-recipes app

-- Artists
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  genres TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Songs
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  album TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  external_tab_url TEXT,
  external_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gear items
CREATE TABLE gear_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('guitar', 'effect', 'amp', 'cabinet', 'microphone')),
  subcategory TEXT,
  manufacturer TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  icon_color TEXT NOT NULL DEFAULT '#a1a1aa',
  description TEXT NOT NULL DEFAULT '',
  default_settings JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gear modeler equivalents (one row per gear+platform)
CREATE TABLE gear_modeler_equivalents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gear_id UUID REFERENCES gear_items(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('helix', 'quad_cortex', 'tonex', 'fractal', 'kemper', 'katana')),
  equivalent_name TEXT NOT NULL,
  UNIQUE (gear_id, platform)
);

-- Tone recipes
CREATE TABLE tone_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tone_context TEXT NOT NULL DEFAULT 'full_song',
  guitar_specs JSONB NOT NULL,
  original_gear JSONB NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sources TEXT[] NOT NULL DEFAULT '{}',
  is_editorial BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Signal chain nodes (one per recipe, ordered by position)
CREATE TABLE signal_chain_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES tone_recipes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('guitar', 'effect', 'preamp', 'wet_effect', 'power_amp', 'cabinet', 'microphone')),
  subcategory TEXT,
  gear_id UUID REFERENCES gear_items(id),
  gear_name TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  icon_color TEXT NOT NULL DEFAULT '#a1a1aa',
  is_in_effects_loop BOOLEAN DEFAULT false,
  settings JSONB NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  UNIQUE (recipe_id, position)
);

-- Platform translations
CREATE TABLE platform_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES tone_recipes(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('physical', 'helix', 'quad_cortex', 'tonex', 'fractal', 'kemper', 'katana')),
  notes TEXT NOT NULL DEFAULT '',
  UNIQUE (recipe_id, platform)
);

-- Platform translation blocks
CREATE TABLE platform_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID REFERENCES platform_translations(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  block_name TEXT NOT NULL,
  block_category TEXT NOT NULL,
  original_gear TEXT NOT NULL DEFAULT '',
  settings JSONB NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT ''
);

-- Indexes
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_recipes_song ON tone_recipes(song_id);
CREATE INDEX idx_chain_recipe ON signal_chain_nodes(recipe_id);
CREATE INDEX idx_translations_recipe ON platform_translations(recipe_id);
CREATE INDEX idx_blocks_translation ON platform_blocks(translation_id);
CREATE INDEX idx_recipes_tags ON tone_recipes USING GIN(tags);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON tone_recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
