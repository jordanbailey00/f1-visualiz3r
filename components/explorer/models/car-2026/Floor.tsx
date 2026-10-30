"use client";

import { useMemo } from "react";
import { CircleGeometry, CylinderGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorZ, spline, type V3 } from "../../kit/loft";
import { rod } from "../../kit/strut";
import { naca, plate, smoothOutline, wingElement } from "../../kit/wing";
import { CAR, FLOOR, PLANK_HOLES, XR, Z } from "./layout";

const TOP = CAR.refY + 12;

/** The raised floor inlets: from the main floor at x = INLET.rear up to Z = 150 at the lip. */
const INLET = { rear: 860, lip: 1240, inner: 210, outer: 740, rise: 150 };
const inletY = (x: number) => {
  const t = Math.min(1, Math.max(0, (x - INLET.rear) / (INLET.lip - INLET.rear)));
  return CAR.refY + INLET.rise * Math.pow(t * t * (3 - 2 * t), 1.15);
};

/**
 * Plan outline of the main floor (right half, x forward, z out): a centre
 * strip under the chassis, a notch where the inlets rise, the floor foot out
 * to the boards, the edge back to the rear wheels and the step round the
 * diffuser.
 */
function floorShape() {
  const edge = spline(
    [
      [1080, 745],
      [1060, 860],
      [900, 880],
      [700, 800],
      [600, FLOOR.half],
      [0, 762],
      [-800, 734],
      [FLOOR.rearStep + 20, FLOOR.rearHalf],
    ],
    4,
  ) as [number, number][];
  const half: [number, number][] = [
    [FLOOR.front, 0],
    [FLOOR.front, 190],
    [FLOOR.front - 40, INLET.inner - 5],
    [INLET.rear, INLET.inner],
    [INLET.rear, INLET.outer],
    ...edge,
    [FLOOR.rearStep - 60, 640],
    [FLOOR.rearStep - 60, FLOOR.diffuserHalf + 15],
    [FLOOR.diffuserStart - 10, FLOOR.diffuserHalf],
    [FLOOR.diffuserStart - 10, 0],
  ];
  // Shape coordinates are (x, −z) so that, laid flat, the shape's y becomes +z.
  const pts = [...half, ...half.slice(1, -1).reverse().map(([x, z]) => [x, -z] as [number, number])];
  const s = new Shape();
  s.moveTo(pts[0][0], -pts[0][1]);
  for (const [x, z] of pts.slice(1)) s.lineTo(x, -z);
  s.closePath();
  return { shape: s, edge };
}

/** One floor inlet sheet (right side), curving up from the main floor to its lip. */
function inletSheet() {
  const xs = [INLET.rear - 20, 950, 1040, 1120, 1190, INLET.lip];
  const ring = (z: number): V3[] => [...xs.map((x) => [x, inletY(x) + 8, z] as V3), ...xs.slice().reverse().map((x) => [x, inletY(x), z] as V3)];
  return loft([ring(INLET.inner), ring((INLET.inner + INLET.outer) / 2), ring(INLET.outer)], { along: 3, around: 1, closed: true, capStart: true, capEnd: true });
}

