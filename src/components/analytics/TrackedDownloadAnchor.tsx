"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/analytics";

interface TrackedDownloadAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  recipeSlug: string;
  format: string;
  source: string;
  children: ReactNode;
}

/**
 * Plain anchor for direct file downloads (preset .hlx/.tsl). Fires
 * `recipe_download_click` so funnel analytics see preset pulls without
 * the user navigating away through next/link.
 */
export default function TrackedDownloadAnchor({
  recipeSlug,
  format,
  source,
  children,
  onClick,
  ...rest
}: TrackedDownloadAnchorProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track("recipe_download_click", {
          recipe_slug: recipeSlug,
          format,
          source,
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
