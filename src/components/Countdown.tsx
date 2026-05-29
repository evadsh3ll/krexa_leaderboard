"use client";

import { useEffect, useState } from "react";
import { DEADLINE_ISO } from "@/lib/players";

type Parts = { d: number; h: number; m: number; s: number };

function pad(n: number | null) {
  if (n === null) return "--";
  return (n < 10 ? "0" : "") + n;
}

function diffParts(deadline: number): Parts {
  let diff = deadline - Date.now();
  if (diff < 0) diff = 0;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown() {
  const deadline = new Date(DEADLINE_ISO).getTime();
  const [t, setT] = useState<Parts | null>(null);

  useEffect(() => {
    setT(diffParts(deadline));
    const id = setInterval(() => setT(diffParts(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const cells = [
    { v: t?.d ?? null, k: "Days" },
    { v: t?.h ?? null, k: "Hrs" },
    { v: t?.m ?? null, k: "Min" },
    { v: t?.s ?? null, k: "Sec" },
  ];

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div
        className="card flex items-stretch divide-x overflow-hidden"
        style={{ ["--tw-divide-opacity" as string]: "1", borderColor: "var(--border)" }}
        aria-label="Time until entries close"
      >
        {cells.map((c, i) => (
          <div
            key={c.k}
            className="flex min-w-[68px] flex-col items-center px-4 py-3"
            style={{ borderLeft: i === 0 ? "none" : "1px solid var(--border)" }}
          >
            <span className="nums text-2xl font-medium text-text sm:text-3xl">
              {pad(c.v)}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-widest text-text-mute">
              {c.k}
            </span>
          </div>
        ))}
      </div>
      <span className="text-xs text-text-dim">
        Entries close June 10 · winners announced June 11
      </span>
    </div>
  );
}
