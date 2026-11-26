import Link from "next/link";
import { getAllWriters } from "@/lib/writers";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";

/**
 * Related field notes on the artist, gear and platform pages, drawn as
 * wash tiles. Takes the same posts FieldNotesRail did (findRelatedPosts).
 * Renders nothing when there are none.
 */
export default function PostsRail({
  title,
  posts,
}: {
  title: string;
  posts: BlogPost[];
}) {
  if (posts.length === 0) return null;
  const writers = new Map(getAllWriters().map((w) => [w.slug, w]));
  return (
    <section className="fkp-section">
      <div className="fkp-sectionhead">
        <h2 className="fk-t2">{title}</h2>
        <Link href="/blog" className="fk-link fk-body-sm">
          All field notes
        </Link>
      </div>
      <div className="fkp-tiles">
        {posts.map((p) => {
          const writer = writers.get(p.authorSlug);
          const cat = BLOG_CATEGORIES[p.category] ?? p.category;
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="fk-tile fkp-post">
              <p className="fk-caption">
                {cat} · {p.readingTime}
              </p>
              <h3 className="fk-t3">{p.title}</h3>
              <p className="fk-body-sm fkp-post-dek">{p.description}</p>
              <p className="fk-caption">By {writer?.name ?? p.author}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
