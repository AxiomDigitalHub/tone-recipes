-- =============================================================================
-- 014: Recipe download tracking
-- Tracks PDF and preset downloads per user/email for freemium gating.
-- Free tier: 10 preset downloads. Premium: unlimited.
-- PDF downloads via email gate for non-authenticated users.
-- =============================================================================

CREATE TABLE IF NOT EXISTS recipe_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  recipe_slug TEXT NOT NULL,
  download_type TEXT NOT NULL CHECK (download_type IN ('pdf', 'preset')),
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for counting downloads efficiently
CREATE INDEX idx_recipe_downloads_user ON recipe_downloads(user_id);
CREATE INDEX idx_recipe_downloads_email ON recipe_downloads(email);
CREATE INDEX idx_recipe_downloads_slug ON recipe_downloads(recipe_slug);

-- RLS policies
ALTER TABLE recipe_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for anonymous email-gated PDF downloads)
CREATE POLICY "recipe_downloads_insert" ON recipe_downloads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Users can read their own downloads (for counter)
CREATE POLICY "recipe_downloads_read_own" ON recipe_downloads
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all
CREATE POLICY "recipe_downloads_admin_read" ON recipe_downloads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
