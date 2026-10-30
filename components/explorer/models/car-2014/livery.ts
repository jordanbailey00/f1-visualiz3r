import { bodyPaint as housePaint } from "../../kit/livery";
import { COCKPIT } from "./layout";

const f = (n: number) => n.toFixed(1);

/**
 * Functional surface detail on the 2014–16 bodywork: bare carbon on the
 * cockpit's inner walls (following the opening, which narrows by the
 * steering wheel), and the cooling apertures cut into the bodywork: rows of
 * cooling louvres on the sidepod tops and the cannon exit at the tail, drawn
 * as dark openings.
 */
const FEATURES = /* glsl */ `
  float az = abs(p.z);
  float cw = ${f(COCKPIT.halfWidth)} - 18.0 * smoothstep(500.0, ${f(COCKPIT.front)}, p.x);
  if (p.x < ${f(COCKPIT.front + 26)} && p.x > ${f(COCKPIT.rear - 26)} && az < cw + 16.0 && p.y < 700.0) carbon = 1.0;
  if (p.x < -480.0 && p.x > -900.0 && az > 300.0 && az < 440.0 && p.y > 420.0) {
    float u = fract((p.x + 480.0) / 36.0);
    float slot = edge(u - 0.58) * (1.0 - edge(u - 0.9));
    col = mix(col, vec3(0.01), slot);
  }
  if (p.x < -2146.0) col = vec3(0.012);
`;

/** The house livery applied to the 2014–2016 car's bodywork. */
export function bodyPaint() {
  return housePaint("2014", null, FEATURES);
}
