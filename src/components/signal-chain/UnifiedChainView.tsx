"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type {
  SignalChainNode as NodeType,
  GuitarSpecs,
  PlatformTranslation,
  PlatformBlock,
  Platform,
} from "@/types/recipe";
import { PLATFORMS } from "@/lib/constants";
import { getChainIcon } from "@/lib/chain-icons";
import { Guitar, Maximize2, Minimize2, Lock, Zap, Volume2, Speaker, Mic, Clock, Waves } from "lucide-react";
import DownloadPatchButton from "./DownloadPatchButton";
import CommunitySubmissions from "./CommunitySubmissions";
import { usePlatformStore } from "@/lib/stores/platform-store";
import { useAuth } from "@/lib/auth/auth-context";
import { canViewAllPlatforms, canDownloadPresets, FREE_PLATFORM_LIMIT } from "@/lib/permissions";

/* ------------------------------------------------------------------ */
/*  Pretext-style category → color mapping                             */
/* ------------------------------------------------------------------ */

function getPretextColor(category: string, subcategory?: string | null): string {
  const cat = (category || "").toLowerCase();
  const sub = (subcategory || "").toLowerCase();
  // Check subcategory first
  if (["overdrive", "drive", "boost", "compressor", "distortion", "fuzz", "gate", "limiter", "dynamics"].includes(sub)) return "#4ade80";
  if (["delay", "echo"].includes(sub)) return "#60a5fa";
  if (["reverb", "modulation", "chorus", "flanger", "phaser", "tremolo", "vibrato"].includes(sub)) return "#a78bfa";
  // Check category
  if (["overdrive", "drive", "boost", "compressor", "dynamics", "comp", "booster", "stomp", "distortion", "fuzz"].includes(cat)) return "#4ade80";
  if (["effect", "fx", "pedal fx"].includes(cat)) return "#4ade80";
  if (["amp", "preamp", "amp type", "tone model", "amp model", "power_amp"].includes(cat)) return "#f87171";
  if (["cab", "cabinet", "ir"].includes(cat)) return "#f87171";
  if (["mic", "microphone"].includes(cat)) return "#94a3b8";
  if (["delay"].includes(cat)) return "#60a5fa";
  if (["reverb", "modulation", "mod", "wet_effect"].includes(cat)) return "#a78bfa";
  return "#f59e0b";
}

function getPretextIcon(category: string, subcategory?: string | null) {
  const cat = (category || "").toLowerCase();
  const sub = (subcategory || "").toLowerCase();
  if (["overdrive", "drive", "boost", "compressor", "distortion", "fuzz", "dynamics", "gate", "limiter"].includes(sub)) return Zap;
  if (["delay", "echo"].includes(sub)) return Clock;
  if (["reverb", "modulation", "chorus", "flanger", "phaser", "tremolo", "vibrato"].includes(sub)) return Waves;
  if (["overdrive", "drive", "boost", "compressor", "dynamics", "comp", "booster", "stomp", "distortion", "fuzz", "effect", "fx", "pedal fx"].includes(cat)) return Zap;
  if (["amp", "preamp", "amp type", "tone model", "amp model", "power_amp"].includes(cat)) return Volume2;
  if (["cab", "cabinet", "ir"].includes(cat)) return Speaker;
  if (["mic", "microphone"].includes(cat)) return Mic;
  if (["delay"].includes(cat)) return Clock;
  if (["reverb", "modulation", "mod", "wet_effect"].includes(cat)) return Waves;
  return Zap;
}

