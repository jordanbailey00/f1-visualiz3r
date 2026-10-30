"use client";

import { useMemo } from "react";
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  LatheGeometry,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  Path,
  RepeatWrapping,
  RingGeometry,
  Shape,
  SRGBColorSpace,
  Vector2,
  type BufferGeometry,
} from "three";
import { Shift } from "../../Part";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import { loft, superRing } from "../../kit/loft";
import { tyreGeometry, tyreMaterial } from "../../kit/tyre";
import { BRAKES, FRONT_SUSP, REAR_SUSP, RIM, TYRES, WHEEL } from "./layout";
import { ACCENT } from "./livery";

type Axle = "front" | "rear";
const COMPOUND = { name: "C4 SOFT", color: "#e8212b" };

/**
 * Both corners of an axle; children are built for the right-hand corner
 * (local z > 0 outboard). Parts that are symmetric fore and aft (tyres, rims)
 * are turned half a turn for the left side so their lettering still reads;
 * the rest are mirrored.
 */
function Pair({
  axle,
  out,
  range,
  turn = false,
  children,
}: {
  axle: Axle;
  out: number;
  range: [number, number];
  turn?: boolean;
  children: (side: 1 | -1) => React.ReactNode;
}) {
  const w = WHEEL[axle];
  return (
    <>
      {([1, -1] as const).map((s) => (
        <Shift key={s} explode={[0, 0, s * out]} explodeRange={range}>
          <group
            position={[w.x, w.y, s * w.z]}
            rotation={[0, turn && s < 0 ? Math.PI : 0, 0]}
            scale={[1, 1, !turn && s < 0 ? -1 : 1]}
          >
            {children(s)}
          </group>
        </Shift>
      ))}
    </>
  );
}

export function Tyres({ axle, out, range }: { axle: Axle; out: number; range: [number, number] }) {
  const spec = TYRES[axle];
  const geo = tyreGeometry(spec);
  const mat = useMemo(() => tyreMaterial(spec, COMPOUND, axle), [spec, axle]);
  return (
    <Pair axle={axle} out={out} range={range} turn>
      {() => <mesh geometry={geo} material={mat} castShadow receiveShadow />}
    </Pair>
  );
}

/** Rim cross-section: flanges, bead seats and the drop centre, spun round the axle. */
function rimGeometry(width: number) {
  return cached(`car26-rim:${width}`, () => {
    const a = width / 2;
    const outer: [number, number][] = [
      [RIM.flange - 6, -a],
      [RIM.flange, -a + 5],
      [RIM.flange, -a + 13],
      [RIM.bead, -a + 22],
      [RIM.bead, -a + 60],
      [RIM.bead - 16, -a + 80],
      [RIM.bead - 16, a - 80],
      [RIM.bead, a - 60],
      [RIM.bead, a - 22],
      [RIM.flange, a - 13],
      [RIM.flange, a - 5],
      [RIM.flange - 6, a],
    ];
    const inner = outer
      .slice()
      .reverse()
      .map(([r, z]) => [r - 7, z * 0.985] as [number, number]);
    const pts = [...outer, ...inner, outer[0]].map(([r, z]) => new Vector2(r, z));
    const g = new LatheGeometry(pts, 96);
    g.rotateX(Math.PI / 2);
    return g;
  });
}

/** Ten-spoke centre and hub, near the outer face. */
function spokes(width: number) {
  return cached(`car26-spokes:${width}`, () => {
    const parts: BufferGeometry[] = [];
    const z = width / 2 - 48;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const b = new BoxGeometry(150, 26, 22).translate(132, 0, 0).rotateZ(a);
      b.translate(0, 0, z);
      parts.push(b);
    }
    parts.push(new CylinderGeometry(64, 70, 60, 36).rotateX(Math.PI / 2).translate(0, 0, z));
    return mergeAll(parts);
  });
}

