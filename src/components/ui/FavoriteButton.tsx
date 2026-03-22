"use client";

import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/lib/stores/favorites-store";

interface FavoriteButtonProps {
  slug: string;
  /** "sm" for cards, "md" for detail pages */
  size?: "sm" | "md";
  className?: string;
}

export default function FavoriteButton({
  slug,
  size = "sm",
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrate } = useFavoritesStore();
  const [hydrated, setHydrated] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  const favorited = hydrated && isFavorite(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleFavorite(slug);
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSize = size === "md" ? "h-6 w-6" : "h-4 w-4";
  const buttonSize =
    size === "md"
      ? "h-10 w-10 rounded-lg"
      : "h-7 w-7 rounded-md";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? "Remove from saved" : "Save recipe"}
      className={`flex items-center justify-center border transition-all ${
        favorited
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border bg-surface text-muted hover:text-accent hover:border-accent/40"
      } ${buttonSize} ${animating ? "scale-125" : "scale-100"} ${className}`}
      style={{ transition: "transform 0.2s ease, color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease" }}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      </svg>
    </button>
  );
}
