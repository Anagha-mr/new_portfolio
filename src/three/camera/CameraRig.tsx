"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type CameraRigProps = {
  pointerInteraction?: boolean;
};

// Framing adapts per breakpoint rather than scaling the desktop composition down.
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
