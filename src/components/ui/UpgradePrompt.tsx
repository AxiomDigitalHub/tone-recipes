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
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
          <Lock className="mb-3 h-8 w-8 text-accent" />
          <p className="text-sm font-semibold text-foreground">{feature}</p>
          <p className="mt-1 text-xs text-muted">
            Available on {tierLabel} ({price}/mo)
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
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
      <div className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-accent" />
          <p className="text-sm text-foreground">
            {feature} —{" "}
            <span className="text-muted">
              {tierLabel} ({price}/mo)
            </span>
          </p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          {ctaText}
        </Link>
      </div>
    );
  }

  // inline (default)
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <Lock className="h-5 w-5 text-accent" />
      </div>
      <p className="text-sm font-semibold text-foreground">{feature}</p>
      <p className="text-xs text-muted">
        Unlock with {tierLabel} for {price}/mo
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
      >
        <Sparkles className="h-4 w-4" />
        {ctaText}
      </Link>
    </div>
  );
}
