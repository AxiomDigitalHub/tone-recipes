import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchPalette from "@/components/search/SearchPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ToneRecipes - Build the tones you hear",
    template: "%s | ToneRecipes",
  },
  description:
    "Song-specific tone recipes for Helix, Quad Cortex, TONEX, and your physical rig. The cross-platform Rosetta Stone for guitar tone.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ToneRecipes",
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
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <Header />
        <SearchPalette />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
