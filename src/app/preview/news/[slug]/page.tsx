import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { settingsMdxComponents } from "@/components/settings/mdx-components";
import { blogMdxComponents } from "@/components/mdx";
import {
  getNewsPostBySlug,
  getNewsSlugs,
  getAllNewsPosts,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news";
import { getNewsImageSync } from "@/lib/unsplash";

const SITE_URL = "https://faderandknob.com";

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) {
    return { title: "Preview — Fader & Knob", robots: { index: false, follow: false } };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Fader & Knob`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    robots: { index: false, follow: false },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PreviewNewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) notFound();

  const catLabel = NEWS_CATEGORIES[post.category as NewsCategory] ?? post.category;
  const related = getAllNewsPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const sourceHost =
    post.source_url && !post.source_url.includes("faderandknob")
      ? new URL(post.source_url).hostname.replace(/^www\./, "")
      : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: "Fader & Knob", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/news/${slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "News", item: `${SITE_URL}/news` },
      { "@type": "ListItem", position: 2, name: catLabel },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="recipe">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/news">News</Link>
          <span className="sep">/</span>
          <Link href={`/preview/news?category=${post.category}`}>{catLabel}</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{post.title}</span>
        </div>

        <div className={`post-cover ${post.image_url ? "has-image" : "no-image"}`}>
          <Image
            src={getNewsImageSync(post.slug, post.category, post.image_url || undefined)}
            alt={post.title}
            fill
            priority
            unoptimized
            sizes="(max-width: 960px) 100vw, 960px"
            className="post-cover-img"
          />
          <div className="post-cover-scrim" aria-hidden="true" />

          <div className="post-cover-inner">
            <div className="post-cover-masthead">
              <span className="pill">{catLabel}</span>
              <span>{formatDate(post.date)}</span>
              {post.readingTime && (
                <>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </>
              )}
              {sourceHost && (
                <>
                  <span>·</span>
                  <span>via {sourceHost}</span>
                </>
              )}
            </div>

            <div className="post-cover-headline">
              <h1 className="post-title display">{post.title}</h1>
              <p className="post-dek">{post.excerpt}</p>
            </div>
          </div>
        </div>

        <div className="post-body">
          <MDXRemote
            source={post.content}
            components={{ ...settingsMdxComponents, ...blogMdxComponents }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </div>

        {sourceHost && post.source_url && (
          <aside className="post-source">
            <p>
              Originally reported by{" "}
              <a href={post.source_url} target="_blank" rel="noopener noreferrer">
                {sourceHost}
              </a>
            </p>
          </aside>
        )}

        {related.length > 0 && (
          <section className="news-related">
            <header className="how-head">
              <span className="section-rule" />
              <h2 className="display">Related</h2>
              <Link href="/preview/news" className="section-meta">
                All news →
              </Link>
            </header>
            <div className="news-grid">
              {related.map((p) => {
                const relLabel =
                  NEWS_CATEGORIES[p.category as NewsCategory] ?? p.category;
                return (
                  <Link key={p.slug} href={`/preview/news/${p.slug}`} className="news-card">
                    <div className="news-card-image">
                      <Image
                        src={getNewsImageSync(
                          p.slug,
                          p.category,
                          p.image_url || undefined,
                        )}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-meta">
                        <span>{relLabel}</span>
                        <span> · </span>
                        <span>{formatDate(p.date)}</span>
                      </div>
                      <h3 className="news-card-title">{p.title}</h3>
                      <p className="news-card-dek">{p.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
