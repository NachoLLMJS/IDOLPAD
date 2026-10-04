import { z } from "zod";
import { apiError } from "@/lib/api";
import { getMediaProvider, MediaProviderError, type CharacterRequest } from "@/lib/media-provider";

const schema = z.object({
  description: z.string().min(8).max(500),
  lookText: z.string().max(500).optional(),
  name: z.string().max(80).optional(),
}).strict();

const allowedReferenceTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxReferenceBytes = 8 * 1024 * 1024;

async function parseRequest(req: Request): Promise<CharacterRequest | null> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    if (!form) return null;
    const referenceImage = form.get("referenceImage");
    const parsed = schema.safeParse({
      description: form.get("description"),
      lookText: form.get("lookText") || undefined,
      name: form.get("name") || undefined,
    });

    if (!parsed.success || !referenceImage || typeof referenceImage === "string" || !allowedReferenceTypes.has(referenceImage.type) || referenceImage.size > maxReferenceBytes) return null;
    return { ...parsed.data, referenceImage };
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  return parsed.success ? parsed.data : null;
}

export async function POST(req: Request) {
  const input = await parseRequest(req);
  if (!input) return apiError("INVALID_INPUT", "Character request is invalid", 422);
  try {
    return Response.json(await getMediaProvider().createCharacter(input), { status: 202 });
  } catch (error) {
    if (error instanceof MediaProviderError) return apiError(error.code, error.message, 503);
    return apiError("GENERATION_FAILED", "Generation could not start. No credit was used", 502);
  }
}
