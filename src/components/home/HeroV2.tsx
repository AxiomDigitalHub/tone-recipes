"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-40 text-center md:py-56">
        <h1
          className="font-[family-name:var(--font-display)] mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-[88px]"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.03 }}
        >
          Tone recipes from the songs{" "}
          <span className="text-accent italic">you love.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-lg text-muted md:text-xl">
          Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX,
          or physical rig.
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
 * The hero is now full-screen (min-h-screen), so there's room for the
 * six tiles and a true 6-link chain around the headline.
 */
// Tile positions for v2 — now arranged along a sine-wave path that
// arcs over the top half of the hero and curls down the right side to
// the mic at bottom. Positions are authored in chain order (signal
// flow: guitar → comp → drive → preamp → cab → mic) so the curve is
// both visually and semantically a "signal path."
const V2_TILES: {
  id: string;
  label: NodeLabel;
  x: number; // percent 0..100
  y: number; // percent 0..100
  size: number;
  delay: number;
}[] = [
  { id: "guitar-l", label: "GUITAR",      x: 7,  y: 26, size: 66, delay: 0.0 },
  { id: "comp-l",   label: "COMPRESSION", x: 24, y: 12, size: 60, delay: 1.6 },
  { id: "drive-c",  label: "OVERDRIVE",   x: 44, y: 24, size: 64, delay: 3.2 },
  { id: "amp-c",    label: "PREAMP",      x: 64, y: 10, size: 70, delay: 0.8 },
  { id: "cab-r",    label: "CABINET",     x: 86, y: 30, size: 60, delay: 4.4 },
  { id: "mic-br",   label: "MIC",         x: 92, y: 78, size: 58, delay: 2.4 },
];

// Chain order matches V2_TILES declaration order, so the "chain poly-
// line" passes through every tile in the order they appear.
const V2_CHAIN: string[] = V2_TILES.map((t) => t.id);

/**
 * Build a smooth SVG path string that passes through the given points
 * using a Catmull-Rom-to-cubic-bezier conversion. This is the "curved
 * connector" that replaces the old straight-line chain trails.
 *
 * @param pts Points in the same coordinate space as the SVG viewBox
 * @param tension 0..1, default 0.5. Higher = more curl into corners
 */
