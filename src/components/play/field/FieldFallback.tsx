import {
  PIN_PROTRUSION,
  PIN_RADIUS_RATIO,
  VIEW_ELEVATION_DEG,
  accentIndex,
  pinShade,
  restingImpression,
  spacingOf,
  type BedLayout,
} from "@/three/physics/pinBed";

const LAYOUT: BedLayout = { size: 22, width: 4.8 };
const SCALE = 1000;
const DISTANCE = 9.5;
const ELEVATION = (VIEW_ELEVATION_DEG * Math.PI) / 180;
const SIN = Math.sin(ELEVATION);
const COS = Math.cos(ELEVATION);
const SHADES = 6;
const PLATE_DEPTH = 0.32;

const CHARCOAL = [0x26, 0x24, 0x1f];
const IVORY = [0xf1, 0xed, 0xe5];

function shade(t: number): string {
  return `rgb(${CHARCOAL.map((c, i) => Math.round(c + (IVORY[i] - c) * t)).join(" ")})`;
}

/** Perspective projection from the same viewpoint as the WebGL camera. */
function project(x: number, y: number, z: number): [number, number] {
  const ry = y - DISTANCE * SIN;
  const rz = z - DISTANCE * COS;
  const depth = -ry * SIN - rz * COS;
  const up = ry * COS - rz * SIN;
  return [(x / depth) * SCALE, (-up / depth) * SCALE];
}

const fmt = (n: number) => n.toFixed(1);

type Stroke = { key: string; color: string; d: string; width: number };

function buildBed() {
  const { size, width } = LAYOUT;
  const spacing = spacingOf(LAYOUT);
  const half = width / 2;
  const height = restingImpression(width);
  const accent = accentIndex(LAYOUT);
  const radius = spacing * PIN_RADIUS_RATIO;
  const strokes: Stroke[] = [];

  // Back to front so nearer pins overlap the ones behind them.
  for (let row = 0; row < size; row += 1) {
    const z = row * spacing - half;
    const stems = new Map<number, string>();
    const tips = new Map<number, string>();
    let accentStem = "";
    // On-screen pin width for this row.
    const [ax] = project(0, 0, z);
    const [bx] = project(radius * 2, 0, z);
    const strokeWidth = bx - ax;

    for (let col = 0; col < size; col += 1) {
      const x = col * spacing - half;
      const h = height(x, z);
      const [px, base] = project(x, 0, z);
      const [tx, tip] = project(x, PIN_PROTRUSION + h, z);
      const stem = `M${fmt(px)} ${fmt(base)}L${fmt(tx)} ${fmt(tip)}`;

      if (row * size + col === accent) {
        accentStem = stem;
        continue;
      }
      const light = Math.min(1, (0.55 + (row / (size - 1)) * 0.4) * pinShade(h));
      const bucket = Math.round(light * (SHADES - 1));
      stems.set(bucket, (stems.get(bucket) ?? "") + stem);
      tips.set(bucket, (tips.get(bucket) ?? "") + `M${fmt(tx)} ${fmt(tip)}h0`);
    }

    for (const [bucket, d] of stems) {
      strokes.push({ key: `${row}s${bucket}`, color: shade((bucket / (SHADES - 1)) * 0.62), d, width: strokeWidth });
    }
    for (const [bucket, d] of tips) {
      strokes.push({ key: `${row}t${bucket}`, color: shade(bucket / (SHADES - 1)), d, width: strokeWidth });
    }
    if (accentStem) strokes.push({ key: `${row}c`, color: "#5b7fc7", d: accentStem, width: strokeWidth });
  }

  const edge = half + spacing * 1.6;
  const corners = [
    project(-edge, 0, -edge),
    project(edge, 0, -edge),
    project(edge, 0, edge),
    project(-edge, 0, edge),
  ];
  const front = [project(-edge, -PLATE_DEPTH, edge), project(edge, -PLATE_DEPTH, edge)];
  const point = ([x, y]: [number, number]) => `${fmt(x)} ${fmt(y)}`;

  const top = `M${corners.map(point).join("L")}Z`;
  const side = `M${point(corners[3])}L${point(corners[2])}L${point(front[1])}L${point(front[0])}Z`;
  const xs = [...corners, ...front].map(([x]) => x);
  const ys = [...corners, ...front, project(0, PIN_PROTRUSION, -edge)].map(([, y]) => y);

  return {
    strokes,
    plate: { top, side },
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  };
}

const bed = buildBed();
const pad = 30;
const viewBox = [
  bed.bounds.minX - pad,
  bed.bounds.minY - pad,
  bed.bounds.maxX - bed.bounds.minX + pad * 2,
  bed.bounds.maxY - bed.bounds.minY + pad * 2,
]
  .map(fmt)
  .join(" ");

/** Static drawing of the bed holding one impression. Used without WebGL and as the index preview. */
export function FieldFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      <path d={bed.plate.top} fill="#26241f" />
      <path d={bed.plate.side} fill="#181715" />
      <g fill="none" strokeLinecap="round">
        {bed.strokes.map((stroke) => (
          <path key={stroke.key} d={stroke.d} stroke={stroke.color} strokeWidth={stroke.width} />
        ))}
      </g>
    </svg>
  );
}
