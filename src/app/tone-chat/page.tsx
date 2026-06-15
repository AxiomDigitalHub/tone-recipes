import Link from "next/link";
import type { Metadata } from "next";
import ToneChatClient from "@/components/tone-chat/ToneChatClient";

export const metadata: Metadata = {
  title: "Tone Chat — Fader & Knob",
  description:
    "Talk to an AI tone assistant grounded in the full Fader & Knob recipe archive. Describe the sound in your head — get the signal chain, the settings, and the recipe to build it on your modeler.",
  openGraph: {
    title: "Tone Chat — Fader & Knob",
    description:
      "Describe the sound in your head — get the signal chain, settings, and recipes to build it.",
    type: "website",
  },
};

export default function ToneChatPage() {
  return (
    <div className="container">
      <section className="archive-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink, #0A0908)" }}>Tone Chat</span>
        </div>

        <header className="archive-page-head">
          <h1 className="archive-title">Tone Chat</h1>
          <p
            className="mt-2 max-w-2xl"
            style={{ color: "var(--ink-muted, #6b6257)" }}
          >
            Describe the sound in your head — an artist, a song, a problem
            you&apos;re fighting — and get real signal chains and settings,
            grounded in the recipe archive. Pick your rig and the advice
            speaks your modeler&apos;s language.
          </p>
        </header>

        <ToneChatClient />

        <p
          className="mt-6 text-xs"
          style={{ color: "var(--ink-muted, #6b6257)" }}
        >
          Answers are AI-generated from our human-verified recipe archive and
          general tone knowledge — trust your ears over any setting on a
          screen. Researched by AI, verified by guitarists.
        </p>
      </section>
    </div>
  );
}
