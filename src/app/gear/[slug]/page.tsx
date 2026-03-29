import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getGearBySlug,
  gearItems,
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { PLATFORMS } from "@/lib/constants";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";
import AffiliateDisclosure from "@/components/ui/AffiliateDisclosure";
import { getAffiliateLinks } from "@/lib/affiliate";
import { ExternalLink } from "lucide-react";

interface GearPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GearPageProps) {
  const { slug } = await params;
  const gear = getGearBySlug(slug);
  if (!gear) return { title: "Gear Not Found" };

  const recipesUsing = toneRecipes.filter((r) =>
    r.signal_chain.some((n) => n.gear_slug === gear.slug)
  ).length;

  const title = `${gear.name} — ${gear.manufacturer}`;
  const description = `${gear.description.slice(0, 120)}${recipesUsing > 0 ? ` Used in ${recipesUsing} tone recipes.` : ""}`;

  return {
    title,
    description,
    keywords: [gear.name, gear.manufacturer, gear.type, "guitar gear", "tone recipes"],
    openGraph: {
      title: `${gear.name} — ${gear.manufacturer} | Fader & Knob`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${gear.name} — ${gear.manufacturer}`,
      description,
    },
  };
}

function getTypeLabel(gear: { type: string; subcategory?: string }): string {
  const typeLabels: Record<string, string> = {
    guitar: "Guitar",
    effect: "Effect",
    amp: "Amp",
    cabinet: "Cabinet",
    microphone: "Microphone",
  };
  const base = typeLabels[gear.type] || gear.type;
  if (gear.subcategory) {
    const sub = gear.subcategory.charAt(0).toUpperCase() + gear.subcategory.slice(1);
    return `${base} — ${sub}`;
  }
  return base;
}

function WhereToBuy({ name, manufacturer }: { name: string; manufacturer: string }) {
  const links = getAffiliateLinks(name, manufacturer);
  const partners: { label: string; url: string | undefined }[] = [
    { label: "Sweetwater", url: links.sweetwater },
    { label: "Reverb", url: links.reverb },
    { label: "Amazon", url: links.amazon },
  ];

  const hasLinks = partners.some((p) => p.url);
  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {partners.map(
        (p) =>
          p.url && (
            <a
              key={p.label}
              href={p.url}
              target="_blank"
              rel="nofollow sponsored"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              {p.label}
              <ExternalLink className="h-3.5 w-3.5 text-muted" />
            </a>
          )
      )}
    </div>
  );
}

export default async function GearDetailPage({ params }: GearPageProps) {
  const { slug } = await params;
  const gear = getGearBySlug(slug);
  if (!gear) notFound();

  const recipesUsingGear = toneRecipes.filter((recipe) =>
    recipe.signal_chain.some((node) => node.gear_slug === gear.slug)
  );

  const knobs = gear.default_settings?.knobs as
    | Array<{ name: string; min?: number; max?: number; options?: string[] }>
    | undefined;

  const equivalents = gear.modeler_equivalents
    ? Object.entries(gear.modeler_equivalents)
    : [];

  // Find related gear (same type/subcategory, excluding self)
  const relatedGear = gearItems
    .filter(
      (g) =>
        g.slug !== gear.slug &&
        g.type === gear.type &&
        (gear.subcategory ? g.subcategory === gear.subcategory : true)
    )
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": gear.name,
    "brand": { "@type": "Brand", "name": gear.manufacturer },
    "description": gear.description,
    "category": gear.type,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Gear", "item": "https://faderandknob.com/gear" },
      { "@type": "ListItem", "position": 2, "name": gear.name },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/gear" className="hover:text-foreground transition-colors">
          Gear
        </Link>
        <span>/</span>
        <span className="text-foreground">{gear.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="accent">{getTypeLabel(gear)}</Badge>
          {recipesUsingGear.length > 0 && (
            <a href="#recipes" className="text-xs font-medium text-accent hover:underline">
              Used in {recipesUsingGear.length} {recipesUsingGear.length === 1 ? "recipe" : "recipes"} &darr;
            </a>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-accent">{gear.manufacturer}</p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">{gear.name}</h1>
      </div>

      {/* Two-column layout on desktop: description + sidebar */}
      <div className="mb-14 flex flex-col gap-8 lg:flex-row">
        {/* Description */}
        <div className="flex-1 rounded-xl border border-border bg-surface p-6 md:p-8">
          <p className="leading-relaxed text-foreground/90">{gear.description}</p>
        </div>

        {/* Sidebar: quick facts */}
        <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
          {/* Modeler Equivalents — compact */}
          {equivalents.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                On your modeler
              </h2>
              <div className="space-y-2">
                {equivalents.map(([platformId, blockName]) => {
                  const platform = PLATFORMS.find((p) => p.id === platformId);
                  if (!platform) return null;
                  return (
                    <div key={platformId} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="text-xs text-muted">{platform.label}:</span>
                      <span className="text-sm font-medium text-foreground">{blockName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Where to Buy */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Where to buy
            </h2>
            <WhereToBuy name={gear.name} manufacturer={gear.manufacturer} />
          </div>
        </div>
      </div>

      {/* Controls / Knobs */}
      {knobs && knobs.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-bold">Controls</h2>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {knobs.map((knob) => (
                <div
                  key={knob.name}
                  className="flex flex-col items-center rounded-lg bg-background p-4"
                >
                  <span className="text-lg font-mono font-bold text-foreground">
                    {knob.name}
                  </span>
                  <span className="mt-1 text-xs text-muted">
                    {knob.options
                      ? knob.options.join(" / ")
                      : `${knob.min} – ${knob.max}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Used In Recipes — prominent placement */}
      {recipesUsingGear.length > 0 && (
        <section id="recipes" className="mb-14">
          <h2 className="mb-2 text-xl font-bold">
            Recipes using the {gear.name}
          </h2>
          <p className="mb-6 text-sm text-muted">
            See exactly how this gear is dialed in across different songs and styles.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {recipesUsingGear.map((recipe) => {
              const song = getSongBySlug(recipe.song_slug);
              const artist = song
                ? getArtistBySlug(song.artist_slug)
                : undefined;
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  song={song}
                  artist={artist}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Related gear */}
      {relatedGear.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Similar gear
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedGear.map((g) => (
              <Link
                key={g.slug}
                href={`/gear/${g.slug}`}
                className="group rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:bg-surface-hover"
              >
                <p className="text-xs text-accent">{g.manufacturer}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {g.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Affiliate Disclosure */}
      <AffiliateDisclosure />
    </div>
  );
}
