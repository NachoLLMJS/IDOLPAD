"use client";

import { useState } from "react";
import { getPrimaryWalletAction, shortAddress } from "@/lib/wallet-state";

type Eth = { request(args: { method: string; params?: unknown[] }): Promise<unknown>; on?: (event: string, fn: (...args: unknown[]) => void) => void; removeListener?: (event: string, fn: (...args: unknown[]) => void) => void };

declare global { interface Window { ethereum?: Eth } }

export function WalletButton({ compact = false, onReady }: { compact?: boolean; onReady?: (address: string) => void }) {
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);


  async function act() {
    if (!window.ethereum) { window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer"); return; }
    setBusy(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const chain = await window.ethereum.request({ method: "eth_chainId" }) as string;
      if (Number.parseInt(chain, 16) !== 56) {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
      }
      setAddress(accounts[0] || "");
      setChainId(56);
      if (accounts[0]) onReady?.(accounts[0]);
    } catch { /* wallet owns its error UI */ } finally { setBusy(false); }
  }

  const action = busy ? "CONNECTING…" : address && chainId === 56 ? shortAddress(address) : getPrimaryWalletAction({ connected: Boolean(address), chainId });
  return <button className={compact ? "wallet-button compact" : "wallet-button"} onClick={act} disabled={busy}>{action}</button>;
}
