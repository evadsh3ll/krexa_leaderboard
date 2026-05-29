"use client";

import { useEffect, useRef } from "react";

/**
 * Iconic Pac-Man chase, drawn on canvas. Pac-Man chomps left -> right eating a
 * row of pellets while the four ghosts trail behind, then it loops.
 *
 * This animation runs unconditionally (it does NOT honour prefers-reduced-motion)
 * because it is the brand centerpiece the product is built around. Incidental UI
 * motion elsewhere still respects the user's reduced-motion setting.
 */

const GHOSTS = ["#ff5267", "#ff8fd6", "#45d9ff", "#ffb454"];
const H = 104; // css height
const SPEED = 150; // px / second
const PELLET_GAP = 34;

export default function PacManBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let pellets: { x: number; power: boolean; eaten: boolean }[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildPellets();
    };

    const buildPellets = () => {
      pellets = [];
      const start = PELLET_GAP;
      for (let x = start, i = 0; x < width - 8; x += PELLET_GAP, i++) {
        pellets.push({ x, power: i % 6 === 4, eaten: false });
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const midY = H / 2;
    const R = 22; // pac radius
    // pac starts off the left edge; loop length covers width + lead-in
    let last = performance.now();
    let pacX = -R * 2;
    let t = 0; // time accumulator for chomp + ghost wiggle
    let raf = 0;

    const drawPac = (x: number, mouth: number) => {
      ctx.save();
      ctx.translate(x, midY);
      ctx.fillStyle = "#ffce3a";
      ctx.shadowColor = "rgba(255,206,58,0.6)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      const a = mouth * 0.32 * Math.PI; // half-mouth angle
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, a, Math.PI * 2 - a);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawGhost = (x: number, color: string, bob: number) => {
      const r = 18;
      const y = midY + bob;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -3, r, Math.PI, 0);
      ctx.lineTo(r, r - 3);
      // wavy skirt (3 humps), phase shifts with bob for the classic foot wiggle
      const humps = 3;
      const step = (r * 2) / humps;
      const dir = bob > 0 ? 1 : 0;
      for (let i = 0; i < humps; i++) {
        const x0 = r - i * step;
        ctx.lineTo(x0 - step / 2, r - 3 - (i % 2 === dir ? 5 : 0));
        ctx.lineTo(x0 - step, r - 3);
      }
      ctx.closePath();
      ctx.fill();
      // eyes
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(-6, -4, 5.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, -4, 5.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#13183a";
      ctx.beginPath(); ctx.arc(-4.5, -4, 2.4, 0, Math.PI * 2); ctx.fill(); // look right (chasing)
      ctx.beginPath(); ctx.arc(7.5, -4, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      pacX += SPEED * dt;

      const loopEnd = width + R * 2 + GHOSTS.length * 46 + 60;
      if (pacX > loopEnd) {
        pacX = -R * 2;
        buildPellets();
      }

      ctx.clearRect(0, 0, width, H);

      // pellets (eaten once Pac-Man's leading edge passes them)
      for (const p of pellets) {
        if (!p.eaten && pacX + R * 0.2 >= p.x) p.eaten = true;
        if (p.eaten) continue;
        const pr = p.power ? 5.5 + Math.sin(t * 6) * 1.2 : 2.6;
        ctx.fillStyle = "rgba(255,226,138,0.9)";
        ctx.shadowColor = "rgba(255,206,58,0.5)";
        ctx.shadowBlur = p.power ? 12 : 6;
        ctx.beginPath();
        ctx.arc(p.x, midY, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // chomp: 0..1..0
      const mouth = Math.abs(Math.sin(t * 9));
      drawPac(pacX, mouth);

      // ghosts trail behind, evenly spaced, bobbing out of phase
      GHOSTS.forEach((c, i) => {
        const gx = pacX - 46 * (i + 1) - 14;
        const bob = Math.sin(t * 8 + i * 0.9) * 3;
        if (gx > -30 && gx < width + 30) drawGhost(gx, c, bob);
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="mx-auto block w-full max-w-2xl"
      style={{ height: H }}
    />
  );
}
