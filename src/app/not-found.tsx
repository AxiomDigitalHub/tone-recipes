import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="fk-wrap fk-notfound">
      <h1 className="fk-display">This page doesn&apos;t exist</h1>
      <p className="fk-lead">The tone you&apos;re looking for might be somewhere else.</p>
      <div className="fk-notfound-cta">
        <Link href="/browse" className="fk-btn">
          Browse the tones
        </Link>
        <Link href="/" className="fk-btn fk-btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
