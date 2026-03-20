import Link from "next/link";
import { PLATFORMS } from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(245,158,11,0.08),_transparent_60%)]" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 text-center md:pt-32">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Build the tones you{" "}
            <span className="text-accent">hear</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Song-specific tone recipes for Helix, Quad Cortex, TONEX, and your
            physical rig. See the signal chain, understand why it works, and dial
            it in on your gear.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/browse"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Browse Tone Recipes
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              Get Early Access
            </Link>
          </div>

          {/* Animated signal chain preview */}
          <div className="mx-auto mt-16 flex max-w-lg items-center justify-center gap-2">
            {["GTR", "OD", "AMP", "DLY", "CAB", "MIC"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-xs font-mono text-muted transition-all hover:border-accent hover:text-accent">
                  {label}
                </div>
                {i < 5 && <div className="signal-line h-0.5 w-6 rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Search for a song",
                desc: "Find the tone you want from our database of iconic guitar sounds, organized by artist, song, and genre.",
              },
              {
                step: "2",
                title: "See the signal chain",
                desc: "Visual signal chain diagram with every pedal, amp setting, and routing decision explained. Switch to your platform's view.",
              },
              {
                step: "3",
                title: "Dial it in and play",
                desc: "See exact settings for your Helix, Quad Cortex, TONEX, or physical rig. Understand why it works, not just what to set.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center rounded-xl border border-border bg-surface p-8 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-bold text-background">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported platforms */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Every tone. Every platform.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            One tone recipe, translated across every major modeler and physical
            gear. No more siloed communities.
          </p>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-4">
            {PLATFORMS.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 transition-colors hover:border-accent/40"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-sm font-medium">{p.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-muted" />
              <span className="text-sm font-medium">Physical Gear</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to find your tone?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Join the waitlist and be the first to access song-specific tone
            recipes for your platform.
          </p>
          <div className="mx-auto mt-8 flex max-w-sm gap-3">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent"
            />
            <button className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover">
              Join
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
