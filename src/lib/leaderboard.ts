"use client";

import { useCallback, useEffect, useState } from "react";

export const LEADERBOARD_API =
  "https://krexa-leaderboard-backend.onrender.com/leaderboard";

export type Entry = {
  rank: number;
  platform: string;
  amount: number | null;
  currency: string;
  vendor: string;
  handle: string;
  name: string;
  profile_url: string;
  post_url: string;
  image_url: string;
  posted_at: string;
  likes: number;
  retweets: number;
  views: number;
};

export type LeaderboardData = {
  updated_at: string;
  count: number;
  entries: Entry[];
};

export type PlatformMeta = { label: string; color: string };

/** Map a free-form platform string to a label + brand-ish color. */
export function platformMeta(platform: string): PlatformMeta {
  const k = (platform || "").toLowerCase();
  if (k.includes("claude") || k.includes("anthropic"))
    return { label: platform, color: "#d97757" };
  if (k.includes("openai") || k.includes("codex") || k.includes("gpt") || k.includes("chatgpt"))
    return { label: platform, color: "#10a37f" };
  if (k.includes("cursor")) return { label: platform, color: "#cfd6e6" };
  if (k.includes("gemini") || k.includes("google"))
    return { label: platform, color: "#5a91ff" };
  if (k.includes("perplexity")) return { label: platform, color: "#20b8c5" };
  if (!platform) return { label: "Unknown", color: "#8b93ab" };
  return { label: platform, color: "#25cdff" };
}

const CURRENCY_SYMBOL: Record<string, string> = {
  $: "$",
  usd: "$",
  "us$": "$",
  usd$: "$",
  "₹": "₹",
  inr: "₹",
  rs: "₹",
  "rs.": "₹",
  "€": "€",
  eur: "€",
  "£": "£",
  gbp: "£",
  "¥": "¥",
  jpy: "¥",
  cny: "¥",
};

/** Format a bill amount, always with the currency symbol in front. null → "—". */
export function formatAmount(amount: number | null, currency: string): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  const raw = (currency || "$").trim();
  const sym =
    CURRENCY_SYMBOL[raw.toLowerCase()] ||
    // already a pure symbol (no letters/digits) → keep it; otherwise default to $
    (/^[^a-z0-9]+$/i.test(raw) ? raw : "$");
  const n = amount.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${sym}${n}`;
}

// --- per-entry cleanup ----------------------------------------------------
// Handles to hide from the board (case-insensitive, no leading @).
const BLOCK_HANDLES = new Set(["avj1109", "archiehashani"]);
// Approx INR/USD rate used to correct entries we know were posted in rupees.
const INR_PER_USD = 83.5;
// Per-handle data fixes (applied before block/dedupe/re-rank).
const HANDLE_FIXES: Record<string, (e: Entry) => Entry> = {
  // shydev69 posted a ~1.38 lakh INR bill; the API stored it as $. Convert.
  shydev69: (e) => ({
    ...e,
    amount:
      e.amount != null ? Math.round((e.amount / INR_PER_USD) * 100) / 100 : null,
    currency: "$",
  }),
};

function normalize(data: LeaderboardData): LeaderboardData {
  // 1) per-handle fixes
  let arr = data.entries.map((e) => {
    const fix = HANDLE_FIXES[(e.handle || "").toLowerCase()];
    return fix ? fix(e) : e;
  });
  // 2) hide blocked handles
  arr = arr.filter((e) => !BLOCK_HANDLES.has((e.handle || "").toLowerCase()));
  // 3) dedupe by handle, keeping the highest-amount entry
  const byHandle = new Map<string, Entry>();
  for (const e of arr) {
    const k = (e.handle || "").toLowerCase();
    if (!k) continue;
    const cur = byHandle.get(k);
    if (!cur || (e.amount ?? -Infinity) > (cur.amount ?? -Infinity)) {
      byHandle.set(k, e);
    }
  }
  // 4) sort by amount desc (nulls last) and re-rank
  const sorted = [...byHandle.values()].sort(
    (a, b) => (b.amount ?? -Infinity) - (a.amount ?? -Infinity),
  );
  const reRanked = sorted.map((e, i) => ({ ...e, rank: i + 1 }));
  return { ...data, count: reRanked.length, entries: reRanked };
}

export type LeaderboardState = {
  data: LeaderboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
};

export function useLeaderboard(pollMs = 30_000): LeaderboardState {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal, manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(LEADERBOARD_API, { signal, cache: "no-store" });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const json = (await res.json()) as unknown;
      if (
        !json ||
        typeof json !== "object" ||
        !Array.isArray((json as LeaderboardData).entries)
      ) {
        throw new Error("Unexpected response shape");
      }
      setData(normalize(json as LeaderboardData));
      setError(null);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    const id = setInterval(() => load(), pollMs);
    return () => {
      ctrl.abort();
      clearInterval(id);
    };
  }, [load, pollMs]);

  const refresh = useCallback(() => load(undefined, true), [load]);

  return { data, loading, refreshing, error, refresh };
}
