"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

      {/* Top vignette so the sticky header reads cleanly */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-[#05070e] to-transparent" />
      {/* Bottom fade into the SignalChainShowcase dark card */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-52 bg-gradient-to-t from-[#070a12] via-[#05070e]/80 to-transparent" />
      {/* Headline darkening halo — locally dims arcs and tiles that
          would otherwise cross the hero text for legibility */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[620px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,7,14,0.82) 0%, rgba(5,7,14,0.5) 45%, rgba(5,7,14,0) 75%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-5xl flex-col items-center justify-center px-4 py-40 text-center md:py-56">
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
          or physical rig.
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
 * Arc path definitions. Each arc carries a color, a list of nodes that
 * "ride" the path, and the SVG path d-string. Tiles are placed onto the
 * path at runtime via getPointAtLength so they stay precisely aligned
 * with the arc no matter the viewport.
 */
// Arc paths — trimmed at the starts so the first tile lands fully
// inside the viewport, and the violet/magenta arcs no longer cluster
// on the far left.
const ARC_CYAN    = "M -40 680 Q 380 120 880 380 T 1680 300";
const ARC_VIOLET  = "M 1640 320 Q 1080 930 480 700 T -20 560";
const ARC_MAGENTA = "M -20 460 Q 500 1080 1000 780 T 1680 880";

type ArcConfig = {
  d: string;
  color: string;
  nodes: NodeLabel[];
  /** Each node is placed at this fraction of path length. Values in (0,1). */
  positions: number[];
  /** Where along the path the traveling light starts (for the stroke-dash). */
  dashTotal: number;
  dashVisible: number;
  duration: number;
};

const ARCS: ArcConfig[] = [
  // Design-critique rec #4: tile count reduced from 13 -> 9 (3 per
  // arc). Each tile is now more meaningful and the composition
  // breathes. Each arc carries one member of the "signal flow"
  // trio: input (guitar/overdrive/preamp), middle (chorus/delay/
  // cabinet), output (mic/comp/preamp).
  {
    d: ARC_CYAN,
    color: "#22d3ee",
    nodes: ["GUITAR", "OVERDRIVE", "MIC"],
    positions: [0.18, 0.5, 0.88],
    dashTotal: 1580,
    dashVisible: 180,
    duration: 6,
  },
  {
    d: ARC_VIOLET,
    color: "#a78bfa",
    nodes: ["CABINET", "DELAY", "CHORUS"],
    positions: [0.12, 0.44, 0.82],
    dashTotal: 1820,
    dashVisible: 220,
    duration: 7.5,
  },
  {
    d: ARC_MAGENTA,
    color: "#f472b6",
    nodes: ["PREAMP", "COMPRESSION", "CABINET"],
    positions: [0.22, 0.5, 0.82],
    dashTotal: 1700,
    dashVisible: 200,
    duration: 5.5,
  },
];

type TilePoint = {
  x: number;
  y: number;
  label: NodeLabel;
  color: string;
  delay: number;
};

/**
 * OrbitalBackdrop — decorative layer with:
 * 1. Three curved arcs (cyan, violet, magenta) with animated
 *    stroke-dashoffset producing traveling light pulses.
 * 2. Solid glowing node tiles riding ON the arcs. Tile positions are
 *    computed at mount via getPointAtLength so they land precisely on
 *    each path. Tiles are rendered inside the SVG as <foreignObject>
 *    so they scale with the paths exactly.
 * 3. A radial vignette to focus attention on the headline.
 */
function OrbitalBackdrop({ reduceMotion }: { reduceMotion: boolean }) {
  const cyanRef = useRef<SVGPathElement>(null);
  const violetRef = useRef<SVGPathElement>(null);
  const magentaRef = useRef<SVGPathElement>(null);
  const [tiles, setTiles] = useState<TilePoint[]>([]);

  useEffect(() => {
    const refs = [cyanRef, violetRef, magentaRef];
    const computed: TilePoint[] = [];
    let delayIdx = 0;

    ARCS.forEach((arc, ai) => {
      const path = refs[ai].current;
      if (!path) return;
      const len = path.getTotalLength();
      arc.nodes.forEach((label, ni) => {
        const pt = path.getPointAtLength(len * arc.positions[ni]);
        computed.push({
          x: pt.x,
          y: pt.y,
          label,
          color: arc.color,
          delay: (delayIdx * 0.4) % 6,
        });
        delayIdx += 1;
      });
    });

    setTiles(computed);
  }, []);

  return (
    <>
      {/* Radial vignette anchoring attention on the headline */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,_rgba(245,158,11,0.10),_transparent_55%)]" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1100"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="heroV3Glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

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

        {/* Static low-opacity full-length stroke for constant presence */}
        <path d={ARC_CYAN}    stroke="#22d3ee" strokeOpacity="0.10" strokeWidth="1.5" strokeLinecap="round" />
        <path d={ARC_VIOLET}  stroke="#a78bfa" strokeOpacity="0.10" strokeWidth="1.5" strokeLinecap="round" />
        <path d={ARC_MAGENTA} stroke="#f472b6" strokeOpacity="0.10" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cyan arc — animated light pulse */}
        <path
          ref={cyanRef}
          d={ARC_CYAN}
          stroke="url(#heroV3ArcCyan)"
          strokeWidth="3"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray={`${ARCS[0].dashVisible} ${ARCS[0].dashTotal - ARCS[0].dashVisible}`}
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate attributeName="stroke-dashoffset" from="0" to={-ARCS[0].dashTotal} dur={`${ARCS[0].duration}s`} repeatCount="indefinite" />
          )}
        </path>

        {/* Violet arc */}
        <path
          ref={violetRef}
          d={ARC_VIOLET}
          stroke="url(#heroV3ArcViolet)"
          strokeWidth="3"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray={`${ARCS[1].dashVisible} ${ARCS[1].dashTotal - ARCS[1].dashVisible}`}
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate attributeName="stroke-dashoffset" from="0" to={-ARCS[1].dashTotal} dur={`${ARCS[1].duration}s`} repeatCount="indefinite" />
          )}
        </path>

        {/* Magenta arc */}
        <path
          ref={magentaRef}
          d={ARC_MAGENTA}
          stroke="url(#heroV3ArcMagenta)"
          strokeWidth="3"
          filter="url(#heroV3Glow)"
          strokeLinecap="round"
          strokeDasharray={`${ARCS[2].dashVisible} ${ARCS[2].dashTotal - ARCS[2].dashVisible}`}
          strokeDashoffset="0"
        >
          {!reduceMotion && (
            <animate attributeName="stroke-dashoffset" from="0" to={-ARCS[2].dashTotal} dur={`${ARCS[2].duration}s`} repeatCount="indefinite" />
          )}
        </path>

        {/* Tiles riding the arcs. Rendered as foreignObject so HTML
            styling + NodeIcon work, and scaled in SVG user units so they
            stay aligned with the paths regardless of viewport. */}
        {tiles.map((tile, i) => (
          <ArcTile
            key={i}
            x={tile.x}
            y={tile.y}
            label={tile.label}
            color={tile.color}
            delay={tile.delay}
            reduceMotion={reduceMotion}
          />
        ))}
      </svg>
    </>
  );
}

