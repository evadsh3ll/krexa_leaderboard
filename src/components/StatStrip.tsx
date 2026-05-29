"use client";

import { useEffect, useState } from "react";
import { ENTRY_COUNT, TOTAL_POT } from "@/lib/players";
import { useCountUp } from "@/lib/useCountUp";

export default function StatStrip() {
  // start counters once mounted on the client (no intro gate anymore)
  const [go, setGo] = useState(false);
  useEffect(() => setGo(true), []);

  const entries = useCountUp(ENTRY_COUNT, go, 1300);
  const pot = useCountUp(TOTAL_POT, go, 1600);

  return (
    <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-3">
      <Stat value={String(entries)} label="Entries so far" />
      <Stat value={"$" + pot.toLocaleString()} label="Total bills stacked" accent />
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
