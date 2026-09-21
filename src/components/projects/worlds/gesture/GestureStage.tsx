"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buildHand, CONNECTIONS, INDEX_TIP, LANDMARK_COUNT, POSES, type Point } from "./handModel";

const VIEW = { w: 400, h: 420, wrist: { x: 200, y: 380 }, scale: 165 };
const TRAIL_LENGTH = 26;
const MANUAL_HOLD_MS = 2600;

/** Interface elements as percentages of the panel; used for both layout and hit testing. */
const BUTTONS = [
  { left: 8, top: 10, width: 26, height: 15 },
  { left: 37, top: 10, width: 26, height: 15 },
  { left: 66, top: 10, width: 26, height: 15 },
];

type Phase =
  | { kind: "move"; target: Point; duration: number }
  | { kind: "click"; duration: number }
  | { kind: "open"; target: Point; duration: number };

/** Passive demonstration loop: point, click, point, click, open palm. */
const SCRIPT: Phase[] = [
  { kind: "move", target: { x: 0.21, y: 0.175 }, duration: 1.7 },
  { kind: "click", duration: 1 },
  { kind: "move", target: { x: 0.79, y: 0.175 }, duration: 1.7 },
  { kind: "click", duration: 1 },
  { kind: "open", target: { x: 0.5, y: 0.7 }, duration: 2.2 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const approach = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

const toSvg = (p: Point): Point => ({
  x: VIEW.wrist.x + p.x * VIEW.scale,
  y: VIEW.wrist.y + p.y * VIEW.scale,
});

/** Body (landmarks) → signal → interface. Driven by one rAF loop that writes to DOM/SVG refs, never React state. */
export function GestureStage({ latency }: { latency: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPolylineElement>(null);
  const packetsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonsRef = useRef<(HTMLDivElement | null)[]>([]);

  const inView = useInView(stageRef);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    const paintHand = (points: Point[]) => {
      CONNECTIONS.forEach(([a, b], i) => {
        const line = linesRef.current[i];
        if (!line) return;
        const pa = toSvg(points[a]);
        const pb = toSvg(points[b]);
        line.setAttribute("x1", pa.x.toFixed(1));
        line.setAttribute("y1", pa.y.toFixed(1));
        line.setAttribute("x2", pb.x.toFixed(1));
        line.setAttribute("y2", pb.y.toFixed(1));
      });
      points.forEach((point, i) => {
        const dot = dotsRef.current[i];
        if (!dot) return;
        const p = toSvg(point);
        dot.setAttribute("cx", p.x.toFixed(1));
        dot.setAttribute("cy", p.y.toFixed(1));
      });
    };

    const paintCursor = (x: number, y: number) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${x * 100}%`;
        cursor.style.top = `${y * 100}%`;
      }
    };

    const state = {
      curls: { ...POSES.point },
      angle: 0,
      cursor: { x: 0.5, y: 0.45 },
      pinch: 0,
    };
    const trail: Point[] = [];

    const paintTrail = () => {
      trailRef.current?.setAttribute(
        "points",
        trail.map((p) => `${(p.x * 100).toFixed(1)},${(p.y * 100).toFixed(1)}`).join(" ")
      );
    };

    if (reducedMotion) {
      state.cursor = { x: 0.62, y: 0.42 };
      state.angle = 0.14;
      paintHand(buildHand(POSES.point, state.angle));
      paintCursor(state.cursor.x, state.cursor.y);
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const t = i / (TRAIL_LENGTH - 1);
        trail.push({ x: 0.25 + t * 0.37, y: 0.7 - Math.sin(t * Math.PI * 0.9) * 0.28 });
      }
      paintTrail();
      return;
    }

    paintHand(buildHand(POSES.point, 0));
    paintCursor(state.cursor.x, state.cursor.y);
    if (!inView) return;

    let hovered = -1;
    let clicked = false;
    const ring = ringRef.current;
    const buttons = buttonsRef.current;
    const click = () => {
      if (ring) {
        ring.style.left = `${state.cursor.x * 100}%`;
        ring.style.top = `${state.cursor.y * 100}%`;
        gsap.fromTo(ring, { scale: 0.3, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: "expo.out" });
      }
      const target = hovered >= 0 ? buttonsRef.current[hovered] : null;
      if (target) {
        target.dataset.pressed = "true";
        window.setTimeout(() => delete target.dataset.pressed, 260);
      }
    };

    let manualUntil = 0;
    const manual = { x: 0.5, y: 0.45, down: false };
    const onMove = (event: PointerEvent) => {
      const panel = panelRef.current?.getBoundingClientRect();
      if (!panel) return;
      manual.x = clamp01((event.clientX - panel.left) / panel.width);
      manual.y = clamp01((event.clientY - panel.top) / panel.height);
      manualUntil = performance.now() + MANUAL_HOLD_MS;
    };
    const onDown = () => {
      manual.down = true;
      manualUntil = performance.now() + MANUAL_HOLD_MS;
    };
    const onUp = () => {
      manual.down = false;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
    }

    let phaseIndex = 0;
    let phaseTime = 0;
    let last = performance.now();
    let frame = 0;
    let elapsed = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      const isManual = finePointer && now < manualUntil;
      let target: Point;
      let pinchTarget = 0;
      let open = false;
      let angleTarget: number;

      if (isManual) {
        target = { x: manual.x, y: manual.y };
        pinchTarget = manual.down ? 1 : 0;
        angleTarget = (manual.x - 0.5) * 1.0;
      } else {
        phaseTime += dt;
        let phase = SCRIPT[phaseIndex];
        if (phaseTime >= phase.duration) {
          phaseTime = 0;
          phaseIndex = (phaseIndex + 1) % SCRIPT.length;
          phase = SCRIPT[phaseIndex];
        }
        if (phase.kind === "click") {
          target = state.cursor;
          pinchTarget = phaseTime > 0.3 && phaseTime < 0.7 ? 1 : 0;
          angleTarget = (state.cursor.x - 0.5) * 1.0;
        } else {
          target = phase.target;
          open = phase.kind === "open";
          angleTarget = open ? Math.sin(elapsed * 1.6) * 0.32 : (target.x - 0.5) * 1.0;
        }
      }

      state.cursor.x = approach(state.cursor.x, target.x, 9, dt);
      state.cursor.y = approach(state.cursor.y, target.y, 9, dt);
      state.angle = approach(state.angle, angleTarget, 10, dt);
      state.pinch = approach(state.pinch, pinchTarget, 22, dt);

      const base = open ? POSES.open : POSES.point;
      const pose = {
        thumb: approach(state.curls.thumb, base.thumb + (0.35 - base.thumb) * pinchTarget * (open ? 0 : 1), 14, dt),
        index: approach(state.curls.index, base.index + (0.4 - base.index) * pinchTarget * (open ? 0 : 1), 14, dt),
        middle: approach(state.curls.middle, base.middle, 14, dt),
        ring: approach(state.curls.ring, base.ring, 14, dt),
        pinky: approach(state.curls.pinky, base.pinky, 14, dt),
        pinch: state.pinch,
      };
      state.curls = pose;

      const points = buildHand(pose, state.angle);
      paintHand(points);
      paintCursor(state.cursor.x, state.cursor.y);

      const over = BUTTONS.findIndex(
        (b) =>
          state.cursor.x * 100 >= b.left &&
          state.cursor.x * 100 <= b.left + b.width &&
          state.cursor.y * 100 >= b.top &&
          state.cursor.y * 100 <= b.top + b.height
      );
      if (over !== hovered) {
        if (hovered >= 0) delete buttonsRef.current[hovered]?.dataset.hover;
        if (over >= 0 && buttonsRef.current[over]) buttonsRef.current[over]!.dataset.hover = "true";
        hovered = over;
      }

      if (pinchTarget === 1 && state.pinch > 0.8 && !clicked) {
        clicked = true;
        click();
      } else if (pinchTarget === 0 && state.pinch < 0.2) {
        clicked = false;
      }

      trail.push({ x: state.cursor.x, y: state.cursor.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();
      paintTrail();

      packetsRef.current.forEach((packet, i) => {
        if (packet) packet.style.setProperty("--p", String(((elapsed * 1.3 + i / packetsRef.current.length) % 1).toFixed(3)));
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      buttons.forEach((button) => {
        if (!button) return;
        delete button.dataset.hover;
        delete button.dataset.pressed;
      });
      gsap.killTweensOf(ring);
    };
  }, [inView, reducedMotion, finePointer]);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="grid items-center gap-4 md:grid-cols-[22rem_minmax(5rem,1fr)_minmax(0,28rem)] md:gap-6"
    >
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="mx-auto h-auto w-full max-w-[19rem] md:mx-0 md:max-w-none" fill="none">
        {CONNECTIONS.map(([a, b], i) => (
          <line
            key={`${a}-${b}`}
            ref={(el) => {
              linesRef.current[i] = el;
            }}
            stroke="#f1ede5"
            strokeOpacity={0.45}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
        ))}
        {Array.from({ length: LANDMARK_COUNT }, (_, i) => (
          <circle
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            r={i === INDEX_TIP ? 6 : 3.5}
            fill={i === INDEX_TIP ? "#c1121f" : "#f1ede5"}
            fillOpacity={i === INDEX_TIP ? 1 : 0.85}
          />
        ))}
      </svg>

      <div className="relative mx-auto h-20 w-px bg-stone/40 md:h-px md:w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.2em] text-silver md:left-1/2 md:top-[-1.4rem] md:-translate-x-1/2 md:translate-y-0">
          {latency}
        </span>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            ref={(el) => {
              packetsRef.current[i] = el;
            }}
            className="absolute left-1/2 top-[calc(var(--p,0)*100%)] size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory md:left-[calc(var(--p,0)*100%)] md:top-1/2"
          />
        ))}
      </div>

      <div
        ref={panelRef}
        className="relative mx-auto aspect-[4/3] w-full max-w-[26rem] border border-stone/50 bg-charcoal/40 md:mx-0 md:max-w-none"
      >
        {BUTTONS.map((b, i) => (
          <div
            key={i}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            className="absolute border border-stone/50 transition-colors duration-150 data-[hover=true]:border-ivory data-[pressed=true]:bg-ivory/90"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}
          />
        ))}
        <div className="absolute left-[8%] right-[8%] top-[46%] h-px bg-stone/50" />
        <div className="absolute left-[8%] top-[46%] h-px w-[40%] bg-ivory/70" />
        <div className="absolute left-[48%] top-[46%] size-2 -translate-x-1/2 -translate-y-1/2 border border-ivory bg-void" />
        {[62, 74, 86].map((top, i) => (
          <div
            key={top}
            className="absolute left-[8%] h-px bg-stone/30"
            style={{ top: `${top}%`, width: `${[84, 62, 72][i]}%` }}
          />
        ))}

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
          <polyline
            ref={trailRef}
            stroke="#b5b1aa"
            strokeOpacity={0.5}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>

        <div
          ref={ringRef}
          className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cherry opacity-0"
        />
        <div
          ref={cursorRef}
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cherry"
          style={{ left: "50%", top: "45%" }}
        />
      </div>
    </div>
  );
}
