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
  /**
   * Server-fetched rating stats. When provided, the component renders the
   * real average/count/distribution in the initial (server) HTML so the
   * visible stars match the JSON-LD AggregateRating. The client still
   * refreshes after mount to pick up the signed-in user's own rating and any
   * freshly-cast votes.
   */
  initialStats?: RatingStats;
}

const EMPTY_STATS: RatingStats = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export default function RecipeInteractions({
  recipeSlug,
  initialStats,
}: RecipeInteractionsProps) {
  const { user } = useAuth();
  const recordView = useRecentlyViewedStore((s) => s.record);
  const [stats, setStats] = useState<RatingStats>(initialStats ?? EMPTY_STATS);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(!initialStats);

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
    <div className="recipe-feedback fkp-feedback">
      {/* Rating section */}
      <section className="fkp-feedback-section">
        <h2 className="fk-t2">Rate this tone</h2>
        <div className="fk-tile fkp-rating">
          {/* Overall rating display */}
          <div className="fkp-rating-overall">
            <p className="fkp-rating-num">
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
          <div className="fkp-rating-user">
            {user ? (
              <div>
                <p className="fk-body-sm">
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
              <p className="fk-body-sm">
                <a href="/login" className="fk-link">
                  Sign in
                </a>{" "}
                to rate this recipe.
              </p>
            )}
          </div>

          {/* Distribution bars */}
          {stats.count > 0 && (
            <div className="fkp-rating-dist">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const pct =
                  stats.count > 0
                    ? (stats.distribution[star] / stats.count) * 100
                    : 0;
                return (
                  <div key={star} className="fkp-rating-row">
                    <span className="fk-data fkp-rating-star">{star}</span>
                    <div className="fkp-rating-bar">
                      <div style={{ width: `${pct}%` }} />
                    </div>
                    <span className="fk-data fkp-rating-n">
                      {stats.distribution[star]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comments section */}
      <section className="fkp-feedback-section">
        <CommentSection recipeSlug={recipeSlug} />
      </section>
    </div>
  );
}
