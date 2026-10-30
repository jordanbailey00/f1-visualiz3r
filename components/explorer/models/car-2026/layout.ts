/**
 * Shared dimensions of the 2026 car (mm). +X forward, +Y up, +Z to the
 * driver's right; the wheelbase is centred on x = 0 and the car stands on
 * y = 0. Values follow the 2026 regulations where they set a number, and
 * typical 2026 practice elsewhere.
 */

export const CAR = {
  wheelbase: 3400,
  width: 1900,
  frontAxle: 1700,
  rearAxle: -1700,
  /** The reference plane (top of the plank) at static ride height. */
  refY: 45,
};

/** Height above the reference plane (the rules measure heights from it). */
export const Z = (mm: number) => CAR.refY + mm;

export const TYRES = {
  front: { diameter: 705, width: 280 },
  rear: { diameter: 710, width: 375 },
};

/** Wheel centres: track = overall width less a tyre width. */
export const WHEEL = {
  front: { x: CAR.frontAxle, y: TYRES.front.diameter / 2, z: CAR.width / 2 - TYRES.front.width / 2 },
  rear: { x: CAR.rearAxle, y: TYRES.rear.diameter / 2, z: CAR.width / 2 - TYRES.rear.width / 2 },
};

/** 18-inch rims. */
export const RIM = { bead: 228.6, flange: 241 };

/** Disc limits: front 325–345 mm, rear 260–280 mm, ≤34 mm thick. */
export const BRAKES = {
  front: { radius: 168, thick: 34 },
  rear: { radius: 136, thick: 32 },
};

/**
 * Monocoque stations: x, top of the tub, underside, half-width at the
 * shoulder. The cockpit opening runs between COCKPIT.front and COCKPIT.rear.
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: 1965, top: 598, bottom: 262, w: 132 },
  { x: 1800, top: 622, bottom: 228, w: 160 },
  { x: 1550, top: 652, bottom: 182, w: 196 },
  { x: 1250, top: 680, bottom: 132, w: 246 },
  { x: 1000, top: 700, bottom: 96, w: 300 },
  { x: 700, top: 700, bottom: 72, w: 350 },
  { x: 400, top: 700, bottom: 62, w: 378 },
  { x: 150, top: 708, bottom: 60, w: 385 },
  { x: -150, top: 716, bottom: 60, w: 372 },
  { x: -450, top: 690, bottom: 62, w: 330 },
  { x: -640, top: 660, bottom: 66, w: 290 },
];

export const COCKPIT = {
  front: 930,
  rear: 150,
  /** Half-width of the opening at the rim. */
  halfWidth: 232,
  floorY: 130,
};

/** Nose stations from the front bulkhead to the tip. */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: 1965, top: 598, bottom: 262, w: 132 },
  { x: 2250, top: 520, bottom: 240, w: 110 },
  { x: 2550, top: 410, bottom: 214, w: 86 },
  { x: 2780, top: 322, bottom: 198, w: 64 },
  { x: 2920, top: 270, bottom: 196, w: 44 },
  { x: 2985, top: 240, bottom: 204, w: 18 },
];

/**
 * Front wing: up to three elements between 1,250 and 475 mm ahead of the
 * front axle, 675 mm either side of the centre, 60–300 mm above the
 * reference plane; endplates at 575–680 mm, footplates out to 900 mm.
 */
export const FRONT_WING = {
  half: 675,
  leadingEdge: 2950,
  trailingEdge: 2175,
  endplate: { inner: 588, outer: 680 },
  foot: 900,
};

/**
 * Rear wing: up to three elements 165–630 mm behind the rear axle, 575 mm
 * either side, from 725 mm (centre) to 880 mm above the reference plane.
 * The flap tips outboard of 535 mm stay fixed.
 */
export const REAR_WING = {
  half: 575,
  fixedTip: 535,
  leadingEdge: -1865,
  trailingEdge: -2330,
  bottom: Z(725),
  top: Z(880),
};

/**
 * Floor: ±770 mm at 1,100 mm behind the front axle, ±700 mm at 335 mm ahead
 * of the rear axle, ±365 mm beside the rear wheels. Floor boards fill
 * 650–1,350 mm behind the front axle, 710–890 mm out. Flat (≤75 mm on the
 * centreline) until 600 mm ahead of the rear axle, where the diffuser rises.
 */
export const FLOOR = {
  front: 1290,
  boardsFront: 1050,
  boardsRear: 350,
  half: 770,
  rearHalf: 700,
  diffuserStart: -1100,
  rearStep: -1365,
  diffuserHalf: 365,
  diffuserEnd: -2000,
};

/** Power unit: crank axis height and block length (x from front face). */
export const PU = {
  front: -660,
  rear: -1160,
  crankY: 190,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

export const GEARBOX = {
  front: -1160,
  rear: -2060,
};

/** Rear impact structure: its rear face 750 mm behind the final drive, top 372.5 mm up. */
export const CRASH = { front: -2060, rear: -2450, top: Z(372.5) };

/** Final drive axis: 260–280 mm above the reference plane. */
export const FINAL_DRIVE_Y = Z(270);

/** Halo mounts and hoop (fitted to the cockpit). */
export const HALO = {
  rearX: 150,
  rearZ: 262,
  rearY: 700,
  hoopY: 878,
  frontX: 760,
  pillarX: 930,
  pillarY: 700,
  tube: 46,
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1930, 560, 150], rear: [1420, 600, 196], outer: [1690, 575, 702] },
  lower: { front: [1985, 270, 126], rear: [1430, 210, 216], outer: [1715, 150, 728] },
  pushrod: { outer: [1705, 178, 690], inner: [1760, 612, 150] },
  trackRod: { inner: [1790, 300, 170], outer: [1805, 300, 708] },
} as const;

/** Push-rods front and rear, the most common 2026 layout. */
export const REAR_SUSP = {
  upper: { front: [-1460, 440, 128], rear: [-1880, 452, 106], outer: [-1720, 600, 640] },
  lower: { front: [-1330, 196, 176], rear: [-1840, 204, 118], outer: [-1690, 136, 662] },
  pushrod: { outer: [-1700, 166, 640], inner: [-1600, 470, 140] },
  toeLink: { inner: [-1885, 322, 112], outer: [-1885, 338, 655] },
} as const;
