import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        protocol: "https",
        hostname: "line6.com",
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "www.kemper-amps.com",
      },
      {
        protocol: "https",
        hostname: "www.fractalaudio.com",
      },
      {
        protocol: "https",
        hostname: "static.roland.com",
      },
      {
        protocol: "https",
        hostname: "www.ikmultimedia.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
