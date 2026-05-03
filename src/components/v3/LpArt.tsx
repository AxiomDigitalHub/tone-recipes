import Image from "next/image";

interface LpArtProps {
  /** Album cover URL — when present, becomes the LP body. */
  cover?: string | null;
  /** Artist initials in display serif (e.g. "SRV"). Hidden by default on
   *  cards because it covered the album cover; opt in with showMonogram. */
  monogram?: string;
  /** Set true to render the italic monogram top-left over the cover. */
  showMonogram?: boolean;
  /** Set true to render the spinning LP-disc overlay. Off by default —
   *  the album cover stands alone on cards. */
  showRecord?: boolean;
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
  showMonogram = false,
  showRecord = false,
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
    showRecord ? "" : "no-record",
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
      {showRecord && <span className="lp-record" />}
      {showMonogram && monogram && (
        <span className="lp-tonecode">{monogram}</span>
      )}
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
