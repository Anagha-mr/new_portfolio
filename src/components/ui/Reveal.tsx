"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Fades content in once as it scrolls into view. Content is visible by default;
 * it is only hidden after mount, and only when it starts below the fold.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.fade = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.fade = "done";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      delete el.dataset.fade;
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
