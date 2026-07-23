import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) so the site runs on any
  // Node host / Docker image with `node server.js`. See Dockerfile +
  // docs/MIGRATION.md.
  output: "standalone",
  // Pin the tracing root to THIS project. A stray lockfile in a parent dir
  // otherwise makes Next infer a broader workspace root, which nests the
  // standalone output under .next/standalone/tone-recipes/ and breaks the
  // Dockerfile's COPY paths.
  outputFileTracingRoot: process.cwd(),
  // Keep the headless-Chrome packages OUT of the bundler. @sparticuz/chromium
  // is the PRODUCTION chromium (Debian's apt build SIGTRAPs in the slim
  // container — verified in-container 2026-07-08); external keeps its bin/
  // brotli payload intact in the standalone node_modules, and puppeteer-core
  // breaks its runtime file resolution when bundled.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // Belt-and-braces: force the whole package (incl. bin/) into the download
  // route's file trace so the payload always ships with the standalone build.
  outputFileTracingIncludes: {
    "/api/recipes/**": ["./node_modules/@sparticuz/chromium/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Agent discovery (RFC 8288): point crawling agents at the
          // machine-readable surfaces. rel=api-catalog (RFC 9727) resolves
          // to /.well-known/api-catalog (linkset+json of the surfaces we
          // actually serve — llms.txt + feeds; no fictional API advertised).
          // Global because agents land on deep links, not just /. llms.txt-
          // tier plumbing per AI_SEARCH_PLAYBOOK §4: harmless, cheap, zero
          // maintenance priority. (A homepage-scoped source: "/" rule didn't
          // match under output:standalone — kept global instead.)
          {
            key: "Link",
            value:
              '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="service-doc"; type="text/plain"; title="Site guide for LLM agents"',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blog/marshall-jcm800-settings-guide",
        destination: "/blog/jcm800-settings-guide",
        permanent: true,
      },
      {
        source: "/platforms/quad-cortex",
        destination: "/platforms/quad_cortex",
        permanent: true,
      },
      {
        source: "/recipes",
        destination: "/browse",
        permanent: true,
      },
      {
        source: "/recipes/:path*",
        destination: "/browse",
        permanent: true,
      },
      // v4 cutover — old /preview/* deep links 301 to canonical /<route>.
      // Catch-all rewrite via :path* picks up every nested URL.
      {
        source: "/preview/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/preview",
        destination: "/",
        permanent: true,
      },
      // Worship-tone duplicate consolidated 2026-06-15. Both posts targeted
      // the same "modern worship guitar tone helix" intent (cannibalization —
      // neither ranked). Canonical is /blog/worship-guitar-tone-helix, which
      // uses exact Helix model names (Essex A30 TB, Minotaur, Searchlights).
      {
        source: "/blog/modern-worship-guitar-tone-helix",
        destination: "/blog/worship-guitar-tone-helix",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
