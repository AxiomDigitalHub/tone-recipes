"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient } from "@/lib/db/client";
import { toast } from "@/lib/stores/toast-store";
import { track } from "@/lib/analytics";

/** Platforms the generator route can build a preset for. */
export type DownloadablePlatform = "helix" | "quad_cortex" | "katana";

interface PresetDownloadButtonProps {
  recipeSlug: string;
  platform: DownloadablePlatform;
  /** Where this button lives — for analytics ("platform_switcher", "floating_chip", etc.). */
  source: string;
  /** Optional override; falls back to "Download .hlx pack ↓" etc. */
  label?: string;
  /** Tailwind classes for the rendered button. */
  className?: string;
  children?: React.ReactNode;
}

const PLATFORM_META: Record<
  DownloadablePlatform,
  { extension: string; label: string }
> = {
  helix: { extension: "hlx", label: "Download .hlx pack ↓" },
  quad_cortex: { extension: "json", label: "Download QC pack ↓" },
  katana: { extension: "tsl", label: "Download .tsl pack ↓" },
};

/**
 * Auth-gated preset download.
 *
 * Hits POST /api/recipes/<slug>/download, which GENERATES the preset from
 * the recipe's platform translation and returns a zip with the preset plus
 * TONE-NOTES / INSTALL / IF-IT-SOUNDS-WRONG sidecars. It previously called
 * GET /api/preset/<slug>, which served pre-built files from `presets/` —
 * that directory holds 50 .hlx and zero .tsl against ~195 recipes, so most
 * Helix downloads and every Katana download 404'd after sign-in.
 *
 * The generator route also enforces the free tier's 5-per-month quota
 * (PRICING_MODEL.md) and answers 402 when it's spent; that maps to an
 * upgrade toast pointing at /pricing rather than a generic error.
 *
 * Behaviour by user state:
 *   - anonymous → sign-in toast + redirect to /login?return=/recipe/<slug>
 *   - signed in → POST with bearer token, save zip, success toast
 */
export default function PresetDownloadButton({
  recipeSlug,
  platform,
  source,
  label,
  className,
  children,
}: PresetDownloadButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const meta = PLATFORM_META[platform];

  const onClick = useCallback(async () => {
    track("recipe_download_click", {
      recipe_slug: recipeSlug,
      format: meta.extension,
      platform,
      source,
    });

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
        `/api/recipes/${encodeURIComponent(recipeSlug)}/download`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "preset", platform }),
        },
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          upgrade_url?: string;
        };
        // 402 = monthly free quota spent. Send them to /pricing, not an
        // error dead-end.
        if (res.status === 402) {
          toast.info(data.error ?? "You've used your free downloads this month.", {
            href: data.upgrade_url ?? "/pricing",
            label: "See Pass",
          });
          return;
        }
        toast.error(data.error ?? "Couldn't download. Try again.");
        return;
      }

      const blob = await res.blob();
      saveBlob(blob, filenameFrom(res, recipeSlug));
      toast.success("Downloaded — unzip and read INSTALL.txt first.");
    } catch (err) {
      console.error("preset download failed:", err);
      toast.error("Couldn't download. Try again.");
    } finally {
      setBusy(false);
    }
  }, [user, busy, recipeSlug, platform, meta.extension, source, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={className}
      aria-busy={busy}
    >
      {children ?? (busy ? "Building…" : label ?? meta.label)}
    </button>
  );
}

/** Prefer the server's Content-Disposition filename; fall back to the slug. */
function filenameFrom(res: Response, slug: string): string {
  const header = res.headers.get("content-disposition") ?? "";
  const match = header.match(/filename="([^"]+)"/);
  return match?.[1] ?? `${slug}-pack.zip`;
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
