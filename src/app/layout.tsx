import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import SiteSubnav from "@/components/layout/SiteSubnav";
import LazySearchPalette from "@/components/search/LazySearchPalette";
import WebMcpProvider from "@/components/webmcp/WebMcpProvider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toaster from "@/components/ui/Toaster";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Suspense } from "react";
import PurchaseTracker from "@/components/analytics/PurchaseTracker";
import "./globals.css";
import "./v3.css";
// Redesign foundation: new tokens, fonts, header, footer and shared pieces.
// Must load after v3.css (it remaps the legacy v3 tokens).
import "./redesign.css";

// Geist 400/500/600 and Geist Mono are the whole type system (redesign).
// Both are variable fonts, so one file each covers every weight in use.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono is only for real data (knob values, counts, dates, prices), never the
// LCP text, so it is not preloaded.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faderandknob.com"),
  title: {
    default: "Fader & Knob: Tone Recipes for Guitar & Modelers",
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
    title: "Fader & Knob: Tone Recipes for Guitar & Modelers",
    description:
      "Tone recipes from the songs you love. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fader & Knob: Tone Recipes for Guitar & Modelers",
    description:
      "Tone recipes from the songs you love. Get exact settings for your Helix, Quad Cortex, TONEX, or physical rig.",
  },
  robots: {
    index: true,
    follow: true,
    // Google Discover eligibility wants large image previews; without this
    // Google may cap preview size and Discover rarely picks the page up.
    "max-image-preview": "large",
  },
  // Feed discovery: enables reader apps + Google's "Follow" feature to find
  // the feeds from any page.
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Fader & Knob Blog" }],
      "application/feed+json": [{ url: "/feed.json", title: "Fader & Knob Blog (JSON Feed)" }],
    },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme: light by default. Dark is opt-in for review (redesign
            step 9): ?theme=dark turns it on and remembers it, ?theme=light
            turns it off. Runs before paint so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(location.search).get("theme");if(p==="dark"||p==="light"){localStorage.setItem("fk-theme",p)}if(localStorage.getItem("fk-theme")==="dark"){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`,
          }}
        />
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
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        {/* GTM noscript — standard install pair for the lazyOnload script
            near the end of body. */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDKBCT48"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          {/* Fires GA4 `purchase` after Stripe checkout (?session_id=...).
              Renders null on every other page load. Suspense: useSearchParams
              requirement for client components mounted in a server layout. */}
          <Suspense fallback={null}>
            <PurchaseTracker />
          </Suspense>
          <div className="fk-preview flex min-h-screen flex-col flex-1">
            <SiteSubnav />

            <LazySearchPalette />
            {/* WebMCP: exposes search/recipe tools to in-browser AI agents
                via navigator.modelContext. Renders nothing. */}
            <WebMcpProvider />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
        <SmoothScroll />
        {/* Google Tag Manager (GTM-PDKBCT48). Loaded lazyOnload like the
            rest of the telemetry — pageview-level tracking doesn't justify
            competing with LCP. NOTE: the direct gtag snippet below stays
            until GA4 is configured INSIDE GTM; do not run both — a GA4
            config tag in GTM + the snippet below = double-counted views.
            Cutover: add the GA4 tag in GTM, publish, then delete the two
            gtag Script blocks below in the same day. */}
        <Script id="gtm-init" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PDKBCT48');`}
        </Script>
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
