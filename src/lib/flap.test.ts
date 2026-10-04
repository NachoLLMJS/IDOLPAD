import { describe, expect, it } from "vitest";
import { buildLaunchParams, validateEconomics } from "./flap";

describe("Flap launch configuration", () => {
  it("builds the canonical BNB Tax V3 tuple", () => {
    const params = buildLaunchParams({
      name: "Luna",
      symbol: "LUNA",
      meta: "bafy-meta",
      salt: `0x${"11".repeat(32)}`,
      beneficiary: "0x1111111111111111111111111111111111111111",
      quoteAmountWei: 0n,
    });
    expect(params.tokenVersion).toBe(6);
    expect(params.dexThresh).toBe(1);
    expect(params.quoteToken).toBe("0x0000000000000000000000000000000000000000");
    expect(params.mktBps + params.deflationBps + params.dividendBps + params.lpBps).toBe(10_000);
  });

  it("rejects invalid tax totals and duration boundaries", () => {
    expect(validateEconomics({ buyTaxRate: 100, sellTaxRate: 100, mktBps: 7000, deflationBps: 2999, dividendBps: 0, lpBps: 0, taxDuration: 86400, antiFarmerDuration: 3600 }).ok).toBe(false);
    expect(validateEconomics({ buyTaxRate: 0, sellTaxRate: 0, mktBps: 7000, deflationBps: 3000, dividendBps: 0, lpBps: 0, taxDuration: 86400, antiFarmerDuration: 0 }).ok).toBe(false);
  });
});
