"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  SignalChainNode as NodeType,
  GuitarSpecs,
  PlatformTranslation,
  PlatformBlock,
  Platform,
} from "@/types/recipe";
import { PLATFORMS } from "@/lib/constants";
import { getChainIcon, getChainIconLabel } from "@/lib/chain-icons";
import { Guitar } from "lucide-react";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import { getChainTip } from "@/lib/chain-tips";

interface UnifiedChainViewProps {
  guitarSpecs: GuitarSpecs;
  signalChain: NodeType[];
  platformTranslations: Partial<Record<Platform, PlatformTranslation>>;
}

/* ------------------------------------------------------------------ */
/*  Detail drawer — shared panel below chain for selected node         */
/* ------------------------------------------------------------------ */

function NodeDetailDrawer({
  node,
  platformBlock,
  platformColor,
  onClose,
}: {
  node?: NodeType;
  platformBlock?: PlatformBlock;
  platformColor?: string;
  onClose: () => void;
}) {
  if (!node && !platformBlock) return null;

  const color = platformColor || node?.icon_color || "#f59e0b";
  const name = node?.gear_name || platformBlock?.block_name || "";
  const settings = node?.settings || platformBlock?.settings || {};
  const settingEntries = Object.entries(settings);
  const notes = node?.notes || platformBlock?.notes || "";
  const Icon = node
    ? getChainIcon(node.category, node.subcategory)
    : platformBlock
      ? getChainIcon(platformBlock.block_category)
      : Guitar;

  return (
    <div className="border-t border-border bg-background/50 p-4 md:p-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
            style={{ borderColor: color + "60" }}
          >
            <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            {node && (
              <p className="text-[11px] uppercase tracking-wider text-muted">
                {node.category}
                {node.subcategory ? ` / ${node.subcategory}` : ""}
                {node.is_in_effects_loop ? " · FX Loop" : ""}
              </p>
            )}
            {platformBlock && (
              <p className="text-[11px] text-muted">
                ← {platformBlock.original_gear}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Settings grid */}
      {settingEntries.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {settingEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-lg bg-surface p-2.5"
            >
              <span className="text-lg font-mono font-bold text-foreground">
                {value}
              </span>
              <span className="mt-0.5 text-[10px] text-muted">{key}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted">No adjustable settings</p>
      )}

      {/* Notes */}
      {notes && (
        <p className="mt-3 text-xs leading-relaxed text-muted">{notes}</p>
      )}

      {/* Gear link */}
      {node?.gear_slug && (
        <Link
          href={`/gear/${node.gear_slug}`}
          className="mt-3 inline-flex items-center text-xs text-accent hover:underline"
        >
          View gear details →
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guitar header bar                                                  */
/* ------------------------------------------------------------------ */

function GuitarHeader({ specs }: { specs: GuitarSpecs }) {
  return (
    <div className="border-b border-border px-4 py-5 md:px-6">
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Guitar icon — matches album art / artist thumbnail height */}
        <div className="flex h-16 w-16 sm:h-[120px] sm:w-[120px] shrink-0 items-center justify-center rounded-xl border-2 border-accent/50 bg-surface">
          <Guitar className="h-8 w-8 sm:h-12 sm:w-12 text-accent" strokeWidth={1.25} />
        </div>
        {/* Specs */}
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="text-xs text-muted">Guitar</p>
            <p className="text-lg font-semibold text-foreground">
              {specs.model_name}
            </p>
          </div>
          <div className="flex flex-col gap-y-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <div>
              <p className="text-xs text-muted">Pickups</p>
              <p className="text-sm font-medium text-foreground">
                {specs.pickup_config} ({specs.pickup_position})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Tuning</p>
              <p className="text-sm font-medium text-foreground">
                {specs.tuning}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Strings</p>
              <p className="text-sm font-medium text-foreground">
                {specs.string_gauge}
              </p>
            </div>
            {specs.notable_mods && (
              <div className="hidden sm:block">
                <p className="text-xs text-muted">Mods</p>
                <p className="text-sm font-medium text-foreground">
                  {specs.notable_mods}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cable connector */}
      <div className="ml-6 mt-2 flex items-center gap-1">
        <div className="h-4 w-0.5 rounded-full bg-accent/40" />
        <svg
          className="h-4 w-4 text-accent/40"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 0 L8 6 L12 10 L12 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Platform block node (for non-physical tabs)                        */
/* ------------------------------------------------------------------ */

function PlatformBlockNode({
  block,
  platformColor,
  isSelected,
  onSelect,
}: {
  block: PlatformBlock;
  platformColor: string;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const Icon = getChainIcon(block.block_category);
  const label = getChainIconLabel(block.block_category);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onSelect}
        className={`node-glow group flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover ${
          isSelected ? "ring-2 ring-offset-2 ring-offset-background" : ""
        }`}
        style={{
          borderColor: isSelected ? platformColor : platformColor + "80",
        }}
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

      <p
        className="mt-2 max-w-[110px] text-center text-[11px] font-semibold leading-tight"
        style={{ color: platformColor }}
      >
        {block.block_name}
      </p>
      <p className="max-w-[110px] text-center text-[10px] leading-tight text-muted">
        ← {block.original_gear}
      </p>
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
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  // Physical chain: tip between guitar and first node
  const firstNode = signalChain[0];
  const guitarToFirstTip = firstNode
    ? getChainTip("guitar", firstNode.category, null, firstNode.subcategory)
    : null;

  const activePlatformMeta = PLATFORMS.find((p) => p.id === activeTab);
  const activeTranslation =
    activeTab !== "physical" ? platformTranslations[activeTab] : null;

  // Reset selection when switching tabs
  function handleTabSwitch(tab: "physical" | Platform) {
    setActiveTab(tab);
    setSelectedNodeIndex(null);
  }

  // Selected node data for detail drawer
  const selectedPhysicalNode =
    activeTab === "physical" && selectedNodeIndex !== null
      ? signalChain[selectedNodeIndex]
      : undefined;
  const selectedPlatformBlock =
    activeTab !== "physical" &&
    selectedNodeIndex !== null &&
    activeTranslation
      ? activeTranslation.chain_blocks[selectedNodeIndex]
      : undefined;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Guitar header bar */}
      <GuitarHeader specs={guitarSpecs} />

      {/* Platform tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border p-2 scrollbar-hide">
        <button
          onClick={() => handleTabSwitch("physical")}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "physical"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          Physical
        </button>
        {availablePlatforms.map((pid) => {
          const meta = PLATFORMS.find((p) => p.id === pid);
          const isActive = activeTab === pid;
          return (
            <button
              key={pid}
              onClick={() => handleTabSwitch(pid)}
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

      {/* Chain area */}
      {activeTab === "physical" ? (
        <div className="w-full md:overflow-x-auto">
          <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
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
                  <SignalChainNode
                    node={node}
                    isSelected={selectedNodeIndex === i}
                    onSelect={() =>
                      setSelectedNodeIndex(
                        selectedNodeIndex === i ? null : i
                      )
                    }
                  />
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
      ) : activeTranslation ? (
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
                  isSelected={selectedNodeIndex === i}
                  onSelect={() =>
                    setSelectedNodeIndex(
                      selectedNodeIndex === i ? null : i
                    )
                  }
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

          {/* Platform notes (when no node selected) */}
          {activeTranslation.notes && selectedNodeIndex === null && (
            <div className="mx-4 mb-4 rounded-lg bg-background p-4 md:mx-6">
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

      {/* Shared detail drawer */}
      <NodeDetailDrawer
        node={selectedPhysicalNode}
        platformBlock={selectedPlatformBlock}
        platformColor={activePlatformMeta?.color}
        onClose={() => setSelectedNodeIndex(null)}
      />
    </div>
  );
}
