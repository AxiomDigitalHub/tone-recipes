import fs from "node:fs";
import path from "node:path";
import { GUITARS, type GuitarKey } from "@/lib/gear/guitars";
import { FINISHES, isFinish, paintGuitar } from "@/lib/gear/guitar-finish";

/**
 * /guitar-art/<shape>.<finish>.svg: a guitar drawing in a given finish.
 * Every shape and finish pair is generated once, at build time.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(GUITARS) as GuitarKey[]).flatMap((shape) =>
    Object.keys(FINISHES).map((finish) => ({ file: `${shape}.${finish}.svg` })),
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = file.match(/^([a-z0-9-]+)\.([a-z-]+)\.svg$/);
  if (!m || !(m[1] in GUITARS) || !isFinish(m[2])) return new Response("Not found", { status: 404 });
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "guitars", `${m[1]}.svg`), "utf8");
  return new Response(paintGuitar(svg, m[2]), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
