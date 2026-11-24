"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import CheckoutButton from "@/components/checkout/CheckoutButton";

/**
 * <PlanCards />: the page heading, the Yearly / Monthly toggle and the
 * Free / Pass / Pro cards (redesign, from the Pricing reference).
 *
 * Owns ONE toggle that drives both paid cards, so the user compares Pass
 * and Pro at the same cadence. Monthly is selected by default (Daniel, 2026-11-24).
 * The yearly saving:
 *   Pass: 12 x $4.99 = $59.88 vs $49 yearly  → about 18% off
 *   Pro:  12 x $7.99 = $95.88 vs $79 yearly  → about 18% off
 *
 * Checkout is unchanged: <CheckoutButton tier interval /> posts the same
 * tier and interval ("annual" | "monthly") to /api/checkout as before.
 * Pricing per docs/PRICING_MODEL.md (locked 2026-06-15).
 */

type Interval = "annual" | "monthly";

const FREE_FEATURES = [
  "Browse every tone recipe",
  "5 preset downloads a month (Helix, Quad Cortex, Katana)",
  "10 recipe PDFs a month",
  "Unlimited saved recipes",
  "Recipe comments",
];

const PASS_FEATURES = [
  "Everything in Free",
  "Unlimited preset downloads (Helix, Quad Cortex, Katana)",
  "Unlimited recipe PDFs",
];

const PRO_FEATURES = [
  "Everything in Pass",
  "Every Set Pack while subscribed",
  "Commercial-use license",
];

function Features({ items }: { items: string[] }) {
  return (
    <div className="fk-plan-features">
      <ul>
        {items.map((f) => (
          <li key={f}>
            <Check size={20} strokeWidth={1.75} aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlanCards() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const yearly = interval === "annual";

  const passPrice = yearly ? "$49" : "$4.99";
  const proPrice = yearly ? "$79" : "$7.99";
  const period = yearly ? "a year" : "a month";
  const passSub = yearly ? "$4.08 a month, billed yearly" : "Billed monthly";
  const proSub = yearly ? "$6.58 a month, billed yearly" : "Billed monthly";

  return (
    <>
      <div className="fk-pricing-head">
        <div className="fk-pricing-headcopy">
          <h1 className="fk-display">Pricing</h1>
          <p className="fk-lead">
            Every recipe is free to read, on every platform. You pay only if you want unlimited
            downloads or the Set Packs.
          </p>
        </div>
        <div className="fk-pricing-billing">
          <div className="fk-toggle" role="group" aria-label="Billing period">
            <button type="button" aria-pressed={yearly} onClick={() => setInterval("annual")}>
              Yearly
            </button>
            <button type="button" aria-pressed={!yearly} onClick={() => setInterval("monthly")}>
              Monthly
            </button>
          </div>
          <span className="fk-body-sm">Yearly saves about 18%</span>
        </div>
      </div>

      <div className="fk-plans">
        <article className="fk-plan r-lg">
          <div className="fk-plan-head">
            <h2 className="fk-t3">Free</h2>
          </div>
          <div className="fk-plan-price">
            <p>
              <span className="fk-plan-amount">$0</span>
              <span className="fk-plan-period">forever</span>
            </p>
            <p className="fk-plan-sub">No card needed</p>
          </div>
          <p className="fk-plan-blurb">
            The whole recipe library on every platform, plus 5 preset downloads a month.
          </p>
          <Features items={FREE_FEATURES} />
          <Link href="/signup" className="fk-btn fk-btn-secondary fk-plan-cta">
            Sign up free
          </Link>
          <p className="fk-plan-fine">No upsell on the way in.</p>
        </article>

        {/* Pass: the recommended plan. The one dark card, and the one
            accent button on the screen. */}
        <article className="fk-plan is-inverse r-lg">
          <div className="fk-plan-head">
            <h2 className="fk-t3">Pass</h2>
            <span className="fk-plan-note">Our pick</span>
          </div>
          <div className="fk-plan-price">
            <p>
              <span className="fk-plan-amount">{passPrice}</span>
              <span className="fk-plan-period">{period}</span>
            </p>
            <p className="fk-plan-sub">{passSub}</p>
          </div>
          <p className="fk-plan-blurb">
            Unlimited presets and PDFs, so you stop counting downloads. For players who use the
            site every week.
          </p>
          <Features items={PASS_FEATURES} />
          <CheckoutButton tier="pass" interval={interval} label="Start Pass" className="fk-plan-checkout is-accent" />
          <p className="fk-plan-fine">Cancel from your dashboard any time.</p>
        </article>

        <article className="fk-plan r-lg">
          <div className="fk-plan-head">
            <h2 className="fk-t3">Pro</h2>
            <span className="fk-plan-note">Best value with Set Packs</span>
          </div>
          <div className="fk-plan-price">
            <p>
              <span className="fk-plan-amount">{proPrice}</span>
              <span className="fk-plan-period">{period}</span>
            </p>
            <p className="fk-plan-sub">{proSub}</p>
          </div>
          <p className="fk-plan-blurb">
            Everything in Pass, plus every Set Pack while you&apos;re subscribed. Packs are $19
            each, so Pro pays for itself once you&apos;d buy two in a year.
          </p>
          <Features items={PRO_FEATURES} />
          <CheckoutButton tier="pro" interval={interval} label="Start Pro" className="fk-plan-checkout" />
          <p className="fk-plan-fine">Set Packs stay yours to use for as long as you&apos;re on Pro.</p>
        </article>
      </div>
    </>
  );
}
