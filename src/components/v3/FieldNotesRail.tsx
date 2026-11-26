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
    <section className="platform-section fk-fnr">
      <div className="fk-fnr-head">
        <h2 className="fk-t2">{title}</h2>
        <Link href="/blog" className="fk-link fk-label">
          All field notes →
        </Link>
      </div>
      <div className="fk-fnr-grid">
        {posts.map((p) => {
          const writer = writers.get(p.authorSlug);
          const cat = BLOG_CATEGORIES[p.category] ?? p.category;
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="fk-fnr-card">
              <div className="fk-fnr-meta">
                <span className="fk-fnr-cat">{cat}</span>
                <span className="fk-fnr-time">{p.readingTime}</span>
              </div>
              <h3 className="fk-fnr-title">{p.title}</h3>
              <p className="fk-fnr-dek">{p.description}</p>
              <div className="fk-fnr-byline">By {writer?.name ?? p.author}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
