import type { LiveryDesign } from "./livery";

/**
 * Development aid: paints the body with a millimetre grid so livery outlines
 * can be read off the car. Lines every 100 mm, heavier every 500 mm and
 * heaviest every 1,000 mm: red across x (black at x = 0), green across y,
 * blue across z.
 */
export const GRID: LiveryDesign = {
  car: "grid",
  season: 0,
  note: "",
  swatch: [],
  palette: { base: { color: "#d9dde2" } },
  finish: { rough: 0.6, clearcoat: 0.05 },
  body: [],
  glsl: /* glsl */ `
    vec3 g = abs(fract(p / 100.0 + 0.5) - 0.5) * 100.0;
    vec3 h = abs(fract(p / 500.0 + 0.5) - 0.5) * 500.0;
    vec3 k = abs(fract(p / 1000.0 + 0.5) - 0.5) * 1000.0;
    vec3 w = mix(vec3(1.4), vec3(4.0), step(h, vec3(3.0)));
    w = mix(w, vec3(7.0), step(k, vec3(3.0))) + fwidth(p) * 0.6;
    col = mix(col, abs(p.x) < 4.0 ? vec3(0.0) : vec3(0.85, 0.06, 0.05), 1.0 - edge(g.x - w.x));
    col = mix(col, vec3(0.05, 0.55, 0.12), 1.0 - edge(g.y - w.y));
    col = mix(col, vec3(0.06, 0.22, 0.9), 1.0 - edge(g.z - w.z));
  `,
};
