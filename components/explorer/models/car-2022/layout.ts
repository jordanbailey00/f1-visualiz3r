/**
 * Shared dimensions of the 2022–2025 car (mm), built to the final (2025)
 * form of those rules; article numbers refer to the 2025 Formula 1
 * Technical Regulations. +X forward, +Y up, +Z to the driver's right; the
 * wheelbase is centred on x = 0 and the car stands on y = 0.
 */

export const CAR = {
  /** At most 3,600 mm (3.4.2). */
  wheelbase: 3600,
  /** Nothing but the wheels may lie outboard of ±1,000 mm (3.4.1). */
  width: 2000,
  frontAxle: 1800,
  rearAxle: -1800,
  /** The reference plane Z = 0: bottom of the sprung car, top of the plank. */
  refY: 40,
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
/** Front of the survival cell: the front axle may not be more than 100 mm behind it (3.4.3). */
export const XA = XF + 60;
/** Rear of the cockpit, at least 1,830 mm behind XA (12.1.4). */
export const XC = XA - 1860;
/** ICE mounting face: the fuel cell fills the space between XC and here (6.1.2). */
export const XPU = XC - 600;
/** Final drive axis: within 60 mm of the rear axle (9.6.1). */
export const XDIF = XR;
/** …and 250–260 mm above the reference plane. */
export const FINAL_DRIVE_Y = Z(255);

/** Tyre widths as fitted: 345–375 mm front, 440–470 mm rear; diameter ≤725 mm (10.8.1). */
export const TYRES = {
  front: { diameter: 720, width: 360 },
  rear: { diameter: 720, width: 455 },
};

/**
 * Wheel centres. The inboard face of the rim (24 mm narrower than the tyre)
 * may lie no further out than 635 mm at the front and 548 mm at the rear
 * (10.10.1), which leaves the tyres just inside the 2,000 mm width.
 */
export const WHEEL = {
  front: { x: XF, y: TYRES.front.diameter / 2, z: 635 + (TYRES.front.width - 24) / 2 },
  rear: { x: XR, y: TYRES.rear.diameter / 2, z: 548 + (TYRES.rear.width - 24) / 2 },
};

/** 18-inch rims. */
export const RIM = { bead: 228.6, flange: 241 };

/** Discs: front 325–330 mm, rear 275–280 mm, at most 32 mm thick (11.3). */
export const BRAKES = {
  front: { radius: 165, thick: 32 },
  rear: { radius: 140, thick: 32 },
};

/**
 * Survival cell stations from its forward limit (XA) to the engine mounting
 * face (XPU): x, top of the tub, underside, half-width at the shoulder. At XA
 * it must be at least 300 wide and 305 tall with its top no higher than
 * Z = 553; at B-B (875 mm ahead of XC), 490 × 415 (§10). The rear face
 * carries the engine studs out to ±340 mm.
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(550), bottom: 268, w: 152 },
  { x: 1700, top: 626, bottom: 230, w: 172 },
  { x: 1540, top: 655, bottom: 188, w: 204 },
  { x: 1220, top: 680, bottom: 132, w: 254 },
  { x: 950, top: 698, bottom: 96, w: 302 },
  { x: 650, top: 708, bottom: 72, w: 350 },
  { x: 330, top: 716, bottom: 60, w: 380 },
  { x: 20, top: 724, bottom: 56, w: 390 },
  { x: -280, top: 726, bottom: 54, w: 376 },
  { x: XPU, top: 684, bottom: 50, w: 362 },
];

/** Cockpit opening: its rear edge is the XC datum. */
export const COCKPIT = {
  front: 860,
  rear: XC,
  /** Half-width of the opening at the rim. */
  halfWidth: 232,
  floorY: 126,
};

/**
 * Nose stations from the survival cell's forward face to the tip. Seen from
 * above it must cover a wedge from 1,150 mm ahead of the front axle (±100 mm)
 * back to XA (±150 mm), and ahead of 50 mm behind its tip nothing may be
 * higher than Z = 235 (3.6.1, 13.6.1).
 */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(550), bottom: 268, w: 152 },
  { x: 2280, top: 524, bottom: 236, w: 138 },
  { x: 2600, top: 428, bottom: 208, w: 124 },
  { x: 2870, top: 336, bottom: 190, w: 108 },
  { x: 2965, top: 296, bottom: 184, w: 92 },
  { x: 3040, top: Z(220), bottom: 184, w: 62 },
  { x: 3085, top: Z(190), bottom: 190, w: 24 },
];

/**
 * Front wing (3.9, §21): up to four elements in a box from 1,350 mm ahead of
 * the front axle (in the middle; 975 mm at the tips) back to 800 mm (middle)
 * and 475 mm (tips), inboard of ±900 mm, with almost flat endplates at
 * ±900–975 mm.
 */
