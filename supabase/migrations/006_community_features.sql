-- Migration 006: Community Features (Phase 3)
-- Adds comments, ratings, follows, user recipes, forum, notifications, and reports

-- ============================================================================
-- 1. ALTER profiles table with new columns
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recipe_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_moderator boolean DEFAULT false;

-- ============================================================================
-- 2. comments - threaded comments on recipes
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  body text NOT NULL CHECK(length(body) > 0 AND length(body) <= 2000),
  upvotes int DEFAULT 0,
  downvotes int DEFAULT 0,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_recipe_slug ON comments(recipe_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- ============================================================================
-- 3. comment_votes - one vote per user per comment
-- ============================================================================

CREATE TABLE IF NOT EXISTS comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  vote_type text NOT NULL CHECK(vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- ============================================================================
-- 4. recipe_ratings - 1-5 star ratings on recipes
-- ============================================================================

CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  rating smallint NOT NULL CHECK(rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_slug, user_id)
);

-- ============================================================================
-- 5. follows - user follows another user
-- ============================================================================

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- ============================================================================
-- 6. user_recipes - user-submitted tone recipes (pending approval)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  guitar_specs jsonb,
  signal_chain jsonb NOT NULL,
  platform_translations jsonb,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderator_notes text,
  reviewed_by uuid REFERENCES auth.users,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. forum_categories - forum section categories
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order int DEFAULT 0,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 8. forum_threads - forum discussion threads
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES forum_categories ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL CHECK(length(title) >= 3 AND length(title) <= 200),
  slug text NOT NULL UNIQUE,
  body text NOT NULL CHECK(length(body) > 0),
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count int DEFAULT 0,
  reply_count int DEFAULT 0,
  last_reply_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 9. forum_replies - replies to forum threads
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES forum_threads ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  body text NOT NULL CHECK(length(body) > 0 AND length(body) <= 5000),
  is_accepted boolean DEFAULT false,
  upvotes int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 10. notifications - user notifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL CHECK(type IN ('comment_reply', 'recipe_approved', 'recipe_rejected', 'new_follower', 'forum_reply', 'recipe_comment', 'rating')),
  title text NOT NULL,
  body text,
  link text,
  is_read boolean DEFAULT false,
  actor_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- 11. reports - content moderation reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content_type text NOT NULL CHECK(content_type IN ('comment', 'forum_thread', 'forum_reply', 'user_recipe', 'user')),
  content_id uuid NOT NULL,
  reason text NOT NULL CHECK(reason IN ('spam', 'harassment', 'inappropriate', 'misinformation', 'other')),
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES auth.users,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 12. Triggers for updated_at
-- ============================================================================

CREATE TRIGGER set_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_recipe_ratings_updated_at
  BEFORE UPDATE ON recipe_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_user_recipes_updated_at
  BEFORE UPDATE ON user_recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_forum_threads_updated_at
  BEFORE UPDATE ON forum_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 13. Row Level Security
-- ============================================================================

-- comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_public_read" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_auth_insert" ON comments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_owner_update" ON comments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_owner_delete" ON comments
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- comment_votes
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comment_votes_auth_insert" ON comment_votes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comment_votes_auth_update" ON comment_votes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comment_votes_auth_delete" ON comment_votes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- recipe_ratings
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipe_ratings_public_read" ON recipe_ratings
  FOR SELECT USING (true);

CREATE POLICY "recipe_ratings_auth_insert" ON recipe_ratings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "recipe_ratings_auth_update" ON recipe_ratings
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_public_read" ON follows
  FOR SELECT USING (true);

CREATE POLICY "follows_auth_insert" ON follows
  FOR INSERT TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "follows_auth_delete" ON follows
  FOR DELETE TO authenticated
  USING (follower_id = auth.uid());

-- user_recipes
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_recipes_public_read_approved" ON user_recipes
  FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "user_recipes_auth_insert" ON user_recipes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_recipes_owner_update" ON user_recipes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid());

-- forum_categories
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_categories_public_read" ON forum_categories
  FOR SELECT USING (true);

-- forum_threads
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_threads_public_read" ON forum_threads
  FOR SELECT USING (true);

CREATE POLICY "forum_threads_auth_insert" ON forum_threads
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "forum_threads_owner_update" ON forum_threads
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- forum_replies
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_replies_public_read" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "forum_replies_auth_insert" ON forum_replies
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "forum_replies_owner_update" ON forum_replies
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_owner_read" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_owner_update" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_auth_insert" ON reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- ============================================================================
-- 14. Helper functions
-- ============================================================================

-- Function to increment/decrement follower counts
CREATE OR REPLACE FUNCTION handle_follow_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION handle_follow_counts();

-- Function to increment/decrement recipe counts
CREATE OR REPLACE FUNCTION handle_user_recipe_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE profiles SET recipe_count = recipe_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
      UPDATE profiles SET recipe_count = recipe_count + 1 WHERE id = NEW.user_id;
    ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
      UPDATE profiles SET recipe_count = GREATEST(recipe_count - 1, 0) WHERE id = NEW.user_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE profiles SET recipe_count = GREATEST(recipe_count - 1, 0) WHERE id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_user_recipe_change
  AFTER INSERT OR UPDATE OF status OR DELETE ON user_recipes
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_recipe_count();

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION handle_comment_vote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE comments SET upvotes = GREATEST(upvotes - 1, 0), downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE comments SET downvotes = GREATEST(downvotes - 1, 0), upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE comments SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET downvotes = GREATEST(downvotes - 1, 0) WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_comment_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON comment_votes
  FOR EACH ROW
  EXECUTE FUNCTION handle_comment_vote();

-- Function to update forum thread reply count and last_reply_at
CREATE OR REPLACE FUNCTION handle_forum_reply_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_threads
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_threads
    SET reply_count = GREATEST(reply_count - 1, 0),
        last_reply_at = (
          SELECT MAX(created_at) FROM forum_replies WHERE thread_id = OLD.thread_id
        )
    WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_forum_reply_change
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION handle_forum_reply_count();

-- ============================================================================
-- 15. Seed default forum categories
-- ============================================================================

INSERT INTO forum_categories (name, slug, description, sort_order, icon) VALUES
  ('General Discussion', 'general', 'Talk about anything music and tone related', 1, 'message-circle'),
  ('Gear Talk', 'gear', 'Discuss pedals, amps, guitars, and other gear', 2, 'settings'),
  ('Tone Help', 'tone-help', 'Get help dialing in a specific tone', 3, 'help-circle'),
  ('Tips & Tricks', 'tips-tricks', 'Share your tone tips and techniques', 4, 'lightbulb'),
  ('Show & Tell', 'show-tell', 'Share your pedalboard, rig, or tone recipes', 5, 'camera'),
  ('Platform-Specific', 'platform-specific', 'Discussions for specific platforms like HX Stomp, Quad Cortex, etc.', 6, 'cpu')
ON CONFLICT (slug) DO NOTHING;
