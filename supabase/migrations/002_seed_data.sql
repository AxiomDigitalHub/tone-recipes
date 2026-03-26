-- 002_seed_data.sql
-- Seed reference data: artists, songs, gear items, and modeler equivalents.
-- Recipes are NOT seeded here -- use the admin UI to create them.

-- =========================================================================
-- Artists
-- =========================================================================
INSERT INTO artists (name, slug, bio, genres) VALUES
  ('Stevie Ray Vaughan', 'stevie-ray-vaughan',
   'Texas blues guitarist known for his aggressive, raw playing style and incredibly fat Stratocaster tone. SRV revitalized blues guitar in the 1980s with a tone built on heavy strings, a Tube Screamer, and cranked Fender amps.',
   ARRAY['blues','blues-rock','texas-blues']),

  ('David Gilmour', 'david-gilmour',
   'Pink Floyd''s lead guitarist, famous for expressive bends, singing sustain, and spacious delay-drenched lead tones. Gilmour''s signal chain is one of the most studied and documented in guitar history.',
   ARRAY['progressive-rock','classic-rock','psychedelic']),

  ('Jimi Hendrix', 'jimi-hendrix',
   'The most influential electric guitarist in history. Hendrix pioneered the use of feedback, fuzz, wah, and the Uni-Vibe to create sounds that had never been heard before. His Strat-through-Marshall tone is the foundation of rock guitar.',
   ARRAY['rock','psychedelic','blues-rock']),

  ('Kurt Cobain', 'kurt-cobain',
   'Nirvana''s frontman stripped guitar tone down to its essentials: a cheap offset guitar, a Boss DS-1, and a loud amp. The quiet-verse/loud-chorus dynamic he popularized defined 1990s alternative rock.',
   ARRAY['grunge','alternative','punk']),

  ('John Frusciante', 'john-frusciante',
   'Red Hot Chili Peppers guitarist known for crystalline clean tones, funky rhythms, and melodic lead work. His Stratocaster-into-Marshall tone is one of the most recognizable in modern rock.',
   ARRAY['alternative','funk-rock','rock']);

-- =========================================================================
-- Songs  (reference artists by slug via subquery)
-- =========================================================================
INSERT INTO songs (artist_id, title, slug, album, year, genres, difficulty, external_tab_url, external_video_url) VALUES
  ((SELECT id FROM artists WHERE slug = 'stevie-ray-vaughan'),
   'Pride and Joy', 'pride-and-joy-stevie-ray-vaughan', 'Texas Flood', 1983,
   ARRAY['blues','texas-blues'], 'advanced',
   'https://www.songsterr.com/a/wsa/stevie-ray-vaughan-pride-and-joy-tab-s80',
   'https://www.youtube.com/results?search_query=pride+and+joy+srv+guitar+lesson'),

  ((SELECT id FROM artists WHERE slug = 'david-gilmour'),
   'Comfortably Numb', 'comfortably-numb-pink-floyd', 'The Wall', 1979,
   ARRAY['progressive-rock','classic-rock'], 'intermediate',
   'https://www.songsterr.com/a/wsa/pink-floyd-comfortably-numb-tab-s27',
   'https://www.youtube.com/results?search_query=comfortably+numb+solo+guitar+lesson'),

  ((SELECT id FROM artists WHERE slug = 'jimi-hendrix'),
   'Voodoo Child (Slight Return)', 'voodoo-child-slight-return-jimi-hendrix', 'Electric Ladyland', 1968,
   ARRAY['rock','blues-rock','psychedelic'], 'advanced',
   'https://www.songsterr.com/a/wsa/jimi-hendrix-voodoo-child-slight-return-tab-s200',
   'https://www.youtube.com/results?search_query=voodoo+child+slight+return+guitar+lesson'),

  ((SELECT id FROM artists WHERE slug = 'kurt-cobain'),
   'Smells Like Teen Spirit', 'smells-like-teen-spirit-nirvana', 'Nevermind', 1991,
   ARRAY['grunge','alternative'], 'beginner',
   'https://www.songsterr.com/a/wsa/nirvana-smells-like-teen-spirit-tab-s455',
   'https://www.youtube.com/results?search_query=smells+like+teen+spirit+guitar+lesson'),

  ((SELECT id FROM artists WHERE slug = 'john-frusciante'),
   'Under the Bridge', 'under-the-bridge-red-hot-chili-peppers', 'Blood Sugar Sex Magik', 1991,
   ARRAY['alternative','rock'], 'intermediate',
   'https://www.songsterr.com/a/wsa/red-hot-chili-peppers-under-the-bridge-tab-s282',
   'https://www.youtube.com/results?search_query=under+the+bridge+guitar+lesson');

