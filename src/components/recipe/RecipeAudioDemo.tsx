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
    <section className="fk-tile recipe-audio-demo fk-audio-demo" aria-label="Tone demo">
      <div className="fk-audio-demo-head">
        <h2 className="fk-t3">Hear this tone</h2>
        <span className="fk-caption">Verified, rendered {verified}</span>
      </div>

      <p className="fk-body-sm">{demo.caption}</p>

      {demo.video_url ? (
        <video controls preload="none" poster={undefined} className="fk-audio-demo-media">
          <source src={demo.video_url} type="video/mp4" />
          <source src={demo.audio_url} type="audio/mpeg" />
        </video>
      ) : (
        <audio controls preload="none" className="fk-audio-demo-audio">
          <source src={demo.audio_url} type="audio/mpeg" />
        </audio>
      )}

      {demo.source_note && <p className="fk-caption">{demo.source_note}</p>}
    </section>
  );
}
