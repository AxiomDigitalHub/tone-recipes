import Link from "next/link";

const productLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/gear", label: "Gear" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-bold text-accent" style={{ fontFamily: "var(--font-playfair)" }}>Fader &amp; Knob</span>
            <p className="mt-1 text-sm text-muted">Built with tone.</p>
          </div>

          {/* Product links */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Explore</p>
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="flex flex-col justify-end">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} Axiom Digital. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
