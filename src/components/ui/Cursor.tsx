"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE =
  "a[href], button:not(:disabled), [role='button'], input, select, textarea, label[for], summary";

/**
 * Small dot that follows the native cursor (which stays visible) and opens into
 * a small cherry ring over links and buttons. Mouse only; skipped on coarse
 * pointers and under reduced motion. Position and state are written to the DOM
 * directly, so moving never re-renders React.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;

    let frame = 0;
    const position = { x: 0, y: 0 };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      position.x = event.clientX;
      position.y = event.clientY;
      root.dataset.visible = "true";
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      });
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      root.dataset.active = String(Boolean(target?.closest?.(INTERACTIVE)));
    };

    const handleOut = (event: PointerEvent) => {
      if (!event.relatedTarget) root.dataset.visible = "false";
    };

    const handleDown = () => {
      root.dataset.pressed = "true";
    };
    const handleUp = () => {
      root.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerout", handleOut, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-visible="false"
      data-active="false"
      data-pressed="false"
      className="group pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-[var(--duration-fast)] data-[visible=true]:opacity-100 data-[active=false]:mix-blend-difference"
    >
      <span className="absolute size-5 -translate-x-1/2 -translate-y-1/2 scale-[0.3] rounded-full border border-ivory bg-ivory transition-[scale,background-color,border-color] duration-[var(--duration-fast)] ease-editorial group-data-[active=true]:scale-100 group-data-[active=true]:border-cherry group-data-[active=true]:bg-transparent group-data-[active=true]:group-data-[pressed=true]:scale-75" />
    </div>
  );
}
