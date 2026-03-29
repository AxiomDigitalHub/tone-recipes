-- 003_users_and_saved_recipes.sql
-- User profiles and saved recipes

-- User profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium', 'creator', 'admin')),
  primary_platform TEXT CHECK (primary_platform IN ('helix', 'quad_cortex', 'tonex', 'fractal', 'kemper', 'katana', 'physical')),
  owned_gear JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saved recipes (user's personal library)
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_slug TEXT NOT NULL,
  notes TEXT DEFAULT '',
  setlist_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_slug)
);

-- User gear (what gear the user owns)
CREATE TABLE IF NOT EXISTS user_gear (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gear_id UUID REFERENCES gear_items(id) ON DELETE SET NULL,
  gear_name TEXT NOT NULL,
  gear_type TEXT NOT NULL CHECK (gear_type IN ('guitar', 'effect', 'amp', 'cabinet', 'microphone', 'modeler')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, gear_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gear_user ON user_gear(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Updated-at trigger for profiles
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gear ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Saved recipes: private to owner
CREATE POLICY "Users can view own saved recipes" ON saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved recipes" ON saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved recipes" ON saved_recipes FOR DELETE USING (auth.uid() = user_id);

-- User gear: private to owner
CREATE POLICY "Users can view own gear" ON user_gear FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gear" ON user_gear FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gear" ON user_gear FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gear" ON user_gear FOR DELETE USING (auth.uid() = user_id);
