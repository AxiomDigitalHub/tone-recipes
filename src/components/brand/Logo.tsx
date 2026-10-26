import { useId } from "react";
import {
  WORDMARK_VIEWBOX,
  WORDMARK_F,
  WORDMARK_REST,
  MONOGRAM_VIEWBOX,
  MONOGRAM_F,
  MONOGRAM_REST,
} from "./logo-paths";

/**
 * Brand palette for the logo. Built only from existing v3 tokens
 * (tape red → amber → a lighter amber highlight) so the mark reads as a
 * guitar-finish sunburst without introducing new site colors.
 */
export const BRAND = {
  ink: "#0A0908",
  paper: "#EDEAE4",
  sunburst: ["#D8342B", "#E4A235", "#F3C871"] as const,
};

/**
 * - "ink":      solid ink. For paper/light backgrounds (the default).
 * - "paper":    solid paper. For ink/dark backgrounds.
 * - "sunburst": the whole mark in the gradient. For dark backgrounds only.
 */
export type LogoTone = "ink" | "paper" | "sunburst";

type Props = {
  tone?: LogoTone;
  className?: string;
  /** Accessible name; pass "" when the mark sits next to visible text. */
  title?: string;
};

function Sunburst({ id, x2 }: { id: string; x2: number }) {
  const [a, b, c] = BRAND.sunburst;
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={x2} y2="0">
      <stop offset="0" stopColor={a} />
      <stop offset="0.5" stopColor={b} />
      <stop offset="1" stopColor={c} />
    </linearGradient>
  );
}

function LogoSvg({
  viewBox,
  fPaths,
  restPaths,
  fullSpan,
  tone = "ink",
  className,
  title = "Fader & Knob",
}: Props & {
  viewBox: string;
  fPaths: readonly string[];
  restPaths: readonly string[];
  fullSpan: number;
}) {
  const id = useId().replace(/:/g, "");
  const gradId = `fk-sb-${id}`;
  const fill =
    tone === "sunburst" ? `url(#${gradId})` : tone === "paper" ? BRAND.paper : BRAND.ink;
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {tone === "sunburst" && (
        <defs>
          <Sunburst id={gradId} x2={fullSpan} />
        </defs>
      )}
      {[...fPaths, ...restPaths].map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
    </svg>
  );
}

/** Full "Fader&Knob" brush-script wordmark. Size it with a height class. */
export function Wordmark(props: Props) {
  return (
    <LogoSvg
      {...props}
      viewBox={WORDMARK_VIEWBOX}
      fPaths={WORDMARK_F}
      restPaths={WORDMARK_REST}
      fullSpan={1068}
    />
  );
}

/** "F&K" monogram, for tight spaces (mobile header, avatars, icons). */
export function Monogram(props: Props) {
  return (
    <LogoSvg
      {...props}
      viewBox={MONOGRAM_VIEWBOX}
      fPaths={MONOGRAM_F}
      restPaths={MONOGRAM_REST}
      fullSpan={494}
    />
  );
}
