/**
 * Mutable input state written by DOM handlers and read by the scene each
 * frame, so pointer movement never re-renders React.
 */
export type FieldInput = {
  /** "screen": `ndc` is raycast onto the bed. "field": `field` is used as-is (keyboard). */
  source: "screen" | "field";
  /** Pointer in normalised device coordinates of the stage. */
  ndc: { x: number; y: number };
  /** Contact point as fractions of the bed half-width (-1..1). */
  field: { x: number; z: number };
  /** A hovering mouse or focused keyboard cursor. */
  present: boolean;
  /** Mouse button, touch, or space/enter held. */
  pressed: boolean;
  /** Set by the scene; requests a frame when the canvas is idle. */
  wake: () => void;
};

export function createFieldInput(): FieldInput {
  return {
    source: "screen",
    ndc: { x: 0, y: 0 },
    field: { x: 0, z: 0 },
    present: false,
    pressed: false,
    wake: () => {},
  };
}
