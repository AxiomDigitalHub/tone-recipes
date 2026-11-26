import { ArrowRight } from "lucide-react";
import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import TrackedLink from "@/components/analytics/TrackedLink";

/**
 * <SaveThisTone>: end-of-post CTA. Two variants:
 *
 *   1. Recipe-linked: pass `recipeSlug`. The CTA links to the recipe page
 *      and pulls song/artist for the heading.
 *
 *        <SaveThisTone recipeSlug="srv-pride-and-joy-rhythm" />
 *
 *   2. Freeform: pass `title` + `description` + `href` manually. Use for
 *      thematic links to /browse filters.
 *
 * A wash tile with an ink pill and a secondary pill. Styles live in
 * redesign-components.css (.fk-stt), so it reads the same inside the
 * guide prose (.fk-prose) and anywhere else.
 */

export interface SaveThisToneProps {
  recipeSlug?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
}

export default function SaveThisTone({
  recipeSlug,
  title,
  description,
  href,
  ctaLabel,
}: SaveThisToneProps) {
  let resolvedTitle = title;
  let resolvedDescription = description;
  let resolvedHref = href;
  let resolvedCtaLabel = ctaLabel;
  let platforms: string[] = [];

  if (recipeSlug) {
    const recipe = getRecipeBySlug(recipeSlug);
    if (recipe) {
      const song = getSongBySlug(recipe.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

      resolvedTitle =
        title ??
        (artist && song ? `${song.title}, ${artist.name}` : recipe.title);
      resolvedDescription =
        description ??
        "The full chain, exact settings, and a preset you can load.";
      resolvedHref = href ?? `/recipe/${recipe.slug}`;
      resolvedCtaLabel = ctaLabel ?? "Open the recipe";
      platforms = Object.keys(recipe.platform_translations ?? {});
    }
  }

  const finalTitle = resolvedTitle ?? "Pick a tone to chase";
  const finalDescription =
    resolvedDescription ??
    "Every recipe in the catalog has the chain, exact settings, and a preset you can load.";
  const finalHref = resolvedHref ?? "/browse";
  const finalCtaLabel = resolvedCtaLabel ?? "Browse the catalog";

  return (
    <aside className="fk-tile fk-stt">
      <h2 className="fk-t3 fk-stt-title">{finalTitle}</h2>
      <p className="fk-body-sm fk-stt-desc">{finalDescription}</p>

      {platforms.length > 0 && (
        <p className="fk-caption fk-stt-platforms">
          {platforms.map(formatPlatform).join(" · ")}
        </p>
      )}

      <div className="fk-stt-actions">
        <TrackedLink
          href={finalHref}
          event="save_this_tone_click"
          eventParams={{
            recipe_slug: recipeSlug ?? "freeform",
            target: finalHref,
            source: "blog",
            cta: "primary",
          }}
          className="fk-btn fk-btn-sm"
        >
          {finalCtaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </TrackedLink>
        {/* Secondary link only when the primary goes somewhere else, or the
            default CTA renders two identical "Browse the catalog" buttons. */}
        {finalHref !== "/browse" && (
        <TrackedLink
          href="/browse"
          event="save_this_tone_click"
          eventParams={{
            recipe_slug: recipeSlug ?? "freeform",
            target: "/browse",
            source: "blog",
            cta: "secondary",
          }}
          className="fk-btn fk-btn-sm fk-btn-secondary"
        >
          Browse the catalog
        </TrackedLink>
        )}
      </div>
    </aside>
  );
}

function formatPlatform(slug: string): string {
  const LABELS: Record<string, string> = {
    helix: "Helix",
    quad_cortex: "Quad Cortex",
    tonex: "TONEX",
    fractal: "Fractal",
    kemper: "Kemper",
    katana: "Katana",
    physical: "Pedalboard",
  };
  return LABELS[slug] ?? slug;
}
