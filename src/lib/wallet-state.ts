export type WalletState = { connected: boolean; chainId: number | null };

export function getPrimaryWalletAction(state: WalletState) {
  if (!state.connected) return "CONNECT WALLET";
  if (state.chainId !== 56) return "SWITCH TO BNB CHAIN";
  return "CONTINUE";
}

export function shortAddress(address: string) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
}
