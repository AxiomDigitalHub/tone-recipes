"use client";

import { useEffect, useState } from "react";
import PresetDownloadButton from "@/components/recipe/PresetDownloadButton";

interface Props {
  slug: string;
  /** Active platform id (e.g. "helix", "katana"). */
  platform: string;
}

/**
 * Floating "Download" chip that appears once the user scrolls past the
 * platform-switcher row, so the preset is always one click away on
 * long recipe pages. Fixed bottom-right on desktop, full-width pinned
 * bottom on mobile. Hidden for platforms without a downloadable preset.
 *
 * Uses an IntersectionObserver on `#recipe-platform-switcher` so the
 * chip only shows when the in-page button is offscreen.
 */
export default function RecipeDownloadChip({ slug, platform }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("recipe-platform-switcher");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const downloadable =
    platform === "helix" || platform === "quad_cortex" || platform === "katana";
  if (!downloadable) return null;

  return (
    <div
      className={`recipe-dl-chip ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <PresetDownloadButton
        recipeSlug={slug}
        platform={platform}
        source="floating_chip"
        className="recipe-dl-chip-btn"
      />
    </div>
  );
}
