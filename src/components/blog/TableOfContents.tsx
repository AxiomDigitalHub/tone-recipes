"use client";

import { useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Mobile inline TOC — collapsible, shown above the content */
export function MobileTableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-xl border border-[var(--ink)]/15 bg-[var(--paper-2)] lg:hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[var(--ink)]"
      >
        <span>In this article</span>
        <svg
          className={`h-4 w-4 text-[var(--ink-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-4">
          <ol className="space-y-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block text-sm transition-colors hover:text-[var(--amber-2)] ${
                    item.level === 2
                      ? "font-medium text-[var(--ink)]/80"
                      : "pl-4 text-[var(--ink-muted)]"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </nav>
  );
}

/** Desktop sticky sidebar TOC */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden lg:block"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
        In this article
      </p>
      <ol className="space-y-1.5 border-l border-[var(--ink)]/15 pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm transition-colors hover:text-[var(--amber-2)] ${
                item.level === 2
                  ? "font-medium text-[var(--ink)]/80"
                  : "pl-3 text-[var(--ink-muted)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
