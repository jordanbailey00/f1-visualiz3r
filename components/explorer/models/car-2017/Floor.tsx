"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { BARGEBOARD, CAR, FLOOR, PLANK, PLANK_HOLES, XF, XR, Z } from "./layout";

/** Interpolate a table sorted by descending x. */
function at(table: [number, number][], x: number) {
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x0 && x >= x1) return v0 + ((x0 - x) / (x0 - x1)) * (v1 - v0);
  }
  return x > table[0][0] ? table[0][1] : table[table.length - 1][1];
}

/** The 2021 cut: the edge narrows on a diagonal from ±800 at C-C to ±650 at the rear axle. */
const cutEdge = (x: number) => FLOOR.half - ((FLOOR.cutStart - x) / (FLOOR.cutStart - XR)) * (FLOOR.half - FLOOR.cutHalf);

/**
 * Floor half-width along the car: the rounded leading edge, the full
 * ±800 mm, the 2021 cut, then the step in round the rear tyres to the
 * diffuser.
 */
const EDGE: [number, number][] = [
  [FLOOR.front, 560],
  [FLOOR.front - 50, 720],
  [FLOOR.front - 120, 790],
  [FLOOR.front - 170, FLOOR.half],
  [FLOOR.cutStart, FLOOR.half],
  [FLOOR.rearStep + 20, cutEdge(FLOOR.rearStep + 20)],
  [FLOOR.rearStep - 10, FLOOR.diffuserHalf],
  [FLOOR.diffuserEnd, FLOOR.diffuserHalf],
];

/** How far a ramp starting at `start` has risen by x, 0 → 1 at the diffuser exit. */
function ramp(start: number, x: number) {
  const t = Math.min(1, Math.max(0, (start - x) / (start - FLOOR.diffuserEnd)));
  return Math.pow(t, 1.25);
}

/**
 * Underside heights at x. Outboard it lies on the step plane (Z = 50) until
 * the diffuser starts 175 mm ahead of the rear axle, then rises to Z = 175;
 * the central strip stays on the reference plane to the rear axle, where the
 * plank ends.
 */
