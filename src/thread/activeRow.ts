import type { FocusEvent, PointerEvent } from "react";

// Which project row is hovered or focused. A plain store, so a hover never re-renders React.
let active: number | null = null;
const listeners = new Set<() => void>();

export const activeRow = {
  get: () => active,
  set(index: number | null) {
    if (index === active) return;
    active = index;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Pointer and keyboard-focus handlers for one row; touch never triggers a response. */
export function rowHandlers(index: number) {
  return {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "touch") activeRow.set(index);
    },
    onPointerLeave: () => activeRow.set(null),
    onFocus: (event: FocusEvent) => {
      if ((event.target as HTMLElement).matches(":focus-visible")) activeRow.set(index);
    },
    onBlur: () => activeRow.set(null),
  };
}
