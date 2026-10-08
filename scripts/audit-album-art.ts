/**
 * Verifies song album_art_url values by cross-referencing iTunes Search.
 *
 * Two bugs made this report unreadable before 2026-08-10, and both produced
 * *false* flags rather than missed ones — which is worse, because a report
 * where a third of the entries are known-noise is a report nobody reads, and
 * the one real mismatch we ever caught (Killing in the Name pointing at a
 * Beartooth cover) would have been invisible inside it.
 *
 * 1. It searched by guitarist. `artists` is our guitarist table (Dave Murray,
 *    K.K. Downing, Munky); iTunes indexes by the credited recording artist,
 *    which for most of the corpus is a band. "Wrathchild Dave Murray" returns
 *    nothing, so every band-credited song flagged. The band is recoverable
 *    from the song slug, which is `{title-slug}-{band-slug}` by construction.
 *
 * 2. It ignored rate limiting. The old 250ms throttle is ~240 requests/minute
 *    against an endpoint that allows roughly 20. Apple starts returning bare
 *    403s partway through a run, `fetch` yields no results, and the script
 *    recorded that as "no iTunes results" — indistinguishable, in the report,
 *    from a genuine data problem. A 205-song run at 3s is ~10 minutes, which
 *    is a fine price for a weekly job that actually means something.
 *
 * Result tiers (nothing is suppressed — tiers only decide reading order):
 *
 *   ✓ match       stored artwork is the artwork iTunes returns
 *   ⚠ review      iTunes returned tracks for this band and none carries our
 *                 artwork. This is the tier that has ever held a real bug.
 *   ? unverified  iTunes returned an empty result set for the query; the
 *                 check can't run, but iTunes did answer.
 *   ! error       iTunes refused to answer (non-ok status, empty body,
 *                 unparseable body, or all retries exhausted). This is a
 *                 problem with the run, NOT with our data — never "fix" a
 *                 song's album_art_url off the back of an error row.
 *
 * A sustained refusal aborts the run loudly instead of emitting a report full
 * of phantom flags. Note that bug 2 below recurred on 2026-10-08 through a
 * path the original fix missed: the abort guard counted only 403/429, while
 * `lookup` returns null for *every* refusal mode, and the caller collapsed
 * null into "unverified". A 69-song transient failure window (indices
 * 143-211) was reported as 69 data flags. The guard now counts refusals of
 * any kind, and the caller keeps null and [] apart as `lookup` always
 * promised.
 *
 * Run: `npx tsx scripts/audit-album-art.ts`
 */

import { songs } from "../src/lib/data";

interface ITunesResult {
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100?: string;
}

/** iTunes Search allows ~20 calls/minute. Stay under it. */
const THROTTLE_MS = 3_000;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Recover the band from `song.slug`, which is built as `{title}-{band}`.
 *
 * Walks the title's tokens against the slug's and returns what's left. Two
 * wrinkles the corpus actually contains: slugs spell "&" as "and" while the
 * slugified title drops it ("3s-and-7s-qotsa"), and slugs omit parentheticals
 * the title keeps ("Be Quiet and Drive (Far Away)"). Resolves 205/205 songs.
 */
export function bandFromSlug(song: { slug: string; title: string }): string | null {
  const titleTokens = slugify(song.title).split("-").filter(Boolean);
  const slugTokens = song.slug.split("-").filter(Boolean);
  let si = 0;
  let ti = 0;

  // Acronym case: "B.Y.O.B." slugifies to b-y-o-b, but the slug carries "byob".
  const collapsed = titleTokens.join("");
  if (slugTokens[0] === collapsed && collapsed.length > 1) {
    si = 1;
    ti = titleTokens.length;
  }

  while (si < slugTokens.length && ti < titleTokens.length) {
    if (slugTokens[si] === titleTokens[ti]) {
      si++;
      ti++;
    } else if (slugTokens[si] === "and") {
      si++; // slug spells out "&"
    } else {
      ti++; // title has a parenthetical the slug omits
    }
  }

  const rest = slugTokens.slice(si);
  return rest.length ? rest.join(" ") : null;
}

function normalizeArtworkPath(url: string): string {
  // iTunes URLs end with /SIZExSIZEbb.{jpg,png} — strip size to compare core path.
  return url.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, "");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let consecutiveRefusals = 0;

/** Returns null (not []) when the request was rejected, so callers can tell
 *  "iTunes has nothing" apart from "iTunes refused to answer". */
