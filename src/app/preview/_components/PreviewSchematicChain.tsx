"use client";

import type { PreviewBlockData } from "./PreviewBlocks";
import { BlockIcon } from "./BlockIcon";

/**
 * <PreviewSchematicChain> — interactive patchbay view, V1 layout in V2
 * editorial skin.
 *
 * Layout:
 *   [Guitar profile card]        ← top-left, pulled out of the chain
 *          │
 *   [icon] ┄┄ [icon] ┄┄ [icon] ┄┄ [icon] ┄┄ [cab icon]
 *   caption    caption    caption    caption    caption
 *
 * Controlled component: parent owns `selectedIndex`. Source / cab tiles
 * are not selectable. Selected tile gets a colored ring matching the
 * block's gear color (green = TS, red = Fuzz Face, etc.).
 */

export function PreviewSchematicChain({
  blocks,
  selectedIndex,
  onSelect,
}: {
  blocks: PreviewBlockData[];
  selectedIndex: number | null;
  onSelect: (i: number) => void;
}) {
  // Guitar profile card sits above the chain row. The chain row itself
  // only renders pedals / amps / cabs — the guitar's spec-sheet lives in
  // the profile card and doesn't need a redundant node tile.
  const sourceBlock = blocks.find((b) => b.variant === "source");
  const chainBlocks = blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.variant !== "source");

  return (
    <div className="chain-board">
      {sourceBlock && <GuitarProfile block={sourceBlock} />}

      <div className="chain-row" role="tablist" aria-label="Signal chain">
        {chainBlocks.map(({ b, i }, idx) => {
          // Pedals, amps, and cabs are selectable; source is a static anchor.
          const isSelectable =
            b.variant === "pedal" ||
            b.variant === "amp" ||
            b.variant === "cab";
          const isSelected = selectedIndex === i;
          return (
            <div
              key={`${b.name}-${i}`}
              style={{ display: "contents" }}
            >
              {idx > 0 && (
                <div className="chain-dash" aria-hidden="true" />
              )}
              <div className="chain-node-wrap">
                {isSelectable ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`chain-node ${
                      b.color ? `node-color-${b.color}` : ""
                    } ${isSelected ? "is-selected" : ""}`}
                    onClick={() => onSelect(i)}
                  >
                    <BlockIcon block={b} />
                    <span className="chain-node-kind">
                      {kindLabel(b)}
                    </span>
                  </button>
                ) : (
                  <div
                    className={`chain-node chain-node-static ${
                      b.color ? `node-color-${b.color}` : ""
                    }`}
                  >
                    <BlockIcon block={b} />
                    <span className="chain-node-kind">
                      {kindLabel(b)}
                    </span>
                  </div>
                )}
                <div className="chain-node-caption">{b.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Top-left profile card for the guitar source block. */
function GuitarProfile({ block }: { block: PreviewBlockData }) {
  // block.sub is "SSS (bridge) · Eb Standard · .013-.058" style
  const parts = (block.sub || "")
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);
  const [pickups, tuning, strings] = [parts[0], parts[1], parts[2]];

  return (
    <div className="chain-guitar">
      <div className="chain-guitar-icon" aria-hidden="true">
        {/* Bigger than other icons because the live-site guitar SVGs
            are tall/narrow silhouettes (viewBox ~75×233) — a 56px
            height fills the 64-square container properly. */}
        <BlockIcon block={block} size={56} />
      </div>
      <div className="chain-guitar-body">
        <div className="chain-guitar-kind">Guitar</div>
        <div className="chain-guitar-name">{block.name}</div>
        {parts.length > 0 && (
          <div className="chain-guitar-specs">
            {pickups && (
              <div>
                <div className="k">Pickups</div>
                <div className="v">{pickups}</div>
              </div>
            )}
            {tuning && (
              <div>
                <div className="k">Tuning</div>
                <div className="v">{tuning}</div>
              </div>
            )}
            {strings && (
              <div>
                <div className="k">Strings</div>
                <div className="v">{strings}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Short label inside the tile — derived from gear name/sub. */
function kindLabel(block: PreviewBlockData): string {
  if (block.variant === "amp") return "Amp";
  if (block.variant === "cab") return "Cab·Mic";
  const hay = `${block.name} ${block.sub}`.toLowerCase();
  if (/comp/.test(hay)) return "Comp";
  if (/volume|vol |pan/.test(hay)) return "Vol/Pan";
  if (/fuzz/.test(hay)) return "Fuzz";
  if (/dist/.test(hay)) return "Dist";
  if (/drive|screamer|808|overdrive|klon|bd-?2|blues|rat/.test(hay)) return "Drive";
  if (/delay|echo/.test(hay)) return "Delay";
  if (/reverb|hall|plate|spring/.test(hay)) return "Verb";
  if (/chorus|flang|phase|trem|vibe/.test(hay)) return "Mod";
  if (/wah|filter/.test(hay)) return "Wah";
  if (/eq|graphic|parametric/.test(hay)) return "EQ";
  if (/pitch|octav|whammy/.test(hay)) return "Pitch";
  return "FX";
}
