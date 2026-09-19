"use client";

import dynamic from "next/dynamic";
import { WebGLCanvas } from "./WebGLCanvas";

const HeroScene = dynamic(() => import("@/three/scenes/HeroScene"), { ssr: false });

export function HeroCanvas({ className }: { className?: string }) {
  return (
    <WebGLCanvas className={className}>
      <HeroScene />
    </WebGLCanvas>
  );
}
