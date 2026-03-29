import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Fader & Knob — how we collect, use, and protect your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-zinc-100">Privacy Policy</h1>
      <p className="mb-10 text-sm text-zinc-500">Last updated: March 29, 2026</p>

      <div className="space-y-10 text-zinc-300 leading-relaxed">
        {/* ---- Intro ---- */}
        <p>
          Fader &amp; Knob (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          operates the website{" "}
          <span className="text-amber-400">faderandknob.com</span>. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website or create an account.
        </p>

        {/* ---- 1 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            1. Information We Collect
          </h2>
          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Account Information</h3>
          <p>
            When you sign up via Google OAuth, we receive your name, email
            address, and profile photo from Google. We store a display name and
            avatar URL in your profile. We do not receive or store your Google
            password.
          </p>
          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Usage Data</h3>
          <p>
            We automatically collect information about how you interact with the
            site, including pages visited, recipes viewed, preferred modeler
            platform, saved recipes, and search queries. This data helps us
            improve the experience and recommend relevant content.
          </p>
          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Cookies &amp; Local Storage</h3>
          <p>
            We use essential cookies for authentication sessions and localStorage
            to persist your preferences (e.g., preferred platform, theme). We
            also use analytics cookies via Vercel Analytics. You can disable
            non-essential cookies in your browser settings.
          </p>
        </section>

        {/* ---- 2 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Create and manage your account</li>
            <li>Save your favorite tone recipes and gear preferences</li>
            <li>Translate signal chains to your preferred modeler platform</li>
            <li>Deliver newsletter content you&apos;ve subscribed to</li>
            <li>Display community content (comments, forum posts, ratings)</li>
            <li>Analyze site usage to improve content and features</li>
            <li>Enforce our community guidelines and terms of service</li>
          </ul>
        </section>

        {/* ---- 3 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            3. Third-Party Services
          </h2>
          <p className="mb-3">
            We use the following third-party services that may collect or process
            your data:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-200">Supabase</strong> &mdash;
              Authentication and database hosting
            </li>
            <li>
              <strong className="text-zinc-200">Vercel</strong> &mdash; Website
              hosting and analytics
            </li>
            <li>
              <strong className="text-zinc-200">Google OAuth</strong> &mdash;
              Sign-in authentication
            </li>
            <li>
              <strong className="text-zinc-200">
                Affiliate Networks (FlexOffers, Sweetwater, Reverb, Amazon
                Associates)
              </strong>{" "}
              &mdash; Affiliate links on gear references. Clicking these may set
              third-party cookies on retailer sites.
            </li>
            <li>
              <strong className="text-zinc-200">Stripe</strong> &mdash; Payment
              processing for premium subscriptions (when applicable)
            </li>
          </ul>
          <p className="mt-3">
            Each service operates under its own privacy policy. We encourage you
            to review their policies.
          </p>
        </section>

        {/* ---- 4 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            4. Affiliate Links
          </h2>
          <p>
            Fader &amp; Knob participates in affiliate advertising programs. When
            we mention gear in tone recipes, those gear names may link to
            retailers like Sweetwater, Reverb, and Amazon. If you click an
            affiliate link and make a purchase, we may earn a commission at no
            additional cost to you. These affiliate relationships do not
            influence our editorial content, tone recipe recommendations, or
            gear ratings. For more details, see our{" "}
            <a
              href="/affiliate-disclosure"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Affiliate Disclosure
            </a>
            .
          </p>
        </section>

        {/* ---- 5 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            5. Data Retention &amp; Deletion
          </h2>
          <p>
            We retain your account data for as long as your account is active. You
            may request deletion of your account and all associated data at any
            time by contacting us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            . Upon deletion, your profile, saved recipes, comments, ratings, and
            forum posts will be permanently removed within 30 days.
          </p>
        </section>

        {/* ---- 6 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            6. Data Security
          </h2>
          <p>
            We use industry-standard security measures including HTTPS encryption,
            secure authentication via OAuth 2.0 with PKCE flow, and row-level
            security on our database. However, no method of transmission over the
            Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* ---- 7 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            7. Children&apos;s Privacy
          </h2>
          <p>
            Fader &amp; Knob is not directed at children under the age of 13. We
            do not knowingly collect personal information from children under 13.
            If you believe we have collected information from a child under 13,
            please contact us and we will promptly delete it.
          </p>
        </section>

        {/* ---- 8 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            8. Your Rights
          </h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability (receive your data in a structured format)</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            .
          </p>
        </section>

        {/* ---- 9 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will revise the &quot;Last updated&quot; date at the top of this page.
            We encourage you to review this policy periodically. Continued use of
            the site after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* ---- 10 ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            10. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or your data, reach
            out to us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
