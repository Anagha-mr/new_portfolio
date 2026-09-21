"use client";

import { useEffect, useRef } from "react";
import type { DetailedProject } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMeta } from "@/components/projects/page/ProjectMeta";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";

const STONE = "#817b73";
const IVORY = "#f1ede5";

/** Abstract article slips: x in a 1200-wide timeline, heights of the slips stacked at that x. */
const COLUMNS: { x: number; stack: number[] }[] = [
  { x: 80, stack: [70] },
  { x: 150, stack: [96, 58] },
  { x: 250, stack: [64] },
  { x: 340, stack: [84] },
  { x: 470, stack: [110, 50] },
  { x: 560, stack: [70] },
  { x: 650, stack: [92] },
  { x: 850, stack: [76] },
  { x: 930, stack: [110, 62] },
  { x: 1010, stack: [88] },
  { x: 1090, stack: [64] },
];

const PERIODS = ["Early", "Middle", "Late"];
const SLIP_W = 48;
const BASE = 280;
const AXIS = 300;
const GAP = 8;

function SlipLines({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = Math.max(1, Math.floor((h - 18) / 9));
  return (
    <>
      <rect x={x + 6} y={y + 6} width={18} height={3} fill={IVORY} fillOpacity={0.5} />
      {Array.from({ length: rows }, (_, i) => (
        <rect
          key={i}
          x={x + 6}
          y={y + 16 + i * 9}
          width={Math.max(10, w - 12 - (i % 3 === 2 ? 14 : 0))}
          height={2}
          fill={IVORY}
          fillOpacity={0.2}
        />
      ))}
    </>
  );
}

function HorizontalTimeline() {
  return (
    <svg
      viewBox="0 0 1200 330"
      className="hidden h-auto w-full md:block"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <rect data-band x={0} y={0} width={400} height={AXIS} fill={IVORY} fillOpacity={0.045} />
      {[400, 800].map((x) => (
        <line key={x} x1={x} x2={x} y1={0} y2={AXIS + 16} stroke={STONE} strokeOpacity={0.3} strokeDasharray="2 5" />
      ))}
      <line
        data-axis
        x1={0}
        x2={1200}
        y1={AXIS}
        y2={AXIS}
        stroke={IVORY}
        strokeOpacity={0.7}
        vectorEffect="non-scaling-stroke"
        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
      />
      {COLUMNS.map((column) => {
        let bottom = BASE;
        return (
          <g key={column.x} data-slip data-at={column.x / 1200}>
            <line x1={column.x} x2={column.x} y1={BASE} y2={AXIS} stroke={STONE} strokeOpacity={0.6} />
            <circle cx={column.x} cy={AXIS} r={2.5} fill={IVORY} />
            {column.stack.map((h, i) => {
              const y = bottom - h;
              bottom = y - GAP;
              const x = column.x - SLIP_W / 2 + i * 6;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={SLIP_W} height={h} fill="#181715" stroke={STONE} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
                  <SlipLines x={x} y={y} w={SLIP_W} h={h} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function VerticalTimeline() {
  const height = 640;
  const axisX = 34;
  const y = (x: number) => 24 + (x / 1200) * (height - 48);

  return (
    <svg
      viewBox={`0 0 342 ${height}`}
      className="h-auto w-full md:hidden"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <rect data-band x={0} y={0} width={342} height={height / 3} fill={IVORY} fillOpacity={0.045} />
      <line
        data-axis
        x1={axisX}
        x2={axisX}
        y1={0}
        y2={height}
        stroke={IVORY}
        strokeOpacity={0.7}
        vectorEffect="non-scaling-stroke"
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
      />
      {PERIODS.map((label, i) => (
        <text
          key={label}
          data-period
          data-at={i / 3}
          x={axisX + 16}
          y={(height / 3) * i + 18}
          fill={STONE}
          fontSize={10}
          letterSpacing={2}
          className="font-mono uppercase"
        >
          {label}
        </text>
      ))}
      {COLUMNS.map((column) => {
        const cy = y(column.x);
        let start = axisX + 30;
        return (
          <g key={column.x} data-slip data-at={column.x / 1200}>
            <line x1={axisX} x2={axisX + 24} y1={cy} y2={cy} stroke={STONE} strokeOpacity={0.6} />
            <circle cx={axisX} cy={cy} r={2.5} fill={IVORY} />
            {column.stack.map((len, i) => {
              const w = Math.round(len * 1.05);
              const x = start;
              start += w + GAP;
              return (
                <g key={i}>
                  <rect x={x} y={cy - 16} width={w} height={32} fill="#181715" stroke={STONE} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
                  <SlipLines x={x} y={cy - 16} w={w} h={32} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

type TimelineHeroProps = { project: DetailedProject; position: { index: number; total: number } };

export function TimelineHero({ project, position }: TimelineHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      const reach = (at: number) => 0.4 + at * 1.5;

      gsap.from("[data-hero-copy]", { opacity: 0, x: -18, duration: 0.8, stagger: 0.12, ease: "power3.out" });
      gsap.from("[data-axis]", { scaleX: 0, scaleY: 0, duration: 1.6, delay: 0.4, ease: "power1.inOut" });
      gsap.utils.toArray<SVGElement>("[data-slip]").forEach((slip) => {
        const at = Number(slip.dataset.at);
        gsap.from(slip, { opacity: 0, y: 12, duration: 0.7, delay: reach(at), ease: "power3.out" });
      });
      gsap.utils.toArray<HTMLElement>("[data-period]").forEach((label) => {
        gsap.from(label, { opacity: 0, x: -10, duration: 0.6, delay: reach(Number(label.dataset.at)), ease: "power3.out" });
      });

      const bands = gsap.utils.toArray<SVGElement>("[data-band]");
      const desktop = { x: 400 };
      const mobile = { y: 640 / 3 };
      gsap
        .timeline({ repeat: -1, delay: 3.4, defaults: { duration: 0.9, ease: "power2.inOut" } })
        .to(bands[0], { x: desktop.x }, "+=1.6")
        .to(bands[1], { y: mobile.y }, "<")
        .to(bands[0], { x: desktop.x * 2 }, "+=1.6")
        .to(bands[1], { y: mobile.y * 2 }, "<")
        .to(bands[0], { x: 0 }, "+=1.6")
        .to(bands[1], { y: 0 }, "<");
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <header ref={rootRef} className="relative overflow-hidden bg-void pt-32 md:pt-40">
      <Container>
        <div data-hero-copy className="flex items-start justify-between">
          <Button href="/work" variant="ghost">
            ← Work
          </Button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            {String(position.index + 1).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12">
          <h1
            data-hero-copy
            className="font-display text-[18vw] leading-[0.85] md:col-span-9 md:text-[10vw]"
          >
            {project.title}
          </h1>
          <div data-hero-copy className="md:col-span-3 md:pt-6">
            <p className="text-lg text-silver">{project.description}</p>
            <ProjectMeta project={project} className="mt-6 flex-col !gap-y-2" />
          </div>
        </div>

        <div className="mt-14 pb-16 md:mt-20 md:pb-24">
          <div className="mb-4 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone/70">
            <span>Schematic</span>
            <span>Coverage over time</span>
          </div>
          <HorizontalTimeline />
          <VerticalTimeline />
          <ol className="mt-4 hidden grid-cols-3 md:grid">
            {PERIODS.map((label, i) => (
              <li
                key={label}
                data-period
                data-at={i / 3}
                className="border-l border-stone/40 pl-4 font-mono text-xs uppercase tracking-[0.2em] text-silver"
              >
                {label}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </header>
  );
}
