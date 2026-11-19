import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";

/* -------------------------------------------------------------------------- */
/*  Syndication content builder. Spec: docs/SYNDICATION.md.                   */
/*                                                                            */
/*  Source of truth is the RENDERED blog page, not the MDX: 290+ posts use    */
/*  custom components (Knob, SettingsGrid, SaveThisTone…) with no other HTML  */
/*  renderer, so the cron fetches its own page over loopback and slices out   */
/*  .post-body. Everything here is pure string work so it unit-tests offline. */
/* -------------------------------------------------------------------------- */

export interface SyndicationPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  takeaways?: string[];
  /** Absolute URL of the hero image, if any. */
  imageUrl?: string;
  /** Absolute canonical URL on faderandknob.com. */
  canonicalUrl: string;
}

const VOID = new Set(["br", "hr", "img", "input", "meta", "link", "source", "wbr"]);

/**
 * Returns [start, end) of the balanced element whose opening tag begins at
 * `openAt`. Only counts tags with the same name, which is all a well-formed
 * React render needs.
 */
function balancedEnd(html: string, openAt: number): number {
  const tagName = /^<([a-zA-Z][\w-]*)/.exec(html.slice(openAt))?.[1]?.toLowerCase();
  if (!tagName) return -1;
  const re = new RegExp(`<(/?)${tagName}(?=[\\s>/])[^>]*?(/?)>`, "gi");
  re.lastIndex = openAt;
  let depth = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m[1]) depth--;
    else if (!m[2] && !VOID.has(tagName)) depth++;
    if (depth === 0) return m.index + m[0].length;
  }
  return -1;
}

/** Inner HTML of the first element carrying class="<className>". */
export function extractByClass(html: string, className: string): string | null {
  const re = new RegExp(`<([a-zA-Z]+)[^>]*class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?"[^>]*>`);
  const m = re.exec(html);
  if (!m) return null;
  const end = balancedEnd(html, m.index);
  if (end === -1) return null;
  const inner = html.slice(m.index + m[0].length, end);
  return inner.slice(0, inner.lastIndexOf("<"));
}

/** Replace every balanced element whose opening tag matches `openRe`. */
function replaceElements(
  html: string,
  openRe: RegExp,
  replace: (openTag: string, outer: string) => string,
): string {
  let out = "";
  let cursor = 0;
  const re = new RegExp(openRe.source, openRe.flags.includes("g") ? openRe.flags : openRe.flags + "g");
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m.index < cursor) continue;
    const end = balancedEnd(html, m.index);
    if (end === -1) break;
    out += html.slice(cursor, m.index) + replace(m[0], html.slice(m.index, end));
    cursor = end;
    re.lastIndex = end;
  }
  return out + html.slice(cursor);
}

function decodeAttr(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#0?39;/gi, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolutize(url: string, origin: string): string {
  if (url.startsWith("/_next/image")) {
    const inner = new URLSearchParams(url.split("?")[1] ?? "").get("url");
    if (inner) return absolutize(decodeURIComponent(inner), origin);
  }
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${origin}${url}`;
  return url;
}

export interface CleanOptions {
  /** Site origin used to absolutize relative links and images. */
  origin: string;
  /** Medium drops <table> entirely, so flatten tables into lists there. */
  flattenTables?: boolean;
}

/**
 * Turns rendered .post-body HTML into portable article HTML: no classes,
 * styles, SVG, or in-page CTAs; meters (Knob) become plain text; all links
 * and images absolute.
 */
export function cleanBodyHtml(bodyHtml: string, opts: CleanOptions): string {
  let html = bodyHtml;

  // Drop non-content outright.
  html = html.replace(/<(script|style|noscript|template|svg|form|button)\b[\s\S]*?<\/\1>/gi, "");
  // In-body CTAs (SaveThisTone, GearPick buy boxes) are <aside>s; one footer
  // CTA back to F&K replaces them.
  html = replaceElements(html, /<aside\b[^>]*>/i, () => "");

  // Knob renders as role="meter" with the whole reading in aria-label.
  html = replaceElements(html, /<[a-z]+\b[^>]*role="meter"[^>]*>/i, (open) => {
    const label = /aria-label="([^"]*)"/.exec(open)?.[1];
    return label ? `<li data-fk-meter>${escapeHtml(decodeAttr(label))}</li>` : "";
  });
  // Wrap each run of meter <li>s (they sat inside flex <div>s) into a list.
  // Closing/opening layout tags between them are dropped later anyway.
  html = html.replace(
    /<li data-fk-meter>[^<]*<\/li>(?:(?:\s|<\/?div[^>]*>)*<li data-fk-meter>[^<]*<\/li>)*/g,
    (run) => `<ul>${run.replace(/<\/?div[^>]*>/g, "").replace(/ data-fk-meter/g, "")}</ul>`,
  );

  // Heading autolinks: <h2 id=x><a href="#x">Text</a></h2> -> <h2>Text</h2>.
  html = html.replace(/<a\b[^>]*href="#[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1");

  // Absolutize href/src, drop srcset/sizes (they point at /_next/image).
  html = html.replace(/\s(href|src)="([^"]*)"/gi, (_m, attr: string, val: string) =>
    ` ${attr.toLowerCase()}="${absolutize(decodeAttr(val), opts.origin).replace(/"/g, "&quot;")}"`,
  );
  html = html.replace(/\s(srcset|sizes)="[^"]*"/gi, "");

  // Strip presentational / framework attributes.
  html = html.replace(/\s(class|style|id|role|tabindex|loading|decoding|fetchpriority|data-[\w-]+|aria-[\w-]+)="[^"]*"/gi, "");

  if (opts.flattenTables) html = flattenTables(html);

  // Leaf divs holding only text (component titles/labels) become paragraphs,
  // or unwrapping would run them together ("Guide TitleSubtitle").
  html = html.replace(/<div>([^<]*\S[^<]*)<\/div>/g, "<p>$1</p>");
  // Unwrap layout containers.
  html = html.replace(/<\/?(div|span|section)\b[^>]*>/gi, "");

  return html.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+\n/g, "\n").trim();
}

