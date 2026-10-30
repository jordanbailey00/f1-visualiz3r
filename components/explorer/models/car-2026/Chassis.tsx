"use client";

import { useMemo } from "react";
import {
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
} from "three";
import { FONT_MONO, FONT_SANS } from "@/lib/three/painter";
import { CAR_MAT, glow, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { foilMember, rod } from "../../kit/strut";
import { COCKPIT, HALO, NOSE, TUB } from "./layout";
import { bodyPaint } from "./livery";

type V3 = [number, number, number];
type Station = { x: number; top: number; bottom: number; w: number };

function stationAt(list: Station[], x: number): Station {
  for (let i = 0; i < list.length - 1; i++) {
    const a = list[i];
    const b = list[i + 1];
    if ((x <= a.x && x >= b.x) || (x >= a.x && x <= b.x)) {
      const t = (x - a.x) / (b.x - a.x);
      return { x, top: a.top + (b.top - a.top) * t, bottom: a.bottom + (b.bottom - a.bottom) * t, w: a.w + (b.w - a.w) * t };
    }
  }
  return { ...list[x > list[0].x ? 0 : list.length - 1], x };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Cockpit opening half-width: narrower by the steering wheel. */
const cockpitW = (x: number) => COCKPIT.halfWidth - 18 * smooth(560, COCKPIT.front, x);

/**
 * Half cross-section of the tub (top centre → +z side → bottom centre). Inside
 * the cockpit the "top" points drop down the inner wall to the cockpit floor,
 * so one closed loft forms both the outer skin and the cockpit tub.
 */
function tubHalf(s: Station, open: boolean): [number, number][] {
  const { top, bottom, w } = s;
  const h = top - bottom;
  const outer: [number, number][] = [
    [top - 9, w - 46],
    [top - 52, w - 5],
    [bottom + h * 0.42, w],
    [bottom + 42, w - 16],
    [bottom + 5, w - 64],
    [bottom, (w - 64) * 0.45],
    [bottom, 0],
  ];
  if (!open) {
    const r = w - 46;
    return [[top, 0], [top - 1, r * 0.22], [top - 2, r * 0.44], [top - 4, r * 0.66], [top - 6, r * 0.86], ...outer];
  }
  const cw = cockpitW(s.x);
  return [[COCKPIT.floorY, 0], [COCKPIT.floorY + 3, cw * 0.6], [COCKPIT.floorY + 46, cw - 5], [top - 44, cw], [top - 2, cw + 13], ...outer];
}

export function Monocoque() {
  const geo = useMemo(
    () =>
      cached("car26-tub", () => {
        const xs = new Set<number>(TUB.map((s) => s.x));
        for (const x of [COCKPIT.front + 24, COCKPIT.front, COCKPIT.front - 70, COCKPIT.rear + 60, COCKPIT.rear, COCKPIT.rear - 24]) xs.add(x);
        const list = [...xs].sort((a, b) => b - a);
        const rings = list.map((x) => {
          const open = x <= COCKPIT.front && x >= COCKPIT.rear;
          return mirrorRing(x, tubHalf(stationAt(TUB, x), open));
        });
        return loft(rings, { along: 6, around: 3, capStart: true, capEnd: true });
      }),
    [],
  );
  return <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />;
}

function noseHalf(s: Station): [number, number][] {
  const h = s.top - s.bottom;
  return [
    [s.top, 0],
    [s.top - h * 0.02, s.w * 0.45],
    [s.top - h * 0.12, s.w * 0.84],
    [s.top - h * 0.34, s.w],
    [s.bottom + h * 0.3, s.w * 0.98],
    [s.bottom + h * 0.06, s.w * 0.82],
    [s.bottom, s.w * 0.4],
    [s.bottom, 0],
  ];
}

/** Two-stage front impact structure, from the front bulkhead to the wing. */
export function NoseCone() {
  const geo = useMemo(
    () =>
      cached("car26-nose", () => {
        const stations = [{ ...NOSE[0], x: NOSE[0].x - 10, top: NOSE[0].top - 2, bottom: NOSE[0].bottom + 2, w: NOSE[0].w - 3 }, ...NOSE.slice(1)];
        return loft(
          stations.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 8, around: 3, capStart: true, capEnd: true },
        );
      }),
    [],
  );
  // Camera pods either side of the nose.
  const pods = useMemo(
    () =>
      cached("car26-nose-pods", () => {
        const one = mergeAll([
          foilMember([2330, 470, 96], [2330, 470, 150], 46, 14),
          roundedBox(78, 36, 34, 12).clone().translate(2330, 470, 160),
        ]);
        return mergeAll([one, mirrorZ(one)]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={pods} material={CAR_MAT.composite} castShadow />
      {[1, -1].map((s) => (
        <mesh key={s} geometry={lensGeo} material={CAR_MAT.lens} position={[2370, 470, 160 * s]} rotation={[0, Math.PI / 2, 0]} />
      ))}
    </group>
  );
}

const lensGeo = new CircleGeometry(9, 20);

/**
 * Titanium halo: a hoop round the driver's head on two rear mounts and a
 * central front pillar, under a slim aero fairing.
 */
export function Halo() {
  const geo = useMemo(
    () =>
      cached("car26-halo", () => {
        const right: V3[] = [
          [HALO.rearX, HALO.rearY - 8, HALO.rearZ],
          [HALO.rearX + 24, 788, HALO.rearZ + 2],
          [HALO.rearX + 108, 856, 252],
          [HALO.rearX + 268, HALO.hoopY, 210],
          [HALO.rearX + 452, 881, 118],
        ];
        const pts: V3[] = [...right, [HALO.frontX, HALO.hoopY, 0], ...right.slice().reverse().map(([x, y, z]) => [x, y, -z] as V3)];
        const curve = new CatmullRomCurve3(pts.map((p) => new Vector3(...p)), false, "centripetal");
        const hoop = new TubeGeometry(curve, 160, HALO.tube / 2, 18, false);
        const pillar = new CatmullRomCurve3(
          [
            [HALO.frontX - 30, HALO.hoopY, 0],
            [HALO.frontX + 60, HALO.hoopY - 22, 0],
            [HALO.pillarX - 40, 772, 0],
            [HALO.pillarX + 6, HALO.pillarY - 10, 0],
          ].map((p) => new Vector3(...(p as V3))),
          false,
          "centripetal",
        );
        const pil = new TubeGeometry(pillar, 40, 26, 16, false);
        pil.scale(1, 1, 0.62);
        return mergeAll([hoop, pil]);
      }),
    [],
  );
  const mounts = useMemo(
    () =>
      cached("car26-halo-mounts", () => {
        const m = roundedBox(70, 34, 60, 10).clone().translate(HALO.rearX + 6, HALO.rearY + 6, HALO.rearZ);
        const front = roundedBox(80, 24, 64, 10).clone().translate(HALO.pillarX, HALO.pillarY + 4, 0);
        return mergeAll([m, mirrorZ(m), front]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={mounts} material={CAR_MAT.titanium} castShadow />
    </group>
  );
}

/** Roll hoop and engine air intake above the driver's head. */
// The roll structure must reach 968 mm above the reference plane.
const AIRBOX: Station[] = [
  { x: 232, top: 994, bottom: 880, w: 74 },
  { x: 210, top: 1008, bottom: 850, w: 94 },
  { x: 120, top: 1015, bottom: 792, w: 112 },
  { x: 0, top: 1005, bottom: 740, w: 132 },
  { x: -150, top: 985, bottom: 716, w: 152 },
];

export function RollStructure() {
  const geo = useMemo(
    () =>
      cached("car26-airbox", () =>
        loft(
          AIRBOX.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 6, around: 3, capStart: true, capEnd: true },
        ),
      ),
    [],
  );
  const mouth = useMemo(
    () =>
      cached("car26-airbox-mouth", () => {
        const g = new CircleGeometry(1, 40);
        g.scale(60, 46, 1);
        g.rotateY(Math.PI / 2);
        g.translate(AIRBOX[0].x + 0.8, (AIRBOX[0].top + AIRBOX[0].bottom) / 2 + 2, 0);
        return g;
      }),
    [],
  );
  const tcam = useMemo(
    () =>
      cached("car26-tcam", () =>
        mergeAll([foilMember([60, 1008, 0], [60, 1044, 0], 120, 26), roundedBox(150, 26, 72, 10).clone().translate(52, 1054, 0)]),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={mouth} material={intakeDark} />
      <mesh geometry={tcam} material={CAR_MAT.yellowCam} castShadow />
    </group>
  );
}

const intakeDark = new MeshStandardMaterial({ color: "#030304", roughness: 1, metalness: 0 });

/** Kevlar-reinforced rubber fuel bladder behind the driver's seat. */
export function FuelCell() {
  return (
    <group>
      <mesh geometry={roundedBox(700, 452, 520, 60)} material={fuelBag} position={[-250, 446, 0]} castShadow receiveShadow />
      {/* Fuel filler and breather on top. */}
      <mesh geometry={cached("car26-filler", () => new CylinderGeometry(34, 34, 30, 24))} material={CAR_MAT.aluminium} position={[-420, 686, 150]} />
      <mesh geometry={cached("car26-breather", () => new CylinderGeometry(14, 14, 40, 16))} material={CAR_MAT.aluminium} position={[-120, 690, -120]} />
    </group>
  );
}

const fuelBag = paintColour("fuelBag", "#5a5446", { roughness: 0.82, clearcoat: 0, metalness: 0 });

/** Carbon seat moulded to the driver, reclined low in the tub. */
export function Seat() {
  const geo = useMemo(
    () =>
      cached("car26-seat", () => {
        const base = roundedBox(380, 30, 390, 12).clone().rotateZ(-0.12).translate(480, 158, 0);
        const back = roundedBox(30, 420, 420, 12).clone().rotateZ(0.62).translate(250, 390, 0);
        const sideL = roundedBox(560, 120, 26, 10).clone().rotateZ(-0.5).translate(380, 300, 200);
        const sideR = sideL.clone().translate(0, 0, -400);
        return mergeAll([base, back, sideL, sideR]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

let dashTex: CanvasTexture | null = null;
function dashTexture() {
  if (dashTex) return dashTex;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#020305";
  g.fillRect(0, 0, 512, 256);
  // Shift lights: green, red, blue.
  for (let i = 0; i < 15; i++) {
    g.fillStyle = i < 5 ? "#22e05a" : i < 10 ? "#ff2b2b" : "#3d7bff";
    g.beginPath();
    g.arc(36 + i * 31, 26, 10, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#f4f6f8";
  g.font = `700 150px ${FONT_SANS}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("7", 256, 150);
  g.font = `500 30px ${FONT_MONO}`;
  g.fillStyle = "#22e05a";
  g.textAlign = "left";
  g.fillText("-0.214", 22, 112);
  g.fillStyle = "#cfd6de";
  g.fillText("ERS 82%", 22, 160);
  g.fillText("SOC  4.0", 22, 204);
  g.textAlign = "right";
  g.fillStyle = "#ffd23d";
  g.fillText("SM", 490, 112);
  g.fillStyle = "#cfd6de";
  g.fillText("L 23", 490, 160);
  g.fillText("298", 490, 204);
  dashTex = new CanvasTexture(c);
  dashTex.colorSpace = SRGBColorSpace;
  return dashTex;
}

/** Carbon steering wheel with display, switches and shift paddles. */
export function SteeringWheel() {
  const body = useMemo(
    () =>
      cached("car26-wheel-body", () => {
        const core = roundedBox(42, 128, 236, 18);
        const gripL = roundedBox(46, 150, 46, 20).clone().translate(-4, -8, 128);
        const gripR = gripL.clone().translate(0, 0, -256);
        return mergeAll([core, gripL.clone().rotateX(0.08), gripR.clone().rotateX(-0.08)]);
      }),
    [],
  );
  const grips = useMemo(
    () =>
      cached("car26-wheel-grips", () => {
        const g = roundedBox(52, 118, 52, 22).clone().translate(-4, -8, 130);
        return mergeAll([g, g.clone().translate(0, 0, -260)]);
      }),
    [],
  );
  const paddles = useMemo(
    () =>
      cached("car26-wheel-paddles", () => {
        const p = roundedBox(8, 70, 64, 3).clone().translate(30, 6, 70);
        return mergeAll([p, p.clone().translate(0, 0, -140), p.clone().translate(0, -62, 0), p.clone().translate(0, -62, -140)]);
      }),
    [],
  );
  const knobs = useMemo(
    () =>
      cached("car26-wheel-knobs", () => {
        const k = new CylinderGeometry(9, 9, 14, 16).rotateZ(Math.PI / 2);
        const parts = [];
        for (const [y, z] of [
          [-36, 62],
          [-36, -62],
          [-48, 24],
          [-48, -24],
        ])
          parts.push(k.clone().translate(-26, y, z));
        return mergeAll(parts);
      }),
    [],
  );
  const buttons = useMemo(
    () =>
      cached("car26-wheel-buttons", () => {
        const b = new CylinderGeometry(6, 6, 6, 14).rotateZ(Math.PI / 2);
        const parts = [];
        for (const [y, z] of [
          [44, 96],
          [44, -96],
          [18, 104],
          [18, -104],
          [-8, 102],
          [-8, -102],
          [-56, 60],
          [-56, -60],
        ])
          parts.push(b.clone().translate(-23, y, z));
        return mergeAll(parts);
      }),
    [],
  );
  const screen = useMemo(() => new PlaneGeometry(132, 66), []);
  const screenMat = useMemo(() => {
    const m = glow("#ffffff", 1.15).clone();
    m.color.set("#000000");
    m.emissiveMap = dashTexture();
    return m;
  }, []);
  return (
    <group position={[968, 560, 0]} rotation={[0, 0, -0.32]}>
      <mesh geometry={body} material={CAR_MAT.carbon} castShadow />
      <mesh geometry={grips} material={CAR_MAT.rubberGrip} castShadow />
      <mesh geometry={paddles} material={CAR_MAT.composite} castShadow />
      <mesh geometry={knobs} material={CAR_MAT.aluminium} />
      <mesh geometry={buttons} material={paintColour("wheelButtons", "#e8452c", { roughness: 0.4 })} />
      <mesh geometry={screen} material={screenMat} position={[-21.6, 18, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Steering column into the dash bulkhead. */}
      <mesh geometry={cached("car26-column", () => rod([20, 0, 0], [300, -40, 0], 26))} material={CAR_MAT.steel} />
    </group>
  );
}

/** Energy-absorbing foam pads round the cockpit opening. */
export function Headrest() {
  const geo = useMemo(
    () =>
      cached("car26-headrest", () => {
        const back = roundedBox(110, 120, 470, 36).clone().translate(COCKPIT.rear + 46, 738, 0);
        const side = roundedBox(380, 96, 72, 30).clone().translate(COCKPIT.rear + 260, 728, COCKPIT.halfWidth - 6);
        return mergeAll([back, side, mirrorZ(side)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.foam} castShadow receiveShadow />;
}

/** Mirror housing on its stalks at the sidepod shoulder (right side; mirrored by the model). */
export function Mirrors() {
  const geo = useMemo(
    () =>
      cached("car26-mirrors", () => {
        return mergeAll([
          roundedBox(64, 56, 176, 22).clone().translate(842, 668, 452),
          foilMember([846, 640, 410], [880, 560, 360], 40, 12),
          foilMember([846, 642, 490], [860, 560, 470], 36, 12),
        ]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow />
      <mesh geometry={mirrorGlass} material={CAR_MAT.mirror} position={[809.6, 668, 452]} rotation={[0, -Math.PI / 2, 0]} />
      {/* ERS status light built into the housing. */}
      <mesh geometry={cached("car26-mirror-led", () => new BoxGeometry(40, 8, 60))} material={glow("#3dd6ff", 2.2)} position={[842, 640, 548]} />
    </group>
  );
}

const mirrorGlass = new PlaneGeometry(156, 40);

/** Crash tubes inside the sidepod that protect the driver from side impacts (right side). */
export function SideImpact() {
  const geo = useMemo(
    () =>
      cached("car26-sis", () => {
        const upper = rod([520, 540, 300], [520, 540, 640], 96);
        const lower = rod([430, 250, 300], [430, 250, 610], 86);
        return mergeAll([upper, lower]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />;
}
