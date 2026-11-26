"use client";

import Knob from "@/components/settings/Knob";

/**
 * ChatChainCard — renders Axl's machine-readable chain prescriptions.
 *
 * The tone-chat API instructs the model to emit one fenced ```fk-chain```
 * JSON block whenever it prescribes concrete rig edits. ToneChatClient
 * parses that block out of the stream and hands the JSON here, so "add an
 * EQ after the cab, cut 300 Hz by 2.5 dB" renders as the same visual
 * language the recipe pages use (a chain row plus real knobs) instead of a
 * wall of prose.
 *
 * Renders nothing (returns null) on malformed data: the prose answer
 * always stands on its own, the card is progressive enhancement.
 */

interface ChainParamObj {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  neutral?: number;
  display?: string;
}
type ChainParam = ChainParamObj | string | number;

interface ChainBlock {
  name: string;
  category?: string;
  action?: "add" | "adjust" | "keep" | "remove";
  note?: string;
  params?: Record<string, ChainParam>;
}

export interface FkChain {
  title?: string;
  platform?: string;
  blocks: ChainBlock[];
}

const CATEGORY_TAG: Record<string, string> = {
  drive: "Drive",
  amp: "Amp",
  cab: "Cab",
  eq: "EQ",
  modulation: "Mod",
  delay: "Delay",
  reverb: "Reverb",
  dynamics: "Dynamics",
  pitch: "Pitch",
  volume: "Volume",
  utility: "Utility",
};

const ACTION_LABEL: Record<string, string> = {
  add: "Add",
  adjust: "Adjust",
  remove: "Remove",
};

export function parseFkChain(raw: string): FkChain | null {
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.blocks) || data.blocks.length === 0) return null;
    if (!data.blocks.every((b: unknown) => b && typeof (b as ChainBlock).name === "string")) return null;
    return data as FkChain;
  } catch {
    return null;
  }
}

function isKnobbable(p: ChainParam): p is ChainParamObj {
  return (
    typeof p === "object" &&
    p !== null &&
    typeof p.value === "number" &&
    typeof p.min === "number" &&
    typeof p.max === "number" &&
    p.max > p.min
  );
}

function displayValue(p: ChainParam): string {
  if (typeof p === "string") return p;
  if (typeof p === "number") return String(p);
  return p.display ?? `${p.value}${p.unit ? ` ${p.unit}` : ""}`;
}

export default function ChatChainCard({ chain }: { chain: FkChain }) {
  const changed = chain.blocks.filter(
    (b) => b.action !== "keep" && b.params && Object.keys(b.params).length > 0,
  );

  return (
    <div className="fk-cc">
      {/* Header */}
      <div className="fk-cc-head">
        <span className="fk-cc-title">{chain.title ?? "Chain changes"}</span>
        {chain.platform && (
          <span className="fk-cc-platform">{chain.platform.replace("_", " ")}</span>
        )}
      </div>

      {/* Chain row */}
      <div className="fk-cc-row">
        {chain.blocks.map((b, i) => {
          const action = b.action ?? "keep";
          const active = action === "add" || action === "adjust";
          const removed = action === "remove";
          return (
            <div key={i} className="fk-cc-step">
              {i > 0 && (
                <span aria-hidden className="fk-cc-arrow">
                  →
                </span>
              )}
              <div
                className={`fk-cc-block${active ? " is-active" : ""}${removed ? " is-removed" : ""}`}
              >
                <div className="fk-cc-block-tag">
                  {ACTION_LABEL[action] ?? CATEGORY_TAG[b.category ?? ""] ?? " "}
                </div>
                <div className="fk-cc-block-name">{b.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail rows for changed blocks */}
      {changed.map((b, i) => (
        <div key={i} className="fk-cc-detail">
          <div className="fk-cc-detail-head">
            <span className="fk-cc-detail-action">
              {ACTION_LABEL[b.action ?? "adjust"]}
            </span>
            <span className="fk-cc-detail-name">{b.name}</span>
            {b.note && <span className="fk-cc-detail-note">{b.note}</span>}
          </div>
          <div className="fk-cc-params">
            {Object.entries(b.params ?? {}).map(([name, p]) =>
              isKnobbable(p) ? (
                <Knob
                  key={name}
                  name={name}
                  value={p.value}
                  min={p.min}
                  max={p.max}
                  unit={p.unit}
                  neutral={p.neutral}
                  display={p.display}
                  size="sm"
                />
              ) : (
                <div key={name} className="fk-cc-param">
                  <div className="fk-cc-param-name">{name}</div>
                  <div className="fk-cc-param-value">{displayValue(p)}</div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
