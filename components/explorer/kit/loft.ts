import { BufferAttribute, BufferGeometry, Vector3 } from "three";

/**
 * Lofted surfaces: the main tool for organic bodywork. A loft is built from a
 * list of control rings (cross-sections with the same number of points);
 * centripetal Catmull–Rom splines smooth each ring and then run along
 * corresponding points from ring to ring, so a handful of sections describe a
 * whole nose, sidepod or wing element.
 */
export type V3 = [number, number, number];

const ALPHA = 0.5;

function knot(a: number[], b: number[]) {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += (a[i] - b[i]) ** 2;
  return Math.max(Math.pow(d, ALPHA / 2), 1e-6);
}

/** Centripetal Catmull–Rom between p1 and p2 (Barry–Goldman form), any dimension. */
function cr(p0: number[], p1: number[], p2: number[], p3: number[], u: number, out: number[]) {
  const t0 = 0;
  const t1 = t0 + knot(p0, p1);
  const t2 = t1 + knot(p1, p2);
  const t3 = t2 + knot(p2, p3);
  const t = t1 + (t2 - t1) * u;
  for (let i = 0; i < p1.length; i++) {
    const a1 = ((t1 - t) / (t1 - t0)) * p0[i] + ((t - t0) / (t1 - t0)) * p1[i];
    const a2 = ((t2 - t) / (t2 - t1)) * p1[i] + ((t - t1) / (t2 - t1)) * p2[i];
    const a3 = ((t3 - t) / (t3 - t2)) * p2[i] + ((t - t2) / (t3 - t2)) * p3[i];
    const b1 = ((t2 - t) / (t2 - t0)) * a1 + ((t - t0) / (t2 - t0)) * a2;
    const b2 = ((t3 - t) / (t3 - t1)) * a2 + ((t - t1) / (t3 - t1)) * a3;
    out[i] = ((t2 - t) / (t2 - t1)) * b1 + ((t - t1) / (t2 - t1)) * b2;
  }
  return out;
}

const same = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);

/**
 * Sample a spline through `pts` with `per` samples per segment. Every control
 * point is itself a sample, so corresponding points of different rings stay
 * aligned. Repeating a point makes a sharp corner.
 */
export function spline(pts: number[][], per: number, closed = false): number[][] {
  const n = pts.length;
  if (per <= 1 || n < 2) return pts.map((p) => [...p]);
  const at = (i: number) => {
    if (closed) return pts[((i % n) + n) % n];
    if (i < 0) return pts[0].map((v, k) => 2 * v - pts[1][k]);
    if (i >= n) return pts[n - 1].map((v, k) => 2 * v - pts[n - 2][k]);
    return pts[i];
  };
  const out: number[][] = [];
  const segs = closed ? n : n - 1;
  for (let s = 0; s < segs; s++) {
    const p0 = at(s - 1);
    const p1 = at(s);
    const p2 = at(s + 1);
    const p3 = at(s + 2);
    for (let k = 0; k < per; k++) {
      if (k === 0 || same(p1, p2)) out.push([...p1]);
      else out.push(cr(same(p0, p1) ? at(s - 2) : p0, p1, p2, same(p2, p3) ? at(s + 3) : p3, k / per, new Array(p1.length)));
    }
  }
  if (!closed) out.push([...pts[n - 1]]);
  return out;
}

export interface LoftOptions {
  /** Samples per segment between control rings (along the loft). */
  along?: number;
  /** Samples per segment between points of a ring; 1 uses the points as given. */
  around?: number;
  /** Rings are closed loops (default) or open strips. */
  closed?: boolean;
  /** Close the first / last ring with a flat fan. */
  capStart?: boolean;
  capEnd?: boolean;
  /** Millimetres per UV unit (default 100). */
  uvScale?: number;
}

