"use client";

import Link from "next/link";
import { Check, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/lib/stores/toast-store";

/*
 * The toast stack renders outside .fk-preview, so it carries
 * .fk-overlay-scope to get the design tokens. Paper card, hairline,
 * ink text. Colour is only on the icon: good for success, danger for
 * errors, ink for info. Styles live in redesign-account.css.
 */
const TONE_STYLE: Record<string, { icon: typeof Check; tone: string }> = {
  success: { icon: Check, tone: "is-good" },
  error: { icon: AlertTriangle, tone: "is-danger" },
  info: { icon: Info, tone: "is-info" },
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fk-overlay-scope fk-toaster pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:right-6 md:left-auto md:items-end"
    >
      {toasts.map((t) => {
        const s = TONE_STYLE[t.tone] ?? TONE_STYLE.info;
        const Icon = s.icon;
        return (
          <div
            key={t.id}
            role="status"
            className="fk-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 px-4 py-3"
            style={{ animation: "fk-toast-in 200ms ease-out" }}
          >
            <Icon className={`fk-toast-icon mt-0.5 h-4 w-4 shrink-0 ${s.tone}`} />
            <div className="fk-toast-body flex-1">
              {t.message}
              {t.action && (
                <Link href={t.action.href} className="fk-toast-action ml-2 inline-block">
                  {t.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="fk-toast-close -mr-1 -mt-1 p-1"
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
