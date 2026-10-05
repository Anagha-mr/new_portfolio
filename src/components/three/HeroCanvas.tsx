"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { WebGLCanvas } from "./WebGLCanvas";

const HeroScene = dynamic(() => import("@/three/scenes/HeroScene"), { ssr: false });

/** The render loop stops once the hero has scrolled fully out of view. */
export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <WebGLCanvas className="absolute inset-0">
        <HeroScene paused={!inView} />
      </WebGLCanvas>
    </div>
  );
}
