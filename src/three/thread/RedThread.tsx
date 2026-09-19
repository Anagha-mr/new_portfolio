"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createThreadMaterial } from "../materials/threadMaterial";
import { createThreadCurve, generateOrbitalPath, type ThreadPathConfig } from "./ThreadPath";

export type RedThreadProps = ThreadPathConfig & {
  /** Explicit points override the generated orbital path. */
  points?: THREE.Vector3[];
  tubeRadius?: number;
  color?: string;
  /** Segments along the tube's length — lower on constrained quality tiers. */
  tubeSegments?: number;
  /** Segments around the tube's radius — lower on constrained quality tiers. */
  radialSegments?: number;
};

/**
 * The cherry-red filament as a real 3D object (TubeGeometry along a
 * Catmull-Rom curve). A dumb geometry renderer by design — `points` is the
 * only thing that changes frame-to-frame, driven by `ThreadController`, so
 * this component doesn't need to know anything about motion or pointer
 * state.
 */
export function RedThread({
  points,
  segments,
  radius,
  rise,
  tubeRadius = 0.015,
  tubeSegments = 128,
  radialSegments = 8,
  color,
}: RedThreadProps) {
  const geometry = useMemo(() => {
    const curvePoints = points ?? generateOrbitalPath({ segments, radius, rise });
    const curve = createThreadCurve(curvePoints);
    return new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, radialSegments, true);
  }, [points, segments, radius, rise, tubeRadius, tubeSegments, radialSegments]);

  const material = useMemo(() => createThreadMaterial(color), [color]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return <mesh geometry={geometry} material={material} />;
}
