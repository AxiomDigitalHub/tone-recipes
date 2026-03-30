"use client";

import { useState, useEffect } from "react";
import { usePlatformStore } from "@/lib/stores/platform-store";
import { PLATFORMS } from "@/lib/constants";

const MANUFACTURER: Record<string, string> = {
  helix: "Line 6",
  quad_cortex: "Neural DSP",
  tonex: "IK Multimedia",
  kemper: "Kemper",
  fractal: "Fractal Audio",
  katana: "Boss",
};

const MODELER_PLATFORMS = PLATFORMS.filter((p) => p.id !== "physical");

export default function PlatformOnboarding() {
  const { preferredPlatform, setPreferredPlatform } = usePlatformStore();
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSelect(platformId: string) {
    setPreferredPlatform(platformId);
    setJustSelected(platformId);
  }

  function handleReset() {
    setPreferredPlatform(null);
    setJustSelected(null);
  }

  const selectedMeta = MODELER_PLATFORMS.find(
    (p) => p.id === justSelected || p.id === preferredPlatform
  );

  // Before mount, render skeleton (avoids hydration mismatch from localStorage)
  if (!mounted) {
    return (
      <>
        <h2 className="text-2xl font-bold md:text-3xl">
          What do you play?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Set your platform and every recipe will show your settings first.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MODELER_PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="flex flex-col items-center rounded-xl border border-border bg-surface px-4 py-5 transition-all"
              style={{ borderTopColor: platform.color, borderTopWidth: "3px" }}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {MANUFACTURER[platform.id]}
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {platform.label}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Compact state: user already has a platform
  if (preferredPlatform && !justSelected) {
    return (
      <>
        <h2 className="text-2xl font-bold md:text-3xl">
          What do you play?
        </h2>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-4">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: selectedMeta?.color }}
          />
          <p className="text-sm font-medium text-foreground">
            Recipes show{" "}
            <span style={{ color: selectedMeta?.color }}>
              {selectedMeta?.label ?? preferredPlatform}
            </span>{" "}
            settings first.
          </p>
          <button
            onClick={handleReset}
            className="ml-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Change
          </button>
        </div>
      </>
    );
  }

  // Just-selected confirmation
  if (justSelected && selectedMeta) {
    return (
      <>
        <h2 className="text-2xl font-bold md:text-3xl">
          What do you play?
        </h2>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-4">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: selectedMeta.color }}
          />
          <p className="text-sm font-medium text-foreground">
            Got it! Recipes will show{" "}
            <span style={{ color: selectedMeta.color }}>
              {selectedMeta.label}
            </span>{" "}
            settings first.
          </p>
          <button
            onClick={handleReset}
            className="ml-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Change
          </button>
        </div>
      </>
    );
  }

  // Full picker
  return (
    <>
      <h2 className="text-2xl font-bold md:text-3xl">
        What do you play?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">
        Set your platform and every recipe will show your settings first.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {MODELER_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleSelect(platform.id)}
            className="flex flex-col items-center rounded-xl border border-border bg-surface px-4 py-5 transition-all hover:border-accent/40 hover:bg-surface-hover hover:shadow-lg"
            style={{ borderTopColor: platform.color, borderTopWidth: "3px" }}
          >
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
              {MANUFACTURER[platform.id]}
            </span>
            <span className="mt-1 text-sm font-semibold text-foreground">
              {platform.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
