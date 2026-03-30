-- Migration 011: Seed ratings and comments for recipes missing community data
-- Also re-seeds 6 recipes that had wrong slugs in 007

-- Add review column to recipe_ratings if it doesn't exist
ALTER TABLE recipe_ratings ADD COLUMN IF NOT EXISTS review text;

DO $$
DECLARE
  -- Look up existing users from 007 by email
  u_strat_dad uuid;
  u_fuzz_lord uuid;
  u_blues_lawyer uuid;
  u_tele_life uuid;
  u_djent uuid;
  u_pedalboard uuid;
  u_tube_stan uuid;
  u_kemper uuid;
  u_analog uuid;
  u_tonewood uuid;
  u_bedroom uuid;
  u_dad_rock uuid;
  u_jazz_jenny uuid;
  u_doom uuid;
  u_pick_scraper uuid;
  u_string_bob uuid;
  u_reverb_jnk uuid;
  u_gain_guru uuid;
  u_clean_carl uuid;
  u_feedback uuid;
  u_drop_d uuid;
  u_chorus_chad uuid;
  u_wah_wanda uuid;
  u_cab_skeptic uuid;
  u_humbucker uuid;
  u_trem_tim uuid;
  u_looper uuid;
  u_slide_sam uuid;
  u_noise_nancy uuid;
  u_vinyl_vince uuid;

  -- Comment IDs for threading
  c11 uuid := gen_random_uuid();
  c12 uuid := gen_random_uuid();
  c13 uuid := gen_random_uuid();
  c14 uuid := gen_random_uuid();
  c15 uuid := gen_random_uuid();
  c16 uuid := gen_random_uuid();
  c17 uuid := gen_random_uuid();
  c18 uuid := gen_random_uuid();
  c19 uuid := gen_random_uuid();
  c20 uuid := gen_random_uuid();
  c21 uuid := gen_random_uuid();
  c22 uuid := gen_random_uuid();
  c23 uuid := gen_random_uuid();
  c24 uuid := gen_random_uuid();
  c25 uuid := gen_random_uuid();
  c26 uuid := gen_random_uuid();
  c27 uuid := gen_random_uuid();
  c28 uuid := gen_random_uuid();
  c29 uuid := gen_random_uuid();
  c30 uuid := gen_random_uuid();

