"use client";

import { useState, useEffect, useCallback } from "react";
import StarRating from "@/components/community/StarRating";
import CommentSection from "@/components/community/CommentSection";
import { getRatingStats, getUserRating, rateRecipe } from "@/lib/db/ratings";
import { useAuth } from "@/lib/auth/auth-context";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import type { RatingStats } from "@/types/community";

interface RecipeInteractionsProps {
  recipeSlug: string;
}

export default function RecipeInteractions({ recipeSlug }: RecipeInteractionsProps) {
  const { user } = useAuth();
  const recordView = useRecentlyViewedStore((s) => s.record);
  const [stats, setStats] = useState<RatingStats>({
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(true);

  // Record this recipe in the recently-viewed store (dashboard reads this)
  useEffect(() => {
    if (recipeSlug) recordView(recipeSlug);
  }, [recipeSlug, recordView]);

  const loadRatings = useCallback(async () => {
    try {
      const [statsData, userRatingData] = await Promise.all([
        getRatingStats(recipeSlug),
        user ? getUserRating(recipeSlug, user.id) : Promise.resolve(null),
      ]);
      setStats(statsData);
      setUserRating(userRatingData);
    } catch {
      // silently fail
    } finally {
      setRatingLoading(false);
    }
  }, [recipeSlug, user]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleRate = async (rating: number) => {
    if (!user) return;
    setUserRating(rating);
    const success = await rateRecipe(recipeSlug, user.id, rating);
    if (success) {
      // Reload stats to get updated average
      const newStats = await getRatingStats(recipeSlug);
      setStats(newStats);
    }
  };

  return (
    <div className="mt-12 space-y-10">
      {/* Rating section */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Rate This Tone</h2>
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            {/* Overall rating display */}
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">
                {ratingLoading ? "..." : stats.average.toFixed(1)}
              </p>
              <StarRating
                rating={stats.average}
                size="md"
                showCount
                count={stats.count}
              />
            </div>

            {/* User rating */}
            <div className="flex-1">
              {user ? (
                <div>
                  <p className="mb-2 text-sm text-muted">
                    {userRating ? "Your rating:" : "Rate this recipe:"}
                  </p>
                  <StarRating
                    rating={userRating ?? 0}
                    size="lg"
                    interactive
                    onRate={handleRate}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted">
                  <a href="/login" className="text-accent hover:underline">
                    Sign in
                  </a>{" "}
                  to rate this recipe.
                </p>
              )}
            </div>

            {/* Distribution bars */}
            {stats.count > 0 && (
              <div className="w-full max-w-[200px] space-y-1">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const pct =
                    stats.count > 0
                      ? (stats.distribution[star] / stats.count) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted">{star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-muted">
                        {stats.distribution[star]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comments section */}
      <section>
        <CommentSection recipeSlug={recipeSlug} />
      </section>
    </div>
  );
}
