"use client";

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import Link from "next/link";
import type {
  SignalChainNode as NodeType,
  GuitarSpecs,
  PlatformTranslation,
  PlatformBlock,
  Platform,
} from "@/types/recipe";
import { PLATFORMS, DISPLAYED_PLATFORM_IDS } from "@/lib/constants";
import { getChainIcon } from "@/lib/chain-icons";
import { Guitar, Maximize2, Minimize2, Lock, Zap, Volume2, Speaker, Mic, Clock, Waves } from "lucide-react";
import DownloadPatchButton from "./DownloadPatchButton";
import SettingDisplay from "@/components/settings/SettingDisplay";
import CommunitySubmissions from "./CommunitySubmissions";
import { usePlatformStore } from "@/lib/stores/platform-store";
import { useAuth } from "@/lib/auth/auth-context";
import { canViewAllPlatforms, canDownloadPresets, FREE_PLATFORM_LIMIT } from "@/lib/permissions";

/* ------------------------------------------------------------------ */
/*  Pretext-style category → color mapping                             */
/* ------------------------------------------------------------------ */

const NODE_COLORS: Record<string, string> = {
  overdrive: "#4ade80", drive: "#4ade80", boost: "#4ade80", compressor: "#4ade80",
  distortion: "#4ade80", fuzz: "#4ade80", gate: "#4ade80", limiter: "#4ade80",
  dynamics: "#4ade80", comp: "#4ade80", booster: "#4ade80", stomp: "#4ade80",
  effect: "#4ade80", fx: "#4ade80", "pedal fx": "#4ade80", eq: "#4ade80",
  amp: "#f87171", preamp: "#f87171", "amp type": "#f87171", "tone model": "#f87171",
  "amp model": "#f87171", power_amp: "#f87171",
  cab: "#f87171", cabinet: "#f87171", ir: "#f87171",
  mic: "#94a3b8", microphone: "#94a3b8",
  delay: "#60a5fa", echo: "#60a5fa",
  reverb: "#a78bfa", modulation: "#a78bfa", mod: "#a78bfa", wet_effect: "#a78bfa",
  chorus: "#a78bfa", flanger: "#a78bfa", phaser: "#a78bfa", tremolo: "#a78bfa", vibrato: "#a78bfa",
};

const NODE_BORDERS: Record<string, string> = {
  overdrive: "#16a34a", drive: "#16a34a", boost: "#16a34a", compressor: "#16a34a",
  distortion: "#16a34a", fuzz: "#16a34a", dynamics: "#16a34a", comp: "#16a34a",
  booster: "#16a34a", stomp: "#16a34a", effect: "#16a34a", fx: "#16a34a", eq: "#16a34a",
  amp: "#dc2626", preamp: "#dc2626", "amp type": "#dc2626", power_amp: "#dc2626",
  cab: "#dc2626", cabinet: "#dc2626", ir: "#dc2626",
  mic: "#475569", microphone: "#475569",
  delay: "#2563eb", echo: "#2563eb",
  reverb: "#7c3aed", modulation: "#7c3aed", mod: "#7c3aed", wet_effect: "#7c3aed",
  chorus: "#7c3aed", flanger: "#7c3aed", phaser: "#7c3aed", tremolo: "#7c3aed",
};

function getPretextColor(category: string, subcategory?: string | null): string {
  const sub = (subcategory || "").toLowerCase();
  if (sub && NODE_COLORS[sub]) return NODE_COLORS[sub];
  return NODE_COLORS[(category || "").toLowerCase()] || "#f59e0b";
}

