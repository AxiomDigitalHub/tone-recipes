import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { findRelatedPosts } from "@/lib/related-posts";
import type { ToneRecipe } from "@/types/recipe";

/**
 * "Field notes on this tone": links a recipe page into the blog. The
 * reverse of RelatedRecipes.tsx; renders nothing when no post genuinely
 * matches (precision over coverage; see src/lib/related-posts.ts).
 *
 * Media cards (fk-card with 16:10 art), the same family as the recipe
 * page's "More like this" row.
 */

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RelatedPosts({ recipe }: { recipe: ToneRecipe }) {
  const matches = findRelatedPosts(recipe);
  if (matches.length === 0) return null;

  return (
    <section className="fk-related" data-testid="related-posts">
      <div className="fk-related-head">
        <h3 className="fk-t2">Field notes on this tone</h3>
      </div>
      <div className="fk-card-grid fk-related-grid">
        {matches.map((m) => (
          <Link key={m.post.slug} href={`/blog/${m.post.slug}`} className="fk-card">
            <div className="fk-card-art is-wide">
              {m.post.image && (
                <Image
                  src={m.post.image}
                  alt={m.post.imageAlt ?? m.post.title}
                  fill
                  unoptimized
                  sizes="(max-width: 960px) 50vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="fk-card-body">
              <div className="fk-card-head">
                <h4 className="fk-t3">{m.post.headline}</h4>
                <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
              </div>
              <p className="fk-body-sm">{m.post.author}</p>
              <p className="fk-card-meta">{formatDate(m.post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
