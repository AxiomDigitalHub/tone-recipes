"use client";

import { useState, useRef, useEffect } from "react";
import { Flag, Loader2, CheckCircle, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createReport } from "@/lib/db/reports";
import type { ReportContentType, ReportReason } from "@/types/community";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ReportButtonProps {
  contentType: ReportContentType;
  contentId: string;
  size?: "sm" | "md";
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Other" },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ReportButton({
  contentType,
  contentId,
  size = "sm",
}: ReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  const handleToggle = () => {
    if (!user) return;
    if (submitted) return;
    setOpen((v) => !v);
    setReason(null);
    setDetails("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!user || !reason || submitting) return;

    setSubmitting(true);
    setError(null);

    const success = await createReport({
      reporter_id: user.id,
      content_type: contentType,
      content_id: contentId,
      reason,
      details: details.trim() || undefined,
    });

    setSubmitting(false);

    if (success) {
      setSubmitted(true);
      setOpen(false);
      // Reset after showing success
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setError("Failed to submit report. Please try again.");
    }
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonPadding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!user}
        className={`${buttonPadding} rounded-lg text-muted transition-colors hover:text-red-400 hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Report content"
        title={user ? "Report" : "Sign in to report"}
      >
        {submitted ? (
          <CheckCircle className={`${iconSize} text-green-400`} />
        ) : (
          <Flag className={iconSize} />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-border bg-surface shadow-lg shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-medium text-foreground">
              Report content
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Reason selection */}
            <fieldset>
              <legend className="text-xs font-medium text-muted mb-2">
                Reason
              </legend>
              <div className="space-y-1.5">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                      reason === r.value
                        ? "bg-accent/10 text-accent border border-accent/30"
                        : "text-foreground hover:bg-surface-hover border border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="sr-only"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Details textarea */}
            <div>
              <label
                htmlFor="report-details"
                className="text-xs font-medium text-muted mb-1 block"
              >
                Details{" "}
                <span className="font-normal text-muted/60">(optional)</span>
              </label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide additional context..."
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className="w-full rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
