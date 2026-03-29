import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Tone Recipes",
  description:
    "Compare two guitar tone recipes side by side. See signal chain differences, settings, and platform translations at a glance.",
  openGraph: {
    title: "Compare Tone Recipes | Fader & Knob",
    description:
      "Compare two guitar tone recipes side by side. See signal chain differences, settings, and platform translations.",
    type: "website",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
