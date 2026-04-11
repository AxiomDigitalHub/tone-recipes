import type { Metadata } from "next";
import Link from "next/link";
import { Guitar, Zap, Download, Users, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Fader & Knob",
  description:
    "Fader & Knob is a guitar tone recipe database for modeler users. Get exact settings for Helix, Boss Katana, and more — tested on real hardware, no tweaking required.",
  openGraph: {
    title: "About Fader & Knob",
    description:
      "Guitar tone recipes for the songs you love. Exact settings, real hardware verified, downloadable presets.",
    type: "website",
  },
};

const features = [
  {
    icon: Guitar,
    title: "Tone Recipes, Not Just Presets",
    description:
      "Every entry explains the why behind the tone — not just the knob settings. You learn how the signal chain works, not just what to load.",
  },
  {
    icon: Zap,
    title: "Exact Settings for Your Rig",
    description:
      "Each recipe includes platform-specific translations for Line 6 Helix, Boss Katana, and physical rigs, with every amp, pedal, and parameter documented.",
  },
  {
    icon: Download,
    title: "Downloadable Presets",
    description:
      "One-click downloads of .hlx (Helix) and .tsl (Boss Katana) preset files. Load them into HX Edit or Boss Tone Studio and play.",
  },
  {
    icon: Sparkles,
    title: "Set Packs for Gigging",
    description:
      "Single presets with 8 snapshots designed to cover an entire setlist. Each pack includes a Setlist Mapper showing which snapshot to use for each song.",
  },
  {
    icon: CheckCircle2,
    title: "Hardware-Tested",
    description:
      "Presets go through review on a real Helix LT before publication. If something doesn't load or sound right, it gets flagged and fixed.",
  },
  {
    icon: Users,
    title: "Built for the Volunteer Guitarist",
    description:
      "We built this for the guitarist who gets the setlist on Tuesday and has to play Sunday. Stop tweaking. Start playing.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      {/* Hero */}
      <h1 className="text-3xl font-bold md:text-5xl">About Fader &amp; Knob</h1>
      <p className="mt-4 text-lg text-muted md:text-xl">
        Tone recipes from the songs you love.
      </p>

      {/* The pitch */}
      <section className="mt-12 space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <p>
          Fader &amp; Knob is a guitar tone recipe database for guitarists who
          own modelers like the Line 6 Helix, Boss Katana, Quad Cortex, and
          TONEX. We document the exact signal chain — guitar, pedals, amp, cab,
          mic placement, and effects — behind specific guitar tones from
          specific songs, and we translate those recipes into downloadable
          preset files you can load into your rig tonight.
        </p>
        <p>
          The idea started because we were tired of watching five YouTube videos
          to get one guitar tone dialed in, and getting five different answers.
          The internet is full of people guessing at tones. Nobody had built a
          structured database of <strong className="text-foreground">recipes</strong> — with
          the why, the settings, and the preset file — all in one place. So we
          built it.
        </p>
      </section>

      {/* Features grid */}
      <h2 className="mt-16 text-2xl font-bold">What you get</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <feature.icon className="mb-3 h-5 w-5 text-accent" />
            <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How it's different */}
      <h2 className="mt-16 text-2xl font-bold">How we&apos;re different</h2>
      <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-foreground/90">
        <div>
          <h3 className="font-bold text-foreground">We teach the recipe, not just the file</h3>
          <p className="mt-1 text-muted">
            Every other preset shop sells you a finished file. We walk you
            through the signal chain block by block and explain why each
            setting works. You leave knowing more about tone, not just with a
            file on a USB stick.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">Cross-platform by design</h3>
          <p className="mt-1 text-muted">
            When you see a recipe, you can view it as a physical signal chain,
            a Helix patch, or a Boss Katana setup. The same recipe, translated
            for your specific gear.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">Hardware testing is part of the process</h3>
          <p className="mt-1 text-muted">
            Presets are reviewed in HX Edit on a real Helix LT before they go
            live. Blocks are confirmed to load, parameter ranges are checked,
            and if something is wrong we fix it before it ships.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">Human-verified, AI-powered</h3>
          <p className="mt-1 text-muted">
            We use AI to research tones, write content, and generate preset
            files faster than a traditional team could. Every output is
            verified by a human on real gear before it reaches you. We&apos;re
            transparent about how we work — read more on our{" "}
            <Link
              href="/how-we-work"
              className="text-accent hover:underline"
            >
              How We Work
            </Link>{" "}
            page.
          </p>
        </div>
      </div>

      {/* Who it's for */}
      <h2 className="mt-16 text-2xl font-bold">Who it&apos;s for</h2>
      <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-foreground/90">
        <div>
          <h3 className="font-bold text-foreground">The classic rock tone chaser</h3>
          <p className="mt-1 text-muted">
            You own a modeler, you know what SRV&apos;s Strat sounds like, and
            you want to know exactly how to get that tone on your rig. We
            document the signal chains behind the recordings you care about.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">The worship guitarist</h3>
          <p className="mt-1 text-muted">
            You play Sunday morning and need your tones dialed in by Saturday
            night. Our worship Set Packs give you one preset with 8 snapshots
            that covers 30+ songs — no per-song tweaking.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">The gigging cover band guitarist</h3>
          <p className="mt-1 text-muted">
            You need to sound like seven different artists across a three-hour
            set. Genre Set Packs (classic rock, 90s alternative, blues, more
            coming) give you one preset that handles the whole night.
          </p>
        </div>
      </div>

      {/* Product spec */}
      <h2 className="mt-16 text-2xl font-bold">The product</h2>
      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <dl className="space-y-4 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Tone recipes</dt>
            <dd className="text-muted">50+ and growing weekly</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Platforms</dt>
            <dd className="text-muted">Line 6 Helix, Boss Katana (more coming)</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Preset format</dt>
            <dd className="text-muted">.hlx and .tsl, load in HX Edit or Boss Tone Studio</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Free tier</dt>
            <dd className="text-muted">Browse all recipes, 10 free downloads</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Tone Pass</dt>
            <dd className="text-muted">$7/mo — unlimited downloads, unlimited saves</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Pro</dt>
            <dd className="text-muted">$12/mo — everything above plus Set Packs and priority access</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="font-semibold text-foreground">Built by</dt>
            <dd className="text-muted">Axiom Digital, LLC</dd>
          </div>
        </dl>
      </div>

      {/* CTAs */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/browse"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Browse Recipes
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
        >
          See Pricing
        </Link>
        <Link
          href="/how-we-work"
          className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
        >
          How We Work
        </Link>
      </div>

      {/* Contact / press */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-bold">Get in touch</h2>
        <p className="mt-2 text-sm text-muted">
          Partnership, press, support, feedback — we&apos;re a small team and we
          read every email.
        </p>
        <p className="mt-4">
          <a
            href="mailto:hello@faderandknob.com"
            className="text-accent hover:underline"
          >
            hello@faderandknob.com
          </a>
        </p>
      </section>
    </div>
  );
}
