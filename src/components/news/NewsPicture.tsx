import Thumb from "@/components/gear/Thumb";
import { drawPattern } from "@/lib/gear/thumbs";
import { GUITARS, guitarSrc } from "@/lib/gear/guitars";
import type { NewsArt } from "@/lib/news-art";

/**
 * The picture for a news story, or nothing. See src/lib/news-art.ts for
 * the rules. `size` picks the lead (wide), row (small square) or article
 * form.
 */
export default function NewsPicture({ art, size }: { art: NewsArt; size: "lead" | "row" | "article" }) {
  if (art.kind === "none") return null;
  const ratio = size === "row" ? "1 / 1" : size === "lead" ? "16 / 10" : "16 / 9";
  const radius = size === "row" ? "r-md" : "r-lg";

  if (art.kind === "photo") {
    return (
      <figure className={`fk-newspic is-${size}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art.src} alt="" className={radius} style={{ aspectRatio: ratio }} loading={size === "row" ? "lazy" : "eager"} />
        <figcaption className="fk-caption">Photo: {art.credit}</figcaption>
      </figure>
    );
  }
  if (art.kind === "guitar") {
    const { bg } = drawPattern("plain", "g", art.spec.color);
    return (
      <div className={`fk-newspic is-${size}`}>
        <div className={`fk-thumb ${radius}`} style={{ background: bg, aspectRatio: ratio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={guitarSrc(art.guitar)} alt={GUITARS[art.guitar]} className="fk-newspic-guitar" loading="lazy" />
        </div>
      </div>
    );
  }
  return (
    <div className={`fk-newspic is-${size}`}>
      <Thumb spec={art.spec} gearHeight={size === "row" ? 84 : 230} ratio={ratio} radius={radius} />
    </div>
  );
}
