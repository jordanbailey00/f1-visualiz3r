"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { CAR, FLOOR, FRONT_ZONE, PLANK, PLANK_HOLES, XF, Z } from "./layout";

/** Interpolate a table sorted by descending x. */
function at(table: [number, number][], x: number) {
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x0 && x >= x1) return v0 + ((x0 - x) / (x0 - x1)) * (v1 - v0);
  }
  return x > table[0][0] ? table[0][1] : table[table.length - 1][1];
}

/** Inboard edge of the zone round the front wheels at x: ±165 mm, then the 4.5° line, then the diagonal out to ±415 mm. */
export function zoneInner(x: number) {
  const Z_ = FRONT_ZONE;
  if (x >= Z_.kink) return Math.max(Z_.inner, Z_.kinkY - (x - Z_.kink) * Math.tan((4.5 * Math.PI) / 180));
  if (x >= Z_.back) return Z_.kinkY + ((Z_.kink - x) / (Z_.kink - Z_.back)) * (Z_.backY - Z_.kinkY);
  return Infinity;
}

/**
 * Floor half-width along the car: narrow ahead of the sidepods, inside the
 * zone round the front wheels, then the full ±700 mm, stepping in round the
 * rear tyres to the diffuser.
 */
const EDGE: [number, number][] = [
  [FLOOR.front, zoneInner(FLOOR.front) - 4],
  [FRONT_ZONE.kink, FRONT_ZONE.kinkY - 4],
  [FRONT_ZONE.back + 5, zoneInner(FRONT_ZONE.back + 5) - 6],
  [FRONT_ZONE.back - 15, 560],
  [FRONT_ZONE.back - 45, 680],
  [FRONT_ZONE.back - 65, FLOOR.half],
  [FLOOR.rearStep + 20, FLOOR.half],
  [FLOOR.rearStep - 10, FLOOR.diffuserHalf],
  [FLOOR.diffuserEnd, FLOOR.diffuserHalf],
];

/** How far a ramp starting at `start` has risen by x, 0 → 1 at the diffuser exit. */
function ramp(start: number, x: number) {
  const t = Math.min(1, Math.max(0, (start - x) / (start - FLOOR.diffuserEnd)));
  return Math.pow(t, 1.25);
}

/**
 * Underside heights at x. Outboard it lies on the step plane (Z = 50) as far
 * as the rear axle, then the diffuser rises to Z = 125; the central strip
 * stays on the reference plane to the axle, where the plank ends.
 */
function underside(x: number) {
  const k = ramp(FLOOR.diffuserStart, x);
  return { out: FLOOR.step + (FLOOR.diffuserHeight - FLOOR.step) * k, mid: (FLOOR.diffuserHeight - 25) * k };
}

/** Top of the floor at x (what the sidepods sit on). */
export const floorTopAt = (x: number) => Z(underside(x).out + FLOOR.thick);
/** The floor's outer edge at x. */
export const floorEdgeAt = (x: number) => at(EDGE, x);

/**
 * One cross-section of the floor (half, top centre → outboard → bottom
 * centre): a flat plate on the step plane, with the keel stepping down to the
 * reference plane along the middle.
 */
function floorRing(x: number) {
  const e = at(EDGE, x);
  const { out, mid } = underside(x);
  const k = Math.min(FLOOR.keel, e - 40);
  const top = Z(out + FLOOR.thick);
  return mirrorRing(x, [
    [top, 0],
    [top, e - 12],
    [Z(out + FLOOR.thick / 2), e],
    [Z(out), e - 8],
    [Z(out), k + 14],
    [Z(Math.max(mid, out - 12)), k],
    [Z(mid), k - 8],
    [Z(mid), 0],
  ]);
}

/** Underside of the tea tray: nothing below Z = 100 at 325 mm behind the front axle, rising to Z = 135 at 450 mm ahead (3.11.2). */
const trayBottom = (x: number) => Z(100 + (35 * (x - (XF - 325))) / 775) + 2;

