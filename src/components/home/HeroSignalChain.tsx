"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

/* ── Node data ── */
const NODES = [
  { label: "GUITAR", color: "#d4a853", border: "#d4a853" },
  { label: "OVERDRIVE", color: "#4ade80", border: "#16a34a" },
  { label: "CHORUS", color: "#a78bfa", border: "#7c3aed" },
  { label: "PREAMP", color: "#f87171", border: "#dc2626" },
  { label: "DELAY", color: "#60a5fa", border: "#2563eb" },
  { label: "CABINET", color: "#f87171", border: "#dc2626" },
  { label: "MIC", color: "#94a3b8", border: "#475569" },
];

/* ── SVG icons per category ── */
function NodeIcon({ label, color, size = 28 }: { label: string; color: string; size?: number }) {
  switch (label) {
    case "GUITAR":
      return (
        <svg viewBox="0 0 74.92 233.01" width={size * 0.45} height={size * 0.7}>
          <path fill={color} d="M.37,204.6c3.14-18.41,13.73-26.05,10.83-38l-4.7-19.39c-2.57-10.61-.13-23.54,8.66-21.95.68,8.66,2.55,18.19,9.21,18.21,2.21,0,5.97-2.33,6.01-4.84l1.59-94.89-6.28-7.9c-.75-.94,1.64-2.89,3.14-3.45l-1.55-3.24c-.37-.78,2.8-1.59,3.74-1.8l-2.04-3.64c-.53-.94,2.5-1.92,4.27-2.2l-1.73-2.09c-.47-.57-.77-2.54-.05-2.74l3.91-1.08-2.78-2.72c-.54-.53.56-2.38,1.32-2.48l3.66-.48-2.69-2.5c-.45-.42-.62-2.13-.05-2.35l3.02-1.14c1.78-2.43,4.19-4.35,7.26-3.86s5.21,2.68,6.12,5.7c.86,2.84-1.56,6.1-4.43,7.96-1.59,5.21,5.48,12.35,3.93,22.34-5.13.41-8.84,3.51-8.76,8.56l1.59,106.88c2.22,2.67,6.34,3.9,9.79,3.25,5.97-1.13,5.58-9.95,9.75-15.32,9.4,3.94,7.69,16.1,3.13,26.32-6.96,15.61,5.91,22.54,8.45,40.71,1.63,11.63-4.91,21.48-16.65,24.29-13.58,3.25-28.78,2.99-42.16-1.03-11.48-3.46-17.45-13.67-15.5-25.14ZM54.2,201.03c6.64,1.57,12.21,10.87,16.07,8.33,7.45-4.9-12.05-28.59-9.71-36.42l4.57-15.3c1.4-4.69,1.7-9.23-.84-13.65l-2.73,6.47c-1.21,2.86-3.64,6.4-6.16,7.11-10.64,3.03-15.83-8.97-31.38-8.67,2.83,11.53,2.19,20.74-2.2,30.65-2.37,5.34-3.38,12.78.67,17.7s19,.78,31.71,3.78Z" />
        </svg>
      );
    case "OVERDRIVE":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><path d="M15 3L20 14H16.5L20 27L10 13H13.5Z" fill={color} /></svg>);
    case "CHORUS":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><path d="M4 15Q8 7 12 15Q16 23 20 15Q24 7 28 15" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" /><path d="M4 20Q8 12 12 20Q16 28 20 20Q24 12 28 20" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" /><path d="M4 10Q8 2 12 10Q16 18 20 10Q24 2 28 10" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" /></svg>);
    case "PREAMP":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><rect x="3" y="5" width="24" height="20" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" /><circle cx="15" cy="15" r="7" stroke={color} strokeWidth="1.4" fill="none" /><circle cx="15" cy="15" r="3.5" fill={color} opacity="0.3" /><path d="M8.5 15Q12 8 15 15Q18 22 21.5 15" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>);
    case "DELAY":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="11" stroke={color} strokeWidth="1.5" fill="none" /><line x1="15" y1="8" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" /><line x1="15" y1="15" x2="20" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" /><circle cx="15" cy="15" r="1.5" fill={color} /></svg>);
    case "CABINET":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><rect x="3" y="3" width="24" height="24" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" /><circle cx="15" cy="15" r="9" stroke={color} strokeWidth="1.3" fill="none" /><circle cx="15" cy="15" r="5.5" stroke={color} strokeWidth="1.1" fill="none" /><circle cx="15" cy="15" r="1.8" fill={color} /><line x1="15" y1="6" x2="15" y2="9" stroke={color} strokeWidth="1.2" /><line x1="15" y1="21" x2="15" y2="24" stroke={color} strokeWidth="1.2" /><line x1="6" y1="15" x2="9" y2="15" stroke={color} strokeWidth="1.2" /><line x1="21" y1="15" x2="24" y2="15" stroke={color} strokeWidth="1.2" /></svg>);
    case "MIC":
      return (<svg width={size} height={size} viewBox="0 0 30 30" fill="none"><rect x="11.5" y="3" width="7" height="14" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" /><path d="M7 14Q7 23 15 23Q23 23 23 14" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="15" y1="23" x2="15" y2="27" stroke={color} strokeWidth="2.2" strokeLinecap="round" /><line x1="10" y1="27" x2="20" y2="27" stroke={color} strokeWidth="2.2" strokeLinecap="round" /><line x1="11.5" y1="8" x2="18.5" y2="8" stroke={color} strokeWidth="1.1" /><line x1="11.5" y1="11" x2="18.5" y2="11" stroke={color} strokeWidth="1.1" /><line x1="11.5" y1="14" x2="18.5" y2="14" stroke={color} strokeWidth="1.1" /></svg>);
    default:
      return null;
  }
}

