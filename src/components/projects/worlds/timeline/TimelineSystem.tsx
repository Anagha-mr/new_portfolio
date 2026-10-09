"use client";

import { useEffect, useRef } from "react";
import type { TimelineSystem as TimelineData, Tone } from "@/data/projects";
import { TONES } from "@/components/projects/page/tone";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Pipeline steps along an axis that fills as the page scrolls; the retrieval step carries the coverage periods. */
export function TimelineSystem({ data, tone }: { data: TimelineData; tone: Tone }) {
  const t = TONES[tone];
  const listRef = useRef<HTMLOListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const count = data.steps.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;

    const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", wrap);
    const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", wrap);

    const apply = (progress: number) => {
      fills[0]?.style.setProperty("transform", `scaleX(${progress})`);
      fills[1]?.style.setProperty("transform", `scaleY(${progress})`);
      nodes.forEach((node, i) => {
        node.dataset.active = String(progress >= i / count + 0.02);
      });
    };

    if (reducedMotion) {
      apply(1);
      return;
    }

    apply(0);
    const trigger = ScrollTrigger.create({
      trigger: list,
      start: "top 70%",
      end: "bottom 65%",
      onUpdate: (self) => apply(self.progress),
    });

    return () => trigger.kill();
  }, [count, reducedMotion]);

  return (
    <div ref={wrapRef} className="relative mt-16">
      <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-void/15 md:hidden">
        <span data-fill className="absolute inset-0 origin-top bg-void" style={{ transform: "scaleY(0)" }} />
      </span>
      <span aria-hidden="true" className="absolute left-0 right-0 top-[5px] hidden h-px bg-void/15 md:block">
        <span data-fill className="absolute inset-0 origin-left bg-void" style={{ transform: "scaleX(0)" }} />
      </span>

      <ol ref={listRef} className="grid grid-cols-1 gap-y-12 md:grid-cols-5 md:gap-x-8 md:gap-y-0">
      {data.steps.map((step, i) => {
        const retrieval = step.name === "Retrieve";
        return (
          <li key={step.name} className="relative pl-9 md:pl-0 md:pt-12">
            <span
              data-node
              aria-hidden="true"
              className={`absolute left-0 top-1 size-[11px] rounded-full border border-void/50 bg-ivory transition-colors duration-300 md:top-0 ${
                retrieval
                  ? tone === "ivory"
                    ? "data-[active=true]:border-deep-cobalt data-[active=true]:bg-deep-cobalt"
                    : "data-[active=true]:border-cobalt data-[active=true]:bg-cobalt"
                  : "data-[active=true]:bg-void"
              }`}
            />
            <p className={`font-mono text-xs ${t.muted}`}>{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{step.name}</h3>
            <p className={`mt-3 max-w-[18rem] text-sm leading-relaxed ${t.soft}`}>{step.detail}</p>
            {retrieval && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {data.periods.map((period) => (
                  <li
                    key={period}
                    className={`border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] ${t.ruleStrong}`}
                  >
                    {period}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
      </ol>
    </div>
  );
}
