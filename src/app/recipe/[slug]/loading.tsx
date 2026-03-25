export default function RecipeLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-surface" />
        <div className="h-4 w-3 animate-pulse rounded bg-surface" />
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="h-4 w-3 animate-pulse rounded bg-surface" />
        <div className="h-4 w-32 animate-pulse rounded bg-surface" />
      </div>

      {/* Hero: album art + title/artist/song info */}
      <div className="mb-10 flex items-start gap-6">
        {/* Album art placeholder */}
        <div className="hidden sm:block h-36 w-36 shrink-0 animate-pulse rounded-xl bg-surface" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-surface" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-surface" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-surface" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-surface" />
        </div>
      </div>

      {/* Tags row */}
      <div className="mb-10 flex flex-wrap gap-2">
        <div className="h-7 w-20 animate-pulse rounded-full bg-surface" />
        <div className="h-7 w-24 animate-pulse rounded-full bg-surface" />
        <div className="h-7 w-16 animate-pulse rounded-full bg-surface" />
        <div className="h-7 w-28 animate-pulse rounded-full bg-surface" />
      </div>

      {/* Signal chain area */}
      <div className="mb-14 space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-surface" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-surface" />
      </div>

      {/* Gear section placeholder */}
      <div className="space-y-4">
        <div className="h-6 w-24 animate-pulse rounded bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-surface"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
