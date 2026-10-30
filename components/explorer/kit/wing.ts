import { BufferGeometry, ExtrudeGeometry, Shape } from "three";
import { loft, type V3 } from "./loft";

/**
 * Wing elements. Racing wings are upside-down aerofoils: the cambered side
 * faces the ground so the pressure difference pushes the car down.
 */

/** (s, h) points round a NACA 4-digit section, chord 0…1, from the trailing edge over the top to the leading edge and back underneath. */
export function naca(camber: number, camberPos: number, thickness: number, n = 26, invert = true): [number, number][] {
  const m = camber;
  const p = camberPos;
  const t = thickness;
  const yt = (x: number) => 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const yc = (x: number) => (x < p ? (m / (p * p)) * (2 * p * x - x * x) : (m / (1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x * x));
  const dyc = (x: number) => (x < p ? ((2 * m) / (p * p)) * (p - x) : ((2 * m) / (1 - p) ** 2) * (p - x));
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = (1 - Math.cos((i / n) * Math.PI)) / 2;
    const th = Math.atan(dyc(x));
    const y = yt(x);
    upper.push([x - y * Math.sin(th), yc(x) + y * Math.cos(th)]);
    lower.push([x + y * Math.sin(th), yc(x) - y * Math.cos(th)]);
  }
  // Trailing edge → leading edge along the upper surface, then back along the lower.
  const pts = [...upper.reverse(), ...lower.slice(1, -1)];
  return invert ? pts.map(([s, h]) => [s, -h]) : pts;
}

export interface WingStation {
  /** Span position (car z) of this section. */
  z: number;
  /** Leading edge position (car x, y). */
  x: number;
  y: number;
  chord: number;
  /** Trailing-edge-up angle in radians. */
  angle: number;
  /** Section thickness multiplier (1 = the profile as given). */
  thick?: number;
}

/** Airfoil section placed in the car's XY plane at span position z. */
export function wingRing(profile: [number, number][], st: WingStation): V3[] {
  const { x, y, chord: c, angle: a, z } = st;
  const k = st.thick ?? 1;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  return profile.map(([s, h]) => {
    const hh = h * k;
    return [x + c * (-s * ca + hh * sa), y + c * (s * sa + hh * ca), z];
  });
}

/** A wing element lofted through spanwise stations (ordered across the span). */
export function wingElement(profile: [number, number][], stations: WingStation[], along = 6, caps = true): BufferGeometry {
  return loft(
    stations.map((st) => wingRing(profile, st)),
    { along, around: 1, closed: true, capStart: caps, capEnd: caps, uvScale: 100 },
  );
}

/** Mirror half-span stations (centre → tip, z ≥ 0) into a full span list. */
export function fullSpan(half: WingStation[]): WingStation[] {
  const left = half
    .slice()
    .reverse()
    .filter((s) => s.z > 1e-6)
    .map((s) => ({ ...s, z: -s.z }));
  return [...left, ...half];
}

/**
 * A flat plate (endplate, fence, strake) from an outline in the XY plane,
 * `thick` mm thick, centred on `z`, with softly rounded edges.
 */
export function plate(outline: [number, number][], thick: number, z = 0, bevel = Math.min(1.5, thick * 0.3)) {
  const s = new Shape();
  s.moveTo(outline[0][0], outline[0][1]);
  for (let i = 1; i < outline.length; i++) s.lineTo(outline[i][0], outline[i][1]);
  s.closePath();
  const depth = Math.max(0.1, thick - bevel * 2);
  const g = new ExtrudeGeometry(s, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 12,
  });
  g.translate(0, 0, z - depth / 2);
  // Extrude UVs are in shape units (mm); match the 100 mm-per-unit convention.
  const uv = g.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 100, uv.getY(i) / 100);
  return g;
}

/** Smooth outline through control points (closed), for plates with curved edges. */
export function smoothOutline(pts: [number, number][], per = 6): [number, number][] {
  const n = pts.length;
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  return out;
}

export interface PathStation {
  /** Leading edge position. The element's span runs along the path through (y, z). */
  x: number;
  y: number;
  z: number;
  chord: number;
  /** Trailing-edge-up angle (radians) in the section plane. */
  angle: number;
  thick?: number;
}

/**
 * A wing element whose span follows a curve in the YZ plane, such as a rear
 * wing whose tips roll down into its sides. Each section lies in the plane
 * of the car's x axis and the path normal, so where the path turns
 * downwards the aerofoil turns with it.
 */
export function wingAlongPath(profile: [number, number][], path: PathStation[], along = 6, caps = true): BufferGeometry {
  const rings: V3[][] = path.map((st, i) => {
    const prev = path[Math.max(0, i - 1)];
    const next = path[Math.min(path.length - 1, i + 1)];
    // Span tangent in YZ, and the section's "up" (normal) square to it.
    let ty = next.y - prev.y;
    let tz = next.z - prev.z;
    const tl = Math.hypot(ty, tz) || 1;
    ty /= tl;
    tz /= tl;
    // Normal: the tangent turned 90° towards +y for a span running along +z.
    const ny = tz;
    const nz = -ty;
    const k = st.thick ?? 1;
    const ca = Math.cos(st.angle);
    const sa = Math.sin(st.angle);
    return profile.map(([s, h]) => {
      const hh = h * k;
      const along = -s * ca + hh * sa;
      const up = s * sa + hh * ca;
      return [st.x + st.chord * along, st.y + st.chord * up * ny, st.z + st.chord * up * nz] as V3;
    });
  });
  return loft(rings, { along, around: 1, closed: true, capStart: caps, capEnd: caps, uvScale: 100 });
}
