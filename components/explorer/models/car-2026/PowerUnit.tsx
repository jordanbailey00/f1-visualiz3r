"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, Matrix4, Quaternion, TorusGeometry, Vector3, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { ENGINE_MOUNTS, PU, TAILPIPE, XC, XPU } from "./layout";

const MID = (PU.front + PU.rear) / 2;
const LEN = PU.front - PU.rear;
const BANK = PU.vee / 2;
/** Cylinder centres along the crank (101 mm bore spacing); the banks are staggered ±10 mm. */
const CYL_X = [-1, 0, 1].map((k) => MID + 15 + k * PU.boreSpacing);

/** Place a geometry on a bank (side +1 right, −1 left): `along` mm up the bank axis from the crank, `out` mm across it, at x. */
function onBank(g: BufferGeometry, along: number, out = 0, side = 1, x = MID) {
  const axis = new Vector3(0, Math.cos(BANK), side * Math.sin(BANK));
  const perp = new Vector3(0, -Math.sin(BANK), side * Math.cos(BANK));
  const c = new Vector3(x, PU.crankY, 0).addScaledVector(axis, along).addScaledVector(perp, out);
  const q = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), side * BANK);
  return g.clone().applyMatrix4(new Matrix4().compose(c, q, new Vector3(1, 1, 1)));
}

/**
 * 1.6-litre 90° V6: crankcase low on the floor (crank axis 90 mm up), two
 * banks of three 80 mm cylinders, heads and cam covers.
 */
