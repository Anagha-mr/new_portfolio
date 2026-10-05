"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createThreadMaterial } from "../materials/threadMaterial";
import { createThreadCurve, generateOrbitalPath, type ThreadPathConfig } from "./ThreadPath";
import { clamp01, type EntranceRef } from "../hooks/useEntrance";
import { HERO_EXIT } from "@/thread/heroExit";

export type RedThreadProps = ThreadPathConfig & {
  /** Explicit points override the generated orbital path. */
  points?: THREE.Vector3[];
  tubeRadius?: number;
  color?: string;
  tubeSegments?: number;
  radialSegments?: number;
  /** Shared page-load progress; reveals the tube along its path. */
  entrance?: EntranceRef;
  /** Hero scroll-out progress; retracts the tube from its start. */
  exit?: EntranceRef;
  /** Lets a controller reshape the tube in place (see `retubeGeometry`). */
  meshRef?: RefObject<THREE.Mesh | null>;
};

/** Fraction of the entrance timeline at which the reveal starts. */
const REVEAL_START = 0.1;

// Draw range works in whole rings so the reveal and retract stay clean-edged.
function applyDrawRange(
  geo: THREE.BufferGeometry,
  radialSegments: number,
  entrance?: EntranceRef,
  exit?: EntranceRef
) {
  if (!geo.index) return;

  const ringSize = radialSegments * 6;
  const totalRings = Math.max(1, Math.round(geo.index.count / ringSize));
  const revealed = entrance ? clamp01((entrance.current - REVEAL_START) / (1 - REVEAL_START)) : 1;
  const retracted = exit
    ? clamp01((exit.current - HERO_EXIT.retractStart) / (HERO_EXIT.retractEnd - HERO_EXIT.retractStart))
    : 0;

  const startRing = Math.round(totalRings * retracted);
  const endRing = revealed >= 1 ? totalRings : Math.ceil(totalRings * revealed);
  const start = startRing * ringSize;
  const count = Math.max(0, endRing - startRing) * ringSize;

  if (geo.drawRange.start !== start || geo.drawRange.count !== count) geo.setDrawRange(start, count);
}

/**
 * Rebuilds the tube along new points by rewriting the existing vertex buffers,
 * so the same GPU buffers, draw range and React tree survive. Ring and segment
 * counts are unchanged, so the index buffer is reused as-is.
 */
export function retubeGeometry(geo: THREE.TubeGeometry, points: THREE.Vector3[]) {
  const { tubularSegments, radius, radialSegments, closed } = geo.parameters;
  const next = new THREE.TubeGeometry(createThreadCurve(points), tubularSegments, radius, radialSegments, closed);
  for (const name of ["position", "normal"] as const) {
    const attribute = geo.getAttribute(name) as THREE.BufferAttribute;
    (attribute.array as Float32Array).set(next.getAttribute(name).array as Float32Array);
    attribute.needsUpdate = true;
  }
  // Recomputed lazily by the renderer for frustum culling, as for a fresh geometry.
  geo.boundingSphere = null;
  next.dispose();
}

/** Geometry-only renderer; motion is driven by `ThreadController`. */
export function RedThread({
  points,
  segments,
  radius,
  rise,
  tubeRadius = 0.015,
  tubeSegments = 128,
  radialSegments = 8,
  color,
  entrance,
  exit,
  meshRef: externalRef,
}: RedThreadProps) {
  const localRef = useRef<THREE.Mesh>(null);
  const meshRef = externalRef ?? localRef;

  const geometry = useMemo(() => {
    const curvePoints = points ?? generateOrbitalPath({ segments, radius, rise });
    const curve = createThreadCurve(curvePoints);
    const geo = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, radialSegments, true);
    applyDrawRange(geo, radialSegments, entrance, exit);
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, segments, radius, rise, tubeRadius, tubeSegments, radialSegments]);

  const material = useMemo(() => createThreadMaterial(color), [color]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useFrame(() => {
    if (!entrance && !exit) return;
    const geo = meshRef.current?.geometry;
    if (geo) applyDrawRange(geo, radialSegments, entrance, exit);
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}
