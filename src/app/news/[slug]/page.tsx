import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { settingsMdxComponents } from "@/components/settings/mdx-components";
import { blogMdxComponents } from "@/components/mdx";
import { fitTitle, firstClause } from "@/lib/seo-title";
import {
  getNewsPostBySlug,
  getNewsSlugs,
  getAllNewsPosts,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news";
import { newsArt, sourceHost as hostOf } from "@/lib/news-art";
import NewsPicture from "@/components/news/NewsPicture";

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
    title: fitTitle([post.seo_title, post.title, firstClause(post.title)]),
    description: post.excerpt,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: `${post.title} — Fader & Knob`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
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

  const sourceHost = hostOf(post.source_url);
  const art = newsArt(post);

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
    <div className="fk-guide fk-newsarticle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article>
        <section className="fk-wrap fk-guide-top">
          <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
            <Link href="/news">News</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/news?category=${post.category}`}>
              {catLabel.charAt(0) + catLabel.slice(1).toLowerCase()}
            </Link>
          </nav>
          <div className="fk-newsarticle-head">
            <h1 className="fk-guide-h1">{post.title}</h1>
            <p className="fk-lead">{post.excerpt}</p>
            <p className="fk-caption">
              <span className="fk-data">{formatDate(post.date)}</span>
              {post.readingTime && <> · {post.readingTime}</>}
              {sourceHost && <> · via {sourceHost}</>}
            </p>
          </div>
          <NewsPicture art={art} size="article" />
        </section>

        <section className="fk-wrap fk-newsarticle-body">
          <div className="fk-prose">
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
            <p className="fk-body-sm fk-newsarticle-source">
              Originally reported by{" "}
              <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="fk-link">
                {sourceHost}
              </a>
              .
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section className="fk-wrap fk-guide-more">
            <div className="fk-learn-rule">
              <div className="fk-recipe-sectionhead">
                <h2 className="fk-t2">Related news</h2>
                <Link href="/news" className="fk-link fk-label">
                  All news
                </Link>
              </div>
              <ul className="fk-news-rows">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/news/${p.slug}`} className="fk-news-row">
                      <NewsPicture art={newsArt(p)} size="row" />
                      <div className="fk-news-rowbody">
                        <p className="fk-caption">
                          <span className="fk-data">{formatDate(p.date)}</span>
                        </p>
                        <h3 className="fk-t3">{p.title}</h3>
                        <p className="fk-body-sm">{p.excerpt}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
