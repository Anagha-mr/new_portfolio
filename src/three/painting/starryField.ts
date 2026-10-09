import { createSeededRandom } from "../utils/random";

/**
 * Internal sampling source: a small downsample of the painting. It is never
 * displayed; it only seeds particle positions, colours and stroke directions.
 */
export const STARRY_SOURCE_URL = "/hero/starry-source.webp";

/** Fixed seed: the same particle count always yields the same painting. */
const SEED = 0x5f3759df;

/** Sampling may spill slightly past the painting so its edges dissolve into the dark. */
const SPILL_U = 0.07;
const SPILL_V = 0.03;

/** The landscape starts about here (v); stars are only looked for above it. */
const HORIZON_V = 0.6;
/** Major stars (and the moon) that receive a soft halo. */
const MAX_HALOS = 12;
/** Halo particles per source pixel of star radius. */
const HALO_PER_RADIUS = 4.5;

export type SourcePixels = { data: Uint8ClampedArray; width: number; height: number };

/**
 * Per-particle attributes, interleaved by attribute:
 * - home:  painting-space u, v (0–1, y down) and a depth 0–1
 * - color: sRGB 0–1
 * - shape: stroke angle (radians, image space), size, elongation
 * - seed:  four independent randoms driving the dissociation
 * - glow:  0 for a brush fleck; otherwise a soft halo particle's peak alpha.
 *          Halo sizes are a fraction of the painting's height, not CSS px.
 */
export type StarryField = {
  count: number;
  home: Float32Array;
  color: Float32Array;
  shape: Float32Array;
  seed: Float32Array;
  glow: Float32Array;
};

let sourcePromise: Promise<SourcePixels> | null = null;

/**
 * Runs `task` once the main thread is idle, so building the field never
 * competes with hydration or the hero's entrance. Returns a cancel function.
 */
export function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(task, { timeout: 1500 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(task, 600);
  return () => window.clearTimeout(handle);
}

/** Decodes the source once per session; later callers share the result. */
export function loadStarrySource(): Promise<SourcePixels> {
  sourcePromise ??= new Promise<SourcePixels>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("2D canvas unavailable"));
      ctx.drawImage(image, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({ data, width: canvas.width, height: canvas.height });
    };
    image.onerror = () => reject(new Error("Starry source failed to load"));
    image.src = STARRY_SOURCE_URL;
  }).catch((error) => {
    sourcePromise = null;
    throw error;
  });
  return sourcePromise;
}

