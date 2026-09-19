"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export type QualityTier = "high" | "medium" | "low";

export type QualityConfig = {
  tier: QualityTier;
  /** Canvas devicePixelRatio range. */
  dpr: [number, number];
  /** Icosahedron subdivision detail for the primary mass. */
  massDetail: number;
  /** Tube geometry segment count along the filament. */
  threadSegments: number;
  /** Radial segment count around the filament tube. */
  threadRadialSegments: number;
  /** Sparkle/particle count for the atmosphere. */
  particleCount: number;
  /** Fog density — higher reads as "closer" atmosphere. */
  fogDensity: number;
  /** Whether pointer-driven drift is enabled (skipped on touch-first/low tiers). */
  pointerInteraction: boolean;
};

const TIERS: Record<QualityTier, QualityConfig> = {
  high: {
    tier: "high",
    dpr: [1, 1.5],
    massDetail: 2,
    threadSegments: 160,
    threadRadialSegments: 8,
    particleCount: 90,
    fogDensity: 0.035,
    pointerInteraction: true,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.25],
    massDetail: 2,
    threadSegments: 96,
    threadRadialSegments: 6,
    particleCount: 45,
    fogDensity: 0.045,
    pointerInteraction: true,
  },
  low: {
    tier: "low",
    dpr: [1, 1],
    massDetail: 1,
    threadSegments: 48,
    threadRadialSegments: 5,
    particleCount: 0,
    fogDensity: 0.06,
    pointerInteraction: false,
  },
};

/**
 * Resolves a device-aware quality tier so every part of the spatial engine
 * (geometry detail, particle count, dpr, interaction) scales together
 * instead of each component guessing independently.
 */
export function useQualityTier(): QualityConfig {
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) return TIERS.low;
  if (isTablet) return TIERS.medium;
  return TIERS.high;
}
