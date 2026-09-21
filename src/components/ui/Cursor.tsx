"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Decorative cherry dot; skipped on coarse pointers and under reduced motion. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const position = { x: 0, y: 0 };

    const handleMove = (event: PointerEvent) => {
      position.x = event.clientX;
      position.y = event.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const dot = dotRef.current;
        if (dot) dot.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      });
    };

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cherry mix-blend-difference"
    />
  );
}
