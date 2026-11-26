"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

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
    <div className="fk-wrap fkp-page fkp-invite">
      <div className="fkp-invite-col">
        {/* Logo */}
        <Link href="/" className="fkp-invite-logo">
          <Wordmark tone="ink" className="fkp-invite-wordmark" />
        </Link>

        <div className="fk-tile fkp-invite-card">
          {/* Pre-auth: show sign-in prompt */}
          {!user && !authLoading && (
            <>
              <div className="fkp-stack">
                <h1 className="fk-t2">You&apos;re invited</h1>
                <p className="fk-body-sm fkp-muted">
                  Someone shared a Creator access code with you. Sign in to
                  activate your free account.
                </p>
              </div>

              <div className="fkp-invite-code">
                <p className="fk-caption">Invite code</p>
                <p className="fk-data">{decodeURIComponent(code)}</p>
              </div>

              <div className="fkp-stack">
                <p className="fk-caption">
                  Creator accounts include all platform translations, preset
                  downloads, recipe submission, and more.
                </p>
                {/* In-page Google sign-in when configured: auth state change
                    re-renders this page into the redeem flow. Legacy redirect
                    button as fallback. */}
                <GoogleSignInButton
                  text="signin_with"
                  fallback={
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="fk-btn fk-btn-secondary fkp-invite-google"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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
                  }
                />
              </div>
            </>
          )}

          {/* Loading auth */}
          {authLoading && (
            <div className="fkp-invite-state" role="status">
              <Loader2 size={28} strokeWidth={1.75} className="animate-spin" aria-hidden />
              <p className="fk-body-sm fkp-muted">Checking your account...</p>
            </div>
          )}

          {/* Redeeming */}
          {status === "redeeming" && (
            <div className="fkp-invite-state" role="status">
              <Loader2 size={28} strokeWidth={1.75} className="animate-spin" aria-hidden />
              <p className="fk-body-sm fkp-muted">Activating your invite...</p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="fkp-invite-state">
              <span className="fkp-invite-icon" aria-hidden="true">
                <Check size={28} strokeWidth={1.75} />
              </span>
              <h1 className="fk-t2">
                Welcome to{" "}
                {grantedRole === "creator" ? "Creator" : "Premium"}!
              </h1>
              <p className="fk-body-sm fkp-muted">{message}</p>
              <p className="fk-caption">Redirecting to your dashboard...</p>
            </div>
          )}

          {/* Already has access */}
          {status === "already" && (
            <div className="fkp-invite-state">
              <span className="fkp-invite-icon" aria-hidden="true">
                <ShieldCheck size={28} strokeWidth={1.75} />
              </span>
              <h1 className="fk-t2">{message}</h1>
              <Link href="/dashboard" className="fk-btn">
                Go to dashboard
              </Link>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="fkp-invite-state">
              <span className="fkp-invite-icon" aria-hidden="true">
                <X size={28} strokeWidth={1.75} />
              </span>
              <h1 className="fk-t2">Hmm, that didn&apos;t work</h1>
              <p className="fk-body-sm fkp-muted">{message}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="fk-btn fk-btn-secondary"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        <p className="fk-caption">Invite codes grant free access and never expire.</p>
      </div>
    </div>
  );
}
