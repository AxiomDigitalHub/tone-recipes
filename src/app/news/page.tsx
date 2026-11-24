import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllNewsPosts,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news";
import { newsArt, sourceHost } from "@/lib/news-art";
import NewsPicture from "@/components/news/NewsPicture";
import SignupBox from "@/components/newsletter/SignupBox";

export const metadata: Metadata = {
  title: "Modeler News — Fader & Knob",
  description:
    "Firmware updates, gear announcements, industry trends, and practical tips for guitar modeler players.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Modeler News — Fader & Knob",
    description:
      "Firmware updates, gear announcements, and tips for modeler players.",
    type: "website",
  },
};

const SITE_URL = "https://faderandknob.com";

/** "Nov 23", with the year once it is not this year's news. */
function formatDate(iso: string, newestYear: number) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getUTCFullYear() === newestYear ? undefined : "numeric",
    timeZone: "UTC",
  });
}

const sentence = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

/** Stories shown before the "Older news" fold. All of them are in the HTML. */
const FRESH = 12;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllNewsPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;
  const newestYear = allPosts[0] ? new Date(allPosts[0].date).getUTCFullYear() : new Date().getUTCFullYear();

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modeler News — Fader & Knob",
    description:
      "Firmware updates, gear announcements, industry trends, and practical tips for guitar modeler players.",
    url: `${SITE_URL}/news`,
    publisher: { "@type": "Organization", name: "Fader & Knob" },
  };

  const meta = (post: (typeof posts)[number]) => {
    const host = sourceHost(post.source_url);
    return (
      <p className="fk-caption fk-news-meta">
        <span className="fk-news-cat">
          {sentence(NEWS_CATEGORIES[post.category as NewsCategory] ?? post.category).replace(/ updates$/, "")}
        </span>
        {" · "}
        <span className="fk-data">{formatDate(post.date, newestYear)}</span>
        {host && <> · via {host}</>}
      </p>
    );
  };

  const row = (post: (typeof posts)[number]) => (
    <li key={post.slug}>
      <Link href={`/news/${post.slug}`} className="fk-news-row">
        <NewsPicture art={newsArt(post)} size="row" />
        <div className="fk-news-rowbody">
          {meta(post)}
          <h3 className="fk-t3">{post.title}</h3>
          <p className="fk-body-sm">{post.excerpt}</p>
        </div>
      </Link>
    </li>
  );

  const [lead, ...rest] = posts;
  const fresh = rest.slice(0, FRESH - 1);
  const older = rest.slice(FRESH - 1);
  const firmware = allPosts.filter((p) => p.category === "firmware-update").slice(0, 3);

  return (
    <div className="fk-news">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <section className="fk-wrap fk-news-top">
        <div className="fk-news-head">
          <h1 className="fk-display">Modeler news</h1>
          <p className="fk-lead fk-wrap-text">
            Firmware updates, new gear and industry moves, with what each one means for your rig.
          </p>
        </div>
        <nav className="fk-chips" aria-label="Filter news">
          <Link href="/news" className="fk-chip" aria-current={!category ? "page" : undefined}>
            All
          </Link>
          {(Object.entries(NEWS_CATEGORIES) as [NewsCategory, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={`/news?category=${key}`}
              className="fk-chip"
              aria-current={category === key ? "page" : undefined}
            >
              {sentence(label)}
            </Link>
          ))}
        </nav>
      </section>

      <section className="fk-wrap fk-news-layout">
        <div className="fk-news-main">
          {!lead ? (
            <div className="fk-tile fk-browse-empty">
              <p className="fk-body">No stories here yet.</p>
              {category && (
                <Link href="/news" className="fk-link fk-label">
                  See all news
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link href={`/news/${lead.slug}`} className="fk-news-lead">
                <NewsPicture art={newsArt(lead)} size="lead" />
                <div className="fk-news-leadbody">
                  {meta(lead)}
                  <h2 className="fk-news-leadtitle">{lead.title}</h2>
                  <p className="fk-body fk-muted">{lead.excerpt}</p>
                </div>
              </Link>
              {fresh.length > 0 && <ul className="fk-news-rows">{fresh.map(row)}</ul>}
              {older.length > 0 && (
                /* Every story stays in the HTML; the fold only tidies the page. */
                <details className="fk-news-older">
                  <summary className="fk-btn fk-btn-secondary">Older news</summary>
                  <ul className="fk-news-rows">{older.map(row)}</ul>
                </details>
              )}
            </>
          )}
        </div>

        <aside className="fk-news-side">
          {firmware.length > 0 && (
            <div className="fk-tile fk-news-fw">
              <h2 className="fk-t3">Latest firmware</h2>
              <ul>
                {firmware.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/news/${p.slug}`}>
                      <span className="fk-news-fwtitle">{p.title}</span>
                      <span className="fk-data">{formatDate(p.date, newestYear)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/news?category=firmware-update" className="fk-link fk-label">
                All firmware updates
              </Link>
            </div>
          )}
          <div className="fk-news-signup r-lg">
            <h2 className="fk-t3">Get the news by email</h2>
            <p className="fk-body-sm">Tone recipes and modeler news, in one email.</p>
            <SignupBox source="news-sidebar" id="news-email" />
          </div>
        </aside>
      </section>
    </div>
  );
}
