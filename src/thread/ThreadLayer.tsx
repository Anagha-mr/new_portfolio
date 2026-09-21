"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { THREAD_PRESETS, type ThreadPresetName } from "./presets";
import { createThreadRunner, type ThreadRunner } from "./ThreadRunner";

type ThreadContextValue = {
  register(id: string, el: HTMLElement | null): void;
  setActive(id: string | null): void;
};

const ThreadContext = createContext<ThreadContextValue | null>(null);

export type ThreadLayerProps = {
  preset: ThreadPresetName;
  children: ReactNode;
  className?: string;
};

/**
 * Wraps a block of content and draws a short segment of the thread in the
 * margin beside it. The SVG is decorative and never receives pointer events.
 */
export function ThreadLayer({ preset, children, className = "" }: ThreadLayerProps) {
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const config = THREAD_PRESETS[preset][isMobile ? "mobile" : isTablet ? "tablet" : "desktop"];

  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const capRef = useRef<SVGCircleElement>(null);
  const anchors = useRef(new Map<string, HTMLElement>());
  const runner = useRef<ThreadRunner | null>(null);
  const gradientId = `thread-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const gradient = gradientRef.current;
    if (!config || !root || !path || !gradient) return;

    const instance = createThreadRunner({
      root,
      path,
      gradient,
      cap: capRef.current,
      anchors: anchors.current,
      config,
      animated: !reducedMotion,
      interactive: !reducedMotion && config.pull > 0,
    });
    runner.current = instance;

    return () => {
      instance.destroy();
      runner.current = null;
    };
  }, [config, reducedMotion]);

  const context = useMemo<ThreadContextValue>(
    () => ({
      register(id, el) {
        if (el) anchors.current.set(id, el);
        else anchors.current.delete(id);
        runner.current?.invalidate();
      },
      setActive(id) {
        runner.current?.setActive(id);
      },
    }),
    []
  );

  return (
    <ThreadContext.Provider value={context}>
      <div ref={rootRef} className={`relative ${className}`}>
        {config && (
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute left-0 top-0 h-px w-px select-none overflow-visible"
          >
            <defs>
              <linearGradient
                ref={gradientRef}
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0" style={{ stopColor: "var(--color-cherry)", stopOpacity: 0 }} />
                <stop offset="0.14" style={{ stopColor: "var(--color-cherry)" }} />
                {!config.settle && (
                  <stop offset="0.86" style={{ stopColor: "var(--color-cherry)" }} />
                )}
                <stop
                  offset="1"
                  style={{ stopColor: "var(--color-cherry)", stopOpacity: config.settle ? 1 : 0 }}
                />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              pathLength={1}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={config.width}
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
            {config.settle && (
              <circle ref={capRef} r={2.25} style={{ fill: "var(--color-cherry)", opacity: 0 }} />
            )}
          </svg>
        )}
        {children}
      </div>
    </ThreadContext.Provider>
  );
}

/** Registers an element as a point the thread can be drawn toward. */
export function useThreadAnchor(id: string) {
  const context = useContext(ThreadContext);

  const attach = useCallback(
    (el: HTMLElement | null) => {
      context?.register(id, el);
    },
    [context, id]
  );

  return {
    attach,
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "touch") context?.setActive(id);
    },
    onPointerLeave: () => context?.setActive(null),
    onFocus: (event: FocusEvent) => {
      if ((event.target as HTMLElement).matches(":focus-visible")) context?.setActive(id);
    },
    onBlur: () => context?.setActive(null),
  };
}
