"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isSupabaseConfigured, createBrowserClient } from "@/lib/db/client";

/**
 * Google sign-in via Google Identity Services + Supabase signInWithIdToken.
 *
 * Why this exists: the old signInWithOAuth redirect flow bounces through
 * Supabase's callback URL, so Google's consent screen says "to continue to
 * <project-ref>.supabase.co" — an unbranded, trust-killing string. GIS runs
 * the whole exchange on OUR origin: Google issues an ID token to the browser
 * and we hand it straight to Supabase. The consent popup then shows
 * faderandknob.com (or the branded app name once the consent screen is
 * verified). No redirect round trip — the session lands in-page, so callers
 * resume via onSuccess instead of sessionStorage + /auth/callback.
 *
 * Requirements (see docs/VERCEL_DECOMMISSION_SPRINT.md follow-ups):
 *   - NEXT_PUBLIC_GOOGLE_CLIENT_ID: the SAME OAuth client ID configured in
 *     the Supabase Google provider (Supabase validates the token's `aud`
 *     against it). Build-time var: GH repo variable → Docker build-arg.
 *   - https://faderandknob.com added to that client's Authorized JavaScript
 *     origins in Google Cloud Console (plus http://localhost:3000 for dev).
 *
 * Fallback: when the client ID is absent (or GIS fails to load), we render
 * the caller-supplied `fallback` — each call site passes its original
 * custom button wired to the old redirect flow — so this ships safely
 * before the env var / Google Console config exists.
 *
 * Nonce handling per Supabase docs: GIS gets the SHA-256 hash, Supabase
 * gets the raw value, and Supabase hashes + compares against the token.
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GsiCredentialResponse {
  credential: string;
}

interface GsiButtonConfig {
  type: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  click_listener?: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GsiCredentialResponse) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, config: GsiButtonConfig) => void;
        };
      };
    };
  }
}

let gsiLoader: Promise<void> | null = null;

function loadGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiLoader) return gsiLoader;
  gsiLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiLoader = null; // allow retry on next mount
      reject(new Error("Failed to load Google Identity Services"));
    };
    document.head.appendChild(script);
  });
  return gsiLoader;
}

function randomNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

interface GoogleSignInButtonProps {
  /** Called after Supabase has the session (auth-context state updates via
   *  onAuthStateChange in parallel). Resume the user's action / redirect. */
  onSuccess?: () => void;
  onError?: (message: string) => void;
  /** Fires when the user clicks the Google button, before the popup. */
  onClick?: () => void;
  /** Button label variant — all current call sites use "continue_with". */
  text?: GsiButtonConfig["text"];
  /** Rendered when GIS is unavailable (no client ID, demo mode, script
   *  failure). Pass the legacy custom button wired to the redirect flow. */
  fallback?: ReactNode;
  className?: string;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  onClick,
  text = "continue_with",
  fallback = null,
  className,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // Refs so the GIS callback (registered once per mount) sees fresh handlers.
  const handlersRef = useRef({ onSuccess, onError });
  handlersRef.current = { onSuccess, onError };

  const enabled = Boolean(CLIENT_ID) && isSupabaseConfigured();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        await loadGsiScript();
        if (cancelled || !containerRef.current || !window.google) return;

        const rawNonce = randomNonce();
        const hashedNonce = await sha256Hex(rawNonce);
        if (cancelled || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID as string,
          nonce: hashedNonce,
          callback: async (response) => {
            try {
              const supabase = createBrowserClient();
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce: rawNonce,
              });
              if (error) handlersRef.current.onError?.(error.message);
              else handlersRef.current.onSuccess?.();
            } catch (e) {
              handlersRef.current.onError?.(
                e instanceof Error ? e.message : "Google sign-in failed.",
              );
            }
          },
        });

        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "left",
          // GIS caps at 400px; fill the auth card up to that.
          width: Math.min(containerRef.current.offsetWidth || 400, 400),
          click_listener: onClick,
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // text/onClick are render-config; a mid-session change isn't a real case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled || failed) return <>{fallback}</>;
  return (
    <div
      ref={containerRef}
      className={className}
      // Center the fixed-width GIS iframe inside full-width auth cards.
      style={{ display: "flex", justifyContent: "center", minHeight: 44 }}
    />
  );
}
