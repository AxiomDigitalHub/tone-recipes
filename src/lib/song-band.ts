/**
 * Derive a band name from a song slug.
 *
 * Song slugs follow the pattern `<song-title-slug>-<band-slug>` —
 * e.g. `do-i-wanna-know-arctic-monkeys`, `killing-in-the-name-rage-against-the-machine`.
 * For solo artists (e.g. `gravity-john-mayer`), the band slug equals the
 * artist slug — in that case we return null so the card doesn't repeat
 * the artist name redundantly.
 *
 * Used by browse cards and the homepage opening shelf to render the
 * "Band / Guitarist" line.
 */
import type { Song, Artist } from "@/types/recipe";

/** Special-case display names where naive title-casing produces the wrong
 *  spelling — band acronyms (AC/DC, ZZ Top), names with apostrophes
 *  (Guns N' Roses), names with lowercase joiners (Rage Against the
 *  Machine), and bands whose canonical name includes "The" (The Who,
 *  The Smiths). Add to this map when introducing a new song. */
const BAND_DISPLAY: Record<string, string> = {
  "ac-dc": "AC/DC",
  "arctic-monkeys": "Arctic Monkeys",
  "black-keys": "The Black Keys",
  "black-sabbath": "Black Sabbath",
  "derek-and-the-dominos": "Derek and the Dominos",
  "dire-straits": "Dire Straits",
  "grateful-dead": "Grateful Dead",
  "guns-n-roses": "Guns N' Roses",
  "iron-maiden": "Iron Maiden",
  "led-zeppelin": "Led Zeppelin",
  "metallica": "Metallica",
  "muse": "Muse",
  "nirvana": "Nirvana",
  "oasis": "Oasis",
  "ozzy-osbourne": "Ozzy Osbourne",
  "pantera": "Pantera",
  "pink-floyd": "Pink Floyd",
  "queen": "Queen",
  "queens-of-the-stone-age": "Queens of the Stone Age",
  "radiohead": "Radiohead",
  "rage-against-the-machine": "Rage Against the Machine",
  "red-hot-chili-peppers": "Red Hot Chili Peppers",
  "rolling-stones": "The Rolling Stones",
  "rush": "Rush",
  "santana": "Santana",
  "the-rolling-stones": "The Rolling Stones",
  "the-smiths": "The Smiths",
  "the-who": "The Who",
  "tool": "Tool",
  "u2": "U2",
  "van-halen": "Van Halen",
  "white-stripes": "The White Stripes",
  "zz-top": "ZZ Top",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * Returns the display band name for a song, or null if the song is by a
 * solo artist (band-slug equals artist-slug).
 */
export function getBandName(song: Song, artist?: Artist): string | null {
  const titleSlug = slugify(song.title);
  let bandSlug = song.slug;

  // Strip the song-title prefix from the song slug, leaving the band part.
  if (bandSlug.startsWith(titleSlug + "-")) {
    bandSlug = bandSlug.slice(titleSlug.length + 1);
  } else {
    // Slug doesn't fit the expected pattern — bail rather than guess.
    return null;
  }

  // Solo artist: band slug === artist slug → no separate band line.
  if (artist && bandSlug === artist.slug) {
    return null;
  }

  // Special case: Carlos Santana plays in the band Santana — treat as solo
  // even though slugs differ slightly.
  if (bandSlug === "santana" && artist?.slug === "carlos-santana") {
    return null;
  }

  return BAND_DISPLAY[bandSlug] ?? titleCaseSlug(bandSlug);
}
