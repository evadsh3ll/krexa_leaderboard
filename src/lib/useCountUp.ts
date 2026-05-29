"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useCountUp(target: number, start: boolean, durationMs = 1300) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.max(0, Math.min((now - t0) / durationMs, 1));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, start, durationMs, reduced]);

  return value;
}
