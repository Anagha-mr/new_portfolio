"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ProjectVisual } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION } from "./motion";

type RevealGroupProps = {
  visual: ProjectVisual;
  children: ReactNode;
  className?: string;
};

/** Reveals `[data-reveal]` descendants as they enter the viewport, using the project's motion preset. */
export function RevealGroup({ visual, children, className }: RevealGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const preset = MOTION[visual];
    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, {
        opacity: 0,
        x: preset.x,
        y: preset.y,
        scale: preset.scale,
      });

      ScrollTrigger.batch(targets, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: preset.duration,
            ease: preset.ease,
            stagger: preset.stagger,
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [visual, reducedMotion]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
