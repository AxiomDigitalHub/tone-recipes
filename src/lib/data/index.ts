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
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/4c/30/3b/4c303b15-31ec-2f95-5beb-370471968188/dj.fbyalctw.jpg/600x600bb.jpg",
  },
  {
    name: "David Gilmour",
    slug: "david-gilmour",
    bio: "Pink Floyd's lead guitarist, famous for expressive bends, singing sustain, and spacious delay-drenched lead tones. Gilmour's signal chain is one of the most studied and documented in guitar history.",
    genres: ["progressive-rock", "classic-rock", "psychedelic"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/81/0b/55/810b550c-a739-f930-0d65-5b703f8dd499/888880071057.jpg/600x600bb.jpg",
  },
  {
    name: "Jimi Hendrix",
    slug: "jimi-hendrix",
    bio: "The most influential electric guitarist in history. Hendrix pioneered the use of feedback, fuzz, wah, and the Uni-Vibe to create sounds that had never been heard before. His Strat-through-Marshall tone is the foundation of rock guitar.",
    genres: ["rock", "psychedelic", "blues-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/04/85/97/0485973d-6920-b651-f20d-5393755a6665/mzi.uexbwasy.jpg/600x600bb.jpg",
  },
  {
    name: "Kurt Cobain",
    slug: "kurt-cobain",
    bio: "Nirvana's frontman stripped guitar tone down to its essentials: a cheap offset guitar, a Boss DS-1, and a loud amp. The quiet-verse/loud-chorus dynamic he popularized defined 1990s alternative rock.",
    genres: ["grunge", "alternative", "punk"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "John Frusciante",
    slug: "john-frusciante",
    bio: "Red Hot Chili Peppers guitarist known for crystalline clean tones, funky rhythms, and melodic lead work. His Stratocaster-into-Marshall tone is one of the most recognizable in modern rock.",
    genres: ["alternative", "funk-rock", "rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4c/f7/9f/4cf79f35-0a9d-4f81-81f2-5645eeacb558/13UMGIM87733.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Slash",
    slug: "slash",
    bio: "Guns N' Roses lead guitarist whose Les Paul through a cranked Marshall JCM800 defined the sound of late-1980s hard rock. Known for melodic, blues-influenced solos and a raw, aggressive tone with a top hat and cigarette.",
    genres: ["hard-rock", "rock", "blues-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a0/4d/c4/a04dc484-03cc-02aa-fa82-5334fcb4bc16/18UMGIM24878.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Eddie Van Halen",
    slug: "eddie-van-halen",
    bio: "Revolutionary guitarist who invented modern rock guitar technique. His 'brown sound' — a modified Stratocaster-style guitar through a variac-powered Marshall Plexi — changed electric guitar tone forever. Pioneer of two-handed tapping, harmonics, and tremolo bar tricks.",
    genres: ["hard-rock", "rock", "metal"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/79/98/f7/7998f761-20e0-aa8e-4fb2-190062af1638/603497894161.jpg/600x600bb.jpg",
  },
  {
    name: "The Edge",
    slug: "the-edge",
    bio: "U2's guitarist, known for his textural, effects-driven approach to rock guitar. Rather than traditional riffs and solos, The Edge builds shimmering walls of sound using delay, reverb, and modulation. His dotted-eighth-note delay technique is one of the most recognizable sounds in rock.",
    genres: ["rock", "post-punk", "alternative"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1a/ba/3e/1aba3e49-70e9-7443-4c00-32364a9205b7/17UMGIM81723.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "John Mayer",
    slug: "john-mayer",
    bio: "Modern blues-rock guitarist who bridges the gap between SRV-style Texas blues and contemporary pop-rock. Known for impeccable touch, dynamic control, and a warm Stratocaster tone that owes as much to his hands as to his boutique gear.",
    genres: ["blues-rock", "pop-rock", "blues"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7a/a0/f4/7aa0f487-f983-390e-73ef-005115eea1e0/dj.oqpplyfm.jpg/600x600bb.jpg",
  },
  {
    name: "Eric Clapton",
    slug: "eric-clapton",
    bio: "One of the most influential blues-rock guitarists in history. From Cream's heavy psychedelic blues to his later laid-back sound, Clapton's tone has evolved across decades. His 'woman tone' and Layla-era SG work are cornerstones of rock guitar.",
    genres: ["blues-rock", "classic-rock", "blues"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/55/08/2b550878-8bad-b40f-9a58-d63aca53c824/00602498206034.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Mark Knopfler",
    slug: "mark-knopfler",
    bio: "Dire Straits frontman renowned for his distinctive fingerpicking technique on a Fender Stratocaster. His clean, articulate tone — achieved without a pick — is one of the most unique and instantly recognizable sounds in rock guitar.",
    genres: ["rock", "classic-rock", "blues-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c3/91/ff/c391ff50-caba-db8a-2387-6c906d2ca65c/mzi.gyijrdqr.jpg/600x600bb.jpg",
  },
  {
    name: "B.B. King",
    slug: "bb-king",
    bio: "The King of the Blues. B.B. King's singing vibrato, precise string bending, and warm tone from his beloved 'Lucille' ES-355 through a Fender amp defined modern blues guitar. He never played chords; every note was a melody.",
    genres: ["blues", "electric-blues"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f9/a4/c6/f9a4c613-ecfd-2440-c268-87168e580156/06UMGIM01700.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Jack White",
    slug: "jack-white",
    bio: "The White Stripes frontman who proved that raw, lo-fi guitar tone and two-piece minimalism could be massive. His use of cheap vintage gear, plastic guitars, and aggressive playing style brought garage rock back into the mainstream.",
    genres: ["garage-rock", "alternative", "blues-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/e2/9e/1ce29ea2-4ceb-e775-9b4f-1191ea6155ab/810074424233.jpg/600x600bb.jpg",
  },
  {
    name: "Tom Morello",
    slug: "tom-morello",
    bio: "Rage Against the Machine guitarist who turned the electric guitar into a turntable and synthesizer. Using a simple rig of a Les Paul, Marshall head, and creative effects manipulation, Morello created sounds never before heard from a guitar.",
    genres: ["alternative-metal", "rap-rock", "rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c4/86/e7/c486e799-462a-6e73-de77-eb227649cfab/810090098166_Cover.jpg/600x600bb.jpg",
  },
  {
    name: "James Hetfield",
    slug: "james-hetfield",
    bio: "Metallica's rhythm guitarist and frontman, whose tight, percussive downpicking and crushing Mesa/Boogie tone defined thrash metal. His aggressive right hand and scooped-mid tone on Master of Puppets became the blueprint for metal rhythm guitar.",
    genres: ["thrash-metal", "metal", "hard-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9e/80/1b/9e801b06-67fa-0990-2d15-85480ad3cd46/850007452025.png/600x600bb.jpg",
  },
  {
    name: "Angus Young",
    slug: "angus-young",
    bio: "AC/DC's lead guitarist and the embodiment of high-energy rock and roll. Known for his schoolboy uniform, Chuck Berry-inspired duckwalk, and a raw Gibson SG tone through cranked Marshalls that defined hard rock rhythm guitar. His riffs on Back in Black made it one of the best-selling albums of all time.",
    genres: ["hard-rock", "rock", "blues-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1e/14/58/1e145814-281a-58e0-3ab1-145f5d1af421/886443673441.jpg/600x600bb.jpg",
  },
  {
    name: "Carlos Santana",
    slug: "carlos-santana",
    bio: "Mexican-American guitarist who fused Latin percussion rhythms with blues-rock guitar. Santana's PRS through a Mesa Boogie Mark I produces a singing, sustained lead tone drenched in midrange warmth. His tone on Smooth and Supernatural brought him back to mainstream dominance in 1999.",
    genres: ["latin-rock", "blues-rock", "rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f5/97/4c/f5974c1e-06cb-f84c-1da9-5f7505a20a0c/mzi.etsqfvqq.jpg/600x600bb.jpg",
  },
  {
    name: "Pete Townshend",
    slug: "pete-townshend",
    bio: "The Who's guitarist and primary songwriter, known for explosive windmill strumming, power chords, and feedback. Townshend's SG through Hi-Watt amps at maximum volume pioneered the wall-of-sound approach to rock guitar and influenced punk, power pop, and arena rock.",
    genres: ["rock", "classic-rock", "hard-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4e/d5/19/4ed519ca-3f8b-65ee-eb21-89d5c6a0b44e/00602547140265.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Jerry Garcia",
    slug: "jerry-garcia",
    bio: "Grateful Dead's lead guitarist and cultural icon. Garcia's clean, sparkling Stratocaster tone through a Twin Reverb was the canvas for his improvisational style that blended folk, country, blues, and psychedelia into something entirely unique. His tone was about clarity and articulation, not distortion.",
    genres: ["rock", "psychedelic", "jam-band"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/e9/b6/e2/e9b6e214-1f54-8386-913b-e245fa960ff6/603497920761.jpg/600x600bb.jpg",
  },
  {
    name: "Alex Lifeson",
    slug: "alex-lifeson",
    bio: "Rush's guitarist, known for blending complex progressive arrangements with hard rock power. Lifeson's use of chorus, delay, and a semi-hollow ES-355 through Marshalls created a shimmering, layered tone that could shift from delicate arpeggios to thunderous power chords within a single song.",
    genres: ["progressive-rock", "hard-rock", "rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/19/39/78/19397873-9581-13e0-07f3-3071f38527ac/12UMGIM19114.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Brian May",
    slug: "brian-may",
    bio: "Queen's guitarist and astrophysicist who built his own guitar, the Red Special, from a fireplace mantel. His unique tone comes from running that homemade guitar through a Vox AC30 with a Dallas Rangemaster treble booster, creating a rich, harmonically complex sound. Known for multi-tracked guitar orchestrations.",
    genres: ["rock", "classic-rock", "hard-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Tony Iommi",
    slug: "tony-iommi",
    bio: "Black Sabbath's guitarist and the godfather of heavy metal. After losing his fingertips in a factory accident, Iommi tuned down, used light strings, and created the heaviest guitar tone of the early 1970s. His detuned SG through a Laney amp defined the doom-laden sound of heavy metal.",
    genres: ["metal", "hard-rock", "doom-metal"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/62/8a/3d/628a3dc3-c862-8641-6306-64d7e7e8960a/075992718523.jpg/600x600bb.jpg",
  },
  {
    name: "Randy Rhoads",
    slug: "randy-rhoads",
    bio: "Ozzy Osbourne's legendary guitarist who brought classical music discipline and technique to heavy metal. His Les Paul through cranked Marshalls with a Cry Baby wah and MXR distortion created a precise, aggressive tone that raised the bar for metal guitar virtuosity. Tragically killed in a tour bus accident at age 25.",
    genres: ["metal", "hard-rock", "classic-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/dc/c9/d9/dcc9d998-a7b5-ea48-f6d5-d7861f44b162/884977974553.jpg/600x600bb.jpg",
  },
  {
    name: "Joe Satriani",
    slug: "joe-satriani",
    bio: "One of the most technically accomplished rock guitarists ever. Satriani's Ibanez JS series guitars through Marshall amps produce a fluid, singing lead tone that bridges rock, metal, and jazz fusion. He taught Steve Vai, Kirk Hammett, and Larry LaLonde before becoming a solo instrumental rock star.",
    genres: ["instrumental-rock", "hard-rock", "fusion"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/40/cc/4a/40cc4a28-8630-bf68-fe8d-5fe4801fc915/884977849714.jpg/600x600bb.jpg",
  },
  {
    name: "Noel Gallagher",
    slug: "noel-gallagher",
    bio: "Oasis songwriter and guitarist whose wall-of-guitar approach defined 1990s Britpop. Gallagher's Epiphone semi-hollowbodies through cranked Marshalls produced a thick, jangly tone layered multiple times in the studio. His simple but effective chord-based style on Wonderwall became one of the most played songs in guitar history.",
    genres: ["britpop", "alternative", "rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/77/32/74/7732746d-25e5-baae-b921-bad4a07d87b1/19UMGIM55524.rgb.jpg/600x600bb.jpg",
  },
  {
    name: "Johnny Marr",
    slug: "johnny-marr",
    bio: "The Smiths' guitarist and one of the most influential indie rock guitarists ever. Marr's intricate, jangly style combined Rickenbacker and Fender guitars with heavy use of chorus, tremolo, and delay to create shimmering, layered textures that defined the alternative rock guitar sound of the 1980s.",
    genres: ["indie-rock", "alternative", "post-punk"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/9d/b2/b0/9db2b04c-d7b2-050b-5c9e-4f64c6e03a3a/745099189228.jpg/600x600bb.jpg",
  },
  {
    name: "Keith Richards",
    slug: "keith-richards",
    bio: "Rolling Stones guitarist and the architect of rock and roll rhythm guitar. Richards' open-G tuned Telecaster through a cranked Fender Twin created the raw, swinging groove that drove the Stones for six decades. His interlocking guitar parts with Ron Wood defined the two-guitar band format.",
    genres: ["rock", "blues-rock", "classic-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ec/96/2b/ec962b50-cafd-9af8-a2ea-921dfc79d835/artwork.jpg/600x600bb.jpg",
  },
  {
    name: "Billy Gibbons",
    slug: "billy-gibbons",
    bio: "ZZ Top's guitarist and one of the most distinctive tonemakers in rock. Gibbons' Les Paul through a cranked Marshall Plexi with a Dallas Rangemaster treble booster creates a grinding, bluesy tone with massive sustain. Known for his pinch harmonics, fuzzy beard, and a '59 Les Paul nicknamed 'Pearly Gates.'",
    genres: ["blues-rock", "hard-rock", "southern-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/19/4d/3c/194d3c17-7a21-5622-0939-16feb62b6b07/0603497921430.jpg/600x600bb.jpg",
  },
  {
    name: "Dimebag Darrell",
    slug: "dimebag-darrell",
    bio: "Pantera's guitarist who revolutionized groove metal with crushing, razor-sharp riffs and screaming harmonics. His Dean ML through a solid-state Randall Century 200 created an aggressive, scooped tone with surgical precision. His right-hand technique and use of the whammy bar influenced an entire generation of metal guitarists.",
    genres: ["groove-metal", "metal", "hard-rock"],
    image_url: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/a5/58/4aa55871-5d67-c61a-ad07-ec55c9a6bb1b/17de7bae-e679-468e-8d0a-0243359bb8d0.jpg/600x600bb.jpg",
  },
];

export const songs: Song[] = [
  {
    artist_slug: "stevie-ray-vaughan",
    title: "Pride and Joy",
    slug: "pride-and-joy-stevie-ray-vaughan",
    album: "Texas Flood",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/27/50/02/27500228-f8e4-8c5c-bb1c-8bfbec68a5fb/886443827141.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/00/67/45/006745f5-95d5-5a06-35ed-d515e9cfd7d8/dj.tbwlxwoh.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/19/7a/58/197a5870-618b-446f-a193-ca4a84502adc/190295781163.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/2b/56/2b2b564c-e21e-bd40-a8cf-cb47dedcb7df/093624932147.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a3/20/20/a3202033-3d92-2267-eab4-9a87ec1aa95e/710423.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7a/ef/88/7aef88ad-25aa-be91-eb78-8917c3f114f7/603497894130.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8f/e2/c3/8fe2c384-f6cb-9af7-371d-2b6a9b204e59/17UMGIM79292.rgb.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7a/a0/f4/7aa0f487-f983-390e-73ef-005115eea1e0/dj.oqpplyfm.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/89/ed/29/89ed29be-8412-0b5a-1df0-295fb5337dd6/00600753314289.rgb.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music/47/c3/21/mzi.ciyzkqao.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f9/a4/c6/f9a4c613-ecfd-2440-c268-87168e580156/06UMGIM01700.rgb.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/48/b5/b9/48b5b90e-ba1e-08ff-1217-9e479afdad5d/196589901750.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c4/86/e7/c486e799-462a-6e73-de77-eb227649cfab/810090098166_Cover.jpg/600x600bb.jpg",
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
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/ed/ee/7f/edee7f18-85b6-ebb4-0620-89cbe56fe205/858978005554.png/600x600bb.jpg",
    year: 1986,
    genres: ["thrash-metal", "metal"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/metallica-master-of-puppets-tab-s185",
    external_video_url:
      "https://www.youtube.com/results?search_query=master+of+puppets+guitar+lesson",
  },
  {
    artist_slug: "angus-young",
    title: "Back in Black",
    slug: "back-in-black-ac-dc",
    album: "Back in Black",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1e/14/58/1e145814-281a-58e0-3ab1-145f5d1af421/886443673441.jpg/600x600bb.jpg",
    year: 1980,
    genres: ["hard-rock", "rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/ac-dc-back-in-black-tab-s4",
    external_video_url:
      "https://www.youtube.com/results?search_query=back+in+black+guitar+lesson",
  },
  {
    artist_slug: "carlos-santana",
    title: "Smooth",
    slug: "smooth-santana",
    album: "Supernatural",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f5/97/4c/f5974c1e-06cb-f84c-1da9-5f7505a20a0c/mzi.etsqfvqq.jpg/600x600bb.jpg",
    year: 1999,
    genres: ["latin-rock", "rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/santana-smooth-tab-s274",
    external_video_url:
      "https://www.youtube.com/results?search_query=santana+smooth+guitar+lesson",
  },
  {
    artist_slug: "pete-townshend",
    title: "Won't Get Fooled Again",
    slug: "wont-get-fooled-again-the-who",
    album: "Who's Next",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a5/e7/70/a5e7703c-4e30-da7a-a319-2d3caef42c0e/23UM1IM04872.rgb.jpg/600x600bb.jpg",
    year: 1971,
    genres: ["rock", "classic-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/the-who-wont-get-fooled-again-tab-s371",
    external_video_url:
      "https://www.youtube.com/results?search_query=wont+get+fooled+again+guitar+lesson",
  },
  {
    artist_slug: "jerry-garcia",
    title: "Truckin'",
    slug: "truckin-grateful-dead",
    album: "American Beauty",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f5/27/20/f5272061-2466-6375-c2d1-f20d14be569f/603497920952.jpg/600x600bb.jpg",
    year: 1970,
    genres: ["rock", "psychedelic", "jam-band"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/grateful-dead-truckin-tab-s135",
    external_video_url:
      "https://www.youtube.com/results?search_query=truckin+grateful+dead+guitar+lesson",
  },
  {
    artist_slug: "alex-lifeson",
    title: "Tom Sawyer",
    slug: "tom-sawyer-rush",
    album: "Moving Pictures",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9e/84/e9/9e84e984-e923-de7d-16e5-982b2cdd1d98/21UMGIM68387.rgb.jpg/600x600bb.jpg",
    year: 1981,
    genres: ["progressive-rock", "hard-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/rush-tom-sawyer-tab-s263",
    external_video_url:
      "https://www.youtube.com/results?search_query=rush+tom+sawyer+guitar+lesson",
  },
  {
    artist_slug: "brian-may",
    title: "Bohemian Rhapsody",
    slug: "bohemian-rhapsody-queen",
    album: "A Night at the Opera",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b1/a9/84/b1a984dc-8dce-e8cb-1a0e-20293f7c500a/14DMGIM05548.rgb.jpg/600x600bb.jpg",
    year: 1975,
    genres: ["rock", "classic-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/queen-bohemian-rhapsody-tab-s239",
    external_video_url:
      "https://www.youtube.com/results?search_query=bohemian+rhapsody+guitar+lesson",
  },
  {
    artist_slug: "tony-iommi",
    title: "Iron Man",
    slug: "iron-man-black-sabbath",
    album: "Paranoid",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/be/27/91/be279120-2285-16c6-c7ba-9d6643d4a948/075992732727.jpg/600x600bb.jpg",
    year: 1970,
    genres: ["metal", "hard-rock"],
    difficulty: "beginner",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/black-sabbath-iron-man-tab-s27432",
    external_video_url:
      "https://www.youtube.com/results?search_query=iron+man+black+sabbath+guitar+lesson",
  },
  {
    artist_slug: "randy-rhoads",
    title: "Crazy Train",
    slug: "crazy-train-ozzy-osbourne",
    album: "Blizzard of Ozz",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/92/06/bd/9206bdb3-453a-db69-44f4-c4b5bfe33510/886448748045.jpg/600x600bb.jpg",
    year: 1980,
    genres: ["metal", "hard-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/ozzy-osbourne-crazy-train-tab-s225",
    external_video_url:
      "https://www.youtube.com/results?search_query=crazy+train+guitar+lesson",
  },
  {
    artist_slug: "stevie-ray-vaughan",
    title: "Texas Flood",
    slug: "texas-flood-stevie-ray-vaughan",
    album: "Texas Flood",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/27/50/02/27500228-f8e4-8c5c-bb1c-8bfbec68a5fb/886443827141.jpg/600x600bb.jpg",
    year: 1983,
    genres: ["blues", "texas-blues"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/stevie-ray-vaughan-texas-flood-tab-s81",
    external_video_url:
      "https://www.youtube.com/results?search_query=texas+flood+srv+guitar+lesson",
  },
  {
    artist_slug: "joe-satriani",
    title: "Surfing with the Alien",
    slug: "surfing-with-the-alien-joe-satriani",
    album: "Surfing with the Alien",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/40/cc/4a/40cc4a28-8630-bf68-fe8d-5fe4801fc915/884977849714.jpg/600x600bb.jpg",
    year: 1987,
    genres: ["instrumental-rock", "hard-rock"],
    difficulty: "advanced",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/joe-satriani-surfing-with-the-alien-tab-s152",
    external_video_url:
      "https://www.youtube.com/results?search_query=surfing+with+the+alien+guitar+lesson",
  },
  {
    artist_slug: "noel-gallagher",
    title: "Wonderwall",
    slug: "wonderwall-oasis",
    album: "(What's the Story) Morning Glory?",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/04/92/e0/0492e08b-cbcc-9969-9ad6-8f5a0888068c/5051961007107.jpg/600x600bb.jpg",
    year: 1995,
    genres: ["britpop", "alternative", "rock"],
    difficulty: "beginner",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/oasis-wonderwall-tab-s221",
    external_video_url:
      "https://www.youtube.com/results?search_query=wonderwall+guitar+lesson",
  },
  {
    artist_slug: "johnny-marr",
    title: "How Soon Is Now?",
    slug: "how-soon-is-now-the-smiths",
    album: "Meat Is Murder",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/74/1f/ff/741fff7e-e99e-757d-e600-e19d9df0d078/745099189563.jpg/600x600bb.jpg",
    year: 1985,
    genres: ["indie-rock", "alternative", "post-punk"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/the-smiths-how-soon-is-now-tab-s147",
    external_video_url:
      "https://www.youtube.com/results?search_query=how+soon+is+now+smiths+guitar+lesson",
  },
  {
    artist_slug: "keith-richards",
    title: "Start Me Up",
    slug: "start-me-up-rolling-stones",
    album: "Tattoo You",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f6/ce/84/f6ce84ab-f31b-51c6-125f-269a2fdd2639/21UMGIM70501.rgb.jpg/600x600bb.jpg",
    year: 1981,
    genres: ["rock", "classic-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/the-rolling-stones-start-me-up-tab-s281",
    external_video_url:
      "https://www.youtube.com/results?search_query=start+me+up+rolling+stones+guitar+lesson",
  },
  {
    artist_slug: "billy-gibbons",
    title: "La Grange",
    slug: "la-grange-zz-top",
    album: "Tres Hombres",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/19/4d/3c/194d3c17-7a21-5622-0939-16feb62b6b07/0603497921430.jpg/600x600bb.jpg",
    year: 1973,
    genres: ["blues-rock", "hard-rock", "southern-rock"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/zz-top-la-grange-tab-s172",
    external_video_url:
      "https://www.youtube.com/results?search_query=la+grange+zz+top+guitar+lesson",
  },
  {
    artist_slug: "dimebag-darrell",
    title: "Walk",
    slug: "walk-pantera",
    album: "Vulgar Display of Power",
    album_art_url: "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/30/9a/67/309a675a-6648-5b6c-bc3e-2822c3e90d67/cover.jpg/600x600bb.jpg",
    year: 1992,
    genres: ["groove-metal", "metal"],
    difficulty: "intermediate",
    external_tab_url:
      "https://www.songsterr.com/a/wsa/pantera-walk-tab-s233",
    external_video_url:
      "https://www.youtube.com/results?search_query=pantera+walk+guitar+lesson",
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
    icon_color: "#ef4444",
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
    icon_color: "#8b5cf6",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#94a3b8",
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
    icon_color: "#ef4444",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#a1a1aa",
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
    icon_color: "#a1a1aa",
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
  {
    name: "Marshall JTM45",
    slug: "marshall-jtm45",
    type: "amp",
    manufacturer: "Marshall",
    icon_type: "marshall_head",
    icon_color: "#a1a1aa",
    description:
      "The original Marshall amp, essentially a clone of the Fender Bassman circuit built in London. Warm, bluesy overdrive with a British voice. Used by Angus Young, Eric Clapton, and countless classic rock players. Lower gain than the later Plexi but with a sweeter, more organic breakup.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 12 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Presence", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Brit J45 Nrm",
      quad_cortex: "JTM45",
      fractal: "JTM45",
      kemper: "Marshall JTM45",
      katana: "Brown Channel",
    },
  },
  {
    name: "Mesa/Boogie Mark I",
    slug: "mesa-boogie-mark-i",
    type: "amp",
    manufacturer: "Mesa/Boogie",
    icon_type: "fender_combo",
    icon_color: "#a1a1aa",
    description:
      "Randall Smith's modified Fender Princeton that launched Mesa/Boogie. The Mark I's cascading gain stages produce singing sustain with a rich, warm midrange character. Carlos Santana's primary amp, defining the smooth, creamy lead tone heard on Abraxas and Supernatural.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
        { name: "Gain", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Cali Texas Ch1",
      quad_cortex: "Mesa Mark I",
      fractal: "Mark I",
      kemper: "Mesa Mark I",
      katana: "Lead Channel",
    },
  },
  {
    name: "Fender Twin Reverb",
    slug: "fender-twin-reverb",
    type: "amp",
    manufacturer: "Fender",
    icon_type: "fender_combo",
    icon_color: "#ef4444",
    description:
      "The loudest Fender combo amp. 85 watts of clean headroom through two 12-inch speakers make the Twin Reverb the gold standard for pristine, sparkling clean tone. Its lush built-in spring reverb and vibrato circuit are studio staples. Used by everyone from Jerry Garcia to Keith Richards.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Reverb", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "US Double Nrm",
      quad_cortex: "Twin Reverb",
      fractal: "Twin Reverb",
      kemper: "Fender Twin",
      katana: "Clean Channel",
    },
  },
  {
    name: "Laney LA100BL Supergroup",
    slug: "laney-la100bl",
    type: "amp",
    manufacturer: "Laney",
    icon_type: "marshall_head",
    icon_color: "#a1a1aa",
    description:
      "Tony Iommi's amplifier of choice. The Laney Supergroup is a high-powered British valve head with a thick, grinding overdrive and heavy low-end response. Its dark, saturated character is the foundation of Black Sabbath's doom-laden sound and the blueprint for heavy metal amp tone.",
    default_settings: {
      knobs: [
        { name: "Volume", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Brit Plexi Brt",
      quad_cortex: "Laney Supergroup",
      fractal: "Supergroup",
      kemper: "Laney Supergroup",
      katana: "Brown Channel",
    },
  },
  {
    name: "PRS Custom 24",
    slug: "prs-custom-24",
    type: "guitar",
    manufacturer: "PRS",
    icon_type: "les_paul",
    icon_color: "#8b0000",
    description:
      "Paul Reed Smith's flagship guitar, bridging the gap between a Les Paul and a Stratocaster. Dual humbuckers with coil-splitting, a 25-inch scale length, and a carved maple top deliver a warm, rich tone with exceptional sustain. Carlos Santana's signature guitar since the late 1980s.",
    modeler_equivalents: {},
  },
  {
    name: "Fender Telecaster",
    slug: "fender-telecaster",
    type: "guitar",
    manufacturer: "Fender",
    icon_type: "strat",
    icon_color: "#d4a574",
    description:
      "The first commercially successful solid-body electric guitar. Two single-coil pickups deliver a bright, twangy tone with a snappy attack. The bridge pickup cuts through any mix, while the neck pickup offers warm, round tones. Keith Richards' weapon of choice, often in open-G tuning.",
    modeler_equivalents: {},
  },
  {
    name: "Rickenbacker 330",
    slug: "rickenbacker-330",
    type: "guitar",
    manufacturer: "Rickenbacker",
    icon_type: "les_paul",
    icon_color: "#d4a574",
    description:
      "A semi-hollow electric guitar with a distinctive jangly, chimey tone. The high-output single-coil pickups and through-body neck produce a bright, articulate sound with natural compression. Associated with The Byrds, The Beatles, and Johnny Marr of The Smiths.",
    modeler_equivalents: {},
  },
  {
    name: "Dean ML",
    slug: "dean-ml",
    type: "guitar",
    manufacturer: "Dean",
    icon_type: "les_paul",
    icon_color: "#0000ff",
    description:
      "A sharp, angular guitar designed by Dean Zelinsky in 1977. The V-meets-Explorer body shape with high-output humbuckers delivers an aggressive, tight tone. Dimebag Darrell made the Dean ML synonymous with groove metal through his work with Pantera.",
    modeler_equivalents: {},
  },
  {
    name: "Randall Century 200",
    slug: "randall-century-200",
    type: "amp",
    manufacturer: "Randall",
    icon_type: "marshall_head",
    icon_color: "#a1a1aa",
    description:
      "A solid-state amp head that Dimebag Darrell used to define Pantera's crushing groove metal tone. Unlike tube amps, the Randall's solid-state power section delivers tight, precise distortion with razor-sharp articulation. The scooped midrange and surgical gain structure make it perfect for aggressive metal riffing.",
    default_settings: {
      knobs: [
        { name: "Gain", min: 0, max: 10 },
        { name: "Bass", min: 0, max: 10 },
        { name: "Middle", min: 0, max: 10 },
        { name: "Treble", min: 0, max: 10 },
        { name: "Master", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "PV Panama",
      quad_cortex: "Randall Century",
      fractal: "Recto2 Red Mdrn",
      kemper: "Randall",
      katana: "Lead Channel",
    },
  },
  {
    name: "Epiphone Riviera",
    slug: "epiphone-riviera",
    type: "guitar",
    manufacturer: "Epiphone",
    icon_type: "les_paul",
    icon_color: "#d4a574",
    description:
      "A semi-hollow body guitar with mini-humbuckers that produces a jangly, open tone. The thin body and mini-humbuckers give it a brighter, more articulate character than a full-sized humbucker semi-hollow. Noel Gallagher's main guitar during Oasis's peak years.",
    modeler_equivalents: {},
  },
  {
    name: "Ibanez JS Series",
    slug: "ibanez-js-series",
    type: "guitar",
    manufacturer: "Ibanez",
    icon_type: "strat",
    icon_color: "#ef4444",
    description:
      "Joe Satriani's signature guitar. A superstrat with a basswood body, DiMarzio humbuckers (Fred and PAF Pro), and an Edge tremolo system. The fast neck profile, jumbo frets, and high-output pickups make it ideal for legato playing, tapping, and whammy bar acrobatics.",
    modeler_equivalents: {},
  },
  {
    name: "Dallas Rangemaster Treble Booster",
    slug: "dallas-rangemaster",
    type: "effect",
    subcategory: "boost",
    manufacturer: "Dallas",
    icon_type: "boss_compact",
    icon_color: "#d4a574",
    description:
      "A germanium transistor treble booster that adds gain and presence to the upper frequencies. When placed before a cranked British amp, it pushes the amp into rich, harmonically complex overdrive. Essential to the tones of Brian May, Tony Iommi, and Billy Gibbons.",
    default_settings: {
      knobs: [
        { name: "Boost", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Kinky Boost",
      quad_cortex: "Rangemaster",
      fractal: "Treble Booster",
      kemper: "Treble Booster",
      katana: "Treble Boost (Booster)",
    },
  },
  {
    name: "Brian May Red Special",
    slug: "brian-may-red-special",
    type: "guitar",
    manufacturer: "Custom (Brian May)",
    icon_type: "les_paul",
    icon_color: "#8b0000",
    description:
      "A homemade guitar built by Brian May and his father from an 18th-century fireplace mantel. Three Burns Tri-Sonic single-coil pickups with individual on/off and phase switches create an enormous range of tonal combinations. Played with a sixpence coin instead of a pick for its unique attack and harmonic content.",
    modeler_equivalents: {},
  },
  {
    name: "MXR Distortion+",
    slug: "mxr-distortion-plus",
    type: "effect",
    subcategory: "distortion",
    manufacturer: "MXR",
    icon_type: "mxr",
    icon_color: "#f5d742",
    description:
      "One of the first commercially available distortion pedals. Simple two-knob design (Output and Distortion) delivering a gritty, mid-focused drive. Randy Rhoads used it as his primary distortion pedal to push his Marshalls into aggressive overdrive territory.",
    default_settings: {
      knobs: [
        { name: "Output", min: 0, max: 10 },
        { name: "Distortion", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Minotaur",
      quad_cortex: "Distortion+",
      fractal: "MXR Dist+",
      kemper: "MXR Dist+",
      katana: "Mid Boost (Booster)",
    },
  },
  {
    name: "Boss CE-1 Chorus Ensemble",
    slug: "boss-ce-1",
    type: "effect",
    subcategory: "chorus",
    manufacturer: "Boss",
    icon_type: "large_format",
    icon_color: "#7c3aed",
    description:
      "The original Boss chorus pedal, a large floor unit that preceded the compact pedal line. Features both chorus and vibrato modes with a warm, lush analog character and a built-in preamp stage that adds subtle coloration. Used by Alex Lifeson, Andy Summers, and John Frusciante.",
    default_settings: {
      knobs: [
        { name: "Rate", min: 0, max: 10 },
        { name: "Depth", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "70s Chorus",
      quad_cortex: "CE-1",
      fractal: "Analog Chorus",
      kemper: "Vintage Chorus",
      katana: "CE-1 Chorus (Mod)",
    },
  },
  {
    name: "MXR Flanger/Doubler",
    slug: "mxr-flanger",
    type: "effect",
    subcategory: "modulation",
    manufacturer: "MXR",
    icon_type: "mxr",
    icon_color: "#3b82f6",
    description:
      "A studio-grade flanger that produces jet-like sweeps and metallic textures. Used by Eddie Van Halen and Alex Lifeson for dramatic modulation effects. Can produce subtle thickening or extreme, swooshing sounds depending on settings.",
    default_settings: {
      knobs: [
        { name: "Speed", min: 0, max: 10 },
        { name: "Width", min: 0, max: 10 },
        { name: "Regen", min: 0, max: 10 },
        { name: "Manual", min: 0, max: 10 },
      ],
    },
    modeler_equivalents: {
      helix: "Courtesan Flange",
      quad_cortex: "Flanger",
      fractal: "Flanger",
      kemper: "Flanger",
      katana: "Flanger (Mod)",
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
        icon_color: "#ef4444",
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
        icon_color: "#ef4444",
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
        icon_color: "#8b5cf6",
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
        icon_color: "#8b5cf6",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#94a3b8",
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
        icon_color: "#94a3b8",
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
        icon_color: "#ef4444",
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
        icon_color: "#ef4444",
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
        icon_color: "#ef4444",
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
        icon_color: "#ef4444",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
        icon_color: "#a1a1aa",
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
  {
    id: "seed-angus-back-in-black",
    song_slug: "back-in-black-ac-dc",
    title: "Angus Young's Back in Black Rhythm Tone",
    slug: "angus-young-back-in-black-rhythm",
    description:
      "The most iconic rhythm guitar tone in hard rock. Angus Young's tone on Back in Black is deceptively simple: a Gibson SG plugged straight into a cranked Marshall JTM45 with nothing in between. No pedals, no effects, no tricks. The entire sound comes from the interaction between the SG's bridge humbucker and the amp pushed to the edge of breakup. The bright, biting attack of the SG cuts through the mix, while the JTM45's warm British overdrive provides just enough grit without losing note clarity. Malcolm Young's identical rig on rhythm creates the massive wall of sound.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson SG Standard",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".009-.042",
      notable_mods:
        "Stock Gibson SG with PAF-style humbuckers. Angus uses relatively light strings for easier bending during his energetic stage performance.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-jtm45",
        gear_name: "Marshall JTM45",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Volume: 8, Treble: 7, Bass: 4, Presence: 6 },
        notes:
          "Cranked loud for natural tube overdrive. The JTM45 is essentially a British Bassman, producing a warm, fat overdrive with a singing quality. Volume at 8 puts it firmly into breakup territory. Treble is pushed to match the SG's bright character.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "Celestion Greenback speakers provide the woody midrange that complements the SG's aggressive attack. The combination of SG and Greenbacks is the sound of AC/DC.",
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
          "Producer Mutt Lange's meticulous recording on Back in Black involved multiple takes and mic positions. On-axis SM57 captures the full bite and presence of the tone.",
      },
    ],
    original_gear: {
      guitar: "Gibson SG Standard, bridge humbucker, standard tuning, .009-.042 strings",
      effects: [],
      amp: "Marshall JTM45 (cranked)",
      cabinet: "Marshall 4x12 with Celestion Greenbacks",
      microphone: "Shure SM57",
      other_notes:
        "AC/DC's tone secret is no effects at all. The guitar plugs directly into the amp. The massive sound comes from double-tracked rhythm guitars (Angus and Malcolm) and producer Mutt Lange's layering techniques.",
    },
    tags: ["hard-rock", "rhythm", "no-effects", "classic-rock", "ac-dc"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brit J45 Nrm",
            block_category: "Amp",
            original_gear: "Marshall JTM45",
            settings: {
              Drive: 7.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 7.0,
            },
            notes:
              "The Brit J45 is Helix's JTM45 model. Push the drive for natural breakup. No drive pedals needed.",
          },
          {
            position: 2,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "Close-miked Greenback for maximum bite and presence.",
          },
        ],
        notes:
          "This is one of the simplest patches you can make. No effects, just amp and cab. Use the bridge humbucker and dig in with your pick for the AC/DC attack. For even more authenticity, double-track the guitar part hard left and right.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "JTM45",
            block_category: "Amp",
            original_gear: "Marshall JTM45",
            settings: {
              Gain: 7.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 7.0,
            },
            notes: "Push the gain for natural JTM45 breakup. No stomp pedals needed.",
          },
          {
            position: 2,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Close-miked for full presence.",
          },
        ],
        notes:
          "Search Cortex Cloud for AC/DC or JTM45 captures for even more authenticity. The simplicity of this signal chain makes it an ideal candidate for amp captures.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall JTM45",
            settings: {
              Gain: 6,
              Bass: 4,
              Middle: 5,
              Treble: 7,
              Presence: 6,
              Volume: 7,
            },
            notes:
              "The Brown channel gives the Marshall-voiced crunch needed for AC/DC. Moderate gain for a crunchy, not saturated, tone. No booster needed.",
          },
        ],
        notes:
          "Keep it simple. Brown channel, moderate gain, bridge humbucker, and play hard. That is the AC/DC recipe. No effects needed.",
      },
    },
    is_editorial: true,
    view_count: 2847,
    rating_avg: 4.6,
    rating_count: 0,
  },
  {
    id: "seed-santana-smooth",
    song_slug: "smooth-santana",
    title: "Santana's Smooth Lead Tone",
    slug: "santana-smooth-lead",
    description:
      "Carlos Santana's tone on Smooth is all about singing sustain and warm midrange. His PRS guitar through a Mesa Boogie Mark I produces a creamy, vocal-like lead sound that sustains endlessly. The midrange is emphasized heavily, giving each note a horn-like quality. The amp is pushed hard for natural compression, and the guitar's neck humbucker provides warmth without muddiness. This is a tone built for long, melodic phrases where every note sings.",
    tone_context: "solo",
    guitar_specs: {
      body_type: "solid",
      model_name: "PRS Custom 24",
      pickup_config: "HH",
      pickup_position: "neck",
      string_count: 6,
      scale_length: "25",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Santana's PRS signature model with custom humbuckers tuned for high sustain and midrange emphasis. Neck pickup exclusively for the vocal lead tone.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "mesa-boogie-mark-i",
        gear_name: "Mesa/Boogie Mark I",
        icon_type: "fender_combo",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Volume: 7, Treble: 5, Bass: 4, Middle: 8, Master: 7, Gain: 7 },
        notes:
          "The Mark I's cascading gain stages produce the creamy sustain Santana is known for. Mids are pushed high for that horn-like vocal quality. Bass is moderate to keep the tone focused.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Mesa/Boogie 1x12 Thiele Cabinet",
        icon_type: "cab_1x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The closed-back Thiele cabinet with an EV speaker provides tight low end and focused midrange that emphasizes Santana's singing lead character.",
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
        settings: { Position: "on-axis" },
        notes: "Standard close-miking for the direct, present lead tone.",
      },
    ],
    original_gear: {
      guitar: "PRS Custom 24 (Santana signature), neck humbucker",
      effects: [],
      amp: "Mesa/Boogie Mark I (cranked)",
      cabinet: "Mesa/Boogie 1x12 Thiele with EV speaker",
      microphone: "Shure SM57",
      other_notes:
        "Santana's tone is remarkably simple: guitar straight into amp. The sustain and singing quality come from the amp's natural compression when pushed, the neck humbucker's warmth, and Santana's vibrato technique.",
    },
    tags: ["latin-rock", "lead", "sustain", "midrange", "santana", "rock"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Cali Texas Ch1",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Mark I",
            settings: {
              Drive: 7.0,
              Bass: 4.0,
              Mid: 8.0,
              Treble: 5.0,
              Presence: 5.0,
              "Ch Vol": 7.0,
            },
            notes:
              "The Cali Texas Ch1 captures the Mark I's warm, mid-heavy character. Push the mids to 8 for Santana's vocal lead quality.",
          },
          {
            position: 2,
            block_name: "1x12 Cali EXT",
            block_category: "Cab",
            original_gear: "Mesa 1x12 Thiele",
            settings: { Mic: "57 Dynamic", Distance: 1.5 },
            notes: "A 1x12 cab keeps the sound focused and tight.",
          },
        ],
        notes:
          "Use the neck pickup and play with strong vibrato. Santana's tone is in his hands as much as his gear. The high-mid emphasis is the key to this tone.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Mesa Mark I",
            block_category: "Amp",
            original_gear: "Mesa/Boogie Mark I",
            settings: {
              Gain: 7.0,
              Bass: 4.0,
              Mid: 8.0,
              Treble: 5.0,
              Presence: 5.0,
              Master: 7.0,
            },
            notes: "Push mids high for the signature Santana vocal quality.",
          },
          {
            position: 2,
            block_name: "1x12 Mesa",
            block_category: "Cab",
            original_gear: "Mesa 1x12 Thiele",
            settings: { Mic: "SM57", Distance: "1.5 inches" },
            notes: "Tight 1x12 for focused lead tone.",
          },
        ],
        notes:
          "The QC's Mesa models excel at this smooth, mid-heavy lead tone. Search Cortex Cloud for Santana-specific captures.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Lead",
            block_category: "Amp Type",
            original_gear: "Mesa/Boogie Mark I",
            settings: {
              Gain: 7,
              Bass: 4,
              Middle: 8,
              Treble: 5,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "Lead channel with boosted mids for the smooth Santana sustain. The Katana's Lead channel provides enough gain for singing sustain without needing a booster.",
          },
        ],
        notes:
          "Use the neck humbucker and push the mids. The Katana's Lead channel gets surprisingly close to the Santana sound with the right EQ settings.",
      },
    },
    is_editorial: true,
    view_count: 1923,
    rating_avg: 4.5,
    rating_count: 0,
  },
  {
    id: "seed-townshend-wont-get-fooled",
    song_slug: "wont-get-fooled-again-the-who",
    title: "Townshend's Won't Get Fooled Again Power Chord Tone",
    slug: "townshend-wont-get-fooled-again",
    description:
      "Pete Townshend's windmill-strumming attack through a cranked Hiwatt is one of the most powerful rhythm guitar sounds in rock. On Won't Get Fooled Again, the SG's humbuckers hit the Hiwatt DR103 at full volume, producing a massive, ringing power chord tone with incredible clarity and sustain. The Hiwatt's enormous clean headroom means it stays articulate even when pushed hard, preventing the mush that a Marshall might produce at similar volumes.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson SG Special",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Townshend used various SG models during the Who's Next era. Stock humbuckers provide the thick, aggressive attack needed for his windmill strumming technique.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "hiwatt-dr103",
        gear_name: "Hiwatt DR103 Custom 100",
        icon_type: "marshall_head",
        icon_color: "#8b5cf6",
        is_in_effects_loop: false,
        settings: { "Normal Vol": 8, "Brilliant Vol": 0, Bass: 5, Treble: 7, Presence: 7, Master: 8 },
        notes:
          "The Hiwatt is cranked for maximum power and clarity. Unlike a Marshall, the Hiwatt stays relatively clean even at high volume, providing a powerful, ringing tone with natural compression rather than fuzzy distortion. The Brilliant channel is off; Normal channel only.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "WEM 4x12 Cabinet (Fane speakers)",
        icon_type: "cab_4x12",
        icon_color: "#8b5cf6",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "Townshend used WEM cabinets loaded with Fane speakers. These provide a more open, hi-fi character than Celestion-loaded Marshalls, complementing the Hiwatt's clarity.",
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
        settings: { Position: "on-axis" },
        notes: "Standard close-miking. Glyn Johns' production captured the raw power of the live band.",
      },
    ],
    original_gear: {
      guitar: "Gibson SG Special, bridge humbucker, standard tuning",
      effects: [],
      amp: "Hiwatt DR103 Custom 100 (cranked)",
      cabinet: "WEM 4x12 with Fane Crescendo speakers",
      microphone: "Shure SM57",
      other_notes:
        "Townshend's aggressive windmill strumming technique is as important as the gear. He attacks the strings with full-arm swings, producing a percussive, explosive attack that defines the Who's sound.",
    },
    tags: ["rock", "classic-rock", "power-chords", "rhythm", "the-who"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Hiwatt DR103",
            settings: {
              Drive: 7.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 7.0,
              "Ch Vol": 7.5,
            },
            notes:
              "Helix lacks a dedicated Hiwatt model. The Brit Plexi Brt pushed hard approximates the Hiwatt's powerful, clear overdrive. A third-party Hiwatt IR would improve accuracy.",
          },
          {
            position: 2,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "WEM 4x12 Fane",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "No WEM cab on Helix. Greenback is the closest stock option.",
          },
        ],
        notes:
          "Use the bridge humbucker and strum aggressively with full arm windmill motions for the authentic Townshend attack.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Hiwatt DR103",
            block_category: "Amp",
            original_gear: "Hiwatt DR103",
            settings: {
              Gain: 7.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 7.0,
              Master: 7.5,
            },
            notes: "The QC's Hiwatt model captures the clean power and clarity well.",
          },
          {
            position: 2,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "WEM 4x12 Fane",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "Load a WEM/Fane IR for better accuracy if available.",
          },
        ],
        notes:
          "The QC handles the Hiwatt's clean power well. Search Cortex Cloud for Hiwatt captures for extra authenticity.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Hiwatt DR103",
            settings: {
              Gain: 6,
              Bass: 5,
              Middle: 5,
              Treble: 7,
              Presence: 7,
              Volume: 8,
            },
            notes:
              "Brown channel at moderate gain for a powerful, clear crunch. The Hiwatt's clean power is approximated by keeping the gain lower than you might expect while pushing the volume.",
          },
        ],
        notes:
          "The Katana's Brown channel provides the British-voiced crunch needed. Keep gain moderate for Hiwatt-style clarity. Strum hard with the bridge humbucker.",
      },
    },
    is_editorial: true,
    view_count: 1456,
    rating_avg: 4.4,
    rating_count: 0,
  },
  {
    id: "seed-garcia-truckin",
    song_slug: "truckin-grateful-dead",
    title: "Jerry Garcia's Truckin' Clean Sparkle Tone",
    slug: "garcia-truckin-clean-sparkle",
    description:
      "Jerry Garcia's tone on Truckin' is a sparkling, clean Stratocaster sound through a Fender Twin Reverb. This is about clarity and articulation, not distortion. Every note rings out with bell-like precision, and the Twin's massive clean headroom ensures the tone stays pristine even at volume. The touch of spring reverb adds depth without washing out the details. Garcia's tone is the opposite of most rock guitarists: clean, bright, and dynamically responsive to his fingerpicking and flatpicking technique.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Stratocaster",
      pickup_config: "SSS",
      pickup_position: "middle",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Garcia used various Strats and custom guitars. During the American Beauty era, a stock Stratocaster in the middle position provides the balanced, quacky clean tone heard on Truckin'.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-twin-reverb",
        gear_name: "Fender Twin Reverb",
        icon_type: "fender_combo",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Volume: 5, Treble: 7, Bass: 4, Middle: 6, Reverb: 4 },
        notes:
          "The Twin Reverb's 85 watts of clean headroom keep the tone pristine at any volume. Volume at 5 is plenty loud without any breakup. A touch of spring reverb adds spacious depth without muddying the clean tone.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Built-in 2x12 Jensen C12N",
        icon_type: "cab_1x12",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The Twin's built-in 2x12 speakers provide a wide, full stereo image with sparkling highs and tight lows.",
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
        notes: "Off-axis to tame the Twin's bright high end slightly while keeping clarity.",
      },
    ],
    original_gear: {
      guitar: "Fender Stratocaster, middle pickup, standard tuning",
      effects: [],
      amp: "Fender Twin Reverb (clean with spring reverb)",
      cabinet: "Built-in 2x12 Jensen speakers",
      microphone: "Shure SM57",
      other_notes:
        "Garcia's clean tone is about touch and dynamics. He used a flatpick and fingerpicking interchangeably, and the clean amp responds to every nuance of his attack.",
    },
    tags: ["clean", "sparkle", "jam-band", "psychedelic", "grateful-dead"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Double Nrm",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Drive: 3.0,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 5.0,
            },
            notes:
              "The US Double Nrm is Helix's Twin Reverb model. Keep drive very low for sparkling cleans.",
          },
          {
            position: 2,
            block_name: "Simple Delay",
            block_category: "Delay",
            original_gear: "Spring Reverb (built-in)",
            settings: { Time: "300ms", Feedback: 15, Mix: 20 },
            notes: "A short delay with low feedback can approximate the spacious depth of spring reverb. Also add a Spring Reverb block for more authenticity.",
          },
          {
            position: 3,
            block_name: "2x12 Double C12N",
            block_category: "Cab",
            original_gear: "Twin Reverb 2x12 Jensen",
            settings: { Mic: "57 Dynamic", Distance: 3.0 },
            notes: "The 2x12 Jensen cab captures the Twin's wide, sparkling character.",
          },
        ],
        notes:
          "Use the middle pickup position for Garcia's balanced, slightly quacky clean tone. Add a Spring Reverb block for the authentic Twin Reverb atmosphere.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Twin Reverb",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 3.0,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 5.0,
            },
            notes: "Low gain for pristine cleans. The QC's Twin model excels at clean tones.",
          },
          {
            position: 2,
            block_name: "2x12 Twin",
            block_category: "Cab",
            original_gear: "Twin 2x12 Jensen",
            settings: { Mic: "SM57", Distance: "3 inches" },
            notes: "Pulled-back mic for warm, spacious cleans.",
          },
        ],
        notes:
          "Add a spring reverb effect in the chain for the authentic Twin Reverb atmosphere. The QC's clean amp models are among its strongest features.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 3,
              Bass: 4,
              Middle: 6,
              Treble: 7,
              Presence: 6,
              Volume: 5,
            },
            notes:
              "The Katana's Clean channel has excellent headroom for sparkling Fender-style cleans. Add the built-in reverb for depth.",
          },
          {
            position: 2,
            block_name: "Spring Reverb",
            block_category: "FX",
            original_gear: "Twin Reverb spring reverb",
            settings: { Level: 40 },
            notes: "Add spring reverb in the FX section for authentic Twin Reverb ambience.",
          },
        ],
        notes:
          "The Katana's Clean channel is perfect for this. Low gain, pushed treble, and spring reverb. Use the middle pickup position on your Strat.",
      },
    },
    is_editorial: true,
    view_count: 987,
    rating_avg: 4.3,
    rating_count: 0,
  },
  {
    id: "seed-lifeson-tom-sawyer",
    song_slug: "tom-sawyer-rush",
    title: "Alex Lifeson's Tom Sawyer Chorus-Driven Tone",
    slug: "lifeson-tom-sawyer-chorus",
    description:
      "Alex Lifeson's tone on Tom Sawyer is a masterclass in using chorus and effects to create a massive, shimmering wall of guitar sound. The ES-355's semi-hollow body provides natural resonance and warmth, which is then pushed through a Marshall for crunch and layered with a Boss CE-1 chorus for that wide, sweeping stereo effect. The result is a tone that fills the entire sonic spectrum without ever getting in the way of Geddy Lee's bass and Neil Peart's drums.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Gibson ES-355",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Lifeson's ES-355 with stock humbuckers. The semi-hollow body adds natural resonance and airiness to the tone that you cannot get from a solid-body guitar.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "chorus",
        gear_slug: "boss-ce-1",
        gear_name: "Boss CE-1 Chorus Ensemble",
        icon_type: "large_format",
        icon_color: "#7c3aed",
        is_in_effects_loop: false,
        settings: { Rate: 4, Depth: 6 },
        notes:
          "The CE-1 chorus is always on, adding shimmer and width to the tone. The rate is moderate for a noticeable but not overpowering effect. The CE-1's built-in preamp also adds subtle warmth.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Presence: 6, Bass: 5, Middle: 6, Treble: 7, "Volume I": 7, "Volume II": 0 },
        notes:
          "The Marshall provides the crunchy backbone of the tone. Not fully cranked; Lifeson keeps it at a moderate drive so the chorus effect remains clear and defined rather than getting buried in distortion.",
      },
      {
        position: 3,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "TC Electronic 2290 Digital Delay",
        icon_type: "large_format",
        icon_color: "#3b82f6",
        is_in_effects_loop: true,
        settings: { Time: "350ms", Feedback: 25, Mix: 25 },
        notes:
          "Delay in the effects loop adds depth and spatial dimension. Moderate settings for subtle ambience rather than obvious repeats.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "Standard Marshall 4x12 with Greenbacks for the classic British rock character.",
      },
    ],
    original_gear: {
      guitar: "Gibson ES-355, bridge humbucker, standard tuning",
      effects: ["Boss CE-1 Chorus Ensemble", "TC Electronic 2290 Digital Delay (effects loop)"],
      amp: "Marshall Super Lead 1959 (moderate gain)",
      cabinet: "Marshall 4x12 with Greenbacks",
      microphone: "Shure SM57",
      other_notes:
        "Lifeson's Moving Pictures tone is about layering effects to create a wide, textured sound that supports the complex arrangements without overpowering the other instruments.",
    },
    tags: ["progressive-rock", "chorus", "delay", "hard-rock", "rush"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "70s Chorus",
            block_category: "Modulation",
            original_gear: "Boss CE-1",
            settings: { Speed: 4.0, Depth: 6.0, Mix: 50 },
            notes: "Always on. The shimmer is essential to the Lifeson tone.",
          },
          {
            position: 2,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 6.0,
              Bass: 5.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 6.5,
            },
            notes: "Moderate drive so the chorus remains clear. Not fully cranked.",
          },
          {
            position: 3,
            block_name: "Simple Delay",
            block_category: "Delay",
            original_gear: "TC 2290",
            settings: { Time: "350ms", Feedback: 25, Mix: 25 },
            notes: "Place after amp+cab for clean, defined repeats.",
          },
          {
            position: 4,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "Standard Greenback cab for the British rock foundation.",
          },
        ],
        notes:
          "The chorus before the amp and delay after is the key signal chain order. Use a semi-hollow or humbucker guitar for the warmth and resonance Lifeson gets from his ES-355.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "CE-1",
            block_category: "Modulation",
            original_gear: "Boss CE-1",
            settings: { Rate: 4.0, Depth: 6.0 },
            notes: "Chorus before the amp for the shimmering Lifeson effect.",
          },
          {
            position: 2,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 6.0,
              Bass: 5.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 6.5,
            },
            notes: "Moderate gain for clarity with the chorus effect.",
          },
          {
            position: 3,
            block_name: "Digital Delay",
            block_category: "Delay",
            original_gear: "TC 2290",
            settings: { Time: "350ms", Feedback: 25, Mix: 25 },
            notes: "Post-amp delay for spatial depth.",
          },
          {
            position: 4,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "Greenback cab for classic British rock tone.",
          },
        ],
        notes:
          "The chorus-into-Marshall combination is the foundation. Use a semi-hollow guitar if possible for the authentic resonance.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 5,
              Bass: 5,
              Middle: 6,
              Treble: 7,
              Presence: 6,
              Volume: 6,
            },
            notes: "Moderate gain on the Brown channel for crunchy but clear Marshall tones.",
          },
          {
            position: 2,
            block_name: "CE-1 Chorus",
            block_category: "Mod",
            original_gear: "Boss CE-1",
            settings: { Rate: 4, Depth: 60 },
            notes: "The Katana's CE-1 chorus model adds the essential shimmer. Leave always on.",
          },
          {
            position: 3,
            block_name: "Digital Delay",
            block_category: "FX",
            original_gear: "TC 2290",
            settings: { Time: "350ms", Feedback: 25, Level: 25 },
            notes: "Delay for spatial depth. Subtle settings.",
          },
        ],
        notes:
          "The Brown channel with CE-1 chorus is a great approximation of Lifeson's Moving Pictures tone. Add delay for depth.",
      },
    },
    is_editorial: true,
    view_count: 1234,
    rating_avg: 4.5,
    rating_count: 0,
  },
  {
    id: "seed-brian-may-bohemian-rhapsody",
    song_slug: "bohemian-rhapsody-queen",
    title: "Brian May's Bohemian Rhapsody Guitar Tone",
    slug: "brian-may-bohemian-rhapsody",
    description:
      "Brian May's tone on Bohemian Rhapsody is built on a unique combination: his homemade Red Special guitar played with a sixpence coin, a Dallas Rangemaster treble booster slamming the front end of a Vox AC30. The treble booster adds gain and upper-harmonic sparkle, pushing the AC30's Top Boost channel into a rich, creamy overdrive. May's multi-tracked guitar harmonies on this song create an orchestral wall of sound, but each individual guitar part has this distinctive bright, singing character.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Brian May Red Special",
      pickup_config: "SSS",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24",
      tuning: "standard",
      string_gauge: ".009-.042",
      notable_mods:
        "Homemade guitar with Burns Tri-Sonic single-coil pickups. Played with a sixpence coin instead of a standard pick, adding a unique brightness and harmonic complexity. Individual pickup on/off and phase switches provide huge tonal range.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "boost",
        gear_slug: "dallas-rangemaster",
        gear_name: "Dallas Rangemaster Treble Booster",
        icon_type: "boss_compact",
        icon_color: "#d4a574",
        is_in_effects_loop: false,
        settings: { Boost: 8 },
        notes:
          "The treble booster is essential to May's tone. It adds gain to the upper frequencies, pushing the AC30 into rich overdrive while maintaining clarity. Without it, the AC30 is too clean for the rock sections.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "vox-ac30",
        gear_name: "Vox AC30 (Top Boost)",
        icon_type: "fender_combo",
        icon_color: "#8b4513",
        is_in_effects_loop: false,
        settings: { Volume: 7, Treble: 6, Bass: 4, Cut: 5, Master: 7 },
        notes:
          "The AC30's Top Boost channel pushed by the Rangemaster produces a harmonically rich overdrive. The chiming character of the AC30 combined with the treble booster's bite creates May's signature singing tone.",
      },
      {
        position: 3,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "Tape Delay (Echoplex)",
        icon_type: "large_format",
        icon_color: "#8b4513",
        is_in_effects_loop: true,
        settings: { Time: "350ms", Repeats: 3, Mix: 25 },
        notes:
          "A touch of tape delay adds depth and sustain to the guitar parts. May uses delay subtly to thicken the tone rather than as an obvious effect.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Vox AC30 built-in 2x12 (Celestion Blues)",
        icon_type: "cab_1x12",
        icon_color: "#8b4513",
        is_in_effects_loop: false,
        settings: {},
        notes:
          "The AC30's Celestion Blue Alnico speakers add a distinctive chime and warmth. They compress beautifully when the amp is pushed hard.",
      },
    ],
    original_gear: {
      guitar: "Brian May Red Special (homemade), played with a sixpence coin",
      effects: ["Dallas Rangemaster Treble Booster", "Tape Delay (Echoplex)"],
      amp: "Vox AC30 (Top Boost channel, cranked)",
      cabinet: "Vox AC30 built-in 2x12 Celestion Blue speakers",
      microphone: "Neumann U87 + SM57 blend",
      other_notes:
        "The multi-tracked guitar harmonies are a huge part of the Bohemian Rhapsody sound. May recorded multiple guitar parts in harmony, creating an orchestral effect. Each part uses the same basic tone described here.",
    },
    tags: ["classic-rock", "rock", "treble-booster", "queen", "multi-tracked"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Kinky Boost",
            block_category: "Distortion",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 8.0 },
            notes:
              "The Kinky Boost adds the treble-heavy gain push that drives the AC30. Essential for the Brian May sound.",
          },
          {
            position: 2,
            block_name: "Essex A30",
            block_category: "Amp",
            original_gear: "Vox AC30",
            settings: {
              Drive: 6.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 6.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix's AC30 model. The treble booster before it creates the Brian May pushed-AC30 character.",
          },
          {
            position: 3,
            block_name: "Transistor Tape",
            block_category: "Delay",
            original_gear: "Echoplex",
            settings: { Time: "350ms", Feedback: 25, Mix: 25 },
            notes: "Subtle tape delay for thickness and sustain.",
          },
          {
            position: 4,
            block_name: "2x12 Blue Bell",
            block_category: "Cab",
            original_gear: "AC30 2x12 Celestion Blue",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "The Blue Bell cab captures the AC30's chiming Alnico character.",
          },
        ],
        notes:
          "The treble booster into AC30 combination is the heart of the Brian May sound. For the Bohemian Rhapsody guitar harmonies, record multiple passes panned across the stereo field.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Rangemaster",
            block_category: "Drive",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 8.0 },
            notes: "Treble booster to push the AC30 into overdrive.",
          },
          {
            position: 2,
            block_name: "AC30 TB",
            block_category: "Amp",
            original_gear: "Vox AC30",
            settings: {
              Gain: 6.5,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 7.0,
            },
            notes: "The QC's AC30 model works well with the Rangemaster boost.",
          },
          {
            position: 3,
            block_name: "Tape Delay",
            block_category: "Delay",
            original_gear: "Echoplex",
            settings: { Time: "350ms", Feedback: 25, Mix: 25 },
            notes: "Subtle tape delay for depth.",
          },
        ],
        notes:
          "Search Cortex Cloud for Brian May or AC30+Rangemaster captures for extra authenticity.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Vox AC30",
            settings: {
              Gain: 6,
              Bass: 4,
              Middle: 5,
              Treble: 6,
              Presence: 6,
              Volume: 7,
            },
            notes:
              "The Crunch channel approximates the AC30's pushed overdrive character. The Katana's Crunch mode has a similar British chime.",
          },
          {
            position: 2,
            block_name: "Treble Boost",
            block_category: "Booster",
            original_gear: "Dallas Rangemaster",
            settings: { Level: 8, Tone: 8 },
            notes:
              "Treble Boost in the Booster slot adds the upper-harmonic push that defines Brian May's tone.",
          },
          {
            position: 3,
            block_name: "Tape Echo",
            block_category: "FX",
            original_gear: "Echoplex",
            settings: { Time: "350ms", Feedback: 25, Level: 25 },
            notes: "Subtle delay for thickness.",
          },
        ],
        notes:
          "Crunch channel with a Treble Boost gets close to the AC30 + Rangemaster combination. Use a bright single-coil or P90 guitar if possible.",
      },
    },
    is_editorial: true,
    view_count: 3456,
    rating_avg: 4.7,
    rating_count: 0,
  },
  {
    id: "seed-iommi-iron-man",
    song_slug: "iron-man-black-sabbath",
    title: "Tony Iommi's Iron Man Doom Riff Tone",
    slug: "iommi-iron-man-doom-riff",
    description:
      "The tone that invented heavy metal. Tony Iommi's detuned SG through a cranked Laney produces a thick, grinding, dark distortion that is the foundation of doom and heavy metal. The guitar is tuned down to C# standard (one and a half steps down), giving the riffs a massive, heavy character. The Rangemaster treble booster pushes the Laney into heavy saturation while maintaining note definition. Iommi's prosthetic fingertips and light string gauge contribute to a slightly looser, more aggressive attack.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson SG Special",
      pickup_config: "P90",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "custom",
      tuning_custom: "C# Standard (C#-F#-B-E-G#-C#)",
      string_gauge: ".008-.032",
      notable_mods:
        "Iommi lost the tips of two fingers in a factory accident and wears thimble-like prosthetics. He uses extremely light strings and low tuning to accommodate his injury. The P90 pickups on his early SG Special provide a raw, aggressive bite.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "boost",
        gear_slug: "dallas-rangemaster",
        gear_name: "Dallas Rangemaster Treble Booster",
        icon_type: "boss_compact",
        icon_color: "#d4a574",
        is_in_effects_loop: false,
        settings: { Boost: 7 },
        notes:
          "The Rangemaster pushes the Laney into heavy overdrive while adding treble clarity to compensate for the dark, detuned tone. Without it, the low tuning would sound muddy.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "laney-la100bl",
        gear_name: "Laney LA100BL Supergroup",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Volume: 8, Treble: 6, Bass: 6, Middle: 5 },
        notes:
          "The Laney cranked high produces a thick, grinding British overdrive. Heavier and darker than a Marshall, which suits the detuned doom riffs perfectly.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall/Laney 4x12 Cabinet",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "4x12 cabinet with Celestion speakers for massive low-end projection.",
      },
    ],
    original_gear: {
      guitar: "Gibson SG Special with P90 pickups, tuned to C# standard, .008-.032 strings",
      effects: ["Dallas Rangemaster Treble Booster"],
      amp: "Laney LA100BL Supergroup (cranked)",
      cabinet: "4x12 with Celestion speakers",
      microphone: "Shure SM57",
      other_notes:
        "Iommi's extremely light strings and detuning are as important as the amp settings. The loose string tension creates a unique, slightly buzzy attack that is central to the Sabbath sound.",
    },
    tags: ["metal", "doom-metal", "hard-rock", "detuned", "black-sabbath", "heavy"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Kinky Boost",
            block_category: "Distortion",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 7.0 },
            notes: "Treble booster to cut through the dark detuned tone and push the amp.",
          },
          {
            position: 2,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Laney LA100BL",
            settings: {
              Drive: 8.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 6.0,
              Presence: 5.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix lacks a dedicated Laney model. The Brit Plexi pushed hard with boosted bass approximates the Laney's dark, heavy character.",
          },
          {
            position: 3,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "4x12 Celestion",
            settings: { Mic: "57 Dynamic", Distance: 1.5 },
            notes: "Greenback cab for the classic British metal foundation.",
          },
        ],
        notes:
          "Tune your guitar down to C# standard. The detuning is as important as the amp settings for the authentic Sabbath doom tone. Use the bridge pickup with P90s or humbuckers.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Rangemaster",
            block_category: "Drive",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 7.0 },
            notes: "Treble booster to push the amp and cut through the detuned muddiness.",
          },
          {
            position: 2,
            block_name: "Laney Supergroup",
            block_category: "Amp",
            original_gear: "Laney LA100BL",
            settings: {
              Gain: 8.0,
              Bass: 6.0,
              Mid: 5.0,
              Treble: 6.0,
              Master: 7.0,
            },
            notes: "The QC's Laney model if available. Otherwise use a British high-gain model.",
          },
          {
            position: 3,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "4x12 Celestion",
            settings: { Mic: "SM57", Distance: "1.5 inches" },
            notes: "Greenback cab for British doom tone.",
          },
        ],
        notes:
          "Tune down to C# standard. Search Cortex Cloud for Laney Supergroup or Black Sabbath captures.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Laney LA100BL",
            settings: {
              Gain: 8,
              Bass: 6,
              Middle: 5,
              Treble: 6,
              Presence: 5,
              Volume: 7,
            },
            notes:
              "The Brown channel cranked approximates the Laney's heavy British overdrive. Push the bass for doom weight.",
          },
          {
            position: 2,
            block_name: "Treble Boost",
            block_category: "Booster",
            original_gear: "Dallas Rangemaster",
            settings: { Level: 7, Tone: 7 },
            notes: "Treble Boost to cut through the detuned muddiness and push the amp harder.",
          },
        ],
        notes:
          "Tune down to C# standard. Brown channel cranked with a Treble Boost gets a convincing Sabbath doom tone.",
      },
    },
    is_editorial: true,
    view_count: 2345,
    rating_avg: 4.6,
    rating_count: 0,
  },
  {
    id: "seed-rhoads-crazy-train",
    song_slug: "crazy-train-ozzy-osbourne",
    title: "Randy Rhoads' Crazy Train Lead Tone",
    slug: "rhoads-crazy-train-lead",
    description:
      "Randy Rhoads' tone on Crazy Train combines classical precision with heavy metal aggression. His Les Paul Custom through a cranked Marshall with an MXR Distortion+ produces a tight, articulate distortion with singing sustain. The iconic opening riff requires precise note separation and a tone with enough gain for sustain but enough clarity for the rapid alternate picking passages. Rhoads' classical training meant every note was deliberate, and his tone reflected that precision.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson Les Paul Custom",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".009-.042",
      notable_mods:
        "Stock Les Paul Custom with PAF-style humbuckers. Rhoads later switched to Jackson guitars, but the Blizzard of Ozz recordings used his white Les Paul Custom.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "distortion",
        gear_slug: "mxr-distortion-plus",
        gear_name: "MXR Distortion+",
        icon_type: "mxr",
        icon_color: "#f5d742",
        is_in_effects_loop: false,
        settings: { Output: 7, Distortion: 6 },
        notes:
          "The MXR Distortion+ adds grit and sustain while keeping the tone tight and articulate. Not fully cranked to maintain note clarity for the fast passages.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "wah",
        gear_slug: "dunlop-cry-baby-wah",
        gear_name: "Dunlop Cry Baby Wah",
        icon_type: "wah",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Position: "parked at ~70%" },
        notes:
          "Rhoads often parked the wah at a fixed position to shape the frequency peak, adding a nasal, vocal quality to the tone rather than sweeping it. This is especially noticeable during the solo sections.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Presence: 7, Bass: 5, Middle: 7, Treble: 7, "Volume I": 8, "Volume II": 0 },
        notes:
          "The Marshall cranked hot provides the foundational gain and sustain. Combined with the MXR Distortion+, the tone has plenty of saturation for singing lead lines and aggressive riffs.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "Standard Marshall 4x12 for tight, aggressive metal tone.",
      },
    ],
    original_gear: {
      guitar: "Gibson Les Paul Custom (white), bridge humbucker, standard tuning",
      effects: ["MXR Distortion+", "Dunlop Cry Baby Wah (often parked)"],
      amp: "Marshall Super Lead 1959 (cranked)",
      cabinet: "Marshall 4x12",
      microphone: "Shure SM57",
      other_notes:
        "Rhoads' classically-trained precision and vibrato technique are as important as the gear. His controlled, deliberate approach to playing elevated metal guitar to a new level of musicianship.",
    },
    tags: ["metal", "hard-rock", "distortion", "wah", "randy-rhoads", "ozzy"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Minotaur",
            block_category: "Distortion",
            original_gear: "MXR Distortion+",
            settings: { Gain: 6.0, Level: 7.0, Tone: 6.0 },
            notes: "The Minotaur provides a similar mid-focused overdrive to the MXR Distortion+.",
          },
          {
            position: 2,
            block_name: "Chrome",
            block_category: "Wah",
            original_gear: "Cry Baby Wah",
            settings: { Position: 70 },
            notes: "Park the wah at ~70% for the nasal, vocal quality. No expression pedal needed for the parked setting.",
          },
          {
            position: 3,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 7.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 7.0,
              Presence: 7.0,
              "Ch Vol": 7.0,
            },
            notes: "Cranked Plexi for the foundation. Pushed mids for cut and aggression.",
          },
          {
            position: 4,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "Close-miked for maximum presence and tight low end.",
          },
        ],
        notes:
          "The MXR Distortion+ into cranked Plexi with a parked wah is the Rhoads formula. Use the bridge humbucker and practice your vibrato.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Distortion+",
            block_category: "Drive",
            original_gear: "MXR Distortion+",
            settings: { Gain: 6.0, Output: 7.0 },
            notes: "MXR Distortion+ model for grit and sustain.",
          },
          {
            position: 2,
            block_name: "Wah",
            block_category: "Wah",
            original_gear: "Cry Baby",
            settings: { Position: 70 },
            notes: "Parked wah for tonal shaping.",
          },
          {
            position: 3,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 7.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 7.0,
              Presence: 7.0,
              Master: 7.0,
            },
            notes: "Cranked Plexi with pushed mids.",
          },
          {
            position: 4,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Close-miked for tight metal tone.",
          },
        ],
        notes:
          "The QC handles this classic metal tone well. Search Cortex Cloud for Randy Rhoads or Blizzard of Ozz captures.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 7,
              Bass: 5,
              Middle: 7,
              Treble: 7,
              Presence: 7,
              Volume: 7,
            },
            notes: "Brown channel cranked for Marshall-style aggression.",
          },
          {
            position: 2,
            block_name: "Mid Boost",
            block_category: "Booster",
            original_gear: "MXR Distortion+",
            settings: { Level: 7, Drive: 6 },
            notes: "Mid Boost in the Booster slot provides similar tonal shaping to the MXR Distortion+.",
          },
        ],
        notes:
          "The Brown channel with a Mid Boost gets close to the Rhoads tone. Use the bridge humbucker and focus on clean, precise picking technique.",
      },
    },
    is_editorial: true,
    view_count: 2678,
    rating_avg: 4.6,
    rating_count: 0,
  },
  {
    id: "seed-srv-texas-flood",
    song_slug: "texas-flood-stevie-ray-vaughan",
    title: "SRV's Texas Flood Slow Blues Lead Tone",
    slug: "srv-texas-flood-slow-blues-lead",
    description:
      "SRV's tone on Texas Flood (the title track) is a slow blues masterclass in dynamics and touch sensitivity. Unlike the driving shuffle of Pride and Joy, Texas Flood is about sustain, bending, and raw emotion at lower tempos. The tone is heavier and more saturated, with the Tube Screamer pushing the Vibroverb harder and the neck pickup providing warmth for singing, sustained bends. SRV's vibrato is wider and slower here, letting each note breathe and decay naturally.",
    tone_context: "solo",
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
        "Same guitar as Pride and Joy but using the neck pickup for the warmer, fatter lead tone. The heavy .013 gauge strings provide enormous sustain and a thick, bold sound when bent.",
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
        settings: { Drive: 5, Tone: 5, Level: 7 },
        notes:
          "For the slow blues lead, the Tube Screamer drive is pushed slightly higher than on Pride and Joy, adding more sustain and saturation for the long, singing bends. Tone at noon for a balanced, warm character.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-vibroverb-blackface",
        gear_name: "Fender Vibroverb (1964 Blackface)",
        icon_type: "fender_combo",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Volume: 9, Treble: 5, Bass: 5, Reverb: 4, Speed: 0 },
        notes:
          "The amp is pushed harder than on Pride and Joy. Volume at 9 puts it deep into overdrive territory. More reverb adds atmosphere for the slow, spacious blues feel.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Built-in 1x15 JBL D130F",
        icon_type: "cab_1x12",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: {},
        notes: "The 1x15 JBL speaker provides the round, full bass response that supports SRV's heavy bends.",
      },
    ],
    original_gear: {
      guitar: "Fender Stratocaster #1 ('Number One'), neck pickup, Eb tuning, .013-.058 strings",
      effects: ["Ibanez TS808 Tube Screamer (drive pushed higher for lead)"],
      amp: "Fender Vibroverb (1964 Blackface) cranked harder",
      cabinet: "Built-in 1x15 JBL D130F",
      microphone: "Shure SM57",
      other_notes:
        "Texas Flood is about dynamics and emotion. SRV plays with incredible touch sensitivity, from whisper-quiet passages to full-volume string bending. The neck pickup and heavy strings give each bent note a vocal quality.",
    },
    tags: ["blues", "texas-blues", "slow-blues", "lead", "srv", "sustain"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Scream 808",
            block_category: "Distortion",
            original_gear: "Ibanez TS808",
            settings: { Drive: 5.0, Tone: 5.0, Level: 7.0 },
            notes: "Drive pushed higher than on Pride and Joy for more sustain on the slow blues leads.",
          },
          {
            position: 2,
            block_name: "US Deluxe Vib",
            block_category: "Amp",
            original_gear: "Fender Vibroverb",
            settings: {
              Drive: 8.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 5.0,
              Presence: 5.0,
              "Ch Vol": 8.0,
            },
            notes: "Push the amp harder than the Pride and Joy setting for deeper overdrive and more sustain.",
          },
          {
            position: 3,
            block_name: "1x15 Ampeg",
            block_category: "Cab",
            original_gear: "1x15 JBL D130F",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "1x15 cab for the round, full bass response.",
          },
        ],
        notes:
          "Use the neck pickup and play with dynamics. Wide, slow vibrato is essential. Add a Spring Reverb block for the atmospheric feel of the slow blues.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "TS808 OD",
            block_category: "Drive",
            original_gear: "Ibanez TS808",
            settings: { Drive: 5.0, Tone: 5.0, Level: 7.0 },
            notes: "Drive higher than the Pride and Joy setting for slow blues sustain.",
          },
          {
            position: 2,
            block_name: "Vibro Verb",
            block_category: "Amp",
            original_gear: "Fender Vibroverb",
            settings: {
              Gain: 8.0,
              Bass: 5.0,
              Mid: 5.0,
              Treble: 5.0,
              Master: 8.0,
            },
            notes: "Pushed harder for deeper overdrive on the slow blues leads.",
          },
          {
            position: 3,
            block_name: "1x15 Vibroverb",
            block_category: "Cab",
            original_gear: "1x15 JBL D130F",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "1x15 for full, round bass response.",
          },
        ],
        notes:
          "Neck pickup, wide vibrato, and let each note breathe. The QC's Vibroverb model pushed hard excels at this type of emotional blues lead tone.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Fender Vibroverb",
            settings: {
              Gain: 7,
              Bass: 5,
              Middle: 5,
              Treble: 5,
              Presence: 5,
              Volume: 8,
            },
            notes: "Crunch channel pushed hard for the saturated blues lead tone.",
          },
          {
            position: 2,
            block_name: "Blues Driver",
            block_category: "Booster",
            original_gear: "Ibanez TS808",
            settings: { Level: 7, Tone: 5, Drive: 5 },
            notes: "Blues Driver with higher drive than the Pride and Joy setting for more sustain.",
          },
        ],
        notes:
          "Use the neck pickup and add reverb in the FX section. Play with wide vibrato and let each note sing.",
      },
    },
    is_editorial: true,
    view_count: 1567,
    rating_avg: 4.5,
    rating_count: 0,
  },
  {
    id: "seed-satriani-surfing-with-the-alien",
    song_slug: "surfing-with-the-alien-joe-satriani",
    title: "Satriani's Surfing with the Alien Lead Tone",
    slug: "satriani-surfing-with-the-alien-lead",
    description:
      "Joe Satriani's tone on Surfing with the Alien is a fluid, singing lead sound designed for legato playing and whammy bar acrobatics. The Ibanez JS guitar's high-output DiMarzio pickups drive a cranked Marshall into smooth saturation, while a wah pedal adds expression and a delay provides spacious depth. The tone has enough gain for effortless legato runs but enough clarity for each note to speak distinctly during rapid passages. This is the quintessential instrumental rock guitar tone.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Ibanez JS Series",
      pickup_config: "HSH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "25.5",
      tuning: "standard",
      string_gauge: ".009-.042",
      notable_mods:
        "DiMarzio PAF Pro (neck) and Fred (bridge) humbuckers with a single-coil in the middle position. Edge tremolo system for whammy bar dive bombs and squeals. Fast neck profile with jumbo frets for effortless legato playing.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "wah",
        gear_slug: "dunlop-cry-baby-wah",
        gear_name: "Dunlop Cry Baby Wah",
        icon_type: "wah",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Position: "swept expressively" },
        notes:
          "Satriani uses the wah expressively during solos for vocal-like filter sweeps. Not always on, but a key part of the lead tone on many sections of the album.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "distortion",
        gear_slug: "boss-ds1",
        gear_name: "Boss DS-1 Distortion",
        icon_type: "boss_compact",
        icon_color: "#f97316",
        is_in_effects_loop: false,
        settings: { Dist: 6, Tone: 6, Level: 7 },
        notes:
          "The DS-1 adds sustain and harmonic richness. Distortion at moderate levels for smooth lead tone without fizzy harshness.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Presence: 6, Bass: 5, Middle: 7, Treble: 6, "Volume I": 7, "Volume II": 0 },
        notes:
          "The Marshall provides the foundation of gain and sustain. Moderate drive so the DS-1 handles the primary gain staging. Pushed mids for cut and lead presence.",
      },
      {
        position: 4,
        category: "wet_effect",
        subcategory: "delay",
        gear_slug: null,
        gear_name: "Boss DD-2 Digital Delay",
        icon_type: "boss_compact",
        icon_color: "#3b82f6",
        is_in_effects_loop: true,
        settings: { Time: "400ms", Feedback: 30, Level: 30 },
        notes:
          "Delay in the loop adds space and depth to the lead tone. Moderate settings for musical repeats that fill gaps between phrases without cluttering fast passages.",
      },
      {
        position: 5,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "Standard Marshall 4x12 for the rock lead foundation.",
      },
    ],
    original_gear: {
      guitar: "Ibanez JS Series with DiMarzio pickups, bridge humbucker, standard tuning",
      effects: ["Dunlop Cry Baby Wah", "Boss DS-1 Distortion", "Boss DD-2 Digital Delay (loop)"],
      amp: "Marshall Super Lead 1959",
      cabinet: "Marshall 4x12",
      microphone: "Shure SM57",
      other_notes:
        "Satriani's legato technique and whammy bar work are essential to the Surfing with the Alien sound. The tone supports his fluid playing style with smooth sustain and clear note articulation.",
    },
    tags: ["instrumental-rock", "lead", "wah", "delay", "satriani", "hard-rock"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Chrome",
            block_category: "Wah",
            original_gear: "Cry Baby Wah",
            settings: { Position: "Expression Pedal" },
            notes: "Assign to expression pedal for expressive filter sweeps.",
          },
          {
            position: 2,
            block_name: "Deez One Vintage",
            block_category: "Distortion",
            original_gear: "Boss DS-1",
            settings: { Dist: 6.0, Tone: 6.0, Level: 7.0 },
            notes: "Moderate distortion for smooth lead sustain.",
          },
          {
            position: 3,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 6.0,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 6.0,
              "Ch Vol": 7.0,
            },
            notes: "Moderate drive. The DS-1 handles primary gain staging.",
          },
          {
            position: 4,
            block_name: "Simple Delay",
            block_category: "Delay",
            original_gear: "Boss DD-2",
            settings: { Time: "400ms", Feedback: 30, Mix: 30 },
            notes: "Place after amp+cab for clean, spacious repeats.",
          },
          {
            position: 5,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "57 Dynamic", Distance: 1.5 },
            notes: "Greenback cab for rock lead tone.",
          },
        ],
        notes:
          "Use a guitar with a locking tremolo for authentic whammy bar effects. The wah on an expression pedal adds vocal expression to the lead lines.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Wah",
            block_category: "Wah",
            original_gear: "Cry Baby Wah",
            settings: { Position: "Expression Pedal" },
            notes: "Expression pedal for expressive wah sweeps.",
          },
          {
            position: 2,
            block_name: "DS-1",
            block_category: "Drive",
            original_gear: "Boss DS-1",
            settings: { Dist: 6.0, Tone: 6.0, Level: 7.0 },
            notes: "Moderate distortion for smooth lead tone.",
          },
          {
            position: 3,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 6.0,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 6.0,
              Master: 7.0,
            },
            notes: "Moderate gain with pushed mids for lead cut.",
          },
          {
            position: 4,
            block_name: "Digital Delay",
            block_category: "Delay",
            original_gear: "Boss DD-2",
            settings: { Time: "400ms", Feedback: 30, Mix: 30 },
            notes: "Spacious delay for depth.",
          },
          {
            position: 5,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12",
            settings: { Mic: "SM57", Distance: "1.5 inches" },
            notes: "Greenback cab for lead tone.",
          },
        ],
        notes:
          "A fluid, versatile lead tone. The QC handles this type of complex signal chain well with its dual-path routing.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 6,
              Bass: 5,
              Middle: 7,
              Treble: 6,
              Presence: 6,
              Volume: 7,
            },
            notes: "Brown channel at moderate gain for the Marshall foundation.",
          },
          {
            position: 2,
            block_name: "DS-1",
            block_category: "Booster",
            original_gear: "Boss DS-1",
            settings: { Dist: 6, Tone: 6, Level: 7 },
            notes: "The Katana's DS-1 model adds smooth sustain for lead playing.",
          },
          {
            position: 3,
            block_name: "Digital Delay",
            block_category: "FX",
            original_gear: "Boss DD-2",
            settings: { Time: "400ms", Feedback: 30, Level: 30 },
            notes: "Delay for spacious lead tone.",
          },
        ],
        notes:
          "Brown channel with DS-1 boost and delay provides a solid Satriani-style lead tone. Use a guitar with a locking tremolo if possible.",
      },
    },
    is_editorial: true,
    view_count: 1789,
    rating_avg: 4.4,
    rating_count: 0,
  },
  {
    id: "seed-gallagher-wonderwall",
    song_slug: "wonderwall-oasis",
    title: "Noel Gallagher's Wonderwall Jangly Rhythm Tone",
    slug: "gallagher-wonderwall-jangly-rhythm",
    description:
      "Wonderwall's guitar tone is a wall of jangly, layered acoustic and electric guitar. The electric guitar parts use an Epiphone Riviera semi-hollow through a Marshall, producing a bright, chiming rhythm tone. The semi-hollow body adds natural resonance and airiness, while the Marshall provides just enough crunch to give the chords bite without overwhelming the song's delicate melodic quality. Multiple guitar layers and a capo create the signature Britpop wall of sound.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Epiphone Riviera",
      pickup_config: "HH",
      pickup_position: "both",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Stock Epiphone Riviera with mini-humbuckers. Capo on the 2nd fret for the song's chord voicings. Both pickups on for full, jangly tone.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Presence: 6, Bass: 4, Middle: 6, Treble: 7, "Volume I": 5, "Volume II": 0 },
        notes:
          "The Marshall at moderate volume provides a warm crunch without heavy distortion. The treble is pushed for jangly brightness. This is a rhythm tone, so the gain should be low enough for chord clarity.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "Greenback cab adds the warm midrange that fills out the jangly chords.",
      },
    ],
    original_gear: {
      guitar: "Epiphone Riviera with capo on 2nd fret, both pickups",
      effects: [],
      amp: "Marshall (moderate crunch)",
      cabinet: "Marshall 4x12 with Greenbacks",
      microphone: "Shure SM57",
      other_notes:
        "Wonderwall's massive sound comes from layering multiple guitar tracks: acoustic guitars, electric rhythm parts, and overdubbed lead fills. The individual electric tone is relatively simple.",
    },
    tags: ["britpop", "alternative", "jangly", "rhythm", "oasis"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 4.5,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 5.0,
            },
            notes: "Moderate gain for jangly crunch. Push the treble for brightness.",
          },
          {
            position: 2,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "Greenback cab for warm British midrange.",
          },
        ],
        notes:
          "Simple, clean-crunch tone. Use a capo on the 2nd fret and both pickups on a semi-hollow or humbucker guitar. Layer multiple takes for the wall-of-guitar Britpop sound.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 4.5,
              Bass: 4.0,
              Mid: 6.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 5.0,
            },
            notes: "Moderate gain for jangly crunch.",
          },
          {
            position: 2,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "Greenback for warm Britpop tone.",
          },
        ],
        notes:
          "A simple but effective patch. The QC's Plexi at low gain produces excellent jangly crunch.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Crunch",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 4,
              Bass: 4,
              Middle: 6,
              Treble: 7,
              Presence: 6,
              Volume: 5,
            },
            notes: "Crunch channel at low gain for the jangly Britpop sound. Push the treble for brightness.",
          },
        ],
        notes:
          "The Katana's Crunch channel at low gain is perfect for this jangly, chimey Britpop tone. Use a capo on the 2nd fret.",
      },
    },
    is_editorial: true,
    view_count: 4123,
    rating_avg: 4.3,
    rating_count: 0,
  },
  {
    id: "seed-marr-how-soon-is-now",
    song_slug: "how-soon-is-now-the-smiths",
    title: "Johnny Marr's How Soon Is Now? Tremolo Tone",
    slug: "marr-how-soon-is-now-tremolo",
    description:
      "One of the most iconic guitar tones in alternative rock. Johnny Marr's tone on How Soon Is Now? is built on a Rickenbacker 330 through a Fender Twin Reverb with extreme tremolo effect. The tremolo is the defining feature: a pulsating, rhythmic wobble that gives the song its hypnotic, driving feel. Marr used four separate amp channels processed with tremolo at different speeds, then blended them to create a massive, swirling stereo effect. The result is a guitar tone that sounds like it is breathing.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "semi_hollow",
      model_name: "Rickenbacker 330",
      pickup_config: "SS",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".010-.046",
      notable_mods:
        "Stock Rickenbacker 330. The high-output toaster pickups provide a bright, jangly character. Slide technique is used for the main riff.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-twin-reverb",
        gear_name: "Fender Twin Reverb",
        icon_type: "fender_combo",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Volume: 5, Treble: 7, Bass: 4, Middle: 5, Reverb: 3 },
        notes:
          "The Twin Reverb provides a clean, sparkling foundation. The tone stays clean so the tremolo effect remains clear and defined. Treble is pushed for the Rickenbacker's characteristic jangle.",
      },
      {
        position: 2,
        category: "wet_effect",
        subcategory: "modulation",
        gear_slug: null,
        gear_name: "Fender Vibrato (built-in tremolo circuit)",
        icon_type: "large_format",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Speed: 6, Intensity: 8 },
        notes:
          "The tremolo is set deep and fast for the pulsating, rhythmic effect. This is not subtle; the tremolo is the entire point of the tone. Marr used multiple amps with tremolo at different rates to create the massive swirling effect on the recording.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Fender Twin Reverb built-in 2x12",
        icon_type: "cab_1x12",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: {},
        notes: "The Twin's built-in speakers provide the clean, full-range foundation for the tremolo effect.",
      },
    ],
    original_gear: {
      guitar: "Rickenbacker 330, bridge pickup, standard tuning, slide technique",
      effects: ["Fender Vibrato (amp tremolo, multiple amps at different rates)"],
      amp: "Fender Twin Reverb (multiple amps with tremolo)",
      cabinet: "Twin Reverb built-in 2x12",
      microphone: "Shure SM57",
      other_notes:
        "The recording technique is as important as the gear. Marr ran his guitar through four amps simultaneously, each with tremolo at a different speed, creating a complex, swirling stereo effect. For home reproduction, a single amp with deep tremolo captures the essence.",
    },
    tags: ["indie-rock", "alternative", "tremolo", "jangly", "the-smiths", "post-punk"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Double Nrm",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Drive: 3.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 5.0,
            },
            notes: "Clean Twin Reverb setting. No breakup; the tone stays clean for tremolo clarity.",
          },
          {
            position: 2,
            block_name: "Optical Trem",
            block_category: "Modulation",
            original_gear: "Fender Vibrato",
            settings: { Speed: 6.0, Depth: 8.0 },
            notes: "Deep, fast tremolo is the defining effect. Set depth high for the pulsating character.",
          },
          {
            position: 3,
            block_name: "2x12 Double C12N",
            block_category: "Cab",
            original_gear: "Twin 2x12",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "Twin 2x12 cab for clean, full-range foundation.",
          },
        ],
        notes:
          "For a more authentic reproduction, use two parallel paths with tremolo blocks at different speeds panned left and right. This recreates Marr's four-amp technique in stereo.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Twin Reverb",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 3.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 5.0,
            },
            notes: "Clean foundation for the tremolo effect.",
          },
          {
            position: 2,
            block_name: "Tremolo",
            block_category: "Modulation",
            original_gear: "Fender Vibrato",
            settings: { Speed: 6.0, Depth: 8.0 },
            notes: "Deep, fast tremolo. This is the entire point of the tone.",
          },
          {
            position: 3,
            block_name: "2x12 Twin",
            block_category: "Cab",
            original_gear: "Twin 2x12",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "Clean cab for the tremolo effect.",
          },
        ],
        notes:
          "Use the QC's parallel routing to run two paths with different tremolo speeds for the full Marr multi-amp effect.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 3,
              Bass: 4,
              Middle: 5,
              Treble: 7,
              Presence: 6,
              Volume: 5,
            },
            notes: "Clean channel for pristine foundation.",
          },
          {
            position: 2,
            block_name: "Tremolo",
            block_category: "Mod",
            original_gear: "Fender Vibrato",
            settings: { Rate: 6, Depth: 80 },
            notes: "Deep tremolo is the signature effect. Set depth high.",
          },
        ],
        notes:
          "Clean channel with deep tremolo captures the essence of How Soon Is Now. Use a bright guitar with single-coils or toaster pickups if possible.",
      },
    },
    is_editorial: true,
    view_count: 1345,
    rating_avg: 4.4,
    rating_count: 0,
  },
  {
    id: "seed-richards-start-me-up",
    song_slug: "start-me-up-rolling-stones",
    title: "Keith Richards' Start Me Up Open-G Riff Tone",
    slug: "richards-start-me-up-open-g",
    description:
      "Keith Richards' tone on Start Me Up is the sound of rock and roll rhythm guitar stripped to its essence. A Telecaster in open-G tuning (with the low E string removed, making it a 5-string guitar) through a cranked Fender Twin Reverb. The open tuning allows Richards to play full, ringing chords with a single finger barred across the fretboard, creating a big, open sound. The Twin Reverb's clean headroom preserves the jangly brightness of the Telecaster, while the slight natural breakup from playing hard gives it attitude.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Fender Telecaster",
      pickup_config: "SS",
      pickup_position: "bridge",
      string_count: 5,
      scale_length: "25.5",
      tuning: "custom",
      tuning_custom: "Open G (D-G-D-G-B-D, low E removed)",
      string_gauge: ".011-.048",
      notable_mods:
        "5-string Telecaster with the low E string removed. Open-G tuning. The Telecaster's bright bridge pickup provides the snappy, cutting attack that defines Richards' rhythm playing.",
    },
    signal_chain: [
      {
        position: 1,
        category: "preamp",
        subcategory: null,
        gear_slug: "fender-twin-reverb",
        gear_name: "Fender Twin Reverb",
        icon_type: "fender_combo",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: { Volume: 6, Treble: 7, Bass: 4, Middle: 5, Reverb: 2 },
        notes:
          "The Twin at moderate volume provides a clean tone with just a hint of natural breakup when Richards digs in. The clean headroom preserves the Telecaster's bright, jangly character.",
      },
      {
        position: 2,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Fender Twin Reverb built-in 2x12",
        icon_type: "cab_1x12",
        icon_color: "#ef4444",
        is_in_effects_loop: false,
        settings: {},
        notes: "The Twin's built-in 2x12 speakers provide wide, full clean tone.",
      },
    ],
    original_gear: {
      guitar: "Fender Telecaster ('Micawber'), open-G tuning, 5 strings, bridge pickup",
      effects: [],
      amp: "Fender Twin Reverb",
      cabinet: "Twin Reverb built-in 2x12",
      microphone: "Shure SM57",
      other_notes:
        "The open-G tuning is the secret to Richards' huge, ringing chord voicings. With only 5 strings and an open tuning, simple barre shapes produce full, resonant chords. Richards' rhythmic timing and feel are as important as any gear choice.",
    },
    tags: ["rock", "classic-rock", "rhythm", "open-tuning", "rolling-stones"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "US Double Nrm",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Drive: 4.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 6.0,
            },
            notes: "Twin Reverb at moderate volume for clean with edge-of-breakup dynamics. Push the treble for Telecaster brightness.",
          },
          {
            position: 2,
            block_name: "2x12 Double C12N",
            block_category: "Cab",
            original_gear: "Twin 2x12",
            settings: { Mic: "57 Dynamic", Distance: 2.0 },
            notes: "The Twin's 2x12 cab for full, wide clean tone.",
          },
        ],
        notes:
          "The key to this tone is the open-G tuning, not the gear. Tune to D-G-D-G-B-D and remove the low E string for authentic Richards riffing.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Twin Reverb",
            block_category: "Amp",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 4.0,
              Bass: 4.0,
              Mid: 5.0,
              Treble: 7.0,
              Presence: 6.0,
              Master: 6.0,
            },
            notes: "Clean with edge-of-breakup dynamics.",
          },
          {
            position: 2,
            block_name: "2x12 Twin",
            block_category: "Cab",
            original_gear: "Twin 2x12",
            settings: { Mic: "SM57", Distance: "2 inches" },
            notes: "Twin cab for wide, full tone.",
          },
        ],
        notes:
          "Open-G tuning is essential. The gear is secondary to the tuning and Richards' rhythmic feel.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Clean",
            block_category: "Amp Type",
            original_gear: "Fender Twin Reverb",
            settings: {
              Gain: 4,
              Bass: 4,
              Middle: 5,
              Treble: 7,
              Presence: 6,
              Volume: 6,
            },
            notes: "Clean channel with pushed treble for Telecaster jangle. Slight breakup when you dig in.",
          },
        ],
        notes:
          "The Katana's Clean channel at moderate volume nails the Richards rhythm sound. Open-G tuning and a Telecaster are more important than amp settings.",
      },
    },
    is_editorial: true,
    view_count: 1678,
    rating_avg: 4.3,
    rating_count: 0,
  },
  {
    id: "seed-gibbons-la-grange",
    song_slug: "la-grange-zz-top",
    title: "Billy Gibbons' La Grange Texas Blues Crunch",
    slug: "gibbons-la-grange-blues-crunch",
    description:
      "Billy Gibbons' tone on La Grange is a grinding, bluesy crunch built on a Les Paul through a Marshall Plexi pushed by a Dallas Rangemaster treble booster. The Rangemaster adds searing upper harmonics and extra gain, driving the Plexi into rich, sustained overdrive. Gibbons' picking technique -- including his signature pinch harmonics -- makes each note scream with harmonic overtones. The tone is aggressive enough for rock but rooted deeply in Texas blues tradition.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Gibson Les Paul Standard ('Pearly Gates')",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "24.75",
      tuning: "standard",
      string_gauge: ".008-.038",
      notable_mods:
        "Gibbons' '59 Les Paul 'Pearly Gates' is one of the most famous guitars in rock. Extremely light strings (.008 gauge) for effortless bending and a snappier attack. Stock PAF humbuckers provide the fat, warm character.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "boost",
        gear_slug: "dallas-rangemaster",
        gear_name: "Dallas Rangemaster Treble Booster",
        icon_type: "boss_compact",
        icon_color: "#d4a574",
        is_in_effects_loop: false,
        settings: { Boost: 8 },
        notes:
          "The Rangemaster is essential to the ZZ Top tone. It pushes the upper frequencies hard into the Marshall, creating the searing, screaming quality of Gibbons' lead lines and those signature pinch harmonics.",
      },
      {
        position: 2,
        category: "preamp",
        subcategory: null,
        gear_slug: "marshall-super-lead-1959",
        gear_name: "Marshall Super Lead 1959 (Plexi)",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Presence: 6, Bass: 5, Middle: 7, Treble: 6, "Volume I": 8, "Volume II": 0 },
        notes:
          "The Plexi cranked with the Rangemaster produces a rich, harmonically complex overdrive. Mids are pushed for lead cut and that gritty Texas blues character.",
      },
      {
        position: 3,
        category: "cabinet",
        subcategory: null,
        gear_slug: "marshall-4x12-greenback",
        gear_name: "Marshall 4x12 Cabinet (Greenback)",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "Greenback cab for the classic blues-rock British midrange character.",
      },
    ],
    original_gear: {
      guitar: "Gibson Les Paul Standard ('Pearly Gates'), bridge humbucker, .008-.038 strings",
      effects: ["Dallas Rangemaster Treble Booster"],
      amp: "Marshall Super Lead 1959 Plexi (cranked)",
      cabinet: "Marshall 4x12 with Greenbacks",
      microphone: "Shure SM57",
      other_notes:
        "Gibbons' extremely light strings and heavy pick attack create a unique snappy, aggressive tone. His pinch harmonic technique is a defining element of the ZZ Top sound.",
    },
    tags: ["blues-rock", "hard-rock", "southern-rock", "treble-booster", "zz-top"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Kinky Boost",
            block_category: "Distortion",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 8.0 },
            notes: "Treble booster to push the Plexi into searing overdrive.",
          },
          {
            position: 2,
            block_name: "Brit Plexi Brt",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Drive: 7.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 6.0,
              "Ch Vol": 7.0,
            },
            notes: "Cranked Plexi with the Rangemaster boost for classic ZZ Top crunch.",
          },
          {
            position: 3,
            block_name: "4x12 Greenback25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "Close-miked for maximum bite and presence.",
          },
        ],
        notes:
          "The Rangemaster into Plexi is the classic Billy Gibbons formula. Practice pinch harmonics for authentic ZZ Top snarl.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Rangemaster",
            block_category: "Drive",
            original_gear: "Dallas Rangemaster",
            settings: { Boost: 8.0 },
            notes: "Treble booster to drive the Plexi.",
          },
          {
            position: 2,
            block_name: "1959 SLP",
            block_category: "Amp",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 7.5,
              Bass: 5.0,
              Mid: 7.0,
              Treble: 6.0,
              Presence: 6.0,
              Master: 7.0,
            },
            notes: "Cranked Plexi for the ZZ Top crunch.",
          },
          {
            position: 3,
            block_name: "4x12 Green 25",
            block_category: "Cab",
            original_gear: "Marshall 4x12 Greenback",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "Greenback for classic blues-rock tone.",
          },
        ],
        notes:
          "Search Cortex Cloud for ZZ Top or Rangemaster+Plexi captures for extra authenticity.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Brown",
            block_category: "Amp Type",
            original_gear: "Marshall Super Lead 1959",
            settings: {
              Gain: 7,
              Bass: 5,
              Middle: 7,
              Treble: 6,
              Presence: 6,
              Volume: 7,
            },
            notes: "Brown channel cranked for Plexi-style crunch.",
          },
          {
            position: 2,
            block_name: "Treble Boost",
            block_category: "Booster",
            original_gear: "Dallas Rangemaster",
            settings: { Level: 8, Tone: 8 },
            notes: "Treble Boost pushes the amp for the searing ZZ Top tone.",
          },
        ],
        notes:
          "Brown channel with Treble Boost captures the Gibbons crunch. Practice pinch harmonics for the authentic ZZ Top squeal.",
      },
    },
    is_editorial: true,
    view_count: 1890,
    rating_avg: 4.5,
    rating_count: 0,
  },
  {
    id: "seed-dimebag-walk",
    song_slug: "walk-pantera",
    title: "Dimebag Darrell's Walk Groove Metal Tone",
    slug: "dimebag-walk-groove-metal",
    description:
      "Dimebag Darrell's tone on Walk is one of the tightest, most aggressive rhythm guitar sounds in metal history. His Dean ML through a solid-state Randall Century 200 produces a razor-sharp, scooped distortion with surgical precision. The solid-state Randall's tight, unforgiving response is the secret weapon: unlike tube amps that compress and round off transients, the Randall delivers every pick attack with brutal clarity. The tone is heavily scooped in the midrange, with boosted lows and highs creating the signature groove metal scoop.",
    tone_context: "full_song",
    guitar_specs: {
      body_type: "solid",
      model_name: "Dean ML (Dimebag Darrell signature)",
      pickup_config: "HH",
      pickup_position: "bridge",
      string_count: 6,
      scale_length: "25.5",
      tuning: "custom",
      tuning_custom: "D Standard (D-G-C-F-A-D)",
      string_gauge: ".009-.046",
      notable_mods:
        "Seymour Duncan Dimebucker high-output humbucker in the bridge. Floyd Rose tremolo for divebombs and harmonic squeals. The high-output pickup drives the Randall's input hard for maximum gain.",
    },
    signal_chain: [
      {
        position: 1,
        category: "effect",
        subcategory: "wah",
        gear_slug: "dunlop-cry-baby-wah",
        gear_name: "Dunlop Cry Baby Wah (from Hell)",
        icon_type: "wah",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Position: "swept during leads" },
        notes:
          "Dimebag's Cry Baby from Hell wah is used during lead sections for screaming filter sweeps. On the Walk riff itself, it is off.",
      },
      {
        position: 2,
        category: "effect",
        subcategory: "overdrive",
        gear_slug: null,
        gear_name: "MXR 6-Band EQ",
        icon_type: "mxr",
        icon_color: "#3b82f6",
        is_in_effects_loop: false,
        settings: { "100Hz": 8, "200Hz": 3, "400Hz": 2, "800Hz": 2, "1.6kHz": 5, "3.2kHz": 8 },
        notes:
          "The MXR 6-Band EQ creates the signature V-curve scoop: boosted lows and highs with heavily cut mids. This EQ is as important as the amp for the Dimebag tone.",
      },
      {
        position: 3,
        category: "preamp",
        subcategory: null,
        gear_slug: "randall-century-200",
        gear_name: "Randall Century 200",
        icon_type: "marshall_head",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: { Gain: 8, Bass: 7, Middle: 3, Treble: 7, Master: 7 },
        notes:
          "The solid-state Randall delivers tight, precise distortion. Unlike tube amps, there is no natural compression softening the attack. Every pick stroke hits with full, aggressive clarity. Mids scooped for the groove metal character.",
      },
      {
        position: 4,
        category: "cabinet",
        subcategory: null,
        gear_slug: null,
        gear_name: "Randall 4x12 Cabinet (Celestion V30)",
        icon_type: "cab_4x12",
        icon_color: "#a1a1aa",
        is_in_effects_loop: false,
        settings: {},
        notes: "4x12 with Vintage 30 speakers for tight, focused low end and aggressive presence.",
      },
    ],
    original_gear: {
      guitar: "Dean ML with Seymour Duncan Dimebucker, bridge humbucker, D standard tuning",
      effects: ["Dunlop Cry Baby from Hell (leads only)", "MXR 6-Band EQ (V-curve scoop)"],
      amp: "Randall Century 200 (solid-state)",
      cabinet: "Randall 4x12 with Celestion V30 speakers",
      microphone: "Shure SM57",
      other_notes:
        "Dimebag's use of a solid-state amp was unconventional in metal but gave him a uniquely tight, precise tone. His right-hand technique, harmonic squeals, and whammy bar work are integral to the Pantera sound.",
    },
    tags: ["groove-metal", "metal", "high-gain", "scooped", "pantera", "dimebag"],
    sources: [],
    platform_translations: {
      helix: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Parametric EQ",
            block_category: "EQ",
            original_gear: "MXR 6-Band EQ",
            settings: { "Low Freq": "+6dB", "Mid Freq": "-8dB", "High Freq": "+6dB" },
            notes: "Create the V-curve scoop: boost lows and highs, cut mids heavily.",
          },
          {
            position: 2,
            block_name: "PV Panama",
            block_category: "Amp",
            original_gear: "Randall Century 200",
            settings: {
              Drive: 8.0,
              Bass: 7.0,
              Mid: 3.0,
              Treble: 7.0,
              Presence: 6.0,
              "Ch Vol": 7.0,
            },
            notes:
              "Helix lacks a Randall model. The PV Panama provides aggressive high-gain with tight low end. Scoop the mids hard. Alternatively, the Line 6 Elektrik model can approximate the solid-state precision.",
          },
          {
            position: 3,
            block_name: "4x12 Cali V30",
            block_category: "Cab",
            original_gear: "Randall 4x12 V30",
            settings: { Mic: "57 Dynamic", Distance: 1.0 },
            notes: "V30 cab for tight, modern metal low end.",
          },
        ],
        notes:
          "Tune to D standard. The V-curve EQ scoop is critical to the Dimebag tone. Use the bridge humbucker with a high-output pickup for maximum aggression.",
      },
      quad_cortex: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Graphic EQ",
            block_category: "EQ",
            original_gear: "MXR 6-Band EQ",
            settings: { "Low": "+6dB", "Mid": "-8dB", "High": "+6dB" },
            notes: "V-curve scoop for the Dimebag tone.",
          },
          {
            position: 2,
            block_name: "Randall Century",
            block_category: "Amp",
            original_gear: "Randall Century 200",
            settings: {
              Gain: 8.0,
              Bass: 7.0,
              Mid: 3.0,
              Treble: 7.0,
              Master: 7.0,
            },
            notes: "If a Randall model is available. Otherwise use a high-gain modern amp model with scooped mids.",
          },
          {
            position: 3,
            block_name: "4x12 V30",
            block_category: "Cab",
            original_gear: "Randall 4x12 V30",
            settings: { Mic: "SM57", Distance: "1 inch" },
            notes: "V30 cab for tight metal tone.",
          },
        ],
        notes:
          "Search Cortex Cloud for Dimebag or Randall captures. The solid-state Randall tone is highly sought after on the platform.",
      },
      katana: {
        chain_blocks: [
          {
            position: 1,
            block_name: "Lead",
            block_category: "Amp Type",
            original_gear: "Randall Century 200",
            settings: {
              Gain: 9,
              Bass: 7,
              Middle: 2,
              Treble: 7,
              Presence: 6,
              Volume: 7,
            },
            notes:
              "The Lead channel cranked with heavily scooped mids approximates the tight Randall tone. Push the gain high for groove metal saturation.",
          },
          {
            position: 2,
            block_name: "Graphic EQ",
            block_category: "FX",
            original_gear: "MXR 6-Band EQ",
            settings: { "Low": "+6dB", "Mid": "-8dB", "High": "+6dB" },
            notes: "Use the Katana's parametric or graphic EQ in Boss Tone Studio for the V-curve scoop.",
          },
        ],
        notes:
          "Tune to D standard. The Katana's Lead channel with extreme mid-scoop and cranked gain delivers a convincing Dimebag tone. Use the graphic EQ in Tone Studio for precise frequency shaping.",
      },
    },
    is_editorial: true,
    view_count: 3210,
    rating_avg: 4.7,
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
