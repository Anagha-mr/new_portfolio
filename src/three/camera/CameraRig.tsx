"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type CameraRigProps = {
  /** Tiny pointer-driven camera drift — off under reduced motion regardless. */
  pointerInteraction?: boolean;
};

/**
 * Reusable camera for the spatial engine. Framing (position/fov) adapts
 * across breakpoints so the composition survives viewport changes rather
 * than the desktop scene simply being scaled down. Pointer drift is
 * damped and tiny — an environment reacting, not a camera chasing the
 * cursor. Sprint 05 owns any scroll-driven choreography on top of this.
 */
export function CameraRig({ pointerInteraction = true }: CameraRigProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const pointer = usePointer();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const basePosition: [number, number, number] = isMobile
    ? [0, 0, 7.5]
    : isTablet
      ? [0, 0, 6.8]
      : [0, 0, 6];
  const fov = isMobile ? 52 : isTablet ? 48 : 45;

  useFrame(() => {
    if (!cameraRef.current || reducedMotion || !pointerInteraction) return;

    cameraRef.current.position.x = basePosition[0] + pointer.current.x * 0.25;
    cameraRef.current.position.y = basePosition[1] + pointer.current.y * 0.15;
    cameraRef.current.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={basePosition} fov={fov} />;
}
