"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  GHOST_COLOR,
  MAX_AMOUNT,
  PLATFORM_META,
  PLAYERS,
  postUrl,
  type Player,
} from "@/lib/players";
import { useCountUp } from "@/lib/useCountUp";
import { Ghost } from "./Sprites";

const EASE_OUT = [0, 0, 0.2, 1] as const;

// #1 = brand cyan, #2 silver, #3 bronze
const TIER = ["#25cdff", "#cdd4e6", "#e09a5b"];

export default function Leaderboard() {
  return (
    <section id="board" className="mt-28 scroll-mt-8">
      <SectionHead
        eyebrow="High scores"
        title="The leaderboard"
        sub="Highest bills win. The bar shows each bill relative to the current #1."
      />

      <div className="glow-border card mt-9 overflow-hidden p-2 sm:p-3">
        <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-text-dim sm:grid-cols-[48px_1fr_160px] sm:px-5">
          <div>Rank</div>
          <div>Player</div>
          <div className="text-right">Bill &amp; platform</div>
        </div>
        <div className="h-px w-full" style={{ background: "var(--border)" }} />

        <div className="flex flex-col">
          {PLAYERS.map((p, i) => (
            <Row key={p.handle} player={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ player, index }: { player: Player; index: number }) {
  const [shown, setShown] = useState(false);
  const amount = useCountUp(player.amount, shown, 1200);
  const color = GHOST_COLOR[player.ghost];
  const rank = index + 1;
  const isTop = rank <= 3;
  const isChamp = rank === 1;
  const tier = TIER[index];
  const pct = Math.round((player.amount / MAX_AMOUNT) * 100);
  const meta = PLATFORM_META[player.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.38, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) }}
      onViewportEnter={() => setShown(true)}
      className={`group relative grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl px-4 py-4 transition-colors duration-150 hover:bg-[var(--surface)] sm:grid-cols-[48px_1fr_160px] sm:px-5 ${
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
            <span className="font-semibold text-text">{player.name}</span>
            <span className="font-mono text-xs text-text-dim">{player.handle}</span>
            {isTop && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: `color-mix(in srgb, ${tier} 16%, transparent)`,
                  color: tier,
                  border: `1px solid color-mix(in srgb, ${tier} 36%, transparent)`,
                }}
              >
                3× winner
              </span>
            )}
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
              animate={{ width: shown ? `${pct}%` : 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* bill + platform */}
      <div className="flex flex-col items-end gap-1.5">
        <div
          className={`nums font-semibold ${isTop ? "text-xl" : "text-lg"}`}
          style={{ color: isTop ? tier : "var(--text)" }}
        >
          ${amount.toLocaleString()}
        </div>
        <a
          href={postUrl(player)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-2.5 py-1 text-xs text-text-dim transition-colors hover:border-[var(--border-strong)] hover:text-text focus-visible:outline-2 focus-visible:outline-[var(--indigo)]"
          aria-label={`View ${player.name}'s ${meta.label} bill post on X`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.logo} alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-[3px]" />
          {meta.label}
          <span aria-hidden className="text-text-mute">↗</span>
        </a>
      </div>
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-5 text-[clamp(26px,4.5vw,40px)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-text-dim">{sub}</p>
    </div>
  );
}