export function Engine() {
  const parts = useMemo(
    () =>
      cached("car26-ice", () => {
        const crankcase = roundedBox(LEN - 10, 180, 330, 24).clone().translate(MID, PU.crankY + 28, 0);
        const sump = roundedBox(LEN - 60, 12, 250, 5).clone().translate(MID - 10, PU.crankY - 66, 0);
        const banks: BufferGeometry[] = [];
        const heads: BufferGeometry[] = [];
        const covers: BufferGeometry[] = [];
        for (const side of [1, -1]) {
          const x = MID + side * 10;
          banks.push(onBank(roundedBox(LEN - 30, 170, 150, 14), 150, 0, side, x));
          heads.push(onBank(roundedBox(LEN - 40, 88, 176, 12), 280, 0, side, x));
          covers.push(onBank(roundedBox(LEN - 70, 40, 150, 18), 342, 0, side, x));
        }
        // Front timing cover and the mounting face that bolts to the survival cell.
        const front = roundedBox(30, 330, 320, 10).clone().translate(PU.front - 12, PU.crankY + 120, 0);
        // Dry-sump scavenge pump stack along the lower left side.
        const pumps = new CylinderGeometry(34, 34, LEN - 120, 24).rotateZ(Math.PI / 2).translate(MID, PU.crankY - 8, -186);
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
      cached("car26-ice-studs", () => {
        const out = [];
        // Six mounting bosses for the M12 studs on the survival cell (C5.4.17).
        for (const [y, z] of ENGINE_MOUNTS) out.push(new CylinderGeometry(16, 16, 20, 16).rotateZ(Math.PI / 2).translate(PU.front - 30, y, z));
        // Ignition coil towers along each cam cover.
        for (const side of [1, -1]) for (const x of CYL_X) out.push(onBank(new CylinderGeometry(14, 14, 30, 14), 372, 0, side, x + side * 10));
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

/** Carbon intake plenum in the vee, fed with cooled, compressed air from the charge-air cooler. */
export function Plenum() {
  const geo = useMemo(
    () =>
      cached("car26-plenum", () =>
        mergeAll([
          roundedBox(LEN - 60, 110, 230, 40).clone().translate(MID - 10, PU.crankY + 330, 0),
          pipe(
            [
              [190, 470, -430],
              [XPU + 60, 500, -310],
              [MID + 150, PU.crankY + 380, -130],
              [MID + 60, PU.crankY + 345, -60],
            ],
            40,
            140,
          ),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

const TURBO: V3 = [PU.rear - 110, PU.crankY + 335, 0];

/**
 * Six Inconel primaries gathered into the turbine; the wastegate rejoins the
 * single tailpipe, which runs straight for its last 370 mm on the centre
 * plane and exits 395 mm behind the rear axle (C3.9.2).
 */
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
                  [p[0] - 60, 248 + i * 8, side * (270 - i * 6)],
                  [PU.rear - 30, 300 + i * 14, side * (222 - i * 18)],
                  // The turbine sits on the right: the left collectors cross behind the engine.
                  side > 0 ? [TURBO[0] + 34, TURBO[1] - 80 + i * 16, 100 - i * 8] : [TURBO[0] + 64, TURBO[1] - 100 + i * 14, 40 + i * 14],
                  [TURBO[0] + 4, TURBO[1] - 44 + i * 10, 70 + i * 4],
                ],
                20,
                50,
              ),
            );
          });
        }
        const exitY = TAILPIPE.y + 370 * Math.tan((1.5 * Math.PI) / 180);
        out.push(
          pipe(
            [
              [TURBO[0], TURBO[1], 116],
              [TURBO[0] - 140, TURBO[1] + 10, 110],
              [-1560, TAILPIPE.y - 4, 24],
              [TAILPIPE.exitX + 370, TAILPIPE.y, 0],
              [TAILPIPE.exitX, exitY, 0],
            ],
            TAILPIPE.bore / 2 + 2,
            140,
          ),
          // Wastegate pipe: vents boost around the turbine and merges back in.
          pipe(
            [
              [TURBO[0] - 10, TURBO[1] + 64, -30],
              [TURBO[0] - 170, TURBO[1] + 50, -40],
              [-1500, TAILPIPE.y + 10, -12],
            ],
            16,
            70,
          ),
        );
        return mergeAll(out);
      }),
    [],
  );
  // Tailpipe support to the tail bodywork (RV-TAILPIPE-BRACKET).
  const bracket = useMemo(() => cached("car26-tailpipe-bracket", () => roundedBox(60, 40, 12, 4).clone().translate(TAILPIPE.exitX + 70, TAILPIPE.y - 72, 0)), []);
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.inconel} castShadow receiveShadow />
      <mesh geometry={bracket} material={CAR_MAT.titanium} />
    </group>
  );
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
              [XC - 300, 880, 0],
              [XC - 600, 730, -110],
              [TURBO[0] + 140, 620, -200],
              [TURBO[0], TURBO[1] + 20, -236],
              [TURBO[0], TURBO[1], -176],
            ],
            44,
            150,
          ),
          pipe(
            [
              [TURBO[0] + 40, TURBO[1] + 92, -86],
              [TURBO[0] + 160, TURBO[1] + 90, -250],
              [XPU - 80, 440, -360],
              [190, 420, -440],
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
        const y = PU.crankY + 18;
        const body = new CylinderGeometry(72, 72, 230, 40).rotateZ(Math.PI / 2).translate(PU.front - 150, y, -250);
        const fins: BufferGeometry[] = [];
        for (let i = 0; i < 9; i++) fins.push(new CylinderGeometry(78, 78, 6, 40).rotateZ(Math.PI / 2).translate(PU.front - 60 - i * 22, y, -250));
        const cap = new CylinderGeometry(58, 68, 30, 32).rotateZ(Math.PI / 2).translate(PU.front - 280, y, -250);
        return { body: mergeAll([body, cap]), fins: mergeAll(fins) };
      }),
    [],
  );
  const cables = useMemo(
    () =>
      cached("car26-mguk-cables", () =>
        mergeAll(
          [0, 26].map((dz) =>
            pipe(
              [
                [PU.front - 100, PU.crankY + 80, -246 + dz],
                [PU.front + 40, PU.crankY + 40, -236 + dz],
                [XPU + 140, 160, -170 + dz],
                [XPU + 260, 150, -130 + dz],
              ],
              11,
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

/** Energy store: lithium-ion cells in a crash-proof case inside the survival cell, under the fuel. */
export function EnergyStore() {
  const parts = useMemo(
    () =>
      cached("car26-es", () => {
        const cx = (XC + XPU) / 2;
        const box = roundedBox(440, 130, 500, 14).clone().translate(cx, 140, 0);
        const modules: BufferGeometry[] = [];
        for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) modules.push(new BoxGeometry(72, 10, 106).translate(cx - 176 + i * 88, 210, -174 + j * 116));
        const terminal = roundedBox(60, 40, 90, 8).clone().translate(cx - 236, 175, -150);
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

/** Control electronics: the power converters between battery and MGU-K, in the right sidepod. */
export function ControlElectronics() {
  const parts = electronicsBox("car26-ce", 20, 380, 420);
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.electronics} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.plugs} material={CAR_MAT.hvOrange} />
    </group>
  );
}

/** The FIA Standard ECU, in the left sidepod: it runs the power unit, gearbox, brakes and active aero. */
export function StandardEcu() {
  const parts = electronicsBox("car26-ecu", 20, 380, -420);
  return (
    <group>
      <mesh geometry={parts.box} material={CAR_MAT.electronics} castShadow receiveShadow />
      <mesh geometry={parts.fins} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.plugs} material={CAR_MAT.composite} />
    </group>
  );
}

/** Gold heat-reflective film over the hot engine bay and bellhousing. */
export function HeatShield() {
  const geo = useMemo(
    () =>
      cached("car26-heatshield", () => {
        const g = new BoxGeometry(420, 1.2, 280).translate(PU.rear - 200, 392, 0);
        const side = new BoxGeometry(300, 150, 1.2).translate(PU.rear - 60, 320, 214);
        return mergeAll([g, side, mirrorZ(side)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.goldFoil} receiveShadow />;
}
