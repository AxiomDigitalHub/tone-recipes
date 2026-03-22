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
  {
    name: "Slash",
    slug: "slash",
    bio: "Guns N' Roses lead guitarist whose Les Paul through a cranked Marshall JCM800 defined the sound of late-1980s hard rock. Known for melodic, blues-influenced solos and a raw, aggressive tone with a top hat and cigarette.",
    genres: ["hard-rock", "rock", "blues-rock"],
  },
  {
    name: "Eddie Van Halen",
    slug: "eddie-van-halen",
    bio: "Revolutionary guitarist who invented modern rock guitar technique. His 'brown sound' — a modified Stratocaster-style guitar through a variac-powered Marshall Plexi — changed electric guitar tone forever. Pioneer of two-handed tapping, harmonics, and tremolo bar tricks.",
    genres: ["hard-rock", "rock", "metal"],
  },
  {
    name: "The Edge",
    slug: "the-edge",
    bio: "U2's guitarist, known for his textural, effects-driven approach to rock guitar. Rather than traditional riffs and solos, The Edge builds shimmering walls of sound using delay, reverb, and modulation. His dotted-eighth-note delay technique is one of the most recognizable sounds in rock.",
    genres: ["rock", "post-punk", "alternative"],
  },
  {
    name: "John Mayer",
    slug: "john-mayer",
    bio: "Modern blues-rock guitarist who bridges the gap between SRV-style Texas blues and contemporary pop-rock. Known for impeccable touch, dynamic control, and a warm Stratocaster tone that owes as much to his hands as to his boutique gear.",
    genres: ["blues-rock", "pop-rock", "blues"],
  },
  {
    name: "Eric Clapton",
    slug: "eric-clapton",
    bio: "One of the most influential blues-rock guitarists in history. From Cream's heavy psychedelic blues to his later laid-back sound, Clapton's tone has evolved across decades. His 'woman tone' and Layla-era SG work are cornerstones of rock guitar.",
    genres: ["blues-rock", "classic-rock", "blues"],
  },
  {
    name: "Mark Knopfler",
    slug: "mark-knopfler",
    bio: "Dire Straits frontman renowned for his distinctive fingerpicking technique on a Fender Stratocaster. His clean, articulate tone — achieved without a pick — is one of the most unique and instantly recognizable sounds in rock guitar.",
    genres: ["rock", "classic-rock", "blues-rock"],
  },
  {
    name: "B.B. King",
    slug: "bb-king",
    bio: "The King of the Blues. B.B. King's singing vibrato, precise string bending, and warm tone from his beloved 'Lucille' ES-355 through a Fender amp defined modern blues guitar. He never played chords; every note was a melody.",
    genres: ["blues", "electric-blues"],
  },
  {
    name: "Jack White",
    slug: "jack-white",
    bio: "The White Stripes frontman who proved that raw, lo-fi guitar tone and two-piece minimalism could be massive. His use of cheap vintage gear, plastic guitars, and aggressive playing style brought garage rock back into the mainstream.",
    genres: ["garage-rock", "alternative", "blues-rock"],
  },
  {
    name: "Tom Morello",
    slug: "tom-morello",
    bio: "Rage Against the Machine guitarist who turned the electric guitar into a turntable and synthesizer. Using a simple rig of a Les Paul, Marshall head, and creative effects manipulation, Morello created sounds never before heard from a guitar.",
    genres: ["alternative-metal", "rap-rock", "rock"],
  },
  {
    name: "James Hetfield",
    slug: "james-hetfield",
    bio: "Metallica's rhythm guitarist and frontman, whose tight, percussive downpicking and crushing Mesa/Boogie tone defined thrash metal. His aggressive right hand and scooped-mid tone on Master of Puppets became the blueprint for metal rhythm guitar.",
    genres: ["thrash-metal", "metal", "hard-rock"],
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
  {
    artist_slug: "slash",
    title: "Sweet Child O' Mine",
    slug: "sweet-child-o-mine-guns-n-roses",
    album: "Appetite for Destruction",
    year: 1987,
    genres: ["hard-rock", "rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/guns-n-roses-sweet-child-o-mine-tab-s137",
    external_video_url:
      "https://www.youtube.com/results?search_query=sweet+child+o+mine+guitar+lesson",
  },
  {
    artist_slug: "eddie-van-halen",
    title: "Eruption",
    slug: "eruption-van-halen",
    album: "Van Halen",
    year: 1978,
    genres: ["hard-rock", "rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/van-halen-eruption-tab-s309",
    external_video_url:
      "https://www.youtube.com/results?search_query=eruption+van+halen+guitar+lesson",
  },
  {
    artist_slug: "the-edge",
    title: "Where the Streets Have No Name",
    slug: "where-the-streets-have-no-name-u2",
    album: "The Joshua Tree",
    year: 1987,
    genres: ["rock", "post-punk"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/u2-where-the-streets-have-no-name-tab-s406",
    external_video_url:
      "https://www.youtube.com/results?search_query=where+the+streets+have+no+name+guitar+lesson",
  },
  {
    artist_slug: "john-mayer",
    title: "Slow Dancing in a Burning Room",
    slug: "slow-dancing-in-a-burning-room-john-mayer",
    album: "Continuum",
    year: 2006,
    genres: ["blues-rock", "pop-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/john-mayer-slow-dancing-in-a-burning-room-tab-s12345",
    external_video_url:
      "https://www.youtube.com/results?search_query=slow+dancing+in+a+burning+room+guitar+lesson",
  },
  {
    artist_slug: "eric-clapton",
    title: "Layla",
    slug: "layla-derek-and-the-dominos",
    album: "Layla and Other Assorted Love Songs",
    year: 1970,
    genres: ["blues-rock", "classic-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/derek-and-the-dominos-layla-tab-s62",
    external_video_url:
      "https://www.youtube.com/results?search_query=layla+guitar+lesson",
  },
  {
    artist_slug: "mark-knopfler",
    title: "Sultans of Swing",
    slug: "sultans-of-swing-dire-straits",
    album: "Dire Straits",
    year: 1978,
    genres: ["rock", "classic-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/dire-straits-sultans-of-swing-tab-s120",
    external_video_url:
      "https://www.youtube.com/results?search_query=sultans+of+swing+guitar+lesson",
  },
  {
    artist_slug: "bb-king",
    title: "The Thrill Is Gone",
    slug: "the-thrill-is-gone-bb-king",
    album: "Completely Well",
    year: 1969,
    genres: ["blues", "electric-blues"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/bb-king-the-thrill-is-gone-tab-s89",
    external_video_url:
      "https://www.youtube.com/results?search_query=the+thrill+is+gone+guitar+lesson",
  },
  {
    artist_slug: "jack-white",
    title: "Seven Nation Army",
    slug: "seven-nation-army-white-stripes",
    album: "Elephant",
    year: 2003,
    genres: ["garage-rock", "alternative"],
    difficulty: "beginner",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/the-white-stripes-seven-nation-army-tab-s341",
    external_video_url:
      "https://www.youtube.com/results?search_query=seven+nation+army+guitar+lesson",
  },
  {
    artist_slug: "tom-morello",
    title: "Killing in the Name",
    slug: "killing-in-the-name-rage-against-the-machine",
    album: "Rage Against the Machine",
    year: 1992,
    genres: ["alternative-metal", "rap-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/rage-against-the-machine-killing-in-the-name-tab-s248",
    external_video_url:
      "https://www.youtube.com/results?search_query=killing+in+the+name+guitar+lesson",
  },
  {
    artist_slug: "james-hetfield",
    title: "Master of Puppets",
    slug: "master-of-puppets-metallica",
    album: "Master of Puppets",
    year: 1986,
    genres: ["thrash-metal", "metal"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/metallica-master-of-puppets-tab-s185",
    external_video_url:
      "https://www.youtube.com/results?search_query=master+of+puppets+guitar+lesson",
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
  {
    name: "Gibson Les Paul Standard",
    slug: "gibson-les-paul-standard",
    type: "guitar",
    manufacturer: "Gibson",
    icon_type: "les_paul",
    icon_color: "#b8860b",
    description:
      "The classic dual-humbucker rock guitar. Mahogany body and neck with a maple cap deliver thick, warm sustain. The PAF-style humbuckers produce a fat, creamy tone that defines hard rock and blues.",
    modeler_equivalents: {},
  },
  {
    name: "Marshall JCM800 2203",
    slug: "marshall-jcm800",
    type: "amp",
    manufacturer: "Marshall",
    icon_type: "marshall_head",
    icon_color: "#1a1a1a",
    description:
      "The definitive 1980s rock amp. A single-channel, high-gain evolution of the Plexi circuit. Slash, Zakk Wylde, Tom Morello, and countless others built their tone on the JCM800's aggressive, punchy overdrive with tight low end and searing mids.",
    default_settings: {
      knobs: [
        { name: "Preamp", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Presence", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Brit 2204",
      quad_cortex: "JCM800",
      tonex: "JCM800",
      fractal: "800 2204",
      kemper: "JCM800",
      katana: "Brown Channel",
    },
  },
  {
    name: "EVH Frankenstrat",
    slug: "evh-frankenstrat",
    type: "guitar",
    manufacturer: "Charvel/Custom",
    icon_type: "strat",
    icon_color: "#e53e3e",
    description:
      "Eddie Van Halen's legendary homemade guitar. A Charvel/Strat-style body with a single Gibson PAF humbucker in the bridge, Floyd Rose tremolo, and the iconic red/black/white striped paint job. Built for speed, dive bombs, and the 'brown sound.'",
    modeler_equivalents: {},
  },
  {
    name: "Vox AC30",
    slug: "vox-ac30",
    type: "amp",
    manufacturer: "Vox",
    icon_type: "fender_combo",
    icon_color: "#8b4513",
    description:
      "The British clean machine. The AC30's chiming, jangly top end and warm compression when pushed define the sound of The Beatles, Queen, U2, and Radiohead. The Top Boost channel adds treble and bass controls with a distinctive, glassy overdrive character.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Cut", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Essex A30",
      quad_cortex: "AC30 TB",
      tonex: "AC30",
      fractal: "AC-30 TB",
      kemper: "Vox AC30",
      katana: "Crunch Channel",
    },
  },
  {
    name: "Two Rock Custom Reverb",
    slug: "two-rock-custom-reverb",
    type: "amp",
    manufacturer: "Two Rock",
    icon_type: "fender_combo",
    icon_color: "#4a5568",
    description:
      "A boutique, hand-wired amplifier favored by John Mayer. Inspired by blackface Fender circuits but with more headroom, richer harmonics, and a sweeter overdrive. Responds beautifully to pick dynamics and guitar volume changes.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Mid", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Reverb", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Derailed Ingrid",
      quad_cortex: "Two Rock",
      fractal: "Two Stone J35",
      kemper: "Two Rock",
    },
  },
  {
    name: "Gibson SG Standard",
    slug: "gibson-sg-standard",
    type: "guitar",
    manufacturer: "Gibson",
    icon_type: "les_paul",
    icon_color: "#8b0000",
    description:
      "The devilish sibling of the Les Paul. Thinner body, double cutaway, lighter weight. The SG has a brighter, more aggressive attack than the Les Paul with slightly less sustain. Favored by Angus Young, Tony Iommi, and Eric Clapton during the Cream era.",
    modeler_equivalents: {},
  },
  {
    name: "Fender Champ",
    slug: "fender-champ",
    type: "amp",
    manufacturer: "Fender",
    icon_type: "fender_combo",
    icon_color: "#1a1a2e",
    description:
      "A tiny 5-watt, single-ended, 1x8 practice amp that became a secret weapon in recording studios. When cranked to full volume, the Champ produces a rich, creamy overdrive with natural compression. Used on countless classic recordings including Layla and early Clapton sessions.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 12 },
      ],
    },
    modeler_equivalents: {
      helix: "US Small Tweed",
      quad_cortex: "Champ",
      fractal: "Tweed Champ",
      kemper: "Fender Champ",
      katana: "Crunch Channel",
    },
  },
  {
    name: "Gibson ES-355 (Lucille)",
    slug: "gibson-es-355-lucille",
    type: "guitar",
    manufacturer: "Gibson",
    icon_type: "les_paul",
    icon_color: "#1a1a1a",
    description:
      "B.B. King's beloved 'Lucille.' A semi-hollow ES-355 with dual humbuckers, Varitone switch, and a warm, singing tone. The semi-hollow body provides natural resonance and sustain that makes single notes sing like a human voice.",
    modeler_equivalents: {},
  },
  {
    name: "Fender Bassman",
    slug: "fender-bassman",
    type: "amp",
    manufacturer: "Fender",
    icon_type: "fender_combo",
    icon_color: "#d4a574",
    description:
      "Originally designed as a bass amp, the tweed Bassman became one of the most influential guitar amps ever made. Its warm, fat overdrive inspired the Marshall JTM45 and countless other designs. B.B. King, Buddy Guy, and countless blues players built their tone on the Bassman.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 12 },
        { name: "Treble", min: 0, max: 12 },
        { name: "Bass", min: 0, max: 12 },
        { name: "Presence", min: 0, max: 12 },
      ],
    },
    modeler_equivalents: {
      helix: "US Deluxe Nrm",
      quad_cortex: "Bassman",
      tonex: "Bassman",
      fractal: "Bassman 5F6-A",
      kemper: "Fender Bassman",
      katana: "Crunch Channel",
    },
  },
  {
    name: "Kay Hollowbody",
    slug: "kay-hollowbody",
    type: "guitar",
    manufacturer: "Kay",
    icon_type: "les_paul",
    icon_color: "#8b0000",
    description:
      "A cheap vintage hollowbody guitar from the 1960s that Jack White made famous. The low-output pickups, hollow body resonance, and generally rough build quality contribute to a raw, lo-fi tone that is central to the White Stripes' garage rock aesthetic.",
    modeler_equivalents: {},
  },
  {
    name: "Silvertone 1485 Amp",
    slug: "silvertone-1485",
    type: "amp",
    manufacturer: "Silvertone",
    icon_type: "fender_combo",
    icon_color: "#2d2d2d",
    description:
      "A budget department-store amp from the 1960s that Jack White turned into a signature sound. Six 10-inch speakers, tube-driven, with a raw, lo-fi character that breaks up beautifully when pushed. The definition of garage rock tone.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Tone", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "US Small Tweed",
      quad_cortex: "Silvertone",
      kemper: "Silvertone",
    },
  },
  {
    name: "DigiTech Whammy",
    slug: "digitech-whammy",
    type: "effect",
    subcategory: "pitch",
    manufacturer: "DigiTech",
    icon_type: "wah",
    icon_color: "#e53e3e",
    description:
      "A pitch-shifting pedal controlled by an expression pedal. Can shift pitch up or down in real time, creating dive bomb effects, harmony lines, and otherworldly sounds. A signature tool for Tom Morello and Jack White.",
    default_settings: {
      knobs: [
        { name: "Mode", options: ["2 OCT UP", "1 OCT UP", "1 OCT DOWN", "2 OCT DOWN", "Harmony"] },
        { name: "Position", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Pitch Wham",
      quad_cortex: "Whammy",
      fractal: "Whammy",
      kemper: "Whammy",
      katana: "Pitch Shifter (Pedal FX)",
    },
  },
  {
    name: "ESP Explorer",
    slug: "esp-explorer",
    type: "guitar",
    manufacturer: "ESP",
    icon_type: "les_paul",
    icon_color: "#f5f5f5",
    description:
      "James Hetfield's weapon of choice during Metallica's classic era. The Explorer body shape with active EMG pickups delivers a tight, aggressive tone with scooped mids and razor-sharp attack. Built for fast, percussive downpicking.",
    modeler_equivalents: {},
  },
  {
    name: "Mesa/Boogie Mark IIC+",
    slug: "mesa-boogie-mark-iic-plus",
    type: "amp",
    manufacturer: "Mesa/Boogie",
    icon_type: "marshall_head",
    icon_color: "#2d2d2d",
    description:
      "The holy grail of metal amps. The Mark IIC+ is the most sought-after Mesa/Boogie ever made, with a tight, aggressive lead channel that defined 1980s thrash metal. Metallica's Master of Puppets, Ride the Lightning, and ...And Justice for All were all recorded with Mark IIC+ amps.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Lead Drive", min: 0, max: 10 },
        { name: "Lead Master", min: 0, max: 10 },
        { name: "Presence", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Cali Rectifire",
      quad_cortex: "Mesa Mark IIC+",
      tonex: "Mesa Mark",
      fractal: "Mark IIC+ Lead",
      kemper: "Mesa Mark IIC+",
      katana: "Lead Channel",
    },
  },
  {
    name: "MXR Phase 90",
    slug: "mxr-phase-90",
    type: "effect",
    subcategory: "modulation",
    manufacturer: "MXR",
    icon_type: "mxr",
    icon_color: "#f97316",
    description:
      "A simple, single-knob phaser that adds a swirling, jet-like modulation. Eddie Van Halen used it on the first two Van Halen albums for that unmistakable swooshing quality layered over his brown sound.",
    default_settings: {
      knobs: [
        { name: "Speed", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Script Mod Phase",
      quad_cortex: "Phase 90",
      tonex: "Phase 90",
      fractal: "Phase 90",
      kemper: "Phase 90",
      katana: "Phaser (Mod)",
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
  // ---- Slash - Sweet Child O' Mine ----
  {
    id: "seed-slash-sweet-child",
    song_slug: "sweet-child-o-mine-guns-n-roses",
    title: "Slash's Sweet Child O' Mine Lead Tone",
    slug: "slash-sweet-child-o-mine-lead",
    description:
      "One of the most recognizable guitar intros ever written. Slash's tone on Appetite for Destruction is the textbook Les Paul through a cranked Marshall JCM800 sound: thick, warm humbuckers pushing a hot British amp into singing, vocal-like overdrive. The JCM800 is doing most of the work here, with its aggressive midrange and natural compression when pushed hard. A touch of reverb from the studio and Slash's fluid vibrato complete the picture.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson Les Paul Standard (1959 replica)",
      pickup_config: "HH",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".011-.048",
      notable_mods:
        "1987 Gibson Les Paul Standard replica of a 1959 burst. Seymour Duncan Alnico II Pro pickups in both positions. The lower output Alnico II magnets give a warmer, more vintage voice than hotter modern humbuckers.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-jcm800",
        gear_name: "Marshall JCM800 2203",
        icon_type: "marshall_head",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: { Preamp: 8, Master: 6, Bass: 5, Middle: 8, Treble: 7, Presence: 6 },
        notes:
          "The JCM800 is cranked hard. Preamp gain at 8 provides the heavy, saturated overdrive that defines the Appetite tone. Mids are pushed high for cut and presence in the mix. The master volume controls the overall level but the preamp gain is where the tone lives.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "Classic Marshall 4x12 with Celestion Greenback speakers. The warm midrange of the Greenbacks is essential to the Slash sound, preventing the high-gain tone from becoming harsh or fizzy.",
      },
      {
        position: 3,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "on-axis, close-miked" },
        notes:
          "Standard SM57 close-miking on the speaker cone. Appetite for Destruction was produced by Mike Clink at Rumbo Recorders and Take One Studio with a direct, in-your-face guitar sound.",
      },
    ],
    original_gear: {
      guitar:
        "1987 Gibson Les Paul Standard (1959 replica), Seymour Duncan Alnico II Pro pickups, neck pickup, .011-.048 strings",
      effects: [],
      amp: "Marshall JCM800 2203 (cranked)",
      cabinet: "Marshall 4x12 with Celestion Greenbacks",
      microphone: "Shure SM57 (close-miked)",
      other_notes:
        "Slash's tone is famously simple: guitar straight into a cranked Marshall, no pedals. His Alnico II pickups have a lower output than typical humbuckers, which preserves clarity and dynamics even at high gain settings. His aggressive vibrato and fluid legato technique are inseparable from the tone.",
    },
    tags: ["hard-rock", "rock", "lead", "marshall", "les-paul", "slash"],
    sources: [
      "https://equipboard.com/pros/slash",
      "https://www.guitarworld.com/features/slash-gear-guide",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brit 2204",
            block_category: "Amp",
            original_gear: "Marshall JCM800 2203",
            settings: {
              Drive: 8.0,
              Bass: 5.0,
              Mid: 8.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 6.0,
            },
            notes:
              "The Brit 2204 is Helix's JCM800 model. Push the Drive hard and keep mids high for that cutting Slash tone.",
          },
          {
            position: 2,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes:
              "Close-miked Greenback cab. On-axis for maximum presence and bite.",
          },
        ],
        notes:
          "A simple patch that relies on the amp model doing all the work. Use the neck pickup on a Les Paul or humbucker guitar for the warmest, most Slash-like result. Adding a Studio Reverb block at the end with low mix (15-20%) adds depth.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "JCM800",
            block_category: "Amp",
            original_gear: "Marshall JCM800 2203",
            settings: {
              Gain: 8.0,
              Bass: 5.0,
              Mid: 8.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 6.0,
            },
            notes:
              "The QC's JCM800 model. Community captures of real JCM800s on Cortex Cloud are excellent for this tone.",
          },
          {
            position: 2,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Close-miked Greenback for the classic Marshall tone.",
          },
        ],
        notes:
          "Search Cortex Cloud for 'Slash' or 'AFD' (Appetite for Destruction) captures. Many community captures nail this tone using real JCM800 amps.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall JCM800 2203",
            settings: {
              Gain: 8,
              Bass: 5,
              Middle: 8,
              Treble: 7,
              Presence: 6,
              Volume: 6,
            },
            notes:
              "The Brown channel on the Katana is its Marshall-voiced mode. Push the gain high and keep mids elevated for the Slash character.",
          },
        ],
        notes:
          "The Katana's Brown channel gets surprisingly close to the JCM800 tone. Use a humbucker guitar on the neck pickup. This is one of the simplest tones to set up — just guitar into the amp, no effects needed.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- Eddie Van Halen - Eruption ----
  {
    id: "seed-evh-eruption",
    song_slug: "eruption-van-halen",
    title: "Eddie Van Halen's Brown Sound (Eruption)",
    slug: "evh-eruption-brown-sound",
    description:
      "The 'brown sound' that changed rock guitar forever. Eddie Van Halen's tone on the debut Van Halen album is a Frankenstrat with a single humbucker through a Marshall Plexi 1959, reportedly powered through a variac to lower the voltage and achieve a thick, compressed, harmonically rich overdrive at manageable volumes. An MXR Phase 90 adds a subtle swirl. The result is a warm, singing sustain that is neither too clean nor too distorted — it sits in a magical sweet spot that responds to every nuance of Eddie's playing.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "EVH Frankenstrat",
      pickup_config: "single",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".009-.042",
      notable_mods:
        "Homemade guitar: Charvel body and neck, single Gibson PAF humbucker in the bridge, Floyd Rose tremolo (added later). The original Frankenstrat had a single volume knob and no tone controls. Light strings for speed and tremolo bar tricks.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "modulation",
        gear_slug: "mxr-phase-90",
        gear_name: "MXR Phase 90",
        icon_type: "mxr",
        icon_color: "#f97316",
        is_in_effects_loop: false,
        settings: { Speed: 3 },
        notes:
          "The Phase 90 adds a subtle swirling modulation to the tone. Eddie kept the speed relatively slow. It is not always on, but it is a key part of the Van Halen I sound, adding movement and dimension to the brown sound.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959 (Plexi) via Variac",
        icon_type: "marshall_head",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {
          Presence: 5,
          Bass: 5,
          Middle: 7,
          Treble: 7,
          "Volume I": 10,
          "Volume II": 0,
        },
        notes:
          "The key to the brown sound is the Marshall Plexi run through a variac, which lowers the voltage from 120V to approximately 90V. This causes the tubes to sag and compress, producing a thick, warm overdrive with singing sustain. Volume I is dimed. Only one channel is used. The lower voltage softens the attack and adds a spongy, compressed quality.",
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
          "Standard Marshall 4x12 with Celestion Greenbacks. Eddie's cab choices varied but the Greenback 4x12 is the most commonly cited pairing.",
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
        settings: { Position: "on-axis" },
        notes:
          "The first Van Halen album was produced by Ted Templeman and engineered by Donn Landee at Sunset Sound. The guitar tone was captured relatively dry with close-miking.",
      },
    ],
    original_gear: {
      guitar:
        "EVH Frankenstrat (Charvel body, single Gibson PAF humbucker, Floyd Rose), bridge pickup, .009-.042 strings",
      effects: ["MXR Phase 90 (subtle)"],
      amp: "Marshall Super Lead 1959 (Plexi) through a variac at ~90V",
      cabinet: "Marshall 4x12 with Celestion Greenbacks",
      microphone: "Shure SM57",
      other_notes:
        "The exact details of EVH's signal chain are debated. The variac, dummy load, and possible use of an Echoplex for preamp boost are all part of the legend. What is certain is the combination of a hot humbucker, cranked Plexi, and lower voltage creating a compressed, harmonically rich overdrive.",
    },
    tags: ["hard-rock", "rock", "tapping", "brown-sound", "evh", "van-halen"],
    sources: [
      "https://equipboard.com/pros/eddie-van-halen",
      "https://www.guitarworld.com/features/eddie-van-halen-gear-tone",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Script Mod Phase",
            block_category: "Modulation",
            original_gear: "MXR Phase 90",
            settings: { Speed: 3.0, Mix: 50 },
            notes:
              "Helix's Phase 90 model. Keep the speed low for subtle swirl. Toggle on/off as needed.",
          },
          {
            position: 2,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959 (Variac)",
            settings: {
              Drive: 8.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 7.0,
              Presence: 5.0,
              "Ch Vol": 7.0,
              Sag: 8.0,
            },
            notes:
              "Crank the Drive to emulate the dimed Plexi. The key to the brown sound on Helix is increasing the Sag parameter — this simulates the variac's voltage reduction, adding compression and warmth. Set Sag to 8 or higher.",
          },
          {
            position: 3,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 1.5 },
            notes: "Standard Greenback cab, close-miked.",
          },
        ],
        notes:
          "The Sag parameter on Helix amp models is the key to the brown sound. Increasing it simulates the variac effect: more compression, more warmth, softer attack. Use a bridge humbucker for authenticity.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Phase 90",
            block_category: "Modulation",
            original_gear: "MXR Phase 90",
            settings: { Speed: 3.0 },
            notes: "Subtle phaser before the amp. Toggle as needed.",
          },
          {
            position: 2,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959 (Variac)",
            settings: {
              Gain: 8.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 7.0,
              Presence: 5.0,
              Master: 7.0,
            },
            notes:
              "Push the gain high and look for a Sag or Bias parameter to increase tube compression. Community captures of real variac'd Plexis are available on Cortex Cloud.",
          },
          {
            position: 3,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "1.5 inches" },
            notes: "Close-miked Greenback for the classic Van Halen tone.",
          },
        ],
        notes:
          "Search Cortex Cloud for 'EVH' or 'brown sound' captures. The QC's neural captures of real variac'd Plexis are among the most authentic digital recreations of this legendary tone.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959 (Variac)",
            settings: {
              Gain: 8,
              Bass: 5,
              Middle: 7,
              Treble: 7,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "The Katana's Brown channel is literally named after EVH's brown sound. This is one of the tones it was designed to replicate. Push the gain high.",
          },
          {
            position: 2,
            block_name: "Phaser",
            block_category: "Mod",
            original_gear: "MXR Phase 90",
            settings: { Rate: 3, Depth: 50 },
            notes:
              "Add a phaser in the Mod section for the Phase 90 swirl. Keep the rate low.",
          },
        ],
        notes:
          "The Katana's Brown channel was designed with the EVH tone in mind. This is arguably one of the best tones the Katana can produce. Use a bridge humbucker and push the gain.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- The Edge - Where the Streets Have No Name ----
  {
    id: "seed-edge-streets",
    song_slug: "where-the-streets-have-no-name-u2",
    title: "The Edge's Shimmering Delay Tone (Streets)",
    slug: "edge-where-the-streets-have-no-name",
    description:
      "The defining textural guitar tone of the 1980s. The Edge's approach on Where the Streets Have No Name is built on rhythmic delay: a dotted eighth note delay synchronized to the tempo creates a cascading, shimmering pattern where the delayed notes fill in the gaps between picked notes. The result is a wall of chiming sound that seems much more complex than what is actually being played. The Vox AC30 provides a bright, chimey foundation, and the delay does the rest.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster / Gibson Explorer",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".011-.049",
      notable_mods:
        "The Edge uses various guitars, but for Joshua Tree era, a combination of Gibson Explorer, Fender Stratocaster, and others. The key is not the guitar but the effects chain.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "vox-ac30",
        gear_name: "Vox AC30 (Top Boost)",
        icon_type: "fender_combo",
        icon_color: "#8b4513",
        is_in_effects_loop: false,
        settings: { Volume: 6, Treble: 7, Bass: 4, Cut: 4, Master: 6 },
        notes:
          "The AC30's chimey, bright clean tone is the foundation. The Top Boost channel provides the treble sparkle that makes the delay shimmer. Slightly pushed for a touch of breakup that adds harmonic richness to the delayed signal.",
      },
      {
        position: 2,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "Korg SDD-3000 Digital Delay",
        icon_type: "large_format",
        icon_color: "#2563eb",
        is_in_effects_loop: true,
        settings: { Time: "dotted eighth (370ms at 130 BPM)", Feedback: 40, Mix: 40 },
        notes:
          "The dotted eighth note delay is the heart of The Edge's sound. At the song's tempo, this creates a rhythmic pattern where the delays interlock with the picked notes. The feedback is set to give 3-4 repeats, creating a cascading wash. The mix is high enough that the delays are a prominent part of the sound, not just subtle ambience. The Korg SDD-3000 is The Edge's primary delay unit.",
      },
      {
        position: 3,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "Memory Man (secondary delay / modulation)",
        icon_type: "large_format",
        icon_color: "#7c3aed",
        is_in_effects_loop: true,
        settings: { Time: "quarter note", Feedback: 25, Mix: 20 },
        notes:
          "A second delay adds depth and width to the sound. The Edge often stacks multiple delays for a more complex, atmospheric texture. This secondary delay adds subtle modulation and fills out the soundscape.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Vox 2x12 (Celestion Blues)",
        icon_type: "cab_1x12",
        icon_color: "#8b4513",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The AC30's built-in 2x12 speakers with Celestion Blue Alnico drivers provide a bright, open, chimey character that complements the delay-heavy approach perfectly.",
      },
    ],
    original_gear: {
      guitar:
        "Gibson Explorer / Fender Stratocaster, bridge pickup",
      effects: [
        "Korg SDD-3000 Digital Delay (dotted eighth note)",
        "Electro-Harmonix Deluxe Memory Man (secondary delay)",
      ],
      amp: "Vox AC30 (Top Boost channel)",
      cabinet: "Vox 2x12 with Celestion Blue Alnico speakers",
      microphone: "Shure SM57",
      other_notes:
        "The Edge's pedalboard is one of the most complex in rock music. His guitar tech Dallas Schoo manages a rack system that includes multiple delays, modulation, and routing options. The precise delay time must be calibrated to the song's tempo for the rhythmic effect to work.",
    },
    tags: ["rock", "delay", "atmospheric", "post-punk", "u2", "edge", "textural"],
    sources: [
      "https://equipboard.com/pros/the-edge",
      "https://www.guitarworld.com/features/the-edge-gear-guide",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Essex A30",
            block_category: "Amp",
            original_gear: "Vox AC30",
            settings: {
              Drive: 5.5,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 6.0,
            },
            notes:
              "Helix's AC30 model. Keep it just on the edge of breakup for chimey sparkle with a touch of grit.",
          },
          {
            position: 2,
            block_name: "Elephant Man",
            block_category: "Delay",
            original_gear: "Korg SDD-3000 / Memory Man",
            settings: { Time: "dotted 1/8", Feedback: 40, Mix: 40 },
            notes:
              "Set to dotted eighth note and sync to the song's tempo via tap tempo. This is the critical block. The Elephant Man adds modulation to the repeats for a warmer, more organic wash.",
          },
          {
            position: 3,
            block_name: "Simple Delay",
            block_category: "Delay",
            original_gear: "Secondary delay",
            settings: { Time: "1/4", Feedback: 25, Mix: 20 },
            notes:
              "A second delay adds depth. Place after the first delay in the chain for cascading repeats.",
          },
          {
            position: 4,
            block_name: "2x12 Blue Bell",
            block_category: "Cab",
            original_gear: "Vox 2x12 Celestion Blue",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes:
              "The Blue Bell cab matches the Celestion Blue Alnico speakers in the AC30.",
          },
        ],
        notes:
          "Use tap tempo to lock the dotted eighth delay to the song's BPM. This is essential — if the delay time drifts off tempo, the rhythmic effect falls apart. Practice picking steady eighth notes and letting the delay create the rhythm.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "AC30 TB",
            block_category: "Amp",
            original_gear: "Vox AC30",
            settings: {
              Gain: 5.5,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 6.0,
            },
            notes: "The QC's AC30 Top Boost model. Slightly driven for chimey sparkle.",
          },
          {
            position: 2,
            block_name: "Digital Delay",
            block_category: "Delay",
            original_gear: "Korg SDD-3000",
            settings: { Time: "dotted 1/8", Feedback: 40, Mix: 40 },
            notes:
              "Set to dotted eighth note sync. Use tap tempo to match the song. This is the core of The Edge's sound.",
          },
          {
            position: 3,
            block_name: "Analog Delay",
            block_category: "Delay",
            original_gear: "Memory Man",
            settings: { Time: "1/4", Feedback: 25, Mix: 20 },
            notes: "Secondary delay for depth and warmth.",
          },
        ],
        notes:
          "The QC handles stacked delays well. Use tap tempo to sync both delays to the song tempo. The dotted eighth note delay is the most critical element of this tone.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Vox AC30",
            settings: {
              Gain: 5,
              Bass: 4,
              Middle: 6,
              Treble: 7,
              Presence: 6,
              Volume: 6,
            },
            notes:
              "The Katana's Crunch channel approximates the AC30's chimey breakup. Keep the gain moderate for clean-to-edge-of-breakup tones.",
          },
          {
            position: 2,
            block_name: "Digital Delay",
            block_category: "FX",
            original_gear: "Korg SDD-3000",
            settings: { Time: "dotted 1/8", Feedback: 40, Level: 40 },
            notes:
              "Set to dotted eighth note in Boss Tone Studio. Use tap tempo to sync. This single delay will get you 80% of The Edge's sound.",
          },
        ],
        notes:
          "The Katana only has one delay slot in the FX section, so you won't get the stacked delay complexity. But the dotted eighth note delay through the Crunch channel gets surprisingly close. Use tap tempo religiously.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- John Mayer - Slow Dancing in a Burning Room ----
  {
    id: "seed-mayer-slow-dancing",
    song_slug: "slow-dancing-in-a-burning-room-john-mayer",
    title: "Mayer's Slow Dancing Blues-Rock Tone",
    slug: "mayer-slow-dancing-burning-room",
    description:
      "A modern masterclass in touch-sensitive blues-rock tone. John Mayer's sound on Continuum is built on a Stratocaster through a Tube Screamer into a boutique Two Rock amp — essentially the SRV formula updated for the 21st century. The Two Rock provides a sweet, harmonically complex clean tone that responds to every nuance of Mayer's pick dynamics. The Tube Screamer adds a mid-hump boost that pushes the amp into a warm, singing overdrive without obscuring the guitar's natural voice.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster (SRV Signature / Big Dippers)",
      pickup_config: "SSS",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".011-.049",
      notable_mods:
        "During the Continuum era, Mayer used various Strats including an SRV signature model. The key is the neck pickup for leads and position 4 (bridge+middle) for rhythm parts. Heavier strings (.011 gauge) give more body and sustain.",
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
        settings: { Drive: 3, Tone: 5, Level: 7 },
        notes:
          "Like SRV, Mayer uses the Tube Screamer as a clean boost with the drive low and level high. The mid-hump pushes the Two Rock into sweet overdrive while tightening the low end. Tone at noon for a balanced frequency response.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "two-rock-custom-reverb",
        gear_name: "Two Rock Custom Reverb",
        icon_type: "fender_combo",
        icon_color: "#4a5568",
        is_in_effects_loop: false,
        settings: { Volume: 6, Treble: 6, Mid: 5, Bass: 5, Reverb: 3, Master: 5 },
        notes:
          "The Two Rock is the key to Mayer's refined blues tone. It has more headroom and harmonic complexity than a vintage Fender. The amp is set to the edge of breakup — clean when played lightly, breaking up when digging in. The built-in reverb adds a touch of ambience.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Two Rock 2x12 Cabinet (EVM 12L speakers)",
        icon_type: "cab_1x12",
        icon_color: "#4a5568",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Two Rock 2x12 cabinet with EVM 12L speakers provides a full, clear tone with tight bass response. The EVM speakers are high-powered and handle the amp's dynamics without compression.",
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
          "Continuum was produced by Steve Jordan with a warm, polished production style. The guitar is close-miked with a natural room ambience.",
      },
    ],
    original_gear: {
      guitar:
        "Fender Stratocaster (SRV Signature model), neck pickup for leads, .011-.049 strings",
      effects: ["Ibanez TS808 Tube Screamer (clean boost)"],
      amp: "Two Rock Custom Reverb",
      cabinet: "Two Rock 2x12 with EVM 12L speakers",
      microphone: "Shure SM57",
      other_notes:
        "Mayer's touch and dynamics are the most important part of this tone. He controls gain levels primarily with his right hand attack and guitar volume knob, moving seamlessly between clean and overdriven sounds without touching a pedal.",
    },
    tags: ["blues-rock", "pop-rock", "overdrive", "clean-boost", "mayer", "strat"],
    sources: [
      "https://equipboard.com/pros/john-mayer",
      "https://www.guitarworld.com/features/john-mayer-gear-continuum",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Scream 808",
            block_category: "Distortion",
            original_gear: "Ibanez TS808",
            settings: { Drive: 3.0, Tone: 5.0, Level: 7.0 },
            notes: "Low drive, high level. Classic clean-boost Tube Screamer setup.",
          },
          {
            position: 2,
            block_name: "Derailed Ingrid",
            block_category: "Amp",
            original_gear: "Two Rock Custom Reverb",
            settings: {
              Drive: 5.5,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 6.0,
              Presence: 5.0,
              "Ch Vol": 5.5,
            },
            notes:
              "The Derailed Ingrid is Helix's boutique Dumble-style amp model, which shares DNA with the Two Rock circuit. Set to edge of breakup for touch-responsive dynamics.",
          },
          {
            position: 3,
            block_name: "2x12 Mail C12Q",
            block_category: "Cab",
            original_gear: "Two Rock 2x12",
            settings: { Mic: "57 Dynamic", Distance: 2.5 },
            notes: "A clean, full-range 2x12 cab. Pull the mic back slightly for warmth.",
          },
        ],
        notes:
          "The Derailed Ingrid responds beautifully to pick dynamics, which is essential for the Mayer style. Use the neck pickup for leads and control your gain with your right hand. Adding a subtle reverb block at the end enhances the Continuum vibe.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "TS808 OD",
            block_category: "Drive",
            original_gear: "Ibanez TS808",
            settings: { Drive: 3.0, Tone: 5.0, Level: 7.0 },
            notes: "Clean boost setup. Low drive, high level.",
          },
          {
            position: 2,
            block_name: "Two Rock",
            block_category: "Amp",
            original_gear: "Two Rock Custom Reverb",
            settings: {
              Gain: 5.5,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 5.5,
            },
            notes:
              "If a Two Rock model is available, use it. Otherwise, search Cortex Cloud for Two Rock or Dumble-style captures. Set to edge of breakup.",
          },
          {
            position: 3,
            block_name: "2x12 Two Rock",
            block_category: "Cab",
            original_gear: "Two Rock 2x12",
            settings: { Mic: "SM57", Distance: "2.5 inches" },
            notes: "Load a Two Rock IR if available for the most authentic result.",
          },
        ],
        notes:
          "The QC excels at this style of touch-sensitive, dynamic tone. Community captures of real Two Rock amps on Cortex Cloud are highly recommended for the most authentic Mayer experience.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Two Rock Custom Reverb",
            settings: {
              Gain: 5,
              Bass: 5,
              Middle: 5,
              Treble: 6,
              Presence: 5,
              Volume: 6,
            },
            notes:
              "The Crunch channel at moderate gain approximates the Two Rock's warm breakup. Keep the gain lower than you might think — Mayer's tone is cleaner than it sounds.",
          },
          {
            position: 2,
            block_name: "Blues Driver",
            block_category: "Booster",
            original_gear: "Ibanez TS808",
            settings: { Level: 7, Tone: 5, Drive: 3 },
            notes:
              "Blues Driver in the Booster slot acts as the Tube Screamer clean boost. Low drive, high level.",
          },
        ],
        notes:
          "The Katana's Crunch channel at moderate gain with the Blues Driver as a clean boost gets a convincing Mayer-style tone. Use the neck pickup on a Strat and focus on your pick dynamics — that is where the magic happens.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- Eric Clapton - Layla ----
  {
    id: "seed-clapton-layla",
    song_slug: "layla-derek-and-the-dominos",
    title: "Clapton's Layla Searing Lead Tone",
    slug: "clapton-layla-lead",
    description:
      "One of the most passionate guitar performances ever recorded. Clapton's tone on Layla is raw, urgent, and biting: a Gibson SG through a cranked Fender Champ, with the tiny amp pushed to its absolute limits. The Champ's single-ended 5-watt circuit compresses and distorts beautifully when dimed, producing a thick, creamy overdrive with natural sustain. Duane Allman's slide guitar interweaves with Clapton's lead lines, and both guitars were recorded through small amps at high volume for maximum saturation.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson SG Standard",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "A stock Gibson SG Standard with PAF-style humbuckers. The bridge pickup provides the biting, aggressive attack needed for the Layla riff. Clapton also used a Stratocaster on some tracks during this era.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-champ",
        gear_name: "Fender Champ (cranked)",
        icon_type: "fender_combo",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: { Volume: 12 },
        notes:
          "The Champ is dimed — volume on 12 (full). At 5 watts, this creates a thick, compressed overdrive that is incredibly touch-sensitive. The single 6V6 power tube provides a warm, creamy saturation that is perfect for blues-rock leads. The small amp's natural compression adds sustain without a pedal.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Fender Champ Built-in 1x8 Speaker",
        icon_type: "cab_1x12",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Champ's tiny 8-inch speaker contributes to the tone by rolling off extreme low end and adding a focused, midrange-forward quality. The small speaker naturally compresses the sound, which is part of the charm.",
      },
      {
        position: 3,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "on-axis, close-miked" },
        notes:
          "Layla was recorded at Criteria Studios in Miami by Tom Dowd. The guitars were close-miked for a direct, raw sound.",
      },
    ],
    original_gear: {
      guitar:
        "Gibson SG Standard, bridge pickup, stock PAF humbuckers, .010-.046 strings",
      effects: [],
      amp: "Fender Champ (cranked to full volume)",
      cabinet: "Built-in Fender Champ 1x8 speaker",
      microphone: "Shure SM57 (close-miked)",
      other_notes:
        "Producer Tom Dowd captured Clapton and Duane Allman playing together in the studio, both through small amps pushed to breakup. The raw urgency of the performance is as important as the gear. Clapton's 'woman tone' technique of rolling back the tone knob is used in some sections for a darker, thicker lead sound.",
    },
    tags: ["blues-rock", "classic-rock", "lead", "cranked-amp", "clapton"],
    sources: [
      "https://equipboard.com/pros/eric-clapton",
      "https://www.guitarworld.com/features/eric-clapton-layla-gear",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Small Tweed",
            block_category: "Amp",
            original_gear: "Fender Champ",
            settings: {
              Drive: 10.0,
              Bass: 5.0,
              Mid: 6.0,
              Treble: 6.0,
              "Ch Vol": 8.0,
            },
            notes:
              "The US Small Tweed is Helix's small Fender model. Crank the Drive to 10 to simulate the dimed Champ. The natural compression and overdrive at full gain is the whole tone.",
          },
          {
            position: 2,
            block_name: "1x8 Small Tweed",
            block_category: "Cab",
            original_gear: "Fender Champ 1x8",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes:
              "Use the small 1x8 cab to match the Champ's focused, midrange-forward character. If not available, a 1x12 works but will have more low end.",
          },
        ],
        notes:
          "A deceptively simple patch. The entire tone comes from the amp being pushed to its limits. Use a bridge humbucker for the biting Layla attack. Roll back your guitar's tone knob for Clapton's 'woman tone' on slower passages.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Champ",
            block_category: "Amp",
            original_gear: "Fender Champ",
            settings: {
              Gain: 10.0,
              Bass: 5.0,
              Mid: 6.0,
              Treble: 6.0,
              Master: 8.0,
            },
            notes:
              "If a Champ model is available, crank it. Otherwise, search Cortex Cloud for cranked Champ captures — there are many excellent ones. The key is maximum gain for that thick, compressed overdrive.",
          },
          {
            position: 2,
            block_name: "1x8 Champ",
            block_category: "Cab",
            original_gear: "Fender Champ 1x8",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Small speaker cab for the focused Champ character.",
          },
        ],
        notes:
          "Community captures of cranked Fender Champs on Cortex Cloud are excellent for this tone. The QC's neural captures of real small amps at full volume are among its greatest strengths.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- Mark Knopfler - Sultans of Swing ----
  {
    id: "seed-knopfler-sultans",
    song_slug: "sultans-of-swing-dire-straits",
    title: "Knopfler's Sultans of Swing Clean Fingerpicked Tone",
    slug: "knopfler-sultans-of-swing-clean",
    description:
      "One of the most distinctive clean guitar tones in rock. Mark Knopfler plays with his bare fingers instead of a pick, which gives his Stratocaster a warm, rounded attack with a unique percussive quality. The tone on Sultans of Swing is remarkably clean and articulate: a Strat through a clean Fender amp with almost no effects. The magic is entirely in Knopfler's right hand technique — the combination of fingerpicking, muted strings, and dynamic control creates a tone that no amount of gear can replicate without the technique.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster (1961)",
      pickup_config: "SSS",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "A 1961 Fender Stratocaster with stock single-coil pickups. Knopfler primarily uses the neck pickup for the warm, round lead tone, switching to the bridge pickup for brighter rhythm parts. No modifications — the guitar is stock.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-vibroverb-blackface",
        gear_name: "Fender Vibrolux Reverb",
        icon_type: "fender_combo",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: { Volume: 5, Treble: 6, Bass: 5, Reverb: 3, Speed: 0 },
        notes:
          "A clean Fender combo provides the warm, glassy foundation. The amp is set cleanly — not pushed into breakup. The Vibrolux Reverb is a 35-watt 2x10 combo with plenty of clean headroom. A touch of spring reverb adds depth without muddying the articulate fingerpicked notes.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Built-in Fender 2x10 Speakers",
        icon_type: "cab_1x12",
        icon_color: "#1a1a2e",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Vibrolux Reverb's built-in 2x10 speakers provide a clear, articulate sound with a tight low end and smooth highs, perfect for the fingerpicked clarity Knopfler demands.",
      },
      {
        position: 3,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "slightly off-axis" },
        notes:
          "The first Dire Straits album was recorded quickly and economically. The guitar sound is clean and direct with minimal studio processing.",
      },
    ],
    original_gear: {
      guitar:
        "1961 Fender Stratocaster, neck pickup for leads, stock single-coils, .010-.046 strings, played with bare fingers (no pick)",
      effects: [],
      amp: "Fender Vibrolux Reverb (clean)",
      cabinet: "Built-in 2x10 speakers",
      microphone: "Shure SM57",
      other_notes:
        "The single most important element of this tone is Knopfler's fingerpicking technique. Playing without a pick produces a warmer, softer attack with more harmonic complexity. His right-hand thumb handles the bass strings while his index and middle fingers play melody lines. No amount of gear can replicate this without the technique.",
    },
    tags: ["rock", "classic-rock", "clean", "fingerpicking", "knopfler", "strat"],
    sources: [
      "https://equipboard.com/pros/mark-knopfler",
      "https://www.guitarworld.com/features/mark-knopfler-gear",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Deluxe Vib",
            block_category: "Amp",
            original_gear: "Fender Vibrolux Reverb",
            settings: {
              Drive: 4.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 6.0,
              Presence: 5.0,
              "Ch Vol": 5.5,
            },
            notes:
              "A clean blackface Fender model. Keep the Drive low for pristine cleans. The Vibrolux and Vibroverb share similar circuits.",
          },
          {
            position: 2,
            block_name: "2x10 US Deluxe",
            block_category: "Cab",
            original_gear: "Fender 2x10",
            settings: { Mic: "57 Dynamic", Distance: 2.5 },
            notes:
              "A 2x10 cab for the tight, clear Fender character. Pull the mic back slightly for a warmer, more natural sound.",
          },
          {
            position: 3,
            block_name: "Plate Reverb",
            block_category: "Reverb",
            original_gear: "Built-in spring reverb",
            settings: { Decay: 2.0, Mix: 15 },
            notes: "Subtle reverb for depth. Keep the mix low — Knopfler's tone is dry and direct.",
          },
        ],
        notes:
          "This is the ultimate 'less is more' patch. The tone is almost entirely in the technique. Use your fingers instead of a pick, play on the neck pickup, and focus on dynamic control. The patch should be crystal clean.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Vibro Verb",
            block_category: "Amp",
            original_gear: "Fender Vibrolux Reverb",
            settings: {
              Gain: 4.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 5.5,
            },
            notes: "Clean Fender-style amp. Keep the gain low for fingerpicked clarity.",
          },
          {
            position: 2,
            block_name: "2x10 Fender",
            block_category: "Cab",
            original_gear: "Fender 2x10",
            settings: { Mic: "SM57", Distance: "2.5 inches" },
            notes: "Clear, articulate cab for the clean fingerpicked sound.",
          },
        ],
        notes:
          "The simplest patch possible. The QC's clean amp models shine here. The technique is everything — use your fingers, not a pick, and play on the neck pickup for the authentic Knopfler sound.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Fender Vibrolux Reverb",
            settings: {
              Gain: 3,
              Bass: 5,
              Middle: 5,
              Treble: 6,
              Presence: 5,
              Volume: 5,
            },
            notes:
              "The Katana's Clean channel is perfect for this. Set it crystal clean with moderate treble for sparkle.",
          },
        ],
        notes:
          "This is the easiest tone to set up on the Katana — just the Clean channel, no effects needed. The entire tone comes from playing with your fingers on the neck pickup. The Katana's Clean channel excels at this type of pristine, dynamic clean sound.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- B.B. King - The Thrill Is Gone ----
  {
    id: "seed-bb-king-thrill-is-gone",
    song_slug: "the-thrill-is-gone-bb-king",
    title: "B.B. King's Thrill Is Gone Blues Tone",
    slug: "bb-king-thrill-is-gone",
    description:
      "The most iconic blues guitar tone of all time. B.B. King's sound on The Thrill Is Gone is warm, vocal, and dripping with emotion: his ES-355 'Lucille' through a Fender Bassman, with no effects whatsoever. The semi-hollow body of the ES-355 provides natural resonance and sustain, while the Bassman's warm, fat overdrive (when pushed) or clean tone (at moderate volume) creates the perfect canvas for King's expressive vibrato and precise bending. Every note sings like a human voice.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Gibson ES-355 'Lucille'",
      pickup_config: "HH",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.044",
      notable_mods:
        "B.B. King's 'Lucille' is an ES-355 with the f-holes filled to reduce feedback at high volume. Lighter strings (.010 gauge) for easy bending. The neck pickup provides the warm, round tone that is King's signature.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-bassman",
        gear_name: "Fender Bassman",
        icon_type: "fender_combo",
        icon_color: "#d4a574",
        is_in_effects_loop: false,
        settings: { Volume: 6, Treble: 5, Bass: 6, Presence: 4 },
        notes:
          "The Bassman is set for a warm, slightly driven tone. Not heavily overdriven — B.B. King's tone is cleaner than most blues players. The volume is moderate, letting the guitar's natural dynamics come through. The bass is slightly elevated for warmth, and the presence is backed off to keep the highs smooth and sweet.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Fender Bassman 4x10 Cabinet",
        icon_type: "cab_1x12",
        icon_color: "#d4a574",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Bassman's 4x10 speaker configuration provides a balanced, full-range tone. The multiple 10-inch speakers give more low-end coverage than a single 12 while maintaining clarity and definition.",
      },
      {
        position: 3,
        category: "microphone",
        subcategory: null,
        gear_slug: "shure-sm57",
        gear_name: "Shure SM57",
        icon_type: "sm57",
        icon_color: "#6b7280",
        is_in_effects_loop: false,
        settings: { Position: "slightly off-axis" },
        notes:
          "Standard studio miking. The Thrill Is Gone was recorded with orchestral backing, so the guitar sits in a larger mix. The tone is warm and present without being harsh.",
      },
    ],
    original_gear: {
      guitar:
        "Gibson ES-355 'Lucille' (f-holes filled), neck pickup, .010-.044 strings",
      effects: [],
      amp: "Fender Bassman (moderate volume)",
      cabinet: "Fender Bassman 4x10",
      microphone: "Shure SM57",
      other_notes:
        "B.B. King used no effects pedals. His entire sound comes from his fingers, his vibrato, and his bending technique. The 'butterfly vibrato' — a rapid, wide vibrato achieved by shaking the entire hand — is the most recognizable element of his tone. He also never played chords; every note was a single-line melody.",
    },
    tags: ["blues", "electric-blues", "clean", "warm", "bb-king", "vibrato"],
    sources: [
      "https://equipboard.com/pros/bb-king",
      "https://www.guitarworld.com/features/bb-king-gear-lucille",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Deluxe Nrm",
            block_category: "Amp",
            original_gear: "Fender Bassman",
            settings: {
              Drive: 5.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 5.0,
              Presence: 4.0,
              "Ch Vol": 6.0,
            },
            notes:
              "The US Deluxe Normal is Helix's blackface Fender model. Set for warm, slightly driven tones. The Bassman is a similar Fender circuit. Keep the tone warm and avoid harsh highs.",
          },
          {
            position: 2,
            block_name: "4x10 Tweed",
            block_category: "Cab",
            original_gear: "Fender Bassman 4x10",
            settings: { Mic: "57 Dynamic", Distance: 2.5 },
            notes:
              "The 4x10 Tweed cab matches the Bassman's speaker configuration. Slightly pulled back mic for a warmer, smoother capture.",
          },
        ],
        notes:
          "A minimal patch that relies on the amp's natural warmth and your playing dynamics. Use the neck pickup on a semi-hollow or humbucker-equipped guitar. Focus on vibrato and bending — that is the B.B. King sound.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Bassman",
            block_category: "Amp",
            original_gear: "Fender Bassman",
            settings: {
              Gain: 5.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 5.0,
              Presence: 4.0,
              Master: 6.0,
            },
            notes: "Warm, clean Fender tone. The QC's Bassman model is excellent.",
          },
          {
            position: 2,
            block_name: "4x10 Bassman",
            block_category: "Cab",
            original_gear: "Fender Bassman 4x10",
            settings: { Mic: "SM57", Distance: "2.5 inches" },
            notes: "4x10 configuration for full, balanced bass tone.",
          },
        ],
        notes:
          "Search Cortex Cloud for B.B. King or Lucille tone captures. The QC's clean amp models with a good semi-hollow guitar will get you very close. The playing technique is everything.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Fender Bassman",
            settings: {
              Gain: 4,
              Bass: 6,
              Middle: 5,
              Treble: 5,
              Presence: 4,
              Volume: 6,
            },
            notes:
              "The Katana's Clean channel with warm EQ settings approximates the Bassman's clean tone. Keep the gain low and the bass slightly elevated for warmth.",
          },
        ],
        notes:
          "Another simple tone that is all about the player. The Katana's Clean channel set for warm, round tones with a humbucker guitar on the neck pickup. No effects needed.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- Jack White - Seven Nation Army ----
  {
    id: "seed-jack-white-seven-nation-army",
    song_slug: "seven-nation-army-white-stripes",
    title: "Jack White's Seven Nation Army Lo-Fi Riff Tone",
    slug: "jack-white-seven-nation-army",
    description:
      "The riff that conquered the world, played on a cheap Kay hollowbody through a DigiTech Whammy set to octave down, into a cranked Silvertone amp. The Whammy pedal makes the guitar sound like a bass on the iconic main riff, while the Silvertone's raw, lo-fi tube distortion adds grit and character. Jack White's entire approach is built on cheap, broken-sounding gear pushed to its limits — the imperfections ARE the tone.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Kay Hollowbody",
      pickup_config: "single",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".011-.052",
      notable_mods:
        "A 1960s Kay hollowbody with low-output pickups. The hollow body adds natural resonance and a boomy low end. Jack White intentionally uses cheap, imperfect guitars for their character and unpredictability.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "pitch",
        gear_slug: "digitech-whammy",
        gear_name: "DigiTech Whammy (Octave Down)",
        icon_type: "wah",
        icon_color: "#e53e3e",
        is_in_effects_loop: false,
        settings: { Mode: "1 OCT DOWN", Position: "toe down (full effect)" },
        notes:
          "The Whammy is set to one octave down with the expression pedal in the toe-down position (full effect). This drops the guitar's pitch by one octave, making it sound like a bass. This is only engaged for the main riff — during the choruses and other sections, it is bypassed for normal guitar tone.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "silvertone-1485",
        gear_name: "Silvertone 1485 Amp",
        icon_type: "fender_combo",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: { Volume: 8, Tone: 6 },
        notes:
          "The Silvertone is cranked hard for raw, gritty tube distortion. These department-store amps have a unique lo-fi character: rough around the edges, with a fuzzy overdrive that is distinctly different from a Marshall or Fender. The six 10-inch speakers provide a big, wide sound despite the amp's budget origins.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Silvertone Built-in 6x10 Speakers",
        icon_type: "cab_4x12",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Silvertone 1485's built-in 6x10 speaker array gives a wide, spread-out sound. The cheap speakers contribute to the lo-fi character — they break up and compress in a way that more expensive speakers do not.",
      },
    ],
    original_gear: {
      guitar:
        "1960s Kay Hollowbody, bridge pickup, .011-.052 strings",
      effects: ["DigiTech Whammy (1 octave down for main riff)"],
      amp: "Silvertone 1485 (cranked)",
      cabinet: "Built-in 6x10 speakers",
      microphone: "Shure SM57",
      other_notes:
        "The Seven Nation Army riff is NOT played on a bass. It is a guitar run through the Whammy pedal set one octave down. Jack White switches between the octave-down riff and normal guitar throughout the song. The lo-fi, garage-rock aesthetic is intentional — imperfections are features, not bugs.",
    },
    tags: ["garage-rock", "alternative", "lo-fi", "octave", "jack-white", "riff"],
    sources: [
      "https://equipboard.com/pros/jack-white",
      "https://www.guitarworld.com/features/jack-white-gear-guide",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Pitch Wham",
            block_category: "Pitch/Synth",
            original_gear: "DigiTech Whammy",
            settings: { Mode: "1 Oct Down", Position: "toe down" },
            notes:
              "Set the Pitch Wham to one octave down. Assign a footswitch to toggle it on/off. Engaged for the main riff, bypassed for normal guitar sections.",
          },
          {
            position: 2,
            block_name: "US Small Tweed",
            block_category: "Amp",
            original_gear: "Silvertone 1485",
            settings: {
              Drive: 8.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 6.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix doesn't have a Silvertone model. The US Small Tweed cranked hard gets close to the raw, lo-fi character. Push the Drive for gritty distortion.",
          },
          {
            position: 3,
            block_name: "1x12 US Deluxe",
            block_category: "Cab",
            original_gear: "Silvertone 6x10",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "No exact match for the 6x10 Silvertone cabinet. A 1x12 cab works as a substitute.",
          },
        ],
        notes:
          "The Pitch Wham block is the key to this patch. Assign it to a footswitch for easy toggling between the octave-down riff and normal guitar. Use a bridge pickup for the aggressive, biting attack.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Whammy",
            block_category: "Pitch",
            original_gear: "DigiTech Whammy",
            settings: { Mode: "1 Oct Down", Position: "toe down" },
            notes: "Octave down for the main riff. Toggle with a footswitch.",
          },
          {
            position: 2,
            block_name: "Silvertone",
            block_category: "Amp",
            original_gear: "Silvertone 1485",
            settings: {
              Gain: 8.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 7.0,
            },
            notes:
              "If a Silvertone model is available, use it. Otherwise, search Cortex Cloud for Silvertone captures. A cranked tweed-style amp works as a substitute.",
          },
        ],
        notes:
          "The QC's pitch shifting is excellent for this. The octave-down effect needs to track cleanly. Community Silvertone captures on Cortex Cloud are recommended for the authentic lo-fi character.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Silvertone 1485",
            settings: {
              Gain: 8,
              Bass: 6,
              Middle: 5,
              Treble: 6,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "The Crunch channel cranked hard approximates the raw Silvertone character. Push the gain for lo-fi grit.",
          },
          {
            position: 2,
            block_name: "Pitch Shifter",
            block_category: "Pedal FX",
            original_gear: "DigiTech Whammy",
            settings: { Pitch: "-12 semitones" },
            notes:
              "Use the Pitch Shifter in the Pedal FX section to drop one octave. This requires Boss Tone Studio to set up. Toggle with the GA-FC foot controller.",
          },
        ],
        notes:
          "The Katana can approximate this tone with the Crunch channel cranked and the Pitch Shifter in the Pedal FX section. The pitch tracking may not be as clean as dedicated Whammy models, but it captures the spirit of the garage-rock sound.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- Tom Morello - Killing in the Name ----
  {
    id: "seed-morello-killing",
    song_slug: "killing-in-the-name-rage-against-the-machine",
    title: "Morello's Killing in the Name Aggressive Tone",
    slug: "morello-killing-in-the-name",
    description:
      "Tom Morello's approach to guitar is unlike anyone else: he uses a simple rig — Les Paul, Marshall JCM800, Whammy pedal, and wah — but manipulates them in unconventional ways to create sounds that resemble turntables, synthesizers, and samples. On Killing in the Name, the core rhythm tone is a Les Paul through a cranked JCM800 for aggressive, tight palm-muted riffs. The Whammy and wah are used for the song's iconic solos and DJ-like scratching effects.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson Les Paul Standard ('Arm the Homeless')",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "drop_d",
      tuning_custom: "D-A-D-G-B-E",
      string_gauge: ".010-.046",
      notable_mods:
        "Morello's 'Arm the Homeless' Les Paul has a killswitch installed — a toggle that cuts the signal instantly for rhythmic stuttering effects. The guitar also has an EMG active humbucker in the bridge position for a tight, hot output.",
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
        settings: { Position: "rocked for solo effects" },
        notes:
          "Morello uses the wah as a tone-shaping filter, often parking it at specific positions or rocking it rhythmically during solos. On Killing in the Name, it is used during the solo sections for the filtered, vocal-like quality.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "pitch",
        gear_slug: "digitech-whammy",
        gear_name: "DigiTech Whammy",
        icon_type: "wah",
        icon_color: "#e53e3e",
        is_in_effects_loop: false,
        settings: { Mode: "2 OCT UP", Position: "expression pedal" },
        notes:
          "The Whammy is Morello's signature effect. He uses it to create pitch-shifted screams, dive bombs, and harmony effects. On Killing in the Name, it is used sparingly during solo sections for dramatic pitch bends. The expression pedal sweeps between the natural pitch and two octaves up.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-jcm800",
        gear_name: "Marshall JCM800 2205 (50W)",
        icon_type: "marshall_head",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: { Preamp: 8, Master: 5, Bass: 6, Middle: 7, Treble: 6, Presence: 5 },
        notes:
          "The JCM800 is cranked for aggressive, tight distortion. Morello uses the 50-watt 2205 model with its two channels. The preamp gain is pushed hard for saturated rhythm tones. Mids are elevated for cut in the band mix. The tight low end of the JCM800 keeps the Drop D palm mutes punchy and defined.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet",
        icon_type: "cab_4x12",
        icon_color: "#1a1a1a",
        is_in_effects_loop: false,
        settings: {},
        notes: "Standard Marshall 4x12 for a full, powerful sound.",
      },
    ],
    original_gear: {
      guitar:
        "Gibson Les Paul ('Arm the Homeless'), bridge EMG humbucker, killswitch, Drop D tuning, .010-.046 strings",
      effects: [
        "Dunlop Cry Baby Wah",
        "DigiTech Whammy (various pitch settings)",
      ],
      amp: "Marshall JCM800 2205 (50W, cranked)",
      cabinet: "Marshall 4x12",
      microphone: "Shure SM57",
      other_notes:
        "Morello's innovative technique is the key: he uses the killswitch for rhythmic stuttering, the Whammy for pitch effects, the toggle switch for scratching sounds, and feedback from the amp for sustained notes. His rig is intentionally simple so that the creativity comes from how he uses it, not from the gear itself.",
    },
    tags: ["alternative-metal", "rap-rock", "aggressive", "whammy", "morello", "drop-d"],
    sources: [
      "https://equipboard.com/pros/tom-morello",
      "https://www.guitarworld.com/features/tom-morello-gear-rig",
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
            notes: "Assign to an expression pedal. Use for solo sections.",
          },
          {
            position: 2,
            block_name: "Pitch Wham",
            block_category: "Pitch/Synth",
            original_gear: "DigiTech Whammy",
            settings: { Mode: "2 Oct Up", Position: "Expression Pedal" },
            notes:
              "Assign to a second expression pedal or use a footswitch for preset positions. Used for pitch-shifted screams and effects.",
          },
          {
            position: 3,
            block_name: "Brit 2204",
            block_category: "Amp",
            original_gear: "Marshall JCM800 2205",
            settings: {
              Drive: 8.0,
              Bass: 6.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 5.0,
              "Ch Vol": 6.0,
            },
            notes:
              "Helix's JCM800 model. Push the Drive for aggressive distortion. Keep the mids elevated for cut in a band mix.",
          },
          {
            position: 4,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "Close-miked Marshall cab for a tight, aggressive sound.",
          },
        ],
        notes:
          "The creative sound effects (killswitch stutters, toggle scratching) require technique, not gear. For the killswitch, you can assign a footswitch to toggle the volume block between 0 and full. Practice the physical techniques — they are the heart of Morello's style.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Wah",
            block_category: "Wah",
            original_gear: "Dunlop Cry Baby Wah",
            settings: { Position: "Expression Pedal" },
            notes: "Use the QC's built-in expression pedal for wah control.",
          },
          {
            position: 2,
            block_name: "Whammy",
            block_category: "Pitch",
            original_gear: "DigiTech Whammy",
            settings: { Mode: "2 Oct Up" },
            notes: "Assign to expression pedal or stomp mode for pitch effects.",
          },
          {
            position: 3,
            block_name: "JCM800",
            block_category: "Amp",
            original_gear: "Marshall JCM800 2205",
            settings: {
              Gain: 8.0,
              Bass: 6.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 5.0,
              Master: 6.0,
            },
            notes: "Cranked JCM800 for aggressive rhythm tone. Push the gain hard.",
          },
          {
            position: 4,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Close-miked for tight, aggressive tone.",
          },
        ],
        notes:
          "The QC handles pitch shifting and wah simultaneously well. For the killswitch effect, use a volume block assigned to a stomp switch. Morello's playing technique is the most important element.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall JCM800 2205",
            settings: {
              Gain: 8,
              Bass: 6,
              Middle: 7,
              Treble: 6,
              Presence: 5,
              Volume: 6,
            },
            notes: "Brown channel cranked for aggressive Marshall distortion.",
          },
          {
            position: 2,
            block_name: "Pedal Wah",
            block_category: "Pedal FX",
            original_gear: "Dunlop Cry Baby Wah",
            settings: { Position: "GA-FC Expression" },
            notes: "Requires GA-FC foot controller for expression pedal wah control.",
          },
        ],
        notes:
          "The Katana can handle the core rhythm tone well with the Brown channel, but the Whammy pitch effects require an external DigiTech Whammy pedal — the Katana's built-in pitch shifting is limited for this style. The wah requires the GA-FC foot controller.",
      },
    },
    is_editorial: true,
    view_count: 0,
    rating_avg: 0,
    rating_count: 0,
  },
  // ---- James Hetfield - Master of Puppets ----
  {
    id: "seed-hetfield-master-of-puppets",
    song_slug: "master-of-puppets-metallica",
    title: "Hetfield's Master of Puppets Thrash Rhythm Tone",
    slug: "hetfield-master-of-puppets-rhythm",
    description:
      "The definitive thrash metal rhythm guitar tone. James Hetfield's sound on Master of Puppets is built on an ESP Explorer with EMG pickups through a Mesa/Boogie Mark IIC+ — a combination that produces a tight, aggressive, scooped-mid tone with razor-sharp pick attack and crushing low end. The Mark IIC+ is the holy grail of metal amps: its lead channel provides high-gain saturation with incredible note definition even at extreme gain levels. Hetfield's relentless downpicking technique is the engine that drives this tone.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "ESP Explorer (custom)",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".011-.048",
      notable_mods:
        "ESP custom Explorer with EMG 81 in the bridge position. The active EMG 81 provides a hot, compressed output that is perfectly suited for high-gain metal tones: tight low end, scooped mids, and extended high-frequency response.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "overdrive",
        gear_slug: "ibanez-tube-screamer-ts808",
        gear_name: "Ibanez Tube Screamer (boost)",
        icon_type: "boss_compact",
        icon_color: "#22c55e",
        is_in_effects_loop: false,
        settings: { Drive: 0, Tone: 5, Level: 8 },
        notes:
          "A Tube Screamer with the drive at ZERO is used as a clean boost and mid-hump filter to tighten the Mesa's low end. This technique, later popularized widely, removes the flubby bass frequencies that can occur with high-gain amps and adds mid-frequency cut. The Level is maxed to push the front end hard.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "mesa-boogie-mark-iic-plus",
        gear_name: "Mesa/Boogie Mark IIC+ (Lead Channel)",
        icon_type: "marshall_head",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: {
          Volume: 7,
          Treble: 7,
          Bass: 3,
          Middle: 3,
          "Lead Drive": 7,
          "Lead Master": 6,
          Presence: 5,
        },
        notes:
          "The classic scooped-mid metal EQ: bass and mids are low, treble is high. This creates the characteristic thrash metal 'V-curve' EQ shape. The Lead Drive is pushed hard for saturated, sustained distortion. The Mark IIC+ has a unique gain structure that maintains note clarity and pick definition even at extreme gain levels.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Mesa/Boogie 4x12 Rectifier Cabinet",
        icon_type: "cab_4x12",
        icon_color: "#2d2d2d",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "A Mesa 4x12 with Celestion Vintage 30 speakers provides a tight, modern low end with a pronounced upper-midrange presence. The V30 speakers are the standard for metal guitar tones.",
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
        settings: { Position: "on-axis, close-miked" },
        notes:
          "Master of Puppets was produced by Flemming Rasmussen at Sweet Silence Studios in Copenhagen. The guitar tone is tight, dry, and up-front in the mix.",
      },
    ],
    original_gear: {
      guitar:
        "ESP Explorer (custom), EMG 81 bridge pickup, standard tuning, .011-.048 strings",
      effects: ["Ibanez Tube Screamer (clean boost, drive at zero)"],
      amp: "Mesa/Boogie Mark IIC+ (Lead channel)",
      cabinet: "Mesa/Boogie 4x12 with Celestion Vintage 30 speakers",
      microphone: "Shure SM57 (close-miked)",
      other_notes:
        "Hetfield's relentless all-downstroke picking technique is the most critical element of the Master of Puppets tone. The percussive, aggressive attack of downpicking cannot be replicated with alternate picking — it is a fundamental part of the sound. The tight palm muting and precise rhythmic articulation are what make the riffs sound so powerful.",
    },
    tags: ["thrash-metal", "metal", "rhythm", "high-gain", "hetfield", "metallica", "mesa"],
    sources: [
      "https://equipboard.com/pros/james-hetfield",
      "https://www.guitarworld.com/features/james-hetfield-metallica-gear",
    ],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Scream 808",
            block_category: "Distortion",
            original_gear: "Ibanez Tube Screamer (boost)",
            settings: { Drive: 0, Tone: 5.0, Level: 8.0 },
            notes:
              "Drive at ZERO. This is a pure clean boost and low-end tightener. The mid-hump of the Screamer cuts through the mix. Level maxed to slam the amp.",
          },
          {
            position: 2,
            block_name: "Cali Rectifire",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Mark IIC+",
            settings: {
              Drive: 7.5,
              Bass: 3.0,
              Mid: 3.0,
              Treble: 7.0,
              Presence: 5.0,
              "Ch Vol": 6.0,
            },
            notes:
              "Helix doesn't have an exact Mark IIC+ model. The Cali Rectifire provides a similar high-gain Mesa character with the scooped-mid metal tone. Keep bass and mids low, treble high for the classic V-curve.",
          },
          {
            position: 3,
            block_name: "4x12 Cali V30",
            block_category: "Cab",
            original_gear: "Mesa 4x12 V30",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes:
              "The Cali V30 cab provides the tight, modern metal low end. Close-miked for maximum aggression.",
          },
        ],
        notes:
          "The Tube Screamer boost with drive at zero is the key technique for modern metal tones on Helix. It tightens the low end and adds mid-frequency cut. Use all downstrokes and tight palm muting for authentic Hetfield rhythms. This patch also works well with the PV Panama model as an alternative amp.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "TS808 OD",
            block_category: "Drive",
            original_gear: "Ibanez Tube Screamer (boost)",
            settings: { Drive: 0, Tone: 5.0, Level: 8.0 },
            notes: "Drive at zero. Clean boost to tighten the Mesa's low end.",
          },
          {
            position: 2,
            block_name: "Mesa Mark IIC+",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Mark IIC+",
            settings: {
              Gain: 7.5,
              Bass: 3.0,
              Mid: 3.0,
              Treble: 7.0,
              Presence: 5.0,
              Master: 6.0,
            },
            notes:
              "If a Mark IIC+ model is available, it is one of the QC's strongest metal amp models. Scooped mids, high treble, moderate gain for the classic thrash V-curve.",
          },
          {
            position: 3,
            block_name: "4x12 V30",
            block_category: "Cab",
            original_gear: "Mesa 4x12 V30",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Mesa 4x12 with V30 speakers for tight metal tone.",
          },
        ],
        notes:
          "The QC excels at high-gain metal tones. Search Cortex Cloud for 'Mark IIC+' or 'Metallica' captures. Community captures of real Mark IIC+ amps with the Tube Screamer boost are among the most popular on the platform.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Lead",
            block_category: "Amp Type",
            original_gear: "Mesa/Boogie Mark IIC+",
            settings: {
              Gain: 8,
              Bass: 3,
              Middle: 3,
              Treble: 7,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "The Katana's Lead channel provides the high-gain saturation needed for thrash metal. Scoop the mids and push the treble for the V-curve EQ shape.",
          },
          {
            position: 2,
            block_name: "Blues Driver",
            block_category: "Booster",
            original_gear: "Ibanez Tube Screamer (boost)",
            settings: { Level: 8, Tone: 5, Drive: 0 },
            notes:
              "Blues Driver in the Booster slot with drive at zero acts as a clean boost and low-end tightener, mimicking the Tube Screamer boost technique.",
          },
        ],
        notes:
          "The Katana's Lead channel scooped with a Blues Driver boost gets a convincing thrash metal tone. Use all downstrokes, tight palm muting, and a bridge humbucker for the authentic Hetfield attack. This setup handles the Master of Puppets riffs surprisingly well.",
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
