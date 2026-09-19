"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { RedThread, type RedThreadProps } from "./RedThread";
import { generateOrbitalPath, applyOrganicDrift } from "./ThreadPath";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type ThreadControllerProps = RedThreadProps & {
  /** Tiny pointer-driven tension on the whole filament group. */
  pointerInteraction?: boolean;
};

/** Seconds between control-point drift updates — deliberately slow, not per-frame. */
const DRIFT_INTERVAL = 0.35;

/**
 * Composition point for the thread's behaviour: holds the base control
 * points, nudges them with a slow organic drift on a throttled interval
 * (real curve deformation, not just a transform trick), and applies a tiny
 * pointer-driven tension to the group. `RedThread` itself stays a dumb
 * geometry renderer.
 */
export function ThreadController({
  points: explicitPoints,
  segments,
  radius,
  rise,
  pointerInteraction = true,
  ...rest
}: ThreadControllerProps) {
  const groupRef = useRef<Group>(null);
  const pointer = usePointer();
  const reducedMotion = useReducedMotion();
  const elapsed = useRef(0);

  const basePoints = useMemo(
    () => explicitPoints ?? generateOrbitalPath({ segments, radius, rise }),
    [explicitPoints, segments, radius, rise]
  );

  const [drivenPoints, setDrivenPoints] = useState(basePoints);

  useFrame((state, delta) => {
    if (!reducedMotion) {
      elapsed.current += delta;
      if (elapsed.current >= DRIFT_INTERVAL) {
        elapsed.current = 0;
        setDrivenPoints(applyOrganicDrift(basePoints, state.clock.elapsedTime));
      }
    }

    if (!groupRef.current || reducedMotion || !pointerInteraction) return;

    groupRef.current.rotation.y = pointer.current.x * 0.05;
    groupRef.current.rotation.x = pointer.current.y * 0.03;
  });

  return (
    <group ref={groupRef}>
      <RedThread {...rest} points={reducedMotion ? basePoints : drivenPoints} />
    </group>
  );
}
