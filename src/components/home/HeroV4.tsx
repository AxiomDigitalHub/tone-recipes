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

// Gear icon definitions as SVG path strings. Dots are sampled evenly
// along the path outlines (getPointAtLength), not scanned from a
// rasterised fill — this is the difference between Google
// Antigravity's "dots tracing contour lines" and our previous
// "dots scattered inside a blob". Each dot becomes a stop along
// the outline, producing the clean line-drawing read.
type IconDef = {
  label: string;
  /** SVG path strings. getTotalLength is called per path and dots
   *  are distributed proportionally across the combined length. */
  paths: string[];
  /** Optional rotation applied at sample time (degrees). */
  rotate?: number;
};

const ICONS: IconDef[] = [
  {
    label: "GUITAR",
    // Filled silhouette — getPointAtLength traces the border only,
    // which is exactly what we want (outline of the guitar body).
    paths: [
      "M.37,204.6c3.14-18.41,13.73-26.05,10.83-38l-4.7-19.39c-2.57-10.61-.13-23.54,8.66-21.95.68,8.66,2.55,18.19,9.21,18.21,2.21,0,5.97-2.33,6.01-4.84l1.59-94.89-6.28-7.9c-.75-.94,1.64-2.89,3.14-3.45l-1.55-3.24c-.37-.78,2.8-1.59,3.74-1.8l-2.04-3.64c-.53-.94,2.5-1.92,4.27-2.2l-1.73-2.09c-.47-.57-.77-2.54-.05-2.74l3.91-1.08-2.78-2.72c-.54-.53.56-2.38,1.32-2.48l3.66-.48-2.69-2.5c-.45-.42-.62-2.13-.05-2.35l3.02-1.14c1.78-2.43,4.19-4.35,7.26-3.86s5.21,2.68,6.12,5.7c.86,2.84-1.56,6.1-4.43,7.96-1.59,5.21,5.48,12.35,3.93,22.34-5.13.41-8.84,3.51-8.76,8.56l1.59,106.88c2.22,2.67,6.34,3.9,9.79,3.25,5.97-1.13,5.58-9.95,9.75-15.32,9.4,3.94,7.69,16.1,3.13,26.32-6.96,15.61,5.91,22.54,8.45,40.71,1.63,11.63-4.91,21.48-16.65,24.29-13.58,3.25-28.78,2.99-42.16-1.03-11.48-3.46-17.45-13.67-15.5-25.14Z",
    ],
    rotate: 45,
  },
  {
    label: "OVERDRIVE",
    paths: [
      "M15 3 L20 14 L16.5 14 L20 27 L10 13 L13.5 13 Z",
    ],
  },
  {
    label: "COMPRESSION",
    paths: [
      "M5 9 L11 15 L5 21",
      "M25 9 L19 15 L25 21",
      "M13 15 L17 15",
    ],
  },
  {
    label: "PREAMP",
    paths: [
      // Rounded rect outline (box)
      "M 6.5 5 L 23.5 5 Q 27 5 27 8.5 L 27 21.5 Q 27 25 23.5 25 L 6.5 25 Q 3 25 3 21.5 L 3 8.5 Q 3 5 6.5 5 Z",
      // Inner circle
      "M 22 15 A 7 7 0 0 1 8 15 A 7 7 0 0 1 22 15 Z",
    ],
  },
  {
    label: "DELAY",
    paths: [
      // Clock face
      "M 26 15 A 11 11 0 0 1 4 15 A 11 11 0 0 1 26 15 Z",
      // Minute hand (up)
      "M 15 8 L 15 15",
      // Hour hand (down-right)
      "M 15 15 L 20 18",
    ],
  },
  {
    label: "MIC",
    paths: [
      // Capsule (the w=7, rx=3.5 makes a pure capsule shape)
      "M 15 3 Q 11.5 3 11.5 6.5 L 11.5 13.5 Q 11.5 17 15 17 Q 18.5 17 18.5 13.5 L 18.5 6.5 Q 18.5 3 15 3 Z",
      // Base arc (stand cradle)
      "M 7 14 Q 7 23 15 23 Q 23 23 23 14",
      // Stem
      "M 15 23 L 15 27",
      // Foot
      "M 10 27 L 20 27",
    ],
  },
];

