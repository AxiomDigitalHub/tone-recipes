import Link from "next/link";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

const productLinks = [
  { href: "/browse", label: "Browse Recipes" },
  { href: "/platforms", label: "Platforms" },
  { href: "/gear", label: "Gear Database" },
  { href: "/compare", label: "Compare Tones" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/request", label: "Request a Tone" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-bold text-accent" style={{ letterSpacing: "-0.02em" }}>Fader &amp; Knob</span>
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

        {/* Bottom bar — copyright, legal links, disclosures all together */}
        <div className="mt-8 border-t border-border pt-6 space-y-3 text-[11px] leading-relaxed text-muted/60">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs text-muted">&copy; {new Date().getFullYear()} Axiom Digital. All rights reserved.</span>
            <Link href="/how-we-work" className="underline hover:text-muted">How We Work</Link>
            <Link href="/affiliate-disclosure" className="underline hover:text-muted">Affiliate Disclosure</Link>
            <Link href="/privacy" className="underline hover:text-muted">Privacy Policy</Link>
            <Link href="/terms" className="underline hover:text-muted">Terms of Service</Link>
            <Link href="/about" className="underline hover:text-muted">About</Link>
          </div>
          <p>
            Content on this site is researched and written with AI assistance. Hardware testing is part of our review process.
            Some links are affiliate links — Fader &amp; Knob may earn a commission on purchases at no extra cost to you.
            We use{" "}
            <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted">
              Microsoft Clarity
            </a>
            , Google Analytics, and Contentsquare to understand how visitors use this site. By using our site, you agree that we and these providers can collect and use this data.
          </p>
        </div>
      </div>
    </footer>
  );
}
