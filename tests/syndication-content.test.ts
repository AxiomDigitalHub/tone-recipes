import { describe, expect, it } from "vitest";
import {
  buildExcerptHtml,
  buildFullHtml,
  cleanBodyHtml,
  extractByClass,
  flattenTables,
  type SyndicationPost,
} from "@/lib/syndication/content";
import { normalizeTags } from "@/lib/syndication/platforms";

const ORIGIN = "https://faderandknob.com";

// Shapes copied from real rendered blog pages (2026-11-19).
const PAGE = `<html><body><nav>menu</nav><article class="recipe">
<div class="post-reading"><nav class="toc">ToC</nav><div class="post-body">
<p>Intro with a <a href="/blog/what-is-amp-sag">link</a>.</p>
<h2 id="h"><a href="#h">Heading</a></h2>
<div style="display:block"><div style="x"><div style="a">Two-Source Mix Defaults</div><div style="b">Singer-Songwriter Blend</div></div>
<div style="flex"><div role="meter" aria-label="Pickup level: -6 dB under mic" aria-valuenow="0"><svg><circle/></svg><div>4</div></div><div role="meter" aria-label="Mic level: 0 dB &amp; up"><svg></svg></div></div></div>
<div class="post-table-scroll"><table><thead><tr><th>Source</th><th>Captures</th></tr></thead><tbody><tr><td>Piezo</td><td>Attack</td></tr></tbody></table></div>
<img src="/_next/image?url=%2Fimages%2Fblog%2Fx.jpg&amp;w=1200" srcset="a 1x" class="c">
<aside class="my-12"><h2>Save this tone</h2><a href="/browse">Browse</a></aside>
<p>End.</p>
</div></div><section class="post-faq">FAQ</section></article></body></html>`;

const POST: SyndicationPost = {
  slug: "x",
  title: "A <Title>",
  description: "Desc & more",
  author: "Carl Beckett",
  date: "2026-11-01",
  tags: ["Guitar-Setup", "helix", "Helix", "a-very-long-tag-name-over-the-limit"],
  takeaways: ["One", "Two"],
  imageUrl: `${ORIGIN}/images/blog/x.jpg`,
  canonicalUrl: `${ORIGIN}/blog/x`,
};

describe("syndication content", () => {
  const body = extractByClass(PAGE, "post-body")!;

  it("slices exactly the post body", () => {
    expect(body).toContain("Intro with a");
    expect(body).toContain("<p>End.</p>");
    expect(body).not.toContain("FAQ");
    expect(body).not.toContain("ToC");
  });

  it("cleans to portable HTML", () => {
    const clean = cleanBodyHtml(body, { origin: ORIGIN });
    expect(clean).toContain(`<a href="${ORIGIN}/blog/what-is-amp-sag">link</a>`);
    expect(clean).toContain("<h2>Heading</h2>");
    expect(clean).toContain(
      "<p>Two-Source Mix Defaults</p><p>Singer-Songwriter Blend</p>",
    );
    expect(clean).toMatch(/<ul>\s*<li>Pickup level: -6 dB under mic<\/li>\s*<li>Mic level: 0 dB &amp; up<\/li>\s*<\/ul>/);
    expect(clean).toContain(`<img src="${ORIGIN}/images/blog/x.jpg">`);
    expect(clean).toContain("<table>");
    expect(clean).not.toMatch(/class=|style=|srcset=|<svg|<div|<aside|Save this tone|aria-/);
  });

  it("flattens tables for Medium", () => {
    expect(flattenTables(cleanBodyHtml(body, { origin: ORIGIN }))).toContain(
      "<ul><li><strong>Piezo</strong> · Captures: Attack</li></ul>",
    );
  });

  it("full copy carries attribution to the canonical URL", () => {
    const html = buildFullHtml(POST, "<p>body</p>");
    expect(html.match(new RegExp(POST.canonicalUrl, "g"))?.length).toBeGreaterThanOrEqual(3);
    expect(html).toContain("Originally published on");
  });

  it("excerpt is short, escaped, and links home", () => {
    const html = buildExcerptHtml(POST);
    expect(html).toContain("Desc &amp; more");
    expect(html).toContain("<li>One</li><li>Two</li>");
    expect(html).toContain(`href="${POST.canonicalUrl}"`);
    expect(html).not.toContain("body");
  });

  it("normalizes tags", () => {
    expect(normalizeTags(POST.tags, 5)).toEqual(["guitar setup", "helix"]);
  });
});
