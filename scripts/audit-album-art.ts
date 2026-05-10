/**
 * Verifies song album_art_url values by cross-referencing iTunes Search.
 *
 * For each song, queries iTunes for "title artist" and checks if the
 * stored album_art_url matches any artwork URL in the top results.
 * If not, flags it for manual review.
 *
 * Run: `npx tsx scripts/audit-album-art.ts`
 */

import { songs, artists } from "../src/lib/data";

interface ITunesResult {
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100?: string;
}

function normalizeArtworkPath(url: string): string {
  // iTunes URLs end with /SIZExSIZEbb.{jpg,png} — strip size to compare core path.
  return url.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, "");
}

async function lookup(title: string, artistName: string): Promise<ITunesResult[]> {
  const term = encodeURIComponent(`${title} ${artistName}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=20`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: { results: ITunesResult[] } = await res.json();
  return data.results ?? [];
}

interface Flag {
  songSlug: string;
  artist: string;
  title: string;
  storedUrl: string;
  itunesMatches: { collection: string; artist: string; url: string }[];
  status: "match" | "no-match" | "no-results";
}

async function main(): Promise<void> {
const flags: Flag[] = [];

console.log(`Auditing ${songs.length} song album_art_urls vs iTunes Search...\n`);

for (let i = 0; i < songs.length; i++) {
  const song = songs[i];
  const artist = artists.find((a) => a.slug === song.artist_slug);
  const artistName = artist?.name ?? song.artist_slug;
  process.stdout.write(`[${i + 1}/${songs.length}] ${artistName} — ${song.title}... `);

  const results = await lookup(song.title, artistName);
  const targetCore = normalizeArtworkPath(song.album_art_url ?? "");

  const ratmMatches = results.filter((r) =>
    r.artistName?.toLowerCase().includes(artistName.toLowerCase().split(" ").slice(-1)[0]),
  );

  const matched = results.find((r) => {
    if (!r.artworkUrl100) return false;
    return normalizeArtworkPath(r.artworkUrl100) === targetCore;
  });

  if (matched) {
    flags.push({
      songSlug: song.slug,
      artist: artistName,
      title: song.title,
      storedUrl: song.album_art_url ?? "",
      itunesMatches: [],
      status: "match",
    });
    console.log("✓ match");
  } else if (results.length === 0) {
    flags.push({
      songSlug: song.slug,
      artist: artistName,
      title: song.title,
      storedUrl: song.album_art_url ?? "",
      itunesMatches: [],
      status: "no-results",
    });
    console.log("? no iTunes results");
  } else {
    // Top 5 candidates whose artist name plausibly matches.
    const candidates = results
      .filter((r) =>
        r.artistName
          ?.toLowerCase()
          .includes(artistName.toLowerCase().split(" ").slice(-1)[0]),
      )
      .slice(0, 5)
      .map((r): { collection: string; artist: string; url: string } => ({
        collection: r.collectionName,
        artist: r.artistName,
        url: r.artworkUrl100 ?? "",
      }));
    flags.push({
      songSlug: song.slug,
      artist: artistName,
      title: song.title,
      storedUrl: song.album_art_url ?? "",
      itunesMatches: candidates,
      status: "no-match",
    });
    console.log(`⚠ no match (${candidates.length} candidates)`);
  }

  // Throttle iTunes API politely.
  await new Promise((r) => setTimeout(r, 250));
}

console.log("\n=== Summary ===");
const matched = flags.filter((f) => f.status === "match").length;
const noMatch = flags.filter((f) => f.status === "no-match").length;
const noResults = flags.filter((f) => f.status === "no-results").length;
console.log(`✓ Match:       ${matched} / ${flags.length}`);
console.log(`⚠ No match:    ${noMatch} / ${flags.length}`);
console.log(`? No results:  ${noResults} / ${flags.length}`);

if (noMatch > 0 || noResults > 0) {
  console.log("\n=== Flagged for review ===\n");
  for (const f of flags) {
    if (f.status === "match") continue;
    console.log(`${f.artist} — ${f.title}`);
    console.log(`  song slug: ${f.songSlug}`);
    console.log(`  stored:    ${f.storedUrl}`);
    if (f.itunesMatches.length === 0) {
      console.log(`  itunes:    (no artist-matching results)`);
    } else {
      console.log("  iTunes top candidates:");
      for (const c of f.itunesMatches) {
        console.log(`    - "${c.collection}" by ${c.artist}`);
        console.log(`      ${c.url}`);
      }
    }
    console.log("");
  }
}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
