import Link from "next/link";
import { getAllWriters } from "@/lib/writers";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";

/**
 * Editorial rail of related Field Notes posts. Drops onto recipe /
 * platform / artist pages so the blog content stops being a silo —
 * the Tube Screamer recipe surfaces the Tube Screamer post, the Helix
 * platform page surfaces the Helix vs QC vs Kemper post, etc.
 */
export function FieldNotesRail({
  title,
  posts,
}: {
  title: string;
  posts: BlogPost[];
}) {
  if (posts.length === 0) return null;

  const writers = new Map(getAllWriters().map((w) => [w.slug, w]));

  return (
    <section className="platform-section">
      <div className="how-head">
        <h2 className="display">{title}</h2>
        <span className="section-rule" aria-hidden="true" />
        <Link href="/preview/blog" className="section-meta fnr-see-all">
          All field notes →
        </Link>
      </div>
      <div className="fnr-grid">
        {posts.map((p) => {
          const writer = writers.get(p.authorSlug);
          const cat = BLOG_CATEGORIES[p.category] ?? p.category;
          return (
            <Link
              key={p.slug}
              href={`/preview/blog/${p.slug}`}
              className="fnr-card"
            >
              <div className="fnr-card-meta">
                <span className="fnr-card-cat">{cat}</span>
                <span className="fnr-card-time">{p.readingTime}</span>
              </div>
              <h3 className="fnr-card-title">{p.title}</h3>
              <p className="fnr-card-dek">{p.description}</p>
              <div className="fnr-card-byline">
                <em>By {writer?.name ?? p.author}</em>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
