import { NextRequest, NextResponse } from "next/server";
import { generateWorshipSetPack } from "@/lib/helix/generate-set-pack";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/set-packs/worship
 * Downloads the Worship Set Pack .hlx file.
 * Currently free for testing — will be gated behind Pro tier.
 */
export async function GET(req: NextRequest) {
  const { limited } = rateLimit(`setpack:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const hlxContent = generateWorshipSetPack("FK Worship");
  const filename = "FK-Worship.hlx";

  return new NextResponse(hlxContent, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
