import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getArtistBySlug, getSongBySlug } from "@/lib/data";
import { getBandName } from "@/lib/song-band";
import { monogramFor } from "@/components/v3/LpArt";
import TrackedLink from "@/components/analytics/TrackedLink";
import type { EventName } from "@/lib/analytics";
import type { ToneRecipe } from "@/types/recipe";

/**
 * A tone recipe as a card: real album cover, song title, who played it,
 * and year. Used on the home page and wherever recipes are
 * listed. Server component.
 */
export default function ToneCard({
  recipe,
  eager = false,
  track,
  rigTokens,
}: {
  recipe: ToneRecipe;
  eager?: boolean;
  /** Fire an analytics event on click (browse does). */
  track?: { event: EventName; params?: Record<string, string | number | boolean | undefined> };
  /** Gear tokens for the browse page's "Match my rig" filter. */
  rigTokens?: string;
}) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const band = song ? getBandName(song, artist) : null;
  const inner = (
    <>
      <div className="fk-card-art">
        {song?.album_art_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={song.album_art_url}
            alt={`${song.album ?? song.title} album cover`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span className="fk-t2" aria-hidden="true">
            {monogramFor(artist?.name)}
          </span>
        )}
      </div>
      <div className="fk-card-body">
        <div className="fk-card-head">
          <h3 className="fk-t3">{song?.title ?? recipe.title}</h3>
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
        </div>
        <p className="fk-body-sm">{[band, artist?.name].filter(Boolean).join(", ")}</p>
        {song?.year ? <p className="fk-card-meta">{song.year}</p> : null}
      </div>
    </>
  );
  const href = `/recipe/${recipe.slug}`;
  if (track) {
    return (
      <TrackedLink href={href} className="fk-card" data-rig-tokens={rigTokens} event={track.event} eventParams={track.params}>
        {inner}
      </TrackedLink>
    );
  }
  return (
    <Link href={href} className="fk-card" data-rig-tokens={rigTokens}>
      {inner}
    </Link>
  );
}
