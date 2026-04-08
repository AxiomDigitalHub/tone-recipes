import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Set Packs — Genre Presets for Your Whole Setlist",
  description:
    "One preset with 8 snapshots that covers your entire gig. Worship, Classic Rock, 90s, Blues, and more. Each includes a Setlist Mapper.",
};

const packs = [
  {
    slug: "worship",
    name: "Worship",
    description: "AC30 + Klon + delays + shimmer. 8 snapshots from clean ambient to rock crunch. 30 songs mapped.",
    status: "available" as const,
    songCount: 30,
  },
  {
    slug: "classic-rock",
    name: "Classic Rock",
    description: "JCM800 foundation. Hotel California to Welcome to the Jungle in one preset.",
    status: "coming-soon" as const,
    songCount: 40,
  },
  {
    slug: "90s-alternative",
    name: "90s / Alternative",
    description: "Nirvana to Pearl Jam to RHCP. Grunge, alternative, and everything in between.",
    status: "coming-soon" as const,
    songCount: 35,
  },
  {
    slug: "blues",
    name: "Blues",
    description: "Fender Deluxe base. SRV to Clapton to Mayer. Clean-to-crunch gain staging.",
    status: "coming-soon" as const,
    songCount: 30,
  },
];

export default function SetPacksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold md:text-5xl">Set Packs</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        One preset with 8 snapshots that covers your entire gig. Each pack includes a Setlist Mapper
        showing which snapshot to use for every song.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {packs.map((pack) => (
          <div
            key={pack.slug}
            className={`rounded-2xl border p-6 transition-all ${
              pack.status === "available"
                ? "border-accent/40 bg-accent/5 hover:border-accent"
                : "border-border bg-surface opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{pack.name}</h2>
              {pack.status === "coming-soon" && (
                <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">{pack.description}</p>
            <p className="mt-3 text-xs text-muted/60">{pack.songCount} songs mapped</p>
            {pack.status === "available" ? (
              <Link
                href={`/set-packs/${pack.slug}`}
                className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                View Set Pack
              </Link>
            ) : (
              <p className="mt-4 text-xs text-muted">Notify me when available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
