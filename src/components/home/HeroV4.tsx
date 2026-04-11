"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * HeroV4 — scroll-driven dot matrix hero.
 *
 * Inspired by antigravity.google.com/product: dots coalesce into shapes
 * as you scroll, then disperse again. Antigravity uses pre-rendered
 * frame sequences on canvas. We can't ship 500 pre-rendered frames
 * (asset weight, generation cost), so this is the procedural version:
 *
 * - ~1500 points on a canvas, each with a random starting scatter
 *   position and a target position sampled from a gear icon shape.
 * - A scroll listener computes progress 0..1 through the hero section.
 * - Each frame, we interpolate every dot between its start and target
 *   using a cubic ease; render with 2d canvas.
 *
 * Target shapes are sampled from the gear icons by rasterising each
 * one into a hidden offscreen canvas at mount time and pulling the
 * pixel coordinates where the glyph was drawn. This means we never
 * ship art files — the shapes are defined by the same SVG paths used
 * elsewhere in the site.
 *
 * The scroll binding is anchored to the hero section only; once the
 * user scrolls past the hero, the dots are in their fully-coalesced
 * end state and the canvas is no longer in view.
 *
 * Respects prefers-reduced-motion: we render a single "mid-scroll"
 * frame with the dots settled ~60% toward their targets, and skip
 * the rAF loop entirely.
 */

// Gear icon path data, extracted from NodeIcon.tsx and normalised into
// an icon-local 0..1 coordinate system so they can be placed anywhere
// on the hero canvas.
type IconDef = {
  label: string;
  render: (ctx: CanvasRenderingContext2D, size: number) => void;
};

const ICONS: IconDef[] = [
  {
    label: "GUITAR",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(Math.PI / 4);
      ctx.scale(size / 233, size / 233);
      // Guitar silhouette as a filled path (simplified from the NodeIcon SVG)
      const path = new Path2D(
        "M.37,204.6c3.14-18.41,13.73-26.05,10.83-38l-4.7-19.39c-2.57-10.61-.13-23.54,8.66-21.95.68,8.66,2.55,18.19,9.21,18.21,2.21,0,5.97-2.33,6.01-4.84l1.59-94.89-6.28-7.9c-.75-.94,1.64-2.89,3.14-3.45l-1.55-3.24c-.37-.78,2.8-1.59,3.74-1.8l-2.04-3.64c-.53-.94,2.5-1.92,4.27-2.2l-1.73-2.09c-.47-.57-.77-2.54-.05-2.74l3.91-1.08-2.78-2.72c-.54-.53.56-2.38,1.32-2.48l3.66-.48-2.69-2.5c-.45-.42-.62-2.13-.05-2.35l3.02-1.14c1.78-2.43,4.19-4.35,7.26-3.86s5.21,2.68,6.12,5.7c.86,2.84-1.56,6.1-4.43,7.96-1.59,5.21,5.48,12.35,3.93,22.34-5.13.41-8.84,3.51-8.76,8.56l1.59,106.88c2.22,2.67,6.34,3.9,9.79,3.25,5.97-1.13,5.58-9.95,9.75-15.32,9.4,3.94,7.69,16.1,3.13,26.32-6.96,15.61,5.91,22.54,8.45,40.71,1.63,11.63-4.91,21.48-16.65,24.29-13.58,3.25-28.78,2.99-42.16-1.03-11.48-3.46-17.45-13.67-15.5-25.14Z"
      );
      ctx.translate(-37, -116);
      ctx.fillStyle = "#fff";
      ctx.fill(path);
      ctx.restore();
    },
  },
  {
    label: "OVERDRIVE",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(15, 3);
      ctx.lineTo(20, 14);
      ctx.lineTo(16.5, 14);
      ctx.lineTo(20, 27);
      ctx.lineTo(10, 13);
      ctx.lineTo(13.5, 13);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  },
  {
    label: "COMPRESSION",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // Left converging arrow
      ctx.beginPath();
      ctx.moveTo(5, 9);
      ctx.lineTo(11, 15);
      ctx.lineTo(5, 21);
      ctx.stroke();
      // Right converging arrow
      ctx.beginPath();
      ctx.moveTo(25, 9);
      ctx.lineTo(19, 15);
      ctx.lineTo(25, 21);
      ctx.stroke();
      // Center divider
      ctx.beginPath();
      ctx.moveTo(13, 15);
      ctx.lineTo(17, 15);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    label: "PREAMP",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      // outer rounded rect
      roundRect(ctx, 3, 5, 24, 20, 3.5);
      ctx.stroke();
      // inner circle
      ctx.beginPath();
      ctx.arc(15, 15, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    label: "DELAY",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      // Clock face
      ctx.beginPath();
      ctx.arc(15, 15, 11, 0, Math.PI * 2);
      ctx.stroke();
      // Minute hand (up)
      ctx.beginPath();
      ctx.moveTo(15, 8);
      ctx.lineTo(15, 15);
      ctx.stroke();
      // Hour hand (down-right)
      ctx.beginPath();
      ctx.moveTo(15, 15);
      ctx.lineTo(20, 18);
      ctx.stroke();
      // Center dot
      ctx.beginPath();
      ctx.arc(15, 15, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    },
  },
  {
    label: "MIC",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      // Capsule
      roundRect(ctx, 11.5, 3, 7, 14, 3.5);
      ctx.stroke();
      // Base arc
      ctx.beginPath();
      ctx.moveTo(7, 14);
      ctx.quadraticCurveTo(7, 23, 15, 23);
      ctx.quadraticCurveTo(23, 23, 23, 14);
      ctx.stroke();
      // Stem + foot
      ctx.beginPath();
      ctx.moveTo(15, 23);
      ctx.lineTo(15, 27);
      ctx.moveTo(10, 27);
      ctx.lineTo(20, 27);
      ctx.stroke();
      ctx.restore();
    },
  },
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Sample an icon into exactly `count` normalised (x, y) target
 * positions in the range -0.5..0.5. Renders the icon to an
 * offscreen canvas, scans opaque pixels, then subsamples or wraps
 * so every icon yields the same number of points (so the same
 * dot list can morph between icons with no orphan dots).
 */
