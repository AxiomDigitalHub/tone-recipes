"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import SignupPromptModal from "@/components/auth/SignupPromptModal";
import UpgradePromptModal from "@/components/auth/UpgradePromptModal";

interface DownloadPatchButtonProps {
  /** The recipe slug — used to call the download API. */
  recipeSlug: string;
  /** Display name used for the preset filename + modal reason line.
   *  Optional — UnifiedChainView treats presetName as optional too. */
  presetName?: string;
  /** Platform key: "helix" or "katana". Other platforms fall through
   *  (component returns null) until their preset files are validated. */
  platform: string;
}

const PLATFORM_CONFIG: Record<
  string,
  { color: string; label: string; extension: string }
> = {
  helix: {
    color: "#cc0000",
    label: "Download Helix Patch",
    extension: ".hlx",
  },
  katana: {
    color: "#e11d48",
    label: "Download Katana Patch",
    extension: ".tsl",
  },
};

const PENDING_DOWNLOAD_KEY = "fk_pending_download";

interface PendingDownload {
  slug: string;
  platform: string;
  presetName: string;
}

/**
 * Download a preset file for a recipe + platform.
 *
 * Flow depends on auth state:
 *   anon       → opens signup modal; stashes pending-download, resumes after
 *                OAuth return.
 *   free       → routes through /api/recipes/[slug]/download which enforces
 *                the 10-per-month limit and logs the download. On 403 (limit
 *                hit) opens the upgrade modal.
 *   premium+   → same API call, just always succeeds.
 *
 * Server-side download + logging means the free-tier counter (shown by
 * `DownloadCounter`) stays accurate and can't be bypassed from the browser.
 */
export default function DownloadPatchButton({
  recipeSlug,
  presetName,
  platform,
}: DownloadPatchButtonProps) {
  const { user } = useAuth();
  const config = PLATFORM_CONFIG[platform];

  const [signupOpen, setSignupOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const doDownload = useCallback(async () => {
    if (!config) return;
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        // Shouldn't happen — caller checks user state first — but don't
        // crash if the session vanished between click and fetch.
        setSignupOpen(true);
        return;
      }

      const res = await fetch(`/api/recipes/${recipeSlug}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ type: "preset", platform }),
      });

      if (res.status === 403) {
        // Free-tier limit reached.
        const json = await res.json().catch(() => ({}));
        setUpgradeReason(
          json.error ??
            "You've used all your free downloads. Upgrade to Tone Pass for unlimited.",
        );
        setUpgradeOpen(true);
        return;
      }

      if (!res.ok) {
        // Other errors — surface something to the user without opening a
        // full modal; inline alert is simpler here.
        const json = await res.json().catch(() => ({}));
        alert(json.error ?? "Unable to download right now. Please try again.");
        return;
      }

      // Success — save the blob as a file.
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Prefer server-supplied filename from Content-Disposition; fall back
      // to a slugified version of the recipe title.
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="?([^";]+)"?/i);
      a.download = match?.[1] ?? `${recipeSlug}${config.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [config, platform, recipeSlug]);

  // Resume a pending download after the user returns from OAuth. The flag
  // is set by SignupPromptModal before redirecting to Google.
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(PENDING_DOWNLOAD_KEY);
    if (!raw) return;

    let pending: PendingDownload;
    try {
      pending = JSON.parse(raw) as PendingDownload;
    } catch {
      sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
      return;
    }

    // Only resume if this specific button matches the pending action. Other
    // DownloadPatchButton instances on the same page (different platforms)
    // will no-op.
    if (pending.slug !== recipeSlug || pending.platform !== platform) return;

    sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
    // Kick off the download. The session should be hydrated by the time
    // auth-context sets `user`.
    void doDownload();
  }, [user, recipeSlug, platform, doDownload]);

  if (!config) return null;

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
        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60"
        style={{
          borderColor: config.color + "4d",
          backgroundColor: config.color + "1a",
          color: config.color,
        }}
        title={config.label}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {config.label}
      </button>

      <SignupPromptModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={() => {
          setSignupOpen(false);
          // User just created an account via email/password (Google path
          // redirects out and resumes via the effect above). Trigger the
          // download they were trying to do.
          void doDownload();
        }}
        reason={
          presetName
            ? `Sign up to download the ${platformLabel(platform)} preset for "${presetName}".`
            : `Sign up to download the ${platformLabel(platform)} preset.`
        }
        pendingKey={PENDING_DOWNLOAD_KEY}
        pendingValue={JSON.stringify({
          slug: recipeSlug,
          platform,
          presetName: presetName ?? "",
        } satisfies PendingDownload)}
      />

      <UpgradePromptModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />
    </>
  );
}

function platformLabel(platform: string): string {
  switch (platform) {
    case "helix":
      return "Helix";
    case "katana":
      return "Katana";
    case "quad_cortex":
      return "Quad Cortex";
    default:
      return platform;
  }
}
