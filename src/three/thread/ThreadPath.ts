import * as THREE from "three";

export type ThreadPathConfig = {
  segments?: number;
  /** Orbit radius in scene units. */
  radius?: number;
  /** Vertical drift across the path. */
  rise?: number;
};

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

// Index-derived phases keep the curve wandering instead of pulsing uniformly.
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
