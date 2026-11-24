import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";

/**
 * Site footer (redesign, build order step 1). Styles: src/app/redesign.css.
 *
 * The footer is the full map. The top nav stays minimal (Tones / Learn /
 * News / Pricing) and everything else is findable here. Columns follow the
 * handoff reference; the feed and llms.txt links are kept from the previous
 * footer so those surfaces stay discoverable.
 */
const columns = [
  {
    title: "Explore",
    links: [
      { href: "/browse", label: "Browse tones" },
      { href: "/tone-chat", label: "Ask Axl (tone chat)" },
      { href: "/gear", label: "Gear" },
      { href: "/compare", label: "Compare" },
      { href: "/request", label: "Request a tone" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Learning center" },
      { href: "/platforms", label: "Platform guides" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/news", label: "News" },
      { href: "/community", label: "Community hub" },
      { href: "/experiment", label: "The experiment" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/about", label: "About" },
      { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/feed.xml", label: "RSS feed" },
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="fk-foot">
      <div className="fk-foot-inner">
        <div className="fk-foot-top">
          <div className="fk-foot-brand">
            <Wordmark tone="ink" className="fk-foot-logo" />
            <p className="fk-body-sm">
              Tone recipes for modeler players. Every recipe is built from the
              original recording: the gear, the chain, the sources.
            </p>
          </div>
          <div className="fk-foot-cols">
            {columns.map((col) => (
              <nav key={col.title} className="fk-foot-col" aria-label={col.title}>
                <h2>{col.title}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="fk-foot-bottom">
          <p className="fk-caption">
            Part of Guitar Nerd Tools: <Link href="/">Fader &amp; Knob</Link> for
            tone, <a href="https://diagramwiring.com">Diagram Wiring</a> for
            wiring.
          </p>
          <p className="fk-caption">
            © {new Date().getFullYear()} Axiom Digital
          </p>
          <p className="fk-caption fk-foot-note">
            Fader &amp; Knob is an open AI experiment. The recipes, articles and
            presets are AI-built, and the record is public.{" "}
            <Link href="/experiment">See the running log</Link>. Some links are
            affiliate links, and Fader &amp; Knob may earn a commission on
            purchases at no extra cost to you. As an Amazon Associate we earn
            from qualifying purchases.{" "}
            <Link href="/affiliate-disclosure">Full disclosure</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