function getPretextBorder(category: string, subcategory?: string | null): string {
  const sub = (subcategory || "").toLowerCase();
  if (sub && NODE_BORDERS[sub]) return NODE_BORDERS[sub];
  return NODE_BORDERS[(category || "").toLowerCase()] || "#d97706";
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons per category (from v9 example)                    */
/* ------------------------------------------------------------------ */

function NodeIcon({ category, subcategory, color }: { category: string; subcategory?: string | null; color: string }) {
  const cat = (subcategory || category || "").toLowerCase();

  // Overdrive / Drive / Stomp / Effect — lightning bolt
  if (["overdrive", "drive", "boost", "compressor", "distortion", "fuzz", "dynamics", "comp",
       "booster", "stomp", "effect", "fx", "pedal fx", "eq", "gate", "limiter"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M15 3L20 14H16.5L20 27L10 13H13.5Z" fill={color} />
      </svg>
    );
  }

  // Amp — speaker box with wave
  if (["amp", "preamp", "amp type", "tone model", "amp model", "power_amp"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="3" y="5" width="24" height="20" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="15" r="7" stroke={color} strokeWidth="1.4" fill="none" />
        <circle cx="15" cy="15" r="3.5" fill={color} opacity="0.3" />
        <path d="M8.5 15Q12 8 15 15Q18 22 21.5 15" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Cabinet — speaker cone with crosshairs
  if (["cab", "cabinet", "ir"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="3" y="3" width="24" height="24" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="15" r="9" stroke={color} strokeWidth="1.3" fill="none" />
        <circle cx="15" cy="15" r="5.5" stroke={color} strokeWidth="1.1" fill="none" />
        <circle cx="15" cy="15" r="1.8" fill={color} />
        <line x1="15" y1="6" x2="15" y2="9" stroke={color} strokeWidth="1.2" />
        <line x1="15" y1="21" x2="15" y2="24" stroke={color} strokeWidth="1.2" />
        <line x1="6" y1="15" x2="9" y2="15" stroke={color} strokeWidth="1.2" />
        <line x1="21" y1="15" x2="24" y2="15" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }

  // Mic — microphone
  if (["mic", "microphone"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="11.5" y="3" width="7" height="14" rx="3.5" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M7 14Q7 23 15 23Q23 23 23 14" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="15" y1="23" x2="15" y2="27" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="10" y1="27" x2="20" y2="27" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="11.5" y1="8" x2="18.5" y2="8" stroke={color} strokeWidth="1.1" />
        <line x1="11.5" y1="11" x2="18.5" y2="11" stroke={color} strokeWidth="1.1" />
        <line x1="11.5" y1="14" x2="18.5" y2="14" stroke={color} strokeWidth="1.1" />
      </svg>
    );
  }

  // Delay — clock
  if (["delay", "echo"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="11" stroke={color} strokeWidth="1.5" fill="none" />
        <line x1="15" y1="8" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="15" x2="20" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="15" r="1.5" fill={color} />
      </svg>
    );
  }

  // Reverb / Mod — waves
  if (["reverb", "modulation", "mod", "wet_effect", "chorus", "flanger", "phaser", "tremolo", "vibrato"].includes(cat)) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M4 15Q8 7 12 15Q16 23 20 15Q24 7 28 15" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M4 20Q8 12 12 20Q16 28 20 20Q24 12 28 20" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M4 10Q8 2 12 10Q16 18 20 10Q24 2 28 10" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }

  // Fallback — lightning bolt
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M15 3L20 14H16.5L20 27L10 13H13.5Z" fill={color} />
    </svg>
  );
}

function getPretextLabel(category: string, subcategory?: string | null): string {
  const sub = (subcategory || "").toLowerCase();
  if (sub) {
    const subLabels: Record<string, string> = {
      overdrive: "OVERDRIVE", drive: "DRIVE", boost: "BOOST", compressor: "COMP",
      distortion: "DISTORTION", fuzz: "FUZZ", delay: "DELAY", echo: "DELAY",
      reverb: "REVERB", modulation: "MOD", chorus: "CHORUS", flanger: "FLANGER",
      phaser: "PHASER", tremolo: "TREMOLO", vibrato: "VIBRATO", eq: "EQ",
    };
    if (subLabels[sub]) return subLabels[sub];
  }
  const cat = (category || "").toLowerCase();
  const labels: Record<string, string> = {
    guitar: "GUITAR", effect: "DRIVE", preamp: "AMP", power_amp: "POWER",
    wet_effect: "FX", cabinet: "CABINET", microphone: "MIC", amp: "AMP",
    "amp type": "AMP", cab: "CABINET", drive: "DRIVE", overdrive: "OVERDRIVE",
    stomp: "STOMP", booster: "BOOST", dynamics: "COMP", delay: "DELAY",
    reverb: "REVERB", modulation: "MOD", mod: "MOD", fx: "FX",
    "pedal fx": "FX", "tone model": "AMP", eq: "EQ", mic: "MIC",
    compressor: "COMP", comp: "COMP", boost: "BOOST", distortion: "DIST",
    fuzz: "FUZZ", ir: "IR",
  };
  return labels[cat] || cat.toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Inline guitar SVG paths                                            */
/* ------------------------------------------------------------------ */

const GUITAR_PATHS: Record<string, { viewBox: string; d: string }> = {
  strat: {
    viewBox: "0 0 74.92 233.01",
    d: "M.37,204.6c3.14-18.41,13.73-26.05,10.83-38l-4.7-19.39c-2.57-10.61-.13-23.54,8.66-21.95.68,8.66,2.55,18.19,9.21,18.21,2.21,0,5.97-2.33,6.01-4.84l1.59-94.89-6.28-7.9c-.75-.94,1.64-2.89,3.14-3.45l-1.55-3.24c-.37-.78,2.8-1.59,3.74-1.8l-2.04-3.64c-.53-.94,2.5-1.92,4.27-2.2l-1.73-2.09c-.47-.57-.77-2.54-.05-2.74l3.91-1.08-2.78-2.72c-.54-.53.56-2.38,1.32-2.48l3.66-.48-2.69-2.5c-.45-.42-.62-2.13-.05-2.35l3.02-1.14c1.78-2.43,4.19-4.35,7.26-3.86s5.21,2.68,6.12,5.7c.86,2.84-1.56,6.1-4.43,7.96-1.59,5.21,5.48,12.35,3.93,22.34-5.13.41-8.84,3.51-8.76,8.56l1.59,106.88c2.22,2.67,6.34,3.9,9.79,3.25,5.97-1.13,5.58-9.95,9.75-15.32,9.4,3.94,7.69,16.1,3.13,26.32-6.96,15.61,5.91,22.54,8.45,40.71,1.63,11.63-4.91,21.48-16.65,24.29-13.58,3.25-28.78,2.99-42.16-1.03-11.48-3.46-17.45-13.67-15.5-25.14ZM54.2,201.03c6.64,1.57,12.21,10.87,16.07,8.33,7.45-4.9-12.05-28.59-9.71-36.42l4.57-15.3c1.4-4.69,1.7-9.23-.84-13.65l-2.73,6.47c-1.21,2.86-3.64,6.4-6.16,7.11-10.64,3.03-15.83-8.97-31.38-8.67,2.83,11.53,2.19,20.74-2.2,30.65-2.37,5.34-3.38,12.78.67,17.7s19,.78,31.71,3.78Z",
  },
  lp: {
    viewBox: "0 0 75.3 226.18",
    d: "M75.24,192.25c.79,13.83-6.63,25.47-19,30.41-21.73,8.69-50.48,1.42-55.58-22.81-2.5-11.88,2.21-23.55,11.39-31.34,5.08-4.31,6.98-9.72,3.33-15.71s-5.17-13.47-1.53-19.61,10.44-8.29,18.01-8.27l1.29-91.19-3.55-8.23c-.7-.13-2.6-.26-2.6-.73l.02-2.06c0-.61,1.49-.31,2.99-.03l.57-2.52c.14-.63-1.28-1.47-1.87-1.74l-2.02-.94c-.42-.19.22-2.28.67-2.18l2.89.61-.07-5.02-3.09.39c-.55.07-1.3-1.87-.83-2.14l2.54-1.41c1-.56,1.03-2.94.72-5.68l8.88-2.05,8.42,1.99-.44,6.65,3.1-.41c.6-.08.93,2.62.33,2.67l-2.97.24c-1.25.1-1.24,4.16,0,4.38.54.09,2.53-.64,2.62-.2l.42,1.92c.1.45-1.07.81-1.56,1.1l-2.67,1.57c-.52.31.29,2.48.9,2.48h2.65c0-.07.19,1.48.23,1.9.06.61-1.39,1.01-2.37,1.33l-4.16,8.16,1.26,99.82c.05,3.9,5.07,7.19,7.94,7.63,3.42.52,7.63-2.23,9.67-6.36,5.1,3.53,2.85,10.73-.83,17.44-3.06,5.57-2.57,11.46,2.23,15.74,6.83,6.1,11.47,14.17,12.05,24.2ZM27.27,167.6l.38,10.55c12.79-.36,22.74.03,34.7,1.68.36-1.5.56-4.65.11-5.86l-9.13-24.96c-1.69-4.62-3.79-7.33-8.7-10.5l-.39,5.43-16.84-.03.03,10.53,17.02-.05.29,13.18-17.46.03Z",
  },
  tele: {
    viewBox: "0 0 77.29 234",
    d: "M77.29,210.2c.13,12.61-8.19,22.1-20.67,23.21s-26.18.62-38.85-1.52S-1.18,219.66.17,207.58c1.07-9.56,4.89-18.58,9.51-27.04,7.91-14.49-4.78-21.46-1.82-36.75,1.37-7.09,8.35-9.81,14.44-7.46l11.73,4.51,4.85-100.84c-2.97-2.59-4.42-9.65-4.49-9.49l1.52-3.34L44.09,2.87c.18-.53.32-2.35.8-2.4l2.89-.33c3.31-.37,6.48-.24,8.28,2.94,1.34,2.37-.83,6.06-3.12,8.08,5.31,12.25-3.51,19.07-3.67,29.6l-1.71,109.88c-.02,1.57,2.73,4.04,4.12,4.24,11.09,1.57,11.37-16.74,16.58-16.36,7.28.54,7.22,15.15,1.04,26.68-8.3,15.5,7.78,24.06,8,44.99ZM20.39,183.19c4.3,1.36,7.56.78,10.45-1.63l17.41.55c.41.51,2.37,2.62,3.05,2.64l16.86.43c-4-7.83-3.86-14.33-.2-21.4,6.1-11.8,4.87-23.13.49-23.21s-3.28,9.63-10.35,14.16c-3.66,2.34-7.41,1.59-10.52-1.39l-1.65,3.12-11.81-.09-.22-12.33c-12.08,4.75-16.01,25.53-13.5,39.16Z",
  },
  sg: {
    viewBox: "0 0 78.12 227.59",
    d: "M76.62,210.92c-6.44,18.52-40.94,19.62-61.05,12.89-7.97-2.67-13.37-9.09-14.92-15.77-2.07-8.96.96-16.18,6.99-22.34,4.97-5.07,5.99-11.98,3.13-18.31-5.8-12.82-4.21-29.87,7.85-37.44l-.35,5.82c-.22,3.58,2.85,6.92,5.86,7.63,2.43.58,8.09-2.05,8.19-5.69l2.81-105.12-4.13-8.76-3-1.82,4.06-2.23c.96-.53-.88-3.44-1.97-3.5-.56-.03-2.57-1.01-2.15-1.25l2.07-1.16c.73-.41,2.2-1.19,2.16-1.85-.05-.89-1.27-2.33-2.04-2.76l-2.15-1.2c-.42-.23,1.51-.99,2.36-1.31,1.2-.45,1.39-3.01.72-5.46,5.57-1.67,11.86-1.7,17.5-.19l-.69,5.19,2.67.79c.46.13.61,1.09.7,1.64l-3.09.98c-.61.19-1.6,2.23-1.06,2.57l3.05,1.94c.32.2,1.53.86,1.24,1l-2.26,1.09c-.9.43-2.55,1.89-2.26,2.77s1.88,1.56,3.56,2.19c.25.11,1.22,1.26.77,1.41l-2.96.99-4.15,7.99,1.89,104.77c.08,4.22,5.14,7.39,7.84,6.97,4.27-.66,7.2-4.1,7.1-9.49,6.89,4.3,10.25,12.04,9.42,20.79-.27,2.85-.5,7.45-1.81,9.62-3.39,5.62-4.18,11.37-.45,16.93l6.79,10.14c3.79,5.67,4.14,12.71,1.76,19.54ZM57.42,186.66c2.81.84,5.91.65,8.24-.65-10.09-15.63,6.59-25.78-2.38-40.92-1.85,2.6-3.77,4.39-5.71,4.85-1.39.33-4.34-.63-5.47-1.74l-6.2-6.03-.28,6.78-5.19.3v26.76s5.26.28,5.26.28l.09,6.9,11.63,3.48Z",
  },
  "335": {
    viewBox: "0 0 85.99 220.04",
    d: "M69.96,213.29c-27.48,14.49-64.99,4.98-69.47-22.36-1.99-12.1,2.28-21.96,10.88-29.94,2.55-2.36,6.17-6.59,6.8-9.76l-6.21-16.01c-2.18-5.63-.35-12.64,4.72-15.63,6.83-4.03,7.11,8.53,13.98,8.63,2.82.04,5.58-3.08,5.61-6.44l.8-90.62c.05-5.31-5.96-11.42-6.17-10.78.17-.54.73-2.28.63-1.98l2.27.28c.41.05,1.37-1.37,1.02-1.59l-2.44-1.54-1.87-1.18c-.7-.44,6.14-2.58,4.21-3.97l-3.05-2.2c-.32-.23-1.06-1.62-.66-1.76l2.95-1.04-.5-4.17c5.33-1.39,12-2,16.17.3.56,2.53,1.53,4.08,3.26,6.28l-3.31,1.29c-.92.36-.74,3.63.24,3.76l2.45.33c.51.07.8,1.76.3,1.89l-2.6.72c-.59.16-1.14,1.71-1.18,2.43-.04.62,1.35.34,2.89,0l1.08,2c.3.55-2.05,1.13-2.95,1.35l-3.75,8.56,2.03,92.16c.06,2.6,3.73,5.72,5.67,5.93,6.55.71,7.56-10.47,12.11-9.96,7.27.81,10.18,8.41,8.13,14.52l-5.63,16.8c-.91,2.72,3,7.87,5.21,9.57,8.26,6.38,12.1,14.41,12.38,24.72.33,11.98-4.59,23.36-16.02,29.39ZM9.95,187.5c3.37,1.88,5.54-.51,6.18-2.87.77-2.86,3.81-7.16,4.21-9.97l1.72-12.02-5.33,9.65c-1.96,3.54-.08,9.58-3.47,12.65-1.34.23-4.3,1.99-3.31,2.56ZM76.51,186.62l-5.06-1.68-2.92-12.87c-.48-2.12-2.98-5.47-4.62-7.78l.85,10.43,4.66,10.03c.85,1.83,2.24,6.37,7.09,1.87Z",
  },
  flyingv: {
    viewBox: "0 0 89.41 230.16",
    d: "M56.51,200.09c-3.09-3.53-7.54-7.61-12.02-7.92-4.34-.3-8.13,3.73-10.81,6.73l-25.56,28.57c-1.28,1.43-5.29,1.52-6.44.78s-2.07-3.45-1.49-5.2l31.4-94.06c5.02-2.89,6.03-6.95,6.09-12.36l.97-82.95c.04-3.44-3.93-6.71-6.46-7.87-.94.19-2.51.65-2.48.11l.14-2.74c.04-.71,2.12.15,2.96.65.53.31,2.21-1.03,2.06-1.67-.57-2.37-2.72-.63-3.34-3.89-.1-.51,1.09-1.38,1.53-1.16l2.02,1c.57.28,2.25-1.71,1.75-2.11l-2.11-1.71-1.28-1.05c-.43-.35.14-2.48.66-2.28l3.51,1.3,3.82-9.7c.39-1,2.57-2.47,3.62-2.56,1.23-.1,3.51,1.74,3.81,2.94l2.24,8.75,3.05-.66c.53-.11,1.45.72,1.45,1.26-.01,3.1-4.44,2.07-3.7,3.67.33.72,1.38,2.96,1.14,2.45l2.9-1.48c.6-.31,1.28,1.7,1.23,2.37s-1.67.82-2.73.87c-.4.02-1.48,1.57-1.17,1.89l1.51,1.51,2.93-.72c.5-.12.63,1.91.51,2.41-.15.67-.65.64-2.48.77-2.25.8-6.92,3.75-7.69,6.65l1.5,86.82c.08,4.45,4.23,6.84,6.17,9.9l33.49,94.37c.64,1.81-.41,5.46-1.75,6.13s-4.86-.04-5.95-1.29l-25.01-28.52ZM53.86,157.21l.13,27.81c8.09,9.15,15.6,18.09,24.98,27.31l-22.21-72.8c-.37-1.2-2.07-3.25-2.99-4.08l-.24,9.77h-18.68s.02,11.98.02,11.98l18.98.02Z",
  },
};

function getGuitarKey(modelName: string): string {
  const n = modelName.toLowerCase();
  if (n.includes("strat") || n.includes("stratocaster")) return "strat";
  if (n.includes("tele") || n.includes("telecaster") || n.includes("esquire")) return "tele";
  if (n.includes("les paul") || n.includes("lp") || n.includes("goldtop") || n.includes("custom 24") || n.includes("prs")) return "lp";
  if (n.includes("sg ") || n.includes("sg,")) return "sg";
  if (n.includes("flying v") || n.includes("flying-v")) return "flyingv";
  if (n.includes("335") || n.includes("semi") || n.includes("hollow") || n.includes("casino") || n.includes("gretsch")) return "335";
  if (n.includes("explorer")) return "strat"; // fallback
  return "strat";
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

      <div className="px-5 pb-5 md:px-8">
        {settingEntries.length > 0 ? (
          // Knob/fader panel. Size "md" gives the knobs enough presence to
          // read as a control surface, not a sparkline. Block category is
          // threaded so params that mean different things in different
          // blocks (e.g. "Level" on a Compressor vs a Booster) pick up the
          // right registry override. Unknown params fall back to a plain
          // numeric card.
          <div className="flex flex-wrap items-start gap-5">
            {settingEntries.map(([key, value]) => (
              <SettingDisplay
                key={key}
                settingKey={key}
                value={value as string | number}
                color={color}
                size="md"
                blockCategory={
                  node?.category || platformBlock?.block_category
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No adjustable settings</p>
        )}
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
/*  Render a chain (shared between physical and platform tabs)         */
/* ------------------------------------------------------------------ */

function ChainRenderer({
  nodes,
  animStep,
  animComplete,
  selectedNodeIndex,
  onNodeClick,
  firstNodeRef,
}: {
  nodes: { name: string; category: string; subcategory?: string | null; color: string; borderColor: string }[];
  animStep: number;
  animComplete: boolean;
  selectedNodeIndex: number | null;
  onNodeClick: (i: number) => void;
  firstNodeRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div style={{ padding: "36px 28px 32px", overflowX: "auto", overflowY: "visible" }}>
      {/* Nodes row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, minWidth: "max-content", margin: "0 auto", padding: "16px 0" }}>
        {nodes.map((node, i) => {
          const isLit = animComplete || animStep >= i;
          const isCurrent = !animComplete && animStep === i;
          const isSelected = selectedNodeIndex === i;
          const c = node.color;
          const b = node.borderColor;

          return (
            <React.Fragment key={i}>
              {/* Node box */}
              <div
                ref={i === 0 ? firstNodeRef : undefined}
                onClick={() => onNodeClick(i)}
                style={{
                  width: 90, height: 90, borderRadius: 15,
                  border: `1.5px solid ${isLit ? b : "#1e2840"}`,
                  background: "#0b0f1a",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, flexShrink: 0, cursor: "pointer",
                  transition: "border-color 0.25s, box-shadow 0.25s, transform 0.3s",
                  transform: isCurrent ? "translateY(-8px)" : "none",
                  boxShadow: isSelected
                    ? `0 0 0 2px ${c}40, 0 8px 30px ${c}66`
                    : isLit
                      ? `0 0 0 1px ${c}15, 0 8px 30px ${c}66`
                      : "none",
                  position: "relative", zIndex: 3,
                }}
              >
                <NodeIcon
                  category={node.category}
                  subcategory={node.subcategory}
                  color={isLit ? c : "#2a3a55"}
                />
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase",
                  color: isLit ? c : "#2a3a55",
                  transition: "color 0.25s",
                }}>
                  {getPretextLabel(node.category, node.subcategory)}
                </div>
              </div>

              {/* Connector */}
              {i < nodes.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", width: 68, flexShrink: 0, position: "relative", zIndex: 3 }}>
                  <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#2a3a55 0,#2a3a55 4px,transparent 4px,transparent 8px)" }} />
                  <div style={{
                    width: 22, height: 22, flexShrink: 0, borderRadius: "50%",
                    border: "1.5px solid #2a3a55", background: "#0b0f1a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#2a3a55", fontWeight: 700,
                  }}>?</div>
                  <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#2a3a55 0,#2a3a55 4px,transparent 4px,transparent 8px)" }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Labels row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", marginTop: 14, minWidth: "max-content", margin: "14px auto 0" }}>
        {nodes.map((node, i) => {
          const isLit = animComplete || animStep >= i;
          return (
            <React.Fragment key={i}>
              <div style={{
                width: 90, flexShrink: 0, textAlign: "center",
                fontSize: 11, fontWeight: 500,
                color: isLit ? "#7a8fa8" : "#3d5068",
                lineHeight: 1.45, whiteSpace: "pre-line",
                transition: "color 0.25s",
              }}>
                {node.name}
              </div>
              {i < nodes.length - 1 && <div style={{ width: 68, flexShrink: 0 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tap hint */}
      {selectedNodeIndex === null && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#253040", marginTop: 22, paddingTop: 18, borderTop: "1px solid #1a2235" }}>
          Tap any node to see settings &darr;
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
  const availablePlatforms = (Object.keys(platformTranslations) as Platform[]).filter(
    (pid) => DISPLAYED_PLATFORM_IDS.has(pid),
  );
  const { preferredPlatform } = usePlatformStore();
  const initialTab: "physical" | Platform =
    preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)
      ? (preferredPlatform as Platform)
      : "physical";
  const [activeTab, setActiveTab] = useState<"physical" | Platform>(initialTab);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [hasUserSwitchedTab, setHasUserSwitchedTab] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [guitarLit, setGuitarLit] = useState(false);

  const { user } = useAuth();
  const userRole = user?.role ?? "free";
  const hasAllPlatforms = canViewAllPlatforms(userRole);

  useEffect(() => {
    if (hasUserSwitchedTab) return;
    if (preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)) {
      setActiveTab(preferredPlatform as Platform);
    }
  }, [preferredPlatform, hasUserSwitchedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const unlockedPlatform = preferredPlatform && availablePlatforms.includes(preferredPlatform as Platform)
    ? preferredPlatform as Platform
    : availablePlatforms[0] ?? null;

  function isPlatformLocked(pid: Platform): boolean {
    if (hasAllPlatforms) return false;
    return pid !== unlockedPlatform;
  }

  // Animation state
  const [animStep, setAnimStep] = useState(-1);
  const [animComplete, setAnimComplete] = useState(false);

  const nodeCount = activeTab === "physical"
    ? signalChain.length
    : (platformTranslations[activeTab as Platform]?.chain_blocks.length ?? 0);

  useEffect(() => {
    setAnimStep(-1);
    setAnimComplete(false);
    setGuitarLit(false);
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimComplete(true);
      setGuitarLit(true);
      return;
    }
    let step = -1; // -1 = guitar pulse
    let timerId: ReturnType<typeof setInterval> | null = null;
    const delay = setTimeout(() => {
      // Light guitar first
      setGuitarLit(true);
      step = 0;
      timerId = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step > nodeCount) {
          if (timerId) clearInterval(timerId);
          setAnimComplete(true);
        }
      }, 400);
    }, 500);
    return () => {
      clearTimeout(delay);
      if (timerId) clearInterval(timerId);
    };
  }, [nodeCount, activeTab]);

  const activePlatformMeta = PLATFORMS.find((p) => p.id === activeTab);
  const activeTranslation = activeTab !== "physical" ? platformTranslations[activeTab] : null;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  function handleTabSwitch(tab: "physical" | Platform) {
    setActiveTab(tab);
    setSelectedNodeIndex(null);
    setHasUserSwitchedTab(true);
  }

  const selectedPhysicalNode =
    activeTab === "physical" && selectedNodeIndex !== null ? signalChain[selectedNodeIndex] : undefined;
  const selectedPlatformBlock =
    activeTab !== "physical" && selectedNodeIndex !== null && activeTranslation
      ? activeTranslation.chain_blocks[selectedNodeIndex] : undefined;

  // Guitar SVG
  const guitarKey = getGuitarKey(guitarSpecs.model_name);
  const guitarPath = GUITAR_PATHS[guitarKey] || GUITAR_PATHS.strat;
  const AMBER = "#d4a853";

  // Build node list for renderer
  const physicalNodes = signalChain.map((n) => ({
    name: n.gear_name,
    category: n.category,
    subcategory: n.subcategory,
    color: getPretextColor(n.category, n.subcategory),
    borderColor: getPretextBorder(n.category, n.subcategory),
  }));

  const platformNodes = activeTranslation?.chain_blocks.map((b) => ({
    name: b.block_name,
    category: b.block_category,
    subcategory: null as string | null,
    color: getPretextColor(b.block_category),
    borderColor: getPretextBorder(b.block_category),
  })) ?? [];

  // ── Cable SVG refs + measurement ──
  const cardRef = useRef<HTMLDivElement>(null);
  const guitarBoxRef = useRef<HTMLDivElement>(null);
  const firstNodeRef = useRef<HTMLDivElement>(null);
  const cablePathRef = useRef<SVGPathElement>(null);
  const cableDotRef = useRef<SVGCircleElement>(null);
  const cableSvgRef = useRef<SVGSVGElement>(null);
  const bezierRef = useRef({ sx: 0, sy: 0, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0, ex: 0, ey: 0 });
  const [cablePath, setCablePath] = useState("");
  const [cableSvgSize, setCableSvgSize] = useState({ w: 0, h: 0 });
  const CABLE_OFFSET_X = 0; // no overhang needed for gentle diagonal

  // Cubic bezier helper
  const cubicBezier = useCallback((t: number, p0: number, p1: number, p2: number, p3: number) => {
    const m = 1 - t;
    return m*m*m*p0 + 3*m*m*t*p1 + 3*m*t*t*p2 + t*t*t*p3;
  }, []);

  // Measure cable path from guitar box to first node
  const measureCable = useCallback(() => {
    const card = cardRef.current;
    const gbox = guitarBoxRef.current;
    const node0 = firstNodeRef.current;
    if (!card || !gbox || !node0) return;
    const cr = card.getBoundingClientRect();
    const gr = gbox.getBoundingClientRect();
    const nr = node0.getBoundingClientRect();
    if (cr.width === 0 || nr.width === 0) return;

    const sx = gr.left + gr.width / 2 - cr.left;
    const sy = gr.bottom - cr.top + 2;
    const ex = nr.left - cr.left;
    const ey = nr.top + nr.height / 2 - cr.top;

    // L-shape cable: straight down from guitar, soft 90° bend, then horizontal into first node
    // Corner point: where the vertical meets the horizontal
    const cornerX = sx;
    const cornerY = ey;
    const bendRadius = Math.min(40, Math.abs(ey - sy) * 0.4, Math.abs(ex - sx) * 0.4);

    // Path: vertical line down, then a quadratic curve for the bend, then horizontal line to node
    const vertEndY = cornerY - bendRadius;
    const horizStartX = cornerX + bendRadius;

    const pathD = [
      `M ${sx} ${sy}`,                                    // Start at guitar bottom
      `L ${sx} ${vertEndY}`,                               // Straight down
      `Q ${cornerX} ${cornerY} ${horizStartX} ${cornerY}`, // Smooth 90° bend
      `L ${ex} ${ey}`,                                     // Horizontal to first node
    ].join(" ");

    setCablePath(pathD);
    setCableSvgSize({ w: cr.width + CABLE_OFFSET_X + 20, h: cr.height + 20 });

    // For dot animation, approximate as cubic bezier
    const cp1x = sx;
    const cp1y = cornerY - bendRadius * 0.3;
    const cp2x = cornerX + bendRadius * 0.3;
    const cp2y = ey;
    bezierRef.current = { sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey };
  }, [CABLE_OFFSET_X]);

  // Measure on mount + resize
  useEffect(() => {
    // Delay to let layout settle
    const t = setTimeout(measureCable, 100);
    window.addEventListener("resize", measureCable);
    return () => { clearTimeout(t); window.removeEventListener("resize", measureCable); };
  }, [measureCable, activeTab]);

  // Re-measure when animation starts (nodes may shift)
  useEffect(() => {
    if (animStep >= 0) measureCable();
  }, [animStep, measureCable]);

  // Cable dot animation — runs once when guitar lights up
  const cableDotAnimated = useRef(false);
  useEffect(() => {
    if (!guitarLit || cableDotAnimated.current) return;
    cableDotAnimated.current = true;
    const dot = cableDotRef.current!;
    if (!dot) return;
    const { sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey } = bezierRef.current;
    if (sx === 0 && sy === 0) return;

    const ms = 700;
    const start = performance.now();
    dot.setAttribute("opacity", "1");

    function frame(now: number) {
      const t = Math.min((now - start) / ms, 1);
      const x = cubicBezier(t, sx, cp1x, cp2x, ex);
      const y = cubicBezier(t, sy, cp1y, cp2y, ey);
      dot.setAttribute("transform", `translate(${x},${y})`);
      if (t < 1) requestAnimationFrame(frame);
      else dot.setAttribute("opacity", "0");
    }
    requestAnimationFrame(frame);
  }, [guitarLit, cubicBezier]);

  // Reset cable dot on tab switch
  useEffect(() => {
    cableDotAnimated.current = false;
  }, [activeTab]);

  return (
    <div
      ref={cardRef}
      className={
        isFullscreen
          ? "fixed inset-x-0 top-16 bottom-0 z-[60] flex flex-col bg-[#161d2f] overflow-y-auto"
          : "rounded-2xl border border-[#1e2840] bg-[#161d2f]"
      }
      style={{ position: isFullscreen ? "fixed" : "relative", overflow: isFullscreen ? "auto" : "visible" }}
    >

      {/* ── Cable SVG — extends left of card, connects guitar to first node ── */}
      {cablePath && (
        <svg
          ref={cableSvgRef}
          style={{
            position: "absolute", top: 0, left: 0,
            pointerEvents: "none", overflow: "visible", zIndex: 1,
          }}
          width={cableSvgSize.w}
          height={cableSvgSize.h}
          fill="none"
        >
          <path
            ref={cablePathRef}
            d={cablePath}
            stroke="#1e304a"
            strokeWidth="2"
            strokeDasharray="6 5"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <radialGradient id="cable-grd">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <filter id="cable-glow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle
            ref={cableDotRef}
            r="6"
            fill="url(#cable-grd)"
            filter="url(#cable-glow)"
            opacity="0"
          />
        </svg>
      )}

      {/* ── Platform tabs (ABOVE guitar) ── */}
      <div
        role="tablist"
        aria-label="Signal chain platform"
        style={{
          borderBottom: "1px solid #1a2235",
          padding: "14px 24px",
          display: "flex", gap: 8, flexWrap: "wrap",
          background: "#131829",
          borderRadius: "18px 18px 0 0",
          position: "relative", zIndex: 3,
        }}
      >
        <button
          role="tab"
          aria-selected={activeTab === "physical"}
          onClick={() => handleTabSwitch("physical")}
          style={{
            padding: "6px 15px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: activeTab === "physical" ? `1.5px solid ${AMBER}` : "1.5px solid transparent",
            background: activeTab === "physical" ? `${AMBER}18` : "transparent",
            color: activeTab === "physical" ? AMBER : "#4a5e78",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s",
          }}
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
              style={{
                padding: "6px 15px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: isActive ? `1.5px solid ${meta?.color}` : "1.5px solid transparent",
                background: isActive ? `${meta?.color}18` : "transparent",
                color: locked ? "#4a5e7850" : isActive ? meta?.color : "#4a5e78",
                cursor: locked ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              {locked ? (
                <Lock style={{ width: 12, height: 12 }} />
              ) : (
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta?.color }} />
              )}
              {meta?.label || pid}
            </button>
          );
        })}
      </div>

      {/* ── Guitar section (below tabs) ── */}
      <div style={{
        padding: "24px 24px 20px",
        display: "flex", gap: 20, alignItems: "flex-start",
        position: "relative", zIndex: 3,
      }}>
        {/* Guitar SVG box */}
        <div
          ref={guitarBoxRef}
          style={{
            width: 90, height: 90, flexShrink: 0,
            borderRadius: 13, border: `1.5px solid ${AMBER}`,
            background: "#0b0f1a",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "box-shadow 0.3s",
            boxShadow: guitarLit ? `0 0 30px ${AMBER}77` : "none",
          }}
        >
          <svg viewBox={guitarPath.viewBox} width="34" height="52">
            <path
              d={guitarPath.d}
              fill={guitarLit ? AMBER : "#3a4e68"}
              style={{ transition: "fill 0.3s" }}
            />
          </svg>
        </div>

        {/* Guitar meta */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#5a7090", marginBottom: 5, fontWeight: 500 }}>Guitar</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#f0eadf", marginBottom: 16 }}>{guitarSpecs.model_name}</div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, color: "#3a4a60", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Pickups</div>
              <div style={{ fontSize: 13, color: "#c8d8e8", fontWeight: 600 }}>{guitarSpecs.pickup_config} ({guitarSpecs.pickup_position})</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#3a4a60", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Tuning</div>
              <div style={{ fontSize: 13, color: "#c8d8e8", fontWeight: 600 }}>
                {guitarSpecs.tuning
                  .replace(/_/g, " ")
                  .replace(/\beb\b/gi, "Eb")
                  .replace(/\bdb\b/gi, "Db")
                  .replace(/\bab\b/gi, "Ab")
                  .replace(/\bbb\b/gi, "Bb")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#3a4a60", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Strings</div>
              <div style={{ fontSize: 13, color: "#c8d8e8", fontWeight: 600 }}>{guitarSpecs.string_gauge}</div>
            </div>
          </div>
        </div>

        {/* Actions: download + fullscreen.
            Downloads render for anon + free + paid users. Auth/limit gating
            happens inside DownloadPatchButton — anon gets a signup modal,
            free at limit gets an upgrade modal, paid downloads directly.
            Platforms limited to Helix + Katana until QC/Fractal/Kemper
            presets are validated on real hardware. */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {recipeSlug && (activeTab === "helix" || activeTab === "katana") && activeTranslation && (
            <DownloadPatchButton
              recipeSlug={recipeSlug}
              presetName={presetName}
              platform={activeTab}
            />
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "#1e2840", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" style={{ color: "#5a6880" }} />
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8 2h3v3M5 11H2V8M11 2 7.5 5.5M2 11l3.5-3.5" stroke="#5a6880" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Chain section ── */}
      {activeTab === "physical" ? (
        <ChainRenderer
          nodes={physicalNodes}
          animStep={animStep}
          animComplete={animComplete}
          selectedNodeIndex={selectedNodeIndex}
          onNodeClick={(i) => setSelectedNodeIndex(selectedNodeIndex === i ? null : i)}
          firstNodeRef={firstNodeRef}
        />
      ) : activeTranslation ? (
        <>
          <ChainRenderer
            nodes={platformNodes}
            animStep={animStep}
            animComplete={animComplete}
            selectedNodeIndex={selectedNodeIndex}
            onNodeClick={(i) => setSelectedNodeIndex(selectedNodeIndex === i ? null : i)}
            firstNodeRef={firstNodeRef}
          />
          {activeTranslation.notes && selectedNodeIndex === null && (
            <div style={{ margin: "0 16px 16px", padding: 16, borderRadius: 8, background: "#0b0f1a" }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: activePlatformMeta?.color }}>Tips</p>
              <p style={{ marginTop: 4, fontSize: 14, lineHeight: 1.6, color: "#7a8fa8" }}>{activeTranslation.notes}</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: 32, textAlign: "center", fontSize: 14, color: "#4a5e78" }}>
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
}
