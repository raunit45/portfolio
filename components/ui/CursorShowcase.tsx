"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import React from "react";

type Shot = { id: number; x: number; y: number; idx: number; r: number };

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  images: { src: string; alt?: string }[];
  width?: number;
  showFollower?: boolean;
};

export default function CursorShowcase({
  title,
  subtitle,
  images,
  width = 220,
  showFollower = false,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 220, damping: 28, mass: 0.45 });
  const sy = useSpring(cy, { stiffness: 220, damping: 28, mass: 0.45 });

  const [active, setActive] = React.useState(false);
  const [shots, setShots] = React.useState<Shot[]>([]);
  const shotId = React.useRef(0);
  const lastBurst = React.useRef(0);

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = clamp(e.clientX - r.left, 0, r.width);
    const y = clamp(e.clientY - r.top, 0, r.height);
    cx.set(x);
    cy.set(y);

    const now = performance.now();
    if (now - lastBurst.current > 95) {
      lastBurst.current = now;

      setShots((prev) => {
        const id = ++shotId.current;
        const ox = (Math.random() - 0.5) * 80;
        const oy = (Math.random() - 0.5) * 80;
        const idx = Math.floor(Math.random() * images.length);
        // 🔹 slower rotation (20% less)
        const r = (Math.random() - 0.5) * 8; 
        return [...prev, { id, x: x + ox, y: y + oy, idx, r }].slice(-12);
      });

      setTimeout(() => setShots((prev) => prev.slice(1)), 900);
    }
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setShots([]);
      }}
      onMouseMove={onMove}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,120,255,0.10),transparent_55%)]" />

      {/* Headline */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="max-w-6xl text-center">
          <h1 className="text-white text-[2.8rem] md:text-[5rem] leading-[1.05] font-extrabold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-neutral-300/90 text-base md:text-lg max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-neutral-500">
            Hover this area ↗ to see the gallery
          </p>
        </div>
      </div>

      {/* Optional large follower (off by default) */}
      {active && showFollower && (
        <motion.div
          className="absolute z-20 will-change-transform pointer-events-none drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
          style={{
            x: sx,
            y: sy,
            translateX: `-${width / 2}px`,
            translateY: `-${width / 2}px`,
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/80 backdrop-blur">
            <Image
              src={images[0].src}
              alt={images[0].alt ?? "preview"}
              width={width}
              height={width}
              sizes="(max-width: 768px) 180px, 220px"
              className="object-cover aspect-square"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Hover bursts */}
      {shots.map((s) => (
        <motion.div
          key={s.id}
          className="absolute z-10 pointer-events-none"
          style={{ left: s.x, top: s.y, translateX: "-50%", translateY: "-50%" }}
          // 🔹 1.5x size & smoother
          initial={{ scale: 1.0, opacity: 0, rotate: s.r }}
          animate={{ scale: 1.5, opacity: 0.9, rotate: s.r }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -34, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900"
          >
            <Image
              src={images[s.idx].src}
              alt={images[s.idx].alt ?? "shot"}
              width={195} // 🔹 was 130, increased by ~1.5x
              height={142}
              sizes="195px"
              className="object-cover w-[195px] h-[142px]"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
