"use client";

import { useState, useRef, useEffect } from "react";
import { PLATFORMS, DISPLAYED_PLATFORM_IDS } from "@/lib/constants";
import { usePlatformStore } from "@/lib/stores/platform-store";

const selectablePlatforms = PLATFORMS.filter((p) => p.id !== "pedalboard" && DISPLAYED_PLATFORM_IDS.has(p.id));

export default function PlatformPicker() {
  const { preferredPlatform, setPreferredPlatform } = usePlatformStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeMeta = selectablePlatforms.find(
    (p) => p.id === preferredPlatform
  );

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title="Set your default modeler platform"
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium transition-colors hover:border-accent/40 hover:bg-surface-hover"
      >
        {activeMeta ? (
          <>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeMeta.color }}
            />
            <span className="text-foreground">{activeMeta.label}</span>
          </>
        ) : (
          <span className="text-muted">Your Modeler</span>
        )}
        <svg
          className={`ml-0.5 h-3 w-3 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-border bg-surface py-1 shadow-xl">
          <button
            onClick={() => {
              setPreferredPlatform(null);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
              preferredPlatform === null
                ? "text-accent font-medium"
                : "text-muted"
            }`}
          >
            Your Modeler
            <span className="text-[10px] text-muted">(no preference)</span>
          </button>
          <hr className="my-1 border-border" />
          {selectablePlatforms.map((platform) => {
            const isSelected = preferredPlatform === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => {
                  setPreferredPlatform(platform.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
                  isSelected ? "font-medium text-foreground" : "text-muted"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                {platform.label}
                {isSelected && (
                  <svg
                    className="ml-auto h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
