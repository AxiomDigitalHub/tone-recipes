import Link from "next/link";
import Image from "next/image";
import { findRelatedPosts } from "@/lib/related-posts";
import { getCallNumber } from "@/lib/blog";
import type { ToneRecipe } from "@/types/recipe";

/**
 * "Field notes on this tone" — links a recipe page into the blog. The
 * reverse of RelatedRecipes.tsx; renders nothing when no post genuinely
 * matches (precision over coverage; see src/lib/related-posts.ts).
 *
 * Markup mirrors the "Also filed under" post cards on /blog/[slug]
 * (.feat-card with hero image) so it inherits the v3 theme untouched.
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
    <div className="related" data-testid="related-posts">
      <h3 className="display">Field notes on this tone</h3>
      <div className="feat-grid">
        {matches.map((m) => (
          <div key={m.post.slug} style={{ gridColumn: "span 4" }}>
            <Link
              href={`/blog/${m.post.slug}`}
              className="feat-card"
              style={{ display: "block" }}
            >
              <div className="feat-card-num">
                No. {getCallNumber(m.post.slug)}
              </div>
              <div className="feat-card-art">
                {m.post.image && (
                  <Image
                    src={m.post.image}
                    alt={m.post.imageAlt ?? m.post.title}
                    fill
                    unoptimized
                    sizes="(max-width: 960px) 33vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="feat-card-song">{m.post.title}</div>
              <div className="feat-card-artist">
                {m.post.author} · {formatDate(m.post.date)}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
