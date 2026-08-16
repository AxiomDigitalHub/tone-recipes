import type { Metadata } from "next";
import { LegalShell } from "@/components/v3/LegalShell";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Fader & Knob",
  description:
    "Which gear links on Fader & Knob earn a commission, which retailers we work with, and why a recipe's signal chain is never chosen to sell you anything.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliatePage() {
  return (
    <LegalShell title="Affiliate Disclosure" updated="July 29, 2026">
      <p>
        Some of the gear links on Fader &amp; Knob are affiliate links —
        clicking through and buying may earn us a commission at no extra
        cost to you. Reverb, Sweetwater, and Amazon are the main ones.
      </p>

      <p>
        <strong>
          As an Amazon Associate we earn from qualifying purchases.
        </strong>
      </p>

      <h2>About the prices we quote</h2>
      <p>
        Any price on this site is an approximate street price at the time we
        wrote the piece — a rough guide to what tier of gear we&apos;re
        talking about. It is not a live quote from any retailer, and it is
        not Amazon&apos;s price. Prices change constantly; the retailer&apos;s
        own page is the only accurate one. Always check there before buying.
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

      <h2>Where the links actually appear</h2>
      <p>
        Buying links show up in three places: gear mentioned in blog posts,
        the gear pages themselves, and a single module on recipe pages that
        surfaces the microphone from that recipe&apos;s chain. The recipe
        module is the only one placed automatically, and it renders nothing
        when the chain&apos;s mic can&apos;t be resolved to a product — it
        doesn&apos;t substitute something else in to fill the slot.
      </p>
      <p>
        The signal chain itself is never an ad. Blocks are listed in the
        order the original rig used them, and no block is added, removed, or
        swapped for a more expensive alternative because it happens to be
        purchasable.
      </p>

      <h2>Gear you can&apos;t buy</h2>
      <p>
        A lot of what these recipes call for is a 1959 amp, a discontinued
        pedal, or a specific studio&apos;s console. There&apos;s no link for
        those, and we don&apos;t pretend a modern reissue is the same thing.
        Where a current-production equivalent gets genuinely close, the
        recipe says how close and where it differs — which is also why the
        modeler translations exist: they&apos;re the realistic route to most
        of these tones.
      </p>

      <h2>Disclosure on individual posts</h2>
      <p>
        Where a post is sponsored or includes review units, we say so at
        the top of the post in plain language. We don&apos;t hide
        sponsored content among our editorial.
      </p>

      <p>
        Questions: <ContactEmailLink />
      </p>
    </LegalShell>
  );
}
