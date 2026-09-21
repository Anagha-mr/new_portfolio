"use client";

import { useEffect, useRef } from "react";
import type { DetailedProject } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMeta } from "@/components/projects/page/ProjectMeta";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { GestureStage } from "./GestureStage";

type GestureHeroProps = { project: DetailedProject; position: { index: number; total: number } };

export function GestureHero({ project, position }: GestureHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { data } = project.detail.system;
  const latency = data.kind === "gesture" ? data.latency : "";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-copy]", { opacity: 0, y: 18, duration: 0.35, stagger: 0.05, ease: "expo.out" });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <header ref={rootRef} className="relative overflow-hidden bg-void pt-32 md:pt-40">
      <Container className="pb-16 md:pb-24">
        <div data-hero-copy className="flex items-start justify-between">
          <Button href="/work" variant="ghost">
            ← Work
          </Button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            {String(position.index + 1).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
          </p>
        </div>

        <h1 data-hero-copy className="mt-12 font-display text-[17vw] leading-[0.85] md:mt-16 md:text-[9.5vw]">
          {project.title}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-12">
          <p data-hero-copy className="max-w-md text-lg text-silver md:col-span-5">
            {project.description}
          </p>
          <div data-hero-copy className="md:col-span-6 md:col-start-7">
            <ProjectMeta project={project} />
          </div>
        </div>

        <div data-hero-copy className="mt-14 md:mt-16">
          <div className="mb-6 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone/70">
            <span>Illustrative landmark model</span>
            <span className="pointer-coarse:hidden">Move the pointer · press to pinch</span>
          </div>
          <GestureStage latency={latency} />
        </div>
      </Container>
    </header>
  );
}
