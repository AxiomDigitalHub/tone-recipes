import BrowseContent from "@/components/browse/BrowseContent";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Tone Recipes",
  description:
    "Browse song-specific guitar tone recipes. Filter by genre, artist, and platform for Helix, Quad Cortex, TONEX, and more.",
  openGraph: {
    title: "Browse Tone Recipes",
    description:
      "Browse song-specific guitar tone recipes. Filter by genre, artist, and platform.",
    type: "website",
  },
  keywords: ["browse tone recipes", "guitar tone", "signal chain", "genre filter", "platform filter"],
};

export default function BrowsePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Browse Tone Recipes",
    "description": "Browse song-specific guitar tone recipes. Filter by genre, artist, and platform.",
    "url": "https://faderandknob.com/browse",
    "isPartOf": { "@type": "WebSite", "name": "Fader & Knob", "url": "https://faderandknob.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BrowseContent />
    </>
  );
}
