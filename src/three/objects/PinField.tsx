"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCeramicMaterial, createMatteBlackMaterial, materialPalette } from "../materials/surfaceMaterials";
import { SpringField, type Press } from "../physics/springField";
import {
  PIN_PROTRUSION,
  PIN_RADIUS_RATIO,
  PIN_TRAVEL,
  cherryIndex,
  pinShade,
  restingImpression,
  spacingOf,
  type BedLayout,
} from "../physics/pinBed";
import type { FieldInput } from "../interaction/fieldInput";

export type PinFieldProps = {
  layout: BedLayout;
  input: FieldInput;
  /** Frozen impression, no simulation (reduced motion). */
  still?: boolean;
  castShadow?: boolean;
};

const PIN_SHAFT = 0.9;
const PLATE_DEPTH = 0.32;
const STEP = 1 / 120;
const MAX_STEPS = 6;
/** Contact depth and radius (fraction of bed width) for hover and full press. */
const HOVER = { depth: 0.1, radius: 0.1 };
const PRESS = { depth: 0.3, radius: 0.15 };
/** Maximum bed tilt in radians under a full press at the edge. */
const TILT = 0.035;

type Spring = { value: number; velocity: number };

/** Damped spring toward `target`; returns true once at rest. */
function springTo(spring: Spring, target: number, stiffness: number, damping: number, dt: number) {
  spring.velocity += (stiffness * (target - spring.value) - damping * spring.velocity) * dt;
  spring.value += spring.velocity * dt;
  const resting = Math.abs(target - spring.value) < 1e-4 && Math.abs(spring.velocity) < 1e-4;
  if (resting) {
    spring.value = target;
    spring.velocity = 0;
  }
  return resting;
}

type Pins = {
  mesh: THREE.InstancedMesh;
  baseY: number;
  /** Unshaded linear RGB per pin. */
  colors: Float32Array;
};

