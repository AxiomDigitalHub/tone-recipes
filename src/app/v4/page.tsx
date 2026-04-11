import Link from "next/link";
import Image from "next/image";
import { toneRecipes, artists, getSongBySlug, getArtistBySlug } from "@/lib/data";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";
import PlatformOnboarding from "@/components/home/PlatformOnboarding";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import ScrollReveal from "@/components/ui/ScrollReveal";
import HeroV4 from "@/components/home/HeroV4";
import SignalChainShowcase from "@/components/home/SignalChainShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Fader & Knob v4 — Guitar Tone Recipes for Every Platform",
  },
  description:
    "Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
  robots: { index: false, follow: false },
};

export default function HomeV4() {
  const featuredRecipes = toneRecipes.slice(0, 6);

  return (
    <>
      <HeroV4 />
      <SignalChainShowcase />

      <ScrollReveal>
        <section id="featured" className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                  Start here
                </p>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Featured recipes
                </h2>
                <p className="mt-2 text-muted">
                  Iconic tones, broken down step by step.
                </p>
              </div>
              <Link
                href="/browse"
                className="hidden text-sm font-medium text-accent transition-colors hover:underline sm:block"
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
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="border-y border-border bg-surface/30 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                How it works
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">
                Three steps to any tone.
              </h2>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Find the song",
                  desc: "Search by artist, song, or genre. Every recipe is tied to a specific recording so you know exactly what you're aiming for.",
                },
                {
                  step: "02",
                  title: "See the full signal chain",
                  desc: "Visual breakdown of every pedal, amp block, and routing decision. Not just what to set — why it works.",
                },
                {
                  step: "03",
                  title: "Switch to your gear",
                  desc: "One tap to see exact settings for your platform. Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana, or physical rig.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i}>
                  <div className="relative pl-16">
                    <div
                      className="absolute left-0 top-0 font-[family-name:var(--font-display)] text-5xl font-bold text-accent/20"
                      style={{ letterSpacing: "-0.04em", lineHeight: 1 }}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                The guitarists
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">Popular artists</h2>
              <p className="mx-auto mt-2 max-w-xl text-muted">
                Explore tone recipes from the guitarists who shaped the sound of
                modern music.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {artists.slice(0, 10).map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/artist/${artist.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-surface/60 p-5 text-center transition-all hover:border-accent/40 hover:bg-surface-hover"
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
                  <h3 className="mt-3 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
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
      </ScrollReveal>

      <section className="border-y border-border bg-surface/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <PlatformOnboarding />
        </div>
      </section>

      <ScrollReveal>
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-4">
            <NewsletterSignup
              headline="Tone of the Week — free in your inbox"
              subtext="Every Friday: one killer tone recipe, one blog deep dive, one quick tip you can use tonight. Join free."
              buttonText="Send it to me"
              source="homepage-v4"
            />
          </div>
        </section>
      </ScrollReveal>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Your gear can do this.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
            Browse tone recipes and dial in the sounds you actually want — in
            minutes, not hours.
          </p>
          <div className="mt-8">
            <Link
              href="/browse"
              className="inline-block rounded-xl bg-accent px-10 py-4 text-base font-semibold text-background shadow-lg shadow-amber-900/20 transition-all hover:bg-accent-hover hover:shadow-amber-900/40"
            >
              Browse all recipes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