// Palette: blue is the primary family; gold only in star cores, the moon and lit windows.
const RAMP: [number, number, number][] = [
  [0.03, 0.05, 0.1], // near-black midnight
  [0.05, 0.09, 0.2], // midnight navy
  [0.09, 0.17, 0.38], // deep ultramarine
  [0.2, 0.33, 0.6], // muted cobalt
  [0.5, 0.62, 0.8], // blue-white
  [0.88, 0.88, 0.85], // pale ivory
];
const GOLD_DEEP: [number, number, number] = [0.66, 0.48, 0.22];
const GOLD_LIGHT: [number, number, number] = [0.95, 0.84, 0.6];
const IVORY: [number, number, number] = [0.92, 0.91, 0.86];
const STAR_WHITE: [number, number, number] = [0.74, 0.82, 0.94];
/** Halo light: ivory leaning a touch warm, so the glow never reads as a gold disc. */
const HALO: [number, number, number] = [0.86, 0.84, 0.72];

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function sampleRamp(t: number, out: [number, number, number]) {
  const x = Math.min(0.9999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  for (let c = 0; c < 3; c++) out[c] = RAMP[i][c] + (RAMP[i + 1][c] - RAMP[i][c]) * f;
}

function mixInto(out: [number, number, number], a: number[], b: number[], t: number) {
  for (let c = 0; c < 3; c++) out[c] = a[c] + (b[c] - a[c]) * t;
}

/** Separable box blur, run in place; three passes approximate a Gaussian. */
function blur(src: Float32Array, w: number, h: number, radius: number) {
  const tmp = new Float32Array(src.length);
  const span = radius * 2 + 1;
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += src[y * w + Math.min(w - 1, Math.max(0, k))];
      for (let x = 0; x < w; x++) {
        tmp[y * w + x] = acc / span;
        acc += src[y * w + Math.min(w - 1, x + radius + 1)] - src[y * w + Math.max(0, x - radius)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += tmp[Math.min(h - 1, Math.max(0, k)) * w + x];
      for (let y = 0; y < h; y++) {
        src[y * w + x] = acc / span;
        acc += tmp[Math.min(h - 1, y + radius + 1) * w + x] - tmp[Math.max(0, y - radius) * w + x];
      }
    }
  }
}

/** A star cluster found in the source, in source pixels. */
type Star = { x: number; y: number; r: number; strength: number };

type Analysis = {
  w: number;
  h: number;
  /** Graded tone 0–1 along the blue ramp, with local contrast lifted. */
  tone: Float32Array;
  /** 0–1 share of gold: bright warm pixels and lit windows. */
  warm: Float32Array;
  /** 0–1 dark, unblue mass: the cypress, roofs and dark ground. */
  earth: Float32Array;
  /** Stroke direction (radians) and its coherence 0–1. */
  angle: Float32Array;
  coherence: Float32Array;
  stars: Star[];
  /** Per pixel: nearest star index (-1 none) and distance in star radii. */
  starIndex: Int16Array;
  starDist: Float32Array;
};

/**
 * Finds the bright warm clusters of the sky (stars and moon) as local maxima
 * of a blurred warm-light map, sized by how much warm light surrounds them.
 */
function findStars(lum: Float32Array, yellow: Float32Array, w: number, h: number): Star[] {
  const n = w * h;
  const light = new Float32Array(n);
  // Warmth is required: the white swirls are as bright as the stars but blue.
  for (let i = 0; i < n; i++) light[i] = smoothstep(0.5, 0.8, lum[i]) * smoothstep(0.05, 0.2, yellow[i]);
  const map = Float32Array.from(light);
  blur(map, w, h, 3);

  const horizon = Math.floor(h * HORIZON_V);
  const found: Star[] = [];
  const R = 8;
  for (let y = 2; y < horizon; y++) {
    for (let x = 2; x < w - 2; x++) {
      const v = map[y * w + x];
      if (v < 0.12) continue;
      let peak = true;
      for (let dy = -R; dy <= R && peak; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h || (dx === 0 && dy === 0)) continue;
          const o = map[yy * w + xx];
          // Ties resolve to the first pixel in scan order.
          if (o > v || (o === v && (dy < 0 || (dy === 0 && dx < 0)))) {
            peak = false;
            break;
          }
        }
      }
      if (!peak) continue;
      // Radius from the area of surrounding light above half the peak; its
      // second moments tell a round star from an elongated band of pale sky.
      let area = 0;
      let sxx = 0;
      let sxy = 0;
      let syy = 0;
      const reach = 30;
      for (let dy = -reach; dy <= reach; dy++) {
        for (let dx = -reach; dx <= reach; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h || dx * dx + dy * dy > reach * reach) continue;
          if (map[yy * w + xx] > v * 0.5) {
            area++;
            sxx += dx * dx;
            sxy += dx * dy;
            syy += dy * dy;
          }
        }
      }
      const spread = Math.sqrt((sxx - syy) * (sxx - syy) + 4 * sxy * sxy);
      const elongation = Math.sqrt((sxx + syy + spread) / Math.max(1e-6, sxx + syy - spread));
      if (elongation > 1.8) continue;
      const core = Math.max(2, Math.sqrt(area / Math.PI));
      // The cluster, with its rings of light, reaches about twice the warm core.
      const r = Math.min(28, Math.max(6, core * 2.1));
      found.push({ x, y, r, strength: v * r });
    }
  }

  // Overlapping detections (a ring read as two peaks) keep the stronger one.
  found.sort((p, q) => q.strength - p.strength);
  const stars: Star[] = [];
  for (const s of found) {
    if (stars.every((t) => Math.hypot(s.x - t.x, s.y - t.y) > (s.r + t.r) * 0.75)) stars.push(s);
  }
  return stars;
}

/**
 * Grades the source into the palette and derives brush-stroke direction from
 * a smoothed structure tensor: strokes run along bands, perpendicular to the
 * dominant luminance gradient.
 */
