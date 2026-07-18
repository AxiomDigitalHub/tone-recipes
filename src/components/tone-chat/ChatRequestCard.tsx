"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/db/client";

/**
 * ```fk-request``` card — Axl's off-catalog handoff to the tone request
 * queue. The model prefills the request; the USER files it with a tap.
 * Keeping the write behind an explicit click matters twice over: filing
 * is metered (monthly quota), and an AI answer should never spend the
 * user's quota on its own initiative.
 *
 * POSTs to /api/tone-requests — same auth/quota/rate-limit path as the
 * /request form, so 402s carry the upgrade CTA and success carries the
 * remaining count.
 */

const VALID_PARTS = new Set([
  "lead guitar",
  "rhythm guitar",
  "bass",
  "synth/keys",
  "other",
]);

export interface FkRequest {
  song_name: string;
  artist_name: string;
  part: string;
  description?: string;
}

export function parseFkRequest(json: string): FkRequest | null {
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    const song_name = typeof data.song_name === "string" ? data.song_name.trim() : "";
    const artist_name = typeof data.artist_name === "string" ? data.artist_name.trim() : "";
    if (!song_name || !artist_name) return null;
    const rawPart = typeof data.part === "string" ? data.part.trim().toLowerCase() : "";
    return {
      song_name: song_name.slice(0, 200),
      artist_name: artist_name.slice(0, 200),
      part: VALID_PARTS.has(rawPart) ? rawPart : "lead guitar",
      description:
        typeof data.description === "string"
          ? data.description.trim().slice(0, 1000)
          : undefined,
    };
  } catch {
    return null;
  }
}

type CardState =
  | { kind: "idle" }
  | { kind: "filing" }
  | { kind: "filed"; remaining: number | null; limit: number | null }
  | { kind: "error"; text: string; upgrade: boolean };

export default function ChatRequestCard({ request }: { request: FkRequest }) {
  const [state, setState] = useState<CardState>({ kind: "idle" });

  async function file() {
    if (state.kind === "filing" || state.kind === "filed") return;
    setState({ kind: "filing" });

    try {
      if (!isSupabaseConfigured()) {
        setState({ kind: "error", text: "Sign in to file requests.", upgrade: false });
        return;
      }
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState({ kind: "error", text: "Your session expired — log in again.", upgrade: false });
        return;
      }

      const res = await fetch("/api/tone-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          song_name: request.song_name,
          artist_name: request.artist_name,
          part: request.part,
          description: request.description,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setState({
          kind: "filed",
          remaining: typeof data.remaining === "number" ? data.remaining : null,
          limit: typeof data.limit === "number" ? data.limit : null,
        });
      } else {
        setState({
          kind: "error",
          text: data.error || "Couldn't file the request. Try again.",
          upgrade: !!data.upgrade_url,
        });
      }
    } catch {
      setState({ kind: "error", text: "Connection dropped — try again.", upgrade: false });
    }
  }

  return (
    <div className="my-3 border border-[var(--ink,#0A0908)]/40 bg-[var(--paper,#F4F1EA)]">
      <div className="flex items-center justify-between border-b border-[var(--ink,#0A0908)]/15 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted,#6b6257)]">
          Tone request
        </span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted,#6b6257)]">
          Not in the archive yet
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-[var(--ink,#0A0908)]">
          {request.song_name}
          <span className="font-normal text-[var(--ink-muted,#6b6257)]"> — {request.artist_name}</span>
        </p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted,#6b6257)]">
          {request.part}
          {request.description ? ` · ${request.description}` : ""}
        </p>

        {state.kind === "filed" ? (
          <p className="mt-2.5 text-xs text-[var(--ink,#0A0908)]">
            Filed — we&apos;ll build it and ping you when it&apos;s ready.{" "}
            {state.remaining !== null && state.limit !== null && (
              <span className="text-[var(--ink-muted,#6b6257)]">
                {state.remaining} of {state.limit} requests left this month.{" "}
              </span>
            )}
            <Link
              href="/dashboard/my-tones"
              className="underline decoration-[var(--amber,#B97700)] underline-offset-2 font-medium"
            >
              Track it in Your Tones →
            </Link>
          </p>
        ) : (
          <div className="mt-2.5 flex items-center gap-3">
            <button
              type="button"
              onClick={file}
              disabled={state.kind === "filing"}
              className="fk-chat-cta fk-chat-cta-sm"
            >
              {state.kind === "filing" ? "Filing…" : "File this request"}
            </button>
            {state.kind === "error" && (
              <span className="text-xs text-[var(--ink,#0A0908)]">
                {state.text}{" "}
                {state.upgrade && (
                  <Link
                    href="/pricing"
                    className="font-semibold underline decoration-[var(--amber,#B97700)]"
                  >
                    See the Pass →
                  </Link>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
