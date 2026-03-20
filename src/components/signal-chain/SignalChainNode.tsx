"use client";

import { useState } from "react";
import Link from "next/link";
import type { SignalChainNode as NodeType, GuitarSpecs } from "@/types/recipe";

interface SignalChainNodeProps {
  node?: NodeType;
  guitarSpecs?: GuitarSpecs;
}

export default function SignalChainNode({ node, guitarSpecs }: SignalChainNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryLabel: Record<string, string> = {
    effect: "Effect",
    preamp: "Amp",
    wet_effect: "Effect",
    power_amp: "Power",
    cabinet: "Cabinet",
    microphone: "Mic",
    guitar: "Guitar",
  };

  // Guitar node mode
  if (guitarSpecs) {
    const guitarSettings: Record<string, string> = {
      Pickups: `${guitarSpecs.pickup_config} (${guitarSpecs.pickup_position})`,
      Tuning: guitarSpecs.tuning_custom || guitarSpecs.tuning,
      Strings: guitarSpecs.string_gauge,
      Scale: `${guitarSpecs.scale_length}"`,
      Body: guitarSpecs.body_type.replace("_", "-"),
    };

    return (
      <div className="flex flex-col items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="node-glow group flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-accent/50 bg-surface transition-all hover:bg-surface-hover"
        >
          <span className="text-[10px] font-medium uppercase text-muted">Guitar</span>
          <div className="mt-0.5 h-6 w-6 rounded bg-accent/20" />
        </button>

        <p className="mt-2 max-w-[100px] text-center text-[11px] font-medium leading-tight text-foreground">
          {guitarSpecs.model_name}
        </p>

        {expanded && (
          <div className="mt-3 w-full rounded-lg border border-border bg-surface p-4 shadow-lg md:w-64">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Guitar Specs
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(guitarSettings).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center rounded-md bg-background p-2">
                  <span className="text-sm font-mono font-bold text-foreground">
                    {value}
                  </span>
                  <span className="text-[10px] text-muted">{key}</span>
                </div>
              ))}
            </div>
            {guitarSpecs.notable_mods && (
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs leading-relaxed text-muted">{guitarSpecs.notable_mods}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Standard chain node mode
  if (!node) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Node icon */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="node-glow group flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover"
        style={{ borderColor: node.icon_color + "80" }}
      >
        <span className="text-[10px] font-medium uppercase text-muted">
          {node.subcategory || categoryLabel[node.category] || node.category}
        </span>
        <div
          className="mt-0.5 h-6 w-6 rounded"
          style={{ backgroundColor: node.icon_color + "40" }}
        />
      </button>

      {/* Gear name */}
      <p className="mt-2 max-w-[100px] text-center text-[11px] font-medium leading-tight text-foreground">
        {node.gear_name}
      </p>

      {/* Expanded settings panel */}
      {expanded && (
        <div className="mt-3 w-full rounded-lg border border-border bg-surface p-4 shadow-lg md:w-64">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Settings
          </h4>
          {Object.keys(node.settings).length > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(node.settings).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center rounded-md bg-background p-2">
                  <span className="text-lg font-mono font-bold text-foreground">
                    {value}
                  </span>
                  <span className="text-[10px] text-muted">{key}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">No adjustable settings</p>
          )}

          {node.notes && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs leading-relaxed text-muted">{node.notes}</p>
            </div>
          )}

          {node.is_in_effects_loop && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                Effects Loop
              </span>
            </div>
          )}

          {node.gear_slug && (
            <Link href={`/gear/${node.gear_slug}`} className="mt-3 inline-flex items-center text-xs text-accent hover:underline">
              View gear details →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