function analyse({ data, width: w, height: h }: SourcePixels): Analysis {
  const n = w * h;
  const lum = new Float32Array(n);
  const yellow = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    yellow[i] = (r + g) * 0.5 - b;
  }

  // Local contrast: bright bands lift and the gaps between them sink, so
  // the swirls, ridges and rooftops separate instead of averaging out.
  const mean = Float32Array.from(lum);
  blur(mean, w, h, 4);

  const tone = new Float32Array(n);
  const warm = new Float32Array(n);
  const earth = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const l = lum[i];
    const v = Math.floor(i / w) / h;
    const graded = l + (l - mean[i]) * 0.6;
    tone[i] = Math.pow(smoothstep(0.06, 0.86, graded), 1.1);
    const y = yellow[i];
    const sky = smoothstep(0.06, 0.24, y) * smoothstep(0.32, 0.62, l);
    // Lit windows are dimmer than stars in the downsample; only looked for in the village.
    const lamp = smoothstep(0.05, 0.2, y) * smoothstep(0.3, 0.5, l) * smoothstep(HORIZON_V + 0.08, HORIZON_V + 0.18, v);
    warm[i] = Math.max(sky, lamp);
    // The sky is strongly blue; the cypress, roofs and ground are near-neutral and dark.
    earth[i] = smoothstep(-0.14, -0.04, y) * (1 - smoothstep(0.3, 0.5, l)) * (1 - lamp);
  }

  const jxx = new Float32Array(n);
  const jxy = new Float32Array(n);
  const jyy = new Float32Array(n);
  const at = (x: number, y: number) =>
    lum[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const gy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      const i = y * w + x;
      jxx[i] = gx * gx;
      jxy[i] = gx * gy;
      jyy[i] = gy * gy;
    }
  }
  blur(jxx, w, h, 2);
  blur(jxy, w, h, 2);
  blur(jyy, w, h, 2);

  const angle = new Float32Array(n);
  const coherence = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = jxx[i];
    const b = jxy[i];
    const c = jyy[i];
    angle[i] = 0.5 * Math.atan2(2 * b, a - c) + Math.PI / 2;
    const diff = Math.sqrt((a - c) * (a - c) + 4 * b * b);
    coherence[i] = a + c > 1e-6 ? diff / (a + c) : 0;
  }

  const stars = findStars(lum, yellow, w, h);
  const starIndex = new Int16Array(n).fill(-1);
  const starDist = new Float32Array(n).fill(Infinity);
  stars.forEach((s, k) => {
    const reach = Math.ceil(s.r * 1.3);
    for (let y = Math.max(0, s.y - reach); y <= Math.min(h - 1, s.y + reach); y++) {
      for (let x = Math.max(0, s.x - reach); x <= Math.min(w - 1, s.x + reach); x++) {
        const d = Math.hypot(x - s.x, y - s.y) / s.r;
        const i = y * w + x;
        if (d < starDist[i]) {
          starDist[i] = d;
          starIndex[i] = k;
        }
      }
    }
  });

  return { w, h, tone, warm, earth, angle, coherence, stars, starIndex, starDist };
}

/** Soft, slightly irregular falloff so the painting has no rectangular edge. */
function edgeFade(u: number, v: number): number {
  const wobble = 0.02 * Math.sin(v * 23.0) + 0.015 * Math.sin(u * 31.0 + 1.3);
  const left = smoothstep(-SPILL_U, 0.08, u + wobble);
  const right = smoothstep(1 + SPILL_U, 0.93, u - wobble);
  const top = smoothstep(-SPILL_V, 0.03, v);
  const bottom = smoothstep(1 + SPILL_V, 0.94, v + wobble);
  return left * right * top * bottom;
}

/** Approximately normal (sum of uniforms), mean 0, sd 1. */
function gaussian(random: () => number) {
  return (random() + random() + random() + random() - 2) * 1.732;
}

/**
 * Deterministic particle reconstruction of the painting. Positions are drawn
 * by rejection sampling against contrast-lifted brightness, so bright strokes
 * are dense, and the cypress, roofs and dark ground read as negative space.
 * Major stars get dense tangential rings, a small bright core and a soft halo.
 * Particles are ordered dark to bright so stars draw on top.
 */
