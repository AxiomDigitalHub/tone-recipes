"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "card" | "banner" | "footer";
  headline?: string;
  subtext?: string;
  buttonText?: string;
  source?: string;
  className?: string;
}

export default function NewsletterSignup({
  variant = "card",
  headline = "Get a free tone recipe every Friday",
  subtext = "One recipe, one blog post, one quick tip. No spam, unsubscribe anytime.",
  buttonText = "Subscribe",
  source = "newsletter",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center justify-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center ${className}`}>
        <Check className="h-5 w-5 text-emerald-400" />
        <p className="font-medium text-emerald-400">
          You&apos;re in! Check your inbox Friday.
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`rounded-xl border border-accent/20 bg-accent/5 p-6 sm:p-8 ${className}`}>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">{headline}</h3>
            <p className="mt-1 text-sm text-muted">{subtext}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-50"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
            </button>
          </form>
        </div>
        {errorMsg && <p className="mt-2 text-center text-xs text-red-400">{errorMsg}</p>}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={className}>
        <h4 className="text-sm font-semibold text-foreground">{headline}</h4>
        <p className="mt-1 text-xs text-muted">{subtext}</p>
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
          </button>
        </form>
        {errorMsg && <p className="mt-1 text-xs text-red-400">{errorMsg}</p>}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`rounded-2xl border border-border bg-surface p-8 text-center sm:p-10 ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <Mail className="h-6 w-6 text-accent" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-foreground">{headline}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{subtext}</p>
      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : buttonText}
        </button>
      </form>
      {errorMsg && <p className="mt-2 text-xs text-red-400">{errorMsg}</p>}
    </div>
  );
}
