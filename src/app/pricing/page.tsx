import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the plan that fits your playing. Free for casual browsing, Premium for serious tone chasers, Creator for recipe publishers.",
  openGraph: {
    title: "Pricing | Fader & Knob",
    description:
      "Tone recipe plans for every player. Browse free or unlock all platforms, presets, and creator tools.",
    type: "website",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for browsing and getting inspired.",
    features: [
      "Browse all tone recipes",
      "View physical signal chains",
      "1 platform translation per recipe",
      "Save up to 5 recipes",
      "Read blog & community forum",
      "Comment on recipes",
    ],
    cta: "Get Started",
    ctaHref: "/signup",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "For players who want every tone on their platform.",
    features: [
      "Everything in Free",
      "All platform translations",
      "Download presets (.hlx, .json, .tsl)",
      "Unlimited saved recipes",
      "Ad-free experience",
      "Priority community support",
    ],
    cta: "Start Premium",
    ctaHref: "/signup?plan=premium",
    highlight: true,
  },
  {
    name: "Creator",
    price: "$15",
    period: "/month",
    description: "For tone chasers who want to share their recipes.",
    features: [
      "Everything in Premium",
      "Submit & publish tone recipes",
      "Analytics on your recipes",
      "Creator badge on profile",
      "Early access to new features",
    ],
    cta: "Start Creating",
    ctaHref: "/signup?plan=creator",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">
          Simple pricing for every player
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Start free. Upgrade when you want all platform translations, preset
          downloads, and creator tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
              plan.highlight
                ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                : "border-border bg-surface"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-background">
                Most Popular
              </span>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      plan.highlight ? "text-accent" : "text-emerald-400"
                    }`}
                  />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={`block rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-accent text-background hover:bg-accent-hover"
                  : "border border-border bg-surface text-foreground hover:border-accent/40 hover:bg-surface-hover"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Can I cancel anytime?</h3>
            <p className="mt-1 text-sm text-muted">
              Yes, cancel anytime from your dashboard. Your access continues
              through the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              What platforms are included in Premium?
            </h3>
            <p className="mt-1 text-sm text-muted">
              All of them — Line 6 Helix, Neural DSP Quad Cortex, IK Multimedia
              TONEX, Fractal Audio, Kemper, and Boss Katana. Plus physical gear
              signal chains on every recipe.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What format are the preset downloads?</h3>
            <p className="mt-1 text-sm text-muted">
              Helix presets are .hlx files, Quad Cortex are .json, and Boss
              Katana are .tsl (Tone Studio Liveset). Load them directly into your
              hardware or editor software.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              Do I need Premium to use the forum?
            </h3>
            <p className="mt-1 text-sm text-muted">
              No! The community forum, comments, and ratings are free for
              everyone. Premium unlocks platform translations, preset downloads,
              and unlimited saves.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What does the Creator plan add?</h3>
            <p className="mt-1 text-sm text-muted">
              Creator lets you submit your own tone recipes for publication,
              track views and ratings on your recipes, and gives you a Creator
              badge. Great for YouTube creators and guitar teachers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
