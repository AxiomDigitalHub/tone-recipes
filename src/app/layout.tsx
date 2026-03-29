import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchPalette from "@/components/search/SearchPalette";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <AuthProvider>
          <Header />
          <SearchPalette />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PZLWYT7VMP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PZLWYT7VMP');`}
        </Script>
      </body>
    </html>
  );
}
