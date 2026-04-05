"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/db/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient();

    // Where to go after sign-in: saved page or home
    const returnTo = typeof window !== "undefined"
      ? sessionStorage.getItem("returnTo") || "/"
      : "/";

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
