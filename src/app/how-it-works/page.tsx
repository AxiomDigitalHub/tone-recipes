import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/how-it-works" },
  title: "How Fader & Knob works — tone recipes, every modeler",
  description:
    "We chase the original gear, map the signal chain, and translate it to every major modeler. Helix, Quad Cortex, TONEX, Fractal, Kemper, pedalboard. The numbers are the product.",
  openGraph: {
    title: "How Fader & Knob works",
    description: "Tone recipes — chase, map, translate. Every modeler.",
    type: "website",
  },
};

const STEPS = [
  {
    no: "1",
    title: "We chase the tone",
    body:
      "Every recipe starts with the historical record: producer interviews, gear lists, period photos, live footage, and the session log when one exists. Our AI research pipeline reads all of it and works out what was plugged into what, with sources cited and inferred settings marked as inferred. When the record is thin, the recipe says so.",
    tag: "Research",
  },
  {
    no: "2",
    title: "We map the chain",
    body:
      "Every block, every knob, every tap-tempo. The full signal path (guitar, drives, amp, cab, mic placement, post effects) is documented like a service manual. If the original tone uses snapshot switching, parallel routing, or a specific footswitch assignment, the recipe spells it out.",
    tag: "Schematic",
  },
  {
    no: "3",
    title: "You get the numbers",
    body:
      "The chain gets translated into the block names and parameter values your modeler uses: Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana, or a physical pedalboard. dB is dB, Hz is Hz, time is ms. Helix, Quad Cortex, and Katana players download a preset; everyone else dials the numbers in by hand.",
    tag: "For your rig",
  },
];

const PROMISES = [
  {
    head: "Sources cited",
    body:
      "Every recipe cites its sources: producer interviews, Equipboard listings, gear photos, period-correct mods. When we don't know, we say so. When we get one wrong, the fix ships as a public commit.",
  },
  {
    head: "Era-correct gear",
    body:
      "We don't list signature pickups on a recording from 1969. The Hetfield Master of Puppets recipe leaves out the EMG 81/60 set he moved to on …And Justice For All.",
  },
  {
    head: "Real units on every knob",
    body:
      "dB on the cab level, Hz on the high-pass, milliseconds on the delay. A generic 0–10 mark is impossible to repeat.",
  },
  {
    head: "Cab + mic placement",
    body:
      "When the original tone is dual-mic'd (SRV's 4x10 Vibroverb with a Sennheiser 421 close and a Royer 121 ribbon further back), the second mic is built into the same Helix patch.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container">
      <section className="how-it-works-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>How it works</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">How this works</h1>
        </header>

        <p className="hiw-lede">
          Three steps from your favorite song to your rig. We do the
          listening and map the chain; you get the numbers.
        </p>

        <ol className="how-steps hiw-steps">
          {STEPS.map((s) => (
            <li key={s.no} className="how-step">
              <span className="how-step-no" aria-hidden="true">
                {s.no}
              </span>
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-body">{s.body}</p>
            </li>
          ))}
        </ol>

        <section className="hiw-promises">
          <div className="how-head">
            <h2 className="display">What you can count on</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="hiw-promise-grid">
            {PROMISES.map((p) => (
              <div key={p.head} className="hiw-promise">
                <h3 className="hiw-promise-head">{p.head}</h3>
                <p className="hiw-promise-body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-cta">
          <h2 className="display">Ready to play</h2>
          <p>
            Pick a song from the archive and dial it in. The blog goes
            deeper on why the settings work.
          </p>
          <div className="hero-cta-row">
            <Link href="/browse" className="hero-cta hero-cta-primary">
              Browse the tones
            </Link>
            <Link href="/blog" className="hero-cta hero-cta-secondary">
              Read the blog
            </Link>
          </div>
          <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-muted)" }}>
            Curious who&apos;s behind this? Mostly an AI, and we say so.{" "}
            <Link
              href="/how-we-work"
              style={{ color: "var(--amber-2)", textDecoration: "underline" }}
            >
              How we work
            </Link>{" "}
            explains the machine, and{" "}
            <Link
              href="/experiment"
              style={{ color: "var(--amber-2)", textDecoration: "underline" }}
            >
              the experiment
            </Link>{" "}
            shows the running record.
          </p>
        </section>
      </section>
    </div>
  );
}
