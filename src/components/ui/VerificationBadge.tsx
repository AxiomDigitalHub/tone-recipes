import { CircleSlash, FileCheck2, FileWarning } from "lucide-react";
import { getVerificationInfo, type VerificationLevel } from "@/lib/verification";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "sm" | "md";
}

const sizes = {
  sm: { badge: "px-1.5 py-0.5 text-[10px] gap-1", icon: "h-3 w-3" },
  md: { badge: "px-2.5 py-0.5 text-xs gap-1.5", icon: "h-3.5 w-3.5" },
};

/**
 * Preset-completeness badge.
 *
 * Every level here is recomputed from a build of the actual preset file, so
 * the badge can only ever overstate things if the generator lies. The old
 * blue "Editor Verified" check claimed human review that never happened; a
 * partial result is now shown as partial rather than dressed up.
 */
const levelConfig: Record<VerificationLevel, { icon: typeof FileCheck2; classes: string }> = {
  complete: {
    icon: FileCheck2,
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  partial: {
    icon: FileWarning,
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  unbuilt: {
    icon: CircleSlash,
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
};

export default function VerificationBadge({ level, size = "sm" }: VerificationBadgeProps) {
  const info = getVerificationInfo(level);
  const s = sizes[size];
  const { icon: Icon, classes } = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${classes} ${s.badge}`}
      title={info.description}
    >
      <Icon className={s.icon} strokeWidth={1.5} />
      {info.label}
    </span>
  );
}
