"use client";

/**
 * Last-resort boundary: catches errors thrown by the ROOT layout itself,
 * where error.tsx can't help. It replaces the entire document, so it must
 * render its own <html>/<body> and can't rely on globals.css — everything
 * is inlined, matching the dark global theme (#0a0a0f / #fafafa / #f59e0b).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 16px",
          background: "#0a0a0f",
          color: "#fafafa",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
          Fader &amp; Knob hit a wrong note.
        </h1>
        <p style={{ maxWidth: 448, fontSize: "1.125rem", color: "#a1a1aa", marginBottom: 32 }}>
          Something went wrong loading the site. Try again — if it keeps
          happening, we&apos;d appreciate a note at hello@faderandknob.com.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: 8,
            background: "#f59e0b",
            color: "#0a0a0f",
            padding: "12px 24px",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        {error.digest && (
          <p style={{ marginTop: 32, fontSize: "0.75rem", color: "#a1a1aa" }}>
            Error ref: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