export const FRONT_WING = {
  /** Leading edge in the middle, and its sweep back per mm of span. */
  leadingEdge: XF + 1340,
  sweep: 375 / 975,
  /** Profiles end, and the endplate starts, at this half-span. */
  half: 902,
  endplate: { inner: 903, thick: 12 },
};

/**
 * Rear wing (3.10, §27–29): two profiles inboard of ±480 mm, between
 * 140 mm and 555 mm behind the rear axle and Z = 670–910; rolled tips out to
 * ±615 mm; endplates down to Z = 325, reaching back to 680 mm.
 */
export const REAR_WING = {
  half: 478,
  tipHalf: 612,
  leadingEdge: XR - 148,
  trailingEdge: XR - 552,
  bottom: Z(676),
  top: Z(905),
  endplateBottom: Z(330),
  endplateRear: XR - 676,
};

/** Beam wing (3.10.3, §30): up to two elements, 270–550 mm behind the rear axle, Z = 325–500, |Y| ≤ 490. */
export const BEAM_WING = { front: XR - 278, rear: XR - 546, bottom: Z(332), top: Z(496), half: 455, inner: 84 };

/**
 * Floor (3.5, §2–8): the leading edge sweeps from 650 mm behind the front
 * axle on the centre line to 1,290 mm at the full ±800 mm width; the edge
 * curves in to ±650 mm 350 mm ahead of the rear axle, steps in round the
 * rear tyres to ±495 mm, and the diffuser walls reach ±375 mm at its exit,
 * 450 mm behind the axle. `keel` is the half-width of the flat strip on the
 * reference plane between the tunnels.
 */
export const FLOOR = {
  front: XF - 650,
  half: 800,
  rearHalf: 650,
  rearStep: XR + 350,
  stepHalf: 495,
  diffuserHalf: 375,
  diffuserEnd: XR - 450,
};

/** Plank (3.5.9, §39): from 430 mm behind the front axle to 600 mm ahead of the rear, ±75 mm widening to ±125 mm. */
export const PLANK = { front: XF - 430, rear: XR + 600, frontHalf: 75, half: 125 };

/** The four 50 mm thickness-check holes (from 2023): (x, z). */
export const PLANK_HOLES: [number, number][] = [
  [XF - 500, 0],
  [XF - 1080, 75],
  [XF - 1080, -75],
  [XR + 925, 0],
];

/** Power unit: 1.6 L 90° V6, crank axis 90 mm above the reference plane (5.4.2). */
export const PU = {
  front: XPU,
  /** The gearbox studs are 480 mm behind the mounting face (5.4.8). */
  rear: XPU - 480,
  crankY: Z(90),
  bore: 80,
  boreSpacing: 106,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

/** The six M12 studs that join the ICE to the survival cell: (y, z) on the XPU face (5.4.8). */
export const ENGINE_MOUNTS: [number, number][] = [
  [Z(15), 215],
  [Z(15), -215],
  [Z(260), 340],
  [Z(260), -340],
  [Z(420), 175],
  [Z(420), -175],
];

export const GEARBOX = {
  front: PU.rear,
  rear: XDIF - 325,
};

/**
 * Rear impact structure: a prescribed prism from 325 to 750 mm behind the
 * final drive, Z = 227.5–372.5 and about ±56 mm wide (§20).
 */
export const CRASH = { front: XDIF - 325, rear: XDIF - 750, top: Z(372.5), bottom: Z(227.5), half: 56 };

/** Exhaust tailpipe on the centre line: exit 550–565 mm behind the rear axle, above Z = 350, 100–130 mm bore (3.8.2). */
export const TAILPIPE = { exitX: XR - 558, bore: 115, y: Z(452) };

/**
 * Halo (12.4.2): front fixing axis 975 mm ahead of XC at Z = 660; rear
 * mounting faces on Z = 695.
 */
export const HALO = {
  rearX: XC + 10,
  rearZ: 262,
  rearY: Z(695),
  hoopY: 884,
  frontX: 740,
  pillarX: XC + 975,
  pillarY: Z(660),
  tube: 46,
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1850, 566, 128], rear: [1510, 616, 196], outer: [1790, 585, 686] },
  lower: { front: [XA - 10, 296, 118], rear: [1520, 220, 210], outer: [1815, 155, 716] },
  pushrod: { outer: [1805, 184, 676], inner: [1830, 628, 132] },
  trackRod: { inner: [1845, 306, 154], outer: [1900, 306, 694] },
} as const;

export const REAR_SUSP = {
  upper: { front: [-1560, 446, 124], rear: [-1980, 458, 104], outer: [-1820, 606, 636] },
  lower: { front: [-1450, 258, 144], rear: [-1940, 300, 104], outer: [-1790, 140, 658] },
  pushrod: { outer: [-1800, 170, 636], inner: [-1700, 476, 132] },
  toeLink: { inner: [-1985, 338, 104], outer: [-1985, 348, 651] },
} as const;
