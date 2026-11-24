import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllPosts, BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";
import { getAllWriters } from "@/lib/writers";
import { getAllPlatforms } from "@/lib/data/platforms";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";
import Thumb from "@/components/gear/Thumb";
import PillarTiles from "@/components/guides/PillarTiles";
import GuideIndex, { type GuideRow } from "@/components/blog/GuideIndex";
import { thumbFor, TOPICS, type ThumbColor, type ThumbPattern } from "@/lib/gear/thumbs";
import type { Metadata } from "next";

/**
 * /blog: the Learn page (redesign step 6). Replaces the blog index.
 *
 * Pillar tiles (src/lib/pillars.ts), starter paths, platform hubs, every guide, and what is new.
 * The URL is still /blog and every /blog/... URL is unchanged; the nav
 * calls this "Learn", and so do the title and the CollectionPage JSON-LD.
 */

export const metadata: Metadata = {
  title: "Learn guitar tone: guides for modeler players",
  description:
    "Guides on drive, delay, amps, cabs and signal chains for Helix, Quad Cortex, TONEX, Fractal, Kemper and Katana players.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Learn guitar tone | Fader & Knob",
    description: "Guides on signal chains, modeler blocks and the gear behind the records.",
    type: "website",
  },
};

/**
 * Starter paths. A first guess at groupings (handoff "Known gaps"): edit
 * the slugs here. A slug that no longer exists is skipped.
 */
const STARTER_PATHS: { title: string; pattern: ThumbPattern; color: ThumbColor; slugs: string[] }[] = [
  {
    title: "How a signal chain works",
    pattern: "path",
    color: "blue",
    slugs: [
      "volume-pedal-tuner-out-tone-loss-does-it-load",
      "volume-pedal-treble-loss-halfway-why",
      "summing-two-signals-into-one-amp-input",
    ],
  },
  {
    title: "Your first modeler preset",
    pattern: "stripes",
    color: "amber",
    slugs: [
      "why-your-modeler-preset-wont-fit-what-to-cut-first",
      "two-cabs-instead-of-two-amps-dual-cab-block",
      "room-correction-ir-loader-vs-global-eq",
    ],
  },
  {
    title: "Delay that stays in time",
    pattern: "ripple",
    color: "teal",
    slugs: [
      "delay-max-time-per-model-slow-tempo",
      "delay-drifts-from-tap-light-long-repeats",
      "helix-tap-tempo-pitch-accurate-vs-transparent",
    ],
  },
];
const WHEN_IT_GOES_WRONG = [
  "jumping-amp-channels-what-the-patch-cable-actually-does",
  "polyphonic-pitch-blocks-dsp-cost-worth-it",
];

/** What each platform hub covers. Placeholder topics until matched to real guides. */
const PLATFORM_BLURB: Record<string, string> = {
  helix: "Paths, snapshots, DSP limits and tap tempo.",
  quad_cortex: "Rows, scenes, captures and the grid.",
  tonex: "Tone models, the cab section and live rigs.",
  fractal: "Blocks, channels and scene controllers.",
  kemper: "Profiles, rigs and the stomp section.",
  katana: "Amp types, the effect slots and Tone Studio.",
};

const shortDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : "";
const minutes = (readingTime: string) => readingTime.replace(/\s*read$/i, "");
/** "Signal Chain" → "Signal chain". */
const sentence = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

