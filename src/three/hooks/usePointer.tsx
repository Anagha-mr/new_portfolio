"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector2 } from "three";

const PointerContext = createContext<{ current: Vector2 } | null>(null);

export type PointerProviderProps = {
  children: ReactNode;
  /** Disabled under prefers-reduced-motion or on low-tier devices — the
   * damped vector simply stays at rest so consumers read zero offset. */
  enabled?: boolean;
};

/**
 * Tracks normalized pointer position across the whole window (the canvas
 * itself is `pointer-events: none` so it never intercepts clicks/text
 * selection) and damps it toward a smoothed value once per frame. Exposed
 * as a ref via context — not React state — so pointer movement never
 * triggers a re-render; consumers read `.current` inside their own
 * `useFrame`.
 */
export function PointerProvider({ children, enabled = true }: PointerProviderProps) {
  const target = useRef(new Vector2(0, 0));
  const damped = useRef(new Vector2(0, 0));

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      target.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [enabled]);

  useFrame(() => {
    if (!enabled) return;
    damped.current.lerp(target.current, 0.04);
  });

  return <PointerContext.Provider value={damped}>{children}</PointerContext.Provider>;
}

/** Returns the damped pointer position (-1..1 on each axis) as a live ref. */
export function usePointer(): { current: Vector2 } {
  const ctx = useContext(PointerContext);
  if (!ctx) throw new Error("usePointer must be used within a PointerProvider");
  return ctx;
}
