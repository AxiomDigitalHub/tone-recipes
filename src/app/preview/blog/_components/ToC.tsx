"use client";

import { useEffect, useRef, useState } from "react";
import type { TocEntry } from "@/lib/toc";

/**
 * <ToC> — sticky table of contents for an article.
 *
 * Rendered in a right-rail column on desktop (≥1080px) and collapses
 * to a mobile accordion under the dek on narrow viewports. Uses an
 * IntersectionObserver on the actual h2/h3 elements in the MDX body to
 * track which section is in view; that entry gets the `.is-active`
 * highlight so readers always know where they are in the piece.
 */
export function ToC({ entries }: { entries: TocEntry[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    entries[0]?.slug ?? null,
  );
  const [openMobile, setOpenMobile] = useState(false);
  const ignoreScrollUntil = useRef(0);

  useEffect(() => {
    if (entries.length === 0) return;

    // Resolve real heading nodes. Skip entries whose target isn't in
    // the DOM yet (rare; happens if the author updated slugs manually).
    const targets = entries
      .map((e) => document.getElementById(e.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    // Top-of-viewport-style tracking: a heading becomes "active" when
    // it crosses the top 1/3 of the viewport. rootMargin tuned so the
    // active entry switches a beat before the heading hits the actual
    // edge, which matches how readers expect a ToC to behave.
    const io = new IntersectionObserver(
      (observed) => {
        if (Date.now() < ignoreScrollUntil.current) return;
        // Find the last heading whose top is above the root-margin
        // line and which intersects. Observer fires per-entry so we
        // need to scan all targets each tick.
        let next: string | null = null;
        for (const t of targets) {
          const rect = t.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.35) {
            next = t.id;
          }
        }
        if (next) setActiveSlug(next);
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: [0, 1],
      },
    );
    targets.forEach((t) => io.observe(t));

    // A raw scroll listener keeps the active entry in sync while
    // scrolling continuously (IO doesn't fire on every frame).
    const onScroll = () => {
      if (Date.now() < ignoreScrollUntil.current) return;
      let next: string | null = null;
      for (const t of targets) {
        const top = t.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.35) next = t.id;
      }
      if (next && next !== activeSlug) setActiveSlug(next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [entries, activeSlug]);

  if (entries.length === 0) return null;

  const handleClick = (slug: string) => (e: React.MouseEvent) => {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    // Smooth-scroll and immediately claim the active slug so the
    // highlight flips on click rather than waiting for the IO tick.
    ignoreScrollUntil.current = Date.now() + 600;
    setActiveSlug(slug);
    setOpenMobile(false);
    const top =
      window.scrollY + target.getBoundingClientRect().top - 88;
    window.scrollTo({ top, behavior: "smooth" });
    // Update the URL hash without the default jump.
    history.replaceState(null, "", `#${slug}`);
  };

  return (
    <aside className="toc" aria-label="Table of contents">
      <div className="toc-head">
        <span className="toc-mark" aria-hidden="true">§</span>
        <span className="toc-head-label">In this article</span>
        <button
          type="button"
          className="toc-mobile-toggle"
          aria-expanded={openMobile}
          aria-controls="toc-list"
          onClick={() => setOpenMobile((v) => !v)}
        >
          {openMobile ? "Hide" : "Show"}
        </button>
      </div>
      <ol
        id="toc-list"
        className={`toc-list ${openMobile ? "is-open" : ""}`}
      >
        {entries.map((e) => (
          <li
            key={`${e.slug}-${e.text}`}
            className={`toc-item toc-level-${e.level} ${
              activeSlug === e.slug ? "is-active" : ""
            }`}
          >
            <a href={`#${e.slug}`} onClick={handleClick(e.slug)}>
              <span className="toc-item-rule" aria-hidden="true" />
              <span className="toc-item-text">{e.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
