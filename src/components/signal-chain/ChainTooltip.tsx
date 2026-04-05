"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChainTooltipProps {
  tip: string;
}

export default function ChainTooltip({ tip }: ChainTooltipProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("above");
  const [isPulsing, setIsPulsing] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Stop pulse animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }

    // Close on Escape key
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  // Determine whether to show popover above or below based on viewport space
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    setPosition(spaceAbove > spaceBelow ? "above" : "below");
  }, [open]);

  return (
    <div ref={containerRef} className="relative z-10 flex items-center justify-center">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Signal chain tip"
        aria-expanded={open}
        className={`flex h-5 w-5 items-center justify-center rounded-full border border-accent/30 bg-surface text-[10px] font-semibold leading-none text-accent/50 transition-colors hover:border-accent/50 hover:text-accent hover:bg-accent/10${isPulsing ? " animate-pulse" : ""}`}
      >
        ?
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          role="tooltip"
          className={`absolute z-50 w-64 rounded-lg border border-border bg-surface p-3 shadow-xl ${
            position === "above"
              ? "bottom-full mb-2"
              : "top-full mt-2"
          }`}
          // Center the popover horizontally relative to the trigger
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-border bg-surface ${
              position === "above"
                ? "bottom-[-5px] border-b border-r"
                : "top-[-5px] border-l border-t"
            }`}
          />

          {/* Content */}
          <div className="flex items-start gap-2">
            <p className="flex-1 text-xs leading-relaxed text-muted">
              {tip}
            </p>
            <button
              onClick={close}
              aria-label="Close tip"
              className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-muted transition-colors hover:text-foreground"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
