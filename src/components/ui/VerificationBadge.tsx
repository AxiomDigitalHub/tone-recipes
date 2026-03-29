import { Bot, Users, BadgeCheck } from "lucide-react";
import { getVerificationInfo, type VerificationLevel } from "@/lib/verification";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "sm" | "md";
}

const config: Record<VerificationLevel, {
  icon: typeof Bot;
  classes: string;
}> = {
  ai_generated: {
    icon: Bot,
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  community_verified: {
    icon: Users,
    classes: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  editor_verified: {
    icon: BadgeCheck,
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
};

const sizes = {
  sm: { badge: "px-1.5 py-0.5 text-[10px] gap-1", icon: "h-3 w-3" },
  md: { badge: "px-2.5 py-0.5 text-xs gap-1.5", icon: "h-3.5 w-3.5" },
};

export default function VerificationBadge({ level, size = "sm" }: VerificationBadgeProps) {
  const info = getVerificationInfo(level);
  const { icon: Icon, classes } = config[level];
  const s = sizes[size];

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
