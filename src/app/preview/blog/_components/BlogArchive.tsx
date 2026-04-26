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
  formatDate,
}: {
  departments: Department[];
  groups: ArchiveGroup[];
  /** Server-formatted date string per slug, to avoid hydration drift. */
  formatDate: Record<string, string>;
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

  return (
    <>
      {/* ═══ Departments rail ═══ */}
      <section className="dept-section" aria-labelledby="dept-head">
        <div className="section-head">
          <span className="section-mark">§</span>
          <h2 id="dept-head" className="section-title">
            Departments
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <span className="section-meta">
            {departments.length} columns
          </span>
        </div>

        <div className="dept-rail" role="tablist" aria-label="Filter by department">
          <button
            type="button"
            role="tab"
            aria-selected={active === null}
            className={`dept-chip dept-chip-all ${
              active === null ? "is-active" : ""
            }`}
            onClick={() => setActive(null)}
          >
            <span className="dept-chip-mark">★</span>
            <span className="dept-chip-label">All</span>
            <span className="dept-chip-count">
              {departments.reduce((a, d) => a + d.count, 0)}
            </span>
          </button>

          {departments.map((d) => (
            <button
              key={d.slug}
              type="button"
              role="tab"
              aria-selected={active === d.slug}
              className={`dept-chip ${
                active === d.slug ? "is-active" : ""
              }`}
              onClick={() =>
                setActive((cur) => (cur === d.slug ? null : d.slug))
              }
            >
              <span className="dept-chip-mark">§</span>
              <span className="dept-chip-label">{d.label}</span>
              <span className="dept-chip-count">{d.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ Ledger ═══ */}
      <section className="ledger-section" aria-labelledby="ledger-head">
        <div className="section-head">
          <span className="section-mark">¶</span>
          <h2 id="ledger-head" className="section-title">
            The Archive
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <span className="section-meta">
            {activeDept
              ? `${totalVisible} filings · § ${activeDept.label}`
              : `${totalVisible} filings · Vol. I — IV`}
          </span>
        </div>

        <div className="ledger">
          <div className="ledger-header" aria-hidden="true">
            <span className="ledger-no">No.</span>
            <span className="ledger-date">Filed</span>
            <span className="ledger-dept">Dept.</span>
            <span className="ledger-title">Title</span>
            <span className="ledger-by">By</span>
          </div>

          {visibleGroups.length === 0 && (
            <div className="ledger-empty">
              No filings under this department yet.
            </div>
          )}

          {visibleGroups.map((g) => (
            <div key={g.key} className="ledger-group">
              <div className="ledger-volume-break">
                <span className="ledger-volume-mark" aria-hidden="true">
                  ❦
                </span>
                <span className="ledger-volume-label">{g.label}</span>
                <span
                  className="ledger-volume-rule"
                  aria-hidden="true"
                />
                <span className="ledger-volume-count">
                  {g.posts.length} filings
                </span>
              </div>
              {g.posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/preview/blog/${p.slug}`}
                  className="ledger-row"
                >
                  <span className="ledger-no">No. {p.callNo}</span>
                  <span className="ledger-date">
                    {formatDate[p.slug] ?? ""}
                  </span>
                  <span className="ledger-dept">{p.categoryLabel}</span>
                  <span className="ledger-title">{p.title}</span>
                  <span className="ledger-by">{p.author}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