function smoothPath(
  pts: { x: number; y: number }[],
  tension = 0.5
): string {
  if (pts.length < 2) return "";
  const d: string[] = [`M ${pts[0].x.toFixed(3)} ${pts[0].y.toFixed(3)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    const c1x = p1.x + ((p2.x - p0.x) * tension) / 3;
    const c1y = p1.y + ((p2.y - p0.y) * tension) / 3;
    const c2x = p2.x - ((p3.x - p1.x) * tension) / 3;
    const c2y = p2.y - ((p3.y - p1.y) * tension) / 3;
    d.push(
      `C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`
    );
  }
  return d.join(" ");
}

/**
 * AmbientBackdrop — the decorative backdrop layer.
 *
 * Layers (back to front):
 *   1. Static sparse dot grid — the "bit pattern" texture
 *   2. Amber radial vignette centering attention
 *   3. SVG layer with:
 *      - Dotted connector trails between adjacent tiles (bolder now)
 *      - GridDots: ~44 SVG circles that animate from their grid
 *        position to a point along the chain path and back on a 12s
 *        cycle — the "bit pattern transferring into the signal chain"
 *        effect.
 *   4. The gear tiles themselves (DIVs with strong glow).
 */
function AmbientBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  const tileById = Object.fromEntries(V2_TILES.map((t) => [t.id, t]));
  const chainPoints = V2_CHAIN.map((id) => tileById[id]).filter(Boolean);

  // Pre-compute the set of animated grid-dots. Each dot has a fixed
  // "grid" origin and a "chain" target interpolated along the chain
  // poly-line. Memoized so we don't recompute on every render.
  const gridDots = useMemo(() => {
    return buildGridToChainDots(chainPoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Simplification (design-critique rec #3): static dot-grid
          background removed. The bit-pattern presence now comes
          entirely from the animated grid-to-chain dots below, which
          start at perturbed positions and coalesce into the sine
          wave. One less layer fighting for attention. */}

      {/* Amber vignette to anchor the headline */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,_rgba(245,158,11,0.09),_transparent_55%)]" />

      {/* Bottom fade into the SignalChainShowcase dark card */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-[#070a12] via-[#0a0a0f]/80 to-transparent" />

      {/* Layer 3 — SVG: chain trails + animated grid dots */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Curved sine-wave connector passing through every tile.
            Replaces the old straight-line chain. Uses a Catmull-Rom
            cubic bezier path so every tile sits exactly on the curve. */}
        <path
          d={smoothPath(chainPoints, 0.5)}
          stroke="#9dc4ff"
          strokeOpacity="0.65"
          strokeWidth="1.8"
          strokeDasharray="0.9 1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          fill="none"
          style={{
            animation: reduceMotion
              ? "none"
              : "heroV2TrailFlow 5s linear infinite",
          }}
        />

        {/* Animated grid dots — "bit pattern transferring into the chain" */}
        {gridDots.map((dot, i) => (
          <circle
            key={`grid-dot-${i}`}
            cx={0}
            cy={0}
            r="0.35"
            fill="#9dc4ff"
            vectorEffect="non-scaling-stroke"
            style={
              reduceMotion
                ? {
                    transform: `translate(${dot.gx}px, ${dot.gy}px)`,
                  }
                : ({
                    ["--gx" as string]: `${dot.gx}px`,
                    ["--gy" as string]: `${dot.gy}px`,
                    ["--cx" as string]: `${dot.cx}px`,
                    ["--cy" as string]: `${dot.cy}px`,
                    animation: `heroV2DotFlow 12s ease-in-out ${dot.delay}s infinite`,
                  } as React.CSSProperties)
            }
          />
        ))}
      </svg>

      {/* Gear tiles — smaller than before (72-86px), strong glow */}
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

      <style jsx global>{`
        @keyframes heroV2TrailFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -20;
          }
        }

        /* Grid-to-chain dot animation: dots rest at grid, glide to the
           chain line, hold, glide back. 12s loop. The opacity spikes
           during the chain portion so the chain briefly "lights up"
           as it forms. */
        @keyframes heroV2DotFlow {
          0%   { transform: translate(var(--gx), var(--gy)); opacity: 0.55; }
          18%  { transform: translate(var(--gx), var(--gy)); opacity: 0.55; }
          38%  { transform: translate(var(--cx), var(--cy)); opacity: 1;    }
          62%  { transform: translate(var(--cx), var(--cy)); opacity: 1;    }
          82%  { transform: translate(var(--gx), var(--gy)); opacity: 0.55; }
          100% { transform: translate(var(--gx), var(--gy)); opacity: 0.55; }
        }
      `}</style>
    </>
  );
}

/**
 * Build the set of dots that animate between their grid origin and
 * the chain line. Returns an array of { gx, gy, cx, cy, delay }
 * objects in SVG user units (0..100 on both axes).
 */
function buildGridToChainDots(
  chain: { x: number; y: number }[]
): { gx: number; gy: number; cx: number; cy: number; delay: number }[] {
  if (chain.length < 2) return [];

  // 1. Sample N evenly-spaced points along the multi-segment chain path.
  //    These become the "chain targets" each dot animates to.
  const N = 44;
  const segments = [];
  let totalLen = 0;
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i];
    const b = chain[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push({ a, b, len });
    totalLen += len;
  }

  const targets: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N; // avoid endpoints
    let d = t * totalLen;
    for (const seg of segments) {
      if (d <= seg.len) {
        const tt = d / seg.len;
        targets.push({
          x: seg.a.x + (seg.b.x - seg.a.x) * tt,
          y: seg.a.y + (seg.b.y - seg.a.y) * tt,
        });
        break;
      }
      d -= seg.len;
    }
  }

  // 2. For each target, pick a nearby grid origin. Grid is 6 user
  //    units spacing (denser than the visual dot-grid background to
  //    keep motion localised). Perturb randomly so the starting
  //    positions don't align in a visible pattern.
  const step = 6;
  return targets.map((t, i) => {
    // Offset from target by a pseudo-random vector on the grid
    const ang = (i * 137.508 * Math.PI) / 180; // golden angle
    const r = 10 + ((i * 31) % 14); // 10..24 units away
    const gx = Math.round((t.x + Math.cos(ang) * r) / step) * step;
    const gy = Math.round((t.y + Math.sin(ang) * r) / step) * step;
    const delay = (i * 12) / N; // stagger across the full 12s cycle
    return { gx, gy, cx: t.x, cy: t.y, delay };
  });
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
  // Glow strength matches the v3 arc tiles: a tight inner ring + a
  // medium glow + a broader soft halo. Color is tied to the icon so
  // outer glow always matches inner icon.
  const glow = [
    `0 0 0 1px ${color}22`,
    `0 0 ${size * 0.55}px ${color}55`,
    `0 0 ${size * 1.1}px ${color}28`,
    `inset 0 0 ${size * 0.3}px ${color}18`,
  ].join(", ");
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size * 0.18,
        border: `1.5px solid ${color}`,
        background: "#0b0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: glow,
        transform: "translate(-50%, -50%)",
        animation: reduceMotion
          ? "none"
          : `heroV2NodeFloat 12s ease-in-out ${delay}s infinite`,
      }}
    >
      <NodeIcon label={label} color={color} size={Math.round(size * 0.62)} />
      <style jsx>{`
        @keyframes heroV2NodeFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.99);
            filter: brightness(0.95);
          }
          50% {
            transform: translate(-50%, calc(-50% - 10px)) scale(1.03);
            filter: brightness(1.15);
          }
        }
      `}</style>
    </div>
  );
}
