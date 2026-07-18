import Link from "next/link";
import { getAllPlatforms } from "@/lib/data/platforms";

/**
 * Unknown-platform page, served with a real 404 status. This used to be
 * an inline fallback inside the page component, which returned HTTP 200
 * for any garbage slug (a soft-404 — bad for crawl budget and index
 * hygiene). The helpful "not supported yet → request it" UX is preserved
 * here; only the status code changed. dynamicParams=false on the page
 * routes unknown slugs to this boundary without rendering the page.
 */
export default function PlatformNotFound() {
  const supported = getAllPlatforms();
  return (
    <div className="container">
      <div className="platform-detail">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/platforms">Platforms</Link>
        </div>
        <header className="platform-head platform-head-solo">
          <div>
            <div className="recipe-issue">
              <span className="pill">Not supported yet</span>
            </div>
            <h1 className="recipe-title display">We don&apos;t cover that platform yet</h1>
            <p className="platform-tagline">
              Fader &amp; Knob translations are built one platform at a time.
              That modeler isn&apos;t in the rotation today &mdash; but if
              you&apos;d use it, tell us and it goes up the queue.
            </p>
            <div className="hero-cta-row" style={{ marginTop: 24 }}>
              <Link href="/request" className="hero-cta hero-cta-primary">
                Request platform support
              </Link>
              <Link href="/platforms" className="hero-cta-secondary">
                See supported platforms ↓
              </Link>
            </div>
          </div>
        </header>

        <section className="platform-section">
          <div className="how-head">
            <h2 className="display">What we do cover</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="audition-grid">
            {supported.map((p) => (
              <Link key={p.id} href={`/platforms/${p.id}`} className="audition-card">
                <div className="audition-card-body">
                  <div className="recipe-issue">
                    <span className="pill">{p.manufacturer}</span>
                  </div>
                  <h3 className="display audition-card-title">{p.label}</h3>
                  <p className="audition-card-dek">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
