"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

interface UpgradePromptModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Dismiss handler. */
  onClose: () => void;
  /** Optional context line — e.g. "You've used all 10 free downloads." */
  reason?: string;
}

/**
 * Shown when a Free user tries to do something that requires Tone Pass —
 * primarily "download a preset after hitting the 10-per-month limit."
 *
 * Keeps the user in-context: modal appears over the recipe page they're on
 * rather than navigating them away. If they click "Upgrade" they go to
 * pricing; if they dismiss they stay where they were.
 */
export default function UpgradePromptModal({
  open,
  onClose,
  reason,
}: UpgradePromptModalProps) {
  // Close on Esc
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-prompt-title"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close upgrade prompt"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            Tone Pass
          </span>
          <h2
            id="upgrade-prompt-title"
            className="mt-3 text-lg font-bold text-foreground"
          >
            Unlock unlimited downloads
          </h2>
          {reason && (
            <p className="mt-1 text-sm text-muted">{reason}</p>
          )}
        </div>

        <ul className="mb-5 space-y-1.5 text-sm">
          {[
            "Unlimited preset downloads (.hlx, .tsl)",
            "Unlimited saved recipes",
            "New recipes every week",
            "Ad-free, cancel anytime",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">$7</span>
          <span className="text-sm text-muted">/month</span>
        </div>

        <Link
          href="/pricing"
          className="block w-full rounded-lg bg-accent py-2.5 text-center text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          See Tone Pass
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 block w-full rounded-lg py-2 text-center text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
