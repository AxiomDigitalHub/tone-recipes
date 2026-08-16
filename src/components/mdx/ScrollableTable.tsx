import type { ComponentPropsWithoutRef } from "react";

/**
 * Markdown tables, wrapped so they scroll inside themselves.
 *
 * `.post-body table` is `width: 100%`, but width is a floor, not a ceiling —
 * a comparison table with four or five columns resolves to its min-content
 * width and blows past a phone screen. 344 of 398 posts contain a table, so
 * unwrapped this dragged the whole article sideways on mobile: 390px
 * viewport against a 440px document.
 *
 * The wrapper takes the overflow so the page body never scrolls. `tabindex`
 * and the role/label are required for the keyboard case — a scroll container
 * that can't be focused is unreachable without a pointer.
 */
export default function ScrollableTable(
  props: ComponentPropsWithoutRef<"table">,
) {
  return (
    <div
      className="post-table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Table, scrolls horizontally"
    >
      <table {...props} />
    </div>
  );
}
