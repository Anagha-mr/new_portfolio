"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Global smooth-scroll setup — a no-op wrapper when reduced motion is preferred. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1 }}>
      {children}
    </ReactLenis>
  );
}
