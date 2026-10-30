"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry } from "three";
import { AeroPivot } from "../../Part";
import { CAR_MAT, glow } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingAlongPath, wingElement, type PathStation, type WingStation } from "../../kit/wing";
import { BEAM_WING, CRASH, FRONT_WING, REAR_WING, TAILPIPE, XF, XR, Z } from "./layout";

/** Highly cambered, inverted sections (the suction side faces the ground). */
const MAIN = naca(0.075, 0.38, 0.085);
const FLAP = naca(0.09, 0.42, 0.075);
const GURNEY = naca(0, 0.5, 0.3, 8, false);

function gurney(stations: WingStation[]) {
  return wingElement(
    GURNEY,
    stations.map((s) => ({ ...s, x: s.x - s.chord * Math.cos(s.angle) + 4, y: s.y + s.chord * Math.sin(s.angle) - 2, chord: 12, angle: 1.35 })),
    4,
  );
}

/** Linear interpolation in a table of [key, value] rows sorted by key. */
function lerpTable(table: [number, number][], k: number) {
  if (k <= table[0][0]) return table[0][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [k0, v0] = table[i];
    const [k1, v1] = table[i + 1];
    if (k <= k1) return v0 + ((k - k0) / (k1 - k0)) * (v1 - v0);
  }
  return table[table.length - 1][1];
}

// ---------------------------------------------------------------------------
// Front wing (3.9, §21): four elements in a swept planform. The stack is low
// in the middle under the nose, highest across the mid-span and drops again
// into the foot of the flat endplate.

/** Leading edge of the stack at half-span z. */
const fwLE = (z: number) => FRONT_WING.leadingEdge - FRONT_WING.sweep * z;
/** Rearmost point of the stack: 800 mm ahead of the axle in the middle, 550 at ±350, 475 at ±900. */
const fwTE = (z: number) =>
  XF +
  6 +
  lerpTable(
    [
      [0, 800],
      [350, 550],
      [900, 475],
    ],
    z,
  );
/** Height (Z) of the mainplane leading edge, and the top of the stack, under the 280/315/200 mm ceiling. */
const FW_LOW: [number, number][] = [
  [0, 122],
  [300, 117],
  [600, 109],
  [860, 102],
  [902, 101],
];
const FW_TOP: [number, number][] = [
  [0, 268],
  [160, 290],
  [300, 304],
  [450, 306],
  [600, 300],
  [750, 262],
  [860, 214],
  [902, 192],
];
/** Each element: where its leading edge sits along the stack's depth (0–1), and its share of the depth. */
const FW_CASCADE: { at: number; share: number }[] = [
  { at: 0, share: 0.46 },
  { at: 0.41, share: 0.27 },
  { at: 0.63, share: 0.22 },
  { at: 0.79, share: 0.2 },
];
const FW_SPAN = [0, 160, 300, 450, 600, 750, 860, FRONT_WING.half];

/** Stations of element k across the right half-span. */
function frontStations(k: number): WingStation[] {
  const e = FW_CASCADE[k];
  return FW_SPAN.map((z) => {
    const le = fwLE(z);
    const depth = le - fwTE(z);
    const low = lerpTable(FW_LOW, z);
    // The cascade curves upward: each element steeper than the one ahead.
    const rise = lerpTable(FW_TOP, z) - 30 - low;
    const h = (t: number) => low + rise * Math.pow(t, 2.2) + 10 * k;
    const run = e.share * depth;
    const angle = Math.atan2(h(e.at + e.share) - h(e.at), run);
    return { z, x: le - e.at * depth, y: Z(h(e.at)), chord: run / Math.cos(angle), angle };
  });
}

