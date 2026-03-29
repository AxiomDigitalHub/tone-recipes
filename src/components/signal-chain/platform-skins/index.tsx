"use client";

import type { ComponentType } from "react";

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export interface PlatformBlockSkinProps {
  block: {
    block_name: string;
    block_category: string;
    original_gear: string;
    settings: Record<string, string | number>;
    notes?: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  platformColor: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function entries(settings: Record<string, string | number>) {
  return Object.entries(settings);
}

/** Clamp a numeric value to 0-100 for bar/knob visuals. */
function normalizeValue(v: string | number): number {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (isNaN(n)) return 50;
  if (n > 100) return 100;
  if (n < 0) return 0;
  return n;
}

/* ------------------------------------------------------------------ */
/*  1. Helix — dark scribble-strip with red footer                     */
/* ------------------------------------------------------------------ */

export function HelixBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#cc0000";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-44 flex-col overflow-hidden rounded-lg border-2 text-left transition-all duration-150 hover:shadow-lg ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: isSelected ? color : color + "60",
        boxShadow: isSelected ? `0 0 16px ${color}30` : undefined,
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Block name — scribble strip */}
      <div className="px-3 pt-3 pb-1">
        <p className="truncate text-sm font-bold text-white">{block.block_name}</p>
        <p className="truncate text-[10px] text-zinc-500">
          {block.original_gear}
        </p>
      </div>

      {/* Settings rows */}
      {pairs.length > 0 && (
        <div className="flex flex-col gap-px px-3 pb-2">
          {pairs.slice(0, 6).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="truncate text-[10px] uppercase tracking-wide text-zinc-500">
                {key}
              </span>
              <span className="shrink-0 text-[11px] font-medium text-zinc-300">
                {value}
              </span>
            </div>
          ))}
          {pairs.length > 6 && (
            <span className="text-[10px] text-zinc-600">
              +{pairs.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Red footer — category label */}
      <div
        className="mt-auto px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-white"
        style={{ backgroundColor: color }}
      >
        {block.block_category}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Quad Cortex — clean, modern touchscreen aesthetic               */
/* ------------------------------------------------------------------ */

export function QuadCortexBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#00b4d8";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-48 flex-col overflow-hidden rounded-2xl border text-left transition-all duration-150 hover:shadow-xl ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#f8fafc",
        borderColor: isSelected ? color : "#e2e8f0",
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="truncate text-sm font-bold" style={{ color: "#0f172a" }}>
          {block.block_name}
        </p>
        <span
          className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: color }}
        >
          {block.block_category}
        </span>
      </div>

      {/* Parameter bars */}
      {pairs.length > 0 && (
        <div className="flex flex-col gap-1.5 px-4 pb-3">
          {pairs.slice(0, 5).map(([key, value]) => {
            const pct = normalizeValue(value);
            return (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500">
                    {key}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700">
                    {value}
                  </span>
                </div>
                <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color + "cc" }}
                  />
                </div>
              </div>
            );
          })}
          {pairs.length > 5 && (
            <span className="text-[10px] text-slate-400">
              +{pairs.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Original gear reference */}
      <div className="mt-auto border-t px-4 py-2" style={{ borderColor: "#e2e8f0" }}>
        <p className="truncate text-[10px] text-slate-400">
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  3. TONEX — dark with orange gradient accents                       */
/* ------------------------------------------------------------------ */

export function TonexBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#ff6b00";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-44 flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-150 ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#18181b",
        borderColor: isSelected ? color : color + "40",
        borderBottomWidth: "3px",
        borderBottomColor: color,
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Block name with orange glow */}
      <div className="px-3 pt-3 pb-1">
        <p
          className="truncate text-sm font-bold"
          style={{
            color,
            textShadow: `0 0 12px ${color}50`,
          }}
        >
          {block.block_name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-zinc-500">
          {block.block_category}
        </p>
      </div>

      {/* Settings in compact grid */}
      {pairs.length > 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 pb-2">
          {pairs.slice(0, 6).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="truncate text-[9px] uppercase tracking-wide text-zinc-600">
                {key}
              </span>
              <span className="text-[11px] font-semibold text-zinc-300">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
      {pairs.length > 6 && (
        <p className="px-3 pb-1 text-[10px] text-zinc-600">
          +{pairs.length - 6} more
        </p>
      )}

      {/* Original gear */}
      <div className="mt-auto px-3 py-2">
        <p className="truncate text-[10px] text-zinc-600">
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Fractal — matrix green LCD aesthetic                            */
/* ------------------------------------------------------------------ */

export function FractalBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#10b981";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-48 flex-col overflow-hidden rounded border-2 text-left font-mono transition-all duration-150 ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#0c0c0c",
        borderColor: isSelected ? color : color + "50",
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{ borderColor: color + "30" }}
      >
        <p className="truncate text-xs font-bold" style={{ color }}>
          {block.block_name}
        </p>
        <span className="shrink-0 text-[9px] uppercase" style={{ color: color + "80" }}>
          {block.block_category}
        </span>
      </div>

      {/* Params grid — LCD feel */}
      {pairs.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2">
          {pairs.slice(0, 8).map(([key, value]) => (
            <div key={key} className="flex items-baseline justify-between gap-1">
              <span className="truncate text-[10px] uppercase" style={{ color: color + "60" }}>
                {key}
              </span>
              <span className="shrink-0 text-[11px] font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
      {pairs.length > 8 && (
        <p className="px-3 pb-1 text-[10px]" style={{ color: color + "40" }}>
          +{pairs.length - 8} more
        </p>
      )}

      {/* Original gear */}
      <div
        className="mt-auto border-t px-3 py-1.5"
        style={{ borderColor: color + "20" }}
      >
        <p className="truncate text-[10px]" style={{ color: color + "50" }}>
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Kemper — purple with knob indicators                            */
/* ------------------------------------------------------------------ */

export function KemperBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#8b5cf6";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-48 flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-150 ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#1e1033",
        borderColor: isSelected ? color : color + "40",
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Block name with purple underline */}
      <div className="px-4 pt-4 pb-2">
        <p className="truncate text-sm font-bold text-white">
          {block.block_name}
        </p>
        <div
          className="mt-1 h-0.5 w-12 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="mt-1 truncate text-[10px]" style={{ color: color + "80" }}>
          {block.block_category}
        </p>
      </div>

      {/* Knob indicators — small circles with value */}
      {pairs.length > 0 && (
        <div className="flex flex-wrap gap-3 px-4 pb-3">
          {pairs.slice(0, 6).map(([key, value]) => {
            const pct = normalizeValue(value);
            // Rotation from -135 to 135 degrees
            const rotation = -135 + (pct / 100) * 270;
            return (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: color + "60",
                    backgroundColor: color + "15",
                  }}
                >
                  {/* Knob indicator line */}
                  <div
                    className="absolute h-2.5 w-0.5 rounded-full"
                    style={{
                      backgroundColor: color,
                      top: "3px",
                      transformOrigin: "center 10.5px",
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                </div>
                <span className="mt-0.5 text-[10px] font-bold text-white">
                  {value}
                </span>
                <span className="text-[8px] uppercase tracking-wide" style={{ color: color + "80" }}>
                  {key}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {pairs.length > 6 && (
        <p className="px-4 pb-1 text-[10px]" style={{ color: color + "50" }}>
          +{pairs.length - 6} more
        </p>
      )}

      {/* Original gear */}
      <div
        className="mt-auto border-t px-4 py-2"
        style={{ borderColor: color + "20" }}
      >
        <p className="truncate text-[10px]" style={{ color: color + "50" }}>
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Katana — Boss red, angular, utilitarian                         */
/* ------------------------------------------------------------------ */

export function KatanaBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#e11d48";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group flex w-44 flex-row overflow-hidden rounded border-2 text-left transition-all duration-150 ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#111111",
        borderColor: isSelected ? color : "#333",
        "--tw-ring-color": color,
      } as React.CSSProperties}
    >
      {/* Red accent stripe */}
      <div className="w-1.5 shrink-0" style={{ backgroundColor: color }} />

      {/* Content */}
      <div className="flex flex-1 flex-col py-2 pl-3 pr-3">
        {/* Block name */}
        <p className="truncate text-xs font-bold text-white">
          {block.block_name}
        </p>
        <p className="truncate text-[9px] font-semibold uppercase tracking-wider" style={{ color }}>
          {block.block_category}
        </p>

        {/* 2-column settings panel */}
        {pairs.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
            {pairs.slice(0, 6).map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-1">
                <span className="truncate text-[9px] uppercase text-zinc-500">
                  {key}
                </span>
                <span className="shrink-0 text-[10px] font-bold text-zinc-300">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
        {pairs.length > 6 && (
          <p className="mt-1 text-[10px] text-zinc-600">
            +{pairs.length - 6} more
          </p>
        )}

        {/* Original gear */}
        <p className="mt-2 truncate text-[10px] text-zinc-600">
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Physical — warm amber/zinc, tactile pedal enclosure             */
/* ------------------------------------------------------------------ */

export function PhysicalBlockSkin({
  block,
  isSelected,
  onSelect,
  platformColor,
}: PlatformBlockSkinProps) {
  const color = platformColor || "#a1a1aa";
  const pairs = entries(block.settings);

  return (
    <button
      onClick={onSelect}
      aria-label={`${block.block_name} — ${block.block_category}`}
      aria-pressed={!!isSelected}
      className={`group relative flex w-44 flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-150 ${
        isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-[1.03]" : ""
      }`}
      style={{
        backgroundColor: "#292524",
        borderColor: isSelected ? "#f59e0b" : "#57534e",
        "--tw-ring-color": "#f59e0b",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.3)",
      } as React.CSSProperties}
    >
      {/* Corner screws */}
      <div
        className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "#78716c", boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4)" }}
      />
      <div
        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "#78716c", boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4)" }}
      />
      <div
        className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "#78716c", boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4)" }}
      />
      <div
        className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "#78716c", boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4)" }}
      />

      {/* Block name — engraved label look */}
      <div className="px-4 pt-4 pb-1">
        <p
          className="truncate text-sm font-bold"
          style={{ color: "#f59e0b" }}
        >
          {block.block_name}
        </p>
        <p className="truncate text-[10px] text-stone-500">
          {block.block_category}
        </p>
      </div>

      {/* Knob dials */}
      {pairs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2.5 px-3 pb-3">
          {pairs.slice(0, 5).map(([key, value]) => {
            const pct = normalizeValue(value);
            const rotation = -135 + (pct / 100) * 270;
            return (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="relative flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#1c1917",
                    boxShadow:
                      "inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Outer ring */}
                  <div
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: "#44403c" }}
                  />
                  {/* Indicator notch */}
                  <div
                    className="absolute h-3 w-0.5 rounded-full"
                    style={{
                      backgroundColor: "#f59e0b",
                      top: "3px",
                      transformOrigin: "center 12px",
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                </div>
                <span className="mt-0.5 text-[10px] font-bold text-stone-300">
                  {value}
                </span>
                <span className="text-[8px] uppercase tracking-wide text-stone-500">
                  {key}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {pairs.length > 5 && (
        <p className="px-3 pb-1 text-center text-[10px] text-stone-600">
          +{pairs.length - 5} more
        </p>
      )}

      {/* Original gear */}
      <div
        className="mt-auto border-t px-3 py-2"
        style={{ borderColor: "#44403c" }}
      >
        <p className="truncate text-[10px] text-stone-500">
          {block.original_gear}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Skin registry + lookup                                             */
/* ------------------------------------------------------------------ */

const SKIN_MAP: Record<string, ComponentType<PlatformBlockSkinProps>> = {
  helix: HelixBlockSkin,
  quad_cortex: QuadCortexBlockSkin,
  tonex: TonexBlockSkin,
  fractal: FractalBlockSkin,
  kemper: KemperBlockSkin,
  katana: KatanaBlockSkin,
  physical: PhysicalBlockSkin,
};

/**
 * Returns the platform-specific block skin component for the given platform ID.
 * Falls back to PhysicalBlockSkin for unknown platforms.
 */
export function getPlatformSkin(
  platformId: string,
): ComponentType<PlatformBlockSkinProps> {
  return SKIN_MAP[platformId] ?? PhysicalBlockSkin;
}
