"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/** ---------- Example data (your 3 projects) ---------- */
export const PROJECTS: { title: string; link: string; thumbnail: string }[] = [
  {
    title: "Kleats — Campus Pre-Ordering",
    link: "https://kleats.in",
    // Live screenshot via Microlink
    thumbnail:
      "https://api.microlink.io?url=https%3A%2F%2Fkleats.in&screenshot=true&meta=false&embed=screenshot.url&overlay.browser=light",
  },
  {
    title: "NewsNow — Next.js + TS + CI/CD",
    link: "https://github.com/raunit45/newsnow",
    thumbnail:
      "https://api.microlink.io?url=https%3A%2F%2Fgithub.com%2Fraunit45%2Fnewsnow&screenshot=true&meta=false&embed=screenshot.url&overlay.browser=light",
  },
  {
    title: "GrocerGenius — Python + ML (Infosys)",
    link: "https://github.com/amalsalilan/GrocerGenius_AI_Based_Supermarket_Sales_Prediction_Infosys_Internship_Oct2024/tree/Raunit",
    thumbnail:
      "https://api.microlink.io?url=https%3A%2F%2Fgithub.com%2Famalsalilan%2FGrocerGenius_AI_Based_Supermarket_Sales_Prediction_Infosys_Internship_Oct2024%2Ftree%2FRaunit&screenshot=true&meta=false&embed=screenshot.url&overlay.browser=light",
  },
];

/** ---------- Parallax Hero ---------- */
export function HeroParallax({
  products = PROJECTS,
}: {
  products?: { title: string; link: string; thumbnail: string }[];
}) {
  // Repeat to fill three rows gracefully
  const pad = (arr: typeof products) => {
    const out: typeof products = [];
    for (let i = 0; i < 5; i++) out.push(arr[i % arr.length]);
    return out;
  };
  const firstRow = pad(products);
  const secondRow = pad([...products].reverse());
  const thirdRow = pad(products);

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const springCfg = { stiffness: 220, damping: 28, mass: 0.6 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 900]), springCfg);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -900]), springCfg);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [12, 0]), springCfg);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [16, 0]), springCfg);
  const opacity  = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springCfg);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, 300]), springCfg);

  return (
    <section
      ref={ref}
      className="h-[260vh] md:h-[300vh] py-28 md:py-40 overflow-hidden relative flex flex-col bg-neutral-950 text-white
                 [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />

      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        {/* Row 1 */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-12 mb-12 md:mb-20">
          {firstRow.map((p, i) => (
            <ProductCard key={`${p.title}-r1-${i}`} product={p} translate={translateX} />
          ))}
        </motion.div>

        {/* Row 2 */}
        <motion.div className="flex flex-row space-x-6 md:space-x-12 mb-12 md:mb-20">
          {secondRow.map((p, i) => (
            <ProductCard key={`${p.title}-r2-${i}`} product={p} translate={translateXReverse} />
          ))}
        </motion.div>

        {/* Row 3 */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-12">
          {thirdRow.map((p, i) => (
            <ProductCard key={`${p.title}-r3-${i}`} product={p} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/** ---------- Header ---------- */
function Header() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
      <h1 className="text-3xl md:text-7xl font-extrabold tracking-tight">
        Projects 
      </h1>
      <p className="max-w-2xl text-sm md:text-xl mt-4 md:mt-6 text-neutral-300">
        A mix of full-stack builds, data/ML work, and production infra. Scroll to explore.
      </p>
    </div>
  );
}

/** ---------- Product Card ---------- */
function ProductCard({
  product,
  translate,
}: {
  product: { title: string; link: string; thumbnail: string };
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -16, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative shrink-0 h-64 w-[18rem] md:h-96 md:w-[28rem] rounded-xl overflow-hidden"
    >
      <Link href={product.link} target="_blank" className="block h-full w-full">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 288px, 448px"
          className="object-cover object-left-top"
          priority={false}
        />
      </Link>

      {/* Darken on hover */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors" />

      {/* Title on hover */}
      <h2 className="absolute bottom-3 left-3 right-3 text-sm md:text-base font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity">
        {product.title}
      </h2>
    </motion.div>
  );
}
