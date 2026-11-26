"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

interface UpgradePromptProps {
  /** What the user is trying to access */
  feature: string;
  /** Which tier unlocks this */
  tier?: "premium" | "creator";
  /** Visual variant */
  variant?: "inline" | "overlay" | "banner";
  /** Optional custom CTA text */
  cta?: string;
}

export default function UpgradePrompt({
  feature,
  tier = "premium",
  variant = "inline",
  cta,
}: UpgradePromptProps) {
  const tierLabel = tier === "creator" ? "Creator" : "Premium";
  const price = tier === "creator" ? "$15" : "$9";
  const ctaText = cta || `Upgrade to ${tierLabel}`;

  if (variant === "overlay") {
    return (
      <div className="relative">
        {/* Blur overlay */}
        <div className="fk-upgrade-scrim pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <Lock className="mb-3 h-8 w-8 text-[var(--fk-ink-3)]" aria-hidden />
          <p className="text-[15px] font-semibold text-[var(--fk-ink)]">{feature}</p>
          <p className="mt-1 text-[13px] text-[var(--fk-ink-3)]">
            Available on {tierLabel} ({price}/mo)
          </p>
          <Link
            href="/pricing"
            className="fk-btn fk-btn-sm mt-4"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="fk-upgrade-banner flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-[var(--fk-ink-3)]" aria-hidden />
          <p className="text-sm text-[var(--fk-ink)]">
            {feature},{" "}
            <span className="text-[var(--fk-ink-3)]">
              {tierLabel} ({price}/mo)
            </span>
          </p>
        </div>
        <Link
          href="/pricing"
          className="fk-btn fk-btn-sm shrink-0"
        >
          {ctaText}
        </Link>
      </div>
    );
  }

  // inline (default)
  return (
    <div className="fk-tile fk-upgrade-inline items-center text-center">
      <div className="fk-upgrade-icon">
        <Lock className="h-5 w-5" aria-hidden />
      </div>
      <p className="text-[15px] font-semibold text-[var(--fk-ink)]">{feature}</p>
      <p className="text-[13px] text-[var(--fk-ink-3)]">
        Unlock with {tierLabel} for {price}/mo
      </p>
      <Link
        href="/pricing"
        className="fk-btn fk-btn-sm"
      >
        {ctaText}
      </Link>
    </div>
  );
}
