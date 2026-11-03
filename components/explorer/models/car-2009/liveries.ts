import type { TeamId } from "@/lib/cars/livery";
import type { LiveryDesign } from "../../kit/livery";
import { above, band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING, XF } from "./layout";

/*
 * Team colours on the 2009–2013 car, as each team raced in 2013, the season
 * the car is built to. Outlines are in car millimetres: the nose tip is at
 * x ≈ 2,690, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −1,770; the sidepods run from x = 600 to −1,240 and the engine cover from
 * the roll hoop back to −1,920.
 */

const EP = { front: REAR_WING.epFront, rear: REAR_WING.epRear, bottom: REAR_WING.epBottom, top: REAR_WING.top };

/** Halfway up the side of the nose, rising to the cockpit rim. */
const NOSE_LINE = curve([
  [2720, 300],
  [2520, 330],
  [2300, 380],
  [2000, 470],
  [1600, 560],
  [1200, 620],
  [880, 650],
]);

/** Where the FW35's white engine-cover panel meets the navy. */
const FW35_COVER = curve([
  [-380, 920],
  [-800, 820],
  [-1200, 720],
  [-1600, 640],
]);

/** Along the F138's flanks: the top of the black, from the nose back along the sidepods. */
const F138_SIDE = curve([
  [2720, 262],
  [2300, 300],
  [1800, 330],
  [1100, 300],
  [400, 330],
  [-300, 300],
  [-1000, 250],
  [-1400, 200],
  [-2100, 180],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MP4-28",
    season: 2013,
    note: "Graphite chrome with a red nose tip, a red line along the nose and Vodafone red over the back of the sidepods.",
    swatch: ["#a3a9af", "#dd2119", "#16171a"],
    palette: {
      base: { color: "#a3a9af", metal: 0.72, rough: 0.22 },
      red: { color: "#dd2119", metal: 0.05, rough: 0.28 },
      black: { color: "#16171a", metal: 0.2, rough: 0.36 },
    },
    finish: { rough: 0.28, clearcoat: 1, clearcoatRough: 0.06 },
    body: [
      { paint: "black", side: below(curve([[2800, 280], [2000, 290], [1200, 230], [500, 260], [-300, 220], [-1300, 160], [-2100, 150]])) },
      { paint: "red", side: band(NOSE_LINE, 40) },
      { paint: "red", side: rect(2470, -100, 2900, 900) },
      {
        paint: "red",
        side: curve([
          [260, 260],
          [120, 420],
          [-200, 520],
          [-600, 470],
          [-1000, 390],
          [-1260, 250],
          [-1100, 170],
          [-500, 190],
          [260, 230],
        ]),
        face: "side",
      },
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }],
      frontEndplates: "red",
      rearWing: [{ paint: "red", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "red", side: rect(EP.rear - 20, 760, EP.front + 20, EP.top + 20) }],
    },
  },
  ferrari: {
    car: "F138",
    season: 2013,
    note: "A darker red, with a white stripe the full length of the car over black lower flanks, and an Italian tricolour down the nose.",
    swatch: ["#c0081a", "#f3f3f1", "#121314"],
    palette: {
      base: { color: "#c0081a" },
      white: { color: "#f3f3f1" },
      black: { color: "#121314", rough: 0.4 },
      green: { color: "#008c45" },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "black", side: below(F138_SIDE) },
      { paint: "white", side: band(F138_SIDE.map(([x, y]) => [x, y + 18]), 36), face: "side" },
      { paint: "green", top: rect(2200, 0, 2700, 30), face: "up" },
      { paint: "white", top: rect(2200, 30, 2700, 46), face: "up" },
      { paint: "white", side: rect(-1200, 600, -380, 1000), top: rect(-3000, 0, 0, 40) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: [{ paint: "base" }, { paint: "white", side: rect(XF + 300, 250, XF + 1200, 400) }],
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "white", side: rect(EP.rear - 20, 700, EP.front + 20, EP.top + 20) }],
    },
  },
  williams: {
    car: "FW35",
    season: 2013,
    note: "Dark navy with a white nose, a white engine-cover panel edged in red, and white-tipped wings.",
    swatch: ["#0c1838", "#f1f3f5"],
    palette: {
      base: { color: "#0c1838" },
      white: { color: "#f1f3f5" },
      red: { color: "#c8102e" },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "white", side: above(NOSE_LINE) },
      { paint: "white", side: above(FW35_COVER) },
      { paint: "red", side: band(FW35_COVER.map(([x, y]) => [x, y - 14]), 16), face: "side" },
    ],
    wings: {
      frontWing: [{ paint: "white", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "white", side: rect(EP.front - 220, EP.bottom, EP.front + 20, EP.top + 20) }],
    },
  },
};
