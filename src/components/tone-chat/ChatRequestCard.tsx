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
        setState({ kind: "error", text: "Your session expired. Log in again.", upgrade: false });
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
      setState({ kind: "error", text: "Connection dropped. Try again.", upgrade: false });
    }
  }

  return (
    <div className="fk-cc fk-cr">
      <div className="fk-cc-head">
        <span className="fk-cc-title">Tone request</span>
        <span className="fk-cc-platform">Not in the archive yet</span>
      </div>
      <div className="fk-cr-body">
        <p className="fk-cr-song">
          {request.song_name}
          <span className="fk-cr-artist">, {request.artist_name}</span>
        </p>
        <p className="fk-cr-meta">
          {request.part}
          {request.description ? ` · ${request.description}` : ""}
        </p>

        {state.kind === "filed" ? (
          <p className="fk-cr-status">
            Filed. We&apos;ll build it and ping you when it&apos;s ready.{" "}
            {state.remaining !== null && state.limit !== null && (
              <span className="fk-cr-muted">
                {state.remaining} of {state.limit} requests left this month.{" "}
              </span>
            )}
            <Link
              href="/dashboard/my-tones"
              className="fk-link"
            >
              Track it in Your Tones →
            </Link>
          </p>
        ) : (
          <div className="fk-cr-actions">
            <button
              type="button"
              onClick={file}
              disabled={state.kind === "filing"}
              className="fk-chat-cta fk-chat-cta-sm"
            >
              {state.kind === "filing" ? "Filing…" : "File this request"}
            </button>
            {state.kind === "error" && (
              <span className="fk-cr-status">
                {state.text}{" "}
                {state.upgrade && (
                  <Link
                    href="/pricing"
                    className="fk-link"
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
