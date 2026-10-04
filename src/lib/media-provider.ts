export type CharacterRequest = { description: string; name?: string; lookText?: string; referenceImage?: File };
export type MediaJob = { jobId: string; status: "queued" | "processing" | "succeeded" | "failed"; demo: boolean };

export class MediaProviderError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export interface MediaProvider {
  createCharacter(input: CharacterRequest): Promise<MediaJob>;
  createVideo(input: { idolId: string; prompt: string; durationSec: 5 | 10; resolution: "480p" | "720p" }): Promise<MediaJob>;
}

class UnconfiguredProvider implements MediaProvider {
  async createCharacter(): Promise<MediaJob> {
    throw new MediaProviderError("PROVIDER_NOT_CONFIGURED", "Character generation is not configured. No credit was used");
  }
  async createVideo(): Promise<MediaJob> {
    throw new MediaProviderError("PROVIDER_NOT_CONFIGURED", "Video generation is not configured. No credit was used");
  }
}

export function getMediaProvider(env: Record<string, string | undefined> = process.env): MediaProvider {
  // Real provider adapters remain server-side and are enabled only when explicitly implemented.
  void env;
  return new UnconfiguredProvider();
}

export function buildCharacterPrompts(input: CharacterRequest) {
  const identity = `${input.description.trim()}${input.lookText ? `. Appearance: ${input.lookText.trim()}` : ""}`;
  return {
    headshot: `${identity}. Original fictional AI idol, studio headshot, neutral background, consistent facial identity, no text, no logos.`,
    fullBody: `${identity}. Same original fictional AI idol and exact facial identity, full body portrait, clean editorial lighting, no text, no logos.`,
  };
}