function underside(x: number) {
  return {
    out: FLOOR.step + (FLOOR.diffuserHeight - FLOOR.step) * ramp(FLOOR.diffuserStart, x),
    mid: (FLOOR.diffuserHeight - 50) * ramp(XR, x),
  };
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
  const k = FLOOR.keel;
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

/** Underside of the tea tray: nothing below Z = 100 at 425 mm behind the front axle, rising to Z = 135 at 450 mm ahead (3.4.3). */
const trayBottom = (x: number) => Z(100 + (35 * (x - (XF - 425))) / 875) + 2;

/**
 * The floor body: the stepped plate from 430 mm behind the front axle to the
 * diffuser exit, with the tea tray (the splitter under the chassis) ahead of
 * it, raised clear of the ground as the rules require.
 */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car17-floor", () => {
        const xs = [
          FLOOR.front,
          FLOOR.front - 50,
          FLOOR.front - 120,
          FLOOR.front - 170,
          700,
          FLOOR.cutStart,
          -700,
          -1200,
          FLOOR.rearStep + 20,
          FLOOR.rearStep - 10,
          FLOOR.diffuserStart,
          XR,
          (XR + FLOOR.diffuserEnd) / 2,
          FLOOR.diffuserEnd + 50,
          FLOOR.diffuserEnd,
        ];
        return loft(xs.map(floorRing), { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
      }),
    [],
  );
  const tray = useMemo(
    () =>
      cached("car17-tea-tray", () => {
        const w = FLOOR.trayHalf;
        const xs = [FLOOR.trayFront, FLOOR.trayFront - 40, FLOOR.trayFront - 200, 1700, FLOOR.front + 10, FLOOR.front - 30];
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
        // Lips along the tray's edges.
        const lip = plate(
          smoothOutline([
            [FLOOR.trayFront - 60, trayBottom(FLOOR.trayFront - 60) + 10],
            [FLOOR.trayFront - 140, trayBottom(FLOOR.trayFront - 140) + 60],
            [FLOOR.front, trayBottom(FLOOR.front) + 60],
            [FLOOR.front, trayBottom(FLOOR.front) + 10],
          ]),
          6,
          w - 3,
        );
        return mergeAll([board, lip, mirrorZ(lip)]);
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

/** Inner edge of the bargeboard area: ±240 mm at its front, widening at 4.5° (3.5.6). */
const bargeInner = (x: number) => 240 + (BARGEBOARD.front - x) * Math.tan((4.5 * Math.PI) / 180);
/** Rearmost x allowed at half-span z between ±320 and ±700 mm: the front of the clear gap, a 75° line. */
const gapLine = (z: number) => BARGEBOARD.gap - (z - 320) * Math.tan((15 * Math.PI) / 180);

/**
 * The bargeboard cluster (right side; the model mirrors it), all no higher
 * than Z = 345: the main board with its slotted footplate, turning vanes
 * inboard of it, a second board outboard, and behind the clear gap the tall
 * deflector beside the sidepod inlet. Together they turn the front tyres'
 * wake away from the floor and feed vortices along its edge.
 */
export function Bargeboards() {
  const geo = useMemo(
    () =>
      cached("car17-bargeboards", () => {
        const B = BARGEBOARD;
        const floorTop = Z(FLOOR.step + FLOOR.thick);
        const parts: BufferGeometry[] = [];
        // Main board, ending at the front of the clear gap.
        const zMain = 690;
        const rearMain = gapLine(zMain) + 6;
        const main = plate(
          smoothOutline(
            [
              [B.front, floorTop],
              [B.front + 4, B.top - 70],
              [B.front - 40, B.top - 8],
              [B.front - 260, B.top],
              [B.front - 480, B.top - 30],
              [rearMain + 60, Z(250)],
              [rearMain, Z(220)],
              [rearMain, floorTop],
            ],
            3,
          ),
          6,
          0,
        );
        main.translate(-B.front, 0, 0);
        main.rotateY(0.04);
        main.translate(B.front, 0, zMain);
        parts.push(main);
        // Footplate: slotted horizontal slats along its foot, out to ±800 mm.
        for (let i = 0; i < 5; i++) {
          const x0 = B.front - 40 - i * 104;
          parts.push(new BoxGeometry(88, 5, 96).translate(x0 - 44, floorTop + 3, 745));
        }
        // Turning vanes inboard of the main board, toed out.
        for (const [z, h] of [
          [330, 300],
          [400, 280],
          [470, 260],
        ] as [number, number][]) {
          const x0 = B.front - 10;
          const v = plate(
            smoothOutline([
              [x0, floorTop],
              [x0 - 10, Z(h)],
              [x0 - 260, Z(h - 30)],
              [x0 - 300, floorTop],
            ]),
            5,
            0,
          );
          v.translate(-x0, 0, 0);
          v.rotateY(-0.12);
          v.translate(x0, 0, Math.max(z, bargeInner(x0) + 20));
          parts.push(v);
        }
        // Second board outboard of the gap band, reaching back to the 75° line through C+625.
        // Its top edge is cut into a row of vanes.
        const teeth: [number, number][] = [];
        for (let x = 980; x > 600; x -= 48) teeth.push([x, Z(266 - (980 - x) * 0.05)], [x - 24, Z(222 - (980 - x) * 0.05)]);
        const second = plate([[1000, floorTop], [994, Z(250)], ...teeth, [560, Z(200)], [540, floorTop]], 5, 768);
        parts.push(second);
        // Sidepod deflector: a tall vane beside the inlet (no higher than Z = 600 out here), with a horizontal top wing.
        const sx = 500;
        const deflector = plate(
          smoothOutline(
            [
              [sx, floorTop + 30],
              [sx - 10, Z(300)],
              [sx - 40, Z(500)],
              [sx - 110, Z(562)],
              [sx - 160, Z(540)],
              [sx - 150, Z(300)],
              [sx - 120, floorTop + 30],
            ],
            4,
          ),
          6,
          0,
        );
        deflector.translate(-sx, 0, 0);
        deflector.rotateY(0.18);
        deflector.translate(sx, 0, 736);
        const boomerang = plate(
          smoothOutline([
            [sx - 60, 690],
            [sx - 80, 770],
            [sx - 200, 762],
            [sx - 190, 700],
          ]),
          8,
          0,
        );
        boomerang.rotateX(Math.PI / 2);
        boomerang.translate(0, Z(560), 0);
        parts.push(deflector, boomerang);
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Diffuser walls and strakes: vertical fences dividing the rising tail of the
 * floor. Outboard of ±250 mm the diffuser must stay above Z = 50, and from
 * 2021 nothing inboard may form separate fences below it either.
 */
export function Diffuser() {
  const geo = useMemo(
    () =>
      cached("car17-diffuser", () => {
        const xs = [FLOOR.diffuserStart + 40, FLOOR.diffuserStart, XR, (XR + FLOOR.diffuserEnd) / 2, FLOOR.diffuserEnd + 50, FLOOR.diffuserEnd];
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
        for (const z of [380, 260]) wall(z, 6, 120);
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** Floor stays: slim rods from the chassis that stop the floor edge flexing. */
export function FloorStays() {
  const geo = useMemo(
    () => cached("car17-floor-stays", () => mergeAll([rod([300, 440, 560], [300, floorTopAt(300), 760], 5), rod([-500, 380, 520], [-500, floorTopAt(-500), 740], 5)])),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

/**
 * The plank: a 300 mm wide, 10 mm skid board under the keel from 430 mm
 * behind the front axle to the rear axle, with titanium skids and the seven
 * holes where its wear is measured (3.7.11, Drawing 1).
 */
export function Plank() {
  const geo = useMemo(
    () =>
      cached("car17-plank", () => {
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
  // Titanium skids (20,000 mm² in all) set flush into the plank.
  const skids = useMemo(() => cached("car17-skids", () => mergeAll([1220, 900, 400, -320, -1050, -1650].map((x) => new BoxGeometry(80, 10.6, 40).translate(x, CAR.refY - 5, 0)))), []);
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={skids} material={CAR_MAT.titanium} />
      {PLANK_HOLES.map(([x, z, d]) => (
        <mesh key={`${x}:${z}`} geometry={cached(`car17-plank-hole:${d}`, () => new CircleGeometry(d / 2, 28).rotateX(Math.PI / 2))} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, z]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#7d6346", { roughness: 0.8, clearcoat: 0.1, metalness: 0 });
