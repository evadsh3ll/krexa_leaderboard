"use client";

import { formatAmount, type LeaderboardData } from "@/lib/leaderboard";

export default function StatStrip({ data }: { data: LeaderboardData | null }) {
  const entries = data?.entries ?? [];
  const count = data?.count ?? entries.length;
  const top = entries.find((e) => e.amount != null);

  return (
    <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      <Stat value={data ? String(count) : "—"} label="Entries so far" />
      <Stat
        value={top ? formatAmount(top.amount, top.currency) : "—"}
        label="Biggest bill"
        accent
      />
      <div className="card card-hover px-5 py-5 text-left">
        <div className="text-2xl font-semibold text-gradient">June 10</div>
        <div className="mt-1.5 text-sm text-text-dim">
          Entries close · winners June 11
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="card card-hover px-5 py-5 text-left">
      <div
        className="nums text-3xl font-medium"
        style={accent ? { color: "var(--gold)" } : { color: "var(--text)" }}
      >
        {value}
      </div>
      <div className="mt-1.5 text-sm text-text-dim">{label}</div>
    </div>
  );
}
