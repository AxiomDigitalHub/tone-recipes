import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchPalette from "@/components/search/SearchPalette";
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
    default: "Fader & Knob - Build the tones you hear",
    template: "%s | Fader & Knob",
  },
  description:
    "Song-specific tone recipes for Helix, Quad Cortex, TONEX, and your physical rig. The cross-platform Rosetta Stone for guitar tone.",
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
    title: "Fader & Knob - Build the tones you hear",
    description:
      "Song-specific tone recipes for Helix, Quad Cortex, TONEX, and your physical rig.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fader & Knob - Build the tones you hear",
    description:
      "Song-specific tone recipes for Helix, Quad Cortex, TONEX, and your physical rig.",
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
      </body>
    </html>
  );
}
