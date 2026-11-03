import type { TeamId } from "@/lib/cars/livery";
import type { LiveryDesign } from "../../kit/livery";
import { band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING } from "./layout";

/*
 * Team colours on the 2022–2025 car, as each team raced in 2025, the season
 * the car is built to. Outlines are in car millimetres: the nose tip is at
 * x ≈ 3,085, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −1,800; the sidepods run from x = 600 to −1,300, the roll hoop stands
 * between 60 and −320, and the engine cover runs back to −1,750.
 */

/** Where the upper colour meets the lower: up the nose, along the cockpit side, down the sidepod. */
const SPLIT = curve([
  [3100, 238],
  [2700, 330],
  [2200, 470],
  [1700, 590],
  [1100, 640],
  [600, 630],
  [200, 560],
  [-300, 490],
  [-800, 420],
  [-1300, 340],
  [-1900, 300],
]);

/** The rear wing tips, seen from the side. */
const TIP = { front: REAR_WING.leadingEdge + 40, rear: REAR_WING.endplateRear - 40, bottom: REAR_WING.endplateBottom, top: REAR_WING.top + 30 };

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MCL39",
    season: 2025,
    note: "Papaya on top and anthracite below, with an anthracite airbox and engine cover leading back to a papaya tail.",
    swatch: ["#ff8000", "#1c1d21"],
    palette: {
      base: { color: "#ff8000" },
      black: { color: "#1c1d21", rough: 0.4 },
    },
    finish: { rough: 0.36, clearcoat: 0.5, clearcoatRough: 0.22 },
    body: [
      { paint: "black", side: below(SPLIT) },
      {
        paint: "black",
        side: [
          [90, 1200],
          [90, 760],
          [-500, 720],
          [-980, 640],
          [-1060, 700],
          [-700, 1200],
        ],
      },
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }],
      frontEndplates: "base",
      rearWing: [{ paint: "black", face: "up" }, { paint: "base", side: rect(TIP.rear, TIP.bottom, TIP.front, TIP.top), top: rect(-3000, 560, 0, 700) }],
    },
  },
  ferrari: {
    car: "SF-25",
    season: 2025,
    note: "A darker, matt Racing Red, with a bold angled white band across the engine cover that ends in bare carbon, a white rear wing and black low down.",
    swatch: ["#b5121b", "#f3f3f1", "#141416"],
    palette: {
      base: { color: "#b5121b" },
      white: { color: "#f3f3f1" },
      black: { color: "#141416", rough: 0.6 },
      carbon: { color: "#000000", carbon: true },
    },
    finish: { rough: 0.58, clearcoat: 0.12, clearcoatRough: 0.45 },
    body: [
      { paint: "black", side: below(SPLIT.map(([x, y]) => [x, y - 150])) },
      {
        paint: "white",
        side: [
          [-200, 1200],
          [-200, 960],
          [-520, 790],
          [-1000, 660],
          [-1380, 590],
          [-1380, 1200],
        ],
      },
      { paint: "carbon", side: rect(-2000, 300, -1380, 1200) },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: "black",
      rearWing: [{ paint: "white", face: "up" }],
    },
  },
  williams: {
    car: "FW47",
    season: 2025,
    note: "Williams navy at the nose fading to Atlassian blue over the engine cover, navy low down, and a copper-topped black airbox styled as a Duracell battery.",
    swatch: ["#1b5ccc", "#0c1a36", "#b5733a"],
    palette: {
      base: { color: "#1b5ccc" },
      navy: { color: "#0c1a36" },
      white: { color: "#f2f4f6" },
      black: { color: "#131417", rough: 0.42 },
      copper: { color: "#b5733a", metal: 0.6, rough: 0.3 },
    },
    finish: { rough: 0.4, clearcoat: 0.45, clearcoatRough: 0.25 },
    body: [
      { paint: "navy", fade: { paint: "base", from: 1900, to: 300 } },
      { paint: "navy", side: below(SPLIT.map(([x, y]) => [x, y - 60])) },
      { paint: "white", side: band(SPLIT.map(([x, y]) => [x, y - 60]), 14), face: "side" },
      { paint: "black", side: rect(-360, 880, 90, 1200) },
      { paint: "copper", side: rect(-60, 950, 90, 1200) },
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }],
      frontEndplates: "navy",
      rearWing: [{ paint: "navy", face: "up" }],
    },
  },
};
