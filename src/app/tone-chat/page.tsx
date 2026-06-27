import Link from "next/link";
import type { Metadata } from "next";
import ToneChatClient from "@/components/tone-chat/ToneChatClient";

export const metadata: Metadata = {
  title: "Ask Axl — Fader & Knob's tone tech",
  description:
    "Ask Axl — a road-dog guitar lifer with forty years of tone on tap, grounded in the full Fader & Knob recipe archive. Describe the sound in your head and get the signal chain, the settings, and the recipe to build it on your modeler.",
  openGraph: {
    title: "Ask Axl — Fader & Knob's tone tech",
    description:
      "Forty years of tone, on tap. Describe the sound in your head — get the signal chain, settings, and recipes to build it.",
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
          <span style={{ color: "var(--ink, #0A0908)" }}>Ask Axl</span>
        </div>

        <header className="archive-page-head">
          <h1 className="archive-title">Ask Axl</h1>
          <p
            className="mt-2 max-w-2xl"
            style={{ color: "var(--ink-muted, #6b6257)" }}
          >
            Forty years of tone, on tap. Axl is a road-dog guitar lifer who&apos;s
            played every stage and abused every amp — tell him the sound in your
            head, an artist, a song, or a problem you&apos;re fighting, and he&apos;ll
            hand you real signal chains and settings, grounded in the recipe
            archive. Pick your rig and he speaks your modeler&apos;s language.
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
