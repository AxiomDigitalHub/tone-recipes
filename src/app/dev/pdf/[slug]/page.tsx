"use client";

import { useCallback, useEffect, useState, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";

/**
 * Dev-only PDF preview surface — `/dev/pdf/[slug]`.
 *
 * Calls the same `/api/recipes/[slug]/download` endpoint that the
 * recipe page uses, but inlines the PDF in an iframe instead of
 * forcing a file download. Lets us iterate on
 * src/lib/pdf/generate-recipe-pdf.ts without the click-download-open-
 * close loop.
 *
 * Auth: uses the current Supabase session if signed in (preferred —
 * no email-gate, no rate-limit speed bump). If not signed in, prompts
 * for an email so anonymous flows can be tested too.
 */

interface Params {
  slug: string;
}

export default function DevPdfPreviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFallback, setEmailFallback] = useState("");

  const fetchPdf = useCallback(async () => {
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
      if (!user && emailFallback) body.email = emailFallback;

      const res = await fetch(`/api/recipes/${slug}/download`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Download failed: ${res.status}`);
      }

      const blob = await res.blob();
      // Revoke any previous object URL so we don't leak.
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  }, [slug, user, emailFallback]);

  // Auto-fetch on first load if signed in (so the iframe is ready
  // immediately). Anonymous users see the email form first.
  useEffect(() => {
    if (user) fetchPdf();
    // Intentionally only on user state changing — not on every fetchPdf
    // identity change, since fetchPdf already captures slug/email.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cleanup object URL on unmount.
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dev-pdf-page">
      <header className="dev-pdf-head">
        <div>
          <span className="dev-pdf-eyebrow">Dev preview</span>
          <h1 className="dev-pdf-title">
            PDF: <code>{slug}</code>
          </h1>
        </div>
        <div className="dev-pdf-actions">
          <Link href={`/recipe/${slug}`} className="dev-pdf-btn-secondary">
            ← Open recipe
          </Link>
          <button
            type="button"
            onClick={fetchPdf}
            disabled={loading}
            className="dev-pdf-btn-primary"
          >
            {loading ? "Building…" : "Reload PDF"}
          </button>
        </div>
      </header>

      {!user && !pdfUrl && (
        <div className="dev-pdf-anon">
          <p>
            <em>
              Not signed in. Drop an email to bypass the gate (this is dev-
              only — sign in for the full flow).
            </em>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPdf();
            }}
            className="dev-pdf-anon-form"
          >
            <input
              type="email"
              required
              value={emailFallback}
              onChange={(e) => setEmailFallback(e.target.value)}
              placeholder="dev@example.com"
              className="dev-pdf-input"
            />
            <button type="submit" className="dev-pdf-btn-primary">
              Build PDF
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="dev-pdf-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title={`Recipe PDF preview — ${slug}`}
          className="dev-pdf-frame"
        />
      )}

      <style jsx>{`
        .dev-pdf-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);
          padding: 16px 20px;
          gap: 12px;
        }
        .dev-pdf-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .dev-pdf-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .dev-pdf-title {
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1;
          margin: 4px 0 0;
          color: var(--ink);
        }
        .dev-pdf-title code {
          font-family: var(--font-mono);
          font-size: 14px;
          background: var(--paper-2);
          padding: 2px 6px;
          margin-left: 4px;
        }
        .dev-pdf-actions {
          display: flex;
          gap: 8px;
        }
        .dev-pdf-btn-primary,
        .dev-pdf-btn-secondary {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 8px 14px;
          border: 1px solid var(--ink);
          cursor: pointer;
          text-decoration: none;
          color: var(--ink);
          background: var(--paper);
          transition: background 140ms ease, color 140ms ease;
        }
        .dev-pdf-btn-primary {
          background: var(--ink);
          color: var(--paper);
        }
        .dev-pdf-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .dev-pdf-btn-secondary:hover {
          background: var(--ink);
          color: var(--paper);
        }
        .dev-pdf-anon {
          padding: 20px;
          border: 1px solid var(--paper-line);
          background: var(--paper);
        }
        .dev-pdf-anon-form {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .dev-pdf-input {
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 8px 12px;
          border: 1px solid var(--ink);
          background: var(--paper);
          color: var(--ink);
          flex: 1;
          min-width: 240px;
        }
        .dev-pdf-error {
          padding: 12px 16px;
          border: 1px solid #a23b1f;
          background: rgba(162, 59, 31, 0.08);
          color: #a23b1f;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .dev-pdf-frame {
          flex: 1;
          width: 100%;
          border: 1px solid var(--paper-line);
          background: var(--paper);
        }
      `}</style>
    </div>
  );
}
