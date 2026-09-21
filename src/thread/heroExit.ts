export type ThreadProgress = { current: number };

/** Hero scroll-out progress, 0 at rest to 1 once the hero has left. Written by the hero, read in the 3D frame loop. */
export const heroExit: ThreadProgress = { current: 0 };

export const HERO_EXIT = {
  /** Exit progress at which the filament starts / finishes retracting. */
  retractStart: 0.3,
  retractEnd: 0.85,
  /** Scene-unit drift toward the left edge, where the work thread returns. */
  driftX: -1.4,
  driftY: -0.5,
} as const;

export function heroExitDrift(progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  return t * t * (3 - 2 * t);
}
