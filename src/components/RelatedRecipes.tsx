import Link from "next/link";
import { findRelatedRecipes } from "@/lib/related-recipes";
import { toneRecipes } from "@/lib/data";
import { LpArt, monogramFor } from "@/components/v3/LpArt";

/**
 * "From the recipe archive" — links a blog post into the recipe catalog.
 * Renders nothing when no recipe genuinely matches (precision over
 * coverage; see src/lib/related-recipes.ts for the scoring).
 *
 * Markup mirrors the related-recipes cards on /recipe/[slug] (LpArt +
 * .feat-card) so it inherits the v3 paper/ink theme untouched.
 */
export function RelatedRecipes({
  postTitle,
  postTags,
}: {
  postTitle: string;
  postTags: string[];
}) {
  const matches = findRelatedRecipes(postTitle, postTags);
  if (matches.length === 0) return null;

  return (
    <div className="related" data-testid="related-recipes">
      <h3 className="display">From the recipe archive</h3>
      <div className="feat-grid">
        {matches.map((m, i) => {
          const rIdx = toneRecipes.findIndex((tr) => tr.slug === m.recipe.slug) + 1;
          return (
            <div key={m.recipe.slug} style={{ gridColumn: "span 4" }}>
              <Link
                href={`/recipe/${m.recipe.slug}`}
                className="feat-card"
                style={{ display: "block" }}
              >
                <div className="feat-card-num">
                  No. {String(rIdx).padStart(3, "0")} · Side {["A", "B", "C", "D"][i % 4]}
                </div>
                <div className="feat-card-art-wrap">
                  <LpArt
                    cover={m.albumArtUrl}
                    monogram={monogramFor(m.artistName)}
                    hue={rIdx}
                    shape="banner"
                    alt={`${m.songTitle} cover`}
                  />
                </div>
                <div className="feat-card-song">{m.recipe.title}</div>
                <div className="feat-card-artist">
                  <em>{m.artistName || "Various"}</em>
                  {m.songTitle ? ` · ${m.songTitle}` : ""}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
