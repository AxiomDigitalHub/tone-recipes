import type { Artist, Song, GearItem, ToneRecipe } from "@/types/recipe";

// ---------------------------------------------------------------------------
// Seed data for local prototyping without a database
// ---------------------------------------------------------------------------

export const artists: Artist[] = [
  {
    name: "Stevie Ray Vaughan",
    slug: "stevie-ray-vaughan",
    bio: "Texas blues guitarist known for his aggressive, raw playing style and incredibly fat Stratocaster tone. SRV revitalized blues guitar in the 1980s with a tone built on heavy strings, a Tube Screamer, and cranked Fender amps.",
    genres: ["blues", "blues-rock", "texas-blues"],
  },
  {
    name: "David Gilmour",
    slug: "david-gilmour",
    bio: "Pink Floyd's lead guitarist, famous for expressive bends, singing sustain, and spacious delay-drenched lead tones. Gilmour's signal chain is one of the most studied and documented in guitar history.",
    genres: ["progressive-rock", "classic-rock", "psychedelic"],
  },
  {
    name: "Jimi Hendrix",
    slug: "jimi-hendrix",
    bio: "The most influential electric guitarist in history. Hendrix pioneered the use of feedback, fuzz, wah, and the Uni-Vibe to create sounds that had never been heard before. His Strat-through-Marshall tone is the foundation of rock guitar.",
    genres: ["rock", "psychedelic", "blues-rock"],
  },
  {
    name: "Kurt Cobain",
    slug: "kurt-cobain",
    bio: "Nirvana's frontman stripped guitar tone down to its essentials: a cheap offset guitar, a Boss DS-1, and a loud amp. The quiet-verse/loud-chorus dynamic he popularized defined 1990s alternative rock.",
    genres: ["grunge", "alternative", "punk"],
  },
  {
    name: "John Frusciante",
    slug: "john-frusciante",
    bio: "Red Hot Chili Peppers guitarist known for crystalline clean tones, funky rhythms, and melodic lead work. His Stratocaster-into-Marshall tone is one of the most recognizable in modern rock.",
    genres: ["alternative", "funk-rock", "rock"],
  },
];

