import type { Metadata } from "next";
import { LegalShell } from "@/components/v3/LegalShell";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function AffiliatePage() {
  return (
    <LegalShell title="Affiliate Disclosure" updated="May 1, 2026">
      <p>
        Some of the gear links on Fader &amp; Knob are affiliate links —
        clicking through and buying may earn us a commission at no extra
        cost to you. Reverb, Sweetwater, and Amazon are the main ones.
      </p>

      <h2>What this changes about how we write</h2>
      <p>
        Nothing. We don&apos;t take money to recommend gear. We use the
        gear we use because it works. The recipes name period-correct
        equipment because that&apos;s what was on the recording, not
        because anyone paid us to say so.
      </p>
      <p>
        If a recipe lists the Tube Screamer, it&apos;s because the recipe
        actually uses it. The link to buy one is a convenience; the
        recommendation is independent.
      </p>

      <h2>Disclosure on individual posts</h2>
      <p>
        Where a post is sponsored or includes review units, we say so at
        the top of the post in plain language. We don&apos;t hide
        sponsored content among our editorial.
      </p>

      <p>
        Questions:{" "}
        <a href="mailto:hello@faderandknob.com">hello@faderandknob.com</a>
      </p>
    </LegalShell>
  );
}
