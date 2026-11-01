"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, Matrix4, Quaternion, Vector3, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, mirrorZ, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { AIRBOX } from "./Chassis";
import { ENGINE_MOUNTS, PU, TAILPIPE, XC, XPU } from "./layout";

const MID = (PU.front + PU.rear) / 2;
const LEN = PU.front - PU.rear;
const BANK = PU.vee / 2;
/** Cylinder centres along the crank; the banks are staggered ±12 mm. */
const CYL_X = [-1.5, -0.5, 0.5, 1.5].map((k) => MID + k * PU.boreSpacing);

/** Place a geometry on a bank (side +1 right, −1 left): `along` mm up the bank axis from the crank, `out` mm across it, at x. */
function onBank(g: BufferGeometry, along: number, out = 0, side = 1, x = MID) {
  const axis = new Vector3(0, Math.cos(BANK), side * Math.sin(BANK));
  const perp = new Vector3(0, -Math.sin(BANK), side * Math.cos(BANK));
  const c = new Vector3(x, PU.crankY, 0).addScaledVector(axis, along).addScaledVector(perp, out);
  const q = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), side * BANK);
  return g.clone().applyMatrix4(new Matrix4().compose(c, q, new Vector3(1, 1, 1)));
}

/**
 * 2.4-litre 90° V8: crankcase as low as the crank height allows, two banks of
 * four cylinders, heads and cam covers. The short stroke keeps it compact.
 */
