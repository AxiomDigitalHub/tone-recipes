export default function GearLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="h-4 w-3 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="h-4 w-12 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="h-4 w-3 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--paper-2)]" />
      </div>

      {/* Header: manufacturer, title, badge */}
      <div className="mb-10 space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="h-9 w-64 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--paper-2)]" />
        </div>
      </div>

      {/* Description card */}
      <div className="mb-14 h-24 animate-pulse rounded-xl bg-[var(--paper-2)]" />

      {/* Default Settings section */}
      <div className="mb-14">
        <div className="mb-6 h-6 w-36 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="rounded-xl bg-[var(--paper-2)] p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-[var(--paper)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Used In Recipes section */}
      <div>
        <div className="mb-6 h-6 w-36 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-[var(--paper-2)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
