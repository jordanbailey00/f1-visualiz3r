"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, ExtrudeGeometry, Path, Shape, type BufferGeometry } from "three";
import { CAR_MAT, glow } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { CRASH, FINAL_DRIVE_Y, GEARBOX, WHEEL } from "./layout";

type Sec = { x: number; top: number; bottom: number; w: number };

/** Rounded-rectangle half section (top centre → side → bottom centre). */
function boxHalf(s: Sec): [number, number][] {
  const h = s.top - s.bottom;
  return [
    [s.top, 0],
    [s.top, s.w * 0.55],
    [s.top - h * 0.08, s.w * 0.92],
    [s.top - h * 0.3, s.w],
    [s.bottom + h * 0.3, s.w],
    [s.bottom + h * 0.08, s.w * 0.92],
    [s.bottom, s.w * 0.55],
    [s.bottom, 0],
  ];
}

const CASE: Sec[] = [
  { x: GEARBOX.front, top: 382, bottom: 92, w: 176 },
  { x: -1300, top: 392, bottom: 112, w: 152 },
  { x: -1500, top: 400, bottom: 152, w: 122 },
  { x: -1650, top: 408, bottom: 196, w: 146 },
  { x: -1760, top: 410, bottom: 204, w: 146 },
  { x: -1900, top: 414, bottom: 244, w: 106 },
  { x: GEARBOX.rear, top: 418, bottom: 262, w: 96 },
];

