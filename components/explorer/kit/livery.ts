import { liveryMaterial } from "./carMaterials";

/**
 * The house livery, identical for every era: one neutral satin paint on the
 * bodywork shells (survival cell, nose, engine cover, sidepods, halo fairing,
 * mirror housings), bare carbon on wings, floor, suspension and structure,
 * and natural metals on the mechanical parts. Nothing decorative, so the eye
 * goes to the parts rather than the paint.
 */
export const LIVERY = {
  paint: "#e2e5e8",
  roughness: 0.42,
  clearcoat: 0.4,
};

export interface CockpitBox {
  front: number;
  rear: number;
  halfWidth: number;
  /** Height of the cockpit rim; the tub interior below it is bare carbon. */
  rimY: number;
}

/**
 * Body paint for one era's car; the inside of the cockpit shows bare carbon.
 * `features` is optional GLSL for functional surface detail (cooling louvres,
 * exits) in the same `liveryPattern` scope.
 */
export function bodyPaint(era: string, cockpit: CockpitBox | null, features = "") {
  const f = (n: number) => n.toFixed(1);
  const box = cockpit
    ? `if (p.x < ${f(cockpit.front)} && p.x > ${f(cockpit.rear)} && abs(p.z) < ${f(cockpit.halfWidth)} && p.y < ${f(cockpit.rimY)}) carbon = 1.0;`
    : "";
  return liveryMaterial({
    key: `body-${era}`,
    base: LIVERY.paint,
    colors: {},
    roughness: LIVERY.roughness,
    clearcoat: LIVERY.clearcoat,
    glsl: /* glsl */ `
      ${box}
      ${features}
    `,
  });
}
