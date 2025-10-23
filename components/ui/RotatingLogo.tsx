"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const IMG_ROTATE_MS = 15000; // auto-change interval

// 👇 replace these with your actual image paths in /public (or remote URLs allowed by next.config)
const IMAGES = [
  "/me1.jpg",
  "/me2.jpg",
  "/me3.jpg",
  "/me4.jpg",
];

// map each image to a cursor style class (defined below in globals.css)
const CURSOR_CLASSES = ["cur-pointer", "cur-crosshair", "cur-grab", "cur-zoom"];

export default function RotatingLogo() {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // pre-load images for smooth transitions
  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const applyCursor = useCallback((i: number) => {
    const html = document.documentElement;
    // remove all our cursor classes
    CURSOR_CLASSES.forEach((c) => html.classList.remove(c));
    // add the one for current image
    html.classList.add(CURSOR_CLASSES[i % CURSOR_CLASSES.length]);
  }, []);

  const next = useCallback(() => {
    setIdx((prev) => {
      const n = (prev + 1) % IMAGES.length;
      applyCursor(n);
      return n;
    });
  }, [applyCursor]);

  // set initial cursor + start auto-rotate
  useEffect(() => {
    applyCursor(idx);
    intervalRef.current = setInterval(next, IMG_ROTATE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // optional: clean cursor class on unmount
      const html = document.documentElement;
      CURSOR_CLASSES.forEach((c) => html.classList.remove(c));
    };
  }, [applyCursor, next, idx]);

  // if you want a random start each reload
  const startIdx = useMemo(() => Math.floor(Math.random() * IMAGES.length), []);
  useEffect(() => {
    setIdx(startIdx);
  }, [startIdx]);

  return (
    <button
      onClick={next}
      aria-label="Change avatar & cursor"
      className={cn(
        "fixed left-4 top-4 z-50",
        // smooth hover feedback
        "transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]"
      )}
    >
      {/* container: rounded rect with soft shadow */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "w-10 h-10 md:w-12 md:h-12",
          "ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)]"
        )}
      >
        {/* image crossfade */}
        <Image
          key={IMAGES[idx]} // force fade per image
          src={IMAGES[idx]}
          alt="Logo avatar"
          fill
          sizes="48px"
          className={cn(
            "object-cover",
            "opacity-0 animate-[fadein_400ms_ease_forwards]" // defined in globals
          )}
          priority
        />
      </div>
    </button>
  );
}
