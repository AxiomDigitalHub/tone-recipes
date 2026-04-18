import Link from "next/link";
import { Bookmark, Download, ArrowRight } from "lucide-react";
import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";

/**
 * <SaveThisTone> — end-of-post CTA that converts editorial traffic into
 * preset-library traffic. Built for the 2026-04-17 content-strategy sprint:
 * the Phase 4 audit found that only 1 of 12 audited tone-recipe posts
 * linked to /browse, and zero ended with "save this preset" language.
 *
 * Drop this at the end of any tone-recipe blog post. Two variants:
 *
 *   1. Recipe-linked: pass `recipeSlug` — the CTA links to the live recipe
 *      page and pulls the recipe's title + artist for the heading. Preferred
 *      for posts that discuss a specific recipe in the library.
 *
 *        <SaveThisTone recipeSlug="srv-pride-and-joy-rhythm" />
 *
 *   2. Freeform: pass `title` + `description` + `href` manually. Use when
 *      the post references a tone the library doesn't have a recipe for
 *      yet, or for thematic roundups that link to /browse.
 *
 *        <SaveThisTone
 *          title="Start your own high-gain preset"
 *          description="Open the Fortin NTS model in the Helix, load the Drop-B starter, and tune it to your rig."
 *          href="/browse?platform=helix&tag=high-gain"
 *        />
 */

export interface SaveThisToneProps {
  /** When provided, pulls the recipe's live data (title, artist, platforms). */
  recipeSlug?: string;
  /** Override or freeform: title shown in the card. */
  title?: string;
  /** Override or freeform: description/subhead. */
  description?: string;
  /** Override or freeform: primary CTA link. Defaults to /recipe/[slug] when
   *  `recipeSlug` is given, or /browse otherwise. */
  href?: string;
  /** Primary CTA label. Default "Open the recipe" for recipe-linked,
   *  "Browse presets" for freeform. */
  ctaLabel?: string;
}

export default function SaveThisTone({
  recipeSlug,
  title,
  description,
  href,
  ctaLabel,
}: SaveThisToneProps) {
  // Recipe-linked path: enrich the card with data from the recipe file.
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
        (artist && song
          ? `${song.title} — ${artist.name}`
          : recipe.title);
      resolvedDescription =
        description ??
        "Signal chain, exact settings, and Helix + Katana presets — saved in your library for the next time you pick up the guitar.";
      resolvedHref = href ?? `/recipe/${recipe.slug}`;
      resolvedCtaLabel = ctaLabel ?? "Open the recipe";
      platforms = Object.keys(recipe.platform_translations ?? {});
    }
  }

  // Fallback for freeform / unresolvable recipe
  const finalTitle = resolvedTitle ?? "Save this tone";
  const finalDescription =
    resolvedDescription ??
    "Get the full preset and signal chain — saved to your library, ready whenever you pick up the guitar.";
  const finalHref = resolvedHref ?? "/browse";
  const finalCtaLabel = resolvedCtaLabel ?? "Browse presets";

  return (
    <section className="mx-auto my-14 max-w-3xl rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Bookmark className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            Save this tone
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground md:text-xl">
            {finalTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {finalDescription}
          </p>

          {platforms.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted"
                >
                  {formatPlatform(p)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={finalHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              <Download className="h-4 w-4" />
              {finalCtaLabel}
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              Browse all recipes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
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
    physical: "Physical",
  };
  return LABELS[slug] ?? slug;
}
