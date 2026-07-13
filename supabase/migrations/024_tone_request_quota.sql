-- Migration 024: Tone request quota + sign-in gate
--
-- The request queue becomes a membership feature (docs: request-a-tone
-- pipeline). Three changes:
--   1. Submissions now require a signed-in user who owns the row
--      (anonymous email-only requests are retired).
--   2. A per-role monthly quota is enforced at the DB level by trigger,
--      so a signed-in user scripting direct Supabase inserts can't
--      bypass the /api/tone-requests route. Limits here MUST stay in
--      sync with TONE_REQUEST_LIMITS in src/lib/permissions.ts.
--   3. notifications.type gains 'request_completed' so fulfillment can
--      ping the requester via the existing NotificationBell.

-- ============================================================================
-- 1. RLS: INSERT requires auth + ownership
-- ============================================================================

DROP POLICY IF EXISTS "tone_requests_insert_all" ON tone_requests;

CREATE POLICY "tone_requests_insert_own"
  ON tone_requests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND requested_by = auth.uid());

-- ============================================================================
-- 2. Quota trigger (per calendar month, UTC — same window as downloads)
-- ============================================================================

-- Index for the per-user current-month count (also serves "Your Tones").
CREATE INDEX IF NOT EXISTS idx_tone_requests_user_month
  ON tone_requests (requested_by, created_at DESC);

CREATE OR REPLACE FUNCTION enforce_tone_request_quota()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  monthly_limit INTEGER;
  used INTEGER;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = NEW.requested_by;

  -- Keep in sync with TONE_REQUEST_LIMITS in src/lib/permissions.ts.
  monthly_limit := CASE COALESCE(user_role, 'free')
    WHEN 'free' THEN 2
    WHEN 'pass' THEN 10
    WHEN 'pro' THEN 20
    WHEN 'admin' THEN NULL       -- unlimited
    WHEN 'super_admin' THEN NULL -- unlimited
    ELSE 10                      -- legacy premium/creator: pass-equivalent
  END;

  IF monthly_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO used
    FROM tone_requests
    WHERE requested_by = NEW.requested_by
      AND created_at >= date_trunc('month', now() AT TIME ZONE 'utc');

    IF used >= monthly_limit THEN
      RAISE EXCEPTION 'tone_request_quota_exceeded'
        USING HINT = 'Monthly tone request limit reached for this plan.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_tone_request_quota ON tone_requests;
CREATE TRIGGER trg_tone_request_quota
  BEFORE INSERT ON tone_requests
  FOR EACH ROW
  EXECUTE FUNCTION enforce_tone_request_quota();

-- ============================================================================
-- 3. notifications.type: allow 'request_completed'
-- ============================================================================

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'comment_reply', 'recipe_approved', 'recipe_rejected', 'new_follower',
    'forum_reply', 'recipe_comment', 'rating', 'request_completed'
  ));

-- notifications had NO insert policy (default deny) — createNotification()
-- has been a silent no-op from the browser since migration 006. Moderators
-- can now notify any user (fulfillment pings from the moderation queue).
CREATE POLICY "notifications_insert_moderator" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );
