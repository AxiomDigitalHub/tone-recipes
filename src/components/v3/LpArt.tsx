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
  /**
   * Load eagerly and hint high fetch priority.
   *
   * next/image defaults every image to `loading="lazy"`, which is right for
   * the 210 tiles on /browse and wrong for a cover that sits at or near the
   * first screen. The homepage featured sleeve lands around y=686 — inside a
   * 900px viewport but below the fold on a shorter laptop — so lazily it
   * renders as an empty 132px box until the reader scrolls. Set this for any
   * LpArt that is part of the initial view.
   */
  priority?: boolean;
}

/**
 * Rendered size of the cover, in CSS pixels. The widest LpArt on the site is
 * `.recipe-art-lp` at `max-width: 360px`; cards are smaller.
 *
 * This is a fixed `width`/`height` rather than `fill` on purpose. With
 * `fill`, next/image builds a `w`-descriptor srcSet, and `sizes` can only
 * ever raise the FLOOR of that list — it cannot drop the top end. So every
 * tile shipped five candidates (640/750/828/1080/1200) even though the
 * source covers are 600x600 iTunes thumbnails, making 828 and up upscales
 * that no viewport could select. On /browse that was 210 tiles x ~1.5KB of
 * unusable srcSet. Fixed dimensions switch Next to an `x`-descriptor pair
 * (1x/2x), which is all a 360px box can use.
 *
 * `.lp-cover-img` pins the image to the container with `inset: 0` and
 * `width/height: 100%`, so it fills exactly as `fill` did.
 */
const COVER_PX = 360;

export function LpArt({
  cover,
  monogram,
  showMonogram = false,
  showRecord = false,
  meta,
  hue,
  shape = "square",
  alt = "",
  priority = false,
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
          width={COVER_PX}
          height={COVER_PX}
          priority={priority}
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
