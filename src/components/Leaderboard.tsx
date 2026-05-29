"use client";

import { motion } from "motion/react";
import {
  formatAmount,
  platformMeta,
  type Entry,
  type LeaderboardState,
} from "@/lib/leaderboard";
import { Ghost } from "./Sprites";

const EASE_OUT = [0, 0, 0.2, 1] as const;

// #1 = brand cyan, #2 silver, #3 bronze
const TIER = ["#25cdff", "#cdd4e6", "#e09a5b"];
// classic ghost palette, cycled down the board
const GHOSTS = ["#ff2d2d", "#ff7bd5", "#00e5ff", "#ff9a3c"];

export default function Leaderboard({ lb }: { lb: LeaderboardState }) {
  const { data, loading, refreshing, error, refresh } = lb;
  const entries = data?.entries ?? [];
  const maxAmount = Math.max(1, ...entries.map((e) => e.amount ?? 0));

  return (
    <section id="board" className="mt-28 scroll-mt-8">
      <div className="text-center">
        <span className="eyebrow">High scores</span>
        <h2 className="section-title mt-5 text-[clamp(26px,4.5vw,40px)]">
          The leaderboard
        </h2>
      </div>

      {/* status bar */}
      <div className="mx-auto mt-6 flex max-w-[720px] items-center justify-center gap-3 text-xs text-text-mute">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background: error ? "#ff5267" : "#3ad29f",
              boxShadow: `0 0 8px ${error ? "#ff5267" : "#3ad29f"}`,
            }}
          />
          {data ? (
            <>Last updated {new Date(data.updated_at).toLocaleTimeString()}</>
          ) : (
            <>Connecting…</>
          )}
        </span>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="link-chip px-2.5 py-1 text-xs disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="glow-border card mt-6 overflow-hidden p-2 sm:p-3">
        <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-text-dim sm:grid-cols-[48px_1fr_170px] sm:px-5">
          <div>Rank</div>
          <div>Player</div>
          <div className="text-right">Bill &amp; platform</div>
        </div>
        <div className="h-px w-full" style={{ background: "var(--border)" }} />

        {loading && !data ? (
          <LoadingRows />
        ) : error && !data ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col">
            {entries.map((e, i) => (
              <Row key={`${e.handle}-${e.rank}`} entry={e} index={i} maxAmount={maxAmount} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Row({
  entry,
  index,
  maxAmount,
}: {
  entry: Entry;
  index: number;
  maxAmount: number;
}) {
  const rank = entry.rank ?? index + 1;
  const isTop = rank <= 3;
  const isChamp = rank === 1;
  const tier = TIER[rank - 1] ?? "#25cdff";
  const color = GHOSTS[(rank - 1) % GHOSTS.length];
  const meta = platformMeta(entry.platform);
  const pct = entry.amount != null ? Math.round((entry.amount / maxAmount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.38, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) }}
      className={`group relative grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl px-4 py-4 transition-colors duration-150 hover:bg-[var(--surface)] sm:grid-cols-[48px_1fr_170px] sm:px-5 ${
        isChamp ? "champion-row" : ""
      }`}
    >
      {/* rank badge */}
      <div className="flex justify-start">
        <span
          className="rank-badge text-sm font-semibold"
          style={
            isTop
              ? {
                  color: tier,
                  border: `1px solid ${tier}`,
                  background: `color-mix(in srgb, ${tier} 14%, transparent)`,
                  boxShadow: isChamp ? `0 0 16px color-mix(in srgb, ${tier} 55%, transparent)` : "none",
                }
              : { color: "var(--text-dim)", border: "1px solid var(--border-strong)" }
          }
        >
          {rank}
        </span>
      </div>

      {/* player */}
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="relative flex-none">
          <Ghost color={color} size={30} />
          {isChamp && (
            <span aria-hidden className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">
              👑
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-semibold text-text">{entry.name || entry.handle}</span>
            <a
              href={entry.profile_url}
              target="_blank"
              rel="noopener"
              className="font-mono text-xs text-text-dim transition-colors hover:text-text"
            >
              @{entry.handle}
            </a>
          </div>

          {/* progress bar */}
          <div className="mt-2.5 h-1.5 w-full max-w-[300px] overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: isTop
                  ? "linear-gradient(90deg, var(--gold-deep), var(--gold))"
                  : color,
                opacity: isTop ? 1 : 0.75,
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* bill + platform */}
      <div className="flex flex-col items-end gap-1.5">
        <div
          className={`nums font-semibold ${isTop ? "text-xl" : "text-lg"}`}
          style={{ color: isTop && entry.amount != null ? tier : "var(--text)" }}
        >
          {formatAmount(entry.amount, entry.currency)}
        </div>
        <a
          href={entry.post_url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-2.5 py-1 text-xs text-text-dim transition-colors hover:border-[var(--border-strong)] hover:text-text"
          aria-label={`View ${entry.name || entry.handle}'s ${meta.label} bill post on X`}
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
          />
          {meta.label}
          <span aria-hidden className="text-text-mute">↗</span>
        </a>
      </div>
    </motion.div>
  );
}

function LoadingRows() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[48px_1fr_170px] sm:px-5"
        >
          <div className="h-8 w-8 animate-pulse rounded-md bg-[var(--surface-2)]" />
          <div className="flex items-center gap-3.5">
            <div className="h-[30px] w-[30px] flex-none animate-pulse rounded-full bg-[var(--surface-2)]" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 w-40 animate-pulse rounded bg-[var(--surface-2)]" />
              <div className="h-1.5 w-56 max-w-full animate-pulse rounded bg-[var(--surface-2)]" />
            </div>
          </div>
          <div className="ml-auto h-5 w-20 animate-pulse rounded bg-[var(--surface-2)]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="text-3xl">🟡</div>
      <p className="text-lg font-semibold text-text">No bills yet — be the first!</p>
      <p className="max-w-sm text-sm text-text-dim">
        Post your Claude or OpenAI bill with #KREXABILLCHALLENGE and you&apos;ll show
        up here.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="text-3xl">👻</div>
      <p className="text-lg font-semibold text-text">Couldn&apos;t load the board</p>
      <p className="max-w-sm text-sm text-text-dim">
        {message}. The scores are still out there — give it another shot.
      </p>
      <button type="button" onClick={onRetry} className="btn-primary mt-2 px-5 py-2.5 text-sm">
        Try again
      </button>
    </div>
  );
}