/**
 * The floor body: the stepped plate from 330 mm behind the front axle to the
 * diffuser exit, narrow until the sidepods, with the tea tray (the splitter
 * under the chassis) ahead of it, raised clear of the ground.
 */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car14-floor", () => {
        const xs = [
          FLOOR.front,
          FRONT_ZONE.kink,
          FRONT_ZONE.back + 5,
          FRONT_ZONE.back - 15,
          FRONT_ZONE.back - 45,
          FRONT_ZONE.back - 65,
          0,
          -800,
          -1400,
          FLOOR.rearStep + 20,
          FLOOR.rearStep - 10,
          FLOOR.diffuserStart,
          (FLOOR.diffuserStart + FLOOR.diffuserEnd) / 2,
          FLOOR.diffuserEnd + 50,
          FLOOR.diffuserEnd,
        ];
        return loft(xs.map(floorRing), { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
      }),
    [],
  );
  const tray = useMemo(
    () =>
      cached("car14-tea-tray", () => {
        const w = FLOOR.trayHalf;
        const xs = [FLOOR.trayFront, FLOOR.trayFront - 40, FLOOR.trayFront - 200, 1500, FLOOR.front + 10, FLOOR.front - 30];
        const widths = [w - 70, w - 10, w, w, w, w];
        const board = loft(
          xs.map((x, i) =>
            mirrorRing(x, [
              [trayBottom(x) + 14, 0],
              [trayBottom(x) + 14, widths[i] - 8],
              [trayBottom(x) + 7, widths[i]],
              [trayBottom(x), widths[i] - 8],
              [trayBottom(x), 0],
            ]),
          ),
          { along: 3, around: 1, closed: true, capStart: true, capEnd: true },
        );
        return board;
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
 * The bargeboards (right side; the model mirrors it). Before 2017 the rules
 * kept the space round the front wheels clear (3.11.1), so all that could
 * stand there were turning vanes under the chassis, inboard of ±165–240 mm,
 * and one angled board in the small triangle the rules leave beside the
 * chassis ahead of the sidepods. Behind it, small vanes at the sidepods'
 * leading edge.
 */
export function Bargeboards() {
  const geo = useMemo(
    () =>
      cached("car14-bargeboards", () => {
        const Zn = FRONT_ZONE;
        const floorTop = Z(FLOOR.step + FLOOR.thick);
        const parts: BufferGeometry[] = [];
        // Turning vanes hanging under the chassis, toed out.
        for (const [z, x0] of [
          [130, 1260],
          [180, 1220],
        ] as [number, number][]) {
          const v = plate(
            smoothOutline([
              [x0, floorTop],
              [x0 - 10, Z(250)],
              [x0 - 230, Z(230)],
              [x0 - 260, floorTop],
            ]),
            5,
            0,
          );
          v.translate(-x0, 0, 0);
          v.rotateY(-0.1);
          v.translate(x0, 0, Math.min(z, zoneInner(x0 - 260) - 12));
          parts.push(v);
        }
        // The bargeboard: a board along the triangle's diagonal edge, its rear swept outboard.
        const len = Math.hypot(Zn.kink - Zn.back, Zn.backY - Zn.kinkY) - 30;
        const board = plate(
          smoothOutline(
            [
              [0, floorTop],
              [-6, Z(320)],
              [-60, Z(350)],
              [-len + 40, Z(300)],
              [-len, Z(220)],
              [-len, floorTop],
            ],
            4,
          ),
          6,
          0,
        );
        board.rotateY(Math.atan2(Zn.backY - Zn.kinkY, Zn.kink - Zn.back));
        board.translate(Zn.kink - 15, 0, Zn.kinkY + 2);
        parts.push(board);
        // Its foot: a horizontal strip along the base.
        const foot = new BoxGeometry(len, 5, 40).translate(-len / 2, floorTop + 2.5, 22);
        foot.rotateY(Math.atan2(Zn.backY - Zn.kinkY, Zn.kink - Zn.back));
        foot.translate(Zn.kink - 15, 0, Zn.kinkY + 2);
        parts.push(foot);
        // Vanes at the sidepods' leading edge, behind the zone.
        for (const [z, h] of [
          [560, 380],
          [620, 340],
        ] as [number, number][]) {
          const x0 = Zn.back - 30;
          const v = plate(
            smoothOutline([
              [x0, floorTop],
              [x0 - 10, Z(h)],
              [x0 - 150, Z(h - 20)],
              [x0 - 170, floorTop],
            ]),
            5,
            z,
          );
          parts.push(v);
        }
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Diffuser walls and strakes: vertical fences dividing the rising tail of the floor (outboard of ±250 mm they stay above Z = 50). */
export function Diffuser() {
  const geo = useMemo(
    () =>
      cached("car14-diffuser", () => {
        const xs = [FLOOR.diffuserStart + 40, FLOOR.diffuserStart, (FLOOR.diffuserStart + FLOOR.diffuserEnd) / 2, FLOOR.diffuserEnd + 50, FLOOR.diffuserEnd];
        const parts: BufferGeometry[] = [];
        const wall = (z: number, t: number, depth: number) => {
          const top: [number, number][] = xs.map((x) => [x, Z(underside(x).out)]);
          const low: [number, number][] = xs
            .slice()
            .reverse()
            .map((x) => [x, Math.min(Z(underside(x).out) - 4, Math.max(Z(FLOOR.step), Z(underside(x).out) - depth))]);
          const w = plate([...top, ...low], t, z);
          parts.push(w, mirrorZ(w));
        };
        wall(FLOOR.diffuserHalf - 6, 10, 400);
        for (const z of [330, 200]) wall(z, 6, 90);
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Floor stays: slim rods from the chassis that stop the floor edge flexing. */
export function FloorStays() {
  const geo = useMemo(
    () => cached("car14-floor-stays", () => mergeAll([rod([300, 440, 520], [300, floorTopAt(300), 670], 5), rod([-700, 380, 480], [-700, floorTopAt(-700), 660], 5)])),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

/**
 * The plank: a 300 mm wide, 10 mm skid board under the keel from 330 mm
 * behind the front axle to the rear axle, with titanium skids and the seven
 * holes where its wear is measured (3.13, Drawing 1).
 */
export function Plank() {
  const geo = useMemo(
    () =>
      cached("car14-plank", () => {
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
  // Titanium skids (each under 4,000 mm², 20,000 mm² in all) set flush into the plank.
  const skids = useMemo(() => cached("car14-skids", () => mergeAll([1000, 600, 100, -600, -1300, -1850].map((x) => new BoxGeometry(80, 10.6, 40).translate(x, CAR.refY - 5, 0)))), []);
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={skids} material={CAR_MAT.titanium} />
      {PLANK_HOLES.map(([x, z, d]) => (
        <mesh key={`${x}:${z}`} geometry={cached(`car14-plank-hole:${d}`, () => new CircleGeometry(d / 2, 28).rotateX(Math.PI / 2))} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, z]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#7d6346", { roughness: 0.8, clearcoat: 0.1, metalness: 0 });

