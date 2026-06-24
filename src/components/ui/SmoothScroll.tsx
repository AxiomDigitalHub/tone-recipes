"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initializes Lenis smooth scroll globally.
 * Add this component once in the root layout.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Do NOT run Lenis on touch devices (phones/tablets). On iOS Safari it
    // fights native momentum scrolling and the drawer's body scroll-lock,
    // which produced two reported mobile bugs: the nav drawer letting page
    // content bleed through it, and "double-paint" overlap while scrolling
    // long lists (e.g. /blog). Native touch scrolling is already smooth —
    // the smooth-scroll polish is a desktop/pointer affordance only.
    const coarsePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const hasTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (coarsePointer || hasTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
