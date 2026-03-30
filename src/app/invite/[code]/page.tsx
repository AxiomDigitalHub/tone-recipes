"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "redeeming" | "success" | "error" | "already"
  >("idle");
  const [message, setMessage] = useState("");
  const [grantedRole, setGrantedRole] = useState("");

  // Once logged in, auto-redeem
  useEffect(() => {
    if (authLoading || !user || status !== "idle") return;

    // If they already have creator or admin, skip
    if (user.role === "creator" || user.role === "admin") {
      setStatus("already");
      setMessage(
        `You already have ${user.role === "admin" ? "Admin" : "Creator"} access!`,
      );
      return;
    }

    redeem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function redeem() {
    setStatus("redeeming");
    try {
      // Get session token from Supabase
      const { createBrowserClient } = await import("@/lib/db/client");
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setStatus("error");
        setMessage("Could not get session. Please try signing in again.");
        return;
      }

      const res = await fetch("/api/invite/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code: decodeURIComponent(code) }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setGrantedRole(data.granted_role);
        setMessage(data.message);
        // Reload to pick up the new role in auth context
        setTimeout(() => router.push("/dashboard"), 2500);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to redeem invite code.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ letterSpacing: "-0.02em" }}
          >
            Fader & Knob
          </h1>
        </Link>

        <div className="bg-surface border border-border rounded-xl p-8 space-y-5">
          {/* Pre-auth: show sign-in prompt */}
          {!user && !authLoading && (
            <>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  You&apos;re Invited
                </h2>
                <p className="text-muted text-sm">
                  Someone shared a Creator access code with you. Sign in to
                  activate your free account.
                </p>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
                <p className="text-xs text-muted uppercase tracking-wide mb-1">
                  Invite Code
                </p>
                <p className="font-mono text-lg text-accent font-semibold">
                  {decodeURIComponent(code)}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted">
                  Creator accounts include all platform translations, preset
                  downloads, recipe submission, and more.
                </p>
                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full px-4 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </>
          )}

          {/* Loading auth */}
          {authLoading && (
            <div className="py-8 space-y-3">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted text-sm">Checking your account...</p>
            </div>
          )}

          {/* Redeeming */}
          {status === "redeeming" && (
            <div className="py-8 space-y-3">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted text-sm">Activating your invite...</p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="py-4 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Welcome to{" "}
                {grantedRole === "creator" ? "Creator" : "Premium"}!
              </h2>
              <p className="text-muted text-sm">{message}</p>
              <p className="text-xs text-muted/60">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {/* Already has access */}
          {status === "already" && (
            <div className="py-4 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {message}
              </h2>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-2 bg-accent text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="py-4 space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Hmm, that didn&apos;t work
              </h2>
              <p className="text-muted text-sm">{message}</p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="inline-block px-6 py-2 bg-surface border border-border rounded-lg font-medium text-foreground hover:bg-border/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted/40">
          Invite codes grant free access and never expire.
        </p>
      </div>
    </div>
  );
}
