import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Fader & Knob — the rules for using our tone recipe database, preset downloads, and community features.",
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-zinc-100">Terms of Service</h1>
      <p className="mb-10 text-sm text-zinc-500">Last updated: April 10, 2026</p>

      <div className="space-y-10 leading-relaxed text-zinc-300">
        {/* ---- Intro ---- */}
        <section>
          <p>
            Welcome to Fader &amp; Knob. These Terms of Service (&quot;Terms&quot;)
            are a contract between you and Axiom Digital, LLC (&quot;Fader &amp;
            Knob,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). They
            govern your use of{" "}
            <span className="text-amber-400">faderandknob.com</span> and all
            related services, including tone recipes, preset downloads, community
            features, and paid subscriptions.
          </p>
          <p className="mt-4">
            We&apos;ve written these Terms in plain language wherever possible.
            By using Fader &amp; Knob, you agree to be bound by them. If you
            don&apos;t agree, please don&apos;t use the site.
          </p>
        </section>

        {/* ---- 1: Who Can Use ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            1. Who Can Use Fader &amp; Knob
          </h2>
          <p>
            You must be at least 13 years old to use the site, and at least 18 or
            the age of majority in your jurisdiction to purchase a paid
            subscription or Set Pack. By creating an account, you confirm that
            you meet these age requirements and that the information you provide
            is accurate.
          </p>
          <p className="mt-3">
            You are responsible for maintaining the security of your account.
            Don&apos;t share your login credentials. If you suspect unauthorized
            access, notify us immediately at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            .
          </p>
        </section>

        {/* ---- 2: What Fader & Knob Provides ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            2. What Fader &amp; Knob Provides
          </h2>
          <p>
            Fader &amp; Knob is a guitar tone recipe database. We provide:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Signal chain breakdowns and settings for specific guitar tones
            </li>
            <li>
              Downloadable preset files for guitar modelers (Helix, Boss Katana,
              and others)
            </li>
            <li>
              Set Packs: grouped presets designed for specific genres or
              setlists
            </li>
            <li>Blog content and educational resources about guitar tone</li>
            <li>
              Community features including comments, forum posts, and user
              ratings
            </li>
            <li>Tone recipes organized by song, artist, gear, and platform</li>
          </ul>
          <p className="mt-3">
            Our content is researched and written with AI assistance and
            verified by humans on real hardware. See our{" "}
            <Link
              href="/how-we-work"
              className="text-amber-400 underline hover:text-amber-300"
            >
              How We Work
            </Link>{" "}
            page for details.
          </p>
        </section>

        {/* ---- 3: Accounts and Subscriptions ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            3. Accounts and Subscriptions
          </h2>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Free Tier</h3>
          <p>
            Anyone can create a free account. The free tier includes access to
            the recipe database, up to 5 saved recipes, and up to 10 preset
            downloads total.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Paid Subscriptions</h3>
          <p>
            We offer paid subscriptions (Tone Pass and Pro) that unlock
            unlimited preset downloads, unlimited saves, Set Packs, and other
            features. Prices and features are listed on our{" "}
            <Link
              href="/pricing"
              className="text-amber-400 underline hover:text-amber-300"
            >
              pricing page
            </Link>
            . All prices are in US dollars.
          </p>
          <p className="mt-3">
            Paid subscriptions are billed monthly through Stripe. By subscribing,
            you authorize us to charge your payment method on a recurring basis
            until you cancel. Your subscription auto-renews each billing period.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Cancellation</h3>
          <p>
            You can cancel your subscription at any time from the Billing
            section of your dashboard settings. Cancellation takes effect at the
            end of your current billing period. You will continue to have paid
            access until that date. We do not offer prorated refunds for partial
            months.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Refunds</h3>
          <p>
            Because our product is digital and delivered instantly, all sales
            are final. However, if you experience a genuine issue (a preset
            file doesn&apos;t load, you were charged in error, a technical
            problem prevents you from using the service), contact us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>{" "}
            and we&apos;ll review your request in good faith. We want you to be
            happy with what you paid for.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Price Changes</h3>
          <p>
            We may change subscription prices from time to time. If we raise the
            price of your subscription, we&apos;ll notify you by email at least
            30 days before the change takes effect. You can cancel before the new
            price takes effect if you don&apos;t want to continue.
          </p>
        </section>

        {/* ---- 4: Preset Files and Licensing ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            4. Preset Files and Licensing
          </h2>
          <p>
            When you download a preset file from Fader &amp; Knob, we grant you a
            personal, non-exclusive, non-transferable license to use that preset
            on your own guitar modelers for your own playing, practice,
            recording, performance, and creative work.
          </p>
          <p className="mt-3">
            You <strong className="text-zinc-200">may</strong>:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Use the presets in your own music productions and recordings</li>
            <li>Perform live with the presets at gigs and shows</li>
            <li>Modify the presets to fit your rig and playing style</li>
            <li>
              Use the presets in content you create (covers, tutorials,
              streams) without royalty payments to us
            </li>
          </ul>
          <p className="mt-3">
            You <strong className="text-zinc-200">may not</strong>:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Redistribute, resell, or share the preset files (original or
              modified) as standalone products
            </li>
            <li>
              Include Fader &amp; Knob presets in commercial preset packs sold
              or given away by anyone else
            </li>
            <li>
              Upload our preset files to public preset-sharing platforms (like
              Line 6 CustomTone or Cortex Cloud) without our written permission
            </li>
            <li>Claim authorship of presets you download from us</li>
          </ul>
          <p className="mt-3">
            If you want to include Fader &amp; Knob content in a course,
            tutorial, book, or commercial product, contact us — we&apos;re
            generally open to reasonable requests.
          </p>
        </section>

        {/* ---- 5: User-Generated Content ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            5. User-Generated Content
          </h2>
          <p>
            When you post comments, forum messages, ratings, tone recipes, or
            other content on Fader &amp; Knob (&quot;User Content&quot;), you
            retain ownership of that content. However, you grant us a worldwide,
            royalty-free, non-exclusive license to display, reproduce, modify
            (for formatting), and distribute your User Content on the site and
            in our marketing materials.
          </p>
          <p className="mt-3">
            You represent that you have the right to post any User Content you
            share and that it does not violate the rights of any third party.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Community Rules</h3>
          <p>You agree not to post content that:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Is illegal, harassing, abusive, threatening, or hateful</li>
            <li>
              Infringes someone else&apos;s copyright, trademark, or other
              rights
            </li>
            <li>
              Contains spam, malware, phishing links, or commercial solicitations
              unrelated to guitar tone
            </li>
            <li>
              Impersonates another person or misrepresents your affiliation
            </li>
            <li>
              Contains sexually explicit material or content harmful to minors
            </li>
            <li>Attempts to manipulate ratings, reviews, or search rankings</li>
          </ul>
          <p className="mt-3">
            We reserve the right to remove any User Content that violates these
            rules and to suspend or terminate accounts that repeatedly violate
            them. We use a combination of automated and human moderation.
          </p>
        </section>

        {/* ---- 6: Intellectual Property ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            6. Intellectual Property
          </h2>
          <p>
            Everything on Fader &amp; Knob that isn&apos;t User Content —
            including the site design, code, logos, written content, signal
            chain graphics, and preset files we publish — is owned by Axiom
            Digital, LLC or used with permission. You may not copy, scrape,
            reverse-engineer, or redistribute our content without written
            permission.
          </p>
          <p className="mt-3">
            References to guitar models, amps, pedals, and artists on our site
            are for educational and identification purposes only. Trademarks and
            brand names belong to their respective owners. Fader &amp; Knob is
            not affiliated with, endorsed by, or sponsored by any guitar, amp,
            modeler, or artist mentioned on the site unless explicitly stated.
          </p>

          <h3 className="mb-1 mt-4 font-medium text-zinc-200">Copyright Complaints (DMCA)</h3>
          <p>
            If you believe content on Fader &amp; Knob infringes your copyright,
            send a written notice to{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>{" "}
            with the subject line &quot;DMCA Notice&quot;. Include:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>A description of the copyrighted work you claim is infringed</li>
            <li>A link to where the allegedly infringing content appears</li>
            <li>Your contact information</li>
            <li>
              A statement that you have a good-faith belief the use is not
              authorized
            </li>
            <li>
              A statement, under penalty of perjury, that the information in
              your notice is accurate and that you are the copyright owner or
              authorized to act on their behalf
            </li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p className="mt-3">
            We will review and respond promptly. Repeat infringers will have
            their accounts terminated.
          </p>
        </section>

        {/* ---- 7: Acceptable Use ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            7. Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Use the site for any illegal purpose</li>
            <li>
              Attempt to gain unauthorized access to our systems or other users&apos;
              accounts
            </li>
            <li>
              Scrape, crawl, or bulk-download content without our written
              permission
            </li>
            <li>
              Interfere with or disrupt the site, servers, or networks
              (DDoS, exploit scanning, etc.)
            </li>
            <li>
              Reverse-engineer or attempt to extract our source code or preset
              generation logic
            </li>
            <li>
              Use the site to train machine learning models without our written
              permission
            </li>
            <li>
              Circumvent rate limits, paywalls, or access controls
            </li>
            <li>
              Create multiple accounts to abuse free tier limits or promotional
              offers
            </li>
          </ul>
          <p className="mt-3">
            Violation of these rules may result in suspension or termination of
            your account and, in serious cases, legal action.
          </p>
        </section>

        {/* ---- 8: Disclaimers ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            8. Disclaimers
          </h2>
          <p>
            Fader &amp; Knob is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, express or implied.
            We make no guarantee that:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Every preset will sound identical to the original recording — tone
              depends on your guitar, pickups, playing style, and rig
            </li>
            <li>
              Every preset will load without issues on every firmware version
              of every modeler
            </li>
            <li>The site will be available 100% of the time</li>
            <li>The content will be free of errors or inaccuracies</li>
          </ul>
          <p className="mt-3">
            We test our presets on real hardware and do our best to keep content
            accurate, but guitar tone is subjective and hardware configurations
            vary. If you find something wrong, please tell us so we can fix it.
          </p>
        </section>

        {/* ---- 9: Limitation of Liability ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            9. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Fader &amp; Knob and Axiom
            Digital, LLC are not liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            site, including lost profits, lost data, or damage to your
            equipment.
          </p>
          <p className="mt-3">
            Our total liability for any claim arising from your use of the site
            is limited to the amount you paid us in the 12 months preceding the
            claim, or $100, whichever is greater.
          </p>
          <p className="mt-3">
            Some jurisdictions don&apos;t allow limitations on implied
            warranties or liability, so parts of this section may not apply to
            you.
          </p>
        </section>

        {/* ---- 10: Termination ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            10. Termination
          </h2>
          <p>
            You can terminate your account at any time by contacting us. We can
            terminate or suspend your account if you violate these Terms, abuse
            the service, or for any other legitimate business reason. On
            termination:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Your access to paid features ends immediately</li>
            <li>Your account data is removed per our Privacy Policy</li>
            <li>
              Any unused portion of a paid subscription is forfeited (no
              prorated refund)
            </li>
            <li>
              Presets you already downloaded before termination remain licensed
              to you for personal use
            </li>
          </ul>
        </section>

        {/* ---- 11: Changes to Terms ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            11. Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. When we make material
            changes, we will update the &quot;Last updated&quot; date at the top
            of this page and, for significant changes affecting paid subscribers,
            notify you by email at least 30 days before the change takes effect.
            Continued use of the site after changes take effect means you accept
            the updated Terms.
          </p>
        </section>

        {/* ---- 12: Governing Law ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            12. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by the laws of the State of Washington,
            United States, without regard to its conflict of laws principles.
            Any dispute arising from these Terms or your use of the site will be
            resolved in the state or federal courts located in Snohomish County,
            Washington, and you consent to the jurisdiction of those courts.
          </p>
          <p className="mt-3">
            Before filing any legal action, we encourage you to contact us first
            at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-amber-400 underline hover:text-amber-300"
            >
              hello@faderandknob.com
            </a>
            . Most issues can be resolved without involving lawyers.
          </p>
        </section>

        {/* ---- 13: Contact ---- */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            13. Contact
          </h2>
          <p>
            Questions about these Terms? Email us:
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
            United States
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            By using Fader &amp; Knob, you acknowledge that you&apos;ve read,
            understood, and agree to these Terms of Service and our{" "}
            <Link
              href="/privacy"
              className="text-amber-400 underline hover:text-amber-300"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
