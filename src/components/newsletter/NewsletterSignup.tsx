"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

interface NewsletterSignupProps {
  variant?: "card" | "banner" | "footer";
  headline?: string;
  subtext?: string;
  buttonText?: string;
  source?: string;
  className?: string;
  /** Social attribution (the /ig link page). Sent to /api/newsletter, stored as social:<source>:<content>. */
  utm?: { source: string; content?: string | null };
}

export default function NewsletterSignup({
  variant = "card",
  headline = "Get tone recipes + news",
  subtext = "The sounds behind your favorite songs, plus all that’s new in guitar tone.",
  buttonText = "Subscribe",
  source = "newsletter",
  className = "",
  utm,
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
        body: JSON.stringify({ email, source, ...(utm ? { utm_source: utm.source, utm_content: utm.content ?? undefined } : {}) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
      track("newsletter_submit", { source, variant });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className={`fk-nl fk-nl-success ${className}`}>
        <Check className="h-5 w-5" aria-hidden />
        <p>You&apos;re in!</p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`fk-nl fk-nl-banner ${className}`}>
        <div className="fk-nl-banner-row">
          <div className="fk-nl-copy">
            <h3 className="fk-nl-title">{headline}</h3>
            <p className="fk-nl-sub">{subtext}</p>
          </div>
          <form onSubmit={handleSubmit} className="fk-nl-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="fk-input fk-nl-input"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="fk-btn fk-nl-btn"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
            </button>
          </form>
        </div>
        {errorMsg && <p className="fk-nl-error">{errorMsg}</p>}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`fk-nl fk-nl-footer ${className}`}>
        <h4 className="fk-nl-title">{headline}</h4>
        <p className="fk-nl-sub">{subtext}</p>
        <form onSubmit={handleSubmit} className="fk-nl-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            aria-label="Email address"
            className="fk-input fk-nl-input"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="fk-btn fk-btn-sm fk-nl-btn"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
          </button>
        </form>
        {errorMsg && <p className="fk-nl-error">{errorMsg}</p>}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`fk-nl fk-nl-card ${className}`}>
      <div className="fk-nl-icon" aria-hidden>
        <Mail className="h-6 w-6" />
      </div>
      <h3 className="fk-nl-title">{headline}</h3>
      <p className="fk-nl-sub">{subtext}</p>
      <form onSubmit={handleSubmit} className="fk-nl-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address"
          className="fk-input fk-nl-input"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="fk-btn fk-nl-btn"
        >
          {status === "loading" ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : buttonText}
        </button>
      </form>
      {errorMsg && <p className="fk-nl-error">{errorMsg}</p>}
    </div>
  );
}
