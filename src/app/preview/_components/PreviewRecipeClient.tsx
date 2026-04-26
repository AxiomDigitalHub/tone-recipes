"use client";

import { useEffect, useRef, useState } from "react";
import type { PreviewBlockData } from "./PreviewBlocks";
import { PreviewBlockDetail } from "./PreviewBlocks";
import { PreviewSchematicChain } from "./PreviewSchematicChain";

/**
 * <PreviewRecipeClient> — owns the "which block is selected" state for
 * the interactive chain + the collapsible per-block settings panel.
 *
 * Model:
 * - Panel is CLOSED by default — the chain is the primary surface.
 * - Toggle bar below the chain expands/collapses the grid.
 * - Clicking a chain node auto-opens the panel and activates that card
 *   (scrolls it into view).
 * - Clicking a card itself also activates it.
 * - Source / cab-without-settings nodes aren't selectable (no card for them).
 */
export function PreviewRecipeClient({
  blocks,
  platformLabel,
}: {
  blocks: PreviewBlockData[];
  platformLabel: string;
}) {
  // Build the list of blocks that appear in the settings grid. We track
  // selection by the ORIGINAL block index so the chain node <-> grid card
  // mapping is unambiguous.
  const detailBlocks = blocks
    .map((b, i) => ({ b, i }))
    .filter(
      ({ b }) =>
        b.variant === "pedal" ||
        b.variant === "amp" ||
        (b.variant === "cab" && b.controls.length > 0),
    );

  const firstSelectable = detailBlocks[0]?.i ?? null;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    firstSelectable,
  );
  const [isOpen, setIsOpen] = useState(false);
  // Only scroll on real user interaction — not the initial auto-selection.
  const userInteracted = useRef(false);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!isOpen || !userInteracted.current || selectedIndex == null) return;
    const el = cardRefs.current[selectedIndex];
    if (!el) return;
    // Next frame — wait for the panel to finish expanding so the scroll
    // target has its final position.
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(id);
  }, [selectedIndex, isOpen]);

  const handleSelect = (i: number) => {
    userInteracted.current = true;
    setSelectedIndex(i);
    // Clicking a node always opens the panel — that's the discoverable
    // behavior ("this chain is interactive, here's what it controls").
    setIsOpen(true);
  };

  const selectedBlock =
    selectedIndex != null
      ? detailBlocks.find((d) => d.i === selectedIndex)?.b
      : undefined;

  return (
    <>
      <div className="recipe-chain-wrap">
        <div className="recipe-chain-header">
          <span>
            Signal path · input → output · {blocks.length} blocks
          </span>
          <span>Live values · {platformLabel}</span>
        </div>
        <PreviewSchematicChain
          blocks={blocks}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />
      </div>

      {/* Desktop-only toggle. On mobile the grid is always present but
          only renders the selected card, so the toggle is noise. */}
      <button
        type="button"
        className={`settings-section-head is-toggle ${isOpen ? "is-open" : ""} desktop-only`}
        aria-expanded={isOpen}
        aria-controls="per-block-settings-grid"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="kicker">
          Per-block settings · {platformLabel}
        </span>
        <h3 className="display">
          {isOpen
            ? "The numbers, broken out."
            : selectedBlock
              ? `Tap to see all settings · starting with ${selectedBlock.name}`
              : "Tap to see all settings."}
        </h3>
        <span className="toggle-chevron" aria-hidden="true">
          {isOpen ? "×" : "+"}
        </span>
      </button>

      {/* Grid is always in the DOM. CSS decides visibility:
          • desktop + closed → hidden (toggle controls it)
          • desktop + open   → full grid
          • mobile (any)     → only the .is-selected card visible */}
      <div
        id="per-block-settings-grid"
        className={`block-detail-grid ${isOpen ? "is-open" : "is-collapsed"}`}
      >
        {detailBlocks.map(({ b, i }) => (
          <div
            key={`${b.name}-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={`block-detail-slot ${selectedIndex === i ? "is-active-slot" : ""}`}
          >
            <PreviewBlockDetail
              block={b}
              isSelected={selectedIndex === i}
              onClick={() => handleSelect(i)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
