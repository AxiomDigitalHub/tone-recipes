import { notFound } from "next/navigation";
import { getArtistBySlug, getSongsByArtistSlug, toneRecipes, songs as allSongs, artists as allArtists } from "@/lib/data";
import Image from "next/image";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

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
  const artistRecipes = toneRecipes.filter((r) =>
    artistSongs.some((s) => s.slug === r.song_slug)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
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

      {/* Songs */}
      <h2 className="mb-6 text-xl font-bold">Songs</h2>
      <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artistSongs.map((song) => (
          <div
            key={song.slug}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <p className="font-medium">{song.title}</p>
            <p className="text-sm text-muted">
              {song.album} ({song.year})
            </p>
          </div>
        ))}
      </div>

      {/* Tone Recipes */}
      <h2 className="mb-6 text-xl font-bold">Tone Recipes</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {artistRecipes.map((recipe) => {
          const song = allSongs.find((s) => s.slug === recipe.song_slug);
          return (
            <RecipeCard key={recipe.slug} recipe={recipe} artist={artist} song={song} />
          );
        })}
      </div>

      {artistRecipes.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted">Tone recipes for {artist.name} coming soon.</p>
        </div>
      )}
    </div>
  );
}
