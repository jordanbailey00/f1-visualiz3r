"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ, type V3 } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { naca, plate } from "../../kit/wing";
import { CAR, FLOOR, PLANK, PLANK_HOLES, Z } from "./layout";

/**
 * Tunnel ceiling (mm above the reference plane) along the car: high at the
 * inlets behind the front wheels, a low throat under the sidepods (no lower
 * than about Z = 70 from 2023), then the ramp up into the diffuser.
 */
const ROOF: [number, number][] = [
  [FLOOR.front, 235],
  [1000, 200],
  [800, 150],
  [600, 104],
  [200, 76],
  [-400, 72],
  [-1000, 80],
  [-1350, 96],
  [-1600, 150],
  [-1800, 205],
  [-2000, 255],
  [FLOOR.diffuserEnd, 312],
];

/**
 * Floor half-width along the car: the swept leading edge, the full ±800 mm,
 * the curve in to ±650 mm, the step round the rear tyres and the diffuser
 * walls.
 */
const EDGE: [number, number][] = [
  [FLOOR.front, 282],
  [1060, 480],
  [960, 600],
  [840, 685],
  [700, 748],
  [510, FLOOR.half],
  [-200, FLOOR.half],
  [-700, 784],
  [-1100, 742],
  [FLOOR.rearStep + 20, FLOOR.rearHalf],
  [FLOOR.rearStep - 10, FLOOR.stepHalf],
  [-1800, 468],
  [FLOOR.diffuserEnd, FLOOR.diffuserHalf],
];

/** Half-width of the flat strip on the reference plane between the tunnels: ±50 at the front, ±270 mid-car, ±150 at the rear. */
const KEEL: [number, number][] = [
  [FLOOR.front, 60],
  [700, 150],
  [0, 270],
  [-420, 270],
  [-1000, 200],
  [-1450, 150],
  [FLOOR.diffuserEnd, 150],
];

/** Interpolate a table sorted by descending x. */
function at(table: [number, number][], x: number) {
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x0 && x >= x1) return v0 + ((x0 - x) / (x0 - x1)) * (v1 - v0);
  }
  return x > table[0][0] ? table[0][1] : table[table.length - 1][1];
}

export const roofAt = (x: number) => at(ROOF, x);
/** Top of the floor at x over the tunnels (what the sidepods sit on). */
export const floorTopAt = (x: number) => Z(Math.max(roofAt(x) + 10, 14));
/** The floor's outer edge at x. */
export const floorEdgeAt = (x: number) => at(EDGE, x);

/**
 * One cross-section of the floor body (half, top centre → outboard → bottom
 * centre). The solid floor lies between its top skin and the tunnel ceiling;
 * the tunnel itself is the open channel beneath, between the keel and the
 * outer skirt, closed off by the ground.
 */
function floorRing(x: number) {
  const k = at(KEEL, x);
  const roof = roofAt(x);
  const edge = at(EDGE, x);
  const top = Z(Math.max(roof + 10, 14));
  return mirrorRing(x, [
    [Z(14), 0],
    [Z(14), k - 20],
    [top, k + 64],
    [top + 2, (k + edge) / 2],
    [top - 6, edge - 70],
    [Z(Math.min(roof + 10, 60)), edge],
    [Z(16), edge + 2],
    [Z(18), edge - 16],
    [Z(roof - 8), edge - 76],
    [Z(roof), (k + edge) / 2],
    [Z(roof - 8), k + 52],
    [Z(0), k],
    [Z(0), 0],
  ]);
}

/** Where the leading edge reaches half-span z (the inverse of the swept front of EDGE). */
function leadingEdgeAt(z: number) {
  for (let i = 0; i < 5; i++) {
    const [x0, w0] = EDGE[i];
    const [x1, w1] = EDGE[i + 1];
    if (z <= w1) return x0 - ((Math.max(z, w0) - w0) / (w1 - w0)) * (x0 - x1);
  }
  return EDGE[5][0];
}

