import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

export const metadata: Metadata = {
  alternates: { canonical: "/how-we-work" },
  title: "How We Work",
  description:
    "How Fader & Knob uses AI to research tones, generate presets, and write content — an open experiment with the full record public at /experiment.",
  openGraph: {
    title: "How We Work | Fader & Knob",
    description:
      "An open AI experiment in guitar tone — here's exactly how the machine works.",
    type: "website",
  },
};

export default function HowWeWorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="page-title page-title-md">How We Work</h1>
      <p className="mt-4 text-lg text-[var(--ink-muted)]">
        An open AI experiment. Here&apos;s the machine.
      </p>

      <div className="mt-12 space-y-12 text-[15px] leading-relaxed text-[var(--ink)]/90">
        {/* Intro */}
        <section>
          <p>
            Fader & Knob is an experiment in what happens when one person
            directs AI to build an entire guitar resource. AI does the
            research, the writing, the preset generation, and the code, and
            this page explains how. The running log, with
            every number generated from the repository, lives at{" "}
            <Link
              href="/experiment"
              className="text-[var(--amber-2)] hover:underline"
            >
              The Experiment
            </Link>
            .
          </p>
        </section>

        {/* What AI Does */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--ink)]">What AI Does</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[var(--amber-2)]">1.</span>
              <div>
                <strong className="text-[var(--ink)]">Researches tone settings.</strong>{" "}
                AI analyzes interviews, gear demos, studio session notes, and
                equipment lists to determine what amp, pedals, and settings an
                artist used on a specific recording.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[var(--amber-2)]">2.</span>
              <div>
                <strong className="text-[var(--ink)]">Generates preset files.</strong>{" "}
                Our Helix .hlx presets are generated programmatically using a
                model map verified against 300+ real presets. Every model ID,
                parameter name, and value range has been cross-referenced with
                actual hardware output.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[var(--amber-2)]">3.</span>
              <div>
                <strong className="text-[var(--ink)]">Writes blog content.</strong>{" "}
                Our blog posts are written by AI editorial voices, each tuned
                to a topic and a style. They are not real people.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-[var(--amber-2)]">4.</span>
              <div>
                <strong className="text-[var(--ink)]">Translates across platforms.</strong>{" "}
                When we create a recipe for one modeler, AI maps the signal chain
                to the closest blocks on other platforms: amp models, effect
                types, and parameter ranges.
              </div>
            </li>
          </ul>
        </section>

        {/* What Humans Do */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--ink)]">What Humans Do</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">1.</span>
              <div>
                <strong className="text-[var(--ink)]">Run the correction loop.</strong>{" "}
                When a preset fails to load, a setting reads wrong, or a reader
                flags an error, it gets fixed and the fix ships as a public
                commit. The correction count sits on{" "}
                <Link
                  href="/experiment"
                  className="text-[var(--amber-2)] hover:underline"
                >
                  the experiment page
                </Link>
                , next to the wins.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">2.</span>
              <div>
                <strong className="text-[var(--ink)]">Curate and direct.</strong>{" "}
                A human decides which songs to cover, which tones matter, and
                what quality bar to hit.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">3.</span>
              <div>
                <strong className="text-[var(--ink)]">Own the mistakes.</strong>{" "}
                Research is cross-checked against gear lists, live footage, and
                studio documentation. When it&apos;s still wrong, the error is
                acknowledged and corrected in the open.
              </div>
            </li>
          </ul>
        </section>

        {/* Why This Approach */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--ink)]">Why This Approach</h2>
          <p>
            Researching a song&apos;s gear, mapping the chain, and translating
            it for six platforms would take a traditional team weeks per
            recipe. AI lets one person cover far more songs and keep prices
            low. The public correction record is the check on that speed:
            every fix is a visible commit.
          </p>
          <p className="mt-4">
            We&apos;d rather show how the sausage gets made than hide it behind
            a polished marketing page. How a recipe got made is part of
            judging whether to trust it.
          </p>
        </section>

        {/* About the Blog Writers */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--ink)]">About Our Writers</h2>
          <p>
            Our blog posts are written by AI editorial voices, not real people.
            Each voice sticks to one area (gear reviews, tone science, playing
            technique) and one style. We split them up because one generic
            byline wrote blander posts.
          </p>
          <p className="mt-4">
            Posts are generated from cited research and corrected in public
            when an audit or a reader catches an error. If you spot something
            wrong, email{" "}
            <ContactEmailLink className="text-[var(--amber-2)] hover:underline" />{" "}
            and we&apos;ll fix it.
          </p>
        </section>

        {/* The Bottom Line */}
        <section className="rounded-2xl border border-[var(--ink)]/15 bg-[var(--paper-2)] p-8">
          <h2 className="mb-3 text-xl font-bold text-[var(--ink)]">Judge the output</h2>
          <p>
            AI researches. AI writes. AI generates presets. A human sets the
            direction, and the record of what worked and what got fixed is
            public. Load a preset, dial in a tone, and see if it gets you
            closer to the sound you hear in your head.
          </p>
        </section>
      </div>
    </div>
  );
}
