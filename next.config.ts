import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // ───────────────────────────────────────────────────────────────────
      // v3 redesign cutover — uncomment these when /preview/* renames to /*.
      // Strategy: swap-in-place. Each /preview/<route> source is added once
      // the matching /<route> file lands the v3 chrome. Until then, leaving
      // these commented avoids a redirect loop (the /preview/* page would
      // redirect to itself before the rename is real).
      //
      // Status note: `/preview/recipe`, `/preview/song`, `/preview/artist`,
      // `/preview/platforms`, `/preview/browse`, `/preview/blog`, `/preview/about`,
      // `/preview/pricing`, `/preview/how-it-works`, `/preview/compare`, and
      // `/preview/gear/[slug]` are v3.9-ready (JSON-LD + metadata in place,
      // noindex still on).
      //
      // {
      //   source: "/preview/recipe/:slug",
      //   destination: "/recipe/:slug",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/song/:slug",
      //   destination: "/song/:slug",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/artist/:slug",
      //   destination: "/artist/:slug",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/platforms/:slug",
      //   destination: "/platforms/:slug",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/browse",
      //   destination: "/browse",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/blog",
      //   destination: "/blog",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/blog/:slug",
      //   destination: "/blog/:slug",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/about",
      //   destination: "/about",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/pricing",
      //   destination: "/pricing",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/how-it-works",
      //   destination: "/how-it-works",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/compare",
      //   destination: "/compare",
      //   permanent: true,
      // },
      // {
      //   source: "/preview/gear/:slug",
      //   destination: "/gear/:slug",
      //   permanent: true,
      // },
      // ───────────────────────────────────────────────────────────────────
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
