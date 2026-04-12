"use client";

import type { PlatformTranslation } from "@/types/recipe";
import { generateHelixPreset, slugifyPresetName } from "@/lib/helix/generate-hlx";
import { generateQCPreset, slugifyPresetName as slugifyQC } from "@/lib/quadcortex/generate-qc";
import { generateKatanaTSL, slugifyPresetName as slugifyKatana } from "@/lib/katana/generate-tsl";
import { useAuth } from "@/lib/auth/auth-context";

interface DownloadPatchButtonProps {
  translation: PlatformTranslation;
  presetName: string;
  platform: string;
}

const PLATFORM_CONFIG: Record<
  string,
  {
    generate: (t: PlatformTranslation, name: string) => string;
    slugify: (name: string) => string;
    extension: string;
    mimeType: string;
    color: string;
    label: string;
  }
> = {
  helix: {
    generate: generateHelixPreset,
    slugify: slugifyPresetName,
    extension: ".hlx",
    mimeType: "application/json",
    color: "#cc0000",
    label: "Download Helix Patch",
  },
  quad_cortex: {
    generate: generateQCPreset,
    slugify: slugifyQC,
    extension: ".json",
    mimeType: "application/json",
    color: "#00b4d8",
    label: "Download Quad Cortex Patch",
  },
  katana: {
    generate: generateKatanaTSL,
    slugify: slugifyKatana,
    extension: ".tsl",
    mimeType: "application/xml",
    color: "#e11d48",
    label: "Download Katana Patch",
  },
};

export default function DownloadPatchButton({
  translation,
  presetName,
  platform,
}: DownloadPatchButtonProps) {
  const { user } = useAuth();
  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;

  // Only premium, creator, and admin roles can download patches.
  // Free users see a disabled button with an upgrade prompt.
  const canDownload =
    user && (user.role === "premium" || user.role === "creator" || user.role === "admin");

  function handleDownload() {
    if (!canDownload) return;

    const content = config.generate(translation, presetName);
    const blob = new Blob([content], { type: config.mimeType });
    const url = URL.createObjectURL(blob);

    const filename = `${config.slugify(presetName)}${config.extension}`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={canDownload ? handleDownload : undefined}
      disabled={!canDownload}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        borderColor: config.color + "4d",
        backgroundColor: config.color + "1a",
        color: config.color,
      }}
      title={
        canDownload
          ? `${config.label} (${config.extension})`
          : "Upgrade to Tone Pass to download patches"
      }
    >
      {/* Download icon */}
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
        />
      </svg>
      {config.label}
    </button>
  );
}
