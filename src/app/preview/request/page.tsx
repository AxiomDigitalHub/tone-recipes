import type { Metadata } from "next";
import RequestClient from "./RequestClient";

export const metadata: Metadata = {
  title: "Request a tone — Fader & Knob",
  description:
    "Tell us what tone you want next. Submit a song, the community upvotes it, we cut a verified recipe.",
  openGraph: {
    title: "Request a tone — Fader & Knob",
    description:
      "Submit a song, watch it climb the queue, get a verified recipe.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function PreviewRequestPage() {
  return <RequestClient />;
}
