"use client";

import { useMemo } from "react";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { BEAM_WING, CRASH, FRONT_WING, REAR_WING, XF, XR, Z } from "./layout";

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
// Front wing (3.7): 1,400 mm wide. Outside ±250 mm everything must stay
// Z = 150–350, so the wing sits high; in the middle it may drop to Z = 50, so
// the mainplane dips into a low spoon under the nose. Above the spoon, the
// flaps are joined by a bridge wing passing under the nose tip.

/** Plan shape: the leading edge steps back at ±200 mm to the 900 mm overhang (3.14.2). */
const FW_LE: [number, number][] = [
  [0, FRONT_WING.centreEdge],
  [110, FRONT_WING.centreEdge - 10],
  [170, XF + 935],
  [205, XF + 888],
  [420, FRONT_WING.leadingEdge - 10],
  [FRONT_WING.half, XF + 835],
];
const FW_TE: [number, number][] = [
  [0, XF + 700],
  [190, XF + 700],
  [250, XF + 560],
  [400, XF + 384],
  [FRONT_WING.half, FRONT_WING.trailingEdge],
];
/** Height (Z) of the mainplane's leading edge, and of the top flap's trailing edge. */
const FW_LOW: [number, number][] = [
  [0, 74],
  [150, 76],
  [250, 166],
  [440, 172],
  [FRONT_WING.half, 190],
];
const FW_TOP: [number, number][] = [
  [0, 118],
  [150, 126],
  [250, 292],
  [440, 322],
  [FRONT_WING.half, 300],
];
/** The mainplane fills the whole depth of the low middle section. */
const FW_MAIN_SHARE: [number, number][] = [
  [0, 1],
  [190, 1],
  [250, 0.56],
  [FRONT_WING.half, 0.56],
];
/** The flaps above the mainplane: where each starts along the stack's depth (0–1), and its share of the depth. */
const FW_STACK: { at: number; share: number }[] = [
  { at: 0, share: 0.56 },
  { at: 0.5, share: 0.3 },
  { at: 0.76, share: 0.24 },
];
const MAIN_SPAN = [0, 60, 120, 160, 190, 220, 250, 300, 400, 520, 620, FRONT_WING.half];
const FLAP_SPAN = [240, 300, 400, 520, 620, FRONT_WING.half];

/** Stations of element k across the right half-span. */
function frontStations(k: number): WingStation[] {
  const e = FW_STACK[k];
  return (k === 0 ? MAIN_SPAN : FLAP_SPAN).map((z) => {
    const le = lerpTable(FW_LE, z);
    const depth = le - lerpTable(FW_TE, z);
    const low = lerpTable(FW_LOW, z);
    const rise = lerpTable(FW_TOP, z) - low;
    const h = (t: number) => low + rise * t * t + 8 * k;
    const share = k === 0 ? lerpTable(FW_MAIN_SHARE, z) : e.share;
    const run = share * depth;
    const angle = Math.atan2(h(e.at + share) - h(e.at), run);
    return { z, x: le - e.at * depth, y: Z(h(e.at)), chord: run / Math.cos(angle), angle };
  });
}

/** Both halves of element k. */
function frontElement(k: number, profile: [number, number][]) {
  const right = wingElement(profile, frontStations(k), 6);
  return [right, mirrorZ(right)];
}

