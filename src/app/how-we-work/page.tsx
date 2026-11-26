import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

export const metadata: Metadata = {
  alternates: { canonical: "/how-we-work" },
  title: "How We Work",
  description:
    "How Fader & Knob uses AI to research tones, generate presets, and write content — an open experiment with the full record public at /experiment.",
  openGraph: {
    title: "How We Work | Fader & Knob",
    description:
      "An open AI experiment in guitar tone — here's exactly how the machine works.",
    type: "website",
  },
};

export default function HowWeWorkPage() {
  return (
    <div className="fk-wrap fkp-page">
      <div className="fkp-textcol">
        <header className="fkp-head">
          <h1 className="fk-display">How we work</h1>
          <p className="fk-lead">An open AI experiment. Here&apos;s the machine.</p>
        </header>

        <div className="fkp-prose fkp-prose-loose">
          {/* Intro */}
          <p>
            Fader & Knob is an experiment in what happens when one person
            directs AI to build an entire guitar resource. AI does the
            research, the writing, the preset generation, and the code, and
            this page explains how. The running log, with
            every number generated from the repository, lives at{" "}
            <Link href="/experiment" className="fk-link">
              the experiment
            </Link>
            .
          </p>

          {/* What AI does */}
          <h2 className="fk-t2">What AI does</h2>
          <ol className="fkp-numlist">
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">1</span>
              <div>
                <strong>Researches tone settings.</strong>{" "}
                AI analyzes interviews, gear demos, studio session notes, and
                equipment lists to determine what amp, pedals, and settings an
                artist used on a specific recording.
              </div>
            </li>
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">2</span>
              <div>
                <strong>Generates preset files.</strong>{" "}
                Helix, Quad Cortex, and Katana presets are generated
                programmatically from a map of each unit&apos;s model IDs and
                parameter ranges. When one fails to load, the fix ships as a
                public commit.
              </div>
            </li>
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">3</span>
              <div>
                <strong>Writes blog content.</strong>{" "}
                Our blog posts are written by AI editorial voices, each tuned
                to a topic and a style. They are not real people.
              </div>
            </li>
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">4</span>
              <div>
                <strong>Translates across platforms.</strong>{" "}
                When we create a recipe for one modeler, AI maps the signal chain
                to the closest blocks on other platforms: amp models, effect
                types, and parameter ranges.
              </div>
            </li>
          </ol>

          {/* What humans do */}
          <h2 className="fk-t2">What humans do</h2>
          <ol className="fkp-numlist">
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">1</span>
              <div>
                <strong>Run the correction loop.</strong>{" "}
                When a preset fails to load, a setting reads wrong, or a reader
                flags an error, it gets fixed and the fix ships as a public
                commit. The correction count sits on{" "}
                <Link href="/experiment" className="fk-link">
                  the experiment page
                </Link>
                , next to the wins.
              </div>
            </li>
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">2</span>
              <div>
                <strong>Curate and direct.</strong>{" "}
                A human decides which songs to cover, which tones matter, and
                what quality bar to hit.
              </div>
            </li>
            <li>
              <span className="fkp-numlist-n" aria-hidden="true">3</span>
              <div>
                <strong>Own the mistakes.</strong>{" "}
                Research is cross-checked against gear lists, live footage, and
                studio documentation. When it&apos;s still wrong, the error is
                acknowledged and corrected in the open.
              </div>
            </li>
          </ol>

          {/* Why this approach */}
          <h2 className="fk-t2">Why this approach</h2>
          <p>
            Researching a song&apos;s gear, mapping the chain, and translating
            it for six platforms would take a traditional team weeks per
            recipe. AI lets one person cover far more songs and keep prices
            low. The public correction record is the check on that speed:
            every fix is a visible commit.
          </p>
          <p>
            We&apos;d rather show how the sausage gets made than hide it behind
            a polished marketing page. How a recipe got made is part of
            judging whether to trust it.
          </p>

          {/* About the blog writers */}
          <h2 className="fk-t2">About our writers</h2>
          <p>
            Our blog posts are written by AI editorial voices, not real people.
            Each voice sticks to one area (gear reviews, tone science, playing
            technique) and one style. We split them up because one generic
            byline wrote blander posts.
          </p>
          <p>
            Posts are generated from cited research and corrected in public
            when an audit or a reader catches an error. If you spot something
            wrong, email <ContactEmailLink className="fk-link" />{" "}
            and we&apos;ll fix it.
          </p>

          {/* The bottom line */}
          <div className="fk-tile fkp-callout">
            <h2 className="fk-t3">Judge the output</h2>
            <p className="fk-body">
              AI researches. AI writes. AI generates presets. A human sets the
              direction, and the record of what worked and what got fixed is
              public. Load a preset, dial in a tone, and see if it gets you
              closer to the sound you hear in your head.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