-- =========================================================================
-- Gear Items
-- =========================================================================
INSERT INTO gear_items (name, slug, type, subcategory, manufacturer, icon_type, icon_color, description, default_settings) VALUES
  ('Fender Stratocaster', 'fender-stratocaster', 'guitar', NULL, 'Fender', 'strat', '#d4a574',
   'The most versatile electric guitar ever made. Three single-coil pickups, 5-way switch, tremolo bridge. The sound of blues, rock, funk, and country.',
   NULL),

  ('Ibanez Tube Screamer TS808', 'ibanez-tube-screamer-ts808', 'effect', 'overdrive', 'Ibanez', 'boss_compact', '#22c55e',
   'The most cloned overdrive pedal in history. Mid-hump character that tightens low end and adds presence.',
   '{"knobs":[{"name":"Drive","min":0,"max":10},{"name":"Tone","min":0,"max":10},{"name":"Level","min":0,"max":10}]}'::jsonb),

  ('Fender Vibroverb (Blackface)', 'fender-vibroverb-blackface', 'amp', NULL, 'Fender', 'fender_combo', '#1a1a2e',
   'A 1964 blackface Fender combo with 1x15 JBL speaker. SRV''s primary amp.',
   '{"knobs":[{"name":"Volume","min":0,"max":10},{"name":"Treble","min":0,"max":10},{"name":"Bass","min":0,"max":10},{"name":"Reverb","min":0,"max":10},{"name":"Speed","min":0,"max":10}]}'::jsonb),

  ('Electro-Harmonix Big Muff Pi', 'electro-harmonix-big-muff-pi', 'effect', 'fuzz', 'Electro-Harmonix', 'large_format', '#a1a1aa',
   'Thick, sustaining fuzz with a distinctive scooped mid character. David Gilmour''s signature lead tone pedal.',
   '{"knobs":[{"name":"Volume","min":0,"max":10},{"name":"Tone","min":0,"max":10},{"name":"Sustain","min":0,"max":10}]}'::jsonb),

  ('Hiwatt DR103 Custom 100', 'hiwatt-dr103', 'amp', NULL, 'Hiwatt', 'marshall_head', '#4a4a6a',
   'David Gilmour''s primary amp. Extremely loud, extremely clean headroom.',
   '{"knobs":[{"name":"Normal Vol","min":0,"max":10},{"name":"Brilliant Vol","min":0,"max":10},{"name":"Bass","min":0,"max":10},{"name":"Treble","min":0,"max":10},{"name":"Presence","min":0,"max":10},{"name":"Master","min":0,"max":10}]}'::jsonb),

  ('Boss DS-1 Distortion', 'boss-ds1', 'effect', 'distortion', 'Boss', 'boss_compact', '#f97316',
   'The most popular distortion pedal ever made. Bright, aggressive, and cheap. Kurt Cobain''s primary drive pedal.',
   '{"knobs":[{"name":"Tone","min":0,"max":10},{"name":"Level","min":0,"max":10},{"name":"Dist","min":0,"max":10}]}'::jsonb),

  ('Dallas Arbiter Fuzz Face', 'dallas-arbiter-fuzz-face', 'effect', 'fuzz', 'Dallas Arbiter', 'large_format', '#3b82f6',
   'Hendrix''s fuzz pedal. Round, thick, woolly fuzz that cleans up beautifully with the guitar volume knob.',
   '{"knobs":[{"name":"Volume","min":0,"max":10},{"name":"Fuzz","min":0,"max":10}]}'::jsonb),

  ('Marshall Super Lead 1959', 'marshall-super-lead-1959', 'amp', NULL, 'Marshall', 'marshall_head', '#1a1a1a',
   'The Marshall Plexi. The sound of rock guitar.',
   '{"knobs":[{"name":"Presence","min":0,"max":10},{"name":"Bass","min":0,"max":10},{"name":"Middle","min":0,"max":10},{"name":"Treble","min":0,"max":10},{"name":"Volume I","min":0,"max":10},{"name":"Volume II","min":0,"max":10}]}'::jsonb),

  ('Dunlop Cry Baby Wah', 'dunlop-cry-baby-wah', 'effect', 'wah', 'Dunlop', 'wah', '#1a1a1a',
   'The standard wah pedal. Hendrix made it famous.',
   '{"knobs":[{"name":"Position","min":0,"max":10}]}'::jsonb),

  ('Shin-Ei Uni-Vibe', 'shin-ei-uni-vibe', 'effect', 'modulation', 'Shin-Ei', 'large_format', '#7c3aed',
   'A photocell-based modulation effect that produces a lush, swirling, chorus-like sound.',
   '{"knobs":[{"name":"Speed","min":0,"max":10},{"name":"Intensity","min":0,"max":10}]}'::jsonb),

  ('Shure SM57', 'shure-sm57', 'microphone', NULL, 'Shure', 'sm57', '#6b7280',
   'The industry standard for miking guitar cabinets.',
   '{"knobs":[{"name":"Position","options":["on-axis","off-axis","edge of cone"]}]}'::jsonb),

  ('Marshall 4x12 Cabinet (Greenback)', 'marshall-4x12-greenback', 'cabinet', NULL, 'Marshall', 'cab_4x12', '#1a1a1a',
   'The classic 4x12 with Celestion G12M Greenback speakers. Warm, woody midrange with controlled top end.',
   NULL),

  ('Electro-Harmonix Small Clone', 'ehx-small-clone', 'effect', 'chorus', 'Electro-Harmonix', 'boss_compact', '#06b6d4',
   'Simple, lush analog chorus. Kurt Cobain used it on Come As You Are.',
   '{"knobs":[{"name":"Rate","min":0,"max":10},{"name":"Depth","options":["shallow","deep"]}]}'::jsonb);

