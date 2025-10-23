"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  /** drops per second */
  rate?: number;
  /** max simultaneous drops (for perf) */
  maxDrops?: number;
  /** how “splashy” the rings are */
  ringSpeed?: number; // px per second
  /** size of each splash */
  ringMaxRadius?: number; // px
  /** base opacity of rings */
  ringAlpha?: number; // 0..1
  /** set to true if you also want splashes on click/tap */
  interactive?: boolean;
};

type Ring = {
  x: number;
  y: number;
  r: number;      // current radius
  max: number;
  hue: number;    // 0..360
  alpha: number;  // fades out a little as it grows
  lw: number;     // line width
};

export default function WaterDrops({
  rate = 1.2,
  maxDrops = 90,
  ringSpeed = 220,
  ringMaxRadius = 160,
  ringAlpha = 0.35,
  interactive = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ringsRef = useRef<Ring[]>([]);
  const timeRef = useRef<number>(0);
  const spawnAccumulator = useRef<number>(0);

  const resize = () => {
    const c = canvasRef.current!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = "100%";
    c.style.height = "100%";
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = (x?: number, y?: number) => {
    const c = canvasRef.current!;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const xx = x ?? Math.random() * w;
    const yy = y ?? Math.random() * h * 0.8 + h * 0.1; // avoid extreme edges
    const hue = Math.floor(Math.random() * 360);       // 🎨 different color each drop
    const max = Math.random() * (ringMaxRadius * 0.6) + ringMaxRadius * 0.4;
    ringsRef.current.push({
      x: xx,
      y: yy,
      r: 0,
      max,
      hue,
      alpha: ringAlpha,
      lw: Math.random() * 1.5 + 1.2,
    });
    if (ringsRef.current.length > maxDrops) ringsRef.current.shift();
  };

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    resize();
    window.addEventListener("resize", resize);

    // optional: add splash where the user clicks/taps
    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      spawn(e.clientX, e.clientY);
      // also tell your grid ripple, if you still want it:
      window.dispatchEvent(new CustomEvent("trigger-ripple", { detail: { x: e.clientX, y: e.clientY }}));
    };
    window.addEventListener("click", onClick);

    // animation loop
    const loop = (t: number) => {
      const now = t / 1000;
      const dt = Math.min(0.033, now - (timeRef.current || now));
      timeRef.current = now;

      // spawn by rate (drops/sec)
      spawnAccumulator.current += dt * rate;
      while (spawnAccumulator.current >= 1) {
        spawn();
        spawnAccumulator.current -= 1;
      }

      // clear WITHOUT blur—just a subtle dark base
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      // no global blur applied; keep it crisp
      ctx.globalCompositeOperation = "source-over";

      // draw rings
      const rings = ringsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += ringSpeed * dt;
        const fade = 1 - rg.r / rg.max;
        const alpha = Math.max(0, rg.alpha * fade);

        ctx.beginPath();
        ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${rg.hue} 90% 65% / ${alpha})`;
        ctx.lineWidth = rg.lw;
        ctx.stroke();

        if (rg.r >= rg.max || alpha <= 0.02) rings.splice(i, 1);
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [interactive, rate, ringSpeed, ringMaxRadius, ringAlpha, maxDrops]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
}
