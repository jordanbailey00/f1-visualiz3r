"use client";

import { useMemo } from "react";
import { CircleGeometry, CylinderGeometry, ExtrudeGeometry, Shape } from "three";
import { CAR_MAT, paintColour } from "../../kit/carMaterials";
import { cached, mergeAll } from "../../kit/geometry";
import { loft, mirrorZ, spline, type V3 } from "../../kit/loft";
import { naca, plate, smoothOutline, wingElement } from "../../kit/wing";
import { CAR, FLOOR } from "./layout";

const TOP = CAR.refY + 12;

/** Plan outline of the floor body (right half, x forward, z out). */
const PLAN: [number, number][] = [
  [FLOOR.front, 0],
  [FLOOR.front - 10, 220],
  [1180, 470],
  [FLOOR.boardsFront + 20, 720],
  [FLOOR.boardsFront - 30, 868],
  [900, 880],
  [700, 800],
  [600, FLOOR.half],
  [0, 762],
  [-800, 734],
  [FLOOR.rearStep + 20, FLOOR.rearHalf],
  [FLOOR.rearStep - 60, 640],
  [FLOOR.rearStep - 60, FLOOR.diffuserHalf + 15],
  [FLOOR.diffuserStart - 10, FLOOR.diffuserHalf],
  [FLOOR.diffuserStart - 10, 0],
];

function floorShape() {
  // Shape coordinates are (x, −z) so that, laid flat, the shape's y becomes +z.
  // The curved leading edge is smoothed; the notch round the diffuser stays sharp.
  const front = spline(PLAN.slice(0, 11), 4) as [number, number][];
  const half = [...front, ...PLAN.slice(11)];
  const pts = [...half, ...half.slice(1, -1).reverse().map(([x, z]) => [x, -z] as [number, number])];
  const s = new Shape();
  s.moveTo(pts[0][0], -pts[0][1]);
  for (const [x, z] of pts.slice(1)) s.lineTo(x, -z);
  s.closePath();
  return s;
}

/** The floor body: a flat carbon plate with an upturned edge lip and front fences. */
export function FloorBody() {
  const geo = useMemo(
    () =>
      cached("car26-floor", () => {
        const g = new ExtrudeGeometry(floorShape(), { depth: 10, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1.5, bevelSegments: 1, curveSegments: 6 });
        g.rotateX(-Math.PI / 2);
        g.translate(0, CAR.refY, 0);
        const uv = g.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 100, uv.getY(i) / 100);
        return g;
      }),
    [],
  );
  // Edge lip: a curled strip along the floor's outer edge.
  const lip = useMemo(
    () =>
      cached("car26-floor-lip", () => {
        const edge = PLAN.slice(6, 11);
        const rings: V3[][] = edge.map(([x, z]) => [
          [x, TOP, z - 14],
          [x, TOP + 26, z - 6],
          [x, TOP + 40, z + 6],
          [x, TOP + 30, z + 10],
          [x, TOP, z + 2],
        ]);
        const g = loft(rings, { along: 4, around: 1, closed: true, capStart: true, capEnd: true });
        return mergeAll([g, mirrorZ(g)]);
      }),
    [],
  );
  // Fences under the leading edge split the air into the floor channels.
  const fences = useMemo(
    () =>
      cached("car26-floor-fences", () => {
        const parts = [];
        for (const [z, len] of [
          [300, 420],
          [430, 380],
          [560, 320],
        ] as [number, number][]) {
          const f = plate(
            smoothOutline([
              [FLOOR.front - 120, CAR.refY],
              [FLOOR.front - 120 - len, CAR.refY],
              [FLOOR.front - 120 - len, CAR.refY - 6],
              [FLOOR.front - 160, CAR.refY - 26],
            ]),
            6,
            z,
          );
          f.rotateY(0.06);
          parts.push(f, mirrorZ(f));
        }
        return mergeAll(parts);
      }),
    [],
  );
  // Mandatory winglet ahead of each rear wheel.
  const winglets = useMemo(
    () =>
      cached("car26-floor-winglets", () => {
        const w = wingElement(naca(0.06, 0.4, 0.1), [
          { z: 610, x: FLOOR.rearStep + 70, y: TOP + 60, chord: 120, angle: 0.28 },
          { z: 700, x: FLOOR.rearStep + 60, y: TOP + 70, chord: 110, angle: 0.32 },
        ], 2);
        const stay = plate(
          [
            [FLOOR.rearStep + 60, TOP],
            [FLOOR.rearStep - 20, TOP],
            [FLOOR.rearStep - 30, TOP + 80],
            [FLOOR.rearStep + 40, TOP + 80],
          ],
          6,
          700,
        );
        const one = mergeAll([w, stay]);
        return mergeAll([one, mirrorZ(one)]);
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} material={CAR_MAT.carbonMatte} castShadow receiveShadow />
      <mesh geometry={lip} material={CAR_MAT.carbon} castShadow receiveShadow />
      <mesh geometry={fences} material={CAR_MAT.carbonMatte} castShadow />
      <mesh geometry={winglets} material={CAR_MAT.carbon} castShadow />
    </group>
  );
}

/**
 * In-wash floor boards ahead of the sidepods: up to three sections, 710–890 mm
 * out, the rear of each turned inward by at least 15°.
 */
export function FloorBoards() {
  const geo = useMemo(
    () =>
      cached("car26-boards", () => {
        const parts = [];
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
        // Hangers tying the boards together.
        for (const x of [880, 700]) {
          parts.push(new CylinderGeometry(5, 5, 150, 8).rotateX(Math.PI / 2).translate(x, 300, 800));
        }
        return mergeAll(parts);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
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
 * titanium skids. Measured for wear after every session.
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
    () =>
      cached("car26-skids", () =>
        mergeAll(
          [1150, 200, -900].map((x) => new CylinderGeometry(17, 17, 10.6, 24).translate(x, CAR.refY - 5, 0)),
        ),
      ),
    [],
  );
  const holes = useMemo(() => cached("car26-plank-hole", () => new CircleGeometry(20, 24).rotateX(Math.PI / 2)), []);
  return (
    <group>
      <mesh geometry={geo} material={plankWood} castShadow receiveShadow />
      <mesh geometry={skids} material={CAR_MAT.titaniumBlue} />
      {[1150, 200, -900].map((x) => (
        <mesh key={x} geometry={holes} material={CAR_MAT.composite} position={[x, CAR.refY - 10.4, 0]} />
      ))}
    </group>
  );
}

const plankWood = paintColour("plank", "#8a6a45", { roughness: 0.78, clearcoat: 0.1, metalness: 0 });
