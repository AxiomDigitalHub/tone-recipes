/**
 * /.well-known/api-catalog — RFC 9727 API catalog for agent discovery.
 *
 * Advertised from the homepage via a `Link: rel="api-catalog"` response
 * header (next.config.ts). Format is an RFC 9264 linkset (linkset+json).
 *
 * Honesty rule: this catalogs only the machine-readable surfaces the site
 * actually serves — the LLM guide files and the content feeds. F&K has no
 * public JSON API; nothing fictional is advertised here. llms.txt-tier
 * plumbing per AI_SEARCH_PLAYBOOK §4 — harmless, zero maintenance priority.
 */

const SITE = "https://faderandknob.com";

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE}/`,
        "service-doc": [
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
            title: "Fader & Knob — guide to the site for LLM agents",
          },
          {
            href: `${SITE}/llms-full.txt`,
            type: "text/plain",
            title: "Fader & Knob — full machine-readable content index",
          },
          {
            href: `${SITE}/auth.md`,
            type: "text/markdown",
            title: "Fader & Knob — agent registration & authentication (auth.md)",
          },
        ],
        alternate: [
          {
            href: `${SITE}/feed.xml`,
            type: "application/rss+xml",
            title: "Fader & Knob Blog (RSS)",
          },
          {
            href: `${SITE}/feed.json`,
            type: "application/feed+json",
            title: "Fader & Knob Blog (JSON Feed)",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