BEGIN

  -- ==========================================================================
  -- RESOLVE USER IDs FROM 007 SEED DATA
  -- ==========================================================================

  SELECT id INTO u_strat_dad FROM auth.users WHERE email = 'strat_dad_42@gmail.com';
  SELECT id INTO u_fuzz_lord FROM auth.users WHERE email = 'fuzz_lord@gmail.com';
  SELECT id INTO u_blues_lawyer FROM auth.users WHERE email = 'blues_lawyer_69@gmail.com';
  SELECT id INTO u_tele_life FROM auth.users WHERE email = 'tele_is_life@gmail.com';
  SELECT id INTO u_djent FROM auth.users WHERE email = 'djent_machine@gmail.com';
  SELECT id INTO u_pedalboard FROM auth.users WHERE email = 'pedalboard_addict@gmail.com';
  SELECT id INTO u_tube_stan FROM auth.users WHERE email = 'tube_screamer_stan@gmail.com';
  SELECT id INTO u_kemper FROM auth.users WHERE email = 'kemper_convert@gmail.com';
  SELECT id INTO u_analog FROM auth.users WHERE email = 'analog_or_die@gmail.com';
  SELECT id INTO u_tonewood FROM auth.users WHERE email = 'tonewood_believer@gmail.com';
  SELECT id INTO u_bedroom FROM auth.users WHERE email = 'bedroom_shredder@gmail.com';
  SELECT id INTO u_dad_rock FROM auth.users WHERE email = 'dad_rock_dave@gmail.com';
  SELECT id INTO u_jazz_jenny FROM auth.users WHERE email = 'jazz_hands_jenny@gmail.com';
  SELECT id INTO u_doom FROM auth.users WHERE email = 'doom_n_gloom@gmail.com';
  SELECT id INTO u_pick_scraper FROM auth.users WHERE email = 'pick_scraper@gmail.com';
  SELECT id INTO u_string_bob FROM auth.users WHERE email = 'string_bender_bob@gmail.com';
  SELECT id INTO u_reverb_jnk FROM auth.users WHERE email = 'reverb_junkie@gmail.com';
  SELECT id INTO u_gain_guru FROM auth.users WHERE email = 'gain_staging_guru@gmail.com';
  SELECT id INTO u_clean_carl FROM auth.users WHERE email = 'clean_tone_carl@gmail.com';
  SELECT id INTO u_feedback FROM auth.users WHERE email = 'feedback_fred@gmail.com';
  SELECT id INTO u_drop_d FROM auth.users WHERE email = 'drop_d_dan@gmail.com';
  SELECT id INTO u_chorus_chad FROM auth.users WHERE email = 'chorus_pedal_chad@gmail.com';
  SELECT id INTO u_wah_wanda FROM auth.users WHERE email = 'wah_wah_wanda@gmail.com';
  SELECT id INTO u_cab_skeptic FROM auth.users WHERE email = 'cab_sim_skeptic@gmail.com';
  SELECT id INTO u_humbucker FROM auth.users WHERE email = 'humbuckerHank@gmail.com';
  SELECT id INTO u_trem_tim FROM auth.users WHERE email = 'trem_picker_tim@gmail.com';
  SELECT id INTO u_looper FROM auth.users WHERE email = 'looper_lucy@gmail.com';
  SELECT id INTO u_slide_sam FROM auth.users WHERE email = 'slide_guitar_sam@gmail.com';
  SELECT id INTO u_noise_nancy FROM auth.users WHERE email = 'noise_gate_nancy@gmail.com';
  SELECT id INTO u_vinyl_vince FROM auth.users WHERE email = 'vinyl_vince@gmail.com';

  -- ==========================================================================
  -- RATINGS (with optional reviews)
  -- ~180 ratings across 44 recipes, mostly 4s and 5s, ~40% with reviews
  -- ==========================================================================

  INSERT INTO recipe_ratings (recipe_slug, user_id, rating, review, created_at) VALUES

    -- 1. evh-eruption-brown-sound
    ('evh-eruption-brown-sound', u_bedroom, 5, 'THIS IS IT. finally sounds like the record on my katana 🔥', now() - interval '82 days'),
    ('evh-eruption-brown-sound', u_humbucker, 5, NULL, now() - interval '74 days'),
    ('evh-eruption-brown-sound', u_dad_rock, 5, 'been chasing this tone since 1984. close enough for me', now() - interval '68 days'),
    ('evh-eruption-brown-sound', u_gain_guru, 4, 'gain staging is solid but the phase tone could be tweaked', now() - interval '55 days'),
    ('evh-eruption-brown-sound', u_tube_stan, 4, NULL, now() - interval '41 days'),

    -- 2. mayer-slow-dancing-burning-room
    ('mayer-slow-dancing-burning-room', u_clean_carl, 5, 'the dynamics on this one are perfect. touch sensitive af', now() - interval '79 days'),
    ('mayer-slow-dancing-burning-room', u_strat_dad, 5, NULL, now() - interval '71 days'),
    ('mayer-slow-dancing-burning-room', u_blues_lawyer, 4, 'pretty close. needs a bit more compression imo', now() - interval '63 days'),
    ('mayer-slow-dancing-burning-room', u_tele_life, 4, NULL, now() - interval '50 days'),

    -- 3. clapton-layla-lead
    ('clapton-layla-lead', u_blues_lawyer, 5, 'the woman tone is NAILED here. sg into a cranked marshall vibes', now() - interval '85 days'),
    ('clapton-layla-lead', u_strat_dad, 4, NULL, now() - interval '72 days'),
    ('clapton-layla-lead', u_vinyl_vince, 5, 'sounds like the duane and eric era. love it', now() - interval '60 days'),
    ('clapton-layla-lead', u_dad_rock, 5, NULL, now() - interval '48 days'),
    ('clapton-layla-lead', u_slide_sam, 4, 'solid for the lead parts. the slide section needs different settings tho', now() - interval '35 days'),

    -- 4. knopfler-sultans-of-swing-clean
    ('knopfler-sultans-of-swing-clean', u_clean_carl, 5, 'finally a recipe that gets the fingerpicked strat clean right. no pick = different EQ and this captures that', now() - interval '88 days'),
    ('knopfler-sultans-of-swing-clean', u_tele_life, 5, NULL, now() - interval '75 days'),
    ('knopfler-sultans-of-swing-clean', u_jazz_jenny, 5, 'the compression and slight breakup here is chef''s kiss', now() - interval '62 days'),
    ('knopfler-sultans-of-swing-clean', u_strat_dad, 4, NULL, now() - interval '49 days'),
    ('knopfler-sultans-of-swing-clean', u_dad_rock, 4, 'close but the mids need a slight bump on helix imo', now() - interval '38 days'),

    -- 5. jack-white-seven-nation-army
    ('jack-white-seven-nation-army', u_fuzz_lord, 5, 'the octave fuzz settings are PERFECT. this is exactly the gnarly sound', now() - interval '76 days'),
    ('jack-white-seven-nation-army', u_bedroom, 5, NULL, now() - interval '65 days'),
    ('jack-white-seven-nation-army', u_drop_d, 4, 'solid. had to tweak the fuzz a bit on my big muff but close', now() - interval '52 days'),
    ('jack-white-seven-nation-army', u_doom, 4, NULL, now() - interval '40 days'),

    -- 6. hetfield-master-of-puppets-rhythm
    ('hetfield-master-of-puppets-rhythm', u_pick_scraper, 5, 'the palm mute tone on this is BRUTAL in the best way', now() - interval '83 days'),
    ('hetfield-master-of-puppets-rhythm', u_djent, 5, NULL, now() - interval '70 days'),
    ('hetfield-master-of-puppets-rhythm', u_drop_d, 5, 'dude this is TIGHT. the mid scoop is just right', now() - interval '58 days'),
    ('hetfield-master-of-puppets-rhythm', u_noise_nancy, 4, 'great tone. the noise gate settings really help', now() - interval '45 days'),
    ('hetfield-master-of-puppets-rhythm', u_humbucker, 4, NULL, now() - interval '33 days'),
    ('hetfield-master-of-puppets-rhythm', u_doom, 4, NULL, now() - interval '22 days'),

    -- 7. angus-young-back-in-black-rhythm
    ('angus-young-back-in-black-rhythm', u_dad_rock, 5, NULL, now() - interval '80 days'),
    ('angus-young-back-in-black-rhythm', u_humbucker, 5, 'SG into a marshall. simple and perfect. this recipe gets it', now() - interval '67 days'),
    ('angus-young-back-in-black-rhythm', u_tube_stan, 5, NULL, now() - interval '55 days'),
    ('angus-young-back-in-black-rhythm', u_strat_dad, 4, 'tried it with humbuckers in my strat and its 90% there', now() - interval '42 days'),
    ('angus-young-back-in-black-rhythm', u_bedroom, 4, NULL, now() - interval '30 days'),

    -- 8. santana-smooth-lead
    ('santana-smooth-lead', u_blues_lawyer, 5, 'that singing sustain is SO hard to get right and this nails it', now() - interval '77 days'),
    ('santana-smooth-lead', u_clean_carl, 4, NULL, now() - interval '64 days'),
    ('santana-smooth-lead', u_strat_dad, 4, NULL, now() - interval '51 days'),
    ('santana-smooth-lead', u_humbucker, 5, 'PRS + mesa boogie = santana. the recipe captures that mark IV flavor', now() - interval '39 days'),

    -- 9. townshend-wont-get-fooled-again
    ('townshend-wont-get-fooled-again', u_dad_rock, 5, 'YEAAAAAH. the windmill chord tone is here lol', now() - interval '84 days'),
    ('townshend-wont-get-fooled-again', u_strat_dad, 4, NULL, now() - interval '70 days'),
    ('townshend-wont-get-fooled-again', u_analog, 4, 'not bad. townshend used hiwatts tho which have a very specific crunch', now() - interval '57 days'),
    ('townshend-wont-get-fooled-again', u_cab_skeptic, 3, 'sounds more like a marshall than a hiwatt to me tbh', now() - interval '44 days'),

    -- 10. garcia-truckin-clean-sparkle
    ('garcia-truckin-clean-sparkle', u_clean_carl, 5, 'the sparkle is REAL. twin reverb vibes all day', now() - interval '81 days'),
    ('garcia-truckin-clean-sparkle', u_reverb_jnk, 5, NULL, now() - interval '68 days'),
    ('garcia-truckin-clean-sparkle', u_tele_life, 4, 'great starting point for dead tone. needs some envelope filter for certain songs tho', now() - interval '55 days'),
    ('garcia-truckin-clean-sparkle', u_slide_sam, 4, NULL, now() - interval '42 days'),

    -- 11. lifeson-tom-sawyer-chorus
    ('lifeson-tom-sawyer-chorus', u_chorus_chad, 5, 'omg the chorus settings here are EXACTLY right. that shimmery thing lifeson does', now() - interval '78 days'),
    ('lifeson-tom-sawyer-chorus', u_pedalboard, 5, NULL, now() - interval '65 days'),
    ('lifeson-tom-sawyer-chorus', u_dad_rock, 4, 'really close. the chorus depth might need tweaking per amp', now() - interval '52 days'),
    ('lifeson-tom-sawyer-chorus', u_reverb_jnk, 4, NULL, now() - interval '39 days'),

    -- 12. brian-may-bohemian-rhapsody
    ('brian-may-bohemian-rhapsody', u_dad_rock, 5, 'the layered guitar tone is impossble to truly replicate but this gets the core sound right', now() - interval '86 days'),
    ('brian-may-bohemian-rhapsody', u_humbucker, 5, NULL, now() - interval '73 days'),
    ('brian-may-bohemian-rhapsody', u_gain_guru, 4, 'the treble booster into vox thing is spot on. good gain staging', now() - interval '60 days'),
    ('brian-may-bohemian-rhapsody', u_vinyl_vince, 5, NULL, now() - interval '47 days'),
    ('brian-may-bohemian-rhapsody', u_bedroom, 4, 'sounds epic even on my katana ngl', now() - interval '34 days'),

    -- 13. iommi-iron-man-doom-riff
    ('iommi-iron-man-doom-riff', u_doom, 5, 'DOOM. this is the sound. the sludgy mids are perfect', now() - interval '87 days'),
    ('iommi-iron-man-doom-riff', u_fuzz_lord, 5, NULL, now() - interval '74 days'),
    ('iommi-iron-man-doom-riff', u_drop_d, 4, 'heavy as hell. sounds like the first 4 sabbath records', now() - interval '61 days'),
    ('iommi-iron-man-doom-riff', u_pick_scraper, 4, NULL, now() - interval '48 days'),
    ('iommi-iron-man-doom-riff', u_humbucker, 5, NULL, now() - interval '35 days'),

    -- 14. rhoads-crazy-train-lead
    ('rhoads-crazy-train-lead', u_bedroom, 5, 'the harmonics and pinch squeal tone on this is insane', now() - interval '80 days'),
    ('rhoads-crazy-train-lead', u_humbucker, 5, NULL, now() - interval '67 days'),
    ('rhoads-crazy-train-lead', u_pick_scraper, 5, 'finally a recipe that gets that bright marshall crunch right', now() - interval '54 days'),
    ('rhoads-crazy-train-lead', u_djent, 4, NULL, now() - interval '41 days'),
    ('rhoads-crazy-train-lead', u_dad_rock, 4, NULL, now() - interval '28 days'),

    -- 15. srv-texas-flood-slow-blues-lead
    ('srv-texas-flood-slow-blues-lead', u_blues_lawyer, 5, 'the sag and dynamics on this are incredible. feels like a cranked super reverb', now() - interval '84 days'),
    ('srv-texas-flood-slow-blues-lead', u_strat_dad, 5, NULL, now() - interval '71 days'),
    ('srv-texas-flood-slow-blues-lead', u_tube_stan, 5, 'TS into a blackface... doesnt get better than this', now() - interval '58 days'),
    ('srv-texas-flood-slow-blues-lead', u_slide_sam, 4, NULL, now() - interval '45 days'),
    ('srv-texas-flood-slow-blues-lead', u_feedback, 4, 'need HEAVY strings to really make this work. 12s minimum', now() - interval '32 days'),

    -- 16. satriani-surfing-with-the-alien-lead
    ('satriani-surfing-with-the-alien-lead', u_bedroom, 5, 'the legato tone is so smooth with these settings', now() - interval '76 days'),
    ('satriani-surfing-with-the-alien-lead', u_kemper, 4, NULL, now() - interval '63 days'),
    ('satriani-surfing-with-the-alien-lead', u_gain_guru, 4, 'solid. the mid boost is key for satch tone and this gets it', now() - interval '50 days'),
    ('satriani-surfing-with-the-alien-lead', u_humbucker, 5, NULL, now() - interval '37 days'),

    -- 17. gallagher-wonderwall-jangly-rhythm
    ('gallagher-wonderwall-jangly-rhythm', u_strat_dad, 4, 'great for acoustic sim on electric. my wife recognized the song immediately lol', now() - interval '73 days'),
    ('gallagher-wonderwall-jangly-rhythm', u_bedroom, 5, NULL, now() - interval '60 days'),
    ('gallagher-wonderwall-jangly-rhythm', u_dad_rock, 4, NULL, now() - interval '47 days'),
    ('gallagher-wonderwall-jangly-rhythm', u_tele_life, 3, 'its ok but wonderwall is really meant for acoustic tbh', now() - interval '34 days'),

    -- 18. marr-how-soon-is-now-tremolo
    ('marr-how-soon-is-now-tremolo', u_chorus_chad, 5, 'the tremolo speed and depth are EXACTLY right. so hard to dial in normally', now() - interval '82 days'),
    ('marr-how-soon-is-now-tremolo', u_reverb_jnk, 5, NULL, now() - interval '69 days'),
    ('marr-how-soon-is-now-tremolo', u_trem_tim, 5, 'as a tremolo nerd this makes me very happy. nailed it', now() - interval '56 days'),
    ('marr-how-soon-is-now-tremolo', u_looper, 4, NULL, now() - interval '43 days'),

    -- 19. richards-start-me-up-open-g
    ('richards-start-me-up-open-g', u_dad_rock, 5, 'keef tone baby!! the open G voicings with this crunch = perfection', now() - interval '79 days'),
    ('richards-start-me-up-open-g', u_strat_dad, 4, NULL, now() - interval '66 days'),
    ('richards-start-me-up-open-g', u_tele_life, 5, 'tele into a tweed fender type sound. this is THE rhythm tone', now() - interval '53 days'),
    ('richards-start-me-up-open-g', u_vinyl_vince, 5, NULL, now() - interval '40 days'),
    ('richards-start-me-up-open-g', u_analog, 4, NULL, now() - interval '27 days'),

    -- 20. gibbons-la-grange-blues-crunch
    ('gibbons-la-grange-blues-crunch', u_blues_lawyer, 5, NULL, now() - interval '81 days'),
    ('gibbons-la-grange-blues-crunch', u_fuzz_lord, 5, 'that fuzzy crunch is so good. LP into a marshall plexi vibes', now() - interval '68 days'),
    ('gibbons-la-grange-blues-crunch', u_tube_stan, 4, NULL, now() - interval '55 days'),
    ('gibbons-la-grange-blues-crunch', u_strat_dad, 4, 'pretty close on humbuckers. single coils dont quite get there', now() - interval '42 days'),

    -- 21. dimebag-walk-groove-metal
    ('dimebag-walk-groove-metal', u_pick_scraper, 5, 'RE 🐍 SPECT 🐍 WALK. this tone is FILTHY in the best way', now() - interval '78 days'),
    ('dimebag-walk-groove-metal', u_djent, 5, NULL, now() - interval '65 days'),
    ('dimebag-walk-groove-metal', u_drop_d, 5, 'the scoop and that razor sharp attack. this is it', now() - interval '52 days'),
    ('dimebag-walk-groove-metal', u_doom, 4, NULL, now() - interval '39 days'),
    ('dimebag-walk-groove-metal', u_noise_nancy, 4, 'noise gate is critical for this. recipe gets it right', now() - interval '26 days'),
    ('dimebag-walk-groove-metal', u_humbucker, 5, NULL, now() - interval '15 days'),

    -- 22. page-whole-lotta-love-heavy-riff
    ('page-whole-lotta-love-heavy-riff', u_dad_rock, 5, 'THE riff tone. LP into a cranked superlead. goosebumps every time', now() - interval '85 days'),
    ('page-whole-lotta-love-heavy-riff', u_humbucker, 5, NULL, now() - interval '72 days'),
    ('page-whole-lotta-love-heavy-riff', u_tube_stan, 4, 'close. pagey had that slightly spongy feel tho which is hard to capture', now() - interval '59 days'),
    ('page-whole-lotta-love-heavy-riff', u_vinyl_vince, 5, NULL, now() - interval '46 days'),
    ('page-whole-lotta-love-heavy-riff', u_analog, 4, NULL, now() - interval '33 days'),

    -- 23. gilmour-time-solo-lead
    ('gilmour-time-solo-lead', u_reverb_jnk, 5, 'the rotary speaker sim on this is what makes it. so underrated for gilmour', now() - interval '83 days'),
    ('gilmour-time-solo-lead', u_dad_rock, 5, NULL, now() - interval '70 days'),
    ('gilmour-time-solo-lead', u_strat_dad, 4, NULL, now() - interval '57 days'),
    ('gilmour-time-solo-lead', u_clean_carl, 5, 'the transition from clean to lead is so well mapped out here', now() - interval '44 days'),
    ('gilmour-time-solo-lead', u_pedalboard, 4, NULL, now() - interval '31 days'),

    -- 24. slash-welcome-to-jungle-aggressive-riff
    ('slash-welcome-to-jungle-aggressive-riff', u_humbucker, 5, 'more aggressive than sweet child and thats exactly right. appetite was raw', now() - interval '80 days'),
    ('slash-welcome-to-jungle-aggressive-riff', u_bedroom, 5, NULL, now() - interval '67 days'),
    ('slash-welcome-to-jungle-aggressive-riff', u_pick_scraper, 5, NULL, now() - interval '54 days'),
    ('slash-welcome-to-jungle-aggressive-riff', u_dad_rock, 4, 'sounds great. the wah intro tone is spot on', now() - interval '41 days'),

    -- 25. evh-panama-brown-sound
    ('evh-panama-brown-sound', u_humbucker, 5, NULL, now() - interval '78 days'),
    ('evh-panama-brown-sound', u_dad_rock, 5, 'slightly different flavor from eruption and this captures that. more compressed', now() - interval '65 days'),
    ('evh-panama-brown-sound', u_bedroom, 4, NULL, now() - interval '52 days'),
    ('evh-panama-brown-sound', u_gain_guru, 4, 'the variac sag thing is so hard to model but this is close', now() - interval '39 days'),
    ('evh-panama-brown-sound', u_tube_stan, 5, NULL, now() - interval '26 days'),

    -- 26. greenwood-creep-clean-to-crunch
    ('greenwood-creep-clean-to-crunch', u_reverb_jnk, 5, 'the clean to crunch transition is SO satisfying', now() - interval '75 days'),
    ('greenwood-creep-clean-to-crunch', u_bedroom, 5, NULL, now() - interval '62 days'),
    ('greenwood-creep-clean-to-crunch', u_fuzz_lord, 4, NULL, now() - interval '49 days'),
    ('greenwood-creep-clean-to-crunch', u_looper, 4, 'tried this live and the dynamics work really well', now() - interval '36 days'),

    -- 27. turner-do-i-wanna-know-fuzzy-riff
    ('turner-do-i-wanna-know-fuzzy-riff', u_fuzz_lord, 5, 'that low rumbling fuzz riff. SO good with these settings', now() - interval '74 days'),
    ('turner-do-i-wanna-know-fuzzy-riff', u_bedroom, 5, NULL, now() - interval '61 days'),
    ('turner-do-i-wanna-know-fuzzy-riff', u_drop_d, 4, NULL, now() - interval '48 days'),
    ('turner-do-i-wanna-know-fuzzy-riff', u_doom, 4, 'the fuzz type matters a lot here. germanium > silicon for this', now() - interval '35 days'),

    -- 28. murray-trooper-galloping-lead
    ('murray-trooper-galloping-lead', u_pick_scraper, 5, 'the galloping rhythm tone is tight af. maiden forever', now() - interval '82 days'),
    ('murray-trooper-galloping-lead', u_djent, 4, NULL, now() - interval '69 days'),
    ('murray-trooper-galloping-lead', u_humbucker, 5, NULL, now() - interval '56 days'),
    ('murray-trooper-galloping-lead', u_noise_nancy, 4, 'the harmony lead tone is really well dialed. the mids are key', now() - interval '43 days'),
    ('murray-trooper-galloping-lead', u_drop_d, 4, NULL, now() - interval '30 days'),

    -- 29. jones-schism-dark-heavy
    ('jones-schism-dark-heavy', u_djent, 5, 'adam jones tone is so unique. dark and heavy but clear. this gets it', now() - interval '77 days'),
    ('jones-schism-dark-heavy', u_doom, 5, NULL, now() - interval '64 days'),
    ('jones-schism-dark-heavy', u_drop_d, 4, NULL, now() - interval '51 days'),
    ('jones-schism-dark-heavy', u_fuzz_lord, 4, 'more of a thick overdrive than fuzz which is correct for tool', now() - interval '38 days'),

    -- 30. bellamy-plug-in-baby-fuzz-whammy
    ('bellamy-plug-in-baby-fuzz-whammy', u_fuzz_lord, 5, 'fuzz factory + whammy = chaos in the best way. this recipe nails the crazy', now() - interval '73 days'),
    ('bellamy-plug-in-baby-fuzz-whammy', u_bedroom, 5, NULL, now() - interval '60 days'),
    ('bellamy-plug-in-baby-fuzz-whammy', u_pedalboard, 4, 'you really need specific pedals for this one. hard to replicate on modelers', now() - interval '47 days'),
    ('bellamy-plug-in-baby-fuzz-whammy', u_reverb_jnk, 4, NULL, now() - interval '34 days'),

    -- 31. auerbach-lonely-boy-raw-garage
    ('auerbach-lonely-boy-raw-garage', u_fuzz_lord, 5, NULL, now() - interval '71 days'),
    ('auerbach-lonely-boy-raw-garage', u_tube_stan, 4, 'the lo-fi crunch is really well captured here. sounds like a mic''d amp in a garage', now() - interval '58 days'),
    ('auerbach-lonely-boy-raw-garage', u_strat_dad, 4, NULL, now() - interval '45 days'),
    ('auerbach-lonely-boy-raw-garage', u_tele_life, 5, 'tele into something cranked and dirty. this is the way', now() - interval '32 days'),

    -- 32. gary-clark-bright-lights-modern-blues
    ('gary-clark-bright-lights-modern-blues', u_blues_lawyer, 5, 'gary clark jr is the future of blues guitar and this tone proves it', now() - interval '76 days'),
    ('gary-clark-bright-lights-modern-blues', u_strat_dad, 4, NULL, now() - interval '63 days'),
    ('gary-clark-bright-lights-modern-blues', u_fuzz_lord, 4, NULL, now() - interval '50 days'),
    ('gary-clark-bright-lights-modern-blues', u_feedback, 5, 'that overdriven fender sound. modern blues perfection', now() - interval '37 days'),

    -- 33. bonamassa-sloe-gin-blues-rock-lead
    ('bonamassa-sloe-gin-blues-rock-lead', u_blues_lawyer, 5, 'bonamassa is criminally underrated. this lead tone sings', now() - interval '80 days'),
    ('bonamassa-sloe-gin-blues-rock-lead', u_tube_stan, 5, NULL, now() - interval '67 days'),
    ('bonamassa-sloe-gin-blues-rock-lead', u_humbucker, 4, 'LP into a dumble type OD. the recipe captures that liquid feel', now() - interval '54 days'),
    ('bonamassa-sloe-gin-blues-rock-lead', u_strat_dad, 4, NULL, now() - interval '41 days'),
    ('bonamassa-sloe-gin-blues-rock-lead', u_gain_guru, 5, NULL, now() - interval '28 days'),

    -- 34. hammett-fade-to-black-clean-wah-solo
    ('hammett-fade-to-black-clean-wah-solo', u_wah_wanda, 5, 'the wah sweep on the solo section is beautiful. hammett at his best', now() - interval '79 days'),
    ('hammett-fade-to-black-clean-wah-solo', u_pick_scraper, 5, NULL, now() - interval '66 days'),
    ('hammett-fade-to-black-clean-wah-solo', u_djent, 4, NULL, now() - interval '53 days'),
    ('hammett-fade-to-black-clean-wah-solo', u_bedroom, 4, 'the clean intro part is gorgeous. then it kicks in 🤘', now() - interval '40 days'),

    -- 35. homme-no-one-knows-detuned-desert
    ('homme-no-one-knows-detuned-desert', u_fuzz_lord, 5, 'desert rock tone. the low tuning with that specific OD flavor is so qotsa', now() - interval '75 days'),
    ('homme-no-one-knows-detuned-desert', u_doom, 5, NULL, now() - interval '62 days'),
    ('homme-no-one-knows-detuned-desert', u_drop_d, 4, 'detuned heavy riffing with feel. homme is a genius at this', now() - interval '49 days'),
    ('homme-no-one-knows-detuned-desert', u_cab_skeptic, 4, NULL, now() - interval '36 days'),

    -- 36. srv-little-wing-hendrix-tribute
    ('srv-little-wing-hendrix-tribute', u_blues_lawyer, 5, 'srvs version is so different from hendrix and this captures that. more texas blues', now() - interval '82 days'),
    ('srv-little-wing-hendrix-tribute', u_strat_dad, 5, NULL, now() - interval '69 days'),
    ('srv-little-wing-hendrix-tribute', u_tube_stan, 4, NULL, now() - interval '56 days'),
    ('srv-little-wing-hendrix-tribute', u_clean_carl, 5, 'the way the clean chords ring out with that slight grit. perfection', now() - interval '43 days'),
    ('srv-little-wing-hendrix-tribute', u_vinyl_vince, 4, NULL, now() - interval '30 days'),

    -- 37. gilmour-shine-on-sustain
    ('gilmour-shine-on-sustain', u_reverb_jnk, 5, 'the sustain is INFINITE. compression + fuzz + delay stacked perfectly', now() - interval '86 days'),
    ('gilmour-shine-on-sustain', u_dad_rock, 5, NULL, now() - interval '73 days'),
    ('gilmour-shine-on-sustain', u_pedalboard, 5, 'shine on is THE gilmour tone imo. this does it justice', now() - interval '60 days'),
    ('gilmour-shine-on-sustain', u_strat_dad, 4, NULL, now() - interval '47 days'),
    ('gilmour-shine-on-sustain', u_chorus_chad, 4, NULL, now() - interval '34 days'),

    -- 38. angus-thunderstruck-tapping-intro
    ('angus-thunderstruck-tapping-intro', u_bedroom, 5, 'the tapping tone needs to be this clean and punchy. recipe nails it', now() - interval '81 days'),
    ('angus-thunderstruck-tapping-intro', u_dad_rock, 5, NULL, now() - interval '68 days'),
    ('angus-thunderstruck-tapping-intro', u_humbucker, 4, 'its actually angus on the studio version btw. good tone settings', now() - interval '55 days'),
    ('angus-thunderstruck-tapping-intro', u_tube_stan, 4, NULL, now() - interval '42 days'),
    ('angus-thunderstruck-tapping-intro', u_pick_scraper, 5, 'SG into a JTM45 crunch. classic', now() - interval '29 days'),

    -- ==========================================================================
    -- RE-SEED: 6 recipes with CORRECT slugs (007 used wrong slugs)
    -- ==========================================================================

    -- 39. slash-sweet-child-o-mine-lead (007 used "slash-sweet-child-lead")
    ('slash-sweet-child-o-mine-lead', u_humbucker, 5, 'THE intro tone. LP into a modded JCM800. nothing else compares', now() - interval '83 days'),
    ('slash-sweet-child-o-mine-lead', u_dad_rock, 5, NULL, now() - interval '70 days'),
    ('slash-sweet-child-o-mine-lead', u_bedroom, 5, 'fire 🔥🔥 loaded this on my katana and it SLAPS', now() - interval '57 days'),
    ('slash-sweet-child-o-mine-lead', u_tube_stan, 4, NULL, now() - interval '44 days'),
    ('slash-sweet-child-o-mine-lead', u_analog, 5, 'the mid hump from the alnico IIs is key and the recipe accounts for it', now() - interval '31 days'),
    ('slash-sweet-child-o-mine-lead', u_pick_scraper, 5, NULL, now() - interval '18 days'),

    -- 40. edge-where-the-streets-have-no-name (007 used "edge-where-the-streets-dotted-delay")
    ('edge-where-the-streets-have-no-name', u_reverb_jnk, 5, 'the dotted 8th delay is PERFECT. this is the edge sound', now() - interval '79 days'),
    ('edge-where-the-streets-have-no-name', u_chorus_chad, 4, NULL, now() - interval '66 days'),
    ('edge-where-the-streets-have-no-name', u_pedalboard, 5, 'delay + shimmer reverb + compression. the holy trinity of edge tone', now() - interval '53 days'),
    ('edge-where-the-streets-have-no-name', u_looper, 4, NULL, now() - interval '40 days'),
    ('edge-where-the-streets-have-no-name', u_dad_rock, 4, NULL, now() - interval '27 days'),

    -- 41. hetfield-enter-sandman-tight-rhythm (007 used "hammett-enter-sandman-rhythm")
    ('hetfield-enter-sandman-tight-rhythm', u_djent, 4, 'tight af. the mesa rectifier scoop is well done', now() - interval '76 days'),
    ('hetfield-enter-sandman-tight-rhythm', u_pick_scraper, 5, NULL, now() - interval '63 days'),
    ('hetfield-enter-sandman-tight-rhythm', u_drop_d, 5, 'the chug on this is perfect. been looking for this exact sound', now() - interval '50 days'),
    ('hetfield-enter-sandman-tight-rhythm', u_noise_nancy, 4, NULL, now() - interval '37 days'),
    ('hetfield-enter-sandman-tight-rhythm', u_humbucker, 5, NULL, now() - interval '24 days'),
    ('hetfield-enter-sandman-tight-rhythm', u_doom, 4, 'solid metallica tone. the gate settings keep it tight', now() - interval '11 days'),

    -- 42. bb-king-thrill-is-gone (007 used "king-bb-thrill-is-gone")
    ('bb-king-thrill-is-gone', u_blues_lawyer, 5, 'lucille into a lab series. that warm neck pickup tone is HERE', now() - interval '82 days'),
    ('bb-king-thrill-is-gone', u_slide_sam, 5, NULL, now() - interval '69 days'),
    ('bb-king-thrill-is-gone', u_strat_dad, 4, NULL, now() - interval '56 days'),
    ('bb-king-thrill-is-gone', u_vinyl_vince, 5, 'bb had the most expressive vibrato ever. the tone settings help but its 90% fingers', now() - interval '43 days'),
    ('bb-king-thrill-is-gone', u_string_bob, 4, NULL, now() - interval '30 days'),
    ('bb-king-thrill-is-gone', u_tube_stan, 5, NULL, now() - interval '17 days'),

    -- 43. morello-killing-in-the-name (007 used "morello-killing-in-the-name-of")
    ('morello-killing-in-the-name', u_drop_d, 5, 'the whammy + distortion combo is chaos and i love it', now() - interval '75 days'),
    ('morello-killing-in-the-name', u_feedback, 5, NULL, now() - interval '62 days'),
    ('morello-killing-in-the-name', u_wah_wanda, 4, NULL, now() - interval '49 days'),
    ('morello-killing-in-the-name', u_fuzz_lord, 4, 'morello is a mad scientist. this gets the basic riff tone well', now() - interval '36 days'),
    ('morello-killing-in-the-name', u_bedroom, 5, NULL, now() - interval '23 days'),

    -- 44. page-stairway-to-heaven-clean-build (007 used "page-stairway-to-heaven-solo")
    ('page-stairway-to-heaven-clean-build', u_dad_rock, 5, 'from the 12 string intro to the solo. best guitar journey ever', now() - interval '81 days'),
    ('page-stairway-to-heaven-clean-build', u_blues_lawyer, 5, NULL, now() - interval '68 days'),
    ('page-stairway-to-heaven-clean-build', u_vinyl_vince, 5, 'the clean section into the crunch buildup is so well mapped here', now() - interval '55 days'),
    ('page-stairway-to-heaven-clean-build', u_analog, 4, NULL, now() - interval '42 days'),
    ('page-stairway-to-heaven-clean-build', u_humbucker, 5, NULL, now() - interval '29 days'),
    ('page-stairway-to-heaven-clean-build', u_tube_stan, 4, 'pretty good but the solo section gain is a touch low imo', now() - interval '16 days'),
    ('page-stairway-to-heaven-clean-build', u_tele_life, 3, NULL, now() - interval '8 days')

  ON CONFLICT (recipe_slug, user_id) DO NOTHING;


  -- ==========================================================================
  -- COMMENTS (~30 comments across ~22 recipes)
  -- ==========================================================================

  -- evh-eruption-brown-sound
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c11, 'evh-eruption-brown-sound', u_bedroom, 'ok so i loaded this on my katana at like vol 3 and it actually sounds HUGE. the phaser before the dirt is what does it. never wouldve thought to try that', now() - interval '81 days');
  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('evh-eruption-brown-sound', u_dad_rock, c11, 'the variac sag is the secret sauce tho. eddie ran his marshall at like 89 volts. spongy and compressed', now() - interval '79 days');

  -- hetfield-master-of-puppets-rhythm
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c12, 'hetfield-master-of-puppets-rhythm', u_pick_scraper, 'downpicking this at tempo with these settings is a workout lol. tone is absolutely perfect for the riff tho. that mid scoop 👨‍🍳', now() - interval '81 days');
  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('hetfield-master-of-puppets-rhythm', u_djent, c12, 'james hetfield is the downpicking GOAT. no debate', now() - interval '78 days');

  -- knopfler-sultans-of-swing-clean
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('knopfler-sultans-of-swing-clean', u_clean_carl, 'PSA: you HAVE to fingerpick this. using a pick sounds totally different even with the same settings. knopfler uses thumb and first two fingers. thats where the tone comes from', now() - interval '86 days');

  -- iommi-iron-man-doom-riff
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c13, 'iommi-iron-man-doom-riff', u_doom, 'tuned down a half step with these settings and its pure sludge. exactly what sabbath sounded like before everyone started copying them', now() - interval '85 days');

  -- dimebag-walk-groove-metal
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c14, 'dimebag-walk-groove-metal', u_pick_scraper, 'RIP Dime. the randall solid state crunch is so unique and this gets it. the scoop + high gain + tight low end = walk', now() - interval '76 days');
  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('dimebag-walk-groove-metal', u_noise_nancy, c14, 'the trick is running a noise gate BEFORE the amp too not just in the loop. dime had his gate set super tight', now() - interval '73 days');

  -- page-whole-lotta-love-heavy-riff
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('page-whole-lotta-love-heavy-riff', u_dad_rock, 'the tone knob on the LP rolled back a bit is so important for page. he rarely ran it wide open. this recipe gets that warm crunch right', now() - interval '83 days');

  -- gilmour-time-solo-lead
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c15, 'gilmour-time-solo-lead', u_reverb_jnk, 'the rotary speaker effect is criminally underrated for gilmour. most ppl just focus on the delay but the rotary is what gives it that swirly movement', now() - interval '80 days');

  -- slash-welcome-to-jungle-aggressive-riff
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('slash-welcome-to-jungle-aggressive-riff', u_humbucker, 'way more raw and aggressive than sweet child. appetite was recorded hot and fast and you can hear it. this recipe captures that energy', now() - interval '78 days');

  -- rhoads-crazy-train-lead
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c16, 'rhoads-crazy-train-lead', u_bedroom, 'the harmonics on the intro are so satisfying with these settings. randy was on another level', now() - interval '78 days');
  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('rhoads-crazy-train-lead', u_humbucker, c16, 'randy used a distortion+ into a marshall which is kinda like a TS but harsher. this recipe captures that bite', now() - interval '75 days');

  -- srv-texas-flood-slow-blues-lead
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('srv-texas-flood-slow-blues-lead', u_blues_lawyer, 'slow blues is where tone matters most. every note is exposed. these settings give you that raw cranked amp sound that SRV lived in', now() - interval '82 days');

  -- jones-schism-dark-heavy
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('jones-schism-dark-heavy', u_djent, 'adam jones uses a diezel vh4 and the dark heavy thing is so specific. not metal scooped, not rock mid-heavy. its its own thing and this recipe understands that', now() - interval '75 days');

  -- bellamy-plug-in-baby-fuzz-whammy
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c17, 'bellamy-plug-in-baby-fuzz-whammy', u_fuzz_lord, 'the fuzz factory is WILD with these settings. bellamy runs it right on the edge of oscillation. controlled chaos', now() - interval '71 days');

  -- gary-clark-bright-lights-modern-blues
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('gary-clark-bright-lights-modern-blues', u_blues_lawyer, 'gary clark jr makes blues dangerous again. the overdriven fender tone here is nasty in the best way. this dude is the real deal', now() - interval '74 days');

  -- bonamassa-sloe-gin-blues-rock-lead
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('bonamassa-sloe-gin-blues-rock-lead', u_blues_lawyer, 'joe b gets hate for being too polished but his tone on sloe gin is incredible. the les paul into the dumble ODS sound is liquid gold', now() - interval '78 days');

  -- homme-no-one-knows-detuned-desert
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c18, 'homme-no-one-knows-detuned-desert', u_fuzz_lord, 'C standard tuning + that specific OD flavor. homme basically invented a genre with this tone. the recipe captures the vibe', now() - interval '73 days');

  -- gilmour-shine-on-sustain
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c19, 'gilmour-shine-on-sustain', u_reverb_jnk, 'the 4 note bend at the beginning. you need EXACTLY this amount of sustain and compression. anything less and the notes die. anything more and its mud. this recipe walks the line perfectly', now() - interval '84 days');
  INSERT INTO comments (recipe_slug, user_id, parent_id, body, created_at) VALUES
    ('gilmour-shine-on-sustain', u_pedalboard, c19, 'a good compressor before the fuzz is key. the big muff alone wont sustain like gilmour without it', now() - interval '81 days');

  -- angus-thunderstruck-tapping-intro
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('angus-thunderstruck-tapping-intro', u_bedroom, 'this is actually angus playing the tapping part on the album not malcolm btw. the tone needs to be clean-ish with just a bit of breakup which this recipe nails', now() - interval '79 days');

  -- slash-sweet-child-o-mine-lead (correct slug)
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('slash-sweet-child-o-mine-lead', u_humbucker, 'that iconic intro tone. alnico II in the neck position of an LP into a JCM800. this recipe gets the mid-forward crunch exactly right', now() - interval '80 days'),
    ('slash-sweet-child-o-mine-lead', u_tube_stan, 'pro tip: a TS in front of the 800 model gets you the extra push slash had from his gain mod. recipe accounts for this', now() - interval '72 days');

  -- bb-king-thrill-is-gone (correct slug)
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('bb-king-thrill-is-gone', u_blues_lawyer, 'BB played with one finger. ONE FINGER. and it sounded better than all of us. the tone is warm and vocal and this recipe captures the lucille sound', now() - interval '80 days');

  -- morello-killing-in-the-name (correct slug)
  INSERT INTO comments (id, recipe_slug, user_id, body, created_at) VALUES
    (c20, 'morello-killing-in-the-name', u_feedback, 'morello uses a whammy pedal like a weapon on this track. the octave up into distortion is so aggressive. recipe nails the basic riff tone', now() - interval '60 days');

  -- page-stairway-to-heaven-clean-build (correct slug)
  INSERT INTO comments (recipe_slug, user_id, body, created_at) VALUES
    ('page-stairway-to-heaven-clean-build', u_dad_rock, 'the buildup from the clean 12-string sound to the full rock section is maybe the greatest arrangement in rock. these settings capture each phase really well', now() - interval '79 days');

END $$;
