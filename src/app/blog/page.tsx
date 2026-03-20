export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-muted">
        Tone deep dives, platform comparisons, and artist breakdowns. Coming in Phase 4.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-lg font-semibold text-muted">Blog posts coming soon</p>
        <p className="mt-2 text-sm text-muted">
          Articles like "How to Get Gilmour's Tone on Helix" and "Best Helix Amp Models for Blues."
        </p>
      </div>
    </div>
  );
}
