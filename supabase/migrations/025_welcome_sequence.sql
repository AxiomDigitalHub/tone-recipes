-- Migration 025: Welcome email sequence queue
--
-- Implements docs/WELCOME_SEQUENCE.md. Two sequences:
--   'account'    — A1 (instant-ish), A2 (+3d), A3 (+7d), enqueued when an
--                  auth user is created.
--   'newsletter' — B2 (+5d) only; B1 (the instant welcome) already sends
--                  from /api/newsletter via sendNewsletterWelcome(), so it
--                  is NOT queued here.
--
-- Rows are drained by GET /api/cron/email-sequence (hourly GitHub Actions
-- cron), which applies suppression at SEND time, not enqueue time:
--   - account step 3 is skipped if profiles.role != 'free' (already paid)
--   - newsletter step 2 is skipped if the email now has an account
--   - everything is skipped if the email has unsubscribed
--
-- Keep the step timings in sync with docs/WELCOME_SEQUENCE.md.

-- ============================================================================
-- 1. Queue table
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_sequence_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence TEXT NOT NULL CHECK (sequence IN ('account', 'newsletter')),
  step INTEGER NOT NULL CHECK (step BETWEEN 1 AND 5),
  due_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One shot per address per step, ever. Re-signups don't re-enqueue.
  UNIQUE (email, sequence, step)
);

CREATE INDEX IF NOT EXISTS idx_email_sequence_due
  ON email_sequence_queue (due_at)
  WHERE sent_at IS NULL AND cancelled_at IS NULL;

ALTER TABLE email_sequence_queue ENABLE ROW LEVEL SECURITY;

-- Service role only. No public policies: the queue is written by
-- SECURITY DEFINER triggers and read/updated by the cron drain using the
-- service role key, which bypasses RLS.

-- ============================================================================
-- 2. Enqueue on account creation (auth.users insert)
-- ============================================================================

CREATE OR REPLACE FUNCTION enqueue_account_welcome_sequence()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;
  INSERT INTO email_sequence_queue (email, user_id, sequence, step, due_at)
  VALUES
    (lower(NEW.email), NEW.id, 'account', 1, now()),
    (lower(NEW.email), NEW.id, 'account', 2, now() + interval '3 days'),
    (lower(NEW.email), NEW.id, 'account', 3, now() + interval '7 days')
  ON CONFLICT (email, sequence, step) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_enqueue_welcome ON auth.users;
CREATE TRIGGER on_auth_user_created_enqueue_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION enqueue_account_welcome_sequence();

-- ============================================================================
-- 3. Enqueue on newsletter signup (B2 nudge only; B1 sends from the route)
-- ============================================================================

CREATE OR REPLACE FUNCTION enqueue_newsletter_sequence()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_sequence_queue (email, sequence, step, due_at)
  VALUES (lower(NEW.email), 'newsletter', 2, now() + interval '5 days')
  ON CONFLICT (email, sequence, step) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_newsletter_subscribe_enqueue ON newsletter_subscribers;
CREATE TRIGGER on_newsletter_subscribe_enqueue
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION enqueue_newsletter_sequence();

-- ============================================================================
-- 4. Send-time context helper (called by the drain via RPC)
-- ============================================================================
-- One round trip per queued row: does this email have an account, what is
-- its role, and has it unsubscribed from the newsletter?

CREATE OR REPLACE FUNCTION sequence_email_context(p_email TEXT)
RETURNS TABLE (has_profile BOOLEAN, user_role TEXT, unsubscribed BOOLEAN) AS $$
  SELECT
    (u.id IS NOT NULL) AS has_profile,
    p.role AS user_role,
    (ns.unsubscribed_at IS NOT NULL) AS unsubscribed
  FROM (SELECT lower(p_email) AS e) q
  LEFT JOIN auth.users u ON lower(u.email) = q.e
  LEFT JOIN profiles p ON p.id = u.id
  LEFT JOIN newsletter_subscribers ns ON lower(ns.email) = q.e;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Lock it down: only service role should call this.
REVOKE EXECUTE ON FUNCTION sequence_email_context(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION sequence_email_context(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION sequence_email_context(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION sequence_email_context(TEXT) TO service_role;
