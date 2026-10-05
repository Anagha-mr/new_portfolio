"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { notifyScroll } from "@/lib/scrollSync";

/** Keeps GSAP's ScrollTrigger (when a page has loaded it) in sync with Lenis. */
function ScrollTriggerSync() {
  useLenis(notifyScroll);
  return null;
}

/**
 * Global smooth scroll; absent when reduced motion is preferred. Rendered as a
 * sibling of the page rather than a wrapper, so the preference resolving after
 * hydration never remounts the page tree.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1 }}>
      <ScrollTriggerSync />
    </ReactLenis>
  );
}
