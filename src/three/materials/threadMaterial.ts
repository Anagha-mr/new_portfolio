import * as THREE from "three";

const CHERRY = "#c1121f";
const DEEP_CHERRY = "#850e17";

// Lit rather than MeshBasicMaterial: an unlit flat red reads as a neon tube.
export function createThreadMaterial(color: string = CHERRY) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.32,
    metalness: 0.15,
    emissive: DEEP_CHERRY,
    emissiveIntensity: 0.12,
  });
}
