"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import { toast } from "@/lib/stores/toast-store";
import { track } from "@/lib/analytics";

interface PresetDownloadButtonProps {
  recipeSlug: string;
  format: "hlx" | "tsl";
  /** Where this button lives — for analytics ("platform_switcher", "floating_chip", etc.). */
  source: string;
  /** Optional override; falls back to "Download .hlx ↓" / "Download .tsl ↓". */
  label?: string;
  /** Tailwind classes for the rendered button. */
  className?: string;
  children?: React.ReactNode;
}

const FORMAT_LABEL: Record<"hlx" | "tsl", string> = {
  hlx: "Download .hlx ↓",
  tsl: "Download .tsl ↓",
};

/**
 * Auth-gated preset download.
 *
 * Behaviour by user state:
 *   - anonymous → sign-in toast + redirect to /login?return=/recipe/<slug>
 *   - signed in → fetch with bearer token, save blob, success toast
 *
 * As of 2026-05-10 there is no quota — the catalog is free. Sign-in
 * remains for analytics and abuse rate-limiting. Fires
 * `recipe_download_click` on every press for funnel visibility.
 */
export default function PresetDownloadButton({
  recipeSlug,
  format,
  source,
  label,
  className,
  children,
}: PresetDownloadButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    track("recipe_download_click", { recipe_slug: recipeSlug, format, source });

    // Anon → kick to sign-in. Use a query param so /login can redirect
    // back here after success.
    if (!user) {
      toast.info("Sign in to download presets.", {
        href: `/login?return=${encodeURIComponent(`/recipe/${recipeSlug}`)}`,
        label: "Sign in",
      });
      router.push(`/login?return=${encodeURIComponent(`/recipe/${recipeSlug}`)}`);
      return;
    }

    if (busy) return;
    setBusy(true);

    try {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Your session expired. Sign in again.");
        router.push("/login");
        return;
      }

      const res = await fetch(
        `/api/preset/${encodeURIComponent(recipeSlug)}?format=${format}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error ?? "Couldn't download. Try again.");
        return;
      }

      const blob = await res.blob();
      saveBlob(blob, `${recipeSlug}.${format}`);
      toast.success(`Downloaded ${recipeSlug}.${format}.`);
    } catch (err) {
      console.error("preset download failed:", err);
      toast.error("Couldn't download. Try again.");
    } finally {
      setBusy(false);
    }
  }, [user, busy, recipeSlug, format, source, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={className}
      aria-busy={busy}
    >
      {children ?? (busy ? "Downloading…" : label ?? FORMAT_LABEL[format])}
    </button>
  );
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after a tick — Safari needs the URL to stay alive briefly.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
