"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, type BufferGeometry } from "three";
import { AeroPivot } from "../../Part";
import { CAR_MAT, glow } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { CRASH, FRONT_WING, NOSE, REAR_WING, TAILPIPE, XF, XR, Z } from "./layout";

/** Highly cambered, inverted sections (the suction side faces the ground). */
const MAIN = naca(0.075, 0.38, 0.085);
const FLAP = naca(0.09, 0.42, 0.075);
const NEUTRAL = naca(0.02, 0.4, 0.11);
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
// Front wing (3.3, from 2019): the FIA's fixed neutral section in the middle,
// then five elements out to the endplates in a band swept back 200 mm over
// the span. The stack rises to Z = 300 inboard; outboard the flaps are
// washed down toward the endplates, the outwash that the 2019 rules tried to
// reduce.

/** Leading and trailing edges of the band at half-span z. */
const fwLE = (z: number) => FRONT_WING.leadingEdge - FRONT_WING.sweep * z;
/**
 * The trailing edge also stays clear of the front wheels: inboard, the
 * flaps' trailing corners must be ahead of a 28° line from 875 mm ahead of
 * the axle at ±250 mm to 450 mm ahead at ±476 mm (3.4.4).
 */
const fwTE = (z: number) => Math.max(FRONT_WING.trailingEdge - FRONT_WING.sweep * z, XF + 875 - ((z - 250) * 425) / 226);
/** Height (Z) of the mainplane's leading edge, and of the top flap's trailing edge. */
const FW_LOW: [number, number][] = [
  [FRONT_WING.inner, 94],
  [600, 86],
  [FRONT_WING.half, 82],
];
const FW_TOP: [number, number][] = [
  [FRONT_WING.inner, 282],
  [450, 294],
  [600, 284],
  [700, 246],
  [800, 206],
  [FRONT_WING.half, 188],
];
/** Each element: where its leading edge sits along the band's depth (0–1), and its share of the depth. */
const FW_CASCADE: { at: number; share: number }[] = [
  { at: 0, share: 0.42 },
  { at: 0.36, share: 0.24 },
  { at: 0.55, share: 0.2 },
  { at: 0.7, share: 0.17 },
  { at: 0.83, share: 0.17 },
];
const FW_SPAN = [FRONT_WING.inner, 300, 360, 420, 480, 600, 700, 800, 870, FRONT_WING.half];

/** Stations of element k across the right half-span (z from 250 to the endplate). */
function frontStations(k: number): WingStation[] {
  const e = FW_CASCADE[k];
  return FW_SPAN.map((z) => {
    const le = fwLE(z);
    const depth = le - fwTE(z);
    const low = lerpTable(FW_LOW, z);
    const rise = lerpTable(FW_TOP, z) - 36 - low;
    const h = (t: number) => low + rise * t * t + 9 * k;
    const run = e.share * depth;
    const angle = Math.atan2(h(e.at + e.share) - h(e.at), run);
    return { z, x: le - e.at * depth, y: Z(h(e.at)), chord: run / Math.cos(angle), angle };
  });
}

/** Both halves of element k. */
function frontElement(k: number, profile: [number, number][]) {
  const right = wingElement(profile, frontStations(k), 6);
  return [right, mirrorZ(right)];
}

