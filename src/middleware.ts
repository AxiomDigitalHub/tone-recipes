import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* -------------------------------------------------------------------------- */
/*  Geo-blocking: OFAC-sanctioned + high-risk countries                       */
/*  Reads Cloudflare's cf-ipcountry (ISO 3166-1 alpha-2). REQUIRES the       */
/*  "IP Geolocation" toggle in the Cloudflare dashboard (Network tab) —      */
/*  without it the header never arrives and geo-blocking degrades open       */
/*  rather than locking everyone out. Cloudflare strips client-sent          */
/*  cf-* headers, so the value can't be forged through the proxy.            */
/* -------------------------------------------------------------------------- */

const BLOCKED_COUNTRIES = new Set([
  // OFAC fully sanctioned
  "IR", // Iran
  "KP", // North Korea
  "SY", // Syria
  "CU", // Cuba

  // High-risk for bot/scraping/fraud traffic
  "CN", // China
  "RU", // Russia
  "BY", // Belarus
]);

export function middleware(request: NextRequest) {
  // ---- Geo-block ----
  const country = request.headers.get("cf-ipcountry") ?? "";
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Access restricted in your region.", {
      status: 403,
    });
  }

  // ---- www → non-www redirect ----
  // (Also handled at the Caddy layer in production; kept here for any host
  // that fronts the app without that rule.)
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const newUrl = new URL(request.url);
    newUrl.host = host.replace(/^www\./, "");
    // Behind a reverse proxy request.url carries the internal port (:3000)
    // and plain http — strip/normalize so the redirect target is the real
    // public origin, not https://faderandknob.com:3000/.
    newUrl.port = "";
    newUrl.protocol = "https:";
    return NextResponse.redirect(newUrl, 301);
  }

  // ---- /community/forum/* → /blog (forum retired 2026-05-12) ----
  // The forum saw no meaningful engagement after months live (per the
  // 2026-05 product audit). 301 preserves inbound link juice; we
  // surface the editorial blog instead, which is where the actual
  // discussion energy is.
  if (request.nextUrl.pathname.startsWith("/community/forum")) {
    return NextResponse.redirect(new URL("/blog", request.url), 301);
  }

  // ---- Markdown for Agents: Accept: text/markdown → markdown rendition ----
  // In-app equivalent of Cloudflare's "Markdown for Agents" (Pro-plan-only,
  // this zone is Free). Agents that ask for text/markdown get a converted
  // rendition via the internal /agent-md route; browsers never send this
  // Accept value, so HTML stays the default. Extension'd paths (llms.txt,
  // feed.xml, sitemap.xml, …) are already plaintext/XML and stay untouched.
  const pathname = request.nextUrl.pathname;
  if (
    request.method === "GET" &&
    (request.headers.get("accept") ?? "").includes("text/markdown") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/agent-md") &&
    !/\.[a-z0-9]+$/i.test(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/agent-md${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Admin route protection is handled by DashboardShell (auth gate
  // for all /dashboard/* routes) + AdminGuard (role check for
  // super_admin/admin). No middleware check needed — the old one
  // caused a redirect loop because it competed with the client-side
  // auth hydration in DashboardShell.

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files
  // Exclude API webhooks (they need raw body, not middleware processing)
  matcher: ["/((?!_next/static|_next/image|favicon\\.svg|api/webhooks/).*)"],
};
