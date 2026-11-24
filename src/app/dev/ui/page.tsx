import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

export const metadata: Metadata = {
  title: "UI foundation",
  description: "Redesign step 1: tokens, type, buttons, chips, cards.",
  robots: { index: false, follow: false },
};

/**
 * /dev/ui: the redesign foundation on one page (build order step 1).
 * Tokens, type scale, buttons, chips, search field and cards. Not indexed.
 * The header and footer around this page are the new ones.
 */

const COLORS: [string, string, string][] = [
  ["paper", "#ffffff", "Page background"],
  ["wash", "#f6f6f4", "Tiles"],
  ["inverse", "#0c0d0e", "Dark band"],
  ["ink", "#131416", "Text, primary button"],
  ["ink-2", "#4a4f55", "Secondary text"],
  ["ink-3", "#666c73", "Captions"],
  ["line", "#dcdfe2", "Hairlines"],
  ["line-2", "#eceef0", "Soft hairlines"],
  ["line-strong", "#858b92", "Control borders"],
  ["accent", "#e4a235", "Amber accent"],
  ["accent-text", "#7a5200", "Amber text links"],
  ["good", "#2f6b3a", "Success"],
];

const TONES = [
  ["Sultans of Swing", "Dire Straits, Mark Knopfler", "1978 · 9 blocks"],
  ["Painkiller", "Judas Priest, Glenn Tipton", "1990 · 9 blocks"],
  ["Smoke on the Water", "Deep Purple, Ritchie Blackmore", "1972 · 8 blocks"],
  ["Under the Bridge", "Red Hot Chili Peppers, John Frusciante", "1991 · 7 blocks"],
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="fk-t2">{title}</h2>
      {children}
    </section>
  );
}

export default function UiFoundationPage() {
  return (
    <div className="fk-wrap" style={{ paddingTop: 48, display: "flex", flexDirection: "column", gap: 72 }}>
      <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 className="fk-display">UI foundation</h1>
        <p className="fk-lead fk-wrap-text">
          Step 1 of the redesign: tokens, fonts, header, footer, buttons, chips
          and cards. Light is the default. Dark is here to review: the switch below turns it on
          for the whole site in this browser.
        </p>
        <ThemeSwitch />
      </header>

      <Section title="Colour">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 16 }}>
          {COLORS.map(([name, hex, use]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                className="r-md"
                style={{ height: 72, background: hex, border: "1px solid var(--fk-line)" }}
              />
              <div>
                <p className="fk-body-sm" style={{ color: "var(--fk-ink)", fontWeight: 600 }}>{name}</p>
                <p className="fk-data" style={{ margin: 0, color: "var(--fk-ink-3)" }}>{hex}</p>
                <p className="fk-caption">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p className="fk-display">Display 56/58</p>
          <p className="fk-t1">Title one 40/44</p>
          <p className="fk-t2">Title two 28/34</p>
          <p className="fk-t3">Title three 20/26</p>
          <p className="fk-lead">Lead 20/30. We map the full signal chain of an iconic recording.</p>
          <p className="fk-body">Body 16/26. Every recipe is built from the original recording: the gear, the chain, the sources.</p>
          <p className="fk-body-sm">Body small 14/22. Mark Knopfler, Dire Straits, 1978</p>
          <p className="fk-label">Label 15/20 medium</p>
          <p className="fk-caption">Caption 13/18. Modeler masterclass, 9 min read</p>
          <p className="fk-data" style={{ margin: 0 }}>Data 13/20 mono: 3.5 · 1978 · 9 blocks · $4.99</p>
          <p className="fk-body">
            Links: <Link href="/browse" className="fk-link">See all recipes</Link> and{" "}
            <Link href="/blog" className="fk-link-accent">an amber text link</Link>.
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Link href="/browse" className="fk-btn">Primary</Link>
          <Link href="/browse" className="fk-btn fk-btn-secondary">Secondary</Link>
          <Link href="/browse" className="fk-btn fk-btn-accent">Accent</Link>
          <Link href="/browse" className="fk-btn fk-btn-sm">Primary small</Link>
          <Link href="/browse" className="fk-btn fk-btn-secondary fk-btn-sm">Secondary small</Link>
          <button type="button" className="fk-btn" disabled>Disabled</button>
          <button type="button" className="fk-iconbtn" aria-label="Search">
            <Search size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <div className="fk-band" style={{ padding: 32, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Link href="/browse" className="fk-btn fk-btn-light">Light</Link>
          <Link href="/how-it-works" className="fk-btn fk-btn-ghost">Ghost</Link>
          <Link href="/browse" className="fk-btn fk-btn-accent">Accent</Link>
          <p className="fk-body-sm" style={{ color: "var(--fk-on-inverse-2)" }}>On the dark inverse band</p>
        </div>
      </Section>

      <Section title="Chips">
        <div className="fk-chips" role="group" aria-label="Settings for">
          <button type="button" className="fk-chip" aria-pressed="true">Helix</button>
          <button type="button" className="fk-chip" aria-pressed="false">Quad Cortex</button>
          <button type="button" className="fk-chip" aria-pressed="false">TONEX</button>
          <button type="button" className="fk-chip" aria-pressed="false">Fractal</button>
          <button type="button" className="fk-chip" aria-pressed="false">Kemper</button>
          <button type="button" className="fk-chip" aria-pressed="false">Katana</button>
          <button type="button" className="fk-chip" aria-pressed="false">Pedalboard</button>
        </div>
      </Section>

      <Section title="Search field">
        <form role="search" action="/browse" className="fk-search">
          <Search size={20} strokeWidth={1.75} aria-hidden />
          <label htmlFor="dev-q" className="fk-sr">Search tones</label>
          <input id="dev-q" name="q" type="search" placeholder="Try a song, artist or guitarist" />
          <button type="submit">Search</button>
        </form>
      </Section>

      <Section title="Cards">
        <div className="fk-card-grid">
          {TONES.map(([title, who, meta]) => (
            <Link key={title} href="/browse" className="fk-card">
              <div className="fk-card-art">
                <span className="fk-caption">Album cover</span>
              </div>
              <div className="fk-card-body">
                <div className="fk-card-head">
                  <h3 className="fk-t3">{title}</h3>
                  <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                </div>
                <p className="fk-body-sm">{who}</p>
                <p className="fk-card-meta">{meta}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 24 }}>
          <Link href="/dashboard/my-gear" className="fk-tile">
            <span className="fk-card-head" style={{ fontSize: 15, fontWeight: 600 }}>
              Your rig
              <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="fk-caption">
              Wash tile. Tell us what you own and each recipe shows what matches.
            </span>
          </Link>

          <div className="fk-tile" style={{ padding: 24 }}>
            <div className="fk-panel">
              <div>
                <h3 className="fk-t3">Sultans of Swing</h3>
                <p className="fk-body-sm">Paper panel on a wash tile</p>
              </div>
              <p className="fk-data" style={{ margin: 0, color: "var(--fk-ink-3)" }}>8 blocks</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Link href="/blog" className="fk-rowcard">
              <div className="fk-rowcard-art" />
              <div>
                <h3 className="fk-rowcard-title">Which delays run out of time at slow tempos?</h3>
                <p className="fk-caption">Row card. Modeler masterclass, 9 min read</p>
              </div>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="fk-step-num">1</span>
              <h3 className="fk-t3">Find your tone</h3>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
