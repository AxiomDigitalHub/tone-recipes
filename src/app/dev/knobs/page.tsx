import type { Metadata } from "next";
import Knob from "@/components/settings/Knob";
import Fader from "@/components/settings/Fader";
import SettingsGrid from "@/components/settings/SettingsGrid";

export const metadata: Metadata = {
  title: "Knobs & Faders — Design Preview",
  description: "Visual preview of the Fader & Knob setting controls.",
  robots: { index: false, follow: false },
};

/**
 * /dev/knobs — internal design preview for the <Knob>, <Fader>, and
 * <SettingsGrid> components. Not indexed. Delete or move to Storybook once
 * the design is locked.
 */
export default function KnobsPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Knobs & Faders</h1>
      <p className="mb-12 text-sm text-muted">
        Design preview for the Fader &amp; Knob setting controls — used in blog
        posts, recipe pages, and exports.
      </p>

      {/* ── 1. Classic amp knob row ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">1. Classic amp knobs (0–10)</h2>
        <p className="mb-4 text-sm text-muted">
          The Marshall-style panel. Five rotary knobs, equal sizing, chassis
          label above. This is the default visual for amp sections in blog
          posts.
        </p>
        <SettingsGrid title="Amp" subtitle="Marshall JCM800">
          <Knob name="Gain" value={8} />
          <Knob name="Bass" value={4} />
          <Knob name="Mid" value={6} />
          <Knob name="Treble" value={8} />
          <Knob name="Presence" value={7} />
          <Knob name="Master" value={5.5} />
        </SettingsGrid>
      </section>

      {/* ── 2. Sweep edge cases ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">2. Sweep edge cases</h2>
        <p className="mb-4 text-sm text-muted">
          At 0 the arc disappears and the pointer points to 7 o&apos;clock. At
          max the arc fills the full sweep and the pointer reaches 5 o&apos;clock.
        </p>
        <SettingsGrid>
          <Knob name="Min" value={0} />
          <Knob name="Quarter" value={2.5} />
          <Knob name="Noon" value={5} />
          <Knob name="3/4" value={7.5} />
          <Knob name="Max" value={10} />
        </SettingsGrid>
      </section>

      {/* ── 3. Non-default ranges ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">3. Non-default ranges + units</h2>
        <p className="mb-4 text-sm text-muted">
          Knobs can represent any range, not just 0–10. The `display` prop lets
          you override the printed text for ranges like &ldquo;5.5–6.0&rdquo;
          while the pointer sits on the midpoint.
        </p>
        <SettingsGrid title="Compressor" subtitle="Studio Comp">
          <Knob name="Mix" value={0.74} min={0} max={1} />
          <Knob name="Ratio" value={2} min={1} max={20} unit=":1" />
          <Knob name="Knee" value={6} min={0} max={12} unit="dB" />
          <Knob name="Attack" value={0.06} min={0} max={1} unit="s" />
          <Knob name="Release" value={0.91} min={0} max={1} unit="s" />
        </SettingsGrid>
      </section>

      {/* ── 4. Range display ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">4. Range display</h2>
        <p className="mb-4 text-sm text-muted">
          When a blog post says &ldquo;Mid: 5.5–6.0&rdquo; you can pass both
          the midpoint as `value` and the literal display string.
        </p>
        <SettingsGrid>
          <Knob name="Mid" value={5.75} display="5.5–6.0" />
          <Knob name="Treble" value={5} display="4–6" />
          <Knob name="Gain" value={6} display="5–7" />
        </SettingsGrid>
      </section>

      {/* ── 5. Faders ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">5. Faders (linear controls)</h2>
        <p className="mb-4 text-sm text-muted">
          For dB thresholds, long frequency ranges, or anywhere a vertical
          slider mental model beats a rotary sweep.
        </p>
        <SettingsGrid title="Post-EQ" subtitle="Parametric band cuts">
          <Fader name="100Hz" value={-2} min={-12} max={12} unit="dB" />
          <Fader name="220Hz" value={-1.5} min={-12} max={12} unit="dB" />
          <Fader name="5kHz" value={-2} min={-12} max={12} unit="dB" />
          <Fader name="Thresh" value={-36} min={-60} max={0} unit="dB" />
          <Fader name="Mix" value={0.74} min={0} max={1} />
        </SettingsGrid>
      </section>

      {/* ── 6. Sizes ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">6. Sizes</h2>
        <p className="mb-4 text-sm text-muted">
          Three sizes for dense tables (sm), default blog use (md), and hero
          callouts (lg).
        </p>
        <SettingsGrid>
          <Knob name="Small" value={6} size="sm" />
          <Knob name="Medium" value={6} size="md" />
          <Knob name="Large" value={6} size="lg" />
        </SettingsGrid>
        <SettingsGrid>
          <Fader name="Small" value={0.7} min={0} max={1} size="sm" />
          <Fader name="Medium" value={0.7} min={0} max={1} size="md" />
          <Fader name="Large" value={0.7} min={0} max={1} size="lg" />
        </SettingsGrid>
      </section>

      {/* ── 7. Real recipe settings ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">7. Real recipe — SRV Pride and Joy</h2>
        <p className="mb-4 text-sm text-muted">
          A full recipe&apos;s worth of controls rendered using the components.
          This is how the design language would look on a recipe page.
        </p>
        <SettingsGrid title="Pre-amp" subtitle="Ibanez TS808">
          <Knob name="Drive" value={1} />
          <Knob name="Tone" value={6} />
          <Knob name="Level" value={10} />
        </SettingsGrid>
        <SettingsGrid title="Amp" subtitle="Fender Vibroverb">
          <Knob name="Volume" value={7} />
          <Knob name="Bass" value={4} />
          <Knob name="Mid" value={6} />
          <Knob name="Treble" value={6} />
          <Knob name="Presence" value={5} />
        </SettingsGrid>
        <SettingsGrid title="Post" subtitle="Room + mic">
          <Fader name="Room" value={0.2} min={0} max={1} />
          <Fader name="Mic dist" value={18} min={0} max={60} unit="cm" />
        </SettingsGrid>
      </section>

      {/* ── 8. Color variants ── */}
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-bold">8. Color variants</h2>
        <p className="mb-4 text-sm text-muted">
          Per-knob color override. Useful for grouping related controls
          (e.g., reverb knobs all green) or matching real pedal enclosures.
        </p>
        <SettingsGrid>
          <Knob name="Drive" value={7} color="#ef4444" />
          <Knob name="Chorus" value={4} color="#8b5cf6" />
          <Knob name="Delay" value={5} color="#60a5fa" />
          <Knob name="Reverb" value={6} color="#4ade80" />
          <Knob name="Accent" value={8} />
        </SettingsGrid>
      </section>
    </div>
  );
}
