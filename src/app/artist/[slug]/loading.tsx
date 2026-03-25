export default function ArtistLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-surface" />
        <div className="h-4 w-3 animate-pulse rounded bg-surface" />
        <div className="h-4 w-28 animate-pulse rounded bg-surface" />
      </div>

      {/* Artist header */}
      <div className="mb-14 flex items-start gap-6">
        {/* Circle image placeholder */}
        <div className="hidden sm:block h-[140px] w-[140px] shrink-0 animate-pulse rounded-xl bg-surface" />
        <div className="flex-1 space-y-3">
          <div className="h-9 w-48 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-surface" />
          <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-surface" />
          {/* Genre badges */}
          <div className="flex gap-2 pt-1">
            <div className="h-7 w-16 animate-pulse rounded-full bg-surface" />
            <div className="h-7 w-20 animate-pulse rounded-full bg-surface" />
            <div className="h-7 w-14 animate-pulse rounded-full bg-surface" />
          </div>
        </div>
      </div>

      {/* Songs section */}
      <div className="mb-14">
        <div className="mb-6 h-6 w-20 animate-pulse rounded bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-surface"
            />
          ))}
        </div>
      </div>

      {/* Tone Recipes section */}
      <div>
        <div className="mb-6 h-6 w-32 animate-pulse rounded bg-surface" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-surface"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
