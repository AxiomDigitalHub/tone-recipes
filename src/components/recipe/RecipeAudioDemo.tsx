import type { RecipeAudioDemo as RecipeAudioDemoData } from "@/types/recipe";

/**
 * On-page tone demo: a self-produced clip of THIS recipe's settings (DI run
 * through the actual preset). Renders nothing when no demo exists, so it's
 * safe to drop on every recipe. The "Verified" line is the honest trust
 * signal that replaces the seeded reviews — it points at a real artifact
 * (the clip you can hear) and a real date, not an invented star count.
 */
export default function RecipeAudioDemo({
  demo,
}: {
  demo?: RecipeAudioDemoData;
}) {
  if (!demo) return null;

  const verified = new Date(demo.rendered_at + "T00:00:00Z").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  return (
    <section
      className="recipe-audio-demo"
      style={{
        margin: "2rem 0",
        padding: "1.25rem 1.5rem",
        borderRadius: "0.75rem",
        border: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)",
        background: "var(--paper-2)",
      }}
      aria-label="Tone demo"
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
          Hear this tone
        </h2>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--amber-2)",
            whiteSpace: "nowrap",
          }}
        >
          ✓ Verified · rendered {verified}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--ink-muted)",
          margin: "0 0 0.75rem",
        }}
      >
        {demo.caption}
      </p>

      {demo.video_url ? (
        <video
          controls
          preload="none"
          poster={undefined}
          style={{ width: "100%", borderRadius: "0.5rem", background: "#000" }}
        >
          <source src={demo.video_url} type="video/mp4" />
          <source src={demo.audio_url} type="audio/mpeg" />
        </video>
      ) : (
        <audio controls preload="none" style={{ width: "100%" }}>
          <source src={demo.audio_url} type="audio/mpeg" />
        </audio>
      )}

      {demo.source_note && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--ink-muted)",
            margin: "0.75rem 0 0",
          }}
        >
          {demo.source_note}
        </p>
      )}
    </section>
  );
}