/** The mainplane with its low spoon, and the two pylons up to the nose. */
export function FrontMainplane() {
  const geo = useMemo(
    () =>
      cached("car06-fw-main", () => {
        const p = plate(
          [
            [2490, Z(76)],
            [2346, Z(84)],
            [2360, 314],
            [2492, 314],
          ],
          18,
          62,
        );
        return mergeAll([...frontElement(0, MAIN), p, mirrorZ(p)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The two flaps above the mainplane, set at a pit stop. */
export function FrontFlaps() {
  const geo = useMemo(
    () =>
      cached("car06-fw-flaps", () => {
        const flaps = [1, 2].flatMap((k) => frontElement(k, FLAP));
        const top = gurney(frontStations(2));
        return mergeAll([...flaps, top, mirrorZ(top)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The bridge wing: a small element arching between the flaps' inner ends,
 * under the nose tip and through the pylons, working the air on its way to
 * the floor. McLaren raced one from 2007.
 */
export function BridgeWing() {
  const geo = useMemo(
    () =>
      cached("car06-fw-bridge", () => {
        const st = (z: number): WingStation => {
          const t = z / 262;
          return { z, x: XF + 760 - 70 * t, y: Z(206 + 44 * t * t), chord: 112, angle: 0.2 + 0.24 * t };
        };
        const right = wingElement(FLAP, [st(0), st(90), st(170), st(230), st(262)], 4);
        return mergeAll([right, mirrorZ(right)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Front wing endplate (right side): a plain plate on the 1,400 mm limit, Z =
 * 150–350, ending 350 mm ahead of the axle so the wheels can steer behind it
 * (3.7.1, 3.11), plus two strakes under the wing.
 */
export function FrontEndplates() {
  const geo = useMemo(
    () =>
      cached("car06-fw-endplates", () => {
        const { z, thick } = FRONT_WING.endplate;
        const lead = XF + 880;
        const trail = FRONT_WING.trailingEdge + 22;
        const ep = plate(
          smoothOutline(
            [
              [lead, Z(172)],
              [lead + 4, Z(262)],
              [lead - 46, Z(336)],
              [trail + 96, Z(340)],
              [trail + 8, Z(320)],
              [trail, Z(182)],
              [trail + 40, Z(160)],
              [lead - 40, Z(160)],
            ],
            6,
          ),
          thick,
          z,
        );
        const strakes = [340, 520].map((sz) => {
          const s = frontStations(0).find((st) => st.z >= sz) ?? frontStations(0)[0];
          return plate(
            smoothOutline([
              [s.x - 16, Z(160)],
              [s.x - 30, s.y - 2],
              [s.x - s.chord * 0.9, s.y + s.chord * 0.12],
              [s.x - s.chord * 0.95, Z(162)],
            ]),
            5,
            sz,
          );
        });
        return mergeAll([ep, ...strakes]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The adjusters that set the flaps' angle (turned with a tool on the stationary car). */
export function FrontAdjusters() {
  const geo = useMemo(
    () =>
      cached("car06-fw-adjusters", () => {
        const st = frontStations(2);
        const s = st[st.length - 2];
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
// Rear wing (3.10): wide and low. Two sections within ±480 mm, no higher than
// Z = 800, a third of a metre lower and a third wider than the wing of 2009,
// with the beam wing below. Nothing on it moves.

const MAIN_CHORD = 230;
const MAIN_ANGLE = 0.2;
const FLAP_CHORD = 160;
const FLAP_ANGLE = 0.62;
const RW_LE = REAR_WING.leadingEdge;
/** A slot of no more than 15 mm between the two (3.10.4). */
const FLAP_Y = REAR_WING.top - 4 - FLAP_CHORD * Math.sin(FLAP_ANGLE);
const MAIN_Y = FLAP_Y - 12 - MAIN_CHORD * Math.sin(MAIN_ANGLE);
const FLAP_X = RW_LE - MAIN_CHORD * Math.cos(MAIN_ANGLE) + 22;

const mainAt = (z: number): WingStation => ({ z, x: RW_LE, y: MAIN_Y, chord: MAIN_CHORD, angle: MAIN_ANGLE });
const RW_MAIN: WingStation[] = fullSpan([mainAt(0), mainAt(REAR_WING.half)]);

const flapAt = (z: number): WingStation => ({ z, x: FLAP_X, y: FLAP_Y, chord: FLAP_CHORD, angle: FLAP_ANGLE });
const RW_FLAP: WingStation[] = fullSpan([flapAt(0), flapAt(REAR_WING.half)]);

export function RearMainplane() {
  const geo = useMemo(() => cached("car06-rw-main", () => wingElement(MAIN, RW_MAIN, 6)), []);
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The upper element, bolted to the mainplane through rigid separators, no more
 * than 250 mm from any part of the trailing edge (3.10.5), so the slot cannot
 * flex open at speed.
 */
export function RearFlap() {
  const geo = useMemo(
    () =>
      cached("car06-rw-flap", () => {
        const dx = FLAP_CHORD * Math.cos(FLAP_ANGLE);
        const dy = FLAP_CHORD * Math.sin(FLAP_ANGLE);
        const sep = plate(
          [
            [RW_LE + 14, MAIN_Y - 16],
            [RW_LE - MAIN_CHORD * Math.cos(MAIN_ANGLE) - 10, MAIN_Y + 30],
            [FLAP_X - dx - 12, FLAP_Y + dy - 22],
            [FLAP_X - dx + 6, FLAP_Y + dy + 14],
            [FLAP_X + 22, FLAP_Y + 20],
            [RW_LE - 60, MAIN_Y + 46],
          ],
          3,
          240,
          0.8,
        );
        return mergeAll([wingElement(FLAP, RW_FLAP, 6), gurney(RW_FLAP), sep, mirrorZ(sep)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Endplate (right side): a flat plate just outside the wing, up to ±500 mm,
 * from the axle line to 600 mm behind it and from Z = 300 to the top of the
 * wing; its side area must exceed 230,000 mm² (3.10.7).
 */
export function RearEndplates() {
  const geo = useMemo(
    () =>
      cached("car06-rw-endplates", () => {
        const { epFront: f, epRear: r, epBottom: b, top } = REAR_WING;
        return plate(
          smoothOutline(
            [
              [f, top - 60],
              [f - 12, top - 14],
              [f - 60, top],
              [r + 110, top],
              [r + 34, top - 8],
              [r, top - 60],
              [r, b + 60],
              [r + 60, b],
              [f - 60, b],
              [f, b + 120],
            ],
            4,
          ),
          12,
          REAR_WING.ep,
        );
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The beam wing: one section either side of the crash structure, more than 150 mm behind the axle, Z = 300–375 (3.10.3). */
export function BeamWing() {
  const geo = useMemo(
    () =>
      cached("car06-beam-wing", () => {
        const st = (z: number): WingStation => ({ z, x: BEAM_WING.x, y: Z(314), chord: 166, angle: 0.27 });
        const right = wingElement(MAIN, [st(BEAM_WING.inner), st(280), st(BEAM_WING.half)], 2);
        return mergeAll([right, mirrorZ(right)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The rear wing pillar: a central blade from the crash structure up to the mainplane. */
export function RearPylon() {
  const geo = useMemo(
    () =>
      cached("car06-rw-pylon", () =>
        plate(
          smoothOutline(
            [
              [XR - 60, CRASH.top + 2],
              [XR - 230, CRASH.top + 2],
              [XR - 210, MAIN_Y + 20],
              [XR - 20, MAIN_Y + 2],
              [XR - 40, Z(520)],
            ],
            6,
          ),
          24,
          0,
        ),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}