export function generateStarryField(source: SourcePixels, count: number): StarryField {
  const a = analyse(source);
  const random = createSeededRandom(SEED + count);

  // Flat typed buffers: no per-particle allocation on a path that runs at startup.
  const STRIDE = 14;
  const raw = new Float32Array(count * STRIDE);
  const keys = new Float32Array(count);
  let total = 0;
  const rgb: [number, number, number] = [0, 0, 0];

  const write = (u: number, v: number, key: number, angle: number, size: number, elongation: number, glow: number) => {
    keys[total] = key;
    const o = total * STRIDE;
    raw[o] = u;
    raw[o + 1] = v;
    raw[o + 2] = random();
    raw[o + 3] = rgb[0];
    raw[o + 4] = rgb[1];
    raw[o + 5] = rgb[2];
    raw[o + 6] = angle;
    raw[o + 7] = size;
    raw[o + 8] = elongation;
    for (let k = 0; k < 4; k++) raw[o + 9 + k] = random();
    raw[o + 13] = glow;
    total++;
  };

  // Halos first: under a thousand large, faint, soft particles in all,
  // gathered toward each major star's centre. The count is fixed per star,
  // not per tier, so the glow is the same on every device.
  for (const s of a.stars.slice(0, MAX_HALOS)) {
    const n = Math.round(s.r * HALO_PER_RADIUS);
    for (let k = 0; k < n && total < count; k++) {
      const spread = s.r * 0.5;
      const u = (s.x + gaussian(random) * spread) / (a.w - 1);
      const v = (s.y + gaussian(random) * spread) / (a.h - 1);
      mixInto(rgb, HALO, STAR_WHITE, random() * 0.6);
      // Diameter as a share of painting height; alpha stays low so the halos only add up near the core.
      const size = (s.r * (0.9 + random() * 0.8)) / a.h;
      const alpha = (0.016 + random() * 0.014) * edgeFade(u, v);
      write(u, v, 0.55 + random() * 0.05, 0, size, 1, Math.max(0.001, alpha));
    }
  }

  const flecks = count - total;
  const maxAttempts = flecks * 40;
  for (let attempt = 0, made = 0; attempt < maxAttempts && made < flecks; attempt++) {
    const u = -SPILL_U + random() * (1 + SPILL_U * 2);
    const v = -SPILL_V + random() * (1 + SPILL_V * 2);
    const px = Math.min(a.w - 1, Math.max(0, Math.round(u * (a.w - 1))));
    const py = Math.min(a.h - 1, Math.max(0, Math.round(v * (a.h - 1))));
    const i = py * a.w + px;
    const tone = a.tone[i];
    const warm = a.warm[i];
    const earth = a.earth[i];
    const star = a.starIndex[i] >= 0 && a.starDist[i] < 1.15 ? a.stars[a.starIndex[i]] : null;
    const d = star ? a.starDist[i] : 1;
    const fade = edgeFade(u, v);

    // Dark, unblue masses keep almost no flecks: the cypress is carved by absence.
    const floor = 0.09 * (1 - earth * 0.85);
    const lit = Math.pow(Math.max(tone, warm * 0.9), 1.5) * (1 - earth * 0.45);
    // Star cores pack tightly; the rings around them stay dense.
    const core = star ? 0.7 * (1 - smoothstep(0, 0.45, d)) + 0.25 * (1 - d) : 0;
    // Lit windows gather a few more flecks than their size alone would give.
    const lamp = v > HORIZON_V ? warm * 0.35 : 0;
    const weight = Math.min(1, floor + (1 - floor) * lit + core + lamp) * fade;
    if (random() > weight) continue;
    made++;

    const coherence = a.coherence[i];
    // Coherent bands hold their direction; loose areas scatter a little more.
    let angle = a.angle[i] + (random() - 0.5) * (0.12 + 0.4 * (1 - coherence));
    const sizeRandom = random();
    let size = (0.75 + 1.4 * sizeRandom * sizeRandom) * (0.8 + 0.5 * tone);
    let elongation = 1 + (0.6 + 2.2 * random()) * coherence;
    let key = tone + random() * 0.08;

    if (star && d < 1) {
      // Star clusters: a small bright core, then rings of tangential flecks.
      const dx = px - star.x;
      const dy = py - star.y;
      if (d < 0.32) {
        const gold = random() < 0.55 * smoothstep(0.1, 0.6, warm + 0.3);
        if (gold) mixInto(rgb, GOLD_DEEP, GOLD_LIGHT, 0.6 + random() * 0.4);
        else mixInto(rgb, IVORY, STAR_WHITE, random() * 0.3);
        size *= 0.8;
        elongation = 1 + random() * 0.5;
        key = 1.6 + random() * 0.1;
      } else {
        angle = Math.atan2(dy, dx) + Math.PI / 2 + (random() - 0.5) * 0.25;
        elongation = 1.6 + random() * 1.6;
        // Gold thins out toward the rim; the outer rings are ivory and blue-white.
        const goldChance = 0.4 * warm * (1 - smoothstep(0.3, 0.85, d));
        if (random() < goldChance) mixInto(rgb, GOLD_DEEP, GOLD_LIGHT, 0.3 + random() * 0.5);
        else {
          sampleRamp(Math.max(tone, 0.55) * (0.85 + random() * 0.2), rgb);
          if (random() < 0.4) mixInto(rgb, rgb, IVORY, 0.5);
        }
        key = 1.2 + (1 - d) * 0.3 + random() * 0.05;
      }
    } else if (warm > 0.35 && random() < Math.min(1, warm) * 0.75) {
      // Lit windows and the odd warm highlight: compact gold points.
      mixInto(rgb, GOLD_DEEP, GOLD_LIGHT, Math.min(1, smoothstep(0.45, 0.95, tone) * 0.7 + random() * 0.45));
      elongation = 1 + random() * 0.6;
      size *= 1.05;
      key = 1.1 + random() * 0.05;
    } else {
      // The blue painting. Dark masses keep a faint floor so the shapes hold.
      sampleRamp(Math.max(tone, 0.1 + random() * 0.08) * (0.75 + random() * 0.45) * (1 - earth * 0.5), rgb);
      if (earth > 0.5) size *= 0.85;
    }

    // Edge particles dim with the falloff rather than ending abruptly.
    const dim = 0.35 + 0.65 * fade;
    for (let c = 0; c < 3; c++) rgb[c] *= dim;
    write(u, v, key, angle, size, elongation, 0);
  }

  const order = new Uint32Array(total);
  for (let k = 0; k < total; k++) order[k] = k;
  order.sort((p, q) => keys[p] - keys[q]);

  const home = new Float32Array(total * 3);
  const color = new Float32Array(total * 3);
  const shape = new Float32Array(total * 3);
  const seed = new Float32Array(total * 4);
  const glow = new Float32Array(total);
  for (let k = 0; k < total; k++) {
    const o = order[k] * STRIDE;
    home.set(raw.subarray(o, o + 3), k * 3);
    color.set(raw.subarray(o + 3, o + 6), k * 3);
    shape.set(raw.subarray(o + 6, o + 9), k * 3);
    seed.set(raw.subarray(o + 9, o + 13), k * 4);
    glow[k] = raw[o + 13];
  }

  return { count: total, home, color, shape, seed, glow };
}

export type PaintingRect = { x: number; y: number; width: number; height: number };

/**
 * Where the painting sits in a viewport (CSS px). Landscape follows the
 * reference: full height, widened toward the screen's proportions. Portrait
 * keeps the upper portion for the painting and crops its sides.
 */
export function paintingRect(width: number, height: number): PaintingRect {
  if (width >= height) {
    const h = height * 1.02;
    const w = Math.min(Math.max(width * 0.88, h * 1.26), h * 1.9);
    return { x: width * 0.52 - w / 2, y: height * 0.03, width: w, height: h };
  }
  // Taller screens give the painting more of the height; shorter ones keep room for the type.
  const h = height * Math.min(0.74, Math.max(0.5, 0.3 + 0.2 * (height / width)));
  const w = Math.max(width * 1.3, h * 0.98);
  return { x: width * 0.5 - w * 0.55, y: height * 0.02, width: w, height: h };
}