export const songs: Song[] = [
  {
    artist_slug: "stevie-ray-vaughan",
    title: "Pride and Joy",
    slug: "pride-and-joy-stevie-ray-vaughan",
    album: "Texas Flood",
    year: 1983,
    genres: ["blues", "texas-blues"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/stevie-ray-vaughan-pride-and-joy-tab-s80",
    external_video_url:
      "https://www.youtube.com/results?search_query=pride+and+joy+srv+guitar+lesson",
  },
  {
    artist_slug: "david-gilmour",
    title: "Comfortably Numb",
    slug: "comfortably-numb-pink-floyd",
    album: "The Wall",
    year: 1979,
    genres: ["progressive-rock", "classic-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/pink-floyd-comfortably-numb-tab-s27",
    external_video_url:
      "https://www.youtube.com/results?search_query=comfortably+numb+solo+guitar+lesson",
  },
  {
    artist_slug: "jimi-hendrix",
    title: "Voodoo Child (Slight Return)",
    slug: "voodoo-child-slight-return-jimi-hendrix",
    album: "Electric Ladyland",
    year: 1968,
    genres: ["rock", "blues-rock", "psychedelic"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/jimi-hendrix-voodoo-child-slight-return-tab-s200",
    external_video_url:
      "https://www.youtube.com/results?search_query=voodoo+child+slight+return+guitar+lesson",
  },
  {
    artist_slug: "kurt-cobain",
    title: "Smells Like Teen Spirit",
    slug: "smells-like-teen-spirit-nirvana",
    album: "Nevermind",
    year: 1991,
    genres: ["grunge", "alternative"],
    difficulty: "beginner",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/nirvana-smells-like-teen-spirit-tab-s455",
    external_video_url:
      "https://www.youtube.com/results?search_query=smells+like+teen+spirit+guitar+lesson",
  },
  {
    artist_slug: "john-frusciante",
    title: "Under the Bridge",
    slug: "under-the-bridge-red-hot-chili-peppers",
    album: "Blood Sugar Sex Magik",
    year: 1991,
    genres: ["alternative", "rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/red-hot-chili-peppers-under-the-bridge-tab-s282",
    external_video_url:
      "https://www.youtube.com/results?search_query=under+the+bridge+guitar+lesson",
  },
];

export const gearItems: GearItem[] = [
  {
    name: "Fender Stratocaster",
    slug: "fender-stratocaster",
    type: "guitar",
    manufacturer: "Fender",
    icon_type: "strat",
    icon_color: "#d4a574",
    description:
      "The most versatile electric guitar ever made. Three single-coil pickups, 5-way switch, tremolo bridge. The sound of blues, rock, funk, and country.",
    modeler_equivalents: {},
  },
  {
    name: "Ibanez Tube Screamer TS808",
    slug: "ibanez-tube-screamer-ts808",
    type: "effect",
    subcategory: "overdrive",
    manufacturer: "Ibanez",
    icon_type: "boss_compact",
    icon_color: "#22c55e",
    description:
      "The most cloned overdrive pedal in history. Mid-hump character that tightens low end and adds presence. Used by SRV, John Mayer, and countless others as a clean boost or light overdrive.",
    default_settings: {
      knobs: [
        { name: "Drive", min: 0, max: 10 },
        { name: "Tone", min: 0, max: 10 },
        { name: "Level", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Scream 808",
      quad_cortex: "TS808 OD",
      tonex: "TS808",
      fractal: "T808 OD",
      kemper: "Green Scream",
      katana: "Blues Driver (Booster)",
    },
  },
  {
    name: "Fender Vibroverb (Blackface)",
    slug: "fender-vibroverb-blackface",
    type: "amp",
    manufacturer: "Fender",
    icon_type: "fender_combo",
    icon_color: "#1a1a2e",
    description:
      "A 1964 blackface Fender combo with 1x15 JBL speaker. SRV's primary amp. Rich, warm cleans that break up beautifully when pushed. Spring reverb and vibrato built in.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Reverb", min: 0, max: 10 },
        { name: "Speed", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "US Deluxe Vib",
      quad_cortex: "Vibro Verb",
      tonex: "Vibroverb",
      fractal: "Vibrato Verb",
      kemper: "Fender Vibroverb",
      katana: "Crunch Channel",
    },
  },
  {
    name: "Electro-Harmonix Big Muff Pi",
    slug: "electro-harmonix-big-muff-pi",
    type: "effect",
    subcategory: "fuzz",
    manufacturer: "Electro-Harmonix",
    icon_type: "large_format",
    icon_color: "#a1a1aa",
    description:
      "Thick, sustaining fuzz with a distinctive scooped mid character. David Gilmour's signature lead tone pedal. The sound of Comfortably Numb, Time, and countless Pink Floyd solos.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Tone", min: 0, max: 10 },
        { name: "Sustain", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Triangle Fuzz",
      quad_cortex: "Big Pi",
      tonex: "Big Muff",
      fractal: "Big Muff Pi",
      kemper: "Big Muff",
      katana: "Muff Fuzz (Booster)",
    },
  },
  {
    name: "Hiwatt DR103 Custom 100",
    slug: "hiwatt-dr103",
    type: "amp",
    manufacturer: "Hiwatt",
    icon_type: "marshall_head",
    icon_color: "#4a4a6a",
    description:
      "David Gilmour's primary amp. Extremely loud, extremely clean headroom. Where a Marshall breaks up early, a Hiwatt stays clean much longer, providing a pristine platform for effects. The pedal-friendly amp.",
    default_settings: {
      knobs: [
        { name: "Normal Vol", min: 0, max: 10 },
        { name: "Brilliant Vol", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Presence", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Brit Plexi Brt",
      quad_cortex: "Hiwatt DR103",
      tonex: "Hiwatt",
      fractal: "Hipower 100",
      kemper: "Hiwatt Custom 100",
      katana: "Lead Channel (clean)",
    },
  },
  {
    name: "Boss DS-1 Distortion",
    slug: "boss-ds1",
    type: "effect",
    subcategory: "distortion",
    manufacturer: "Boss",
    icon_type: "boss_compact",
    icon_color: "#f97316",
    description:
      "The most popular distortion pedal ever made. Bright, aggressive, and cheap. Kurt Cobain's primary drive pedal. Also used by Prince, Steve Vai, and Joe Satriani.",
    default_settings: {
      knobs: [
        { name: "Tone", min: 0, max: 10 },
        { name: "Level", min: 0, max: 10 },
        { name: "Dist", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Deez One Vintage",
      quad_cortex: "DS-1",
      tonex: "Boss DS-1",
      fractal: "Bender Fuzz",
      kemper: "DS-1",
      katana: "DS-1 (Booster)",
    },
  },
  {
    name: "Dallas Arbiter Fuzz Face",
    slug: "dallas-arbiter-fuzz-face",
    type: "effect",
    subcategory: "fuzz",
    manufacturer: "Dallas Arbiter",
    icon_type: "large_format",
    icon_color: "#3b82f6",
    description:
      "Hendrix's fuzz pedal. Round, thick, woolly fuzz that cleans up beautifully with the guitar volume knob. Germanium transistors give it a warm, organic character.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Fuzz", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Arbitrator Fuzz",
      quad_cortex: "Fuzz Face",
      tonex: "Fuzz Face",
      fractal: "Face Fuzz",
      kemper: "Fuzz Face",
      katana: "Fuzz Face (Booster)",
    },
  },
  {
    name: "Marshall Super Lead 1959",
    slug: "marshall-super-lead-1959",
    type: "amp",
    manufacturer: "Marshall",
    icon_type: "marshall_head",
    icon_color: "#1a1a1a",
    description:
      "The Marshall Plexi. The sound of rock guitar. Hendrix, Page, Angus Young, Slash. Cranked to full volume, it produces the most iconic overdrive tone in guitar history.",
    default_settings: {
      knobs: [
        { name: "Presence", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Volume I", min: 0, max: 10 },
        { name: "Volume II", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Brit Plexi Brt",
      quad_cortex: "1959 SLP",
      tonex: "Marshall Plexi",
      fractal: "Plexi 100W",
      kemper: "Marshall Plexi",
      katana: "Brown Channel",
    },
  },
  {
    name: "Dunlop Cry Baby Wah",
    slug: "dunlop-cry-baby-wah",
    type: "effect",
    subcategory: "wah",
    manufacturer: "Dunlop",
    icon_type: "wah",
    icon_color: "#1a1a1a",
    description:
      "The standard wah pedal. Hendrix made it famous. Used on Voodoo Child, White Room, and thousands of other recordings.",
    default_settings: {
      knobs: [{ name: "Position", min: 0, max: 10 }],
    },
    modeler_equivalents: {
      helix: "Chrome",
      quad_cortex: "Wah",
      tonex: "Cry Baby",
      fractal: "Cry Baby",
      kemper: "Cry Baby",
      katana: "Pedal Wah (Pedal FX)",
    },
  },
  {
    name: "Shin-Ei Uni-Vibe",
    slug: "shin-ei-uni-vibe",
    type: "effect",
    subcategory: "modulation",
    manufacturer: "Shin-Ei",
    icon_type: "large_format",
    icon_color: "#7c3aed",
    description:
      "A photocell-based modulation effect that produces a lush, swirling, chorus-like sound. Hendrix used it prominently on Machine Gun and other Band of Gypsys material. Not a true chorus or phaser; it's its own thing.",
    default_settings: {
      knobs: [
        { name: "Speed", min: 0, max: 10 },
        { name: "Intensity", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Gray Flanger (or Legacy Uni-Vibe)",
      quad_cortex: "Uni-Vibe",
      tonex: "Uni-Vibe",
      fractal: "Uni-Vibe",
      kemper: "Vintage Phaser",
      katana: "Uni-V (Mod)",
    },
  },
  {
    name: "Shure SM57",
    slug: "shure-sm57",
    type: "microphone",
    manufacturer: "Shure",
    icon_type: "sm57",
    icon_color: "#6b7280",
    description:
      "The industry standard for miking guitar cabinets. Dynamic microphone. Placed on-axis for a brighter, more present tone; off-axis for a warmer, darker sound.",
    default_settings: {
      knobs: [{ name: "Position", options: ["on-axis", "off-axis", "edge of cone"] }],
    },
  },
  {
    name: "Marshall 4x12 Cabinet (Greenback)",
    slug: "marshall-4x12-greenback",
    type: "cabinet",
    manufacturer: "Marshall",
    icon_type: "cab_4x12",
    icon_color: "#1a1a1a",
    description:
      "The classic 4x12 with Celestion G12M Greenback speakers. Warm, woody midrange with controlled top end. The sound of classic rock.",
    modeler_equivalents: {
      helix: "4x12 Greenback25",
      quad_cortex: "4x12 Green 25",
      fractal: "4x12 Green 25W",
      katana: "4x12 (internal speaker sim)",
    },
  },
  {
    name: "Electro-Harmonix Small Clone",
    slug: "ehx-small-clone",
    type: "effect",
    subcategory: "chorus",
    manufacturer: "Electro-Harmonix",
    icon_type: "boss_compact",
    icon_color: "#06b6d4",
    description:
      "Simple, lush analog chorus. Only one knob (Rate) and a depth switch. Kurt Cobain used it on Come As You Are and throughout Nirvana's catalog for that watery, underwater quality.",
    default_settings: {
      knobs: [
        { name: "Rate", min: 0, max: 10 },
        { name: "Depth", options: ["shallow", "deep"] },
      ],
    },
    modeler_equivalents: {
      helix: "70s Chorus",
      quad_cortex: "Small Clone",
      tonex: "Chorus",
      fractal: "Analog Chorus",
      kemper: "Small Clone",
      katana: "CE-1 Chorus (Mod)",
    },
  },
];

export const toneRecipes: ToneRecipe[] = [
  {
    id: "seed-srv-pride-and-joy",
    song_slug: "pride-and-joy-stevie-ray-vaughan",
    title: "SRV's Pride and Joy Rhythm Tone",
    slug: "srv-pride-and-joy-rhythm",
    description:
      "The definitive Texas blues shuffle tone. SRV's tone on Pride and Joy is built on an incredibly simple signal chain: a Stratocaster with absurdly heavy strings, a Tube Screamer used as a clean boost, and a cranked Fender Vibroverb. The magic is in the player's hands and the amp being pushed hard. The Tube Screamer is not set for distortion; it's adding mids and pushing the amp's front end into breakup.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster (#1 / 'Number One')",
      pickup_config: "SSS",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25.5",
      tuning: "eb_standard",
      string_gauge: ".013-.058",
      notable_mods:
        "Extremely heavy strings for a Strat. Tuned down half step to Eb. Left-handed neck on a right-handed body. Rosewood fingerboard.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "overdrive",
        gear_slug: "ibanez-tube-screamer-ts808",
        gear_name: "Ibanez Tube Screamer TS808",
        icon_type: "boss_compact",
        icon_color: "#22c55e",
        is_in_effects_loop: false,
        settings: { Drive: 3, Tone: 6, Level: 8 },
        notes:
          "Drive is LOW. This is not an overdrive sound; it's a clean boost with a mid-hump. The Level is high to slam the front of the amp. The Tone adds some brightness to cut through.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-vibroverb-blackface",
        gear_name: "Fender Vibroverb (1964 Blackface)",
        icon_type: "fender_combo",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: { Volume: 8, Treble: 6, Bass: 4, Reverb: 3, Speed: 0 },
        notes:
          "Volume is cranked high. This amp should be on the edge of breakup on its own. The Tube Screamer pushes it over into that fat, singing overdrive. Bass is kept moderate to avoid muddiness with the heavy strings. A touch of spring reverb adds depth.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Built-in 1x15 JBL D130F",
        icon_type: "cab_1x12",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Vibroverb is a combo amp with a built-in 1x15 speaker. The JBL D130F is a full-range speaker that gives a rounder, fatter tone than a typical guitar speaker. SRV also ran a Fender Super Reverb (4x10) simultaneously.",
      },
      {
        position: 4,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "slightly off-axis" },
        notes:
          "Standard SM57 placement, slightly off the center of the cone for a touch of warmth. On the Texas Flood album, the recording is relatively dry and direct.",
      },
    ],
    original_gear: {
      guitar:
        "Fender Stratocaster #1 ('Number One') with .013-.058 strings, tuned to Eb",
      effects: ["Ibanez TS808 Tube Screamer"],
      amp: "Fender Vibroverb (1964 Blackface) + Fender Super Reverb",
      cabinet:
        "Built-in 1x15 JBL D130F (Vibroverb) + 4x10 (Super Reverb)",
      microphone: "Shure SM57 (standard studio setup)",
      other_notes:
        "SRV's tone is largely in his hands. The heavy strings, aggressive pick attack, and Eb tuning are as important as the gear. He played HARD.",
    },
    tags: ["blues", "texas-blues", "overdrive", "clean-boost", "shuffle", "srv"],
    sources: [
      "https://www.guitarworld.com/features/stevie-ray-vaughan-gear-rig",
      "https://equipboard.com/pros/stevie-ray-vaughan",
      "https://www.premierguitar.com/artists/stevie-ray-vaughan-rig-rundown",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Scream 808",
            block_category: "Distortion",
            original_gear: "Ibanez TS808",
            settings: { Drive: 3.0, Tone: 6.0, Level: 8.0 },
            notes: "Found under Distortion > Overdrive. Keep the Drive low.",
          },
          {
            position: 2,
            block_name: "US Deluxe Vib",
            block_category: "Amp",
            original_gear: "Fender Vibroverb",
            settings: {
              Drive: 7.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 6.0,
              Presence: 5.0,
              "Ch Vol": 7.5,
            },
            notes:
              "This is the closest Helix model to a blackface Vibroverb. Push the Drive to get that edge-of-breakup character.",
          },
          {
            position: 3,
            block_name: "1x15 Ampeg",
            block_category: "Cab",
            original_gear: "1x15 JBL D130F",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes:
              "Helix doesn't have an exact 1x15 JBL match. The 1x15 Ampeg cab is the closest for that round, full low-end. Alternatively, use a 4x10 Tweed cab to approximate the Super Reverb.",
          },
        ],
        notes:
          "For an even more authentic SRV tone on Helix, try stacking the Scream 808 with a Kinky Boost (Xotic EP Booster equivalent) before it. This gives more of that pushed-amp compression SRV was known for.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "TS808 OD",
            block_category: "Drive",
            original_gear: "Ibanez TS808",
            settings: { Drive: 3.0, Tone: 6.0, Level: 8.0 },
            notes: "Under Stomp > Drive.",
          },
          {
            position: 2,
            block_name: "Vibro Verb",
            block_category: "Amp",
            original_gear: "Fender Vibroverb",
            settings: {
              Gain: 7.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 7.5,
            },
            notes:
              "The QC's Vibro Verb capture is quite accurate. Push the gain.",
          },
          {
            position: 3,
            block_name: "1x15 Vibroverb",
            block_category: "Cab",
            original_gear: "1x15 JBL D130F",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes:
              "If not available as a stock cab, load a third-party Vibroverb IR.",
          },
        ],
        notes:
          "The Quad Cortex excels at this type of tone. Its captures of real Vibroverbs are available on Cortex Cloud and will be more accurate than the stock amp model.",
      },
      tonex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "TS808",
            block_category: "Stomp",
            original_gear: "Ibanez TS808",
            settings: { Drive: 3.0, Tone: 6.0, Level: 8.0 },
            notes:
              "TONEX includes a TS808 stomp model in the effects section.",
          },
          {
            position: 2,
            block_name: "Search ToneNET for 'Vibroverb' or 'SRV'",
            block_category: "Tone Model",
            original_gear: "Fender Vibroverb",
            settings: {},
            notes:
              "TONEX's strength is AI-captured tone models. Search ToneNET for community captures of real Vibroverbs. Look for captures labeled 'blackface' with the gain set to edge of breakup.",
          },
        ],
        notes:
          "TONEX works differently from Helix and QC. Instead of modeling individual amp components, it captures the entire amp+cab+mic chain as a single 'Tone Model.' For SRV tone, find a good Vibroverb capture on ToneNET and put the TS808 stomp before it.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Fender Vibroverb",
            settings: {
              Gain: 6,
              Bass: 4,
              Middle: 6,
              Treble: 6,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "The Katana's Crunch channel at moderate gain approximates a pushed blackface Fender. It won't perfectly replicate the Vibroverb's 1x15 speaker character, but the Crunch channel gets close to that warm breakup.",
          },
          {
            position: 2,
            block_name: "Blues Driver",
            block_category: "Booster",
            original_gear: "Ibanez TS808",
            settings: { Level: 8, Tone: 6, Drive: 3 },
            notes:
              "Set the Booster to Blues Driver in Boss Tone Studio. Acts as the Tube Screamer mid-boost — low drive, high level to push the amp's front end.",
          },
        ],
        notes:
          "The Katana's Crunch channel at moderate gain approximates a pushed blackface Fender. The Blues Driver in the Booster slot acts as the Tube Screamer mid-boost. Set the Booster to Blues Driver in Boss Tone Studio. The Katana won't perfectly replicate the Vibroverb's 1x15 speaker character, but the Crunch channel gets close to that warm breakup.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    id: "seed-gilmour-comfortably-numb",
    song_slug: "comfortably-numb-pink-floyd",
    title: "Gilmour's Comfortably Numb Solo Tone",
    slug: "gilmour-comfortably-numb-solo",
    description:
      "Arguably the most famous guitar solo tone ever recorded. Gilmour's tone on the second solo of Comfortably Numb is built on a Big Muff Pi fuzz into a cranked Hiwatt, with delay adding depth and sustain. The Hiwatt provides clean headroom while the Big Muff does the heavy lifting for gain and sustain. The result is a singing, vocal-like lead tone that sustains endlessly.",
    tone_context: "solo",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster (Black Strat)",
      pickup_config: "SSS",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".010-.048",
      notable_mods:
        "The 'Black Strat' has been extensively modified over the years. For The Wall era: stock pickups, shortened tremolo arm, black pickguard.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "compressor",
        gear_slug: null,
        gear_name: "MXR Dyna Comp",
        icon_type: "mxr",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Output: 7, Sensitivity: 5 },
        notes:
          "Light compression to even out dynamics and add sustain. Gilmour keeps this subtle; it's about consistency, not squash.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "fuzz",
        gear_slug: "electro-harmonix-big-muff-pi",
        gear_name: "Electro-Harmonix Big Muff Pi (Ram's Head era)",
        icon_type: "large_format",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Volume: 7, Tone: 6, Sustain: 8 },
        notes:
          "The Big Muff is the heart of this tone. Sustain (gain) is high but not maxed. The Tone knob is set above noon to keep the sound open and present, not dark and muddy. The scooped mids of the Big Muff are what give this solo its distinctive character.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "hiwatt-dr103",
        gear_name: "Hiwatt DR103 Custom 100",
        icon_type: "marshall_head",
        icon_color: "#4a4a6a",
        is_in_effects_loop: false,
        settings: {
          "Normal Vol": 5,
          "Brilliant Vol": 0,
          Bass: 4,
          Treble: 6,
          Presence: 6,
          Master: 7,
        },
        notes:
          "The Hiwatt stays relatively clean even at volume. It provides a massive, full-range platform for the Big Muff. Gilmour runs the Normal channel only, no Brilliant channel.",
      },
      {
        position: 4,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "Binson Echorec / MXR Digital Delay",
        icon_type: "large_format",
        icon_color: "#8b5cf6",
        is_in_effects_loop: true,
        settings: { Time: "440ms", Repeats: 4, Mix: 30 },
        notes:
          "Delay adds depth and a sense of space. The time is set for a musical repeat that fills the gaps between phrases. For The Wall recording, a combination of tape echo and digital delay was used. The delay goes AFTER the amp (in the effects loop or after the preamp in a modeler) so the repeats stay clean.",
      },
      {
        position: 5,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "WEM 4x12 Cabinet (Fane speakers)",
        icon_type: "cab_4x12",
        icon_color: "#4a4a6a",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "Gilmour used WEM (Watkins) 4x12 cabinets loaded with Fane Crescendo speakers. These have a different character than Celestion-loaded Marshalls: more open, more hi-fi, less midrange honk.",
      },
      {
        position: 6,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57 + Sennheiser MD421",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: {
          Position: "SM57 on-axis, MD421 off-axis, blended",
        },
        notes:
          "The Wall was engineered with meticulous mic placement. A blend of close mics and room mics captures the full depth of the tone.",
      },
    ],
    original_gear: {
      guitar: "Fender Stratocaster ('The Black Strat'), neck pickup",
      effects: [
        "MXR Dyna Comp (light)",
        "Electro-Harmonix Big Muff Pi (Ram's Head)",
        "Binson Echorec (delay)",
      ],
      amp: "Hiwatt DR103 Custom 100",
      cabinet: "WEM 4x12 with Fane Crescendo speakers",
      microphone: "SM57 + MD421 blend",
      other_notes:
        "The Wall was recorded at multiple studios. This tone varies slightly between the studio recording and live performances. For the studio version, the delay is more subtle. Live, Gilmour uses more delay and a rotating speaker effect.",
    },
    tags: [
      "progressive-rock",
      "lead",
      "fuzz",
      "delay",
      "sustain",
      "gilmour",
      "pink-floyd",
    ],
    sources: [
      "https://www.gilmourish.com/",
      "https://equipboard.com/pros/david-gilmour",
      "https://www.guitarworld.com/features/david-gilmour-gear",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Deluxe Comp",
            block_category: "Dynamics",
            original_gear: "MXR Dyna Comp",
            settings: { Level: 6.0, Threshold: -20, Ratio: 4 },
            notes: "Light compression. Don't overdo it.",
          },
          {
            position: 2,
            block_name: "Triangle Fuzz",
            block_category: "Distortion",
            original_gear: "Big Muff Pi",
            settings: { Fuzz: 8.0, Level: 7.0, Tone: 6.0 },
            notes:
              "The Triangle Fuzz is Helix's Big Muff variant. Keep the Tone above noon.",
          },
          {
            position: 3,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Hiwatt DR103",
            settings: {
              Drive: 5.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 6.0,
              Presence: 6.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix doesn't have a dedicated Hiwatt model. The Brit Plexi Brt set clean is a reasonable starting point. Alternatively, use the Cartographer (Benson Chimera) for more headroom.",
          },
          {
            position: 4,
            block_name: "Transistor Tape",
            block_category: "Delay",
            original_gear: "Binson Echorec",
            settings: { Time: "440ms", Feedback: 35, Mix: 30 },
            notes:
              "Place this AFTER the amp+cab block. The Transistor Tape has a warm, slightly degraded repeat character similar to the Echorec.",
          },
          {
            position: 5,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "WEM 4x12 Fane",
            settings: { Mic: "57 Dynamic", Distance: 3.0 },
            notes:
              "No exact WEM/Fane match on Helix. The Greenback cab is the closest stock option. For more accuracy, load a third-party Hiwatt/WEM IR.",
          },
        ],
        notes:
          "For the most authentic Gilmour Comfortably Numb tone on Helix, consider loading a third-party Hiwatt IR (many are available for free from Helix community sites). The amp and cab models are the weakest link in this chain; everything else translates well.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Lead",
            block_category: "Amp Type",
            original_gear: "Hiwatt DR103",
            settings: {
              Gain: 4,
              Bass: 4,
              Middle: 5,
              Treble: 6,
              Presence: 6,
              Volume: 6,
            },
            notes:
              "The Katana's Lead channel provides more headroom than Crunch, similar to how the Hiwatt stays clean. Keep gain relatively low so the Muff does the heavy lifting.",
          },
          {
            position: 2,
            block_name: "Muff Fuzz",
            block_category: "Booster",
            original_gear: "Big Muff Pi",
            settings: { Sustain: 8, Tone: 6, Level: 7 },
            notes:
              "The Katana has a built-in Muff Fuzz in the Booster section via Boss Tone Studio. This is the heart of the Gilmour solo tone.",
          },
          {
            position: 3,
            block_name: "Digital Delay",
            block_category: "FX",
            original_gear: "Binson Echorec",
            settings: { Time: "440ms", Feedback: 35, Level: 30 },
            notes:
              "Add Digital Delay in the FX section for the spacious Gilmour sustain. Set the time to 440ms for musical repeats that fill gaps between phrases.",
          },
        ],
        notes:
          "The Katana has a built-in Muff Fuzz in the Booster section (Boss Tone Studio). Set the Lead channel relatively clean so the Muff does the heavy lifting. Add Digital Delay in the FX section for the spacious Gilmour sustain. The Katana's Lead channel provides more headroom than Crunch, similar to how the Hiwatt stays clean.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    id: "seed-hendrix-voodoo-child",
    song_slug: "voodoo-child-slight-return-jimi-hendrix",
    title: "Hendrix's Voodoo Child Wah Tone",
    slug: "hendrix-voodoo-child-wah",
    description:
      "The ultimate wah-fuzz guitar tone. Hendrix's Voodoo Child (Slight Return) opens with one of the most recognizable wah licks ever recorded. The tone is built on a Cry Baby wah into a germanium Fuzz Face, slamming a cranked Marshall Plexi. The wah isn't just an effect here; it's an integral part of the voice of the guitar, used as a tonal filter that shapes every note. The Fuzz Face provides thick, singing sustain that cleans up dynamically when Hendrix rolls back his guitar volume.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster",
      pickup_config: "SSS",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".010-.038",
      notable_mods:
        "Right-handed Strat played left-handed, upside down. Reverse headstock changes string tension and sustain characteristics. The bridge pickup is angled differently due to the flip, subtly altering the tonal balance.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "wah",
        gear_slug: "dunlop-cry-baby-wah",
        gear_name: "Dunlop Cry Baby Wah",
        icon_type: "wah",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: { Position: "rocked back and forth" },
        notes:
          "Hendrix used the wah as a tonal filter, not just a sweeping effect. He would park it at certain positions to shape the frequency peak, then rock it expressively during solos. The wah goes BEFORE the fuzz; this order is critical. Wah before fuzz gives a more vocal, expressive sweep.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "fuzz",
        gear_slug: "dallas-arbiter-fuzz-face",
        gear_name: "Dallas Arbiter Fuzz Face",
        icon_type: "large_format",
        icon_color: "#3b82f6",
        is_in_effects_loop: false,
        settings: { Volume: 8, Fuzz: 7 },
        notes:
          "Germanium transistor Fuzz Face. The magic of this pedal is its responsiveness to guitar volume: dimed for full roaring fuzz, rolled back to 6-7 for a cleaner crunch. Hendrix constantly rode his volume knob. Fuzz not fully maxed to retain note clarity and dynamic range.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959",
        icon_type: "marshall_head",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {
          Presence: 6,
          Bass: 5,
          Middle: 8,
          Treble: 7,
          "Volume I": 10,
          "Volume II": 10,
        },
        notes:
          "Both volumes cranked to full. The cranked Plexi is the foundation of the Hendrix tone: natural tube saturation, harmonic richness, and feedback at will. The amp is doing a lot of the heavy lifting for sustain and harmonic content. Mids are pushed high to cut through.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "Celestion G12M Greenback speakers. The warm, woody midrange of the Greenbacks complements the aggressive fuzz and wah, preventing the tone from becoming harsh or brittle. Hendrix typically used multiple 4x12 cabinets for massive volume.",
      },
      {
        position: 5,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "on-axis, close-miked" },
        notes:
          "Standard close-miking technique for guitar cabinets. On-axis placement captures the full brightness and aggression of the tone, which suits the raw energy of this track.",
      },
    ],
    original_gear: {
      guitar:
        "Fender Stratocaster (right-handed, played left-handed upside down), bridge pickup, .010-.038 strings",
      effects: [
        "Dunlop Cry Baby Wah",
        "Dallas Arbiter Fuzz Face (germanium)",
      ],
      amp: "Marshall Super Lead 1959 (Plexi), both channels cranked",
      cabinet: "Marshall 4x12 with Celestion G12M Greenbacks",
      microphone: "Shure SM57 (on-axis, close-miked)",
      other_notes:
        "Hendrix's tone is inseparable from his technique: aggressive pick attack, constant use of the wah and volume knob, and controlled feedback from standing close to the cranked amp stacks. The reverse-strung Strat also contributes to his unique sound.",
    },
    tags: ["rock", "psychedelic", "fuzz", "wah", "hendrix", "blues-rock"],
    sources: [
      "https://equipboard.com/pros/jimi-hendrix",
      "https://www.guitarworld.com/features/jimi-hendrix-gear-guide",
      "https://www.premierguitar.com/artists/jimi-hendrix-tone",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Chrome",
            block_category: "Wah",
            original_gear: "Dunlop Cry Baby Wah",
            settings: { Position: "Expression Pedal" },
            notes:
              "Assign to an expression pedal for real-time control. The Chrome wah is Helix's Cry Baby model. Set the auto-engage to on so it activates when you move the pedal.",
          },
          {
            position: 2,
            block_name: "Arbitrator Fuzz",
            block_category: "Distortion",
            original_gear: "Dallas Arbiter Fuzz Face",
            settings: { Fuzz: 7.0, Level: 8.0 },
            notes:
              "Found under Distortion > Fuzz. This is the Helix's Fuzz Face model. Responds well to guitar volume changes just like the original.",
          },
          {
            position: 3,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 9.0,
              Bass: 5.0,
              Mid: 8.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 8.0,
            },
            notes:
              "The Brit Plexi Brt is Helix's Plexi model. Crank the Drive to simulate dimed volume knobs. Keep the mids high for that cutting Hendrix character.",
          },
          {
            position: 4,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes:
              "Close-miked with a 57 on-axis for maximum presence and bite. Matches the original recording approach.",
          },
        ],
        notes:
          "The key to this patch is having the wah on an expression pedal and using your guitar volume knob actively. The Fuzz Face model cleans up with volume changes, which is essential for authentic Hendrix dynamics.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Wah",
            block_category: "Wah",
            original_gear: "Dunlop Cry Baby Wah",
            settings: { Position: "Expression Pedal" },
            notes:
              "Assign to the QC's built-in expression pedal. The stock wah model works well for this tone.",
          },
          {
            position: 2,
            block_name: "Fuzz Face",
            block_category: "Drive",
            original_gear: "Dallas Arbiter Fuzz Face",
            settings: { Fuzz: 7.0, Volume: 8.0 },
            notes:
              "Under Stomp > Drive. The QC's Fuzz Face model captures the germanium character well. Responds to guitar volume dynamics.",
          },
          {
            position: 3,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 9.0,
              Bass: 5.0,
              Mid: 8.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 8.0,
            },
            notes:
              "The QC's Plexi model. Push the gain high to emulate cranked Plexi behavior. Community captures of real Plexis on Cortex Cloud can add extra authenticity.",
          },
          {
            position: 4,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes:
              "Close-miked Greenback cab. On-axis for brightness and cut.",
          },
        ],
        notes:
          "The Quad Cortex handles fuzz pedals particularly well. For even more authenticity, search Cortex Cloud for captures of real Plexi amps paired with Fuzz Faces. Use the built-in expression pedal for wah control.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 8,
              Bass: 5,
              Middle: 8,
              Treble: 7,
              Presence: 6,
              Volume: 7,
            },
            notes:
              "The Katana's Brown channel is its Marshall-voiced high-gain mode. Crank the gain for cranked Plexi character. Push the mids high for that cutting Hendrix tone.",
          },
          {
            position: 2,
            block_name: "Fuzz Face",
            block_category: "Booster",
            original_gear: "Dallas Arbiter Fuzz Face",
            settings: { Fuzz: 7, Level: 8 },
            notes:
              "The Fuzz Face is available in the Booster section via Boss Tone Studio. Responds to guitar volume knob changes for dynamic clean-up.",
          },
          {
            position: 3,
            block_name: "Pedal Wah",
            block_category: "Pedal FX",
            original_gear: "Dunlop Cry Baby Wah",
            settings: { Position: "Expression Pedal (GA-FC)" },
            notes:
              "For the wah, you'll need the GA-FC foot controller or use the Tone Studio to assign the Pedal FX to wah. Without an expression pedal, try the Touch Wah in Auto mode.",
          },
        ],
        notes:
          "The Katana's Brown channel is its Marshall-voiced high-gain mode. Crank the gain for cranked Plexi character. The Fuzz Face is available in the Booster section via Boss Tone Studio. For the wah, you'll need the GA-FC foot controller or use the Tone Studio to assign the Pedal FX to wah. Without an expression pedal, try the Touch Wah in Auto mode.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    id: "seed-cobain-teen-spirit",
    song_slug: "smells-like-teen-spirit-nirvana",
    title: "Cobain's Teen Spirit Grunge Tone",
    slug: "cobain-teen-spirit-grunge",
    description:
      "The tone that defined a generation. Cobain's approach to guitar tone was anti-perfectionist: a cheap offset guitar, a Boss DS-1 cranked for maximum aggression, and a Small Clone chorus adding an underwater shimmer. The genius of Teen Spirit is the quiet-verse/loud-chorus dynamic. The verses are clean with chorus; the choruses slam the DS-1 for a wall of scooped, angry distortion. The mid-scooped character is key to the grunge sound: heavy lows, biting highs, and a hollow midrange.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Mustang",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Cobain preferred cheap offset guitars. The Mustang's shorter 24\" scale length contributes to a looser, slinkier feel. Stock humbuckers provide a thicker, darker tone than single-coils.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "distortion",
        gear_slug: "boss-ds1",
        gear_name: "Boss DS-1 Distortion",
        icon_type: "boss_compact",
        icon_color: "#f97316",
        is_in_effects_loop: false,
        settings: { Dist: 8, Tone: 5, Level: 7 },
        notes:
          "The DS-1 is the primary gain source for the chorus sections. Dist is cranked high for maximum aggression. Tone at noon keeps it balanced, not too shrill or too dark. During the clean verses, the DS-1 is bypassed and the sound comes from the amp's clean channel with just the chorus engaged.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "chorus",
        gear_slug: "ehx-small-clone",
        gear_name: "Electro-Harmonix Small Clone",
        icon_type: "boss_compact",
        icon_color: "#06b6d4",
        is_in_effects_loop: false,
        settings: { Rate: 4, Depth: "deep" },
        notes:
          "The Small Clone adds an underwater, wobbly quality. It's most noticeable on the clean verse parts, but Cobain left it on during the distorted chorus sections as well, adding a subtle thickening and detune to the wall of distortion. Depth switch set to deep for maximum effect.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: null,
        gear_name: "Mesa/Boogie Studio .22 Preamp",
        icon_type: "marshall_head",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: { Gain: 6, Master: 7, Treble: 5, Mid: 3, Bass: 6 },
        notes:
          "The scooped mid character is essential to the grunge sound. Mids are pulled back to 3, creating that hollow, aggressive tone. Bass is pushed for weight, treble is moderate. The Mesa preamp provides additional gain staging on top of the DS-1 for the chorus sections, creating a thick, compressed wall of distortion.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Mesa 1x12 Cabinet",
        icon_type: "cab_1x12",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "A 1x12 cabinet has a tighter, more focused sound than a 4x12. Less low-end spread but more punch. This matches the raw, in-your-face quality of the Nevermind recordings.",
      },
      {
        position: 5,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "on-axis, close-miked" },
        notes:
          "Standard SM57 close-miking. Butch Vig's production on Nevermind involved extensive layering and double-tracking of guitars, which adds to the massive chorus sound.",
      },
    ],
    original_gear: {
      guitar:
        "Fender Mustang with humbuckers, bridge pickup, standard tuning",
      effects: [
        "Boss DS-1 Distortion (chorus sections)",
        "Electro-Harmonix Small Clone (always on)",
      ],
      amp: "Mesa/Boogie Studio .22 Preamp",
      cabinet: "Mesa 1x12",
      microphone: "Shure SM57",
      other_notes:
        "The Nevermind guitar tracks were heavily layered and double-tracked by producer Butch Vig. The raw, lo-fi quality Cobain preferred was polished significantly in production. For a more authentic live Cobain tone, use more gain and less polish.",
    },
    tags: ["grunge", "alternative", "distortion", "chorus", "cobain", "punk"],
    sources: [
      "https://equipboard.com/pros/kurt-cobain",
      "https://www.guitarworld.com/features/kurt-cobain-gear-nirvana",
      "https://www.premierguitar.com/artists/kurt-cobain-rig",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Deez One Vintage",
            block_category: "Distortion",
            original_gear: "Boss DS-1",
            settings: { Dist: 8.0, Tone: 5.0, Level: 7.0 },
            notes:
              "Helix's DS-1 model. Set up a footswitch to toggle this on for chorus sections and off for clean verses. The Deez One Vintage captures the bright, aggressive DS-1 character accurately.",
          },
          {
            position: 2,
            block_name: "70s Chorus",
            block_category: "Modulation",
            original_gear: "EHX Small Clone",
            settings: { Speed: 4.0, Depth: 7.0, Mix: 60 },
            notes:
              "The 70s Chorus is Helix's analog chorus model. Leave this on for the entire song. The deep, wobbly character is essential to the Cobain sound.",
          },
          {
            position: 3,
            block_name: "US Double Nrm",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Studio .22",
            settings: {
              Drive: 6.0,
              Bass: 6.0,
              Mid: 3.0,
              Treble: 5.0,
              Presence: 5.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix doesn't have an exact Mesa .22 model. The US Double Nrm (based on Mesa Dual Rectifier) in the normal channel provides a similar scooped, high-gain Mesa character. Keep the mids low for that grunge scoop.",
          },
          {
            position: 4,
            block_name: "1x12 US Deluxe",
            block_category: "Cab",
            original_gear: "Mesa 1x12",
            settings: { Mic: "57 Dynamic", Distance: 1.5 },
            notes:
              "A 1x12 cab keeps the sound focused and punchy. The US Deluxe cab adds the right American-voiced character.",
          },
        ],
        notes:
          "Set up snapshots or footswitches to toggle between the clean verse (DS-1 off, chorus only, amp clean) and the loud chorus (DS-1 on, amp driven). This quiet/loud dynamic is the core of the song.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "DS-1",
            block_category: "Drive",
            original_gear: "Boss DS-1",
            settings: { Dist: 8.0, Tone: 5.0, Level: 7.0 },
            notes:
              "Under Stomp > Drive. Toggle with a footswitch for verse/chorus dynamics.",
          },
          {
            position: 2,
            block_name: "Small Clone",
            block_category: "Modulation",
            original_gear: "EHX Small Clone",
            settings: { Rate: 4.0, Depth: 7.0 },
            notes:
              "Leave on for the entire song. The QC's Small Clone model captures the lush analog character well.",
          },
          {
            position: 3,
            block_name: "Mesa .22",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Studio .22",
            settings: {
              Gain: 6.0,
              Bass: 6.0,
              Mid: 3.0,
              Treble: 5.0,
              Master: 7.0,
            },
            notes:
              "If the stock Mesa .22 model is not available, use a Mesa Rectifier model on the clean channel with scooped mids. Community captures of Mesa amps are abundant on Cortex Cloud.",
          },
          {
            position: 4,
            block_name: "1x12 Mesa",
            block_category: "Cab",
            original_gear: "Mesa 1x12",
            settings: { Mic: "SM57", Distance: "1.5 inches" },
            notes: "A tight 1x12 for focused, punchy grunge tone.",
          },
        ],
        notes:
          "Use the QC's scene or stomp mode to switch between clean verses and distorted choruses. The DS-1 toggle is the heart of this patch. For extra authenticity, search Cortex Cloud for Nevermind-era tone captures.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Lead",
            block_category: "Amp Type",
            original_gear: "Mesa/Boogie Studio .22",
            settings: {
              Gain: 7,
              Bass: 6,
              Middle: 3,
              Treble: 5,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "Scoop the mids on the Lead channel for the grunge character. The Lead channel provides the aggressive gain needed for the chorus sections.",
          },
          {
            position: 2,
            block_name: "DS-1",
            block_category: "Booster",
            original_gear: "Boss DS-1",
            settings: { Dist: 8, Tone: 5, Level: 7 },
            notes:
              "The DS-1 is a Boss pedal, and its digital model in the Katana is one of the most accurate recreations available. Toggle this on for chorus sections and off for clean verses.",
          },
          {
            position: 3,
            block_name: "Chorus (CE-1)",
            block_category: "Mod",
            original_gear: "EHX Small Clone",
            settings: { Rate: 4, Depth: 60 },
            notes:
              "CE-1 type chorus adds the underwater Cobain shimmer. Leave on for the entire song — it thickens both clean and distorted tones.",
          },
        ],
        notes:
          "This is where the Katana really shines — the DS-1 is a Boss pedal, and its digital model in the Katana is one of the most accurate recreations available. Scoop the mids on the Lead channel for the grunge character. Set up two patches in Tone Studio: one clean with just chorus for verses, one with DS-1 engaged for choruses. Use the channel switch to toggle.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    id: "seed-frusciante-under-the-bridge",
    song_slug: "under-the-bridge-red-hot-chili-peppers",
    title: "Frusciante's Under the Bridge Clean Tone",
    slug: "frusciante-under-the-bridge-clean",
    description:
      "One of the most beautiful clean guitar tones in rock. The intro to Under the Bridge is Frusciante alone, playing delicate chord voicings on the neck pickup of a 1962 Stratocaster through a clean Marshall with a touch of chorus. The tone is warm, round, and shimmering, with the CE-1 chorus adding subtle movement that keeps the sound alive and breathing. The neck pickup is essential: it provides the full, rounded character that makes this tone so inviting. The Marshall is run clean at low volume, a departure from the typical cranked Marshall approach.",
    tone_context: "intro",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster",
      pickup_config: "SSS",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "1962 Stratocaster with stock single-coils. The neck pickup is key for the warm, round clean tone of the intro. Vintage-spec single-coils have a lower output and a sweeter, more articulate character than modern replacements.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "chorus",
        gear_slug: null,
        gear_name: "Boss CE-1 Chorus Ensemble",
        icon_type: "large_format",
        icon_color: "#7c3aed",
        is_in_effects_loop: false,
        settings: { Rate: 3, Depth: 6 },
        notes:
          "The CE-1 is the original Boss chorus pedal, a large floor unit with both chorus and vibrato modes. It adds a subtle, warm shimmer that gives the clean tone its signature movement. Rate is slow to avoid obvious warbling; depth is moderate for noticeable but not overwhelming modulation. The CE-1 also adds a slight coloration and warmth from its preamp stage.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: null,
        gear_name: "Marshall Major 200W",
        icon_type: "marshall_head",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {
          Volume: 3,
          Treble: 7,
          Mid: 5,
          Bass: 4,
          Presence: 6,
        },
        notes:
          "Running the Marshall clean at low volume is the key here. The 200-watt Marshall Major has enormous headroom, meaning it stays clean even at moderate volumes. Volume at 3 keeps the amp well below breakup. Treble is pushed higher than usual to maintain clarity and sparkle on the clean tone. Bass is kept moderate to avoid muddiness with the neck pickup.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Greenback 4x12 adds warmth and body even at clean settings. The speaker's natural midrange character complements the Stratocaster's neck pickup, filling out the lower-mid frequencies.",
      },
      {
        position: 4,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "slightly off-axis" },
        notes:
          "Slightly off-axis to soften the high end and capture a warmer, more rounded clean tone. Blood Sugar Sex Magik was recorded in a mansion (The Mansion), and the room ambience contributes to the spacious feel of the recording.",
      },
    ],
    original_gear: {
      guitar:
        "1962 Fender Stratocaster, neck pickup, stock single-coils, standard tuning",
      effects: ["Boss CE-1 Chorus Ensemble (chorus mode, subtle)"],
      amp: "Marshall Major 200W (clean, low volume)",
      cabinet: "Marshall 4x12 with Celestion Greenbacks",
      microphone: "Shure SM57 (slightly off-axis)",
      other_notes:
        "Blood Sugar Sex Magik was produced by Rick Rubin and recorded at The Mansion in Los Angeles. The natural room reverb of the mansion contributes to the spacious, ambient quality of the guitar tone. Frusciante's light touch and fingerpicking technique are as important as the gear for this intro.",
    },
    tags: ["alternative", "clean", "chorus", "funk-rock", "frusciante", "rock"],
    sources: [
      "https://equipboard.com/pros/john-frusciante",
      "https://www.guitarworld.com/features/john-frusciante-gear-guide",
      "https://www.premierguitar.com/artists/john-frusciante-rig-rundown",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "70s Chorus",
            block_category: "Modulation",
            original_gear: "Boss CE-1 Chorus Ensemble",
            settings: { Speed: 3.0, Depth: 6.0, Mix: 50 },
            notes:
              "The 70s Chorus captures the warm analog character of vintage chorus pedals. Keep the speed low and depth moderate for a subtle shimmer rather than obvious modulation.",
          },
          {
            position: 2,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Major 200W",
            settings: {
              Drive: 2.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 5.0,
            },
            notes:
              "Helix doesn't have a Marshall Major model. The Brit Plexi Brt set to very low gain approximates the clean Marshall tone. Keep Drive low for pristine cleans. The treble push is important for maintaining sparkle.",
          },
          {
            position: 3,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 3.0 },
            notes:
              "Pull the mic distance back slightly for a warmer, more ambient capture that suits the clean tone. The Greenback cab adds warmth and body.",
          },
        ],
        notes:
          "This is a simple, elegant patch. The focus is on the clean amp tone and subtle chorus. Use the neck pickup on your guitar and play with a light touch. Adding a subtle room reverb block at the end of the chain can help recreate the ambient quality of The Mansion recording.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "CE-1",
            block_category: "Modulation",
            original_gear: "Boss CE-1 Chorus Ensemble",
            settings: { Rate: 3.0, Depth: 6.0 },
            notes:
              "The QC's CE-1 model if available, or use a generic analog chorus. Subtle settings for warm shimmer.",
          },
          {
            position: 2,
            block_name: "Marshall Major",
            block_category: "Amp",
            original_gear: "Marshall Major 200W",
            settings: {
              Gain: 2.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 5.0,
            },
            notes:
              "If a Marshall Major model is not available, use a Plexi model set very clean. The key is low gain with pushed treble for sparkle. Search Cortex Cloud for clean Marshall captures.",
          },
          {
            position: 3,
            block_name: "4x12 Green",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "3 inches" },
            notes:
              "Slightly pulled back mic for a warmer clean capture.",
          },
        ],
        notes:
          "A minimalist patch that relies on a quality clean amp tone and subtle chorus. The QC's high-fidelity amp modeling shines on clean tones like this. Consider adding a light room reverb at the end of the chain to emulate The Mansion's natural ambience.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Marshall Major 200W",
            settings: {
              Gain: 3,
              Bass: 4,
              Middle: 5,
              Treble: 7,
              Presence: 6,
              Volume: 5,
            },
            notes:
              "The Katana's Clean channel excels at this. It has plenty of headroom for pristine cleans. Push the treble for sparkle on the neck pickup.",
          },
          {
            position: 2,
            block_name: "CE-1 Chorus",
            block_category: "Mod",
            original_gear: "Boss CE-1 Chorus Ensemble",
            settings: { Rate: 3, Depth: 6 },
            notes:
              "The built-in Boss chorus effects (CE-1 available via Tone Studio) are some of the best digital recreations. Keep the rate slow and depth moderate for warm shimmer.",
          },
        ],
        notes:
          "The Katana's Clean channel excels at this. It has plenty of headroom for pristine cleans. The built-in Boss chorus effects (CE-1 available via Tone Studio) are some of the best digital recreations. Push the treble for sparkle on the neck pickup. This is one of the easiest tones to nail on the Katana.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}

export function getRecipeBySlug(slug: string): ToneRecipe | undefined {
  return toneRecipes.find((r) => r.slug === slug);
}

export function getRecipesBySongSlug(songSlug: string): ToneRecipe[] {
  return toneRecipes.filter((r) => r.song_slug === songSlug);
}

export function getSongsByArtistSlug(artistSlug: string): Song[] {
  return songs.filter((s) => s.artist_slug === artistSlug);
}

export function getGearBySlug(slug: string): GearItem | undefined {
  return gearItems.find((g) => g.slug === slug);
}

export function getAllGenres(): string[] {
  const genreSet = new Set<string>();
  for (const song of songs) {
    for (const genre of song.genres) {
      genreSet.add(genre);
    }
  }
  return Array.from(genreSet).sort();
}

export function searchRecipes(query: string): ToneRecipe[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  return toneRecipes.filter((recipe) => {
    const haystack = [
      recipe.title,
      recipe.description,
      ...recipe.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(lower);
  });
}
