import { bodyPaint as housePaint } from "../../kit/livery";
import { COCKPIT } from "./layout";

const f = (n: number) => n.toFixed(1);

/**
 * Functional surface detail on the 2006–08 bodywork: bare carbon on the
 * cockpit's inner walls (following the opening, which narrows by the
 * steering wheel), rows of cooling louvres on the sidepod tops, and the exit
 * at the tail, drawn as dark openings. These rules, unlike the later ones,
 * leave the bodywork free to carry them.
 */
const FEATURES = /* glsl */ `
  float az = abs(p.z);
  float cw = ${f(COCKPIT.halfWidth)} - 18.0 * smoothstep(500.0, ${f(COCKPIT.front)}, p.x);
  if (p.x < ${f(COCKPIT.front + 26)} && p.x > ${f(COCKPIT.rear - 26)} && az < cw + 16.0 && p.y < 700.0) carbon = 1.0;
  if (p.x < -90.0 && p.x > -270.0 && az > 370.0 && az < 540.0 && p.y > 420.0) {
    float u = fract((p.x + 90.0) / 36.0);
    float slot = edge(u - 0.58) * (1.0 - edge(u - 0.9));
    col = mix(col, vec3(0.01), slot);
  }
  if (p.x < -1716.0) col = vec3(0.012);
`;

/** The house livery applied to the 2006–2008 car's bodywork. */
export function bodyPaint() {
  return housePaint("2006", null, FEATURES);
}
