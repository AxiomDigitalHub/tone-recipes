import type { Metadata } from "next";
import { LegalShell } from "@/components/v3/LegalShell";

export const metadata: Metadata = {
  title: "Preview · Privacy Policy — Fader & Knob",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="May 1, 2026">
      <p>
        Fader &amp; Knob takes your privacy seriously. This page explains
        what we collect, why, and what we do with it.
      </p>

      <h2>What we collect</h2>
      <p>
        When you create an account: your display name, email address, and
        an encrypted password hash. When you save a recipe, download a
        preset, or comment, we record the action against your account so
        you can find it later.
      </p>
      <p>
        We use Microsoft Clarity and Google Analytics to understand how
        visitors use the site. Both products receive truncated IP
        addresses and behavior data — they do not receive your name or
        email.
      </p>

      <h2>What we don&apos;t do</h2>
      <ul>
        <li>We don&apos;t sell your data to third parties.</li>
        <li>
          We don&apos;t share your email with anyone other than our email
          provider (Resend) for delivery.
        </li>
        <li>
          We don&apos;t track you across sites you visit after leaving
          ours.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We set a session cookie when you sign in. We use first-party
        analytics cookies for Microsoft Clarity and Google Analytics. You
        can reject these from your browser settings; the site still works.
      </p>

      <h2>Your rights</h2>
      <p>
        You can export or delete your account data at any time from your
        dashboard. Email{" "}
        <a href="mailto:hello@faderandknob.com">hello@faderandknob.com</a>{" "}
        with any privacy questions.
      </p>

      <p>
        <em>
          This is a preview / placeholder. Final policy will be reviewed
          by counsel before launch.
        </em>
      </p>
    </LegalShell>
  );
}
