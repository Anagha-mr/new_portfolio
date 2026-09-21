import type { ThreadConfig } from "./presets";

export type ThreadRunnerOptions = {
  root: HTMLElement;
  path: SVGPathElement;
  gradient: SVGLinearGradientElement;
  cap: SVGCircleElement | null;
  anchors: Map<string, HTMLElement>;
  config: ThreadConfig;
  /** When false, draws one fully revealed static frame and never runs a loop. */
  animated: boolean;
  /** Enables the hover/focus pull toward the active anchor. */
  interactive: boolean;
};

export type ThreadRunner = {
  setActive(id: string | null): void;
  /** Re-measure after anchors or layout change. */
  invalidate(): void;
  destroy(): void;
};

const STIFFNESS = 90;
const DAMPING = 12.5;
/** Viewport fraction down to which the thread is drawn as the layer scrolls in. */
const HEAD_LINE = 0.88;
const WAVELENGTH = 520;
/** Room needed beside the layer; below this the thread is not drawn. */
const MIN_SPACE = 8;
const MAX_OFFSET = 28;
const LANDING_IMPULSE = 46;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const fixed = (value: number) => value.toFixed(2);

/**
 * Drives one SVG path by writing attributes directly (no React state).
 * The loop only runs while scroll, hover or a spring is still moving.
 */
