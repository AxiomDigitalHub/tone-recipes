import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Fader & Knob",
  description:
    "The whole recipe catalog is free. Set Packs are one-time purchases — buy what you need, keep it forever.",
  openGraph: {
    title: "Pricing — Fader & Knob",
    description:
      "Every recipe is free. Set Packs are one-time purchases. No subscriptions.",
    type: "website",
  },
};

interface PlanCard {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
}

const PLANS: PlanCard[] = [
  {
    name: "Free Account",
    price: "$0",
    period: "forever",
    blurb: "The whole recipe catalog. No quota, no upsell.",
    features: [
      "Every tone recipe in the archive",
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
      "Recipe PDFs",
      "New recipes every week",
      "Community forum & comments",
    ],
    cta: "Sign up free",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Worship Set Pack",
    price: "$19",
    period: "one-time",
    blurb:
      "One Helix preset, 8 snapshots, 30 worship songs mapped. Yours to keep.",
    features: [
      "FK-Worship.hlx preset",
      "8 snapshots covering clean → rock crunch",
      "30-song Setlist Mapper",
      "Lifetime updates as we refine the pack",
    ],
    cta: "Buy Worship Set Pack",
    href: "/set-packs/worship",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Is the recipe library really free?",
    a: "Yes. Every recipe on the site — signal chain, exact settings, downloadable .hlx and .tsl presets — is free with a sign-up. No quota, no upsell. We ask for your email so we can tell you when new recipes ship.",
  },
  {
    q: "Why one-time Set Pack pricing instead of a subscription?",
    a: "A subscription only makes sense for things you use weekly. The recipe library is a reference — most people grab the 5 or 10 presets they care about and move on. Charging monthly for that is bad value. Set Packs are different: one preset, eight snapshots, 30+ songs mapped to those snapshots. That's a one-time solution to your gig, so we sell it that way.",
  },
  {
    q: "Will there be more Set Packs?",
    a: "Yes. Classic Rock, 90s/Alternative, and Blues are in production. You can sign up for the notify list on the Set Packs page; you'll hear from us when each ships.",
  },
  {
    q: "Which platforms get presets?",
    a: "Helix (.hlx) and Boss Katana (.tsl) export today. Quad Cortex, TONEX, Fractal, and Kemper exports are on the roadmap. The recipe pages always show the parameter values for every platform whether the export exists yet or not.",
  },
  {
    q: "What about people who signed up for Tone Pass or Pro?",
    a: "The subscription plans are retired. Anyone who subscribed continues to have full access for as long as they wish — billing simply stops. If you want a refund on any remaining time, email hello@faderandknob.com.",
  },
];

export default function PricingPage() {
  return (
    <div className="container">
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
            The recipe catalog is free. Set Packs are one-time purchases — buy
            the bundle that solves your gig, keep it forever.
          </p>
        </header>

        <div className="pricing-grid">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`pricing-card ${p.highlight ? "is-highlight" : ""}`}
            >
              {p.highlight && <span className="pricing-badge">Start here</span>}
              <h2 className="pricing-name">{p.name}</h2>
              <div className="pricing-price-row">
                <span className="pricing-price">{p.price}</span>
                <span className="pricing-period">{p.period}</span>
              </div>
              <p className="pricing-blurb">{p.blurb}</p>
              <ul className="pricing-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`hero-cta ${p.highlight ? "hero-cta-primary" : "hero-cta-secondary"} pricing-cta`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

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
