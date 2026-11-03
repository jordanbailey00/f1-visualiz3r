import type { TeamId } from "@/lib/cars/livery";
import type { LiveryDesign } from "../../kit/livery";
import { band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING } from "./layout";

/*
 * Team colours on the 2026 car, as each team launched it for 2026. Outlines
 * are in car millimetres: the nose tip is at x ≈ 2,990, plane C-C (the back
 * of the cockpit) at 0, the rear axle at −1,700; the sidepods run from
 * x = 470 to −1,390, the roll hoop stands between 60 and −320, and the
 * engine cover runs back to −2,010.
 */

/** Where the upper colour meets the lower: up the nose, along the cockpit side, down the sidepod. */
const SPLIT = curve([
  [3000, 222],
  [2600, 320],
  [2150, 450],
  [1700, 570],
  [1100, 630],
  [500, 600],
  [100, 520],
  [-400, 440],
  [-900, 360],
  [-1400, 290],
  [-2100, 260],
]);

/** The rear wing endplates, seen from the side. */
const EP = { front: REAR_WING.leadingEdge + 40, rear: REAR_WING.trailingEdge - 60, top: REAR_WING.top + 30 };

/** The SF-26's white: from around the cockpit back over the airbox and engine cover, clipping upwards before the tail. */
const SF26_WHITE = curve([
  [520, 1300],
  [520, 640],
  [100, 600],
  [-400, 560],
  [-900, 500],
  [-1250, 520],
  [-1450, 760],
  [-1520, 1300],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MCL40",
    season: 2026,
    note: "Papaya, with black around the airbox in a band slanting down across the engine cover and sidepods, a black centre stripe and a papaya rear wing.",
    swatch: ["#f47600", "#18191c"],
    palette: {
      base: { color: "#f47600" },
      black: { color: "#18191c", rough: 0.4 },
    },
    finish: { rough: 0.36, clearcoat: 0.5, clearcoatRough: 0.22 },
    body: [
      { paint: "black", side: below(SPLIT.map(([x, y]) => [x, y - 90])) },
      {
        paint: "black",
        side: [
          [90, 1200],
          [90, 820],
          [-120, 600],
          [-420, 330],
          [-560, 150],
          [-1000, 150],
          [-860, 420],
          [-640, 800],
          [-520, 1200],
        ],
      },
      { paint: "black", top: rect(-2100, 0, -300, 34), face: "up" },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "black", side: rect(EP.rear - 40, 0, EP.front + 40, 560) }],
    },
  },
  ferrari: {
    car: "SF-26",
    season: 2026,
    note: "Gloss again, in a brighter Rosso Scuderia: white around the cockpit, the airbox and the engine cover, edged by a pinstripe, with red taking over at the tail and black wings.",
    swatch: ["#e3141c", "#f4f4f2", "#141416"],
    palette: {
      base: { color: "#e3141c" },
      white: { color: "#f4f4f2" },
      black: { color: "#141416", rough: 0.4 },
    },
    finish: { rough: 0.28, clearcoat: 0.9, clearcoatRough: 0.08 },
    body: [
      { paint: "black", side: below(SPLIT.map(([x, y]) => [x, y - 200])) },
      { paint: "black", side: SF26_WHITE.map(([x, y]) => [x + 14, y - 14]) },
      { paint: "white", side: SF26_WHITE },
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }],
      frontEndplates: "black",
      rearWing: [{ paint: "black", face: "up" }],
      rearEndplates: "black",
    },
  },
  williams: {
    car: "FW48",
    season: 2026,
    note: "Gloss Atlassian blue with a black section along the flanks framed by a red-and-white keyline, a white sweep on the sidepods and the Duracell airbox.",
    swatch: ["#1f6fd6", "#131417", "#d2232a", "#f2f4f6"],
    palette: {
      base: { color: "#1f6fd6", rough: 0.26 },
      white: { color: "#f2f4f6" },
      red: { color: "#d2232a" },
      black: { color: "#131417", rough: 0.4 },
      copper: { color: "#b5733a", metal: 0.6, rough: 0.3 },
    },
    finish: { rough: 0.3, clearcoat: 0.9, clearcoatRough: 0.08 },
    body: [
      { paint: "white", side: band(SPLIT.map(([x, y]) => [x, y - 18]), 30), face: "side" },
      { paint: "red", side: band(SPLIT.map(([x, y]) => [x, y - 36]), 14), face: "side" },
      { paint: "black", side: below(SPLIT.map(([x, y]) => [x, y - 44])) },
      {
        paint: "white",
        side: curve([
          [-150, 360],
          [-700, 390],
          [-1200, 320],
          [-1450, 220],
          [-1100, 200],
          [-600, 250],
          [-150, 300],
        ]),
        face: "side",
      },
      { paint: "black", side: rect(-360, 880, 90, 1200) },
      { paint: "copper", side: rect(-60, 950, 90, 1200) },
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }, { paint: "white", face: "up", top: rect(-3000, 560, 4000, 700) }],
      frontEndplates: "black",
      rearWing: [{ paint: "black", face: "up" }],
      rearEndplates: [{ paint: "black" }, { paint: "white", side: rect(EP.rear - 40, 0, EP.front + 40, 600) }],
    },
  },
};
