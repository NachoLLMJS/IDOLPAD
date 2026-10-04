export type VideoTemplate = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  posterUrl: string;
  durationSec: number;
  width: number;
  height: number;
  source: "higgsfield-community" | "idolpad-original";
};

function safeHttps(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function normalizeCommunityTemplates(input: unknown, limit = 8): VideoTemplate[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const x = item as Record<string, unknown>;
    if (typeof x.id !== "string" || typeof x.title !== "string" || typeof x.description !== "string" || !safeHttps(x.previewUrl) || !safeHttps(x.posterUrl)) return [];
    return [{ id: x.id, title: x.title, description: x.description, previewUrl: x.previewUrl, posterUrl: x.posterUrl, durationSec: Number(x.durationSec) || 5, width: Number(x.width) || 720, height: Number(x.height) || 1280, source: "higgsfield-community" as const }];
  }).slice(0, limit);
}

export const fallbackTemplates: VideoTemplate[] = [
  { id: "original-1", title: "Editorial Walk", description: "Original IDOLPAD motion direction", previewUrl: "", posterUrl: "", durationSec: 5, width: 720, height: 1280, source: "idolpad-original" },
  { id: "original-2", title: "Direct to Camera", description: "Original IDOLPAD motion direction", previewUrl: "", posterUrl: "", durationSec: 10, width: 720, height: 1280, source: "idolpad-original" },
];
