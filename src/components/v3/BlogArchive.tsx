"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * <BlogArchive> — client-side departments filter + ledger.
 *
 * Parent (the /preview/blog page) pre-computes the full list of posts
 * grouped by volume/quarter and the list of departments with counts.
 * This component owns the `activeCategory` state; clicking a chip
 * filters the ledger rows in place. Volume-break headers that end up
 * with zero matching rows are hidden so the filtered view stays tidy.
 */

export interface ArchiveRow {
  slug: string;
  title: string;
  date: string;
  category: string;
  categoryLabel: string;
  author: string;
  callNo: string;
}

export interface ArchiveGroup {
  /** Display label like "Vol. IV · Q2 2026" */
  label: string;
  /** For React key */
  key: string;
  posts: ArchiveRow[];
}

export interface Department {
  slug: string;
  label: string;
  count: number;
}

export function BlogArchive({
  departments,
  groups,
}: {
  departments: Department[];
  groups: ArchiveGroup[];
}) {
  const [active, setActive] = useState<string | null>(null);

  // Filter each group's posts against the active category. Groups with
  // zero matches are dropped from the render list entirely.
  const visibleGroups = useMemo(() => {
    if (!active) return groups;
    return groups
      .map((g) => ({
        ...g,
        posts: g.posts.filter((p) => p.category === active),
      }))
      .filter((g) => g.posts.length > 0);
  }, [active, groups]);

  const totalVisible = visibleGroups.reduce(
    (acc, g) => acc + g.posts.length,
    0,
  );

  const activeDept = active
    ? departments.find((d) => d.slug === active) ?? null
    : null;

  // Flatten grouped posts to a single newest-first stream — no volume
  // breaks. The user wanted the dense ledger to read straight through
  // rather than fragmenting into "Vol. IV · Q2 2026" segments.
  const flatRows = useMemo(
    () => visibleGroups.flatMap((g) => g.posts),
    [visibleGroups],
  );

  return (
    <div className="blog-overview-grid">
      {/* ═══ Departments — left sidebar ═══ */}
      <aside className="dept-sidebar" aria-label="Filter by department">
        <h2 className="dept-sidebar-title display">Departments</h2>
        <ul className="dept-list" role="tablist">
          <li>
            <button
              type="button"
              role="tab"
              aria-selected={active === null}
              className={`dept-link dept-link-all ${
                active === null ? "is-active" : ""
              }`}
              onClick={() => setActive(null)}
            >
              <span className="dept-link-label">All</span>
              <span className="dept-link-count">
                {departments.reduce((a, d) => a + d.count, 0)}
              </span>
            </button>
          </li>
          {departments.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                role="tab"
                aria-selected={active === d.slug}
                className={`dept-link ${
                  active === d.slug ? "is-active" : ""
                }`}
                onClick={() =>
                  setActive((cur) => (cur === d.slug ? null : d.slug))
                }
              >
                <span className="dept-link-label">{d.label}</span>
                <span className="dept-link-count">{d.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ═══ Ledger ═══ */}
      <section className="ledger-section" aria-labelledby="ledger-head">
        <h2 id="ledger-head" className="ledger-section-title display">
          {activeDept ? activeDept.label : "The Archive"}
        </h2>

        <div className="ledger ledger-3col">
          <div className="ledger-header" aria-hidden="true">
            <span className="ledger-dept">Dept.</span>
            <span className="ledger-title">Title</span>
            <span className="ledger-by">By</span>
          </div>

          {flatRows.length === 0 && (
            <div className="ledger-empty">
              No filings under this department yet.
            </div>
          )}

          {flatRows.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="ledger-row"
            >
              <span className="ledger-dept">{p.categoryLabel}</span>
              <span className="ledger-title">{p.title}</span>
              <span className="ledger-by">{p.author}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
