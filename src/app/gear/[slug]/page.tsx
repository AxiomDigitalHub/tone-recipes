import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getGearBySlug,
  gearItems,
  toneRecipes,
  songs,
  artists,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { PLATFORMS } from "@/lib/constants";
import RecipeCard from "@/components/recipe/RecipeCard";
import Badge from "@/components/ui/Badge";

interface GearPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GearPageProps) {
  const { slug } = await params;
  const gear = getGearBySlug(slug);
  if (!gear) return { title: "Gear Not Found" };

  return {
    title: `${gear.name} - ${gear.manufacturer} | ToneRecipes`,
    description: gear.description.slice(0, 160),
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
    return `${base} - ${sub}`;
  }
  return base;
}

export default async function GearDetailPage({ params }: GearPageProps) {
  const { slug } = await params;
  const gear = getGearBySlug(slug);
  if (!gear) notFound();

  // Find recipes that use this gear
  const recipesUsingGear = toneRecipes.filter((recipe) =>
    recipe.signal_chain.some((node) => node.gear_slug === gear.slug)
  );

  // Extract knobs from default_settings
  const knobs = gear.default_settings?.knobs as
    | Array<{ name: string; min?: number; max?: number; options?: string[] }>
    | undefined;

  // Get modeler equivalents
  const equivalents = gear.modeler_equivalents
    ? Object.entries(gear.modeler_equivalents)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span>/</span>
        <Link href="/gear" className="hover:text-foreground">
          Gear
        </Link>
        <span>/</span>
        <span className="text-foreground">{gear.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-accent">{gear.manufacturer}</p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">{gear.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="accent">{getTypeLabel(gear)}</Badge>
        </div>
      </div>

      {/* Description */}
      <div className="mb-14 rounded-xl border border-border bg-surface p-6 md:p-8">
        <p className="leading-relaxed text-foreground/90">{gear.description}</p>
      </div>

      {/* Default Settings */}
      {knobs && knobs.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold">Default Settings</h2>
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
                      : `${knob.min} - ${knob.max}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modeler Equivalents */}
      {equivalents.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold">Modeler Equivalents</h2>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equivalents.map(([platformId, blockName]) => {
                const platform = PLATFORMS.find((p) => p.id === platformId);
                if (!platform) return null;
                return (
                  <div
                    key={platformId}
                    className="flex items-center gap-3 rounded-lg bg-background p-4"
                  >
                    <span
                      className="h-3 w-3 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{platform.label}</p>
                      <p className="truncate font-medium text-foreground">
                        {blockName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Used In Recipes */}
      {recipesUsingGear.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold">Used In Recipes</h2>
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
    </div>
  );
}
