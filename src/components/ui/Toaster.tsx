"use client";

import Link from "next/link";
import { Check, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/lib/stores/toast-store";

const TONE_STYLE: Record<
  string,
  { icon: typeof Check; border: string; bg: string; iconColor: string }
> = {
  success: {
    icon: Check,
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: AlertTriangle,
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
  info: {
    icon: Info,
    border: "border-accent/40",
    bg: "bg-accent/10",
    iconColor: "text-accent",
  },
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:right-6 md:left-auto md:items-end"
    >
      {toasts.map((t) => {
        const s = TONE_STYLE[t.tone] ?? TONE_STYLE.info;
        const Icon = s.icon;
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${s.border} ${s.bg} bg-background/95 px-4 py-3 shadow-xl backdrop-blur-sm`}
            style={{ animation: "fk-toast-in 200ms ease-out" }}
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${s.iconColor}`} />
            <div className="flex-1 text-sm leading-snug text-foreground">
              {t.message}
              {t.action && (
                <Link
                  href={t.action.href}
                  className="ml-2 inline-block font-semibold text-accent underline-offset-2 hover:underline"
                >
                  {t.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 rounded p-1 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      <style>{`@keyframes fk-toast-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }`}</style>
    </div>
  );
}
