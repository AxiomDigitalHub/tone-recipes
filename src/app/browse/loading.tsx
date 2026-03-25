export default function BrowseLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-surface" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
        </div>
        <div className="h-9 w-36 shrink-0 animate-pulse rounded-lg bg-surface" />
      </div>

      {/* Filter chips row */}
      <div className="mb-8 flex gap-2 overflow-hidden pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-8 shrink-0 animate-pulse rounded-full bg-surface"
            style={{ width: `${60 + (i % 3) * 20}px` }}
          />
        ))}
      </div>

      {/* Platform filter chips */}
      <div className="mb-10 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-surface"
          />
        ))}
      </div>

      {/* Recipe card grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
