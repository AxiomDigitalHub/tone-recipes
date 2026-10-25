import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import IgSignup from "./IgSignup";

/**
 * /ig — the link-in-profile page for Instagram (docs/social-strategy/council/03).
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
  sunday_sound: "Sunday Sound",
  knob_card: "Knob Card",
  worship_rig: "Worship Rig",
  fix_it: "Fix-It",
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
    <div className="container" style={{ maxWidth: 720, paddingTop: 32, paddingBottom: 64 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 className="display" style={{ color: "var(--ink)", fontSize: 40, lineHeight: 1.05 }}>
          The full settings behind every post
        </h1>
        <p style={{ color: "var(--ink-muted)", marginTop: 8 }}>
          Tap a post for every block and knob, plus versions for other rigs.
        </p>
      </header>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "grid", gap: 12 }}>
        {list.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              style={{ display: "block", border: "2px solid var(--ink)", padding: "14px 16px", color: "var(--ink)", background: "var(--paper)" }}
            >
              <span style={{ display: "block", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-2)" }}>{t.kicker}</span>
              <span style={{ display: "block", fontSize: 18, fontWeight: 600, marginTop: 4 }}>{t.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <IgSignup />
    </div>
  );
}
