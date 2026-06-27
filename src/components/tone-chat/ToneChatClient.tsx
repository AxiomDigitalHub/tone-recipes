"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/db/client";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PLATFORMS = [
  { value: "", label: "Any rig" },
  { value: "helix", label: "Helix / HX" },
  { value: "quad_cortex", label: "Quad Cortex" },
  { value: "fractal", label: "Fractal" },
  { value: "kemper", label: "Kemper" },
  { value: "tonex", label: "TONEX" },
  { value: "katana", label: "Boss Katana" },
  { value: "pedalboard", label: "Pedalboard" },
];

const STARTERS = [
  "How do I get SRV's Texas blues tone on a Helix?",
  "Ambient worship clean with shimmer for HX Stomp",
  "My high-gain tone sounds fizzy in the mix — what do I fix?",
  "Build me The Edge's dotted-eighth delay sound",
];

/** Minimal markdown-ish renderer: [text](url) links, **bold**, paragraphs. */
function renderAssistantText(text: string) {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => (
    <p key={pi} className="mb-2 last:mb-0 whitespace-pre-wrap leading-relaxed">
      {para.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = link[2];
          const internal = href.startsWith("/");
          return internal ? (
            <Link
              key={i}
              href={href}
              className="underline decoration-[var(--amber,#B97700)] underline-offset-2 font-medium hover:text-[var(--amber,#B97700)]"
            >
              {link[1]}
            </Link>
          ) : (
            <span key={i}>{link[1]}</span>
          );
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  ));
}

export default function ToneChatClient() {
  const [authState, setAuthState] = useState<"loading" | "out" | "in">("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<{ text: string; upgrade?: boolean } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthState("out");
      return;
    }
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? "in" : "out");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "in" : "out");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      setError(null);
      setBusy(true);
      setInput("");

      const history = [...messagesRef.current, { role: "user" as const, content: trimmed }];
      setMessages(history);

      try {
        if (!isSupabaseConfigured()) {
          setAuthState("out");
          setBusy(false);
          return;
        }
        const supabase = createBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setAuthState("out");
          setBusy(false);
          return;
        }

        const res = await fetch("/api/tone-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: history,
            ...(platform ? { platform } : {}),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError({
            text: data.error || "Something went wrong. Try again.",
            upgrade: !!data.upgrade,
          });
          // Roll the optimistic user message back into the input box.
          setMessages(messagesRef.current.slice(0, -1));
          setInput(trimmed);
          setBusy(false);
          return;
        }

        const rem = res.headers.get("x-tone-chat-remaining");
        if (rem !== null) setRemaining(Number(rem));

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: next[next.length - 1].content + chunk,
            };
            return next;
          });
        }
      } catch {
        setError({ text: "Connection dropped mid-answer. Ask again." });
      } finally {
        setBusy(false);
      }
    },
    [busy, platform],
  );

  if (authState === "loading") {
    return (
      <div className="py-24 text-center text-[var(--ink-muted,#6b6257)]">Tuning up…</div>
    );
  }

  if (authState === "out") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="mb-6 text-lg text-[var(--ink,#0A0908)]">
          Axl&apos;s free to talk to — you just need an account so we can keep track of your daily messages.
        </p>
        <Link
          href="/login?next=/tone-chat"
          className="inline-block border-2 border-[var(--ink,#0A0908)] bg-[var(--amber,#B97700)] px-6 py-3 font-semibold text-[var(--ink,#0A0908)] hover:translate-y-[-1px] transition-transform"
        >
          Sign in to start chatting
        </Link>
        <p className="mt-4 text-sm text-[var(--ink-muted,#6b6257)]">
          Free accounts get 10 messages a day. Pass members get effectively unlimited.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "60vh" }}>
      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto border border-[var(--paper-line,#d8cfc0)] bg-[var(--paper,#F4F1EA)] p-4 sm:p-6"
        style={{ maxHeight: "55vh", minHeight: "40vh" }}
      >
        {messages.length === 0 && (
          <div>
            <p className="mb-4 text-[var(--ink-muted,#6b6257)]">
              Axl here. Ask me about any tone — an artist, a song, a feel, or a
              problem you&apos;re fighting. Pick your rig and I&apos;ll talk in its language.
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="border border-[var(--ink,#0A0908)]/25 bg-white/60 px-3 py-1.5 text-left text-sm text-[var(--ink,#0A0908)] hover:border-[var(--amber,#B97700)] hover:text-[var(--amber,#B97700)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] border border-[var(--ink,#0A0908)] bg-[var(--ink,#0A0908)] px-4 py-2.5 text-sm text-[var(--paper,#F4F1EA)]"
                  : "max-w-[85%] border border-[var(--paper-line,#d8cfc0)] bg-white/70 px-4 py-2.5 text-sm text-[var(--ink,#0A0908)]"
              }
            >
              {m.role === "assistant" ? (
                m.content ? (
                  renderAssistantText(m.content)
                ) : (
                  <span className="text-[var(--ink-muted,#6b6257)]">…</span>
                )
              ) : (
                <span className="whitespace-pre-wrap">{m.content}</span>
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="border border-[var(--amber,#B97700)] bg-[var(--amber,#B97700)]/10 px-4 py-3 text-sm text-[var(--ink,#0A0908)]">
            {error.text}{" "}
            {error.upgrade && (
              <Link href="/pricing" className="font-semibold underline decoration-[var(--amber,#B97700)]">
                See the Pass →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          aria-label="Your rig"
          className="border border-[var(--ink,#0A0908)]/30 bg-white/80 px-2 py-2.5 text-sm text-[var(--ink,#0A0908)]"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Gilmour's Comfortably Numb solo tone, but on my Quad Cortex"
          maxLength={2000}
          className="flex-1 border border-[var(--ink,#0A0908)]/30 bg-white/80 px-3 py-2.5 text-sm text-[var(--ink,#0A0908)] placeholder:text-[var(--ink-muted,#6b6257)]/70 focus:border-[var(--amber,#B97700)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="border-2 border-[var(--ink,#0A0908)] bg-[var(--amber,#B97700)] px-5 py-2.5 text-sm font-semibold text-[var(--ink,#0A0908)] disabled:opacity-40"
        >
          {busy ? "Dialing…" : "Send"}
        </button>
      </form>
      {remaining !== null && remaining <= 5 && (
        <p className="mt-2 text-xs text-[var(--ink-muted,#6b6257)]">
          {remaining === 0
            ? "That was your last message for today."
            : `${remaining} message${remaining === 1 ? "" : "s"} left today.`}{" "}
          <Link href="/pricing" className="underline">
            Pass members chat without thinking about it.
          </Link>
        </p>
      )}
    </div>
  );
}