/* ── Simple dashed connector (no ? circles) ── */
function Connector({ active }: { active: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", width: 36, flexShrink: 0,
    }}>
      <div style={{
        flex: 1, height: 2,
        background: active
          ? "repeating-linear-gradient(90deg, #3a4a60 0, #3a4a60 4px, transparent 4px, transparent 8px)"
          : "repeating-linear-gradient(90deg, #1e2840 0, #1e2840 4px, transparent 4px, transparent 8px)",
        transition: "background 0.5s",
      }} />
    </div>
  );
}

/* ── Cubic bezier helper for dot animation ── */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const m = 1 - t;
  return m*m*m*p0 + 3*m*m*t*p1 + 3*m*t*t*p2 + t*t*t*p3;
}

export default function HeroSignalChain() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Refs for cable measurement
  const wrapperRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const guitarRef = useRef<HTMLDivElement>(null);
  const cableDotRef = useRef<SVGCircleElement>(null);
  const [cablePath, setCablePath] = useState("");
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const bezierRef = useRef({ sx: 0, sy: 0, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0, ex: 0, ey: 0 });
  const dotAnimated = useRef(false);

  // Measure cable from "you" text down to guitar node
  const measureCable = useCallback(() => {
    const wrap = wrapperRef.current;
    const you = youRef.current;
    const cta = ctaRef.current;
    const guitar = guitarRef.current;
    if (!wrap || !you || !guitar) return;

    const wr = wrap.getBoundingClientRect();
    const yr = you.getBoundingClientRect();
    const cr = cta ? cta.getBoundingClientRect() : null;
    const gr = guitar.getBoundingClientRect();
    if (wr.width === 0) return;

    // Start: bottom-right of "love." text (after the period)
    const sx = yr.left + yr.width - wr.left + 10;
    const sy = yr.bottom - wr.top + 6;

    // End: top-center of guitar node
    const ex = gr.left + gr.width / 2 - wr.left;
    const ey = gr.top - wr.top;

    // Right edge column: right side of the content area
    const rightEdge = Math.min(wr.width - 40, yr.left + yr.width - wr.left + 200);
    // Mid Y: right under the CTA buttons
    const midY = cr ? (cr.bottom - wr.top + 16) : (ey - 50);
    const bend = 28;

    // Path: RIGHT from "love." → DOWN the right side → LEFT across → DOWN into guitar
    const pathD = [
      // 1. Start at right of "love."
      `M ${sx} ${sy}`,
      // 2. Horizontal RIGHT to the right edge
      `L ${rightEdge - bend} ${sy}`,
      // 3. Bend: curve down-right
      `Q ${rightEdge} ${sy} ${rightEdge} ${sy + bend}`,
      // 4. Vertical DOWN along right side
      `L ${rightEdge} ${midY - bend}`,
      // 5. Bend: curve left
      `Q ${rightEdge} ${midY} ${rightEdge - bend} ${midY}`,
      // 6. Horizontal LEFT across to above guitar
      `L ${ex + bend} ${midY}`,
      // 7. Bend: curve down
      `Q ${ex} ${midY} ${ex} ${midY + bend}`,
      // 8. Vertical DOWN into guitar node
      `L ${ex} ${ey}`,
    ].join(" ");

    setCablePath(pathD);
    setSvgSize({ w: wr.width, h: wr.height });

    // For dot animation — approximate the multi-segment path as cubic bezier
    const cp1x = rightEdge;
    const cp1y = sy + (ey - sy) * 0.35;
    const cp2x = ex;
    const cp2y = sy + (ey - sy) * 0.65;
    bezierRef.current = { sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey };
  }, []);

  useEffect(() => {
    const t = setTimeout(measureCable, 200);
    window.addEventListener("resize", measureCable);
    return () => { clearTimeout(t); window.removeEventListener("resize", measureCable); };
  }, [measureCable]);

  // Node animation
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveStep(NODES.length);
      setIsComplete(true);
      return;
    }

    let step = 0;
    const stepDuration = 500;

    function advance() {
      setActiveStep(step);
      step++;
      if (step <= NODES.length) {
        timerRef.current = setTimeout(advance, stepDuration);
      } else {
        setIsComplete(true);
      }
    }

    // Start: cable dot travels first, then nodes light up
    timerRef.current = setTimeout(advance, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Cable dot animation — fires once after mount
  useEffect(() => {
    if (dotAnimated.current) return;
    const dot = cableDotRef.current!;
    if (!dot || !cablePath) return;
    dotAnimated.current = true;

    const { sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey } = bezierRef.current;
    if (sx === 0 && sy === 0) return;

    const ms = 900;
    const startTime = performance.now();
    dot.setAttribute("opacity", "1");

    function frame(now: number) {
      const t = Math.min((now - startTime) / ms, 1);
      const x = cubicBezier(t, sx, cp1x, cp2x, ex);
      const y = cubicBezier(t, sy, cp1y, cp2y, ey);
      dot.setAttribute("transform", `translate(${x},${y})`);
      if (t < 1) requestAnimationFrame(frame);
      else dot.setAttribute("opacity", "0");
    }
    requestAnimationFrame(frame);
  }, [cablePath]);

  // Re-measure after first node renders
  useEffect(() => {
    if (activeStep >= 0) measureCable();
  }, [activeStep, measureCable]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* ── Cable SVG overlay ── */}
      {cablePath && (
        <svg
          style={{
            position: "absolute", top: 0, left: 0,
            pointerEvents: "none", zIndex: 1,
            overflow: "visible",
          }}
          width={svgSize.w}
          height={svgSize.h}
          fill="none"
        >
          <path
            d={cablePath}
            stroke="#1e304a"
            strokeWidth="2"
            strokeDasharray="6 5"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <radialGradient id="hero-cable-grd">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <filter id="hero-cable-glow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle
            ref={cableDotRef}
            r="5"
            fill="url(#hero-cable-grd)"
            filter="url(#hero-cable-glow)"
            opacity="0"
          />
        </svg>
      )}

      {/* ── "you love." text anchor — we expose a ref on "you" ── */}
      <h1 className="font-[family-name:var(--font-display)] mx-auto mt-4 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl xl:text-9xl" style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}>
        Tone recipes from the songs
        <br />
        <span ref={youRef} className="signal-underline bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          you love.
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
        Pick a song. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig. Stop tweaking. Start playing.
      </p>

      <div ref={ctaRef} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ position: "relative", zIndex: 2 }}>
        <a
          href="/browse"
          className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Browse Recipes
        </a>
        <a
          href="/how-it-works"
          className="rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
        >
          See how it works
        </a>
      </div>

      <p className="mt-4 text-sm text-muted" style={{ position: "relative", zIndex: 2 }}>
        New here?{" "}
        <a href="/blog/what-is-a-tone-recipe" className="text-accent hover:underline">
          Learn what a tone recipe is
        </a>
      </p>

      {/* ── Signal chain nodes ── */}
      <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-[#1e2840] bg-[#0b0f1a] px-4 py-8 sm:px-8" style={{ position: "relative", zIndex: 2, overflowX: "auto", overflowY: "visible" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minWidth: "max-content", margin: "0 auto",
          padding: "12px 0",
        }}>
          {NODES.map((node, i) => {
            const isLit = isComplete || activeStep >= i;
            const isCurrent = !isComplete && activeStep === i;

            return (
              <React.Fragment key={node.label}>
                <div
                  ref={i === 0 ? guitarRef : undefined}
                  style={{
                    width: 72, height: 72, borderRadius: 13,
                    border: `1.5px solid ${isLit ? node.border : "#1e2840"}`,
                    background: "#0b0f1a",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 6, flexShrink: 0,
                    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                    transform: isCurrent ? "translateY(-6px)" : "none",
                    boxShadow: isLit
                      ? `0 0 0 1px ${node.color}15, 0 6px 24px ${node.color}${isCurrent ? "60" : "30"}`
                      : "none",
                  }}
                >
                  <NodeIcon label={node.label} color={isLit ? node.color : "#2a3a55"} size={26} />
                  <div style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: isLit ? node.color : "#2a3a55",
                    transition: "color 0.3s",
                  }}>
                    {node.label}
                  </div>
                </div>

                {/* Simple dashed connector — no ? circles */}
                {i < NODES.length - 1 && (
                  <Connector active={isLit && (isComplete || activeStep >= i + 1)} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
