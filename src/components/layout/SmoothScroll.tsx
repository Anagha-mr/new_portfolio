"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollTrigger } from "@/lib/gsap";

/** Keeps GSAP's ScrollTrigger in sync with Lenis's virtual scroll position. */
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/** Global smooth-scroll setup — a no-op wrapper when reduced motion is preferred. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1 }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
