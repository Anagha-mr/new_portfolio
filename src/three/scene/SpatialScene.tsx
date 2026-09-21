"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerProvider } from "../hooks/usePointer";
import { useQualityTier } from "../hooks/useQualityTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type SpatialSceneProps = {
  children: ReactNode;
  className?: string;
  /** Stops the render loop, e.g. while the scene is off-screen. */
  paused?: boolean;
};

/** Canvas, quality-aware settings, fog and pointer provider shared by every scene. */
export function SpatialScene({ children, className, paused = false }: SpatialSceneProps) {
  const quality = useQualityTier();
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={quality.dpr}
      shadows="variance"
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      className={className}
    >
      <fogExp2 attach="fog" args={["#080807", quality.fogDensity]} />
      <PointerProvider enabled={!reducedMotion}>{children}</PointerProvider>
    </Canvas>
  );
}
