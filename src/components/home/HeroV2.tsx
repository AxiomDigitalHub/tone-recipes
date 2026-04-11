"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * HeroV2 — clean version of the landing hero.
 *
 * What changed vs the v1 hero:
 * - No cable routing. The clever-but-confusing SVG that measured from
 *   "you love." down to the guitar node is gone.
 * - No gradient underline. "you love." used to have a rainbow bg-clip
 *   that read as visual noise, not emphasis. Replaced with a simple
 *   amber serif accent that reads as intentional.
 * - The signal chain is no longer jammed into the hero. It lives as its
 *   own full-width block below the fold so each element gets room to
 *   breathe.
 * - Ambient background: a very faint grid of dots + dashes evoking a
 *   signal flow at ~6% opacity behind the headline. Decorative,
 *   non-interactive, prefers-reduced-motion compliant.
 */
export default function HeroV2() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background — faint signal flow, decorative only */}
      <AmbientBackdrop reduceMotion={reduceMotion} />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center md:pt-36">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
          Fader &amp; Knob
        </p>

        <h1
          className="font-[family-name:var(--font-display)] mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-[88px]"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.03 }}
        >
          Tone recipes from the songs{" "}
          <span className="text-accent italic">you love.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-lg text-muted md:text-xl">
          Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX,
          or physical rig. Stop tweaking. Start playing.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/browse"
            className="w-full rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background shadow-lg shadow-amber-900/20 transition-all hover:bg-accent-hover hover:shadow-amber-900/40 sm:w-auto"
          >
            Browse Recipes
          </Link>
          <Link
            href="#how-it-works"
            className="w-full rounded-xl border border-border bg-surface/40 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-surface sm:w-auto"
          >
            See how it works
          </Link>
        </div>

        <p className="mt-5 text-sm text-muted">
          New here?{" "}
          <Link
            href="/blog/what-is-a-tone-recipe"
            className="text-accent underline-offset-4 hover:underline"
          >
            Learn what a tone recipe is
          </Link>
        </p>
      </div>
    </section>
  );
}

/**
 * AmbientBackdrop — decorative background layer.
 *
 * Tiled SVG pattern of small dots, short dashes, and faint rings evoking
 * a signal flow diagram, rendered at 6% opacity behind the headline.
 * No animation unless prefers-reduced-motion is false, and even then it's
 * a 20-second slow drift.
 */
function AmbientBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      {/* Radial vignette anchoring attention to the center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(245,158,11,0.07),_transparent_55%)]" />

      {/* Tiled signal-flow pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 40%, rgba(245,158,11,0.9) 1.2px, transparent 1.3px)," +
            "radial-gradient(circle at 80% 60%, rgba(34,211,238,0.85) 1.2px, transparent 1.3px)," +
            "linear-gradient(90deg, rgba(250,250,250,0.35) 0, rgba(250,250,250,0.35) 14px, transparent 14px, transparent 28px)",
          backgroundSize: "120px 120px, 120px 120px, 28px 2px",
          backgroundPosition: "0 0, 60px 60px, 0 62px",
          backgroundRepeat: "repeat",
          animation: reduceMotion ? "none" : "heroV2Drift 20s linear infinite",
        }}
      />

      {/* Large floating node markers — 5 glowing circles, absolutely positioned */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0">
          <FloatingNode top="18%" left="12%" color="#f59e0b" delay={0} />
          <FloatingNode top="72%" left="22%" color="#4ade80" delay={2.4} />
          <FloatingNode top="28%" left="82%" color="#60a5fa" delay={4.8} />
          <FloatingNode top="68%" left="78%" color="#a78bfa" delay={1.2} />
          <FloatingNode top="48%" left="50%" color="#22d3ee" delay={3.6} />
        </div>
      )}

      <style jsx>{`
        @keyframes heroV2Drift {
          from {
            background-position: 0 0, 60px 60px, 0 62px;
          }
          to {
            background-position: 120px 0, 180px 60px, 28px 62px;
          }
        }
      `}</style>
    </>
  );
}

function FloatingNode({
  top,
  left,
  color,
  delay,
}: {
  top: string;
  left: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 24px ${color}, 0 0 8px ${color}`,
        opacity: 0.35,
        animation: `heroV2Pulse 6s ease-in-out ${delay}s infinite`,
      }}
    >
      <style jsx>{`
        @keyframes heroV2Pulse {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