/** The mandatory outboard wheel cover: a composite disc over the rim face. */
function coverDisc(width: number) {
  return cached(`car26-cover:${width}`, () => {
    const s = new Shape();
    s.absarc(0, 0, RIM.flange - 4, 0, Math.PI * 2, false);
    const hole = new Path();
    hole.absarc(0, 0, 58, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new ExtrudeGeometry(s, { depth: 3, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelSegments: 1, curveSegments: 48 });
    g.translate(0, 0, width / 2 - 6);
    return g;
  });
}

export function Rims({ axle, out, range }: { axle: Axle; out: number; range: [number, number] }) {
  const w = TYRES[axle].width - 24;
  const rim = rimGeometry(w);
  const sp = spokes(w);
  const cover = coverDisc(w);
  const nut = useMemo(
    () =>
      cached(`car26-nut:${w}`, () =>
        mergeAll([
          new CylinderGeometry(42, 46, 44, 6).rotateX(Math.PI / 2).translate(0, 0, w / 2 + 6),
          new CylinderGeometry(24, 24, 60, 20).rotateX(Math.PI / 2).translate(0, 0, w / 2 + 4),
        ]),
      ),
    [w],
  );
  return (
    <Pair axle={axle} out={out} range={range} turn>
      {() => (
        <>
          <mesh geometry={rim} material={rimPaint} castShadow receiveShadow />
          <mesh geometry={sp} material={rimPaint} castShadow />
          <mesh geometry={cover} material={CAR_MAT.carbon} castShadow receiveShadow />
          <mesh geometry={cached("car26-cover-ring", () => new RingGeometry(RIM.flange - 26, RIM.flange - 18, 96))} material={paintColour("car26-cyan", ACCENT, { roughness: 0.3 })} position={[0, 0, w / 2 - 1.4]} />
          <mesh geometry={nut} material={nutMat} castShadow />
        </>
      )}
    </Pair>
  );
}

const rimPaint = paintColour("car26-rim", "#1a1c20", { roughness: 0.38, metalness: 0.7, clearcoat: 0.4 });
const nutMat = paintColour("car26-nut", "#c8102e", { roughness: 0.3, metalness: 0.8, clearcoat: 0.6 });

let ventTex: CanvasTexture | null = null;
/** Rows of radial ventilation holes round the disc's edge (≈1,000+ on a front disc). */
function discVents() {
  if (ventTex) return ventTex;
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a3a3b";
  g.fillRect(0, 0, 2048, 128);
  for (let row = 0; row < 5; row++) {
    for (let i = 0; i < 220; i++) {
      g.fillStyle = "#0b0b0c";
      g.beginPath();
      g.arc(((i + (row % 2) * 0.5) / 220) * 2048, 14 + row * 25, 7, 0, Math.PI * 2);
      g.fill();
    }
  }
  ventTex = new CanvasTexture(c);
  ventTex.colorSpace = SRGBColorSpace;
  ventTex.wrapS = RepeatWrapping;
  ventTex.minFilter = LinearMipmapLinearFilter;
  ventTex.anisotropy = 8;
  return ventTex;
}

let ventMat: MeshPhysicalMaterial | null = null;

export function Brakes({ axle, out, range }: { axle: Axle; out: number; range: [number, number] }) {
  const b = BRAKES[axle];
  const zDisc = -TYRES[axle].width / 2 + 70;
  const parts = useMemo(
    () =>
      cached(`car26-brakes:${axle}`, () => {
        const disc = new CylinderGeometry(b.radius, b.radius, b.thick, 64, 1, true).rotateX(Math.PI / 2).translate(0, 0, zDisc);
        // Friction faces: annuli either side.
        const faceShape = new Shape();
        faceShape.absarc(0, 0, b.radius, 0, Math.PI * 2, false);
        const h = new Path();
        h.absarc(0, 0, b.radius * 0.66, 0, Math.PI * 2, true);
        faceShape.holes.push(h);
        const face = new ExtrudeGeometry(faceShape, { depth: b.thick, bevelEnabled: false, curveSegments: 48 }).translate(0, 0, zDisc - b.thick / 2);
        const bell = new CylinderGeometry(b.radius * 0.66, b.radius * 0.66, 18, 40).rotateX(Math.PI / 2).translate(0, 0, zDisc + 12);
        // Caliper straddling the disc behind the axle.
        const cs = new Shape();
        const a0 = Math.PI * 0.78;
        const a1 = Math.PI * 1.28;
        cs.absarc(0, 0, b.radius + 22, a0, a1, false);
        cs.absarc(0, 0, b.radius - 46, a1, a0, true);
        cs.closePath();
        const caliper = new ExtrudeGeometry(cs, { depth: b.thick + 56, bevelEnabled: true, bevelThickness: 6, bevelSize: 6, bevelSegments: 2, curveSegments: 20 }).translate(0, 0, zDisc - b.thick / 2 - 28);
        return { disc, face, bell, caliper };
      }),
    [axle],
  );
  if (!ventMat) {
    ventMat = new MeshPhysicalMaterial({ map: discVents(), roughness: 0.8, metalness: 0.1 });
  }
  return (
    <Pair axle={axle} out={out} range={range}>
      {() => (
        <>
          <mesh geometry={parts.disc} material={ventMat!} castShadow />
          <mesh geometry={parts.face} material={CAR_MAT.brakeCarbon} castShadow receiveShadow />
          <mesh geometry={parts.bell} material={CAR_MAT.titanium} castShadow />
          <mesh geometry={parts.caliper} material={CAR_MAT.anodisedDark} castShadow receiveShadow />
        </>
      )}
    </Pair>
  );
}

/**
 * Brake duct assembly: the inlet scoop on the inboard side and the carbon
 * drum that wraps disc and caliper, channelling air through the disc and out
 * through the wheel.
 */
export function BrakeDucts({ axle, out, range }: { axle: Axle; out: number; range: [number, number] }) {
  const t = TYRES[axle].width;
  const geo = useMemo(
    () =>
      cached(`car26-ducts:${axle}`, () => {
        const r = RIM.bead - 30;
        const drum = new CylinderGeometry(r, r, 110, 48, 1, true).rotateX(Math.PI / 2).translate(0, 0, -t / 2 + 62);
        const back = new CylinderGeometry(r, r, 4, 48).rotateX(Math.PI / 2).translate(0, 0, -t / 2 + 6);
        // Scoop: from the drum's inboard face forward to a mouth facing the oncoming air.
        const zs = -t / 2 - 26;
        const dy = axle === "front" ? -50 : -20;
        const scoop = loft(
          [
            superRing(120, dy + 10, 26, 46, 46, { cz: zs + 6, n: 3.2 }),
            superRing(220, dy, 36, 62, 62, { cz: zs, n: 3.2 }),
            superRing(300, dy - 6, 42, 72, 72, { cz: zs - 6, n: 3.2 }),
          ],
          { along: 4, around: 1, capStart: true, capEnd: true },
        );
        // Rear deflector on the drum (its shape is prescribed on the front wheels).
        const deflector = roundedBox(18, 120, 60, 4).clone().translate(-r + 6, 60, -t / 2 + 30);
        return mergeAll([drum, back, scoop, deflector]);
      }),
    [axle, t],
  );
  // The dark mouth of the scoop, facing the oncoming air.
  const mouth = useMemo(
    () =>
      cached(`car26-duct-mouth:${axle}`, () => {
        const dy = axle === "front" ? -50 : -20;
        const g = new CircleGeometry(1, 32);
        g.scale(34, 60, 1);
        g.rotateY(Math.PI / 2);
        g.translate(302.5, dy - 6, -t / 2 - 32);
        return g;
      }),
    [axle, t],
  );
  return (
    <Pair axle={axle} out={out} range={range}>
      {() => (
        <>
          <mesh geometry={geo} material={CAR_MAT.carbonSatin} castShadow receiveShadow />
          <mesh geometry={mouth} material={ductMouth} />
        </>
      )}
    </Pair>
  );
}

const ductMouth = paintColour("ductMouth", "#050506", { roughness: 1, clearcoat: 0, metalness: 0 });

/** The upright: the hub carrier joining wheel, brakes and suspension. */
export function Uprights({ axle, out, range }: { axle: Axle; out: number; range: [number, number] }) {
  const w = WHEEL[axle];
  const s = axle === "front" ? FRONT_SUSP : REAR_SUSP;
  const geo = useMemo(
    () =>
      cached(`car26-upright:${axle}`, () => {
        const upper = s.upper.outer;
        const lower = s.lower.outer;
        const shape = new Shape();
        const ux = upper[0] - w.x;
        const uy = upper[1] - w.y;
        const lx = lower[0] - w.x;
        const ly = lower[1] - w.y;
        shape.moveTo(lx - 30, ly);
        shape.lineTo(lx + 30, ly);
        shape.quadraticCurveTo(90, -40, 70, 20);
        shape.lineTo(ux + 26, uy);
        shape.lineTo(ux - 26, uy);
        shape.quadraticCurveTo(-90, 40, -70, -20);
        shape.closePath();
        const zIn = upper[2] - w.z;
        const body = new ExtrudeGeometry(shape, { depth: 46, bevelEnabled: true, bevelThickness: 6, bevelSize: 6, bevelSegments: 2 }).translate(0, 0, zIn - 23);
        const hub = new CylinderGeometry(52, 58, -zIn + 20, 32).rotateX(Math.PI / 2).translate(0, 0, zIn / 2);
        // Steering arm (front) or toe-link arm (rear).
        const arm = roundedBox(110, 30, 36, 8).clone().translate(axle === "front" ? 70 : -130, axle === "front" ? -52 : -20, zIn);
        return mergeAll([body, hub, arm]);
      }),
    [axle],
  );
  return <Pair axle={axle} out={out} range={range}>{() => <mesh geometry={geo} material={CAR_MAT.titanium} castShadow receiveShadow />}</Pair>;
}