/** Moves each pin to its height and shades it, so the relief reads even without shadows. */
function writePins({ mesh, baseY, colors }: Pins, field: SpringField) {
  const matrices = mesh.instanceMatrix.array as Float32Array;
  const shaded = mesh.instanceColor!.array as Float32Array;
  for (let i = 0; i < field.count; i += 1) {
    const h = field.heights[i];
    matrices[i * 16 + 13] = baseY + h;
    const light = pinShade(h);
    shaded[i * 3] = colors[i * 3] * light;
    shaded[i * 3 + 1] = colors[i * 3 + 1] * light;
    shaded[i * 3 + 2] = colors[i * 3 + 2] * light;
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor!.needsUpdate = true;
}

/**
 * Ceramic pins through a matte plate, driven by a coupled spring lattice.
 * One instanced draw call; the simulation sleeps (and stops requesting frames)
 * once the bed is untouched and at rest.
 */
export function PinField({ layout, input, still = false, castShadow = true }: PinFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spacing = spacingOf(layout);
  const pinRadius = spacing * PIN_RADIUS_RATIO;
  const baseY = PIN_PROTRUSION - PIN_SHAFT / 2 - pinRadius;
  const half = layout.width / 2;

  const field = useMemo(() => {
    const springs = new SpringField({
      size: layout.size,
      spacing,
      stiffness: 38,
      damping: 3.4,
      coupling: 150,
      min: PIN_TRAVEL.min,
      max: PIN_TRAVEL.max,
    });
    if (still) springs.sculpt(restingImpression(layout.width));
    return springs;
  }, [layout, spacing, still]);

  const pins = useMemo(() => {
    const geometry = new THREE.CapsuleGeometry(pinRadius, PIN_SHAFT, 3, layout.size > 30 ? 8 : 6);
    const material = createCeramicMaterial({ color: "#ffffff", roughness: 0.5 });
    const mesh = new THREE.InstancedMesh(geometry, material, field.count);
    const matrix = new THREE.Matrix4();
    const ivory = new THREE.Color(materialPalette.ivory);
    const cherry = new THREE.Color(materialPalette.cherry);
    const accent = cherryIndex(layout);
    const colors = new Float32Array(field.count * 3);

    for (let i = 0; i < field.count; i += 1) {
      const color = i === accent ? cherry : ivory;
      mesh.setMatrixAt(i, matrix.makeTranslation(field.xs[i], baseY, field.zs[i]));
      mesh.setColorAt(i, color);
      color.toArray(colors, i * 3);
    }
    // Pins only move vertically within the plate's footprint.
    mesh.frustumCulled = false;
    mesh.receiveShadow = true;
    mesh.castShadow = castShadow;
    const result: Pins = { mesh, baseY, colors };
    writePins(result, field);
    return result;
  }, [field, layout, pinRadius, baseY, castShadow]);

  const plate = useMemo(() => {
    const margin = spacing * 1.6;
    return {
      geometry: new THREE.BoxGeometry(layout.width + margin * 2, PLATE_DEPTH, layout.width + margin * 2),
      material: createMatteBlackMaterial({ color: "#26241f", roughness: 0.85 }),
    };
  }, [layout, spacing]);

  useEffect(
    () => () => {
      pins.mesh.geometry.dispose();
      (pins.mesh.material as THREE.Material).dispose();
      pins.mesh.dispose();
    },
    [pins]
  );

  useEffect(
    () => () => {
      plate.geometry.dispose();
      plate.material.dispose();
    },
    [plate]
  );

  const sim = useRef({
    accumulator: 0,
    asleep: false,
    contact: new THREE.Vector3(),
    hasContact: false,
    presence: { value: 0, velocity: 0 },
    press: { value: 0, velocity: 0 },
    tiltX: { value: 0, velocity: 0 },
    tiltZ: { value: 0, velocity: 0 },
  });
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const bedPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -PIN_PROTRUSION), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const pressRef = useRef<Press>({ x: 0, z: 0, radius: 0, depth: 0 });

  // Simulation state lives in refs and three.js objects, mutated per frame.
  useFrame((state, frameDelta) => {
    const group = groupRef.current;
    if (still || !group) return;

    const s = sim.current;
    const dt = Math.min(frameDelta, 1 / 20);

    // Resolve the contact point in bed-local space.
    let target: THREE.Vector3 | null = null;
    if (input.present || input.pressed) {
      if (input.source === "field") {
        target = hit.set(input.field.x * half, PIN_PROTRUSION, input.field.z * half);
      } else {
        raycaster.setFromCamera(ndc.set(input.ndc.x, input.ndc.y), state.camera);
        if (raycaster.ray.intersectPlane(bedPlane, hit)) target = group.worldToLocal(hit);
      }
    }

    if (target) {
      if (!s.hasContact) s.contact.copy(target);
      else s.contact.lerp(target, 1 - Math.exp(-dt * 28));
      s.hasContact = true;
    }

    const presenceTarget = target ? 1 : 0;
    const pressTarget = target && input.pressed ? 1 : 0;
    const presenceRest = springTo(s.presence, presenceTarget, 160, 25, dt);
    const pressRest = springTo(s.press, pressTarget, 220, 24, dt);
    if (!target && s.presence.value < 1e-3) s.hasContact = false;

    const p = Math.max(0, s.press.value);
    const presence = Math.max(0, s.presence.value);
    const press = pressRef.current;
    press.x = s.contact.x;
    press.z = s.contact.z;
    press.radius = layout.width * (HOVER.radius + (PRESS.radius - HOVER.radius) * p);
    press.depth = HOVER.depth * presence + (PRESS.depth - HOVER.depth) * p;

    // A firm press tips the bed slightly toward the contact.
    const tiltXRest = springTo(s.tiltX, (s.contact.z / half) * TILT * p, 70, 8, dt);
    const tiltZRest = springTo(s.tiltZ, (-s.contact.x / half) * TILT * p, 70, 8, dt);
    group.rotation.x = s.tiltX.value;
    group.rotation.z = s.tiltZ.value;

    s.accumulator = Math.min(s.accumulator + dt, STEP * MAX_STEPS);
    while (s.accumulator >= STEP) {
      field.step(STEP, press.depth > 1e-4 ? press : null);
      s.accumulator -= STEP;
    }

    const idle = presenceRest && pressRest && presenceTarget === 0 && tiltXRest && tiltZRest;
    s.asleep = idle && field.settle();
    writePins(pins, field);

    if (!s.asleep) state.invalidate();
  });

  return (
    <group ref={groupRef}>
      <primitive object={pins.mesh} />
      <mesh
        geometry={plate.geometry}
        material={plate.material}
        position={[0, -PLATE_DEPTH / 2, 0]}
        receiveShadow
      />
    </group>
  );
}
