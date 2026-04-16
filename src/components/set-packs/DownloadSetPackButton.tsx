"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import SignupPromptModal from "@/components/auth/SignupPromptModal";

interface DownloadSetPackButtonProps {
  /** Pack slug — maps to /api/set-packs/[slug]. Today only "worship". */
  packSlug: string;
  /** Human-readable pack name for the signup modal reason line. */
  packName: string;
}

const PENDING_SET_PACK_KEY = "fk_pending_set_pack";

/**
 * Download button for a Set Pack (.hlx). Mirrors the gating UX from
 * DownloadPatchButton but hits the /api/set-packs/[slug] route instead
 * of the per-recipe download route.
 *
 * Anon users → SignupPromptModal. After OAuth redirect, the pending flag
 * is picked up and the download resumes automatically.
 * Authed users → fetch the file with Bearer token, save via blob URL.
 */
export default function DownloadSetPackButton({
  packSlug,
  packName,
}: DownloadSetPackButtonProps) {
  const { user } = useAuth();

  const [signupOpen, setSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const doDownload = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setSignupOpen(true);
        return;
      }

      const res = await fetch(`/api/set-packs/${packSlug}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(json.error ?? "Unable to download right now. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="?([^";]+)"?/i);
      a.download = match?.[1] ?? `${packSlug}.hlx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [packSlug]);

  // Resume pending download after OAuth redirect.
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(PENDING_SET_PACK_KEY);
    if (raw !== packSlug) return;

    sessionStorage.removeItem(PENDING_SET_PACK_KEY);
    void doDownload();
  }, [user, packSlug, doDownload]);

  function handleClick() {
    if (!user) {
      setSignupOpen(true);
      return;
    }
    void doDownload();
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download .hlx Preset
      </button>

      <SignupPromptModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={() => {
          setSignupOpen(false);
          void doDownload();
        }}
        reason={`Sign up to download the ${packName} Set Pack — free while we're in launch mode.`}
        pendingKey={PENDING_SET_PACK_KEY}
        pendingValue={packSlug}
      />
    </>
  );
}
