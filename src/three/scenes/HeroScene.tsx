"use client";

import { SpatialScene } from "../scene/SpatialScene";
import { StarryParticles } from "../painting/StarryParticles";
import { useQualityTier } from "../hooks/useQualityTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The particle painting. Renders on demand: frames are drawn during the
 * opening assembly and while scroll progress changes, never while idle.
 */
export default function HeroScene({ paused = false }: { paused?: boolean }) {
  const quality = useQualityTier();
  const reducedMotion = useReducedMotion();

  return (
    <SpatialScene paused={paused} frameloop="demand">
      <StarryParticles count={quality.heroParticles} animate={!reducedMotion} />
    </SpatialScene>
  );
}
