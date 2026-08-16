import Link from "next/link";
import type { Metadata } from "next";
import ToneChatClient from "@/components/tone-chat/ToneChatClient";

export const metadata: Metadata = {
  alternates: { canonical: "/tone-chat" },
  title: "Ask Axl — AI tone tech",
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
          Axl is AI, answering from the recipe archive and general tone
          knowledge — part of{" "}
          <Link
            href="/experiment"
            style={{ color: "var(--amber-2)", textDecoration: "underline" }}
          >
            the open experiment
          </Link>
          . Trust your ears over any setting on a screen; when he gets one
          wrong, tell us and the fix ships in public.
        </p>

        {/* The page was a heading, a chat box and a disclaimer — nothing a
            crawler could read as content, and nothing telling a first-time
            visitor what to type. Flagged as low word count in the audit. */}
        <section className="hub-prose" aria-labelledby="axl-how-head">
          <div className="how-head">
            <h2 id="axl-how-head" className="display">
              What to ask him
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>

          <p>
            Axl is most useful when you describe a sound rather than request
            a preset. &quot;I need the clean tone from Comfortably Numb but
            on an HX Stomp with only six blocks&quot; is a question he can
            answer. &quot;Give me a good clean tone&quot; isn&apos;t, because
            there are a hundred of those and none of them are aimed at your
            rig.
          </p>

          <h3>Things he handles well</h3>
          <ul>
            <li>
              Porting a chain to your unit — which block replaces which, and
              what the parameter actually maps to.
            </li>
            <li>
              Gain staging: where the distortion should come from, and what
              to turn down when a patch sounds fizzy or muddy.
            </li>
            <li>
              Fitting a chain into a block limit, and what to drop first
              when it doesn&apos;t fit.
            </li>
            <li>
              Diagnosing a problem you can describe — too much low end,
              lifeless in a band mix, fizzy top on a solo-boost snapshot.
            </li>
          </ul>

          <h3>Things to check yourself</h3>
          <p>
            He answers from the recipe archive and general tone knowledge,
            which means the further a question sits from a documented
            recipe, the more he&apos;s reasoning rather than reciting. Model
            names, block counts, and parameter ranges are worth confirming
            against your own unit before you commit a patch to a gig. If a
            recipe already exists for what you&apos;re after, he&apos;ll link
            it — that page is the more reliable source, because the settings
            there were built and checked rather than generated in the
            moment.
          </p>

          <h3>Prefer to browse?</h3>
          <p>
            Every chain he draws from is readable directly:{" "}
            <Link href="/browse">the archive</Link> lists them by song and
            artist, <Link href="/platforms">the platform pages</Link> filter
            to your modeler, and{" "}
            <Link href="/set-packs/worship">the worship set pack</Link>{" "}
            bundles one Helix preset that covers a full setlist without any
            of this.
          </p>
        </section>
      </section>
    </div>
  );
}
