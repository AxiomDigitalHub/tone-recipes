"use client";

import { useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-xl border border-border bg-surface"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground md:hidden"
      >
        <span>Table of Contents</span>
        <svg
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`${open ? "block" : "hidden"} md:block`}>
        <div className="px-5 pb-4 pt-0 md:py-4">
          <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-muted md:block">
            In this article
          </p>
          <ol className="space-y-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block text-sm transition-colors hover:text-accent ${
                    item.level === 2
                      ? "font-medium text-foreground/80"
                      : "pl-4 text-muted"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
