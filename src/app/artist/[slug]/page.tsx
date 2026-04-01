import { notFound } from "next/navigation";
import {
  getArtistBySlug,
  getSongsByArtistSlug,
  getRecipesBySongSlug,
  artists,
} from "@/lib/data";
import { getBlogPostsForArtist } from "@/lib/data/platforms";
import { ARTIST_INTROS } from "@/lib/data/artist-intros";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) return { title: "Artist Not Found" };
  const title = `${artist.name} Tone Recipes`;
  const description = `Guitar tone recipes for ${artist.name} songs. Signal chains, settings, and platform translations.`;

  return {
    title,
    description,
    keywords: [artist.name, "tone recipes", "guitar tone", "signal chain", ...artist.genres],
    openGraph: {
      title,
      description,
      type: "profile",
      ...(artist.image_url ? { images: [{ url: artist.image_url, alt: artist.name }] } : {}),
    },
    twitter: {
      card: artist.image_url ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const artistSongs = getSongsByArtistSlug(slug);
  const introParas = ARTIST_INTROS[slug] ?? [];
  const blogPosts = getBlogPostsForArtist(slug);

  // Aggregate signature gear from all recipes
  const allRecipes = artistSongs.flatMap((s) => getRecipesBySongSlug(s.slug));
  const guitars = new Set<string>();
  const amps = new Set<string>();
  const effects = new Set<string>();
  for (const recipe of allRecipes) {
    if (recipe.original_gear) {
      if (recipe.original_gear.guitar) guitars.add(recipe.original_gear.guitar);
      if (recipe.original_gear.amp) amps.add(recipe.original_gear.amp);
      if (recipe.original_gear.effects) {
        for (const e of recipe.original_gear.effects) effects.add(e);
      }
    }
  }
  const hasGear = guitars.size > 0 || amps.size > 0 || effects.size > 0;

  const musicGroupJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artist.name,
    "description": artist.bio,
    "genre": artist.genres,
    ...(artist.image_url ? { "image": artist.image_url } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Browse", "item": "https://faderandknob.com/browse" },
      { "@type": "ListItem", "position": 2, "name": artist.name },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">Browse</Link>
        <span>/</span>
        <span className="text-foreground">{artist.name}</span>
      </nav>

      {/* Artist header */}
      <div className="mb-14 flex items-start gap-6">
        {artist.image_url && (
          <div className="hidden sm:block shrink-0">
            <Image
              src={artist.image_url}
              alt={artist.name}
              width={140}
              height={140}
              priority
              className="rounded-xl border border-border shadow-lg object-cover"
              sizes="140px"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{artist.name}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{artist.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {artist.genres.map((g) => (
              <Badge key={g}>{g}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tone & Gear prose intro */}
      {introParas.length > 0 && (
        <section className="mb-14 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold">Tone &amp; Gear</h2>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {introParas.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Signature Gear */}
      {hasGear && (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-bold">Signature Gear</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {guitars.size > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                  Guitars
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {Array.from(guitars).map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
            {amps.size > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                  Amps
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {Array.from(amps).map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {effects.size > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                  Effects
                </h3>
                <ul className="space-y-1 text-sm text-muted">
                  {Array.from(effects).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Songs & Recipes */}
      <h2 className="mb-6 text-xl font-bold">Songs &amp; Tone Recipes</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artistSongs.map((song) => {
          const songRecipes = getRecipesBySongSlug(song.slug);
          const recipe = songRecipes[0];

          if (recipe) {
            return (
              <Link
                key={song.slug}
                href={`/recipe/${recipe.slug}`}
                className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40"
              >
                <p className="font-medium">{song.title}</p>
                <p className="text-sm text-muted">
                  {song.album} ({song.year})
                </p>
                <p className="mt-2 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  View recipe &rarr;
                </p>
              </Link>
            );
          }

          return (
            <div
              key={song.slug}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-muted">
                {song.album} ({song.year})
              </p>
              <p className="mt-2 text-xs text-muted">Recipe coming soon</p>
            </div>
          );
        })}
      </div>

      {artistSongs.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted">Tone recipes for {artist.name} coming soon.</p>
        </div>
      )}

      {/* Related Blog Posts */}
      {blogPosts.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold">Related Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-border bg-surface p-4 transition-all hover:border-accent/40"
              >
                <p className="text-xs text-muted">{post.date}</p>
                <h3 className="mt-1 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
