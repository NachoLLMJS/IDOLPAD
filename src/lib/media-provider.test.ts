import { describe, expect, it } from "vitest";
import { getMediaProvider } from "./media-provider";

describe("media provider", () => {
  it("fails closed when no provider is configured", async () => {
    const provider = getMediaProvider({});
    await expect(provider.createCharacter({ description: "a calm finance host", name: "Luna" })).rejects.toMatchObject({ code: "PROVIDER_NOT_CONFIGURED" });
  });
});
