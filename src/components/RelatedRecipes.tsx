import { findRelatedRecipes } from "@/lib/related-recipes";
import ToneCard from "@/components/recipe/redesign/ToneCard";

/**
 * "From the recipe archive": links a blog post into the recipe catalog.
 * Renders nothing when no recipe genuinely matches (precision over
 * coverage; see src/lib/related-recipes.ts for the scoring).
 *
 * Each match is the site's standard ToneCard (fk-card), the same card the
 * home page, browse and the recipe page's "More like this" use.
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
    <section className="fk-related" data-testid="related-recipes">
      <div className="fk-related-head">
        <h3 className="fk-t2">From the recipe archive</h3>
      </div>
      <div className="fk-card-grid">
        {matches.map((m) => (
          <ToneCard key={m.recipe.slug} recipe={m.recipe} />
        ))}
      </div>
    </section>
  );
}