/**
 * ArcTile — a solid glowing node tile placed at (x, y) in SVG user
 * units. Size matches the signal-chain showcase tiles (~90 user units)
 * so the whole page uses a consistent block vocabulary. Uses
 * <foreignObject> to host the HTML NodeIcon inside the SVG coordinate
 * system.
 */
function ArcTile({
  x,
  y,
  label,
  delay,
  reduceMotion,
}: {
  x: number;
  y: number;
  label: NodeLabel;
  /** Arc color kept for reference, but the tile uses the icon's own
   * category color for border/glow now (the arc still shows in its
   * own color underneath). */
  color: string;
  delay: number;
  reduceMotion: boolean;
}) {
  const SIZE = 62;
  const nodeColor = NODE_COLORS[label].border;
  return (
    <foreignObject
      x={x - SIZE / 2}
      y={y - SIZE / 2}
      width={SIZE}
      height={SIZE}
      style={{ overflow: "visible" }}
    >
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: 12,
          border: `1.5px solid ${nodeColor}`,
          background: "#0b0f1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 0 1px ${nodeColor}22, 0 0 36px ${nodeColor}55, 0 0 76px ${nodeColor}28, inset 0 0 20px ${nodeColor}18`,
          animation: reduceMotion
            ? "none"
            : `heroV3ArcTilePulse 6s ease-in-out ${delay}s infinite`,
        }}
      >
        <NodeIcon label={label} color={nodeColor} size={40} />
        <style jsx>{`
          @keyframes heroV3ArcTilePulse {
            0%, 100% {
              filter: brightness(0.92);
              transform: scale(1);
            }
            50% {
              filter: brightness(1.18);
              transform: scale(1.04);
            }
          }
        `}</style>
      </div>
    </foreignObject>
  );
}
