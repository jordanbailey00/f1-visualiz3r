"use client";

import { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, ShapeGeometry, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedRectShape } from "../../kit/geometry";
import { loft, mirrorRing, type V3 } from "../../kit/loft";
import { pipe, rod } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { AIRBOX, noseHalf } from "./Chassis";
import { floorTopAt } from "./Floor";
import { COVER_LINE, XPU } from "./layout";
import { bodyPaint } from "./livery";

/**
 * Sidepod sections (right side): a high inlet just behind the clear gap
 * after the bargeboards, a deep undercut, and a top that stays below
 * Z = 600 outboard of ±350 mm (3.5.2) before tapering into the coke bottle.
 * The bottoms sit on the stepped floor.
 */
type Pod = { x: number; top: number; bot: number; zi: number; zo: number; ymax: number; yu: number; yd: number; zd: number; zb: number };

const pod = (p: Omit<Pod, "bot"> & { bot?: number }): Pod => ({ ...p, bot: p.bot ?? floorTopAt(p.x) });

export const PODS: Pod[] = [
  pod({ x: 600, top: 632, bot: 484, zi: 362, zo: 586, ymax: 592, yu: 536, yd: 508, zd: 552, zb: 516 }),
  pod({ x: 560, top: 638, bot: 420, zi: 342, zo: 616, ymax: 592, yu: 504, yd: 456, zd: 566, zb: 488 }),
  pod({ x: 400, top: 638, zi: 322, zo: 648, ymax: 580, yu: 452, yd: 282, zd: 466, zb: 400 }),
  pod({ x: 100, top: 626, zi: 312, zo: 640, ymax: 540, yu: 420, yd: 240, zd: 438, zb: 380 }),
  pod({ x: -250, top: 572, zi: 290, zo: 590, ymax: 480, yu: 370, yd: 212, zd: 404, zb: 366 }),
  pod({ x: -650, top: 490, zi: 250, zo: 496, ymax: 410, yu: 316, yd: 200, zd: 376, zb: 340 }),
  pod({ x: -1000, top: 402, zi: 200, zo: 370, ymax: 344, yu: 268, yd: 190, zd: 288, zb: 256 }),
  pod({ x: -1300, top: 330, zi: 140, zo: 246, ymax: 300, yu: 250, yd: 214, zd: 210, zb: 192 }),
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
  const geo = useMemo(() => cached("car14-sidepods", () => loft(PODS.map(podRing), { along: 8, around: 4, capStart: true, capEnd: true })), []);
  // Dark inlet mouth: the opening into the radiator duct.
  const mouth = useMemo(
    () =>
      cached("car14-pod-mouths", () => {
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
 * Engine cover stations: from the roll structure back to the exhaust, where
 * the cover ends in a cooling exit round the tailpipes, 150 mm behind the
 * rear axle.
 */
const COVER: { x: number; top: number; wt: number; zs: number; ys: number; bot: number }[] = [
  { x: -440, top: 950, wt: 140, zs: 226, ys: 712, bot: 560 },
  { x: -620, top: 935, wt: 150, zs: 246, ys: 690, bot: 500 },
  { x: -880, top: 870, wt: 158, zs: 268, ys: 630, bot: 400 },
  { x: -1180, top: 780, wt: 150, zs: 262, ys: 560, bot: 300 },
  { x: -1480, top: 680, wt: 130, zs: 230, ys: 500, bot: 260 },
  { x: -1750, top: 610, wt: 106, zs: 192, ys: 476, bot: 290 },
  { x: -1950, top: 568, wt: 80, zs: 150, ys: 470, bot: 350 },
  { x: -2080, top: 524, wt: 64, zs: 124, ys: 470, bot: 380 },
  { x: -2150, top: 498, wt: 56, zs: 112, ys: 466, bot: 392 },
];

export function EngineCover() {
  const geo = useMemo(
    () =>
      cached("car14-engine-cover", () => {
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
  // The spine: from the side the cover must fill the area under a diagonal
  // from Z = 925, 1,000 mm ahead of the rear axle, to Z = 550 just ahead of
  // it; above that it may be no more than 125 mm wide (3.16).
  const fin = useMemo(
    () =>
      cached("car14-shark-fin", () => {
        const top: [number, number][] = [-470, -1000, -1300, -1600, -1800, -1948].map((x) => [x, COVER_LINE.top(x) - 3]);
        return plate(
          smoothOutline(
            [
              ...top,
              [-1962, 560],
              [-1962, 540],
              [-1500, 640],
              [-1200, 740],
              [-900, 830],
              [-600, 900],
              [-470, 940],
            ],
            3,
          ),
          10,
          0,
        );
      }),
    [],
  );
  // The telemetry (CCU) antenna on the cover's shoulder.
  const antenna = useMemo(() => cached("car14-ccu-antenna", () => mergeAll([rod([-560, 900, 130], [-600, 990, 128], 6), new BoxGeometry(30, 10, 22).translate(-556, 896, 132)])), []);
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
      cached("car14-radiators", () => {
        // Inclined both ways so the core stays between the tub and the undercut.
        const { body, tanks } = core(150, 260, 60);
        const place = (g: BufferGeometry) => g.clone().rotateZ(0.75).rotateX(0.2).rotateY(0.1).translate(300, 470, 470);
        return { cores: place(body), tanks: place(tanks) };
      }),
    [],
  );
  const hoses = useMemo(
    () =>
      cached("car14-radiator-hoses", () =>
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
              [196, 612, 480],
              [-100, 586, 400],
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

/** Oil and ERS coolers packaged under the airbox, fed from the roll-hoop intake. */
export function AirboxCooler() {
  const g = useMemo(
    () =>
      cached("car14-airbox-cooler", () => {
        const { body, tanks } = core(200, 150, 50);
        return { body: body.clone().rotateZ(-0.9).translate(-470, 808, 0), tanks: tanks.clone().rotateZ(-0.9).translate(-470, 808, 0) };
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
