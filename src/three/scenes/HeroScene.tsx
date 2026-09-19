"use client";

import { SpatialScene } from "../scene/SpatialScene";
import { CameraRig } from "../camera/CameraRig";
import { StudioLighting } from "../lighting/StudioLighting";
import { Atmosphere } from "../effects/Atmosphere";
import { PrimaryMass } from "../objects/PrimaryMass";
import { ThreadController } from "../thread/ThreadController";
import { useQualityTier } from "../hooks/useQualityTier";

/**
 * Concrete hero composition built on the reusable spatial engine. Sprint 05
 * composes the final cinematic hero using the same primitives — this stays
 * the deliberately quiet, non-choreographed baseline.
 */
export default function HeroScene() {
  const quality = useQualityTier();

  return (
    <SpatialScene>
      <CameraRig pointerInteraction={quality.pointerInteraction} />
      <StudioLighting />
      <Atmosphere count={quality.particleCount} />
      <PrimaryMass
        radius={1.8}
        position={[2.4, 0.6, -2]}
        detail={quality.massDetail}
        pointerInteraction={quality.pointerInteraction}
      />
      <ThreadController
        radius={3.2}
        rise={1}
        tubeRadius={0.012}
        tubeSegments={quality.threadSegments}
        radialSegments={quality.threadRadialSegments}
        pointerInteraction={quality.pointerInteraction}
      />
    </SpatialScene>
  );
}
