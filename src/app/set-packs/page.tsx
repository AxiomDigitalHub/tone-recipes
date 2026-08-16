import type { Metadata } from "next";
import Link from "next/link";
import SetPackInterestForm from "@/components/set-packs/SetPackInterestForm";

export const metadata: Metadata = {
  alternates: { canonical: "/set-packs" },
  title: "Set Packs — Genre Presets for Your Whole Setlist",
  description:
    "One preset with 8 snapshots that covers your entire gig. Worship, Classic Rock, 90s, Blues, and more. Each includes a Setlist Mapper.",
};

const packs = [
  {
    slug: "worship",
    name: "Worship",
    description: "AC30 + Klon + delays + shimmer. 8 snapshots from clean ambient to rock crunch.",
    status: "available" as const,
  },
  {
    slug: "classic-rock",
    name: "Classic Rock",
    description: "JCM800 foundation. Hotel California to Welcome to the Jungle in one preset.",
    status: "coming-soon" as const,
  },
  {
    slug: "90s-alternative",
    name: "90s / Alternative",
    description: "Nirvana to Pearl Jam to RHCP. Grunge, alternative, and everything in between.",
    status: "coming-soon" as const,
  },
  {
    slug: "blues",
    name: "Blues",
    description: "Fender Deluxe base. SRV to Clapton to Mayer. Clean-to-crunch gain staging.",
    status: "coming-soon" as const,
  },
];

export default function SetPacksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="page-title page-title-md">Set Packs</h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--ink-muted)]">
        One preset with 8 snapshots that covers your entire gig. Each pack includes a Setlist Mapper
        showing which snapshot to use for every song.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {packs.map((pack) => (
          <div
            key={pack.slug}
            className={`rounded-2xl border p-6 transition-all ${
              pack.status === "available"
                ? "border-[var(--amber)]/40 bg-[var(--amber)]/5 hover:border-[var(--amber)]"
                : "border-[var(--ink)]/15 bg-[var(--paper-2)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--ink)]">{pack.name}</h2>
              {pack.status === "coming-soon" && (
                <span className="rounded-full border border-[var(--ink)]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{pack.description}</p>
            {pack.status === "available" ? (
              <Link
                href={`/set-packs/${pack.slug}`}
                className="mt-4 inline-block rounded-lg bg-[var(--amber)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)]"
              >
                View Set Pack
              </Link>
            ) : (
              <SetPackInterestForm packSlug={pack.slug} packName={pack.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