function getPretextLabel(category: string, subcategory?: string | null): string {
  const sub = (subcategory || "").toLowerCase();
  if (sub) return sub;
  const cat = (category || "").toLowerCase();
  const labels: Record<string, string> = {
    guitar: "Guitar", effect: "Drive", preamp: "Amp", power_amp: "Power",
    wet_effect: "FX", cabinet: "Cab", microphone: "Mic", amp: "Amp",
    "amp type": "Amp", cab: "Cab", drive: "Drive", overdrive: "Drive",
    stomp: "Stomp", booster: "Boost", dynamics: "Comp", delay: "Delay",
    reverb: "Reverb", modulation: "Mod", mod: "Mod", fx: "FX",
    "pedal fx": "FX", "tone model": "Amp", eq: "EQ", mic: "Mic",
    compressor: "Comp", comp: "Comp", boost: "Boost", distortion: "Dist",
    fuzz: "Fuzz", ir: "IR",
  };
  return labels[cat] || cat;
}

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

  return (
    <div
      className={`border-t-2 bg-background/95 shadow-lg border-accent/20 overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}
      style={{ borderTopColor: color + "60", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
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
/*  Guitar SVG mapping                                                 */
/* ------------------------------------------------------------------ */

function getGuitarSvg(modelName: string): string {
  const name = modelName.toLowerCase();
  if (name.includes("strat") || name.includes("stratocaster")) return "/images/guitars/Strat.svg";
  if (name.includes("telecaster") || name.includes("tele") || name.includes("esquire")) {
    if (name.includes("bigsby")) return "/images/guitars/Bigsby Tele.svg";
    return "/images/guitars/Tele.svg";
  }
  if (name.includes("les paul") || name.includes("lp") || name.includes("goldtop") || name.includes("custom")) return "/images/guitars/LP.svg";
  if (name.includes("sg") || name.includes("special")) return "/images/guitars/SG.svg";
  if (name.includes("explorer")) return "/images/guitars/Explorere.svg";
  if (name.includes("flying v") || name.includes("flying-v")) return "/images/guitars/Flying V.svg";
  if (name.includes("335") || name.includes("semi") || name.includes("hollow") || name.includes("casino") || name.includes("gretsch")) return "/images/guitars/335.svg";
  if (name.includes("warlock") || name.includes("bc rich") || name.includes("metal")) return "/images/guitars/Warlock.svg";
  if (name.includes("dinky") || name.includes("jackson") || name.includes("soloist") || name.includes("ibanez") || name.includes("super strat")) return "/images/guitars/Dinky.svg";
  // Default to Strat
  return "/images/guitars/Strat.svg";
}

/* ------------------------------------------------------------------ */
/*  Guitar header bar — Pretext style                                  */
/* ------------------------------------------------------------------ */

function GuitarHeader({ specs, actions }: { specs: GuitarSpecs; actions?: React.ReactNode }) {
  const guitarSvg = getGuitarSvg(specs.model_name);

  return (
    <div className="flex items-start gap-4 border-b border-[#1a2235] px-5 py-5 sm:gap-5 md:px-6">
      {/* Guitar SVG box */}
      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl border-2 border-accent bg-[#0b0f1a] sm:h-[90px] sm:w-[90px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guitarSvg}
          alt={specs.model_name}
          className="h-10 w-auto opacity-60 sm:h-12"
          style={{ filter: "brightness(0.6) sepia(1) hue-rotate(10deg) saturate(3)" }}
        />
      </div>
      {/* Specs */}
      <div className="flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#5a7090]">Guitar</div>
        <div className="mt-1 text-base font-bold text-[#f0eadf] sm:text-lg">{specs.model_name}</div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Pickups</div>
            <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">{specs.pickup_config} ({specs.pickup_position})</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Tuning</div>
            <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">
              {specs.tuning
                .replace(/_/g, " ")
                .replace(/\beb\b/gi, "Eb")
                .replace(/\bdb\b/gi, "Db")
                .replace(/\bab\b/gi, "Ab")
                .replace(/\bbb\b/gi, "Bb")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Strings</div>
            <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">{specs.string_gauge}</div>
          </div>
          {specs.notable_mods && (
            <div className="hidden sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Mods</div>
              <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">{specs.notable_mods}</div>
            </div>
          )}
        </div>
      </div>
      {/* Actions slot (download + fullscreen) */}
      {actions && (
        <div className="shrink-0 self-start">
          {actions}
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
  const [hasUserSwitchedTab, setHasUserSwitchedTab] = useState(false);

  // Sync active tab when Zustand store hydrates from localStorage.
  // Only auto-switch if the user hasn't manually changed tabs yet.
  useEffect(() => {
    if (hasUserSwitchedTab) return;
    if (preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)) {
      setActiveTab(preferredPlatform as Platform);
    }
  }, [preferredPlatform, hasUserSwitchedTab]); // eslint-disable-line react-hooks/exhaustive-deps
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


  // Pretext-style animation state
  const [animStep, setAnimStep] = useState(-1);
  const [animComplete, setAnimComplete] = useState(false);

  const nodeCount = activeTab === "physical"
    ? signalChain.length
    : (platformTranslations[activeTab as Platform]?.chain_blocks.length ?? 0);

  useEffect(() => {
    setAnimStep(-1);
    setAnimComplete(false);
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimComplete(true);
      return;
    }
    let step = 0;
    let timerId: ReturnType<typeof setInterval> | null = null;
    const delay = setTimeout(() => {
      timerId = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step > nodeCount) {
          if (timerId) clearInterval(timerId);
          setAnimComplete(true);
        }
      }, 500);
    }, 300);
    return () => {
      clearTimeout(delay);
      if (timerId) clearInterval(timerId);
    };
  }, [nodeCount, activeTab]); // reset animation on tab switch

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
    setHasUserSwitchedTab(true);
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
        ? "fixed inset-x-0 top-16 bottom-0 z-[60] flex flex-col bg-[#161d2f] overflow-y-auto"
        : "overflow-hidden rounded-2xl border border-border bg-[#161d2f]"
    }>
      {/* Platform tabs — above guitar for unbroken signal flow */}
      <div role="tablist" aria-label="Signal chain platform" className="flex gap-2 overflow-x-auto border-b border-[#1a2235] bg-[#131829] px-4 py-3 scrollbar-hide">
        <button
          role="tab"
          aria-selected={activeTab === "physical"}
          onClick={() => handleTabSwitch("physical")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === "physical"
              ? "border border-accent/50 bg-accent/10 text-accent"
              : "border border-transparent text-[#4a5e78] hover:text-foreground"
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
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                locked
                  ? "border border-transparent text-muted/50 cursor-not-allowed"
                  : isActive
                    ? "text-foreground"
                    : "border border-transparent text-[#4a5e78] hover:text-foreground"
              }`}
              style={isActive && !locked ? { backgroundColor: meta?.color + "18", borderColor: meta?.color + "50", border: `1px solid ${meta?.color}50` } : {}}
            >
              {locked ? (
                <Lock className="h-3 w-3 text-muted/50" />
              ) : (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: meta?.color }}
                />
              )}
              {meta?.label || pid}
            </button>
          );
        })}
      </div>

      {/* Guitar header bar */}
      <GuitarHeader
        specs={guitarSpecs}
        actions={
          <div className="flex items-center gap-2">
            {user && (activeTab === "helix" || activeTab === "quad_cortex" || activeTab === "katana") && activeTranslation && (
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

      {/* Chain area — Pretext-style rendering */}
      {activeTab === "physical" ? (
        <div role="tabpanel" aria-label="Physical signal chain" className="w-full overflow-visible">
          <div style={{ padding: '32px 16px 0', overflowX: 'auto' }}>
            {/* Nodes row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'max-content', margin: '0 auto' }}>
              {signalChain.map((node, i) => {
                const isLit = animComplete || animStep >= i;
                const nodeColor = getPretextColor(node.category, node.subcategory);
                const Icon = getPretextIcon(node.category, node.subcategory);
                const categoryLabel = getPretextLabel(node.category, node.subcategory);
                const isSelected = selectedNodeIndex === i;

                return (
                  <React.Fragment key={node.position}>
                    <div
                      onClick={() => setSelectedNodeIndex(selectedNodeIndex === i ? null : i)}
                      style={{
                        width: 90, height: 90, borderRadius: 15,
                        border: `1.5px solid ${isLit ? nodeColor : '#1e2840'}`,
                        background: '#0b0f1a',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 8, flexShrink: 0, cursor: 'pointer',
                        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.3s',
                        transform: isLit && !animComplete ? 'translateY(-8px)' : 'none',
                        boxShadow: isSelected
                          ? `0 0 0 2px ${nodeColor}40, 0 8px 30px ${nodeColor}66`
                          : isLit
                            ? `0 0 0 1px ${nodeColor}15, 0 8px 30px ${nodeColor}66`
                            : 'none',
                      }}
                    >
                      <Icon className="h-7 w-7" style={{ color: isLit ? nodeColor : '#2a3a55' }} strokeWidth={1.5} />
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: isLit ? nodeColor : '#2a3a55' }}>
                        {categoryLabel}
                      </div>
                    </div>
                    {i < signalChain.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', width: 68, flexShrink: 0, position: 'relative', zIndex: 3 }}>
                        <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #2a3a55 0, #2a3a55 4px, transparent 4px, transparent 8px)' }} />
                        <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%', border: '1.5px solid #2a3a55', background: '#0b0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#2a3a55', fontWeight: 700 }}>?</div>
                        <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #2a3a55 0, #2a3a55 4px, transparent 4px, transparent 8px)' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Labels row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 14, minWidth: 'max-content', margin: '14px auto 0' }}>
              {signalChain.map((node, i) => {
                const isLit = animComplete || animStep >= i;
                return (
                  <React.Fragment key={node.position}>
                    <div style={{ width: 90, flexShrink: 0, textAlign: 'center', fontSize: 11, fontWeight: 500, color: isLit ? '#7a8fa8' : '#3d5068', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                      {node.gear_name}
                    </div>
                    {i < signalChain.length - 1 && <div style={{ width: 68, flexShrink: 0 }} />}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Tap hint */}
            {selectedNodeIndex === null && (
              <div style={{ textAlign: 'center', fontSize: 12, color: '#253040', marginTop: 22, paddingTop: 18, borderTop: '1px solid #1a2235' }}>
                Tap any node to see settings &darr;
              </div>
            )}
            <div style={{ height: 24 }} />
          </div>
        </div>
      ) : activeTranslation ? (
        <div role="tabpanel" aria-label={`${activePlatformMeta?.label || activeTab} signal chain`} className="w-full overflow-visible">
          <div style={{ padding: '32px 16px 0', overflowX: 'auto' }}>
            {/* Nodes row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'max-content', margin: '0 auto' }}>
              {activeTranslation.chain_blocks.map((block, i) => {
                const isLit = animComplete || animStep >= i;
                const nodeColor = getPretextColor(block.block_category);
                const Icon = getPretextIcon(block.block_category);
                const categoryLabel = getPretextLabel(block.block_category);
                const isSelected = selectedNodeIndex === i;

                return (
                  <React.Fragment key={i}>
                    <div
                      onClick={() => setSelectedNodeIndex(selectedNodeIndex === i ? null : i)}
                      style={{
                        width: 90, height: 90, borderRadius: 15,
                        border: `1.5px solid ${isLit ? nodeColor : '#1e2840'}`,
                        background: '#0b0f1a',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 8, flexShrink: 0, cursor: 'pointer',
                        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.3s',
                        transform: isLit && !animComplete ? 'translateY(-8px)' : 'none',
                        boxShadow: isSelected
                          ? `0 0 0 2px ${nodeColor}40, 0 8px 30px ${nodeColor}66`
                          : isLit
                            ? `0 0 0 1px ${nodeColor}15, 0 8px 30px ${nodeColor}66`
                            : 'none',
                      }}
                    >
                      <Icon className="h-7 w-7" style={{ color: isLit ? nodeColor : '#2a3a55' }} strokeWidth={1.5} />
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: isLit ? nodeColor : '#2a3a55' }}>
                        {categoryLabel}
                      </div>
                    </div>
                    {i < activeTranslation.chain_blocks.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', width: 68, flexShrink: 0, position: 'relative', zIndex: 3 }}>
                        <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #2a3a55 0, #2a3a55 4px, transparent 4px, transparent 8px)' }} />
                        <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%', border: '1.5px solid #2a3a55', background: '#0b0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#2a3a55', fontWeight: 700 }}>?</div>
                        <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #2a3a55 0, #2a3a55 4px, transparent 4px, transparent 8px)' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Labels row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 14, minWidth: 'max-content', margin: '14px auto 0' }}>
              {activeTranslation.chain_blocks.map((block, i) => {
                const isLit = animComplete || animStep >= i;
                return (
                  <React.Fragment key={i}>
                    <div style={{ width: 90, flexShrink: 0, textAlign: 'center', fontSize: 11, fontWeight: 500, color: isLit ? '#7a8fa8' : '#3d5068', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                      {block.block_name}
                    </div>
                    {i < activeTranslation.chain_blocks.length - 1 && <div style={{ width: 68, flexShrink: 0 }} />}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Tap hint */}
            {selectedNodeIndex === null && (
              <div style={{ textAlign: 'center', fontSize: 12, color: '#253040', marginTop: 22, paddingTop: 18, borderTop: '1px solid #1a2235' }}>
                Tap any node to see settings &darr;
              </div>
            )}
            <div style={{ height: 24 }} />
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

      {/* Community submissions */}
      {recipeSlug && (
        <CommunitySubmissions recipeSlug={recipeSlug} platform={activeTab === "physical" ? "physical" : activeTab} />
      )}
    </div>
  );

  return chainContent;
}
