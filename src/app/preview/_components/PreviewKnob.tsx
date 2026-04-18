"use client";

import { useEffect, useRef, useState } from "react";

/**
 * <PreviewKnob> — the hardware-catalog-style knob from the 2026-04-18
 * Claude Design prototype. Ported to React + typed props.
 *
 * The visual is driven entirely by the `--value` CSS custom property the
 * parent sets, so the knob body + indicator + tick ring are all styled in
 * preview.css. This component just wires up the DOM, the drag-to-change
 * interaction, and the value/label HTML nodes.
 *
 * Interaction: mouse-down + vertical drag adjusts the value; 120 vertical
 * pixels equals a full sweep of `max`. Release to commit.
 */

export interface PreviewKnobProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  size?: number;
  interactive?: boolean;
  onChange?: (next: number) => void;
  /** Override the printed value text (for range displays like "5.5–6.0"). */
  display?: string;
  /** Render label/value on a dark background (flips text colors). */
  onDark?: boolean;
  /** Render knob body with the pedal-cream metal look. */
  onLight?: boolean;
}

export default function PreviewKnob({
  value,
  max = 10,
  min = 0,
  label,
  size = 56,
  interactive = true,
  onChange,
  display,
  onDark = false,
  onLight = false,
}: PreviewKnobProps) {
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const startY = useRef(0);
  const startV = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleDown = (e: React.MouseEvent) => {
    if (!interactive || !onChange) return;
    setDragging(true);
    startY.current = e.clientY;
    startV.current = value;
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const dy = startY.current - e.clientY;
      const range = max - min || 1;
      const next = Math.max(min, Math.min(max, startV.current + dy * (range / 120)));
      onChange?.(Math.round(next * 10) / 10);
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, max, min, onChange]);

  const printed =
    display ??
    (Number.isInteger(value) ? value.toString() : value.toFixed(1));

  // 11 tick marks spanning the 270° sweep — 5th = noon, 1st and 11th = extremes.
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = -135 + i * 27;
    const rad = (angle * Math.PI) / 180;
    const r1 = 48;
    const r2 = 50;
    return {
      x1: 50 + r1 * Math.sin(rad),
      y1: 50 - r1 * Math.cos(rad),
      x2: 50 + r2 * Math.sin(rad),
      y2: 50 - r2 * Math.cos(rad),
      key: i,
      major: i % 5 === 0,
    };
  });

  const wrapperClass = [
    "knob",
    onDark ? "on-dark" : "",
    onLight ? "on-light" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClass}
      data-interactive={interactive ? "true" : "false"}
      style={
        {
          "--size": `${size}px`,
          "--value": norm.toString(),
        } as React.CSSProperties
      }
      onMouseDown={handleDown}
      role="meter"
      aria-label={label ? `${label}: ${printed}` : `Knob: ${printed}`}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      <div className="knob-ticks">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {ticks.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth={t.major ? 1.4 : 0.8}
              opacity={0.3}
            />
          ))}
        </svg>
      </div>
      <div className="knob-dial">
        <div className="knob-indicator" />
      </div>
      {label && <div className="knob-label">{label}</div>}
      <div className="knob-value">{printed}</div>
    </div>
  );
}