function cellText(cell: string): string {
  return cell.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/** <table> -> <ul> of "Header: value · Header: value" rows. */
export function flattenTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    const rows = [...table.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((r) =>
      [...r[0].matchAll(/<(t[hd])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((c) => ({
        head: c[1].toLowerCase() === "th",
        text: cellText(c[2]),
      })),
    );
    if (rows.length === 0) return "";
    const header = rows[0].every((c) => c.head) ? rows.shift()!.map((c) => c.text) : null;
    const items = rows
      .filter((r) => r.length > 0)
      .map((r) => {
        const parts = r.map((c, i) => {
          const h = header?.[i];
          if (i === 0) return `<strong>${escapeHtml(c.text)}</strong>`;
          return h ? `${escapeHtml(h)}: ${escapeHtml(c.text)}` : escapeHtml(c.text);
        });
        return `<li>${parts.join(" · ")}</li>`;
      });
    return `<ul>${items.join("")}</ul>`;
  });
}

/* ---------------------------- Article shapes ------------------------------ */

function attributionTop(p: SyndicationPost): string {
  return `<p><em>Originally published on <a href="${p.canonicalUrl}">Fader &amp; Knob</a> by ${escapeHtml(p.author)}.</em></p>`;
}

function attributionBottom(p: SyndicationPost): string {
  return (
    `<hr><p>This guide first appeared on <a href="${p.canonicalUrl}">Fader &amp; Knob</a>, ` +
    `where every tone recipe ships with exact amp, pedal and modeler settings. ` +
    `<a href="${p.canonicalUrl}">Read the original</a> for the full settings, ` +
    `downloads and updates.</p>`
  );
}

/** Full copy for platforms that honor a canonical pointer (Medium, Hashnode). */
export function buildFullHtml(p: SyndicationPost, cleanBody: string): string {
  const hero = p.imageUrl ? `<img src="${p.imageUrl}" alt="${escapeHtml(p.title)}">` : "";
  return [hero, attributionTop(p), cleanBody, attributionBottom(p)].filter(Boolean).join("\n");
}

/**
 * Excerpt for platforms that can't set a cross-domain canonical (Blogger,
 * WordPress.com, Tumblr). Short enough that it can't compete with the
 * original for the same query; the takeaways give it standalone value.
 */
export function buildExcerptHtml(p: SyndicationPost): string {
  const hero = p.imageUrl
    ? `<p><a href="${p.canonicalUrl}"><img src="${p.imageUrl}" alt="${escapeHtml(p.title)}"></a></p>`
    : "";
  const takeaways = (p.takeaways ?? []).slice(0, 4);
  const list = takeaways.length
    ? `<p><strong>The short version:</strong></p><ul>${takeaways
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join("")}</ul>`
    : "";
  return [
    hero,
    `<p>${escapeHtml(p.description)}</p>`,
    list,
    `<p><a href="${p.canonicalUrl}"><strong>Read the full guide on Fader &amp; Knob →</strong></a></p>`,
    `<p><em>By ${escapeHtml(p.author)}. Settings, presets and the full write-up live at the link above.</em></p>`,
  ]
    .filter(Boolean)
    .join("\n");
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
});
gfm(turndown);

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
}
