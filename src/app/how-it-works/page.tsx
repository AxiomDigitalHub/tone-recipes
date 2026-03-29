import Link from "next/link";
import { Guitar, Zap, Orbit, Volume2, Clock, Speaker, Mic, Search, ArrowRightLeft, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Stop guessing at settings. Fader & Knob shows you exactly how to recreate iconic guitar tones on your gear.",
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
          From the song to your rig.{" "}
          <span className="text-accent">In three steps.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          You know the sound you want. Fader &amp; Knob shows you exactly how to get there &mdash; on your gear, with your platform, from the recording you love.
        </p>
      </div>

      {/* The Problem */}
      <section className="mb-20">
        <h2 className="mb-6 text-center text-2xl font-bold">Sound familiar?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "You watched five YouTube videos and got five different signal chains",
            "The Reddit post that got you close was written for a modeler you don\u2019t own",
            "You got close, but you can\u2019t figure out what\u2019s still off",
            "You spent 45 minutes tweaking when you just wanted to play the song",
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
          Here&apos;s how it works.
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <Step
            number="1"
            icon={Search}
            title="Find the song"
            description="Search by artist, song title, or genre. Every recipe is tied to a specific recording so you know exactly what tone you're building toward."
          />
          <Step
            number="2"
            icon={Guitar}
            title="Read the signal chain"
            description="A visual breakdown of every pedal, amp block, cab, and mic in the chain. Click any node to see exact settings and a plain-English explanation of what it's doing and why."
          />
          <Step
            number="3"
            icon={ArrowRightLeft}
            title="Switch to your platform and play"
            description="Select your gear. Get a version of the chain built specifically for your modeler or physical rig. Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana — same tone, different platform."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-20 rounded-2xl border border-border bg-surface p-8 md:p-12">
        <h2 className="mb-10 text-center text-2xl font-bold">
          Built for players who want to understand, not just copy.
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <Benefit
            title="Exact settings, not guesswork"
            description='Every recipe gives you specific knob positions and parameters. No more interpreting "moderate gain" for your particular amp block.'
          />
          <Benefit
            title="Learn why it works, not just what to set"
            description="We explain the reasoning behind every decision in the chain. You'll start hearing tones differently and building your own from scratch."
          />
          <Benefit
            title="Your rig, not someone else's"
            description="A recipe for a physical rig doesn't help you if you're on a Helix. Every recipe is translated for all major platforms so the settings actually apply to what you own."
          />
          <Benefit
            title="Sourced from the real recordings"
            description='Every recipe traces back to the actual gear used on that song. Not a generic "blues tone." Not a best guess. The specific recording, the specific rig.'
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
          Stop guessing. Start playing.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Pick a song from our library and dial it in on your gear today.
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
