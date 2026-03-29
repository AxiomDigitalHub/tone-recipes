import Link from "next/link";
import Image from "next/image";
import { Guitar, Zap, Orbit, Volume2, Clock, Speaker, Mic } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";
import { toneRecipes, songs, artists, getSongBySlug, getArtistBySlug } from "@/lib/data";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Fader & Knob — Guitar Tone Recipes for Every Platform",
  },
  description:
    "Get exact guitar tone settings for any song. Signal chains for Helix, Quad Cortex, TONEX, and physical rigs — stop tweaking, start playing.",
  openGraph: {
    title: "Fader & Knob — Guitar Tone Recipes for Every Platform",
    description:
      "Get exact guitar tone settings for any song. Signal chains for Helix, Quad Cortex, TONEX, and physical rigs.",
    type: "website",
  },
};

export default function Home() {
  const featuredRecipes = toneRecipes.slice(0, 6);

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fader & Knob",
    "url": "https://faderandknob.com",
    "description": "Tone recipes from the songs you love. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://faderandknob.com/browse?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-visible">
        {/* Subtle background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(245,158,11,0.08),_transparent_60%)]" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 text-center md:pt-32">
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Tone recipes from the songs{" "}
            <span className="text-accent">you love</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig. Stop tweaking. Start playing.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/browse"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Browse Recipes
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
            >
              See how it works
            </Link>
          </div>

          {/* Animated signal chain preview */}
          <div className="mx-auto mt-16 flex max-w-3xl items-center justify-center gap-2 overflow-visible px-6 pb-8">
            {[
              { icon: Guitar, label: "Guitar", color: "#f59e0b" },
              { icon: Zap, label: "Overdrive", color: "#22c55e" },
              { icon: Orbit, label: "Chorus", color: "#8b5cf6" },
              { icon: Volume2, label: "Preamp", color: "#ef4444" },
              { icon: Clock, label: "Delay", color: "#3b82f6" },
              { icon: Speaker, label: "Cabinet", color: "#a855f7" },
              { icon: Mic, label: "Mic", color: "#6b7280" },
            ].map((node, i) => (
              <div key={node.label} className="flex shrink-0 items-center gap-2">
                <div className="group flex flex-col items-center">
                  <div
                    className="node-glow flex h-11 w-11 items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover sm:h-14 sm:w-14 md:h-16 md:w-16"
                    style={{ borderColor: node.color + "70" }}
                  >
                    <node.icon
                      className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                      style={{ color: node.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="mt-1.5 text-[10px] font-medium uppercase text-muted">
                    {node.label}
                  </span>
                </div>
                {i < 6 && <div className="signal-line h-0.5 w-2 rounded-full sm:w-4 md:w-6" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            You&apos;ve been chasing that sound for a while now.
          </h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-lg text-muted">
            <p>
              You&apos;ve watched the tutorials. You&apos;ve dug through the forums. You got close, but something&apos;s still off and you can&apos;t name exactly why.
            </p>
            <p>
              It&apos;s not your ears. It&apos;s probably not even your gear. Nobody&apos;s ever given you a clear map from that recording to your specific rig.
            </p>
            <p className="font-semibold text-foreground">
              That&apos;s what Fader &amp; Knob is for.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="border-y border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Featured Recipes
              </h2>
              <p className="mt-2 text-muted">
                Iconic tones, broken down step by step.
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:block"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => {
              const song = getSongBySlug(recipe.song_slug);
              const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
              return (
                <RecipeCard
                  key={recipe.slug}
                  recipe={recipe}
                  song={song}
                  artist={artist}
                />
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/browse"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              View all recipes &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Artists */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Popular Artists
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">
            Explore tone recipes from the guitarists who shaped the sound of modern music.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {artists.slice(0, 10).map((artist) => (
              <Link
                key={artist.slug}
                href={`/artist/${artist.slug}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-surface p-3 sm:p-5 text-center transition-all hover:border-accent/40 hover:bg-surface-hover"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border transition-colors group-hover:border-accent/50">
                  {artist.image_url ? (
                    <Image
                      src={artist.image_url}
                      alt={artist.name}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/10 text-xl font-bold text-accent">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {artist.name}
                </h3>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {artist.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-[10px]">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-y border-border bg-surface/50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Sound familiar?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "5 YouTube videos, 5 different answers",
              "Forum posts from 2012 that don\u2019t match your modeler",
              "Close, but you don\u2019t know why it\u2019s still off",
              "An hour of tweaking when you should be playing",
            ].map((pain) => (
              <div
                key={pain}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-sm text-muted">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Three steps to any tone.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Find the song",
                desc: "Search by artist, song, or genre. Every recipe is tied to a specific recording so you know exactly what you\u2019re aiming for.",
              },
              {
                step: "2",
                title: "See the full signal chain",
                desc: "Visual breakdown of every pedal, amp block, and routing decision. Not just what to set, but why it works.",
              },
              {
                step: "3",
                title: "Switch to your gear and dial it in",
                desc: "One tap to see exact settings for your platform. Helix, Quad Cortex, TONEX, Fractal, Kemper, or physical rig. Same tone, your gear.",
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

      {/* Benefit pillars */}
      <section className="border-y border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Less time tweaking",
                desc: 'Exact settings for your specific platform. No more guessing what "medium gain" means on your amp model.',
              },
              {
                title: "Understand why it works",
                desc: "We explain the reasoning behind every setting. You\u2019ll build better tones on your own over time.",
              },
              {
                title: "Works on your rig",
                desc: "Physical board, Line 6, Neural, Boss \u2014 every recipe translates across all major platforms.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="text-center">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported platforms */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            One recipe. Every platform.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Switch between platforms with a single tap. The same tone, translated for the gear you own.
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

      {/* Closing CTA */}
      <section className="border-t border-border bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Your gear can do this. Let&apos;s prove it.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Browse tone recipes and dial in the sounds you actually want &mdash; in minutes, not hours.
          </p>
          <div className="mt-8">
            <Link
              href="/browse"
              className="inline-block rounded-xl bg-accent px-10 py-4 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Browse All Recipes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
