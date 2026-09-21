"use client";

import { useEffect, useRef } from "react";
import type { DetailedProject } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMeta } from "@/components/projects/page/ProjectMeta";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";

const FRAMES = 8;
const POLL_MS = 1400;
const pad = (n: number) => String(n).padStart(2, "0");

const CORNERS = [
  "left-1.5 top-1.5 border-l border-t",
  "right-1.5 top-1.5 border-r border-t",
  "bottom-1.5 left-1.5 border-b border-l",
  "bottom-1.5 right-1.5 border-b border-r",
];

type MonitoringHeroProps = { project: DetailedProject; position: { index: number; total: number } };

export function MonitoringHero({ project, position }: MonitoringHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(gridRef);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "steps(4)" } })
        .from("[data-hero-copy]", { opacity: 0, duration: 0.5, stagger: 0.1 })
        .from("[data-frame]", { opacity: 0, duration: 0.4, stagger: { each: 0.07, from: "start" } }, 0.2);
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Polling focus hops from frame to frame in fixed steps.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const frames = Array.from(grid.querySelectorAll<HTMLElement>("[data-frame]"));

    const focus = (index: number) => {
      frames.forEach((frame, i) => {
        frame.dataset.active = String(i === index);
      });
      if (readoutRef.current) readoutRef.current.textContent = `${pad(index + 1)} / ${pad(FRAMES)}`;
    };

    focus(0);
    if (reducedMotion || !inView) return;

    let current = 0;
    const timer = window.setInterval(() => {
      current = (current + 1) % FRAMES;
      focus(current);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, inView]);

  return (
    <header ref={rootRef} className="relative overflow-hidden bg-void pt-32 md:pt-40">
      <Container className="pb-16 md:pb-24">
        <div data-hero-copy className="flex items-start justify-between">
          <Button href="/work" variant="ghost">
            ← Work
          </Button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            {pad(position.index + 1)} / {pad(position.total)}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h1 data-hero-copy className="font-display text-[26vw] leading-[0.85] md:text-[12vw]">
              {project.title}
            </h1>
            <p data-hero-copy className="mt-8 max-w-sm text-lg text-silver">
              {project.description}
            </p>
            <div data-hero-copy className="mt-8">
              <ProjectMeta project={project} className="flex-col !gap-y-2" />
            </div>
          </div>

          <div className="md:col-span-7">
            <div ref={gridRef} aria-hidden="true" className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
              {Array.from({ length: FRAMES }, (_, i) => (
                <div
                  key={i}
                  data-frame
                  data-active="false"
                  className="group relative aspect-[16/10] overflow-hidden sm:aspect-[4/3] border border-stone/30 bg-charcoal/50 transition-colors duration-200 data-[active=true]:border-ivory/70 data-[active=true]:bg-charcoal"
                >
                  <span
                    className="frame-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-ivory/[0.06]"
                    style={{ animationDelay: `${-i * 0.9}s` }}
                  />
                  {CORNERS.map((corner) => (
                    <span
                      key={corner}
                      className={`absolute size-2.5 border-stone/60 transition-colors duration-200 group-data-[active=true]:border-ivory ${corner}`}
                    />
                  ))}
                  <span className="absolute left-3.5 top-3 font-mono text-[0.65rem] tracking-[0.15em] text-stone group-data-[active=true]:text-ivory">
                    {pad(i + 1)}
                  </span>
                  <span className="absolute bottom-3 left-3.5 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-stone/70 group-data-[active=true]:text-silver">
                    <span className="size-1 rounded-full bg-stone/50 group-data-[active=true]:bg-cherry" />
                    <span className="group-data-[active=true]:hidden">Standby</span>
                    <span className="hidden group-data-[active=true]:inline">Polled</span>
                  </span>
                </div>
              ))}
            </div>
            <div
              data-hero-copy
              className="mt-4 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone/70"
            >
              <span>Schematic · no footage</span>
              <span>
                Channel <span ref={readoutRef}>01 / 08</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
