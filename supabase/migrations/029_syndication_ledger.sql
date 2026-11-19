-- Migration 029: content syndication ledger
--
-- One row per (platform, post) the syndication cron has published or tried
-- to publish. Spec: docs/SYNDICATION.md. Contract with
-- src/app/api/cron/syndicate/route.ts:
--   - the cron INSERTs a 'pending' row BEFORE calling the platform API
--     ("claims" the slot). The unique (platform, slug) key means two
--     overlapping runs can never both publish the same post.
--   - success -> status 'published' with remote_id / remote_url.
--   - failure -> status 'failed', attempts incremented, error kept. Failed
--     rows are retried on later runs until attempts reaches the cap set in
--     the route; after that they stay put for a human to look at.
--   - a 'pending' row older than an hour is a run that died mid-publish.
--     The route never auto-retries those (the remote post may exist), it
--     reports them so a human can check the platform and fix the row.
--
-- Service role only (the cron runs privileged). RLS on with no policies =
-- deny-all for anon/authenticated.

CREATE TABLE IF NOT EXISTS syndication_ledger (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  slug TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('full', 'excerpt')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'failed')),
  attempts INT NOT NULL DEFAULT 1,
  remote_id TEXT,
  remote_url TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, slug)
);

CREATE INDEX IF NOT EXISTS syndication_ledger_status_idx
  ON syndication_ledger (platform, status);

ALTER TABLE syndication_ledger ENABLE ROW LEVEL SECURITY;
