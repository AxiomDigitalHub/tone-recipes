import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import type { RecipeRating, RatingStats } from "@/types/community";

/**
 * Untyped browser client for recipe_ratings table that isn't in the
 * generated Database schema yet.
 */
let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

/* -------------------------------------------------------------------------- */
/*  Rating Stats                                                              */
/* -------------------------------------------------------------------------- */

export async function getRatingStats(
  recipeSlug: string,
): Promise<RatingStats> {
  const empty: RatingStats = {
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  if (!isSupabaseConfigured()) return empty;

  const supabase = getClient();
  const { data, error } = await supabase
    .from("recipe_ratings")
    .select("rating")
    .eq("recipe_slug", recipeSlug);

  if (error || !data || data.length === 0) return empty;

  const rows = data as Pick<RecipeRating, "rating">[];
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let sum = 0;
  for (const row of rows) {
    const r = row.rating as 1 | 2 | 3 | 4 | 5;
    distribution[r] = (distribution[r] ?? 0) + 1;
    sum += row.rating;
  }

  return {
    average: sum / rows.length,
    count: rows.length,
    distribution,
  };
}

/* -------------------------------------------------------------------------- */
/*  User Rating                                                               */
/* -------------------------------------------------------------------------- */

export async function getUserRating(
  recipeSlug: string,
  userId: string,
): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();
  const { data, error } = await supabase
    .from("recipe_ratings")
    .select("rating")
    .eq("recipe_slug", recipeSlug)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return (data as Pick<RecipeRating, "rating">).rating;
}

/* -------------------------------------------------------------------------- */
/*  Rate Recipe                                                               */
/* -------------------------------------------------------------------------- */

export async function rateRecipe(
  recipeSlug: string,
  userId: string,
  rating: number,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("recipe_ratings") as any)
    .upsert(
      { recipe_slug: recipeSlug, user_id: userId, rating },
      { onConflict: "recipe_slug,user_id" },
    );

  return !error;
}
