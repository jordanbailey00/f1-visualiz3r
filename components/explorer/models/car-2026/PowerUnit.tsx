"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, Matrix4, Quaternion, TorusGeometry, Vector3, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { PU } from "./layout";

const MID = (PU.front + PU.rear) / 2;
const LEN = PU.front - PU.rear;
const BANK = PU.vee / 2;
/** Cylinder centres along the crank for one bank (the other is staggered). */
const CYL_X = [-0.31, 0, 0.31].map((k) => MID + 20 + k * LEN);

/** Place a geometry on a bank (side +1 right, −1 left): `along` mm up the bank axis from the crank, `out` mm across it, at x. */
function onBank(g: BufferGeometry, along: number, out = 0, side = 1, x = MID) {
  const axis = new Vector3(0, Math.cos(BANK), side * Math.sin(BANK));
  const perp = new Vector3(0, -Math.sin(BANK), side * Math.cos(BANK));
  const c = new Vector3(x, PU.crankY, 0).addScaledVector(axis, along).addScaledVector(perp, out);
  const q = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), side * BANK);
  return g.clone().applyMatrix4(new Matrix4().compose(c, q, new Vector3(1, 1, 1)));
}

/** 1.6-litre 90° V6: crankcase, two banks of three cylinders, heads and cam covers. */
export function Engine() {
  const parts = useMemo(
    () =>
      cached("car26-ice", () => {
        const crankcase = roundedBox(LEN - 10, 190, 330, 24).clone().translate(MID, PU.crankY - 40, 0);
        const sump = roundedBox(LEN - 60, 60, 260, 16).clone().translate(MID - 10, PU.crankY - 150, 0);
        const banks: BufferGeometry[] = [];
        const heads: BufferGeometry[] = [];
        const covers: BufferGeometry[] = [];
        for (const side of [1, -1]) {
          // The banks are staggered by half a cylinder spacing; here 20 mm.
          const x = MID + side * 10;
          banks.push(onBank(roundedBox(LEN - 30, 170, 150, 14), 150, 0, side, x));
          heads.push(onBank(roundedBox(LEN - 40, 88, 176, 12), 278, 0, side, x));
          covers.push(onBank(roundedBox(LEN - 70, 40, 150, 18), 340, 0, side, x));
        }
        // Front timing cover and the mounting face that bolts to the tub.
        const front = roundedBox(30, 300, 300, 10).clone().translate(PU.front - 12, PU.crankY + 70, 0);
        return {
          block: mergeAll([crankcase, ...banks, front]),
          sump,
          heads: mergeAll(heads),
          covers: mergeAll(covers),
        };
      }),
    [],
  );
  const bolts = useMemo(
    () =>
      cached("car26-ice-studs", () => {
        const out = [];
        for (const [y, z] of [
          [PU.crankY - 90, 150],
          [PU.crankY - 90, -150],
          [PU.crankY + 230, 120],
          [PU.crankY + 230, -120],
        ])
          out.push(new CylinderGeometry(9, 9, 40, 12).rotateZ(Math.PI / 2).translate(PU.front + 6, y, z));
        // Spark plug / coil towers along each cam cover.
        for (const side of [1, -1])
          for (const x of CYL_X) out.push(onBank(new CylinderGeometry(14, 14, 30, 14), 370, 0, side, x + side * 10));
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

/** Carbon intake plenum in the vee, fed with cooled, compressed air. */
export function Plenum() {
  const geo = useMemo(
    () =>
      cached("car26-plenum", () =>
        mergeAll([
          roundedBox(LEN - 60, 110, 230, 40).clone().translate(MID - 10, PU.crankY + 340, 0),
          pipe(
            [
              [PU.rear + 40, PU.crankY + 360, 0],
              [PU.rear - 60, PU.crankY + 380, -40],
              [PU.rear - 120, PU.crankY + 300, -150],
            ],
            44,
          ),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

const TURBO: V3 = [PU.rear - 110, PU.crankY + 250, 0];

/** Three Inconel primaries per bank, gathered into the turbine; wastegate and tailpipe. */
export function Exhaust() {
  const geo = useMemo(
    () =>
      cached("car26-exhaust", () => {
        const out: BufferGeometry[] = [];
        for (const side of [1, -1]) {
          CYL_X.forEach((x, i) => {
            const port = new Vector3(x + side * 10, PU.crankY, 0)
              .addScaledVector(new Vector3(0, Math.cos(BANK), side * Math.sin(BANK)), 262)
              .addScaledVector(new Vector3(0, -Math.sin(BANK), side * Math.cos(BANK)), 92);
            const p: V3 = [port.x, port.y, port.z];
            out.push(
              pipe(
                [
                  p,
                  [p[0], p[1] - 30, p[2] + side * 30],
                  [p[0] - 60, 262 + i * 8, side * (276 - i * 6)],
                  [PU.rear - 30, 280 + i * 10, side * (222 - i * 18)],
                  // The turbine sits on the right: the left collectors cross behind the engine.
                  side > 0 ? [TURBO[0] + 30, TURBO[1] - 70 + i * 14, 96 - i * 8] : [TURBO[0] + 60, TURBO[1] - 90 + i * 12, 40 + i * 14],
                  [TURBO[0] + 4, TURBO[1] - 40 + i * 10, 70 + i * 4],
                ],
                20,
                50,
              ),
            );
          });
        }
        // Tailpipe from the turbine to the exit above the crash structure, and a wastegate pipe.
        out.push(
          // Tailpipe exits above the crash structure, under the rear wing.
          pipe(
            [
              [TURBO[0], TURBO[1], 110],
              [TURBO[0] - 120, TURBO[1] + 20, 110],
              [-1760, 472, 24],
              [-2190, 472, 0],
            ],
            42,
            120,
          ),
          pipe(
            [
              [TURBO[0] - 10, TURBO[1] + 50, -40],
              [-1700, 470, -50],
              [-2150, 470, -78],
            ],
            15,
            80,
          ),
        );
        return mergeAll(out);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.inconel} castShadow receiveShadow />;
}

/**
 * Single-stage turbocharger, shaft across the car: turbine (Inconel) on the
 * right, compressor (aluminium) on the left. No MGU-H from 2026.
 */
export function Turbocharger() {
  const parts = useMemo(
    () =>
      cached("car26-turbo", () => {
        const at = (g: BufferGeometry, z: number) => g.clone().rotateX(Math.PI / 2).translate(TURBO[0], TURBO[1], z);
        const turbine = mergeAll([at(new CylinderGeometry(62, 62, 70, 36), 82), new TorusGeometry(64, 30, 18, 40).translate(TURBO[0], TURBO[1], 82)]);
        const compressor = mergeAll([
          at(new CylinderGeometry(78, 78, 66, 40), -86),
          new TorusGeometry(80, 32, 18, 44).translate(TURBO[0], TURBO[1], -86),
          at(new CylinderGeometry(46, 56, 60, 32), -150),
        ]);
        const cartridge = at(new CylinderGeometry(34, 34, 110, 24), 0);
        return { turbine, compressor, cartridge };
      }),
    [],
  );
  // Intake from the airbox down to the compressor eye, and the compressor
  // outlet forward to the charge-air cooler in the left sidepod.
  const duct = useMemo(
    () =>
      cached("car26-turbo-duct", () =>
        mergeAll([
          pipe(
            [
              [-180, 860, 0],
              [-560, 720, -120],
              [-1060, 600, -210],
              [TURBO[0], TURBO[1] + 10, -230],
              [TURBO[0], TURBO[1], -176],
            ],
            44,
            150,
          ),
          pipe(
            [
              [TURBO[0] + 40, TURBO[1] + 92, -86],
              [TURBO[0] + 160, TURBO[1] + 110, -250],
              [-600, 450, -360],
              [300, 440, -440],
            ],
            38,
            140,
          ),
        ]),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.turbine} material={CAR_MAT.inconel} castShadow receiveShadow />
      <mesh geometry={parts.compressor} material={CAR_MAT.aluminium} castShadow receiveShadow />
      <mesh geometry={parts.cartridge} material={CAR_MAT.steel} castShadow />
      <mesh geometry={duct} material={CAR_MAT.carbonSatin} castShadow />
    </group>
  );
}

/** MGU-K: 350 kW motor-generator geared to the crankshaft, low on the left of the engine. */
export function MguK() {
  const parts = useMemo(
    () =>
      cached("car26-mguk", () => {
        const body = new CylinderGeometry(76, 76, 230, 40).rotateZ(Math.PI / 2).translate(PU.front - 150, PU.crankY - 20, -232);
        const fins: BufferGeometry[] = [];
        for (let i = 0; i < 9; i++) fins.push(new CylinderGeometry(82, 82, 6, 40).rotateZ(Math.PI / 2).translate(PU.front - 60 - i * 22, PU.crankY - 20, -232));
        const cap = new CylinderGeometry(60, 70, 30, 32).rotateZ(Math.PI / 2).translate(PU.front - 280, PU.crankY - 20, -232);
        return { body: mergeAll([body, cap]), fins: mergeAll(fins) };
      }),
    [],
  );
  const cables = useMemo(
    () =>
      cached("car26-mguk-cables", () =>
        mergeAll([
          pipe(
            [
              [PU.front - 100, PU.crankY + 50, -230],
              [PU.front + 40, PU.crankY + 10, -230],
              [-420, 160, -160],
              [-300, 150, -120],
            ],
            11,
            50,
          ),
          pipe(
            [
              [PU.front - 120, PU.crankY + 52, -205],
              [PU.front + 30, PU.crankY + 20, -200],
              [-420, 170, -130],
              [-300, 160, -95],
            ],
            11,
            50,
          ),
        ]),
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

/** Energy store: lithium-ion cells in a crash-proof case under the fuel cell. */
export function EnergyStore() {
  const parts = useMemo(
    () =>
      cached("car26-es", () => {
        const box = roundedBox(520, 130, 520, 14).clone().translate(-300, 140, 0);
        const modules: BufferGeometry[] = [];
        for (let i = 0; i < 6; i++)
          for (let j = 0; j < 4; j++) modules.push(new BoxGeometry(70, 10, 110).translate(-520 + i * 86, 210, -180 + j * 120));
        const terminal = roundedBox(60, 40, 90, 8).clone().translate(-575, 175, -150);
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

/** Control electronics: the power converters between battery, MGU-K and the FIA ECU. */
export function ControlElectronics() {
  const parts = useMemo(
    () =>
      cached("car26-ce", () => {
        const box = roundedBox(300, 110, 170, 12).clone().translate(40, 330, 430);
        const fins: BufferGeometry[] = [];
        for (let i = 0; i < 12; i++) fins.push(new BoxGeometry(280, 3, 150).translate(40, 390 + i * 4.5, 430));
        const plugs = mergeAll([rod([190, 330, 400], [215, 330, 400], 30), rod([190, 330, 460], [215, 330, 460], 30)]);
        return { box, fins: mergeAll(fins), plugs };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.electronics} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.plugs} material={CAR_MAT.hvOrange} />
    </group>
  );
}

/** Gold heat-reflective film over the hot engine bay. */
export function HeatShield() {
  const geo = useMemo(
    () =>
      cached("car26-heatshield", () => {
        const g = new BoxGeometry(520, 1.2, 280).translate(PU.rear - 230, 395, 0);
        return mergeAll([g, mirrorZ(new BoxGeometry(400, 220, 1.2).translate(PU.rear - 120, 300, 300))]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.goldFoil} receiveShadow />;
}

export const OIL_TANK_MAT = paintColour("oilTank", "#3a3d42", { roughness: 0.4, metalness: 0.6 });
