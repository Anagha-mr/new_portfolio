"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerProvider } from "../hooks/usePointer";
import { useQualityTier } from "../hooks/useQualityTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type SpatialSceneProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reusable spatial engine container. Owns the Canvas, device-aware pixel
 * ratio and shadow quality, atmospheric fog, and the pointer-damping
 * provider — everything a scene needs regardless of what's inside it.
 * Individual scenes (HeroScene today; WorkScene/ProjectScene later) supply
 * their own camera, lighting, objects and filament as children, so this
 * component never hardcodes a specific composition.
 */
export function SpatialScene({ children, className }: SpatialSceneProps) {
  const quality = useQualityTier();
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={quality.dpr}
      shadows="variance"
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      className={className}
    >
      <fogExp2 attach="fog" args={["#080807", quality.fogDensity]} />
      <PointerProvider enabled={!reducedMotion}>{children}</PointerProvider>
    </Canvas>
  );
}
