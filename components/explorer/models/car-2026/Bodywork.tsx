"use client";

import { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, ShapeGeometry, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedRectShape } from "../../kit/geometry";
import { loft, mirrorRing, type V3 } from "../../kit/loft";
import { pipe } from "../../kit/strut";
import { plate, smoothOutline } from "../../kit/wing";
import { bodyPaint } from "./livery";

/**
 * Sidepod sections (right side): top, the floor line, the inner wall hidden
 * inside the chassis, the outer face, and the undercut that tucks the lower
 * pod inward so air can reach the back of the floor.
 */
type Pod = { x: number; top: number; bot: number; zi: number; zo: number; ymax: number; yu: number; yd: number; zd: number; zb: number };

const PODS: Pod[] = [
  { x: 792, top: 628, bot: 452, zi: 384, zo: 586, ymax: 560, yu: 500, yd: 476, zd: 548, zb: 500 },
  { x: 750, top: 650, bot: 390, zi: 364, zo: 610, ymax: 560, yu: 470, yd: 424, zd: 560, zb: 470 },
  { x: 600, top: 662, bot: 72, zi: 330, zo: 640, ymax: 548, yu: 420, yd: 232, zd: 470, zb: 400 },
  { x: 300, top: 650, bot: 66, zi: 318, zo: 646, ymax: 532, yu: 410, yd: 202, zd: 452, zb: 380 },
  { x: -100, top: 612, bot: 66, zi: 300, zo: 618, ymax: 500, yu: 382, yd: 190, zd: 420, zb: 360 },
  { x: -500, top: 548, bot: 66, zi: 270, zo: 548, ymax: 452, yu: 340, yd: 170, zd: 380, zb: 320 },
  { x: -900, top: 462, bot: 66, zi: 228, zo: 442, ymax: 382, yu: 290, yd: 150, zd: 322, zb: 280 },
  { x: -1250, top: 382, bot: 72, zi: 178, zo: 322, ymax: 322, yu: 242, yd: 142, zd: 262, zb: 232 },
  { x: -1500, top: 318, bot: 96, zi: 126, zo: 206, ymax: 282, yu: 222, yd: 152, zd: 190, zb: 172 },
];

function podRing(p: Pod): V3[] {
  const { x } = p;
  return [
    [x, p.top - 4, p.zi],
    [x, p.top, (p.zi + p.zo) / 2],
    [x, p.top - 28, p.zo - 26],
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
  const geo = useMemo(
    () =>
      cached("car26-sidepods", () => {
        return loft(PODS.map(podRing), { along: 8, around: 4, capStart: true, capEnd: true });
      }),
    [],
  );
  // Dark inlet mouths: the opening into the radiator duct.
  const mouths = useMemo(
    () =>
      cached("car26-pod-mouths", () => {
        const p = PODS[0];
        const s = roundedRectShape(-(p.zo - 16), p.bot + 14, p.zo - p.zi - 32, p.top - p.bot - 30, 40);
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
      <mesh geometry={mouths} material={mouthDark} />
    </group>
  );
}

/** Engine cover stations: from behind the airbox to the tail above the gearbox. */
const COVER: { x: number; top: number; wt: number; zs: number; ys: number; bot: number }[] = [
  { x: -120, top: 990, wt: 118, zs: 198, ys: 770, bot: 640 },
  { x: -300, top: 945, wt: 150, zs: 242, ys: 704, bot: 520 },
  { x: -600, top: 836, wt: 162, zs: 282, ys: 624, bot: 400 },
  { x: -900, top: 724, wt: 160, zs: 292, ys: 552, bot: 300 },
  { x: -1200, top: 604, wt: 140, zs: 272, ys: 470, bot: 230 },
  { x: -1500, top: 540, wt: 110, zs: 222, ys: 430, bot: 214 },
  { x: -1800, top: 528, wt: 80, zs: 150, ys: 452, bot: 300 },
  { x: -2010, top: 520, wt: 52, zs: 92, ys: 470, bot: 408 },
];

export function EngineCover() {
  const geo = useMemo(
    () =>
      cached("car26-engine-cover", () => {
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
        return loft(rings, { along: 8, around: 3, capStart: true, capEnd: true });
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
              [-160, 1000],
              [-700, 912],
              [-1180, 688],
              [-1210, 596],
              [-900, 712],
              [-600, 824],
              [-300, 934],
              [-170, 976],
            ],
            5,
          ),
          6,
          0,
        ),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={fin} material={bodyPaint()} castShadow />
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
        const { body, tanks } = core(230, 300, 64);
        const place = (g: BufferGeometry, z: number) => g.clone().rotateZ(0.62).rotateY(-0.12).translate(420, 360, z);
        return { cores: place(body, 480), tanks: place(tanks, 480) };
      }),
    [],
  );
  const hoses = useMemo(
    () =>
      cached("car26-radiator-hoses", () => {
        const a = pipe(
          [
            [300, 230, 470],
            [100, 200, 420],
            [-600, 210, 300],
            [-700, 300, 250],
          ],
          16,
        );
        const b = pipe(
          [
            [520, 520, 470],
            [200, 560, 400],
            [-500, 520, 280],
            [-700, 480, 230],
          ],
          16,
        );
        return mergeAll([a, b]);
      }),
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
        const { body, tanks } = core(220, 160, 50);
        return { body: body.clone().rotateZ(-0.9).translate(-260, 820, 0), tanks: tanks.clone().rotateZ(-0.9).translate(-260, 820, 0) };
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
