import { describe, expect, it } from "vitest";
import { computeFeeSplit, validateDevBuy } from "./idolpad-economics";

describe("IDOLPAD editable fee split", () => {
  it("derives the creator allocation from editable burn and treasury percentages", () => {
    expect(computeFeeSplit(30, 35)).toEqual({ ok: true, burnPct: 30, treasuryPct: 35, creatorPct: 35 });
    expect(computeFeeSplit(40, 20)).toEqual({ ok: true, burnPct: 40, treasuryPct: 20, creatorPct: 40 });
  });

  it("rejects percentages that leave a negative creator allocation", () => {
    expect(computeFeeSplit(70, 40).ok).toBe(false);
  });

  it("accepts an optional non-negative BNB dev buy", () => {
    expect(validateDevBuy("0").ok).toBe(true);
    expect(validateDevBuy("0.25").ok).toBe(true);
    expect(validateDevBuy("-1").ok).toBe(false);
    expect(validateDevBuy("not-a-number").ok).toBe(false);
  });
});
