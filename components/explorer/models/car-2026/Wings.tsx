"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry, type BufferGeometry } from "three";
import { AeroPivot } from "../../Part";
import { CAR_MAT, glow } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { CRASH, REAR_WING, TAILPIPE, Z } from "./layout";

/** Highly cambered, inverted sections (the suction side faces the ground). */
const MAIN = naca(0.075, 0.38, 0.085);
const FLAP = naca(0.09, 0.42, 0.075);
const THIN = naca(0, 0.4, 0.12, 16, false);
const GURNEY = naca(0, 0.5, 0.3, 8, false);

/** A Gurney strip (≤10 mm) along the trailing edge of an element's stations. */
function gurney(stations: WingStation[]) {
  return wingElement(
    GURNEY,
    stations.map((s) => ({ ...s, x: s.x - s.chord * Math.cos(s.angle) + 4, y: s.y + s.chord * Math.sin(s.angle) - 2, chord: 12, angle: 1.35 })),
    4,
  );
}

// ---------------------------------------------------------------------------
// Front wing (x from 2,950 to 2,175, |z| ≤ 675, y 105–345)

const FW_MAIN: WingStation[] = fullSpan([
  { z: 0, x: 2942, y: 116, chord: 338, angle: 0.06 },
  { z: 260, x: 2950, y: 110, chord: 345, angle: 0.08 },
  { z: 450, x: 2936, y: 112, chord: 332, angle: 0.1 },
  { z: 580, x: 2910, y: 124, chord: 306, angle: 0.14 },
  { z: 636, x: 2890, y: 134, chord: 290, angle: 0.17 },
]);

const FW_FLAP1: WingStation[] = fullSpan([
  { z: 0, x: 2640, y: 152, chord: 222, angle: 0.34 },
  { z: 260, x: 2634, y: 154, chord: 228, angle: 0.38 },
  { z: 450, x: 2624, y: 162, chord: 224, angle: 0.42 },
  { z: 580, x: 2606, y: 180, chord: 214, angle: 0.47 },
  { z: 636, x: 2592, y: 192, chord: 206, angle: 0.5 },
]);

const FW_FLAP2: WingStation[] = fullSpan([
  { z: 0, x: 2448, y: 236, chord: 162, angle: 0.56 },
  { z: 260, x: 2440, y: 242, chord: 168, angle: 0.6 },
  { z: 450, x: 2430, y: 248, chord: 166, angle: 0.61 },
  { z: 580, x: 2412, y: 250, chord: 160, angle: 0.62 },
  { z: 636, x: 2400, y: 252, chord: 154, angle: 0.62 },
]);

/** The primary flap (every element but the mainplane) pivots about an axis at its leading edge. */
export const FW_HINGE: [number, number, number] = [2640, 150, 0];
/** Incidence removed in Straight Mode (not set by the rules; ≈11° here). */
export const FW_OPEN = 0.2;

