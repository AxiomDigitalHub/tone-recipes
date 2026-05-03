import type { Metadata } from "next";
import { LegalShell } from "../_components/LegalShell";

export const metadata: Metadata = {
  title: "Preview · Terms of Service — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="May 1, 2026">
      <p>
        By using Fader &amp; Knob you agree to these terms. If you don&apos;t
        agree, please don&apos;t use the site.
      </p>

      <h2>Your account</h2>
      <p>
        You&apos;re responsible for the activity on your account. Pick a
        password you don&apos;t use anywhere else. If you think someone is
        using your account without permission, email us right away.
      </p>

      <h2>Tone recipes &amp; presets</h2>
      <p>
        Recipes and presets are for personal use. Don&apos;t republish them
        as your own work, package them into a competing product, or sell
        them. Use them for your gigs, your sessions, and your bedroom
        practice — that&apos;s what they&apos;re for.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Tone Pass and Pro subscriptions bill monthly. You can cancel from
        your dashboard at any time and keep access until the end of the
        billing period. We don&apos;t issue refunds for partial months.
      </p>

      <h2>Content you post</h2>
      <p>
        Comments, recipe requests, and forum posts are yours. By posting,
        you grant us a non-exclusive license to display them on the site.
        Don&apos;t post anything illegal, defamatory, or that infringes
        anyone&apos;s rights.
      </p>

      <h2>Liability</h2>
      <p>
        We do our best to be accurate, but we can&apos;t guarantee perfect
        recipes. Modeler firmware updates, gear variations, and your room
        all affect tone. The site is provided as-is.
      </p>

      <p>
        Questions:{" "}
        <a href="mailto:hello@faderandknob.com">hello@faderandknob.com</a>
      </p>

      <p>
        <em>
          This is a preview / placeholder. Final terms will be reviewed by
          counsel before launch.
        </em>
      </p>
    </LegalShell>
  );
}
