import Image from "next/image";

interface LpArtProps {
  /** Album cover URL — when present, becomes the LP body. */
  cover?: string | null;
  /** Artist initials in display serif (e.g. "SRV"). */
  monogram: string;
  /** "10 BLOCKS" / "Side A" / etc. — small mono chip at bottom-right. */
  meta?: string | null;
  /** Hue index 1–6 for fallback label color. */
  hue: number;
  /** Square (default) or 16:10 banner. */
  shape?: "square" | "banner";
  alt?: string;
}

export function LpArt({
  cover,
  monogram,
  meta,
  hue,
  shape = "square",
  alt = "",
}: LpArtProps) {
  const cls = [
    "lp-art",
    `lp-hue-${((hue - 1) % 6) + 1}`,
    shape === "banner" ? "lp-art-banner" : "",
    cover ? "has-cover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} aria-hidden={alt ? undefined : true}>
      {cover && (
        <Image
          src={cover}
          alt={alt}
          fill
          sizes="(max-width: 600px) 50vw, 360px"
          className="lp-cover-img"
        />
      )}
      <span className="lp-record" />
      <span className="lp-tonecode">{monogram}</span>
      {meta && <span className="lp-blocks">{meta}</span>}
    </div>
  );
}

/** Build a 2-3 letter monogram from an artist name. */
export function monogramFor(name: string | undefined): string {
  if (!name) return "??";
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}
