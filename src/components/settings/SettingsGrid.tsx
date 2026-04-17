import type { ReactNode, CSSProperties } from "react";

/**
 * <SettingsGrid> — a horizontal row/grid wrapper for <Knob> and <Fader>
 * components. Use inside MDX when documenting a pedal or amp's settings.
 *
 * Example:
 *   <SettingsGrid>
 *     <Knob name="Gain" value={5} />
 *     <Knob name="Bass" value={4.5} />
 *     <Knob name="Mid" value={5.5} />
 *   </SettingsGrid>
 *
 * By default children wrap onto multiple rows at narrow widths. Pass
 * `title` to render a "chassis label" above the row (looks like a pedal
 * enclosure with the brand/gear name stamped on it).
 */

export interface SettingsGridProps {
  children: ReactNode;
  /** Optional chassis label — e.g. "Pre-amp", "Boss SD-1", "Marshall JCM800". */
  title?: string;
  /** Secondary descriptor under the title. Often the gear name or setting group. */
  subtitle?: string;
  /** Gap between items. Default "md" matches a comfortable pedal spacing. */
  gap?: "sm" | "md" | "lg";
}

const GAP_MAP = {
  sm: 16,
  md: 24,
  lg: 36,
} as const;

export default function SettingsGrid({
  children,
  title,
  subtitle,
  gap = "md",
}: SettingsGridProps) {
  const gapPx = GAP_MAP[gap];

  const wrapperStyle: CSSProperties = {
    // Chassis look — thin border, inset panel feel. Matches the dark UI.
    display: "block",
    padding: "24px",
    margin: "20px 0",
    borderRadius: 14,
    border: "1px solid var(--color-border, #1e2840)",
    backgroundColor: "var(--color-surface, rgba(11, 15, 26, 0.6))",
    // Subtle inner shadow for the "panel" depth cue. Accessibility-safe.
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 2px rgba(0,0,0,0.4)",
  };

  const headerStyle: CSSProperties = {
    marginBottom: title || subtitle ? 18 : 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const gridStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: gapPx,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  };

  return (
    <div style={wrapperStyle}>
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--color-accent, #f59e0b)",
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-foreground, #e2e8f0)",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
      <div style={gridStyle}>{children}</div>
    </div>
  );
}