export function FrontMainplane() {
  const geo = useMemo(
    () =>
      cached("car22-fw-main", () => {
        // Two short pylons under the nose tip.
        const p = plate(
          smoothOutline([
            [3052, Z(126)],
            [2950, Z(138)],
            [2950, 188],
            [3046, 186],
          ]),
          14,
          40,
        );
        return mergeAll([wingElement(MAIN, fullSpan(frontStations(0)), 6), p, mirrorZ(p)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The three flaps; the top two can be adjusted at a pit stop to trim the balance. */
export function FrontFlaps() {
  const geo = useMemo(
    () =>
      cached("car22-fw-flaps", () => {
        const flaps = [1, 2, 3].map((k) => fullSpan(frontStations(k)));
        return mergeAll([...flaps.map((s) => wingElement(FLAP, s, 6)), gurney(flaps[2])]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Front wing endplate (right side): an almost flat plate at ±903 mm reaching
 * up to Z = 470 (§23), with the tip plate along its foot and a diveplane on
 * its outer face (§22).
 */
export function FrontEndplates() {
  const geo = useMemo(
    () =>
      cached("car22-fw-endplates", () => {
        const { inner, thick } = FRONT_WING.endplate;
        const ep = plate(
          smoothOutline(
            [
              [XF + 996, Z(102)],
              [XF + 978, Z(200)],
              [XF + 830, Z(462)],
              [XF + 700, Z(472)],
              [XF + 514, Z(474)],
              [XF + 482, Z(440)],
              [XF + 478, Z(140)],
              [XF + 520, Z(101)],
            ],
            6,
          ),
          thick,
          inner + thick / 2,
        );
        // Tip plate: the foot that turns outboard to the 975 mm limit.
        const tip = plate(
          smoothOutline(
            [
              [XF + 990, inner],
              [XF + 960, 972],
              [XF + 540, 972],
              [XF + 500, inner],
            ],
            4,
          ),
          8,
          0,
        );
        tip.rotateX(Math.PI / 2);
        tip.translate(0, Z(104), 0);
        // Diveplane: a small wing on the outer face, rising at least 75 mm front to rear.
        const dive = wingElement(
          FLAP,
          [
            { z: inner + thick, x: XF + 900, y: Z(218), chord: 300, angle: 0.3 },
            { z: 994, x: XF + 890, y: Z(222), chord: 290, angle: 0.3 },
          ],
          2,
        );
        return mergeAll([ep, tip, dive]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The manual adjusters on the top flaps (turned with a tool on the stationary car; 3.9.7). */
export function FrontAdjusters() {
  const geo = useMemo(
    () =>
      cached("car22-fw-adjusters", () => {
        // On the top flap, just inboard of the endplate.
        const s = frontStations(3)[6];
        const x = s.x - s.chord * 0.3 * Math.cos(s.angle);
        const y = s.y + s.chord * 0.3 * Math.sin(s.angle);
        const one = mergeAll([roundedBox(54, 30, 22, 6).clone().translate(x, y + 18, s.z - 30), rod([x, y + 30, s.z - 30], [x, y + 46, s.z - 30], 9)]);
        return mergeAll([one, mirrorZ(one)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

// ---------------------------------------------------------------------------
// Rear wing (3.10, §27–29): the mainplane and DRS flap span ±478 mm. The
// mainplane's tips roll up, out and down (to ±612 mm); below them the
// endplates lean in to their feet at Z = 330 and reach back 676 mm behind
// the axle. A two-element beam wing sits low behind the diffuser.

const RW_LE = REAR_WING.leadingEdge;

const RW_MAIN: PathStation[] = (() => {
  const y0 = REAR_WING.bottom + 6;
  const tip = (z: number, zm: number, chord: number, angle: number) => ({ z, x: RW_LE, y: Z(zm), chord, angle });
  const side: PathStation[] = [
    { z: 0, x: RW_LE, y: y0, chord: 262, angle: 0.2 },
    { z: 300, x: RW_LE, y: y0, chord: 262, angle: 0.2 },
    { z: 440, x: RW_LE, y: y0 + 6, chord: 266, angle: 0.18 },
    tip(492, 720, 300, 0.12),
    tip(530, 788, 370, 0.04),
    tip(566, 818, 400, 0),
    tip(600, 800, 470, 0),
    tip(REAR_WING.tipHalf, 752, 500, 0),
    tip(600, 702, 520, 0),
    tip(574, 668, 526, 0),
  ];
  const left = side
    .slice(1)
    .reverse()
    .map((s) => ({ ...s, z: -s.z }));
  return [...left, ...side];
})();

/** Endplate lean: from ±436 mm at its foot to ±515 mm at the tip (§27.1). */
const EP_FOOT = 436;
const EP_LEAN = Math.atan2(515 - EP_FOOT, Z(660) - REAR_WING.endplateBottom);

/** Right endplate: a 12 mm plate below the rolled tip, leaning outboard as it rises. */
function rearEndplate() {
  const b = REAR_WING.endplateBottom;
  const k = 1 / Math.cos(EP_LEAN);
  const outline = (
    [
      [XR - 140, Z(664)],
      [REAR_WING.endplateRear, Z(664)],
      [REAR_WING.endplateRear, Z(378)],
      [XR - 470, b],
      [XR - 272, b],
    ] as [number, number][]
  ).map(([x, y]) => [x, (y - b) * k] as [number, number]);
  const ep = plate(smoothOutline(outline, 3), 12, 0);
  ep.rotateX(EP_LEAN);
  ep.translate(0, b, EP_FOOT);
  return ep;
}

/** Where the endplate's mid-plane sits at height y. */
const endplateZ = (y: number) => EP_FOOT + (y - REAR_WING.endplateBottom) * Math.tan(EP_LEAN);

/** Flap: overlaps the mainplane's trailing edge with a 9.4–13 mm slot. */
const flapAt = (z: number): WingStation => ({ z, x: XR - 380, y: Z(751), chord: 190, angle: 0.55 });
const RW_FLAP: WingStation[] = fullSpan([flapAt(0), flapAt(250), flapAt(REAR_WING.half)]);

/** DRS: the flap pivots about an axis within 20 mm of the top rear corner of the profile box (3.10.10). */
export const RW_HINGE: [number, number, number] = [XR - 540, Z(890), 0];
/** Opens the slot by about 80 mm (≤85 mm). */
export const RW_OPEN = 0.4;

/** Mainplane, rolled tips and endplates. */
export function RearMainplane() {
  const geo = useMemo(
    () =>
      cached("car22-rw-main", () => {
        const ep = rearEndplate();
        // Separators that hold the slot gap at the tips.
        const sep = new BoxGeometry(40, 30, 6).translate(XR - 395, Z(752), REAR_WING.half - 6);
        return mergeAll([wingAlongPath(MAIN, RW_MAIN, 6), ep, mirrorZ(ep), sep, mirrorZ(sep)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearFlap() {
  const geo = useMemo(
    () =>
      cached("car22-rw-flap", () => {
        // Brackets from the flap's trailing edge up to the pivot.
        const te = flapAt(0);
        const tx = te.x - te.chord * Math.cos(te.angle);
        const ty = te.y + te.chord * Math.sin(te.angle);
        const bracket = new BoxGeometry(36, RW_HINGE[1] - ty + 14, 8).translate(tx + 4, (RW_HINGE[1] + ty) / 2, 34);
        return mergeAll([wingElement(FLAP, RW_FLAP, 6), gurney(RW_FLAP), bracket, mirrorZ(bracket)]);
      }),
    [],
  );
  return (
    <AeroPivot hinge={RW_HINGE} angle={RW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
    </AeroPivot>
  );
}

/** LED light strip in the rear edge of the right endplate, facing rearward (Z = 500–870; 14.3.3). */
export function RearWingLights() {
  const geo = useMemo(
    () =>
      cached("car22-rw-leds", () => {
        const y = Z(578);
        return new BoxGeometry(6, 150, 9).rotateX(EP_LEAN).translate(REAR_WING.endplateRear - 2, y, endplateZ(y));
      }),
    [],
  );
  return <mesh geometry={geo} material={glow("#ff2430", 3)} />;
}

/**
 * The beam wing: two small elements in each half, split round the exhaust
 * (they must stay 10 mm clear of it), working with the diffuser to pull air
 * out from under the car.
 */
export function BeamWing() {
  const geo = useMemo(
    () =>
      cached("car22-beam-wing", () => {
        const half = (x: number, zm: number, chord: number, angle: number) => {
          const st = (z: number, dy: number): WingStation => ({ z, x, y: Z(zm) + dy, chord, angle });
          const right = wingElement(MAIN, [st(BEAM_WING.inner, 6), st(200, 0), st(BEAM_WING.half, -4)], 2);
          return [right, mirrorZ(right)];
        };
        return mergeAll([...half(BEAM_WING.front, 346, 140, 0.25), ...half(XR - 405, 396, 140, 0.45)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The rear wing pylon: a single 24 mm central blade from the gearbox to the mainplane, wrapped round the tailpipe. */
export function RearPylon() {
  const geo = useMemo(
    () =>
      cached("car22-rw-pylon", () => {
        const p = plate(
          smoothOutline(
            [
              [XR - 158, REAR_WING.bottom + 14],
              [XR - 298, REAR_WING.bottom + 30],
              [XR - 300, Z(560)],
              [XR - 316, CRASH.top + 6],
              [XR - 140, Z(392)],
              [XR - 150, Z(560)],
            ],
            6,
          ),
          24,
          0,
        );
        const collar = new CylinderGeometry(TAILPIPE.bore / 2 + 16, TAILPIPE.bore / 2 + 16, 70, 32, 1, true).rotateZ(Math.PI / 2).translate(XR - 250, TAILPIPE.y - 6, 0);
        return mergeAll([p, collar]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The DRS pod on the centre line: a hydraulic actuator, below Z = 940, that lifts the flap. */
export function RearActuator() {
  const geo = useMemo(
    () =>
      cached("car22-rw-actuator", () =>
        mergeAll([
          roundedBox(170, 46, 40, 14).clone().translate(XR - 470, Z(905), 0),
          rod([XR - 410, Z(890), 0], [XR - 390, Z(790), 0], 10),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}
