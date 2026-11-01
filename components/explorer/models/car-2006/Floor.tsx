"use client";

import { useMemo } from "react";
import { CircleGeometry, CylinderGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { CAR, FLOOR, PLANK, PLANK_HOLES, Z } from "./layout";

/** Interpolate a table sorted by descending x. */
function at(table: [number, number][], x: number) {
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x0 && x >= x1) return v0 + ((x0 - x) / (x0 - x1)) * (v1 - v0);
  }
  return x > table[0][0] ? table[0][1] : table[table.length - 1][1];
}

/**
 * Floor half-width along the car: inside ±400 mm until 800 mm behind the front
 * axle (3.11), then the full ±700 mm, then cut in to ±500 mm for the last
 * 400 mm before the rear axle, ahead of the rear tyres (3.8.4).
 */
const EDGE: [number, number][] = [
  [FLOOR.front, FLOOR.frontHalf - 16],
  [FLOOR.frontZone + 24, FLOOR.frontHalf],
  [FLOOR.frontZone + 4, FLOOR.frontHalf],
  [FLOOR.frontZone - 20, 640],
  [FLOOR.frontZone - 50, FLOOR.half],
  [FLOOR.rearStep + 90, FLOOR.half],
  [FLOOR.rearStep + 30, FLOOR.half],
  [FLOOR.rearStep + 22, 660],
  [FLOOR.rearStep + 12, 540],
  [FLOOR.rearStep - 12, FLOOR.rearHalf - 8],
  [FLOOR.rearStep - 60, FLOOR.rearHalf],
  [FLOOR.diffuserEnd, FLOOR.rearHalf],
];

/** How far the diffuser has risen by x, 0 → 1 at the rear axle. */
function ramp(x: number) {
  const t = Math.min(1, Math.max(0, (FLOOR.diffuserStart - x) / (FLOOR.diffuserStart - FLOOR.diffuserEnd)));
  return Math.pow(t, 1.25);
}

/**
 * Underside heights at x. Outside ±150 mm it lies on the step plane (Z = 50)
 * until 330 mm ahead of the rear axle, then the diffuser rises to Z = 125 at
 * the axle; the central strip stays on the reference plane all the way, as the
 * plank must reach the axle (3.12.2).
 */
const undersideAt = (x: number) => FLOOR.step + (FLOOR.diffuserHeight - FLOOR.step) * ramp(x);

/** Top of the floor at x (what the sidepods sit on). */
export const floorTopAt = (x: number) => Z(undersideAt(x) + FLOOR.thick);
/** The floor's outer edge at x. */
export const floorEdgeAt = (x: number) => at(EDGE, x);

/**
 * One cross-section of the floor (half, top centre → outboard → bottom
 * centre): a flat plate on the step plane, with the keel stepping down to the
 * reference plane along the middle.
 */
function floorRing(x: number) {
  const e = at(EDGE, x);
  const out = undersideAt(x);
  const k = Math.min(FLOOR.keel, e - 40);
  const top = Z(out + FLOOR.thick);
  return mirrorRing(x, [
    [top, 0],
    [top, e - 12],
    [Z(out + FLOOR.thick / 2), e],
    [Z(out), e - 8],
    [Z(out), k + 14],
    [Z(Math.max(0, out - 12)), k],
    [Z(0), k - 8],
    [Z(0), 0],
  ]);
}

