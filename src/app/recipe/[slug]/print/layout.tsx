/**
 * Print-route layout. Wraps the page in a `print-mode` div so v3.css
 * can hide the global masthead/subnav/footer when this route is in
 * view — same chrome on screen and on paper, no nav clutter.
 */
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="print-mode">{children}</div>;
}
