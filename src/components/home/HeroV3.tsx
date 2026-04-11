"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NodeIcon, { type NodeLabel, NODE_COLORS } from "./NodeIcon";

/**
 * HeroV3 — orbital signal composition.
 *
 * The third landing iteration. Where v2 used a quiet ambient backdrop and
 * lifted the signal chain into its own scroll block below the hero, v3
 * does the opposite: the signal IS the hero background. Curved light
 * trails (cyan, violet, magenta) arc through space, with node tiles
 * scattered at different depths evoking a 3D signal-flow diagram.
 *
 * Inspiration: https://reactbits.dev/ (hero ambient style) + the user's
 * Nano-Banana mockup that arranged the 7 chain nodes orbitally around
 * the headline.
 *
 * Everything decorative is pointer-events: none and sits below the
 * headline content. prefers-reduced-motion disables the animation
 * entirely and renders a static snapshot.
 */
export default function HeroV3() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#05070e]">
      {/* Orbital backdrop — tiles + arcs */}
      <OrbitalBackdrop reduceMotion={reduceMotion} />

      {/* Top vignette (so the sticky header reads cleanly) and bottom
          fade (so the wordmark at the bottom of the hero anchors cleanly) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05070e] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05070e] to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-4 py-28 text-center md:py-36">
        <p className="mb-7 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
          Fader &amp; Knob
        </p>

        <h1
          className="font-[family-name:var(--font-display)] max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-[96px]"
          style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
        >
          Tone recipes from the songs{" "}
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text italic text-transparent">
            you love.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-lg text-[#c8d2e2] md:text-xl">
          Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX,
          or physical rig. Stop tweaking. Start playing.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/browse"
            className="w-full rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background shadow-[0_12px_40px_-8px_rgba(245,158,11,0.45)] transition-all hover:bg-accent-hover hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.6)] sm:w-auto"
          >
            Browse Recipes
          </Link>
          <Link
            href="#how-it-works"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-white/10 sm:w-auto"
          >
            See how it works
          </Link>
        </div>

        {/* "Now playing" — plays on music terminology, replaces "New here?" */}
        <p className="mt-7 flex items-center gap-2 text-sm text-[#8ea2bc]">
          <span
            className="inline-block h-2 w-2 rounded-full bg-emerald-400"
            style={{
              boxShadow: "0 0 10px rgba(52, 211, 153, 0.8)",
              animation: reduceMotion ? "none" : "heroV3Pulse 2s ease-in-out infinite",
            }}
          />
          <span>
            Now playing:{" "}
            <Link
              href="/blog/what-is-a-tone-recipe"
              className="text-accent underline-offset-4 hover:underline"
            >
              Learn what a tone recipe is
            </Link>
          </span>
        </p>

        {/* Large wordmark anchor at the bottom of the hero */}
        <div className="mt-24 w-full md:mt-32">
          <div
            className="font-[family-name:var(--font-display)] select-none bg-gradient-to-b from-white/90 via-white/40 to-transparent bg-clip-text text-center text-[18vw] font-bold leading-none tracking-tight text-transparent md:text-[14vw] lg:text-[180px]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Fader &amp; <span className="text-accent/70">Knob</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroV3Pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

/**
 * OrbitalBackdrop — the decorative layer.
 *
 * Renders:
 * 1. Three curved SVG arcs in cyan/violet/magenta with animated
 *    stroke-dashoffset producing the illusion of light flowing along
 *    the path.
 * 2. A scatter of ~20 node tiles at percentage positions, each using a
 *    real signal-chain glyph (GUITAR, COMPRESSION, OVERDRIVE, PREAMP,
 *    DELAY, CABINET, MIC). Sizes and opacities vary to suggest depth.
 * 3. A radial vignette to focus the center for the headline.
 */
function OrbitalBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      {/* Radial vignette anchoring attention on the headline */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,_rgba(245,158,11,0.10),_transparent_55%)]" />

      {/* Scattered node tiles */}
      <div className="pointer-events-none absolute inset-0">
        {TILES.map((tile, i) => (
          <FloatingTile
            key={i}
            {...tile}
            reduceMotion={reduceMotion}
            delay={(i * 0.4) % 6}
          />
        ))}
      </div>

      {/* Arc trails — the signal flow */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1100"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Glow filter */}
          <filter id="heroV3Glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Each arc gets a linear gradient stroke that fades from clear
              to color to clear, so it reads as a "trail" with a bright
              middle instead of a solid line. */}
          <linearGradient id="heroV3ArcCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroV3ArcViolet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroV3ArcMagenta" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cyan arc — sweeps across the top half */}
        <path
          d="M -100 700 Q 400 100 900 380 T 1800 280"
          stroke="url(#heroV3ArcCyan)"
          strokeWidth="3"
          fill="none"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray="180 1400"
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-1580"
              dur="6s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Violet arc — broad arc across the middle */}
        <path
          d="M 1700 300 Q 1100 950 500 700 T -100 520"
          stroke="url(#heroV3ArcViolet)"
          strokeWidth="3"
          fill="none"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray="220 1600"
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-1820"
              dur="7.5s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Magenta arc — sweeps across the bottom half */}
        <path
          d="M -100 420 Q 500 1100 1000 780 T 1800 900"
          stroke="url(#heroV3ArcMagenta)"
          strokeWidth="3"
          fill="none"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray="200 1500"
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-1700"
              dur="5.5s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Static low-opacity full-length strokes so the arcs have
            presence even between the traveling light pulses */}
        <path
          d="M -100 700 Q 400 100 900 380 T 1800 280"
          stroke="#22d3ee"
          strokeOpacity="0.08"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 1700 300 Q 1100 950 500 700 T -100 520"
          stroke="#a78bfa"
          strokeOpacity="0.08"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M -100 420 Q 500 1100 1000 780 T 1800 900"
          stroke="#f472b6"
          strokeOpacity="0.08"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

/**
 * FloatingTile — a small rounded-square node tile at an absolute
 * position in the orbital backdrop. Size and opacity encode depth:
 * larger + more opaque tiles are "closer", smaller + dimmer are
 * "further." A slow pulse keeps them alive without being busy.
 */
function FloatingTile({
  label,
  x,
  y,
  size,
  opacity,
  reduceMotion,
  delay,
}: {
  label: NodeLabel;
  x: string;
  y: string;
  size: number;
  opacity: number;
  reduceMotion: boolean;
  delay: number;
}) {
  const color = NODE_COLORS[label].border;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: `1px solid ${color}40`,
        background: "rgba(8, 11, 22, 0.82)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${size * 0.8}px ${color}20, inset 0 0 ${size * 0.3}px ${color}10`,
        opacity,
        transform: "translate(-50%, -50%)",
        animation: reduceMotion
          ? "none"
          : `heroV3TilePulse 8s ease-in-out ${delay}s infinite`,
      }}
    >
      <NodeIcon label={label} color={color} size={Math.round(size * 0.6)} />
      <style jsx>{`
        @keyframes heroV3TilePulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.96);
            filter: brightness(0.85);
          }
          50% {
            transform: translate(-50%, calc(-50% - 4px)) scale(1.02);
            filter: brightness(1.15);
          }
        }
      `}</style>
    </div>
  );
}

// Tile positions carefully placed to imply orbital depth. Larger sizes
// and higher opacity = closer to the camera. Smaller + dimmer = further.
// Nothing in the central ~40% horizontal band (around the headline).
const TILES: Array<{
  label: NodeLabel;
  x: string;
  y: string;
  size: number;
  opacity: number;
}> = [
  // Left side — close tiles
  { label: "GUITAR",      x: "7%",  y: "34%", size: 56, opacity: 0.78 },
  { label: "COMPRESSION", x: "12%", y: "66%", size: 50, opacity: 0.72 },
  { label: "PREAMP",      x: "17%", y: "22%", size: 42, opacity: 0.62 },
  { label: "OVERDRIVE",   x: "4%",  y: "78%", size: 38, opacity: 0.55 },
  { label: "DELAY",       x: "22%", y: "84%", size: 34, opacity: 0.5 },
  { label: "MIC",         x: "24%", y: "50%", size: 36, opacity: 0.5 },

  // Right side — close tiles
  { label: "MIC",         x: "93%", y: "30%", size: 54, opacity: 0.76 },
  { label: "CABINET",     x: "88%", y: "68%", size: 50, opacity: 0.7 },
  { label: "CHORUS",      x: "82%", y: "20%", size: 40, opacity: 0.6 },
  { label: "PREAMP",      x: "96%", y: "80%", size: 38, opacity: 0.55 },
  { label: "OVERDRIVE",   x: "78%", y: "52%", size: 36, opacity: 0.5 },
  { label: "GUITAR",      x: "76%", y: "86%", size: 34, opacity: 0.5 },

  // Top edge — far tiles
  { label: "COMPRESSION", x: "36%", y: "10%", size: 30, opacity: 0.4 },
  { label: "DELAY",       x: "64%", y: "12%", size: 30, opacity: 0.4 },
  { label: "CABINET",     x: "48%", y: "6%",  size: 26, opacity: 0.35 },

  // Bottom edge — far tiles, framing the wordmark
  { label: "CHORUS",      x: "38%", y: "88%", size: 30, opacity: 0.4 },
  { label: "GUITAR",      x: "58%", y: "90%", size: 28, opacity: 0.38 },
  { label: "COMPRESSION", x: "48%", y: "94%", size: 26, opacity: 0.32 },
];
