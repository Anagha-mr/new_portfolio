"use client";

import { useEffect, useMemo, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, MathUtils, Plane, Vector3, type LineSegments, type PerspectiveCamera as ThreeCamera } from "three";
import { SpatialScene } from "../scene/SpatialScene";
import { usePointer } from "../hooks/usePointer";
import { useQualityTier } from "../hooks/useQualityTier";
import { Room, type RoomClip } from "../objects/Room";

const ROOM_MIN_X = -4.3;
const ROOM_SPAN = 8.6;
/** Seconds for one structure-to-result sweep and back. */
const CYCLE = 18;
const MANUAL_HOLD_MS = 3500;

const smooth = (t: number) => t * t * (3 - 2 * t);

/** 0..1 ping-pong that rests briefly at both ends. */
function sweepProgress(seconds: number): number {
  const phase = (seconds % CYCLE) / CYCLE;
  const triangle = 1 - Math.abs(phase * 2 - 1);
  return smooth(MathUtils.clamp((triangle - 0.12) / 0.76, 0, 1));
}

function RoomComposition({ interactive }: { interactive: boolean }) {
  const { gl, size } = useThree();
  const pointer = usePointer();
  const cameraRef = useRef<ThreeCamera>(null);
  const edgeRef = useRef<LineSegments>(null);
  const sweep = useRef(ROOM_MIN_X);
  const manualUntil = useRef(0);
  const manualTarget = useRef(0);
  const lookAt = useMemo(() => new Vector3(), []);

  const clip = useMemo<RoomClip>(
    () => ({
      finished: new Plane(new Vector3(-1, 0, 0), ROOM_MIN_X),
      structure: new Plane(new Vector3(1, 0, 0), -ROOM_MIN_X),
    }),
    []
  );

  // Where the sweep plane meets the floor and the back wall.
  const edgeGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute([0, 0.01, -3, 0, 0.01, 4, 0, 0, -2.98, 0, 3.6, -2.98], 3)
    );
    return geometry;
  }, []);

  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  useEffect(() => {
    // Three.js state is configured imperatively.
    // eslint-disable-next-line react-hooks/immutability
    gl.localClippingEnabled = true;
  }, [gl]);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (event: PointerEvent) => {
      manualTarget.current = ROOM_MIN_X + (event.clientX / window.innerWidth) * ROOM_SPAN;
      manualUntil.current = performance.now() + MANUAL_HOLD_MS;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  // The clip planes are three.js objects updated imperatively each frame.
  /* eslint-disable react-hooks/immutability */
  useFrame((state) => {
    const manual = performance.now() < manualUntil.current;
    const target = manual
      ? manualTarget.current
      : ROOM_MIN_X + sweepProgress(state.clock.elapsedTime) * ROOM_SPAN;
    sweep.current += (target - sweep.current) * 0.06;

    clip.finished.constant = sweep.current;
    clip.structure.constant = -sweep.current;
    if (edgeRef.current) edgeRef.current.position.x = sweep.current;

    const camera = cameraRef.current;
    if (!camera) return;
    const portrait = size.width / size.height < 0.9;
    const pull = portrait ? 1.5 : 1;
    camera.position.set(
      4.6 * pull + pointer.current.x * 0.35,
      2.7 * pull + pointer.current.y * 0.2,
      8.4 * pull
    );
    camera.lookAt(lookAt.set(portrait ? 0 : -0.6, 1.1, -0.4));
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={38} position={[4.6, 2.7, 8.4]} />
      <ambientLight intensity={0.85} color="#b5b1aa" />
      <directionalLight position={[3, 6, 5]} intensity={1.9} color="#f1ede5" />
      <pointLight position={[1.2, 2.3, -2.2]} intensity={7} distance={6} decay={2} color="#f1ede5" />
      <pointLight position={[-1, 1.2, 3.5]} intensity={0.3} distance={9} decay={2} color="#2a4a8f" />

      <Room clip={clip} />

      <lineSegments ref={edgeRef} geometry={edgeGeometry} position={[ROOM_MIN_X, 0, 0]}>
        <lineBasicMaterial color="#5b7fc7" transparent opacity={0.8} />
      </lineSegments>
    </>
  );
}

export default function RoomScene({ paused = false }: { paused?: boolean }) {
  const quality = useQualityTier();

  return (
    <SpatialScene paused={paused}>
      <RoomComposition interactive={quality.pointerInteraction} />
    </SpatialScene>
  );
}
