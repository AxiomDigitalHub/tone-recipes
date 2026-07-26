-- Migration 026: lock privileged columns (2026-07-25 security pass)
--
-- Three holes, one theme: table-level grants were wider than the RLS
-- policies implied, and Postgres column-level REVOKE cannot narrow a
-- table-level GRANT — you must revoke the table grant and re-grant the
-- allowed columns. Service role is unaffected throughout (webhook,
-- checkout, cron, and admin routes keep working unchanged).

-- ---------------------------------------------------------------------------
-- 1) profiles: "update own profile" RLS (003) had no column guard, so any
--    signed-in user could PATCH their own row with {"role":"pro"} (or
--    'admin') using the public anon key — free Set Packs, Sonnet tier,
--    admin dashboards. Only truly user-editable columns stay writable.
-- ---------------------------------------------------------------------------
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (username, display_name, avatar_url, bio, primary_platform, owned_gear)
  ON public.profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- 2) tone_requests: SELECT was world-open (008) including
--    requested_by_email — every requester's email dumpable via the anon
--    key. Re-grant everything except the email and admin_notes.
--    requested_by stays readable: the "Your Tones" dashboard filters on
--    it. Client code now selects explicit columns (select("*") would get
--    "permission denied for column") — see src/lib/db/tone-requests.ts.
-- ---------------------------------------------------------------------------
REVOKE SELECT ON public.tone_requests FROM anon, authenticated;
GRANT SELECT (id, song_name, artist_name, part, description, reference_url,
  requested_by, status, completed_recipe_slug, upvotes, created_at, updated_at)
  ON public.tone_requests TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3) recipe_downloads: INSERT was open to anon/authenticated with any
--    user_id (016), letting a stranger post 5 rows against a victim's
--    UUID and burn their monthly quota (402 for the rest of the month).
--    Every legitimate writer is a server route; the one that used the
--    anon key now uses the service role (recipes/[slug]/download). Client
--    roles lose INSERT entirely.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "recipe_downloads_insert_public" ON public.recipe_downloads;
REVOKE INSERT ON public.recipe_downloads FROM anon, authenticated;