/** Carbon-titanium gearbox casing; it also carries the rear suspension and the crash structure. */
export function GearboxCasing() {
  const geo = useMemo(
    () => cached("car26-gearbox", () => loft(CASE.map((s) => mirrorRing(s.x, boxHalf(s))), { along: 6, around: 3, capStart: true, capEnd: true })),
    [],
  );
  // Hydraulic control block for the seamless shift, on top of the casing.
  const hydraulics = useMemo(
    () =>
      cached("car26-hydraulics", () =>
        mergeAll([
          roundedBox(150, 50, 110, 10).clone().translate(-1420, 430, 0),
          pipe(
            [
              [-1360, 440, 40],
              [-1300, 430, 90],
              [-1250, 380, 130],
            ],
            5,
            20,
          ),
          pipe(
            [
              [-1490, 440, -40],
              [-1560, 425, -80],
              [-1600, 400, -110],
            ],
            5,
            20,
          ),
        ]),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />
      <mesh geometry={hydraulics} material={CAR_MAT.anodisedDark} castShadow />
    </group>
  );
}

/** Spur gear: a toothed disc with a bore, its axis along X. */
function gear(r: number, width: number, teethMod = 2.6) {
  return cached(`gear:${r}:${width}`, () => {
    const teeth = Math.max(10, Math.round((2 * r) / teethMod));
    const s = new Shape();
    const n = teeth * 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = i % 4 < 2 ? r : r - teethMod * 1.1;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const hole = new Path();
    hole.absarc(0, 0, 15, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new ExtrudeGeometry(s, { depth: width, bevelEnabled: false, curveSegments: 16 });
    g.translate(0, 0, -width / 2);
    g.rotateY(Math.PI / 2);
    return g;
  });
}

const INPUT_Y = 292;
const OUTPUT_Y = 212;
/** Eight forward ratios: pinion radius on the input shaft (the pair sums to the 80 mm centre distance). */
const RATIOS = [24, 27, 30, 32.5, 35, 37, 39, 41];

/** Eight pairs of steel gears on the input and output shafts. */
export function GearCluster() {
  const parts = useMemo(
    () =>
      cached("car26-gears", () => {
        const gears: BufferGeometry[] = [];
        RATIOS.forEach((r1, k) => {
          const x = -1330 - k * 40;
          gears.push(gear(r1, 14).clone().translate(x, INPUT_Y, 0));
          gears.push(gear(80 - r1, 14).clone().translate(x, OUTPUT_Y, 0));
        });
        // Reverse idler.
        gears.push(gear(20, 12).clone().translate(-1660, 262, 64));
        const shafts = mergeAll([rod([-1180, INPUT_Y, 0], [-1660, INPUT_Y, 0], 30), rod([-1300, OUTPUT_Y, 0], [-1690, OUTPUT_Y, 0], 32)]);
        // Selector barrel above the shafts.
        const barrel = new CylinderGeometry(22, 22, 300, 24).rotateZ(Math.PI / 2).translate(-1470, 352, -40);
        return { gears: mergeAll(gears), shafts, barrel };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.gears} material={CAR_MAT.gearSteel} castShadow receiveShadow />
      <mesh geometry={parts.shafts} material={CAR_MAT.steel} castShadow />
      <mesh geometry={parts.barrel} material={CAR_MAT.aluminium} castShadow />
    </group>
  );
}

/** Differential and crown wheel on the final-drive axis. */
export function Differential() {
  const parts = useMemo(
    () =>
      cached("car26-diff", () => {
        const housing = new CylinderGeometry(70, 70, 150, 32).rotateX(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, 0);
        const crown = gear(92, 18, 3).clone().rotateY(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, 62);
        const outputs = mergeAll([
          new CylinderGeometry(44, 44, 40, 24).rotateX(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, 96),
          new CylinderGeometry(44, 44, 40, 24).rotateX(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, -96),
        ]);
        return { housing, crown, outputs };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.housing} material={CAR_MAT.magnesium} castShadow receiveShadow />
      <mesh geometry={parts.crown} material={CAR_MAT.gearSteel} castShadow />
      <mesh geometry={parts.outputs} material={CAR_MAT.steel} castShadow />
    </group>
  );
}

/** Driveshafts from the differential to the rear hubs, with constant-velocity joints. */
export function Driveshafts() {
  const parts = useMemo(
    () =>
      cached("car26-driveshafts", () => {
        const inner = 120;
        const outer = WHEEL.rear.z - 130;
        const shaft = rod([-1700, FINAL_DRIVE_Y, inner], [-1700, WHEEL.rear.y, outer], 44);
        const cvIn = new CylinderGeometry(46, 40, 70, 24).rotateX(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y + 2, inner + 20);
        const cvOut = new CylinderGeometry(40, 48, 70, 24).rotateX(Math.PI / 2).translate(-1700, WHEEL.rear.y - 2, outer - 20);
        return { shafts: shaft, cvs: mergeAll([cvIn, cvOut]) };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.shafts} material={CAR_MAT.titanium} castShadow />
      <mesh geometry={parts.cvs} material={CAR_MAT.steel} castShadow />
    </group>
  );
}

const CRASH_SECS: Sec[] = [
  { x: CRASH.front + 20, top: CRASH.top - 2, bottom: 272, w: 96 },
  { x: -2250, top: CRASH.top - 8, bottom: 290, w: 80 },
  { x: CRASH.rear, top: CRASH.top - 18, bottom: 306, w: 62 },
];

/** Rear impact structure: a tapered carbon box that crushes to absorb a rear impact. */
export function RearImpact() {
  const geo = useMemo(
    () => cached("car26-crash", () => loft(CRASH_SECS.map((s) => mirrorRing(s.x, boxHalf(s))), { along: 6, around: 3, capStart: true, capEnd: true })),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
      {/* Jacking point. */}
      <mesh geometry={cached("car26-jack", () => new BoxGeometry(40, 30, 80))} material={CAR_MAT.titanium} position={[CRASH.rear - 10, 360, 0]} />
    </group>
  );
}

/** Central LED rain light, 295–305 mm above the reference plane. */
export function RainLight() {
  return (
    <group position={[CRASH.rear - 22, 350, 0]}>
      <mesh geometry={cached("car26-rainlight", () => roundedBox(14, 40, 92, 4))} material={CAR_MAT.composite} />
      <mesh geometry={cached("car26-rainlight-led", () => new BoxGeometry(2, 28, 80))} material={glow("#ff2430", 3.6)} position={[-7.5, 0, 0]} />
    </group>
  );
}
