/**
 * Written by the hero's DOM layer, read by the particle painting. Kept outside
 * React so scroll and layout changes never re-render; listeners only request
 * a frame from the on-demand canvas.
 */
export type TextRect = { x: number; y: number; width: number; height: number };

export const heroState = {
  /** Scroll dissociation, 0 = painting fully formed, 1 = dispersed. */
  progress: 0,
  /** Hero typography bounds within the viewport (CSS px); particles dim behind it. */
  text: null as TextRect | null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function setHeroProgress(progress: number) {
  const next = Math.min(1, Math.max(0, progress));
  if (next === heroState.progress) return;
  heroState.progress = next;
  notify();
}

export function setHeroTextRect(rect: TextRect | null) {
  const prev = heroState.text;
  const same =
    prev === rect ||
    (prev !== null &&
      rect !== null &&
      Math.abs(prev.x - rect.x) < 0.5 &&
      Math.abs(prev.y - rect.y) < 0.5 &&
      Math.abs(prev.width - rect.width) < 0.5 &&
      Math.abs(prev.height - rect.height) < 0.5);
  if (same) return;
  heroState.text = rect;
  notify();
}

export function subscribeHeroState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
