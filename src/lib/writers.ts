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
    bio: "I've been gigging since '78. My pedalboard is a piece of plywood with zip ties and it sounds better than yours.",
    image: "/writers/rick-dalton.jpg",
  },
  {
    slug: "jess-kowalski",
    name: "Jess Kowalski",
    title: "The Punk Engineer",
    bio: "I play in a band called Parking Lot Confessional, I run an HX Stomp into a PA, and I soundcheck in four minutes. Fight me.",
    image: "/writers/jess-kowalski.jpg",
  },
  {
    slug: "sean-nakamura",
    name: "Sean Nakamura",
    title: "The Digital Architect",
    bio: "I run a Quad Cortex into studio monitors. I've never owned a tube amp and I have a spreadsheet for my presets. No, I will not apologize.",
    image: "/writers/sean-nakamura.jpg",
  },
  {
    slug: "margot-thiessen",
    name: "Margot Thiessen",
    title: "The Tone Sommelier",
    bio: "I have opinions about your reverb decay time, and I will share them whether you asked or not. Berklee dropout, Jazzmaster devotee, recovering Gear Page addict.",
    image: "/writers/margot-thiessen.jpg",
  },
  {
    slug: "carl-beckett",
    name: "Carl Beckett",
    title: "The One-Guitar Guy",
    bio: "Same Telecaster since '97. Blues Jr. One cable. I keep it simple because the song doesn't need all that.",
    image: "/writers/carl-beckett.jpg",
  },
  {
    slug: "dev-okonkwo",
    name: "Dev Okonkwo",
    title: "The Bedroom Producer",
    bio: "I make ambient guitar loops at 2 AM and put them on the internet. I've never played a gig. I think about guitar in terms of frequency space, not stage volume.",
    image: "/writers/dev-okonkwo.jpg",
  },
  {
    slug: "nathan-cross",
    name: "Nathan Cross",
    title: "The Worship Architect",
    bio: "I lead worship at a 1,200-member church in Franklin, TN. Dotted eighths are my love language and dynamics are my most important effect.",
    image: "/writers/nathan-cross.jpg",
  },
  {
    slug: "viktor-kessler",
    name: "Viktor Kessler",
    title: "The Metal Scientist",
    bio: "Mechanical engineer by day, 7-string player by night. If your palm mute doesn't feel like a hydraulic press, your gain structure is wrong. I have the data to prove it.",
    image: "/writers/viktor-kessler.jpg",
  },
  {
    slug: "hank-presswood",
    name: "Hank Presswood",
    title: "The Vintage Collector",
    bio: "I ran a guitar shop in Austin for 25 years. I own a '64 Deluxe Reverb and a real Klon, and I will absolutely tell you about both.",
    image: "/writers/hank-presswood.jpg",
  },
  {
    slug: "elena-ruiz",
    name: "Elena Ruiz",
    title: "The Parent Player",
    bio: "I played in bands for 10 years. Now I play through headphones after the kids fall asleep. Twenty minutes on a Tuesday is enough — and I mean that.",
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
