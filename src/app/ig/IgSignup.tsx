"use client";

import { useState } from "react";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

/**
 * Reads utm_source / utm_content from the URL on the client, so /ig itself
 * stays statically cacheable (a page that reads searchParams can't be).
 * Defaults to instagram/bio — the link-in-profile URL carries no params.
 */
export default function IgSignup() {
  // Lazy initializer: on the server this yields the defaults; in the browser it reads the URL.
  // The value is only sent with the signup request, never rendered, so there's no hydration mismatch.
  const [utm] = useState<{ source: string; content: string | null }>(() => {
    if (typeof window === "undefined") return { source: "instagram", content: "bio" };
    const q = new URLSearchParams(window.location.search);
    return { source: q.get("utm_source") || "instagram", content: q.get("utm_content") || "bio" };
  });
  return (
    <NewsletterSignup
      variant="card"
      source="ig-link-page"
      utm={utm}
      headline="One sound, every setting, every Friday"
      subtext="Exact knob settings for Helix and HX Stomp — worship sounds, amp guides, fixes. Researched and written by AI; corrections published. Unsubscribe anytime."
    />
  );
}
