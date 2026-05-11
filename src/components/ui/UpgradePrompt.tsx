"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

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
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[var(--paper)]/80 backdrop-blur-sm">
          <Lock className="mb-3 h-8 w-8 text-[var(--amber-2)]" />
          <p className="text-sm font-semibold text-[var(--ink)]">{feature}</p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Available on {tierLabel} ({price}/mo)
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--amber)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)]"
          >
            <Sparkles className="h-4 w-4" />
            {ctaText}
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-[var(--amber)]/30 bg-[var(--amber)]/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-[var(--amber-2)]" />
          <p className="text-sm text-[var(--ink)]">
            {feature} —{" "}
            <span className="text-[var(--ink-muted)]">
              {tierLabel} ({price}/mo)
            </span>
          </p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 rounded-lg bg-[var(--amber)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)]"
        >
          {ctaText}
        </Link>
      </div>
    );
  }

  // inline (default)
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)] p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--amber)]/10">
        <Lock className="h-5 w-5 text-[var(--amber-2)]" />
      </div>
      <p className="text-sm font-semibold text-[var(--ink)]">{feature}</p>
      <p className="text-xs text-[var(--ink-muted)]">
        Unlock with {tierLabel} for {price}/mo
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--amber)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)]"
      >
        <Sparkles className="h-4 w-4" />
        {ctaText}
      </Link>
    </div>
  );
}