export function Engine() {
  const parts = useMemo(
    () =>
      cached("car09-ice", () => {
        const crankcase = roundedBox(LEN - 10, 150, 300, 24).clone().translate(MID, PU.crankY + 34, 0);
        const sump = roundedBox(LEN - 60, 10, 220, 4).clone().translate(MID - 10, PU.crankY - 44, 0);
        const banks: BufferGeometry[] = [];
        const heads: BufferGeometry[] = [];
        const covers: BufferGeometry[] = [];
        for (const side of [1, -1]) {
          const x = MID + side * 12;
          banks.push(onBank(roundedBox(LEN - 30, 150, 150, 14), 124, 0, side, x));
          heads.push(onBank(roundedBox(LEN - 40, 84, 176, 12), 236, 0, side, x));
          covers.push(onBank(roundedBox(LEN - 70, 36, 150, 16), 294, 0, side, x));
        }
        // Front timing cover and the mounting face that bolts to the survival cell.
        const front = roundedBox(30, 290, 300, 10).clone().translate(PU.front - 12, PU.crankY + 104, 0);
        // Dry-sump scavenge pump stack along the lower left side.
        const pumps = new CylinderGeometry(30, 30, LEN - 120, 24).rotateZ(Math.PI / 2).translate(MID, PU.crankY + 6, -170);
        return {
          block: mergeAll([crankcase, ...banks, front]),
          sump: mergeAll([sump, pumps]),
          heads: mergeAll(heads),
          covers: mergeAll(covers),
        };
      }),
    [],
  );
  const bolts = useMemo(
    () =>
      cached("car09-ice-studs", () => {
        const out = [];
        // The studs that bolt the engine to the survival cell.
        for (const [y, z] of ENGINE_MOUNTS) out.push(new CylinderGeometry(16, 16, 20, 16).rotateZ(Math.PI / 2).translate(PU.front - 30, y, z));
        // Ignition coils along each cam cover, one per cylinder.
        for (const side of [1, -1]) for (const x of CYL_X) out.push(onBank(new CylinderGeometry(14, 14, 28, 14), 322, 0, side, x + side * 12));
        return mergeAll(out);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.block} material={CAR_MAT.aluminiumCast} castShadow receiveShadow />
      <mesh geometry={parts.sump} material={CAR_MAT.magnesium} castShadow receiveShadow />
      <mesh geometry={parts.heads} material={CAR_MAT.magnesium} castShadow receiveShadow />
      <mesh geometry={parts.covers} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={bolts} material={CAR_MAT.titanium} castShadow />
    </group>
  );
}

/**
 * Intake: with no turbo, air rams straight down from the airbox above the
 * driver's head into a carbon plenum in the vee, and out through eight
 * trumpets into the cylinders.
 */
export function Plenum() {
  const parts = useMemo(
    () =>
      cached("car09-plenum", () => {
        const a = AIRBOX[AIRBOX.length - 1];
        const box = roundedBox(LEN - 50, 92, 210, 34).clone().translate(MID, PU.crankY + 300, 0);
        const duct = pipe(
          [
            [a.x + 40, (a.top + a.bottom) / 2 + 6, 0],
            [a.x - 90, (a.top + a.bottom) / 2 - 30, 0],
            [MID + 110, PU.crankY + 380, 0],
            [MID + 30, PU.crankY + 340, 0],
          ],
          62,
          120,
        );
        const trumpets: BufferGeometry[] = [];
        for (const side of [1, -1]) for (const x of CYL_X) trumpets.push(rod([x + side * 12, PU.crankY + 262, side * 74], [x + side * 12, PU.crankY + 214, side * 126], 56));
        return { body: mergeAll([box, duct]), trumpets: mergeAll(trumpets) };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.body} material={CAR_MAT.carbonSatin} castShadow receiveShadow />
      <mesh geometry={parts.trumpets} material={CAR_MAT.aluminium} castShadow />
    </group>
  );
}

/**
 * Four Inconel primaries from each bank gather into one tailpipe per bank.
 * From 2012 the tailpipes must exit tilted up, 500–1,200 mm ahead of the rear
 * axle (5.8); teams shaped ramps behind them to bend the gas back down toward
 * the floor (the Coanda exhaust).
 */
export function Exhaust() {
  const geo = useMemo(
    () =>
      cached("car09-exhaust", () => {
        const out: BufferGeometry[] = [];
        const side = 1;
        // One bank; the other is its mirror image below.
        const collector: V3 = [PU.rear + 70, 300, 238];
        CYL_X.forEach((x, i) => {
          const port = new Vector3(x + side * 12, PU.crankY, 0)
            .addScaledVector(new Vector3(0, Math.cos(BANK), side * Math.sin(BANK)), 218)
            .addScaledVector(new Vector3(0, -Math.sin(BANK), side * Math.cos(BANK)), 92);
          const p: V3 = [port.x, port.y, port.z];
          out.push(
            pipe(
              [
                p,
                [p[0], p[1] - 26, p[2] + side * 26],
                [Math.max(p[0] - 60, collector[0] + 60), 226 + i * 8, side * (262 - i * 4)],
                [collector[0] + 30, collector[1] - 26 + i * 8, side * (256 - i * 5)],
                [collector[0], collector[1] + (i - 1.5) * 8, side * (collector[2] + (i - 1.5) * 6)],
              ],
              17,
              50,
            ),
          );
        });
        // The tailpipe: its last 100 mm straight, angled up out of the bodywork.
        const up = Math.tan(TAILPIPE.angle);
        out.push(
          pipe(
            [
              collector,
              [TAILPIPE.exitX + 100, TAILPIPE.y - 100 * up, TAILPIPE.z],
              [TAILPIPE.exitX, TAILPIPE.y, TAILPIPE.z],
            ],
            TAILPIPE.bore / 2 + 2,
            90,
          ),
        );
        const right = mergeAll(out);
        return mergeAll([right, mirrorZ(right)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.inconel} castShadow receiveShadow />;
}

/** KERS motor: a 60 kW motor-generator geared to the front of the crankshaft, low on the left of the engine. */
export function MguK() {
  const parts = useMemo(
    () =>
      cached("car09-mguk", () => {
        const y = PU.crankY + 44;
        const body = new CylinderGeometry(50, 50, 130, 40).rotateZ(Math.PI / 2).translate(PU.front - 110, y, -216);
        const fins: BufferGeometry[] = [];
        for (let i = 0; i < 5; i++) fins.push(new CylinderGeometry(55, 55, 6, 40).rotateZ(Math.PI / 2).translate(PU.front - 62 - i * 22, y, -216));
        const cap = new CylinderGeometry(40, 46, 22, 32).rotateZ(Math.PI / 2).translate(PU.front - 186, y, -216);
        return { body: mergeAll([body, cap]), fins: mergeAll(fins) };
      }),
    [],
  );
  const cables = useMemo(
    () =>
      cached("car09-mguk-cables", () =>
        mergeAll(
          [0, 26].map((dz) =>
            pipe(
              [
                [PU.front - 90, PU.crankY + 96, -216 + dz],
                [PU.front + 40, PU.crankY + 40, -214 + dz],
                [XPU + 140, 160, -160 + dz],
                [XPU + 240, 150, -120 + dz],
              ],
              10,
              50,
            ),
          ),
        ),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.body} material={CAR_MAT.aluminium} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.aluminiumCast} castShadow />
      <mesh geometry={cables} material={CAR_MAT.hvOrange} castShadow />
    </group>
  );
}

/** KERS battery: lithium-ion cells in a case under the fuel cell. */
export function EnergyStore() {
  const parts = useMemo(
    () =>
      cached("car09-es", () => {
        const cx = (XC + XPU) / 2;
        const box = roundedBox(300, 100, 380, 12).clone().translate(cx, 128, 0);
        const modules: BufferGeometry[] = [];
        for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) modules.push(new BoxGeometry(62, 8, 106).translate(cx - 102 + i * 68, 182, -118 + j * 118));
        const terminal = roundedBox(50, 34, 80, 8).clone().translate(cx - 170, 146, -110);
        return { box, modules: mergeAll(modules), terminal };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={parts.modules} material={CAR_MAT.composite} />
      <mesh geometry={parts.terminal} material={CAR_MAT.hvOrange} />
    </group>
  );
}

/** Finned electronics box with its connectors (right side by default). */
function electronicsBox(key: string, x: number, y: number, z: number) {
  return cached(key, () => {
    const box = roundedBox(280, 110, 140, 12).clone().translate(x, y, z);
    const fins: BufferGeometry[] = [];
    for (let i = 0; i < 12; i++) fins.push(new BoxGeometry(260, 3, 124).translate(x, y + 60 + i * 4.5, z));
    const plugs = mergeAll([rod([x + 150, y, z - 30], [x + 175, y, z - 30], 30), rod([x + 150, y, z + 30], [x + 175, y, z + 30], 30)]);
    return { box, fins: mergeAll(fins), plugs };
  });
}

/** KERS electronics: the power converter between the battery and the motor, in the right sidepod. */
export function ControlElectronics() {
  const parts = electronicsBox("car09-ce", 110, 400, 420);
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.electronics} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.plugs} material={CAR_MAT.hvOrange} />
    </group>
  );
}

/** The FIA Standard ECU, in the left sidepod: it runs the engine, gearbox and KERS. */
export function StandardEcu() {
  const parts = electronicsBox("car09-ecu", 110, 400, -420);
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.electronics} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.plugs} material={CAR_MAT.composite} />
    </group>
  );
}

