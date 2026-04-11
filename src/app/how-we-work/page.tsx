import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "How Fader & Knob uses AI to research tones, generate presets, and write content — and how humans verify work on real hardware.",
  openGraph: {
    title: "How We Work | Fader & Knob",
    description: "AI-powered tone research, human-verified on real hardware.",
    type: "website",
  },
};

export default function HowWeWorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold md:text-5xl">How We Work</h1>
      <p className="mt-4 text-lg text-muted">
        Human-verified, AI-powered.
      </p>

      <div className="mt-12 space-y-12 text-[15px] leading-relaxed text-foreground/90">
        {/* Intro */}
        <section>
          <p>
            Fader & Knob is an experiment in what happens when you combine AI
            with real guitar expertise. We use AI tools extensively — for
            research, writing, preset generation, and code — and we think you
            should know exactly how.
          </p>
        </section>

        {/* What AI Does */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">What AI Does</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-accent">1.</span>
              <div>
                <strong className="text-foreground">Researches tone settings.</strong>{" "}
                AI analyzes interviews, gear demos, studio session notes, and
                equipment lists to determine what amp, pedals, and settings an
                artist used on a specific recording.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-accent">2.</span>
              <div>
                <strong className="text-foreground">Generates preset files.</strong>{" "}
                Our Helix .hlx presets are generated programmatically using a
                model map verified against 300+ real presets. Every model ID,
                parameter name, and value range has been cross-referenced with
                actual hardware output.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-accent">3.</span>
              <div>
                <strong className="text-foreground">Writes blog content.</strong>{" "}
                Our blog posts are written by AI editorial voices — each with a
                distinct perspective and area of expertise. They are not real
                people. They are AI writers with consistent styles tuned to
                specific topics.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-accent">4.</span>
              <div>
                <strong className="text-foreground">Translates across platforms.</strong>{" "}
                When we create a recipe for one modeler, AI maps the signal chain
                to equivalent blocks on other platforms — matching amp models,
                effect types, and parameter ranges.
              </div>
            </li>
          </ul>
        </section>

        {/* What Humans Do */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">What Humans Do</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">1.</span>
              <div>
                <strong className="text-foreground">Test on real hardware.</strong>{" "}
                Presets are loaded into HX Edit and tested on real hardware as
                part of our review process. When a preset doesn&apos;t sound
                right or fails to load correctly, it gets flagged and fixed
                before it ships.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">2.</span>
              <div>
                <strong className="text-foreground">Curate and direct.</strong>{" "}
                A human decides which songs to cover, which tones matter, and
                what quality bar to hit. AI executes; humans set the standard.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 shrink-0 text-emerald-400">3.</span>
              <div>
                <strong className="text-foreground">Verify accuracy.</strong>{" "}
                Tone research is checked against known gear lists, live footage,
                and studio documentation. If the AI gets it wrong, we fix it.
              </div>
            </li>
          </ul>
        </section>

        {/* Why This Approach */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Why This Approach</h2>
          <p>
            Building 50 tone recipes across multiple platforms with detailed
            signal chains, settings, and downloadable presets would take a
            traditional team months. AI lets us move faster, cover more ground,
            and keep prices low — while human verification ensures the output
            is actually useful when you plug in your guitar.
          </p>
          <p className="mt-4">
            We think this is more honest than a polished marketing page that
            hides how the sausage gets made. The tones work. The presets load.
            The settings are accurate. How they got there is part of the story.
          </p>
        </section>

        {/* About the Blog Writers */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">About Our Writers</h2>
          <p>
            Our blog posts are written by AI editorial voices — not real people.
            Each voice has a consistent style and area of focus (gear reviews,
            tone science, playing technique, etc.), which makes the content more
            readable than a single generic AI output. We chose distinct voices
            over a single byline because it produces better, more focused writing.
          </p>
          <p className="mt-4">
            Every post is reviewed for accuracy before publication. If you spot
            something wrong,{" "}
            <Link href="/community/forum" className="text-accent hover:underline">
              let us know in the forum
            </Link>.
          </p>
        </section>

        {/* The Bottom Line */}
        <section className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="mb-3 text-xl font-bold text-foreground">The Bottom Line</h2>
          <p>
            AI researches. AI writes. AI generates presets. Humans test on real
            gear, set the direction, and make sure everything actually sounds
            good. Judge us by the output — load a preset, dial in a tone, and
            see if it gets you closer to the sound you hear in your head.
          </p>
        </section>
      </div>
    </div>
  );
}
