import type { ToneRecipe } from "@/types/recipe";
import { getSongBySlug } from "@/lib/data";

/**
 * Rules-based "tone personality" classification based on a user's saved recipes.
 *
 * Inspired by Spotify's listener archetypes. Gives the dashboard greeting a
 * touch of personalization ("Good evening, Dan — you're a Worship Driver")
 * without requiring any ML.
 *
 * The classification is cheap and deterministic: it looks at the genre tags
 * and signal chain characteristics of the user's saved recipes and picks
 * the closest archetype.
 */

export interface TonePersonality {
  id: string;
  label: string;
  description: string;
}

const PERSONALITIES: TonePersonality[] = [
  {
    id: "worship_driver",
    label: "Worship Driver",
    description: "Ambient cleans, dotted delays, Klon on top",
  },
  {
    id: "classic_rocker",
    label: "Classic Rocker",
    description: "Marshall crunch and fuzz, vintage feel",
  },
  {
    id: "blues_purist",
    label: "Blues Purist",
    description: "Fender chime and a Tube Screamer at the edge of breakup",
  },
  {
    id: "metal_head",
    label: "Metal Head",
    description: "High gain, tight low end, aggressive mids",
  },
  {
    id: "ambient_shoegazer",
    label: "Ambient Shoegazer",
    description: "Reverb-drenched, fuzz, walls of sound",
  },
  {
    id: "clean_session",
    label: "Clean Session Player",
    description: "Compressed, articulate, always in the mix",
  },
  {
    id: "tone_tourist",
    label: "Tone Tourist",
    description: "Genre-curious — you try everything",
  },
];

const FALLBACK: TonePersonality = {
  id: "new_arrival",
  label: "New Arrival",
  description: "Save a few recipes to unlock your tone personality",
};

/**
 * Score the user's saved recipes across genre/tonal dimensions and return
 * the personality with the highest score. If fewer than 3 saves, return
 * the "new arrival" fallback so the user sees something encouraging.
 */
export function classifyTonePersonality(
  savedRecipes: ToneRecipe[],
): TonePersonality {
  if (savedRecipes.length < 3) return FALLBACK;

  // Tally genre tags and tonal characteristics
  const scores: Record<string, number> = {
    worship_driver: 0,
    classic_rocker: 0,
    blues_purist: 0,
    metal_head: 0,
    ambient_shoegazer: 0,
    clean_session: 0,
  };

  for (const recipe of savedRecipes) {
    const song = getSongBySlug(recipe.song_slug);
    const genres = (song?.genres ?? []).map((g) => g.toLowerCase());
    const tags = (recipe.tags ?? []).map((t) => t.toLowerCase());
    const allTags = [...genres, ...tags];

    // Genre-driven scoring
    if (allTags.some((t) => t.includes("worship"))) scores.worship_driver += 3;
    if (allTags.some((t) => t.includes("classic-rock") || t.includes("classic rock"))) {
      scores.classic_rocker += 3;
    }
    if (allTags.some((t) => t.includes("blues"))) scores.blues_purist += 3;
    if (allTags.some((t) => t.includes("metal") || t.includes("hardcore"))) {
      scores.metal_head += 3;
    }
    if (allTags.some((t) => t.includes("shoegaze") || t.includes("post-rock") || t.includes("ambient"))) {
      scores.ambient_shoegazer += 3;
    }
    if (allTags.some((t) => t.includes("country") || t.includes("session") || t.includes("nashville") || t.includes("pop"))) {
      scores.clean_session += 2;
    }

    // Signal chain characteristics — look at amp and effect types
    const chainText = recipe.signal_chain
      .map((n) => `${n.gear_name} ${n.subcategory ?? ""}`)
      .join(" ")
      .toLowerCase();

    if (chainText.includes("ac30") || chainText.includes("essex") || chainText.includes("matchless")) {
      scores.worship_driver += 1;
    }
    if (chainText.includes("plexi") || chainText.includes("jcm") || chainText.includes("marshall")) {
      scores.classic_rocker += 1;
    }
    if (chainText.includes("tweed") || chainText.includes("deluxe") || chainText.includes("fender")) {
      if (chainText.includes("screamer") || chainText.includes("klon") || chainText.includes("blues")) {
        scores.blues_purist += 1;
      }
    }
    if (chainText.includes("rectifier") || chainText.includes("5150") || chainText.includes("mesa")) {
      scores.metal_head += 1;
    }
    if (chainText.includes("shimmer") || chainText.includes("fuzz")) {
      if (chainText.includes("reverb")) scores.ambient_shoegazer += 1;
    }
    if (chainText.includes("compressor") && !chainText.includes("drive")) {
      scores.clean_session += 1;
    }
  }

  // Find the highest-scoring personality
  let best: { id: string; score: number } = { id: "", score: 0 };
  for (const [id, score] of Object.entries(scores)) {
    if (score > best.score) best = { id, score };
  }

  // If there's no clear winner (all tied at 0 or very close), return "Tone Tourist"
  if (best.score === 0) {
    return PERSONALITIES.find((p) => p.id === "tone_tourist") ?? FALLBACK;
  }

  // If the top two scores are within 1 point and both have activity, they're curious
  const sorted = Object.values(scores).sort((a, b) => b - a);
  if (sorted[0] - sorted[1] <= 1 && sorted[1] > 2) {
    return PERSONALITIES.find((p) => p.id === "tone_tourist") ?? FALLBACK;
  }

  return PERSONALITIES.find((p) => p.id === best.id) ?? FALLBACK;
}

/** Time-of-day greeting based on local time */
export function getTimeGreeting(): string {
  if (typeof window === "undefined") return "Welcome back";
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
