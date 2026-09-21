export type Point = { x: number; y: number };

/** Curl per finger (0 = extended, 1 = folded into the palm) and thumb/index pinch (0..1). */
export type HandPose = {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
  pinch: number;
};

export const POSES: Record<"point" | "open", HandPose> = {
  point: { thumb: 0.55, index: 0, middle: 1, ring: 1, pinky: 1, pinch: 0 },
  open: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0, pinch: 0 },
};

export const LANDMARK_COUNT = 21;
export const THUMB_TIP = 4;
export const INDEX_TIP = 8;

/** Landmark indices follow the MediaPipe hand topology. */
export const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const RAD = Math.PI / 180;

type FingerSpec = { base: Point; lengths: [number, number, number]; spread: number };

const FINGERS: FingerSpec[] = [
  { base: { x: -0.62, y: -1.05 }, lengths: [0.5, 0.32, 0.28], spread: -8 },
  { base: { x: -0.2, y: -1.15 }, lengths: [0.55, 0.35, 0.3], spread: -2 },
  { base: { x: 0.22, y: -1.08 }, lengths: [0.5, 0.32, 0.28], spread: 5 },
  { base: { x: 0.62, y: -0.92 }, lengths: [0.4, 0.25, 0.22], spread: 12 },
];

/** Cumulative joint bend at full curl, in degrees. Segments foreshorten with cos(bend). */
const BEND = [70, 160, 220];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Builds 21 landmarks in palm units, wrist at the origin and fingers pointing up (-y), rotated clockwise by `angle`. */
export function buildHand(pose: HandPose, angle: number): Point[] {
  const points: Point[] = new Array(LANDMARK_COUNT);
  points[0] = { x: 0, y: 0 };

  const curls = [pose.index, pose.middle, pose.ring, pose.pinky];
  FINGERS.forEach((finger, f) => {
    const dir = finger.spread * RAD;
    const dx = Math.sin(dir);
    const dy = -Math.cos(dir);
    let { x, y } = finger.base;
    const first = 5 + f * 4;
    points[first] = { x, y };
    finger.lengths.forEach((length, k) => {
      const reach = length * Math.cos(curls[f] * BEND[k] * RAD);
      x += dx * reach;
      y += dy * reach;
      points[first + k + 1] = { x, y };
    });
  });

  let { x, y } = { x: -0.38, y: -0.3 };
  points[1] = { x, y };
  [0.36, 0.34, 0.3].forEach((length, k) => {
    const a = (-50 + pose.thumb * 75 + pose.thumb * k * 12) * RAD;
    x += Math.sin(a) * length;
    y -= Math.cos(a) * length;
    points[2 + k] = { x, y };
  });

  if (pose.pinch > 0) {
    const mid = {
      x: (points[THUMB_TIP].x + points[INDEX_TIP].x) / 2,
      y: (points[THUMB_TIP].y + points[INDEX_TIP].y) / 2,
    };
    [[3, 0.35], [4, 1], [7, 0.35], [8, 1]].forEach(([i, weight]) => {
      points[i] = {
        x: lerp(points[i].x, mid.x, weight * pose.pinch),
        y: lerp(points[i].y, mid.y, weight * pose.pinch),
      };
    });
  }

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map((p) => ({ x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos }));
}
