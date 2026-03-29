import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Thread — Forum",
  description:
    "Start a new discussion in the Fader & Knob community forum. Ask questions, share gear tips, or talk tone with fellow guitarists.",
  openGraph: {
    title: "New Thread — Forum | Fader & Knob",
    description:
      "Start a new discussion in the Fader & Knob community forum. Ask questions, share gear tips, or talk tone.",
    type: "website",
  },
};

export default function NewThreadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
