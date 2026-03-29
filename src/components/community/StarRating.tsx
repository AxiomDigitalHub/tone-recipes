"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
  showAverage?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const SIZES: Record<"sm" | "md" | "lg", number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRate,
  showCount = false,
  count = 0,
  showAverage = false,
}: StarRatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const iconSize = SIZES[size];

  const displayRating = hoverIndex !== null ? hoverIndex : rating;

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (interactive) setHoverIndex(index);
    },
    [interactive],
  );

  const handleMouseLeave = useCallback(() => {
    if (interactive) setHoverIndex(null);
  }, [interactive]);

  const handleClick = useCallback(
    (index: number) => {
      if (interactive && onRate) onRate(index);
    },
    [interactive, onRate],
  );

  const textSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center gap-1">
      <div
        className="inline-flex items-center"
        onMouseLeave={handleMouseLeave}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const starIndex = i + 1;
          const fillPercentage = getFillPercentage(displayRating, starIndex);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onClick={() => handleClick(starIndex)}
              className={`inline-flex items-center justify-center p-0 border-0 bg-transparent ${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform"
                  : "cursor-default"
              }`}
              aria-label={`${starIndex} star${starIndex !== 1 ? "s" : ""}`}
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? starIndex === Math.round(rating) : undefined}
            >
              <StarIcon
                size={iconSize}
                fillPercentage={fillPercentage}
                interactive={interactive}
                isHovered={hoverIndex !== null && starIndex <= hoverIndex}
              />
            </button>
          );
        })}
      </div>

      {(showAverage || showCount) && (
        <span className={`${textSize} text-muted ml-1`}>
          {showAverage && showCount
            ? `(${rating.toFixed(1)} / ${count.toLocaleString()} rating${count !== 1 ? "s" : ""})`
            : showAverage
              ? `(${rating.toFixed(1)})`
              : `(${count.toLocaleString()} rating${count !== 1 ? "s" : ""})`}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getFillPercentage(rating: number, starIndex: number): number {
  if (rating >= starIndex) return 100;
  if (rating >= starIndex - 1) {
    return Math.round((rating - (starIndex - 1)) * 100);
  }
  return 0;
}

/* -------------------------------------------------------------------------- */
/*  Star SVG with partial fill support                                        */
/* -------------------------------------------------------------------------- */

function StarIcon({
  size,
  fillPercentage,
  interactive,
  isHovered,
}: {
  size: number;
  fillPercentage: number;
  interactive: boolean;
  isHovered: boolean;
}) {
  // Full or empty — use simple lucide icon
  if (fillPercentage === 100) {
    return (
      <Star
        size={size}
        className={`${isHovered && interactive ? "text-yellow-400" : "text-yellow-500"} fill-current`}
      />
    );
  }

  if (fillPercentage === 0) {
    return (
      <Star
        size={size}
        className="text-muted"
        strokeWidth={1.5}
      />
    );
  }

  // Partial fill — use a clip-path gradient
  const id = `star-grad-${size}-${fillPercentage}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercentage}%`} stopColor="#eab308" />
          <stop offset={`${fillPercentage}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted"
      />
    </svg>
  );
}
