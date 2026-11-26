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
    <div className="fk-wrap fk-notfound">
      <h1 className="fk-display">Something buzzed that shouldn&apos;t.</h1>
      <p className="fk-lead">
        This page hit an error. It&apos;s been logged. Try again, or head
        back to the tones.
      </p>
      <div className="fk-notfound-cta">
        <button type="button" onClick={reset} className="fk-btn">
          Try again
        </button>
        <Link href="/browse" className="fk-btn fk-btn-secondary">
          Browse the tones
        </Link>
      </div>
      {error.digest && (
        <p className="fk-caption">
          Error ref: <span className="fk-data">{error.digest}</span>
        </p>
      )}
    </div>
  );
}
