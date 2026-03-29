/**
 * Affiliate Gear Mapping
 *
 * This file maps every piece of gear to the recipes it appears in.
 * It dynamically builds the mapping from the actual recipe and gear data,
 * so when new recipes are added the mapping updates automatically.
 *
 * When affiliate tags are activated in affiliate.ts, every gear mention
 * becomes a revenue link through the existing getAffiliateLinks() function.
 *
 * Use getTopAffiliateGear() to prioritize which products to set up first —
 * gear that appears in the most recipes has the highest revenue potential.
 *
 * Use getRecipeGearForAffiliate() to power the "Complete This Rig" sidebar
 * feature, showing all gear for a given recipe with affiliate links.
 */

import {
  toneRecipes,
  songs,
  artists,
  gearItems,
} from "@/lib/data";
import { hasAffiliateProgram } from "@/lib/affiliate";
import type { GearItem, ToneRecipe } from "@/types/recipe";

export interface AffiliateGearMapping {
  gearName: string;
  gearSlug: string;
  manufacturer: string;
  type: "guitar" | "effect" | "amp" | "cabinet" | "microphone";
  usedInRecipes: Array<{
    recipeSlug: string;
    recipeName: string;
    artist: string;
  }>;
  affiliateReady: boolean;
  estimatedSearchQuery: string;
}

// Map signal-chain categories to GearItem types
function categoryToGearType(
  category: string
): "guitar" | "effect" | "amp" | "cabinet" | "microphone" {
  switch (category) {
    case "guitar":
      return "guitar";
    case "effect":
    case "wet_effect":
      return "effect";
    case "preamp":
    case "power_amp":
      return "amp";
    case "cabinet":
      return "cabinet";
    case "microphone":
      return "microphone";
    default:
      return "effect";
  }
}

/** Look up the artist name for a recipe via its song_slug */
function getArtistForRecipe(recipe: ToneRecipe): string {
  const song = songs.find((s) => s.slug === recipe.song_slug);
  if (!song) return "Unknown";
  const artist = artists.find((a) => a.slug === song.artist_slug);
  return artist?.name ?? "Unknown";
}

/** Build a search query a shopper would type on a retailer site */
function buildSearchQuery(gear: GearItem): string {
  return `${gear.manufacturer} ${gear.name}`.trim();
}

/**
 * Auto-generated mapping from recipe data.
 * Scans every recipe's signal chain, groups gear by slug, and attaches
 * the list of recipes each piece of gear appears in.
 */
export function getAffiliateGearMap(): AffiliateGearMapping[] {
  const map = new Map<
    string,
    {
      gear: GearItem;
      recipes: Map<string, { recipeSlug: string; recipeName: string; artist: string }>;
    }
  >();

  for (const recipe of toneRecipes) {
    const artist = getArtistForRecipe(recipe);

    for (const node of recipe.signal_chain) {
      if (!node.gear_slug) continue;

      const gear = gearItems.find((g) => g.slug === node.gear_slug);
      if (!gear) continue;

      if (!map.has(gear.slug)) {
        map.set(gear.slug, { gear, recipes: new Map() });
      }

      const entry = map.get(gear.slug)!;
      // Deduplicate by recipe slug (a gear might appear in multiple chain
      // positions of the same recipe, but we only list the recipe once)
      if (!entry.recipes.has(recipe.slug)) {
        entry.recipes.set(recipe.slug, {
          recipeSlug: recipe.slug,
          recipeName: recipe.title,
          artist,
        });
      }
    }
  }

  const affiliateReady = hasAffiliateProgram();

  return Array.from(map.values()).map(({ gear, recipes }) => ({
    gearName: gear.name,
    gearSlug: gear.slug,
    manufacturer: gear.manufacturer,
    type: gear.type,
    usedInRecipes: Array.from(recipes.values()),
    affiliateReady,
    estimatedSearchQuery: buildSearchQuery(gear),
  }));
}

/**
 * Get all gear for a specific recipe (for the "Complete This Rig" sidebar).
 * Returns one entry per unique gear piece in the recipe's signal chain.
 */
export function getRecipeGearForAffiliate(
  recipeSlug: string
): AffiliateGearMapping[] {
  const recipe = toneRecipes.find((r) => r.slug === recipeSlug);
  if (!recipe) return [];

  const fullMap = getAffiliateGearMap();
  const seen = new Set<string>();
  const result: AffiliateGearMapping[] = [];

  for (const node of recipe.signal_chain) {
    if (!node.gear_slug || seen.has(node.gear_slug)) continue;
    seen.add(node.gear_slug);

    const mapping = fullMap.find((m) => m.gearSlug === node.gear_slug);
    if (mapping) {
      result.push(mapping);
    }
  }

  return result;
}

/**
 * Get the top gear items sorted by how many recipes reference them.
 * The more recipes a piece of gear appears in, the higher the potential
 * click-through volume for affiliate links.
 */
export function getTopAffiliateGear(limit = 20): AffiliateGearMapping[] {
  return getAffiliateGearMap()
    .sort((a, b) => b.usedInRecipes.length - a.usedInRecipes.length)
    .slice(0, limit);
}
