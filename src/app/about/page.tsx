import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllWriters } from "@/lib/writers";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "We build AI tools that dial in famous guitar tones for your modeler, so you spend less time on settings and more time playing.",
  openGraph: {
    title: "About Fader & Knob",
    description:
      "The tone library built as an open AI experiment: exact settings in real units, sources cited, corrections public.",
    type: "website",
  },
};

export default function AboutPage() {
  const writers = getAllWriters();

  return (
    <div className="container">
      <section className="about-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>About</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">
            About <em>Fader &amp; Knob</em>
          </h1>
        </header>

        <div className="about-mission">
          <p className="about-lede">
            Fader &amp; Knob is a tone library for guitar players who use
            modelers. We document how famous recordings were made (the full
            signal chain, every knob, every snapshot) and translate the
            settings for your Helix, Quad Cortex, TONEX, Fractal, Kemper,
            Katana, or pedalboard.
          </p>
          <p className="about-story">
            A modeler can sound like almost any rig, which is why getting one
            song&apos;s tone right can eat a whole evening. You pick an amp
            model, build the pedal chain block by block, then nudge knobs and
            check against the record until it&apos;s close. By then
            you&apos;ve spent more time in menus than on the guitar.
          </p>
          <p className="about-story">
            We build AI systems that do that legwork for you. They research
            how the part was recorded, work out the chain and the settings,
            and turn it into a preset or a settings sheet for your unit. When
            a recipe doesn&apos;t answer your question,{" "}
            <Link href="/tone-chat">Ask Axl</Link> can.
          </p>
          <p className="about-story">
            What we want is for you to load the tone and go learn the song.
            The time you would have spent dialing in goes to playing. The
            whole site is also an open test of how far AI can take this, and
            we track what works and what breaks on{" "}
            <Link href="/experiment">the experiment page</Link>.
          </p>
        </div>

        <section className="about-principles">
          <div className="how-head">
            <h2 className="display">How we work</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="hiw-promise-grid">
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Sources cited, corrections public</h3>
              <p className="hiw-promise-body">
                Every recipe cites its sources: producer interviews,
                Equipboard listings, period photos, and the session log when
                one exists. When we don&apos;t know, we say so. When we get
                one wrong, the fix ships as a public commit, and the{" "}
                <Link href="/experiment">correction log</Link> is part of the
                site.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Era-correct gear</h3>
              <p className="hiw-promise-body">
                We don&apos;t list signature pickups on a recording from
                1969. The Hetfield Master of Puppets recipe uses the Seymour
                Duncan Invaders in his 1985 King V, not the EMG 81/60 set he
                switched to two years later.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Real ranges, not 0–10</h3>
              <p className="hiw-promise-body">
                Every knob value reads in the unit your modeler shows: dB,
                Hz, ms. A generic 0–10 mark is impossible to repeat.
              </p>
            </div>
            <div className="hiw-promise">
              <h3 className="hiw-promise-head">Recipes get revisited</h3>
              <p className="hiw-promise-body">
                When better research turns up, an old recipe gets re-edited,
                and the change is logged like any other fix.
              </p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="how-head">
            <h2 className="display">The bench</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <p className="about-lede" style={{ fontSize: 15, marginBottom: 24 }}>
            Full disclosure: none of these writers are people. Each is an AI
            editorial voice: named, differently trained, and tuned to a
            different kind of player. They&apos;re part of{" "}
            <Link
              href="/experiment"
              style={{ color: "var(--amber-2)", textDecoration: "underline" }}
            >
              the experiment
            </Link>
            .
          </p>
          <div className="about-team-grid">
            {writers.map((w) => (
              <div key={w.slug} className="about-writer">
                {w.image && (
                  <div className="about-writer-img">
                    {/* Fixed dimensions, not `fill`. With `fill` and a
                        px-only `sizes`, next/image emits a candidate for
                        every configured size — twelve of them, up to 1200w,
                        for a 100px avatar, and `src` defaults to the widest.
                        Fixed width/height gets the 1x/2x pair instead. */}
                    <Image
                      src={w.image}
                      alt={`${w.name}, AI writer`}
                      width={100}
                      height={100}
                    />
                  </div>
                )}
                <div className="about-writer-meta">
                  <h3 className="about-writer-name">{w.name}</h3>
                  <span className="about-writer-title">{w.title}</span>
                  <p className="about-writer-bio">{w.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
