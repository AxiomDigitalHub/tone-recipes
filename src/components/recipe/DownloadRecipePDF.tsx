"use client";

import { useState, useCallback } from "react";
import { FileDown, Loader2, X, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";

interface DownloadRecipePDFProps {
  recipeSlug: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DownloadRecipePDF({ recipeSlug }: DownloadRecipePDFProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const downloadPDF = useCallback(
    async (downloadEmail?: string) => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // If authenticated, attach Bearer token
        if (user) {
          const supabase = createBrowserClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }
        }

        const body: Record<string, unknown> = { type: "pdf" };
        if (downloadEmail) {
          body.email = downloadEmail;
        }

        const res = await fetch(`/api/recipes/${recipeSlug}/download`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Download failed. Please try again.");
        }

        // Trigger download via blob → anchor click
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${recipeSlug}-tone-recipe.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Download failed.");
      } finally {
        setLoading(false);
      }
    },
    [user, recipeSlug],
  );

  const handleClick = useCallback(() => {
    if (user) {
      // Authenticated — download directly
      downloadPDF();
    } else {
      // Show email gate modal
      setShowModal(true);
      setError(null);
      setSuccess(false);
    }
  }, [user, downloadPDF]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!EMAIL_RE.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      downloadPDF(newsletterOptIn ? email : undefined);
    },
    [email, newsletterOptIn, downloadPDF],
  );

  return (
    <>
      {/* Download button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        Download PDF
      </button>

      {/* Email gate modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal card */}
          <div
            className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-muted transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {success ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-sm font-medium">Download started!</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Download Tone Recipe PDF</h3>
                  <p className="mt-1 text-sm text-muted">
                    Enter your email to download this recipe as a printable PDF.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="download-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="download-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                      className="mt-0.5 rounded border-border"
                    />
                    <span>
                      Also subscribe me to the Fader & Knob newsletter for tone
                      tips, new recipes, and gear guides.
                    </span>
                  </label>

                  {error && (
                    <p className="text-xs text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-accent/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                    Download PDF
                  </button>
                </form>

                <p className="mt-3 text-center text-xs text-muted">
                  Already have an account?{" "}
                  <a href="/login" className="text-accent hover:underline">
                    Sign in
                  </a>{" "}
                  for instant downloads.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
