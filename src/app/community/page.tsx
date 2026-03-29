import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Fader & Knob community — discuss gear, share tone recipes, get help dialing in your sound, and connect with other guitarists.",
  openGraph: {
    title: "Community | Fader & Knob",
    description:
      "Discuss gear, share tone recipes, get help dialing in your sound, and connect with fellow guitarists.",
    type: "website",
  },
};

const sections = [
  {
    title: "Discussion Forum",
    description:
      "Talk gear, tone, technique, and everything in between with fellow players.",
    href: "/community/forum",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Tone Recipes",
    description:
      "Browse community-submitted tone recipes or share your own dial-in for any song.",
    href: "/browse",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Submit a Recipe",
    description:
      "Got a tone dialed in? Share your signal chain and settings with the community.",
    href: "/dashboard/my-recipes/new",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Community</h1>
        <p className="mt-3 text-lg text-muted">
          Connect with guitarists, share your tones, and level up together.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${section.bgColor}`}
            >
              <span className={section.color}>{section.icon}</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
