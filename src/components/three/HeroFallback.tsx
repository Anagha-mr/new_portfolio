"use client";

import { useEffect, useRef } from "react";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { generateStarryField, loadStarrySource, paintingRect, whenIdle } from "@/three/painting/starryField";
import { heroState, subscribeHeroState } from "@/three/painting/heroState";

/** Fewer flecks than WebGL; drawn once per resize. */
const FALLBACK_PARTICLES = 60000;
/** Matches the WebGL shader's dimming behind the typography. */
const TEXT_DIM = 0.7;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Static stand-in for the hero's particle painting when WebGL is unavailable:
 * the same deterministic particle field, palette and composition, drawn once
 * onto a 2D canvas, fully formed and without motion.
 */
export function HeroFallback() {
  const supported = useWebGLSupport();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (supported || !canvas) return;

    let cancelled = false;
    let cancelIdle = () => {};
    let frame = 0;
    let field: ReturnType<typeof generateStarryField> | null = null;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!field || !ctx) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(width * dpr);
      const H = Math.round(height * dpr);
      canvas.width = W;
      canvas.height = H;

      const rect = paintingRect(width, height);
      const text = heroState.text;
      const pad = 0.09 * Math.sqrt(width * height) * 0.9;
      const { home, color, shape, glow } = field;
      // Flecks are splatted straight into pixels and written with one
      // putImageData. Tens of thousands of path fills can stall software
      // rasterisers, the usual reason this fallback runs at all.
      const image = ctx.createImageData(W, H);
      const px = image.data;

      for (let i = 0; i < field.count; i++) {
        const x = rect.x + home[i * 3] * rect.width;
        const y = rect.y + home[i * 3 + 1] * rect.height;
        const screenY = y / height;
        let alpha = (0.4 + 0.6 * smoothstep(0.02, 0.12, screenY)) * smoothstep(1, 0.92, screenY);
        if (text) {
          const qx = Math.abs(x - (text.x + text.width / 2)) - text.width / 2;
          const qy = Math.abs(y - (text.y + text.height / 2)) - text.height / 2;
          const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
          alpha *= 1 - TEXT_DIM * (1 - smoothstep(-pad * 0.5, pad, d));
        }
        // Star halos: faint, soft and sized to the painting, as in the shader.
        const soft = glow[i] > 0;
        if (soft) alpha *= glow[i];
        if (alpha < (soft ? 0.002 : 0.02)) continue;

        // Same elongated fleck as the shader: an ellipse along the stroke, soft edge.
        const size = (soft ? shape[i * 3 + 1] * rect.height : shape[i * 3 + 1]) * dpr;
        const elongation = soft ? 1 : shape[i * 3 + 2];
        const rotation = Math.atan2(Math.sin(shape[i * 3]) * rect.height, Math.cos(shape[i * 3]) * rect.width);
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const rx = Math.max(0.5, (size * elongation) / 2);
        const ry = Math.max(0.5, size / 2);
        const cx = x * dpr;
        const cy = y * dpr;
        const reach = Math.ceil(rx);
        const r = color[i * 3] * 255;
        const g = color[i * 3 + 1] * 255;
        const b = color[i * 3 + 2] * 255;

        for (let py = Math.max(0, Math.floor(cy - reach)); py <= Math.min(H - 1, Math.ceil(cy + reach)); py++) {
          for (let pxX = Math.max(0, Math.floor(cx - reach)); pxX <= Math.min(W - 1, Math.ceil(cx + reach)); pxX++) {
            const dx = pxX + 0.5 - cx;
            const dy = py + 0.5 - cy;
            const along = (dx * cos + dy * sin) / rx;
            const across = (-dx * sin + dy * cos) / ry;
            const d = Math.sqrt(along * along + across * across);
            const coverage = soft ? Math.exp(-d * d * 4) * (1 - smoothstep(0.85, 1, d)) : 1 - smoothstep(0.45, 1, d);
            const a = coverage * alpha;
            if (a <= 0.004) continue;
            // Source-over onto straight-alpha pixels.
            const o = (py * W + pxX) * 4;
            const da = px[o + 3] / 255;
            const outA = a + da * (1 - a);
            const keep = (da * (1 - a)) / outA;
            px[o] = r * (a / outA) + px[o] * keep;
            px[o + 1] = g * (a / outA) + px[o + 1] * keep;
            px[o + 2] = b * (a / outA) + px[o + 2] * keep;
            px[o + 3] = outA * 255;
          }
        }
      }

      ctx.putImageData(image, 0, 0);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    loadStarrySource()
      .then((source) => {
        if (cancelled) return;
        cancelIdle = whenIdle(() => {
          field = generateStarryField(source, FALLBACK_PARTICLES);
          schedule();
        });
      })
      .catch(() => {
        // Typography stays readable on the dark hero without the painting.
      });

    const observer = new ResizeObserver(schedule);
    observer.observe(canvas);
    // Only layout matters here; the fallback never dissociates, so scroll progress is ignored.
    let lastText = heroState.text;
    const unsubscribe = subscribeHeroState(() => {
      if (heroState.text === lastText) return;
      lastText = heroState.text;
      schedule();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cancelAnimationFrame(frame);
      observer.disconnect();
      unsubscribe();
    };
  }, [supported]);

  if (supported) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
