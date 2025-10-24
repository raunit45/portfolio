"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Transition,
} from "framer-motion";

/* ---------- DATA ---------- */
const COLLAGE = [
  "/gallery/kleats.png",
  "/gallery/newsnow.png",
  "/gallery/supermarket.png",
  "/gallery/amazonclone.png",
  "/gallery/newsnow.png",
  "/gallery/supermarket.png",
  "/gallery/amazonclone.png",
];

/* ---------- POSITIONS (percent) ---------- */
const LAYOUT = [
  { x: 10, y: 14, w: 26, r: 2 },
  { x: 32, y: 0,  w: 24, r: -3 },
  { x: 58, y: 6,  w: 28, r: 4 },
  { x: 70, y: 26, w: 30, r: -2 },
  { x: 18, y: 36, w: 34, r: -1 },
  { x: 46, y: 38, w: 26, r: 3 },
  { x: 4,  y: 58, w: 28, r: -4 },
];

/* ---------- FLOAT ---------- */
const floatKeyframes = (i: number) => ({
  y: [0, i % 2 ? -6 : -10, 0, i % 2 ? 6 : 10, 0],
  transition: { duration: 7 + (i % 5), repeat: Infinity, ease: "easeInOut" as const },
});

const HOVER_SPRING: Transition = { type: "spring", stiffness: 5000000000, damping: 250000, mass: 50 };

export default function HeroCollageMarvin() {
  const prefersReduced = useReducedMotion();

  // cursor -> spring
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 10000, damping: 2500, mass: 2 });
  const sy = useSpring(my, { stiffness: 10000, damping: 2500, mass: 2 });

  // sequential mount (0.3s)
  const [visibleCount, setVisibleCount] = React.useState(0);
  React.useEffect(() => {
    if (visibleCount >= LAYOUT.length) return;
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 300);
    return () => clearTimeout(t);
  }, [visibleCount]);

  const onMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x);
    my.set(y);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div
      className="relative w-full min-h-[70vh] md:min-h-[90vh] overflow-visible"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      /* expose MotionValues as CSS vars (safe; not a hook in the loop) */
      style={
        {
          "--mx": sx,
          "--my": sy,
        } as React.CSSProperties
      }
    >
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-[radial-gradient(70%_60%_at_50%_40%,rgba(120,119,198,.18),transparent_60%)]" />

      {/* COLLAGE */}
      <div className="absolute inset-0">
        {COLLAGE.slice(0, visibleCount).map((src, i) => {
          const conf = LAYOUT[i % LAYOUT.length];
          const depth = 6 + (i % 6); // 6..11
          const dx = depth * 10;     // pixels per unit mx/my

          const initial = prefersReduced
            ? { opacity: 1, y: 0, scale: 1, rotate: conf.r }
            : { opacity: 0, y: 40, scale: 0.92, rotate: conf.r - 4 };

          const animate = prefersReduced
            ? { opacity: 1, y: 0, scale: 1, rotate: conf.r }
            : {
                opacity: 1, y: 0, scale: 1, rotate: conf.r,
                transition: { duration: 0.8, type: "spring" as const, stiffness: 100, damping: 18 },
              };

          return (
            <motion.div
              key={i}
              className="absolute will-change-transform"
              style={{
                left: `${conf.x}%`,
                top: `${conf.y}%`,
                width: `${conf.w}%`,
                rotate: conf.r,
                zIndex: 10 + i,
                // Parallax via CSS vars; no hooks here:
                transform: `translate3d(calc(var(--mx) * ${dx}px), calc(var(--my) * ${dx}px), 0)`,
              }}
              {...floatKeyframes(i)}
              initial={initial}
              animate={animate}
              whileHover={{ scale: 1.04, rotate: conf.r * 0.8 }}
              transition={HOVER_SPRING}
            >
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <Image
                  src={src}
                  alt={`collage-${i}`}
                  fill
                  sizes="(max-width:768px) 100vw, 40vw"
                  className="object-cover select-none"
                  priority={i < 3}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TEXT */}
      <div className="relative z-[60] flex items-center justify-center text-center h-full px-6">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
            <span className="text-white/90">Intelligent by </span>
            <span className="text-white">Design</span>
            <span className="text-white/90">, engineered for interaction.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/70">
            I build immersive interfaces that feel alive — blending data, motion, and precision engineering.
          </p>
          <p className="mt-3 text-xs tracking-widest text-white/50 uppercase">
            Images render one by one every 0.3s
          </p>
        </div>
      </div>
    </div>
  );
}
