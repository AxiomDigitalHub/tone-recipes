import type { Metadata } from "next";
import RequestClient from "./RequestClient";
import { getRequests } from "@/lib/db/tone-requests";

export const metadata: Metadata = {
  alternates: { canonical: "/request" },
  title: "Request a tone — Fader & Knob",
  description:
    "Tell us what tone you want next. Submit a song, the community upvotes it, we cut a verified recipe.",
  openGraph: {
    title: "Request a tone — Fader & Knob",
    description:
      "Submit a song, watch it climb the queue, get a verified recipe.",
    type: "website",
  },
};

// ISR: the queue used to be 100% client-fetched, so crawlers (which don't
// run JS) saw an empty shell. Server-render the first page of the queue —
// visible content is what gets retrieved (AI Search Playbook §2) — and
// refresh it every 5 minutes.
export const revalidate = 300;

export default async function PreviewRequestPage() {
  const initialRequests = await getRequests({ sort: "popular", limit: 20, offset: 0 });
  return <RequestClient initialRequests={initialRequests} />;
}
