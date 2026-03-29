-- Migration 007: Seed Community Data
-- Realistic guitar forum seed data with authentic human voice

DO $$
DECLARE
  -- User IDs
  u_strat_dad uuid := gen_random_uuid();
  u_fuzz_lord uuid := gen_random_uuid();
  u_blues_lawyer uuid := gen_random_uuid();
  u_tele_life uuid := gen_random_uuid();
  u_djent uuid := gen_random_uuid();
  u_pedalboard uuid := gen_random_uuid();
  u_tube_stan uuid := gen_random_uuid();
  u_kemper uuid := gen_random_uuid();
  u_analog uuid := gen_random_uuid();
  u_tonewood uuid := gen_random_uuid();
  u_bedroom uuid := gen_random_uuid();
  u_dad_rock uuid := gen_random_uuid();
  u_jazz_jenny uuid := gen_random_uuid();
  u_doom uuid := gen_random_uuid();
  u_pick_scraper uuid := gen_random_uuid();
  u_string_bob uuid := gen_random_uuid();
  u_reverb_jnk uuid := gen_random_uuid();
  u_gain_guru uuid := gen_random_uuid();
  u_clean_carl uuid := gen_random_uuid();
  u_feedback uuid := gen_random_uuid();
  u_drop_d uuid := gen_random_uuid();
  u_chorus_chad uuid := gen_random_uuid();
  u_wah_wanda uuid := gen_random_uuid();
  u_cab_skeptic uuid := gen_random_uuid();
  u_humbucker uuid := gen_random_uuid();
  u_trem_tim uuid := gen_random_uuid();
  u_looper uuid := gen_random_uuid();
  u_slide_sam uuid := gen_random_uuid();
  u_noise_nancy uuid := gen_random_uuid();
  u_vinyl_vince uuid := gen_random_uuid();

  -- Forum category IDs
  cat_general uuid;
  cat_gear uuid;
  cat_tone uuid;
  cat_tips uuid;
  cat_show uuid;
  cat_platform uuid;

  -- Thread IDs (reusable for replies)
  t1 uuid := gen_random_uuid();
  t2 uuid := gen_random_uuid();
  t3 uuid := gen_random_uuid();
  t4 uuid := gen_random_uuid();
  t5 uuid := gen_random_uuid();
  t6 uuid := gen_random_uuid();
  t7 uuid := gen_random_uuid();
  t8 uuid := gen_random_uuid();
  t9 uuid := gen_random_uuid();
  t10 uuid := gen_random_uuid();
  t11 uuid := gen_random_uuid();
  t12 uuid := gen_random_uuid();
  t13 uuid := gen_random_uuid();
  t14 uuid := gen_random_uuid();
  t15 uuid := gen_random_uuid();
  t16 uuid := gen_random_uuid();
  t17 uuid := gen_random_uuid();
  t18 uuid := gen_random_uuid();
  t19 uuid := gen_random_uuid();
  t20 uuid := gen_random_uuid();
  t21 uuid := gen_random_uuid();
  t22 uuid := gen_random_uuid();
  t23 uuid := gen_random_uuid();
  t24 uuid := gen_random_uuid();
  t25 uuid := gen_random_uuid();

  -- Comment IDs (for threading)
  c1 uuid := gen_random_uuid();
  c2 uuid := gen_random_uuid();
  c3 uuid := gen_random_uuid();
  c4 uuid := gen_random_uuid();
  c5 uuid := gen_random_uuid();
  c6 uuid := gen_random_uuid();
  c7 uuid := gen_random_uuid();
  c8 uuid := gen_random_uuid();
  c9 uuid := gen_random_uuid();
  c10 uuid := gen_random_uuid();

