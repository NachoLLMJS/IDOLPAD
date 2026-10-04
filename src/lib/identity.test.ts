import { describe, expect, it } from "vitest";
import { normalizeTicker, validateTicker } from "./identity";

describe("idol identity", () => {
  it("normalizes a display name into a 3-8 character uppercase ticker", () => {
    expect(normalizeTicker("Luna Prime"), "normal ticker").toBe("LUNAPRIM");
    expect(normalizeTicker("AI!"), "minimum length").toBe("AIX");
  });

  it("rejects tickers outside the launch contract", () => {
    expect(validateTicker("IDOL")).toEqual({ ok: true });
    expect(validateTicker("idOL").ok).toBe(false);
    expect(validateTicker("TOO-LONG-TICKER").ok).toBe(false);
  });
});
