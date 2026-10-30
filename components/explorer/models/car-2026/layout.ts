/**
 * Shared dimensions of the 2026 car (mm). +X forward, +Y up, +Z to the
 * driver's right; the wheelbase is centred on x = 0 and the car stands on
 * y = 0. Values follow the FIA 2026 Technical Regulations (Section C) where
 * they set a number, and typical 2026 practice elsewhere.
 */

export const CAR = {
  wheelbase: 3400,
  width: 1900,
  frontAxle: 1700,
  rearAxle: -1700,
  /** The reference plane Z = 0: bottom of the sprung car, top of the plank. */
  refY: 45,
};

/** Height above the reference plane (the rules measure heights from it). */
export const Z = (mm: number) => CAR.refY + mm;

/*
 * FIA datums as car x positions. The rules' X axis runs rearward, so a rule
 * position "XA = d" is x = XA − d here.
 */
/** Front axle (XF = 0). */
export const XF = CAR.frontAxle;
/** Rear axle (XR = 0). */
export const XR = CAR.rearAxle;
/** Forward limit of the survival cell; the front axle must lie 0–150 mm behind it (C2.3.4). */
export const XA = XF + 130;
/** Rear of the cockpit: 1,830–2,030 mm behind XA (C2.3.5). */
export const XC = XA - 1870;
/** ICE mounting face on the survival cell: at least 360 mm behind XC (C2.3.6). */
export const XPU = XC - 480;
/** Final drive axis: within ±60 mm of XR, 260–280 mm up (C9.5). */
export const XDIF = XR;
export const FINAL_DRIVE_Y = Z(270);

export const TYRES = {
  front: { diameter: 705, width: 280 },
  rear: { diameter: 710, width: 375 },
};

/** Wheel centres: no part but the wheels may lie more than 950 mm from the centre plane. */
export const WHEEL = {
  front: { x: XF, y: TYRES.front.diameter / 2, z: CAR.width / 2 - TYRES.front.width / 2 },
  rear: { x: XR, y: TYRES.rear.diameter / 2, z: CAR.width / 2 - TYRES.rear.width / 2 },
};

/** 18-inch rims. */
export const RIM = { bead: 228.6, flange: 241 };

/** Disc limits: front 325–345 mm, rear 260–280 mm, ≤34 mm thick. */
export const BRAKES = {
  front: { radius: 168, thick: 34 },
  rear: { radius: 136, thick: 32 },
};

/**
 * Survival cell stations from its forward limit (XA) to the engine mounting
 * face (XPU): x, top of the tub, underside, half-width at the shoulder.
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: 590, bottom: 268, w: 128 },
  { x: 1680, top: 612, bottom: 236, w: 156 },
  { x: 1450, top: 640, bottom: 190, w: 196 },
  { x: 1150, top: 668, bottom: 136, w: 248 },
  { x: 900, top: 690, bottom: 100, w: 298 },
  { x: 600, top: 700, bottom: 74, w: 346 },
  { x: 300, top: 702, bottom: 62, w: 376 },
  { x: 0, top: 708, bottom: 60, w: 384 },
  { x: -250, top: 712, bottom: 60, w: 366 },
  { x: XPU, top: 676, bottom: 64, w: 304 },
];

/** Cockpit opening: its rear edge is the XC datum. */
export const COCKPIT = {
  front: 820,
  rear: XC,
  /** Half-width of the opening at the rim. */
  halfWidth: 232,
  floorY: 130,
};

/** Nose stations from the survival cell's forward face to the tip (1,300 mm ahead of the axle). */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: 590, bottom: 268, w: 128 },
  { x: 2150, top: 512, bottom: 244, w: 108 },
  { x: 2480, top: 404, bottom: 216, w: 84 },
  { x: 2750, top: 320, bottom: 200, w: 62 },
  { x: 2910, top: 268, bottom: 198, w: 42 },
  { x: 2990, top: 240, bottom: 205, w: 18 },
];

/**
 * Front wing: up to three elements between 1,250 and 475 mm ahead of the
 * front axle, 675 mm either side of the centre, 60–300 mm above the
 * reference plane; endplates at 575–680 mm, footplates out to 900 mm.
 */
export const FRONT_WING = {
  half: 675,
  leadingEdge: XF + 1250,
  trailingEdge: XF + 475,
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
  leadingEdge: XR - 165,
  trailingEdge: XR - 630,
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
  boardsFront: XF - 650,
  boardsRear: XF - 1350,
  half: 770,
  rearHalf: 700,
  diffuserStart: XR + 600,
  rearStep: XR + 335,
  diffuserHalf: 365,
  diffuserEnd: XR - 300,
};

/** Plank holes (C3.6.1): XF + 500; 600–800 mm ahead of XC; 470–630 mm behind XPU and ahead of XR − 500. */
export const PLANK_HOLES = [XF - 500, XC + 700, XPU - 550];

/**
 * Power unit: 1.6 L 90° V6 with 80 mm bores at 101 mm spacing; the crank
 * axis lies on the centre plane 90 mm above the reference plane (C5.4).
 */
export const PU = {
  front: XPU,
  rear: XPU - 470,
  crankY: Z(90),
  bore: 80,
  boreSpacing: 101,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

/** Six M12 studs join the ICE to the survival cell (C5.4.17): (y, z) on the XPU face. */
export const ENGINE_MOUNTS: [number, number][] = [
  [PU.crankY - 30, 150],
  [PU.crankY - 30, -150],
  [PU.crankY + 150, 185],
  [PU.crankY + 150, -185],
  [PU.crankY + 300, 150],
  [PU.crankY + 300, -150],
];

export const GEARBOX = {
  front: PU.rear,
  rear: XDIF - 360,
};

/** Rear impact structure: rear face 750 mm behind the final drive, top 372.5 mm up. */
export const CRASH = { front: GEARBOX.rear, rear: XDIF - 750, top: Z(372.5) };

/**
 * Exhaust tailpipe (C3.9.2): a single pipe on the centre plane whose exit
 * lies 390–400 mm behind the rear axle, wholly above Z = 350, with a
 * constant 90–130 mm bore over its last 370 mm.
 */
export const TAILPIPE = { exitX: XR - 395, bore: 110, y: Z(350) + 110 / 2 + 3 + 25 };

/** Halo mounts and hoop (fitted to the cockpit). */
export const HALO = {
  rearX: XC + 10,
  rearZ: 262,
  rearY: 700,
  hoopY: 880,
  frontX: 640,
  pillarX: 880,
  pillarY: 692,
  tube: 46,
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1810, 556, 124], rear: [1420, 610, 190], outer: [1690, 575, 702] },
  lower: { front: [XA - 10, 292, 116], rear: [1430, 214, 206], outer: [1715, 150, 728] },
  pushrod: { outer: [1705, 178, 690], inner: [1730, 622, 128] },
  trackRod: { inner: [1790, 300, 150], outer: [1805, 300, 708] },
} as const;

/** Push-rods front and rear, the most common 2026 layout. */
export const REAR_SUSP = {
  upper: { front: [-1460, 440, 120], rear: [-1880, 452, 100], outer: [-1720, 600, 640] },
  lower: { front: [-1350, 252, 140], rear: [-1840, 292, 100], outer: [-1690, 136, 662] },
  pushrod: { outer: [-1700, 166, 640], inner: [-1600, 470, 128] },
  toeLink: { inner: [-1885, 332, 100], outer: [-1885, 342, 655] },
} as const;
