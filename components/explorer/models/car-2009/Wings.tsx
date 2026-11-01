"use client";

import { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, type BufferGeometry } from "three";
import { AeroPivot } from "../../Part";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { BEAM_WING, CRASH, FRONT_WING, NOSE, REAR_WING, XF, XR, Z } from "./layout";

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
// Front wing (3.7): the neutral section in the middle; outboard a mainplane
// running in to it, and four flaps that stop at ±400 mm, because between
// ±250 and ±400 mm the wing may show no more than 20,000 mm² from the side.
// Endplates at ±795 mm, with a foot plate out to the 1,800 mm span and a
// cascade winglet above the flaps.

const fwTE = (z: number) => Math.max(FRONT_WING.trailingEdge, XF + 750 - 2 * (z - 250));
/** Height (Z) of the mainplane's leading edge, and of the top flap's trailing edge. */
const FW_LOW: [number, number][] = [
  [FRONT_WING.inner, 96],
  [500, 88],
  [FRONT_WING.half, 82],
];
const FW_TOP: [number, number][] = [
  [400, 262],
  [550, 270],
  [700, 258],
  [FRONT_WING.half, 236],
];
/** Each element: where its leading edge sits along the stack's depth (0–1), and its share of the depth. */
const FW_CASCADE: { at: number; share: number }[] = [
  { at: 0, share: 0.44 },
  { at: 0.38, share: 0.24 },
  { at: 0.57, share: 0.2 },
  { at: 0.72, share: 0.16 },
  { at: 0.84, share: 0.16 },
];
const MAIN_SPAN = [FRONT_WING.inner, 330, 400, 500, 620, 740, FRONT_WING.half];
const FLAP_SPAN = [400, 500, 620, 740, FRONT_WING.half];

