export type Pt = { x: number; y: number };

const unit = (dx: number, dy: number): Pt => {
  const l = Math.hypot(dx, dy) || 1;
  return { x: dx / l, y: dy / l };
};

/** Bezier segments through the points, with chord-scaled handles so uneven spacing never loops. */
export function segments(pts: Pt[]) {
  const tangent = (i: number) =>
    i === 0
      ? unit(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      : i === pts.length - 1
        ? unit(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
        : unit(pts[i + 1].x - pts[i - 1].x, pts[i + 1].y - pts[i - 1].y);

  return pts.slice(0, -1).map((a, i) => {
    const b = pts[i + 1];
    const reach = Math.hypot(b.x - a.x, b.y - a.y) * 0.36;
    const ta = tangent(i);
    const tb = tangent(i + 1);
    return {
      a,
      c1: { x: a.x + ta.x * reach, y: a.y + ta.y * reach },
      c2: { x: b.x - tb.x * reach, y: b.y - tb.y * reach },
      b,
    };
  });
}

const fixed = (value: number) => value.toFixed(2);

export function pathData(pts: Pt[]): string {
  let d = `M${fixed(pts[0].x)} ${fixed(pts[0].y)}`;
  for (const s of segments(pts)) {
    d += `C${fixed(s.c1.x)} ${fixed(s.c1.y)} ${fixed(s.c2.x)} ${fixed(s.c2.y)} ${fixed(s.b.x)} ${fixed(s.b.y)}`;
  }
  return d;
}
