import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/saved", "/api/"],
      },
    ],
    sitemap: "https://faderandknob.com/sitemap.xml",
  };
}
