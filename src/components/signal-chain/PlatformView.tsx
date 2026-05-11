"use client";

import { useState } from "react";
import type { PlatformTranslation, Platform } from "@/types/recipe";
import { PLATFORMS } from "@/lib/constants";

interface PlatformViewProps {
  translations: Partial<Record<Platform, PlatformTranslation>>;
}

export default function PlatformView({ translations }: PlatformViewProps) {
  const availablePlatforms = Object.keys(translations) as Platform[];
  const [active, setActive] = useState<Platform>(availablePlatforms[0] || "helix");

  const currentTranslation = translations[active];
  const platformMeta = PLATFORMS.find((p) => p.id === active);

  if (availablePlatforms.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)] p-6 text-center text-sm text-[var(--ink-muted)]">
        Platform translations coming soon.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)]">
      {/* Platform tabs */}
      <div className="flex gap-1 border-b border-[var(--ink)]/15 p-2">
        {availablePlatforms.map((pid) => {
          const meta = PLATFORMS.find((p) => p.id === pid);
          return (
            <button
              key={pid}
              onClick={() => setActive(pid)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active === pid
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
              style={active === pid ? { backgroundColor: meta?.color + "20" } : {}}
            >
              {meta?.label || pid}
            </button>
          );
        })}
      </div>

      {/* Platform chain blocks */}
      {currentTranslation && (
        <div className="p-6">
          {/* Horizontal block layout */}
          <div className="flex flex-wrap items-center gap-3">
            {currentTranslation.chain_blocks.map((block, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="rounded-lg border p-4"
                  style={{ borderColor: platformMeta?.color + "40" }}
                >
                  <p className="text-xs text-[var(--ink-muted)]">{block.block_category}</p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: platformMeta?.color }}
                  >
                    {block.block_name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--ink-muted)]">
                    ({block.original_gear})
                  </p>
                  {Object.keys(block.settings).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(block.settings).map(([key, value]) => (
                        <span
                          key={key}
                          className="rounded bg-[var(--paper)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-muted)]"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  {block.notes && (
                    <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-[var(--ink-muted)]">
                      {block.notes}
                    </p>
                  )}
                </div>
                {i < currentTranslation.chain_blocks.length - 1 && (
                  <div
                    className="h-0.5 w-4 rounded-full"
                    style={{ backgroundColor: platformMeta?.color + "40" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Platform notes */}
          {currentTranslation.notes && (
            <div className="mt-6 rounded-lg bg-[var(--paper)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--amber-2)]">
                Tips
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                {currentTranslation.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