-- =========================================================================
-- Modeler Equivalents
-- =========================================================================
-- Tube Screamer TS808
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Scream 808'), ('quad_cortex', 'TS808 OD'), ('tonex', 'TS808'),
    ('fractal', 'T808 OD'), ('kemper', 'Green Scream'), ('katana', 'Blues Driver (Booster)')
  ) AS v(platform, equiv_name)
WHERE slug = 'ibanez-tube-screamer-ts808';

-- Fender Vibroverb
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'US Deluxe Vib'), ('quad_cortex', 'Vibro Verb'), ('tonex', 'Vibroverb'),
    ('fractal', 'Vibrato Verb'), ('kemper', 'Fender Vibroverb'), ('katana', 'Crunch Channel')
  ) AS v(platform, equiv_name)
WHERE slug = 'fender-vibroverb-blackface';

-- Big Muff Pi
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Triangle Fuzz'), ('quad_cortex', 'Big Pi'), ('tonex', 'Big Muff'),
    ('fractal', 'Big Muff Pi'), ('kemper', 'Big Muff'), ('katana', 'Muff Fuzz (Booster)')
  ) AS v(platform, equiv_name)
WHERE slug = 'electro-harmonix-big-muff-pi';

-- Hiwatt DR103
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Brit Plexi Brt'), ('quad_cortex', 'Hiwatt DR103'), ('tonex', 'Hiwatt'),
    ('fractal', 'Hipower 100'), ('kemper', 'Hiwatt Custom 100'), ('katana', 'Lead Channel (clean)')
  ) AS v(platform, equiv_name)
WHERE slug = 'hiwatt-dr103';

-- Boss DS-1
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Deez One Vintage'), ('quad_cortex', 'DS-1'), ('tonex', 'Boss DS-1'),
    ('fractal', 'Bender Fuzz'), ('kemper', 'DS-1'), ('katana', 'DS-1 (Booster)')
  ) AS v(platform, equiv_name)
WHERE slug = 'boss-ds1';

-- Fuzz Face
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Arbitrator Fuzz'), ('quad_cortex', 'Fuzz Face'), ('tonex', 'Fuzz Face'),
    ('fractal', 'Face Fuzz'), ('kemper', 'Fuzz Face'), ('katana', 'Fuzz Face (Booster)')
  ) AS v(platform, equiv_name)
WHERE slug = 'dallas-arbiter-fuzz-face';

-- Marshall Super Lead 1959
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Brit Plexi Brt'), ('quad_cortex', '1959 SLP'), ('tonex', 'Marshall Plexi'),
    ('fractal', 'Plexi 100W'), ('kemper', 'Marshall Plexi'), ('katana', 'Brown Channel')
  ) AS v(platform, equiv_name)
WHERE slug = 'marshall-super-lead-1959';

-- Cry Baby Wah
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Chrome'), ('quad_cortex', 'Wah'), ('tonex', 'Cry Baby'),
    ('fractal', 'Cry Baby'), ('kemper', 'Cry Baby'), ('katana', 'Pedal Wah (Pedal FX)')
  ) AS v(platform, equiv_name)
WHERE slug = 'dunlop-cry-baby-wah';

-- Uni-Vibe
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', 'Gray Flanger (or Legacy Uni-Vibe)'), ('quad_cortex', 'Uni-Vibe'), ('tonex', 'Uni-Vibe'),
    ('fractal', 'Uni-Vibe'), ('kemper', 'Vintage Phaser'), ('katana', 'Uni-V (Mod)')
  ) AS v(platform, equiv_name)
WHERE slug = 'shin-ei-uni-vibe';

-- Marshall 4x12 Greenback
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', '4x12 Greenback25'), ('quad_cortex', '4x12 Green 25'),
    ('fractal', '4x12 Green 25W'), ('katana', '4x12 (internal speaker sim)')
  ) AS v(platform, equiv_name)
WHERE slug = 'marshall-4x12-greenback';

-- Small Clone
INSERT INTO gear_modeler_equivalents (gear_id, platform, equivalent_name)
SELECT gear_items.id, v.platform, v.equiv_name FROM gear_items
  CROSS JOIN (VALUES
    ('helix', '70s Chorus'), ('quad_cortex', 'Small Clone'), ('tonex', 'Chorus'),
    ('fractal', 'Analog Chorus'), ('kemper', 'Small Clone'), ('katana', 'CE-1 Chorus (Mod)')
  ) AS v(platform, equiv_name)
WHERE slug = 'ehx-small-clone';
