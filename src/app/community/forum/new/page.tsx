"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getForumCategories, createThread } from "@/lib/db/forum";
import type { ForumCategory } from "@/types/community";

const TITLE_MIN = 3;
const TITLE_MAX = 200;

export default function NewThreadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--amber-2)]" />
        </div>
      }
    >
      <NewThreadContent />
    </Suspense>
  );
}

function NewThreadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch categories
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cats = await getForumCategories();
        if (cancelled) return;
        setCategories(cats);

        // Pre-select from search param
        const preselect = searchParams.get("category");
        if (preselect) {
          const match = cats.find((c) => c.slug === preselect);
          if (match) setCategoryId(match.id);
        }
      } catch {
        // Categories will remain empty; the user can still reload
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const isValid =
    categoryId &&
    title.trim().length >= TITLE_MIN &&
    title.trim().length <= TITLE_MAX &&
    body.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isValid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const thread = await createThread({
        category_id: categoryId,
        user_id: user.id,
        title: title.trim(),
        body: body.trim(),
      });

      if (thread) {
        router.push(`/community/forum/thread/${thread.slug}`);
      } else {
        setError("Failed to create thread. Please try again.");
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // Loading / auth guard states
  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--amber-2)]" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--ink-muted)]">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/community/forum"
              className="transition-colors hover:text-[var(--amber-2)]"
            >
              Forum
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">
            /
          </li>
          <li className="font-medium text-[var(--ink)]">New Thread</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
        New Thread
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        Start a new discussion in the community forum.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Category selector */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-[var(--ink)]"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={loadingCategories}
            className="mt-1.5 w-full rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] px-3 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--amber)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50 disabled:opacity-50"
          >
            <option value="">
              {loadingCategories ? "Loading categories..." : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[var(--ink)]"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={TITLE_MIN}
            maxLength={TITLE_MAX}
            placeholder="Give your thread a descriptive title"
            className="mt-1.5 w-full rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--amber)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
          />
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            {title.trim().length}/{TITLE_MAX} characters
          </p>
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-[var(--ink)]"
          >
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="Describe your topic, question, or what you want to share..."
            className="mt-1.5 w-full resize-y rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--amber)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--amber)]/50"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/community/forum"
            className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--amber-2)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--amber)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--amber)]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {submitting ? "Posting..." : "Post Thread"}
          </button>
        </div>
      </form>
    </div>
  );
}