export function FrontMainplane() {
  const geo = useMemo(() => cached("car26-fw-main", () => wingElement(MAIN, FW_MAIN, 8)), []);
  // Pylons (≤35 mm thick) carry the nose tip down onto the mainplane; strakes
  // under the wing steer the flow outboard.
  const pylons = useMemo(
    () =>
      cached("car26-fw-pylons", () => {
        const p = plate(
          smoothOutline([
            [2930, 136],
            [2950, 136],
            [2945, 206],
            [2860, 206],
            [2820, 150],
          ]),
          14,
          36,
        );
        const strakes: BufferGeometry[] = [];
        for (const [z, front, len] of [
          [330, 2930, 340],
          [470, 2915, 300],
        ] as [number, number, number][]) {
          strakes.push(
            plate(
              smoothOutline([
                [front, 108],
                [front - len, 118],
                [front - len + 20, 82],
                [front - 80, 66],
              ]),
              10,
              z,
            ),
          );
        }
        const s = mergeAll(strakes);
        return mergeAll([p, mirrorZ(p), s, mirrorZ(s)]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={pylons} material={CAR_MAT.carbonSatin} castShadow />
    </group>
  );
}

export function FrontFlaps() {
  const geo = useMemo(
    () => cached("car26-fw-flaps", () => mergeAll([wingElement(FLAP, FW_FLAP1, 8), wingElement(FLAP, FW_FLAP2, 8), gurney(FW_FLAP2)])),
    [],
  );
  return (
    <AeroPivot hinge={FW_HINGE} angle={FW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
    </AeroPivot>
  );
}

/** Endplate centre plane: the element tips (z = 636) end inside it. */
const FW_EP_Z = 640;

/**
 * Front wing endplate (right side): the endplate body, the outboard
 * footplate reaching to 900 mm, the inboard footplate and a dive plane.
 */
export function FrontEndplates() {
  const geo = useMemo(
    () =>
      cached("car26-fw-endplates", () => {
        const z = FW_EP_Z;
        const ep = plate(
          smoothOutline(
            [
              [2955, 126],
              [2968, 230],
              [2930, 345],
              [2780, 404],
              [2520, 414],
              [2300, 402],
              [2186, 376],
              [2180, 250],
              [2200, 124],
              [2600, 118],
            ],
            8,
          ),
          12,
          z,
        );
        const horizontal = (pts: [number, number][], thick: number, y: number, dz: number, tilt = 0) => {
          const g = plate(smoothOutline(pts), thick, 0);
          g.rotateX(Math.PI / 2 - tilt);
          g.translate(0, y, z + dz);
          return g;
        };
        // Outboard footplate: a horizontal plate at the base running out to 900 mm.
        const foot = horizontal(
          [
            [2900, 0],
            [2850, 96],
            [2620, 118],
            [2420, 104],
            [2380, 20],
            [2500, -10],
          ],
          8,
          122,
          18,
        );
        // Inboard footplate: a narrow lip on the inner face at the base.
        const inner = horizontal(
          [
            [2880, 0],
            [2840, 40],
            [2300, 40],
            [2280, 0],
          ],
          6,
          124,
          -46,
        );
        // Dive plane on the outer face.
        const dive = horizontal(
          [
            [2900, 0],
            [2860, 70],
            [2620, 78],
            [2560, 10],
          ],
          6,
          292,
          8,
          0.12,
        );
        return mergeAll([ep, foot, inner, dive]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** Hydraulic actuator in the nose that rotates the primary flap. */
export function FrontActuator() {
  const geo = useMemo(
    () =>
      cached("car26-fw-actuator", () =>
        mergeAll([
          new CylinderGeometry(16, 16, 110, 18).rotateZ(Math.PI / 2).translate(2700, 222, 0),
          roundedBox(60, 38, 46, 8).clone().translate(2770, 222, 0),
          rod([2645, 222, 0], [2610, 196, 0], 8),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

// ---------------------------------------------------------------------------
// Rear wing (x from −1,865 to −2,330, |z| ≤ 575, y 770–925)

const RW_MAIN: WingStation[] = fullSpan([
  { z: 0, x: -1872, y: 786, chord: 262, angle: 0.16 },
  { z: 300, x: -1874, y: 792, chord: 262, angle: 0.17 },
  { z: 480, x: -1880, y: 812, chord: 256, angle: 0.19 },
  { z: 567, x: -1886, y: 834, chord: 246, angle: 0.2 },
]);

const flapAt = (z: number): WingStation => ({ z, x: -2112, y: 834, chord: 186, angle: 0.5 });
const RW_FLAP: WingStation[] = fullSpan([flapAt(0), flapAt(300), flapAt(REAR_WING.fixedTip)]);

/** The flap pivots about one axis between its mid-chord and trailing edge (here at 70%). */
export const RW_HINGE: [number, number, number] = [-2112 - 0.7 * 186 * Math.cos(0.5), 834 + 0.7 * 186 * Math.sin(0.5), 0];
export const RW_OPEN = 0.42;

export function RearMainplane() {
  const geo = useMemo(
    () =>
      cached("car26-rw-main", () => {
        // Fixed flap tips outboard of 535 mm, with their own Gurneys.
        const tipStations = [flapAt(REAR_WING.fixedTip + 3), flapAt(567)];
        const tips = mergeAll([wingElement(FLAP, tipStations, 2), gurney(tipStations)]);
        return mergeAll([wingElement(MAIN, RW_MAIN, 6), tips, mirrorZ(tips)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearFlap() {
  const geo = useMemo(() => cached("car26-rw-flap", () => mergeAll([wingElement(FLAP, RW_FLAP, 6), gurney(RW_FLAP)])), []);
  return (
    <AeroPivot hinge={RW_HINGE} angle={RW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
    </AeroPivot>
  );
}

/**
 * Rear wing separators (3–5 pairs are mandatory, C3.11.7): small blocks that
 * hold the slot gap between mainplane and flap in Corner Mode, and the
 * rotation brackets carrying the flap's pivot.
 */
export function RearSeparators() {
  const geo = useMemo(
    () =>
      cached("car26-rw-separators", () => {
        // In the slot, just behind the mainplane's trailing edge.
        const sx = -1872 - 262 * Math.cos(0.16) + 4;
        const sy = 786 + 262 * Math.sin(0.16) + 9;
        const parts: BufferGeometry[] = [];
        for (const z of [130, 300, 470]) {
          const b = roundedBox(34, 22, 8, 3).clone().translate(sx, sy, z);
          parts.push(b, mirrorZ(b));
        }
        // Rotation brackets: one on the centre line, one at each fixed tip.
        parts.push(roundedBox(70, 60, 16, 4).clone().translate(RW_HINGE[0], RW_HINGE[1] - 22, 0));
        const tip = roundedBox(60, 50, 10, 4).clone().translate(RW_HINGE[0], RW_HINGE[1] - 18, REAR_WING.fixedTip + 1);
        parts.push(tip, mirrorZ(tip));
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.titanium} castShadow />;
}

/** Rear wing endplate (right side) with its FIA LED light, 700–870 mm above the reference plane. */
export function RearEndplates() {
  const geo = useMemo(
    () =>
      cached("car26-rw-endplates", () =>
        plate(
          smoothOutline(
            [
              [-1852, 770],
              [-1858, 900],
              [-1900, 926],
              [-2300, 926],
              [-2380, 904],
              [-2412, 800],
              [-2420, 640],
              [-2380, 590],
              [-2200, 600],
              [-1990, 690],
            ],
            8,
          ),
          10,
          REAR_WING.half - 5,
        ),
      ),
    [],
  );
  const led = useMemo(() => cached("car26-rw-leds", () => new BoxGeometry(12, 150, 12).translate(-2412, Z(785), REAR_WING.half - 5)), []);
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />
      <mesh geometry={led} material={glow("#ff2430", 3)} />
    </group>
  );
}

/**
 * Single central pylon (≤25 mm thick) from the crash structure to the
 * mainplane, wrapped round the tailpipe; the small symmetric brace that
 * replaced the beam wing crosses it.
 */
export function RearPylon() {
  const geo = useMemo(
    () =>
      cached("car26-rw-pylon", () => {
        const p = plate(
          smoothOutline(
            [
              [-1960, 790],
              [-2120, 790],
              [-2180, 610],
              [-2290, 420],
              [-2140, CRASH.top - 10],
              [-2010, 560],
            ],
            6,
          ),
          24,
          0,
        );
        // Collar round the tailpipe where the pylon wraps it.
        const collar = new CylinderGeometry(TAILPIPE.bore / 2 + 14, TAILPIPE.bore / 2 + 14, 60, 32, 1, true).rotateZ(Math.PI / 2).translate(TAILPIPE.exitX + 40, TAILPIPE.y + 8, 0);
        const brace = wingElement(THIN, fullSpan([{ z: 0, x: -2160, y: 600, chord: 100, angle: 0 }, { z: 187, x: -2160, y: 600, chord: 100, angle: 0 }]), 2);
        return mergeAll([p, collar, brace]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The rear wing's single actuator, in a fairing at the pylon head, driving the flap. */
export function RearActuator() {
  const geo = useMemo(
    () =>
      cached("car26-rw-actuator", () =>
        mergeAll([
          roundedBox(120, 42, 36, 10).clone().translate(-2060, 812, 0),
          rod([-2110, 820, 0], [RW_HINGE[0] + 60, RW_HINGE[1] - 32, 0], 10),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}
