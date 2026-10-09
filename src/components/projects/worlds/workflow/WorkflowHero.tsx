"use client";

import { useEffect, useRef } from "react";
import type { DetailedProject } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectMeta } from "@/components/projects/page/ProjectMeta";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";

type Bar = { x0: number; x1: number };

/** Abstract task schedule: bars in desktop units (1200 wide), edges are finish-to-start dependencies. */
const BARS: Bar[] = [
  { x0: 50, x1: 280 },
  { x0: 320, x1: 560 },
  { x0: 320, x1: 500 },
  { x0: 600, x1: 860 },
  { x0: 540, x1: 720 },
  { x0: 900, x1: 1110 },
  { x0: 760, x1: 980 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 6],
];
const MILESTONE_X = 1150;
const COLUMN = 50;

type Layout = { width: number; pitch: number; barH: number; top: number; xScale: number };

const DESKTOP: Layout = { width: 1200, pitch: 52, barH: 18, top: 44, xScale: 1 };
const MOBILE: Layout = { width: 342, pitch: 40, barH: 12, top: 34, xScale: 0.285 };

function Schedule({ layout, className }: { layout: Layout; className: string }) {
  const { width, pitch, barH, top, xScale } = layout;
  const rowY = (i: number) => top + i * pitch;
  const height = rowY(BARS.length - 1) + barH + 34;
  const x = (value: number) => Math.round(value * xScale * 10) / 10;
  const columns = Math.floor(1200 / COLUMN);

  const link = (from: number, to: number) => {
    const a = BARS[from];
    const b = BARS[to];
    const ya = rowY(from) + barH / 2;
    const yb = rowY(to) + barH / 2;
    const mid = x((a.x1 + b.x0) / 2);
    return `M ${x(a.x1)} ${ya} H ${mid} V ${yb} H ${x(b.x0)}`;
  };

  const last = BARS.length - 1;
  const milestoneY = rowY(last) + barH / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {Array.from({ length: columns + 1 }, (_, i) => (
        <line
          key={i}
          data-tick
          x1={x(i * COLUMN)}
          x2={x(i * COLUMN)}
          y1={i % 4 === 0 ? 8 : 20}
          y2={height}
          stroke="#817b73"
          strokeOpacity={i % 4 === 0 ? 0.28 : 0.12}
          vectorEffect="non-scaling-stroke"
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        />
      ))}

      {EDGES.map(([from, to]) => (
        <path
          key={`${from}-${to}`}
          data-link
          d={link(from, to)}
          pathLength={1}
          strokeDasharray={1}
          stroke="#b5b1aa"
          strokeOpacity={0.55}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <path
        data-link
        d={`M ${x(BARS[last].x1)} ${milestoneY} H ${x(MILESTONE_X)}`}
        pathLength={1}
        strokeDasharray={1}
        stroke="#b5b1aa"
        strokeOpacity={0.55}
        vectorEffect="non-scaling-stroke"
      />
      <path
        data-link
        d={`M ${x(BARS[5].x1)} ${rowY(5) + barH / 2} H ${x(MILESTONE_X)} V ${milestoneY}`}
        pathLength={1}
        strokeDasharray={1}
        stroke="#b5b1aa"
        strokeOpacity={0.55}
        vectorEffect="non-scaling-stroke"
      />

      {BARS.map((bar, i) => {
        const w = x(bar.x1) - x(bar.x0);
        const done = i < 3 ? 1 : i === 3 ? 0.45 : 0;
        return (
          <g
            key={i}
            data-bar
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          >
            <rect x={x(bar.x0)} y={rowY(i)} width={w} height={barH} rx={2} fill="#181715" />
            {done > 0 && (
              <rect
                x={x(bar.x0)}
                y={rowY(i)}
                width={w * done}
                height={barH}
                rx={2}
                fill="#f1ede5"
                fillOpacity={0.16}
              />
            )}
            <rect
              x={x(bar.x0)}
              y={rowY(i)}
              width={w}
              height={barH}
              rx={2}
              stroke="#817b73"
              strokeOpacity={0.8}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}

      <g data-milestone style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <rect
          x={x(MILESTONE_X) - barH / 2}
          y={milestoneY - barH / 2}
          width={barH}
          height={barH}
          transform={`rotate(45 ${x(MILESTONE_X)} ${milestoneY})`}
          fill="#5b7fc7"
        />
      </g>
    </svg>
  );
}

type WorkflowHeroProps = { project: DetailedProject; position: { index: number; total: number } };

export function WorkflowHero({ project, position }: WorkflowHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.inOut" } })
        .from("[data-hero-copy]", { opacity: 0, y: 14, duration: 0.7, stagger: 0.1 })
        .from("[data-tick]", { scaleY: 0, duration: 0.6, stagger: 0.015 }, 0.15)
        .from("[data-bar]", { scaleX: 0, duration: 0.55, stagger: 0.12 }, 0.5)
        .from("[data-link]", { strokeDashoffset: 1, duration: 0.5, stagger: 0.1 }, 0.9)
        .from("[data-milestone]", { scale: 0, duration: 0.4 }, 1.7);
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

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <h1
            data-hero-copy
            className="font-display text-[17vw] leading-[0.85] md:col-span-8 md:text-[11vw]"
          >
            {project.title}
          </h1>
          <div data-hero-copy className="md:col-span-4 md:pb-3">
            <p className="max-w-md text-lg text-silver">{project.description}</p>
            <ProjectMeta project={project} className="mt-6 flex-col !gap-y-2" />
          </div>
        </div>

        <div className="mt-12 border-t border-stone/30 pb-16 pt-6 md:mt-14 md:pb-24">
          <div className="mb-4 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-stone/70">
            <span>Schematic</span>
            <span>Schedule / dependencies</span>
          </div>
          <Schedule layout={DESKTOP} className="hidden h-auto w-full md:block" />
          <Schedule layout={MOBILE} className="h-auto w-full md:hidden" />
        </div>
      </Container>
    </header>
  );
}
