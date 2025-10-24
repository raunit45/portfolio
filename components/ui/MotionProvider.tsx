"use client";

import React from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  const defaultTransition = prefersReduced
    ? ({ duration: 0.2 } as any)
    : ({ type: "spring", stiffness: 120, damping: 18, mass: 0.6 } as any);

  // cast to any above to avoid consuming internal framer-motion types directly
  return <MotionConfig transition={defaultTransition as any}>{children}</MotionConfig>;
}