function sampleIconTargets(
  icon: IconDef,
  rasterSize: number,
  count: number
): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = rasterSize;
  off.height = rasterSize;
  const ctx = off.getContext("2d");
  if (!ctx) return [];
  icon.render(ctx, rasterSize);
  const data = ctx.getImageData(0, 0, rasterSize, rasterSize).data;
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < rasterSize; y++) {
    for (let x = 0; x < rasterSize; x++) {
      const idx = (y * rasterSize + x) * 4;
      const a = data[idx + 3];
      if (a > 64) {
        points.push({
          x: x / rasterSize - 0.5,
          y: y / rasterSize - 0.5,
        });
      }
    }
  }
  if (points.length === 0) return new Array(count).fill({ x: 0, y: 0 });

  // Resample to exactly `count` points. Even spacing through the
  // source point list — if count > points.length we wrap.
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const ratio = i / count;
    const srcIdx = Math.floor(ratio * points.length);
    out.push(points[srcIdx % points.length]);
  }
  return out;
}

type Dot = {
  /** Idle scatter position (cloud around the slot center) */
  idleX: number;
  idleY: number;
  /** Array of target (x, y) pairs, one per icon in the cycle. */
  iconTargets: { x: number; y: number }[];
  seed: number;
};

// Target total dot count. All dots animate together between the idle
// grid and the current icon in the cycle, so this is also the number
// of points we sample per icon.
const TOTAL_DOTS = 506; // ~23 x 22 grid
// How long each icon phase lasts (ms). Phase = grid → icon → grid.
const PHASE_MS = 3600;

