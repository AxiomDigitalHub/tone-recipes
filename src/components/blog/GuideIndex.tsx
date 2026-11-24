"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/**
 * "Every guide": the full index on the Learn page, filterable by topic
 * and by category.
 *
 * Every row is in the server HTML (it is the crawl path to all guides).
 * Filtering and the "show all" cut only hide rows with CSS-free state on
 * the client. The topic tiles higher up the page link here with a hash:
 * /blog#guides:topic=time or /blog#guides:category=gear-lab.
 */
export interface GuideRow {
  slug: string;
  title: string;
  /** "Nov 20" style, preformatted on the server. */
  date: string;
  /** Minutes, e.g. "7 min". */
  read: string;
  category: string;
  topic: string;
}

interface Option {
  id: string;
  label: string;
  count: number;
}

const INITIAL = 40;

function readHash(): { kind: "topic" | "category"; id: string } | null {
  const m = window.location.hash.match(/^#guides:(topic|category)=([a-z0-9-]+)$/);
  return m ? { kind: m[1] as "topic" | "category", id: m[2] } : null;
}

export default function GuideIndex({
  rows,
  topics,
  categories,
}: {
  rows: GuideRow[];
  topics: Option[];
  categories: Option[];
}) {
  const [filter, setFilter] = useState<{ kind: "topic" | "category"; id: string } | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readHash();
      if (next) {
        setFilter(next);
        document.getElementById("guides")?.scrollIntoView({ block: "start" });
      } else if (window.location.hash === "#guides") {
        setFilter(null);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const choose = (next: { kind: "topic" | "category"; id: string } | null) => {
    setFilter(next);
    setShowAll(false);
    const hash = next ? `#guides:${next.kind}=${next.id}` : "#guides";
    window.history.replaceState(null, "", hash);
  };

  const visible = useMemo(
    () => (filter ? rows.filter((r) => (filter.kind === "topic" ? r.topic : r.category) === filter.id) : rows),
    [rows, filter],
  );
  const shown = showAll || filter ? visible.length : Math.min(INITIAL, visible.length);
  const visibleSlugs = useMemo(() => new Set(visible.slice(0, shown).map((r) => r.slug)), [visible, shown]);

  const chip = (kind: "topic" | "category", o: Option) => {
    const on = filter?.kind === kind && filter.id === o.id;
    return (
      <button
        key={`${kind}-${o.id}`}
        type="button"
        className="fk-chip"
        aria-pressed={on}
        onClick={() => choose(on ? null : { kind, id: o.id })}
      >
        {o.label}
        <span className="fk-data fk-chip-count">{o.count}</span>
      </button>
    );
  };

  return (
    <div className="fk-guideindex">
      <div className="fk-guideindex-filters">
        <div className="fk-chips" role="group" aria-label="Filter by topic">
          <button type="button" className="fk-chip" aria-pressed={!filter} onClick={() => choose(null)}>
            All guides
            <span className="fk-data fk-chip-count">{rows.length}</span>
          </button>
          {topics.map((t) => chip("topic", t))}
        </div>
        <div className="fk-chips" role="group" aria-label="Filter by category">
          {categories.map((c) => chip("category", c))}
        </div>
      </div>

      <p className="fk-body-sm" role="status">
        {filter ? `${visible.length} guides` : `Showing ${shown} of ${rows.length} guides`}
      </p>

      <ul className="fk-guiderows">
        {rows.map((r) => (
          <li key={r.slug} hidden={!visibleSlugs.has(r.slug)}>
            <Link href={`/blog/${r.slug}`}>
              <span className="fk-guiderow-title">{r.title}</span>
              <span className="fk-data fk-guiderow-meta">
                {r.date} · {r.read}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {!filter && !showAll && rows.length > INITIAL && (
        <button type="button" className="fk-btn fk-btn-secondary fk-guideindex-more" onClick={() => setShowAll(true)}>
          Show all {rows.length} guides
        </button>
      )}
    </div>
  );
}
