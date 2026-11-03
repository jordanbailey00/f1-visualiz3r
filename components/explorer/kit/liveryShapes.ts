import type { Pt } from "./livery";

/*
 * Outlines for livery layers, in car millimetres. In the side view a point
 * is (x, y); in the top view (x, |z|). Lines run front to back or back to
 * front, as long as each outline is drawn one way round.
 */

/** Rectangle from (x0, y0) to (x1, y1). */
export const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/** A smooth line through the points (Catmull-Rom, `per` steps a span). */
export function curve(pts: Pt[], per = 8): Pt[] {
  if (pts.length < 3) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      const at = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([at(p0[0], p1[0], p2[0], p3[0]), at(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Everything below a line, down to `floor`: in the top view, everything inside it. */
export const below = (line: Pt[], floor = -200): Pt[] => [...line, [line[line.length - 1][0], floor], [line[0][0], floor]];

/** Everything above a line, up to `ceiling`: in the top view, everything outside it. */
export const above = (line: Pt[], ceiling = 2400): Pt[] => [...line, [line[line.length - 1][0], ceiling], [line[0][0], ceiling]];

/** The area between two lines drawn the same way. */
export const between = (a: Pt[], b: Pt[]): Pt[] => [...a, ...[...b].reverse()];

/** A band of width `w` centred on a line. */
export function band(line: Pt[], w: number): Pt[] {
  const side = (sign: number) =>
    line.map(([x, y], i): Pt => {
      const [ax, ay] = line[Math.max(0, i - 1)];
      const [bx, by] = line[Math.min(line.length - 1, i + 1)];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      return [x - (sign * w * (by - ay)) / (2 * len), y + (sign * w * (bx - ax)) / (2 * len)];
    });
  return between(side(1), side(-1));
}
