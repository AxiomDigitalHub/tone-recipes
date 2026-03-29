"use client";

import { useState, FormEvent } from "react";

interface NewsletterSignupProps {
  variant: "inline" | "footer";
}

export default function NewsletterSignup({ variant }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (variant === "footer") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Stay in the loop
        </p>

        {status === "success" ? (
          <p className="text-sm text-accent">
            You&apos;re in. First recipe drops this week.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {status === "submitting" ? "..." : "Subscribe"}
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Inline variant
  return (
    <div className="rounded-lg border-l-4 border-accent bg-surface px-6 py-6 md:px-8">
      {status === "success" ? (
        <p className="text-sm font-medium text-accent">
          You&apos;re in. First recipe drops this week.
        </p>
      ) : (
        <>
          <h3
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Get tone recipes in your inbox
          </h3>
          <p className="mt-1 text-sm text-muted">
            One new recipe every week. Exact settings, no fluff.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="shrink-0 rounded-md bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {status === "submitting" ? "..." : "Subscribe"}
            </button>
          </form>

          {status === "error" && (
            <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
}
