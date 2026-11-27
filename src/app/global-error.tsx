"use client";

/**
 * Last-resort boundary: catches errors thrown by the ROOT layout itself,
 * where error.tsx can't help. It replaces the entire document, so it must
 * render its own <html>/<body> and can't rely on any stylesheet. Everything
 * is inlined from the redesign tokens: white paper, ink type, ink pill.
 */
const INK = "#131416";
const INK_3 = "#666c73";
const PAPER = "#ffffff";

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
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 20,
          padding: "0 24px",
          maxWidth: 1180,
          marginInline: "auto",
          boxSizing: "border-box",
          background: PAPER,
          color: INK,
          fontFamily: "Karla, -apple-system, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            lineHeight: "52px",
            fontWeight: 600,
            letterSpacing: "-0.035em",
          }}
        >
          Fader &amp; Knob hit a wrong note.
        </h1>
        <p style={{ margin: 0, maxWidth: 560, fontSize: 20, lineHeight: "30px", color: "#4a4f55" }}>
          Something went wrong loading the site. Try again. If it keeps
          happening, we&apos;d appreciate a note at hello@faderandknob.com.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 12,
            height: 48,
            padding: "0 22px",
            borderRadius: 999,
            background: INK,
            color: PAPER,
            border: `1px solid ${INK}`,
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        {error.digest && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: INK_3 }}>
            Error ref:{" "}
            <span style={{ fontFamily: "'Geist Mono', ui-monospace, Menlo, Consolas, monospace" }}>
              {error.digest}
            </span>
          </p>
        )}
      </body>
    </html>
  );
}
