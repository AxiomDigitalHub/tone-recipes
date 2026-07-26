"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/db/client";

interface Growth {
  accounts: {
    total: number;
    new7d: number;
    new30d: number;
    byRole: Record<string, number>;
    sparkline: number[];
  } | null;
  paid: {
    pass: number;
    pro: number;
    paidTotal: number;
    estMrr: number;
    conversionRate: number;
  } | null;
  newsletter: {
    active: number;
    unsubscribed: number;
    new7d: number;
  } | null;
  downloads: {
    total: number;
    top: { slug: string; count: number }[];
  } | null;
  set_packs: {
    purchases: {
      active: number;
      refunded: number;
      totalCents: number;
      last7dCount: number;
      last7dCents: number;
    } | null;
    interest: { pack: string; count: number }[] | null;
  } | null;
  funnel: {
    total: number;
    byName: { name: string; count: number }[];
  } | null;
}

interface Metrics {
  catalog: { recipes: number; artists: number; songs: number; gear: number };
  content: { blogPosts: number; newsArticles: number; presetFiles: number };
  users: {
    total: number;
    byRole: Record<string, number>;
    newThisWeek: number;
    recent: {
      displayName: string;
      role: string;
      platform: string | null;
      createdAt: string;
    }[];
  } | null;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState<Growth | null>(null);
  const [growthError, setGrowthError] = useState(false);

