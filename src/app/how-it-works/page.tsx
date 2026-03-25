import Link from "next/link";
import { Guitar, Zap, Orbit, Volume2, Clock, Speaker, Mic, Search, ArrowRightLeft, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Stop guessing at settings. ToneRecipes shows you exactly how to recreate iconic guitar tones on your gear.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      {/* Hero */}
      <div className="mb-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          How It Works
        </p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">
          Stop guessing. Start <span className="text-accent">playing</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          You know the tone you want. We show you exactly how to get it
          on your gear — whether that&apos;s a Helix, Quad Cortex, Boss Katana,
          or a pedalboard.
        </p>
      </div>

      {/* The Problem */}
      <section className="mb-20">
        <h2 className="mb-6 text-center text-2xl font-bold">Sound familiar?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "You watched 5 YouTube videos and got 5 different answers",
            "Forum posts from 2014 that don't match your modeler",
            "You got close but something's still off and you don't know why",
            "Hours tweaking knobs when you'd rather be playing",
          ].map((pain) => (
            <div
              key={pain}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="text-sm text-muted">{pain}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Steps */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-2xl font-bold">
          Three steps to any tone
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <Step
            number="1"
            icon={Search}
            title="Find the song"
            description="Search by artist, song, or genre. Every recipe is tied to a specific recording so you know exactly what you're aiming for."
          />
          <Step
            number="2"
            icon={Guitar}
            title="See the full picture"
            description="Visual signal chain with every pedal, amp, and setting laid out. Click any node to see exactly what to dial in — and why it matters."
          />
          <Step
            number="3"
            icon={ArrowRightLeft}
            title="Switch to your gear"
            description="One tap to see the same chain translated for your platform. Helix, Quad Cortex, Katana, TONEX — same tone, your gear."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-20 rounded-2xl border border-border bg-surface p-8 md:p-12">
        <h2 className="mb-10 text-center text-2xl font-bold">
          Why guitarists love this
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <Benefit
            title="Spend time playing, not tweaking"
            description="Every recipe gives you exact settings. No more guessing what 'medium gain' means on your specific amp model."
          />
          <Benefit
            title="Actually understand your signal chain"
            description="We don't just tell you what to set — we explain why each piece matters. You'll build better tones on your own over time."
          />
          <Benefit
            title="Works on whatever you own"
            description="Physical pedalboard? Line 6 Helix? Boss Katana? Neural Quad Cortex? Every recipe translates across all major platforms."
          />
          <Benefit
            title="Real tones from real recordings"
            description="Every recipe is researched from the actual gear and settings used on specific songs. Not generic 'blues tone' guesses."
          />
        </div>
      </section>

      {/* Signal Chain Visual */}
      <section className="mb-20">
        <h2 className="mb-4 text-center text-2xl font-bold">
          See the whole chain at a glance
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-muted">
          Every recipe shows you the complete signal path — from guitar to mic.
          Click any node to see its settings.
        </p>
        <div className="flex items-center justify-center gap-3 overflow-x-auto px-4 pb-2">
          {[
            { icon: Guitar, label: "Guitar", color: "#f59e0b" },
            { icon: Zap, label: "Drive", color: "#22c55e" },
            { icon: Orbit, label: "Mod", color: "#8b5cf6" },
            { icon: Volume2, label: "Amp", color: "#ef4444" },
            { icon: Clock, label: "Delay", color: "#3b82f6" },
            { icon: Speaker, label: "Cab", color: "#a855f7" },
            { icon: Mic, label: "Mic", color: "#6b7280" },
          ].map((node, i) => (
            <div key={node.label} className="flex shrink-0 items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl border-2 bg-surface"
                  style={{ borderColor: node.color + "70" }}
                >
                  <node.icon
                    className="h-6 w-6"
                    style={{ color: node.color }}
                    strokeWidth={1.5}
                  />
                </div>
                <span className="mt-1.5 text-[10px] font-medium uppercase text-muted">
                  {node.label}
                </span>
              </div>
              {i < 6 && <div className="signal-line h-0.5 w-4 rounded-full" />}
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="mb-20 text-center">
        <h2 className="mb-4 text-2xl font-bold">
          One tone. Every platform.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-muted">
          Switch between platforms with a single tap. Same tone, translated
          for your specific gear.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Line 6 Helix", "Neural QC", "IK TONEX", "Fractal", "Kemper", "Boss Katana", "Physical Rig"].map(
            (name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
              >
                {name}
              </span>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">
          Ready to nail that tone?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Browse our library of song-specific tone recipes.
          Pick a song, switch to your platform, and start playing.
        </p>
        <div className="mt-8">
          <Link
            href="/browse"
            className="inline-block rounded-xl bg-accent px-10 py-4 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Browse Tone Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Step({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
        <Icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
      </div>
      <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
