import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getAllNewsPosts,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news";
import { getNewsImageSync } from "@/lib/unsplash";

export const metadata: Metadata = {
  title: "Modeler News — Fader & Knob",
  description:
    "Firmware updates, gear announcements, industry trends, and practical tips for guitar modeler players.",
  openGraph: {
    title: "Modeler News — Fader & Knob",
    description:
      "Firmware updates, gear announcements, and tips for modeler players.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

const SITE_URL = "https://faderandknob.com";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PreviewNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllNewsPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modeler News — Fader & Knob",
    description:
      "Firmware updates, gear announcements, industry trends, and practical tips for guitar modeler players.",
    url: `${SITE_URL}/news`,
    publisher: { "@type": "Organization", name: "Fader & Knob" },
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <div className="news-page">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>News</span>
        </div>

        <header className="news-head">
          <div className="recipe-issue">
            <span className="pill">Modeler desk</span>
          </div>
          <h1 className="display news-title">Modeler News</h1>
          <p className="news-dek">
            Firmware updates, gear announcements, industry trends, and the
            practical bits that change how a modeler player actually works.
          </p>
        </header>

        <nav className="news-categories" aria-label="Filter by category">
          <Link
            href="/preview/news"
            className={`news-cat ${!category ? "is-active" : ""}`}
          >
            All
          </Link>
          {(Object.entries(NEWS_CATEGORIES) as [NewsCategory, string][]).map(
            ([key, label]) => (
              <Link
                key={key}
                href={`/preview/news?category=${key}`}
                className={`news-cat ${category === key ? "is-active" : ""}`}
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        {posts.length === 0 ? (
          <div className="request-empty">
            <p className="display request-empty-title">No stories filed yet</p>
            <p className="request-empty-sub">
              {category
                ? "Try a different category."
                : "Check back soon."}
            </p>
          </div>
        ) : (
          <section className="news-grid">
            {posts.map((post) => {
              const catLabel =
                NEWS_CATEGORIES[post.category as NewsCategory] ?? post.category;
              const sourceHost =
                post.source_url && !post.source_url.includes("faderandknob")
                  ? new URL(post.source_url).hostname.replace(/^www\./, "")
                  : null;
              return (
                <Link
                  key={post.slug}
                  href={`/preview/news/${post.slug}`}
                  className="news-card"
                >
                  <div className="news-card-image">
                    <Image
                      src={getNewsImageSync(
                        post.slug,
                        post.category,
                        post.image_url || undefined,
                      )}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="news-card-body">
                    <div className="news-card-meta">
                      <span>{catLabel}</span>
                      <span> · </span>
                      <span>{formatDate(post.date)}</span>
                      {sourceHost && (
                        <>
                          <span> · </span>
                          <span>via {sourceHost}</span>
                        </>
                      )}
                    </div>
                    <h2 className="news-card-title">{post.title}</h2>
                    <p className="news-card-dek">{post.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
