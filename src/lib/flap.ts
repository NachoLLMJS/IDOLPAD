export type Economics = {
  buyTaxRate: number;
  sellTaxRate: number;
  mktBps: number;
  deflationBps: number;
  dividendBps: number;
  lpBps: number;
  taxDuration: number;
  antiFarmerDuration: number;
};

export const FLAP = {
  chainId: 56,
  portal: "0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0",
  taxTokenV3Implementation: "0x024f18294970B5c76c0691b87f138A0317156422",
  zeroAddress: "0x0000000000000000000000000000000000000000",
} as const;

export function validateEconomics(e: Economics): { ok: boolean; error?: string } {
  if (e.buyTaxRate < 0 || e.buyTaxRate > 1000 || e.sellTaxRate < 0 || e.sellTaxRate > 1000) return { ok: false, error: "Each tax must be between 0% and 10%" };
  if (e.buyTaxRate === 0 && e.sellTaxRate === 0) return { ok: false, error: "Tax Token V3 requires a non-zero buy or sell tax" };
  if (e.mktBps + e.deflationBps + e.dividendBps + e.lpBps !== 10_000) return { ok: false, error: "Tax allocations must total 100%" };
  if (e.taxDuration < e.antiFarmerDuration + 86_400) return { ok: false, error: "Tax duration must exceed anti-farmer duration by one day" };
  return { ok: true };
}

type LaunchInput = { name: string; symbol: string; meta: string; salt: `0x${string}`; beneficiary: `0x${string}`; quoteAmountWei: bigint };

export function buildLaunchParams(input: LaunchInput) {
  return {
    name: input.name,
    symbol: input.symbol,
    meta: input.meta,
    dexThresh: 1,
    salt: input.salt,
    migratorType: 1,
    quoteToken: FLAP.zeroAddress,
    quoteAmt: input.quoteAmountWei,
    beneficiary: input.beneficiary,
    permitData: "0x",
    extensionID: `0x${"00".repeat(32)}`,
    extensionData: "0x",
    dexId: 0,
    lpFeeProfile: 0,
    buyTaxRate: 100,
    sellTaxRate: 100,
    taxDuration: 365 * 24 * 60 * 60,
    antiFarmerDuration: 60 * 60,
    mktBps: 7000,
    deflationBps: 3000,
    dividendBps: 0,
    lpBps: 0,
    minimumShareBalance: 0n,
    dividendToken: FLAP.zeroAddress,
    commissionReceiver: FLAP.zeroAddress,
    tokenVersion: 6,
  } as const;
}

export function isLaunchConfigured(env: Record<string, string | undefined> = process.env) {
  return Boolean(env.BNB_RPC_URL && env.NEXT_PUBLIC_FLAP_PORTAL && env.FLAP_METADATA_UPLOAD_URL);
}
