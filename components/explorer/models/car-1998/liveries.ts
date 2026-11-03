import type { TeamId } from "@/lib/cars/livery";
import type { LiveryDesign } from "../../kit/livery";
import { above, band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING, Z } from "./layout";

/*
 * Team colours on the 1998–2005 car, as each team raced in 2005, the season
 * the car is built to. Outlines are in car millimetres: the nose tip is at
 * x ≈ 2,480, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −1,610; the sidepods start at x = 640 and the engine cover runs back from
 * the roll hoop at −440.
 */

/** Rear wing endplates, seen from the side. */
const EP = { front: REAR_WING.epFront, rear: REAR_WING.epRear, bottom: REAR_WING.epBottom, top: REAR_WING.top };

/**
 * McLaren's silver-over-black split: up the nose and along the cockpit side,
 * over the front of the sidepod, then diagonally down across it, so the rear
 * of the sidepod and the engine cover are silver.
 */
const MCLAREN_SPLIT = curve([
  [2500, 322],
  [2250, 372],
  [1900, 470],
  [1500, 586],
  [1100, 632],
  [700, 664],
  [420, 640],
  [160, 530],
  [-160, 420],
  [-520, 330],
  [-900, 250],
  [-1400, 160],
  [-1900, 140],
]);

/** Williams: white over the nose, down to a line that rises to the cockpit rim. */
const WILLIAMS_NOSE = curve([
  [2520, 300],
  [2250, 318],
  [1950, 380],
  [1550, 520],
  [1150, 616],
  [860, 660],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MP4-20",
    season: 2005,
    note: "Painted silver-grey over black, split by a red line along the nose: the West McLaren Mercedes colours. Chrome came a year later.",
    swatch: ["#b9bec3", "#141518", "#d32a1f"],
    palette: {
      base: { color: "#b9bec3", metal: 0.55, rough: 0.3 },
      black: { color: "#141518", metal: 0.1, rough: 0.35 },
      red: { color: "#d32a1f" },
    },
    finish: { rough: 0.32, clearcoat: 0.8, clearcoatRough: 0.12 },
    body: [
      { paint: "black", side: below(MCLAREN_SPLIT) },
      { paint: "red", side: band(MCLAREN_SPLIT.filter(([x]) => x > 760), 24) },
    ],
    wings: {
      frontEndplates: "black",
      rearEndplates: "black",
      rearWing: [{ paint: "base", face: "up" }],
    },
  },
  ferrari: {
    car: "F2005",
    season: 2005,
    note: "The lighter, almost orange red of the Marlboro years, with a white front wing, white low on the sidepods and white panels on the engine cover and rear wing.",
    swatch: ["#e01e12", "#f4f4f2"],
    palette: {
      base: { color: "#e01e12" },
      white: { color: "#f4f4f2" },
      black: { color: "#131416", rough: 0.4 },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      // A white chevron from under the cockpit along the foot of the sidepod.
      {
        paint: "white",
        side: [
          [980, 300],
          [640, 318],
          [250, 296],
          [-160, 256],
          [-420, 170],
          [-420, 40],
          [980, 40],
        ],
      },
      // The panel on the engine cover behind the roll hoop, with a chevron top.
      {
        paint: "white",
        side: [
          [-470, 930],
          [-740, 975],
          [-1040, 830],
          [-1040, 660],
          [-470, 790],
        ],
        face: "side",
      },
      { paint: "black", side: below([[3000, 120], [-3000, 120]]) },
    ],
    wings: {
      frontWing: [{ paint: "white", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "white", side: rect(EP.rear - 20, Z(560), EP.front + 20, EP.top + 20) }],
    },
  },
  williams: {
    car: "FW27",
    season: 2005,
    note: "Navy and white: a white nose and cockpit, navy behind, with a white sweep at the back of the sidepods.",
    swatch: ["#15306b", "#f2f4f6", "#2f62b0"],
    palette: {
      base: { color: "#15306b" },
      white: { color: "#f2f4f6" },
      blue: { color: "#2f62b0" },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "white", side: above(WILLIAMS_NOSE) },
      // A lighter blue spine over the engine cover.
      { paint: "blue", top: rect(-1500, 0, -440, 60), face: "up" },
      {
        paint: "white",
        side: curve([
          [-620, 260],
          [-900, 380],
          [-1160, 360],
          [-1330, 250],
          [-1250, 140],
          [-900, 150],
          [-620, 260],
        ]),
      },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "white", face: "up" }],
      rearEndplates: "base",
    },
  },
};