/**
 * The oil tank, low on the right of the block opposite the KERS motor.
 */
export function OilTank() {
  const parts = useMemo(
    () =>
      cached("car09-oil-tank", () => ({
        tank: roundedBox(230, 130, 90, 26).clone().translate(PU.front - 150, PU.crankY + 30, 224),
        fittings: mergeAll([
          new CylinderGeometry(16, 16, 22, 16).translate(PU.front - 100, PU.crankY + 104, 224),
          pipe(
            [
              [PU.front - 220, PU.crankY + 50, 180],
              [PU.front - 290, PU.crankY + 24, 150],
            ],
            9,
            20,
          ),
        ]),
      })),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.tank} material={CAR_MAT.aluminiumCast} castShadow receiveShadow />
      <mesh geometry={parts.fittings} material={CAR_MAT.braided} castShadow />
    </group>
  );
}

/** Gold heat-reflective film: a curved sheet arching over the back of the engine and the bellhousing, between the tailpipes. */
export function HeatShield() {
  const geo = useMemo(
    () =>
      cached("car09-heatshield", () => {
        const y0 = PU.crankY + 200;
        const arc = (x: number, r: number): V3[] => {
          const pts: V3[] = [];
          for (let i = 0; i <= 12; i++) {
            const a = Math.PI * 0.1 + (i / 12) * Math.PI * 0.8;
            pts.push([x, y0 + Math.sin(a) * r, Math.cos(a) * r * 1.25]);
          }
          for (let i = 12; i >= 0; i--) {
            const a = Math.PI * 0.1 + (i / 12) * Math.PI * 0.8;
            pts.push([x, y0 + Math.sin(a) * (r - 1.5), Math.cos(a) * (r - 1.5) * 1.25]);
          }
          return pts;
        };
        return loft([arc(PU.rear + 40, 140), arc(PU.rear - 120, 146), arc(PU.rear - 300, 130)], { along: 4, around: 1, closed: true, capStart: true, capEnd: true });
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.goldFoil} receiveShadow />;
}
