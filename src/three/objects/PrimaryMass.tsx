"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh } from "three";
import { createCharcoalMaterial } from "../materials/surfaceMaterials";
import { createSeededRandom } from "../utils/random";
import { usePointer } from "../hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type PrimaryMassProps = {
  radius?: number;
  position?: [number, number, number];
  /** Icosahedron subdivision — lower reads as more faceted. From useQualityTier. */
  detail?: number;
  /** Enables the tiny pointer-driven positional drift. */
  pointerInteraction?: boolean;
};

/**
 * The portfolio's large abstract spatial object: a physical artifact
 * suspended in space, not a literal planet/moon. Built from a jittered
 * icosahedron so the surface reads as irregular rather than a smooth,
 * generic sphere — the jitter is deterministic (seeded) so it's stable
 * across re-renders instead of reshuffling on every remount.
 */
export function PrimaryMass({
  radius = 1.6,
  position = [0, 0, 0],
  detail = 2,
  pointerInteraction = true,
}: PrimaryMassProps) {
  const meshRef = useRef<Mesh>(null);
  const pointer = usePointer();
  const reducedMotion = useReducedMotion();
  const restPosition = useMemo(() => new THREE.Vector3(...position), [position]);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const positions = geo.attributes.position;
    const random = createSeededRandom(1337);
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i += 1) {
      vertex.fromBufferAttribute(positions, i);
      const jitter = 1 + (random() - 0.5) * 0.06;
      vertex.multiplyScalar(jitter);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, [radius, detail]);

  const material = useMemo(() => createCharcoalMaterial({ flatShading: true }), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.004;
    }

    if (pointerInteraction && !reducedMotion) {
      const offsetX = pointer.current.x * 0.12;
      const offsetY = pointer.current.y * 0.08;
      meshRef.current.position.x = restPosition.x + offsetX;
      meshRef.current.position.y = restPosition.y + offsetY;
    } else {
      meshRef.current.position.copy(restPosition);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
    />
  );
}
