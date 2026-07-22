"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * The homepage "Friday Send" signup form. Extracted from the static
 * markup in app/page.tsx, which posted a native (form-encoded) submit
 * straight at /api/newsletter — the browser navigated to the API URL
 * and showed raw JSON. Same v3 classes, now submitted via fetch with
 * in-place success/error states. The native action/method remain as a
 * no-JS fallback (the API redirects form-encoded submits back to /).
 */
export default function FridaySendForm() {
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
        body: JSON.stringify({ email, source: "homepage-friday-send" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setEmail("");
      track("newsletter_submit", { source: "homepage-friday-send", variant: "friday-send" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="newsletter-confirm" role="status">
        You&apos;re in — check your inbox Friday.
      </p>
    );
  }

  return (
    <form
      className="newsletter-form"
      action="/api/newsletter"
      method="post"
      onSubmit={handleSubmit}
    >
      <label htmlFor="newsletter-email" className="newsletter-label sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="newsletter-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="newsletter-submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {errorMsg && (
        <p className="newsletter-error" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
