import { getAllPosts } from "@/lib/blog";

/**
 * JSON Feed 1.1 (jsonfeed.org) — consumed by NetNewsWire, NewsBlur, Reeder,
 * FreshRSS. Mirrors /feed.xml (descriptions + hero image, 50 items); part of
 * the headless-distribution stack (docs/HEADLESS_DISTRIBUTION_PLAYBOOK.md).
 */

const SITE = "https://faderandknob.com";
const ITEM_CAP = 50;

export async function GET() {
  const posts = getAllPosts().slice(0, ITEM_CAP);

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Fader & Knob Blog",
    home_page_url: `${SITE}/blog`,
    feed_url: `${SITE}/feed.json`,
    description:
      "Guitar tone guides, signal chain theory, and gear comparisons from Fader & Knob.",
    icon: `${SITE}/logo.png`,
    language: "en-US",
    hubs: [
      { type: "WebSub", url: "https://pubsubhubbub.appspot.com/" },
      { type: "WebSub", url: "https://websub.superfeedr.com/" },
    ],
    items: posts.map((post) => ({
      id: `${SITE}/blog/${post.slug}`,
      url: `${SITE}/blog/${post.slug}`,
      title: post.title,
      content_text: post.description,
      date_published: new Date(post.date).toISOString(),
      ...(post.image
        ? { image: `${SITE}${post.image.startsWith("/") ? "" : "/"}${post.image}` }
        : {}),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
}
