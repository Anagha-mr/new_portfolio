"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { MathUtils, type PerspectiveCamera as ThreeCamera } from "three";
import { SpatialScene } from "../scene/SpatialScene";
import { useQualityTier, type QualityConfig } from "../hooks/useQualityTier";
import { PinField } from "../objects/PinField";
import { BED_LAYOUTS, VIEW_ELEVATION_DEG } from "../physics/pinBed";
import type { FieldInput } from "../interaction/fieldInput";

const DISTANCE = 9.5;
const ELEVATION = MathUtils.degToRad(VIEW_ELEVATION_DEG);

/**
 * Vertical fov that keeps the bed, with generous margin, inside any aspect
 * ratio. Landscape leaves more air so it reads as an object, not a backdrop.
 */
function fitFov(width: number, aspect: number): number {
  const margin = aspect < 1 ? 0.7 : 1.05;
  const byWidth = 2 * Math.atan((width * margin) / (DISTANCE * aspect));
  const byDepth = 2 * Math.atan((width * Math.sin(ELEVATION) * margin * 1.15) / DISTANCE);
  return MathUtils.clamp(MathUtils.radToDeg(Math.max(byWidth, byDepth)), 24, 62);
}

type CompositionProps = { quality: QualityConfig; input: FieldInput; still: boolean };

function FieldComposition({ quality, input, still }: CompositionProps) {
  const { size, invalidate } = useThree();
  const cameraRef = useRef<ThreeCamera>(null);
  const layout = BED_LAYOUTS[quality.tier];
  const shadows = quality.tier !== "low";

  useEffect(() => {
    if (still) return;
    // The input object is a plain mutable channel shared with the DOM handlers.
    // eslint-disable-next-line react-hooks/immutability
    input.wake = invalidate;
    return () => {
      input.wake = () => {};
    };
  }, [input, invalidate, still]);

  useLayoutEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const aspect = size.width / Math.max(size.height, 1);
    const portrait = aspect < 1;
    camera.fov = fitFov(layout.width, aspect);
    camera.position.set(0, DISTANCE * Math.sin(ELEVATION), DISTANCE * Math.cos(ELEVATION));
    // Aim slightly in front of the bed on landscape so it sits above the caption.
    camera.lookAt(0, 0, portrait ? 0 : layout.width * 0.1);
    camera.updateProjectionMatrix();
    invalidate();
  }, [size, layout, invalidate]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={36} position={[0, 7.3, 6.1]} />
      <ambientLight intensity={0.55} color="#b5b1aa" />
      <directionalLight
        position={[-3.2, 6.5, 3.4]}
        intensity={1.7}
        color="#f1ede5"
        castShadow={shadows}
        shadow-mapSize-width={quality.tier === "high" ? 2048 : 1024}
        shadow-mapSize-height={quality.tier === "high" ? 2048 : 1024}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-radius={3}
        shadow-blurSamples={8}
      />
      <PinField layout={layout} input={input} still={still} castShadow={shadows} />
    </>
  );
}

export type FieldSceneProps = {
  input: FieldInput;
  /** Frozen view with no simulation (reduced motion). */
  still?: boolean;
  paused?: boolean;
};

export default function FieldScene({ input, still = false, paused = false }: FieldSceneProps) {
  const quality = useQualityTier();

  return (
    <SpatialScene frameloop="demand" paused={paused}>
      <FieldComposition quality={quality} input={input} still={still} />
    </SpatialScene>
  );
}
