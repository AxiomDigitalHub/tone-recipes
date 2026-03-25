import Link from "next/link";
import Image from "next/image";
import { Guitar, Zap, Orbit, Volume2, Clock, Speaker, Mic } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";
import { toneRecipes, songs, artists, getSongBySlug, getArtistBySlug } from "@/lib/data";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";

export default function Home() {
  const featuredRecipes = toneRecipes.slice(0, 6);

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
          <div className="scrollbar-hide mx-auto mt-16 flex max-w-2xl items-center justify-center gap-2 overflow-x-auto px-4 pb-2">
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

      {/* Featured Recipes */}
      <section className="py-20">
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
      <section className="border-y border-border bg-surface/50 py-20">
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

      {/* How it works */}
      <section className="py-20">
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
      <section className="border-t border-border bg-surface/50 py-20">
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to find your tone?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Explore hundreds of song-specific tone recipes, broken down for your
            platform.
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
