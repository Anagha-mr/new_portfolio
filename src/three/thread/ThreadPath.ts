import * as THREE from "three";

export type ThreadPathConfig = {
  /** Number of control points generated along the path. */
  segments?: number;
  /** Radius of the orbit in scene units. */
  radius?: number;
  /** Vertical drift applied across the path. */
  rise?: number;
};

/**
 * Generates the control points for a single orbital filament.
 * This is a first-pass placeholder — Sprint 04 replaces the curve math
 * with cursor/scroll-driven paths, but the shape stays a Catmull-Rom curve
 * so `RedThread` doesn't need to change.
 */
export function generateOrbitalPath({
  segments = 48,
  radius = 3,
  rise = 1.2,
}: ThreadPathConfig = {}): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.6;
    const y = Math.sin(t * 2) * rise;
    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

export function createThreadCurve(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.2);
}

/**
 * Displaces each control point by a small amount using combined sine waves
 * at per-point phases/frequencies (derived from the point's index) so the
 * curve reads as organically drifting rather than uniformly pulsing. Pure
 * function — callers decide how often to call it (Sprint 04 throttles this
 * to a few times per second rather than every frame).
 */
export function applyOrganicDrift(
  points: THREE.Vector3[],
  time: number,
  amplitude = 0.05
): THREE.Vector3[] {
  return points.map((point, index) => {
    const phase = index * 0.7;
    const dx = Math.sin(time * 0.15 + phase) * amplitude;
    const dy = Math.cos(time * 0.11 + phase * 1.3) * amplitude * 0.8;
    const dz = Math.sin(time * 0.09 + phase * 0.6) * amplitude;
    return new THREE.Vector3(point.x + dx, point.y + dy, point.z + dz);
  });
}
