"use client";

import { useSyncExternalStore } from "react";

/**
 * Light / dark switch for reviewing dark mode (redesign step 9). Lives on
 * /dev/ui only. It sets <html data-theme> and remembers the choice in
 * localStorage, the same key the script in layout.tsx reads.
 */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

export default function ThemeSwitch() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const set = (next: boolean) => {
    if (next) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("fk-theme", next ? "dark" : "light");
    } catch {
      // Storage blocked: the switch still works for this page view.
    }
  };
  return (
    <div className="fk-toggle" role="group" aria-label="Theme">
      <button type="button" aria-pressed={!dark} onClick={() => set(false)}>
        Light
      </button>
      <button type="button" aria-pressed={dark} onClick={() => set(true)}>
        Dark
      </button>
    </div>
  );
}
