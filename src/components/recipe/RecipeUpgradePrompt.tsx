"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { track } from "@/lib/analytics";

interface RecipeUpgradePromptProps {
  recipeSlug: string;
}

/**
 * Inline upsell shown directly under the platform-switcher on recipe
 * pages. Visible only to authenticated users on the free plan — anonymous
 * visitors don't see it (we want them to engage first), and Tone Pass / Pro
 * users have already converted. Recipe pages stay free + indexable; this
 * just makes the upgrade path visible without forcing it.
 */
export default function RecipeUpgradePrompt({
  recipeSlug,
}: RecipeUpgradePromptProps) {
  const { user } = useAuth();
  const fired = useRef(false);

  const visible = Boolean(user) && user?.role === "free";

  useEffect(() => {
    if (visible && !fired.current) {
      fired.current = true;
      track("upgrade_prompt_view", { recipe_slug: recipeSlug });
    }
  }, [visible, recipeSlug]);

  if (!visible) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
      <p className="text-foreground">
        <span className="font-semibold">Want the .hlx file?</span>{" "}
        <span className="text-muted">
          Tone Pass unlocks every preset download.
        </span>
      </p>
      <Link
        href={`/pricing?from=recipe&recipe=${encodeURIComponent(recipeSlug)}`}
        onClick={() =>
          track("upgrade_prompt_click", { recipe_slug: recipeSlug })
        }
        className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-accent-hover"
      >
        Tone Pass · $7/mo →
      </Link>
    </div>
  );
}