/**
 * The floor body: the stepped plate from 330 mm behind the front axle to the
 * rear axle, with the tea tray (the splitter under the chassis) ahead of it,
 * at least 50 mm off the reference plane (3.7.2).
 */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car06-floor", () => {
        const xs = [
          FLOOR.front,
          FLOOR.frontZone + 24,
          FLOOR.frontZone + 4,
          FLOOR.frontZone - 20,
          FLOOR.frontZone - 50,
          FLOOR.frontZone - 110,
          FLOOR.frontZone - 200,
          0,
          -600,
          FLOOR.rearStep + 90,
          FLOOR.rearStep + 30,
          FLOOR.rearStep + 22,
          FLOOR.rearStep + 12,
          FLOOR.rearStep - 12,
          FLOOR.rearStep - 60,
          FLOOR.diffuserStart,
          (FLOOR.diffuserStart + FLOOR.diffuserEnd) / 2,
          FLOOR.diffuserEnd + 30,
          FLOOR.diffuserEnd,
        ];
        return loft(xs.map(floorRing), { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
      }),
    [],
  );
  const tray = useMemo(
    () =>
      cached("car06-tea-tray", () => {
        const w = FLOOR.trayHalf;
        const y = Z(FLOOR.trayHeight);
        const xs = [FLOOR.trayFront, FLOOR.trayFront - 40, FLOOR.trayFront - 160, 1500, FLOOR.front + 10, FLOOR.front - 30];
        const widths = [w - 110, w - 30, w, w, w, w];
        return loft(
          xs.map((x, i) =>
            mirrorRing(x, [
              [y + 14, 0],
              [y + 14, widths[i] - 8],
              [y + 7, widths[i]],
              [y, widths[i] - 8],
              [y, 0],
            ]),
          ),
          { along: 3, around: 1, closed: true, capStart: true, capEnd: true },
        );
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={tray} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
    </group>
  );
}

/**
 * The bargeboards (right side; the model mirrors it). The rules only keep the
 * space round the front wheels clear outside ±400 mm (3.11), so behind the
 * wheels and inside that line stand a big curved board and a smaller one,
 * with fences on the floor just behind the zone.
 */
export function Bargeboards() {
  const geo = useMemo(
    () =>
      cached("car06-bargeboards", () => {
        const floorTop = Z(FLOOR.step + FLOOR.thick);
        const parts: BufferGeometry[] = [];
        const board = (x0: number, z0: number, x1: number, z1: number, h: number) => {
          const len = Math.hypot(x0 - x1, z1 - z0);
          const b = plate(
            smoothOutline(
              [
                [0, floorTop],
                [-10, Z(h - 110)],
                [-90, Z(h)],
                [-len * 0.5, Z(h - 8)],
                [-len * 0.82, Z(h - 60)],
                [-len, Z(h - 150)],
                [-len, floorTop],
              ],
              3,
            ),
            6,
            0,
          );
          b.rotateY(Math.atan2(z1 - z0, x0 - x1));
          b.translate(x0, 0, z0);
          parts.push(b);
        };
        board(FLOOR.front - 40, 262, FLOOR.frontZone + 24, 384, 320);
        board(FLOOR.front - 110, 214, FLOOR.frontZone + 104, 318, 230);
        // A fence on the floor's leading edge, ahead of the sidepod undercut.
        const x0 = FLOOR.frontZone - 34;
        parts.push(
          plate(
            smoothOutline(
              [
                [x0, floorTop],
                [x0 - 40, Z(176)],
                [x0 - 300, Z(150)],
                [x0 - 340, floorTop],
              ],
              3,
            ),
            5,
            664,
          ),
        );
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Turning vanes (right side): hanging from the chassis to the tea tray, steering air out under the sidepods. */
export function TurningVanes() {
  const geo = useMemo(
    () =>
      cached("car06-turning-vanes", () => {
        const top = 300;
        const low = Z(FLOOR.trayHeight + 24);
        return mergeAll(
          (
            [
              [146, 1760, 0.08],
              [192, 1690, 0.1],
            ] as [number, number, number][]
          ).map(([z, x0, toe]) => {
            const v = plate(
              smoothOutline([
                [0, low],
                [-12, top],
                [-330, top - 70],
                [-420, low],
              ]),
              5,
              0,
            );
            v.rotateY(toe);
            v.translate(x0, 0, z);
            return v;
          }),
        );
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The diffuser. Outside ±150 mm it is short: a ramp from 330 mm ahead of the
 * rear axle to the axle, where it must stop, as nothing out there may be below
 * Z = 300 behind the axle (3.10.2). Only the middle may carry on, so it kicks
 * up in a tall tail under the crash structure. Fences divide the channels.
 */
export function Diffuser() {
  const geo = useMemo(
    () =>
      cached("car06-diffuser", () => {
        const { diffuserStart: ds, diffuserEnd: de, tailEnd: te, tailHeight: th } = FLOOR;
        const roof = (x: number) => th * Math.pow(Math.max(0, de - x) / (de - te), 1.2);
        const tail = loft(
          [de + 4, de - 40, de - 110, de - 190, te].map((x) =>
            mirrorRing(x, [
              [Z(roof(x)) + 10, 0],
              [Z(roof(x)) + 10, 146],
              [Z(roof(x)) + 5, 150],
              [Z(roof(x)), 146],
              [Z(roof(x)), 0],
            ]),
          ),
          { along: 3, around: 1, closed: true, capStart: true, capEnd: true },
        );
        const parts: BufferGeometry[] = [tail];
        const xs = [ds + 30, ds, (ds + de) / 2, de + 40, de];
        const wall = (z: number, t: number, low: number) => {
          const top: [number, number][] = xs.map((x) => [x, Z(undersideAt(x)) + 2]);
          const bottom: [number, number][] = xs
            .slice()
            .reverse()
            .map((x) => [x, Math.min(Z(undersideAt(x)) - 4, Z(low))]);
          const w = plate([...top, ...bottom], t, z);
          parts.push(w, mirrorZ(w));
        };
        wall(FLOOR.rearHalf - 6, 10, 50);
        wall(330, 6, 50);
        wall(240, 6, 30);
        // The tail's side walls, carried on from the floor behind the axle.
        const fin = plate(
          [
            [de + 60, Z(2)],
            [de + 60, Z(52)],
            [te, Z(th + 12)],
            [te, Z(th - 60)],
            [de - 60, Z(2)],
          ],
          8,
          145,
        );
        parts.push(fin, mirrorZ(fin));
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Floor stays: slim rods from the sidepods that stop the floor edge flexing. */
export function FloorStays() {
  const geo = useMemo(
    () => cached("car06-floor-stays", () => mergeAll([rod([300, 290, 430], [300, floorTopAt(300), 680], 5), rod([-700, 240, 340], [-700, floorTopAt(-700), 670], 5)])),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

/**
 * The plank: a 300 mm wide, 10 mm skid board under the keel from 330 mm
 * behind the front axle to the rear axle, with its fasteners and the seven
 * holes where its wear is measured (3.13, Drawing 1).
 */
export function Plank() {
  const geo = useMemo(
    () =>
      cached("car06-plank", () => {
        const s = new Shape();
        const h = PLANK.half;
        s.moveTo(PLANK.front, -h + 50);
        s.quadraticCurveTo(PLANK.front, -h, PLANK.front - 50, -h);
        s.lineTo(PLANK.rear, -h);
        s.lineTo(PLANK.rear, h);
        s.lineTo(PLANK.front - 50, h);
        s.quadraticCurveTo(PLANK.front, h, PLANK.front, h - 50);
        s.closePath();
        const g = new ExtrudeGeometry(s, { depth: 10, bevelEnabled: false, curveSegments: 8 });
        g.rotateX(-Math.PI / 2);
        g.translate(0, CAR.refY - 10, 0);
        return g;
      }),
    [],
  );
  // Metal fasteners (each under 2,000 mm², 40,000 mm² in all) through the plank.
  const fasteners = useMemo(
    () =>
      cached("car06-fasteners", () =>
        mergeAll([1100, 750, 330, -40, -420, -760, -1120, -1500].flatMap((x) => [-112, 112].map((z) => new CylinderGeometry(22, 22, 10.6, 20).translate(x, CAR.refY - 5, z)))),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={fasteners} material={CAR_MAT.titanium} />
      {PLANK_HOLES.map(([x, z, d]) => (
        <mesh key={`${x}:${z}`} geometry={cached(`car06-plank-hole:${d}`, () => new CircleGeometry(d / 2, 28).rotateX(Math.PI / 2))} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, z]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#7d6346", { roughness: 0.8, clearcoat: 0.1, metalness: 0 });
