"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  /** Active platform id (e.g. "helix", "katana"). */
  platform: string;
}

/**
 * Floating "Download" chip that appears once the user scrolls past the
 * platform-switcher row, so the preset is always one click away on
 * long recipe pages. Fixed bottom-right on desktop, full-width pinned
 * bottom on mobile. Shows the .hlx / .tsl link for the active
 * platform; for unsupported platforms we hide the chip entirely.
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

  let presetHref: string | null = null;
  let presetLabel: string | null = null;
  if (platform === "helix") {
    presetHref = `/presets/${slug}.hlx`;
    presetLabel = "Download .hlx";
  } else if (platform === "katana") {
    presetHref = `/presets/${slug}.tsl`;
    presetLabel = "Download .tsl";
  }

  if (!presetHref) return null;

  return (
    <div
      className={`recipe-dl-chip ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <a href={presetHref} download className="recipe-dl-chip-btn">
        {presetLabel} ↓
      </a>
    </div>
  );
}
