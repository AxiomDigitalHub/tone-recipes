"use client";

import type { PlatformTranslation } from "@/types/recipe";
import { generateHelixPreset, slugifyPresetName } from "@/lib/helix/generate-hlx";

interface DownloadPatchButtonProps {
  translation: PlatformTranslation;
  presetName: string;
  platform: string;
}

export default function DownloadPatchButton({
  translation,
  presetName,
  platform,
}: DownloadPatchButtonProps) {
  // Only render for Helix (we'll add Katana etc. later)
  if (platform !== "helix") return null;

  function handleDownload() {
    const hlxJson = generateHelixPreset(translation, presetName);
    const blob = new Blob([hlxJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const filename = `${slugifyPresetName(presetName)}.hlx`;

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
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#cc0000]/30 bg-[#cc0000]/10 px-3 py-1.5 text-xs font-medium text-[#cc0000] transition-colors hover:bg-[#cc0000]/20 hover:border-[#cc0000]/50"
      title="Download Helix preset (.hlx)"
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
      Download .hlx
    </button>
  );
}
