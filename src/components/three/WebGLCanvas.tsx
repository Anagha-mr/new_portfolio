"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

export type WebGLCanvasProps = {
  children: ReactNode;
  className?: string;
  /**
   * Keep rendering under reduced motion. For scenes that render a still
   * composition themselves when motion is reduced.
   */
  stillUnderReducedMotion?: boolean;
};

/**
 * Bridge between React UI and the Three.js layer. Renders nothing when WebGL
 * is unavailable or motion is reduced, letting the CSS fallback show through.
 * Callers own their `next/dynamic` import so none is created during render.
 */
export function WebGLCanvas({ children, className, stillUnderReducedMotion = false }: WebGLCanvasProps) {
  const reducedMotion = useReducedMotion();
  const supported = useWebGLSupport();

  if (!supported || (reducedMotion && !stillUnderReducedMotion)) return null;

  return (
    <div className={className} aria-hidden="true">
      {children}
    </div>
  );
}
