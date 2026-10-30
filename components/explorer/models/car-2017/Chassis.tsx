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
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
} from "three";
import { FONT_MONO, FONT_SANS } from "@/lib/three/painter";
import { Shift } from "../../Part";
import { CAR_MAT, glow, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, mirrorRing, mirrorZ } from "../../kit/loft";
import { ball, foilMember, memberMatrix, pipe, rod } from "../../kit/strut";
import { COCKPIT, ENGINE_MOUNTS, HALO, NOSE, TUB, XA, XC, XPU, Z } from "./layout";
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

/** Top of the tub at x (for things mounted on it). */
export const tubTop = (x: number) => stationAt(TUB, x).top;

/** Cockpit opening half-width: narrower by the steering wheel. */
const cockpitW = (x: number) => COCKPIT.halfWidth - 18 * smooth(500, COCKPIT.front, x);

/**
 * Half cross-section of the tub (top centre → +z side → bottom centre). Inside
 * the cockpit the "top" points drop down the inner wall to the cockpit floor,
 * so one closed loft forms both the outer skin and the cockpit tub.
 */
function tubHalf(s: Station, depth: number): [number, number][] {
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
  const r = w - 46;
  const closed: [number, number][] = [[top, 0], [top - 1, r * 0.22], [top - 2, r * 0.44], [top - 4, r * 0.66], [top - 6, r * 0.86]];
  if (depth <= 0) return [...closed, ...outer];
  const cw = cockpitW(s.x);
  const open: [number, number][] = [[COCKPIT.floorY, 0], [COCKPIT.floorY + 3, cw * 0.6], [COCKPIT.floorY + 46, cw - 5], [top - 44, cw], [top - 2, cw + 13]];
  // Part-way stations round the opening's front and rear edges into the tub.
  const inner = closed.map(([y, z], i) => [y + (open[i][0] - y) * depth, z + (open[i][1] - z) * depth] as [number, number]);
  return [...inner, ...outer];
}

/** How far the cockpit opening has dropped into the tub at x (0 closed … 1 fully open). */
const cockpitDepth = (x: number) => {
  const ramp = (d: number) => Math.min(1, Math.max(0, d / 46));
  const t = Math.min(ramp(COCKPIT.front + 26 - x), ramp(x - (COCKPIT.rear - 26)));
  return t * t * (3 - 2 * t);
};

