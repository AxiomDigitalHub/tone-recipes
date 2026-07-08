"use client";

import Link from "next/link";
import { useState } from "react";

// The footer is the full map — the top nav stays minimal (Tones / Blog /
// News / Pricing) and everything else is findable here.
const exploreLinks = [
  { href: "/browse", label: "Browse Tones" },
  { href: "/platforms", label: "Platforms" },
  { href: "/tone-chat", label: "Ask Axl (tone chat)" },
  { href: "/gear", label: "Gear" },
  { href: "/compare", label: "Compare" },
  { href: "/request", label: "Request a Tone" },
  { href: "/how-it-works", label: "How It Works" },
];

const communityLinks = [
  { href: "/experiment", label: "The Experiment" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community Hub" },
  { href: "/feed.xml", label: "RSS Feed" },
  { href: "/llms.txt", label: "llms.txt" },
];

function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    setErr("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setState("ok");
      setEmail("");
    } catch (e) {
      setState("err");
      setErr(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (state === "ok") {
    return (
      <p className="fk-footer-news-ok">
        <span aria-hidden>✦</span> You&apos;re on the list. Friday delivery.
      </p>
    );
  }

  return (
    <form className="fk-footer-news-form" onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="fk-footer-news-input"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="fk-footer-news-submit"
      >
        {state === "loading" ? "…" : "Subscribe"}
      </button>
      {state === "err" && <p className="fk-footer-news-err">{err}</p>}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="fk-footer">
      <div className="fk-footer-inner">
        <div className="fk-footer-grid">
          <div className="fk-footer-brand">
            <span className="fk-footer-mark display">Fader &amp; Knob</span>
            <p className="fk-footer-tagline">Stop tweaking. Start playing.</p>
          </div>

          <nav className="fk-footer-col" aria-label="Explore">
            <h3 className="fk-footer-colhead">Explore</h3>
            <ul>
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="fk-footer-col" aria-label="Community">
            <h3 className="fk-footer-colhead">Community</h3>
            <ul>
              {communityLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="fk-footer-col fk-footer-news">
            <h3 className="fk-footer-colhead">The Friday send</h3>
            <p className="fk-footer-news-dek">
              One recipe, one field note, one quick fix. Every Friday.
            </p>
            <NewsletterInline />
          </div>
        </div>

        <div className="fk-footer-bottom">
          <div className="fk-footer-legal">
            <span>© {new Date().getFullYear()} Axiom Digital.</span>
            <Link href="/about">About</Link>
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className="fk-footer-disclaimer">
            Fader &amp; Knob is an open AI experiment — the recipes, articles,
            and presets are AI-built, and the record is public.{" "}
            <Link href="/experiment">See the running log</Link>. Some links are
            affiliate links — Fader &amp; Knob may earn a commission on
            purchases at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
