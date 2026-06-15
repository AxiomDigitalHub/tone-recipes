-- 020_tone_chat_usage.sql
-- Daily per-user message counter for the Tone Chat AI assistant.
--
-- Gating model (enforced in /api/tone-chat):
--   free accounts:  TONE_CHAT_FREE_DAILY  messages/day
--   pass+ accounts: TONE_CHAT_PASS_DAILY  messages/day (generous abuse ceiling)
--
-- The counter is incremented atomically via increment_tone_chat_usage()
-- using the service-role client. Rows are one per user per UTC day.

CREATE TABLE IF NOT EXISTS tone_chat_usage (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  messages integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);

ALTER TABLE tone_chat_usage ENABLE ROW LEVEL SECURITY;

-- Users may see their own usage (for a "7 of 10 messages left" meter).
-- All writes go through the service role, which bypasses RLS.
DROP POLICY IF EXISTS "Users can read own tone chat usage" ON tone_chat_usage;
CREATE POLICY "Users can read own tone chat usage"
  ON tone_chat_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Atomic increment-and-return. Returns the post-increment count for
-- today so the API route can compare against the caller's daily cap.
CREATE OR REPLACE FUNCTION increment_tone_chat_usage(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO tone_chat_usage (user_id, day, messages, updated_at)
  VALUES (p_user_id, (now() AT TIME ZONE 'utc')::date, 1, now())
  ON CONFLICT (user_id, day)
  DO UPDATE SET messages = tone_chat_usage.messages + 1, updated_at = now()
  RETURNING messages;
$$;

-- Only the service role may increment.
REVOKE ALL ON FUNCTION increment_tone_chat_usage(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_tone_chat_usage(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_tone_chat_usage(uuid) TO service_role;
