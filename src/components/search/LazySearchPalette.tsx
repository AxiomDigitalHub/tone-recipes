"use client";

import dynamic from "next/dynamic";

const SearchPalette = dynamic(
  () => import("@/components/search/SearchPalette"),
  { ssr: false },
);

export default function LazySearchPalette() {
  return <SearchPalette />;
}
