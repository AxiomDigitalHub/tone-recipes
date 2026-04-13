"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const users = metrics?.users;
  const catalog = metrics?.catalog;
  const content = metrics?.content;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted">
          Live metrics for Fader &amp; Knob.
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <>
          {/* ── Users Section ── */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Users</h2>
            {users ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Users" value={users.total} />
                <StatCard
                  label="Premium"
                  value={users.byRole.premium ?? 0}
                  accent
                />
                <StatCard label="Free" value={users.byRole.free ?? 0} />
                <StatCard
                  label="New This Week"
                  value={users.newThisWeek}
                  trend
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500" />
                Connect Supabase to see user metrics.
              </div>
            )}
          </section>

          {/* ── Content Section ── */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Content</h2>
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
            <h2 className="mb-4 text-lg font-semibold text-foreground">Gear Database</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Gear Items" value={catalog?.gear ?? 0} />
            </div>
          </section>

          {/* ── Recent Sign-ups ── */}
          {users && users.recent.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Recent Sign-ups
              </h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface text-xs uppercase text-muted">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Platform</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.recent.map((u, i) => (
                      <tr key={i} className="hover:bg-surface-hover">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {u.displayName}
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {u.platform ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted">
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
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/admin/recipes/new"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                + New Recipe
              </Link>
              <Link
                href="/dashboard/admin/recipes"
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Manage Recipes
              </Link>
              <Link
                href="/dashboard/admin/moderation"
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
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
      className={`rounded-lg border border-border bg-surface p-5 transition-colors ${
        href ? "hover:border-accent/40 hover:bg-surface-hover" : ""
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          accent ? "text-accent" : "text-foreground"
        }`}
      >
        {value.toLocaleString()}
        {trend && value > 0 && (
          <span className="ml-2 text-sm font-normal text-green-400">↑</span>
        )}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-red-500/20 text-red-400",
    premium: "bg-accent/20 text-accent",
    creator: "bg-purple-500/20 text-purple-400",
    free: "bg-surface text-muted",
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
