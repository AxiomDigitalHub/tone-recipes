-- Set Pack one-time purchases. Pivot from the retired subscription tier
-- model (2026-05-10) to one-time Stripe Checkout sessions per pack.
--
-- Each row records a single purchase by a single user. Ownership is
-- checked at download time via `select 1 from set_pack_purchases
-- where user_id = $1 and pack_slug = $2`.

CREATE TABLE IF NOT EXISTS set_pack_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_slug TEXT NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_paid_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pack_slug)
);

CREATE INDEX IF NOT EXISTS set_pack_purchases_user_idx
  ON set_pack_purchases (user_id);
CREATE INDEX IF NOT EXISTS set_pack_purchases_pack_idx
  ON set_pack_purchases (pack_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS set_pack_purchases_session_idx
  ON set_pack_purchases (stripe_session_id) WHERE stripe_session_id IS NOT NULL;

ALTER TABLE set_pack_purchases ENABLE ROW LEVEL SECURITY;

-- A user can read their own purchases (for the "you own this" check).
CREATE POLICY "Users read their own purchases" ON set_pack_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role writes (webhook handler).
CREATE POLICY "Service role writes purchases" ON set_pack_purchases
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role updates purchases" ON set_pack_purchases
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role reads all purchases" ON set_pack_purchases
  FOR SELECT USING (auth.role() = 'service_role');
