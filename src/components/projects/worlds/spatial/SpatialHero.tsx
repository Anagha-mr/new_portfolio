"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { DetailedProject } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMeta } from "@/components/projects/page/ProjectMeta";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { gsap } from "@/lib/gsap";
import { RoomFallback } from "./RoomFallback";

const RoomScene = dynamic(() => import("@/three/scenes/RoomScene"), { ssr: false });

type SpatialHeroProps = { project: DetailedProject; position: { index: number; total: number } };

export function SpatialHero({ project, position }: SpatialHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();
  const showScene = webglSupported && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from("[data-hero-copy]", { opacity: 0, y: 28, duration: 1.6, stagger: 0.18 });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <header ref={rootRef} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {showScene ? (
          <div className="fade-in absolute inset-0">
            <RoomScene paused={!inView} />
          </div>
        ) : (
          <RoomFallback className="absolute inset-0 h-full w-full opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />
      </div>

      <Container className="relative flex w-full flex-1 flex-col justify-between pb-14 pt-32 md:pb-20 md:pt-40">
        <div data-hero-copy className="flex items-start justify-between">
          <Button href="/work" variant="ghost">
            ← Work
          </Button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            {String(position.index + 1).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
          </p>
        </div>

        <div>
          <h1
            data-hero-copy
            className="font-display text-[26vw] leading-[0.82] sm:text-[20vw] md:text-[15vw]"
          >
            {project.title}
          </h1>
          <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-12">
            <p data-hero-copy className="max-w-md text-lg text-silver md:col-span-5">
              {project.description}
            </p>
            <div data-hero-copy className="md:col-span-6 md:col-start-7">
              <ProjectMeta project={project} className="md:justify-end" />
            </div>
          </div>
          <p
            data-hero-copy
            className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone/70"
          >
            Schematic · structure → generated result
          </p>
        </div>
      </Container>
    </header>
  );
}
