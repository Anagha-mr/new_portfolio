"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export type QualityTier = "high" | "medium" | "low";

export type QualityConfig = {
  tier: QualityTier;
  dpr: [number, number];
  massDetail: number;
  threadSegments: number;
  threadRadialSegments: number;
  particleCount: number;
  fogDensity: number;
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

/** Single device-aware tier so geometry, particles, dpr and interaction scale together. */
export function useQualityTier(): QualityConfig {
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) return TIERS.low;
  if (isTablet) return TIERS.medium;
  return TIERS.high;
}
