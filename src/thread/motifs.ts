import type { Pt } from "./spline";

export type MotifName = "work" | "transition" | "contact";
export type Breakpoint = "desktop" | "tablet" | "mobile";

/** Gesture in a box: `points` are 0–1 fractions of `width` × `height`. */
export type MotifVariant = { width: number; height: number; points: Pt[] };

export type MotifDef = {
  /** Which end of the gesture fades out. */
  fade: "left" | "both";
  /** Project rows may bend this motif. */
  responsive: boolean;
  variants: Record<Breakpoint, MotifVariant | null>;
  /** Finds a free box in the host section, or null when the content leaves no room. */
  place(host: HTMLElement, box: { width: number; height: number }, breakpoint: Breakpoint): { left: number; top: number } | null;
};

type Rect = { top: number; bottom: number; left: number; right: number };

function rectIn(el: Element, host: HTMLElement): Rect {
  const h = host.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { top: r.top - h.top, bottom: r.bottom - h.top, left: r.left - h.left, right: r.right - h.left };
}

function textRight(el: Element, host: HTMLElement): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  let right = 0;
  for (const r of range.getClientRects()) right = Math.max(right, r.right);
  return right - host.getBoundingClientRect().left;
}

const find = (host: HTMLElement, name: string) => host.querySelector(`[data-thread="${name}"]`);

/** Above the project list, in the empty band to the right of the section label. */
const work: MotifDef = {
  fade: "left",
  responsive: true,
  variants: {
    desktop: {
      width: 640,
      height: 120,
      points: [
        { x: 1.05, y: 0.3 },
        { x: 0.84, y: 0.34 },
        { x: 0.66, y: 0.66 },
        { x: 0.46, y: 0.7 },
        { x: 0.3, y: 0.46 },
        { x: 0.16, y: 0.42 },
      ],
    },
    tablet: {
      width: 420,
      height: 100,
      points: [
        { x: 1.05, y: 0.34 },
        { x: 0.7, y: 0.66 },
        { x: 0.38, y: 0.48 },
        { x: 0.14, y: 0.56 },
      ],
    },
    mobile: {
      width: 190,
      height: 52,
      points: [
        { x: 1.06, y: 0.36 },
        { x: 0.7, y: 0.3 },
        { x: 0.42, y: 0.66 },
        { x: 0.16, y: 0.52 },
      ],
    },
  },
  place(host, { width, height }, breakpoint) {
    const list = find(host, "list");
    if (!list) return null;
    const hostWidth = host.clientWidth;
    let bottom = rectIn(list, host).top - (breakpoint === "mobile" ? 28 : 36);

    const label = find(host, "label");
    if (label && hostWidth - width < textRight(label, host) + 28) {
      bottom = Math.min(bottom, rectIn(label, host).top - 14);
    }
    const top = bottom - height;
    return top < 8 ? null : { left: hostWidth - width, top };
  },
};

/** Lower right of About, below the link and clear of the biography. */
const transition: MotifDef = {
  fade: "left",
  responsive: false,
  variants: {
    desktop: {
      width: 380,
      height: 100,
      points: [
        { x: 1.05, y: 0.5 },
        { x: 0.8, y: 0.36 },
        { x: 0.54, y: 0.5 },
        { x: 0.3, y: 0.8 },
      ],
    },
    tablet: null,
    mobile: null,
  },
  place(host, { width, height }) {
    const copy = find(host, "about-copy");
    // The wrapper stretches with the grid row, so measure the link itself.
    const cta = find(host, "about-cta")?.querySelector("a");
    if (!copy || !cta) return null;

    const hostWidth = host.clientWidth;
    const top = rectIn(cta, host).bottom + 44;
    const left = hostWidth - width;
    // May use the section's bottom padding, but never crowds the divider below.
    if (top + height > host.clientHeight - 56 || left < textRight(copy, host) + 80) return null;
    return { left, top };
  },
};

/** Floating in the empty band above the contact line. */
const contact: MotifDef = {
  fade: "both",
  responsive: false,
  variants: {
    desktop: {
      width: 420,
      height: 110,
      points: [
        { x: 0, y: 0.72 },
        { x: 0.2, y: 0.4 },
        { x: 0.44, y: 0.3 },
        { x: 0.66, y: 0.5 },
        { x: 0.82, y: 0.84 },
        { x: 0.98, y: 0.7 },
      ],
    },
    tablet: {
      width: 320,
      height: 90,
      points: [
        { x: 0, y: 0.7 },
        { x: 0.32, y: 0.32 },
        { x: 0.66, y: 0.56 },
        { x: 0.84, y: 0.86 },
        { x: 0.98, y: 0.72 },
      ],
    },
    mobile: {
      width: 150,
      height: 48,
      points: [
        { x: 0, y: 0.7 },
        { x: 0.4, y: 0.26 },
        { x: 0.78, y: 0.78 },
        { x: 0.98, y: 0.62 },
      ],
    },
  },
  place(host, { width, height }) {
    const row = find(host, "contact-row");
    if (!row) return null;

    const hostWidth = host.clientWidth;
    const left = hostWidth - width - hostWidth * 0.1;
    let top = rectIn(row, host).top - 34 - height;

    const label = find(host, "label");
    if (label) {
      const box = rectIn(label, host);
      if (left < textRight(label, host) + 40 && top + height > box.top - 10) top = box.top - 14 - height;
    }
    return top < 8 ? null : { left, top };
  },
};

export const MOTIFS: Record<MotifName, MotifDef> = { work, transition, contact };
