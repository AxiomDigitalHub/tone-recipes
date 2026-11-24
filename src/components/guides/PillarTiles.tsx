import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Thumb from "@/components/gear/Thumb";
import { PILLARS } from "@/lib/pillars";

/**
 * The five pillar tiles: on Learn, on /guides, and (minus the current
 * one) at the foot of each pillar page.
 */
export default function PillarTiles({ exclude, heading = "h2" }: { exclude?: string; heading?: "h2" | "h3" }) {
  const H = heading;
  return (
    <div className="fk-learn-topics">
      {PILLARS.filter((p) => p.slug !== exclude).map((p) => (
        <Link key={p.slug} href={`/guides/${p.slug}`} className="fk-card">
          <Thumb {...p.art} />
          <div className="fk-card-body">
            <div className="fk-card-head">
              <H className="fk-t3">{p.title}</H>
              <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
            </div>
            <p className="fk-body-sm">{p.blurb}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
