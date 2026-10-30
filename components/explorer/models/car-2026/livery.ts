import { bodyPaint as housePaint } from "../../kit/livery";
import { COCKPIT } from "./layout";

const f = (n: number) => n.toFixed(1);

/**
 * Functional surface detail on the 2026 bodywork: bare carbon on the
 * cockpit's inner walls (following the opening, which narrows by the
 * steering wheel), and the apertures cut into the bodywork (C3.16): rows of
 * cooling louvres on the sidepod tops, the slot along the engine cover spine
 * and the hot-air exit at the tail, drawn as dark openings.
 */
const FEATURES = /* glsl */ `
  float az = abs(p.z);
  float cw = ${f(COCKPIT.halfWidth)} - 18.0 * smoothstep(500.0, ${f(COCKPIT.front)}, p.x);
  if (p.x < ${f(COCKPIT.front + 26)} && p.x > ${f(COCKPIT.rear - 26)} && az < cw + 16.0 && p.y < 688.0) carbon = 1.0;
  if (p.x < -430.0 && p.x > -830.0 && az > 312.0 && az < 440.0 && p.y > 400.0) {
    float u = fract((p.x + 430.0) / 36.0);
    float slot = edge(u - 0.58) * (1.0 - edge(u - 0.9));
    col = mix(col, vec3(0.01), slot);
  }
  if (p.x < -1460.0 && p.x > -1790.0 && az < 10.0 && p.y > 480.0) col = vec3(0.01);
  if (p.x < -2004.0) col = vec3(0.012);
`;

/** The house livery applied to the 2026 car's bodywork. */
export function bodyPaint() {
  return housePaint("2026", null, FEATURES);
}
