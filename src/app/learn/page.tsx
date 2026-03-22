export const metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold">Learn</h1>
      <p className="mt-3 text-muted">
        Signal chain fundamentals, effects guides, and amp anatomy. Coming in Phase 2.
      </p>
      <div className="mt-12 rounded-xl border border-dashed border-border p-16 text-center">
        <p className="text-lg font-semibold text-muted">Educational content coming soon</p>
        <p className="mt-2 text-sm text-muted">
          Interactive tutorials on signal chain order, effects types, pickup selection, and more.
        </p>
      </div>
    </div>
  );
}
