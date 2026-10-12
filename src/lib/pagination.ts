/**
 * Pure helpers for paginated list routes (currently /browse).
 *
 * Kept out of the route file so the off-by-one-prone bits are unit
 * testable — see tests/pagination.test.ts. Page-size tuning stays with
 * the route that owns the layout.
 */

/**
 * `?page` → a positive integer. Junk, 0, negatives, floats and absent
 * values all fall back to page 1 rather than throwing or 404'ing: a bad
 * page param should show the first page, not an error.
 */
export function parsePageParam(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/**
 * Page numbers to render, collapsing the middle with gaps once there are
 * more than 7 pages: `1 … 4 5 6 … 12`.
 *
 * First and last are always present so every page stays reachable in two
 * clicks — and so page 1 links to the last page, giving crawlers a path
 * into the tail of the catalog.
 */
export function pageWindow(
  current: number,
  total: number,
): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "gap")[] = [1];
  let lo = Math.max(2, current - 1);
  let hi = Math.min(total - 1, current + 1);
  // An ellipsis standing in for exactly one page is pure noise — it is
  // wider than the number it hides. Absorb that page into the window
  // instead (widens the run by at most one on each side).
  if (lo === 3) lo = 2;
  if (hi === total - 2) hi = total - 1;
  if (lo > 2) out.push("gap");
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < total - 1) out.push("gap");
  out.push(total);
  return out;
}

/**
 * Clamp a requested page to a result set and derive the slice bounds.
 *
 * A stale `?page=9` after a filter narrows the results lands on the last
 * page of the new set rather than an empty page — the filter rails are
 * the primary navigation, and dead-ending someone who just clicked one
 * is worse than showing them the nearest real page.
 */
export function paginate<T>(
  items: T[],
  requestedPage: number,
  pageSize: number,
): {
  page: number;
  totalPages: number;
  pageItems: T[];
  rangeFrom: number;
  rangeTo: number;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return {
    page,
    totalPages,
    pageItems,
    rangeFrom: items.length === 0 ? 0 : start + 1,
    rangeTo: start + pageItems.length,
  };
}
