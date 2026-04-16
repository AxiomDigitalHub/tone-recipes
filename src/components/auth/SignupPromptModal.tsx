"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Mail, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

const MIN_PASSWORD_LENGTH = 10;

interface SignupPromptModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the user dismisses the modal (X button, backdrop, or Esc). */
  onClose: () => void;
  /** Called after a successful signup. Parent can resume the action the user
   *  was trying to take (e.g. trigger the download they clicked on). */
  onSuccess: () => void;
  /** Short contextual line shown above the form — e.g. "to download the Helix
   *  preset for 'Pride and Joy'". Makes the prompt feel specific, not generic. */
  reason?: string;
  /** Optional sessionStorage key set before OAuth redirect so the caller can
   *  detect a "pending action" when the user lands back on the page and
   *  auto-complete what they were doing. */
  pendingKey?: string;
  pendingValue?: string;
}

/**
 * Inline signup modal. Designed for "you tried to do something that requires
 * an account — sign up right here, we'll resume where you were."
 *
 * Key design:
 * - Google OAuth is the primary CTA (highest conversion path).
 * - Email/password is collapsed behind "Use email instead."
 * - Reason line sets context so the prompt doesn't feel like an interruption.
 * - Before OAuth redirect, caller-provided pendingKey/value are stashed in
 *   sessionStorage so the parent page can pick up where the user left off
 *   after the Google round trip.
 */
export default function SignupPromptModal({
  open,
  onClose,
  onSuccess,
  reason,
  pendingKey,
  pendingValue,
}: SignupPromptModalProps) {
  const { signUp, signInWithGoogle, isDemoMode } = useAuth();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Reset form state when closed
  useEffect(() => {
    if (!open) {
      setShowEmailForm(false);
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  function stashPending() {
    if (typeof window === "undefined") return;
    if (pendingKey && pendingValue) {
      sessionStorage.setItem(pendingKey, pendingValue);
    }
    sessionStorage.setItem("returnTo", window.location.pathname);
  }

  async function handleGoogle() {
    setError("");
    stashPending();
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
    // On success, OAuth redirect will happen — no further action needed here.
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isDemoMode) {
      if (!password.trim()) {
        setError("Password is required.");
        return;
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        );
        return;
      }
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Success — call onSuccess so the parent can resume (e.g. trigger the
    // download). The auth-context listener will have set user state by now.
    onSuccess();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-prompt-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close signup prompt"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2
            id="signup-prompt-title"
            className="text-lg font-bold text-foreground"
          >
            Create a free account
          </h2>
          {reason && (
            <p className="mt-1 text-sm text-muted">{reason}</p>
          )}
        </div>

        {/* Value bullets */}
        <ul className="mb-5 space-y-1.5 text-sm">
          {[
            "10 free preset downloads (Helix & Katana)",
            "Save recipes for later",
            "Takes about 20 seconds",
          ].map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Primary: Google */}
        {!isDemoMode && (
          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-[#0b0f1a] py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface-hover"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        )}

        {/* Email toggle / form */}
        {!isDemoMode && !showEmailForm && (
          <>
            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] uppercase tracking-wider text-muted">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" />
              Use email instead
            </button>
          </>
        )}

        {(isDemoMode || showEmailForm) && (
          <form
            onSubmit={handleEmailSubmit}
            className={isDemoMode ? "space-y-3" : "mt-4 space-y-3"}
          >
            {!isDemoMode && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] uppercase tracking-wider text-muted">
                  or with email
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />

            {!isDemoMode && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Password (${MIN_PASSWORD_LENGTH}+ characters)`}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-14 text-sm text-foreground outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted hover:text-accent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-[11px] text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
