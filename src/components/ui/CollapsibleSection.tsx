"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  id,
  title,
  defaultOpen = false,
  badge,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? "none" : "0px");

  const updateMaxHeight = useCallback(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      // After transition, remove max-height constraint so content can resize
      const timer = setTimeout(() => setMaxHeight("none"), 300);
      return () => clearTimeout(timer);
    } else {
      // First set explicit height so transition works
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      // Force reflow then collapse
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight("0px");
        });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    updateMaxHeight();
  }, [updateMaxHeight]);

  return (
    <section id={id} className="mb-10 scroll-mt-32">
      <button
        type="button"
        id={`${id}-toggle`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="flex w-full items-center justify-between border-b border-border pb-3 text-left"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {badge && (
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        ref={contentRef}
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-toggle`}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        <div className="pt-4">{children}</div>
      </div>
    </section>
  );
}
