import { describe, expect, it } from "vitest";
import { getPrimaryWalletAction } from "./wallet-state";

describe("wallet state", () => {
  it("keeps BNB writes fail-closed until connected on chain 56", () => {
    expect(getPrimaryWalletAction({ connected: false, chainId: null })).toBe("CONNECT WALLET");
    expect(getPrimaryWalletAction({ connected: true, chainId: 1 })).toBe("SWITCH TO BNB CHAIN");
    expect(getPrimaryWalletAction({ connected: true, chainId: 56 })).toBe("CONTINUE");
  });
});
