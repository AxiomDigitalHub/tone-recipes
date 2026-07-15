import { toneRecipes, songs, artists } from "@/lib/data";
import type { ToneRecipe, Platform, SignalChainNode } from "@/types/recipe";

/**
 * Lightweight keyword retrieval over the static recipe corpus for the
 * Tone Chat assistant. No vector DB — 105 recipes score in well under a
 * millisecond, and the corpus ships in the bundle anyway.
 *
 * Two outputs:
 *   - buildCatalog(): a compact one-line-per-recipe index that lives in
 *     the system prompt so the model knows what exists and can link to
 *     recipe pages (/recipe/<slug>).
 *   - retrieveRecipes(query): the top-N full recipes serialized for the
 *     model to ground its answer in actual settings.
 */

const songBySlug = new Map(songs.map((s) => [s.slug, s]));
const artistBySlug = new Map(artists.map((a) => [a.slug, a]));

interface IndexedRecipe {
  recipe: ToneRecipe;
  /** Pre-tokenized searchable fields with weights. */
  fields: { tokens: Set<string>; weight: number }[];
  artistName: string;
  songTitle: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/[\s/-]+/)
    .filter((t) => t.length > 1);
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "how", "get", "that", "this", "what",
  "tone", "sound", "guitar", "like", "want", "can", "you", "your", "from",
  "have", "need", "use", "using", "settings", "preset", "patch", "amp",
  "on", "in", "of", "to", "my", "me", "it", "is", "an", "do", "does",
]);

let index: IndexedRecipe[] | null = null;

function buildIndex(): IndexedRecipe[] {
  if (index) return index;
  index = toneRecipes.map((recipe) => {
    const song = songBySlug.get(recipe.song_slug);
    const artist = song ? artistBySlug.get(song.artist_slug) : undefined;
    const artistName = artist?.name ?? "";
    const songTitle = song?.title ?? "";
    const gearNames = recipe.signal_chain.map((n) => n.gear_name).join(" ");
    const genres = [...(song?.genres ?? []), ...(artist?.genres ?? [])].join(" ");

    return {
      recipe,
      artistName,
      songTitle,
      fields: [
        { tokens: new Set(tokenize(`${artistName} ${songTitle} ${recipe.title}`)), weight: 4 },
        { tokens: new Set(tokenize(recipe.tags.join(" "))), weight: 3 },
        { tokens: new Set(tokenize(`${gearNames} ${genres}`)), weight: 2 },
        { tokens: new Set(tokenize(`${recipe.description} ${recipe.tone_context}`)), weight: 1 },
      ],
    };
  });
  return index;
}

export interface RetrievedRecipe {
  recipe: ToneRecipe;
  artistName: string;
  songTitle: string;
  score: number;
}

export function retrieveRecipes(query: string, limit = 4): RetrievedRecipe[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
  if (queryTokens.length === 0) return [];

  const scored: RetrievedRecipe[] = [];
  for (const entry of buildIndex()) {
    let score = 0;
    for (const token of queryTokens) {
      for (const field of entry.fields) {
        if (field.tokens.has(token)) score += field.weight;
      }
    }
    if (score > 0) {
      scored.push({
        recipe: entry.recipe,
        artistName: entry.artistName,
        songTitle: entry.songTitle,
        score,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** One line per recipe — lives in the system prompt (~3K tokens). */
export function buildCatalog(): string {
  return buildIndex()
    .map(({ recipe, artistName, songTitle }) => {
      const platforms = Object.keys(recipe.platform_translations).join(",");
      return `- ${artistName} — ${songTitle} (${recipe.title}) | /recipe/${recipe.slug} | platforms: ${platforms}`;
    })
    .join("\n");
}

function serializeNode(node: SignalChainNode): string {
  const settings = Object.entries(node.settings)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  const loop = node.is_in_effects_loop ? " [fx loop]" : "";
  return `  ${node.position}. ${node.gear_name} (${node.category}${loop})${settings ? ` — ${settings}` : ""}${node.notes ? ` | ${node.notes}` : ""}`;
}

/**
 * Detect modeler platforms the user is actually talking about, so the
 * excerpt carries the translation for the platform they ASKED about —
 * not just the one on their profile. This is the fix for Axl improvising
 * (and flubbing) Helix block names when a Katana player asks a Helix
 * question: if we have verified settings, they go in the context.
 */
const PLATFORM_KEYWORDS: [RegExp, Platform][] = [
  [/\bhelix\b|\bhx\s?(stomp|effects)?\b|\bpod\s?go\b/i, "helix"],
  [/\bquad\s?cortex\b|\bqc\b/i, "quad_cortex"],
  [/\btonex\b/i, "tonex"],
  [/\bfractal\b|\baxe[\s-]?fx\b|\bfm[39]\b/i, "fractal"],
  [/\bkemper\b|\bprofiler\b/i, "kemper"],
  [/\bkatana\b/i, "katana"],
  [/\bpedal\s?board\b|\breal\s+pedals\b/i, "pedalboard"],
];

export function detectPlatformMentions(text: string): Platform[] {
  return PLATFORM_KEYWORDS.filter(([re]) => re.test(text)).map(([, p]) => p);
}

/**
 * Serialize a recipe for model context. Includes the original signal
 * chain always, plus the translation for every requested platform we
 * have (asked-about platforms first, then the user's own rig — the
 * route dedupes). Falls back to listing available platforms.
 */
export function serializeRecipe(r: RetrievedRecipe, platforms: Platform[] = []): string {
  const { recipe } = r;
  const lines: string[] = [
    `### ${r.artistName} — ${r.songTitle}: ${recipe.title}`,
    `Page: /recipe/${recipe.slug}`,
    recipe.description,
    recipe.tone_context ? `Context: ${recipe.tone_context}` : "",
    `Guitar: ${recipe.guitar_specs.model_name} (${recipe.guitar_specs.pickup_config}, ${recipe.guitar_specs.pickup_position})`,
    `Original rig: ${recipe.original_gear.guitar} → ${recipe.original_gear.effects.join(" → ")} → ${recipe.original_gear.amp} (${recipe.original_gear.cabinet})`,
    `Signal chain:`,
    ...recipe.signal_chain.map(serializeNode),
  ];

  const available = Object.keys(recipe.platform_translations) as Platform[];
  const chosen = platforms.filter((p) => recipe.platform_translations[p]);
  for (const p of chosen) {
    const t = recipe.platform_translations[p]!;
    lines.push(`${p} translation (verified — use these exact block names/settings):`);
    for (const block of t.chain_blocks) {
      const settings = Object.entries(block.settings)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      lines.push(
        `  ${block.position}. ${block.block_name} (for ${block.original_gear})${block.enabled === false ? " [bypassed by default]" : ""}${settings ? ` — ${settings}` : ""}${block.notes ? ` | ${block.notes}` : ""}`,
      );
    }
    if (t.notes) lines.push(`  Notes: ${t.notes}`);
  }

  const rest = available.filter((p) => !chosen.includes(p));
  if (rest.length > 0) {
    lines.push(
      `Other platform translations available: ${rest.join(", ")} (full settings on the recipe page — don't guess block names for these; link the page instead)`,
    );
  }

  return lines.filter(Boolean).join("\n");
}
