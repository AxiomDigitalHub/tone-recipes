import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getArtistBySlug, getSongBySlug } from "@/lib/data";
import { getBandName } from "@/lib/song-band";
import { monogramFor } from "@/components/v3/LpArt";
import type { ToneRecipe } from "@/types/recipe";

/**
 * A tone recipe as a card: real album cover, song title, who played it,
 * year and block count. Used on the home page and wherever recipes are
 * listed. Server component.
 */
export default function ToneCard({ recipe, eager = false }: { recipe: ToneRecipe; eager?: boolean }) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const band = song ? getBandName(song, artist) : null;
  const blocks = recipe.signal_chain?.length ?? 0;
  return (
    <Link href={`/recipe/${recipe.slug}`} className="fk-card">
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
        <p className="fk-card-meta">
          {[song?.year, blocks ? `${blocks} blocks` : null].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
