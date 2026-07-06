"use client";

import Knob from "@/components/settings/Knob";

/**
 * ChatChainCard — renders Axl's machine-readable chain prescriptions.
 *
 * The tone-chat API instructs the model to emit one fenced ```fk-chain```
 * JSON block whenever it prescribes concrete rig edits. ToneChatClient
 * parses that block out of the stream and hands the JSON here, so "add an
 * EQ after the cab, cut 300 Hz by 2.5 dB" renders as the same visual
 * language the recipe pages use — a schematic chain row plus real knobs —
 * instead of a wall of prose.
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
  drive: "DRV",
  amp: "AMP",
  cab: "CAB",
  eq: "EQ",
  modulation: "MOD",
  delay: "DLY",
  reverb: "REV",
  dynamics: "DYN",
  pitch: "PIT",
  volume: "VOL",
  utility: "UTL",
};

const ACTION_LABEL: Record<string, string> = {
  add: "ADD",
  adjust: "ADJUST",
  remove: "REMOVE",
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
    <div
      className="my-3 border border-[var(--ink,#0A0908)]/25 bg-[var(--paper,#F4F1EA)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--ink,#0A0908)]/15 px-3 py-2">
        <span className="text-[13px] font-semibold text-[var(--ink,#0A0908)]">
          {chain.title ?? "Chain changes"}
        </span>
        {chain.platform && (
          <span
            className="text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted,#6b6257)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {chain.platform.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Schematic chain row */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-3">
        {chain.blocks.map((b, i) => {
          const action = b.action ?? "keep";
          const active = action === "add" || action === "adjust";
          const removed = action === "remove";
          return (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-[var(--ink-muted,#6b6257)]/60 text-[11px]">
                  →
                </span>
              )}
              <div
                className="px-2 py-1 text-center"
                style={{
                  border: `1.5px solid ${
                    active ? "var(--amber-2, #B97700)" : "color-mix(in srgb, var(--ink, #0A0908) 30%, transparent)"
                  }`,
                  background: active ? "color-mix(in srgb, var(--amber, #B97700) 10%, transparent)" : "transparent",
                  opacity: removed ? 0.45 : 1,
                }}
              >
                <div
                  className="text-[8px] uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: active ? "var(--amber-2, #B97700)" : "var(--ink-muted, #6b6257)",
                  }}
                >
                  {ACTION_LABEL[action] ?? CATEGORY_TAG[b.category ?? ""] ?? " "}
                </div>
                <div
                  className="text-[11px] font-medium text-[var(--ink,#0A0908)]"
                  style={{ textDecoration: removed ? "line-through" : "none" }}
                >
                  {b.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail cards for changed blocks */}
      {changed.map((b, i) => (
        <div key={i} className="border-t border-[var(--ink,#0A0908)]/15 px-3 py-3">
          <div className="mb-2 flex items-baseline gap-2">
            <span
              className="text-[9px] uppercase tracking-[0.16em] text-[var(--amber-2,#B97700)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {ACTION_LABEL[b.action ?? "adjust"]}
            </span>
            <span className="text-[13px] font-semibold text-[var(--ink,#0A0908)]">{b.name}</span>
            {b.note && (
              <span className="text-[11px] text-[var(--ink-muted,#6b6257)]">{b.note}</span>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
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
                <div
                  key={name}
                  className="border border-[var(--ink,#0A0908)]/20 bg-white/60 px-2 py-1"
                >
                  <div
                    className="text-[8px] uppercase tracking-[0.14em] text-[var(--ink-muted,#6b6257)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {name}
                  </div>
                  <div className="text-[12px] font-medium text-[var(--ink,#0A0908)]">
                    {displayValue(p)}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
