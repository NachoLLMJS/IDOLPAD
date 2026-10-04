import { describe, expect, it } from "vitest";
import { normalizeCommunityTemplates } from "./video-templates";

describe("Higgsfield community templates", () => {
  it("keeps only safe HTTPS media records and limits the public preview", () => {
    const items = normalizeCommunityTemplates([
      { id: "1", title: "Mirror Pose", description: "Pose", previewUrl: "https://cdn.example/a.mp4", posterUrl: "https://cdn.example/a.webp", durationSec: 7.6, width: 720, height: 1280, source: "higgsfield" },
      { id: "2", title: "Bad URL", description: "Bad", previewUrl: "javascript:alert(1)", posterUrl: "http://unsafe/image.webp", durationSec: 5, width: 720, height: 1280, source: "higgsfield" },
    ], 6);
    expect(items).toHaveLength(1);
    expect(items[0].source).toBe("higgsfield-community");
  });
});
