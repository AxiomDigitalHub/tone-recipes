import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";
import { SITE_URL } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  HTML → Markdown rendition for agents (Accept: text/markdown).             */
/*  Output shape mirrors Cloudflare's "Markdown for Agents": YAML frontmatter */
/*  from the page's meta tags, followed by the converted main content.        */
/* -------------------------------------------------------------------------- */

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
});
gfm(turndown);
turndown.remove(["script", "style", "noscript", "iframe", "template"]);
// SVGs (icons, logos) carry no prose — drop them rather than emit their text.
turndown.addRule("dropSvg", {
  filter: (node) => node.nodeName === "SVG" || node.nodeName === "svg",
  replacement: () => "",
});

function metaContent(html: string, name: string): string | undefined {
  // Matches both attribute orders: name/property before or after content.
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']|` +
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i",
  );
  const m = html.match(re);
  return (m?.[1] ?? m?.[2])?.trim() || undefined;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ");
}

/** Extract the content region worth converting: <main> if present, else <body>. */
function contentRegion(html: string): string {
  const mainStart = html.search(/<main[\s>]/i);
  if (mainStart !== -1) {
    const mainEnd = html.lastIndexOf("</main>");
    if (mainEnd > mainStart) {
      return html.slice(html.indexOf(">", mainStart) + 1, mainEnd);
    }
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch?.[1] ?? html;
  // No <main> landmark — strip the obvious chrome instead.
  body = body
    .replace(/<header[\s>][\s\S]*?<\/header>/gi, "")
    .replace(/<nav[\s>][\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s>][\s\S]*?<\/footer>/gi, "");
  return body;
}

export interface MarkdownRendition {
  markdown: string;
  /** Rough token estimates (chars / 4), same spirit as Cloudflare's headers. */
  markdownTokens: number;
  originalTokens: number;
}

export function htmlToMarkdown(html: string, path: string): MarkdownRendition {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : undefined;
  const description = metaContent(html, "description");
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];

  const frontmatterLines = ["---"];
  if (title) frontmatterLines.push(`title: ${JSON.stringify(title)}`);
  if (description)
    frontmatterLines.push(`description: ${JSON.stringify(decodeEntities(description))}`);
  frontmatterLines.push(`url: ${canonical ?? `${SITE_URL}${path}`}`);
  frontmatterLines.push("---", "");

  const body = turndown
    .turndown(contentRegion(html))
    // Collapse the 3+ blank lines that component boundaries tend to leave.
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const markdown = `${frontmatterLines.join("\n")}\n${body}\n`;
  return {
    markdown,
    markdownTokens: Math.ceil(markdown.length / 4),
    originalTokens: Math.ceil(html.length / 4),
  };
}
