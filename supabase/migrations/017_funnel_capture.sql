-- Funnel capture: server-side event log + set-pack interest list.
-- Adds two tables consumed by the conversion-funnel work that started
-- 2026-05-10 (see docs/NEXT_SESSION_PLAN.md).

-- ============================================================================
-- events: server-side companion to client-side gtag/Vercel events
-- ============================================================================
-- Used when the event must be recorded reliably (e.g. Stripe webhook for
-- checkout_complete, where we can't trust the user reaching a redirect URL).
-- Keep this minimal — high-volume telemetry should still go through GA4.

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  params JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_name_created_idx
  ON events (name, created_at DESC);
CREATE INDEX IF NOT EXISTS events_user_idx
  ON events (user_id) WHERE user_id IS NOT NULL;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Only the service role writes/reads events. No public access.
CREATE POLICY "Service role manages events" ON events
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- set_pack_interest: email capture for unreleased Set Packs
-- ============================================================================
-- Replaces the plaintext "Notify me when available" on /set-packs.
-- Aggregates per pack so we know which to ship next.

CREATE TABLE IF NOT EXISTS set_pack_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  pack_slug TEXT NOT NULL,
  source TEXT DEFAULT 'set_packs_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email, pack_slug)
);

CREATE INDEX IF NOT EXISTS set_pack_interest_pack_idx
  ON set_pack_interest (pack_slug, created_at DESC);

ALTER TABLE set_pack_interest ENABLE ROW LEVEL SECURITY;

-- Anyone can register interest (public form), no auth required.
CREATE POLICY "Anyone can register set pack interest" ON set_pack_interest
  FOR INSERT WITH CHECK (true);

-- Only service role reads — interest list is not public.
CREATE POLICY "Service role reads set pack interest" ON set_pack_interest
  FOR SELECT USING (auth.role() = 'service_role');
