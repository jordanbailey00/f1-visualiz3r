import type { TeamId } from "@/lib/cars/livery";
import type { LiveryDesign } from "../../kit/livery";
import { above, band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING, Z } from "./layout";

/*
 * Team colours on the 2006–2008 car, as each team raced in 2008, the season
 * the car is built to. Outlines are in car millimetres: the nose tip is at
 * x ≈ 2,560, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −1,570; the sidepods start at x = 640, the roll hoop stands at 0 to −330
 * and the engine cover runs back from −440.
 */

const EP = { front: REAR_WING.epFront, rear: REAR_WING.epRear, top: REAR_WING.top };

/** A line along the side of the nose, halfway up it, back to the cockpit. */
const NOSE_LINE = curve([
  [2580, 352],
  [2380, 392],
  [2150, 430],
  [1850, 500],
  [1500, 576],
  [1100, 626],
  [880, 640],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MP4-23",
    season: 2008,
    note: "Chrome, with Vodafone red sweeping back along the sidepods and over the airbox, and dark grey low down.",
    swatch: ["#cfd3d8", "#d8140e", "#2a2c30"],
    palette: {
      // Mirror chrome would only reflect the dark studio; a bright, slightly soft metal reads as chrome.
      base: { color: "#dfe3e7", metal: 0.72, rough: 0.2 },
      red: { color: "#d8140e", metal: 0.05, rough: 0.28 },
      grey: { color: "#2a2c30", metal: 0.4, rough: 0.34 },
    },
    finish: { rough: 0.28, clearcoat: 1, clearcoatRough: 0.06 },
    body: [
      { paint: "grey", side: below(curve([[2600, 300], [1800, 300], [1000, 250], [400, 270], [-300, 230], [-1300, 150], [-1900, 140]])) },
      { paint: "red", side: band(NOSE_LINE, 46) },
      // The Vodafone sweep: narrow at the front of the sidepod, filling its rear half.
      {
        paint: "red",
        side: curve([
          [640, 300],
          [300, 338],
          [-100, 430],
          [-480, 486],
          [-860, 430],
          [-1140, 330],
          [-1260, 210],
          [-1000, 170],
          [-500, 190],
          [0, 232],
          [640, 272],
          [640, 300],
        ]),
        face: "side",
      },
      { paint: "red", side: rect(-340, 930, 80, 1100) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: [{ paint: "base" }, { paint: "red", side: rect(1500, 300, 2700, 420) }],
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "grey" }, { paint: "red", side: rect(EP.rear - 20, Z(600), EP.front + 20, EP.top + 20) }],
    },
  },
  ferrari: {
    car: "F2008",
    season: 2008,
    note: "All red, in the darker shade adopted in 2007, with white panels on the engine cover and the rear wing endplates, where the sponsor's bar code ran.",
    swatch: ["#d10a16", "#f4f4f2"],
    palette: {
      base: { color: "#d10a16" },
      white: { color: "#f4f4f2" },
      black: { color: "#131416", rough: 0.4 },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      {
        paint: "white",
        side: [
          [-470, 940],
          [-1020, 800],
          [-1020, 640],
          [-470, 780],
        ],
        face: "side",
      },
      { paint: "black", side: below([[3000, 120], [-3000, 120]]) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [
        { paint: "base" },
        { paint: "white", side: rect(EP.rear - 20, Z(520), EP.front + 20, EP.top + 20) },
      ],
    },
  },
  williams: {
    car: "FW30",
    season: 2008,
    note: "Dark navy, with the nose and the cockpit's front picked out in white and a white roll hoop.",
    swatch: ["#0c1d45", "#f2f4f6"],
    palette: {
      base: { color: "#0c1d45" },
      white: { color: "#f2f4f6" },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "white", side: above(NOSE_LINE) },
      { paint: "white", side: rect(-340, 940, 80, 1100) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: [{ paint: "base" }, { paint: "white", side: rect(1500, Z(300), 2600, Z(400)) }],
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: "base",
    },
  },
};
