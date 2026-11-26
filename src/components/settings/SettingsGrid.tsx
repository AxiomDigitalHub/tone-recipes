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
    // Wash tile: no border, no shadow, squircle corners.
    display: "block",
    padding: "24px",
    margin: "20px 0",
    borderRadius: "var(--fk-r-lg, 20px)",
    border: 0,
    backgroundColor: "var(--fk-wash, #f6f6f4)",
    color: "var(--fk-ink, #131416)",
  };

  const headerStyle: CSSProperties = {
    marginBottom: title || subtitle ? 18 : 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const gridStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: gapPx,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  };

  return (
    <div className="fk-settings-grid" style={wrapperStyle}>
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && (
            <div
              style={{
                fontSize: 16,
                lineHeight: "22px",
                fontWeight: 600,
                color: "var(--fk-ink, #131416)",
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: 14,
                lineHeight: "20px",
                fontWeight: 400,
                color: "var(--fk-ink-2, #4a4f55)",
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
