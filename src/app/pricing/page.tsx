import Link from "next/link";
import type { Metadata } from "next";
import PassPricingCard from "@/components/pricing/PassPricingCard";

/**
 * JSON-LD: Product + multi-Offer for the Pass subscription, and
 * Product + Offer for the Worship Set Pack.
 *
 * Pass is two billing cadences (annual $39 / monthly $4.99) modeled as
 * two `Offer` entries inside `offers[]` — Google reads either depending
 * on user query intent. Both link back to /pricing as the
 * point-of-sale; checkout itself happens via the embedded
 * CheckoutButton, which Google doesn't need to know about for the
 * Product card.
 *
 * Closes the last commercial-surface gap from
 * audits/schema-audit-2026-05-12.md (the Pass tier shipped after the
 * audit was written).
 */
const PRICING_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Fader & Knob Pass",
    description:
      "Unlimited preset downloads, members-only deep-dive content, early access to new recipes, Members Discord, 30% off every Set Pack, and the Tone Adapter when it ships.",
    category: "Subscription",
    brand: { "@type": "Brand", name: "Fader & Knob" },
    url: "https://faderandknob.com/pricing",
    offers: [
      {
        "@type": "Offer",
        name: "Pass — annual",
        priceCurrency: "USD",
        price: "39.00",
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "39.00",
          priceCurrency: "USD",
          billingDuration: "P1Y",
          unitCode: "ANN",
        },
      },
      {
        "@type": "Offer",
        name: "Pass — monthly",
        priceCurrency: "USD",
        price: "4.99",
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4.99",
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitCode: "MON",
        },
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Pricing — Fader & Knob",
  description:
    "Free to browse, $39/yr for unlimited preset downloads. Set Packs are one-time purchases — buy what you need, keep it forever.",
  openGraph: {
    title: "Pricing — Fader & Knob",
    description:
      "Free to browse. Pass for unlimited downloads. Set Packs you keep forever.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*  Free tier card — server-rendered (no state)                                */
/* -------------------------------------------------------------------------- */

const FREE_FEATURES = [
  "Browse every tone recipe",
  "5 preset downloads / month (.hlx, .tsl)",
  "Unlimited saved recipes",
  "Recipe PDFs",
  "Community forum & comments",
];

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
    q: "What's the difference between Free and Pass?",
    a: "Free gives you the entire recipe catalog plus 5 preset downloads per month. Pass removes the download quota and adds early access to new recipes (1 week before public), members-only deep-dive content, a Members Discord, 30% off every Set Pack forever, and the Tone Adapter when it ships. Free is generous on purpose — Pass is for people who use the site every week.",
  },
  {
    q: "Why a subscription this time? Didn't you retire Tone Pass and Pro?",
    a: "The old tiers ($7 and $12/mo) gave away the same features as free. They had nothing to upgrade for. Pass is a single tier with real ongoing value: unlimited downloads, new content, community. At $39/year that's $3.25/month — below the friction threshold most guitarists are willing to pay for a tool they use weekly.",
  },
  {
    q: "Is there a free trial?",
    a: "The free tier IS the trial. 5 downloads per month, every feature visible, no card required. Try us for a month — if you're hitting the quota and want more, upgrade. If you're not hitting it, you didn't need Pass anyway.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — from your dashboard, no email required, no friction. You keep Pass features until the end of the period you already paid for, then your account flips back to free (with the 5 downloads/month quota). No partial refunds for the unused portion of a paid period.",
  },
  {
    q: "What about people who signed up before today?",
    a: "Anyone with a free account before 2026-06-09 keeps unlimited preset downloads forever, regardless of whether they upgrade. We're not changing the deal you signed up for.",
  },
  {
    q: "Why one-time Set Pack pricing instead of subscription?",
    a: "Set Packs are a single solution to a single problem — your gig. One preset, eight snapshots, 30+ songs mapped. That's a thing you use forever, not a thing you re-evaluate every month. We sell it that way.",
  },
  {
    q: "Will there be more Set Packs?",
    a: "Yes. Blues, Classic Rock, Metal, and Indie are next. Pass subscribers get 30% off every pack we ship — for as long as they're Pass subscribers.",
  },
  {
    q: "What about people on the old Tone Pass or Pro tiers?",
    a: "Those plans are retired. Existing subscribers continue to have full access for as long as they want — billing simply stops. Email hello@faderandknob.com if you want a prorated refund on remaining time.",
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
            unlimited preset downloads and members-only depth. Set Packs are
            one-time purchases — you buy them, you keep them.
          </p>
        </header>

        {/* Free + Pass — the two-column subscription comparison */}
        <div className="pricing-grid">
          <div className="pricing-card">
            <h2 className="pricing-name">Free</h2>
            <div className="pricing-price-row">
              <span className="pricing-price">$0</span>
              <span className="pricing-period">/forever</span>
            </div>
            <p className="pricing-subnote">
              Generous on purpose. Quota only catches you if you're a
              heavy downloader.
            </p>
            <p className="pricing-blurb">
              The entire recipe library, every platform, plus 5 preset
              downloads each month. No card.
            </p>
            <ul className="pricing-features">
              {FREE_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="hero-cta hero-cta-secondary pricing-cta"
            >
              Sign up free
            </Link>
            <p className="pricing-fine">No card. No upsell on the free flow.</p>
          </div>

          {/* Pass — client component owns the annual/monthly toggle. */}
          <PassPricingCard />
        </div>

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
            song-to-snapshot map for your gig. Pass subscribers get{" "}
            <strong>30% off</strong> every pack — automatically.
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
