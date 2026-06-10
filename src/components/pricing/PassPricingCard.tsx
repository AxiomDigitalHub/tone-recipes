"use client";

import { useState } from "react";
import CheckoutButton from "@/components/checkout/CheckoutButton";

/**
 * <PassPricingCard /> — the right column of the pricing page.
 *
 * Owns the annual ↔ monthly toggle state and the CheckoutButton mount.
 * Annual is selected by default — matches ToneAdapt's pricing pattern,
 * better LTV for us, and the savings number is a real one (a year on
 * the monthly plan is $59.88; annual is $39, so the savings is $20.88
 * which we round to "Save 35%").
 *
 * All copy lives here rather than in the parent server component so
 * the toggle can swap labels (price, "Cancel anytime" tail, etc.)
 * without a round trip.
 */
export default function PassPricingCard() {
  const [interval, setIntervalState] = useState<"annual" | "monthly">("annual");

  const price = interval === "annual" ? "$39" : "$4.99";
  const period = interval === "annual" ? "/year" : "/month";
  const subnote =
    interval === "annual"
      ? "Just $3.25/month, billed annually. Save 35% vs monthly."
      : "Cancel anytime. Switch to annual to save 35%.";

  return (
    <div className="pricing-card is-highlight">
      <span className="pricing-badge">Recommended</span>

      <h2 className="pricing-name">Pass</h2>

      {/* Annual / Monthly toggle — pill control. Annual highlighted by
          default so the cheaper, longer-commitment option is the
          first thing the eye lands on. */}
      <div
        className="pricing-toggle"
        role="tablist"
        aria-label="Billing interval"
      >
        <button
          type="button"
          role="tab"
          aria-selected={interval === "annual"}
          onClick={() => setIntervalState("annual")}
          className={`pricing-toggle-btn ${interval === "annual" ? "is-active" : ""}`}
        >
          Annual
          <span className="pricing-toggle-save">Save 35%</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={interval === "monthly"}
          onClick={() => setIntervalState("monthly")}
          className={`pricing-toggle-btn ${interval === "monthly" ? "is-active" : ""}`}
        >
          Monthly
        </button>
      </div>

      <div className="pricing-price-row">
        <span className="pricing-price">{price}</span>
        <span className="pricing-period">{period}</span>
      </div>
      <p className="pricing-subnote">{subnote}</p>

      <p className="pricing-blurb">
        Unlimited preset downloads, early access to new recipes, and the
        members-only deep-dive content. Built for the players who use the
        site every week.
      </p>

      <ul className="pricing-features">
        <li>Unlimited preset downloads (.hlx, .tsl)</li>
        <li>Early access — new recipes 1 week before public</li>
        <li>Members-only deep-dive content (A/Bs, video breakdowns)</li>
        <li>30% off every Set Pack — forever</li>
        <li>Members Discord</li>
        <li>Tone Adapter (coming soon)</li>
      </ul>

      <CheckoutButton
        interval={interval}
        className="pricing-cta-wrap"
      />

      <p className="pricing-fine">
        No card-trial gotchas. Cancel from your dashboard any time.
      </p>
    </div>
  );
}
