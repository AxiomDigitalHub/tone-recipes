/**
 * Print-route layout. Wraps the page in a `print-mode` div so the site
 * header and footer hide while this route is in view (same page on
 * screen and on paper, no nav clutter). `fk-print` keeps the step 8
 * blanket off this page; redesign-pages.css styles it instead.
 */
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="print-mode fk-print">{children}</div>;
}
