"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NodeIcon, { type NodeLabel, NODE_COLORS } from "./NodeIcon";

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

      {/* Floating node tiles — actual gear block glyphs, not generic dots.
          Each represents a category the recipe system covers: compression,
          guitar, drive, amp, mic. Muted enough to be background texture. */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingNodeTile label="GUITAR"      top="22%"  left="9%"  size={46} delay={0.0}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="COMPRESSION" top="72%"  left="15%" size={42} delay={1.6}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="OVERDRIVE"   top="16%"  left="84%" size={44} delay={3.2}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="PREAMP"      top="68%"  left="88%" size={48} delay={0.8}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="MIC"         top="82%"  left="48%" size={40} delay={2.4}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="GUITAR"      top="85%"  left="74%" size={34} delay={4.0}  reduceMotion={reduceMotion} />
        <FloatingNodeTile label="COMPRESSION" top="12%"  left="52%" size={32} delay={4.8}  reduceMotion={reduceMotion} />
      </div>

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

/**
 * FloatingNodeTile — a small rounded-square tile containing a node glyph.
 * Used as ambient texture in the v2 hero background. Tiles pulse gently
 * and drift a few pixels on a long cycle so the hero feels alive without
 * being busy.
 */
function FloatingNodeTile({
  label,
  top,
  left,
  size,
  delay,
  reduceMotion,
}: {
  label: NodeLabel;
  top: string;
  left: string;
  size: number;
  delay: number;
  reduceMotion: boolean;
}) {
  const color = NODE_COLORS[label].border;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: `1px solid ${color}33`,
        background: "rgba(11, 15, 26, 0.72)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${size * 0.6}px ${color}18, inset 0 0 ${size * 0.3}px ${color}08`,
        opacity: 0.55,
        transform: "translate(-50%, -50%)",
        animation: reduceMotion
          ? "none"
          : `heroV2NodePulse 9s ease-in-out ${delay}s infinite`,
      }}
    >
      <NodeIcon label={label} color={color} size={Math.round(size * 0.62)} />
      <style jsx>{`
        @keyframes heroV2NodePulse {
          0%,
          100% {
            opacity: 0.38;
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: 0.72;
            transform: translate(-50%, calc(-50% - 6px)) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
