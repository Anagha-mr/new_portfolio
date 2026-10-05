/**
 * A square lattice of vertical springs. Each cell is anchored to rest by its
 * own spring and coupled to its four neighbours, so a disturbance spreads as
 * a damped ripple. Pure math with no three.js dependency.
 */

export type SpringFieldOptions = {
  /** Cells per side. */
  size: number;
  /** World distance between neighbouring cells. */
  spacing: number;
  /** Pull back to rest. */
  stiffness: number;
  damping: number;
  /** Pull toward the neighbour average; higher spreads ripples further. */
  coupling: number;
  min: number;
  max: number;
};

/** A soft round contact pushing cells down, in field-local coordinates. */
export type Press = { x: number; z: number; radius: number; depth: number };

const PRESS_STIFFNESS = 520;
/** Extra damping while in contact, so the press absorbs rather than bounces. */
const PRESS_DAMPING = 14;
const SLEEP_EPSILON = 5e-4;
/** Displaced material: a low rim just outside the contact, as a fraction of depth and radius. */
const RIM_HEIGHT = 0.16;
const RIM_WIDTH = 0.5;

export class SpringField {
  readonly size: number;
  readonly count: number;
  readonly spacing: number;
  /** Cell centres, centred on the origin. */
  readonly xs: Float32Array;
  readonly zs: Float32Array;
  readonly heights: Float32Array;
  private readonly velocities: Float32Array;
  private readonly accelerations: Float32Array;
  private readonly options: SpringFieldOptions;

  constructor(options: SpringFieldOptions) {
    this.options = options;
    this.size = options.size;
    this.count = options.size * options.size;
    this.spacing = options.spacing;
    this.xs = new Float32Array(this.count);
    this.zs = new Float32Array(this.count);
    this.heights = new Float32Array(this.count);
    this.velocities = new Float32Array(this.count);
    this.accelerations = new Float32Array(this.count);

    const half = ((this.size - 1) * this.spacing) / 2;
    for (let row = 0; row < this.size; row += 1) {
      for (let col = 0; col < this.size; col += 1) {
        const i = row * this.size + col;
        this.xs[i] = col * this.spacing - half;
        this.zs[i] = row * this.spacing - half;
      }
    }
  }

  /** Fills heights from a height function and clears velocity. */
  sculpt(height: (x: number, z: number) => number) {
    for (let i = 0; i < this.count; i += 1) {
      this.heights[i] = height(this.xs[i], this.zs[i]);
      this.velocities[i] = 0;
    }
  }

  /** One semi-implicit Euler step. Accelerations are gathered first so the update is order-independent. */
  step(dt: number, press: Press | null) {
    const { size, heights: h, velocities: v, accelerations: a } = this;
    const { stiffness, damping, coupling, min, max } = this.options;

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const i = row * size + col;
        const hi = h[i];
        // Missing neighbours mirror the cell, so edges are free rather than pinned.
        const left = col > 0 ? h[i - 1] : hi;
        const right = col < size - 1 ? h[i + 1] : hi;
        const up = row > 0 ? h[i - size] : hi;
        const down = row < size - 1 ? h[i + size] : hi;
        const laplacian = (left + right + up + down) * 0.25 - hi;
        a[i] = -stiffness * hi - damping * v[i] + coupling * laplacian;
      }
    }

    if (press && press.depth > 0) this.applyPress(press);

    for (let i = 0; i < this.count; i += 1) {
      v[i] += a[i] * dt;
      let next = h[i] + v[i] * dt;
      if (next < min || next > max) {
        next = next < min ? min : max;
        v[i] = 0;
      }
      h[i] = next;
    }
  }

  /** Only cells under the contact footprint are visited. */
  private applyPress({ x, z, radius, depth }: Press) {
    const { size, spacing, xs, zs, heights: h, velocities: v, accelerations: a } = this;
    const half = ((size - 1) * spacing) / 2;
    const outer = radius * (1 + RIM_WIDTH);
    const reach = Math.ceil(outer / spacing);
    const centreCol = Math.round((x + half) / spacing);
    const centreRow = Math.round((z + half) / spacing);
    const radiusSq = radius * radius;
    const outerSq = outer * outer;

    for (let row = Math.max(0, centreRow - reach); row <= Math.min(size - 1, centreRow + reach); row += 1) {
      for (let col = Math.max(0, centreCol - reach); col <= Math.min(size - 1, centreCol + reach); col += 1) {
        const i = row * size + col;
        const dx = xs[i] - x;
        const dz = zs[i] - z;
        const distSq = dx * dx + dz * dz;
        if (distSq >= outerSq) continue;

        if (distSq >= radiusSq) {
          // Pins around the contact are nudged up, as if pushed aside.
          const t = (Math.sqrt(distSq) - radius) / (outer - radius);
          const rim = depth * RIM_HEIGHT * Math.sin(Math.PI * t);
          if (h[i] < rim) a[i] += PRESS_STIFFNESS * 0.25 * (rim - h[i]);
          continue;
        }

        const falloff = 1 - distSq / radiusSq;
        const target = -depth * falloff * falloff;
        // One-sided: the contact can push a cell down but never pull it up.
        if (h[i] > target) a[i] += PRESS_STIFFNESS * (target - h[i]) - PRESS_DAMPING * v[i];
      }
    }
  }

  /** True once every cell is effectively at rest; snaps the remainder to zero. */
  settle(): boolean {
    const { heights: h, velocities: v } = this;
    for (let i = 0; i < this.count; i += 1) {
      if (Math.abs(h[i]) > SLEEP_EPSILON || Math.abs(v[i]) > SLEEP_EPSILON) return false;
    }
    h.fill(0);
    v.fill(0);
    return true;
  }
}
