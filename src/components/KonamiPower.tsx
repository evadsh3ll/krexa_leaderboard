"use client";

import { useEffect, useState } from "react";

const SEQ = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export default function KonamiPower({
  scaredRef,
}: {
  scaredRef: React.MutableRefObject<boolean>;
}) {
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let pos = 0;
    let resetTimer: ReturnType<typeof setTimeout>;
    let flashTimer: ReturnType<typeof setTimeout>;
    let toastTimer: ReturnType<typeof setTimeout>;

    const trigger = () => {
      setFlash(true);
      flashTimer = setTimeout(() => setFlash(false), 160);
      setToast(true);
      toastTimer = setTimeout(() => setToast(false), 2600);
      scaredRef.current = true;
      resetTimer = setTimeout(() => {
        scaredRef.current = false;
      }, 7000);
    };

    const onKey = (e: KeyboardEvent) => {
      pos = e.keyCode === SEQ[pos] ? pos + 1 : e.keyCode === SEQ[0] ? 1 : 0;
      if (pos === SEQ.length) {
        pos = 0;
        trigger();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(resetTimer);
      clearTimeout(flashTimer);
      clearTimeout(toastTimer);
    };
  }, [scaredRef]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] transition-opacity duration-100"
        style={{ background: "var(--inky)", opacity: flash ? 0.22 : 0 }}
      />
      <div
        role="status"
        aria-live="polite"
        className="card fixed bottom-7 left-1/2 z-[95] flex -translate-x-1/2 items-center gap-2.5 px-5 py-3 text-sm font-medium transition-transform duration-[250ms] ease-out"
        style={{
          color: "var(--gold)",
          borderColor: "rgba(37,205,255,0.4)",
          boxShadow: "0 8px 30px -8px rgba(37,205,255,0.5)",
          transform: toast
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(240%)",
        }}
      >
        <span aria-hidden>⚡</span> Power pellet — ghosts frightened
      </div>
    </>
  );
}