async function lookup(term: string): Promise<ITunesResult[] | null> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    term,
  )}&entity=song&limit=20`;

  for (let attempt = 0; attempt < 4; attempt++) {
    let res: Response;
    try {
      res = await fetch(url);
    } catch {
      await sleep(2_000 * (attempt + 1));
      continue;
    }

    if (res.status === 403 || res.status === 429) {
      noteRefusal(`iTunes returned ${res.status}`);
      await sleep(15_000 * (attempt + 1)); // back off hard
      continue;
    }

    if (!res.ok) return refused(`iTunes returned ${res.status}`);

    const body = await res.text();
    if (!body.trim()) return refused("iTunes returned an empty body");
    try {
      const data: { results: ITunesResult[] } = JSON.parse(body);
      consecutiveRefusals = 0;
      return data.results ?? [];
    } catch {
      return refused("iTunes returned an unparseable body");
    }
  }
  return refused("all retries exhausted");
}

/** A refusal is a problem with the run, not with our data. Twelve in a row
 *  means the run is no longer measuring anything, so abort instead of
 *  emitting a report full of phantom flags. */
function noteRefusal(why: string): void {
  consecutiveRefusals++;
  if (consecutiveRefusals >= 12) {
    throw new Error(
      `iTunes refused twelve requests in a row (${why}) — the run is not measuring anything.\n` +
        "Aborting rather than writing a report full of phantom flags.\n" +
        "Wait ~an hour and re-run; do not lower THROTTLE_MS.",
    );
  }
}

function refused(why: string): null {
  noteRefusal(why);
  return null;
}

type Status = "match" | "review" | "unverified" | "error";

interface Flag {
  status: Status;
  songSlug: string;
  band: string;
  title: string;
  album: string;
  storedUrl: string;
  candidates: { collection: string; artist: string; url: string }[];
}

async function main(): Promise<void> {
  const flags: Flag[] = [];
  const mins = Math.ceil((songs.length * THROTTLE_MS) / 60_000);
  console.log(
    `Auditing ${songs.length} song album_art_urls vs iTunes Search (~${mins} min at ${
      THROTTLE_MS / 1000
    }s/request)...\n`,
  );

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const band = bandFromSlug(song) ?? song.artist_slug.replace(/-/g, " ");
    process.stdout.write(`[${i + 1}/${songs.length}] ${band} — ${song.title}... `);

    const results = await lookup(`${song.title} ${band}`);
    const storedCore = normalizeArtworkPath(song.album_art_url ?? "");

    let status: Status;
    let candidates: Flag["candidates"] = [];

    if (results === null) {
      // iTunes refused to answer. Never a statement about our data.
      status = "error";
    } else if (results.length === 0) {
      status = "unverified";
    } else if (
      results.some((r) => r.artworkUrl100 && normalizeArtworkPath(r.artworkUrl100) === storedCore)
    ) {
      status = "match";
    } else {
      status = "review";
      // Prefer candidates whose artist actually looks like the band — that is
      // what makes the list worth reading when a real mismatch shows up.
      const bandKey = slugify(band);
      const onBand = results.filter((r) => slugify(r.artistName ?? "").includes(bandKey));
      candidates = (onBand.length ? onBand : results).slice(0, 5).map((r) => ({
        collection: r.collectionName,
        artist: r.artistName,
        url: r.artworkUrl100 ?? "",
      }));
    }

    flags.push({
      status,
      songSlug: song.slug,
      band,
      title: song.title,
      album: song.album,
      storedUrl: song.album_art_url ?? "",
      candidates,
    });

    console.log(
      { match: "✓ match", review: "⚠ REVIEW", unverified: "? unverified", error: "! ERROR" }[
        status
      ],
    );

    await sleep(THROTTLE_MS);
  }

  const by = (s: Status) => flags.filter((f) => f.status === s);

  console.log("\n=== Summary ===");
  console.log(`✓ Match:       ${by("match").length} / ${flags.length}`);
  console.log(`⚠ Review:      ${by("review").length} / ${flags.length}`);
  console.log(`? Unverified:  ${by("unverified").length} / ${flags.length}`);
  console.log(`! Error:       ${by("error").length} / ${flags.length}`);
  if (by("error").length > 0) {
    console.log(
      `\n  ${by("error").length} request(s) were refused by iTunes. Those rows say nothing\n` +
        "  about our stored artwork — re-run before acting on them.",
    );
  }

  const section = (heading: string, list: Flag[], withCandidates: boolean) => {
    if (list.length === 0) return;
    console.log(`\n=== ${heading} ===\n`);
    for (const f of list) {
      console.log(`${f.band} — ${f.title}  [${f.album}]`);
      console.log(`  song slug: ${f.songSlug}`);
      console.log(`  stored:    ${f.storedUrl}`);
      if (withCandidates && f.candidates.length) {
        console.log("  iTunes candidates:");
        for (const c of f.candidates) {
          console.log(`    - "${c.collection}" by ${c.artist}`);
          console.log(`      ${c.url}`);
        }
      }
      console.log("");
    }
  };

  section("REVIEW — iTunes has this band's tracks, none carries our artwork", by("review"), true);
  section("Unverified — iTunes returned an empty result set", by("unverified"), false);
  section(
    "ERROR — iTunes refused to answer; these rows are NOT data problems",
    by("error"),
    false,
  );
}

main().catch((err) => {
  console.error(`\n${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
