import Link from "next/link";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import AffiliateDisclosure from "@/components/ui/AffiliateDisclosure";

const productLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/platforms", label: "Platforms" },
  { href: "/gear", label: "Gear" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-bold text-accent" style={{ fontFamily: "var(--font-playfair)" }}>Fader &amp; Knob</span>
            <p className="mt-1 text-sm text-muted">Stop tweaking. Start playing.</p>
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

          {/* Legal */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Legal</p>
            <Link
              href="/affiliate-disclosure"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Affiliate Disclosure
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Community + Resources */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Community</p>
            <Link
              href="/community/forum"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Forum
            </Link>
            <Link
              href="/community"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Community Hub
            </Link>
            <Link
              href="/feed.xml"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              RSS Feed
            </Link>
            <Link
              href="/llms.txt"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              llms.txt
            </Link>
          </nav>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <NewsletterSignup variant="footer" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Axiom Digital. All rights reserved.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <AffiliateDisclosure />
      </div>
    </footer>
  );
}