/**
 * Sample an icon's outline into exactly `count` normalised (x, y)
 * points in the range -0.5..0.5. Uses SVG getPointAtLength so dots
 * are distributed evenly along the outline rather than inside the
 * filled area. Matches Google Antigravity's contour-tracing dots.
 *
 * All outputs are auto-normalised to fit a 0.9 × 0.9 bounding box
 * centered at (0,0), so simple and complex icons fill the same
 * target region regardless of native SVG coordinates or rotation.
 */
function sampleIconTargets(
  icon: IconDef,
  count: number
): { x: number; y: number }[] {
  if (typeof document === "undefined") {
    return new Array(count).fill({ x: 0, y: 0 });
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  // getTotalLength needs the element to be rendered, so we park the
  // SVG off-screen with zero dimensions.
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-99999px";
  svg.style.top = "0";
  svg.style.visibility = "hidden";
  document.body.appendChild(svg);

  try {
    const pathEls: SVGPathElement[] = icon.paths.map((d) => {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
      return p;
    });

    const lengths = pathEls.map((p) => p.getTotalLength());
    const totalLen = lengths.reduce((a, b) => a + b, 0);
    if (totalLen === 0) {
      return new Array(count).fill({ x: 0, y: 0 });
    }

    // Distribute `count` points along the combined path length.
    const raw: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      let dist = t * totalLen;
      for (let j = 0; j < pathEls.length; j++) {
        if (dist <= lengths[j] || j === pathEls.length - 1) {
          const pt = pathEls[j].getPointAtLength(Math.min(dist, lengths[j]));
          raw.push({ x: pt.x, y: pt.y });
          break;
        }
        dist -= lengths[j];
      }
    }

    // Apply rotation if specified
    const rot = icon.rotate ? (icon.rotate * Math.PI) / 180 : 0;
    if (rot !== 0) {
      // Rotate around the centroid for a balanced look
      let sumX = 0;
      let sumY = 0;
      for (const p of raw) {
        sumX += p.x;
        sumY += p.y;
      }
      const cx = sumX / raw.length;
      const cy = sumY / raw.length;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      for (const p of raw) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        p.x = cx + dx * cos - dy * sin;
        p.y = cy + dx * sin + dy * cos;
      }
    }

    // Auto-normalise: compute the bounding box of the sampled points
    // and scale them to fit a 0.9 × 0.9 square centered at (0,0).
    // Preserves aspect ratio.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of raw) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    const span = Math.max(spanX, spanY);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const scale = 0.9 / span;

    return raw.map((p) => ({
      x: (p.x - cx) * scale,
      y: (p.y - cy) * scale,
    }));
  } finally {
    svg.remove();
  }
}

type Dot = {
  /** Grid position — where the dot lives at rest. Already jittered
   *  by ±20% of the grid spacing so the lattice doesn't read as a
   *  perfect regular grid (reduces moire). */
  idleX: number;
  idleY: number;
  /**
   * Icon targets for this dot. null = this dot is a static grid
   * dot outside the icon's influence zone and never animates.
   */
  iconTargets: { x: number; y: number }[] | null;
  /** Independent drift frequencies per dot — prevents the whole
   *  grid from oscillating in phase (which would reinforce the
   *  lattice pattern instead of softening it). */
  driftFreqX: number;
  driftFreqY: number;
  seed: number;
};

