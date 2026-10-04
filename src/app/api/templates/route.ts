import { fallbackTemplates, normalizeCommunityTemplates } from "@/lib/video-templates";

const SOURCE = "https://www.higgspad.com/api/templates?cursor=1";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").toLowerCase();
  try {
    const response = await fetch(SOURCE, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`Template source returned ${response.status}`);
    const data = await response.json() as { items?: unknown };
    const live = normalizeCommunityTemplates(data.items, 12);
    const items = (q ? live.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(q)) : live);
    return Response.json({ items, nextCursor: null, total: items.length, source: "higgspad-higgsfield-public-feed", attribution: "Public Higgsfield community templates surfaced by Higgspad. Availability and usage rights remain subject to the source service" });
  } catch {
    const items = q ? fallbackTemplates.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(q)) : fallbackTemplates;
    return Response.json({ items, nextCursor: null, total: items.length, source: "idolpad-fallback", degraded: true });
  }
}