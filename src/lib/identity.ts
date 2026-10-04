export function normalizeTicker(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return clean.padEnd(3, "X");
}

export function validateTicker(value: string): { ok: boolean; error?: string } {
  if (!/^[A-Z0-9]{3,8}$/.test(value)) {
    return { ok: false, error: "Ticker must be 3-8 uppercase letters or numbers" };
  }
  return { ok: true };
}

export function suggestIdentity(description: string) {
  const text = description.toLowerCase();
  const lane = text.includes("finance") || text.includes("market")
    ? "Market"
    : text.includes("fashion") || text.includes("style")
      ? "Mode"
      : text.includes("game")
        ? "Glitch"
        : text.includes("fitness")
          ? "Pulse"
          : "Nova";
  return [lane, `${lane} AI`, `${lane} One`].map((name) => ({ name, ticker: normalizeTicker(name) }));
}
