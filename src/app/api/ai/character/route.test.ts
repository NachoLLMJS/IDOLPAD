// @vitest-environment node
import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("character generation route", () => {
  it("accepts a validated image reference as multipart form data", async () => {
    const body = new FormData();
    body.set("description", "A cinematic original AI idol");
    body.set("lookText", "Black and yellow tailored wardrobe");
    body.set("name", "Nova");
    body.set("referenceImage", new Blob(["image"], { type: "image/png" }), "reference.png");

    const response = await POST(new Request("http://localhost/api/ai/character", { method: "POST", body }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error.code).toBe("PROVIDER_NOT_CONFIGURED");
  });
});
