import Link from "next/link";
import type { Metadata } from "next";
import PlanCards from "@/components/pricing/PlanCards";

/**
 * JSON-LD: a Product + multi-Offer entry for each subscription tier
 * (Pass, Pro). Each tier carries two billing cadences (annual / monthly)
 * as two `Offer` entries — Google reads either depending on query
 * intent. Both link back to /pricing as the point-of-sale; checkout
 * itself happens via the embedded CheckoutButton, which Google doesn't
 * need to know about for the Product card.
 *
 * Pricing per docs/PRICING_MODEL.md (locked 2026-06-15).
 */
function subscriptionProduct(
  name: string,
  description: string,
  annual: string,
  monthly: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category: "Subscription",
    brand: { "@type": "Brand", name: "Fader & Knob" },
    url: "https://faderandknob.com/pricing",
    offers: [
      {
        "@type": "Offer",
        name: `${name} — annual`,
        priceCurrency: "USD",
        price: annual,
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: annual,
          priceCurrency: "USD",
          billingDuration: "P1Y",
          unitCode: "ANN",
        },
      },
      {
        "@type": "Offer",
        name: `${name} — monthly`,
        priceCurrency: "USD",
        price: monthly,
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: monthly,
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitCode: "MON",
        },
      },
    ],
  };
}

const PRICING_JSON_LD = [
  subscriptionProduct(
    "Fader & Knob Pass",
    "Unlimited preset downloads and recipe PDFs, early access to new recipes, and members-only deep-dive content.",
    "49.00",
    "4.99",
  ),
  subscriptionProduct(
    "Fader & Knob Pro",
    "Everything in Pass, plus every Set Pack included while subscribed, ToneTrace priority access, and a commercial-use license.",
    "79.00",
    "7.99",
  ),
];

export const metadata: Metadata = {
  title: "Pricing — Fader & Knob",
  description:
    "Free to browse every recipe. Pass ($49/yr) for unlimited downloads; Pro ($79/yr) bundles every Set Pack. Set Packs are also one-time purchases you keep forever.",
  openGraph: {
    title: "Pricing — Fader & Knob",
    description:
      "Free to browse. Pass for unlimited downloads. Pro bundles every Set Pack.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*  Set Pack card — one-time purchase, unchanged from prior model              */
/* -------------------------------------------------------------------------- */

const SET_PACK = {
  name: "Worship Set Pack",
  price: "$19",
  period: "one-time",
  blurb:
    "One Helix preset. 8 snapshots. 30 worship songs mapped to snapshots. Yours to keep.",
  features: [
    "FK-Worship.hlx preset",
    "8 snapshots — clean → rock crunch",
    "30-song Setlist Mapper",
    "Lifetime updates as the pack refines",
  ],
  cta: "Buy Worship Set Pack",
  href: "/set-packs/worship",
};

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                        */
/* -------------------------------------------------------------------------- */

const FAQ = [
  {
    q: "What's the difference between Free, Pass, and Pro?",
    a: "Free gives you the entire recipe catalog plus 5 preset downloads and 10 recipe PDFs per month. Pass ($49/yr) removes those quotas — unlimited downloads and PDFs — and adds early access to new recipes (1 week before public) and members-only deep-dive content. Pro ($79/yr) is everything in Pass plus every Set Pack included while you're subscribed, ToneTrace priority access at launch, and a commercial-use license.",
  },
  {
    q: "Pass or Pro — which should I pick?",
    a: "Start with Pass if you mostly want unlimited downloads and the members-only content. Pick Pro if you'd buy Set Packs: each pack is $19 on its own, so if you'd grab even one a year, Pro ($79/yr vs Pass's $49/yr) already pays for itself — and you get every future pack too while subscribed.",
  },
  {
    q: "Is there a free trial?",
    a: "The free tier IS the trial. 5 downloads per month, every feature visible, no card required. Try us for a month — if you're hitting the quota and want more, upgrade. If you're not hitting it, you didn't need a subscription anyway.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — from your dashboard, no email required, no friction. You keep your paid features until the end of the period you already paid for, then your account flips back to free (with the 5 downloads/month quota). No partial refunds for the unused portion of a paid period.",
  },
  {
    q: "Why one-time Set Pack pricing instead of subscription?",
    a: "Set Packs are a single solution to a single problem — your gig. One preset, eight snapshots, 30+ songs mapped. That's a thing you use forever, not a thing you re-evaluate every month. We sell it that way for everyone except Pro subscribers, who get every pack bundled.",
  },
  {
    q: "Will there be more Set Packs?",
    a: "Yes. Blues, Classic Rock, Metal, and Indie are next. Buy them à la carte ($19 each), or get every pack we ship included with Pro — for as long as you're subscribed.",
  },
  {
    q: "What about people on the old (2026) Tone Pass or Pro tiers?",
    a: "Those original plans are retired and are unrelated to today's Pass/Pro. Anyone who subscribed back then keeps full access for as long as they want — billing simply stopped. Email hello@faderandknob.com if you want a prorated refund on remaining time.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  return (
    <div className="container">
      {PRICING_JSON_LD.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <section className="pricing-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Pricing</span>
        </div>

        <header className="archive-masthead archive-masthead-tight">
          <div className="recipe-issue">
            <span className="pill">Pricing</span>
          </div>
          <h1 className="recipe-title display">Pricing</h1>
          <p className="recipe-summary">
            Free to browse, every recipe, every platform. Upgrade to Pass for
            unlimited preset downloads and members-only depth, or Pro to bundle
            every Set Pack. Set Packs are also one-time purchases — you buy
            them, you keep them.
          </p>
        </header>

        {/* Free / Pass / Pro — client component owns the shared
            annual/monthly toggle that drives both paid cards. */}
        <PlanCards />

        {/* Set Packs — kept below the subscription comparison so the
            primary upgrade narrative is Free → Pass, not Free → Set
            Pack. Set Packs are a secondary purchase pattern (one-time,
            problem-specific) and live in their own section. */}
        <section className="pricing-set-packs">
          <header className="how-head">
            <h2 className="display">Set Packs</h2>
            <span className="section-rule" aria-hidden="true" />
          </header>
          <p className="pricing-set-packs-intro">
            One-time purchases. A single preset, eight snapshots, and the
            song-to-snapshot map for your gig. On <strong>Pro</strong>, every
            Set Pack is <strong>included</strong> while you&rsquo;re subscribed.
          </p>
          <div className="pricing-grid pricing-grid-single">
            <div className="pricing-card">
              <h3 className="pricing-name">{SET_PACK.name}</h3>
              <div className="pricing-price-row">
                <span className="pricing-price">{SET_PACK.price}</span>
                <span className="pricing-period">{SET_PACK.period}</span>
              </div>
              <p className="pricing-blurb">{SET_PACK.blurb}</p>
              <ul className="pricing-features">
                {SET_PACK.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link
                href={SET_PACK.href}
                className="hero-cta hero-cta-secondary pricing-cta"
              >
                {SET_PACK.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pricing-faq">
          <div className="how-head">
            <h2 className="display">Frequently asked</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <dl className="pricing-faq-list">
            {FAQ.map((f) => (
              <div key={f.q} className="pricing-faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </div>
  );
}
