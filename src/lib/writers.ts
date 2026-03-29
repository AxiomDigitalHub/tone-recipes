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
    bio: "Gigging since '78. Still runs a pedalboard with no velcro.",
  },
  {
    slug: "jess-kowalski",
    name: "Jess Kowalski",
    title: "The Punk Engineer",
    bio: "Plays in a band called Parking Lot Confessional. Runs a HX Stomp into a PA and doesn't apologize for it.",
  },
  {
    slug: "sean-nakamura",
    name: "Sean Nakamura",
    title: "The Digital Architect",
    bio: "Runs a Quad Cortex into studio monitors. Has never owned a tube amp. Doesn't feel bad about it.",
  },
  {
    slug: "margot-thiessen",
    name: "Margot Thiessen",
    title: "The Tone Sommelier",
    bio: "Has opinions about your reverb decay time. Will share them whether you asked or not.",
  },
  {
    slug: "carl-beckett",
    name: "Carl Beckett",
    title: "The One-Guitar Guy",
    bio: "Telecaster. Blues Jr. One cable. What else do you need?",
  },
  {
    slug: "dev-okonkwo",
    name: "Dev Okonkwo",
    title: "The Bedroom Producer",
    bio: "Makes ambient guitar loops at 2 AM. Has never played a gig. Doesn't want to.",
  },
  {
    slug: "nathan-cross",
    name: "Nathan Cross",
    title: "The Worship Architect",
    bio: "Dotted eighths are a love language. Volume swells are a prayer.",
  },
  {
    slug: "viktor-kessler",
    name: "Viktor Kessler",
    title: "The Metal Scientist",
    bio: "If your palm mute doesn't feel like a hydraulic press, your gain structure is wrong.",
  },
  {
    slug: "hank-presswood",
    name: "Hank Presswood",
    title: "The Vintage Collector",
    bio: "Owns a '64 Deluxe Reverb. Will tell you about it. Will tell you again.",
  },
  {
    slug: "elena-ruiz",
    name: "Elena Ruiz",
    title: "The Parent Player",
    bio: "Plays for 20 minutes after the kids fall asleep. Through headphones. On a Tuesday. It's enough.",
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
