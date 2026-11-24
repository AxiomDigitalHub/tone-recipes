import type { Artist, Song, ToneRecipe } from "@/types/recipe";

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

/** The ordered title candidates, before the length check. */
export function recipeSeoTitleCandidates(
  recipe: ToneRecipe,
  song: Pick<Song, "title"> | undefined,
  artist: Pick<Artist, "name"> | undefined,
): string[] {
  if (!song) return [recipe.title];
  const preset = recipe.platform_translations?.helix ? "Helix Preset" : "Preset";
  const head = `${join(song.title, recipePart(recipe))} Guitar Tone`;
  const list: string[] = [];
  if (artist) {
    list.push(`${head} (${artist.name}): ${preset} and Settings`);
    list.push(`${head} (${artist.name}): ${preset}`);
  }
  list.push(`${head}: ${preset} and Settings`);
  list.push(`${head}: ${preset}`);
  list.push(recipe.title);
  return list;
}

/** First candidate that fits in RECIPE_TITLE_MAX; else the recipe name. */
export function recipeSeoTitle(
  recipe: ToneRecipe,
  song: Pick<Song, "title"> | undefined,
  artist: Pick<Artist, "name"> | undefined,
): string {
  const list = recipeSeoTitleCandidates(recipe, song, artist);
  return list.find((c) => c.length <= RECIPE_TITLE_MAX) ?? recipe.title;
}

/**
 * The two lines of the H1: the song as the large line, then
 * "by {Artist}: {part} tone recipe" ("guitar" for a full-song recipe).
 */
export function recipeH1(
  recipe: ToneRecipe,
  song: Pick<Song, "title"> | undefined,
  artist: Pick<Artist, "name"> | undefined,
): { main: string; sub: string } {
  const part = recipePart(recipe).toLowerCase() || "guitar";
  const main = song?.title ?? recipe.title;
  const sub = artist ? `by ${artist.name}: ${part} tone recipe` : `${part} tone recipe`;
  return { main, sub };
}

/** H1 as one plain string, for audits. */
export function recipeH1Text(
  recipe: ToneRecipe,
  song: Pick<Song, "title"> | undefined,
  artist: Pick<Artist, "name"> | undefined,
): string {
  const { main, sub } = recipeH1(recipe, song, artist);
  return artist ? `${main} ${sub}` : `${main}: ${sub}`;
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
  song: Pick<Song, "title"> | undefined,
  artist: Pick<Artist, "name"> | undefined,
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
  const part = recipePart(recipe).toLowerCase();
  const lead = `${artist.name}'s ${join(song.title, part)} tone on ${platformList}: ${article(amp)} ${amp}, exact settings`;
  const full = `${lead} and the full signal chain.`;
  if (full.length <= RECIPE_DESCRIPTION_MAX) return full;
  const short = `${lead}.`;
  if (short.length <= RECIPE_DESCRIPTION_MAX) return short;
  return introFallback(recipe.description, RECIPE_DESCRIPTION_MAX);
}
