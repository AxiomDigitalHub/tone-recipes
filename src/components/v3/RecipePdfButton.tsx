"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import OverlayPortal from "@/components/ui/OverlayPortal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  slug: string;
  /** Class for the trigger button (defaults to v3 .export style). */
  className?: string;
  /** Trigger label (defaults to "Settings PDF ↓"). */
  label?: string;
}

/**
 * v3-styled "Settings PDF" download button. Mirrors the legacy
 * DownloadRecipePDF component but renders in paper/ink chrome and is
 * intended to slot into the platform-switcher row alongside the
 * .hlx / .tsl preset download links.
 *
 * Authenticated users download immediately. Anonymous users see an
 * email-gate modal that posts the email to the same endpoint.
 */
export default function RecipePdfButton({
  slug,
  className = "export",
  label = "Settings PDF ↓",
}: Props) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdf = useCallback(
    async (downloadEmail?: string) => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (user) {
          const supabase = createBrowserClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }
        }
        const body: Record<string, unknown> = { type: "pdf" };
        if (downloadEmail) body.email = downloadEmail;

        const res = await fetch(`/api/recipes/${slug}/download`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Download failed.");
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}-tone-recipe.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowModal(false);
        setEmail("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Download failed.");
      } finally {
        setLoading(false);
      }
    },
    [slug, user],
  );

  const onClick = useCallback(() => {
    if (user) fetchPdf();
    else {
      setShowModal(true);
      setError(null);
    }
  }, [user, fetchPdf]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!EMAIL_RE.test(email)) {
        setError("Please enter a valid email.");
        return;
      }
      fetchPdf(email);
    },
    [email, fetchPdf],
  );

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={className}
        aria-busy={loading || undefined}
      >
        {loading ? "Working…" : label}
      </button>

      {showModal && (
        <OverlayPortal>
        <div
          className="pdf-gate"
          role="dialog"
          aria-modal="true"
          aria-label="Download settings PDF"
          onClick={() => setShowModal(false)}
        >
          <div className="pdf-gate-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pdf-gate-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="pdf-gate-title display">Settings PDF</h3>
            <p className="pdf-gate-dek">
              Drop your email and we&apos;ll send the printable settings sheet.
              Sign in for instant downloads, no email needed.
            </p>
            <form className="pdf-gate-form" onSubmit={onSubmit}>
              <input
                type="email"
                className="pdf-gate-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
              />
              {error && <p className="pdf-gate-error">{error}</p>}
              <button
                type="submit"
                className="pdf-gate-submit"
                disabled={loading}
              >
                {loading ? "Working…" : "Download PDF"}
              </button>
            </form>
            <p className="pdf-gate-foot">
              Already have an account?{" "}
              <a href="/login">Sign in</a> for instant downloads.
            </p>
          </div>
        </div>
        </OverlayPortal>
      )}
    </>
  );
}
