import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Fader & Knob",
  description:
    "Free tier with the full archive. Tone Pass unlocks every preset download. Pro adds gear lookups and bulk export.",
  openGraph: {
    title: "Pricing — Fader & Knob",
    description: "Free, Tone Pass, and Pro. Pick what fits.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Browse and get inspired.",
    features: [
      "Browse all 50+ tone recipes",
      "Signal chains for 6 platforms",
      "Download recipe PDFs (with email)",
      "10 free preset downloads",
      "Save up to 5 recipes",
      "Community forum & comments",
    ],
    cta: "Get started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Tone Pass",
    price: "$7",
    period: "/month",
    blurb: "Unlimited presets for gigging players.",
    features: [
      "Everything in Free",
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
      "New recipes every week",
      "Ad-free",
    ],
    cta: "Start Tone Pass",
    href: "/signup?plan=tone-pass",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    blurb: "Priority access + future Set Packs.",
    features: [
      "Everything in Tone Pass",
      "All future Set Packs included",
      "Priority access to new recipes",
      "Request specific song tones",
      "Pro badge on profile",
    ],
    cta: "Go Pro",
    href: "/signup?plan=pro",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account dashboard. You keep access until the end of the current billing period.",
  },
  {
    q: "What's the difference between Tone Pass and Pro?",
    a: "Tone Pass covers everything most players need today: unlimited presets, unlimited saves, weekly new recipes. Pro adds future Set Packs (themed bundles like Classic Rock, 90s, Blues, Metal) plus priority on new recipes and the ability to request specific songs.",
  },
  {
    q: "Do I need an account to download presets?",
    a: "Free accounts get 10 preset downloads to start. After that you'll need a Tone Pass or Pro plan for unlimited.",
  },
  {
    q: "Which platforms get presets?",
    a: "Helix (.hlx) and Boss Katana (.tsl) export today. Quad Cortex, TONEX, Fractal, Kemper exports are on the roadmap. The recipe pages always show the parameter values for every platform whether the export exists yet or not.",
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

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">Pricing</h1>
        </header>

        <p className="pricing-lede">
          Browse every recipe for free. Upgrade when you want unlimited
          downloads, set packs, and priority on new tones.
        </p>

        <div className="pricing-grid">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`pricing-card ${p.highlight ? "is-highlight" : ""}`}
            >
              {p.highlight && (
                <span className="pricing-badge">Best value</span>
              )}
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
