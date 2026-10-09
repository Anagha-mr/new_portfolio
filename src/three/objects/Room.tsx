"use client";

import { useEffect, useMemo } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  MeshStandardMaterial,
  Plane,
  SphereGeometry,
} from "three";

export type MaterialKey =
  | "floor"
  | "wall"
  | "wallSide"
  | "rug"
  | "ceramic"
  | "silver"
  | "shade"
  | "window"
  | "art"
  | "charcoal"
  | "plant";

type Part = {
  geometry: BufferGeometry;
  position: [number, number, number];
  rotationY?: number;
  material: MaterialKey;
};

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
const cylinder = (rt: number, rb: number, h: number, seg = 24, open = false) =>
  new CylinderGeometry(rt, rb, h, seg, 1, open);

function buildParts(): Part[] {
  return [
    { geometry: box(8, 0.06, 7), position: [0, -0.03, 0.5], material: "floor" },
    { geometry: box(8, 3.6, 0.08), position: [0, 1.8, -3.04], material: "wall" },
    { geometry: box(0.08, 3.6, 7), position: [-4.04, 1.8, 0.5], material: "wallSide" },
    { geometry: box(3.4, 0.02, 2.4), position: [-0.4, 0.02, -0.6], material: "rug" },
    // sofa
    { geometry: box(2.6, 0.45, 1), position: [-1.6, 0.3, -2.35], material: "ceramic" },
    { geometry: box(2.6, 0.75, 0.28), position: [-1.6, 0.85, -2.72], material: "ceramic" },
    { geometry: box(0.28, 0.6, 1), position: [-2.87, 0.5, -2.35], material: "ceramic" },
    { geometry: box(0.28, 0.6, 1), position: [-0.33, 0.5, -2.35], material: "ceramic" },
    // coffee table
    { geometry: cylinder(0.7, 0.7, 0.06, 32), position: [-0.6, 0.42, -0.7], material: "silver" },
    { geometry: cylinder(0.06, 0.06, 0.4, 12), position: [-0.6, 0.2, -0.7], material: "silver" },
    // floor lamp
    { geometry: cylinder(0.22, 0.22, 0.04), position: [1.2, 0.02, -2.5], material: "charcoal" },
    { geometry: cylinder(0.025, 0.025, 2.1, 8), position: [1.2, 1.07, -2.5], material: "charcoal" },
    { geometry: cylinder(0.2, 0.36, 0.4, 24, true), position: [1.2, 2.25, -2.5], material: "shade" },
    // wall pieces
    { geometry: box(1.7, 1.5, 0.05), position: [1.9, 1.9, -2.98], material: "window" },
    { geometry: box(1.1, 0.75, 0.04), position: [-1.6, 2.35, -2.98], material: "art" },
    // plant
    { geometry: cylinder(0.22, 0.18, 0.4, 16), position: [3.1, 0.2, -2.3], material: "charcoal" },
    { geometry: new SphereGeometry(0.42, 16, 12), position: [3.1, 0.85, -2.3], material: "plant" },
    // armchair
    { geometry: box(0.9, 0.5, 0.9), position: [2.4, 0.28, 0.2], rotationY: -0.6, material: "ceramic" },
    { geometry: box(0.9, 0.7, 0.2), position: [2.63, 0.7, -0.13], rotationY: -0.6, material: "ceramic" },
    // shelf
    { geometry: box(0.3, 0.05, 2), position: [-3.85, 1.5, 0.4], material: "charcoal" },
    { geometry: box(0.3, 0.05, 2), position: [-3.85, 2.1, 0.4], material: "charcoal" },
  ];
}

const SURFACES: Record<MaterialKey, { color: string; roughness?: number; emissive?: string; emissiveIntensity?: number }> = {
  floor: { color: "#1d1b18", roughness: 0.6 },
  wall: { color: "#34312c" },
  wallSide: { color: "#2a2723" },
  rug: { color: "#24365f", roughness: 0.95 },
  ceramic: { color: "#f1ede5", roughness: 0.55 },
  silver: { color: "#b5b1aa", roughness: 0.4 },
  shade: { color: "#f1ede5", emissive: "#f1ede5", emissiveIntensity: 0.55 },
  window: { color: "#d8d2c5", emissive: "#f1ede5", emissiveIntensity: 0.6 },
  art: { color: "#5b564d" },
  charcoal: { color: "#3c3934", roughness: 0.75 },
  plant: { color: "#4a463f", roughness: 0.9 },
};

export type RoomClip = {
  /** Keeps x <= sweep. */
  finished: Plane;
  /** Keeps x >= sweep. */
  structure: Plane;
};

/**
 * One room drawn twice: as edge lines (structure) on one side of a sweeping
 * clip plane and as lit surfaces (generated result) on the other.
 */
export function Room({ clip }: { clip: RoomClip }) {
  const parts = useMemo(() => buildParts(), []);
  const edges = useMemo(() => parts.map((part) => new EdgesGeometry(part.geometry, 20)), [parts]);

  const surfaces = useMemo(() => {
    const entries = Object.entries(SURFACES).map(([key, spec]) => [
      key,
      new MeshStandardMaterial({
        roughness: 0.8,
        metalness: 0,
        ...spec,
        clippingPlanes: [clip.finished],
      }),
    ]);
    return Object.fromEntries(entries) as Record<MaterialKey, MeshStandardMaterial>;
  }, [clip.finished]);

  const lineMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: "#817b73",
        transparent: true,
        opacity: 0.7,
        clippingPlanes: [clip.structure],
      }),
    [clip.structure]
  );

  useEffect(
    () => () => {
      parts.forEach((part) => part.geometry.dispose());
      edges.forEach((geometry) => geometry.dispose());
      Object.values(surfaces).forEach((material) => material.dispose());
      lineMaterial.dispose();
    },
    [parts, edges, surfaces, lineMaterial]
  );

  return (
    <group>
      {parts.map((part, i) => (
        <group key={i} position={part.position} rotation={[0, part.rotationY ?? 0, 0]}>
          <mesh geometry={part.geometry} material={surfaces[part.material]} />
          <lineSegments geometry={edges[i]} material={lineMaterial} />
        </group>
      ))}
    </group>
  );
}