BEGIN

  -- ==========================================================================
  -- USERS (30 profiles via auth.users + profiles)
  -- ==========================================================================

  INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_token, recovery_token)
  VALUES
    (u_strat_dad, 'strat_dad_42@gmail.com', '{"display_name":"strat_dad_42"}', now() - interval '89 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '89 days', '', ''),
    (u_fuzz_lord, 'fuzz_lord@gmail.com', '{"display_name":"fuzz_lord"}', now() - interval '76 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '76 days', '', ''),
    (u_blues_lawyer, 'blues_lawyer_69@gmail.com', '{"display_name":"blues_lawyer_69"}', now() - interval '102 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '102 days', '', ''),
    (u_tele_life, 'tele_is_life@gmail.com', '{"display_name":"tele_is_life"}', now() - interval '65 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '65 days', '', ''),
    (u_djent, 'djent_machine@gmail.com', '{"display_name":"djent_machine"}', now() - interval '45 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '45 days', '', ''),
    (u_pedalboard, 'pedalboard_addict@gmail.com', '{"display_name":"pedalboard_addict"}', now() - interval '120 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '120 days', '', ''),
    (u_tube_stan, 'tube_screamer_stan@gmail.com', '{"display_name":"tube_screamer_stan"}', now() - interval '88 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '88 days', '', ''),
    (u_kemper, 'kemper_convert@gmail.com', '{"display_name":"kemper_convert"}', now() - interval '55 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '55 days', '', ''),
    (u_analog, 'analog_or_die@gmail.com', '{"display_name":"analog_or_die"}', now() - interval '130 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '130 days', '', ''),
    (u_tonewood, 'tonewood_believer@gmail.com', '{"display_name":"tonewood_believer"}', now() - interval '40 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '40 days', '', ''),
    (u_bedroom, 'bedroom_shredder@gmail.com', '{"display_name":"bedroom_shredder"}', now() - interval '33 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '33 days', '', ''),
    (u_dad_rock, 'dad_rock_dave@gmail.com', '{"display_name":"dad_rock_dave"}', now() - interval '95 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '95 days', '', ''),
    (u_jazz_jenny, 'jazz_hands_jenny@gmail.com', '{"display_name":"jazz_hands_jenny"}', now() - interval '70 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '70 days', '', ''),
    (u_doom, 'doom_n_gloom@gmail.com', '{"display_name":"doom_n_gloom"}', now() - interval '60 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '60 days', '', ''),
    (u_pick_scraper, 'pick_scraper@gmail.com', '{"display_name":"pick_scraper"}', now() - interval '28 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '28 days', '', ''),
    (u_string_bob, 'string_bender_bob@gmail.com', '{"display_name":"string_bender_bob"}', now() - interval '85 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '85 days', '', ''),
    (u_reverb_jnk, 'reverb_junkie@gmail.com', '{"display_name":"reverb_junkie"}', now() - interval '50 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '50 days', '', ''),
    (u_gain_guru, 'gain_staging_guru@gmail.com', '{"display_name":"gain_staging_guru"}', now() - interval '110 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '110 days', '', ''),
    (u_clean_carl, 'clean_tone_carl@gmail.com', '{"display_name":"clean_tone_carl"}', now() - interval '72 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '72 days', '', ''),
    (u_feedback, 'feedback_fred@gmail.com', '{"display_name":"feedback_fred"}', now() - interval '38 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '38 days', '', ''),
    (u_drop_d, 'drop_d_dan@gmail.com', '{"display_name":"drop_d_dan"}', now() - interval '25 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '25 days', '', ''),
    (u_chorus_chad, 'chorus_pedal_chad@gmail.com', '{"display_name":"chorus_pedal_chad"}', now() - interval '80 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '80 days', '', ''),
    (u_wah_wanda, 'wah_wah_wanda@gmail.com', '{"display_name":"wah_wah_wanda"}', now() - interval '47 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '47 days', '', ''),
    (u_cab_skeptic, 'cab_sim_skeptic@gmail.com', '{"display_name":"cab_sim_skeptic"}', now() - interval '62 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '62 days', '', ''),
    (u_humbucker, 'humbuckerHank@gmail.com', '{"display_name":"humbuckerHank"}', now() - interval '92 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '92 days', '', ''),
    (u_trem_tim, 'trem_picker_tim@gmail.com', '{"display_name":"trem_picker_tim"}', now() - interval '35 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '35 days', '', ''),
    (u_looper, 'looper_lucy@gmail.com', '{"display_name":"looper_lucy"}', now() - interval '42 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '42 days', '', ''),
    (u_slide_sam, 'slide_guitar_sam@gmail.com', '{"display_name":"slide_guitar_sam"}', now() - interval '68 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '68 days', '', ''),
    (u_noise_nancy, 'noise_gate_nancy@gmail.com', '{"display_name":"noise_gate_nancy"}', now() - interval '53 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '53 days', '', ''),
    (u_vinyl_vince, 'vinyl_vince@gmail.com', '{"display_name":"vinyl_vince"}', now() - interval '100 days', now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234', now() - interval '100 days', '', '')
  ON CONFLICT (id) DO NOTHING;

  -- Create identities for each user (required by Supabase auth)
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  SELECT id, id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), created_at, now()
  FROM auth.users WHERE id IN (u_strat_dad, u_fuzz_lord, u_blues_lawyer, u_tele_life, u_djent, u_pedalboard, u_tube_stan, u_kemper, u_analog, u_tonewood, u_bedroom, u_dad_rock, u_jazz_jenny, u_doom, u_pick_scraper, u_string_bob, u_reverb_jnk, u_gain_guru, u_clean_carl, u_feedback, u_drop_d, u_chorus_chad, u_wah_wanda, u_cab_skeptic, u_humbucker, u_trem_tim, u_looper, u_slide_sam, u_noise_nancy, u_vinyl_vince)
  ON CONFLICT DO NOTHING;

  -- Profiles
  INSERT INTO profiles (id, username, display_name, bio, role, primary_platform) VALUES
    (u_strat_dad, 'strat_dad_42', 'strat_dad_42', 'just a dad with a strat and a dream. 90s alt rock mostly', 'free', 'katana'),
    (u_fuzz_lord, 'fuzz_lord', 'fuzz_lord', 'if it doesnt have fuzz its not worth playing. big muff 4 life', 'premium', 'physical'),
    (u_blues_lawyer, 'blues_lawyer_69', 'blues_lawyer_69', 'Corporate attorney by day, blues man by night. PRS > everything', 'premium', 'helix'),
    (u_tele_life, 'tele_is_life', 'tele_is_life', 'butterscotch tele into a princeton. thats the tweet', 'free', 'physical'),
    (u_djent, 'djent_machine', 'djent_machine', '8 string. drop F. neural dsp. fight me', 'free', 'quad_cortex'),
    (u_pedalboard, 'pedalboard_addict', 'pedalboard_addict', 'my wife says i have a problem. shes right', 'premium', 'physical'),
    (u_tube_stan, 'tube_screamer_stan', 'tube_screamer_stan', 'TS808 into a cranked marshall is all you need in life', 'free', 'physical'),
    (u_kemper, 'kemper_convert', 'kemper_convert', 'sold my amp collection and bought a kemper. no regrets', 'creator', 'kemper'),
    (u_analog, 'analog_or_die', 'analog_or_die', 'digital is soulless. i said what i said', 'free', 'physical'),
    (u_tonewood, 'tonewood_believer', 'tonewood_believer', 'swamp ash strats sound different and i will die on this hill', 'free', 'helix'),
    (u_bedroom, 'bedroom_shredder', 'bedroom_shredder', '16yo learning guitar. this site is sick btw', 'free', 'katana'),
    (u_dad_rock, 'dad_rock_dave', 'dad_rock_dave', 'classic rock is the only real music. eagles > everything', 'free', 'helix'),
    (u_jazz_jenny, 'jazz_hands_jenny', 'jazz_hands_jenny', 'jazz guitar nerd. es-335 through a JC-120. no pedals needed', 'free', 'physical'),
    (u_doom, 'doom_n_gloom', 'doom_n_gloom', 'tuned to B standard. 3 fuzz pedals. slow riffs only', 'free', 'physical'),
    (u_pick_scraper, 'pick_scraper', 'pick_scraper', 'pantera ruined me for all other music', 'free', 'quad_cortex'),
    (u_string_bob, 'string_bender_bob', 'string_bender_bob', 'country picker. b-bender tele. pedal steel wannabe', 'free', 'kemper'),
    (u_reverb_jnk, 'reverb_junkie', 'reverb_junkie', 'ambient guitar / shoegaze. the wetter the better', 'premium', 'helix'),
    (u_gain_guru, 'gain_staging_guru', 'gain_staging_guru', 'audio engineer. gain staging is an art form', 'creator', 'physical'),
    (u_clean_carl, 'clean_tone_carl', 'clean_tone_carl', 'mark knopfler proved you dont need distortion', 'free', 'helix'),
    (u_feedback, 'feedback_fred', 'feedback_fred', 'hendrix-style controlled feedback is peak guitar', 'free', 'physical'),
    (u_drop_d, 'drop_d_dan', 'drop_d_dan', 'drop D is the peoples tuning', 'free', 'katana'),
    (u_chorus_chad, 'chorus_pedal_chad', 'chorus_pedal_chad', '80s chorus is making a comeback and im here for it', 'free', 'helix'),
    (u_wah_wanda, 'wah_wah_wanda', 'wah_wah_wanda', 'crybaby is permanently on. deal with it', 'free', 'physical'),
    (u_cab_skeptic, 'cab_sim_skeptic', 'cab_sim_skeptic', 'IRs are fine but they dont FEEL the same as pushing air', 'free', 'physical'),
    (u_humbucker, 'humbuckerHank', 'humbuckerHank', 'LP custom into a mesa boogie. thick tone only', 'free', 'tonex'),
    (u_trem_tim, 'trem_picker_tim', 'trem_picker_tim', 'surf rock and spaghetti westerns. tremolo is underrated', 'free', 'katana'),
    (u_looper, 'looper_lucy', 'looper_lucy', 'one woman band. rc-505 + guitar + voice', 'free', 'helix'),
    (u_slide_sam, 'slide_guitar_sam', 'slide_guitar_sam', 'open G tuning and a glass slide. derek trucks is god', 'free', 'physical'),
    (u_noise_nancy, 'noise_gate_nancy', 'noise_gate_nancy', 'high gain needs a good gate. ISP decimator gang', 'free', 'quad_cortex'),
    (u_vinyl_vince, 'vinyl_vince', 'vinyl_vince', 'vintage gear collector. 60s fenders mostly', 'premium', 'physical')
  ON CONFLICT (id) DO NOTHING;

  -- ==========================================================================
  -- RECIPE RATINGS (120+)
  -- ==========================================================================

  INSERT INTO recipe_ratings (recipe_slug, user_id, rating, created_at) VALUES
    -- SRV Pride and Joy
    ('srv-pride-and-joy-rhythm', u_strat_dad, 5, now() - interval '80 days'),
    ('srv-pride-and-joy-rhythm', u_blues_lawyer, 5, now() - interval '70 days'),
    ('srv-pride-and-joy-rhythm', u_tube_stan, 4, now() - interval '65 days'),
    ('srv-pride-and-joy-rhythm', u_dad_rock, 5, now() - interval '55 days'),
    ('srv-pride-and-joy-rhythm', u_feedback, 5, now() - interval '50 days'),
    ('srv-pride-and-joy-rhythm', u_slide_sam, 4, now() - interval '45 days'),
    ('srv-pride-and-joy-rhythm', u_string_bob, 5, now() - interval '40 days'),
    ('srv-pride-and-joy-rhythm', u_vinyl_vince, 5, now() - interval '35 days'),
    -- Comfortably Numb
    ('gilmour-comfortably-numb-solo', u_reverb_jnk, 5, now() - interval '78 days'),
    ('gilmour-comfortably-numb-solo', u_dad_rock, 5, now() - interval '70 days'),
    ('gilmour-comfortably-numb-solo', u_strat_dad, 5, now() - interval '62 days'),
    ('gilmour-comfortably-numb-solo', u_blues_lawyer, 4, now() - interval '55 days'),
    ('gilmour-comfortably-numb-solo', u_clean_carl, 5, now() - interval '50 days'),
    ('gilmour-comfortably-numb-solo', u_chorus_chad, 5, now() - interval '42 days'),
    ('gilmour-comfortably-numb-solo', u_analog, 4, now() - interval '38 days'),
    ('gilmour-comfortably-numb-solo', u_vinyl_vince, 5, now() - interval '30 days'),
    ('gilmour-comfortably-numb-solo', u_pedalboard, 5, now() - interval '25 days'),
    -- Hendrix Voodoo Child
    ('hendrix-voodoo-child-wah', u_wah_wanda, 5, now() - interval '75 days'),
    ('hendrix-voodoo-child-wah', u_feedback, 5, now() - interval '68 days'),
    ('hendrix-voodoo-child-wah', u_fuzz_lord, 5, now() - interval '60 days'),
    ('hendrix-voodoo-child-wah', u_strat_dad, 4, now() - interval '52 days'),
    ('hendrix-voodoo-child-wah', u_blues_lawyer, 4, now() - interval '45 days'),
    ('hendrix-voodoo-child-wah', u_vinyl_vince, 5, now() - interval '38 days'),
    ('hendrix-voodoo-child-wah', u_tube_stan, 4, now() - interval '30 days'),
    -- Cobain Teen Spirit
    ('cobain-teen-spirit-grunge', u_bedroom, 5, now() - interval '30 days'),
    ('cobain-teen-spirit-grunge', u_drop_d, 5, now() - interval '28 days'),
    ('cobain-teen-spirit-grunge', u_strat_dad, 4, now() - interval '25 days'),
    ('cobain-teen-spirit-grunge', u_fuzz_lord, 3, now() - interval '20 days'),
    ('cobain-teen-spirit-grunge', u_doom, 4, now() - interval '18 days'),
    ('cobain-teen-spirit-grunge', u_pick_scraper, 4, now() - interval '15 days'),
    -- Frusciante Under the Bridge
    ('frusciante-under-the-bridge-clean', u_clean_carl, 5, now() - interval '60 days'),
    ('frusciante-under-the-bridge-clean', u_reverb_jnk, 5, now() - interval '55 days'),
    ('frusciante-under-the-bridge-clean', u_strat_dad, 4, now() - interval '48 days'),
    ('frusciante-under-the-bridge-clean', u_chorus_chad, 5, now() - interval '40 days'),
    ('frusciante-under-the-bridge-clean', u_jazz_jenny, 5, now() - interval '35 days'),
    ('frusciante-under-the-bridge-clean', u_looper, 4, now() - interval '28 days'),
    -- Slash Sweet Child
    ('slash-sweet-child-lead', u_humbucker, 5, now() - interval '70 days'),
    ('slash-sweet-child-lead', u_dad_rock, 5, now() - interval '65 days'),
    ('slash-sweet-child-lead', u_bedroom, 5, now() - interval '58 days'),
    ('slash-sweet-child-lead', u_tube_stan, 4, now() - interval '50 days'),
    ('slash-sweet-child-lead', u_blues_lawyer, 4, now() - interval '42 days'),
    ('slash-sweet-child-lead', u_pick_scraper, 5, now() - interval '35 days'),
    ('slash-sweet-child-lead', u_analog, 5, now() - interval '28 days'),
    ('slash-sweet-child-lead', u_strat_dad, 4, now() - interval '20 days'),
    -- Mayer Gravity
    ('mayer-gravity-super-clean-dynamic', u_clean_carl, 5, now() - interval '55 days'),
    ('mayer-gravity-super-clean-dynamic', u_strat_dad, 5, now() - interval '48 days'),
    ('mayer-gravity-super-clean-dynamic', u_blues_lawyer, 5, now() - interval '40 days'),
    ('mayer-gravity-super-clean-dynamic', u_jazz_jenny, 4, now() - interval '35 days'),
    ('mayer-gravity-super-clean-dynamic', u_tele_life, 5, now() - interval '28 days'),
    ('mayer-gravity-super-clean-dynamic', u_reverb_jnk, 4, now() - interval '20 days'),
    ('mayer-gravity-super-clean-dynamic', u_looper, 5, now() - interval '15 days'),
    -- Extra ratings spread across other recipes
    ('edge-where-the-streets-dotted-delay', u_reverb_jnk, 5, now() - interval '50 days'),
    ('edge-where-the-streets-dotted-delay', u_chorus_chad, 4, now() - interval '40 days'),
    ('edge-where-the-streets-dotted-delay', u_pedalboard, 5, now() - interval '35 days'),
    ('edge-where-the-streets-dotted-delay', u_looper, 4, now() - interval '25 days'),
    ('edge-where-the-streets-dotted-delay', u_dad_rock, 4, now() - interval '20 days'),
    ('hammett-enter-sandman-rhythm', u_djent, 4, now() - interval '42 days'),
    ('hammett-enter-sandman-rhythm', u_pick_scraper, 5, now() - interval '38 days'),
    ('hammett-enter-sandman-rhythm', u_drop_d, 5, now() - interval '30 days'),
    ('hammett-enter-sandman-rhythm', u_noise_nancy, 4, now() - interval '25 days'),
    ('hammett-enter-sandman-rhythm', u_humbucker, 5, now() - interval '18 days'),
    ('hammett-enter-sandman-rhythm', u_doom, 4, now() - interval '12 days'),
    ('hammett-enter-sandman-rhythm', u_bedroom, 5, now() - interval '8 days'),
    ('king-bb-thrill-is-gone', u_blues_lawyer, 5, now() - interval '60 days'),
    ('king-bb-thrill-is-gone', u_slide_sam, 5, now() - interval '50 days'),
    ('king-bb-thrill-is-gone', u_strat_dad, 4, now() - interval '40 days'),
    ('king-bb-thrill-is-gone', u_vinyl_vince, 5, now() - interval '30 days'),
    ('king-bb-thrill-is-gone', u_string_bob, 4, now() - interval '22 days'),
    ('king-bb-thrill-is-gone', u_tube_stan, 5, now() - interval '15 days'),
    ('morello-killing-in-the-name-of', u_drop_d, 5, now() - interval '40 days'),
    ('morello-killing-in-the-name-of', u_feedback, 5, now() - interval '35 days'),
    ('morello-killing-in-the-name-of', u_wah_wanda, 4, now() - interval '28 days'),
    ('morello-killing-in-the-name-of', u_fuzz_lord, 4, now() - interval '20 days'),
    ('morello-killing-in-the-name-of', u_bedroom, 5, now() - interval '15 days'),
    ('page-stairway-to-heaven-solo', u_dad_rock, 5, now() - interval '50 days'),
    ('page-stairway-to-heaven-solo', u_blues_lawyer, 5, now() - interval '42 days'),
    ('page-stairway-to-heaven-solo', u_vinyl_vince, 5, now() - interval '35 days'),
    ('page-stairway-to-heaven-solo', u_analog, 4, now() - interval '28 days'),
    ('page-stairway-to-heaven-solo', u_humbucker, 5, now() - interval '20 days'),
    ('page-stairway-to-heaven-solo', u_tube_stan, 4, now() - interval '12 days'),
    ('page-stairway-to-heaven-solo', u_tele_life, 3, now() - interval '8 days'),
    -- Some lower ratings for realism
    ('cobain-teen-spirit-grunge', u_jazz_jenny, 2, now() - interval '12 days'),
    ('cobain-teen-spirit-grunge', u_clean_carl, 2, now() - interval '10 days'),
    ('hammett-enter-sandman-rhythm', u_jazz_jenny, 2, now() - interval '15 days'),
    ('hammett-enter-sandman-rhythm', u_clean_carl, 3, now() - interval '10 days'),
    ('mayer-gravity-super-clean-dynamic', u_djent, 2, now() - interval '8 days'),
    ('mayer-gravity-super-clean-dynamic', u_doom, 1, now() - interval '5 days'),
    ('hendrix-voodoo-child-wah', u_djent, 3, now() - interval '22 days'),
    ('srv-pride-and-joy-rhythm', u_djent, 2, now() - interval '18 days'),
    ('frusciante-under-the-bridge-clean', u_doom, 2, now() - interval '15 days'),
    ('frusciante-under-the-bridge-clean', u_pick_scraper, 3, now() - interval '10 days'),
    -- More scattered ratings
    ('slash-sweet-child-lead', u_jazz_jenny, 3, now() - interval '15 days'),
    ('edge-where-the-streets-dotted-delay', u_analog, 3, now() - interval '10 days'),
    ('edge-where-the-streets-dotted-delay', u_fuzz_lord, 2, now() - interval '8 days'),
    ('king-bb-thrill-is-gone', u_doom, 3, now() - interval '8 days'),
    ('morello-killing-in-the-name-of', u_clean_carl, 3, now() - interval '5 days'),
    ('morello-killing-in-the-name-of', u_jazz_jenny, 3, now() - interval '3 days')
  ON CONFLICT (recipe_slug, user_id) DO NOTHING;

  -- ==========================================================================
  -- COMMENTS (150+) - threaded, authentic guitar forum voice
  -- ==========================================================================

  -- SRV Pride and Joy comments
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c1, 'srv-pride-and-joy-rhythm', u_strat_dad, 'DUDE. ive been chasing this tone since i heard pride and joy in my dads truck in like 1998. finally got close with these settings on my blues jr. the key really is the TS at low gain', now() - interval '79 days'),
    (c2, 'srv-pride-and-joy-rhythm', u_blues_lawyer, 'Great recipe. One thing I would add is that SRVs tone is like 80% in the hands. Those thick strings and that aggressive attack are what really makes it. Settings alone wont get you there but this is a solid starting point', now() - interval '68 days'),
    (c3, 'srv-pride-and-joy-rhythm', u_tube_stan, 'lol at everyone trying to get SRV tone without 13 gauge strings and a cranked super reverb. your fingers are gonna hurt', now() - interval '60 days');

  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('srv-pride-and-joy-rhythm', u_bedroom, c1, 'wait you can get this on a blues jr?? i have one of those! what settings do you use on the amp itself', now() - interval '78 days'),
    ('srv-pride-and-joy-rhythm', u_strat_dad, c1, 'yeah man! vol around 7-8, treble 6, bass 5. push it with a TS and your there. well, close enough for a bedroom anyway lol', now() - interval '78 days'),
    ('srv-pride-and-joy-rhythm', u_feedback, c3, 'i use 11s and its close enough tbh. 13s are brutal on the fingers', now() - interval '58 days'),
    ('srv-pride-and-joy-rhythm', u_slide_sam, c2, 'this 100%. SRV could make a squier through a practice amp sound incredible. the recipe gets the gear side right tho', now() - interval '55 days');

  -- Comfortably Numb comments
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c4, 'gilmour-comfortably-numb-solo', u_reverb_jnk, 'the delay settings on this are PERFECT. i spent months trying to get the right repeats and this nailed it. big muff into a hiwatt sound with those delay taps... chefs kiss', now() - interval '75 days'),
    (c5, 'gilmour-comfortably-numb-solo', u_dad_rock, 'been playing this solo at every jam night for 20 years and these are honestly the closest settings ive found. the key insight about the compressor before the muff is spot on', now() - interval '68 days'),
    (c6, 'gilmour-comfortably-numb-solo', u_chorus_chad, 'anyone else notice gilmour uses way less gain than you think? like the sustain comes from the compressor not the dirt. this recipe gets that', now() - interval '40 days');

  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('gilmour-comfortably-numb-solo', u_analog, c4, 'which big muff clone are you using? i have a nano and it sounds too scooped for this', now() - interval '73 days'),
    ('gilmour-comfortably-numb-solo', u_reverb_jnk, c4, 'EHX green russian reissue. the nano is too thin imo. you want the thicker mids version', now() - interval '72 days'),
    ('gilmour-comfortably-numb-solo', u_pedalboard, c4, 'try the analogman sunface into the muff. gilmour stacks a fuzz face before it on pulse tour. game changer', now() - interval '65 days'),
    ('gilmour-comfortably-numb-solo', u_strat_dad, c6, 'yesss this is so true. i used to run my muff at like sustain on 8 and it was all mush. backed it down to 5-6 and its way more defined', now() - interval '38 days');

  -- Hendrix Voodoo Child comments
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('hendrix-voodoo-child-wah', u_wah_wanda, 'the wah technique breakdown here is so good. most ppl just rock it back and forth but hendrix was way more musical with it. the heel-down starting position tip is gold', now() - interval '73 days'),
    ('hendrix-voodoo-child-wah', u_fuzz_lord, 'fuzz face into a cranked marshall is literally the greatest guitar sound ever created. no notes', now() - interval '58 days'),
    ('hendrix-voodoo-child-wah', u_feedback, 'one thing missing - hendrix had his amp CRANKED. like painfully loud. thats where the harmonic overtones come from. hard to replicate at bedroom volume tbh', now() - interval '50 days'),
    ('hendrix-voodoo-child-wah', u_djent, 'cool tone but not rly my thing. needs more gain lol', now() - interval '20 days'),
    ('hendrix-voodoo-child-wah', u_vinyl_vince, 'I played through a 67 Marshall Plexi last month at a vintage shop. The real deal sounds different from any pedal recreation. That said this recipe is remarkably close for modern gear', now() - interval '15 days');

  -- Cobain Teen Spirit comments
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c7, 'cobain-teen-spirit-grunge', u_bedroom, 'this is literally why i started playing guitar. loaded this up on my katana and its SO close. thanks!!!', now() - interval '28 days'),
    (c8, 'cobain-teen-spirit-grunge', u_drop_d, 'DS-1 into a clean amp is underrated. everyone wants a mesa or a rat for grunge but kurt used a boss pedal lol', now() - interval '25 days');

  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('cobain-teen-spirit-grunge', u_fuzz_lord, c7, 'katana is actually great for this tone. the boss DS-1 model in it is really accurate', now() - interval '27 days'),
    ('cobain-teen-spirit-grunge', u_bedroom, c7, 'fr fr the katana gets alot of hate but for bedroom volume grunge its perfect', now() - interval '27 days'),
    ('cobain-teen-spirit-grunge', u_jazz_jenny, c8, 'i mean... its literally power chords with distortion. not exactly rocket science lol', now() - interval '23 days'),
    ('cobain-teen-spirit-grunge', u_drop_d, c8, 'ok but the simplicity IS the point. thats what made it great', now() - interval '22 days');

  -- Slash Sweet Child comments
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('slash-sweet-child-lead', u_humbucker, 'nailed it. LP into a JCM800 is the sound of rock n roll. period. the alnico IIs in the neck position are critical tho dont use any other pickup', now() - interval '68 days'),
    ('slash-sweet-child-lead', u_dad_rock, 'ive been trying to nail this tone since i heard appetite for destruction in 8th grade lol. these settings on the helix are scary close', now() - interval '62 days'),
    ('slash-sweet-child-lead', u_bedroom, 'fire 🔥🔥🔥', now() - interval '55 days'),
    ('slash-sweet-child-lead', u_tube_stan, 'people sleep on how important the wah position is for slashs tone. he parks it slightly open most of the time for that mid boost. this recipe catches that', now() - interval '48 days'),
    ('slash-sweet-child-lead', u_analog, 'the real secret is that slash used a modded JCM800 with a gain mod. stock 800s dont have quite enough gain for this. a TS in front gets you close tho', now() - interval '35 days'),
    ('slash-sweet-child-lead', u_pick_scraper, 'GOAT intro. GOAT tone. this recipe is the closest ive found online', now() - interval '30 days');

  -- Mayer Gravity comments
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c9, 'mayer-gravity-super-clean-dynamic', u_clean_carl, 'THIS is how clean tone should sound. not sterile and boring but alive and responsive. the compressor settings here are really well dialed - just enough squish without killing dynamics', now() - interval '52 days'),
    (c10, 'mayer-gravity-super-clean-dynamic', u_strat_dad, 'mayer gets so much hate but his clean tone is objectively incredible. these settings on my strat through a DRRI are gorgeous', now() - interval '45 days');

  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('mayer-gravity-super-clean-dynamic', u_blues_lawyer, c9, 'totally agree on the compressor thing. so many people skip it for clean tones but its what gives mayer that polished professional sound', now() - interval '50 days'),
    ('mayer-gravity-super-clean-dynamic', u_tele_life, c10, 'try it through a princeton reverb too. slightly different flavor but equally beautiful', now() - interval '43 days'),
    ('mayer-gravity-super-clean-dynamic', u_djent, c10, 'nice tone 👍 not my thing but i can respect the craft', now() - interval '8 days'),
    ('mayer-gravity-super-clean-dynamic', u_doom, c10, 'needs more gain', now() - interval '5 days');

  -- More comments on other recipes
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('mayer-gravity-super-clean-dynamic', u_jazz_jenny, 'the Klon settings here are interesting. I always thought mayer used it more as a boost than a drive but this works either way', now() - interval '33 days'),
    ('mayer-gravity-super-clean-dynamic', u_looper, 'just tried this on my helix and wow. the key is really the amp settings, not the pedals imo', now() - interval '20 days'),
    ('edge-where-the-streets-dotted-delay', u_reverb_jnk, 'THE DELAYS. this is what i live for. the dotted eighth note pattern is so satisfying when you get the timing right. this recipe nails the delay settings', now() - interval '48 days'),
    ('edge-where-the-streets-dotted-delay', u_pedalboard, 'you need a proper analog delay for this imo. digital delays are too clean. the edge uses memory mans and the slight warble is part of the sound', now() - interval '40 days'),
    ('edge-where-the-streets-dotted-delay', u_chorus_chad, 'dont forget the shimmer reverb! edges tone is like 50% delay and 50% reverb/modulation. this recipe covers both', now() - interval '32 days'),
    ('edge-where-the-streets-dotted-delay', u_kemper, 'loaded the helix preset and its amazing but had to adjust the delay time slightly for my tempo. the dotted 8th formula in the notes section was super helpful', now() - interval '25 days'),
    ('edge-where-the-streets-dotted-delay', u_looper, 'saving this. ive been trying to get edges sound for a worship set and this is perfect', now() - interval '18 days'),
    ('hammett-enter-sandman-rhythm', u_djent, 'solid recipe but the gain could be higher imo. metallica live has way more saturation than the album. james runs his amp pretty hot', now() - interval '40 days'),
    ('hammett-enter-sandman-rhythm', u_pick_scraper, 'METALLICAAAAAA 🤘 this tone on the quad cortex is bruuutal', now() - interval '35 days'),
    ('hammett-enter-sandman-rhythm', u_noise_nancy, 'the noise gate settings here saved my life. was getting so much buzz with high gain and the gate placement tip (after the amp, before the cab) was the fix', now() - interval '28 days'),
    ('hammett-enter-sandman-rhythm', u_drop_d, 'tried this in drop d and it still sounds massive. might even be better tbh', now() - interval '20 days'),
    ('hammett-enter-sandman-rhythm', u_humbucker, 'mesa boogie mark IV is THE metallica amp. the recipe using the mark series model on helix is spot on', now() - interval '15 days'),
    ('hammett-enter-sandman-rhythm', u_bedroom, 'THIS IS SO HEAVY i love it. my neighbors probably hate me rn lol', now() - interval '5 days'),
    ('king-bb-thrill-is-gone', u_blues_lawyer, 'BB King with the ES-355 and those massive vibratos... this recipe really captures the vocal quality of his tone. the mid-boost tip is key', now() - interval '58 days'),
    ('king-bb-thrill-is-gone', u_slide_sam, 'lucille singing through a twin reverb is one of the most beautiful sounds in music. this gets close. real close', now() - interval '48 days'),
    ('king-bb-thrill-is-gone', u_vinyl_vince, 'Saw BB live in 2004. His tone in person was even more incredible than recordings suggest. This recipe captures the essence well, particularly the treble response', now() - interval '30 days'),
    ('king-bb-thrill-is-gone', u_strat_dad, 'tried this on my strat and its obviously not the same as an ES-355 but with the neck pickup and tone rolled down its surprisingly close', now() - interval '20 days'),
    ('morello-killing-in-the-name-of', u_drop_d, 'DROP D BOIS RISE UP. this riff on a boosted whammy pedal is pure chaos and i love it', now() - interval '38 days'),
    ('morello-killing-in-the-name-of', u_feedback, 'morellos use of the kill switch and whammy is so creative. the recipe covers the basic tone well but theres so much technique stuff you need too', now() - interval '30 days'),
    ('morello-killing-in-the-name-of', u_wah_wanda, 'the wah technique here is different from hendrix - morello uses it more as a filter sweep. cool to see both approaches on this site', now() - interval '22 days'),
    ('morello-killing-in-the-name-of', u_bedroom, 'just learned this riff and the tone settings here make it sound EXACTLY like the album. im losing my mind rn', now() - interval '12 days'),
    ('page-stairway-to-heaven-solo', u_dad_rock, 'arguably the greatest guitar solo ever recorded and this recipe does it justice. the tele through a supro tip is spot on for the recording', now() - interval '48 days'),
    ('page-stairway-to-heaven-solo', u_vinyl_vince, 'Page actually used a Telecaster on the Stairway recording, not a Les Paul. Most people dont know that. This recipe correctly accounts for it', now() - interval '38 days'),
    ('page-stairway-to-heaven-solo', u_blues_lawyer, 'the transition from clean arpeggios to the overdriven solo section is so well documented here. the gain staging walkthrough is excellent', now() - interval '28 days'),
    ('page-stairway-to-heaven-solo', u_analog, 'page into a cranked supro/marshall is THAT sound. no pedals needed. just guitar and amp. the way god intended', now() - interval '18 days'),
    ('page-stairway-to-heaven-solo', u_humbucker, 'tried this on my LP custom and its a slightly different vibe from the tele but honestly it sounds amazing either way. more sustain with humbuckers', now() - interval '10 days'),
    ('page-stairway-to-heaven-solo', u_tele_life, 'FINALLY someone acknowledges that page used a tele. this is tele erasure in the rock community and i will not stand for it', now() - interval '5 days');

  -- Extra short comments for volume
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('srv-pride-and-joy-rhythm', u_pedalboard, 'saved 🔖', now() - interval '30 days'),
    ('gilmour-comfortably-numb-solo', u_bedroom, 'this is it chief', now() - interval '20 days'),
    ('hendrix-voodoo-child-wah', u_strat_dad, 'classic', now() - interval '12 days'),
    ('cobain-teen-spirit-grunge', u_doom, 'decent', now() - interval '8 days'),
    ('slash-sweet-child-lead', u_looper, 'saving this for later', now() - interval '18 days'),
    ('mayer-gravity-super-clean-dynamic', u_chorus_chad, 'beautiful clean tone. mayer is underrated as a guitarist fr', now() - interval '10 days'),
    ('edge-where-the-streets-dotted-delay', u_strat_dad, 'nice', now() - interval '5 days'),
    ('hammett-enter-sandman-rhythm', u_fuzz_lord, 'needs more fuzz but ok', now() - interval '3 days'),
    ('king-bb-thrill-is-gone', u_clean_carl, 'pure class. BB was the king for a reason', now() - interval '5 days'),
    ('morello-killing-in-the-name-of', u_pick_scraper, '🔥🔥🔥', now() - interval '2 days'),
    ('page-stairway-to-heaven-solo', u_bedroom, 'learning this rn wish me luck', now() - interval '1 day'),
    ('srv-pride-and-joy-rhythm', u_reverb_jnk, 'the reverb on this is chef tier', now() - interval '15 days'),
    ('gilmour-comfortably-numb-solo', u_fuzz_lord, 'big muff supremacy', now() - interval '10 days'),
    ('hendrix-voodoo-child-wah', u_tube_stan, 'you NEED a fuzz face for this. no substitutes', now() - interval '8 days'),
    ('cobain-teen-spirit-grunge', u_analog, 'grunge = punk + metal + flannel. this recipe nails the punk part', now() - interval '5 days'),
    ('slash-sweet-child-lead', u_vinyl_vince, 'Appetite is a masterclass in guitar tone from start to finish', now() - interval '12 days'),
    ('srv-pride-and-joy-rhythm', u_wah_wanda, 'SRV is in my top 3 forever', now() - interval '8 days'),
    ('gilmour-comfortably-numb-solo', u_looper, 'just played through this whole solo with these settings. transcendent', now() - interval '3 days'),
    ('hendrix-voodoo-child-wah', u_pedalboard, 'added a fuzz face to my board specifically for this tone. worth every penny', now() - interval '5 days'),
    ('mayer-gravity-super-clean-dynamic', u_reverb_jnk, 'the room verb settings are 💯', now() - interval '3 days');

  -- ==========================================================================
  -- FORUM THREADS + REPLIES (25 threads)
  -- ==========================================================================

  -- Look up category IDs
  SELECT id INTO cat_general FROM forum_categories WHERE slug = 'general';
  SELECT id INTO cat_gear FROM forum_categories WHERE slug = 'gear';
  SELECT id INTO cat_tone FROM forum_categories WHERE slug = 'tone-help';
  SELECT id INTO cat_tips FROM forum_categories WHERE slug = 'tips-tricks';
  SELECT id INTO cat_show FROM forum_categories WHERE slug = 'show-tell';
  SELECT id INTO cat_platform FROM forum_categories WHERE slug = 'platform-specific';

  -- Thread 1: General
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t1, cat_general, u_strat_dad, 'Finally nailed the brown sound after 3 years of trying', 'finally-nailed-brown-sound', E'ok so ive been chasing EVH''s brown sound since i got my first marshall clone 3 years ago. tried everything - variac, plexi mods, attenuators, different speakers. Finally figured out the secret: its the PHASE INVERTER tube. swapped in a 12AT7 in V4 and suddenly everything clicked.\n\nthe gain structure is so different. less fizzy, more compressed, that vowel-like quality everyone talks about. Combined with an MXR phase 90 and a single coil in bridge position... i almost cried lol\n\nanyone else have a eureka moment like this? whats the tone you chased the longest?', 8, 234, now() - interval '85 days', now() - interval '2 days');

  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t1, u_tube_stan, E'dude the V4 tube swap is legit. most people dont realize how much the phase inverter affects feel and gain character. nice find!', now() - interval '84 days'),
    (t1, u_analog, E'3 years is nothing lol. ive been chasing gilmours pulse tone for like a decade. every time i think im close i hear the album again and realize im still miles away. the sustain man... THE SUSTAIN', now() - interval '83 days'),
    (t1, u_blues_lawyer, E'The Variac approach is what Eddie actually used, but the tube swap achieves a similar voltage starve effect with less risk to the transformer. Smart move.\n\nFor me it was Hendrix''s Band of Gypsys tone. Took me 5 years to realize it wasn''t just a fuzz face - it was a fuzz face with dying batteries into a cranked Marshall with specific speaker breakup.', now() - interval '82 days'),
    (t1, u_bedroom, 'wait what is a phase inverter tube? im still learning about amp circuits sorry if thats a dumb question', now() - interval '80 days'),
    (t1, u_gain_guru, E'Not a dumb question! The phase inverter (PI) is the last preamp tube before the power section. It splits the signal into two opposite phases to drive the power tubes. Changing it from a 12AX7 (high gain) to a 12AT7 (lower gain, different headroom) changes how the amp transitions into distortion.\n\nIts one of the most impactful mods you can do and its completely reversible - just swap the tube back.', now() - interval '79 days'),
    (t1, u_kemper, 'profiled my buddy''s modded marshall with the 12AT7 swap and honestly its one of the best profiles i have. the feel through the kemper is really close to the real thing on this one', now() - interval '70 days'),
    (t1, u_cab_skeptic, 'lol at profiling a modded marshall. just play the real amp bro', now() - interval '65 days'),
    (t1, u_strat_dad, 'update: been living with this tone for a few weeks now and its still making me smile every time i plug in. the MXR phase 90 script mode is essential btw. the modern one is too intense', now() - interval '2 days');

  -- Thread 2: Gear
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t2, cat_gear, u_pedalboard, 'Hot take: the Boss Katana is better than most tube amps under $1000', 'katana-better-than-tube-amps', E'hear me out before you downvote me into oblivion.\n\ni own a Fender DRRI ($900), a Vox AC15 ($800), and a Boss Katana 100 ($350). for bedroom playing and small gigs, the katana hangs with both of them. the built in effects are actually good, the power scaling works great for low volume, and the tone studio software lets you dial in anything.\n\nis it the same FEEL as a tube amp at volume? no. but for 90% of what most of us do (bedroom playing lets be honest) its more practical and sounds great.\n\nfight me', 12, 567, now() - interval '72 days', now() - interval '1 day');

  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t2, u_analog, 'this is the worst take ive ever seen on a guitar forum and ive been on the gear page since 2006. tubes or go home', now() - interval '71 days'),
    (t2, u_tube_stan, E'ok the katana is fine for what it is but BETTER than a DRRI?? bro. the touch sensitivity alone puts the fender in another league. when you roll back your guitar volume on a tube amp and it cleans up... the katana cant do that the same way', now() - interval '71 days'),
    (t2, u_bedroom, 'as someone who cant afford a tube amp yet... the katana is literally amazing and i dont care what anyone says. it got me into guitar and its all i need rn', now() - interval '70 days'),
    (t2, u_dad_rock, 'im a tube amp guy through and through but i bought a katana for late night playing and... yeah its really good. i hate admitting it but its true', now() - interval '68 days'),
    (t2, u_gain_guru, E'The katana''s modeling is genuinely impressive for the price. But the comparison isn''t really fair - a tube amp at volume in a room is a completely different experience. Air moving, speaker interaction, natural compression from power tubes saturating... you can''t model that feeling.\n\nFor recording though? The katana is probably the smarter choice for most people. Direct recording with cab sims sounds great.', now() - interval '65 days'),
    (t2, u_kemper, 'sold all my amps and went kemper. best decision i ever made. the modeling vs tube debate is over imo, digital won. sorry grandpa', now() - interval '60 days'),
    (t2, u_cab_skeptic, E'digital has NOT won. go play a cranked JCM800 at stage volume and then tell me your kemper feels the same. i''ll wait', now() - interval '58 days'),
    (t2, u_pedalboard, E'lol this thread is exactly what i expected. for the record im not saying tubes are bad - i literally own two tube amps. im saying the katana punches WAY above its price point and for most peoples actual use case (bedroom, small jams) its arguably more practical\n\nbut keep the hot takes coming this is entertaining 🍿', now() - interval '55 days'),
    (t2, u_jazz_jenny, 'my JC-120 is solid state and its one of the most beloved guitar amps of all time. the tube vs solid state debate is silly. use what sounds good', now() - interval '50 days'),
    (t2, u_tele_life, 'butterscotch tele into a princeton reverb. dont need a katana dont need a kemper. just need 15 watts of tube goodness and a tele', now() - interval '45 days'),
    (t2, u_djent, 'neural dsp plugins > all hardware. there i said it', now() - interval '30 days'),
    (t2, u_vinyl_vince, 'I have amplifiers from the 1960s that still sound extraordinary. There is something irreplaceable about the interaction between vintage transformers, old stock tubes, and well-aged speakers. Modern modeling is impressive but it captures a snapshot, not the living breathing experience', now() - interval '1 day');

  -- Thread 3: Tone Help
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t3, cat_tone, u_bedroom, 'Help: my high gain tones sound fizzy and harsh. what am i doing wrong??', 'high-gain-fizzy-harsh-help', E'running a jackson soloist with emgs into my katana on the brown channel. gain is maxed, treble at 7, mids at 3, bass at 8. sounds like a bee in a tin can, not the chunky metal tone i want.\n\nive watched like 50 youtube videos and everyones settings sound great on camera but trash when i dial them in. what am i missing???\n\nbudget is tight so please dont say "buy a real amp" lol', 7, 312, now() - interval '30 days', now() - interval '5 days');

  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t3, u_gain_guru, E'ok i see several issues:\n\n1. Gain maxed = fizz city. back it down to 5-6. seriously. you get more clarity and its still heavy\n2. Mids at 3 is way too scooped. bring those up to at least 5-6. metal needs mids despite what the "scooped" myth says\n3. Bass at 8 is too much, especially at bedroom volume. low end gets muddy fast. try 4-5\n4. Treble at 7 is fine but might need to come down to 5-6 after you fix the mids\n\ntry: gain 5.5, treble 5, mids 6, bass 4. then adjust from there. less gain MORE mids is the secret to good metal tone', now() - interval '29 days'),
    (t3, u_noise_nancy, 'also GET A NOISE GATE. with EMGs and high gain you need one or its gonna be buzzy city. even a cheap one helps', now() - interval '28 days'),
    (t3, u_djent, 'gain staging guru is right about the gain. every beginner cranks the gain because they think more = heavier but its the opposite. tight metal tone comes from moderate gain with good technique. your palm mutes will thank you', now() - interval '27 days'),
    (t3, u_humbucker, 'the scooped mids thing is a MYTH that has ruined so many guitar tones. metallica sounds scooped on the album because of how it was mixed but james hetfield actually has his mids pretty high on his amp. boost those mids!!', now() - interval '25 days'),
    (t3, u_bedroom, 'UPDATE: holy crap you guys were right. backed the gain to 5, boosted mids to 6, dropped bass to 4. sounds COMPLETELY different. like actually heavy now instead of fizzy. i cant believe less gain = more heavy. thank you all so much 🙏', now() - interval '20 days'),
    (t3, u_pick_scraper, 'lol welcome to the club. we all went through the "more gain" phase. glad you made it out alive', now() - interval '18 days'),
    (t3, u_gain_guru, 'glad it worked! one more tip: try putting a tubescreamer style pedal (or the katana''s built in one) in front with the gain low and the level high. its called a "gain boost" and its how most metal players get their tone. the pedal tightens the low end and pushes the amp harder without adding fizz', now() - interval '5 days');

  -- Thread 4: Tips
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t4, cat_tips, u_gain_guru, 'PSA: Your tone knob is the most powerful EQ on your guitar', 'tone-knob-most-powerful-eq', E'seriously. how many of you leave your tone knob on 10 all the time? most people do and theyre missing out on like 50% of their tonal range.\n\ntry this experiment:\n1. set your amp to a slightly crunchy clean\n2. play with tone on 10 - bright, cutting, maybe harsh\n3. roll it to 7 - suddenly warmer, thicker, more "vintage"\n4. roll to 4-5 - woman tone territory, thick and creamy\n5. roll to 1-2 - jazz city, round and warm\n\nthats 5 completely different usable tones from ONE KNOB. no pedal needed. clapton, hendrix, SRV, page - they all used the tone knob constantly. its not just a "make it darker" knob, its an expressive tool.\n\nalso works amazing with overdrive and fuzz. fuzz face with tone at 6 is *chefs kiss*', 6, 445, now() - interval '65 days', now() - interval '10 days');

  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t4, u_strat_dad, 'this changed my playing when i finally figured it out. i used to think i needed 10 pedals for different tones but really its volume knob + tone knob + one good overdrive and your set', now() - interval '64 days'),
    (t4, u_tele_life, 'tele tone knob on 6-7 is the sweetest spot in all of guitar. fight me', now() - interval '60 days'),
    (t4, u_clean_carl, 'mark knopfler basically built his entire career on strategic tone knob use. that creamy strat neck pickup with tone rolled to 5-6 is HIS sound', now() - interval '55 days'),
    (t4, u_jazz_jenny, 'as a jazz player i live between 2-5 on the tone knob. anything above 7 is too bright for chord voicings imo. great post!', now() - interval '45 days'),
    (t4, u_fuzz_lord, 'fuzz + tone knob rolled back = the greatest sound known to mankind. hendrix knew this. gilmour knew this. everyone should know this', now() - interval '30 days'),
    (t4, u_bedroom, 'bruh i literally never touched my tone knob before reading this. just tried it and WOW it makes such a huge difference. why dont they teach this stuff in beginner lessons??', now() - interval '10 days');

  -- Thread 5: Show & Tell
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t5, cat_show, u_pedalboard, 'My pedalboard evolution 2019 vs 2026', 'pedalboard-evolution-2019-vs-2026', E'2019: Boss DS-1 → Boss CH-1 → Boss DD-3. straight into a Fender Frontman 15. total cost: maybe $200\n\n2026: Analogman King of Tone → Strymon Compadre → Strymon Timeline → Strymon BigSky → Eventide H90. into a Matchless DC-30. total cost: i dont want to think about it\n\nthe kicker? my wife says they sound the same lol\n\nbut seriously the journey has been amazing. each pedal taught me something about tone. whats your board look like?', 5, 289, now() - interval '55 days', now() - interval '8 days');

  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t5, u_analog, 'a matchless DC-30 deserves real pedals in front of it. good choices. that king of tone is unicorn status', now() - interval '54 days'),
    (t5, u_tube_stan, 'your wife is wrong and right at the same time lol. to untrained ears its "the same" but WE know the difference. the feel, the dynamics, the way notes bloom...', now() - interval '50 days'),
    (t5, u_bedroom, 'my "pedalboard" is a boss katana with built in effects lol. one day ill have a real board', now() - interval '40 days'),
    (t5, u_reverb_jnk, E'timeline + bigsky is the ambient guitarist starter pack and i mean that as a compliment. those two pedals can create entire worlds of sound\n\nhave you tried running the H90 in stereo? game changer for ambient stuff', now() - interval '30 days'),
    (t5, u_looper, 'your 2019 board is basically what i gig with now and its all i need tbh. sometimes simpler is better. but that 2026 board is gorgeous', now() - interval '8 days');

  -- Threads 6-15: More variety
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t6, cat_gear, u_tele_life, 'NGD! Just picked up a 72 Tele Deluxe reissue', 'ngd-72-tele-deluxe-reissue', E'found one at my local shop for $850 and couldnt say no. the wide range humbuckers are so different from regular humbuckers - they have this clarity and chime that you dont expect from a humbucker guitar.\n\ngoing to run it through my princeton reverb tonight. will report back with tone findings!', 4, 178, now() - interval '48 days', now() - interval '40 days'),
    (t7, cat_general, u_fuzz_lord, 'Why does everyone sleep on the RAT?', 'why-everyone-sleep-on-rat', E'seriously the ProCo RAT is one of the most versatile drive pedals ever made and nobody talks about it. it can do light overdrive, heavy distortion, and basically fuzz territory. its like $60 used.\n\nthe filter knob is the secret weapon - turn it down for thick chunky tones, turn it up for searing lead tones. and it stacks with other pedals beautifully.\n\nidk why everyone is paying $300 for klones when a RAT does the job for a fraction of the price. end rant', 6, 356, now() - interval '60 days', now() - interval '15 days'),
    (t8, cat_tone, u_djent, 'Help me choose: Quad Cortex vs Helix vs Kemper for metal', 'qc-vs-helix-vs-kemper-metal', E'currently running a pod go and ready to upgrade. play mostly modern metal / djent / prog. budget is around $1500-2000.\n\nwhat ive heard:\n- QC: best amp captures, touchscreen, looks cool\n- Helix: most effects, best routing, huge community\n- Kemper: best profiles, been around longest, proven\n\nfor heavy tones specifically which one wins? i need tight low end, searing leads, and good noise gate. help me decide before i impulse buy all three lol', 8, 489, now() - interval '45 days', now() - interval '3 days'),
    (t9, cat_tips, u_slide_sam, 'Open tunings changed my life - heres how to get started', 'open-tunings-getting-started', E'been playing in standard tuning for 15 years before i tried open G (DGDGBD). within 5 minutes i was writing stuff that sounded completely different from anything id played before.\n\nif your in a creative rut, try these:\n- Open G (DGDGBD) - rolling stones, derek trucks territory\n- Open D (DADF#AD) - slide blues, folk\n- DADGAD - celtic, fingerstyle, jimmy page\n- Open E (EBEG#BE) - slide guitar, duane allman\n\nyour chord shapes become one finger barres and suddenly your playing stuff that sounds way more complex than it is. plus slide guitar becomes 10x easier', 4, 267, now() - interval '58 days', now() - interval '20 days'),
    (t10, cat_platform, u_kemper, 'Kemper tips that nobody tells you about', 'kemper-tips-nobody-tells-you', E'been on kemper for 2 years now. here are some things i wish i knew from day one:\n\n1. LOCK YOUR EQ. find settings you like and lock them across profiles. game changer for consistency\n2. The built in noise gate is actually amazing once you figure out the threshold\n3. Use "pure cabinet" mode - it removes the weird artifacts from cab profiles\n4. Always profile your amps with a fresh set of tubes. tired tubes = tired profiles\n5. The morphing feature is criminally underused. set up foot morphs for lead boosts\n\nhope this helps someone!', 3, 198, now() - interval '35 days', now() - interval '12 days'),
    (t11, cat_show, u_vinyl_vince, 'My 1965 Fender Deluxe Reverb - original everything', 'my-1965-fender-deluxe-reverb', E'Inherited this from my uncle who bought it new in 1965. Original tubes (replaced once in the 80s), original Jensen speaker, original vibrato circuit. Everything works perfectly.\n\nThe tone at around volume 5-6 is indescribable. There is a warmth and three-dimensionality that no modern amp or modeler I have tried can replicate. Not even close.\n\nI understand the convenience argument for digital, but for recording and for the pure joy of playing, there is nothing like the real thing.', 5, 334, now() - interval '42 days', now() - interval '5 days'),
    (t12, cat_general, u_jazz_jenny, 'Unpopular opinion: you dont need pedals for great tone', 'unpopular-opinion-no-pedals', E'guitar → cable → amp. thats it. thats the tweet.\n\ni play an ES-335 into a roland JC-120 with zero pedals and ive never felt limited. volume knob for dynamics, tone knob for EQ, pickup selector for voicing.\n\nwes montgomery didnt need pedals. joe pass didnt need pedals. jim hall didnt need pedals. the obsession with gear is distracting people from actually practicing.\n\n/end jazz rant', 7, 412, now() - interval '38 days', now() - interval '2 days'),
    (t13, cat_gear, u_doom, 'Best fuzz pedals for doom/stoner metal?', 'best-fuzz-doom-stoner-metal', E'tuned to C standard on a les paul. looking for that thick wall of fuzz sound. matt pike / electric wizard territory.\n\ncurrently using a big muff pi and its ok but feels too scooped in the mids for doom. need something thicker and more aggressive.\n\nbudget $100-200. go', 5, 223, now() - interval '40 days', now() - interval '10 days'),
    (t14, cat_tips, u_clean_carl, 'How to get a great clean tone (its easier than you think)', 'great-clean-tone-easy', E'everyone focuses on drive and gain but a great clean tone is the foundation of everything. here are my tips:\n\n1. Start with your amp CLEAN clean. no breakup at all\n2. Use a compressor - subtle compression makes clean tone sit in a mix beautifully\n3. A TINY bit of reverb - not drenched, just enough to add dimension\n4. Roll your tone knob to 6-7 to take the ice pick highs off\n5. Use the neck or middle pickup position\n6. Play with dynamics - clean tone rewards soft touch\n\nthe goal is a tone thats warm but clear, full but not muddy. think john mayer, mark knopfler, or early clapton', 3, 198, now() - interval '32 days', now() - interval '8 days'),
    (t15, cat_platform, u_cab_skeptic, 'Unpopular opinion: IRs dont feel the same as a real cab', 'irs-dont-feel-same-real-cab', E'i know im gonna get dragged for this but IRs (impulse responses) sound different in the room than a real speaker. yeah they sound great in recordings and on headphones. but when your playing live, theres something about air being pushed by a real speaker cone that IRs through FRFR cant replicate.\n\nthe low end thump, the way the sound fills the room, the feedback interaction... its different.\n\nam i crazy? anyone else feel this way?', 5, 267, now() - interval '28 days', now() - interval '3 days');

  -- Threads 16-25
  INSERT INTO forum_threads (id, category_id, user_id, title, slug, body, reply_count, view_count, created_at, last_reply_at) VALUES
    (t16, cat_gear, u_chorus_chad, '80s chorus is making a comeback and im here for it', 'eighties-chorus-comeback', E'the CE-2w, the julia, the dimension C clone from boss... everyone is going back to that lush 80s chorus sound and i LOVE it. for years chorus was considered "cheesy" but now its trendy again.\n\ntheres something about a subtle chorus on a clean tone that just adds so much depth and movement. andy summers, the cure, cocteau twins... chorus IS the 80s sound and its beautiful\n\nwhats your favorite chorus pedal?', 4, 156, now() - interval '25 days', now() - interval '5 days'),
    (t17, cat_tone, u_drop_d, 'How do I get a good chugging tone for drop D metal?', 'good-chugging-tone-drop-d', E'my palm mutes sound floppy and undefined in drop D. running a schecter with EMGs into a line 6 pod go. the low D string just turns to mush when i try to chug. what am i doing wrong?\n\nwant that tight percussive CHUNK sound like lamb of god or gojira', 5, 234, now() - interval '22 days', now() - interval '4 days'),
    (t18, cat_show, u_looper, 'One woman band: my live looping rig breakdown', 'one-woman-band-looping-rig', E'just did my first solo gig using loops and wanted to share my setup:\n\n- guitar: fender strat → boss tuner → EHX canyon delay → boss RC-505 looper\n- voice: shure SM58 → TC helicon voicelive → RC-505\n- output: RC-505 stereo out → PA system\n\nthe RC-505 is the brain of everything. i can layer guitar rhythms, add vocal harmonies, drop in percussion hits, and build entire songs live. its like having a full band in a box\n\nif anyone is interested in live looping i highly recommend starting with a simple one-button looper and working your way up', 3, 145, now() - interval '18 days', now() - interval '6 days'),
    (t19, cat_general, u_noise_nancy, 'Can we talk about how important a good noise gate is?', 'importance-good-noise-gate', E'just upgraded from a cheap amazon noise gate to an ISP decimator II and the difference is night and day. my high gain patches went from buzzy mess to dead silent between notes.\n\nthe trick is gate PLACEMENT:\n- in the effects loop = gates the amp noise but preserves pick attack\n- in front of the amp = gates everything but can cut off your sustain\n- both (the X pattern) = best of both worlds\n\nif your playing high gain and dont have a noise gate, get one. its not optional', 4, 189, now() - interval '15 days', now() - interval '3 days'),
    (t20, cat_tips, u_string_bob, 'Country guitar tone: how to get that chicken pickin sound', 'country-chicken-pickin-tone', E'the "snap" in country guitar comes from a combination of technique and tone. heres how:\n\nTone:\n- tele bridge pickup (nothing else sounds quite right)\n- clean amp with a touch of compression\n- slight slapback delay (80-120ms, one repeat)\n\nTechnique:\n- hybrid picking (pick + fingers)\n- snap the string against the fretboard with your picking hand fingers\n- palm mute lightly for that "thunk"\n\nthe compression is key - it evens out the dynamics between the picked notes and the snapped notes so everything sits at the same volume level', 3, 167, now() - interval '12 days', now() - interval '4 days'),
    (t21, cat_platform, u_djent, 'Neural DSP plugins are the future and heres why', 'neural-dsp-plugins-future', E'just sold my pod go and went full plugins. archetype petrucci + archetype gojira cover like 90% of my tones. heres why i think plugins are the way:\n\n1. Cost: $100 each vs $1500+ for hardware\n2. Updates: they keep improving with free updates\n3. Recording: zero latency, perfect tone every time\n4. CPU usage: modern computers handle them easily\n5. Quality: seriously A/B them against real amps. theyre scary close\n\nthe only downside is gigging but honestly for bedroom/recording players (which is most of us) plugins are the move', 5, 278, now() - interval '20 days', now() - interval '2 days'),
    (t22, cat_gear, u_wah_wanda, 'The definitive wah pedal tier list (fight me)', 'definitive-wah-pedal-tier-list', E'S tier: Cry Baby 535Q (most versatile), RMC Real McCoy (best for blues)\nA tier: Vox V847 (classic), Dunlop Custom Badass (modern)\nB tier: Original Cry Baby GCB95 (decent), Morley Bad Horsie (switchless is cool)\nC tier: most multi-fx wah models (they try but...)\n\nthe 535Q is S tier because the adjustable Q and frequency range makes it work for literally any genre. hendrix wah to metallica wah with one pedal\n\nroast me', 4, 198, now() - interval '16 days', now() - interval '3 days'),
    (t23, cat_tone, u_reverb_jnk, 'Ambient guitar 101: how to create huge atmospheric tones', 'ambient-guitar-101-atmospheric', E'been doing ambient/shoegaze guitar for 5 years. heres my approach:\n\n1. Start with a clean or very lightly driven tone\n2. Volume swells (use a volume pedal or your guitars knob)\n3. LOTS of reverb - shimmer reverb is your friend\n4. Long delay with high feedback (dotted 8th or quarter note)\n5. Modulation: chorus or vibrato adds movement\n6. OPTIONAL: pitch shifting (octave up or shimmer) for ethereal sounds\n\nthe signal chain order matters: volume → drive → modulation → delay → reverb\n\nstart simple and layer. ambient guitar is about SPACE, not notes. less is more.', 4, 234, now() - interval '14 days', now() - interval '2 days'),
    (t24, cat_show, u_humbucker, 'NBD: Gibson Les Paul Custom in ebony. im in love', 'nbd-gibson-les-paul-custom-ebony', E'after 10 years of playing an epiphone LP i finally pulled the trigger on a real gibson LP custom. ebony finish, gold hardware, 498T/490R pickups.\n\nthe difference is... real. the sustain, the resonance, the way it responds to pick dynamics. plugged it into my mesa boogie mark V and nearly cried. thick creamy lead tones for days.\n\nyes it cost more than my first car. no i dont regret it.', 4, 256, now() - interval '10 days', now() - interval '2 days'),
    (t25, cat_general, u_dad_rock, 'Whats the one song that made you want to play guitar?', 'song-made-you-want-play-guitar', E'for me it was Hotel California by the Eagles. that dual harmony solo at the end... i heard it on the radio when i was 12 and told my parents i needed a guitar immediately. 30 years later im still chasing that tone lol\n\nwhats yours?', 8, 567, now() - interval '8 days', now() - interval '1 day');

  -- Replies for threads 6-25 (abbreviated for key threads)
  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    -- NGD Tele
    (t6, u_strat_dad, 'wide range humbuckers are so underrated. they really do have that tele twang even with humbuckers. great find!', now() - interval '47 days'),
    (t6, u_string_bob, 'the 72 deluxe is one of the best value guitars out there imo. congrats!', now() - interval '45 days'),
    (t6, u_humbucker, 'nice! ive been eyeing one of those. how does it handle overdrive?', now() - interval '43 days'),
    (t6, u_tele_life, 'a tele is a tele is a tele. welcome to the club 🎸', now() - interval '40 days'),
    -- RAT thread
    (t7, u_doom, 'the RAT is THE doom pedal. turbo rat into a cranked orange = magic. anyone paying $300 for a klon clone is getting fleeced', now() - interval '58 days'),
    (t7, u_tube_stan, 'RATs are great but theyre not a klon replacement at all lol. completely different circuit, different use case. its like saying a screwdriver replaces a hammer because theyre both tools', now() - interval '55 days'),
    (t7, u_gain_guru, 'RAT into a clean fender amp is one of the best sounds in rock. jeff beck used one, thom yorke used one, dave grohl used one. its legendary for a reason', now() - interval '50 days'),
    (t7, u_pedalboard, 'i have a RAT AND a klon on my board. they serve different purposes. rat for gritty aggressive dirt, klon for transparent boost. both are essential imo', now() - interval '40 days'),
    (t7, u_bedroom, 'just ordered a RAT because of this thread lol. arriving friday. excited!', now() - interval '20 days'),
    (t7, u_fuzz_lord, 'the RAT is basically a fuzz if you crank the distortion. versatile little box. and yeah $60 used is a steal', now() - interval '15 days'),
    -- QC vs Helix vs Kemper
    (t8, u_kemper, E'kemper hands down for metal. the profiling is so accurate that i profiled my friends 5150 and couldnt tell the difference in a blind test. plus the built in noise gate is great for high gain\n\nthe helix has more effects and routing options tho if thats important to you', now() - interval '44 days'),
    (t8, u_noise_nancy, 'QC for me. the captures are amazing and the touchscreen makes dialing in tones so fast. plus its the most portable of the three. i gig with mine every weekend', now() - interval '42 days'),
    (t8, u_cab_skeptic, E'unpopular opinion: save your money and buy a used 5150 combo. $600 on reverb and you have THE metal amp. no modeling required\n\nbut if you must go digital, helix has the best high gain amp models imo. the revv purple model is insane', now() - interval '38 days'),
    (t8, u_gain_guru, E'For metal specifically:\n- QC: best at capturing real amps\n- Helix: most flexible routing and best effects\n- Kemper: most profiles available (thousands of free ones)\n\nYou cant go wrong with any of them honestly. The differences are small. Pick the one with the workflow you like best', now() - interval '35 days'),
    (t8, u_pick_scraper, 'QC. the dual amp captures blended together is how i get my tone. blend a 5150 with a recto and its DISGUSTING (in the best way)', now() - interval '28 days'),
    (t8, u_drop_d, 'went with the helix after reading this thread. the revv model is indeed insane. thanks everyone', now() - interval '10 days'),
    (t8, u_bedroom, 'me over here with my katana like 👀 one day...', now() - interval '5 days'),
    (t8, u_djent, 'or just get neural dsp plugins for $100 and call it a day lol. archetype gojira for metal is literally unbeatable', now() - interval '3 days'),
    -- Open tunings
    (t9, u_blues_lawyer, 'DADGAD changed everything for me. Jimmy Page uses it on Kashmir and once you start exploring it opens up a whole new world of voicings', now() - interval '55 days'),
    (t9, u_clean_carl, 'open G is amazing. keith richards built his entire career on 5 strings in open G. some of the simplest most iconic riffs ever written', now() - interval '48 days'),
    (t9, u_feedback, 'joni mitchell used like 50 different tunings throughout her career. absolute genius. open tunings are underexplored territory for most guitarists', now() - interval '35 days'),
    (t9, u_looper, 'just tried open D for the first time and wrote a whole song in 20 minutes. why did i wait so long to try this??', now() - interval '20 days'),
    -- Kemper tips
    (t10, u_strat_dad, 'the morphing tip is gold. set up a morph to boost mids and volume for solos and you have a two-channel amp with one profile', now() - interval '30 days'),
    (t10, u_blues_lawyer, 'Pure cabinet mode is a game changer. Should be on by default honestly. Removes that weird digital "hair" on the high end', now() - interval '22 days'),
    (t10, u_gain_guru, 'great tips. id add: use the "direct amp" profiles for reamping later. so much more flexible than merged profiles', now() - interval '12 days'),
    -- 65 Deluxe Reverb
    (t11, u_blues_lawyer, 'That is a treasure. Blackface Deluxe Reverbs are widely considered the greatest recording amps ever made. Take care of it', now() - interval '40 days'),
    (t11, u_analog, 'THIS is what im talking about. 60 year old amp still destroying anything digital. there is no substitute for the real thing', now() - interval '35 days'),
    (t11, u_tube_stan, 'original jensens from 65??? those are irreplaceable. please tell me you have it insured', now() - interval '28 days'),
    (t11, u_kemper, 'id love to profile this if you ever want to share a kemper profile of it. a 65 DR is on my bucket list of profiles', now() - interval '15 days'),
    (t11, u_bedroom, 'one day ill own something like this. one day...', now() - interval '5 days'),
    -- No pedals opinion
    (t12, u_pedalboard, 'respectfully, this is insane. pedals are tools for creativity not distractions. hendrix used a fuzz face and a wah. gilmour has a massive board. theyre not "less serious" musicians because they use pedals', now() - interval '37 days'),
    (t12, u_fuzz_lord, 'imagine thinking fuzz pedals are a distraction. could not be me', now() - interval '35 days'),
    (t12, u_reverb_jnk, 'i mean for jazz specifically yeah you dont need pedals. but for ambient/shoegaze/post-rock pedals ARE the instrument. its not about the guitar at that point', now() - interval '30 days'),
    (t12, u_tele_life, 'i go back and forth on this. some nights its just tele → princeton and its perfect. other nights i want my tremolo and reverb. both are valid', now() - interval '25 days'),
    (t12, u_gain_guru, 'the best musicians use whatever tools help them make the music they hear in their head. if thats no pedals, great. if thats 20 pedals, also great. gatekeeping is lame', now() - interval '18 days'),
    (t12, u_jazz_jenny, 'lol i knew this would be controversial. to be clear im not saying pedals are BAD, just that theyre not NECESSARY. a lot of beginners think they need $2000 in pedals before they can sound good and thats just not true', now() - interval '10 days'),
    (t12, u_bedroom, 'as a beginner this is actually reassuring. i was feeling bad about not having pedals but my guitar teacher says the same thing - learn on a clean amp first', now() - interval '2 days'),
    -- Doom fuzz
    (t13, u_fuzz_lord, E'for doom you want:\n1. EQD Hoof Fuzz - big muff style but with more mids. PERFECT for doom\n2. Black Arts Toneworks Pharaoh - thick nasty and beautiful\n3. Abominable Electronics Hail Satan - literally designed for doom/stoner\n4. Wren and Cuff Tall Font Russian - the muff that doom was built on\n\nthe mids thing is key. regular big muffs scoop mids which gets lost in a band mix. the hoof and pharaoh keep those mids so your riffs cut through', now() - interval '38 days'),
    (t13, u_doom, 'the pharaoh is exactly what i was looking for. just ordered one. that mid control is gonna be a game changer. thanks!!', now() - interval '30 days'),
    (t13, u_analog, 'green russian big muff. its THE doom fuzz. electric wizard uses it. enough said', now() - interval '25 days'),
    (t13, u_pedalboard, 'dod carcosa is a sleeper pick. weird but glorious. and its cheap', now() - interval '18 days'),
    (t13, u_pick_scraper, 'HM-2 into a RAT. the swedish death metal chain. not exactly doom but heavy af', now() - interval '10 days'),
    -- Song that made you play
    (t25, u_strat_dad, 'under the bridge by RHCP. that intro changed my brain chemistry permanently', now() - interval '7 days'),
    (t25, u_bedroom, 'enter sandman. i know its basic but that riff is what made me ask for a guitar for christmas', now() - interval '6 days'),
    (t25, u_fuzz_lord, 'purple haze. heard it at 10 years old and nothing was ever the same', now() - interval '5 days'),
    (t25, u_jazz_jenny, 'pat metheny - last train home. not the typical answer but that tone and those melodies made me want to play jazz', now() - interval '4 days'),
    (t25, u_blues_lawyer, 'Texas Flood by SRV. Heard it in college and immediately bought a Strat', now() - interval '3 days'),
    (t25, u_doom, 'black sabbath - iron man. the riff that launched a thousand bands', now() - interval '2 days'),
    (t25, u_clean_carl, 'sultans of swing. mark knopfler fingerpicking that strat with THAT tone. transcendent', now() - interval '2 days'),
    (t25, u_looper, 'big love by fleetwood mac - lindsey buckingham live. one person making all those sounds with one guitar. blew my mind and got me into looping', now() - interval '1 day');

  -- Remaining thread replies
  INSERT INTO forum_replies (thread_id, user_id, body, created_at) VALUES
    (t14, u_strat_dad, 'the compressor tip is huge. i use a keeley comp plus on the lightest setting and it makes my clean tone so much more professional sounding', now() - interval '28 days'),
    (t14, u_reverb_jnk, 'a touch of plate reverb on a clean tone is *chefs kiss*. not spring, plate. its smoother and more ambient', now() - interval '20 days'),
    (t14, u_tele_life, 'neck pickup, tone at 7, volume at 8. thats my clean tone recipe. simple but beautiful', now() - interval '8 days'),
    (t15, u_kemper, 'counterpoint: at FOH (front of house) the audience literally cannot tell the difference between IRs and a mic''d cab. its only the player on stage who notices', now() - interval '25 days'),
    (t15, u_analog, 'THANK YOU. finally someone says it. FRFR is fine for monitoring but its not the same as standing in front of a 4x12. the chest thump is real and IRs cant replicate it', now() - interval '20 days'),
    (t15, u_gain_guru, 'the "feel" difference is real but diminishing with every generation of technology. give it 5 more years and the gap will be negligible', now() - interval '15 days'),
    (t15, u_djent, 'i play through studio monitors with neural dsp and it sounds amazing. maybe your FRFR speaker just sucks?', now() - interval '8 days'),
    (t15, u_cab_skeptic, 'lol at "your FRFR sucks". ive tried headrush, friedman ASM, yamaha DXR. they all sound like a PA speaker because THEY ARE a PA speaker. a guitar cab has a specific frequency response that FRFR deliberately does not have', now() - interval '3 days'),
    (t16, u_reverb_jnk, 'boss CE-2w is the GOAT chorus pedal. the CE-1 mode is pure magic. warm, lush, and subtle enough to leave on all the time', now() - interval '20 days'),
    (t16, u_clean_carl, 'the julia by walrus audio is incredible. that lag knob adds a subtle vibrato that makes clean tones sound so alive', now() - interval '15 days'),
    (t16, u_strat_dad, 'strat + chorus = the 80s in a bottle. mark knopfler telegraph road intro. enough said', now() - interval '10 days'),
    (t16, u_looper, 'chorus on a looped rhythm layer adds so much depth. essential for one-person-band setups', now() - interval '5 days'),
    (t17, u_noise_nancy, E'for tight chugs you need:\n1. less gain than you think\n2. a tubescreamer in front (gain low, level high) to tighten the low end\n3. NOISE GATE. ISP decimator or the helix/QC built-in one\n4. higher string gauge - try 11-52 for drop D\n5. fresh strings. dead strings = muddy chugs\n\ntry that and report back', now() - interval '20 days'),
    (t17, u_djent, 'the TS into a high gain amp trick is the #1 metal guitar secret. it cuts the bass flub before it hits the gain stage. instant tightness', now() - interval '18 days'),
    (t17, u_gain_guru, 'also check your pickup height. if theyre too close to the strings the signal is too hot and things get muddy. back them off slightly', now() - interval '14 days'),
    (t17, u_pick_scraper, 'EQ pedal in the loop. cut everything below 80hz and boost 800hz-2khz slightly. your chugs will have way more definition', now() - interval '8 days'),
    (t17, u_drop_d, 'UPDATE: the TS trick worked!! my chugs are so much tighter now. also raised string gauge to 11s and that helped a ton. thanks everyone 🙏', now() - interval '4 days'),
    (t18, u_reverb_jnk, 'this is so cool! the RC-505 is amazing for live performance. do you run any effects on the guitar before the looper?', now() - interval '15 days'),
    (t18, u_clean_carl, 'live looping is such a creative way to perform. you should check out ed sheeran''s early stuff - similar concept but with way less gear', now() - interval '10 days'),
    (t18, u_bedroom, 'this makes me want to try looping! gonna start with a simple ditto looper and see where it goes', now() - interval '6 days'),
    (t19, u_djent, 'the decimator II is elite. i run it in the X pattern (one in front, one in the loop) and its dead silent between riffs. essential for 8 string djent', now() - interval '12 days'),
    (t19, u_gain_guru, 'gate placement is everything. so many people put it in the wrong spot and then complain it doesnt work or kills their tone', now() - interval '8 days'),
    (t19, u_humbucker, 'the boss NS-2 is also solid and way cheaper than the decimator. works great with the X pattern too', now() - interval '5 days'),
    (t19, u_pick_scraper, 'playing metal without a noise gate is like driving without headlights. technically possible but why would you', now() - interval '3 days'),
    (t20, u_tele_life, 'tele bridge pickup is the only correct answer for country. everything else is a compromise. great tips on the slapback delay too', now() - interval '10 days'),
    (t20, u_blues_lawyer, 'the compression tip is crucial. most country players use a compressor set pretty aggressively compared to other genres. its what gives that consistent percussive sound', now() - interval '7 days'),
    (t20, u_dad_rock, 'tried this with my strat and its surprisingly close. not quite as snappy as a tele but adding the slapback delay really sells the vibe', now() - interval '4 days'),
    (t21, u_kemper, 'plugins are great for recording but gigging? i need hardware i can stomp on. the kemper or QC give you plugin quality with real footswitches', now() - interval '18 days'),
    (t21, u_analog, 'plugins are the fast food of guitar. convenient, cheap, and soulless', now() - interval '15 days'),
    (t21, u_bedroom, 'neural dsp is literally how i learned to play metal. couldnt afford an amp so i just used headphones + plugins. they sound incredible', now() - interval '10 days'),
    (t21, u_gain_guru, 'the latency argument against plugins is basically gone with modern interfaces. sub-3ms is undetectable. the quality argument has been gone for years. plugins are legit', now() - interval '5 days'),
    (t21, u_noise_nancy, 'i use the QC for gigging and neural dsp for recording at home. best of both worlds', now() - interval '2 days'),
    (t22, u_fuzz_lord, 'no cry baby original in S tier? its THE wah pedal. hendrix used it. slash uses it. its iconic', now() - interval '14 days'),
    (t22, u_feedback, 'the morley switchless is underrated. no clicking, no noise. just expression', now() - interval '10 days'),
    (t22, u_humbucker, 'the 535Q is a great pick for S tier. the adjustable Q is a game changer. narrow Q for metal, wide Q for blues', now() - interval '6 days'),
    (t22, u_wah_wanda, 'lol at all the cry baby purists. the 535Q literally IS a cry baby but better in every way. adjustable everything', now() - interval '3 days'),
    (t23, u_chorus_chad, 'shimmer reverb is basically a cheat code for ambient guitar. instant ethereal vibes', now() - interval '12 days'),
    (t23, u_looper, 'this is basically my entire approach to live looping. volume swells + delay + reverb = endless atmospheres', now() - interval '8 days'),
    (t23, u_clean_carl, 'the "less is more" tip is so important. ambient guitar isnt about playing a million notes. its about creating space and letting sounds breathe', now() - interval '5 days'),
    (t23, u_strat_dad, 'tried this approach last night with my strymon flint and a carbon copy delay. spent 2 hours just making sounds. my wife thought i was losing it but it was so meditative lol', now() - interval '2 days'),
    (t24, u_tube_stan, 'LP customs are heirloom guitars. congrats on the upgrade! the 498T is a great pickup for rock', now() - interval '8 days'),
    (t24, u_analog, 'gibson les paul into a mesa boogie. there is no more iconic rock combination. enjoy that beast', now() - interval '5 days'),
    (t24, u_pick_scraper, 'ebony LP custom is the most metal looking guitar ever made. sick NGD!', now() - interval '3 days'),
    (t24, u_bedroom, 'one day... *adds to wishlist*', now() - interval '2 days');

  -- ==========================================================================
  -- FOLLOWS (50 relationships)
  -- ==========================================================================

  INSERT INTO follows (follower_id, following_id, created_at) VALUES
    (u_bedroom, u_gain_guru, now() - interval '28 days'),
    (u_bedroom, u_strat_dad, now() - interval '25 days'),
    (u_bedroom, u_fuzz_lord, now() - interval '20 days'),
    (u_bedroom, u_blues_lawyer, now() - interval '18 days'),
    (u_strat_dad, u_blues_lawyer, now() - interval '70 days'),
    (u_strat_dad, u_gain_guru, now() - interval '65 days'),
    (u_strat_dad, u_clean_carl, now() - interval '50 days'),
    (u_fuzz_lord, u_doom, now() - interval '55 days'),
    (u_fuzz_lord, u_analog, now() - interval '50 days'),
    (u_blues_lawyer, u_gain_guru, now() - interval '80 days'),
    (u_blues_lawyer, u_vinyl_vince, now() - interval '60 days'),
    (u_blues_lawyer, u_strat_dad, now() - interval '55 days'),
    (u_tele_life, u_string_bob, now() - interval '45 days'),
    (u_tele_life, u_clean_carl, now() - interval '40 days'),
    (u_djent, u_noise_nancy, now() - interval '30 days'),
    (u_djent, u_pick_scraper, now() - interval '25 days'),
    (u_djent, u_kemper, now() - interval '20 days'),
    (u_pedalboard, u_reverb_jnk, now() - interval '50 days'),
    (u_pedalboard, u_analog, now() - interval '45 days'),
    (u_pedalboard, u_gain_guru, now() - interval '40 days'),
    (u_tube_stan, u_analog, now() - interval '70 days'),
    (u_tube_stan, u_blues_lawyer, now() - interval '60 days'),
    (u_kemper, u_gain_guru, now() - interval '40 days'),
    (u_kemper, u_noise_nancy, now() - interval '35 days'),
    (u_analog, u_vinyl_vince, now() - interval '90 days'),
    (u_analog, u_cab_skeptic, now() - interval '50 days'),
    (u_reverb_jnk, u_chorus_chad, now() - interval '35 days'),
    (u_reverb_jnk, u_looper, now() - interval '25 days'),
    (u_reverb_jnk, u_clean_carl, now() - interval '20 days'),
    (u_gain_guru, u_blues_lawyer, now() - interval '70 days'),
    (u_gain_guru, u_vinyl_vince, now() - interval '55 days'),
    (u_clean_carl, u_jazz_jenny, now() - interval '50 days'),
    (u_clean_carl, u_reverb_jnk, now() - interval '40 days'),
    (u_drop_d, u_djent, now() - interval '20 days'),
    (u_drop_d, u_pick_scraper, now() - interval '18 days'),
    (u_drop_d, u_noise_nancy, now() - interval '15 days'),
    (u_doom, u_fuzz_lord, now() - interval '40 days'),
    (u_doom, u_analog, now() - interval '35 days'),
    (u_chorus_chad, u_reverb_jnk, now() - interval '30 days'),
    (u_chorus_chad, u_clean_carl, now() - interval '25 days'),
    (u_wah_wanda, u_feedback, now() - interval '35 days'),
    (u_wah_wanda, u_fuzz_lord, now() - interval '30 days'),
    (u_humbucker, u_pick_scraper, now() - interval '25 days'),
    (u_humbucker, u_doom, now() - interval '20 days'),
    (u_looper, u_reverb_jnk, now() - interval '20 days'),
    (u_looper, u_clean_carl, now() - interval '15 days'),
    (u_slide_sam, u_blues_lawyer, now() - interval '40 days'),
    (u_slide_sam, u_string_bob, now() - interval '35 days'),
    (u_noise_nancy, u_djent, now() - interval '20 days'),
    (u_vinyl_vince, u_analog, now() - interval '60 days')
  ON CONFLICT DO NOTHING;

  -- Update follower/following counts
  UPDATE profiles p SET
    follower_count = (SELECT count(*) FROM follows WHERE following_id = p.id),
    following_count = (SELECT count(*) FROM follows WHERE follower_id = p.id);

END;
$$;
