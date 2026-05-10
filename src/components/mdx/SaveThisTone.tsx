import { ArrowRight } from "lucide-react";
import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import TrackedLink from "@/components/analytics/TrackedLink";

/**
 * <SaveThisTone> — end-of-post CTA. Two variants:
 *
 *   1. Recipe-linked: pass `recipeSlug` — the CTA links to the recipe page
 *      and pulls song/artist for the heading.
 *
 *        <SaveThisTone recipeSlug="srv-pride-and-joy-rhythm" />
 *
 *   2. Freeform: pass `title` + `description` + `href` manually. Use for
 *      thematic links to /browse filters.
 *
 * Styled with raw v3 paper/ink/amber CSS vars so it renders correctly
 * inside `.fk-preview .post-body` (the editorial blog body) and would
 * still degrade gracefully outside it.
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
        (artist && song ? `${song.title} — ${artist.name}` : recipe.title);
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
    <aside
      className="my-12"
      style={{
        borderTop: "3px solid var(--ink, #0A0908)",
        borderBottom: "1px solid var(--paper-line, rgba(10,9,8,0.12))",
        paddingTop: "20px",
        paddingBottom: "24px",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: "var(--amber-2, #B37A1D)" }}
      >
        Save this tone
      </p>
      <h2
        className="display mt-2 text-2xl md:text-3xl"
        style={{ color: "var(--ink, #0A0908)", lineHeight: 1.15 }}
      >
        {finalTitle}
      </h2>
      <p
        className="mt-2 max-w-2xl text-base leading-relaxed"
        style={{ color: "var(--ink-muted, #5F5A52)" }}
      >
        {finalDescription}
      </p>

      {platforms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {platforms.map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{
                border: "1px solid var(--ink, #0A0908)",
                color: "var(--ink, #0A0908)",
              }}
            >
              {formatPlatform(p)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <TrackedLink
          href={finalHref}
          event="save_this_tone_click"
          eventParams={{
            recipe_slug: recipeSlug ?? "freeform",
            target: finalHref,
            source: "blog",
            cta: "primary",
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold no-underline transition-colors"
          style={{
            background: "var(--amber, #E4A235)",
            color: "var(--ink, #0A0908)",
            border: "1px solid var(--ink, #0A0908)",
          }}
        >
          {finalCtaLabel}
          <ArrowRight className="h-4 w-4" />
        </TrackedLink>
        <TrackedLink
          href="/browse"
          event="save_this_tone_click"
          eventParams={{
            recipe_slug: recipeSlug ?? "freeform",
            target: "/browse",
            source: "blog",
            cta: "secondary",
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold no-underline transition-colors"
          style={{
            background: "transparent",
            color: "var(--ink, #0A0908)",
            border: "1px solid var(--ink, #0A0908)",
          }}
        >
          Browse the catalog
        </TrackedLink>
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