/** Surface through control rings. Normals face away from each ring's centre. */
export function loft(rings: V3[][], opts: LoftOptions = {}): BufferGeometry {
  const { along = 8, around = 1, closed = true, capStart = false, capEnd = false, uvScale = 100 } = opts;
  const dense = rings.map((r) => spline(r, around, closed));
  const cols = dense[0].length;
  const columns: number[][][] = [];
  for (let j = 0; j < cols; j++) columns.push(spline(dense.map((r) => r[j]), along, false));
  const rows = columns[0].length;
  const C = closed ? cols + 1 : cols;

  const pos = new Float32Array(rows * C * 3);
  const uv = new Float32Array(rows * C * 2);
  for (let i = 0; i < rows; i++) {
    let v = 0;
    for (let j = 0; j < C; j++) {
      const p = columns[j % cols][i];
      if (j > 0) {
        const q = columns[(j - 1) % cols][i];
        v += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
      }
      const o = i * C + j;
      pos.set(p, o * 3);
      uv[o * 2 + 1] = v / uvScale;
    }
  }
  for (let j = 0; j < C; j++) {
    let u = 0;
    for (let i = 0; i < rows; i++) {
      const o = i * C + j;
      if (i > 0) {
        const q = (i - 1) * C + j;
        u += Math.hypot(pos[o * 3] - pos[q * 3], pos[o * 3 + 1] - pos[q * 3 + 1], pos[o * 3 + 2] - pos[q * 3 + 2]);
      }
      uv[o * 2] = u / uvScale;
    }
  }

  // Orientation: normals should point away from the ring centre.
  const mid = Math.floor(rows / 2);
  const centre = new Vector3();
  for (let j = 0; j < cols; j++) centre.add(new Vector3(...columns[j][mid]));
  centre.divideScalar(cols);
  const idx: number[] = [];
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < C - 1; j++) {
      const a = i * C + j;
      const b = i * C + j + 1;
      const c = (i + 1) * C + j;
      const d = (i + 1) * C + j + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("uv", new BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const nrm = g.getAttribute("normal") as BufferAttribute;
  // Probe a well-conditioned vertex: largest distance from the centre.
  let probe = mid * C;
  let best = -1;
  for (let j = 0; j < cols; j++) {
    const o = mid * C + j;
    const d = new Vector3(pos[o * 3], pos[o * 3 + 1], pos[o * 3 + 2]).distanceTo(centre);
    if (d > best) {
      best = d;
      probe = o;
    }
  }
  const out = new Vector3(pos[probe * 3], pos[probe * 3 + 1], pos[probe * 3 + 2]).sub(centre);
  const n = new Vector3(nrm.getX(probe), nrm.getY(probe), nrm.getZ(probe));
  if (n.dot(out) < 0) {
    const a = g.getIndex()!.array as Uint32Array | Uint16Array;
    for (let k = 0; k < a.length; k += 3) {
      const t = a[k + 1];
      a[k + 1] = a[k + 2];
      a[k + 2] = t;
    }
    g.getIndex()!.needsUpdate = true;
    g.computeVertexNormals();
  }
  if (closed) {
    // The UV seam duplicates a column: give both copies the same normal.
    const nn = g.getAttribute("normal") as BufferAttribute;
    for (let i = 0; i < rows; i++) {
      const a = i * C;
      const b = i * C + cols;
      const s = new Vector3(nn.getX(a) + nn.getX(b), nn.getY(a) + nn.getY(b), nn.getZ(a) + nn.getZ(b)).normalize();
      nn.setXYZ(a, s.x, s.y, s.z);
      nn.setXYZ(b, s.x, s.y, s.z);
    }
  }
  if (!capStart && !capEnd) return g;
  return withCaps(g, columns, rows, cols, capStart, capEnd, uvScale);
}

/** Adds flat fan caps to the first and/or last ring of a loft. */
function withCaps(
  body: BufferGeometry,
  columns: number[][][],
  rows: number,
  cols: number,
  start: boolean,
  end: boolean,
  uvScale: number,
) {
  const bp = body.getAttribute("position").array as Float32Array;
  const bn = body.getAttribute("normal").array as Float32Array;
  const bu = body.getAttribute("uv").array as Float32Array;
  const bi = Array.from(body.getIndex()!.array);
  const P: number[] = Array.from(bp);
  const N: number[] = Array.from(bn);
  const U: number[] = Array.from(bu);
  const I = bi;
  const cap = (row: number, towards: number) => {
    const ring = columns.map((c) => new Vector3(...c[row]));
    const centre = ring.reduce((a, b) => a.add(b), new Vector3()).divideScalar(cols);
    const other = columns.map((c) => new Vector3(...c[towards])).reduce((a, b) => a.add(b), new Vector3()).divideScalar(cols);
    const normal = centre.clone().sub(other).normalize();
    const base = P.length / 3;
    P.push(centre.x, centre.y, centre.z);
    N.push(normal.x, normal.y, normal.z);
    U.push(0, 0);
    for (const p of ring) {
      P.push(p.x, p.y, p.z);
      N.push(normal.x, normal.y, normal.z);
      U.push((p.x - centre.x + p.z - centre.z) / uvScale, (p.y - centre.y) / uvScale);
    }
    for (let j = 0; j < cols; j++) {
      const a = base + 1 + j;
      const b = base + 1 + ((j + 1) % cols);
      // Wind so the face points along `normal`.
      const e1 = ring[j].clone().sub(centre);
      const e2 = ring[(j + 1) % cols].clone().sub(centre);
      if (e1.cross(e2).dot(normal) >= 0) I.push(base, a, b);
      else I.push(base, b, a);
    }
  };
  if (start) cap(0, 1);
  if (end) cap(rows - 1, rows - 2);
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute("normal", new BufferAttribute(new Float32Array(N), 3));
  g.setAttribute("uv", new BufferAttribute(new Float32Array(U), 2));
  g.setIndex(I);
  return g;
}

/**
 * Full ring in the YZ plane at `x`, from a half-profile of (y, z) points that
 * runs from the top centre (z = 0) round the +z side to the bottom centre.
 * The −z side is its mirror image.
 */
export function mirrorRing(x: number, half: [number, number][]): V3[] {
  const ring: V3[] = half.map(([y, z]) => [x, y, z]);
  for (let i = half.length - 2; i >= 1; i--) ring.push([x, half[i][0], -half[i][1]]);
  return ring;
}

/**
 * Superellipse ring in the YZ plane at `x`: half-width `w`, extending `top`
 * above and `bottom` below `cy`. Exponents above 2 square it off; `taper`
 * narrows the top (0.2 = top 20% narrower than the waist).
 */
export function superRing(
  x: number,
  cy: number,
  w: number,
  top: number,
  bottom: number,
  { n = 2.6, nBottom = n, taper = 0, count = 32, cz = 0 }: { n?: number; nBottom?: number; taper?: number; count?: number; cz?: number } = {},
): V3[] {
  const ring: V3[] = [];
  for (let i = 0; i < count; i++) {
    // Start at the top centre and run round the +z side first.
    const a = Math.PI / 2 - (i / count) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const e = s >= 0 ? n : nBottom;
    const zz = Math.sign(c) * Math.pow(Math.abs(c), 2 / e);
    const yy = Math.sign(s) * Math.pow(Math.abs(s), 2 / e);
    const h = s >= 0 ? top : bottom;
    const narrow = s > 0 ? 1 - taper * yy : 1;
    ring.push([x, cy + yy * h, cz + zz * w * narrow]);
  }
  return ring;
}

/** Same superellipse but in the XY plane at `z` (for lofts that run across the car). */
export function superRingXY(
  z: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
  { n = 2.6, count = 28 }: { n?: number; count?: number } = {},
): V3[] {
  const ring: V3[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    ring.push([cx + Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * w, cy + Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * h, z]);
  }
  return ring;
}

/** Mirror a geometry across the car's centre plane (z → −z), fixing winding. */
export function mirrorZ(g: BufferGeometry): BufferGeometry {
  const m = g.clone();
  // scale() mirrors positions and normals; the winding must be reversed too.
  m.scale(1, 1, -1);
  const index = m.getIndex();
  if (index) {
    const a = index.array as Uint32Array | Uint16Array;
    for (let k = 0; k < a.length; k += 3) {
      const t = a[k + 1];
      a[k + 1] = a[k + 2];
      a[k + 2] = t;
    }
    index.needsUpdate = true;
  } else {
    for (const name of Object.keys(m.attributes)) {
      const attr = m.getAttribute(name) as BufferAttribute;
      const n = attr.itemSize;
      const arr = attr.array as Float32Array;
      for (let v = 0; v + 2 < attr.count; v += 3) {
        for (let c = 0; c < n; c++) {
          const i1 = (v + 1) * n + c;
          const i2 = (v + 2) * n + c;
          const t = arr[i1];
          arr[i1] = arr[i2];
          arr[i2] = t;
        }
      }
      attr.needsUpdate = true;
    }
  }
  return m;
}
