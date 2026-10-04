import { z } from "zod";
import { isAddress } from "viem";
import { apiError } from "@/lib/api";
import { FLAP, isLaunchConfigured, validateEconomics } from "@/lib/flap";
import { validateTicker } from "@/lib/identity";
import { computeFeeSplit, validateDevBuy } from "@/lib/idolpad-economics";

const schema = z.object({
  name: z.string().min(2).max(80), symbol: z.string().min(3).max(8), beneficiary: z.string(),
  devBuyBnb: z.string(), buybackBurnPct: z.number().min(0).max(100), treasuryPct: z.number().min(0).max(100), creatorPct: z.number().min(0).max(100),
}).strict();

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return apiError("INVALID_INPUT", "Launch request is invalid", 422, parsed.error.flatten());
  if (!validateTicker(parsed.data.symbol).ok) return apiError("INVALID_TICKER", "Ticker must be 3-8 uppercase letters or numbers", 422);
  if (!isAddress(parsed.data.beneficiary)) return apiError("INVALID_BENEFICIARY", "Enter a valid EVM beneficiary address", 422);

  const split = computeFeeSplit(parsed.data.buybackBurnPct, parsed.data.treasuryPct);
  if (!split.ok || split.creatorPct !== parsed.data.creatorPct) return apiError("INVALID_FEE_SPLIT", split.error || "Creator remainder does not match the fee split", 422);
  const devBuy = validateDevBuy(parsed.data.devBuyBnb);
  if (!devBuy.ok) return apiError("INVALID_DEV_BUY", devBuy.error || "Invalid dev buy", 422);

  const economics = validateEconomics({ buyTaxRate: 100, sellTaxRate: 100, mktBps: 10000, deflationBps: 0, dividendBps: 0, lpBps: 0, taxDuration: 365 * 86400, antiFarmerDuration: 3600 });
  if (!economics.ok) return apiError("INVALID_ECONOMICS", economics.error || "Invalid economics", 422);
  if (!process.env.NEXT_PUBLIC_IDOLPAD_VAULT_FACTORY) return apiError("VAULT_NOT_CONFIGURED", "Editable buyback, treasury and creator splitting requires the IDOLPAD Vault Factory. It is not deployed or configured, so no wallet transaction was requested", 503, { split, devBuyBnb: parsed.data.devBuyBnb });
  if (!isLaunchConfigured()) return apiError("LAUNCH_NOT_CONFIGURED", "Flap launch is disabled: BNB RPC, canonical Portal, or metadata upload configuration is missing. No wallet transaction was requested", 503, { chainId: FLAP.chainId, portal: FLAP.portal });
  if (process.env.NEXT_PUBLIC_FLAP_PORTAL?.toLowerCase() !== FLAP.portal.toLowerCase()) return apiError("PORTAL_MISMATCH", "Configured Portal does not match the approved BNB manifest. No transaction was requested", 503);
  return apiError("LIVE_PREFLIGHT_REQUIRED", "Configuration exists, but live Vault Factory checks, metadata upload, random 7777 salt mining, exact VaultPortal call simulation and gas estimation must complete before signing. Broadcasting remains disabled in this build", 503);
}