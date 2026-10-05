"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { createFieldInput } from "@/three/interaction/fieldInput";
import type { StageProps } from "../registry";
import { FieldFallback } from "./FieldFallback";

const fallbackClass = "absolute inset-0 h-full w-full px-6 py-10 md:px-[20%] md:pt-32 md:pb-56";

const FieldScene = dynamic(() => import("@/three/scenes/FieldScene"), {
  ssr: false,
  loading: () => <FieldFallback className={fallbackClass} />,
});

/** Keyboard cursor step, as a fraction of the bed half-width. */
const KEY_STEP = 0.07;
const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const clampUnit = (value: number) => Math.min(1, Math.max(-1, value));

/**
 * Pointer, touch and keyboard surface for the pin bed. Input is written to a
 * mutable channel the scene reads per frame; nothing here re-renders on input.
 */
export function FieldStage({ label }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const input = useMemo(() => createFieldInput(), []);
  const inView = useInView(stageRef);
  const reducedMotion = useReducedMotion();
  const supported = useWebGLSupport();
  const interactive = supported && !reducedMotion;

  /* eslint-disable react-hooks/immutability -- `input` is a mutable channel read by the scene, not React state */
  const track = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    input.source = "screen";
    input.ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    input.ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const release = (event: PointerEvent<HTMLDivElement>) => {
    input.pressed = false;
    // Touch has no hover: lifting the finger ends contact entirely.
    if (event.pointerType !== "mouse") input.present = false;
    input.wake();
  };

  const handlers = {
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse" && !input.pressed) return;
      track(event);
      input.present = true;
      input.wake();
    },
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      track(event);
      event.currentTarget.setPointerCapture(event.pointerId);
      input.present = true;
      input.pressed = true;
      input.wake();
    },
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
      if (input.pressed) return;
      if (event.pointerType === "mouse") input.present = false;
      input.wake();
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      const arrow = ARROWS[event.key];
      if (arrow) {
        event.preventDefault();
        if (input.source !== "field") input.field.x = input.field.z = 0;
        input.source = "field";
        input.present = true;
        input.field.x = clampUnit(input.field.x + arrow[0] * KEY_STEP);
        input.field.z = clampUnit(input.field.z + arrow[1] * KEY_STEP);
        input.wake();
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (input.source !== "field" || !input.present) {
          input.source = "field";
          input.present = true;
        }
        input.pressed = true;
        input.wake();
      }
    },
    onKeyUp: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== " " && event.key !== "Enter") return;
      input.pressed = false;
      input.wake();
    },
    onBlur: () => {
      input.present = false;
      input.pressed = false;
      input.wake();
    },
  };
  /* eslint-enable react-hooks/immutability */

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 ${interactive ? "touch-none select-none outline-offset-[-1px]" : ""}`}
      {...(interactive
        ? {
            role: "application",
            tabIndex: 0,
            "aria-label": `${label}. Arrow keys move, space presses.`,
            ...handlers,
          }
        : { "aria-hidden": true })}
    >
      {supported ? (
        <div className="fade-in absolute inset-0">
          <FieldScene input={input} still={reducedMotion} paused={!inView} />
        </div>
      ) : (
        <FieldFallback className={fallbackClass} />
      )}
    </div>
  );
}