/** The floor body with its venturi tunnels, plus the four fences under the leading edge on each side (3.5.2). */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car22-floor", () => {
        const xs = [FLOOR.front, 1060, 960, 840, 700, 510, 300, 0, -400, -700, -1000, -1200, FLOOR.rearStep + 20, FLOOR.rearStep - 10, -1600, -1800, -2000, -2120, FLOOR.diffuserEnd];
        return loft(xs.map(floorRing), { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
      }),
    [],
  );
  // Fences: thin vertical vanes splitting the inlet flow, curving outboard.
  const fences = useMemo(
    () =>
      cached("car22-floor-fences", () => {
        const parts: BufferGeometry[] = [];
        for (const [z, len, turn] of [
          [205, 520, 0.02],
          [330, 560, 0.06],
          [455, 600, 0.1],
          [590, 620, 0.14],
        ] as [number, number, number][]) {
          const x0 = leadingEdgeAt(z) - 6;
          const xs = [x0, x0 - 110, x0 - 250, x0 - 390, x0 - len];
          const top: [number, number][] = xs.map((x) => [x, Z(roofAt(x) - 2)]);
          const f = plate([...top, [x0 - len, Z(2)], [x0 - 30, Z(6)]], 8, 0);
          f.translate(-x0, 0, 0);
          f.rotateY(-turn);
          f.translate(x0, 0, z);
          parts.push(f, mirrorZ(f));
        }
        return mergeAll(parts);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={fences} material={CAR_MAT.carbonMatte} castShadow />
    </group>
  );
}

/**
 * The edge wing (right side): a small aerofoil just above the outer floor,
 * from 1,700 mm behind the front axle to 700 mm ahead of the rear, no higher
 * than Z = 90 (3.5.3). It works the vortices that seal the tunnels.
 */
export function FloorEdge() {
  const geo = useMemo(
    () =>
      cached("car22-floor-edge", () => {
        // Sections across the car (chord outboard), swept fore and aft along the edge.
        const profile = naca(0.06, 0.4, 0.12, 14);
        const chord = 76;
        const rings: V3[][] = [100, -250, -600, -900, -1100].map((x) => {
          const z0 = at(EDGE, x) - 86;
          return profile.map(([sv, h]) => [x, Z(80) + chord * (h + sv * 0.1), z0 + chord * sv] as V3);
        });
        const wing = loft(rings, { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
        const stay = (x: number) => rod([x, Z(60), at(EDGE, x) - 40], [x, Z(80), at(EDGE, x) - 46], 8);
        // Right side only: the model mirrors it.
        return mergeAll([wing, stay(-150), stay(-650), stay(-1050)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Diffuser strakes: vertical walls that divide the rising tail of each tunnel. */
export function Diffuser() {
  const geo = useMemo(
    () =>
      cached("car22-diffuser", () => {
        const xs = [FLOOR.rearStep - 20, -1600, -1800, -2000, -2120, FLOOR.diffuserEnd];
        const parts: BufferGeometry[] = [];
        for (const z of [350, 255, 165]) {
          const top: [number, number][] = xs.map((x) => [x, Z(roofAt(x) - 4)]);
          const wall = plate([...top, [FLOOR.diffuserEnd, Z(0)], [FLOOR.rearStep - 20, Z(0)]], z > 300 ? 10 : 6, z);
          parts.push(wall, mirrorZ(wall));
        }
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Floor stays: slim cables from the chassis that stop the floor edge flexing. */
export function FloorStays() {
  const geo = useMemo(
    () => cached("car22-floor-stays", () => mergeAll([rod([300, 440, 600], [300, floorTopAt(300), 760], 5), rod([-500, 380, 540], [-500, floorTopAt(-500), 740], 5)])),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

/**
 * The plank: a 10 mm skid board along the keel of the floor (3.5.9), with
 * titanium skids and the four 50 mm holes where its wear is measured.
 */
export function Plank() {
  const geo = useMemo(
    () =>
      cached("car22-plank", () => {
        const s = new Shape();
        const pts: [number, number][] = [
          [PLANK.front, PLANK.frontHalf],
          [PLANK.front - 400, PLANK.half],
          [PLANK.rear + 30, PLANK.half],
          [PLANK.rear, PLANK.half - 30],
        ];
        s.moveTo(pts[0][0], -pts[0][1]);
        for (const [x, z] of pts.slice(1)) s.lineTo(x, -z);
        for (const [x, z] of pts.slice().reverse()) s.lineTo(x, z);
        s.closePath();
        const g = new ExtrudeGeometry(s, { depth: 10, bevelEnabled: false });
        g.rotateX(-Math.PI / 2);
        g.translate(0, CAR.refY - 10, 0);
        return g;
      }),
    [],
  );
  // Titanium skids (each under 4,000 mm²) set flush into the plank.
  const skids = useMemo(() => cached("car22-skids", () => mergeAll([1180, 420, -380, -1060].map((x) => new BoxGeometry(80, 10.6, 40).translate(x, CAR.refY - 5, 0)))), []);
  const holes = useMemo(() => cached("car22-plank-hole", () => new CircleGeometry(25, 28).rotateX(Math.PI / 2)), []);
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={skids} material={CAR_MAT.titanium} />
      {PLANK_HOLES.map(([x, z]) => (
        <mesh key={`${x}:${z}`} geometry={holes} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, z]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#7d6346", { roughness: 0.8, clearcoat: 0.1, metalness: 0 });
