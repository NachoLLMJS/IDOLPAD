export type FeeSplit = { ok: boolean; burnPct: number; treasuryPct: number; creatorPct: number; error?: string };

export function computeFeeSplit(burnPct: number, treasuryPct: number): FeeSplit {
  if (!Number.isFinite(burnPct) || !Number.isFinite(treasuryPct) || burnPct < 0 || treasuryPct < 0 || burnPct > 100 || treasuryPct > 100) {
    return { ok: false, burnPct, treasuryPct, creatorPct: 0, error: "Percentages must be between 0 and 100" };
  }
  const creatorPct = 100 - burnPct - treasuryPct;
  if (creatorPct < 0) return { ok: false, burnPct, treasuryPct, creatorPct, error: "Buy & burn plus treasury cannot exceed 100%" };
  return { ok: true, burnPct, treasuryPct, creatorPct };
}

export function validateDevBuy(value: string): { ok: boolean; value?: number; error?: string } {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) return { ok: false, error: "Dev buy must be a non-negative BNB amount" };
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return { ok: false, error: "Dev buy must be a non-negative BNB amount" };
  return { ok: true, value: amount };
}
