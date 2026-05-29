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
      setData(json as LeaderboardData);
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
