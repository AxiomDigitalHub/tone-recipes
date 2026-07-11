"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/db/client";
import { safeNextPath, DEFAULT_POST_AUTH } from "@/lib/auth/redirect";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient();

    // Where to go after sign-in: the saved same-origin path, else the
    // dashboard. (Used to default to "/" — that was the "signed in, landed
    // on home" bug. Validated to prevent an open-redirect via a crafted
    // stored value.)
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem("returnTo")
        : null;
    const returnTo = safeNextPath(stored) ? stored : DEFAULT_POST_AUTH;

    function handleRedirect() {
      sessionStorage.removeItem("returnTo");
      router.replace(returnTo);
    }

    // Supabase client automatically picks up the hash fragment
    // (#access_token=...) and sets the session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        handleRedirect();
      }
    });

    // Also handle the case where the session is already set
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleRedirect();
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-muted">Signing you in...</p>
      </div>
    </div>
  );
}
