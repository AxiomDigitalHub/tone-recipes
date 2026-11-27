import Link from "next/link";
import type { Metadata } from "next";
import { ContactEmailLink } from "@/components/ui/ContactEmail";

export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "Ask for a tone we don't cover yet, share your own recipe, or tell us about a mistake in one of ours.",
  openGraph: {
    title: "Community | Fader & Knob",
    description:
      "Ask for a tone we don't cover yet, share your own recipe, or tell us about a mistake in one of ours.",
    type: "website",
  },
};

export default function CommunityPage() {
  return (
    <div className="fk-wrap fkp-page">
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Community</span>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">Community</h1>
        <p className="fk-lead fkp-measure">
          Ask for a tone, share your own, or tell us when we got one wrong.
        </p>
      </header>

      {/* Keep this factual: no member counts, no activity claims. The
          forum closed in May 2026 and the page says so plainly. */}
      <div className="fkp-prose fkp-pad-top fkc-list">
        <section className="fkc-item" aria-labelledby="community-ask">
          <h2 id="community-ask" className="fk-t2">Ask for a tone</h2>
          <p>
            If we don&apos;t have a song yet, request it. We check interviews,
            gear lists and live footage, then publish the full recipe with
            its sources.
          </p>
          <div>
            <Link href="/request" className="fk-btn">Request a tone</Link>
          </div>
        </section>

        <section className="fkc-item" aria-labelledby="community-share">
          <h2 id="community-share" className="fk-t2">Share your own tone</h2>
          <p>
            You get the editor we use for our own recipes. Add your blocks in
            order with your real settings, and we build the version for each
            modeler.
          </p>
          <div>
            <Link href="/dashboard/my-recipes/new" className="fk-btn">Submit a recipe</Link>
          </div>
        </section>

        <section className="fkc-item" aria-labelledby="community-report">
          <h2 id="community-report" className="fk-t2">Report a mistake</h2>
          <p>
            Our recipes are researched, not recorded in a studio, so some
            details will be off. It might be a pickup position or a model
            your firmware doesn&apos;t have. Email{" "}
            <ContactEmailLink subject="Recipe correction" className="fk-link" /> with
            the song and what you found, and we&apos;ll fix it. Every fix is
            counted on <Link href="/experiment">the experiment page</Link>.
          </p>
        </section>

        <p className="fk-body-sm fkp-muted">
          There&apos;s no forum. We ran one until May 2026, but hardly anyone
          posted, so we closed it.
        </p>
      </div>
    </div>
  );
}
