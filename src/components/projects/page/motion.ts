import type { ProjectVisual } from "@/data/projects";

export type MotionPreset = {
  x: number;
  y: number;
  scale: number;
  duration: number;
  stagger: number;
  ease: string;
};

/** Reveal behaviour per project world. */
export const MOTION: Record<ProjectVisual, MotionPreset> = {
  workflow: { x: 0, y: 14, scale: 1, duration: 0.7, stagger: 0.08, ease: "power2.inOut" },
  spatial: { x: 0, y: 28, scale: 0.985, duration: 1.4, stagger: 0.16, ease: "power2.out" },
  timeline: { x: -18, y: 0, scale: 1, duration: 0.8, stagger: 0.14, ease: "power3.out" },
  monitoring: { x: 0, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: "steps(4)" },
  gesture: { x: 0, y: 18, scale: 1, duration: 0.35, stagger: 0.04, ease: "expo.out" },
};