/** The floor body: main floor with its edge, the raised inlets with their fences, and the floor corners. */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car26-floor", () => {
        const { shape } = floorShape();
        const g = new ExtrudeGeometry(shape, { depth: 10, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1.5, bevelSegments: 1, curveSegments: 6 });
        g.rotateX(-Math.PI / 2);
        g.translate(0, CAR.refY, 0);
        const uv = g.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 100, uv.getY(i) / 100);
        const inlet = inletSheet();
        return mergeAll([g, inlet, mirrorZ(inlet)]);
      }),
    [],
  );
  // Floor sidewall: a curled strip along the outer edge.
  const lip = useMemo(
    () =>
      cached("car26-floor-lip", () => {
        const { edge } = floorShape();
        const rings: V3[][] = edge.slice(8).map(([x, z]) => [
          [x, TOP, z - 14],
          [x, TOP + 26, z - 6],
          [x, TOP + 40, z + 6],
          [x, TOP + 30, z + 10],
          [x, TOP, z + 2],
        ]);
        const g = loft(rings, { along: 2, around: 1, closed: true, capStart: true, capEnd: true });
        return mergeAll([g, mirrorZ(g)]);
      }),
    [],
  );
  // One fence each side under the inlet (within a 450 × 40 × 200 mm box), and the floor corners.
  const fences = useMemo(
    () =>
      cached("car26-floor-fences", () => {
        const xs = [INLET.lip - 10, 1180, 1100, 1000, 900, INLET.lip - 450];
        const top: [number, number][] = xs.map((x) => [x, inletY(x) - 1]);
        const fence = plate([...top, [INLET.lip - 450, CAR.refY - 22], [INLET.lip - 10, CAR.refY - 22]], 12, 0);
        fence.rotateY(0.05);
        fence.translate(0, 0, 470);
        const corner = plate(
          smoothOutline([
            [FLOOR.rearStep + 30, TOP],
            [FLOOR.rearStep - 60, TOP],
            [FLOOR.rearStep - 66, TOP + 70],
            [FLOOR.rearStep - 20, TOP + 96],
            [FLOOR.rearStep + 40, TOP + 40],
          ]),
          8,
          0,
        );
        // Toe the corner vane in about its own centre.
        corner.translate(-FLOOR.rearStep, 0, 0);
        corner.rotateY(0.18);
        corner.translate(FLOOR.rearStep, 0, 668);
        return mergeAll([fence, mirrorZ(fence), corner, mirrorZ(corner)]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={lip} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={fences} material={CAR_MAT.carbonMatte} castShadow />
    </group>
  );
}

/**
 * The floor bib under the forward chassis, and the leading-edge device: slim
 * vanes ahead of the inlets that start shaping the flow under the floor.
 */
export function FloorFront() {
  const geo = useMemo(
    () =>
      cached("car26-floor-front", () => {
        const s = new Shape();
        const pts: [number, number][] = [
          [FLOOR.front - 20, 205],
          [1500, 216],
          [1600, 160],
          [1620, 0],
        ];
        s.moveTo(pts[0][0], -pts[0][1]);
        for (const [x, z] of pts.slice(1)) s.lineTo(x, -z);
        for (const [x, z] of pts.slice(0, -1).reverse()) s.lineTo(x, z);
        s.closePath();
        const bib = new ExtrudeGeometry(s, { depth: 10, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 1 });
        bib.rotateX(-Math.PI / 2);
        bib.translate(0, CAR.refY + 2, 0);
        const uv = bib.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 100, uv.getY(i) / 100);
        const profile = naca(0.05, 0.4, 0.12, 14);
        const vane = (x: number, y: number, chord: number) =>
          wingElement(profile, [
            { z: INLET.inner + 20, x, y, chord, angle: -0.08 },
            { z: (INLET.inner + INLET.outer) / 2, x: x - 10, y: y + 4, chord, angle: -0.06 },
            { z: INLET.outer - 10, x: x - 30, y: y + 12, chord: chord * 0.9, angle: -0.04 },
          ]);
        const led = mergeAll([vane(INLET.lip + 70, inletY(INLET.lip) + 6, 56), vane(INLET.lip + 128, inletY(INLET.lip) + 30, 44)]);
        return { bib, led: mergeAll([led, mirrorZ(led)]) };
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo.bib} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={geo.led} material={CAR_MAT.carbon} castShadow />
    </group>
  );
}

/**
 * The mandatory floor winglet (C3.5.8): a single small wing outboard of the
 * diffuser wall, pivoted about [XR + 295, Z 200].
 */
export function FloorWinglets() {
  const geo = useMemo(
    () =>
      cached("car26-floor-winglets", () => {
        const x = XR - 295;
        const w = wingElement(naca(0.07, 0.4, 0.1, 18), [
          { z: FLOOR.diffuserHalf + 12, x: x + 70, y: Z(200) + 4, chord: 140, angle: 0.3 },
          { z: 540, x: x + 60, y: Z(200) + 18, chord: 128, angle: 0.36 },
        ], 2);
        const hanger = plate(
          [
            [x + 40, Z(200) - 10],
            [x - 30, Z(200) - 10],
            [x - 40, Z(200) - 70],
            [x + 30, Z(200) - 70],
          ],
          6,
          540,
        );
        const one = mergeAll([w, hanger]);
        return mergeAll([one, mirrorZ(one)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * In-wash floor boards ahead of the sidepods (right side): up to three
 * sections, 710–890 mm out, the rear of each turned inward by at least 15°,
 * with hangers between them.
 */
export function FloorBoards() {
  const geo = useMemo(
    () =>
      cached("car26-boards", () => {
        const parts: BufferGeometry[] = [];
        const boards: { z: number; top: number; front: number; rear: number; turn: number }[] = [
          { z: 860, top: 470, front: 1040, rear: 640, turn: 0.3 },
          { z: 800, top: 400, front: 1000, rear: 520, turn: 0.34 },
          { z: 740, top: 330, front: 960, rear: 400, turn: 0.38 },
        ];
        for (const b of boards) {
          const outline = smoothOutline(
            [
              [b.front, TOP],
              [b.front + 10, TOP + (b.top - TOP) * 0.6],
              [b.front - 60, b.top],
              [(b.front + b.rear) / 2, b.top - 20],
              [b.rear + 40, b.top - 90],
              [b.rear, TOP + 40],
              [b.rear + 30, TOP],
            ],
            6,
          );
          const g = plate(outline, 8, 0);
          // Hinge the board about its leading edge so the tail turns inboard.
          g.translate(-b.front, 0, 0);
          g.rotateY(-b.turn);
          g.translate(b.front, 0, b.z);
          parts.push(g);
        }
        for (const x of [880, 700]) parts.push(new CylinderGeometry(5, 5, 150, 8).rotateX(Math.PI / 2).translate(x, 300, 800));
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Floor auxiliaries (right side): the floor board brace (a 40 mm tube from
 * the forward chassis), the floor foot stay and two slim floor body stays.
 */
export function FloorStays() {
  const geo = useMemo(
    () =>
      cached("car26-floor-stays", () =>
        mergeAll([
          rod([980, 300, 240], [962, 320, 742], 40),
          rod([1000, 280, 250], [1060, 140, 760], 10),
          rod([120, 430, 588], [120, 64, 742], 5),
          rod([-420, 380, 524], [-420, 64, 724], 5),
        ]),
      ),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.anodisedDark} castShadow />;
}

/**
 * The diffuser: from 600 mm ahead of the rear axle the floor's underside
 * ramps up to 250 mm above the reference plane, between side walls and
 * strakes. Much larger than in 2022–25.
 */
export function Diffuser() {
  const geo = useMemo(
    () =>
      cached("car26-diffuser", () => {
        // Height of the ramp above the reference plane: 75 → 175 → 250 mm.
        const knots: [number, number][] = [
          [FLOOR.diffuserStart + 40, 12],
          [FLOOR.diffuserStart - 50, 75],
          [-1350, 175],
          [FLOOR.diffuserEnd, 250],
        ];
        const height = (x: number) => {
          for (let i = 0; i < knots.length - 1; i++) {
            const [x0, h0] = knots[i];
            const [x1, h1] = knots[i + 1];
            if (x <= x0 && x >= x1) return h0 + ((x0 - x) / (x0 - x1)) * (h1 - h0);
          }
          return x > knots[0][0] ? knots[0][1] : knots[knots.length - 1][1];
        };
        const xs = [FLOOR.diffuserStart + 40, FLOOR.diffuserStart - 50, -1250, -1350, -1600, -1800, FLOOR.diffuserEnd];
        const W = FLOOR.diffuserHalf;
        // Ramp surface as a thin closed section across the span.
        const rings: V3[][] = xs.map((x) => {
          const y = CAR.refY + height(x);
          return [
            [x, y + 8, -W],
            [x, y + 8, 0],
            [x, y + 8, W],
            [x, y, W],
            [x, y, 0],
            [x, y, -W],
          ];
        });
        const ramp = loft(rings, { along: 6, around: 1, closed: true, capStart: false, capEnd: true });
        const parts = [ramp];
        // Side walls and strakes follow the ramp down to the reference plane.
        for (const z of [W, 190]) {
          const out: [number, number][] = [];
          for (const x of xs) out.push([x, CAR.refY + height(x) + 6]);
          out.push([FLOOR.diffuserEnd, CAR.refY - 4], [FLOOR.diffuserStart + 40, CAR.refY - 4]);
          const wall = plate(out, z === W ? 10 : 6, z);
          parts.push(wall, mirrorZ(wall));
        }
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * The plank: a 10 mm composite skid board under the centre of the floor
 * (250 mm wide, narrowing to 150 at the front and 100 at the rear), with
 * three 34 mm holes and metal skids. Measured for wear after every session.
 */
export function Plank() {
  const geo = useMemo(
    () =>
      cached("car26-plank", () => {
        const s = new Shape();
        const pts: [number, number][] = [
          [1270, 75],
          [900, 125],
          [-1000, 125],
          [-1350, 50],
        ];
        s.moveTo(pts[0][0], -pts[0][1]);
        for (const [x, z] of pts.slice(1)) s.lineTo(x, -z);
        for (const [x, z] of pts.slice().reverse()) s.lineTo(x, z);
        s.closePath();
        const g = new ExtrudeGeometry(s, { depth: 10, bevelEnabled: false });
        g.rotateX(-Math.PI / 2);
        g.translate(0, CAR.refY - 10, 0);
        return g;
      }),
    [],
  );
  const skids = useMemo(
    () => cached("car26-skids", () => mergeAll(PLANK_HOLES.map((x) => new CylinderGeometry(34, 34, 10.6, 32).translate(x, CAR.refY - 5, 0)))),
    [],
  );
  const holes = useMemo(() => cached("car26-plank-hole", () => new CircleGeometry(17, 24).rotateX(Math.PI / 2)), []);
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={skids} material={CAR_MAT.titanium} />
      {PLANK_HOLES.map((x) => (
        <mesh key={x} geometry={holes} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, 0]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#7d6346", { roughness: 0.8, clearcoat: 0.1, metalness: 0 });
