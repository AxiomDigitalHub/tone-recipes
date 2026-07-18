import { getAllPosts } from "@/lib/blog";

/**
 * Blog RSS feed.
 *
 * Syndication surface for readers AND the headless-distribution stack
 * (docs/HEADLESS_DISTRIBUTION_PLAYBOOK.md): WebSub hubs get pinged on
 * deploy so subscribers (Feedly, NewsBlur, Flipboard, Inoreader) see new
 * posts in near-real-time, and per-item images satisfy aggregator
 * requirements (Flipboard wants ≥400px art per item).
 *
 * NOTE: descriptions only, not full content — 291/370 posts use custom MDX
 * components (Knob, SettingsGrid…) that have no server-side HTML rendering
 * yet. Full-content `content:encoded` (Flipboard/SmartNews's preference) is
 * backlogged behind an MDX→HTML renderer for that component set.
 */

const SITE = "https://faderandknob.com";
const ITEM_CAP = 50;

export async function GET() {
  const posts = getAllPosts().slice(0, ITEM_CAP);

  const items = posts
    .map((post) => {
      const img = post.image
        ? `\n      <media:thumbnail url="${SITE}${post.image.startsWith("/") ? "" : "/"}${post.image}" />\n      <enclosure url="${SITE}${post.image.startsWith("/") ? "" : "/"}${post.image}" type="image/jpeg" length="0" />`
        : "";
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${SITE}/blog/${post.slug}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>${img}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Fader &amp; Knob Blog</title>
    <link>${SITE}/blog</link>
    <description>Guitar tone guides, signal chain theory, and gear comparisons from Fader &amp; Knob.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    <atom:link href="https://websub.superfeedr.com/" rel="hub" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
