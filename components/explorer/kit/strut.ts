import {
  BufferGeometry,
  CylinderGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { bentPath } from "./Thermal";
import { mergeAll } from "./geometry";

type V3 = [number, number, number];

const unitRod = new CylinderGeometry(0.5, 0.5, 1, 18, 1, false);
/** Teardrop section (round nose, tapering tail) for streamlined members. */
const unitFoil = (() => {
  const g = new CylinderGeometry(0.5, 0.5, 1, 24, 1, false);
  const p = g.getAttribute("position");
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    // Leading half round (x > 0), trailing half drawn out to a fine tail.
    if (x < 0) p.setXYZ(i, x * (1 + 1.1 * (Math.abs(x) * 2) ** 1.5), p.getY(i), z * (1 - 0.75 * (Math.abs(x) * 2) ** 1.4));
  }
  // Rescale so the whole chord spans −0.5…0.5.
  for (let i = 0; i < p.count; i++) p.setX(i, (p.getX(i) + 1.05) / 1.55 - 0.5);
  g.computeVertexNormals();
  return g;
})();

const sphere = new SphereGeometry(0.5, 16, 12);

/**
 * Matrix placing a unit member (axis along Y, section in XZ) between a and b,
 * with its section's long axis turned towards `prefer` (projected square to
 * the member).
 */
export function memberMatrix(a: V3, b: V3, width: number, thick: number, prefer: V3 = [1, 0, 0]) {
  const A = new Vector3(...a);
  const B = new Vector3(...b);
  const axis = B.clone().sub(A);
  const len = axis.length();
  axis.normalize();
  const major = new Vector3(...prefer);
  major.addScaledVector(axis, -major.dot(axis));
  if (major.lengthSq() < 1e-8) major.set(0, 1, 0).addScaledVector(axis, -axis.y);
  major.normalize();
  const minor = new Vector3().crossVectors(major, axis).normalize();
  const rot = new Matrix4().makeBasis(major, axis, minor);
  const q = new Quaternion().setFromRotationMatrix(rot);
  return new Matrix4().compose(A.clone().add(B).multiplyScalar(0.5), q, new Vector3(width, len, thick));
}

/** Round rod between two points. */
export function rod(a: V3, b: V3, diameter: number) {
  return unitRod.clone().applyMatrix4(memberMatrix(a, b, diameter, diameter));
}

/**
 * Streamlined member between two points: teardrop section `chord` wide and
 * `thick` deep, its nose pointing along `forward` (the oncoming air).
 */
export function foilMember(a: V3, b: V3, chord: number, thick: number, forward: V3 = [1, 0, 0]) {
  return unitFoil.clone().applyMatrix4(memberMatrix(a, b, chord, thick, forward));
}

export function ball(p: V3, d: number) {
  return sphere.clone().applyMatrix4(new Matrix4().compose(new Vector3(...p), new Quaternion(), new Vector3(d, d, d)));
}

/** Pipe or hose of radius r along a path with rounded bends. */
export function pipe(points: V3[], r: number, bend = r * 3, radial = 12) {
  const path = bentPath(points, bend);
  return new TubeGeometry(path, Math.max(8, Math.round(path.getLength() / Math.max(4, r))), r, radial, false);
}

/**
 * A wishbone: two streamlined legs from the inboard pick-ups to one outboard
 * joint, with spherical bearings at every end.
 */
export function wishbone(front: V3, rear: V3, outer: V3, chord: number, thick: number): BufferGeometry {
  return mergeAll([
    foilMember(front, outer, chord, thick),
    foilMember(rear, outer, chord, thick),
    ball(front, thick * 1.6),
    ball(rear, thick * 1.6),
    ball(outer, thick * 2),
  ]);
}
