"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary. Catches render/data errors anywhere below
 * the root layout (the layout chrome itself stays mounted) and shows a
 * branded fallback with a retry instead of Next's unstyled default.
 * Mirrors not-found.tsx styling.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server components log server-side; this covers client-side throws.
    // The digest is what correlates with the server log line.
    console.error("[error-boundary]", error.digest ?? "", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1
        className="mb-4 text-4xl font-bold text-foreground md:text-5xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        Something buzzed that shouldn&apos;t.
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted">
        This page hit an error. It&apos;s been logged — try again, or head
        back to the tones.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/browse"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
        >
          Browse the Tones
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-muted">Error ref: {error.digest}</p>
      )}
    </div>
  );
}
