"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Actor = {
  color: string;
  isPac: boolean;
  scared: boolean;
  cx: number;
  cy: number;
  px: number;
  py: number;
  dir: [number, number];
  speed: number;
  mouth: number;
  mdir: number;
};

const GRID = 34;
const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export type MazeHandle = { setScared: (v: boolean) => void };

export default function MazeBackground({
  scaredRef,
}: {
  scaredRef?: React.MutableRefObject<boolean>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rowsN = 0;
    let dots: boolean[][] = [];

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cols = Math.ceil(window.innerWidth / GRID) + 1;
      rowsN = Math.ceil(window.innerHeight / GRID) + 1;
      dots = [];
      for (let y = 0; y < rowsN; y++) {
        dots[y] = [];
        for (let x = 0; x < cols; x++) dots[y][x] = true;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const make = (color: string, cx: number, cy: number, isPac = false): Actor => ({
      color,
      isPac,
      scared: false,
      cx,
      cy,
      px: cx * GRID,
      py: cy * GRID,
      dir: DIRS[Math.floor(Math.random() * 4)],
      speed: isPac ? 2.4 : 1.9,
      mouth: 0,
      mdir: 1,
    });

    const pac = make("#ffce3a", 3, 3, true);
    const ghosts = [
      make("#ff5267", 8, 5),
      make("#ff8fd6", 12, 9),
      make("#45d9ff", 6, 12),
      make("#ffb454", 15, 4),
    ];

    const atCenter = (a: Actor) =>
      Math.abs(a.px - a.cx * GRID) < a.speed && Math.abs(a.py - a.cy * GRID) < a.speed;

    const pickDir = (a: Actor) => {
      const opts = DIRS.filter((d) => {
        const nx = a.cx + d[0];
        const ny = a.cy + d[1];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rowsN) return false;
        return !(d[0] === -a.dir[0] && d[1] === -a.dir[1]);
      });
      if (!opts.length) {
        a.dir = [-a.dir[0], -a.dir[1]];
        return;
      }
      const keep = opts.filter((d) => d[0] === a.dir[0] && d[1] === a.dir[1]);
      if (keep.length && Math.random() > 0.22) {
        a.dir = keep[0];
        return;
      }
      a.dir = opts[Math.floor(Math.random() * opts.length)];
    };

    const step = (a: Actor) => {
      if (atCenter(a)) {
        a.px = a.cx * GRID;
        a.py = a.cy * GRID;
        pickDir(a);
        a.cx += a.dir[0];
        a.cy += a.dir[1];
        if (a.cx < 0) { a.cx = cols - 1; a.px = a.cx * GRID; }
        if (a.cx >= cols) { a.cx = 0; a.px = 0; }
        if (a.cy < 0) { a.cy = rowsN - 1; a.py = a.cy * GRID; }
        if (a.cy >= rowsN) { a.cy = 0; a.py = 0; }
      }
      a.px += a.dir[0] * a.speed;
      a.py += a.dir[1] * a.speed;
      if (a.isPac) {
        a.mouth += 0.16 * a.mdir;
        if (a.mouth > 0.32 || a.mouth < 0) a.mdir *= -1;
        const gx = Math.round(a.px / GRID);
        const gy = Math.round(a.py / GRID);
        if (dots[gy] && dots[gy][gx]) dots[gy][gx] = false;
      }
    };

    const drawPac = (a: Actor) => {
      const ang = Math.atan2(a.dir[1], a.dir[0]);
      ctx.save();
      ctx.translate(a.px, a.py);
      ctx.rotate(ang);
      ctx.fillStyle = "#ffce3a";
      ctx.shadowColor = "#ffce3a";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      const m = a.mouth * Math.PI;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, GRID * 0.42, m, Math.PI * 2 - m);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawGhost = (g: Actor) => {
      const r = GRID * 0.4;
      const col = g.scared ? "#2121ff" : g.color;
      ctx.save();
      ctx.translate(g.px, g.py);
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, -2, r, Math.PI, 0);
      ctx.lineTo(r, r);
      const waves = 3;
      const stepW = (r * 2) / waves;
      for (let w = 0; w < waves; w++) {
        const x0 = r - w * stepW;
        ctx.lineTo(x0 - stepW / 2, r - 4);
        ctx.lineTo(x0 - stepW, r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(-r * 0.4, -2, r * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.4, -2, r * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = g.scared ? "#fff" : "#1919A6";
      ctx.beginPath(); ctx.arc(-r * 0.4 + g.dir[0] * 2, -2 + g.dir[1] * 2, r * 0.14, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.4 + g.dir[0] * 2, -2 + g.dir[1] * 2, r * 0.14, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    let respawn = 0;
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.strokeStyle = "rgba(108,123,255,0.10)";
      ctx.lineWidth = 1.5;
      for (let gy = 0; gy < rowsN; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          if ((gx + gy) % 3 === 0) {
            ctx.strokeRect(gx * GRID + 6, gy * GRID + 6, GRID - 12, GRID - 12);
          }
        }
      }

      ctx.fillStyle = "rgba(154,166,255,0.45)";
      for (let y = 0; y < rowsN; y++) {
        for (let x = 0; x < cols; x++) {
          if (dots[y][x]) {
            ctx.beginPath();
            ctx.arc(x * GRID, y * GRID, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (++respawn % 8 === 0) {
        const ry = Math.floor(Math.random() * rowsN);
        const rx = Math.floor(Math.random() * cols);
        dots[ry][rx] = true;
      }

      const scared = scaredRef?.current ?? false;
      ghosts.forEach((g) => {
        g.scared = scared;
        step(g);
        drawGhost(g);
      });
      step(pac);
      drawPac(pac);

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [reduced, scaredRef]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 opacity-[0.28] pointer-events-none"
    />
  );
}
