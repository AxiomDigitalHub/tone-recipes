-- Migration 028: Remove the one seeded community account 023 missed
--
-- WHY: 007_seed_community.sql created 30 fake accounts; 023's removal list
-- has 29. 'humbuckerHank@gmail.com' was left out, so as of 2026-10-25 it
-- still owned every community row in production: 21 recipe_ratings, 5
-- comments and 1 forum thread. 18 of those ratings sit on live recipe
-- pages, which show "5.0 (1 rating)" and emit an AggregateRating in the
-- page's JSON-LD — the fabricated-review problem 023 exists to remove.
--
-- HOW: same pattern as 023 (explicit dependent deletes, then the account).
-- Email match is case-insensitive in case auth normalized it. Forum rows
-- are deleted explicitly too: 023 didn't need to, but this account has one.
-- Idempotent and safe to re-run. Rows from real users are untouched.

DO $$
DECLARE
  victim uuid[];
BEGIN
  SELECT array_agg(id) INTO victim
  FROM auth.users
  WHERE lower(email) = lower('humbuckerHank@gmail.com');

  IF victim IS NULL THEN
    RAISE NOTICE 'humbuckerHank seed account not found; nothing to remove.';
    RETURN;
  END IF;

  DELETE FROM comment_votes  WHERE user_id = ANY(victim);
  DELETE FROM comments       WHERE user_id = ANY(victim);
  DELETE FROM recipe_ratings WHERE user_id = ANY(victim);
  DELETE FROM forum_replies  WHERE user_id = ANY(victim);
  DELETE FROM forum_replies  WHERE thread_id IN (SELECT id FROM forum_threads WHERE user_id = ANY(victim));
  DELETE FROM forum_threads  WHERE user_id = ANY(victim);
  DELETE FROM profiles       WHERE id      = ANY(victim);
  DELETE FROM auth.identities WHERE user_id = ANY(victim);
  DELETE FROM auth.users      WHERE id      = ANY(victim);

  RAISE NOTICE 'Removed seeded account humbuckerHank and its ratings, comments and forum posts.';
END $$;
