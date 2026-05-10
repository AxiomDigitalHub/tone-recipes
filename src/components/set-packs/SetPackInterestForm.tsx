"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

interface SetPackInterestFormProps {
  packSlug: string;
  packName: string;
}

export default function SetPackInterestForm({
  packSlug,
  packName,
}: SetPackInterestFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/set-packs/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pack_slug: packSlug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
      track("set_pack_notify_submit", { pack_slug: packSlug });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
        <Check className="h-3.5 w-3.5" />
        We&apos;ll email you when {packName} ships.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <label htmlFor={`set-pack-email-${packSlug}`} className="sr-only">
        Email for {packName} notification
      </label>
      <div className="flex gap-2">
        <input
          id={`set-pack-email-${packSlug}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="min-w-0 flex-1 rounded-lg border border-[var(--ink)]/20 bg-[var(--paper)] px-3 py-2 text-xs text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--amber)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg border border-[var(--ink)]/20 bg-[var(--paper)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--amber)]/60 disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Notify me"
          )}
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}
