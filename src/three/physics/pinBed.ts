import type { QualityTier } from "../hooks/useQualityTier";

/** Shared proportions of the pin bed, used by the WebGL scene and the SVG fallback. */
export type BedLayout = {
  /** Pins per side. */
  size: number;
  /** Side length of the pin grid in world units. */
  width: number;
};

export const BED_LAYOUTS: Record<QualityTier, BedLayout> = {
  high: { size: 34, width: 5.2 },
  medium: { size: 30, width: 4.8 },
  low: { size: 22, width: 4.2 },
};

/** Height of a resting pin's tip above the plate. */
export const PIN_PROTRUSION = 0.34;
/** Pin radius as a fraction of grid spacing. */
export const PIN_RADIUS_RATIO = 0.3;
/** How far a pin can be pushed in, or overshoot out. */
export const PIN_TRAVEL = { min: -0.3, max: 0.14 };

/** Camera elevation above the bed, shared so the SVG drawing matches the 3D view. */
export const VIEW_ELEVATION_DEG = 56;

/** Brightness of a pin at height `h`: pressed pins fall into shadow, raised ones catch light. */
export function pinShade(h: number): number {
  return Math.min(1.08, Math.max(0.3, 1 + h * 2.4));
}

/** Grid position of the single cherry pin, as fractions of the side. */
export const CHERRY_PIN = { col: 0.62, row: 0.4 };

export function spacingOf(layout: BedLayout): number {
  return layout.width / (layout.size - 1);
}

export function cherryIndex(layout: BedLayout): number {
  const col = Math.round(CHERRY_PIN.col * (layout.size - 1));
  const row = Math.round(CHERRY_PIN.row * (layout.size - 1));
  return row * layout.size + col;
}

/**
 * A single frozen press with its first rebound ring, scaled to the bed.
 * Used for the static views (reduced motion and the no-WebGL fallback).
 */
export function restingImpression(width: number) {
  const cx = -0.12 * width;
  const cz = 0.06 * width;
  const core = 0.13 * width;
  const ring = 0.22 * width;
  const ringWidth = 0.06 * width;

  return (x: number, z: number) => {
    const r = Math.hypot(x - cx, z - cz);
    const dent = -0.24 * Math.exp(-((r / core) ** 2));
    const rebound = 0.05 * Math.exp(-(((r - ring) / ringWidth) ** 2));
    return dent + rebound;
  };
}
