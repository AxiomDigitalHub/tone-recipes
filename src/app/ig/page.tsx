import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import IgSignup from "./IgSignup";

/**
 * /ig: the link-in-profile page for Instagram (docs/social-strategy/council/03).
 * Lists the latest posts published by the social v2 pipeline (read from Zernio,
 * server-side, hourly) with UTM-tagged links, plus the newsletter signup that
 * records utm_source/utm_content. Without ZERNIO_API_KEY in the server env it
 * falls back to fixed hub links, so the page never breaks.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "From Instagram",
  description: "The full settings behind every Fader & Knob post: Helix and HX Stomp settings, worship sounds, amp guides.",
  alternates: { canonical: "/ig" },
  robots: { index: false, follow: true },
};

interface Tile {
  href: string;
  title: string;
  kicker: string;
}

const KICKER: Record<string, string> = {
  sunday_sound: "Sunday sound",
  knob_card: "Knob card",
  worship_rig: "Worship rig",
  fix_it: "Fix-it",
};

const FALLBACK: Tile[] = [
  { href: "/platforms/helix", title: "Helix settings for every sound", kicker: "Helix" },
  { href: "/guides/amp-settings-and-tone", title: "Amp settings guides", kicker: "Guides" },
  { href: "/blog", title: "Latest fixes and walkthroughs", kicker: "Blog" },
];

function utm(path: string, content: string): string {
  const u = new URL(path, SITE_URL);
  u.searchParams.set("utm_source", "instagram");
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", "bio");
  u.searchParams.set("utm_content", content);
  return `${u.pathname}${u.search}`;
}

async function latestTiles(): Promise<Tile[]> {
  const key = process.env.ZERNIO_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch("https://zernio.com/api/v1/posts?status=published&limit=30", {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: { metadata?: Record<string, unknown> }[] } | { metadata?: Record<string, unknown> }[];
    const posts = Array.isArray(data) ? data : (data.posts ?? []);
    const seen = new Set<string>();
    const tiles: Tile[] = [];
    for (const p of posts) {
      const m = p.metadata ?? {};
      const path = typeof m.sourcePath === "string" && m.sourcePath.startsWith("/") ? m.sourcePath : null;
      const slot = typeof m.slotId === "string" ? m.slotId : null;
      if (!path || !slot || seen.has(path)) continue;
      seen.add(path);
      tiles.push({
        href: utm(path, slot),
        title: typeof m.headline === "string" ? m.headline : path,
        kicker: KICKER[String(m.format)] ?? "Settings",
      });
      if (tiles.length >= 12) break;
    }
    return tiles;
  } catch {
    return [];
  }
}

export default async function IgPage() {
  const tiles = await latestTiles();
  const list = tiles.length ? tiles : FALLBACK.map((t) => ({ ...t, href: utm(t.href, "bio-hub") }));
  return (
    <div className="fk-wrap fkp-page">
      <div className="fkp-textcol">
        <header className="fkp-head">
          <h1 className="fk-display">The full settings behind every post</h1>
          <p className="fk-lead">
            Tap a post for every block and knob, plus versions for other rigs.
          </p>
        </header>
        <ul className="fkp-iglist">
          {list.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="fk-tile fkp-iglink">
                <span className="fkp-iglink-text">
                  <span className="fk-caption">{t.kicker}</span>
                  <span className="fk-t3">{t.title}</span>
                </span>
                <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <IgSignup />
      </div>
    </div>
  );
}
