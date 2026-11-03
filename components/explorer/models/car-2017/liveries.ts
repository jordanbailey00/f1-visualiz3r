import type { TeamId } from "@/lib/cars/livery";
import { glslColor, type LiveryDesign } from "../../kit/livery";
import { band, below, curve, rect } from "../../kit/liveryShapes";

/*
 * Team colours on the 2017–2021 car, as each team raced in 2021, the season
 * the car is built to. Outlines are in car millimetres: the nose tip is at
 * x ≈ 2,970, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −1,800; the sidepods run from x = 600 to −1,300, the engine cover from the
 * roll hoop back to −2,000, and the rear wing endplates stand behind −1,830.
 */

/** The top of the sidepods' lower half: blue on the McLaren, black on the others. */
const POD_LOW = curve([
  [1300, 300],
  [800, 330],
  [400, 410],
  [-100, 420],
  [-700, 390],
  [-1300, 300],
  [-2100, 250],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MCL35M",
    season: 2021,
    note: "Matt papaya over near-cobalt blue with a black keyline between, blue over the airbox and on the front wing, bare carbon below.",
    swatch: ["#ff8700", "#1f6fd6", "#16171a"],
    palette: {
      base: { color: "#ff8700" },
      blue: { color: "#1f6fd6" },
      black: { color: "#16171a", rough: 0.5 },
      carbon: { color: "#000000", carbon: true },
    },
    finish: { rough: 0.58, clearcoat: 0.12, clearcoatRough: 0.45 },
    body: [
      { paint: "blue", side: below(POD_LOW) },
      { paint: "black", side: band(POD_LOW, 18), face: "side" },
      { paint: "carbon", side: below(curve([[3000, 200], [1400, 190], [600, 220], [-600, 200], [-2100, 160]])) },
      { paint: "blue", side: rect(-360, 930, 90, 1100) },
      { paint: "blue", top: rect(-1500, 0, -340, 46), face: "up" },
      { paint: "blue", side: rect(2860, -100, 3100, 600) },
    ],
    wings: {
      frontWing: [{ paint: "blue", face: "up" }],
      frontEndplates: "blue",
      rearWing: [{ paint: "black", face: "up" }],
      rearEndplates: [{ paint: "black" }, { paint: "base", side: rect(-2700, 860, -1800, 960) }],
    },
  },
  ferrari: {
    car: "SF21",
    season: 2021,
    note: "Matt red that darkens to burgundy towards the back, the colour of Ferrari's first car of 1947, with black low down.",
    swatch: ["#c1121f", "#6e1423", "#141416"],
    palette: {
      base: { color: "#c1121f" },
      burgundy: { color: "#6e1423" },
      black: { color: "#141416", rough: 0.42 },
    },
    finish: { rough: 0.56, clearcoat: 0.12, clearcoatRough: 0.45 },
    body: [
      { paint: "base", fade: { paint: "burgundy", from: -250, to: -1500 } },
      { paint: "black", side: below(curve([[3000, 200], [1400, 200], [600, 250], [-300, 240], [-2100, 180]])) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "burgundy", face: "up" }],
      rearEndplates: "burgundy",
    },
  },
  williams: {
    car: "FW43B",
    season: 2021,
    note: "Dark blue with a white nose, light-blue chevrons across the sidepods and engine cover, a black tail and yellow details.",
    swatch: ["#0b1f45", "#00a0de", "#f2f4f6", "#ffcd00"],
    palette: {
      base: { color: "#0b1f45" },
      light: { color: "#00a0de" },
      white: { color: "#f2f4f6" },
      yellow: { color: "#ffcd00" },
      black: { color: "#111214", rough: 0.4 },
    },
    finish: { rough: 0.32, clearcoat: 0.7, clearcoatRough: 0.16 },
    body: [
      { paint: "white", side: rect(2200, -100, 3100, 900) },
      { paint: "yellow", side: rect(2170, -100, 2200, 900) },
      { paint: "black", side: rect(-3000, -100, -1500, 1200) },
    ],
    // Chevrons pointing forward, fading out at both ends.
    glsl: /* glsl */ `
      if (p.x < 340.0 && p.x > -1450.0 && p.y > 200.0) {
        float u = (p.x + 1.15 * abs(p.y - 480.0)) / 62.0;
        float s = fract(u);
        float w = fwidth(u) + 1e-4;
        float lines = smoothstep(0.5 - w, 0.5 + w, s) * (1.0 - smoothstep(0.74 - w, 0.74 + w, s));
        float k = ramp(340.0, 120.0, p.x) * ramp(-1450.0, -950.0, p.x) * ramp(0.85, 0.6, abs(n.y));
        col = mix(col, ${glslColor("#00a0de")}, lines * k);
      }
    `,
    wings: {
      frontWing: [{ paint: "white", face: "up" }],
      frontEndplates: [{ paint: "base" }, { paint: "yellow", side: rect(2000, 330, 3400, 360) }],
      rearWing: [{ paint: "black", face: "up" }],
      rearEndplates: "black",
    },
  },
};