export function createThreadRunner({
  root,
  path,
  gradient,
  cap,
  anchors,
  config,
  animated,
  interactive,
}: ThreadRunnerOptions): ThreadRunner {
  const sign = config.side === "left" ? 1 : -1;

  let ys: number[] = [];
  let ids: (string | null)[] = [];
  let rest: number[] = [];
  let offsetX: number[] = [];
  let velocity: number[] = [];
  let target: number[] = [];

  let top = 0;
  let bottom = 0;
  let pullPx = 0;
  let usable = true;
  let active: string | null = null;

  let reveal = animated ? 0 : 1;
  let revealTarget = reveal;
  let intensity = 0;
  let intensityTarget = 0;
  let landed = false;

  let near = !animated;
  let frame = 0;
  let last = 0;

  function refreshTargets() {
    const activeIndex = interactive && active ? ids.indexOf(active) : -1;
    for (let i = 0; i < ys.length; i += 1) {
      const isEnd = i === 0 || i === ys.length - 1;
      const distance = activeIndex < 0 ? Infinity : Math.abs(i - activeIndex);
      const weight = isEnd ? 0 : distance === 0 ? 1 : distance === 1 ? 0.38 : 0;
      target[i] = sign * pullPx * weight;
    }
  }

  function measure() {
    const rect = root.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const space = config.side === "left" ? rect.left : viewportWidth - rect.right;

    usable = space >= MIN_SPACE;
    if (!usable) return;

    const offset = Math.min(space * 0.5, MAX_OFFSET);
    const baseX = config.side === "left" ? -offset : rect.width + offset;
    top = config.start.px + config.start.frac * rect.height;
    bottom = config.end.px + config.end.frac * rect.height;

    const interior: { y: number; id: string | null }[] = [];
    if (config.anchored) {
      anchors.forEach((el, id) => {
        const box = el.getBoundingClientRect();
        const y = box.top - rect.top + box.height / 2;
        if (y > top + 24 && y < bottom - 24) interior.push({ y, id });
      });
      interior.sort((a, b) => a.y - b.y);
    } else {
      const count = Math.max(1, Math.round((bottom - top) / config.spacing));
      for (let i = 1; i < count; i += 1) {
        interior.push({ y: top + ((bottom - top) * i) / count, id: null });
      }
    }

    const points = [{ y: top, id: null }, ...interior, { y: bottom, id: null }];
    if (points.length !== ys.length) {
      offsetX = points.map(() => 0);
      velocity = points.map(() => 0);
      target = points.map(() => 0);
    }
    ys = points.map((point) => point.y);
    ids = points.map((point) => point.id);

    const amplitude = Math.min(config.amplitude, offset * 0.35);
    rest = ys.map((y) => {
      const t = (y - top) / Math.max(1, bottom - top);
      const decay = config.settle ? 1 - 0.85 * t : 1;
      return baseX + amplitude * decay * Math.sin((y / WAVELENGTH) * Math.PI * 2 + config.phase);
    });
    pullPx = Math.min(config.pull, offset * 0.6);

    gradient.setAttribute("y1", fixed(top));
    gradient.setAttribute("y2", fixed(bottom));
    refreshTargets();
  }

  function paint() {
    if (!usable || ys.length < 2) {
      path.style.opacity = "0";
      if (cap) cap.style.opacity = "0";
      return;
    }

    const x = ys.map((_, i) => rest[i] + offsetX[i]);
    let d = `M${fixed(x[0])} ${fixed(ys[0])}`;
    for (let i = 0; i < ys.length - 1; i += 1) {
      const j = Math.max(0, i - 1);
      const k = Math.min(ys.length - 1, i + 2);
      const c1x = x[i] + (x[i + 1] - x[j]) / 6;
      const c1y = ys[i] + (ys[i + 1] - ys[j]) / 6;
      const c2x = x[i + 1] - (x[k] - x[i]) / 6;
      const c2y = ys[i + 1] - (ys[k] - ys[i]) / 6;
      d += `C${fixed(c1x)} ${fixed(c1y)} ${fixed(c2x)} ${fixed(c2y)} ${fixed(x[i + 1])} ${fixed(ys[i + 1])}`;
    }
    path.setAttribute("d", d);

    if (reveal >= 0.999) path.removeAttribute("stroke-dasharray");
    else path.setAttribute("stroke-dasharray", `${reveal.toFixed(4)} 2`);

    const peak = Math.min(1, config.opacity + 0.3);
    path.style.opacity = reveal > 0.004 ? String(config.opacity + (peak - config.opacity) * intensity) : "0";
    path.setAttribute("stroke-width", fixed(config.width + 0.45 * intensity));

    if (cap) {
      const end = ys.length - 1;
      cap.setAttribute("cx", fixed(x[end]));
      cap.setAttribute("cy", fixed(ys[end]));
      cap.style.opacity = String(clamp01((reveal - 0.94) / 0.06) * config.opacity);
    }
  }

  function scrollTarget() {
    const rect = root.getBoundingClientRect();
    const head = window.innerHeight * HEAD_LINE - rect.top;
    return clamp01((head - top) / Math.max(1, bottom - top));
  }

  function tick(now: number) {
    frame = 0;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let moving = false;

    if (usable) {
      revealTarget = scrollTarget();
      reveal += (revealTarget - reveal) * (1 - Math.exp(-dt * 5));
      if (Math.abs(revealTarget - reveal) < 0.0008) reveal = revealTarget;
      else moving = true;

      if (config.settle) {
        if (reveal < 0.5) landed = false;
        if (!landed && reveal > 0.985) {
          landed = true;
          for (let i = 1; i < ys.length - 1; i += 1) velocity[i] += sign * LANDING_IMPULSE * (i / ys.length);
        }
      }

      for (let i = 0; i < ys.length; i += 1) {
        velocity[i] += (STIFFNESS * (target[i] - offsetX[i]) - DAMPING * velocity[i]) * dt;
        offsetX[i] += velocity[i] * dt;
        if (Math.abs(velocity[i]) > 0.02 || Math.abs(target[i] - offsetX[i]) > 0.02) {
          moving = true;
        } else {
          offsetX[i] = target[i];
          velocity[i] = 0;
        }
      }

      intensity += (intensityTarget - intensity) * (1 - Math.exp(-dt * 6));
      if (Math.abs(intensityTarget - intensity) < 0.005) intensity = intensityTarget;
      else moving = true;
    }

    paint();
    if (moving) frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function refresh() {
    measure();
    if (animated) wake();
    else paint();
  }

  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(root);
  window.addEventListener("resize", refresh);

  const onScroll = () => {
    if (near) wake();
  };
  let intersectionObserver: IntersectionObserver | null = null;
  if (animated) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) wake();
      },
      { rootMargin: "50% 0px" }
    );
    intersectionObserver.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  refresh();

  return {
    setActive(id) {
      if (!interactive || id === active) return;
      active = id;
      intensityTarget = id ? 1 : 0;
      refreshTargets();
      wake();
    },
    invalidate: refresh,
    destroy() {
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", onScroll);
    },
  };
}
