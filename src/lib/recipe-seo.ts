import type { Artist, Song, ToneRecipe } from "@/types/recipe";
import { getBandName } from "@/lib/song-band";

/**
 * SEO title, H1 and meta description for /recipe/[slug].
 *
 * Recipe pages had a 1.6% click rate in Search Console (17.8k impressions,
 * 283 clicks over 3 months). The old title was the bare recipe name and the
 * description was the intro cut at 160 characters, mid-sentence. These
 * templates lead with the song, the part and the platform people search for.
 *
 * Recipe titles have NO "| Fader & Knob" suffix: with it they ran 70 to 88
 * characters and got cut off in results. Google already shows the site name.
 *
 * `artist.name` is the guitarist (David Gilmour), so the band (Pink Floyd)
 * comes from the song via getBandName. People search the band more often
 * than the guitarist, so the band leads wherever both are shown.
 */

/** Recipe titles must fit in this many characters. */
export const RECIPE_TITLE_MAX = 60;
/** Recipe meta descriptions must fit in this many characters. */
export const RECIPE_DESCRIPTION_MAX = 150;

const PART_BY_CONTEXT: Record<string, string> = {
  solo: "Solo",
  lead: "Lead",
  riff: "Riff",
  intro_riff: "Riff",
  intro: "Intro",
  clean: "Clean",
  rhythm: "Rhythm",
  chorus: "Chorus",
  verse: "Verse",
  outro: "Outro",
  full_song: "",
};

/** Short platform names, in the platform switcher's order. */
const PLATFORM_SHORT: Array<[keyof ToneRecipe["platform_translations"], string]> = [
  ["helix", "Helix"],
  ["quad_cortex", "Quad Cortex"],
  ["tonex", "TONEX"],
  ["fractal", "Fractal"],
  ["kemper", "Kemper"],
  ["katana", "Katana"],
];

/** "Solo", "Riff", ... or "" for a full-song recipe (or an unknown context). */
export function recipePart(recipe: Pick<ToneRecipe, "tone_context">): string {
  return PART_BY_CONTEXT[recipe.tone_context] ?? "";
}

function join(...parts: string[]): string {
  return parts.filter(Boolean).join(" ");
}

/** The band, or null for a solo artist (or no song). */
export function recipeBand(song: Song | undefined, artist: Artist | undefined): string | null {
  if (!song) return null;
  const band = getBandName(song, artist);
  return band && band !== artist?.name ? band : null;
}

/** The names to show, band first: "Pink Floyd, David Gilmour" and so on. */
function nameOptions(song: Song | undefined, artist: Artist | undefined): string[] {
  const band = recipeBand(song, artist);
  if (band && artist) return [`${band}, ${artist.name}`, band];
  if (band) return [band];
  if (artist) return [artist.name];
  return [];
}

/** The ordered title candidates, before the length check. */
export function recipeSeoTitleCandidates(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): string[] {
  if (!song) return [recipe.title];
  const preset = recipe.platform_translations?.helix ? "Helix Preset" : "Preset";
  const head = `${join(song.title, recipePart(recipe))} Guitar Tone`;
  const list: string[] = [];
  const names = nameOptions(song, artist);
  for (const n of names) {
    list.push(`${head} (${n}): ${preset} and Settings`);
    list.push(`${head} (${n}): ${preset}`);
  }
  // Long song names: drop "Guitar" before dropping the band.
  const shortHead = `${join(song.title, recipePart(recipe))} Tone`;
  for (const n of names) list.push(`${shortHead} (${n}): ${preset}`);
  list.push(`${head}: ${preset} and Settings`);
  list.push(`${head}: ${preset}`);
  list.push(recipe.title);
  return list;
}

/** First candidate that fits in RECIPE_TITLE_MAX; else the recipe name. */
export function recipeSeoTitle(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): string {
  const list = recipeSeoTitleCandidates(recipe, song, artist);
  return list.find((c) => c.length <= RECIPE_TITLE_MAX) ?? recipe.title;
}

/**
 * The two lines of the H1: the song as the large line, then
 * "by {Band} ({Guitarist}): {part} tone recipe", or "by {Artist}: ..." for a
 * solo artist ("guitar" for a full-song recipe).
 */
export function recipeH1(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): { main: string; sub: string } {
  const part = recipePart(recipe).toLowerCase() || "guitar";
  const main = song?.title ?? recipe.title;
  const band = recipeBand(song, artist);
  const by = band && artist ? `${band} (${artist.name})` : (band ?? artist?.name);
  const sub = by ? `by ${by}: ${part} tone recipe` : `${part} tone recipe`;
  return { main, sub };
}

/** H1 as one plain string, for audits. */
export function recipeH1Text(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): string {
  const { main, sub } = recipeH1(recipe, song, artist);
  return sub.startsWith("by ") ? `${main} ${sub}` : `${main}: ${sub}`;
}

/** First amp in the chain, with anything in brackets removed. */
export function recipeAmpName(recipe: ToneRecipe): string | undefined {
  const node = recipe.signal_chain?.find((n) => n.category === "preamp");
  if (!node?.gear_name) return undefined;
  const name = node.gear_name
    .replace(/\s*[([{][^)\]}]*[)\]}]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return name || undefined;
}

/** "Pink Floyd's", "Guns N' Roses'". */
function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

/** "a" or "an" for the amp name (an Ampeg, a Fender). */
function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/** First sentence of the intro, cut at a word boundary under the limit. */
function introFallback(description: string, max: number): string {
  const text = description.replace(/\s+/g, " ").trim();
  const sentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
  if (sentence.length <= max) return sentence;
  const cut = sentence.slice(0, max - 1);
  const atSpace = cut.slice(0, cut.lastIndexOf(" "));
  return `${(atSpace || cut).replace(/[,;:\s]+$/, "")}…`;
}

export function recipeSeoDescription(
  recipe: ToneRecipe,
  song: Song | undefined,
  artist: Artist | undefined,
): string {
  const platforms = PLATFORM_SHORT.filter(([id]) => recipe.platform_translations?.[id]).map(
    ([, short]) => short,
  );
  const amp = recipeAmpName(recipe);
  if (!song || !artist || !amp || platforms.length === 0) {
    return introFallback(recipe.description, RECIPE_DESCRIPTION_MAX);
  }
  const shown = platforms.slice(0, 3);
  const platformList =
    platforms.length > 3
      ? `${shown.join(", ")} and more`
      : shown.length === 1
        ? shown[0]
        : `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}`;
  const songPart = join(song.title, recipePart(recipe).toLowerCase());
  const tail = `on ${platformList}: ${article(amp)} ${amp}, exact settings`;
  const band = recipeBand(song, artist);
  // Band first, with the guitarist where it fits:
  // "Pink Floyd's Comfortably Numb solo tone, played by David Gilmour, on ..."
  const leads = band
    ? [
        `${possessive(band)} ${songPart} tone, played by ${artist.name}, ${tail}`,
        `${possessive(band)} ${songPart} tone ${tail}`,
      ]
    : [`${possessive(artist.name)} ${songPart} tone ${tail}`];
  // Keeping a name beats keeping "and the full signal chain".
  for (const lead of leads) {
    for (const text of [`${lead} and the full signal chain.`, `${lead}.`]) {
      if (text.length <= RECIPE_DESCRIPTION_MAX) return text;
    }
  }
  return introFallback(recipe.description, RECIPE_DESCRIPTION_MAX);
}
