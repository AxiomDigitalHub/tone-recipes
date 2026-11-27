import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import stats from "@/data/experiment-stats.json";
import { experimentLog } from "@/data/experiment-log";
import SystemMap from "@/components/experiment/SystemMap";
import AuditHistoryChart from "@/components/experiment/AuditHistoryChart";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

/**
 * /experiment: the running log of the Fader & Knob experiment.
 *
 * The premise of this page is show, don't tell: every number in the
 * dashboard is generated from the git history and content on disk
 * (scripts/generate-experiment-stats.mts), and the timeline is grounded in
 * dated commits. Corrections are counted, not hidden. Nothing here claims a
 * verification step that doesn't exist.
 */

const SITE = "https://faderandknob.com";

export const metadata: Metadata = {
  title: "The Experiment",
  description:
    "Can AI build guitar resources players actually use? Fader & Knob is that question, answered in public — a running log with every number generated from the repository.",
  alternates: { canonical: `${SITE}/experiment` },
  openGraph: {
    title: "The Experiment | Fader & Knob",
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
      title: "AI-written tones",
      body: "Each patch is built from scratch: identify the song, research the historical rig, write the signal chain in real units. Download the file, skip the menu-diving.",
      cta: "Browse the tones",
    },
    {
      href: "/blog",
      title: `A blog by ${stats.ai_writers} AI writers`,
      body: "Guitarists aren't one person, so the blog isn't one voice. Every author is an AI persona: named, differently trained, and labeled as exactly that.",
      cta: "Read the field notes",
    },
    {
      href: "/tone-chat",
      title: "A tone-trained chatbot",
      body: "Axl is built specifically for guitar tone (gain staging, block order, what “darker” actually means) instead of bluffing like a general model.",
      cta: "Ask Axl",
    },
  ];

  const rules = [
    "The dashboard is generated from the repository, not written by hand. If a number is wrong, the code that counts it is wrong, and that gets fixed in public too.",
    "The writers are AI. They're named, they're distinct, and they're labeled. The method is documented, not implied.",
    "Corrections are part of the record. Fixed settings, deleted fake data, dead-end redesigns: they stay in the log, because the log is the experiment.",
    "When something isn't known, it says so. No invented verification steps, no borrowed credentials.",
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
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">The experiment</span>
      </nav>

      {/* Masthead */}
      <header className="fkp-head">
        <h1 className="fk-display fkp-measure-lg">
          Can AI build guitar resources players actually use?
        </h1>
        <p className="fk-lead fkp-measure-lg">
          Fader &amp; Knob is that question, answered in public. One person
          directing AI (the recipes, the writing, the presets, the code)
          with the whole record on this page. The numbers below aren&apos;t
          typed by anyone: they&apos;re generated from the repository, and
          the mistakes are counted next to the wins.
        </p>
        <p className="fk-caption">
          Open experiment · running since{" "}
          <time className="fk-data" dateTime={stats.first_commit}>{fmtDate(stats.first_commit)}</time>{" "}
          · log updated{" "}
          <time className="fk-data" dateTime={stats.generated_at}>{fmtDate(stats.generated_at)}</time>
        </p>
      </header>

      {/* Dashboard */}
      <section aria-labelledby="dash-head" className="fkp-section">
        <h2 id="dash-head" className="fk-t2">The dashboard</h2>
        <div className="fkp-stats">
          {dash.map((d) => (
            <div key={d.label} className="fk-tile fkp-stat">
              <div className="fkp-stat-value">{d.value}</div>
              <div className="fk-label">{d.label}</div>
              <div className="fk-caption">{d.sub}</div>
            </div>
          ))}
        </div>
        <p className="fk-caption">
          Counted from the git history and content on disk at generation
          time, including the corrections.
        </p>
      </section>

      {/* The three offerings */}
      <section aria-labelledby="offer-head" className="fkp-section">
        <h2 id="offer-head" className="fk-t2">What the experiment produced</h2>
        <div className="fkp-tiles">
          {offerings.map((o) => (
            <Link key={o.href} href={o.href} className="fk-tile fkp-linktile">
              <h3 className="fk-t3">{o.title}</h3>
              <p className="fk-body-sm fkp-grow">{o.body}</p>
              <span className="fkp-tilecta">
                {o.cta}
                <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Everyone here is a machine: the system map */}
      <section aria-labelledby="machine-head" className="fkp-section">
        <h2 id="machine-head" className="fk-t2">Everyone here is a machine</h2>
        <p className="fk-body fkp-muted fkp-measure">
          Here&apos;s the whole operation, drawn out. Every worker in it (every
          writer, every preset builder, every inspector) is a piece of
          software. This is who&apos;s on staff.
        </p>
        <SystemMap />
      </section>

      {/* What the Recipe Audit box above actually did, over time */}
      <section aria-labelledby="audit-head" className="fkp-section">
        <h2 id="audit-head" className="fk-t2">The inspector&apos;s record</h2>
        <p className="fk-body fkp-muted fkp-measure">
          The Recipe Audit runs every rule against every recipe. Here is what
          it has found since May, including the weeks it was failing most of
          the library, and every batch of new recipes that landed dirty
          before it got cleaned up.
        </p>
        <AuditHistoryChart />
      </section>

      {/* The running log */}
      <section aria-labelledby="log-head" className="fkp-section">
        <h2 id="log-head" className="fk-t2">The running log</h2>
        <ol className="fkp-log">
          {experimentLog.map((e) => (
            <li key={e.date + e.title}>
              <time className="fk-data fkp-log-date" dateTime={e.date}>{e.date}</time>
              <div className="fkp-log-body">
                <h3 className="fkp-log-title">{e.title}</h3>
                <p className="fk-body-sm">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* How to read this */}
      <section aria-labelledby="rules-head" className="fkp-section">
        <h2 id="rules-head" className="fk-t2">How to read this page</h2>
        <ol className="fkp-numlist fkp-measure-lg">
          {rules.map((rule, i) => (
            <li key={i}>
              <span className="fkp-numlist-n" aria-hidden="true">{i + 1}</span>
              <span className="fkp-muted">{rule}</span>
            </li>
          ))}
        </ol>
        <p className="fk-body fkp-muted fkp-measure-lg">
          Spot something wrong? That&apos;s the experiment working.{" "}
          <ContactEmailLink label="Tell us" className="fk-link" />{" "}
          and the fix ships in public.
        </p>
      </section>
    </div>
  );
}
