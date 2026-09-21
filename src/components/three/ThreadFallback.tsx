"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

/** 2D thread shown only when the 3D filament isn't (mirrors `WebGLCanvas`'s check). */
export function ThreadFallback() {
  const reducedMotion = useReducedMotion();
  const supported = useWebGLSupport();

  if (!reducedMotion && supported) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M -40 620 C 260 520, 420 760, 700 560 S 1180 260, 1500 340"
        stroke="#C1121F"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