// Full-screen grid spacing. Smaller = denser. Adaptive to viewport
// so a tall phone and a wide desktop both look balanced. Larger
// factor = fewer dots (user asked for "maybe less overall").
const GRID_SPACING_FACTOR = 18; // min(w,h) / 18 ≈ 63px on desktop
// How long each icon phase lasts (ms). Phase = grid → icon → grid.
const PHASE_MS = 3600;
// Dot radius. The regular lattice was causing moire at r=2.8; a
// smaller radius combined with per-dot jitter breaks it up.
const DOT_RADIUS = 2.2;
// Mouse "gravity" pulls nearby grid dots toward the cursor with
// a quadratic falloff. Radius is measured in multiples of the
// grid spacing so it scales with the viewport.
const GRAVITY_RADIUS_CELLS = 4.5;
const GRAVITY_MAX_PULL_CELLS = 0.85;
// Full rotation period for the grid around the icon slot. "Slow"
// per user direction — 90s ≈ 4°/second.
const ROTATION_PERIOD_MS = 90_000;

export default function HeroV4() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[] | null>(null);
  // Mouse position in canvas-local coords. Used for the gravity
  // effect on the static grid. -Infinity = "no mouse" (idle grid).
  const mouseRef = useRef<{ x: number; y: number }>({
    x: -Infinity,
    y: -Infinity,
  });
  // Cached per-layout constants so the render loop can read them
  // without recomputing gravity radii every frame.
  const gravityRef = useRef<{ radius: number; maxPull: number }>({
    radius: 0,
    maxPull: 0,
  });
  // Slot center is the rotation pivot for the grid.
  const slotCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
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
    // - Full-screen grid of dots at ~52px spacing.
    // - One icon slot on the right ~68% of the canvas.
    // - Dots inside the slot's "influence zone" (radius 0.6 ×
    //   iconRenderSize) animate to the current icon's targets.
    //   Dots outside stay at their grid positions always, forming
    //   a quiet ambient lattice.
    //
    // With iconRenderSize = 0.65 × min(w,h) and spacing ≈ min(w,h)/22,
    // there are ~200-280 active dots inside the zone (roughly half
    // the prior density, per the user's "fewer dots in the icon"
    // direction) and ~500-700 static grid dots everywhere else.
    function buildDots(width: number, height: number): Dot[] {
      const iconRenderSize = Math.min(width, height) * 0.65;
      const slotCx = width * 0.72;
      const slotCy = height * 0.5;
      // Publish slot center for the rotation/render loop.
      slotCenterRef.current = { x: slotCx, y: slotCy };
      const influenceRadius = iconRenderSize * 0.6;
      const spacing = Math.min(width, height) / GRID_SPACING_FACTOR;

      // Lay out a full-screen grid. Offset so the grid is centered
      // in the section (no awkward half-rows at the edges).
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const xOffset = (width - (cols - 1) * spacing) / 2;
      const yOffset = (height - (rows - 1) * spacing) / 2;

      // Pseudo-random but deterministic per-cell jitter: each grid
      // cell gets a stable offset of ±20% of spacing, breaking the
      // perfect lattice.
      const jitterAmp = spacing * 0.2;
      function jitterFor(c: number, r: number) {
        // Hash-ish: two different combinations per axis
        const h1 = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
        const h2 = Math.sin(c * 39.3468 + r * 11.135) * 28841.7317;
        return {
          dx: ((h1 - Math.floor(h1)) * 2 - 1) * jitterAmp,
          dy: ((h2 - Math.floor(h2)) * 2 - 1) * jitterAmp,
        };
      }

      // Split grid positions into active (inside influence zone)
      // and static (outside).
      const activePositions: { x: number; y: number }[] = [];
      const staticPositions: { x: number; y: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const { dx: jdx, dy: jdy } = jitterFor(c, r);
          const x = xOffset + c * spacing + jdx;
          const y = yOffset + r * spacing + jdy;
          const ddx = x - slotCx;
          const ddy = y - slotCy;
          if (Math.hypot(ddx, ddy) <= influenceRadius) {
            activePositions.push({ x, y });
          } else {
            staticPositions.push({ x, y });
          }
        }
      }

      // Sample each icon to exactly active.length points so every
      // active dot gets a target for every icon in the cycle.
      const activeCount = activePositions.length;
      const perIcon: { x: number; y: number }[][] = ICONS.map((icon) => {
        const pts = sampleIconTargets(icon, activeCount);
        return pts.map((p) => ({
          x: slotCx + p.x * iconRenderSize,
          y: slotCy + p.y * iconRenderSize,
        }));
      });

      // Per-dot drift frequencies. Each dot gets unique periods
      // derived from its index so the whole grid doesn't pulse in
      // phase. Range roughly 2400-6500ms, kept off any integer
      // multiples that would align multiple dots.
      function freqFor(i: number, base: number) {
        return base + ((i * 173) % 97) * 42;
      }

      const out: Dot[] = [];
      // Active dots: have icon targets, participate in the cycle.
      activePositions.forEach((p, i) => {
        out.push({
          idleX: p.x,
          idleY: p.y,
          iconTargets: perIcon.map((arr) => arr[i]),
          driftFreqX: freqFor(i, 2400),
          driftFreqY: freqFor(i + 7, 2800),
          seed: out.length,
        });
      });
      // Static dots: fill the rest of the full-screen grid.
      staticPositions.forEach((p, i) => {
        out.push({
          idleX: p.x,
          idleY: p.y,
          iconTargets: null,
          driftFreqX: freqFor(i + 31, 2400),
          driftFreqY: freqFor(i + 53, 2800),
          seed: out.length,
        });
      });
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
      // Update gravity constants: radius/pull are measured in grid
      // spacing units so they scale with the viewport.
      const spacing = Math.min(w, h) / GRID_SPACING_FACTOR;
      gravityRef.current = {
        radius: spacing * GRAVITY_RADIUS_CELLS,
        maxPull: spacing * GRAVITY_MAX_PULL_CELLS,
      };
    }

    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    function onMouseOut(e: MouseEvent) {
      // Only clear when the cursor leaves the window entirely.
      if (!e.relatedTarget && !(e as unknown as { toElement?: unknown }).toElement) {
        mouseRef.current = { x: -Infinity, y: -Infinity };
      }
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseout", onMouseOut);

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

      // Dot color warms with coalescence. On dark bg we run LIGHT
      // on both axes — a soft blue-grey at idle that brightens into
      // a warm amber at peak coalescence.
      const hue = 220 - coalesce * 185;       // 220 → 35 (blue → amber)
      const sat = 25 + coalesce * 70;          // 25  → 95
      const light = 72 - coalesce * 2;         // 72  → 70 (high on both)
      const alpha = 0.5 + coalesce * 0.48;     // 0.5 → 0.98
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;

      // Mouse gravity: pull grid dots toward the cursor within a
      // falloff radius. Applied equally to static and active-idle
      // dots so the whole grid responds uniformly.
      const mouse = mouseRef.current;
      const { radius: gRadius, maxPull: gMaxPull } = gravityRef.current;
      const hasMouse = mouse.x > -Infinity && gRadius > 0;

      // Grid rotation around the icon slot. The whole grid — including
      // icon targets — rotates together so forming shapes appear to
      // rotate with their surrounding dots.
      const rotAngle = reduceMotion
        ? 0
        : ((performance.now() % ROTATION_PERIOD_MS) / ROTATION_PERIOD_MS) *
          Math.PI *
          2;
      const rCos = Math.cos(rotAngle);
      const rSin = Math.sin(rotAngle);
      const slot = slotCenterRef.current;

      const now = performance.now();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Per-dot independent time-based drift (each dot has its own
        // freqX/freqY so they don't pulse in phase).
        const jx = Math.sin(d.seed * 0.73 + now / d.driftFreqX) * 2.4;
        const jy = Math.cos(d.seed * 0.91 + now / d.driftFreqY) * 2.4;

        // Rotate the idle position around the slot center.
        const ridx = d.idleX - slot.x;
        const ridy = d.idleY - slot.y;
        const rotIdleX = slot.x + ridx * rCos - ridy * rSin;
        const rotIdleY = slot.y + ridx * rSin + ridy * rCos;

        // Base position: rotated grid for static, lerp to rotated
        // icon target for active.
        let baseX: number;
        let baseY: number;
        let jitterBlend: number;
        if (!d.iconTargets) {
          baseX = rotIdleX;
          baseY = rotIdleY;
          jitterBlend = 1;
        } else {
          const target = d.iconTargets[phaseIdx];
          if (!target) continue;
          const rtx = target.x - slot.x;
          const rty = target.y - slot.y;
          const rotTargetX = slot.x + rtx * rCos - rty * rSin;
          const rotTargetY = slot.y + rtx * rSin + rty * rCos;
          baseX = rotIdleX + (rotTargetX - rotIdleX) * coalesce;
          baseY = rotIdleY + (rotTargetY - rotIdleY) * coalesce;
          // At peak coalescence, drift + gravity should be mostly
          // suppressed so the icon reads cleanly.
          jitterBlend = 1 - coalesce;
        }

        // Mouse gravity: attract the dot toward the cursor with a
        // quadratic falloff. Computed against the dot's ROTATED idle
        // position so the effect feels spatially correct. Scaled by
        // jitterBlend so forming icons are not disturbed.
        let gpx = 0;
        let gpy = 0;
        if (hasMouse) {
          const mdx = mouse.x - rotIdleX;
          const mdy = mouse.y - rotIdleY;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < gRadius && mdist > 0.01) {
            const falloff = 1 - mdist / gRadius;
            const pull = falloff * falloff * gMaxPull;
            gpx = (mdx / mdist) * pull;
            gpy = (mdy / mdist) * pull;
          }
        }

        const x = baseX + (jx + gpx) * jitterBlend;
        const y = baseY + (jy + gpy) * jitterBlend;

        // Smaller dot radius — r=2.2. The prior 2.8 was visibly
        // moire-prone on the regular lattice.
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      // Dark theme: dots read as light amber/blue on a near-black
      // background, matching the rest of the site's palette.
      className="relative bg-[#0a0a0f]"
      style={{ minHeight: "100vh" }}
    >
      {/* Canvas layer — dark dots on white, per Antigravity reference */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Subtle amber radial warmth behind the headline area */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_36%_50%,_rgba(245,158,11,0.08),_transparent_55%)]" />

      {/* Content — left-aligned, constrained to ~58% so the H1 fits
          in exactly two lines at desktop widths. The canvas owns the
          right ~42% where the cycling icon forms. */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 md:px-12">
        <div className="max-w-[60%] text-left">
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.035em", lineHeight: 1.05 }}
          >
            Tone recipes from
            <br />
            the songs{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text italic text-transparent">
              you love.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg text-[#c8d2e2] md:text-xl">
            Pick a song. Get exact settings for your Helix, Quad Cortex,
            TONEX, or physical rig.
          </p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/browse"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background shadow-[0_12px_40px_-8px_rgba(245,158,11,0.45)] transition-all hover:bg-accent-hover hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.6)]"
            >
              Browse Recipes
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-10 flex items-center gap-2 text-sm text-[#8ea2bc]">
            <span
              className="inline-block h-2 w-2 rounded-full bg-emerald-400"
              style={{
                boxShadow: "0 0 10px rgba(52, 211, 153, 0.8)",
                animation: reduceMotion ? "none" : "heroV4NowPulse 2s ease-in-out infinite",
              }}
            />
            <span>Watch the signal chain form</span>
          </p>
        </div>
      </div>

      {/* Bottom fade so the transition into the dark SignalChainShowcase
          below doesn't cut off mid-shape */}
      {/* Bottom fade into the SignalChainShowcase section below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-[#070a12]" />

      <style jsx>{`
        @keyframes heroV4NowPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
