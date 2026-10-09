"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createPaintingMaterial, type PaintingUniforms } from "./paintingMaterial";
import { generateStarryField, loadStarrySource, paintingRect, whenIdle, type StarryField } from "./starryField";
import { heroState, subscribeHeroState } from "./heroState";

export type StarryParticlesProps = {
  count: number;
  /** False under reduced motion: the painting stays fully formed and nothing animates. */
  animate: boolean;
};

/** Seconds for the opening assembly; it then stops, and frames render only on scroll. */
const INTRO_DURATION = 2.4;
/** Dissociation the painting assembles from on load. */
const INTRO_FROM = 0.3;

function useStarryField(count: number): StarryField | null {
  const [field, setField] = useState<{ count: number; data: StarryField } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cancelIdle = () => {};
    loadStarrySource()
      .then((source) => {
        if (cancelled) return;
        cancelIdle = whenIdle(() => setField({ count, data: generateStarryField(source, count) }));
      })
      .catch(() => {
        // The DOM hero stays readable without the painting; nothing to recover.
      });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [count]);

  return field && field.count === count ? field.data : null;
}

/**
 * The hero painting: one `THREE.Points` draw of tens of thousands of flecks.
 * Geometry is built once per particle count. Per-frame work is a few uniform
 * writes; the vertex shader does all motion.
 */
export function StarryParticles({ count, animate }: StarryParticlesProps) {
  const field = useStarryField(count);
  const material = useMemo(() => createPaintingMaterial().material, []);
  const invalidate = useThree((state) => state.invalidate);
  const pointsRef = useRef<THREE.Points>(null);
  const motion = useRef({ shown: 0, intro: animate ? 0 : 1 });

  const geometry = useMemo(() => {
    if (!field) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(field.home, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(field.color, 3));
    g.setAttribute("aShape", new THREE.BufferAttribute(field.shape, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(field.seed, 4));
    g.setAttribute("aGlow", new THREE.BufferAttribute(field.glow, 1));
    return g;
  }, [field]);

  useEffect(() => () => geometry?.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  // Scroll and layout changes only request a frame; idle means no rendering.
  useEffect(() => subscribeHeroState(() => invalidate()), [invalidate]);

  useEffect(() => {
    motion.current.intro = animate ? 0 : 1;
    invalidate();
  }, [animate, geometry, invalidate]);

  useFrame((state, rawDelta) => {
    const points = pointsRef.current;
    if (!points) return;
    const uniforms = (points.material as THREE.ShaderMaterial).uniforms as PaintingUniforms;
    const m = motion.current;
    // On-demand frames can arrive after long idle gaps; the cap still lets
    // the intro keep real time on slow devices.
    const delta = Math.min(rawDelta, 1 / 15);
    let settling = false;

    const { width, height } = state.size;
    const rect = paintingRect(width, height);
    uniforms.uViewport.value.set(width, height);
    uniforms.uRect.value.set(rect.x, rect.y, rect.width, rect.height);
    uniforms.uScale.value = Math.sqrt(width * height) * 0.9;
    uniforms.uPixelRatio.value = state.viewport.dpr;

    const text = heroState.text;
    if (text) uniforms.uText.value.set(text.x, text.y, text.width, text.height);
    else uniforms.uText.value.set(0, 0, 0, 0);

    if (m.intro < 1) {
      m.intro = Math.min(1, m.intro + delta / INTRO_DURATION);
      settling = true;
    }
    const introEase = 1 - (1 - m.intro) ** 3;

    // Light damping on top of the smooth scroll; it converges to the exact
    // scroll-derived value, so rest states stay deterministic.
    const target = animate ? heroState.progress : 0;
    const diff = target - m.shown;
    if (Math.abs(diff) > 1e-4) {
      m.shown += diff * (1 - Math.exp(-delta * 12));
      settling = true;
    } else {
      m.shown = target;
    }

    uniforms.uProgress.value = Math.max(m.shown, INTRO_FROM * (1 - introEase));
    uniforms.uOpacity.value = Math.min(1, m.intro * 2.5);

    if (settling) invalidate();
  });

  if (!geometry) return null;

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
