"use client";

import { useState, useEffect } from "react";
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
import { Guitar, Maximize2, Minimize2, Lock } from "lucide-react";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import DownloadPatchButton from "./DownloadPatchButton";
import CommunitySubmissions from "./CommunitySubmissions";
import { getChainTip } from "@/lib/chain-tips";
import { usePlatformStore } from "@/lib/stores/platform-store";
import { useAuth } from "@/lib/auth/auth-context";
import { canViewAllPlatforms, canDownloadPresets, FREE_PLATFORM_LIMIT } from "@/lib/permissions";

interface UnifiedChainViewProps {
  guitarSpecs: GuitarSpecs;
  signalChain: NodeType[];
  platformTranslations: Partial<Record<Platform, PlatformTranslation>>;
  presetName?: string;
  recipeSlug?: string;
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
  const isOpen = !!(node || platformBlock);
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

  if (!isOpen) return null;

  return (
    <div className="border-t-2 bg-background/95" style={{ borderTopColor: color + "60" }}>
      {/* Header bar with colored accent */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2"
            style={{ borderColor: color + "80", backgroundColor: color + "10" }}
          >
            <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{name}</p>
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
        <div className="flex items-center gap-2">
          {node?.gear_slug && (
            <Link
              href={`/gear/${node.gear_slug}`}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:border-accent/40"
            >
              Gear details →
            </Link>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings — knob-style grid */}
      <div className="px-5 pb-5 md:px-8">
        {settingEntries.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {settingEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col items-center rounded-xl border border-border bg-surface p-3"
              >
                <span
                  className="text-xl font-mono font-bold"
                  style={{ color }}
                >
                  {value}
                </span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {key}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No adjustable settings</p>
        )}

        {/* Notes */}
        {notes && (
          <div className="mt-3 rounded-lg bg-surface/50 px-4 py-3">
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-semibold text-accent">Note: </span>
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guitar header bar                                                  */
/* ------------------------------------------------------------------ */

function GuitarHeader({ specs, actions }: { specs: GuitarSpecs; actions?: React.ReactNode }) {
  return (
    <div className="border-b border-border px-4 py-5 md:px-6">
      <div className="flex items-start gap-3 sm:gap-5">
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
        {/* Actions slot (download button) */}
        {actions && (
          <div className="shrink-0 self-start mt-1">
            {actions}
          </div>
        )}
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
        aria-label={`${block.block_name} – ${block.block_category} settings`}
        aria-pressed={!!isSelected}
        className={`node-glow group flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover hover:scale-105 ${
          isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-105" : ""
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

/* ------------------------------------------------------------------ */
/*  Map platform block_category → chain-tip categories                  */
/* ------------------------------------------------------------------ */

function mapBlockCategory(blockCat: string): { category: string; subcategory?: string } {
  const cat = blockCat.toLowerCase();
  if (["amp", "amp type", "tone model", "amp model"].includes(cat)) return { category: "preamp" };
  if (["cab", "cabinet", "ir"].includes(cat)) return { category: "cabinet" };
  if (["mic", "microphone"].includes(cat)) return { category: "microphone" };
  if (["delay"].includes(cat)) return { category: "wet_effect", subcategory: "delay" };
  if (["reverb"].includes(cat)) return { category: "wet_effect", subcategory: "reverb" };
  if (["chorus", "flanger", "phaser", "tremolo", "vibrato", "modulation"].includes(cat)) return { category: "wet_effect", subcategory: cat };
  if (["drive", "overdrive"].includes(cat)) return { category: "effect", subcategory: "overdrive" };
  if (["distortion", "stomp"].includes(cat)) return { category: "effect", subcategory: "distortion" };
  if (["fuzz"].includes(cat)) return { category: "effect", subcategory: "fuzz" };
  if (["booster", "boost"].includes(cat)) return { category: "effect", subcategory: "boost" };
  if (["dynamics", "compressor", "comp"].includes(cat)) return { category: "effect", subcategory: "compressor" };
  if (["wah", "filter"].includes(cat)) return { category: "effect", subcategory: "wah" };
  if (["eq", "equalizer"].includes(cat)) return { category: "effect", subcategory: "eq" };
  if (["fx", "effect"].includes(cat)) return { category: "effect" };
  return { category: "effect" };
}

export default function UnifiedChainView({
  guitarSpecs,
  signalChain,
  platformTranslations,
  presetName = "Tone Recipe",
  recipeSlug,
}: UnifiedChainViewProps) {
  const availablePlatforms = Object.keys(platformTranslations) as Platform[];
  const { preferredPlatform } = usePlatformStore();
  const initialTab: "physical" | Platform =
    preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)
      ? (preferredPlatform as Platform)
      : "physical";
  const [activeTab, setActiveTab] = useState<"physical" | Platform>(initialTab);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user } = useAuth();
  const userRole = user?.role ?? "free";
  const hasAllPlatforms = canViewAllPlatforms(userRole);
  const hasPresetDownload = canDownloadPresets(userRole);

  // Determine which platform tabs are unlocked for free users
  // Free users get: physical + their preferred platform (or first available)
  const unlockedPlatform = preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)
    ? preferredPlatform as Platform
    : availablePlatforms[0] ?? null;

  function isPlatformLocked(pid: Platform): boolean {
    if (hasAllPlatforms) return false;
    return pid !== unlockedPlatform;
  }


  // Physical chain: tip between guitar and first node
  const firstNode = signalChain[0];
  const guitarToFirstTip = firstNode
    ? getChainTip("guitar", firstNode.category, null, firstNode.subcategory)
    : null;

  const activePlatformMeta = PLATFORMS.find((p) => p.id === activeTab);
  const activeTranslation =
    activeTab !== "physical" ? platformTranslations[activeTab] : null;

  // ESC key exits fullscreen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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

  const chainContent = (
    <div className={
      isFullscreen
        ? "fixed inset-x-0 top-16 bottom-0 z-[60] flex flex-col bg-surface overflow-y-auto"
        : "rounded-xl border border-border bg-surface"
    }>
      {/* Guitar header bar */}
      <GuitarHeader
        specs={guitarSpecs}
        actions={
          <div className="flex items-center gap-2">
            {hasPresetDownload && (activeTab === "helix" || activeTab === "quad_cortex" || activeTab === "katana") && activeTranslation && (
              <DownloadPatchButton
                translation={activeTranslation}
                presetName={presetName}
                platform={activeTab}
              />
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        }
      />

      {/* Platform tabs */}
      <div role="tablist" aria-label="Signal chain platform" className="flex gap-2 overflow-x-auto border-b border-border p-2 scrollbar-hide">
        <button
          role="tab"
          aria-selected={activeTab === "physical"}
          onClick={() => handleTabSwitch("physical")}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "physical"
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-border text-muted hover:text-foreground hover:border-accent/30 hover:bg-surface-hover"
          }`}
        >
          Physical
        </button>
        {availablePlatforms.map((pid) => {
          const meta = PLATFORMS.find((p) => p.id === pid);
          const isActive = activeTab === pid;
          const locked = isPlatformLocked(pid);
          return (
            <button
              key={pid}
              role="tab"
              aria-selected={isActive}
              onClick={() => locked ? window.open("/pricing", "_self") : handleTabSwitch(pid)}
              className={`shrink-0 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                locked
                  ? "border-border text-muted/50 cursor-not-allowed"
                  : isActive
                    ? "text-foreground"
                    : "border-border text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
              style={isActive && !locked ? { backgroundColor: meta?.color + "18", borderColor: meta?.color + "50" } : {}}
            >
              {locked ? (
                <Lock className="h-3 w-3 text-muted/50" />
              ) : (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: meta?.color }}
                />
              )}
              {meta?.label || pid}
            </button>
          );
        })}
      </div>

      {/* Chain area */}
      {activeTab === "physical" ? (
        <div role="tabpanel" aria-label="Physical signal chain" className="w-full overflow-visible">
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
          {selectedNodeIndex === null && (
            <p className="text-xs text-muted text-center py-2">Tap any node to see settings &#8595;</p>
          )}
        </div>
      ) : activeTranslation ? (
        <div role="tabpanel" aria-label={`${activePlatformMeta?.label || activeTab} signal chain`} className="w-full overflow-visible">
          <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
            {activeTranslation.chain_blocks.map((block, i) => {
              const nextBlock = activeTranslation.chain_blocks[i + 1];
              const mapped = mapBlockCategory(block.block_category);
              const nextMapped = nextBlock ? mapBlockCategory(nextBlock.block_category) : null;
              const tip = nextMapped
                ? getChainTip(mapped.category, nextMapped.category, mapped.subcategory, nextMapped.subcategory)
                : null;

              return (
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
                        className="h-3 w-0.5 rounded-full md:h-0.5 md:w-3"
                        style={{
                          backgroundColor:
                            (activePlatformMeta?.color || "#f59e0b") + "60",
                        }}
                      />
                      {tip && <ChainTooltip tip={tip} />}
                      <div
                        className="h-3 w-0.5 rounded-full md:h-0.5 md:w-3"
                        style={{
                          backgroundColor:
                            (activePlatformMeta?.color || "#f59e0b") + "60",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selectedNodeIndex === null && (
            <p className="text-xs text-muted text-center py-2">Tap any node to see settings &#8595;</p>
          )}

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

      {/* Community submissions */}
      {recipeSlug && (
        <CommunitySubmissions recipeSlug={recipeSlug} platform={activeTab === "physical" ? "physical" : activeTab} />
      )}
    </div>
  );

  return chainContent;
}
