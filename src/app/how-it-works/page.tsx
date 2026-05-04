import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Fader & Knob works — verified tone recipes, every modeler",
  description:
    "We chase the original gear, map the signal chain, and translate it to every major modeler. Helix, Quad Cortex, TONEX, Fractal, Kemper, pedalboard. The numbers are the product.",
  openGraph: {
    title: "How Fader & Knob works",
    description: "Verified tone recipes — chase, map, translate. Every modeler.",
    type: "website",
  },
};

const STEPS = [
  {
    no: "1",
    title: "We chase the tone",
    body:
      "Our editors are tone nerds. They listen, isolate, and A/B against rigs we already know inside-out. The Pride and Joy session takes a whole afternoon — most of it on the Tube Screamer's tone knob and the Vibroverb's master volume. Recordings get reverse-engineered against producer interviews, gear lists, and (where it exists) the actual session log.",
    tag: "Editorial",
  },
  {
    no: "2",
    title: "We map the chain",
    body:
      "Every block, every knob, every tap-tempo. The full signal path — guitar, drives, amp, cab, mic placement, post effects — documented like a service manual. If the original tone uses snapshot switching, parallel routing, or a specific footswitch assignment, we say so. You shouldn't have to reverse-engineer it.",
    tag: "Schematic",
  },
  {
    no: "3",
    title: "You get the numbers",
    body:
      "The chain gets translated into the exact block names and parameter values your modeler expects — Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana, or your physical pedalboard. dB is dB. Hz is Hz. Time is ms. Download the patch, import once, and you're playing.",
    tag: "For your rig",
  },
];

const PROMISES = [
  {
    head: "Verified, not guessed",
    body:
      "Every recipe cites its sources — producer interviews, equipboard listings, gear photos, period-correct mods. When we don't know, we say so.",
  },
  {
    head: "Era-correct gear",
    body:
      "We don't list signature pickups on a recording from 1969. The Hetfield Master of Puppets recipe ships with the Jackson King V's stock pickups, not the EMG 81/60 he switched to on …And Justice For All.",
  },
  {
    head: "Real ranges, not 0–10",
    body:
      "Every knob value reads in the actual unit your modeler expects. dB on the cab Level. Hz on the high-pass. Milliseconds on the delay. Generic 0–10 marks are the enemy of repeatable tone.",
  },
  {
    head: "Cab + mic placement",
    body:
      "When the original tone is dual-mic'd (SRV's 4x10 Vibroverb with a Sennheiser 421 close + a Royer 121 ribbon further back), the recipe ships in WithPan and the second mic is in the same patch.",
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
          listening. We do the chain. You get the numbers.
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
            Browse the archive, pick a tone, dial it in. Or read the field
            notes if you want to go deeper into the why.
          </p>
          <div className="hero-cta-row">
            <Link href="/browse" className="hero-cta hero-cta-primary">
              Browse recipes
            </Link>
            <Link href="/blog" className="hero-cta hero-cta-secondary">
              Read field notes
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
