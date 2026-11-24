"use client";

import { useRouter } from "next/navigation";

/**
 * Sort control for /browse. Each option carries the URL the server built
 * for it (facets kept, page reset), so this only navigates.
 */
export default function BrowseSort({
  value,
  options,
}: {
  value: string;
  options: { key: string; label: string; href: string }[];
}) {
  const router = useRouter();
  return (
    <div className="fk-sort">
      <label htmlFor="browse-sort" className="fk-body-sm">
        Sort by
      </label>
      <select
        id="browse-sort"
        className="fk-select r-md"
        value={value}
        onChange={(e) => {
          const next = options.find((o) => o.key === e.target.value);
          if (next) router.push(next.href);
        }}
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
