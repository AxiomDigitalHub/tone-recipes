import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllWriters } from "@/lib/writers";

export const metadata: Metadata = {
  title: "About — Fader & Knob",
  description:
    "We chase the original signal chain, map every block, and write it down so you don't have to guess. Built by guitarists for guitarists.",
  openGraph: {
    title: "About Fader & Knob",
    description: "Verified tone recipes by guitarists, for guitarists.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  const writers = getAllWriters();

  return (
    <div className="container">
      <section className="about-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>About</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">
            About <em>Fader &amp; Knob</em>
          </h1>
        </header>

        <div className="about-mission">
          <p className="about-lede">
            Fader &amp; Knob is the tone library and field manual for guitar
            players who use modelers. We document iconic recordings — the
            full signal chain, every knob, every snapshot — and translate
            the settings for your Helix, Quad Cortex, TONEX, Fractal,
            Kemper, Katana, or pedalboard. No guessing. No 0–10 marks.
            Just the numbers.
          </p>
        </div>

        <section className="about-principles">
          <div className="how-head">
            <h2 className="display">How we work</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="hiw-promise-grid">
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Verified before published</h3>
              <p className="hiw-promise-body">
                Every recipe cites its sources — producer interviews,
                equipboard listings, period photos, the actual session log
                where it exists. When we don&apos;t know, we say so.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Era-correct gear</h3>
              <p className="hiw-promise-body">
                We don&apos;t list signature pickups on a recording from
                1969. The Hetfield Master of Puppets recipe ships with the
                Jackson King V&apos;s stock pickups, not the EMG 81/60 he
                switched to on …And Justice For All.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Real ranges, not 0–10</h3>
              <p className="hiw-promise-body">
                Every knob value reads in the actual unit your modeler
                expects. dB. Hz. ms. Generic 0–10 marks are the enemy of
                repeatable tone.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Weekly publishing</h3>
              <p className="hiw-promise-body">
                New recipes and field notes ship every week. The archive
                grows. Old recipes get re-edited as new research surfaces
                — we don&apos;t set and forget.
              </p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="how-head">
            <h2 className="display">The bench</h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">{writers.length} writers</span>
          </div>
          <div className="about-team-grid">
            {writers.map((w) => (
              <div key={w.slug} className="about-writer">
                {w.image && (
                  <div className="about-writer-img">
                    <Image
                      src={w.image}
                      alt={w.name}
                      fill
                      sizes="120px"
                    />
                  </div>
                )}
                <div className="about-writer-meta">
                  <h3 className="about-writer-name">{w.name}</h3>
                  <span className="about-writer-title">{w.title}</span>
                  <p className="about-writer-bio">{w.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