  // Metrics carries signup PII, so it's bearer-gated like /api/admin/growth.
  useEffect(() => {
    (async () => {
      try {
        const supabase = createBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setLoading(false);
          return;
        }
        const res = await fetch("/api/admin/metrics", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) setMetrics(await res.json());
      } catch {
        // fall through to setLoading below
      }
      setLoading(false);
    })();
  }, []);

  // Growth data exposes revenue, so /api/admin/growth is auth-gated. Send
  // the signed-in admin's access token (same pattern as CheckoutButton).
  useEffect(() => {
    (async () => {
      try {
        const supabase = createBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setGrowthError(true);
          return;
        }
        const res = await fetch("/api/admin/growth", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          setGrowthError(true);
          return;
        }
        setGrowth(await res.json());
      } catch {
        setGrowthError(true);
      }
    })();
  }, []);

  const users = metrics?.users;
  const catalog = metrics?.catalog;
  const content = metrics?.content;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="page-title page-title-sm">Admin Dashboard</h1>
        <p className="mt-2 text-[var(--ink-muted)]">
          Live metrics for Fader &amp; Knob.
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--amber-2)] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* ── Growth Section (accounts + revenue; supersedes the old
                 Users stat row, which duplicated Total accounts / by-role
                 and used the stale "Premium" label) ── */}
          <GrowthSection growth={growth} error={growthError} />

          {/* ── Content Section ── */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Content</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label="Recipes" value={catalog?.recipes ?? 0} href="/browse" />
              <StatCard label="Artists" value={catalog?.artists ?? 0} />
              <StatCard label="Songs" value={catalog?.songs ?? 0} />
              <StatCard label="Blog Posts" value={content?.blogPosts ?? 0} href="/blog" />
              <StatCard label="News Articles" value={content?.newsArticles ?? 0} href="/news" />
              <StatCard label="Preset Files" value={content?.presetFiles ?? 0} />
            </div>
          </section>

          {/* ── Gear Section ── */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Gear Database</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Gear Items" value={catalog?.gear ?? 0} />
            </div>
          </section>

          {/* ── Recent Sign-ups ── */}
          {users && users.recent.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Recent Sign-ups
              </h2>
              <div className="overflow-hidden rounded-lg border border-[var(--ink-faint)]">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[var(--ink-faint)] bg-[var(--paper-2)] text-xs uppercase text-[var(--ink-muted)]">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Platform</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ink-faint)]">
                    {users.recent.map((u, i) => (
                      <tr key={i} className="hover:bg-[var(--paper-2)]">
                        <td className="px-4 py-3 font-medium text-[var(--ink)]">
                          {u.displayName}
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-3 text-[var(--ink-muted)]">
                          {u.platform ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[var(--ink-muted)]">
                          {timeAgo(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Quick Actions ── */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/admin/recipes/new"
                className="rounded-lg border border-[var(--ink)] bg-[var(--amber)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)] hover:text-[var(--paper)]"
              >
                + New Recipe
              </Link>
              <Link
                href="/dashboard/admin/recipes"
                className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--paper-2)]"
              >
                Manage Recipes
              </Link>
              <Link
                href="/dashboard/admin/moderation"
                className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--paper-2)]"
              >
                Moderation Queue
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ── Growth Section ── */

function GrowthSection({
  growth,
  error,
}: {
  growth: Growth | null;
  error: boolean;
}) {
  if (error) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Growth</h2>
        <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] px-4 py-3 text-sm text-[var(--ink-muted)]">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500" />
          Couldn&apos;t load growth data. Sign in as an admin and refresh.
        </div>
      </section>
    );
  }

  if (!growth) {
    // Still loading growth (auth handshake) — keep it quiet, the rest of the
    // page already rendered.
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Growth</h2>
        <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] px-4 py-3 text-sm text-[var(--ink-muted)]">
          Loading growth data…
        </div>
      </section>
    );
  }

  const { accounts, paid, newsletter, downloads, set_packs, funnel } = growth;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Growth</h2>
        <span className="text-xs text-[var(--ink-muted)]">
          real accounts, not GA estimates
        </span>
      </div>

      {/* This week headline row — genuinely weekly metrics only. Est. MRR
          (a running total, not a weekly figure) lives in the Money section
          below, so it isn't shown twice. */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="New accounts (7d)"
          value={accounts?.new7d ?? 0}
          trend
        />
        <StatCard
          label="New subscribers (7d)"
          value={newsletter?.new7d ?? 0}
          trend
        />
        <StatCard label="Downloads (7d)" value={downloads?.total ?? 0} trend />
      </div>

      {/* Accounts */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
        Accounts
      </h3>
      {accounts ? (
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
            <p className="text-2xl font-bold text-[var(--ink)]">
              {accounts.total.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">Total accounts</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">real accounts, not GA estimates</p>
          </div>
          <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
            <p className="mb-2 text-sm text-[var(--ink-muted)]">By role</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {Object.entries(accounts.byRole)
                .sort((a, b) => b[1] - a[1])
                .map(([role, n]) => (
                  <span key={role} className="text-[var(--ink)]">
                    <span className="font-semibold">{n.toLocaleString()}</span>{" "}
                    <span className="text-[var(--ink-muted)]">{role}</span>
                  </span>
                ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
            <p className="mb-2 text-sm text-[var(--ink-muted)]">New signups / week (8 wks)</p>
            <Sparkline values={accounts.sparkline} />
            <p className="mt-2 text-xs text-[var(--ink-muted)]">
              {accounts.new30d.toLocaleString()} in last 30 days
            </p>
          </div>
        </div>
      ) : (
        <BlockUnavailable label="account data" />
      )}

      {/* Money */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
        Money
      </h3>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {paid ? (
          <>
            <StatCard label="Pass subscribers" value={paid.pass} />
            <StatCard label="Pro subscribers" value={paid.pro} accent />
            <MoneyCard
              label="Free → paid"
              value={`${(paid.conversionRate * 100).toFixed(1)}%`}
              caption={`${paid.paidTotal} paid of ${
                (accounts?.total ?? 0).toLocaleString()
              }`}
            />
            <MoneyCard
              label="Est. MRR"
              value={formatUsd(paid.estMrr)}
              caption="est. — Stripe is the exact number"
              accent
            />
          </>
        ) : (
          <div className="col-span-full">
            <BlockUnavailable label="subscription data" />
          </div>
        )}
      </div>
      {set_packs?.purchases && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Set packs sold" value={set_packs.purchases.active} />
          <MoneyCard
            label="Set pack revenue"
            value={formatUsdCents(set_packs.purchases.totalCents)}
            caption="all-time, non-refunded"
          />
          <MoneyCard
            label="Set packs (7d)"
            value={formatUsdCents(set_packs.purchases.last7dCents)}
            caption={`${set_packs.purchases.last7dCount} sold this week`}
          />
          {set_packs.purchases.refunded > 0 && (
            <StatCard label="Refunded" value={set_packs.purchases.refunded} />
          )}
        </div>
      )}
      {set_packs?.interest && set_packs.interest.length > 0 && (
        <div className="mb-6 rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
          <p className="mb-2 text-sm text-[var(--ink-muted)]">
            Set pack interest (notify-me demand signal)
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {set_packs.interest.map(({ pack, count }) => (
              <span key={pack} className="text-[var(--ink)]">
                <span className="font-semibold">{count.toLocaleString()}</span>{" "}
                <span className="text-[var(--ink-muted)]">{pack}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
        Newsletter
      </h3>
      {newsletter ? (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Active subscribers" value={newsletter.active} />
          <StatCard label="New (7d)" value={newsletter.new7d} trend />
          <StatCard label="Unsubscribed" value={newsletter.unsubscribed} />
        </div>
      ) : (
        <div className="mb-6">
          <BlockUnavailable label="newsletter data" />
        </div>
      )}

      {/* Downloads */}
      {downloads && downloads.top.length > 0 && (
        <>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            Top downloads (7d)
          </h3>
          <div className="mb-6 overflow-hidden rounded-lg border border-[var(--ink-faint)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--ink-faint)] bg-[var(--paper-2)] text-xs uppercase text-[var(--ink-muted)]">
                <tr>
                  <th className="px-4 py-3">Recipe</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ink-faint)]">
                {downloads.top.map(({ slug, count }) => (
                  <tr key={slug} className="hover:bg-[var(--paper-2)]">
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">
                      {slug}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--ink-muted)]">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Server events */}
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
          Server events (30d)
        </h3>
      </div>
      <p className="mb-3 text-xs text-[var(--ink-muted)]">
        Server-side signal only — client funnel steps (checkout_start,
        signup_start) go to GA4, not here.
      </p>
      {funnel && funnel.byName.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {funnel.byName.map(({ name, count }) => (
            <div
              key={name}
              className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-4"
            >
              <p className="text-xl font-bold text-[var(--ink)]">
                {count.toLocaleString()}
              </p>
              <p className="mt-1 break-words text-xs text-[var(--ink-muted)]">{name}</p>
            </div>
          ))}
        </div>
      ) : (
        <BlockUnavailable label="server events" />
      )}
    </section>
  );
}

function MoneyCard({
  label,
  value,
  caption,
  accent,
}: {
  label: string;
  value: string;
  caption?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
      <p
        className={`text-2xl font-bold ${
          accent ? "text-[var(--amber-2)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{label}</p>
      {caption && <p className="mt-1 text-xs text-[var(--ink-muted)]">{caption}</p>}
    </div>
  );
}

function BlockUnavailable({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] px-4 py-3 text-sm text-[var(--ink-muted)]">
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500" />
      No {label} available.
    </div>
  );
}

/** Tiny inline SVG sparkline — no chart lib. */
function Sparkline({ values }: { values: number[] }) {
  const w = 200;
  const h = 40;
  const max = Math.max(1, ...values);
  const n = values.length;
  const points =
    n <= 1
      ? `0,${h} ${w},${h}`
      : values
          .map((v, i) => {
            const x = (i / (n - 1)) * w;
            const y = h - (v / max) * h;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-10 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-[var(--amber-2)]"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatUsdCents(cents: number): string {
  return formatUsd(cents / 100);
}

/* ── Helper Components ── */

function StatCard({
  label,
  value,
  href,
  accent,
  trend,
}: {
  label: string;
  value: number;
  href?: string;
  accent?: boolean;
  trend?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5 transition-colors ${
        href ? "hover:border-[var(--amber-2)] hover:bg-[var(--paper-2)]" : ""
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          accent ? "text-[var(--amber-2)]" : "text-[var(--ink)]"
        }`}
      >
        {value.toLocaleString()}
        {trend && value > 0 && (
          <span className="ml-2 text-sm font-normal text-green-700">↑</span>
        )}
      </p>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-red-500/10 text-red-700",
    premium: "bg-amber-500/15 text-[var(--amber-2)]",
    creator: "bg-purple-500/10 text-purple-700",
    free: "bg-[var(--paper-2)] text-[var(--ink-muted)]",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[role] ?? styles.free
      }`}
    >
      {role}
    </span>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
