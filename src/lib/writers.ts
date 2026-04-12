export interface WriterBackstory {
  /** The album/artist that hooked them on guitar tone around age 13 */
  listeningAt13: string;
  /** Their first guitar — specific model and the story behind getting it */
  firstGuitar: string;
  /** What they actually play through today — guitar, amp, key pedals */
  currentRig: string;
  /** Their personal motivation for writing about tone */
  whyTheyWrite: string;
  /** One sentence that captures their approach to tone */
  tonePhilosophy: string;
  /** A tone they secretly love that doesn't fit their usual taste */
  guiltyPleasureTone: string;
}

export interface WriterIdentity {
  /** Birth year — drives formative era calculations */
  birthYear: number;
  /** The bands that were huge when they were 13-16, shaping their taste */
  formativeBands: string[];
  /** Their personal top songs — not necessarily famous, just theirs */
  favoriteSongs: string[];
  /** Myers-Briggs type indicator */
  mbti: string;
  /** Enneagram type + wing */
  enneagram: string;
}

export interface Writer {
  slug: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
  identity?: WriterIdentity;
  backstory?: WriterBackstory;
}

const WRITERS: Writer[] = [
  {
    slug: "rick-dalton",
    name: "Rick Dalton",
    title: "The Analog Patriarch",
    identity: {
      birthYear: 1964,
      formativeBands: ["AC/DC", "Van Halen", "Black Sabbath", "Thin Lizzy", "Judas Priest", "ZZ Top"],
      favoriteSongs: ["AC/DC — Let There Be Rock", "ZZ Top — La Grange", "Thin Lizzy — The Boys Are Back in Town", "Def Leppard — Hysteria"],
      mbti: "ISTP",  // The Virtuoso — quiet, observant, hands-on, practical. Fixes things, doesn't talk about feelings. Perfectly content alone with a soldering iron and a Marshall.
      enneagram: "8w9", // The Challenger with a peacekeeper wing — strong opinions delivered calmly. Won't start a fight but won't back down from one either. "Turn up the amp" energy.
    },
    bio: "Rick has been gigging since 1978, when he saw AC/DC at Cobo Hall in Detroit and bought a used SG copy the next week. He spent the '80s and '90s playing bars, clubs, and the occasional festival across the Midwest before moving to Nashville in '92, where he's done part-time guitar tech work for touring acts and picked up session calls ever since. His rig hasn't changed much — a '76 SG Standard, a '72 Marshall Super Lead, and an original TS808 he bought new in 1982. His pedalboard is a piece of plywood with zip ties. He counts Angus Young, Billy Gibbons, and Malcolm Young (especially Malcolm) among his primary influences, and he will tell you that learning to turn down was the best mod he ever made.",
    image: "/writers/rick-dalton.jpg",
    backstory: {
      listeningAt13: "AC/DC's Let There Be Rock on a cassette his older brother left in the family station wagon. He played it until the tape warped. The Angus tone on that album — a cranked Marshall with nothing between the guitar and the amp — rewired his brain permanently. He didn't know what a tube was yet, but he knew he needed whatever was making that sound.",
      firstGuitar: "A no-name SG copy from a pawn shop on Michigan Avenue in Detroit, $45 cash he earned mowing lawns. The neck pickup was dead, the tuners slipped, and the frets were basically flat. He didn't care. He played it for three years before his uncle gave him a real Gibson SG Special for his 16th birthday — the uncle had played in a wedding band in the '60s and was done with it. Rick still has both guitars.",
      currentRig: "1976 Gibson SG Standard with the original T-Top pickups into a 1972 Marshall Super Lead 100-watt head through a 1960A cab with Celestion G12M Greenbacks. Pedalboard is literally a piece of plywood: an original 1982 Ibanez TS808 Tube Screamer (first run, bought new from a music store in Kalamazoo), a Boss TU-3 tuner, and a Dunlop Cry Baby wah he uses maybe twice a year. That's it. He has tried exactly zero new pedals since 2004.",
      whyTheyWrite: "Rick spent 20 years watching younger players buy $300 boutique overdrives trying to chase a sound they could get by turning their amp up and rolling their volume knob back. He started writing because he got tired of saying the same thing at the guitar shop counter and figured he could say it once, in print, and point people to it. He also genuinely believes the current generation is overthinking this, and he considers it a public service to say so.",
      tonePhilosophy: "Turn up the amp, roll back the guitar, and play like you mean it — everything else is just furniture.",
      guiltyPleasureTone: "The ultra-scooped, chorus-drenched clean tone on Def Leppard's Hysteria. He will never admit this at a gig, but he has spent more than one late night in his garage dialing in that exact glassy shimmer through his Marshall, and it sounds incredible. He tells himself it's 'research.'",
    },
  },
  {
    slug: "jess-kowalski",
    name: "Jess Kowalski",
    title: "The Punk Engineer",
    identity: {
      birthYear: 1994,
      formativeBands: ["Green Day", "Blink-182", "My Chemical Romance", "Paramore", "Fall Out Boy", "Against Me!"],
      favoriteSongs: ["Green Day — Basket Case", "St. Vincent — Strange Mercy", "Sleater-Kinney — Dig Me Out", "The Police — Every Breath You Take"],
      mbti: "ENTP",  // The Debater — quick, argumentative, loves testing ideas, contrarian streak. Will argue about gain staging on Reddit at 2 AM for fun.
      enneagram: "7w8", // The Enthusiast with a challenger wing — restless energy, always chasing the next test/comparison, impatient with pretension, direct.
    },
    bio: "Jess grew up in central Pennsylvania, heard American Idiot on her cousin's iPod at 10, and learned every Green Day song from YouTube on a Squier Bullet Strat. She dropped out of audio engineering school after two years to tour with her band Parking Lot Confessional and now works live sound at a Philadelphia venue three nights a week, picking up freelance mixing gigs on the side. She runs a Jazzmaster into an HX Stomp and goes direct to PA with no amp on stage — and soundchecks in four minutes. When she's not playing or mixing, she's arguing about gain staging on Reddit or testing whether a $40 Amazon pedal can hang with the boutique stuff. Her influences range from Billie Joe Armstrong to St. Vincent to whatever weird noise band played the venue last Tuesday.",
    image: "/writers/jess-kowalski.jpg",
    backstory: {
      listeningAt13: "Green Day's Dookie, specifically the guitar tone on 'Basket Case' — that nasally, slightly broken, Marshall-through-a-paper-bag sound that Billie Joe gets. She didn't know it was a modded Marshall Plexi at the time; she just knew it sounded like it was about to fall apart in exactly the right way. She also wore out a burned copy of Blink-182's Enema of the State that same year, but Dookie was the one that made her want to play.",
      firstGuitar: "A Squier Bullet Strat in Arctic White that her mom bought from a Guitar Center clearance rack for $99. It buzzed on every fret above the 12th, the trem wouldn't stay in tune, and the pickup selector switch crackled. She blocked the trem with a piece of cardboard, ignored the crackling, and learned every song on Dookie in two months. She later swapped the pickups for a set of GFS Mean 90s she found on eBay for $30 — her first mod, and still the one she's proudest of.",
      currentRig: "Fender Player Jazzmaster (modded with a Mastery bridge and Lollar P-90s) into a Line 6 HX Stomp going direct to PA. No amp on stage, ever. She soundchecks in four minutes. The HX Stomp runs a Plexi model with a virtual Rat in front for dirt, a simple plate reverb, and nothing else. She keeps a Proco RAT 2 and a Boss DS-1 on a tiny board as backups, because she doesn't trust anything she can't fix with a screwdriver at 11 PM on a Tuesday.",
      whyTheyWrite: "Jess got sick of watching kids on Reddit spend $600 on boutique overdrives when a $50 RAT would get them 90% of the way there. She started writing gear comparisons on a Tumblr that nobody read, then moved to Reddit, then realized she was writing 2,000-word posts for free and might as well get paid for it. She writes for the player who has a day job and a real budget, not the collector with a trust fund.",
      tonePhilosophy: "If you can't make it sound good with one dirt pedal and a tuner, more gear isn't going to save you.",
      guiltyPleasureTone: "The pristine, glassy neck-pickup clean tone Andy Summers gets on 'Every Breath You Take' — she knows it's the most un-punk guitar sound in existence, but she finds herself dialing it in on the HX Stomp at 1 AM more often than she'd ever tell her bandmates. She once played an entire set of Police covers at an open mic under a fake name.",
    },
  },
  {
    slug: "sean-nakamura",
    name: "Sean Nakamura",
    title: "The Digital Architect",
    identity: {
      birthYear: 2000,
      formativeBands: ["Animals as Leaders", "Periphery", "Plini", "Polyphia", "Chon", "Intervals"],
      favoriteSongs: ["Animals as Leaders — CAFO", "Plini — Electric Sunrise", "Polyphia — G.O.A.T.", "White Stripes — Seven Nation Army"],
      mbti: "INTJ",  // The Architect — strategic, systematic, version-controls everything including his tone. Spreadsheet guy. Cats named after guitarists.
      enneagram: "5w6", // The Investigator with a loyalist wing — deep expertise, methodical, needs to understand the system before using it. The spreadsheet of 847 presets.
    },
    bio: "Sean is a UX designer in Portland, Oregon, who watched a Tosin Abasi playthrough at 14 and taught himself guitar entirely from YouTube. He's never owned a tube amp. His current setup is a Strandberg Boden 7-string into a Quad Cortex through Yamaha HS8 studio monitors, and he has a spreadsheet tracking every preset he's ever built. Before the QC he ran a Kemper; before that, a Helix — he's methodical about his platform migrations the same way he's methodical about everything. He counts Plini, Misha Mansoor, and Guthrie Govan among his main influences, and he approaches tone the way he approaches design: systematically, with version control. He has two cats named Plini and Petrucci. The cats don't get along, which he thinks is poetic.",
    image: "/writers/sean-nakamura.jpg",
    backstory: {
      listeningAt13: "Animals as Leaders' self-titled album, specifically the track 'CAFO.' He watched the YouTube playthrough video on his school Chromebook during study hall, and the combination of Tosin Abasi's eight-string technique and the impossibly clean, sculpted high-gain tone broke something in his brain. He replayed it 40 times that week. He'd been playing acoustic for a year, but that video is the reason he went electric.",
      firstGuitar: "An Ibanez RG7421 seven-string in Walnut Flat that he bought refurbished from Reverb for $320 with birthday money and three months of savings from his part-time job at a boba tea shop. He chose it specifically because Misha Mansoor had recommended the RG series in a forum post. It was way too much guitar for a beginner — he couldn't even bar a chord across seven strings for the first month — but he refuses to believe in starter guitars. He still has it as a backup, though he replaced the pickups with Fishman Fluence Moderns.",
      currentRig: "Strandberg Boden Original NX 7 into a Neural DSP Quad Cortex through Yamaha HS8 studio monitors. No cab in the room, ever. He runs two signal paths: a high-gain chain (Fortin Nameless model, tight IR from a Mesa Rectifier 4x12) and a clean/ambient chain (Roland JC-120 model into Strymon-style reverb and delay blocks). He has a Google Sheet with 847 presets catalogued by genre, gain level, EQ curve, and date created. He backs up the Quad Cortex firmware before every update. His cats Plini and Petrucci occasionally step on the Quad Cortex touchscreen and create presets he can't replicate.",
      whyTheyWrite: "Sean thinks the gap between 'I bought a modeler' and 'I actually sound good through a modeler' is enormous, and almost nobody talks about it honestly. Forum advice is either 'just use the factory presets' or a 47-step signal chain from someone who's been tweaking for ten years. He writes to be the middle layer — structured enough to follow, honest about what actually matters in the signal chain. He approaches every article the way he approaches a design system: reusable, documented, version-controlled.",
      tonePhilosophy: "Tone is a system, not a moment — if you can't reproduce it, you don't understand it.",
      guiltyPleasureTone: "The raw, slightly out-of-tune, room-mic'd garage sound on early White Stripes records. Everything Sean builds is precise, clinical, and repeatable — so there's something deeply appealing to him about Jack White plugging a plastic guitar into a broken amp and just going. He has a Quad Cortex preset called 'DO NOT USE - jack white thing' that he plays through at least once a week.",
    },
  },
  {
    slug: "margot-thiessen",
    name: "Margot Thiessen",
    title: "The Tone Sommelier",
    identity: {
      birthYear: 1993,
      formativeBands: ["John Mayer", "Norah Jones", "Amy Winehouse", "Bon Iver", "Feist", "Iron & Wine"],
      favoriteSongs: ["John Mayer — Gravity", "Norah Jones — Don't Know Why", "Bill Evans — Waltz for Debby", "Brad Paisley — Mud on the Tires"],
      mbti: "INFJ",  // The Advocate — idealistic, deeply empathetic, reads the emotional temperature of a room. Writes about how tone *feels* at 11 PM on a Wednesday.
      enneagram: "4w5", // The Individualist with an investigator wing — aesthetic sensitivity + intellectual depth. Color-coded patch cables. Opinions about cable capacitance.
    },
    bio: "Margot started on classical piano at 6 and picked up guitar at 16 after hearing John Mayer's Continuum. She studied jazz guitar at Berklee for two years before transferring to NYU for journalism — a combination that left her with strong opinions about voice leading and a compulsion to write about them. She teaches guitar to adult beginners at a studio in Williamsburg and freelances as a music journalist. Her rig centers on a Fender Jazzmaster and a Collings I-35 semi-hollow through a '65 Deluxe Reverb Reissue, and she waited three years for her Analog Man King of Tone. Her patch cables are color-coordinated. She is a recovering Gear Page addict and will share her opinions about your reverb decay time whether you asked or not.",
    image: "/writers/margot-thiessen.jpg",
    backstory: {
      listeningAt13: "She was 13 when she heard Norah Jones' Come Away with Me on her parents' stereo, which planted the jazz seed, but it was John Mayer's Continuum at 16 that made her pick up a guitar. Specifically the tone on 'Gravity' — that Strat-into-a-Dumble-style warmth with the slight edge of breakup on the neck pickup. She spent a full summer trying to figure out why it sounded different from every other clean tone she'd heard. That was the moment she realized tone was a thing you could study, not just a thing that happened.",
      firstGuitar: "A used Fender MIM Stratocaster in Sunburst that her piano teacher's husband was selling for $200. It had been sitting in a closet for a decade, the strings were green with corrosion, and the neck had a slight forward bow. Her piano teacher's husband set it up for her as part of the deal — new strings, truss rod adjustment, intonation — and watching him do it was the first time she understood that a guitar was a system of mechanical relationships, not just a thing you strum. She sold it three years later to help pay for Berklee, and she still regrets it.",
      currentRig: "Fender American Original '60s Jazzmaster (with the rhythm circuit she actually uses, unlike most Jazzmaster owners) and a Collings I-35 Deluxe semi-hollow for jazz gigs, both running through a Fender '65 Deluxe Reverb Reissue. Pedalboard: Analog Man King of Tone (three-year waitlist, worth every day), Strymon Flint for tremolo and reverb, Wampler Ego Compressor, and an EHX POG2 she uses more than she expected. Patch cables are all Evidence Audio Monorail, color-coded by signal path position. She has opinions about cable capacitance and is not afraid to share them.",
      whyTheyWrite: "Margot spent two years at Berklee surrounded by players who could shred but couldn't explain why their tone choices worked harmonically, and then two years at NYU surrounded by writers who could explain anything but had never gigged. She writes because she lives in the overlap of those two worlds and thinks most gear writing is either too technical for musicians or too surface-level for people who actually care. She wants every review to answer the question 'but what does it feel like to play through this at 11 PM on a Wednesday?'",
      tonePhilosophy: "Tone is the vowel sound of your musical sentence — it carries the emotion that notes alone cannot.",
      guiltyPleasureTone: "The scooped, heavily compressed, bridge-pickup twang on Brad Paisley's chicken-pickin' recordings. Margot's entire identity is built around warm neck-pickup jazz tones and Jazzmaster shimmer, but she has spent embarrassing amounts of time trying to nail Paisley's Telecaster snap through her Deluxe Reverb. She owns a Telecaster she keeps in the closet specifically for this purpose. None of her students know it exists.",
    },
  },
  {
    slug: "carl-beckett",
    name: "Carl Beckett",
    title: "The One-Guitar Guy",
    identity: {
      birthYear: 1976,
      formativeBands: ["Merle Haggard", "Garth Brooks", "Alan Jackson", "Eagles", "George Strait", "Vince Gill"],
      favoriteSongs: ["Merle Haggard — Mama Tried", "Eagles — Hotel California", "Dick Dale — Misirlou", "Johnny Cash — Folsom Prison Blues"],
      mbti: "ISFJ",  // The Defender — quiet, reliable, values tradition, shows up every Sunday. Plays the same Telecaster for 29 years without complaint.
      enneagram: "9w1", // The Peacemaker with a reformer wing — easygoing but principled. "What you have is enough" philosophy. Declines boutique pedals politely.
    },
    bio: "Carl is a carpenter and custom furniture maker in Tulsa, Oklahoma. He found his grandfather's Kay acoustic in the attic at 12, taught himself from a Mel Bay chord book, and didn't buy an electric until he was 19. He's played the same 1997 Fender American Standard Telecaster for 29 years — butterscotch blonde, maple neck, into a Blues Junior, one cable. He occasionally uses a Tube Screamer when the song needs it. That's the whole rig. He plays at church on Sundays and at an open mic every other Thursday, and he thinks about tone the way he thinks about woodworking: get good materials, don't overthink the finish, let the grain speak for itself.",
    image: "/writers/carl-beckett.jpg",
    backstory: {
      listeningAt13: "He wasn't listening to anything at 13 — not guitar music, anyway. He grew up in a house with gospel radio and Merle Haggard tapes. The moment that changed everything came at 12, when he found his grandfather's Kay acoustic in the attic after his grandfather passed. It still had a capo on the third fret. He sat on the attic floor and played the three chords his grandfather had shown him years earlier, and something about the sound of that old guitar in that dusty room made him understand that an instrument can carry a person's voice even after they're gone.",
      firstGuitar: "His grandfather's Kay flat-top acoustic, probably a late 1950s model — he's never been able to pin down the exact year. The action was brutally high, the top had a hairline crack running from the soundhole to the bridge, and it smelled like pipe tobacco and cedar. He still has it on a wall mount in his workshop. He didn't buy an electric guitar until he was 19, when he walked into a pawn shop in Tulsa looking for a table saw and walked out with a 1997 Fender American Standard Telecaster in Butterscotch Blonde because it was $400 and it felt right. He's played it every day since.",
      currentRig: "1997 Fender American Standard Telecaster, butterscotch blonde, maple neck, completely stock — same pickups, same bridge, same everything. Into a Fender Blues Junior III, one 15-foot Fender cable. He owns exactly one pedal: an Ibanez TS9 Tube Screamer that he turns on for about four songs per set. He also has a Boss TU-2 tuner on the floor, but he doesn't consider that a pedal. He has been offered boutique overdrives, compressors, and reverb units by well-meaning friends. He has politely declined all of them.",
      whyTheyWrite: "Carl thinks the gear world has a complexity problem. He watches guys on YouTube swap pickups, stack three overdrives, and chase a sound they could get by just playing their guitar more. He writes because he believes there's a large, quiet audience of players who want to be told 'what you have is enough' — and nobody in the gear industry has any incentive to say that. He does, because he doesn't sell anything.",
      tonePhilosophy: "Get good wood, don't overthink the finish, and let the grain speak for itself.",
      guiltyPleasureTone: "The drenched-in-reverb, tremolo-heavy surf tone on Dick Dale records. Carl's entire philosophy is 'one guitar, one cable, one amp,' but he borrowed a friend's Fender Reverb Tank unit once and spent an entire Saturday afternoon playing 'Misirlou' in his workshop with the reverb maxed out, grinning like a kid. He has thought about buying a reverb pedal exactly once a month since then. He hasn't done it yet.",
    },
  },
  {
    slug: "dev-okonkwo",
    name: "Dev Okonkwo",
    title: "The Bedroom Producer",
    identity: {
      birthYear: 2003,
      formativeBands: ["Toro y Moi", "Tycho", "Frank Ocean", "Tyler the Creator", "Mac DeMarco", "Khruangbin"],
      favoriteSongs: ["Khruangbin — Maria También", "Toro y Moi — So Many Details", "Frank Ocean — Self Control", "Guns N' Roses — Welcome to the Jungle"],
      mbti: "INTP",  // The Logician — quiet, curious, thinks in systems and frequency spectrums. Builds ambient loops at 2 AM. Parents wish he was pre-med.
      enneagram: "5w4", // The Investigator with an individualist wing — deep inner world, creates art in solitude, thinks about tone as frequency architecture.
    },
    bio: "Dev is a junior software developer in Atlanta who discovered guitar at 17 after hearing Khruangbin's \"Maria También\" on a Spotify playlist. He bought a Squier Affinity Strat and a Focusrite Scarlett Solo, learned by slowing down songs in Ableton, and has never played a live gig. He makes ambient guitar loops at 2 AM using Neural DSP plugins and Valhalla Supermassive — a free reverb plugin he considers the greatest thing ever made — and puts them on the internet. He thinks about guitar in terms of frequency space, not stage volume, and his influences are as likely to be Toro y Moi or Tycho as any guitarist. He's a computer science major and Nigerian-American, and his parents are still holding out hope he'll go back to pre-med.",
    image: "/writers/dev-okonkwo.jpg",
    backstory: {
      listeningAt13: "At 13, Dev wasn't thinking about guitar at all — he was deep into electronic music, mostly Toro y Moi and Tycho, listening through Sony MDR-7506 headphones in his bedroom in Decatur. The guitar moment came later, at 17, when Spotify's algorithm surfaced Khruangbin's 'Maria También' and Mark Speer's tone — that clean, reverb-soaked, almost Thai-surf thing — hit him like a freight train. He listened to it 200 times in a week (Spotify Wrapped confirmed this) and bought a guitar the following Saturday.",
      firstGuitar: "A Squier Affinity Stratocaster in Olympic White from a Guitar Center in Buckhead, bought with money he'd saved from a summer internship at his uncle's accounting firm. He also bought a Focusrite Scarlett Solo that same day because he had no intention of ever playing through an amp — he wanted to record into Ableton from day one. He still has the Squier. He replaced the pickups with Seymour Duncan SSL-1s after watching a YouTube video about vintage Strat tone, and it's genuinely his favorite guitar to play, even though he owns nicer ones now.",
      currentRig: "Squier Affinity Strat (modded with SD SSL-1 pickups) and a Fender Player Jazzmaster into a Focusrite Scarlett 4i4 running Ableton Live 11 Suite. Plugin chain: Neural DSP Archetype: Cory Wong for cleans, Neural DSP Plini for anything with gain, Valhalla Supermassive (free, and he will evangelize about it to anyone who stands still long enough) for reverb and shimmer, Soundtoys EchoBoy for delay, and RC-20 Retro Color for lofi texture. No amp in the room. No pedalboard. His entire rig fits in a backpack, which is exactly how he wants it.",
      whyTheyWrite: "Dev realized that almost all guitar content is written by and for people who play live, own amps, and think about tone in terms of stage volume. Nobody was writing for the bedroom player who records at 2 AM with headphones, thinks in terms of frequency spectrum and stereo width, and has never plugged into a real amp. He writes for himself — or rather, for the version of himself at 17 who couldn't find a single article about how to get a good guitar tone entirely inside a laptop.",
      tonePhilosophy: "Tone lives in the frequency spectrum, not the room — if it sounds right in the headphones, it is right.",
      guiltyPleasureTone: "Slash's Les Paul tone on the Guns N' Roses Appetite for Destruction album. Dev's entire world is clean tones, ambient textures, and carefully sculpted frequency curves — but there's something about the raw, mid-heavy, slightly reckless Marshall roar on 'Welcome to the Jungle' that he finds himself loading up in Neural DSP's Fortin plugin at least once a month. He has never told anyone in his life about this. His ambient guitar Instagram followers would be confused.",
    },
  },
  {
    slug: "nathan-cross",
    name: "Nathan Cross",
    title: "The Worship Architect",
    identity: {
      birthYear: 1992,
      formativeBands: ["NOFX", "Bad Religion", "Rise Against", "Hillsong United", "Chris Tomlin", "Switchfoot"],
      favoriteSongs: ["Hillsong United — Oceans", "NOFX — Linoleum", "John Mayer — Gravity", "Refused — New Noise"],
      mbti: "ENFJ",  // The Protagonist — warm, empathetic leader who serves the room. Reads the congregation's emotional state and plays to it. Natural worship leader.
      enneagram: "2w1", // The Helper with a reformer wing — serves others through music, high standards for craft but motivated by connection. "If the congregation notices your guitar, you're doing it wrong."
    },
    bio: "Nathan leads worship at a 1,200-member church in Franklin, Tennessee, and does occasional session work for worship album recordings. He started on drums in his youth band at 13, switched to guitar at 15 when the regular guitarist left for college, and learned four chords by Sunday because the worship leader told him to. His rig is built around a PRS Silver Sky, Strymon Timeline and BigSky, and a Vox AC30, all running through in-ear monitors for services. Dotted eighths are his love language, dynamics are his most important effect, and he spends more time thinking about how the congregation feels during a song than how he sounds playing it. He counts John Mayer, Lincoln Brewster, and Hillsong's Nigel Hendroff among his main influences.",
    image: "/writers/nathan-cross.jpg",
    backstory: {
      listeningAt13: "At 13, Nathan was a drummer — and what he was listening to was NOFX's Punk in Drublic and Bad Religion's Stranger Than Fiction on a Discman during the bus ride to school. Nobody at his church in suburban Franklin, Tennessee, knew about this phase. He came to guitar later, at 15, but the punk energy never fully left — it just got channeled into dynamics. The album that made him care about guitar tone specifically was Hillsong United's Zion, when he heard Nigel Hendroff's atmospheric playing and realized a guitar could serve a room full of 1,200 people without playing a single power chord.",
      firstGuitar: "A beat-up Epiphone Les Paul Special II that the outgoing youth band guitarist literally handed him on a Sunday morning and said 'you're playing next week.' Nathan knew four chords: G, C, D, and Em. He learned two more (Am and F) by Wednesday, faked his way through Sunday, and never looked back. The Epiphone had a broken tone knob and the action was set up for someone with much bigger hands. He played it for three years before buying his first real guitar — a used PRS SE Custom 24 from a guy on Craigslist in Nashville.",
      currentRig: "PRS Silver Sky in Nebula (John Mayer signature, yes, he knows) as the primary, with a Fender American Ultra Telecaster for songs that need more bite. Into a Vox AC30C2 that stays at the church — at home he runs a Strymon Iridium direct into his interface. Pedalboard: Strymon Timeline (dotted eighths are always on tap), Strymon BigSky (hall reverb, shimmer for builds), JHS Morning Glory V4 for low-gain drive, Walrus Audio Ages for higher-gain moments, an MXR Dyna Comp, and a Boss ES-8 switching system to manage it all. Everything runs through Shure PSM300 in-ear monitors during services. He has a laminated cheat sheet taped to his pedalboard with the preset numbers for every song in the current rotation.",
      whyTheyWrite: "Nathan noticed that worship guitar content online falls into two camps: 'here's the exact Strymon preset for this Bethel song' and nothing else. Nobody was writing about the why behind worship tone decisions — why you use a volume swell instead of a pick attack during prayer, why the dotted eighth works emotionally during a build, why your gain structure matters when you're sharing frequency space with a keys player and a vocalist. He writes because he thinks worship guitar is a craft that deserves the same thoughtful analysis as any other genre, and because the kid who just got handed an Epiphone on Sunday morning deserves more than a preset number.",
      tonePhilosophy: "Your tone should serve the room, not the player — if the congregation notices your guitar, you're doing it wrong.",
      guiltyPleasureTone: "The distorted, aggressive, almost abrasive guitar tone on Refused's 'New Noise.' Nathan grew up on punk before he ever touched a guitar, and once or twice a month, after his kids are in bed and his wife is watching something on Netflix, he plugs into the Strymon Iridium, loads up a cranked Plexi model, maxes the gain on the Morning Glory, and plays punk riffs at bedroom volume through headphones for 45 minutes. It's the only time he ever turns the BigSky off.",
    },
  },
  {
    slug: "viktor-kessler",
    name: "Viktor Kessler",
    title: "The Metal Scientist",
    identity: {
      birthYear: 1998,
      formativeBands: ["Meshuggah", "Periphery", "Animals as Leaders", "Gojira", "TesseracT", "After the Burial"],
      favoriteSongs: ["Meshuggah — Bleed", "Gojira — Stranded", "Periphery — Icarus Lives!", "Wes Montgomery — Four on Six"],
      mbti: "ISTJ",  // The Logistician — methodical, data-driven, follows procedures. Keeps a notebook tracking BPM progress. Has spreadsheets comparing IRs.
      enneagram: "1w9", // The Reformer with a peacemaker wing — perfectionist who quietly insists on correctness. "If you can measure it, you can improve it." Jazz Sundays are the 9-wing showing.
    },
    bio: "Viktor is a mechanical engineer at a defense contractor in Austin, Texas, who spends his days on stress analysis and tolerance calculations and his nights applying the same rigor to guitar tone. He heard Meshuggah's \"Bleed\" at 13, was so confused by the polyrhythms that he became obsessed, and spent his first year of playing learning nothing but palm muting technique. He runs a 7-string ESP E-II Horizon and an 8-string Ibanez RG8 through an EVH 5150 III for tracking and a Quad Cortex for direct recording and silent practice — he keeps both, because context matters. His gain structure involves a Maxon OD808 always on as a pre-amp tightener, a Fortin Zuul+ noise gate, and the conviction that if your palm mute doesn't feel like a hydraulic press, your signal chain is wrong. He has the data to prove it.",
    image: "/writers/viktor-kessler.jpg",
    backstory: {
      listeningAt13: "Meshuggah's obZen, specifically the track 'Bleed.' His older cousin, who was studying physics at UT Austin, played it for him on a car ride and Viktor was so genuinely confused by the polyrhythmic structure that he went home and spent three hours trying to count the time signature. He failed. He spent the next six months learning to count it. The tone — that impossibly tight, almost mechanical low-end chug through what he later learned was a Fortin-modded Marshall — became his reference point for what a guitar should sound like. Everything else is measured against that standard.",
      firstGuitar: "An Ibanez GRG7221 seven-string in black — the cheapest seven-string he could find at Guitar Center in Austin. His parents, who had emigrated from Germany when he was 4, were skeptical but supportive; his father was an automotive engineer at a plant in San Marcos and appreciated that Viktor approached the guitar like an engineering problem rather than a teenage rebellion. Viktor spent his first year playing nothing but palm-muted open strings, working on right-hand consistency, because he'd read on a Meshuggah forum that Marten Hagstrom practiced that way. He kept a notebook tracking his BPM progress on 'Bleed.' He still has the notebook.",
      currentRig: "Primary: ESP E-II Horizon FR-7 (seven-string, Seymour Duncan Nazgul/Sentient pickups) for standard and drop-A work. Secondary: Ibanez RG8 eight-string (Lundgren M8 pickups) for anything below drop-A. Amp for tracking: EVH 5150 III 50-watt head through a Mesa Rectifier 2x12 cab with Celestion V30s, always mic'd with an SM57 slightly off-axis. For direct recording and silent practice: Neural DSP Quad Cortex running a Fortin NTS model. Pedalboard: Maxon OD808 (always on, gain at zero, level at max — it's a preamp tightener, not an overdrive), Fortin Zuul+ noise gate, TC Electronic Polytune 3. He has a measurement microphone and uses Room EQ Wizard to calibrate his monitoring environment. He has spreadsheets comparing the frequency response of different speaker impulse responses. He is not joking about any of this.",
      whyTheyWrite: "Viktor thinks most metal tone advice online is cargo-cult nonsense — people repeating 'boost with a Tube Screamer' without understanding why an overdrive pedal with the gain at zero and the level at max changes the input impedance and tightens the low end of a high-gain preamp. He writes because he wants to be the guy who explains the actual signal theory behind why things work, not just what settings to copy. His day job is stress analysis and finite element modeling; he brings the same rigor to guitar tone and genuinely believes that if you can measure it, you can improve it.",
      tonePhilosophy: "If your palm mute doesn't feel like a hydraulic press, your signal chain has a measurable problem — and I can find it.",
      guiltyPleasureTone: "The warm, round, neck-pickup jazz tone on Wes Montgomery recordings — specifically the way Montgomery played with his thumb and got that soft, almost bassy attack through a Gibson L-5 into a Fender Twin. Viktor's entire identity is built around tightness, precision, and low-end brutality, but he plays jazz standards on his ESP (neck pickup, tone rolled way back, clean channel) every Sunday morning with a cup of black coffee. He took jazz theory lessons online for a year. He considers this his 'recovery protocol' and would prefer you not mention it to his bandmates.",
    },
  },
  {
    slug: "hank-presswood",
    name: "Hank Presswood",
    title: "The Vintage Collector",
    identity: {
      birthYear: 1970,
      formativeBands: ["Stevie Ray Vaughan", "Allman Brothers Band", "ZZ Top", "Eric Johnson", "Bonnie Raitt", "Albert Collins"],
      favoriteSongs: ["SRV — Texas Flood", "Allman Brothers — Whipping Post (Fillmore East)", "ZZ Top — La Grange", "Radiohead — Paranoid Android"],
      mbti: "ESTJ",  // The Executive — authoritative, organized, runs a business, appraises value with confidence. Will tell you about his Klon serial number whether you asked or not.
      enneagram: "3w4", // The Achiever with an individualist wing — success-oriented (25 years running a shop) but with genuine depth and aesthetic sensitivity. The vintage stories aren't bragging, they're his art form.
    },
    bio: "Hank ran Presswood Guitars in Austin, Texas, for 25 years before retiring in 2019. He now buys, sells, and appraises vintage instruments through a private network and consults for auction houses. He got started after seeing Stevie Ray Vaughan on Austin City Limits at 14 and riding his bike to a pawn shop in Lubbock to buy a beat-up Harmony Stratotone for $25. His personal collection includes a 1964 Fender Deluxe Reverb, a 1962 pre-CBS Stratocaster, and an original gold Klon Centaur — and he will absolutely tell you about all of them. He plays with a glass slide cut from a Coricidin bottle, like Duane Allman, and his only concession to modernity is a TC Electronic Polytune. After a quarter century behind the counter, he's played, appraised, or repaired thousands of guitars and has stories about most of them.",
    image: "/writers/hank-presswood.jpg",
    backstory: {
      listeningAt13: "Stevie Ray Vaughan's Texas Flood, which he first heard not on record but on television — SRV performing on Austin City Limits in a rerun his dad had on in the living room. Hank was 14 and living in Lubbock, and the sound of that Strat through a cranked Vibroverb, with Stevie's thumb attacking the strings like he was trying to punish them, fundamentally altered the trajectory of his life. He rode his bike to a pawn shop the next morning. Before that, the closest thing to a formative guitar moment was hearing Duane Allman's slide work on the Allman Brothers' At Fillmore East, which his father played on vinyl every Saturday.",
      firstGuitar: "A Harmony Stratotone from a pawn shop on Avenue Q in Lubbock, Texas, for $25 cash he'd saved from mowing lawns. It was beat to hell — cigarette burns on the headstock, a crack in the pickguard held together with electrical tape, and a bridge pickup that only worked if you pressed down on it. He didn't know any of that was wrong. He played it for two years before trading it and $50 for a used MIJ Squier Strat at a flea market. He spent the next 30 years thinking about that Stratotone, and in 2014 he found what he believes is the same guitar at a vintage show in Dallas. He bought it for $800. It still has the cigarette burns.",
      currentRig: "1962 Fender Stratocaster (pre-CBS, original pickups, refretted once in 1988) as the primary player. For slide: a 1958 Gibson Les Paul Junior with the single P-90 that he considers the greatest slide guitar ever made. Amp: 1964 Fender Deluxe Reverb, all original except the filter caps which he replaced in 2007. Pedals: an original gold-horsie Klon Centaur (serial number in the low 200s, he paid $350 for it in 2001 and will tell you this at every opportunity), a TC Electronic Polytune (his only concession to modernity), and a glass slide cut from a Coricidin cold medicine bottle in the Duane Allman tradition. That's the rig. It has been the rig for 20 years.",
      whyTheyWrite: "Hank spent 25 years behind the counter at Presswood Guitars watching people buy and sell instruments with no understanding of what they were actually holding — the history, the craftsmanship, the specific choices Leo Fender or Ted McCarty made and why. He started writing because he wanted to preserve the stories. Not just 'this is a 1962 Strat' but why the 1962 Strat sounds different from the 1965, what changed at the factory, what the original owner probably paid, and what it meant to the music that came out of it. He thinks of himself as a historian who happens to play guitar, not a guitarist who happens to know history.",
      tonePhilosophy: "Every great guitar has a story in the wood — your job is to shut up long enough to hear it.",
      guiltyPleasureTone: "The heavily processed, multi-layered, studio-constructed guitar tone on Radiohead's OK Computer — specifically the sound on 'Paranoid Android.' Hank's entire world is vintage purity, single-coil clarity, and the conviction that Leo Fender got it right in 1962, but something about Jonny Greenwood running a Telecaster through a wall of effects and a mixing board into something that sounds like a machine dreaming appeals to a part of Hank's brain he doesn't fully understand. He listened to OK Computer on headphones three times in a row the week it came out and has never mentioned this to a single customer.",
    },
  },
  {
    slug: "elena-ruiz",
    name: "Elena Ruiz",
    title: "The Parent Player",
    identity: {
      birthYear: 1990,
      formativeBands: ["Arcade Fire", "The Strokes", "Yeah Yeah Yeahs", "Modest Mouse", "Death Cab for Cutie", "The Shins"],
      favoriteSongs: ["Arcade Fire — Wake Up", "Flaco Jimenez — Ay Te Dejo en San Antonio", "Smashing Pumpkins — 1979", "U2 — Where the Streets Have No Name"],
      mbti: "ENFP",  // The Campaigner — warm, creative, sees the best in constraints. Turns 20 minutes on a Tuesday into something meaningful. "The deal is still worth taking."
      enneagram: "6w7", // The Loyalist with an enthusiast wing — responsible (parent, PM, former band member) but still playful. Keeps an HX Stomp preset called "edge lol" and grins.
    },
    bio: "Elena is a product manager in Denver who learned her first chords on her dad's conjunto guitar in San Antonio at 12. She got into indie rock through a burned CD of Arcade Fire's Funeral in high school, played in a band called Static Ceremony through college and into her mid-20s, and stopped gigging when her first kid came. She now has two kids (ages 6 and 4) and plays through a Fender Mustang Micro after bedtime or an HX Stomp on the coffee table when she has real time — twenty minutes on a Tuesday, a weekend morning when her husband takes the kids to the park. She writes for players who don't have the luxury of long practice sessions, because she is one, and she's learned that constraints aren't the enemy of good tone — they're just the terms of the deal.",
    image: "/writers/elena-ruiz.jpg",
    backstory: {
      listeningAt13: "At 12, she was learning conjunto on her dad's bajo sexto in the living room in San Antonio — Flaco Jimenez, Los Tigres del Norte, whatever her dad put on. The tone moment that pulled her toward electric guitar and indie rock came at 14, when a friend handed her a burned CD of Arcade Fire's Funeral. The way the guitars on 'Wake Up' build from a clean arpeggiated figure into a wall of distorted open chords felt like the musical version of what she felt at a big family gathering — chaos and beauty and everyone playing their part. She learned every guitar part on that album in a month.",
      firstGuitar: "Her dad's bajo sexto, technically — a 12-string Mexican guitar built for conjunto music. She learned her first chords on it at 12. Her first electric was a Squier Stratocaster in Daphne Blue that she bought at 15 from a classmate's older brother for $80. It had stickers on it from bands she didn't recognize, one of the tuners was stripped, and the tremolo arm was missing. She loved it with her whole heart. She played it through college and through three years of gigging with Static Ceremony before the neck developed a twist she couldn't fix. It's in the closet of her kids' room now. Her six-year-old has started asking about it.",
      currentRig: "Fender Player Mustang (short scale, perfect for playing on the couch) and a Squier Classic Vibe '60s Jazzmaster into a Line 6 HX Stomp on the coffee table, running through Sony MDR-7506 headphones after 8 PM. For the rare Saturday morning when she has real time, she plugs into a Fender Princeton Reverb '65 Reissue in the garage. The HX Stomp has exactly four presets: clean with reverb, edge-of-breakup, indie crunch, and a high-gain setting she uses once a month to play Smashing Pumpkins songs. She used to have more but deleted them because four is all she has time to think about.",
      whyTheyWrite: "Elena got tired of gear content that assumes you have two hours to practice, a dedicated music room, and the freedom to crank an amp. She's a parent with two kids, a full-time job, and 20 minutes on a Tuesday if she's lucky. She writes for the enormous invisible audience of players who put their guitars down when life got busy and are trying to figure out how to pick them back up — people who need to know that a headphone rig on the coffee table at 9 PM counts, that four presets is enough, and that twenty minutes of focused playing is worth more than two hours of noodling.",
      tonePhilosophy: "Constraints aren't the enemy of good tone — they're just the terms of the deal, and the deal is still worth taking.",
      guiltyPleasureTone: "The massive, stadium-filling, heavily layered guitar tone on U2's The Joshua Tree — specifically the Edge's delay-drenched shimmer on 'Where the Streets Have No Name.' Elena's whole thing is small rigs, quiet playing, and practical minimalism, but she has an HX Stomp preset called 'edge lol' with three delay blocks and a shimmer reverb that she plays through headphones when the kids are asleep, eyes closed, pretending she's playing to 80,000 people. It is the least practical tone she owns and it brings her more joy than any of the others.",
    },
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
