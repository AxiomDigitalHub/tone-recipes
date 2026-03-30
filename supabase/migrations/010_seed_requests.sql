-- Migration 010: Seed Tone Requests
-- Realistic tone request queue with popular songs guitar players actually want

DO $$
DECLARE
  -- Reuse user UUIDs (these are independent seeds, so we generate fresh ones)
  u_strat_dad uuid := gen_random_uuid();
  u_fuzz_lord uuid := gen_random_uuid();
  u_blues_lawyer uuid := gen_random_uuid();
  u_tele_life uuid := gen_random_uuid();
  u_djent uuid := gen_random_uuid();
  u_pedalboard uuid := gen_random_uuid();
  u_tube_stan uuid := gen_random_uuid();
  u_kemper uuid := gen_random_uuid();
  u_analog uuid := gen_random_uuid();
  u_bedroom uuid := gen_random_uuid();
  u_dad_rock uuid := gen_random_uuid();
  u_doom uuid := gen_random_uuid();
  u_drop_d uuid := gen_random_uuid();
  u_humbucker uuid := gen_random_uuid();
  u_slide_sam uuid := gen_random_uuid();

  -- Request IDs
  r_eruption uuid := gen_random_uuid();
  r_black_dog uuid := gen_random_uuid();
  r_sultans uuid := gen_random_uuid();
  r_cliffs uuid := gen_random_uuid();
  r_little_wing uuid := gen_random_uuid();
  r_paranoid uuid := gen_random_uuid();
  r_no_more_tears uuid := gen_random_uuid();
  r_crazy_train uuid := gen_random_uuid();
  r_purple_rain uuid := gen_random_uuid();
  r_layla uuid := gen_random_uuid();
  r_texas_flood uuid := gen_random_uuid();
  r_bad_guy uuid := gen_random_uuid();
  r_neon uuid := gen_random_uuid();
  r_snow uuid := gen_random_uuid();
  r_cemetery uuid := gen_random_uuid();

