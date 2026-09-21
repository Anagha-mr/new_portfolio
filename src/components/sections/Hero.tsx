"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { Container } from "@/components/layout/Container";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { ThreadFallback } from "@/components/three/ThreadFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { heroExit } from "@/thread/heroExit";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(kickerRef.current, { opacity: 0, y: 8, duration: 0.5 })
        .from(headingRef.current, { opacity: 0, y: 20, duration: 0.65 }, 0.08)
        .from(supportingRef.current, { opacity: 0, y: 8, duration: 0.5 }, 0.3)
        .from(scrollRef.current, { opacity: 0, duration: 0.4 }, 0.55);

      gsap.to(sectionRef.current, {
        y: -16,
        opacity: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(heroExit, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      heroExit.current = 0;
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void"
    >
      {/* CSS-only depth; still present with WebGL off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 78% 22%, rgba(181,177,170,0.10), transparent 60%), radial-gradient(120% 90% at 20% 100%, rgba(133,14,23,0.12), transparent 55%), #080807",
        }}
      />

      <ThreadFallback />

      {/* Quality tier scales the 3D layer down on smaller screens. */}
      <HeroCanvas className="pointer-events-none absolute inset-0" />

      <Container className="relative flex flex-1 flex-col justify-between py-32 md:py-40">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <p
              ref={kickerRef}
              className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-stone"
            >
              {site.role} · {site.program}
            </p>
            <h1
              ref={headingRef}
              className="font-display text-[18vw] leading-[0.85] text-ivory sm:text-[14vw] md:text-[9vw]"
            >
              ANAGHA
              <br />
              MR
            </h1>
          </div>

          <div className="col-span-12 mt-10 md:col-span-4 md:mt-2 md:text-right">
            <p ref={supportingRef} className="font-display text-xl italic text-silver md:text-2xl">
              {site.heroKicker}
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-16 flex items-end justify-end font-mono text-xs uppercase tracking-[0.2em] text-stone"
        >
          <span className="flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="h-8 w-px bg-stone/50 scroll-line-pulse" />
          </span>
        </div>
      </Container>
    </section>
  );
}
