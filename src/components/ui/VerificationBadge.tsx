import { Bot, Users, BadgeCheck } from "lucide-react";
import { getVerificationInfo, type VerificationLevel } from "@/lib/verification";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "sm" | "md";
}

const sizes = {
  sm: { badge: "px-1.5 py-0.5 text-[10px] gap-1", icon: "h-3 w-3", check: "h-4 w-4" },
  md: { badge: "px-2.5 py-0.5 text-xs gap-1.5", icon: "h-3.5 w-3.5", check: "h-5 w-5" },
};

export default function VerificationBadge({ level, size = "sm" }: VerificationBadgeProps) {
  const info = getVerificationInfo(level);
  const s = sizes[size];

  // Editor verified = just a blue check icon, no pill
  if (level === "editor_verified") {
    return (
      <span title={info.description} aria-label="Verified" className="inline-flex shrink-0">
        <BadgeCheck className={`${s.check} text-sky-400`} strokeWidth={2} />
      </span>
    );
  }

  const pillConfig = {
    ai_generated: {
      icon: Bot,
      classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
    community_verified: {
      icon: Users,
      classes: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
  } as const;

  const { icon: Icon, classes } = pillConfig[level];

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
