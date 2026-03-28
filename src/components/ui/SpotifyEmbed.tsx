"use client";

interface SpotifyEmbedProps {
  trackId: string;
  /** Compact (80px) or full (152px). Default: compact */
  size?: "compact" | "full";
}

export default function SpotifyEmbed({
  trackId,
  size = "compact",
}: SpotifyEmbedProps) {
  const height = size === "compact" ? 80 : 152;

  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height={height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-xl border-0"
      title="Listen on Spotify"
    />
  );
}
