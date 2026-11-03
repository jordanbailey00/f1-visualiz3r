import type { TeamId } from "@/lib/cars/livery";
import type { Layer, LiveryDesign, Pt } from "../../kit/livery";
import { band, below, curve, rect } from "../../kit/liveryShapes";
import { REAR_WING } from "./layout";

/*
 * Team colours on the 2014–2016 car, as each team raced in 2016, the season
 * the car is built to. Outlines are in car millimetres: the low nose tip is
 * at x ≈ 2,385, plane C-C (the back of the cockpit) at 0, the rear axle at
 * −2,000; the sidepods run from x = 600 to −1,300 and the engine cover from
 * the roll hoop back to −2,150.
 */

const EP = { front: REAR_WING.epFront, rear: REAR_WING.epRear, bottom: REAR_WING.epBottom, top: REAR_WING.top };

/** Along the shoulder of the engine cover, from the roll hoop down to the tail. */
const COVER_LINE = curve([
  [-120, 900],
  [-500, 880],
  [-900, 810],
  [-1300, 720],
  [-1700, 620],
  [-2150, 520],
]);

/** Stripes in order, top to bottom, along a line; `widths` gives each one's width. */
function stripes(line: Pt[], paints: string[], widths: number[], face?: Layer["face"]): Layer[] {
  let down = 0;
  return paints.map((paint, i) => {
    const w = widths[i];
    const at = down + w / 2;
    down += w;
    return { paint, side: band(line.map(([x, y]) => [x, y - at]), w), face };
  });
}

/** Martini's stripes, top to bottom: light blue, dark blue, and a slightly wider red. */
const MARTINI = ["blue", "navy", "red"];

/** Along the SF16-H's flanks: the top of the black, from the nose back along the sidepods. */
const SF16_SIDE = curve([
  [2390, 196],
  [2000, 236],
  [1500, 250],
  [900, 280],
  [300, 320],
  [-400, 300],
  [-1100, 250],
  [-1500, 200],
  [-2300, 170],
]);

export const LIVERIES: Record<TeamId, LiveryDesign> = {
  mclaren: {
    car: "MP4-31",
    season: 2016,
    note: "Gloss graphite and black, with McLaren's dayglo-red speedmarks on the sidepods and a red line over the engine cover.",
    swatch: ["#2f3134", "#141516", "#ff3f1f"],
    palette: {
      base: { color: "#2f3134", metal: 0.35, rough: 0.28 },
      black: { color: "#141516", metal: 0.15, rough: 0.3 },
      red: { color: "#ff3f1f", metal: 0.02, rough: 0.3 },
    },
    finish: { rough: 0.28, clearcoat: 1, clearcoatRough: 0.06 },
    body: [
      { paint: "black", side: below(curve([[2500, 200], [1500, 250], [600, 300], [-300, 280], [-1400, 210], [-2300, 180]])) },
      {
        paint: "red",
        side: curve([
          [350, 430],
          [-100, 470],
          [-600, 452],
          [-1050, 380],
          [-700, 410],
          [-200, 420],
          [350, 430],
        ]),
        face: "side",
      },
      { paint: "red", side: band(COVER_LINE.map(([x, y]) => [x, y + 40]), 26) },
    ],
    wings: {
      frontEndplates: [{ paint: "black" }, { paint: "red", side: rect(1800, 240, 2600, 280) }],
      rearEndplates: [{ paint: "black" }, { paint: "red", side: rect(EP.rear - 20, 900, EP.front + 20, 940) }],
    },
  },
  ferrari: {
    car: "SF16-H",
    season: 2016,
    note: "Red and white for the first time in over two decades: white over the airbox and the top of the engine cover, a white stripe the length of the car over black, and a tricolour on the airbox.",
    swatch: ["#d1001f", "#f4f4f2", "#131416"],
    palette: {
      base: { color: "#d1001f" },
      white: { color: "#f4f4f2" },
      black: { color: "#131416", rough: 0.4 },
      green: { color: "#008c45" },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "black", side: below(SF16_SIDE) },
      { paint: "white", side: band(SF16_SIDE.map(([x, y]) => [x, y + 16]), 32), face: "side" },
      { paint: "white", side: rect(1500, -100, 2500, 600), face: "down" },
      {
        paint: "white",
        side: [
          ...curve([
            [140, 740],
            [-300, 800],
            [-800, 770],
            [-1300, 690],
            [-1800, 600],
            [-2200, 520],
          ]),
          [-2200, 1300],
          [140, 1300],
        ],
      },
      { paint: "green", side: rect(-60, 880, -20, 1000), face: "side" },
      { paint: "base", side: rect(-140, 880, -100, 1000), face: "side" },
    ],
    wings: {
      frontWing: [{ paint: "base", face: "up" }],
      frontEndplates: [{ paint: "base" }, { paint: "white", side: rect(1500, 200, 2700, 330) }],
      rearWing: [{ paint: "base", face: "up" }],
      rearEndplates: [{ paint: "base" }, { paint: "white", side: rect(EP.rear - 20, 820, EP.front + 20, EP.top + 20) }],
    },
  },
  williams: {
    car: "FW38",
    season: 2016,
    note: "Martini white with the sponsor's dark blue, light blue and red stripes along the sidepods and over the engine cover.",
    swatch: ["#f4f5f6", "#14275a", "#2d9ad6", "#d8212a"],
    palette: {
      base: { color: "#f4f5f6" },
      navy: { color: "#14275a" },
      blue: { color: "#2d9ad6" },
      red: { color: "#d8212a" },
      black: { color: "#141518", rough: 0.4 },
    },
    finish: { rough: 0.3, clearcoat: 0.85, clearcoatRough: 0.1 },
    body: [
      { paint: "black", side: below(curve([[2500, 200], [1500, 200], [600, 240], [-300, 220], [-1400, 170], [-2300, 150]])) },
      ...stripes(
        curve([
          [600, 640],
          [100, 660],
          [-400, 640],
          [-900, 560],
          [-1400, 460],
          [-1900, 370],
        ]),
        MARTINI,
        [28, 28, 34],
        "side",
      ),
      ...stripes(curve([[2390, 252], [2100, 344], [1800, 464], [1300, 574], [900, 624]]), MARTINI, [13, 13, 16], "side"),
    ],
    wings: {
      frontWing: [{ paint: "black", face: "up" }],
      frontEndplates: "black",
      rearWing: [{ paint: "black", face: "up" }],
      rearEndplates: [{ paint: "black" }, ...stripes([[EP.front + 30, 930], [EP.rear - 30, 930]], MARTINI, [32, 32, 38])],
    },
  },
};
