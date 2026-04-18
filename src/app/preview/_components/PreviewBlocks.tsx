"use client";

import { useMemo } from "react";
import PreviewKnob from "./PreviewKnob";

/**
 * Block renderers for the preview recipe page. Mirrors the Claude Design
 * prototype's Pedal / AmpBlock / SourceBlock trio, ported to React with
 * props shaped for our actual recipe data.
 *
 * Every block takes a `PreviewBlockData` shape that the page-level mapper
 * produces from the real `signal_chain[]` + `platform_translations[]`
 * data. This isolation means the visual can be redesigned without touching
 * our data model.
 */

export interface PreviewBlockData {
  /** Display name, e.g. "Hiwatt DR103" or "Ibanez TS808". */
  name: string;
  /** Spec-sheet subtitle, e.g. "100W · Master on 4, channels jumped". */
  sub: string;
  /** Which block variant to render. */
  variant: "source" | "pedal" | "amp" | "cab";
  /** Pedal color for the chassis — ignored for non-pedal variants. */
  color?:
    | "black"
    | "green"
    | "red"
    | "orange"
    | "cream"
    | "silver"
    | "blue"
    | "purple";
  /** Knob labels in the order they should display. */
  controls: string[];
  /** Keyed by knob label — current value for the active platform. */
  values: Record<string, number>;
  /** Optional min/max overrides per control (Threshold, ratios, etc.). */
  ranges?: Record<string, { min?: number; max?: number }>;
  /** Optional serial string for pedal labels. */
  serial?: string;
  /** Optional eyebrow for source/cab blocks. */
  kind?: string;
}

/* ── Pedal chassis ────────────────────────────────────────────────────── */
export function PreviewPedal({ block }: { block: PreviewBlockData }) {
  const lightChassis = block.color === "cream" || block.color === "silver";
  return (
    <div className={`pedal pedal-${block.color ?? "black"} ${lightChassis ? "on-light" : ""}`}>
      <div className="pedal-header">
        <div>
          <div className="pedal-name">{block.name}</div>
          <div className="pedal-sub">{block.sub}</div>
        </div>
        <div>
          <div className="pedal-led" />
          {block.serial && (
            <div className="pedal-serial" style={{ marginTop: 6, textAlign: "right" }}>
              {block.serial}
            </div>
          )}
        </div>
      </div>
      <div className="pedal-knobs">
        {block.controls.map((c) => {
          const range = block.ranges?.[c];
          return (
            <PreviewKnob
              key={c}
              label={c}
              value={block.values[c] ?? 5}
              min={range?.min}
              max={range?.max ?? 10}
              size={40}
              interactive={false}
              onLight={lightChassis}
              onDark={!lightChassis}
            />
          );
        })}
      </div>
      <div className="pedal-footswitch" aria-hidden="true" />
    </div>
  );
}

/* ── Amp chassis ──────────────────────────────────────────────────────── */
export function PreviewAmpBlock({ block }: { block: PreviewBlockData }) {
  return (
    <div className="amp-block">
      <div className="pedal-header" style={{ marginBottom: 8, paddingBottom: 12 }}>
        <div>
          <div className="pedal-sub" style={{ marginTop: 0, marginBottom: 4 }}>
            Amplifier
          </div>
          <div className="pedal-name" style={{ fontSize: 16, maxWidth: 260 }}>
            {block.name}
          </div>
          <div className="pedal-sub">{block.sub}</div>
        </div>
      </div>
      <div className="amp-knobs">
        {block.controls.map((c) => {
          const range = block.ranges?.[c];
          return (
            <PreviewKnob
              key={c}
              label={c}
              value={block.values[c] ?? 5}
              min={range?.min}
              max={range?.max ?? 10}
              size={44}
              interactive={false}
              onDark
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Source / cab block (dashed outline, no knobs) ────────────────────── */
export function PreviewSourceBlock({ block }: { block: PreviewBlockData }) {
  return (
    <div className="source-block">
      <div className="eyebrow">{block.kind ?? block.variant}</div>
      <div className="src-name">{block.name}</div>
      <div className="src-sub">{block.sub}</div>
    </div>
  );
}

/* ── Signal chain — horizontal row of blocks with patch-cable connectors ── */
export function PreviewSignalChain({ blocks }: { blocks: PreviewBlockData[] }) {
  return (
    <div className="sigchain on-dark">
      {blocks.map((b, i) => {
        const el = (() => {
          if (b.variant === "source" || b.variant === "cab") return <PreviewSourceBlock block={b} />;
          if (b.variant === "amp") return <PreviewAmpBlock block={b} />;
          return <PreviewPedal block={b} />;
        })();
        return (
          <div key={`${b.name}-${i}`} style={{ display: "contents" }}>
            {i > 0 && <div className="chain-wire" aria-hidden="true" />}
            <div style={{ flexShrink: 0 }}>{el}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Per-block settings card (for the "broken out" section below the chain) ── */
export function PreviewBlockDetail({ block }: { block: PreviewBlockData }) {
  const visibleControls = useMemo(
    () => block.controls.filter((c) => block.values[c] !== undefined),
    [block],
  );
  return (
    <div className="block-detail">
      <div className="block-detail-head">
        <div>
          <div className="name">{block.name}</div>
          <div className="sub">{block.sub}</div>
        </div>
        <span className="kind">{block.variant}</span>
      </div>
      <div className="block-settings">
        {visibleControls.map((c) => {
          const range = block.ranges?.[c];
          return (
            <PreviewKnob
              key={c}
              label={c}
              value={block.values[c] ?? 5}
              min={range?.min}
              max={range?.max ?? 10}
              size={52}
              interactive={false}
            />
          );
        })}
      </div>
    </div>
  );
}
