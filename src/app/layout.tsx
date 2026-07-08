import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Footer from "@/components/layout/Footer";
import experimentStats from "@/data/experiment-stats.json";
import SiteSubnav from "@/components/layout/SiteSubnav";
import LazySearchPalette from "@/components/search/LazySearchPalette";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toaster from "@/components/ui/Toaster";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";
import "./v3.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono isn't used on the homepage / hero — disable preload so it
// doesn't compete for bandwidth with Fraunces (the LCP font on the H1).
// Pages that actually use the mono variable will still lazy-load it.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// Fraunces — variable display serif for headlines + italic credits.
// Picked for its proper italic and screen-tuned optical sizing across
// the wide range of display sizes the site uses (recipe-title, post-
// title, page-title, archive-eyebrow et al.). Self-hosted via
// next/font so we don't pay a roundtrip to Google.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});


export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faderandknob.com"),
  title: {
    default: "Fader & Knob — Tone Recipes for Guitar & Modelers",
    template: "%s | Fader & Knob",
  },
  description:
    "Tone recipes for guitar players. Get the exact settings to recreate your favorite songs on Helix, Quad Cortex, Katana, or your physical rig. Stop tweaking, start playing.",
  keywords: [
    "guitar tone",
    "tone recipes",
    "signal chain",
    "Helix",
    "Quad Cortex",
    "TONEX",
    "guitar effects",
    "amp settings",
    "guitar rig",
    "modeler presets",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fader & Knob",
    title: "Fader & Knob — Tone Recipes for Guitar & Modelers",
    description:
      "Tone recipes from the songs you love. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fader & Knob — Tone Recipes for Guitar & Modelers",
    description:
      "Tone recipes from the songs you love. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "JNyJnVry-lD7u00R3LYzg5jxYdJvY6Yb-vdit1nVHh0",
  },
  other: {
    "fo-verify": "638b1d63-d8e9-4a92-a966-6831f4da02a2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to critical third-party origins — saves 1 RTT each */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        {/* Site-wide JSON-LD — Organization + WebSite + SearchAction.
            Applies to every route so the schema audit's coverage gap on
            home / index pages is closed in one place. The SearchAction
            target uses /browse?q= which is where the browse page reads
            its search-term filter from (see src/app/browse/page.tsx). */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://faderandknob.com#org",
                  name: "Fader & Knob",
                  url: "https://faderandknob.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://faderandknob.com/logo.png",
                    width: 600,
                    height: 60,
                  },
                  description:
                    "Tone recipes from the songs you love. Signal chains, exact settings, and downloadable presets for Helix, Quad Cortex, TONEX, Fractal, Kemper, and Boss Katana.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://faderandknob.com#website",
                  url: "https://faderandknob.com",
                  name: "Fader & Knob",
                  publisher: { "@id": "https://faderandknob.com#org" },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://faderandknob.com/browse?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <AuthProvider>
          <div className="fk-preview flex min-h-screen flex-col flex-1">
            {/* Masthead ticker — the sitewide inroad to /experiment. Live
                numbers from experiment-stats.json (regenerated with content
                drops), replacing the old hardcoded Vol./Issue fiction. */}
            <div className="masthead-bar">
              <div className="masthead-bar-inner">
                <Link
                  href="/experiment"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <span className="tape-dot" />
                  Open experiment · Day{" "}
                  {/* Against generated_at (not Date.now) — pure render, and
                      the ticker always agrees with the /experiment page. */}
                  {Math.max(
                    1,
                    Math.round(
                      (new Date(
                        experimentStats.generated_at + "T00:00:00Z",
                      ).getTime() -
                        new Date(
                          experimentStats.first_commit + "T00:00:00Z",
                        ).getTime()) /
                        86_400_000,
                    ),
                  )}{" "}
                  · {experimentStats.commits} commits ·{" "}
                  {experimentStats.public_corrections} public corrections
                </Link>
                <div>Stop tweaking. Start playing.</div>
              </div>
            </div>

            <SiteSubnav />

            <LazySearchPalette />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
        <SmoothScroll />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PZLWYT7VMP"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PZLWYT7VMP');`}
        </Script>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w3jxns38n6");`}
        </Script>
        <Script
          src="https://t.contentsquare.net/uxa/5eb1c56789d9a.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
