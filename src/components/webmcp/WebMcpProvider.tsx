"use client";

import { useEffect } from "react";
import type { ModelContext } from "./register";

// Registers WebMCP tools (navigator.modelContext) so in-browser AI agents can
// search recipes and read settings directly. The tool module (and the full
// @/lib/data payload it pulls in) is only downloaded when the browser actually
// exposes the API — regular visitors just pay for this feature-detect.
export default function WebMcpProvider() {
  useEffect(() => {
    const modelContext =
      (navigator as Navigator & { modelContext?: ModelContext }).modelContext ??
      (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!modelContext) return;

    let cancelled = false;
    import("./register")
      .then(({ registerWebMcpTools }) => {
        if (!cancelled) registerWebMcpTools(modelContext);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
