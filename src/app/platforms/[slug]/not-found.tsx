import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllPlatforms } from "@/lib/data/platforms";

/**
 * Unknown-platform page, served with a real 404 status. This used to be
 * an inline fallback inside the page component, which returned HTTP 200
 * for any garbage slug (a soft-404, bad for crawl budget and index
 * hygiene). The helpful "not supported yet, request it" UX is preserved
 * here; only the status code changed. dynamicParams=false on the page
 * routes unknown slugs to this boundary without rendering the page.
 */
export default function PlatformNotFound() {
  const supported = getAllPlatforms();
  return (
    <div className="fk-wrap fkp-page">
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/platforms">Platforms</Link>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">We don&apos;t cover that platform yet</h1>
        <p className="fk-lead fkp-measure">
          Fader &amp; Knob translations are built one platform at a time.
          That modeler isn&apos;t in the rotation today, but if you&apos;d use
          it, tell us and it goes up the queue.
        </p>
        <div className="fkp-ctas">
          <Link href="/request" className="fk-btn">
            Request platform support
          </Link>
          <Link href="/platforms" className="fk-btn fk-btn-secondary">
            See supported platforms
          </Link>
        </div>
      </header>

      <section className="fkp-section">
        <h2 className="fk-t2">What we do cover</h2>
        <div className="fkp-tiles">
          {supported.map((p) => (
            <Link key={p.id} href={`/platforms/${p.id}`} className="fk-tile fkp-linktile">
              <span className="fk-caption">{p.manufacturer}</span>
              <div className="fkp-linktile-head">
                <h3 className="fk-t3">{p.label}</h3>
                <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
              </div>
              <p className="fk-body-sm">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
