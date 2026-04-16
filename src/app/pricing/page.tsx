import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import CheckoutButton from "@/components/checkout/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the plan that fits your playing. Free for browsing, Tone Pass for downloads, Pro for set packs, Creator for publishing.",
  openGraph: {
    title: "Pricing | Fader & Knob",
    description:
      "Tone recipe plans for every player. Browse free or unlock presets, set packs, and creator tools.",
    type: "website",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Browse recipes and get inspired.",
    features: [
      "Browse all 50+ tone recipes",
      "Signal chains for 6 platforms: Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana",
      "Download recipe PDFs (with email)",
      "10 free preset downloads (Helix & Katana)",
      "Save up to 5 recipes",
      "Community forum & comments",
    ],
    cta: "Get Started",
    ctaHref: "/signup",
    highlight: false,
  },
  {
    name: "Tone Pass",
    price: "$7",
    period: "/month",
    description: "Unlimited presets for gigging players.",
    features: [
      "Everything in Free",
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
      "New recipes every week",
      "Ad-free experience",
    ],
    cta: "Start Tone Pass",
    // Tone Pass is the "Best Value" tier: every feature is live today and
    // it solves the core problem for ~80% of serious players. Pro holds
    // the badge back until Set Packs actually ship (see roadmap).
    highlight: true,
    stripePlan: "premium" as const,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Set packs + priority access for serious players.",
    features: [
      "Everything in Tone Pass",
      "Genre Set Packs with Setlist Mapper",
      "Priority access to new recipes",
      "Request specific song tones",
      "Pro badge on profile",
    ],
    cta: "Go Pro",
    highlight: false,
    stripePlan: "creator" as const,
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
          Browse every recipe for free. Upgrade for unlimited presets, set packs,
          and priority access to new tones.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
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
                Best Value
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

            {plan.stripePlan ? (
              <CheckoutButton
                plan={plan.stripePlan}
                label={plan.cta}
                highlight={plan.highlight}
              />
            ) : (
              <Link
                href={plan.ctaHref ?? "/signup"}
                className="block rounded-lg border border-border bg-surface py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface-hover"
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Set Pack callout */}
      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <h3 className="text-lg font-bold">Genre Set Packs — Coming Soon</h3>
        <p className="mt-2 text-sm text-muted">
          One preset with 8 snapshots that covers your entire setlist. Worship, Classic Rock,
          90s/Alternative, Blues, and more. Each pack includes a Setlist Mapper showing which
          snapshot to use for every song. Available with Pro plan or as a one-time purchase ($12.99).
        </p>
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
            <h3 className="font-semibold">What platforms are supported?</h3>
            <p className="mt-1 text-sm text-muted">
              Every recipe includes viewable settings for six platforms — Helix,
              Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana — all free to
              view. Downloadable preset files are available for Helix (.hlx) and
              Boss Katana (.tsl) today, with more platforms rolling out as we
              validate each on real hardware.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What format are the preset downloads?</h3>
            <p className="mt-1 text-sm text-muted">
              Helix presets are .hlx files and Boss Katana are .tsl (Tone Studio
              Liveset). Load them directly into HX Edit or Boss Tone Studio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What are Set Packs?</h3>
            <p className="mt-1 text-sm text-muted">
              A Set Pack is a single Helix preset with 8 snapshots designed to cover
              an entire genre or setlist. It comes with a Setlist Mapper document that
              tells you exactly which snapshot to use for each song. Perfect for gigging
              musicians who want one preset for the whole night.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I buy Set Packs without subscribing?</h3>
            <p className="mt-1 text-sm text-muted">
              Yes! Set Packs will be available as one-time purchases ($12.99 each)
              alongside the Pro subscription. Pro subscribers get all Set Packs included.
            </p>
          </div>
        </div>
      </div>

      {/* Recovery link: visitor scrolled to the bottom without picking a plan.
          Don't let them bounce to nowhere — send them back into the product
          with a high-quality sample so they can re-evaluate with evidence. */}
      <div className="mx-auto mt-20 max-w-2xl text-center">
        <p className="text-sm text-muted">
          Not ready to pick a plan?
        </p>
        <Link
          href="/recipe/gilmour-comfortably-numb-solo"
          className="mt-2 inline-block text-sm font-semibold text-accent hover:underline"
        >
          See a tone recipe first &rarr;
        </Link>
      </div>
    </div>
  );
}