BEGIN

  -- ===========================================================================
  -- Create auth.users entries for our seed users
  -- ===========================================================================

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES
    (u_strat_dad,     'strat.dad@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_fuzz_lord,     'fuzz.lord@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_blues_lawyer,  'blues.lawyer@example.com',  crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_tele_life,     'tele.life@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_djent,         'djent.master@example.com',  crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_pedalboard,    'pedalboard@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_tube_stan,     'tube.stan@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_kemper,        'kemper.kid@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_analog,        'analog.only@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_bedroom,       'bedroom.shred@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_dad_rock,      'dad.rock@example.com',      crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_doom,          'doom.riffs@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_drop_d,        'drop.d@example.com',        crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_humbucker,     'humbucker.guy@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated'),
    (u_slide_sam,     'slide.sam@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;

  -- ===========================================================================
  -- Create profiles for our seed users
  -- ===========================================================================

  INSERT INTO profiles (id, username, display_name, bio) VALUES
    (u_strat_dad,     'strat_dad',      'Strat Dad',        'Weekend warrior, weeknight noodler'),
    (u_fuzz_lord,     'fuzz_lord',      'Fuzz Lord',        'If it doesnt have fuzz its not music'),
    (u_blues_lawyer,  'blues_lawyer',   'Blues Lawyer',     'Plays a PRS at open mic night'),
    (u_tele_life,     'tele_life',      'Tele Life',        'Butterscotch blonde or bust'),
    (u_djent,         'djent_master',   'Djent Master',     '8 strings minimum'),
    (u_pedalboard,    'pedalboard_max', 'Pedalboard Max',   'More pedals than songs'),
    (u_tube_stan,     'tube_stan',      'Tube Stan',        'Solid state is a war crime'),
    (u_kemper,        'kemper_kid',     'Kemper Kid',       'Profiling everything'),
    (u_analog,        'analog_only',    'Analog Only',      'No ones and zeros in my signal chain'),
    (u_bedroom,       'bedroom_shred',  'Bedroom Shredder', 'Shredding at whisper volume since 2019'),
    (u_dad_rock,      'dad_rock_dave',  'Dad Rock Dave',    'Classic rock is the only real rock'),
    (u_doom,          'doom_riffs',     'Doom Riffs',       'Tuned to drop B, minimum'),
    (u_drop_d,        'drop_d_dan',     'Drop D Dan',       'One tuning to rule them all'),
    (u_humbucker,     'humbucker_guy',  'Humbucker Guy',    'Single coils are for country'),
    (u_slide_sam,     'slide_sam',      'Slide Sam',        'Open G all day')
  ON CONFLICT (id) DO NOTHING;

  -- ===========================================================================
  -- Tone Requests
  -- ===========================================================================

  INSERT INTO tone_requests (id, song_name, artist_name, part, description, reference_url, requested_by, status, upvotes, created_at, updated_at) VALUES

    -- Eruption - the holy grail request, tons of upvotes
    (r_eruption,
     'Eruption', 'Eddie Van Halen', 'lead guitar',
     'The brown sound. That mid-heavy, slightly scooped Marshall crunch that Eddie got on the VH1 album. Not the live version — I want the studio tone with the Variac''d Plexi and the MXR flanger. This is THE guitar tone.',
     'https://www.youtube.com/watch?v=M4Czx8EWXb0',
     u_dad_rock, 'in_progress', 34,
     now() - interval '18 days', now() - interval '2 days'),

    -- Black Dog
    (r_black_dog,
     'Black Dog', 'Led Zeppelin', 'rhythm guitar',
     'That huge, overdriven Les Paul into a cranked Superlead tone. Specifically the main riff — it sounds like Jimmy layered multiple takes with slightly different settings. Would love to get close to that wall of sound.',
     'https://www.youtube.com/watch?v=yBuub4Xe1mw',
     u_tube_stan, 'pending', 18,
     now() - interval '14 days', now() - interval '14 days'),

    -- Sultans of Swing
    (r_sultans,
     'Sultans of Swing', 'Dire Straits', 'lead guitar',
     'Mark Knopfler''s clean-to-slightly-breaking-up Strat tone on the outro solo. Fingerpicked, neck pickup, into what sounds like a Vibrolux. That glassy, articulate clean with just a hint of grit when he digs in.',
     'https://www.youtube.com/watch?v=8Pa9x9fZBtY',
     u_strat_dad, 'pending', 22,
     now() - interval '12 days', now() - interval '12 days'),

    -- Cliffs of Dover
    (r_cliffs,
     'Cliffs of Dover', 'Eric Johnson', 'lead guitar',
     'Eric Johnson''s violin-like sustain tone. Strat through a cranked Marshall and a Fender Twin running simultaneously. The secret is supposedly in the cable routing and the specific way he sets his delays. Just get me in the ballpark please.',
     'https://www.youtube.com/watch?v=55nAwmVLQSk',
     u_bedroom, 'pending', 25,
     now() - interval '11 days', now() - interval '11 days'),

    -- Little Wing
    (r_little_wing,
     'Little Wing', 'Jimi Hendrix', 'lead guitar',
     'The intro chord melody tone — Strat into a slightly overdriven Marshall with a Uni-Vibe. Warm, swirly, and full. Not the SRV version (though that would also be cool). The original studio recording tone.',
     'https://www.youtube.com/watch?v=BhMiRwGknGc',
     u_fuzz_lord, 'pending', 19,
     now() - interval '10 days', now() - interval '10 days'),

    -- Paranoid Android
    (r_paranoid,
     'Paranoid Android', 'Radiohead', 'lead guitar',
     'The heavy distorted section around 2:00. Jonny Greenwood''s aggressive, almost broken-sounding distortion. I think it''s a Tele into a Fender Shredmaster pedal but I can''t quite get it right. Needs to sound angry and chaotic.',
     'https://www.youtube.com/watch?v=fHiGbolFFGw',
     u_djent, 'pending', 11,
     now() - interval '9 days', now() - interval '9 days'),

    -- No More Tears
    (r_no_more_tears,
     'No More Tears', 'Ozzy Osbourne', 'lead guitar',
     'Zakk Wylde''s tone on the solo. Les Paul with EMGs into a Marshall JCM800 — that tight, aggressive mid-focused crunch with tons of sustain. The pinch harmonics need to absolutely scream.',
     NULL,
     u_humbucker, 'pending', 14,
     now() - interval '8 days', now() - interval '8 days'),

    -- Crazy Train
    (r_crazy_train,
     'Crazy Train', 'Ozzy Osbourne', 'lead guitar',
     'Randy Rhoads intro tone specifically. That dry, mid-heavy distortion with the chorus effect. Marshall Distortion+ into a modded Plexi. Not too much gain — the note definition is critical for those fast runs.',
     'https://www.youtube.com/watch?v=RMR5zf1J1Hs',
     u_dad_rock, 'in_progress', 27,
     now() - interval '16 days', now() - interval '3 days'),

    -- Purple Rain
    (r_purple_rain,
     'Purple Rain', 'Prince', 'lead guitar',
     'The legendary live solo tone from the movie performance. That singing, sustaining lead with the Hohner Telecaster copy through what I assume is a Mesa Boogie. Needs to be expressive and vocal-like. The tone that makes grown men cry.',
     'https://www.youtube.com/watch?v=TvnYmWpD_T8',
     u_blues_lawyer, 'pending', 16,
     now() - interval '7 days', now() - interval '7 days'),

    -- Layla (slide section)
    (r_layla,
     'Layla', 'Derek and the Dominos', 'lead guitar',
     'The piano coda/slide guitar section at the end. Duane Allman''s slide tone — Les Paul in open tuning through a cranked Fender. Thick, warm, singing sustain. This is the slide tone to end all slide tones.',
     'https://www.youtube.com/watch?v=0WUdlaLWSVM',
     u_slide_sam, 'pending', 13,
     now() - interval '6 days', now() - interval '6 days'),

    -- Texas Flood
    (r_texas_flood,
     'Texas Flood', 'Stevie Ray Vaughan', 'lead guitar',
     'SRV''s fat, aggressive Strat tone on the slow intro. Heavy strings, Tube Screamer into a Vibroverb, tuned down a half step. That massive low-end thump with the ice-pick highs. Nobody else sounds like this.',
     'https://www.youtube.com/watch?v=wVjdMLAMbM0',
     u_analog, 'pending', 20,
     now() - interval '5 days', now() - interval '5 days'),

    -- Bad Guy (bass)
    (r_bad_guy,
     'Bad Guy', 'Billie Eilish', 'bass',
     'The iconic bass riff. I know this was supposedly made on a keyboard but I want to recreate it on an actual bass guitar. Super sub-heavy, slightly distorted, with that specific attack. Need it for a cover band.',
     'https://www.youtube.com/watch?v=DyDfgMOUjCI',
     u_pedalboard, 'pending', 8,
     now() - interval '4 days', now() - interval '4 days'),

    -- Neon
    (r_neon,
     'Neon', 'John Mayer', 'lead guitar',
     'The thumb-slap acoustic-electric tone from the live Where The Light Is performance. I know it''s technique-dependent but the actual amp/pickup settings matter too. That percussive, snappy clean with the bass notes thumping.',
     'https://www.youtube.com/watch?v=_DfQC5qHhbo',
     u_tele_life, 'pending', 15,
     now() - interval '3 days', now() - interval '3 days'),

    -- Snow (Hey Oh)
    (r_snow,
     'Snow (Hey Oh)', 'Red Hot Chili Peppers', 'lead guitar',
     'John Frusciante''s clean picking tone. Strat into a Marshall Silver Jubilee with the gain backed way off. The compression and clarity on those fast arpeggiated figures is unreal. Bonus points if you can nail the subtle chorus effect.',
     'https://www.youtube.com/watch?v=yuFI5KSPAt4',
     u_kemper, 'pending', 12,
     now() - interval '2 days', now() - interval '2 days'),

    -- Cemetery Gates
    (r_cemetery,
     'Cemetery Gates', 'Pantera', 'lead guitar',
     'Dimebag''s clean tone in the intro AND the heavy rhythm tone in the verses. Two tones in one request — the clean is surprisingly warm and chorused for a metal guy, and the heavy tone is that scooped Randall solid state crunch. Both are iconic.',
     'https://www.youtube.com/watch?v=RVMvART9kb8',
     u_drop_d, 'pending', 17,
     now() - interval '1 day', now() - interval '1 day');

  -- ===========================================================================
  -- Tone Request Votes
  -- Each request starts with a self-vote from the requester, plus additional
  -- votes from other users to match the upvote counts above.
  -- ===========================================================================

  -- Eruption (34 votes): self + 14 others, each voting to build toward 34
  -- We'll insert enough distinct votes. The trigger will set the count.
  -- Note: we disable the trigger temporarily and set counts manually since
  -- we can't create 34 unique users. We'll use the 15 users we have and
  -- set the upvote counts directly (they were already set in the INSERT above).

  -- Self-votes (requester always votes for their own request)
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_eruption,       u_dad_rock),
    (r_black_dog,      u_tube_stan),
    (r_sultans,        u_strat_dad),
    (r_cliffs,         u_bedroom),
    (r_little_wing,    u_fuzz_lord),
    (r_paranoid,       u_djent),
    (r_no_more_tears,  u_humbucker),
    (r_crazy_train,    u_dad_rock),
    (r_purple_rain,    u_blues_lawyer),
    (r_layla,          u_slide_sam),
    (r_texas_flood,    u_analog),
    (r_bad_guy,        u_pedalboard),
    (r_neon,           u_tele_life),
    (r_snow,           u_kemper),
    (r_cemetery,       u_drop_d);

  -- Cross-votes: popular requests get votes from many users
  -- Eruption - everyone votes for this
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_eruption, u_strat_dad),
    (r_eruption, u_fuzz_lord),
    (r_eruption, u_blues_lawyer),
    (r_eruption, u_tele_life),
    (r_eruption, u_djent),
    (r_eruption, u_pedalboard),
    (r_eruption, u_tube_stan),
    (r_eruption, u_kemper),
    (r_eruption, u_analog),
    (r_eruption, u_bedroom),
    (r_eruption, u_doom),
    (r_eruption, u_drop_d),
    (r_eruption, u_humbucker),
    (r_eruption, u_slide_sam);

  -- Crazy Train - very popular
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_crazy_train, u_strat_dad),
    (r_crazy_train, u_fuzz_lord),
    (r_crazy_train, u_blues_lawyer),
    (r_crazy_train, u_tele_life),
    (r_crazy_train, u_djent),
    (r_crazy_train, u_tube_stan),
    (r_crazy_train, u_kemper),
    (r_crazy_train, u_analog),
    (r_crazy_train, u_bedroom),
    (r_crazy_train, u_doom),
    (r_crazy_train, u_humbucker),
    (r_crazy_train, u_slide_sam);

  -- Cliffs of Dover - very popular
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_cliffs, u_strat_dad),
    (r_cliffs, u_fuzz_lord),
    (r_cliffs, u_blues_lawyer),
    (r_cliffs, u_tele_life),
    (r_cliffs, u_tube_stan),
    (r_cliffs, u_kemper),
    (r_cliffs, u_analog),
    (r_cliffs, u_dad_rock),
    (r_cliffs, u_doom),
    (r_cliffs, u_humbucker),
    (r_cliffs, u_slide_sam);

  -- Sultans of Swing - popular
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_sultans, u_fuzz_lord),
    (r_sultans, u_blues_lawyer),
    (r_sultans, u_tele_life),
    (r_sultans, u_tube_stan),
    (r_sultans, u_analog),
    (r_sultans, u_dad_rock),
    (r_sultans, u_kemper),
    (r_sultans, u_slide_sam),
    (r_sultans, u_bedroom);

  -- Texas Flood - popular
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_texas_flood, u_strat_dad),
    (r_texas_flood, u_fuzz_lord),
    (r_texas_flood, u_blues_lawyer),
    (r_texas_flood, u_tele_life),
    (r_texas_flood, u_tube_stan),
    (r_texas_flood, u_dad_rock),
    (r_texas_flood, u_slide_sam),
    (r_texas_flood, u_bedroom);

  -- Little Wing
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_little_wing, u_strat_dad),
    (r_little_wing, u_blues_lawyer),
    (r_little_wing, u_tele_life),
    (r_little_wing, u_analog),
    (r_little_wing, u_dad_rock),
    (r_little_wing, u_slide_sam),
    (r_little_wing, u_tube_stan);

  -- Black Dog
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_black_dog, u_strat_dad),
    (r_black_dog, u_fuzz_lord),
    (r_black_dog, u_dad_rock),
    (r_black_dog, u_analog),
    (r_black_dog, u_doom),
    (r_black_dog, u_humbucker),
    (r_black_dog, u_drop_d);

  -- Cemetery Gates
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_cemetery, u_djent),
    (r_cemetery, u_doom),
    (r_cemetery, u_humbucker),
    (r_cemetery, u_fuzz_lord),
    (r_cemetery, u_dad_rock),
    (r_cemetery, u_tube_stan),
    (r_cemetery, u_bedroom);

  -- Purple Rain
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_purple_rain, u_strat_dad),
    (r_purple_rain, u_tele_life),
    (r_purple_rain, u_analog),
    (r_purple_rain, u_dad_rock),
    (r_purple_rain, u_slide_sam),
    (r_purple_rain, u_bedroom);

  -- Neon
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_neon, u_strat_dad),
    (r_neon, u_blues_lawyer),
    (r_neon, u_analog),
    (r_neon, u_bedroom),
    (r_neon, u_slide_sam);

  -- No More Tears
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_no_more_tears, u_djent),
    (r_no_more_tears, u_doom),
    (r_no_more_tears, u_drop_d),
    (r_no_more_tears, u_dad_rock),
    (r_no_more_tears, u_fuzz_lord);

  -- Layla
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_layla, u_strat_dad),
    (r_layla, u_blues_lawyer),
    (r_layla, u_analog),
    (r_layla, u_dad_rock),
    (r_layla, u_tele_life);

  -- Snow (Hey Oh)
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_snow, u_strat_dad),
    (r_snow, u_fuzz_lord),
    (r_snow, u_bedroom),
    (r_snow, u_pedalboard);

  -- Paranoid Android
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_paranoid, u_fuzz_lord),
    (r_paranoid, u_pedalboard),
    (r_paranoid, u_kemper),
    (r_paranoid, u_doom);

  -- Bad Guy
  INSERT INTO tone_request_votes (request_id, user_id) VALUES
    (r_bad_guy, u_bedroom),
    (r_bad_guy, u_djent),
    (r_bad_guy, u_kemper);

  -- Now reset the upvote counts to match the actual vote totals
  -- (The trigger will have been firing, but let's ensure consistency)
  UPDATE tone_requests SET upvotes = (SELECT COUNT(*) FROM tone_request_votes WHERE request_id = tone_requests.id);

END $$;
