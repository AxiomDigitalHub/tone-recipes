-- Migration 027: Stripe webhook idempotency ledger
--
-- Stripe retries deliveries on any non-2xx AND on timeout, and the handler
-- had no event.id dedupe — so a retry re-sent the customer welcome email,
-- re-sent the owner alert, and inserted a second `events` row (inflating
-- the checkout_complete count on the admin growth dashboard). Entitlement
-- writes were already idempotent (profiles update / set_pack upsert), so
-- this closes the notification + metrics half.
--
-- Contract with src/app/api/webhooks/stripe/route.ts:
--   - the handler INSERTs event.id at the top ("claims" the event);
--     a unique violation means a duplicate delivery -> 200 immediately.
--   - failure paths that WANT a Stripe retry delete their claim before
--     returning 500, so the retry is processed rather than skipped.
--   - if this table doesn't exist yet (migration not applied), the insert
--     errors non-fatally and the handler proceeds without dedupe — same
--     behavior as before this migration.
--
-- Service role only (the webhook runs privileged). RLS on with no
-- policies = deny-all for anon/authenticated.

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Housekeeping: rows are tiny and low-volume (one per Stripe event), but
-- nothing needs them after Stripe's retry window (~3 days). Safe to prune
-- anything older than 30 days from a maintenance script if it ever matters.
