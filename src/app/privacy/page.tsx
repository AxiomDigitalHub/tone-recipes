import type { Metadata } from "next";
import Link from "next/link";

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
      <p className="mb-10 text-sm text-zinc-500">Last updated: April 10, 2026</p>

      <div className="space-y-10 leading-relaxed text-zinc-300">
        {/* ---- Plain language intro ---- */}
        <section>
          <p>
            Fader &amp; Knob is operated by Axiom Digital, LLC (&quot;Fader
            &amp; Knob,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            This Privacy Policy explains what we collect, why we collect it, and
            what you can do about it. We&apos;ve written it in plain language
            instead of legalese wherever possible. If something is unclear, email
            us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            .
          </p>
          <p className="mt-4">
            The short version: we collect the minimum data needed to run the
            site, we don&apos;t sell your data to anyone, we use analytics to
            understand what&apos;s working, and you can delete your account at
            any time.
          </p>
        </section>

        {/* ---- 1: Information We Collect ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            1. Information We Collect
          </h2>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Account Information</h3>
          <p>
            When you sign up using Google, we receive your name, email address,
            and profile photo from Google. We store this information so you can
            sign back in, save recipes to your account, and appear in community
            features if you participate. We never receive or store your Google
            password.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Payment Information</h3>
          <p>
            When you subscribe to a paid plan or purchase a Set Pack, payment is
            processed by Stripe. We never see or store your full credit card
            number. Stripe provides us with a customer ID and a subscription ID
            that we use to manage your account access. Stripe&apos;s handling of
            your payment information is governed by{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Stripe&apos;s privacy policy
            </a>
            .
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Usage Data</h3>
          <p>
            We automatically collect information about how you interact with the
            site: pages visited, recipes viewed, preset files downloaded, search
            queries, preferred modeler platform, and which recipes you save. We
            use this to improve the site and recommend recipes that match your
            interests.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Community Content</h3>
          <p>
            If you post comments, forum messages, ratings, or submit tone
            recipes, that content is stored and displayed publicly under your
            display name. Do not post anything you wouldn&apos;t be comfortable
            sharing publicly.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Cookies &amp; Local Storage</h3>
          <p>
            We use essential cookies for authentication sessions and
            localStorage to save your preferences (preferred platform, saved
            recipes, theme). We also use analytics cookies via Google Analytics,
            Microsoft Clarity, and Contentsquare. You can disable non-essential
            cookies in your browser settings without breaking core functionality.
          </p>
        </section>

        {/* ---- 2: How We Use Your Information ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Create and manage your account</li>
            <li>Process payments and manage subscriptions</li>
            <li>Save your favorite tone recipes and gear preferences</li>
            <li>Show platform-specific signal chains for your modeler</li>
            <li>Deliver newsletter content you&apos;ve subscribed to</li>
            <li>Display community content (comments, forum posts, ratings)</li>
            <li>Understand which pages and features work (site analytics)</li>
            <li>Enforce our Terms of Service and community guidelines</li>
            <li>Respond to your emails when you contact us</li>
          </ul>
          <p className="mt-4">
            We do <strong className="text-zinc-100">not</strong> sell your personal
            data to advertisers or data brokers. We do not share your email with
            third parties for marketing purposes.
          </p>
        </section>

        {/* ---- 3: Third-Party Services ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            3. Third-Party Services
          </h2>
          <p className="mb-3">
            We use these services to run the site. Each has its own privacy
            policy, which we encourage you to read.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-200">Supabase</strong> — authentication
              and database hosting
            </li>
            <li>
              <strong className="text-zinc-200">Vercel</strong> — website hosting
              and performance analytics
            </li>
            <li>
              <strong className="text-zinc-200">Stripe</strong> — payment
              processing for subscriptions and one-time purchases
            </li>
            <li>
              <strong className="text-zinc-200">Google OAuth</strong> — sign-in
              authentication
            </li>
            <li>
              <strong className="text-zinc-200">Google Analytics</strong> —
              aggregated traffic analysis
            </li>
            <li>
              <strong className="text-zinc-200">Microsoft Clarity</strong> —
              behavioral analytics including heatmaps and session replay (see
              Section 4 below)
            </li>
            <li>
              <strong className="text-zinc-200">Contentsquare</strong> — user
              experience analytics
            </li>
            <li>
              <strong className="text-zinc-200">Cloudflare R2</strong> — storage
              for audio reference files
            </li>
            <li>
              <strong className="text-zinc-200">
                Affiliate networks (Sweetwater, zZounds, Plugin Boutique, Amazon
                Associates)
              </strong>{" "}
              — when you click an affiliate link, third-party cookies may be set
              on the retailer&apos;s site. See our{" "}
              <Link
                href="/affiliate-disclosure"
                className="text-amber-400 underline hover:text-amber-300"
              >
                Affiliate Disclosure
              </Link>
              .
            </li>
          </ul>
        </section>

        {/* ---- 4: Analytics and Session Replay ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            4. Analytics and Session Replay
          </h2>
          <p>
            We use Microsoft Clarity and Contentsquare to capture how you use the
            site through heatmaps and session replay. This helps us identify
            confusing UI, broken pages, and opportunities to improve. Clarity
            masks sensitive input fields by default (passwords, payment
            information). For more details, see the{" "}
            <a
              href="https://www.microsoft.com/privacy/privacystatement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Microsoft Privacy Statement
            </a>
            .
          </p>
          <p className="mt-3">
            You can opt out of Google Analytics by installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            . You can disable all analytics cookies by enabling &quot;Do Not
            Track&quot; in your browser or by blocking third-party cookies.
          </p>
        </section>

        {/* ---- 5: AI-Generated Content ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            5. AI-Generated Content
          </h2>
          <p>
            Fader &amp; Knob uses AI to research tones, write blog posts, and
            generate preset files. Every preset we publish is verified on real
            hardware before release. We disclose this openly on our{" "}
            <Link
              href="/how-we-work"
              className="text-amber-400 underline hover:text-amber-300"
            >
              How We Work
            </Link>{" "}
            page. We do not use your personal data to train any AI model. If you
            submit a recipe or post in the forum, we may use that content as
            reference or training data for internal tone analysis features, but
            only in aggregate and anonymized form. You can opt out by contacting
            us.
          </p>
        </section>

        {/* ---- 6: Data Retention and Deletion ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            6. Data Retention and Deletion
          </h2>
          <p>
            We retain your account data for as long as your account is active.
            You can request account deletion at any time by emailing{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            . Within 30 days of a deletion request:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Your profile, saved recipes, and gear collection are removed</li>
            <li>
              Your comments and forum posts are removed or anonymized at our
              discretion
            </li>
            <li>
              Your Stripe customer record is marked for deletion (Stripe retains
              transaction records for 7 years per US tax law)
            </li>
            <li>
              Aggregated analytics data (page views, download counts) is
              retained but is no longer linked to you
            </li>
          </ul>
        </section>

        {/* ---- 7: Data Security ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            7. Data Security
          </h2>
          <p>
            We use HTTPS encryption site-wide, OAuth 2.0 for authentication,
            row-level security on our database, and rate limiting on every API
            endpoint. We never store passwords or full credit card numbers. We
            take security seriously, but no method of transmission over the
            internet is 100% secure. If we ever discover a breach that exposes
            your personal information, we will notify affected users by email
            within 72 hours of discovery.
          </p>
        </section>

        {/* ---- 8: Children's Privacy ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Fader &amp; Knob is not directed at children under 13, and we do not
            knowingly collect personal information from anyone under 13. If we
            learn that we have collected information from a child under 13, we
            will delete it promptly. If you believe a child under 13 has given us
            personal information, please contact us.
          </p>
        </section>

        {/* ---- 9: Your Rights ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            9. Your Rights
          </h2>
          <p>
            Depending on where you live, you may have the right to:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (see Section 6)</li>
            <li>Object to or restrict processing of your data</li>
            <li>
              Receive your data in a portable format (JSON export on request)
            </li>
            <li>
              Withdraw consent for marketing communications at any time
              (unsubscribe link in every email)
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            . We&apos;ll respond within 30 days.
          </p>
          <p className="mt-3">
            <strong className="text-zinc-200">California residents:</strong>{" "}
            Under the CCPA/CPRA, you have the right to know what personal
            information we collect, request deletion, and opt out of the sale of
            personal information. We do not sell personal information. To
            exercise your rights, contact us using the email above.
          </p>
          <p className="mt-3">
            <strong className="text-zinc-200">EU/UK residents:</strong> Under
            the GDPR and UK GDPR, you have additional rights including the right
            to lodge a complaint with your local data protection authority.
          </p>
        </section>

        {/* ---- 10: Changes ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we make
            material changes, we will update the &quot;Last updated&quot; date at
            the top of this page and, for significant changes, notify active
            users by email. Continued use of the site after changes means you
            accept the updated policy.
          </p>
        </section>

        {/* ---- 11: Contact ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            11. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or want to exercise
            your rights, reach us at:
          </p>
          <p className="mt-3">
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
          </p>
          <p className="mt-3">
            Axiom Digital, LLC
            <br />
            Attn: Privacy
            <br />
            United States
          </p>
        </section>
      </div>
    </main>
  );
}
