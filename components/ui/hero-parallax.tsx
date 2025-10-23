"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import { createPortal } from "react-dom";

/* -------------------- Data -------------------- */

type Project = { title: string; link: string; thumbnail: string };

const PROJECTS: Project[] = [
  { title: "Kleats — Campus Pre-Ordering", link: "https://kleats.in", thumbnail: "/gallery/kleats.png" },
  { title: "NewsNow — Next.js + TS + CI/CD", link: "https://github.com/raunit45/newsnow", thumbnail: "/gallery/newsnow.png" },
  { title: "GrocerGenius — Python + ML (Infosys)", link: "https://github.com/amalsalilan/GrocerGenius_AI_Based_Supermarket_Sales_Prediction_Infosys_Internship_Oct2024/tree/Raunit", thumbnail: "/gallery/supermarket.png" },
  { title: "AmazonClone — Full-stack build", link: "https://github.com/raunit45/AmazonClone", thumbnail: "/gallery/amazonclone.png" },
];

/* -------------------- Helpers -------------------- */

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

/** Hover intent with rAF + small delays to prevent jitter */
function useHoverIntent(delayIn = 70, delayOut = 120) {
  const openT = React.useRef<number | null>(null);
  const closeT = React.useRef<number | null>(null);
  const raf = React.useRef<number | null>(null);

  const clearAll = () => {
    if (openT.current) window.clearTimeout(openT.current);
    if (closeT.current) window.clearTimeout(closeT.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    openT.current = closeT.current = raf.current = null;
  };

  const scheduleOpen = (fn: () => void) => {
    clearAll();
    raf.current = requestAnimationFrame(() => {
      openT.current = window.setTimeout(fn, delayIn);
    });
  };
  const scheduleClose = (fn: () => void) => {
    clearAll();
    closeT.current = window.setTimeout(fn, delayOut);
  };

  React.useEffect(() => clearAll, []);
  return { scheduleOpen, scheduleClose, clearAll };
}

/* -------------------- Card (memoized) -------------------- */

type CardProps = {
  i: number;
  p: Project;
  onOpen: (i: number) => void;
  onMaybeClose: () => void;
};

const GridCard = React.memo(function GridCard({
  i,
  p,
  onOpen,
  onMaybeClose,
}: CardProps) {
  return (
    <motion.article
      layoutId={`card-${i}`}
      onMouseEnter={() => onOpen(i)}
      onFocus={() => onOpen(i)}
      onMouseLeave={onMaybeClose}
      onBlur={onMaybeClose}
      className="group relative cursor-pointer rounded-2xl border border-neutral-800/80 bg-neutral-900/30 overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.25)] transform-gpu will-change-transform"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.7 }}
    >
      {/* Only card container + media share layout to reduce work */}
      <motion.div layoutId={`media-${i}`} className="relative w-full aspect-[16/10]">
        <Image
          src={p.thumbnail}
          alt={p.title}
          fill
          sizes="(max-width:768px) 100vw, 560px"
          className="object-cover will-change-transform"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(0,0,0,0.22))]" />
      </motion.div>

      {/* Footer fades (no layout linking = cheaper) */}
      <motion.div
        className="flex items-center justify-between gap-3 px-4 py-4 bg-neutral-950/50"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <h3 className="text-sm md:text-base font-semibold text-neutral-100 line-clamp-2">
          {p.title}
        </h3>
        <span className="text-xs md:text-sm text-neutral-300">View ↗</span>
      </motion.div>
    </motion.article>
  );
});

/* -------------------- Main Component -------------------- */

export default function FeaturedProjects({
  products = PROJECTS,
}: {
  products?: Project[];
}) {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);
  const [popupHover, setPopupHover] = React.useState(false);
  const { scheduleOpen, scheduleClose, clearAll } = useHoverIntent(70, 120);

  const open = (i: number) => scheduleOpen(() => setActive(i));
  const maybeClose = () =>
    scheduleClose(() => {
      if (!popupHover) setActive(null);
    });
  const closeNow = () => {
    clearAll();
    setActive(null);
  };

  // Lock scroll while popup is open (reduces jank)
  React.useEffect(() => {
    if (active !== null) {
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [active]);

  return (
    <MotionConfig
      transition={
        prefersReduced
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 180, damping: 22, mass: 0.7 }
      }
    >
      <section className="relative w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-neutral-300">Featured</span>{" "}
              <span className="text-white">Projects</span>
            </h2>
          </div>

          <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {products.map((p, i) => (
              <GridCard
                key={p.title}
                i={i}
                p={p}
                onOpen={open}
                onMaybeClose={maybeClose}
              />
            ))}
          </div>

          {/* Popup via portal for zero clipping; cheap overlay, no blur */}
          <AnimatePresence>
            {active !== null && (
              <Portal>
                {/* Overlay */}
                <motion.button
                  key="overlay"
                  onClick={closeNow}
                  className="fixed inset-0 z-40 hidden md:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  style={{ background: "#000" }}
                  transition={{ duration: 0.18 }}
                  aria-label="Close preview"
                />

                {/* Popup */}
                <motion.div
                  key="popup"
                  layoutId={`card-${active}`}
                  className="fixed z-50 hidden md:block left-1/2 top-1/2 w-[min(88vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/95 shadow-2xl transform-gpu will-change-transform"
                  onMouseEnter={() => {
                    clearAll();
                    setPopupHover(true);
                  }}
                  onMouseLeave={() => {
                    setPopupHover(false);
                    closeNow();
                  }}
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
                  animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
                >
                  <Link href={products[active].link} target="_blank" className="block">
                    <motion.div layoutId={`media-${active}`} className="relative w-full aspect-[16/10]">
                      <Image
                        src={products[active].thumbnail}
                        alt={products[active].title}
                        fill
                        sizes="980px"
                        className="object-cover will-change-transform"
                        priority
                      />
                    </motion.div>

                    {/* Footer fades in, not layout-linked (cheaper) */}
                    <motion.div
                      className="flex items-center justify-between gap-3 px-5 py-4 bg-neutral-950/70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <h3 className="text-base font-semibold text-neutral-100">
                        {products[active].title}
                      </h3>
                      <span className="text-sm text-neutral-300">Open ↗</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </Portal>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  );
}