export default function LearnPage() {
  const all = getAllPosts(); // newest first
  if (all.length === 0) return null;
  const bySlug = new Map<string, BlogPost>(all.map((p) => [p.slug, p]));
  const specs = new Map(all.map((p) => [p.slug, thumbFor(p)]));

  const rows: GuideRow[] = all.map((p) => ({
    slug: p.slug,
    title: p.headline,
    date: shortDate(p.date),
    read: minutes(p.readingTime),
    category: p.category,
    topic: specs.get(p.slug)!.topic,
  }));

  const topicCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  for (const r of rows) {
    topicCounts.set(r.topic, (topicCounts.get(r.topic) ?? 0) + 1);
    categoryCounts.set(r.category, (categoryCounts.get(r.category) ?? 0) + 1);
  }
  const topicOptions = TOPICS.map((t) => ({ id: t.id, label: t.title, count: topicCounts.get(t.id) ?? 0 })).filter((t) => t.count > 0);
  const categoryOptions = Object.entries(BLOG_CATEGORIES)
    .map(([id, label]) => ({ id, label: sentence(label), count: categoryCounts.get(id) ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // New this week: the last 7 days, or the four newest if it has been quiet.
  const newest = new Date(all[0].date).getTime();
  const week = all.filter((p) => newest - new Date(p.date).getTime() <= 7 * 86_400_000).slice(0, 8);
  const latest = week.length >= 4 ? week : all.slice(0, 4);

  const platforms = getAllPlatforms();
  const writers = getAllWriters();

  // CollectionPage + ItemList JSON-LD covering the top 30 most-recent
  // posts. Unchanged from the previous index.
  const collectionLd = collectionPageJsonLd({
    name: "Learn guitar tone | Fader & Knob",
    description:
      "Guides on drive, delay, amps, cabs and signal chains for Helix, Quad Cortex, TONEX, Fractal, Kemper and Katana players.",
    url: "https://faderandknob.com/blog",
    items: all.slice(0, 30).map((p) => ({
      url: `https://faderandknob.com/blog/${p.slug}`,
      name: p.title,
      description: p.description,
    })),
  });

  return (
    <div className="fk-learn">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <section className="fk-wrap fk-learn-top">
        <div className="fk-learn-head">
          <h1 className="fk-display">Learn</h1>
          <p className="fk-lead">Pick a subject, or start at the beginning below.</p>
        </div>
        <PillarTiles />
      </section>

      <section className="fk-wrap fk-learn-start">
        <div className="fk-learn-rule">
          <h2 className="fk-t2">Start at the beginning</h2>
          <div className="fk-learn-paths">
            {STARTER_PATHS.map((path) => {
              const posts = path.slugs.map((s) => bySlug.get(s)).filter((p): p is BlogPost => Boolean(p));
              if (posts.length === 0) return null;
              return (
                <div key={path.title} className="fk-learn-path">
                  <h3 className="fk-rowcard-title">{path.title}</h3>
                  {posts.map((p) => {
                    const spec = specs.get(p.slug)!;
                    return (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="fk-learn-pathitem">
                        <Thumb
                          pattern={path.pattern}
                          color={spec.color ?? path.color}
                          frame={spec.frame}
                          gear={[{ kind: spec.gear }]}
                          gearHeight={62}
                          ratio="1 / 1"
                          radius="r-md"
                        />
                        <span>{p.headline}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {WHEN_IT_GOES_WRONG.some((s) => bySlug.has(s)) && (
            <p className="fk-body-sm">
              When it goes wrong:{" "}
              {WHEN_IT_GOES_WRONG.filter((s) => bySlug.has(s)).map((s, i) => (
                <span key={s}>
                  {i > 0 && " · "}
                  <Link href={`/blog/${s}`} className="fk-link">
                    {bySlug.get(s)!.headline}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      {/* Platforms left the top nav; this is their home now. /platforms and
          every /platforms/[slug] page still work. */}
      <section className="fk-learn-platforms">
        <div className="fk-learn-wash">
          <div className="fk-wrap fk-learn-stack">
            <div className="fk-learn-intro">
              <h2 className="fk-t2">Learn your platform</h2>
              <p className="fk-body fk-muted">Deep how-tos for the box you own. Each one starts from a fresh preset.</p>
            </div>
            <div className="fk-learn-platgrid">
              {platforms.map((p) => (
                <Link key={p.id} href={`/platforms/${p.id}`} className="fk-learn-plat r-lg">
                  <span className="fk-card-head">
                    <span className="fk-t3">{p.label}</span>
                    <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="fk-body-sm">{PLATFORM_BLURB[p.id] ?? "Guides, recipes and presets."}</span>
                </Link>
              ))}
            </div>
            <p className="fk-caption">
              <Link href="/platforms" className="fk-link">
                All platforms
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="fk-wrap fk-learn-every" id="guides">
        <h2 className="fk-t2">Every guide</h2>
        <GuideIndex rows={rows} topics={topicOptions} categories={categoryOptions} />
      </section>

      <section className="fk-wrap fk-learn-new">
        <h2 className="fk-t2">New this week</h2>
        <ul className="fk-guiderows">
          {latest.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="has-thumb">
                <Thumb spec={specs.get(p.slug)!} gearHeight={48} ratio="1 / 1" radius="r-md" />
                <span className="fk-guiderow-title">{p.headline}</span>
                <span className="fk-data fk-guiderow-meta">
                  {shortDate(p.date)} · {minutes(p.readingTime)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Who writes these. The writers are AI voices and are labelled as such. */}
      <section className="fk-wrap fk-learn-writers">
        <p className="fk-body-sm">
          Written by AI voices:{" "}
          {writers.map((w, i) => (
            <span key={w.slug}>
              {i > 0 && ", "}
              <Link href={`/writers/${w.slug}`} className="fk-link">
                {w.name}
              </Link>
            </span>
          ))}
          . <Link href="/experiment" className="fk-link">How the experiment works</Link>.
        </p>
      </section>
    </div>
  );
}
