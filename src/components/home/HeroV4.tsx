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
    label: "CABINET",
    render: (ctx, size) => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(size / 30, size / 30);
      ctx.translate(-15, -15);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      roundRect(ctx, 3, 3, 24, 24, 3.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(15, 15, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(15, 15, 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(15, 15, 1.8, 0, Math.PI * 2);
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
 * Sample an icon into a list of target (x, y) positions by rendering
 * it to an offscreen canvas and scanning for lit pixels. Returns
 * normalized 0..1 coordinates relative to a rendered size.
 */
function sampleIconTargets(
  icon: IconDef,
  rasterSize: number,
  pixelStride: number,
  maxPoints: number
): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = rasterSize;
  off.height = rasterSize;
  const ctx = off.getContext("2d");
  if (!ctx) return [];
  icon.render(ctx, rasterSize);
  const data = ctx.getImageData(0, 0, rasterSize, rasterSize).data;
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < rasterSize; y += pixelStride) {
    for (let x = 0; x < rasterSize; x += pixelStride) {
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
  // Cap point count if we oversampled
  if (points.length > maxPoints) {
    const step = points.length / maxPoints;
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < maxPoints; i++) {
      out.push(points[Math.floor(i * step)]);
    }
    return out;
  }
  return points;
}

type Dot = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  seed: number;
};

export default function HeroV4() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[] | null>(null);
  const progressRef = useRef<number>(0);
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

    // Compute layout slots for the 6 icons: two rows of three,
    // centered above + below the headline.
    function layoutIconSlots(width: number, height: number) {
      const cols = 3;
      const rows = 2;
      const gapX = width / (cols + 1);
      const gapY = height / (rows + 1);
      const slots: { cx: number; cy: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({ cx: gapX * (c + 1), cy: gapY * (r + 1) });
        }
      }
      // Swap middle-top and middle-bottom out of the headline area.
      // We want the two middle column slots to be offset up/down so
      // they don't collide with the text.
      slots[1].cy = gapY * 0.55;
      slots[4].cy = height - gapY * 0.55;
      return slots;
    }

    // Build dot targets by sampling every icon and assigning each
    // sampled point to an absolute canvas coordinate.
    function buildDots(width: number, height: number): Dot[] {
      // Rec #2(a) from the design critique: icons larger and more
      // sample points. Total dot count ~doubles.
      const iconRenderSize = Math.min(width, height) * 0.26;
      const slots = layoutIconSlots(width, height);

      const allTargets: { cx: number; cy: number; iconSize: number }[] = [];
      ICONS.forEach((icon, i) => {
        const slot = slots[i % slots.length];
        const pts = sampleIconTargets(icon, 180, 3, 520);
        pts.forEach((p) => {
          allTargets.push({
            cx: slot.cx + p.x * iconRenderSize,
            cy: slot.cy + p.y * iconRenderSize,
            iconSize: iconRenderSize,
          });
        });
      });

      return allTargets.map((t, i) => ({
        // Random scatter across the canvas as the start position
        startX: Math.random() * width,
        startY: Math.random() * height,
        targetX: t.cx,
        targetY: t.cy,
        seed: i,
      }));
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

    function onScroll() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const h = rect.height;
      // Progress is 0 when the section top is at viewport top,
      // 1 when the section has fully scrolled past.
      const raw = -rect.top / (h - window.innerHeight + h * 0.5);
      progressRef.current = Math.max(0, Math.min(1, raw));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function render() {
      if (!canvas || !ctx) return;
      const dots = dotsRef.current;
      if (!dots) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Design-critique rec #2:
      // (c) Start the dots at 25% coalesced instead of 0% so the
      //     shapes are already suggested before the user scrolls.
      // (d) Add a continuous 2.8s breathing oscillation on top of
      //     the scroll progress so the dots are always moving,
      //     even on static viewports.
      const p = reduceMotion ? 0.6 : progressRef.current;
      const baseCoalesce = 0.25 + easeInOutCubic(Math.min(1, p * 1.6)) * 0.72;
      const breathe = reduceMotion
        ? 0
        : Math.sin(performance.now() / 2800) * 0.04;
      const coalesce = Math.max(0, Math.min(1, baseCoalesce + breathe));

      // Light theme: dark dots on white. Darker base so the dots are
      // visible against the white page even at low coalescence.
      const hue = 220 - coalesce * 190; // navy → amber
      const sat = 60 + coalesce * 30;
      const light = 18 + coalesce * 22;
      const alpha = 0.65 + coalesce * 0.3;
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // Per-dot jitter so the movement feels organic. Same seed
        // across frames = deterministic.
        const jx = Math.sin(d.seed * 0.73 + i) * 2;
        const jy = Math.cos(d.seed * 0.91 + i) * 2;
        const x = d.startX + (d.targetX - d.startX) * coalesce + jx * (1 - coalesce);
        const y = d.startY + (d.targetY - d.startY) * coalesce + jy * (1 - coalesce);
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      // NOTE: no overflow-hidden on this section — it breaks position:
      // sticky on the inner content block. The canvas is absolutely
      // positioned within the section so it's already clipped by layout.
      className="relative bg-white"
      style={{ minHeight: "180vh" }}
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

      {/* Content — sticks inside the first viewport so the remaining
          section height below becomes scroll-scrub territory. */}
      <div
        className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center px-4 text-center"
      >
        <h1
          className="font-[family-name:var(--font-display)] max-w-4xl text-5xl font-bold tracking-tight text-[#0a0e1a] md:text-7xl lg:text-[96px]"
          style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
        >
          Tone recipes from the songs{" "}
          <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text italic text-transparent">
            you love.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-lg text-[#475269] md:text-xl">
          Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX,
          or physical rig.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/browse"
            className="w-full rounded-xl bg-[#0a0e1a] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-8px_rgba(10,14,26,0.35)] transition-all hover:bg-[#1a1e2e] hover:shadow-[0_20px_60px_-10px_rgba(10,14,26,0.45)] sm:w-auto"
          >
            Browse Recipes
          </Link>
          <Link
            href="#how-it-works"
            className="w-full rounded-xl border border-[#0a0e1a]/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#0a0e1a] backdrop-blur-sm transition-all hover:border-[#0a0e1a]/40 hover:bg-white sm:w-auto"
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
          <span>Scroll to see the signal chain form</span>
        </p>

        <span
          className="mt-12 text-xs uppercase tracking-[0.3em] text-[#8894ab]"
          style={{
            animation: reduceMotion ? "none" : "heroV4ScrollHint 2.2s ease-in-out infinite",
          }}
        >
          Scroll ↓
        </span>
      </div>

      {/* Bottom fade so the transition into the dark SignalChainShowcase
          below doesn't cut off mid-shape */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-b from-transparent via-white to-[#070a12]" />

      <style jsx>{`
        @keyframes heroV4NowPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes heroV4ScrollHint {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
}
