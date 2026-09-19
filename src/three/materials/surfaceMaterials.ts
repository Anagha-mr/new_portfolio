import * as THREE from "three";

/**
 * Reusable material language for the spatial engine. Each factory returns a
 * fresh MeshStandardMaterial instance — callers own disposal (typically via
 * `useMemo` + an unmount effect) since materials aren't shared across
 * meshes here. Kept deliberately small: lighting, not material trickery,
 * is meant to carry most of the visual weight.
 */

const CHARCOAL = "#181715";
const STONE = "#817b73";
const IVORY = "#f1ede5";
const SILVER = "#b5b1aa";
const CHERRY = "#c1121f";
const DEEP_CHERRY = "#850e17";

export function createMatteBlackMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: CHARCOAL,
    roughness: 0.95,
    metalness: 0.05,
    ...overrides,
  });
}

export function createCharcoalMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: "#3c3934",
    roughness: 0.75,
    metalness: 0.14,
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

export function createCherryMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: CHERRY,
    roughness: 0.3,
    metalness: 0.1,
    emissive: DEEP_CHERRY,
    emissiveIntensity: 0.08,
    ...overrides,
  });
}

export const materialPalette = {
  charcoal: CHARCOAL,
  stone: STONE,
  ivory: IVORY,
  silver: SILVER,
  cherry: CHERRY,
  deepCherry: DEEP_CHERRY,
};
