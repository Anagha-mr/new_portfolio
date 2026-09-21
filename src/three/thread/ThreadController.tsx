"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { RedThread, type RedThreadProps } from "./RedThread";
import { generateOrbitalPath, applyOrganicDrift } from "./ThreadPath";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_EXIT, heroExitDrift } from "@/thread/heroExit";

export type ThreadControllerProps = RedThreadProps & {
  /** Tiny pointer-driven tension on the whole filament group. */
  pointerInteraction?: boolean;
};

/** Seconds between control-point drift updates (throttled, not per-frame). */
const DRIFT_INTERVAL = 0.35;

export function ThreadController({
  points: explicitPoints,
  segments,
  radius,
  rise,
  pointerInteraction = true,
  entrance,
  exit,
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
    // Drift and pointer tension wait until the entrance has resolved.
    const settled = !entrance || entrance.current >= 1;

    if (!reducedMotion && settled) {
      elapsed.current += delta;
      if (elapsed.current >= DRIFT_INTERVAL) {
        elapsed.current = 0;
        setDrivenPoints(applyOrganicDrift(basePoints, state.clock.elapsedTime));
      }
    }

    if (groupRef.current && exit) {
      const drift = heroExitDrift(exit.current);
      groupRef.current.position.set(HERO_EXIT.driftX * drift, HERO_EXIT.driftY * drift, 0);
    }

    if (!groupRef.current || reducedMotion || !pointerInteraction || !settled) return;

    groupRef.current.rotation.y = pointer.current.x * 0.05;
    groupRef.current.rotation.x = pointer.current.y * 0.03;
  });

  return (
    <group ref={groupRef}>
      <RedThread
        {...rest}
        points={reducedMotion ? basePoints : drivenPoints}
        entrance={entrance}
        exit={exit}
      />
    </group>
  );
}
