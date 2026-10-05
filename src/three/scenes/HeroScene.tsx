"use client";

import { SpatialScene } from "../scene/SpatialScene";
import { CameraRig } from "../camera/CameraRig";
import { StudioLighting } from "../lighting/StudioLighting";
import { Atmosphere } from "../effects/Atmosphere";
import { PrimaryMass } from "../objects/PrimaryMass";
import { ThreadController } from "../thread/ThreadController";
import { useQualityTier, type QualityConfig } from "../hooks/useQualityTier";
import { useEntrance } from "../hooks/useEntrance";
import { heroExit } from "@/thread/heroExit";

// Split out because `useEntrance` calls `useFrame`, which only works inside <Canvas>.
function HeroComposition({ quality }: { quality: QualityConfig }) {
  const entrance = useEntrance();

  return (
    <>
      <CameraRig pointerInteraction={quality.pointerInteraction} />
      <StudioLighting />
      <Atmosphere count={quality.particleCount} />
      <PrimaryMass
        radius={1.8}
        position={[2.4, 0.6, -2]}
        detail={quality.massDetail}
        pointerInteraction={quality.pointerInteraction}
        entrance={entrance}
      />
      <ThreadController
        radius={3.2}
        rise={1}
        tubeRadius={0.012}
        tubeSegments={quality.threadSegments}
        radialSegments={quality.threadRadialSegments}
        pointerInteraction={quality.pointerInteraction}
        entrance={entrance}
        exit={heroExit}
      />
    </>
  );
}

export default function HeroScene({ paused = false }: { paused?: boolean }) {
  const quality = useQualityTier();

  return (
    <SpatialScene paused={paused}>
      <HeroComposition quality={quality} />
    </SpatialScene>
  );
}