/** The mainplane, with the neutral section across the middle and the pylons up to the nose. */
export function FrontMainplane() {
  const geo = useMemo(
    () =>
      cached("car17-fw-main", () => {
        const { x, chord } = FRONT_WING.neutral;
        const st = (z: number): WingStation => ({ z, x, y: Z(100), chord, angle: -0.055 });
        const neutral = wingElement(NEUTRAL, fullSpan([st(0), st(FRONT_WING.inner + 2)]), 2);
        // Two pylons, each no more than 25 mm thick, up to the underside of the nose.
        const nose = NOSE[NOSE.length - 3];
        const p = plate(
          smoothOutline([
            [x - 40, Z(118)],
            [x - 200, Z(120)],
            [nose.x - 60, nose.bottom + 6],
            [x - 50, NOSE[NOSE.length - 2].bottom + 4],
          ]),
          18,
          70,
        );
        return mergeAll([neutral, ...frontElement(0, MAIN), p, mirrorZ(p)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The four flaps; their angle can be adjusted at a pit stop to trim the balance. */
export function FrontFlaps() {
  const geo = useMemo(
    () =>
      cached("car17-fw-flaps", () => {
        const flaps = [1, 2, 3, 4].flatMap((k) => frontElement(k, FLAP));
        const top = gurney(frontStations(4));
        return mergeAll([...flaps, top, mirrorZ(top)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Front wing endplate (right side): a flat plate without slots between ±910
 * and ±950 mm, its foot plate at Z = 75–110 turning outboard to the 2,000 mm
 * span, and the two strakes allowed under the wing (3.3.5, 3.3.8).
 */
export function FrontEndplates() {
  const geo = useMemo(
    () =>
      cached("car17-fw-endplates", () => {
        const { inner, thick } = FRONT_WING.endplate;
        const z = inner + thick / 2;
        const lead = fwLE(z);
        const trail = fwTE(z);
        const ep = plate(
          smoothOutline(
            [
              [lead + 4, Z(80)],
              [lead - 14, Z(210)],
              [lead - 120, Z(296)],
              [trail + 120, Z(300)],
              [trail + 10, Z(260)],
              [trail, Z(90)],
              [trail + 40, Z(78)],
            ],
            6,
          ),
          thick,
          z,
        );
        const foot = plate(
          smoothOutline(
            [
              [lead - 10, inner],
              [lead - 40, 992],
              [trail + 70, 992],
              [trail + 30, inner],
            ],
            4,
          ),
          10,
          0,
        );
        foot.rotateX(Math.PI / 2);
        foot.translate(0, Z(88), 0);
        // Strakes: two fences under the mainplane steering air outboard.
        const strakes: BufferGeometry[] = [];
        for (const sz of [560, 720]) {
          const s = frontStations(0).find((st) => st.z >= sz) ?? frontStations(0)[0];
          const sk = plate(
            smoothOutline([
              [s.x - 20, Z(78)],
              [s.x - 40, s.y - 4],
              [s.x - s.chord * 0.9, s.y + s.chord * 0.12],
              [s.x - s.chord * 0.95, Z(80)],
            ]),
            5,
            sz,
          );
          strakes.push(sk);
        }
        return mergeAll([ep, foot, ...strakes]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The adjusters that set the flaps' angle (turned with a tool on the stationary car; 3.3.7). */
export function FrontAdjusters() {
  const geo = useMemo(
    () =>
      cached("car17-fw-adjusters", () => {
        // On the top flap, just inboard of the endplate.
        const s = frontStations(4)[FW_SPAN.length - 2];
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
// Rear wing (3.6, from 2019): a mainplane and DRS flap inside the 350 mm
// profile box behind the axle, between flat endplates that step in below
// Z = 500. No beam wing: only the pylon and the endplates may stand between
// Z = 200 and 650.

const MAIN_CHORD = 222;
const MAIN_ANGLE = 0.2;
const FLAP_CHORD = 190;
const FLAP_ANGLE = 0.65;
const RW_LE = REAR_WING.leadingEdge;
/** Flap: overlaps the mainplane's trailing edge by 22 mm with a 10–15 mm slot; its trailing edge ends at R−500. */
const FLAP_Y = REAR_WING.top - 4 - FLAP_CHORD * Math.sin(FLAP_ANGLE);
const MAIN_Y = FLAP_Y - 12 - MAIN_CHORD * Math.sin(MAIN_ANGLE);
const FLAP_X = RW_LE - MAIN_CHORD * Math.cos(MAIN_ANGLE) + 22;

const mainAt = (z: number, dip: number): WingStation => ({ z, x: RW_LE, y: MAIN_Y - dip, chord: MAIN_CHORD, angle: MAIN_ANGLE });
const RW_MAIN: WingStation[] = fullSpan([mainAt(0, 10), mainAt(260, 5), mainAt(REAR_WING.half, 0)]);

const flapAt = (z: number): WingStation => ({ z, x: FLAP_X, y: FLAP_Y, chord: FLAP_CHORD, angle: FLAP_ANGLE });
const RW_FLAP: WingStation[] = fullSpan([flapAt(0), flapAt(250), flapAt(REAR_WING.half)]);

/** DRS: the flap pivots near its trailing edge and its leading edge lifts, opening the slot by up to 85 mm. */
export const RW_HINGE: [number, number, number] = [FLAP_X - 0.9 * FLAP_CHORD * Math.cos(FLAP_ANGLE), FLAP_Y + 0.9 * FLAP_CHORD * Math.sin(FLAP_ANGLE), 0];
export const RW_OPEN = 0.48;

export function RearMainplane() {
  const geo = useMemo(() => cached("car17-rw-main", () => wingElement(MAIN, RW_MAIN, 6)), []);
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearFlap() {
  const geo = useMemo(() => cached("car17-rw-flap", () => mergeAll([wingElement(FLAP, RW_FLAP, 6), gurney(RW_FLAP)])), []);
  return (
    <AeroPivot hinge={RW_HINGE} angle={RW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
    </AeroPivot>
  );
}

/** The endplate's trailing edge at height y: ahead of the line from (R−550, Z200) to (R−810, Z870). */
const epRear = (y: number) => XR - 550 - ((y - Z(200)) / 670) * 260;
/** Its leading edge: behind the line from (R0, Z370) to (R−190, Z870). */
const epFront = (y: number) => XR - Math.max(0, ((y - Z(370)) / 500) * 190) - 6;

/**
 * Endplate (right side): flat at ±520 mm above Z = 540; below Z = 500 the car
 * may only be 840 mm wide, so the lower part steps in to ±410 mm, down to
 * Z = 205 (3.6.2, 3.6.7).
 */
export function RearEndplates() {
  const geo = useMemo(
    () =>
      cached("car17-rw-endplates", () => {
        const top = REAR_WING.top + 2;
        const upper = plate(
          smoothOutline(
            [
              [epFront(top), top],
              [epRear(top) + 30, top],
              [epRear(top - 30), top - 30],
              [epRear(Z(540)), Z(540)],
              [epFront(Z(540)), Z(540)],
            ],
            4,
          ),
          10,
          REAR_WING.epUpper,
        );
        const lower = plate(
          smoothOutline(
            [
              [epFront(Z(502)), Z(502)],
              [epRear(Z(502)), Z(502)],
              [epRear(Z(205)) + 40, Z(205)],
              [XR - 40, Z(205)],
            ],
            3,
          ),
          10,
          REAR_WING.epLower,
        );
        // The step between them, above Z = 500 where the car may be 1,050 mm wide.
        const x0 = epFront(Z(540));
        const x1 = epRear(Z(540));
        const dz = REAR_WING.epUpper - REAR_WING.epLower;
        const step = new BoxGeometry(x0 - x1, 8, Math.hypot(dz, 38)).rotateX(-Math.atan2(38, dz)).translate((x0 + x1) / 2, Z(521), (REAR_WING.epUpper + REAR_WING.epLower) / 2);
        return mergeAll([upper, lower, step]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** LED rain light near the trailing edge of the right endplate, Z = 650–870 (14.5). */
export function RearWingLights() {
  const geo = useMemo(() => cached("car17-rw-leds", () => new BoxGeometry(6, 130, 8).translate(epRear(Z(780)) + 8, Z(780), REAR_WING.epUpper)), []);
  return <mesh geometry={geo} material={glow("#ff2430", 3)} />;
}

/**
 * The rear wing pylon: a single 24 mm central blade from the gearbox to the
 * mainplane. Between Z = 400 and 600 nothing may stand behind R−200, so the
 * blade climbs ahead of that line before reaching back under the wing; it
 * wraps round the tailpipe.
 */
export function RearPylon() {
  const geo = useMemo(
    () =>
      cached("car17-rw-pylon", () => {
        const p = plate(
          smoothOutline(
            [
              [XR - 70, CRASH.top + 4],
              [XR - 196, CRASH.top + 4],
              [XR - 198, Z(600)],
              [XR - 330, MAIN_Y - 6],
              [XR - 175, MAIN_Y + 4],
              [XR - 80, Z(560)],
            ],
            6,
          ),
          24,
          0,
        );
        const collar = new CylinderGeometry(TAILPIPE.bore / 2 + 14, TAILPIPE.bore / 2 + 14, 80, 32, 1, true).rotateZ(Math.PI / 2).translate(XR - 140, TAILPIPE.y, 0);
        return mergeAll([p, collar]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The DRS actuator in the head of the pylon: a hydraulic ram that lifts the flap. */
export function RearActuator() {
  const geo = useMemo(
    () =>
      cached("car17-rw-actuator", () =>
        mergeAll([
          roundedBox(120, 40, 34, 10).clone().translate(XR - 240, MAIN_Y - 40, 0),
          rod([XR - 290, MAIN_Y - 30, 0], [RW_HINGE[0] + 60, RW_HINGE[1] - 50, 0], 10),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}
