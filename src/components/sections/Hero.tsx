"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { HeroFallback } from "@/components/three/HeroFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { setHeroProgress, setHeroTextRect } from "@/three/painting/heroState";

/** Typography bounds within the stage; particles dim behind them. */
function measureText(stage: HTMLElement | null, text: HTMLElement | null) {
  if (!stage || !text) return;
  const s = stage.getBoundingClientRect();
  const t = text.getBoundingClientRect();
  setHeroTextRect({ x: t.left - s.left, y: t.top - s.top, width: t.width, height: t.height });
}

/**
 * Taller than the viewport so the painting has room to dissociate: the stage
 * stays pinned (CSS sticky, no scroll hijack) while the section scrolls past,
 * and scroll progress through it drives the particles. Under reduced motion
 * the section collapses to one screen and the painting stays formed.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const text = textRef.current;
    if (!stage || !text) return;

    const measure = () => measureText(stage, text);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(text);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      setHeroTextRect(null);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setHeroProgress(0);
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" }, onComplete: () => measureText(stageRef.current, textRef.current) })
        .from(kickerRef.current, { opacity: 0, y: 8, duration: 0.5 })
        .from(headingRef.current, { opacity: 0, y: 20, duration: 0.65 }, 0.08)
        .from(supportingRef.current, { opacity: 0, y: 8, duration: 0.5 }, 0.3)
        .from(scrollRef.current, { opacity: 0, duration: 0.4 }, 0.55);

      // Progress across the pinned stretch only; reverse scroll reverses it.
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => setHeroProgress(self.progress),
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      setHeroProgress(0);
    };
  }, [reducedMotion]);

  return (
    <section id="hero" ref={sectionRef} className="relative h-[210svh] bg-void motion-reduce:h-[100svh]">
      <div ref={stageRef} className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Midnight atmosphere the painting sits in; present with WebGL off. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 65% at 60% 40%, rgba(24,40,86,0.26), transparent 70%), linear-gradient(180deg, #05070c 0%, #06080d 70%, #080807 100%)",
          }}
        />

        <HeroFallback />

        {/* Quality tier scales the particle count down on smaller screens. */}
        <HeroCanvas className="pointer-events-none absolute inset-0" />

        <Container className="relative flex w-full flex-1 flex-col justify-end pb-14 pt-32 md:pb-20 md:landscape:justify-center md:landscape:pb-24 md:landscape:pt-28">
          <div ref={textRef} className="w-fit">
            <p
              ref={kickerRef}
              className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#C8D9F0] md:mb-5 md:text-xs"
            >
              {site.role} · {site.program}
            </p>
            <h1
              ref={headingRef}
              className="font-display text-[18vw] leading-[0.85] text-ivory sm:text-[14vw] md:landscape:whitespace-nowrap md:landscape:text-[7.75vw]"
            >
              ANAGHA <br className="md:landscape:hidden" />
              MR
            </h1>
            <p
              ref={supportingRef}
              className="mt-6 max-w-[11em] font-mono text-xs uppercase leading-[1.85] tracking-[0.2em] text-ivory md:mt-10 md:text-sm"
            >
              {site.heroKicker}
            </p>
          </div>

          <div
            ref={scrollRef}
            className="mt-10 flex w-fit flex-col items-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/85 md:mt-12 md:text-xs"
          >
            Scroll
            <span aria-hidden="true" className="mt-3 h-10 w-px bg-ivory/60 scroll-line-pulse" />
            <span aria-hidden="true" className="size-[5px] rounded-full bg-ivory/90" />
          </div>
        </Container>
      </div>
    </section>
  );
}
