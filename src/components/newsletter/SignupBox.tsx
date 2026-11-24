"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * A compact stacked email signup: field, then the accent button. Posts to
 * the same /api/newsletter endpoint as every other signup; `source` says
 * where the subscriber came from.
 */
export default function SignupBox({ source, id }: { source: string; id: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
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
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setEmail("");
      track("newsletter_submit", { source });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="fk-body" role="status">
        You&apos;re on the list.
      </p>
    );
  }

  return (
    <form className="fk-signupbox" onSubmit={onSubmit}>
      <label htmlFor={id} className="fk-sr">
        Email address
      </label>
      <input
        id={id}
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="fk-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="fk-btn fk-btn-accent" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing" : "Subscribe"}
      </button>
      {errorMsg && (
        <p className="fk-caption" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
