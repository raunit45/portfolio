"use client";

import { useEffect, useRef } from "react";

/** Tweakables (safe defaults) */
const POOL_SIZE = 280;          // total pooled spans
const MAX_PARTICLES_PER_SEC = 420; // global cap
const BASE_EMIT = 6;            // min particles per frame
const SPEED_GAIN = 0.12;        // how much speed adds density
const CLICK_BURST = 40;         // on pointerdown
const ANIM_MS = 650;            // css keyframe duration

export function CursorSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLSpanElement[]>([]);
  const idxRef = useRef(0);

  // pointer state
  const px = useRef(0);
  const py = useRef(0);
  const vx = useRef(0);
  const vy = useRef(0);
  const lastT = useRef(0);
  const acc = useRef(0); // fractional emission accumulator
  const running = useRef(false);

  const restart = (el: HTMLElement) => {
    el.style.animation = "none";
    // force reflow without layout thrash elsewhere
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.offsetTop;
    el.style.animation = `sparkle-pop ${ANIM_MS}ms cubic-bezier(.19,1,.22,1) forwards`;
  };

  const emit = (x: number, y: number, count: number) => {
    const pool = poolRef.current;
    if (!pool.length || count <= 0) return;

    for (let k = 0; k < count; k++) {
      const s = pool[idxRef.current++ % pool.length];
      s.style.display = "";

      const angle = Math.random() * Math.PI * 2;
      const radius = 36 + Math.random() * 58;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      const hue = Math.floor(210 + Math.random() * 120); // blue→pink
      const size = 1.8 + Math.random() * 3.6;
      const rot = (Math.random() * 540 - 270).toFixed(0);

      s.style.setProperty("--x", String(x));
      s.style.setProperty("--y", String(y));
      s.style.setProperty("--tx", tx.toFixed(1));
      s.style.setProperty("--ty", ty.toFixed(1));
      s.style.setProperty("--hue", String(hue));
      s.style.setProperty("--size", size.toFixed(1));
      s.style.setProperty("--rot", rot);

      restart(s);
    }
  };

  useEffect(() => {
    const root = containerRef.current!;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || mql.matches) return;

    // build pool once
    const pool: HTMLSpanElement[] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.display = "none";
      root.appendChild(s);
      pool.push(s);
    }
    poolRef.current = pool;

    // pointer listeners (just update state)
    const onMove = (e: PointerEvent) => {
      const t = performance.now();
      if (!lastT.current) lastT.current = t;

      const dt = Math.max(0.0001, (t - lastT.current) / 1000); // sec
      const dx = e.clientX - px.current;
      const dy = e.clientY - py.current;
      vx.current = dx / dt;
      vy.current = dy / dt;

      px.current = e.clientX;
      py.current = e.clientY;
      lastT.current = t;

      if (!running.current) {
        running.current = true;
        rafLoop();
      }
    };

    const onDown = (e: PointerEvent) => {
      px.current = e.clientX;
      py.current = e.clientY;
      emit(px.current, py.current, CLICK_BURST);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    // rAF loop: adaptive emission + global cap
    let lastFrame = performance.now();
    function rafLoop() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000); // clamp 50ms
      lastFrame = now;

      // speed in px/s (smoothed by dt)
      const speed = Math.hypot(vx.current, vy.current);

      // desired particles this frame (fractional)
      const targetPerSec = Math.min(
        MAX_PARTICLES_PER_SEC,
        BASE_EMIT * 60 + speed * SPEED_GAIN
      );
      const desired = targetPerSec * dt;

      acc.current += desired;
      const count = acc.current | 0; // floor
      acc.current -= count;

      if (count > 0) emit(px.current, py.current, count);

      // stop loop if idle (no movement & no carryover)
      if (speed < 5 && acc.current < 0.01) {
        running.current = false;
        return;
      }
      requestAnimationFrame(rafLoop);
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      pool.forEach((n) => n.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[60] sparkles"
      aria-hidden
    />
  );
}

export default CursorSparkles;
