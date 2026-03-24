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
  return <BrowseContent />;
}
