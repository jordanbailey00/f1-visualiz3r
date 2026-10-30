"use client";

import { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, ShapeGeometry, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedRectShape } from "../../kit/geometry";
import { loft, mirrorRing, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { AIRBOX, noseHalf } from "./Chassis";
import { XPU } from "./layout";
import { bodyPaint } from "./livery";

/**
 * Sidepod sections (right side): top, the floor line, the inner wall hidden
 * inside the chassis, the outer face, and the deep undercut that tucks the
 * lower pod inward so air can reach the back of the floor. The inlet is a
 * slim letterbox above 275 mm (C3.16.9); the top ramps down to the rear.
 */
type Pod = { x: number; top: number; bot: number; zi: number; zo: number; ymax: number; yu: number; yd: number; zd: number; zb: number };

export const PODS: Pod[] = [
  { x: 470, top: 604, bot: 446, zi: 360, zo: 566, ymax: 548, yu: 494, yd: 470, zd: 530, zb: 486 },
  { x: 430, top: 620, bot: 384, zi: 342, zo: 592, ymax: 546, yu: 462, yd: 420, zd: 540, zb: 462 },
  { x: 280, top: 628, bot: 72, zi: 322, zo: 610, ymax: 530, yu: 414, yd: 236, zd: 444, zb: 392 },
  { x: 0, top: 610, bot: 66, zi: 310, zo: 604, ymax: 508, yu: 392, yd: 204, zd: 420, zb: 370 },
  { x: -350, top: 564, bot: 66, zi: 286, zo: 556, ymax: 462, yu: 350, yd: 178, zd: 382, zb: 332 },
  { x: -750, top: 484, bot: 66, zi: 244, zo: 456, ymax: 398, yu: 300, yd: 158, zd: 328, zb: 288 },
  { x: -1100, top: 402, bot: 72, zi: 196, zo: 340, ymax: 336, yu: 254, yd: 148, zd: 268, zb: 240 },
  { x: -1390, top: 330, bot: 98, zi: 138, zo: 220, ymax: 290, yu: 228, yd: 158, zd: 194, zb: 176 },
];

function podRing(p: Pod): V3[] {
  const { x } = p;
  return [
    [x, p.top - 4, p.zi],
    [x, p.top, (p.zi + p.zo) / 2],
    [x, p.top - 26, p.zo - 24],
    [x, p.ymax, p.zo],
    [x, p.yu, p.zo - 34],
    [x, p.yd, p.zd],
    [x, p.bot, p.zb],
    [x, p.bot, p.zi],
  ];
}

const mouthDark = new MeshStandardMaterial({ color: "#030304", roughness: 1, metalness: 0 });

/** One sidepod (right side; the model mirrors it). */
export function Sidepods() {
  const geo = useMemo(() => cached("car26-sidepods", () => loft(PODS.map(podRing), { along: 8, around: 4, capStart: true, capEnd: true })), []);
  // Dark inlet mouth: the opening into the radiator duct.
  const mouth = useMemo(
    () =>
      cached("car26-pod-mouths", () => {
        const p = PODS[0];
        const s = roundedRectShape(-(p.zo - 14), p.bot + 14, p.zo - p.zi - 28, p.top - p.bot - 28, 36);
        const g = new ShapeGeometry(s, 8);
        g.rotateY(Math.PI / 2);
        g.translate(p.x + 1, 0, 0);
        return g;
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={mouth} material={mouthDark} />
    </group>
  );
}

/** Engine cover stations: from behind the airbox to the tail above the gearbox. */
const COVER: { x: number; top: number; wt: number; zs: number; ys: number; bot: number }[] = [
  { x: -440, top: 950, wt: 140, zs: 226, ys: 712, bot: 560 },
  { x: -540, top: 922, wt: 150, zs: 246, ys: 686, bot: 500 },
  { x: -750, top: 832, wt: 158, zs: 268, ys: 616, bot: 400 },
  { x: -1050, top: 714, wt: 148, zs: 266, ys: 540, bot: 300 },
  { x: -1350, top: 604, wt: 124, zs: 234, ys: 470, bot: 240 },
  { x: -1600, top: 548, wt: 98, zs: 188, ys: 448, bot: 262 },
  { x: -1820, top: 552, wt: 76, zs: 140, ys: 470, bot: 330 },
  { x: -2010, top: 548, wt: 60, zs: 96, ys: 486, bot: 416 },
];

export function EngineCover() {
  const geo = useMemo(
    () =>
      cached("car26-engine-cover", () => {
        // The first section is the roll structure's last one, so the two meet
        // at a clean panel line.
        const a = AIRBOX[AIRBOX.length - 1];
        const first = mirrorRing(a.x + 1, noseHalf({ ...a, top: a.top - 1.5, bottom: a.bottom + 1.5, w: a.w - 1.5 }));
        const rings = COVER.map((c) =>
          mirrorRing(c.x, [
            [c.top, 0],
            [c.top - 6, c.wt * 0.5],
            [c.top - 32, c.wt],
            [c.ys + (c.top - c.ys) * 0.35, c.zs * 0.93],
            [c.ys, c.zs],
            [c.bot + 60, c.zs * 0.9],
            [c.bot, c.zs * 0.5],
            [c.bot, 0],
          ]),
        );
        return loft([first, ...rings], { along: 8, around: 3, capStart: true, capEnd: true });
      }),
    [],
  );
  // A small shark fin is back on the 2026 cars.
  const fin = useMemo(
    () =>
      cached("car26-shark-fin", () =>
        plate(
          smoothOutline(
            [
              [-370, 1000],
              [-850, 902],
              [-1330, 680],
              [-1360, 600],
              [-1050, 704],
              [-750, 822],
              [-480, 932],
              [-380, 970],
            ],
            5,
          ),
          6,
          0,
        ),
      ),
    [],
  );
  // The telemetry (CCU) antenna on the cover's shoulder.
  const antenna = useMemo(() => cached("car26-ccu-antenna", () => mergeAll([rod([-560, 900, 130], [-600, 990, 128], 6), new BoxGeometry(30, 10, 22).translate(-556, 896, 132)])), []);
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={fin} material={bodyPaint()} castShadow />
      <mesh geometry={antenna} material={CAR_MAT.composite} castShadow />
    </group>
  );
}

/** A radiator core with end tanks: fine aluminium fins between coolant tubes. */
function core(w: number, h: number, t: number) {
  const body = new BoxGeometry(t, h, w);
  const tankTop = new BoxGeometry(t + 16, 34, w + 8).translate(0, h / 2 + 17, 0);
  const tankBottom = tankTop.clone().translate(0, -h - 34, 0);
  return { body, tanks: mergeAll([tankTop, tankBottom]) };
}

/**
 * Coolers in the sidepods: the water radiator on the right, the charge-air
 * cooler (compressed intake air) on the left, both steeply inclined so a tall
 * core fits a low pod.
 */
export function Radiators() {
  const parts = useMemo(
    () =>
      cached("car26-radiators", () => {
        // Inclined both ways so the core stays between the tub and the undercut.
        const { body, tanks } = core(150, 230, 60);
        const place = (g: BufferGeometry) => g.clone().rotateZ(0.75).rotateX(0.24).rotateY(0.12).translate(190, 446, 448);
        return { cores: place(body), tanks: place(tanks) };
      }),
    [],
  );
  const hoses = useMemo(
    () =>
      cached("car26-radiator-hoses", () =>
        mergeAll([
          pipe(
            [
              [280, 330, 430],
              [0, 300, 390],
              [XPU + 40, 230, 300],
              [XPU - 40, 280, 250],
            ],
            16,
          ),
          pipe(
            [
              [90, 556, 470],
              [-150, 540, 400],
              [XPU + 60, 480, 290],
              [XPU - 40, 470, 236],
            ],
            16,
          ),
        ]),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.cores} material={CAR_MAT.radiatorCore} castShadow receiveShadow />
      <mesh geometry={parts.tanks} material={CAR_MAT.aluminium} castShadow />
      <mesh geometry={hoses} material={CAR_MAT.hose} castShadow />
    </group>
  );
}

/** Oil and ERS coolers packaged under the airbox, fed from the roll-hoop intake. */
export function AirboxCooler() {
  const g = useMemo(
    () =>
      cached("car26-airbox-cooler", () => {
        const { body, tanks } = core(200, 150, 50);
        return { body: body.clone().rotateZ(-0.9).translate(-420, 808, 0), tanks: tanks.clone().rotateZ(-0.9).translate(-420, 808, 0) };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={g.body} material={CAR_MAT.radiatorCore} castShadow />
      <mesh geometry={g.tanks} material={CAR_MAT.aluminium} castShadow />
    </group>
  );
}
