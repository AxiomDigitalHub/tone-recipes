-- Migration 008: Tone Requests
-- Allows users to request specific song tones they want recreated.
-- Requests go into a public queue that admins review and fulfill.

-- ============================================================================
-- 1. tone_requests - the main request queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS tone_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  part TEXT NOT NULL DEFAULT 'lead guitar',
  description TEXT,
  reference_url TEXT,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requested_by_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'declined')),
  completed_recipe_slug TEXT,
  upvotes INTEGER NOT NULL DEFAULT 1,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tone_requests_status ON tone_requests(status);
CREATE INDEX IF NOT EXISTS idx_tone_requests_upvotes ON tone_requests(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_tone_requests_created_at ON tone_requests(created_at DESC);

-- ============================================================================
-- 2. tone_request_votes - junction table for upvotes
-- ============================================================================

CREATE TABLE IF NOT EXISTS tone_request_votes (
  request_id UUID REFERENCES tone_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (request_id, user_id)
);

-- ============================================================================
-- 3. RLS policies
-- ============================================================================

ALTER TABLE tone_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tone_request_votes ENABLE ROW LEVEL SECURITY;

-- SELECT: open to everyone (public queue)
CREATE POLICY "tone_requests_select_all"
  ON tone_requests FOR SELECT
  USING (true);

-- INSERT: anyone (auth or anon with email)
CREATE POLICY "tone_requests_insert_all"
  ON tone_requests FOR INSERT
  WITH CHECK (true);

-- UPDATE: only moderators
CREATE POLICY "tone_requests_update_moderator"
  ON tone_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

-- DELETE: only moderators
CREATE POLICY "tone_requests_delete_moderator"
  ON tone_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

-- Votes: SELECT open to all
CREATE POLICY "tone_request_votes_select_all"
  ON tone_request_votes FOR SELECT
  USING (true);

-- Votes: INSERT for authenticated users only
CREATE POLICY "tone_request_votes_insert_auth"
  ON tone_request_votes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Votes: DELETE for own votes (to allow un-voting)
CREATE POLICY "tone_request_votes_delete_own"
  ON tone_request_votes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- 4. Trigger: update upvotes count when votes change
-- ============================================================================

CREATE OR REPLACE FUNCTION update_tone_request_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tone_requests
    SET upvotes = (
      SELECT COUNT(*) FROM tone_request_votes WHERE request_id = NEW.request_id
    )
    WHERE id = NEW.request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tone_requests
    SET upvotes = (
      SELECT COUNT(*) FROM tone_request_votes WHERE request_id = OLD.request_id
    )
    WHERE id = OLD.request_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tone_request_votes_count
  AFTER INSERT OR DELETE ON tone_request_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_tone_request_upvotes();

-- ============================================================================
-- 5. Trigger: set updated_at on update
-- ============================================================================

CREATE OR REPLACE FUNCTION set_tone_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tone_request_updated_at
  BEFORE UPDATE ON tone_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_tone_request_updated_at();
