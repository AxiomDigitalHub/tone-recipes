import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Fader & Knob affiliate disclosure — how we earn commissions through affiliate partnerships and how it affects (or doesn't affect) our editorial content.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold md:text-4xl">Affiliate Disclosure</h1>
      <p className="mt-2 text-sm text-muted">
        Last updated: March 29, 2026
      </p>

      <div className="mt-10 space-y-8 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-3">
            Fader &amp; Knob is a participant in several affiliate advertising
            programs designed to provide a means for sites to earn advertising
            fees by linking to partnered retailers. When you click on certain
            links on our site and make a purchase, we may receive a small
            commission at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Our Affiliate Partners</h2>
          <p className="mt-3">
            We currently participate in the following affiliate programs:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Amazon Associates</strong> &mdash; As an Amazon Associate,
              Fader &amp; Knob earns from qualifying purchases made through
              links to amazon.com.
            </li>
            <li>
              <strong>Sweetwater</strong> &mdash; We earn commissions on
              purchases made through our Sweetwater affiliate links.
            </li>
            <li>
              <strong>Reverb</strong> &mdash; We earn commissions on qualifying
              purchases made through our Reverb affiliate links.
            </li>
            <li>
              <strong>FlexOffers</strong> &mdash; We participate in the
              FlexOffers affiliate network, which connects us with various music
              gear and equipment retailers.
            </li>
          </ul>
          <p className="mt-3">
            We may add or change affiliate partners over time. This page will be
            updated accordingly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            How Affiliate Links Work
          </h2>
          <p className="mt-3">
            Some of the links on Fader &amp; Knob &mdash; including links on
            gear pages, tone recipe pages, and blog posts &mdash; are affiliate
            links. When you click one of these links and complete a purchase on
            the retailer&rsquo;s site, we may earn a small commission from that
            sale. This commission comes from the retailer and does not increase
            the price you pay. You will never pay more by using our links
            compared to visiting the retailer directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            Editorial Independence
          </h2>
          <p className="mt-3">
            Our affiliate relationships do not influence our editorial content,
            tone recipe recommendations, or gear reviews in any way. Every tone
            recipe on Fader &amp; Knob is created based on genuine research into
            how artists achieve their signature sounds. Gear recommendations are
            based on sonic accuracy and practical usefulness &mdash; not on
            which products generate the highest commissions.
          </p>
          <p className="mt-3">
            We will never recommend a product solely because it has an affiliate
            program. All opinions, recommendations, and signal chain suggestions
            on this site are our own and reflect our honest assessment of what
            will help you achieve great tone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            Why We Use Affiliate Links
          </h2>
          <p className="mt-3">
            Running Fader &amp; Knob &mdash; researching tones, building signal
            chains, and maintaining the site &mdash; takes considerable time and
            resources. Affiliate commissions help us keep the site running and
            free to use. By purchasing through our links, you directly support
            the creation of more tone recipes and gear guides at no extra cost
            to yourself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">FTC Compliance</h2>
          <p className="mt-3">
            In accordance with the Federal Trade Commission&rsquo;s guidelines
            on endorsements and testimonials (16 CFR Part 255), we disclose our
            affiliate relationships on this page and throughout the site where
            affiliate links appear. Pages containing affiliate links include a
            disclosure notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p className="mt-3">
            If you have any questions about our affiliate relationships or this
            disclosure, please contact us at{" "}
            <a
              href="mailto:hello@faderandknob.com"
              className="text-accent hover:underline"
            >
              hello@faderandknob.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
