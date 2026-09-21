export type ThreadSide = "left" | "right";
export type ThreadBreakpoint = "desktop" | "tablet" | "mobile";
export type ThreadPresetName = "work" | "about" | "contact";

/** A y-position along a layer: `px + frac * layerHeight`. */
export type ThreadExtent = { px: number; frac: number };

export type ThreadConfig = {
  side: ThreadSide;
  start: ThreadExtent;
  end: ThreadExtent;
  /** Shape the path through registered DOM anchors instead of even spacing. */
  anchored: boolean;
  /** Distance in px between generated points when not anchored. */
  spacing: number;
  /** Lateral wander in px. */
  amplitude: number;
  phase: number;
  /** Wander decays toward the end, which lands with a small impulse and a terminal point. */
  settle: boolean;
  /** Hover/focus pull toward the active anchor in px; 0 disables interaction. */
  pull: number;
  opacity: number;
  width: number;
};

const work: ThreadConfig = {
  side: "left",
  start: { px: -32, frac: 0 },
  end: { px: 32, frac: 1 },
  anchored: true,
  spacing: 150,
  amplitude: 9,
  phase: 0.6,
  settle: false,
  pull: 15,
  opacity: 0.62,
  width: 1.25,
};

const contact: ThreadConfig = {
  side: "left",
  start: { px: -150, frac: 0 },
  end: { px: 0, frac: 0.5 },
  anchored: false,
  spacing: 110,
  amplitude: 8,
  phase: 4,
  settle: true,
  pull: 0,
  opacity: 0.6,
  width: 1.25,
};

/** Tablet trims the amplitude; mobile keeps a short, still segment. Null means no thread. */
export const THREAD_PRESETS: Record<ThreadPresetName, Record<ThreadBreakpoint, ThreadConfig | null>> = {
  work: {
    desktop: work,
    tablet: { ...work, amplitude: 6, pull: 12, opacity: 0.55 },
    mobile: {
      ...work,
      end: { px: 0, frac: 0.34 },
      anchored: false,
      spacing: 120,
      amplitude: 3,
      pull: 0,
      opacity: 0.5,
      width: 1.1,
    },
  },
  about: {
    desktop: {
      side: "right",
      start: { px: -20, frac: 0.02 },
      end: { px: 0, frac: 0.72 },
      anchored: false,
      spacing: 130,
      amplitude: 6,
      phase: 2.1,
      settle: false,
      pull: 0,
      opacity: 0.34,
      width: 1,
    },
    tablet: null,
    mobile: null,
  },
  contact: {
    desktop: contact,
    tablet: { ...contact, start: { px: -110, frac: 0 }, amplitude: 5 },
    mobile: { ...contact, start: { px: -70, frac: 0 }, amplitude: 2.5, opacity: 0.5, width: 1.1 },
  },
};
