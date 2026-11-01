"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, MeshStandardMaterial, ShapeGeometry, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedRectShape } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ, superRing, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { AIRBOX, noseHalf } from "./Chassis";
import { floorTopAt } from "./Floor";
import { COVER_LINE, XPU, XR, Z } from "./layout";
import { bodyPaint } from "./livery";

const FLAP = naca(0.09, 0.42, 0.075);

/**
 * Sidepod sections (right side): a high inlet behind the bargeboards, a deep
 * undercut, a top that stays below Z = 600 outboard of ±300 mm (3.8.1), then
 * the coke bottle, narrowing and dropping away to the floor ahead of the rear
 * tyres. The bottoms sit on the stepped floor.
 */
type Pod = { x: number; top: number; bot: number; zi: number; zo: number; ymax: number; yu: number; yd: number; zd: number; zb: number };

const pod = (p: Omit<Pod, "bot"> & { bot?: number }): Pod => ({ ...p, bot: p.bot ?? floorTopAt(p.x) });

export const PODS: Pod[] = [
  pod({ x: 640, top: 616, bot: 484, zi: 362, zo: 590, ymax: 586, yu: 540, yd: 510, zd: 556, zb: 520 }),
  pod({ x: 600, top: 622, bot: 420, zi: 342, zo: 622, ymax: 586, yu: 506, yd: 456, zd: 570, zb: 490 }),
  pod({ x: 440, top: 626, zi: 322, zo: 654, ymax: 578, yu: 452, yd: 286, zd: 470, zb: 404 }),
  pod({ x: 150, top: 618, zi: 312, zo: 646, ymax: 544, yu: 420, yd: 244, zd: 442, zb: 382 }),
  pod({ x: -200, top: 580, zi: 290, zo: 604, ymax: 490, yu: 376, yd: 214, zd: 408, zb: 366 }),
  pod({ x: -560, top: 506, zi: 252, zo: 520, ymax: 424, yu: 322, yd: 202, zd: 380, zb: 340 }),
  pod({ x: -860, top: 434, zi: 204, zo: 396, ymax: 372, yu: 288, yd: 192, zd: 296, zb: 258 }),
  pod({ x: -1060, top: 380, zi: 160, zo: 300, ymax: 336, yu: 268, yd: 200, zd: 236, zb: 214 }),
  pod({ x: -1200, top: 300, zi: 130, zo: 240, ymax: 268, yu: 222, yd: 180, zd: 206, zb: 190 }),
  pod({ x: -1290, top: 170, zi: 104, zo: 206, ymax: 150, yu: 134, yd: 126, zd: 190, zb: 180 }),
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
  const geo = useMemo(() => cached("car06-sidepods", () => loft(PODS.map(podRing), { along: 8, around: 4, capStart: true, capEnd: true })), []);
  // Dark inlet mouth: the opening into the radiator duct.
  const mouth = useMemo(
    () =>
      cached("car06-pod-mouths", () => {
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

/**
 * A cooling chimney (right side): a hood on top of the sidepod, open at the
 * back, that lets hot air out of the pod. Teams fitted them for hot races and
 * took them off where the car could run cooler.
 */
export function Chimneys() {
  const parts = useMemo(
    () =>
      cached("car06-chimney", () => {
        const cz = 432;
        const ring = (x: number, cy: number, w: number, top: number, bottom: number) => superRing(x, cy, w, top, bottom, { cz, n: 3.2 });
        const hood = loft([ring(-290, 546, 34, 4, 34), ring(-340, 548, 54, 30, 50), ring(-440, 540, 66, 62, 56), ring(-512, 528, 70, 82, 44)], {
          along: 6,
          around: 2,
          capStart: true,
          capEnd: true,
        });
        const g = new CircleGeometry(1, 36);
        g.scale(62, 72, 1);
        g.rotateY(-Math.PI / 2);
        g.translate(-513, 534, cz);
        return { hood, mouth: g };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.hood} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={parts.mouth} material={mouthDark} />
    </group>
  );
}

/**
 * Flip-ups (right side): curved deflectors that turn the air up and over the
 * rear tyre, one on the floor ahead of the tyre and a fence and winglet on the
 * sidepod. Beyond ±500 mm they stay below Z = 500 (3.8.2).
 */
export function FlipUps() {
  const geo = useMemo(
    () =>
      cached("car06-flip-ups", () => {
        const low = (z: number): WingStation => ({ z, x: -1030, y: Z(84), chord: 130, angle: 0.46 });
        const floorFlip = wingElement(FLAP, [low(526), low(610), low(694)], 3);
        const fence = (z: number) =>
          plate(
            [
              [-1010, floorTopAt(-1010)],
              [-1040, Z(120)],
              [-1150, Z(156)],
              [-1160, floorTopAt(-1160)],
            ],
            5,
            z,
          );
        // On the sidepod, a slim winglet held between two thin fences.
        const up = (z: number): WingStation => ({ z, x: -640, y: 512, chord: 112, angle: 0.3 });
        const podWing = wingElement(FLAP, [up(352), up(420), up(476)], 3);
        const podFence = (z: number) =>
          plate(
            [
              [-620, 462],
              [-636, 520],
              [-770, 556],
              [-790, 548],
              [-790, 430],
            ],
            4,
            z,
          );
        return mergeAll([floorFlip, fence(526), fence(694), podWing, podFence(352), podFence(476)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Horn wing (right side): a winglet on the chassis shoulder ahead of the
 * cockpit. It stays inside ±400 mm, clear of the front wheels (3.11), and
 * below Z = 600 outboard of ±300 mm (3.8.1).
 */
export function HornWings() {
  const geo = useMemo(
    () =>
      cached("car06-horn-wing", () => {
        const st = (z: number): WingStation => ({ z, x: 1190, y: 596, chord: 122, angle: 0.2 });
        const wing = wingElement(FLAP, [st(200), st(300), st(386)], 3);
        const tip = plate(
          [
            [1204, 592],
            [1190, 610],
            [1056, 630],
            [1056, 610],
          ],
          4,
          388,
        );
        return mergeAll([wing, tip]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The mid-wing: a small wing either side of the engine cover ahead of the rear
 * axle. Outside ±100 mm nothing there may be above Z = 600 (3.9.1), so it
 * sits just under the line.
 */
export function MidWing() {
  const geo = useMemo(
    () =>
      cached("car06-mid-wing", () => {
        const st = (z: number): WingStation => ({ z, x: XR + 262, y: Z(548), chord: 200, angle: 0.2 });
        const right = wingElement(FLAP, [st(52), st(200), st(336)], 3);
        const tip = plate(
          [
            [XR + 272, Z(530)],
            [XR + 268, Z(562)],
            [XR + 60, Z(596)],
            [XR + 60, Z(566)],
          ],
          4,
          338,
        );
        return mergeAll([right, tip, mirrorZ(right), mirrorZ(tip)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Engine cover stations: from the roll structure back over the gearbox, where
 * the cover ends in a cooling exit 150 mm behind the rear axle. Behind the
 * axle it must stay inside ±75 mm above Z = 375 (3.9.2).
 */
const COVER: { x: number; top: number; wt: number; zs: number; ys: number; bot: number }[] = [
  { x: -440, top: 946, wt: 140, zs: 226, ys: 712, bot: 560 },
  { x: -600, top: 925, wt: 150, zs: 246, ys: 690, bot: 500 },
  { x: -800, top: 860, wt: 156, zs: 262, ys: 630, bot: 400 },
  { x: -1000, top: 790, wt: 140, zs: 250, ys: 570, bot: 300 },
  { x: -1200, top: 706, wt: 116, zs: 214, ys: 510, bot: 270 },
  { x: -1400, top: 640, wt: 90, zs: 160, ys: 480, bot: 290 },
  { x: -1500, top: 612, wt: 72, zs: 112, ys: 470, bot: 330 },
  { x: -1560, top: 576, wt: 60, zs: 70, ys: 462, bot: 366 },
  { x: -1640, top: 530, wt: 56, zs: 68, ys: 450, bot: 380 },
  { x: -1720, top: 488, wt: 50, zs: 64, ys: 440, bot: 392 },
];

export function EngineCover() {
  const geo = useMemo(
    () =>
      cached("car06-engine-cover", () => {
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
  // The telemetry antenna on the cover's shoulder.
  const antenna = useMemo(() => cached("car06-antenna", () => mergeAll([rod([-560, 900, 130], [-600, 982, 128], 6), new BoxGeometry(30, 10, 22).translate(-556, 896, 132)])), []);
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={antenna} material={CAR_MAT.composite} castShadow />
    </group>
  );
}

/**
 * The shark fin: the cover must fill the area under a diagonal from Z = 925,
 * 1,000 mm ahead of the rear axle, to Z = 550 at the axle; above it, it may be
 * no more than 125 mm wide (3.16). Stretching a thin fin along that line
 * cleaned up the air reaching the rear wing.
 */
export function SharkFin() {
  const geo = useMemo(
    () =>
      cached("car06-shark-fin", () => {
        const top: [number, number][] = [1300, 1000, 700, 400, 200, 44].map((d) => [XR + d, COVER_LINE.top(XR + d) - 3]);
        return plate(
          smoothOutline(
            [
              ...top,
              [XR + 30, 570],
              [XR + 30, 552],
              [XR + 300, 610],
              [XR + 600, 700],
              [XR + 900, 810],
              [XR + 1200, 900],
              [XR + 1300, 930],
            ],
            3,
          ),
          10,
          0,
        );
      }),
    [],
  );
  return <mesh geometry={geo} material={bodyPaint()} castShadow />;
}

/** A radiator core with end tanks: fine aluminium fins between coolant tubes. */
function core(w: number, h: number, t: number) {
  const body = new BoxGeometry(t, h, w);
  const tankTop = new BoxGeometry(t + 16, 34, w + 8).translate(0, h / 2 + 17, 0);
  const tankBottom = tankTop.clone().translate(0, -h - 34, 0);
  return { body, tanks: mergeAll([tankTop, tankBottom]) };
}

/**
 * Coolers in the sidepods: the water radiator on the right, the oil cooler on
 * the left, both steeply inclined so a tall core fits a low pod.
 */
export function Radiators() {
  const parts = useMemo(
    () =>
      cached("car06-radiators", () => {
        // Inclined both ways so the core stays between the tub and the undercut.
        const { body, tanks } = core(150, 260, 60);
        const place = (g: BufferGeometry) => g.clone().rotateZ(0.75).rotateX(0.2).rotateY(0.1).translate(300, 480, 446);
        return { cores: place(body), tanks: place(tanks) };
      }),
    [],
  );
  const hoses = useMemo(
    () =>
      cached("car06-radiator-hoses", () =>
        mergeAll([
          pipe(
            [
              [400, 362, 440],
              [100, 310, 400],
              [XPU + 40, 240, 300],
              [XPU - 40, 280, 250],
            ],
            16,
          ),
          pipe(
            [
              [196, 600, 456],
              [-100, 570, 380],
              [XPU + 60, 470, 280],
              [XPU - 40, 440, 236],
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
