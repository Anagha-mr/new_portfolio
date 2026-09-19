"use client";

import { useRef } from "react";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type AtmosphereProps = {
  count: number;
};

/**
 * Extremely restrained particle field — not a starfield. Count is driven
 * by the active quality tier (see `useQualityTier`) and can be zero on
 * low-tier devices, in which case this renders nothing.
 */
export function Atmosphere({ count }: AtmosphereProps) {
  const groupRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.003;
  });

  if (count <= 0) return null;

  return (
    <group ref={groupRef}>
      <Sparkles
        count={count}
        scale={[9, 6, 6]}
        size={1.1}
        speed={reducedMotion ? 0 : 0.08}
        opacity={0.18}
        color="#b5b1aa"
        noise={0.4}
      />
    </group>
  );
}
