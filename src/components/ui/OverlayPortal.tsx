"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders overlay/modal content into <body>, escaping the
 * `.fk-preview > * { position: relative; z-index: 1 }` stacking trap that
 * otherwise demotes fixed overlays to `position: relative; z-index: 1`
 * (unlayered CSS beats Tailwind's layered utilities) and pins them
 * beneath page content. Confirmed to have broken the nav drawer, the
 * search palette, and the email-gate/upgrade modals.
 *
 * The portal wrapper carries `.fk-overlay-scope`, which re-declares the
 * v3 design tokens (var(--paper), var(--ink), …) so they still resolve
 * outside the `.fk-preview` subtree — WITHOUT re-adding the noise texture
 * (`.fk-preview::before`) or the z-index trap.
 *
 * SSR-safe: renders nothing until mounted on the client (document/body
 * aren't available during server render).
 */
export default function OverlayPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="fk-overlay-scope">{children}</div>,
    document.body,
  );
}
