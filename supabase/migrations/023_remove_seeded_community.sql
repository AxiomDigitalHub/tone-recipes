-- Migration 023: Remove seeded (fabricated) community data
--
-- WHY: Migrations 007_seed_community.sql and 011_seed_more_ratings.sql
-- inserted fake user accounts, star ratings, and written reviews/comments.
-- Fabricated consumer reviews violate the FTC's 2024 rule on fake reviews
-- and Google's review-spam policy, and they directly contradict the brand's
-- core promise ("when we don't know, we say so"). They are removed here.
--
-- HOW: every fake account was created in 007 with a recognizable @gmail.com
-- handle (011 reused the same accounts, adding no new ones). recipe_ratings,
-- comments, and comment_votes all declare `user_id ... ON DELETE CASCADE`
-- (see 006_community_features.sql), so deleting the auth.users rows removes
-- every dependent rating/comment/vote/profile/identity automatically.
--
-- This migration is idempotent and safe to re-run. It also runs *after*
-- 007/011 on a fresh `supabase db reset`, so fresh environments end up clean
-- too (seed-then-remove) without having to rewrite already-applied history.
-- Genuine ratings/comments from real signed-in users are untouched.

DO $$
DECLARE
  fake_emails text[] := ARRAY[
    'strat_dad_42@gmail.com',
    'fuzz_lord@gmail.com',
    'blues_lawyer_69@gmail.com',
    'tele_is_life@gmail.com',
    'djent_machine@gmail.com',
    'pedalboard_addict@gmail.com',
    'tube_screamer_stan@gmail.com',
    'kemper_convert@gmail.com',
    'analog_or_die@gmail.com',
    'tonewood_believer@gmail.com',
    'bedroom_shredder@gmail.com',
    'dad_rock_dave@gmail.com',
    'jazz_hands_jenny@gmail.com',
    'doom_n_gloom@gmail.com',
    'pick_scraper@gmail.com',
    'string_bender_bob@gmail.com',
    'reverb_junkie@gmail.com',
    'gain_staging_guru@gmail.com',
    'clean_tone_carl@gmail.com',
    'feedback_fred@gmail.com',
    'cab_sim_skeptic@gmail.com',
    'chorus_pedal_chad@gmail.com',
    'drop_d_dan@gmail.com',
    'looper_lucy@gmail.com',
    'noise_gate_nancy@gmail.com',
    'slide_guitar_sam@gmail.com',
    'trem_picker_tim@gmail.com',
    'vinyl_vince@gmail.com',
    'wah_wah_wanda@gmail.com'
  ];
  victim uuid[];
BEGIN
  SELECT array_agg(id) INTO victim
  FROM auth.users
  WHERE email = ANY(fake_emails);

  IF victim IS NULL THEN
    RAISE NOTICE 'No seeded community accounts found; nothing to remove.';
    RETURN;
  END IF;

  -- Explicit dependent deletes first (belt-and-suspenders; CASCADE would
  -- also handle these, but being explicit keeps intent obvious and survives
  -- any future change to the FK actions).
  DELETE FROM comment_votes  WHERE user_id = ANY(victim);
  DELETE FROM comments       WHERE user_id = ANY(victim);
  DELETE FROM recipe_ratings WHERE user_id = ANY(victim);
  DELETE FROM profiles       WHERE id      = ANY(victim);
  DELETE FROM auth.identities WHERE user_id = ANY(victim);
  DELETE FROM auth.users      WHERE id      = ANY(victim);

  RAISE NOTICE 'Removed % seeded community account(s) and their ratings/comments.', array_length(victim, 1);
END $$;
