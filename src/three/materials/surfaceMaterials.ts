import * as THREE from "three";

// Each factory returns a fresh material; callers own disposal.

const CHARCOAL = "#181715";
const STONE = "#817b73";
const IVORY = "#f1ede5";
const SILVER = "#b5b1aa";
const COBALT = "#5b7fc7";
const DEEP_COBALT = "#2a4a8f";

export function createMatteBlackMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: CHARCOAL,
    roughness: 0.95,
    metalness: 0.05,
    ...overrides,
  });
}

export function createCeramicMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: IVORY,
    roughness: 0.55,
    metalness: 0,
    ...overrides,
  });
}

export function createSilverMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: SILVER,
    roughness: 0.4,
    metalness: 0.35,
    ...overrides,
  });
}

export const materialPalette = {
  charcoal: CHARCOAL,
  stone: STONE,
  ivory: IVORY,
  silver: SILVER,
  cobalt: COBALT,
  deepCobalt: DEEP_COBALT,
};
