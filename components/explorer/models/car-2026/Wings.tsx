"use client";

import { useMemo } from "react";
import { BoxGeometry, CanvasTexture, CylinderGeometry, PlaneGeometry, SRGBColorSpace } from "three";
import { FONT_SANS } from "@/lib/three/painter";
import { AeroPivot, useMirrorSide } from "../../Part";
import { CAR_MAT, glow, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { mirrorZ } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { fullSpan, naca, plate, smoothOutline, wingElement, type WingStation } from "../../kit/wing";
import { CRASH, REAR_WING } from "./layout";
import { ACCENT, NAVY } from "./livery";

/** Highly cambered, inverted sections (the suction side faces the ground). */
const MAIN = naca(0.075, 0.38, 0.085);
const FLAP = naca(0.09, 0.42, 0.075);
const THIN = naca(0, 0.4, 0.12, 16, false);

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

/** The primary flap (every element but the mainplane) pivots about its leading edge. */
export const FW_HINGE: [number, number, number] = [2640, 150, 0];
/** Incidence removed in Straight Mode (not set by the rules; ≈11° here). */
export const FW_OPEN = 0.2;

export function FrontMainplane() {
  const geo = useMemo(() => cached("car26-fw-main", () => wingElement(MAIN, FW_MAIN, 8)), []);
  // Short pylons carry the nose tip down onto the mainplane.
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
        return mergeAll([p, mirrorZ(p)]);
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

/** Cyan Gurney strip along the top flap's trailing edge. */
const fwGurney = (() => {
  const st = FW_FLAP2.map((s) => ({ ...s, x: s.x - s.chord * Math.cos(s.angle) + 4, y: s.y + s.chord * Math.sin(s.angle) - 2, chord: 14, angle: 1.35 }));
  return wingElement(naca(0, 0.5, 0.3, 8, false), st, 4);
})();

export function FrontFlaps() {
  const flap1 = useMemo(() => cached("car26-fw-flap1", () => wingElement(FLAP, FW_FLAP1, 8)), []);
  const flap2 = useMemo(() => cached("car26-fw-flap2", () => wingElement(FLAP, FW_FLAP2, 8)), []);
  return (
    <AeroPivot hinge={FW_HINGE} angle={FW_OPEN}>
      <mesh geometry={flap1} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={flap2} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={fwGurney} material={paintColour("car26-cyan", ACCENT, { roughness: 0.3 })} castShadow />
    </AeroPivot>
  );
}

/** Endplate centre plane: the element tips (z = 636) end inside it. */
const FW_EP_Z = 640;

/** Endplates with footplates reaching out to 900 mm and a dive plane. */
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
        // Footplate: a horizontal plate at the base running outboard.
        const foot = plate(
          smoothOutline([
            [2900, 0],
            [2850, 96],
            [2620, 118],
            [2420, 104],
            [2380, 20],
            [2500, -10],
          ]),
          8,
          0,
        );
        foot.rotateX(Math.PI / 2);
        foot.translate(0, 122, z + 18);
        // Dive plane on the outer face.
        const dive = plate(
          smoothOutline([
            [2900, 0],
            [2860, 70],
            [2620, 78],
            [2560, 10],
          ]),
          6,
          0,
        );
        dive.rotateX(Math.PI / 2 - 0.12);
        dive.translate(0, 292, z + 8);
        return mergeAll([ep, foot, dive]);
      }),
    [],
  );
  // Cyan leading edge strip on the outer face.
  const stripe = useMemo(
    () =>
      cached("car26-fw-ep-stripe", () => {
        const z = FW_EP_Z + 6.6;
        const s = plate(
          smoothOutline([
            [2962, 150],
            [2970, 230],
            [2934, 340],
            [2900, 356],
            [2932, 230],
            [2924, 150],
          ]),
          1.2,
          z,
          0.3,
        );
        return s;
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />
      <mesh geometry={stripe} material={paintColour("car26-cyan", ACCENT, { roughness: 0.3 })} />
    </group>
  );
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

/** The flap pivots between its mid-chord and trailing edge (here at 70%). */
export const RW_HINGE: [number, number, number] = [-2112 - 0.7 * 186 * Math.cos(0.5), 834 + 0.7 * 186 * Math.sin(0.5), 0];
export const RW_OPEN = 0.42;

export function RearMainplane() {
  const geo = useMemo(() => cached("car26-rw-main", () => wingElement(MAIN, RW_MAIN, 6)), []);
  // Fixed flap tips outboard of 535 mm.
  const tips = useMemo(
    () =>
      cached("car26-rw-tips", () => {
        const t = wingElement(FLAP, [flapAt(REAR_WING.fixedTip + 3), flapAt(567)], 2);
        return mergeAll([t, mirrorZ(t)]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={tips} material={CAR_MAT.carbon} castShadow receiveShadow />
    </group>
  );
}

export function RearFlap() {
  const geo = useMemo(() => cached("car26-rw-flap", () => wingElement(FLAP, RW_FLAP, 6)), []);
  return (
    <AeroPivot hinge={RW_HINGE} angle={RW_OPEN}>
      <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />
      {/* Cyan Gurney strip along the trailing edge. */}
      <mesh
        geometry={cached("car26-rw-gurney", () => new BoxGeometry(5, 9, REAR_WING.fixedTip * 2 - 6))}
        material={paintColour("car26-cyan", ACCENT, { roughness: 0.3 })}
        position={[-2112 - 186 * Math.cos(0.5) + 1, 834 + 186 * Math.sin(0.5) + 3, 0]}
        rotation={[0, 0, 0.5]}
      />
    </AeroPivot>
  );
}

let numberTex: CanvasTexture | null = null;
/** The car's race number, as carried on the endplates and nose. */
export function numberTexture() {
  if (numberTex) return numberTex;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 512, 512);
  g.fillStyle = "#eef1f4";
  g.font = `700 380px ${FONT_SANS}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("26", 256, 270);
  numberTex = new CanvasTexture(c);
  numberTex.colorSpace = SRGBColorSpace;
  return numberTex;
}

export function RearEndplates() {
  const geo = useMemo(
    () =>
      cached("car26-rw-endplates", () => {
        const ep = plate(
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
        );
        return ep;
      }),
    [],
  );
  const leds = useMemo(
    () =>
      cached("car26-rw-leds", () => {
        return new BoxGeometry(12, 150, 12).translate(-2412, 800, REAR_WING.half - 5);
      }),
    [],
  );
  const side = useMirrorSide();
  const number = useMemo(() => new PlaneGeometry(130, 130), []);
  const numberMat = useMemo(() => {
    const m = paintColour("car26-number", "#ffffff", { roughness: 0.35, clearcoat: 0.6 }).clone();
    m.map = numberTexture();
    m.transparent = true;
    m.alphaTest = 0.4;
    return m;
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={paintColour("car26-navy", NAVY, { roughness: 0.34 })} castShadow receiveShadow />
      <mesh geometry={leds} material={glow("#ff2430", 3)} />
      {/* The mirrored copy flips the plane back so the number still reads. */}
      <mesh geometry={number} material={numberMat} position={[-2170, 770, REAR_WING.half + 0.8]} scale={[side, 1, 1]} />
    </group>
  );
}

/**
 * Single central pylon (≤25 mm thick) from the crash structure to the
 * mainplane, wrapped round the exhaust; the small brace that replaced the
 * beam wing crosses it.
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
              [-2010, 520],
            ],
            6,
          ),
          24,
          0,
        );
        const brace = wingElement(THIN, fullSpan([{ z: 0, x: -2160, y: 560, chord: 100, angle: 0 }, { z: 187, x: -2160, y: 560, chord: 100, angle: 0 }]), 2);
        return mergeAll([p, brace]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />;
}

/** The rear wing's single actuator, in the pylon head, driving the flap. */
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
