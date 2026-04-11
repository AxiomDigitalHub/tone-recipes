"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NodeIcon, { type NodeLabel, NODE_COLORS } from "./NodeIcon";

/**
 * HeroV2 — clean version of the landing hero.
 *
 * Second iteration: the decorative layer is now a sparse dot grid
 * (Antigravity / Usenotra style) with large floating gear tiles and
 * animated dotted connector trails running between them. The old
 * vertical-stripe pattern was read as "odd" and is gone.
 *
 * What's here:
 * - Sparse random dot field covering the hero, ~3px dots on a 32px
 *   grid with ~18% density. Very subtle, reads as tech texture.
 * - 6 larger (80-110px) gear tiles floating at distinct positions
 *   around the hero: GUITAR, COMPRESSION, OVERDRIVE, PREAMP, MIC,
 *   CABINET. Each has a slow vertical drift + scale pulse so the
 *   hero feels alive but not busy.
 * - 5 dotted SVG connector trails between adjacent tiles with
 *   stroke-dashoffset animation producing a traveling-signal effect.
 *   Reads as "signal flowing between gear blocks."
 * - prefers-reduced-motion: no drift, no trail animation, static
 *   snapshot renders cleanly.
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
 * Positions for the floating tiles (percent-of-hero coordinates) and
 * the dotted connector trails between them. Tiles and connectors are
 * authored as a single graph so the connectors always land on the
 * actual tile centers, avoiding drift between the two layers.
 *
 * Positions are chosen to leave the center ~40% horizontal band free
 * for the headline + CTA.
 */
const V2_TILES: {
  id: string;
  label: NodeLabel;
  x: number; // percent 0..100
  y: number; // percent 0..100
  size: number;
  delay: number;
}[] = [
  { id: "guitar-l",  label: "GUITAR",      x: 10, y: 28, size: 104, delay: 0.0 },
  { id: "comp-l",    label: "COMPRESSION", x: 17, y: 74, size: 96,  delay: 1.6 },
  { id: "drive-r",   label: "OVERDRIVE",   x: 87, y: 20, size: 100, delay: 3.2 },
  { id: "amp-r",     label: "PREAMP",      x: 92, y: 68, size: 108, delay: 0.8 },
  { id: "mic-b",     label: "MIC",         x: 50, y: 92, size: 92,  delay: 2.4 },
  { id: "cab-tr",    label: "CABINET",     x: 78, y: 88, size: 88,  delay: 4.4 },
];

// Dotted connector trails: each connects two tile IDs. Order of
// declaration = the flow direction the traveling dot animates in.
const V2_TRAILS: [string, string][] = [
  ["guitar-l", "comp-l"],
  ["comp-l", "mic-b"],
  ["mic-b", "cab-tr"],
  ["cab-tr", "amp-r"],
  ["amp-r", "drive-r"],
];

/**
 * AmbientBackdrop — the decorative backdrop layer.
 *
 * Three layers, back to front:
 *   1. Sparse random dot field (the "bit pattern" texture)
 *   2. Radial vignette pulling attention to the center
 *   3. SVG with dotted connector trails + DIV gear tiles on top
 */
function AmbientBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  // Build a fast lookup from tile id to position
  const tileById = Object.fromEntries(V2_TILES.map((t) => [t.id, t]));

  return (
    <>
      {/* Layer 1 — sparse dot field. A single radial-gradient tile
          repeated gives a precise, printed-circuit feel. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(200, 220, 255, 0.22) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 80%)",
        }}
      />

      {/* Layer 2 — amber vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,_rgba(245,158,11,0.09),_transparent_55%)]" />

      {/* Layer 3 — SVG trails connecting the floating tiles. Uses
          viewBox 0..100 for x and y so it matches the tile percent
          coordinates exactly (non-uniform preserveAspectRatio). */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {V2_TRAILS.map(([fromId, toId], i) => {
          const a = tileById[fromId];
          const b = tileById[toId];
          if (!a || !b) return null;

          return (
            <line
              key={`${fromId}->${toId}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#c8dcff"
              strokeOpacity="0.35"
              strokeWidth="0.25"
              strokeDasharray="0.4 1.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: reduceMotion
                  ? "none"
                  : `heroV2TrailFlow 4s linear ${i * 0.6}s infinite`,
              }}
            />
          );
        })}
      </svg>

      {/* Gear tiles — large, floating, using real signal-chain glyphs */}
      <div className="pointer-events-none absolute inset-0">
        {V2_TILES.map((tile) => (
          <FloatingNodeTile
            key={tile.id}
            label={tile.label}
            top={`${tile.y}%`}
            left={`${tile.x}%`}
            size={tile.size}
            delay={tile.delay}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes heroV2TrailFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -16;
          }
        }
      `}</style>
    </>
  );
}

/**
 * FloatingNodeTile — a larger rounded-square tile containing a node
 * glyph. Drifts gently vertically and pulses on a slow cycle so the
 * hero feels alive without being busy. Size is much larger in v2-r2
 * (80-110px) so the tiles read as real gear blocks instead of
 * background ornaments.
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
        borderRadius: size * 0.18,
        border: `1.5px solid ${color}66`,
        background: "rgba(8, 12, 22, 0.88)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${size * 0.55}px ${color}30, 0 0 ${size * 1.1}px ${color}12, inset 0 0 ${size * 0.3}px ${color}10`,
        opacity: 0.78,
        transform: "translate(-50%, -50%)",
        animation: reduceMotion
          ? "none"
          : `heroV2NodeFloat 12s ease-in-out ${delay}s infinite`,
      }}
    >
      <NodeIcon label={label} color={color} size={Math.round(size * 0.5)} />
      <style jsx>{`
        @keyframes heroV2NodeFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.99);
            opacity: 0.68;
          }
          50% {
            transform: translate(-50%, calc(-50% - 12px)) scale(1.03);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
