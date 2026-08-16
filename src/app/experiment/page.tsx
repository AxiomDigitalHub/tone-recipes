import Link from "next/link";
import type { Metadata } from "next";
import stats from "@/data/experiment-stats.json";
import { experimentLog } from "@/data/experiment-log";
import SystemMap from "@/components/experiment/SystemMap";
import AuditHistoryChart from "@/components/experiment/AuditHistoryChart";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

/**
 * /experiment — the running log of the Fader & Knob experiment.
 *
 * The premise of this page is show, don't tell: every number in the
 * dashboard is generated from the git history and content on disk
 * (scripts/generate-experiment-stats.mts), and the timeline is grounded in
 * dated commits. Corrections are counted, not hidden. Nothing here claims a
 * verification step that doesn't exist.
 */

const SITE = "https://faderandknob.com";

export const metadata: Metadata = {
  title: "The Experiment — Fader & Knob",
  description:
    "Can AI build guitar resources players actually use? Fader & Knob is that question, answered in public — a running log with every number generated from the repository.",
  alternates: { canonical: `${SITE}/experiment` },
  openGraph: {
    title: "The Experiment — Fader & Knob",
    description:
      "One person, AI, and a running public log: tone recipes, ten AI writers, a tone chatbot — corrections included.",
    type: "website",
  },
};

function daysBetween(a: string, b: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(b + "T00:00:00Z").getTime() -
        new Date(a + "T00:00:00Z").getTime()) /
        86_400_000,
    ),
  );
}

function fmtDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ExperimentPage() {
  const daysRunning = daysBetween(stats.first_commit, stats.generated_at);

  const dash: { value: string; label: string; sub: string }[] = [
    { value: String(daysRunning), label: "Days running", sub: `since ${fmtDate(stats.first_commit)}` },
    { value: String(stats.commits), label: "Commits", sub: "every change, public record" },
    { value: String(stats.recipes), label: "Tone recipes", sub: `${stats.platforms_with_preset_files} platforms get a preset file, ${stats.platforms_covered - stats.platforms_with_preset_files} get settings only` },
    { value: String(stats.blog_posts), label: "Articles", sub: "written by the AI masthead" },
    { value: String(stats.ai_writers), label: "AI writers", sub: "named, tuned, disclosed" },
    { value: String(stats.presets_downloadable), label: "Downloadable", sub: "tones that build you a Helix preset on request" },
    { value: String(stats.autonomous_daily_runs), label: "Autonomous runs", sub: "days the engine published itself" },
    { value: String(stats.public_corrections), label: "Public corrections", sub: "mistakes fixed in the open" },
  ];

  const offerings = [
    {
      href: "/browse",
      kicker: "01",
      title: "AI-written tones",
      body: "Each patch is built from scratch: identify the song, research the historical rig, write the signal chain in real units. Download the file, skip the menu-diving.",
      cta: "Browse the tones",
    },
    {
      href: "/blog",
      kicker: "02",
      title: `A blog by ${stats.ai_writers} AI writers`,
      body: "Guitarists aren't one person, so the blog isn't one voice. Every author is an AI persona — named, differently trained, and labeled as exactly that.",
      cta: "Read the field notes",
    },
    {
      href: "/how-we-work",
      kicker: "03",
      title: "A tone-trained chatbot",
      body: "Axl is built specifically for guitar tone — gain staging, block order, what “darker” actually means — instead of bluffing like a general model.",
      cta: "How it's made",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "The Experiment — Fader & Knob",
    url: `${SITE}/experiment`,
    description: metadata.description,
    dateModified: stats.generated_at,
    isPartOf: { "@type": "WebSite", name: "Fader & Knob", url: SITE },
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="about-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>The Experiment</span>
        </div>

        {/* Masthead */}
        <header className="archive-page-head">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--amber-2)",
              marginBottom: 12,
            }}
          >
            Open experiment · running since {fmtDate(stats.first_commit)} · log
            updated {fmtDate(stats.generated_at)}
          </div>
          <h1 className="archive-title">
            Can AI build guitar resources <em>players actually use?</em>
          </h1>
          <p
            className="archive-lede"
            style={{ maxWidth: 720, marginTop: 16 }}
          >
            Fader &amp; Knob is that question, answered in public. One person
            directing AI — the recipes, the writing, the presets, the code —
            with the whole record on this page. The numbers below aren&apos;t
            typed by anyone: they&apos;re generated from the repository, and
            the mistakes are counted next to the wins.
          </p>
        </header>

        {/* Dashboard */}
        <section aria-labelledby="dash-head" style={{ marginTop: 48 }}>
          <div className="how-head">
            <h2 id="dash-head" className="display">
              The dashboard
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 1,
              background: "color-mix(in srgb, var(--ink) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)",
              marginTop: 20,
            }}
          >
            {dash.map((d) => (
              <div
                key={d.label}
                style={{ background: "var(--paper-2)", padding: "22px 18px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    lineHeight: 1,
                    color: "var(--ink)",
                  }}
                >
                  {d.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--amber-2)",
                    marginTop: 10,
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-muted)",
                    marginTop: 4,
                  }}
                >
                  {d.sub}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.06em",
              color: "var(--ink-faint)",
              marginTop: 10,
            }}
          >
            Counted from the git history and content on disk at generation
            time — including the corrections.
          </p>
        </section>

        {/* The three offerings */}
        <section aria-labelledby="offer-head" style={{ marginTop: 56 }}>
          <div className="how-head">
            <h2 id="offer-head" className="display">
              What the experiment produced
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >
            {offerings.map((o) => (
              <Link
                key={o.kicker}
                href={o.href}
                style={{
                  display: "block",
                  border:
                    "1px solid color-mix(in srgb, var(--ink) 15%, transparent)",
                  background: "var(--paper-2)",
                  padding: "24px 22px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: "var(--amber-2)",
                  }}
                >
                  No. {o.kicker}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--ink)",
                    margin: "10px 0 8px",
                  }}
                >
                  {o.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--ink-muted)",
                    margin: 0,
                  }}
                >
                  {o.body}
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    marginTop: 14,
                  }}
                >
                  {o.cta} →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Everyone here is a machine — the system map */}
        <section aria-labelledby="machine-head" style={{ marginTop: 56 }}>
          <div className="how-head">
            <h2 id="machine-head" className="display">Everyone here is a machine</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-muted)", margin: "16px 0 24px", maxWidth: 640 }}>
            Here&apos;s the whole operation, drawn out. Every worker in it — every
            writer, every preset builder, every inspector — is a piece of
            software. This is who&apos;s on staff.
          </p>
          <SystemMap />
        </section>

        {/* What the Recipe Audit box above actually did, over time */}
        <section aria-labelledby="audit-head" style={{ marginTop: 56 }}>
          <div className="how-head">
            <h2 id="audit-head" className="display">
              The inspector&apos;s record
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-muted)", margin: "16px 0 0", maxWidth: 640 }}>
            The Recipe Audit runs every rule against every recipe. Here is what
            it has found since May — including the weeks it was failing most of
            the library, and every batch of new recipes that landed dirty
            before it got cleaned up.
          </p>
          <AuditHistoryChart />
        </section>

        {/* The running log */}
        <section aria-labelledby="log-head" style={{ marginTop: 56 }}>
          <div className="how-head">
            <h2 id="log-head" className="display">
              The running log
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <ol style={{ listStyle: "none", margin: "24px 0 0", padding: 0 }}>
            {experimentLog.map((e) => (
              <li
                key={e.date + e.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr",
                  gap: 20,
                  padding: "20px 0",
                  borderTop:
                    "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: "var(--amber-2)",
                    paddingTop: 4,
                  }}
                >
                  {e.date}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      color: "var(--ink)",
                      margin: "0 0 6px",
                    }}
                  >
                    {e.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: "var(--ink-muted)",
                      margin: 0,
                      maxWidth: 640,
                    }}
                  >
                    {e.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* How to read this */}
        <section aria-labelledby="rules-head" style={{ marginTop: 56 }}>
          <div className="how-head">
            <h2 id="rules-head" className="display">
              How to read this page
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <ul
            style={{
              listStyle: "none",
              margin: "20px 0 0",
              padding: 0,
              display: "grid",
              gap: 12,
              maxWidth: 720,
            }}
          >
            {[
              "The dashboard is generated from the repository, not written by hand. If a number is wrong, the code that counts it is wrong — and that gets fixed in public too.",
              "The writers are AI. They're named, they're distinct, and they're labeled. The method is documented, not implied.",
              "Corrections are part of the record. Fixed settings, deleted fake data, dead-end redesigns — they stay in the log, because the log is the experiment.",
              "When something isn't known, it says so. No invented verification steps, no borrowed credentials.",
            ].map((rule, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: 12,
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--ink-muted)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--amber-2)",
                    paddingTop: 3,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 28, fontSize: 14.5, color: "var(--ink-muted)", maxWidth: 720 }}>
            The full method — what the AI does, where it fails, how
            corrections happen — lives at{" "}
            <Link
              href="/how-we-work"
              style={{ color: "var(--amber-2)", textDecoration: "underline" }}
            >
              how we work
            </Link>
            . Spot something wrong? That&apos;s the experiment working —{" "}
            <ContactEmailLink
              label="tell us"
              style="color: var(--amber-2); text-decoration: underline"
            />{" "}
            and the fix ships in public.
          </p>
        </section>
      </section>
    </div>
  );
}
