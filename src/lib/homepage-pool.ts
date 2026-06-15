import { getRecipeBySlug } from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";

// ---------------------------------------------------------------------------
// Homepage flagship pool
//
// Curated set of recipes eligible to appear on the homepage hero + "opening
// shelf". Every entry has album art and a complete signal chain, and the list
// holds one iconic recipe per artist spread across eras and genres — so any
// random draw feels varied. The homepage rotates within this pool on each ISR
// regeneration (see `revalidate` in src/app/page.tsx).
//
// To change what can be featured, edit this list. Keep it to recipes whose song
// has album art, or the LP rack art will look broken.
// ---------------------------------------------------------------------------
export const HOMEPAGE_FLAGSHIP_POOL: string[] = [
  // Blues / Texas
  "srv-pride-and-joy-rhythm", // Stevie Ray Vaughan
  "bb-king-thrill-is-gone", // B.B. King
  "clapton-layla-lead", // Eric Clapton
  "bonamassa-sloe-gin-blues-rock-lead", // Joe Bonamassa
  "gary-clark-bright-lights-modern-blues", // Gary Clark Jr.
  // Classic rock
  "gilmour-comfortably-numb-solo", // Pink Floyd
  "page-stairway-to-heaven-clean-build", // Led Zeppelin
  "hendrix-voodoo-child-wah", // Jimi Hendrix
  "blackmore-smoke-on-the-water-riff", // Deep Purple
  "felder-hotel-california-solo", // Eagles
  "knopfler-sultans-of-swing-clean", // Dire Straits
  "brian-may-bohemian-rhapsody", // Queen
  "lifeson-tom-sawyer-chorus", // Rush
  "scholz-more-than-a-feeling-riff", // Boston
  "richards-start-me-up-open-g", // Rolling Stones
  "santana-smooth-lead", // Santana
  // Hard rock / metal
  "evh-eruption-brown-sound", // Van Halen
  "hetfield-master-of-puppets-rhythm", // Metallica
  "rhoads-crazy-train-lead", // Randy Rhoads / Ozzy
  "iommi-iron-man-doom-riff", // Black Sabbath
  "slash-sweet-child-o-mine-lead", // Guns N' Roses
  "angus-young-back-in-black-rhythm", // AC/DC
  "dimebag-cemetery-gates-clean-to-crushing", // Pantera
  "tipton-painkiller-speed-metal", // Judas Priest
  "morello-killing-in-the-name", // Rage Against the Machine
  // Alt / modern
  "cobain-teen-spirit-grunge", // Nirvana
  "frusciante-under-the-bridge-clean", // Red Hot Chili Peppers
  "mccready-even-flow-solo", // Pearl Jam
  "jack-white-seven-nation-army", // The White Stripes
  "marr-this-charming-man-jangle", // The Smiths
  "edge-where-the-streets-have-no-name", // U2
  "gallagher-wonderwall-jangly-rhythm", // Oasis
  "turner-do-i-wanna-know-fuzzy-riff", // Arctic Monkeys
  // Virtuoso / modern lead
  "satriani-surfing-with-the-alien-lead", // Joe Satriani
  "mayer-slow-dancing-burning-room", // John Mayer
];

// Resolve the pool to real recipes once, dropping any slug that no longer
// exists so a typo here can never crash the homepage.
const POOL_RECIPES: ToneRecipe[] = HOMEPAGE_FLAGSHIP_POOL.map((slug) =>
  getRecipeBySlug(slug),
).filter((r): r is ToneRecipe => Boolean(r));

// Fisher–Yates shuffle over a copy, so the source array is never mutated.
function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick the recipes shown on the homepage for one render. Returns a flagship
 * `hero` plus a `shelf` of `shelfCount` distinct recipes drawn from the same
 * pool. Called per ISR regeneration, so the selection rotates over time while
 * each cached version stays stable.
 */
export function pickHomepageRecipes(shelfCount = 8): {
  hero: ToneRecipe | undefined;
  shelf: ToneRecipe[];
} {
  const shuffled = shuffle(POOL_RECIPES);
  const hero = shuffled[0];
  const shelf = shuffled.slice(1, 1 + shelfCount);
  return { hero, shelf };
}
