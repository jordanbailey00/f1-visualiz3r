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
import { COCKPIT, ENGINE_MOUNTS, NOSE, TUB, XA, XC, XPU, Z } from "./layout";
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
  // Above Z = 600 the car must stay inside ±300 mm (3.8.1), so the tub's shoulders slope in below that.
  const r = Math.min(w - 46, 288);
  const outer: [number, number][] = [
    [top - 9, r],
    [Math.min(top - 40, Z(596)), Math.min(w - 8, 298)],
    [bottom + h * 0.42, w],
    [bottom + 42, w - 16],
    [bottom + 5, w - 64],
    [bottom, (w - 64) * 0.45],
    [bottom, 0],
  ];
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
      cached("car06-tub", () => {
        const xs = new Set<number>(TUB.map((s) => s.x));
        for (const edge of [COCKPIT.front + 26, COCKPIT.rear - 26])
          for (const d of [0, 12, 24, 36, 46, 70]) xs.add(edge > 0 ? edge - d : edge + d);
        const list = [...xs].sort((a, b) => b - a);
        const rings = list.map((x) => mirrorRing(x, tubHalf(stationAt(TUB, x), cockpitDepth(x))));
        return loft(rings, { along: 6, around: 3, capStart: true, capEnd: true });
      }),
    [],
  );
  // Studs on the rear bulkhead take the engine.
  const studs = useMemo(
    () =>
      cached("car06-tub-studs", () => {
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

/** The front impact structure, from the survival cell's forward face to the wing pylons. */
export function NoseCone() {
  const geo = useMemo(
    () =>
      cached("car06-nose", () => {
        const stations = [{ ...NOSE[0], x: NOSE[0].x - 10, top: NOSE[0].top - 2, bottom: NOSE[0].bottom + 2, w: NOSE[0].w - 3 }, ...NOSE.slice(1)];
        return loft(
          stations.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 8, around: 3, capStart: true, capEnd: true },
        );
      }),
    [],
  );
  // The driver-cooling inlet at the tip (3.7) and the pitot probe that measures airspeed.
  const tip = useMemo(
    () =>
      cached("car06-nose-tip", () => {
        const s = NOSE[NOSE.length - 1];
        return {
          inlet: new CircleGeometry(7, 16).rotateY(Math.PI / 2).translate(s.x + 1.2, (s.top + s.bottom) / 2, 0),
          pitot: mergeAll([rod([NOSE[3].x, NOSE[3].top - 6, 0], [NOSE[3].x + 80, NOSE[3].top + 34, 0], 8), rod([NOSE[3].x + 70, NOSE[3].top + 31, 0], [NOSE[3].x + 140, NOSE[3].top + 31, 0], 6)]),
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

/** The roll structure must reach 940 mm above the reference plane, 30 mm behind C-C (15.2.1); its front is the airbox. */
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
      cached("car06-airbox", () =>
        loft(
          AIRBOX.map((s) => mirrorRing(s.x, noseHalf(s))),
          { along: 6, around: 3, capStart: true, capEnd: true },
        ),
      ),
    [],
  );
  const mouth = useMemo(
    () =>
      cached("car06-airbox-mouth", () => {
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
    </group>
  );
}

/** Kevlar-reinforced rubber fuel bladder between the cockpit and the engine (6.1), far smaller than a car that must carry a whole race's fuel. */
export function FuelCell() {
  const len = XC - XPU - 30;
  const cx = (XC + XPU) / 2;
  return (
    <group>
      <mesh geometry={roundedBox(len, 490, 600, 60)} material={fuelBag} position={[cx, 440, 0]} castShadow receiveShadow />
      {/* Breather on top. */}
      <mesh geometry={cached("car06-breather", () => new CylinderGeometry(14, 14, 40, 16))} material={CAR_MAT.aluminium} position={[cx + 140, 690, -120]} />
    </group>
  );
}

const fuelBag = paintColour("fuelBag", "#4f4c45", { roughness: 0.82, clearcoat: 0, metalness: 0 });

/**
 * The refuelling connector on the right of the tub, behind the cockpit, under
 * the cover that must close it whenever the car is on track (6.5.2). The rig
 * delivered up to 12.1 litres a second (6.5.1).
 */
export function Refuelling() {
  const parts = useMemo(
    () =>
      cached("car06-refuelling", () => {
        const x = -210;
        const z = 236;
        const y = tubTop(x) - 6;
        return {
          flap: roundedBox(150, 5, 104, 2).clone().rotateX(-0.09).translate(x, y + 1, z),
          hinge: rod([x + 78, y, z - 46], [x + 78, y, z + 46], 8),
          connector: mergeAll([new CylinderGeometry(44, 44, 26, 28).translate(x, y - 16, z), new CylinderGeometry(30, 34, 70, 24).translate(x, y - 64, z)]),
        };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={parts.flap} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={parts.hinge} material={CAR_MAT.titanium} castShadow />
      <mesh geometry={parts.connector} material={CAR_MAT.aluminium} castShadow />
    </group>
  );
}

/** Carbon seat moulded to the driver, reclined low in the tub. */
export function Seat() {
  const geo = useMemo(
    () =>
      cached("car06-seat", () => {
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
      cached("car06-harness", () => {
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
  g.fillText("FUEL 41", 22, 160);
  g.fillText("L 23", 22, 204);
  g.textAlign = "right";
  g.fillText("CORNER", 490, 112);
  g.fillText("BB 57.5", 490, 160);
  g.fillText("298", 490, 204);
  dashTex = new CanvasTexture(c);
  dashTex.colorSpace = SRGBColorSpace;
  return dashTex;
}

/** Steering wheel position: at least 50 mm behind the cockpit opening's front edge (13.1.2). */
const WHEEL_X = COCKPIT.front - 60;

/** Carbon steering wheel with display, switches and shift paddles. */
export function SteeringWheel() {
  const body = useMemo(
    () =>
      cached("car06-wheel-body", () => {
        const core = roundedBox(42, 128, 236, 18);
        const gripL = roundedBox(46, 150, 46, 20).clone().translate(-4, -8, 128);
        const gripR = gripL.clone().translate(0, 0, -256);
        return mergeAll([core, gripL.clone().rotateX(0.08), gripR.clone().rotateX(-0.08)]);
      }),
    [],
  );
  const grips = useMemo(
    () =>
      cached("car06-wheel-grips", () => {
        const g = roundedBox(52, 118, 52, 22).clone().translate(-4, -8, 130);
        return mergeAll([g, g.clone().translate(0, 0, -260)]);
      }),
    [],
  );
  const paddles = useMemo(
    () =>
      cached("car06-wheel-paddles", () => {
        const p = roundedBox(8, 70, 64, 3).clone().translate(30, 6, 70);
        return mergeAll([p, p.clone().translate(0, 0, -140), p.clone().translate(0, -62, 0), p.clone().translate(0, -62, -140)]);
      }),
    [],
  );
  const knobs = useMemo(
    () =>
      cached("car06-wheel-knobs", () => {
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
      <mesh geometry={cached("car06-column", () => mergeAll([rod([20, 0, 0], [300, -40, 0], 26), new CylinderGeometry(30, 30, 18, 24).rotateZ(Math.PI / 2).translate(36, -2, 0)]))} material={CAR_MAT.steel} />
    </group>
  );
}

/** Brake and throttle pedals in the footwell, the driver's soles behind the front axle (13.4.2). */
export function Pedals() {
  const parts = useMemo(
    () =>
      cached("car06-pedals", () => {
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

/** Fire extinguisher bottle under the driver's knees, with nozzles into the cockpit (14.1). */
export function Extinguisher() {
  const parts = useMemo(
    () =>
      cached("car06-extinguisher", () => ({
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
 * track-signal lights in the driver's line of sight (8.9), and the medical
 * warning light on top of the survival cell.
 */
export function CockpitLights() {
  const parts = useMemo(
    () =>
      cached("car06-cockpit-lights", () => ({
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

/** Energy-absorbing foam pads round the cockpit opening (three areas, removable as one). */
export function Headrest() {
  const geo = useMemo(
    () =>
      cached("car06-headrest", () => {
        const back = roundedBox(86, 120, 360, 34).clone().translate(COCKPIT.rear + 40, 738, 0);
        const side = roundedBox(360, 96, 72, 30).clone().translate(COCKPIT.rear + 250, 728, COCKPIT.halfWidth - 6);
        return mergeAll([back, side, mirrorZ(side)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.foam} castShadow receiveShadow />;
}

/**
 * Mirror (right side): its glass at least 250 mm from the centre line and no
 * more than 750 mm ahead of C-C (14.3.3), each no more than 12,000 mm² seen
 * from above (3.8.1).
 */
const MIRROR = { x: 650, y: 700, z: 420 };
/** A slight sweep: the outer end sits a little further back. */
const MIRROR_SWEEP = -0.2;

/**
 * Rear-view mirror (right side; the model mirrors it): a 200 × 50 mm glass
 * canted 26° towards the car, on an inner stay to the chassis and a slim rear stay to the sidepod.
 */
export function Mirrors() {
  const geo = useMemo(
    () =>
      cached("car06-mirrors", () =>
        mergeAll([
          roundedBox(75, 72, 152, 22).clone().rotateY(MIRROR_SWEEP).translate(MIRROR.x, MIRROR.y, MIRROR.z),
          foilMember([MIRROR.x + 10, MIRROR.y - 26, MIRROR.z - 50], [MIRROR.x + 20, 640, 330], 46, 14),
          foilMember([MIRROR.x - 20, MIRROR.y - 30, MIRROR.z + 40], [560, 634, 470], 40, 9),
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

/** The crash structure inside the sidepod that protects the driver from side impacts (right side). */
export function SideImpact() {
  const geo = useMemo(
    () =>
      cached("car06-sis", () => {
        // One structure each side, kept inside the pod above the undercut; the test strikes it near Z = 300, around 500 mm ahead of C-C.
        return roundedBox(150, 110, 160, 36).clone().translate(XC + 465, Z(335), 376);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />;
}

/** Where the camera pods sit on the sides of the nose. */
const CAM_X = 2300;
const CAM_Y = 450;

/** One camera pod: a rounded body with a lens on its front (or rear) face. */
function pod(x: number, y: number, z: number, len = 80, w = 36, h = 34) {
  return roundedBox(len, h, w, 12).clone().translate(x, y, z);
}

/**
 * On-board cameras in the five FIA positions (20.3): on top of the tub, on the
 * nose sides, on the airbox sides, the T-camera on the roll hoop, and on the
 * forward chassis. Each moves with the part it sits on.
 */
export function Cameras({ nose, airbox }: { nose: { explode: V3; range: [number, number] }; airbox: { explode: V3; range: [number, number] } }) {
  const g = useMemo(
    () =>
      cached("car06-cameras", () => {
        const p2 = mergeAll([foilMember([CAM_X, CAM_Y, 86], [CAM_X, CAM_Y, 126], 46, 14), pod(CAM_X, CAM_Y, 140)]);
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
          <mesh key={s} geometry={lens} material={CAR_MAT.lens} position={[CAM_X + 40.6, CAM_Y, 140 * s]} rotation={[0, Math.PI / 2, 0]} />
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

/** The timing transponder (20.4), low in the forward chassis. */
export function Transponders() {
  const geo = useMemo(() => cached("car06-transponders", () => roundedBox(70, 26, 44, 6).clone().translate(1520, 214, 0)), []);
  return <mesh geometry={geo} material={paintColour("transponder", "#1f3b63", { roughness: 0.5, clearcoat: 0.3 })} castShadow />;
}

/** Tungsten ballast plates bolted low in the survival cell floor to reach the minimum mass (4.2). */
export function Ballast() {
  const geo = useMemo(
    () => cached("car06-ballast", () => mergeAll([roundedBox(260, 14, 200, 3).clone().translate(700, 78, 0), roundedBox(180, 14, 160, 3).clone().translate(1150, 108, 0)])),
    [],
  );
  return <mesh geometry={geo} material={paintColour("tungsten", "#6e7176", { roughness: 0.42, metalness: 0.9, clearcoat: 0 })} castShadow />;
}

/** Accident data recorder: bolted to the floor of the survival cell near the centre of gravity. */
export function AccidentRecorder() {
  return (
    <group>
      <mesh geometry={cached("car06-adr", () => roundedBox(130, 44, 90, 6))} material={paintColour("adr", "#3a3d42", { roughness: 0.5, metalness: 0.5 })} position={[290, 92, 0]} castShadow />
      <mesh geometry={cached("car06-adr-plug", () => new CylinderGeometry(10, 10, 20, 12).rotateZ(Math.PI / 2))} material={CAR_MAT.aluminium} position={[362, 96, 20]} />
    </group>
  );
}
