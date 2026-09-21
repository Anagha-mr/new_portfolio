"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type EntranceRef = { current: number };

/** Entrance duration in seconds. */
const DURATION = 0.9;

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// One eased 0→1 progress shared by the mass and the thread; consumers remap
// it into their own window to stagger. Starts resolved under reduced motion.
export function useEntrance(): EntranceRef {
  const reducedMotion = useReducedMotion();
  const progress = useRef(reducedMotion ? 1 : 0);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion || progress.current >= 1) return;
    elapsed.current += delta;
    const t = Math.min(elapsed.current / DURATION, 1);
    progress.current = 1 - (1 - t) ** 3;
  });

  return progress;
}