/** Stations of element k across the right half-span. */
function frontStations(k: number): WingStation[] {
  const e = FW_CASCADE[k];
  return (k === 0 ? MAIN_SPAN : FLAP_SPAN).map((z) => {
    const le = FRONT_WING.leadingEdge;
    const depth = le - FRONT_WING.trailingEdge;
    const low = lerpTable(FW_LOW, z);
    const rise = lerpTable(FW_TOP, z) - 36 - low;
    const h = (t: number) => low + rise * t * t + 9 * k;
    // Inboard, the mainplane stays ahead of the cut-back trailing edge.
    const run = k === 0 ? Math.min(e.share * depth, le - fwTE(z) - 10) : e.share * depth;
    const share = run / depth;
    const angle = Math.atan2(h(e.at + share) - h(e.at), run);
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
      cached("car09-fw-main", () => {
        const { x, chord } = FRONT_WING.neutral;
        const st = (z: number): WingStation => ({ z, x, y: Z(104), chord, angle: -0.07 });
        const neutral = wingElement(NEUTRAL, fullSpan([st(0), st(FRONT_WING.inner + 2)]), 2);
        // Two pylons, each no more than 25 mm thick, up to the underside of the nose.
        const [mid, near] = [NOSE[NOSE.length - 3], NOSE[NOSE.length - 2]];
        const p = plate(
          [
            [x - 30, Z(116)],
            [x - 170, Z(118)],
            [mid.x + 20, mid.bottom + 8],
            [near.x - 6, near.bottom + 8],
          ],
          16,
          62,
        );
        return mergeAll([neutral, ...frontElement(0, MAIN), p, mirrorZ(p)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/** The four flaps and the cascade above them; their angle can be adjusted at a pit stop. */
export function FrontFlaps() {
  const geo = useMemo(
    () =>
      cached("car09-fw-flaps", () => {
        const flaps = [1, 2, 3, 4].flatMap((k) => frontElement(k, FLAP));
        const top = gurney(frontStations(4));
        // Cascade: a small element high on the endplate, ahead of the flaps.
        const cas = (z: number): WingStation => ({ z, x: FRONT_WING.leadingEdge - 30, y: Z(222), chord: 120, angle: 0.35 });
        const cascade = wingElement(FLAP, [cas(620), cas(FRONT_WING.half)], 2);
        return mergeAll([...flaps, top, mirrorZ(top), cascade, mirrorZ(cascade)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Front wing endplate (right side): a plate between ±750 and ±840 mm with at
 * least 95,000 mm² of side area, and its foot plate out to the 900 mm tip,
 * no higher than Z = 100 underneath (3.7.5–3.7.7), plus two strakes under
 * the wing.
 */
export function FrontEndplates() {
  const geo = useMemo(
    () =>
      cached("car09-fw-endplates", () => {
        const { inner, thick } = FRONT_WING.endplate;
        const lead = FRONT_WING.leadingEdge;
        const trail = FRONT_WING.trailingEdge;
        const ep = plate(
          smoothOutline(
            [
              [lead + 6, Z(80)],
              [lead - 10, Z(200)],
              [lead - 110, Z(272)],
              [trail + 140, Z(275)],
              [trail + 10, Z(240)],
              [trail, Z(90)],
              [trail + 40, Z(78)],
            ],
            6,
          ),
          thick,
          inner + thick / 2,
        );
        const foot = plate(
          smoothOutline(
            [
              [lead - 8, inner],
              [lead - 30, FRONT_WING.tip],
              [trail + 60, FRONT_WING.tip],
              [trail + 20, inner],
            ],
            4,
          ),
          10,
          0,
        );
        foot.rotateX(Math.PI / 2);
        foot.translate(0, Z(86), 0);
        const strakes: BufferGeometry[] = [];
        for (const sz of [500, 680]) {
          const s = frontStations(0).find((st) => st.z >= sz) ?? frontStations(0)[0];
          strakes.push(
            plate(
              smoothOutline([
                [s.x - 20, Z(78)],
                [s.x - 40, s.y - 4],
                [s.x - s.chord * 0.9, s.y + s.chord * 0.12],
                [s.x - s.chord * 0.95, Z(80)],
              ]),
              5,
              sz,
            ),
          );
        }
        return mergeAll([ep, foot, ...strakes]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The adjusters that set the flaps' angle (turned with a tool on the stationary car). */
export function FrontAdjusters() {
  const geo = useMemo(
    () =>
      cached("car09-fw-adjusters", () => {
        const st = frontStations(4);
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
// Rear wing (3.10): tall and narrow. Two profiles within ±355 mm between the
// axle and 350 mm behind it, Z = 730–950; huge flat endplates down to
// Z = 300; and below, the last of the beam wings.

const MAIN_CHORD = 230;
const MAIN_ANGLE = 0.22;
const FLAP_CHORD = 150;
const FLAP_ANGLE = 0.7;
const RW_LE = REAR_WING.leadingEdge;
/** The upper element's chord must be shorter than the lower's; a 10–15 mm slot between them. */
const FLAP_Y = REAR_WING.top - 4 - FLAP_CHORD * Math.sin(FLAP_ANGLE);
const MAIN_Y = FLAP_Y - 12 - MAIN_CHORD * Math.sin(MAIN_ANGLE);
const FLAP_X = RW_LE - MAIN_CHORD * Math.cos(MAIN_ANGLE) + 22;

const mainAt = (z: number): WingStation => ({ z, x: RW_LE, y: MAIN_Y, chord: MAIN_CHORD, angle: MAIN_ANGLE });
const RW_MAIN: WingStation[] = fullSpan([mainAt(0), mainAt(REAR_WING.half)]);

const flapAt = (z: number): WingStation => ({ z, x: FLAP_X, y: FLAP_Y, chord: FLAP_CHORD, angle: FLAP_ANGLE });
const RW_FLAP: WingStation[] = fullSpan([flapAt(0), flapAt(REAR_WING.half)]);

/** DRS: the flap pivots about a fixed axis within 20 mm of the box's top rear corner; the slot opens to 50 mm (3.18). */
export const RW_HINGE: [number, number, number] = [XR - 336, Z(934), 0];
export const RW_OPEN = 0.3;

export function RearMainplane() {
  const geo = useMemo(() => cached("car09-rw-main", () => wingElement(MAIN, RW_MAIN, 6)), []);
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearFlap() {
  const geo = useMemo(() => cached("car09-rw-flap", () => mergeAll([wingElement(FLAP, RW_FLAP, 6), gurney(RW_FLAP)])), []);
  return (
    <AeroPivot hinge={RW_HINGE} angle={RW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
    </AeroPivot>
  );
}

/**
 * Endplate (right side): a tall flat plate between ±355 and ±375 mm, from the
 * axle line to 600 mm behind it and from Z = 300 to the top of the wing; its
 * side area must exceed 330,000 mm² (3.10.8). Louvres near the top let the
 * high-pressure air bleed off and weaken the tip vortex.
 */
export function RearEndplates() {
  const geo = useMemo(
    () =>
      cached("car09-rw-endplates", () => {
        const { epFront: f, epRear: r, epBottom: b, top } = REAR_WING;
        return plate(
          smoothOutline(
            [
              [f, top - 60],
              [f - 12, top - 14],
              [f - 60, top - 2],
              [r + 110, top - 2],
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
  const louvres = useMemo(
    () =>
      cached("car09-rw-louvres", () =>
        mergeAll([0, 1, 2, 3, 4].map((i) => new BoxGeometry(14, 120, 2).rotateZ(0.12).translate(REAR_WING.epFront - 40 - i * 34, REAR_WING.top - 90, REAR_WING.ep + 6.5))),
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={louvres} material={slotDark} />
    </group>
  );
}

const slotDark = new MeshStandardMaterial({ color: "#030304", roughness: 1, metalness: 0 });

/**
 * The beam wing: one section, split either side of the crash structure, in
 * the box the rules leave 150–350 mm behind the axle and Z = 300–400. It
 * ties the rear wing's low pressure to the diffuser's (3.10.1).
 */
export function BeamWing() {
  const geo = useMemo(
    () =>
      cached("car09-beam-wing", () => {
        const st = (z: number): WingStation => ({ z, x: BEAM_WING.x, y: Z(336), chord: 186, angle: 0.3 });
        const right = wingElement(MAIN, [st(BEAM_WING.inner), st(220), st(BEAM_WING.half)], 2);
        return mergeAll([right, mirrorZ(right)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The rear wing pillar: a single central blade, no more than 25 mm thick,
 * from the gearbox up to the mainplane (3.10.9).
 */
export function RearPylon() {
  const geo = useMemo(
    () =>
      cached("car09-rw-pylon", () => {
        return plate(
          smoothOutline(
            [
              [XR + 40, CRASH.top + 4],
              [XR - 150, CRASH.top + 4],
              [XR - 160, Z(600)],
              [XR - 210, MAIN_Y - 4],
              [XR - 20, MAIN_Y + 4],
              [XR + 30, Z(560)],
            ],
            6,
          ),
          24,
          0,
        );
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The DRS actuator in the head of the pillar, on the centre line. */
export function RearActuator() {
  const geo = useMemo(
    () =>
      cached("car09-rw-actuator", () =>
        mergeAll([
          roundedBox(110, 40, 30, 10).clone().translate(XR - 120, MAIN_Y - 36, 0),
          rod([XR - 160, MAIN_Y - 26, 0], [RW_HINGE[0] + 60, RW_HINGE[1] - 60, 0], 10),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}
