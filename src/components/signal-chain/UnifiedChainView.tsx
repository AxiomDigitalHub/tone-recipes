"use client";

import { useState } from "react";
import type {
  SignalChainNode as NodeType,
  GuitarSpecs,
  PlatformTranslation,
  Platform,
} from "@/types/recipe";
import { PLATFORMS } from "@/lib/constants";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import { getChainTip } from "@/lib/chain-tips";

interface UnifiedChainViewProps {
  guitarSpecs: GuitarSpecs;
  signalChain: NodeType[];
  platformTranslations: Partial<Record<Platform, PlatformTranslation>>;
}

export default function UnifiedChainView({
  guitarSpecs,
  signalChain,
  platformTranslations,
}: UnifiedChainViewProps) {
  const availablePlatforms = Object.keys(platformTranslations) as Platform[];
  const [activeTab, setActiveTab] = useState<"physical" | Platform>("physical");

  // Physical chain: tip between guitar and first node
  const firstNode = signalChain[0];
  const guitarToFirstTip = firstNode
    ? getChainTip("guitar", firstNode.category, null, firstNode.subcategory)
    : null;

  const activePlatformMeta = PLATFORMS.find((p) => p.id === activeTab);
  const activeTranslation =
    activeTab !== "physical" ? platformTranslations[activeTab] : null;

  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Platform tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border p-2 scrollbar-hide">
        {/* Physical tab */}
        <button
          onClick={() => setActiveTab("physical")}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "physical"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          Physical
        </button>

        {/* Platform tabs */}
        {availablePlatforms.map((pid) => {
          const meta = PLATFORMS.find((p) => p.id === pid);
          const isActive = activeTab === pid;
          return (
            <button
              key={pid}
              onClick={() => setActiveTab(pid)}
              className={`shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
              style={isActive ? { backgroundColor: meta?.color + "18" } : {}}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: meta?.color }}
              />
              {meta?.label || pid}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      {activeTab === "physical" ? (
        /* ---- Physical signal chain ---- */
        <div>
          <p className="px-6 pt-5 text-xs text-muted md:px-8">
            Click any node to see settings and tips
          </p>
          <div className="w-full md:overflow-x-auto">
            <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
              {/* Guitar node */}
              <SignalChainNode guitarSpecs={guitarSpecs} />

              {/* Signal flow line + tooltip between guitar and first node */}
              <div className="flex flex-col items-center gap-1 md:mt-8 md:flex-row">
                <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
                {guitarToFirstTip && <ChainTooltip tip={guitarToFirstTip} />}
                <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
              </div>

              {/* Chain nodes */}
              {signalChain.map((node, i) => {
                const nextNode = signalChain[i + 1];
                const tip = nextNode
                  ? getChainTip(
                      node.category,
                      nextNode.category,
                      node.subcategory,
                      nextNode.subcategory
                    )
                  : null;

                return (
                  <div
                    key={node.position}
                    className="flex flex-col items-center md:flex-row md:items-start"
                  >
                    <SignalChainNode node={node} />
                    {i < signalChain.length - 1 && (
                      <div className="flex flex-col items-center gap-1 md:mt-8 md:flex-row">
                        <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
                        {tip && <ChainTooltip tip={tip} />}
                        <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeTranslation ? (
        /* ---- Platform translation chain ---- */
        <div className="p-6 md:p-8">
          {/* Chain blocks — vertical on mobile, horizontal on desktop */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            {activeTranslation.chain_blocks.map((block, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 md:flex-row"
              >
                <div
                  className="w-full rounded-lg border p-4 md:w-auto"
                  style={{ borderColor: activePlatformMeta?.color + "40" }}
                >
                  <p className="text-xs uppercase tracking-wider text-muted">
                    {block.block_category}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: activePlatformMeta?.color }}
                  >
                    {block.block_name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    ← {block.original_gear}
                  </p>
                  {Object.keys(block.settings).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {Object.entries(block.settings).map(([key, value]) => (
                        <span
                          key={key}
                          className="rounded bg-background px-2 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  {block.notes && (
                    <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-muted/70">
                      {block.notes}
                    </p>
                  )}
                </div>
                {/* Connector line */}
                {i < activeTranslation.chain_blocks.length - 1 && (
                  <div
                    className="h-3 w-0.5 rounded-full md:h-0.5 md:w-6"
                    style={{
                      backgroundColor: activePlatformMeta?.color + "40",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Platform notes */}
          {activeTranslation.notes && (
            <div className="mt-6 rounded-lg bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Tips
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {activeTranslation.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-muted">
          Translation not available for this platform.
        </div>
      )}
    </div>
  );
}
