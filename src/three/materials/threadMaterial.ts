import * as THREE from "three";

const CHERRY = "#c1121f";
const DEEP_CHERRY = "#850e17";

/**
 * Shared material factory so every thread segment stays visually
 * consistent. Deliberately lit (not `MeshBasicMaterial`) — an unlit flat
 * red reads as a neon tube; a glossy, lightly-emissive standard material
 * responds to `StudioLighting` and reads as physical red-lacquered wire
 * instead, per the "no laser/neon" material language.
 */
export function createThreadMaterial(color: string = CHERRY) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.32,
    metalness: 0.15,
    emissive: DEEP_CHERRY,
    emissiveIntensity: 0.12,
  });
}
