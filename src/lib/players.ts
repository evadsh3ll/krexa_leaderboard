export type GhostName = "blinky" | "pinky" | "inky" | "clyde";
export type Platform = "claude" | "openai";

export type Player = {
  name: string;
  handle: string;
  wallet: string;
  amount: number;
  ghost: GhostName;
  platform: Platform;
};

export const PLATFORM_META: Record<
  Platform,
  { label: string; logo: string }
> = {
  claude: { label: "Claude", logo: "/claude.svg" },
  openai: { label: "Codex", logo: "/openai.svg" },
};

/** Link to the player's post (their X profile / the entry tweet). */
export function postUrl(p: Player): string {
  return `https://x.com/${p.handle.replace(/^@/, "")}`;
}

export const GHOST_COLOR: Record<GhostName, string> = {
  blinky: "#ff2d2d",
  pinky: "#ff7bd5",
  inky: "#00e5ff",
  clyde: "#ff9a3c",
};

export const PLAYERS: Player[] = [
  { name: "WAKA_WHALE", handle: "@waka_whale", wallet: "7xKr…BurnE9", amount: 3240, ghost: "blinky", platform: "claude" },
  { name: "TOKEN_GOBLIN", handle: "@token_goblin", wallet: "Gm3p…9xQ2zA", amount: 2980, ghost: "pinky", platform: "openai" },
  { name: "PROMPT_PILED", handle: "@prompt_piled", wallet: "4Hbz…KreXa7", amount: 2610, ghost: "inky", platform: "claude" },
  { name: "CTX_WINDOW", handle: "@ctx_window", wallet: "9Lmn…vBill3", amount: 2155, ghost: "clyde", platform: "openai" },
  { name: "GPU_MELTER", handle: "@gpu_melter", wallet: "2Qrt…uPac88", amount: 1840, ghost: "blinky", platform: "claude" },
  { name: "OVERFIT_OG", handle: "@overfit_og", wallet: "5Dvw…zDot42", amount: 1490, ghost: "pinky", platform: "openai" },
  { name: "API_ADDICT", handle: "@api_addict", wallet: "8Fkp…mGhost", amount: 1075, ghost: "inky", platform: "claude" },
  { name: "FREE_TIER_X", handle: "@free_tier_x", wallet: "3Nqe…sCoin1", amount: 760, ghost: "clyde", platform: "openai" },
];

export const ENTRY_COUNT = 47;
export const DEADLINE_ISO = "2026-06-10T23:59:59Z";
export const TOTAL_POT = PLAYERS.reduce((s, p) => s + p.amount, 0);
export const MAX_AMOUNT = Math.max(...PLAYERS.map((p) => p.amount));
