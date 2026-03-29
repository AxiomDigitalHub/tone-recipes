import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1
        className="mb-4 text-4xl font-bold text-foreground md:text-5xl"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        This page doesn&apos;t exist.
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted">
        The tone you&apos;re looking for might be somewhere else.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/browse"
          className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Browse Recipes
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
