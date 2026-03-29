export interface Writer {
  slug: string;
  name: string;
  title: string;
  bio: string;
  image?: string; // path to profile photo in /public/writers/
}

const WRITERS: Writer[] = [
  {
    slug: "rick-dalton",
    name: "Rick Dalton",
    title: "The Analog Patriarch",
    bio: "Rick has been gigging since 1978, when he saw AC/DC at Cobo Hall in Detroit and bought a used SG copy the next week. He spent the '80s and '90s playing bars, clubs, and the occasional festival across the Midwest before moving to Nashville in '92, where he's done part-time guitar tech work for touring acts and picked up session calls ever since. His rig hasn't changed much — a '76 SG Standard, a '72 Marshall Super Lead, and an original TS808 he bought new in 1982. His pedalboard is a piece of plywood with zip ties. He counts Angus Young, Billy Gibbons, and Malcolm Young (especially Malcolm) among his primary influences, and he will tell you that learning to turn down was the best mod he ever made.",
    image: "/writers/rick-dalton.jpg",
  },
  {
    slug: "jess-kowalski",
    name: "Jess Kowalski",
    title: "The Punk Engineer",
    bio: "Jess grew up in central Pennsylvania, heard American Idiot on her cousin's iPod at 10, and learned every Green Day song from YouTube on a Squier Bullet Strat. She dropped out of audio engineering school after two years to tour with her band Parking Lot Confessional and now works live sound at a Philadelphia venue three nights a week, picking up freelance mixing gigs on the side. She runs a Jazzmaster into an HX Stomp and goes direct to PA with no amp on stage — and soundchecks in four minutes. When she's not playing or mixing, she's arguing about gain staging on Reddit or testing whether a $40 Amazon pedal can hang with the boutique stuff. Her influences range from Billie Joe Armstrong to St. Vincent to whatever weird noise band played the venue last Tuesday.",
    image: "/writers/jess-kowalski.jpg",
  },
  {
    slug: "sean-nakamura",
    name: "Sean Nakamura",
    title: "The Digital Architect",
    bio: "Sean is a UX designer in Portland, Oregon, who watched a Tosin Abasi playthrough at 14 and taught himself guitar entirely from YouTube. He's never owned a tube amp. His current setup is a Strandberg Boden 7-string into a Quad Cortex through Yamaha HS8 studio monitors, and he has a spreadsheet tracking every preset he's ever built. Before the QC he ran a Kemper; before that, a Helix — he's methodical about his platform migrations the same way he's methodical about everything. He counts Plini, Misha Mansoor, and Guthrie Govan among his main influences, and he approaches tone the way he approaches design: systematically, with version control. He has two cats named Plini and Petrucci. The cats don't get along, which he thinks is poetic.",
    image: "/writers/sean-nakamura.jpg",
  },
  {
    slug: "margot-thiessen",
    name: "Margot Thiessen",
    title: "The Tone Sommelier",
    bio: "Margot started on classical piano at 6 and picked up guitar at 16 after hearing John Mayer's Continuum. She studied jazz guitar at Berklee for two years before transferring to NYU for journalism — a combination that left her with strong opinions about voice leading and a compulsion to write about them. She teaches guitar to adult beginners at a studio in Williamsburg and freelances as a music journalist. Her rig centers on a Fender Jazzmaster and a Collings I-35 semi-hollow through a '65 Deluxe Reverb Reissue, and she waited three years for her Analog Man King of Tone. Her patch cables are color-coordinated. She is a recovering Gear Page addict and will share her opinions about your reverb decay time whether you asked or not.",
    image: "/writers/margot-thiessen.jpg",
  },
  {
    slug: "carl-beckett",
    name: "Carl Beckett",
    title: "The One-Guitar Guy",
    bio: "Carl is a carpenter and custom furniture maker in Tulsa, Oklahoma. He found his grandfather's Kay acoustic in the attic at 12, taught himself from a Mel Bay chord book, and didn't buy an electric until he was 19. He's played the same 1997 Fender American Standard Telecaster for 29 years — butterscotch blonde, maple neck, into a Blues Junior, one cable. He occasionally uses a Tube Screamer when the song needs it. That's the whole rig. He plays at church on Sundays and at an open mic every other Thursday, and he thinks about tone the way he thinks about woodworking: get good materials, don't overthink the finish, let the grain speak for itself.",
    image: "/writers/carl-beckett.jpg",
  },
  {
    slug: "dev-okonkwo",
    name: "Dev Okonkwo",
    title: "The Bedroom Producer",
    bio: "Dev is a junior software developer in Atlanta who discovered guitar at 17 after hearing Khruangbin's \"Maria También\" on a Spotify playlist. He bought a Squier Affinity Strat and a Focusrite Scarlett Solo, learned by slowing down songs in Ableton, and has never played a live gig. He makes ambient guitar loops at 2 AM using Neural DSP plugins and Valhalla Supermassive — a free reverb plugin he considers the greatest thing ever made — and puts them on the internet. He thinks about guitar in terms of frequency space, not stage volume, and his influences are as likely to be Toro y Moi or Tycho as any guitarist. He's a computer science major and Nigerian-American, and his parents are still holding out hope he'll go back to pre-med.",
    image: "/writers/dev-okonkwo.jpg",
  },
  {
    slug: "nathan-cross",
    name: "Nathan Cross",
    title: "The Worship Architect",
    bio: "Nathan leads worship at a 1,200-member church in Franklin, Tennessee, and does occasional session work for worship album recordings. He started on drums in his youth band at 13, switched to guitar at 15 when the regular guitarist left for college, and learned four chords by Sunday because the worship leader told him to. His rig is built around a PRS Silver Sky, Strymon Timeline and BigSky, and a Vox AC30, all running through in-ear monitors for services. Dotted eighths are his love language, dynamics are his most important effect, and he spends more time thinking about how the congregation feels during a song than how he sounds playing it. He counts John Mayer, Lincoln Brewster, and Hillsong's Nigel Hendroff among his main influences.",
    image: "/writers/nathan-cross.jpg",
  },
  {
    slug: "viktor-kessler",
    name: "Viktor Kessler",
    title: "The Metal Scientist",
    bio: "Viktor is a mechanical engineer at a defense contractor in Austin, Texas, who spends his days on stress analysis and tolerance calculations and his nights applying the same rigor to guitar tone. He heard Meshuggah's \"Bleed\" at 13, was so confused by the polyrhythms that he became obsessed, and spent his first year of playing learning nothing but palm muting technique. He runs a 7-string ESP E-II Horizon and an 8-string Ibanez RG8 through an EVH 5150 III for tracking and a Quad Cortex for direct recording and silent practice — he keeps both, because context matters. His gain structure involves a Maxon OD808 always on as a pre-amp tightener, a Fortin Zuul+ noise gate, and the conviction that if your palm mute doesn't feel like a hydraulic press, your signal chain is wrong. He has the data to prove it.",
    image: "/writers/viktor-kessler.jpg",
  },
  {
    slug: "hank-presswood",
    name: "Hank Presswood",
    title: "The Vintage Collector",
    bio: "Hank ran Presswood Guitars in Austin, Texas, for 25 years before retiring in 2019. He now buys, sells, and appraises vintage instruments through a private network and consults for auction houses. He got started after seeing Stevie Ray Vaughan on Austin City Limits at 14 and riding his bike to a pawn shop in Lubbock to buy a beat-up Harmony Stratotone for $25. His personal collection includes a 1964 Fender Deluxe Reverb, a 1962 pre-CBS Stratocaster, and an original gold Klon Centaur — and he will absolutely tell you about all of them. He plays with a glass slide cut from a Coricidin bottle, like Duane Allman, and his only concession to modernity is a TC Electronic Polytune. After a quarter century behind the counter, he's played, appraised, or repaired thousands of guitars and has stories about most of them.",
    image: "/writers/hank-presswood.jpg",
  },
  {
    slug: "elena-ruiz",
    name: "Elena Ruiz",
    title: "The Parent Player",
    bio: "Elena is a product manager in Denver who learned her first chords on her dad's conjunto guitar in San Antonio at 12. She got into indie rock through a burned CD of Arcade Fire's Funeral in high school, played in a band called Static Ceremony through college and into her mid-20s, and stopped gigging when her first kid came. She now has two kids (ages 6 and 4) and plays through a Fender Mustang Micro after bedtime or an HX Stomp on the coffee table when she has real time — twenty minutes on a Tuesday, a weekend morning when her husband takes the kids to the park. She writes for players who don't have the luxury of long practice sessions, because she is one, and she's learned that constraints aren't the enemy of good tone — they're just the terms of the deal.",
    image: "/writers/elena-ruiz.jpg",
  },
];

/** Look up a writer by slug. Falls back to a generic "Fader & Knob" author. */
export function getWriter(slug: string): Writer {
  return (
    WRITERS.find((w) => w.slug === slug) ?? {
      slug: "fader-and-knob",
      name: "Fader & Knob",
      title: "",
      bio: "Tone recipes from the songs you love.",
    }
  );
}

/** Get a writer by legacy display name (e.g. "Fader & Knob", "Rick Dalton"). */
export function getWriterByName(name: string): Writer {
  return (
    WRITERS.find((w) => w.name === name) ?? {
      slug: "fader-and-knob",
      name: name || "Fader & Knob",
      title: "",
      bio: "Tone recipes from the songs you love.",
    }
  );
}

/** Return all writers for listing/filter pages. */
export function getAllWriters(): Writer[] {
  return WRITERS;
}
