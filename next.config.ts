import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) so the site runs on any
  // Node host / Docker image with `node server.js` — no Vercel required.
  // Vercel's build infra ignores this setting, so it's a no-op while we're
  // still deployed there. See Dockerfile + docs/MIGRATION.md.
  output: "standalone",
  // Pin the tracing root to THIS project. A stray lockfile in a parent dir
  // otherwise makes Next infer a broader workspace root, which nests the
  // standalone output under .next/standalone/tone-recipes/ and breaks the
  // Dockerfile's COPY paths.
  outputFileTracingRoot: process.cwd(),
  // Keep the headless-Chrome packages OUT of the bundler. Next/Turbopack
  // otherwise relocates @sparticuz/chromium and drops its bin/ brotli
  // payload (the actual Chromium binary), which 500s the PDF download with
  // 'input directory .../@sparticuz/chromium/bin does not exist'. These
  // must stay external so the files ship intact in the serverless function.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // serverExternalPackages keeps chromium's require external, but its bin/
  // brotli payload is read from disk (not require()'d), so Next's file
  // tracing drops it from the serverless function — the PDF route then 500s
  // with 'input directory .../@sparticuz/chromium/bin does not exist'. Force
  // the whole package (incl. bin/) into the download function's trace.
  // Glob key (not the literal [slug] route — brackets are glob char-classes).
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