export default function HeroV4() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[] | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Setup: sample icon targets + build dots + start rAF loop
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build dot targets for the serial cycle.
    //
    // Layout:
    // - One slot, centered on the right ~68% of the canvas so the
    //   left side is free for the hero text.
    // - Icons sized way up (min(w,h) * 0.65).
    //
    // Each dot has a grid-aligned idle position and an array of
    // icon targets (one per phase). On each frame we interpolate
    // from the grid position to the current phase's icon target.
    function buildDots(width: number, height: number): Dot[] {
      const iconRenderSize = Math.min(width, height) * 0.65;
      const slotCx = width * 0.68;
      const slotCy = height * 0.5;

      // Sample each icon to exactly TOTAL_DOTS points.
      const perIcon: { x: number; y: number }[][] = ICONS.map((icon) => {
        const pts = sampleIconTargets(icon, 220, TOTAL_DOTS);
        return pts.map((p) => ({
          x: slotCx + p.x * iconRenderSize,
          y: slotCy + p.y * iconRenderSize,
        }));
      });

      // Grid idle layout. Uniform lattice of GRID_COLS × GRID_ROWS
      // centered on the slot. Cell spacing 6% larger than a bare
      // sqrt so the grid extends beyond the icon's bounding box —
      // this way when an icon forms inside the grid, outer dots move
      // in toward it from all sides.
      const GRID_COLS = 23;
      const GRID_ROWS = Math.ceil(TOTAL_DOTS / GRID_COLS);
      const GRID_SIZE = iconRenderSize * 1.55;
      const cellW = GRID_SIZE / GRID_COLS;
      const cellH = GRID_SIZE / GRID_ROWS;
      const gridLeft = slotCx - GRID_SIZE / 2 + cellW / 2;
      const gridTop = slotCy - GRID_SIZE / 2 + cellH / 2;

      const out: Dot[] = [];
      for (let i = 0; i < TOTAL_DOTS; i++) {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        const idleX = gridLeft + col * cellW;
        const idleY = gridTop + row * cellH;
        out.push({
          idleX,
          idleY,
          iconTargets: perIcon.map((arr) => arr[i]),
          seed: i,
        });
      }
      return out;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = section!.clientWidth;
      const h = section!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotsRef.current = buildDots(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Start offset so the cycle begins partway into the first phase
    // (mid-coalesce into the first icon) rather than at pure idle.
    const startMs = performance.now() - PHASE_MS * 0.25;

    function render() {
      if (!canvas || !ctx) return;
      const dots = dotsRef.current;
      if (!dots) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Serial cycle state:
      // - One phase per icon (PHASE_MS each).
      // - Within a phase, sin(progress*PI) makes dots travel idle →
      //   icon → idle on a smooth curve so phase boundaries are
      //   always in the idle cloud state. No snapping at transitions.
      const elapsed = performance.now() - startMs;
      const phaseIdx = Math.floor(elapsed / PHASE_MS) % ICONS.length;
      const phaseProgress = (elapsed % PHASE_MS) / PHASE_MS; // 0..1
      const rawCoalesce = reduceMotion
        ? 0.55
        : Math.sin(phaseProgress * Math.PI);
      // Ease so the "peak" at 0.5 feels like it lingers.
      const coalesce = easeInOutCubic(Math.max(0, Math.min(1, rawCoalesce)));

      // Dot color warms with coalescence: idle dots navy, forming
      // icons warm into amber.
      const hue = 220 - coalesce * 190;
      const sat = 55 + coalesce * 35;
      const light = 20 + coalesce * 20;
      const alpha = 0.55 + coalesce * 0.4;
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;

      const now = performance.now();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const target = d.iconTargets[phaseIdx];
        if (!target) continue;

        // Per-dot jitter adds life even at rest
        const jx = Math.sin(d.seed * 0.73 + now / 2400) * 3;
        const jy = Math.cos(d.seed * 0.91 + now / 2800) * 3;
        const x = d.idleX + (target.x - d.idleX) * coalesce + jx * (1 - coalesce);
        const y = d.idleY + (target.y - d.idleY) * coalesce + jy * (1 - coalesce);

        // Larger dots per Antigravity reference — ~2.8px radius
        // (scales with DPR via the canvas transform).
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      // Mouse-move driven now, not scroll — section is a single
      // viewport-height hero instead of a 180vh scroll-scrub range.
      className="relative bg-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Canvas layer — dark dots on white, per Antigravity reference */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Subtle radial warmth for the headline area — imperceptible on
          a pure white bg otherwise */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_50%_40%,_rgba(245,158,11,0.05),_transparent_55%)]" />

      {/* Content — left-aligned, constrained to the left half of the
          section so the canvas's dot→icon cycle can own the right
          half. No center alignment. */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 md:px-12">
        <div className="max-w-[54%] text-left md:max-w-[50%]">
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#0a0e1a] md:text-6xl lg:text-7xl"
            style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
          >
            Tone recipes from
            <br />
            the songs{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text italic text-transparent">
              you love.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg text-[#475269] md:text-xl">
            Pick a song. Get exact settings for your Helix, Quad Cortex,
            TONEX, or physical rig.
          </p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/browse"
              className="rounded-xl bg-[#0a0e1a] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-8px_rgba(10,14,26,0.35)] transition-all hover:bg-[#1a1e2e] hover:shadow-[0_20px_60px_-10px_rgba(10,14,26,0.45)]"
            >
              Browse Recipes
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-xl border border-[#0a0e1a]/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#0a0e1a] backdrop-blur-sm transition-all hover:border-[#0a0e1a]/40 hover:bg-white"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-10 flex items-center gap-2 text-sm text-[#6b7a92]">
            <span
              className="inline-block h-2 w-2 rounded-full bg-emerald-500"
              style={{
                boxShadow: "0 0 10px rgba(16, 185, 129, 0.7)",
                animation: reduceMotion ? "none" : "heroV4NowPulse 2s ease-in-out infinite",
              }}
            />
            <span>Watch the signal chain form</span>
          </p>
        </div>
      </div>

      {/* Bottom fade so the transition into the dark SignalChainShowcase
          below doesn't cut off mid-shape */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-b from-transparent via-white to-[#070a12]" />

      <style jsx>{`
        @keyframes heroV4NowPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
