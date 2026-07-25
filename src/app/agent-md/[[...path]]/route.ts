import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { htmlToMarkdown } from "@/lib/html-to-markdown";

/* -------------------------------------------------------------------------- */
/*  Markdown rendition route ("Markdown for Agents").                         */
/*  Never linked directly — middleware rewrites GET requests carrying         */
/*  Accept: text/markdown here. Fetches the page's own HTML over loopback     */
/*  (the internal fetch sends Accept: text/html, so it can't re-trigger the   */
/*  rewrite) and returns a Markdown rendition with Cloudflare-compatible      */
/*  x-markdown-tokens / x-original-tokens headers.                            */
/* -------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

/** Loopback origin of this same server. Behind Caddy the public Host carries
 *  no port, so we fall back to the port the server was started on. */
function internalOrigin(request: NextRequest): string {
  const port = request.nextUrl.port || process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const INTERNAL_ORIGIN = internalOrigin(request);
  const pagePath = "/" + (path ?? []).map(encodeURIComponent).join("/");

  const upstream = await fetch(
    `${INTERNAL_ORIGIN}${pagePath}${request.nextUrl.search}`,
    {
      headers: {
        accept: "text/html",
        "user-agent": request.headers.get("user-agent") ?? "fk-markdown-renderer",
        // Cookies are deliberately not forwarded: renditions are of the
        // public page, never a personalized one.
      },
      redirect: "manual",
      cache: "no-store",
    },
  );

  // Forward redirects, pointing the client back at the public path so it
  // re-negotiates (and never sees the loopback origin).
  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location") ?? "/";
    return NextResponse.redirect(
      new URL(location.replace(INTERNAL_ORIGIN, ""), request.nextUrl.origin),
      upstream.status,
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    // Non-HTML resource — nothing to convert, hand it through untouched.
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  }

  const html = await upstream.text();
  const { markdown, markdownTokens, originalTokens } = htmlToMarkdown(
    html,
    pagePath,
  );

  return new NextResponse(markdown, {
    status: upstream.status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(markdownTokens),
      "x-original-tokens": String(originalTokens),
      vary: "Accept",
      "cache-control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
