"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

export type WebGLCanvasProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The only bridge between React UI and the Three.js layer. Renders nothing
 * (letting the CSS fallback show through) when WebGL is unavailable or the
 * user prefers reduced motion — the 3D layer is enhancement, never load-bearing.
 *
 * Callers own their own `next/dynamic` import (see `HeroCanvas`) so this
 * component never constructs one during render.
 */
export function WebGLCanvas({ children, className }: WebGLCanvasProps) {
  const reducedMotion = useReducedMotion();
  const supported = useWebGLSupport();

  if (reducedMotion || !supported) return null;

  return (
    <div className={className} aria-hidden="true">
      {children}
    </div>
  );
}
