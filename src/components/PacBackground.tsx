"use client";

import { useEffect, useRef } from "react";

type Pac = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mouth: number;
  mdir: number;
};

// Very lowkey ambient layer: a few Pac-Men drifting across the page, each one
// entirely made of the Krexa logo (the logo IS the Pac-Man). Brand centerpiece,
// so it runs regardless of reduced motion.
export default function PacBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const logo = new Image();
    let logoReady = false;
    logo.onload = () => {
      logoReady = true;
    };
    logo.src = "/krexa-logo.png";

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pacs: Pac[] = Array.from({ length: 3 }).map(() => {
      const dir = Math.random() < 0.5 ? -1 : 1;
      return {
        x: rand(0, W),
        y: rand(0, H),
        vx: dir * rand(0.2, 0.45),
        vy: rand(-0.12, 0.12),
        r: rand(30, 58),
        mouth: rand(0.06, 0.3),
        mdir: 1,
      };
    });

    const drawPac = (p: Pac) => {
      if (!logoReady) return;
      const angle = Math.atan2(p.vy, p.vx);
      const m = p.mouth * Math.PI;

      ctx.save();
      ctx.translate(p.x, p.y);

      // soft brand-cyan halo so the silhouette reads on the dark page
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, p.r, m, Math.PI * 2 - m);
      ctx.closePath();
      ctx.rotate(-angle); // path is already captured; draw the logo upright
      ctx.shadowColor = "rgba(37,205,255,0.8)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(37,205,255,0.10)";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.clip();
      // the whole Pac-Man is the logo
      ctx.drawImage(logo, -p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();

      // faint cyan rim on the wedge
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, p.r, m, Math.PI * 2 - m);
      ctx.closePath();
      ctx.strokeStyle = "rgba(37,205,255,0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pacs) {
        p.x += p.vx;
        p.y += p.vy;
        const pad = p.r + 24;
        if (p.x < -pad) p.x = W + pad;
        if (p.x > W + pad) p.x = -pad;
        if (p.y < -pad) p.y = H + pad;
        if (p.y > H + pad) p.y = -pad;
        p.mouth += 0.035 * p.mdir;
        if (p.mouth > 0.3 || p.mouth < 0.04) p.mdir *= -1;
        drawPac(p);
      }
      frame = requestAnimationFrame(tick);
    };
    tick();

    const onVis = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.32 }}
    />
  );
}