export function Monocoque() {
  const geo = useMemo(
    () =>
      cached("car17-tub", () => {
        const xs = new Set<number>(TUB.map((s) => s.x));
        for (const edge of [COCKPIT.front + 26, COCKPIT.rear - 26])
          for (const d of [0, 12, 24, 36, 46, 70]) xs.add(edge > 0 ? edge - d : edge + d);
        const list = [...xs].sort((a, b) => b - a);
        const rings = list.map((x) => mirrorRing(x, tubHalf(stationAt(TUB, x), cockpitDepth(x))));
        return loft(rings, { along: 6, around: 3, capStart: true, capEnd: true });
      }),
    [],
  );
  // Six M12 studs on the rear bulkhead take the engine (C5.4.17).
  const studs = useMemo(
    () =>
      cached("car17-tub-studs", () => {
        const out: BufferGeometry[] = [];
        for (const [y, z] of ENGINE_MOUNTS)
          out.push(new CylinderGeometry(9, 9, 36, 12).rotateZ(Math.PI / 2).translate(XPU - 16, y, z));
        return mergeAll(out);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={studs} material={CAR_MAT.titanium} />
    </group>
  );
}

export function noseHalf(s: Station): [number, number][] {
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

/** Two-stage front impact structure, from the survival cell's forward face to the wing. */
export function NoseCone() {
  const geo = useMemo(
    () =>
      cached("car17-nose", () => {
        const stations = [{ ...NOSE[0], x: NOSE[0].x - 10, top: NOSE[0].top - 2, bottom: NOSE[0].bottom + 2, w: NOSE[0].w - 3 }, ...NOSE.slice(1)];
        return loft(
          stations.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 8, around: 3, capStart: true, capEnd: true },
        );
      }),
    [],
  );
  // The small cooling aperture at the tip (C3.16.1) and the pitot probe that measures airspeed.
  const tip = useMemo(
    () =>
      cached("car17-nose-tip", () => {
        const s = NOSE[NOSE.length - 1];
        return {
          inlet: new CircleGeometry(7, 16).rotateY(Math.PI / 2).translate(s.x + 1.2, (s.top + s.bottom) / 2, 0),
          pitot: mergeAll([rod([NOSE[3].x, NOSE[3].top - 6, 0], [NOSE[3].x + 160, NOSE[3].top + 40, 0], 8), rod([NOSE[3].x + 150, NOSE[3].top + 37, 0], [NOSE[3].x + 230, NOSE[3].top + 37, 0], 6)]),
        };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={tip.inlet} material={mouthDark} />
      <mesh geometry={tip.pitot} material={CAR_MAT.steel} castShadow />
    </group>
  );
}

const mouthDark = new MeshStandardMaterial({ color: "#030304", roughness: 1, metalness: 0 });

/**
 * Titanium halo: a hoop round the driver's head on two rear mounts and a
 * central front pillar, under a slim aero fairing.
 */
export function Halo() {
  const geo = useMemo(
    () =>
      cached("car17-halo", () => {
        const right: V3[] = [
          [HALO.rearX, HALO.rearY - 8, HALO.rearZ],
          [HALO.rearX + 24, 786, HALO.rearZ + 2],
          [HALO.rearX + 108, 844, 252],
          [HALO.rearX + 268, HALO.hoopY, 210],
          [HALO.rearX + 452, 866, 118],
        ];
        const pts: V3[] = [...right, [HALO.frontX, HALO.hoopY, 0], ...right.slice().reverse().map(([x, y, z]) => [x, y, -z] as V3)];
        const curve = new CatmullRomCurve3(pts.map((p) => new Vector3(...p)), false, "centripetal");
        const hoop = new TubeGeometry(curve, 160, HALO.tube / 2, 18, false);
        const pillar = new CatmullRomCurve3(
          [
            [HALO.frontX - 30, HALO.hoopY, 0],
            [HALO.frontX + 70, HALO.hoopY - 22, 0],
            [HALO.pillarX - 50, 756, 0],
            [HALO.pillarX + 6, HALO.pillarY - 8, 0],
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
      cached("car17-halo-mounts", () => {
        // Rear mounting faces on Z = 695, raised on pads from the top of the tub.
        const m = roundedBox(70, 30, 60, 10).clone().translate(HALO.rearX + 6, HALO.rearY - 15, HALO.rearZ);
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

/** The roll structure must reach 968 mm above the reference plane; its front is the airbox. */
export const AIRBOX: Station[] = [
  { x: XC + 62, top: 974, bottom: 862, w: 72 },
  { x: XC + 40, top: 984, bottom: 836, w: 92 },
  { x: XC - 50, top: 988, bottom: 786, w: 110 },
  { x: XC - 170, top: 984, bottom: 736, w: 130 },
  { x: XC - 320, top: 976, bottom: 712, w: 148 },
];

/** Roll hoop and engine air intake above the driver's head. */
export function RollStructure() {
  const geo = useMemo(
    () =>
      cached("car17-airbox", () =>
        loft(
          AIRBOX.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 6, around: 3, capStart: true, capEnd: true },
        ),
      ),
    [],
  );
  const mouth = useMemo(
    () =>
      cached("car17-airbox-mouth", () => {
        const g = new CircleGeometry(1, 40);
        g.scale(58, 46, 1);
        g.rotateY(Math.PI / 2);
        g.translate(AIRBOX[0].x + 0.8, (AIRBOX[0].top + AIRBOX[0].bottom) / 2 + 2, 0);
        return g;
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow receiveShadow />
      <mesh geometry={mouth} material={mouthDark} />
      {/* ERS status light behind the T-camera: green when the car is safe to touch (C5.13.3). */}
      <mesh geometry={cached("car17-ers-light", () => new BoxGeometry(50, 10, 26))} material={glow("#38d46a", 1.8)} position={[XC - 200, 984, 0]} />
    </group>
  );
}

/** Kevlar-reinforced rubber fuel bladder between the cockpit and the engine. */
export function FuelCell() {
  const len = XC - XPU - 30;
  const cx = (XC + XPU) / 2;
  return (
    <group>
      <mesh geometry={roundedBox(len, 452, 520, 60)} material={fuelBag} position={[cx, 446, 0]} castShadow receiveShadow />
      {/* Fuel filler and breather on top. */}
      <mesh geometry={cached("car17-filler", () => new CylinderGeometry(34, 34, 30, 24))} material={CAR_MAT.aluminium} position={[cx - 120, 686, 150]} />
      <mesh geometry={cached("car17-breather", () => new CylinderGeometry(14, 14, 40, 16))} material={CAR_MAT.aluminium} position={[cx + 140, 690, -120]} />
    </group>
  );
}

const fuelBag = paintColour("fuelBag", "#4f4c45", { roughness: 0.82, clearcoat: 0, metalness: 0 });

/** Carbon seat moulded to the driver, reclined low in the tub. */
export function Seat() {
  const geo = useMemo(
    () =>
      cached("car17-seat", () => {
        const base = roundedBox(380, 30, 390, 12).clone().rotateZ(-0.12).translate(400, 154, 0);
        const back = roundedBox(30, 420, 420, 12).clone().rotateZ(0.62).translate(170, 386, 0);
        const sideL = roundedBox(560, 120, 26, 10).clone().rotateZ(-0.5).translate(300, 296, 200);
        const sideR = sideL.clone().translate(0, 0, -400);
        return mergeAll([base, back, sideL, sideR]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** A webbing strap between two points (75 mm wide, lying across `flat`). */
function strap(a: V3, b: V3, flat: V3 = [0, 0, 1], width = 75) {
  return new BoxGeometry(1, 1, 1).applyMatrix4(memberMatrix(a, b, width, 3, flat));
}

/** Six-point harness: shoulder, lap and crotch straps meeting at a quick-release buckle. */
export function Harness() {
  const parts = useMemo(
    () =>
      cached("car17-harness", () => {
        const buckle: V3 = [412, 232, 0];
        const straps: BufferGeometry[] = [];
        for (const s of [1, -1]) {
          // Shoulder straps: from the anchor behind the seat, over the shoulder, down the chest.
          straps.push(strap([70, 586, s * 70], [160, 556, s * 84], [0, 0, 1]), strap([160, 556, s * 84], buckle.map((v, i) => (i === 2 ? s * 40 : i === 1 ? v + 18 : v - 30)) as V3, [0, 0, 1]));
          // Lap straps: from the tub sides to the buckle.
          straps.push(strap([340, 164, s * 205], [buckle[0], buckle[1] - 6, s * 34], [1, 0, 0], 70));
          // Crotch straps.
          straps.push(strap([490, 154, s * 40], [buckle[0] + 10, buckle[1] - 20, s * 16], [0, 0, 1], 44));
        }
        return { straps: mergeAll(straps), buckle: new CylinderGeometry(40, 40, 16, 24).rotateZ(Math.PI / 2 - 0.5).translate(...buckle) };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.straps} material={webbing} castShadow />
      <mesh geometry={parts.buckle} material={CAR_MAT.aluminium} castShadow />
    </group>
  );
}

const webbing = paintColour("webbing", "#2a2c30", { roughness: 0.92, clearcoat: 0, metalness: 0 });

let dashTex: CanvasTexture | null = null;
function dashTexture() {
  if (dashTex) return dashTex;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#020305";
  g.fillRect(0, 0, 512, 256);
  // Shift lights.
  for (let i = 0; i < 15; i++) {
    g.fillStyle = "#3a3f46";
    g.beginPath();
    g.arc(36 + i * 31, 26, 10, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#e6e9ec";
  g.font = `700 150px ${FONT_SANS}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("7", 256, 150);
  g.font = `500 30px ${FONT_MONO}`;
  g.fillStyle = "#c4cbd3";
  g.textAlign = "left";
  g.fillText("-0.214", 22, 112);
  g.fillText("SOC 4.0", 22, 160);
  g.fillText("L 23", 22, 204);
  g.textAlign = "right";
  g.fillText("CORNER", 490, 112);
  g.fillText("BB 57.5", 490, 160);
  g.fillText("298", 490, 204);
  dashTex = new CanvasTexture(c);
  dashTex.colorSpace = SRGBColorSpace;
  return dashTex;
}

/** Steering wheel position: at least 50 mm behind the cockpit opening's front edge (C12.5.3). */
const WHEEL_X = COCKPIT.front - 60;

/** Carbon steering wheel with display, switches and shift paddles. */
export function SteeringWheel() {
  const body = useMemo(
    () =>
      cached("car17-wheel-body", () => {
        const core = roundedBox(42, 128, 236, 18);
        const gripL = roundedBox(46, 150, 46, 20).clone().translate(-4, -8, 128);
        const gripR = gripL.clone().translate(0, 0, -256);
        return mergeAll([core, gripL.clone().rotateX(0.08), gripR.clone().rotateX(-0.08)]);
      }),
    [],
  );
  const grips = useMemo(
    () =>
      cached("car17-wheel-grips", () => {
        const g = roundedBox(52, 118, 52, 22).clone().translate(-4, -8, 130);
        return mergeAll([g, g.clone().translate(0, 0, -260)]);
      }),
    [],
  );
  const paddles = useMemo(
    () =>
      cached("car17-wheel-paddles", () => {
        const p = roundedBox(8, 70, 64, 3).clone().translate(30, 6, 70);
        return mergeAll([p, p.clone().translate(0, 0, -140), p.clone().translate(0, -62, 0), p.clone().translate(0, -62, -140)]);
      }),
    [],
  );
  const knobs = useMemo(
    () =>
      cached("car17-wheel-knobs", () => {
        const k = new CylinderGeometry(9, 9, 14, 16).rotateZ(Math.PI / 2);
        const parts = [];
        for (const [y, z] of [
          [-36, 62],
          [-36, -62],
          [-48, 24],
          [-48, -24],
        ])
          parts.push(k.clone().translate(-26, y, z));
        const b = new CylinderGeometry(6, 6, 6, 14).rotateZ(Math.PI / 2);
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
    const m = glow("#ffffff", 1.1).clone();
    m.color.set("#000000");
    m.emissiveMap = dashTexture();
    return m;
  }, []);
  return (
    <group position={[WHEEL_X, 560, 0]} rotation={[0, 0, -0.32]}>
      <mesh geometry={body} material={CAR_MAT.carbon} castShadow />
      <mesh geometry={grips} material={CAR_MAT.rubberGrip} castShadow />
      <mesh geometry={paddles} material={CAR_MAT.composite} castShadow />
      <mesh geometry={knobs} material={CAR_MAT.aluminiumCast} />
      <mesh geometry={screen} material={screenMat} position={[-21.6, 18, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Steering column with its quick-release hub. */}
      <mesh geometry={cached("car17-column", () => mergeAll([rod([20, 0, 0], [300, -40, 0], 26), new CylinderGeometry(30, 30, 18, 24).rotateZ(Math.PI / 2).translate(36, -2, 0)]))} material={CAR_MAT.steel} />
    </group>
  );
}

/** Brake and throttle pedals in the footwell, no further forward than 315 mm behind XA (C12.5.5). */
export function Pedals() {
  const parts = useMemo(
    () =>
      cached("car17-pedals", () => {
        const face = XA - 330;
        const pedal = (z: number, w: number) =>
          mergeAll([
            roundedBox(12, 120, w, 4).clone().rotateZ(0.35).translate(face, 330, z),
            rod([face + 10, 270, z], [face + 60, 230, z], 16),
            ball([face + 60, 230, z], 22),
          ]);
        const brake = pedal(-48, 84);
        const throttle = pedal(52, 62);
        // Twin brake master cylinders (front and rear circuits) and the throttle sensor.
        const cylinders = mergeAll([
          new CylinderGeometry(15, 15, 110, 16).rotateZ(Math.PI / 2).translate(face + 120, 352, -70),
          new CylinderGeometry(15, 15, 110, 16).rotateZ(Math.PI / 2).translate(face + 120, 352, -26),
          new CylinderGeometry(20, 20, 40, 16).translate(face + 90, 240, 52),
        ]);
        const base = roundedBox(150, 14, 230, 4).clone().translate(face + 60, 214, 0);
        return { pedals: mergeAll([brake, throttle]), cylinders, base };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.pedals} material={CAR_MAT.titanium} castShadow />
      <mesh geometry={parts.cylinders} material={CAR_MAT.anodisedDark} castShadow />
      <mesh geometry={parts.base} material={CAR_MAT.carbonSatin} castShadow />
    </group>
  );
}

/** Fire extinguisher bottle under the driver's knees, with nozzles into the cockpit (C14.1). */
export function Extinguisher() {
  const parts = useMemo(
    () =>
      cached("car17-extinguisher", () => ({
        bottle: mergeAll([
          new CylinderGeometry(52, 52, 220, 28).rotateZ(Math.PI / 2).translate(1220, 190, 0),
          new SphereGeometry(52, 24, 12).translate(1330, 190, 0),
          new SphereGeometry(52, 24, 12).translate(1110, 190, 0),
        ]),
        valve: mergeAll([roundedBox(50, 40, 40, 8).clone().translate(1090, 252, 0), new CylinderGeometry(9, 9, 30, 12).translate(1090, 282, 0)]),
        lines: mergeAll([
          pipe(
            [
              [1090, 290, 0],
              [960, 320, 120],
              [560, 260, 200],
            ],
            5,
            30,
          ),
          pipe(
            [
              [1090, 290, 0],
              [960, 330, -120],
              [560, 260, -200],
            ],
            5,
            30,
          ),
        ]),
      })),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.bottle} material={extinguisherRed} castShadow receiveShadow />
      <mesh geometry={parts.valve} material={CAR_MAT.aluminium} castShadow />
      <mesh geometry={parts.lines} material={CAR_MAT.braided} />
    </group>
  );
}

const extinguisherRed = paintColour("extinguisher", "#8f1d1d", { roughness: 0.4, clearcoat: 0.5 });

/**
 * Lights the FIA requires in and on the cockpit: the red, blue and yellow
 * track-signal lights in the driver's line of sight (C8.12), and the impact
 * warning light recessed into the top of the survival cell (C8.13).
 */
export function CockpitLights() {
  const parts = useMemo(
    () =>
      cached("car17-cockpit-lights", () => ({
        panel: roundedBox(30, 26, 130, 6).clone().translate(COCKPIT.front - 6, 664, 0),
        red: new BoxGeometry(4, 12, 30).translate(COCKPIT.front - 21.5, 666, -42),
        blue: new BoxGeometry(4, 12, 30).translate(COCKPIT.front - 21.5, 666, 0),
        yellow: new BoxGeometry(4, 12, 30).translate(COCKPIT.front - 21.5, 666, 42),
        warning: new CylinderGeometry(18, 22, 8, 24).translate(1100, tubTop(1100) + 1, 0),
      })),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.panel} material={CAR_MAT.composite} />
      <mesh geometry={parts.red} material={glow("#ff2a2a", 1.6)} />
      <mesh geometry={parts.blue} material={glow("#2f6bff", 1.6)} />
      <mesh geometry={parts.yellow} material={glow("#ffc52a", 1.6)} />
      <mesh geometry={parts.warning} material={CAR_MAT.lens} />
    </group>
  );
}

/** The FIA high-speed camera at the front of the cockpit, aimed at the driver for accident analysis (C8.9.3). */
export function HighSpeedCamera() {
  return (
    <group position={[COCKPIT.front - 26, 640, -150]} rotation={[0, 0, -0.35]}>
      <mesh geometry={cached("car17-hs-camera", () => roundedBox(40, 34, 30, 6))} material={CAR_MAT.camera} castShadow />
      <mesh geometry={cached("car17-hs-lens", () => new CircleGeometry(8, 16).rotateY(-Math.PI / 2))} material={CAR_MAT.lens} position={[-20.5, 0, 0]} />
    </group>
  );
}

/** Energy-absorbing foam pads round the cockpit opening (three areas, removable as one). */
export function Headrest() {
  const geo = useMemo(
    () =>
      cached("car17-headrest", () => {
        const back = roundedBox(86, 120, 360, 34).clone().translate(COCKPIT.rear + 40, 738, 0);
        const side = roundedBox(360, 96, 72, 30).clone().translate(COCKPIT.rear + 250, 728, COCKPIT.halfWidth - 6);
        return mergeAll([back, side, mirrorZ(side)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.foam} castShadow receiveShadow />;
}

/**
 * Mirror housing (right side): a box 160 mm wide, 80 mm tall and 75 mm deep
 * whose rear face is turned 65° to the centre line, its inner lower rear
 * corner 605–730 mm ahead of C-C, 420–470 mm out and Z = 600–640 (14.3.3).
 */
const MIRROR = { x: 650, y: 695, z: 525 };
/** Sweep of the housing: its outer end sits about 75 mm further back. */
const MIRROR_SWEEP = -Math.atan2(75, 160);

/**
 * Rear-view mirror (right side; the model mirrors it): a 200 × 50 mm glass
 * canted 26° towards the car, on an inner stay to the chassis and a slim rear stay to the sidepod.
 */
export function Mirrors() {
  const geo = useMemo(
    () =>
      cached("car17-mirrors", () =>
        mergeAll([
          roundedBox(75, 78, 160, 22).clone().rotateY(MIRROR_SWEEP).translate(MIRROR.x, MIRROR.y, MIRROR.z),
          foilMember([MIRROR.x + 24, MIRROR.y - 24, MIRROR.z - 70], [MIRROR.x + 30, 650, 340], 48, 14),
          foilMember([MIRROR.x - 30, MIRROR.y - 30, MIRROR.z + 40], [520, 622, 548], 40, 9),
        ]),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={bodyPaint()} castShadow />
      <mesh geometry={mirrorGlass} material={CAR_MAT.mirror} position={[MIRROR.x - 38.2 * Math.cos(MIRROR_SWEEP), MIRROR.y, MIRROR.z + 38.2 * Math.sin(MIRROR_SWEEP)]} rotation={[0, -Math.PI / 2 - (26 * Math.PI) / 180, 0]} />
    </group>
  );
}

const mirrorGlass = new PlaneGeometry(150, 50);

/** Crash tubes inside the sidepod that protect the driver from side impacts (right side). */
export function SideImpact() {
  const geo = useMemo(
    () =>
      cached("car17-sis", () => {
        // Upper at Z = 400–520 and lower at Z = 70–190, 500 ± 25 mm ahead of C-C (15.5.2).
        const upper = rod([XC + 500, Z(460), 300], [XC + 500, Z(460), 548], 90);
        const lower = rod([XC + 490, Z(130), 300], [XC + 490, Z(130), 396], 84);
        return mergeAll([upper, lower]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />;
}

/** One camera pod: a rounded body with a lens on its front (or rear) face. */
function pod(x: number, y: number, z: number, len = 80, w = 36, h = 34) {
  return roundedBox(len, h, w, 12).clone().translate(x, y, z);
}

/**
 * On-board cameras in the FIA positions (C8.16): 1 facing the driver on top
 * of the tub; 2 on the nose sides (a camera on the left, a dummy housing on
 * the right); 3 on the airbox sides; 4 the T-camera on the roll hoop; 5 the
 * 360° camera on the forward chassis. Each moves with the part it sits on.
 */
export function Cameras({ nose, airbox }: { nose: { explode: V3; range: [number, number] }; airbox: { explode: V3; range: [number, number] } }) {
  const g = useMemo(
    () =>
      cached("car17-cameras", () => {
        const p2 = mergeAll([foilMember([2420, 474, 92], [2420, 474, 146], 46, 14), pod(2420, 474, 160)]);
        const p3 = mergeAll([pod(AIRBOX[2].x - 30, 912, 152, 110, 40, 30), mirrorZ(pod(AIRBOX[2].x - 30, 912, 152, 110, 40, 30))]);
        const p4 = mergeAll([foilMember([XC - 40, 986, 0], [XC - 40, 1026, 0], 120, 26), roundedBox(150, 26, 72, 10).clone().translate(XC - 46, 1036, 0)]);
        const p1 = pod(COCKPIT.front + 12, tubTop(COCKPIT.front) + 22, 0, 46, 40, 30);
        const p5 = mergeAll([foilMember([1380, tubTop(1380) - 4, 0], [1380, tubTop(1380) + 40, 0], 70, 20), new SphereGeometry(26, 24, 16).translate(1380, tubTop(1380) + 58, 0)]);
        return { chassis: mergeAll([p1, p5]), nose: mergeAll([p2, mirrorZ(p2)]), airbox: mergeAll([p3, p4]) };
      }),
    [],
  );
  const lens = useMemo(() => new CircleGeometry(9, 20), []);
  return (
    <group>
      <mesh geometry={g.chassis} material={CAR_MAT.camera} castShadow />
      <mesh geometry={lens} material={CAR_MAT.lens} position={[COCKPIT.front + 12 - 23.6, tubTop(COCKPIT.front) + 22, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Shift explode={nose.explode} explodeRange={nose.range}>
        <mesh geometry={g.nose} material={CAR_MAT.camera} castShadow />
        {[1, -1].map((s) => (
          <mesh key={s} geometry={lens} material={CAR_MAT.lens} position={[2460.6, 474, 160 * s]} rotation={[0, Math.PI / 2, 0]} />
        ))}
      </Shift>
      <Shift explode={airbox.explode} explodeRange={airbox.range}>
        <mesh geometry={g.airbox} material={CAR_MAT.camera} castShadow />
        {[1, -1].map((s) => (
          <mesh key={s} geometry={lens} material={CAR_MAT.lens} position={[AIRBOX[2].x - 30 + 55.6, 912, 152 * s]} rotation={[0, Math.PI / 2, 0]} />
        ))}
      </Shift>
    </group>
  );
}

/** The two timing transponders (C8.15), low in the forward chassis. */
export function Transponders() {
  const geo = useMemo(
    () => cached("car17-transponders", () => mergeAll([roundedBox(70, 26, 44, 6).clone().translate(1520, 214, 62), roundedBox(70, 26, 44, 6).clone().translate(1520, 214, -62)])),
    [],
  );
  return <mesh geometry={geo} material={paintColour("transponder", "#1f3b63", { roughness: 0.5, clearcoat: 0.3 })} castShadow />;
}

/** Tungsten ballast plates bolted low in the survival cell floor to reach the minimum mass (C4.3). */
export function Ballast() {
  const geo = useMemo(
    () => cached("car17-ballast", () => mergeAll([roundedBox(260, 14, 200, 3).clone().translate(700, 78, 0), roundedBox(180, 14, 160, 3).clone().translate(1150, 108, 0)])),
    [],
  );
  return <mesh geometry={geo} material={paintColour("tungsten", "#6e7176", { roughness: 0.42, metalness: 0.9, clearcoat: 0 })} castShadow />;
}

/** Accident data recorder: bolted to the floor of the survival cell near the centre of gravity. */
export function AccidentRecorder() {
  return (
    <group>
      <mesh geometry={cached("car17-adr", () => roundedBox(130, 44, 90, 6))} material={paintColour("adr", "#3a3d42", { roughness: 0.5, metalness: 0.5 })} position={[290, 92, 0]} castShadow />
      <mesh geometry={cached("car17-adr-plug", () => new CylinderGeometry(10, 10, 20, 12).rotateZ(Math.PI / 2))} material={CAR_MAT.aluminium} position={[362, 96, 20]} />
    </group>
  );
}
