"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutButton from "@/components/checkout/CheckoutButton";

/**
 * <PlanCards /> — the Free / Pass / Pro subscription comparison row.
 *
 * Owns ONE annual ↔ monthly toggle that drives both paid cards, so the
 * user compares Pass and Pro at the same cadence. Annual is selected by
 * default — better LTV, and the savings is real:
 *   Pass: 12×$4.99 = $59.88 vs $49 annual  → ~18% off
 *   Pro:  12×$7.99 = $95.88 vs $79 annual  → ~18% off
 *
 * The whole section is a client component (rather than just the cards)
 * so the toggle can swap every price/subnote without a round trip.
 * Pricing per docs/PRICING_MODEL.md (locked 2026-06-15).
 */

type Interval = "annual" | "monthly";

const FREE_FEATURES = [
  "Browse every tone recipe",
  "5 preset downloads / month (.hlx, .tsl)",
  "10 recipe PDFs / month",
  "Unlimited saved recipes",
  "Community forum & comments",
];

const PASS_FEATURES = [
  "Everything in Free",
  "Unlimited preset downloads (.hlx, .tsl)",
  "Unlimited recipe PDFs",
  "Early access — new recipes 1 week before public",
  "Members-only deep-dive content (A/Bs, video breakdowns)",
];

const PRO_FEATURES = [
  "Everything in Pass",
  "All Set Packs included while subscribed",
  "ToneTrace priority access (at launch)",
  "Commercial-use license",
];

export default function PlanCards() {
  const [interval, setInterval] = useState<Interval>("annual");

  const passPrice = interval === "annual" ? "$49" : "$4.99";
  const passPeriod = interval === "annual" ? "/year" : "/month";
  const passSub =
    interval === "annual"
      ? "Just $4.08/month, billed annually. Save ~18% vs monthly."
      : "Cancel anytime. Switch to annual to save ~18%.";

  const proPrice = interval === "annual" ? "$79" : "$7.99";
  const proPeriod = interval === "annual" ? "/year" : "/month";
  const proSub =
    interval === "annual"
      ? "Just $6.58/month, billed annually. One Set Pack pays for the upgrade."
      : "Cancel anytime. Switch to annual to save ~18%.";

  return (
    <>
      {/* Shared billing toggle — drives both paid cards. */}
      <div className="pricing-billing-toggle">
        <div
          className="pricing-toggle"
          role="tablist"
          aria-label="Billing interval"
        >
          <button
            type="button"
            role="tab"
            aria-selected={interval === "annual"}
            onClick={() => setInterval("annual")}
            className={`pricing-toggle-btn ${interval === "annual" ? "is-active" : ""}`}
          >
            Annual
            <span className="pricing-toggle-save">Save ~18%</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={interval === "monthly"}
            onClick={() => setInterval("monthly")}
            className={`pricing-toggle-btn ${interval === "monthly" ? "is-active" : ""}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="pricing-grid pricing-grid-trio">
        {/* Free */}
        <div className="pricing-card">
          <h2 className="pricing-name">Free</h2>
          <div className="pricing-price-row">
            <span className="pricing-price">$0</span>
            <span className="pricing-period">/forever</span>
          </div>
          <p className="pricing-subnote">
            Generous on purpose. Quota only catches you if you&rsquo;re a
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

        {/* Pass — recommended entry tier */}
        <div className="pricing-card is-highlight">
          <span className="pricing-badge">Most popular</span>
          <h2 className="pricing-name">Pass</h2>
          <div className="pricing-price-row">
            <span className="pricing-price">{passPrice}</span>
            <span className="pricing-period">{passPeriod}</span>
          </div>
          <p className="pricing-subnote">{passSub}</p>
          <p className="pricing-blurb">
            Stop counting downloads. Unlimited presets and PDFs, early
            access, and the members-only deep dives. For players who use
            the site every week.
          </p>
          <ul className="pricing-features">
            {PASS_FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <CheckoutButton
            tier="pass"
            interval={interval}
            className="pricing-cta-wrap"
          />
          <p className="pricing-fine">
            No card-trial gotchas. Cancel from your dashboard any time.
          </p>
        </div>

        {/* Pro — Set Packs bundled */}
        <div className="pricing-card">
          <span className="pricing-badge">Best value</span>
          <h2 className="pricing-name">Pro</h2>
          <div className="pricing-price-row">
            <span className="pricing-price">{proPrice}</span>
            <span className="pricing-period">{proPeriod}</span>
          </div>
          <p className="pricing-subnote">{proSub}</p>
          <p className="pricing-blurb">
            Everything in Pass, plus every Set Pack bundled while you&rsquo;re
            subscribed. One pack is $19 — so if you&rsquo;d buy even one a
            year, Pro nets out ahead.
          </p>
          <ul className="pricing-features">
            {PRO_FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <CheckoutButton
            tier="pro"
            interval={interval}
            className="pricing-cta-wrap"
          />
          <p className="pricing-fine">
            Set Packs included for as long as you stay on Pro.
          </p>
        </div>
      </div>
    </>
  );
}
