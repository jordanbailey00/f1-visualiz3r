"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, CylinderGeometry, ExtrudeGeometry, Path, Shape, type BufferGeometry } from "three";
import { CAR_MAT, glow } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { CRASH, FINAL_DRIVE_Y, GEARBOX, PU, WHEEL } from "./layout";

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

/**
 * Casing sections: the bellhousing bolts to the back of the engine low down
 * (crank 90 mm up); from 600 mm ahead of the rear axle the underside must
 * stay above the rising diffuser ramp.
 */
const CASE: Sec[] = [
  { x: GEARBOX.front, top: 352, bottom: 72, w: 168 },
  { x: -1150, top: 378, bottom: 132, w: 148 },
  { x: -1350, top: 398, bottom: 234, w: 124 },
  { x: -1550, top: 406, bottom: 252, w: 116 },
  { x: -1650, top: 410, bottom: 264, w: 136 },
  { x: -1760, top: 412, bottom: 276, w: 136 },
  { x: -1900, top: 416, bottom: 298, w: 104 },
  { x: GEARBOX.rear, top: 418, bottom: 310, w: 94 },
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
          roundedBox(150, 50, 110, 10).clone().translate(-1420, 428, 0),
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

const INPUT_Y = 350;
const OUTPUT_Y = 286;
const CENTRES = INPUT_Y - OUTPUT_Y;
/** Eight forward ratios: pinion radius on the input shaft (each pair spans the 64 mm centre distance). */
const RATIOS = [18, 20.5, 23, 25, 27, 29, 30.5, 32];

/**
 * Eight pairs of steel gears on the input and output shafts, fed by the
 * clutch and a drop gear from the crankshaft line.
 */
export function GearCluster() {
  const parts = useMemo(
    () =>
      cached("car26-gears", () => {
        const gears: BufferGeometry[] = [];
        RATIOS.forEach((r1, k) => {
          const x = -1200 - k * 40;
          gears.push(gear(r1, 14).clone().translate(x, INPUT_Y, 0));
          gears.push(gear(CENTRES - r1, 14).clone().translate(x, OUTPUT_Y, 0));
        });
        // Reverse idler.
        gears.push(gear(16, 12).clone().translate(-1540, 318, 48));
        // Drop gears lift the drive from the crankshaft line to the input shaft.
        gears.push(gear(58, 16).clone().translate(-1120, PU.crankY + 18, 0), gear(56, 16).clone().translate(-1120, INPUT_Y - 6, 0));
        const shafts = mergeAll([
          rod([-1100, INPUT_Y, 0], [-1520, INPUT_Y, 0], 26),
          rod([-1180, OUTPUT_Y, 0], [-1690, OUTPUT_Y, 0], 28),
          rod([GEARBOX.front - 20, PU.crankY + 18, 0], [-1130, PU.crankY + 18, 0], 30),
        ]);
        // Selector barrel above the shafts.
        const barrel = new CylinderGeometry(18, 18, 300, 24).rotateZ(Math.PI / 2).translate(-1350, 384, -34);
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

/** Multi-plate carbon clutch in the bellhousing, opened by the steering-wheel paddles. */
export function Clutch() {
  const parts = useMemo(
    () =>
      cached("car26-clutch", () => {
        const plates: BufferGeometry[] = [];
        for (let i = 0; i < 6; i++) plates.push(new CylinderGeometry(56, 56, 4, 32).rotateZ(Math.PI / 2).translate(GEARBOX.front - 26 - i * 8, PU.crankY + 18, 0));
        const basket = new CylinderGeometry(64, 64, 60, 32, 1, true).rotateZ(Math.PI / 2).translate(GEARBOX.front - 46, PU.crankY + 18, 0);
        return { plates: mergeAll(plates), basket };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.plates} material={CAR_MAT.brakeCarbon} castShadow />
      <mesh geometry={parts.basket} material={CAR_MAT.titanium} castShadow />
    </group>
  );
}

/** Differential and crown wheel on the final-drive axis. */
export function Differential() {
  const parts = useMemo(
    () =>
      cached("car26-diff", () => {
        const housing = new CylinderGeometry(50, 50, 150, 32).rotateX(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, 0);
        const crown = gear(58, 16, 3).clone().rotateY(Math.PI / 2).translate(-1700, FINAL_DRIVE_Y, 56);
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
  { x: CRASH.front + 20, top: CRASH.top - 2, bottom: 304, w: 92 },
  { x: -2250, top: CRASH.top - 8, bottom: 306, w: 78 },
  { x: CRASH.rear, top: CRASH.top - 18, bottom: 310, w: 62 },
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
      {/* Jacking point, and the optional rear-facing camera (position 6) above the rain light. */}
      <mesh geometry={cached("car26-jack", () => new BoxGeometry(40, 24, 80))} material={CAR_MAT.titanium} position={[CRASH.rear - 10, 312, 0]} />
      <mesh geometry={cached("car26-cam6", () => new CircleGeometry(9, 20).rotateY(-Math.PI / 2))} material={CAR_MAT.lens} position={[CRASH.rear - 1.5, 384, 0]} />
    </group>
  );
}

/** Central LED rain light, 295–305 mm above the reference plane. */
export function RainLight() {
  return (
    <group position={[CRASH.rear - 22, 345, 0]}>
      <mesh geometry={cached("car26-rainlight", () => roundedBox(14, 40, 92, 4))} material={CAR_MAT.composite} />
      <mesh geometry={cached("car26-rainlight-led", () => new BoxGeometry(2, 28, 80))} material={glow("#ff2430", 3.6)} position={[-7.5, 0, 0]} />
    </group>
  );
}
