"use client";

import React, { useEffect, useRef, useState } from "react";
import NodeIcon, { NODE_COLORS, type NodeLabel } from "./NodeIcon";

/**
 * SignalChainShowcase — the animated signal chain, now as its own
 * full-width scroll block instead of jammed inside the hero.
 *
 * Kept from the v1 hero: the sequential node light-up animation.
 * Dropped from the v1 hero: the cable routing measurement/SVG overlay
 * that tied the chain to the headline text. That was the source of the
 * "weird lines" feedback.
 */

const NODES: { label: NodeLabel; color: string; border: string }[] = [
  { label: "GUITAR",      color: NODE_COLORS.GUITAR.fill,      border: NODE_COLORS.GUITAR.border },
  { label: "COMPRESSION", color: NODE_COLORS.COMPRESSION.fill, border: NODE_COLORS.COMPRESSION.border },
  { label: "OVERDRIVE",   color: NODE_COLORS.OVERDRIVE.fill,   border: NODE_COLORS.OVERDRIVE.border },
  { label: "PREAMP",      color: NODE_COLORS.PREAMP.fill,      border: NODE_COLORS.PREAMP.border },
  { label: "DELAY",       color: NODE_COLORS.DELAY.fill,       border: NODE_COLORS.DELAY.border },
  { label: "CABINET",     color: NODE_COLORS.CABINET.fill,     border: NODE_COLORS.CABINET.border },
  { label: "MIC",         color: NODE_COLORS.MIC.fill,         border: NODE_COLORS.MIC.border },
];

function Connector({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: 40,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 2,
          background: active
            ? "repeating-linear-gradient(90deg, #3a4a60 0, #3a4a60 4px, transparent 4px, transparent 8px)"
            : "repeating-linear-gradient(90deg, #1e2840 0, #1e2840 4px, transparent 4px, transparent 8px)",
          transition: "background 0.5s",
        }}
      />
    </div>
  );
}

export default function SignalChainShowcase() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start animation when the section scrolls into view (not on mount)
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveStep(NODES.length);
      setIsComplete(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let step = 0;
    const stepDuration = 400;
    let timer: ReturnType<typeof setTimeout>;

    function advance() {
      setActiveStep(step);
      step++;
      if (step <= NODES.length) {
        timer = setTimeout(advance, stepDuration);
      } else {
        setIsComplete(true);
      }
    }

    timer = setTimeout(advance, 200);
    return () => clearTimeout(timer);
  }, [hasStarted]);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative border-y border-border bg-[#070a12] py-24"
    >
      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,250,0.4) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(250,250,250,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
          The method
        </p>
        <h2 className="text-3xl font-bold md:text-4xl">
          Every recipe is a signal chain.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Not a pile of knob positions. Every pedal, every amp block, every
          routing decision — mapped end-to-end from the guitar to the mic.
        </p>

        <div
          className="mx-auto mt-14 max-w-5xl overflow-x-auto px-4 py-6 sm:px-8"
          style={{ overflowY: "visible" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "max-content",
              margin: "0 auto",
              padding: "12px 0",
            }}
          >
            {NODES.map((node, i) => {
              const isLit = isComplete || activeStep >= i;
              const isCurrent = !isComplete && activeStep === i;

              return (
                <React.Fragment key={node.label}>
                  <div
                    style={{
                      width: 78,
                      height: 78,
                      borderRadius: 14,
                      border: `1.5px solid ${isLit ? node.border : "#1e2840"}`,
                      background: "#0b0f1a",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      flexShrink: 0,
                      transition:
                        "border-color 0.35s, box-shadow 0.35s, transform 0.35s",
                      transform: isCurrent ? "translateY(-7px)" : "none",
                      boxShadow: isLit
                        ? `0 0 0 1px ${node.color}15, 0 8px 28px ${node.color}${isCurrent ? "70" : "35"}`
                        : "none",
                    }}
                  >
                    <NodeIcon
                      label={node.label}
                      color={isLit ? node.color : "#2a3a55"}
                      size={28}
                    />
                    <div
                      style={{
                        fontSize: 7.5,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: isLit ? node.color : "#2a3a55",
                        transition: "color 0.35s",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>

                  {i < NODES.length - 1 && (
                    <Connector
                      active={isLit && (isComplete || activeStep >= i + 1)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
          {[
            {
              title: "Exact settings",
              desc: "Every knob on every pedal. Every slider on every amp block. No 'medium gain' hand-waving.",
            },
            {
              title: "Your platform",
              desc: "Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana, or a physical rig. Same tone, your gear.",
            },
            {
              title: "Why it works",
              desc: "Each step explains the reasoning. Over time you stop needing the recipe at all.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/70 bg-surface/60 p-6 backdrop-blur-sm"
            >
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
