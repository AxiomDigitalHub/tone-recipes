"use client";

import { useState } from "react";
import type {
  SignalChainNode as NodeType,
  GuitarSpecs,
  PlatformTranslation,
  PlatformBlock,
  Platform,
} from "@/types/recipe";
import { PLATFORMS } from "@/lib/constants";
import { getChainIcon, getChainIconLabel } from "@/lib/chain-icons";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import { getChainTip } from "@/lib/chain-tips";

interface UnifiedChainViewProps {
  guitarSpecs: GuitarSpecs;
  signalChain: NodeType[];
  platformTranslations: Partial<Record<Platform, PlatformTranslation>>;
}

/* ------------------------------------------------------------------ */
/*  Platform block rendered as a node (matching physical chain style)  */
/* ------------------------------------------------------------------ */

function PlatformBlockNode({
  block,
  platformColor,
}: {
  block: PlatformBlock;
  platformColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getChainIcon(block.block_category);
  const label = getChainIconLabel(block.block_category);
  const settingEntries = Object.entries(block.settings);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setExpanded(!expanded)}
        className="node-glow group flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover"
        style={{ borderColor: platformColor + "80" }}
      >
        <Icon
          className="h-6 w-6"
          style={{ color: platformColor }}
          strokeWidth={1.5}
        />
        <span className="mt-1 text-[10px] font-medium uppercase text-muted">
          {label}
        </span>
      </button>

      {/* Block name */}
      <p
        className="mt-2 max-w-[110px] text-center text-[11px] font-semibold leading-tight"
        style={{ color: platformColor }}
      >
        {block.block_name}
      </p>
      <p className="max-w-[110px] text-center text-[10px] leading-tight text-muted">
        ← {block.original_gear}
      </p>

      {/* Expanded settings panel */}
      {expanded && (
        <div className="mt-3 w-full rounded-lg border border-border bg-surface p-4 shadow-lg md:w-64">
          <h4
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: platformColor }}
          >
            Settings
          </h4>
          {settingEntries.length > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {settingEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center rounded-md bg-background p-2"
                >
                  <span className="text-lg font-mono font-bold text-foreground">
                    {value}
                  </span>
                  <span className="text-[10px] text-muted">{key}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">Default settings</p>
          )}
          {block.notes && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs leading-relaxed text-muted">
                {block.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main unified chain view                                            */
/* ------------------------------------------------------------------ */

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
        /* ---- Platform translation — same node layout as physical ---- */
        <div>
          <p className="px-6 pt-5 text-xs text-muted md:px-8">
            Click any node to see settings · Mapped from physical gear
          </p>
          <div className="w-full md:overflow-x-auto">
            <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
              {activeTranslation.chain_blocks.map((block, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center md:flex-row md:items-start"
                >
                  <PlatformBlockNode
                    block={block}
                    platformColor={activePlatformMeta?.color || "#f59e0b"}
                  />
                  {i < activeTranslation.chain_blocks.length - 1 && (
                    <div className="flex flex-col items-center gap-1 md:mt-8 md:flex-row">
                      <div
                        className="h-3 w-0.5 rounded-full md:h-0.5 md:w-6"
                        style={{
                          backgroundColor:
                            (activePlatformMeta?.color || "#f59e0b") + "60",
                        }}
                      />
                      <div
                        className="h-3 w-0.5 rounded-full md:h-0.5 md:w-6"
                        style={{
                          backgroundColor:
                            (activePlatformMeta?.color || "#f59e0b") + "60",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Platform notes */}
          {activeTranslation.notes && (
            <div className="mx-6 mb-6 rounded-lg bg-background p-4 md:mx-8">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: activePlatformMeta?.color }}
              >
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
