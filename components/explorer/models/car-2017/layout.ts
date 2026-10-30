/**
 * Shared dimensions of the 2017–2021 car (mm), built to the final (2021)
 * form of those rules; article numbers refer to the 2021 Formula 1
 * Technical Regulations. +X forward, +Y up, +Z to the driver's right; the
 * wheelbase is centred on x = 0 and the car stands on y = 0.
 */

export const CAR = {
  /** No limit in these rules; 2021 cars ranged from about 3.6 to 3.7 m. */
  wheelbase: 3600,
  /** The car may be 2,000 mm wide excluding tyres; bodywork between the axles 1,600 mm (3.2.2). */
  width: 2000,
  frontAxle: 1800,
  rearAxle: -1800,
  /** The reference plane: the underside of the plank's carrier, the lowest part of the sprung car. */
  refY: 40,
};

/** Height above the reference plane (the rules measure heights from it). */
export const Z = (mm: number) => CAR.refY + mm;

/*
 * Datums as car x positions. The rules measure from the wheel centre lines
 * and from plane C-C, the rear face of the cockpit-entry template.
 */
/** Front wheel centre line. */
export const XF = CAR.frontAxle;
/** Rear wheel centre line. */
export const XR = CAR.rearAxle;
/** Plane C-C, the rear of the cockpit opening. */
export const XC = 0;
/** Front bulkhead of the survival cell (A-A): at least 1,800 mm ahead of C-C (15.4.3). */
export const XA = XC + 1960;
/** ICE mounting face: the fuel cell fills the space between XC and here. */
export const XPU = XC - 600;
/** Final drive axis on the rear wheel centre line. */
export const XDIF = XR;
export const FINAL_DRIVE_Y = Z(255);

/**
 * 13-inch wheels: complete wheel 370–385 mm wide at the front, 455–470 mm at
 * the rear, at most 670 mm across with dry tyres (12.4). `bead` is the rim's
 * bead-seat radius.
 */
export const TYRES = {
  front: { diameter: 670, width: 378, bead: 165.1 },
  rear: { diameter: 670, width: 462, bead: 165.1 },
};

/** Wheel centres: the rims' outer faces (24 mm narrower than the tyres) on the 2,000 mm width. */
export const WHEEL = {
  front: { x: XF, y: TYRES.front.diameter / 2, z: CAR.width / 2 - (TYRES.front.width - 24) / 2 },
  rear: { x: XR, y: TYRES.rear.diameter / 2, z: CAR.width / 2 - (TYRES.rear.width - 24) / 2 },
};

/** 13-inch rims. */
export const RIM = { bead: 165.1, flange: 178 };

/** Carbon discs: at most 278 mm across and 32 mm thick (11.4). */
export const BRAKES = {
  front: { radius: 139, thick: 32 },
  rear: { radius: 133, thick: 32 },
};

/**
 * Survival cell stations from its front bulkhead (A-A) to the engine
 * mounting face: x, top of the tub, underside, half-width at the shoulder.
 * At A-A it must hold a 300 × 275 mm section, at B-B (875 mm ahead of C-C)
 * 450 × 400 mm; its top may not rise above Z = 525 at A-A, sloping to 625
 * 375 mm further back (15.4.3).
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(522), bottom: 268, w: 154 },
  { x: 1700, top: 612, bottom: 232, w: 180 },
  { x: 1500, top: 640, bottom: 194, w: 210 },
  { x: 1220, top: 668, bottom: 140, w: 254 },
  { x: 950, top: 690, bottom: 100, w: 300 },
  { x: 650, top: 702, bottom: 74, w: 348 },
  { x: 330, top: 708, bottom: 60, w: 376 },
  { x: 20, top: 712, bottom: 56, w: 384 },
  { x: -280, top: 714, bottom: 56, w: 372 },
  { x: XPU, top: 680, bottom: 60, w: 330 },
];

/** Cockpit opening: its rear edge is plane C-C. */
export const COCKPIT = {
  front: 860,
  rear: XC,
  /** Half-width of the opening at the rim. */
  halfWidth: 232,
  floorY: 126,
};

/**
 * Nose stations from the bulkhead to the tip. The tip must reach 1,075 mm
 * ahead of the front axle and no higher than Z = 220, the top staying under
 * a line from Z = 550 at A-A; 50 mm behind the tip it is at most 140 mm wide
 * with its underside at Z ≥ 135; from 875 to 523 mm ahead of the axle it
 * stays within ±165 mm (3.4, 15.5.6).
 */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(522), bottom: 268, w: 154 },
  { x: 2250, top: 484, bottom: 262, w: 152 },
  { x: 2600, top: 380, bottom: 248, w: 122 },
  { x: 2820, top: 300, bottom: 214, w: 84 },
  { x: 2920, top: 262, bottom: 182, w: 62 },
  { x: 2970, top: Z(206), bottom: 186, w: 30 },
];

/**
 * Front wing (3.3, from 2019): up to five elements between ±250 mm and the
 * endplates at ±910–950 mm, Z = 75–300, inside a band whose leading edge
 * runs from 1,225 mm ahead of the axle on the centre line to 1,025 mm at
 * ±1,000 mm, and whose trailing edge runs from 650 to 450 mm. The middle
 * ±250 mm is the FIA's fixed neutral section.
 */
export const FRONT_WING = {
  leadingEdge: XF + 1220,
  trailingEdge: XF + 655,
  sweep: 0.2,
  inner: 250,
  half: 908,
  endplate: { inner: 910, thick: 12 },
  /** Neutral section: chord about 239 mm, leading edge 1,215 mm ahead of the axle. */
  neutral: { x: XF + 1215, chord: 239 },
};

/**
 * Rear wing (3.6, from 2019): two profiles between 150 and 500 mm behind the
 * rear axle and Z = 650–870, within ±505 mm. The endplates are flat above
 * Z = 500 out at ±525 mm; below it the car may only be 840 mm wide, so they
 * step in to ±410 mm down to Z = 200. There is no beam wing: between Z = 200
 * and 650 nothing may sit between ±100 and ±400 mm.
 */
export const REAR_WING = {
  half: 505,
  leadingEdge: XR - 152,
  top: Z(866),
  epUpper: 520,
  epLower: 410,
  /** Endplate outline: the leading edge behind the line (R0, Z370)–(R−190, Z870), the trailing edge ahead of (R−550, Z200)–(R−810, Z870). */
  epFrontTop: XR - 196,
  epFrontLow: XR - 30,
  epRearTop: XR - 800,
  epRearLow: XR - 556,
};

/**
 * Floor (3.7): everything seen from below between 430 mm behind the front
 * axle and 175 mm ahead of the rear lies on the reference plane (the ±150 mm
 * strip that carries the plank) or 50 mm above it on the step plane. It is
 * ±800 mm wide, trimmed for 2021 on a diagonal from ±800 at C-C to ±650 at
 * the rear axle, and the diffuser runs from 175 mm ahead of the rear axle to
 * 350 mm behind it, ±525 mm wide and up to Z = 175.
 */
export const FLOOR = {
  front: XF - 430,
  half: 800,
  /** 2021 cut: ±800 at C-C narrowing to ±650 at the rear axle. */
  cutStart: XC,
  cutHalf: 650,
  /** Where the floor steps in to the diffuser, ahead of the rear tyres. */
  rearStep: XR + 335,
  keel: 150,
  step: 50,
  thick: 14,
  diffuserStart: XR + 175,
  diffuserEnd: XR - 350,
  diffuserHalf: 525,
  diffuserHeight: 175,
  /** The tea tray ahead of the floor: nothing below Z = 100 at 425 mm behind the axle, rising to 135 at 450 ahead (3.4.3). */
  trayFront: XF + 400,
  trayHalf: 220,
};

/**
 * Bargeboard area (3.5.6): from 430 mm behind the front axle back to a line
 * 625 mm ahead of C-C, out to ±800 mm and no higher than Z = 350. Between
 * ±320 and ±700 mm a gap must stay clear ahead of the sidepods, between lines
 * through 700 and 625 mm ahead of C-C, each at 75° to the centre line.
 */
export const BARGEBOARD = { front: XF - 440, gap: XC + 700, top: Z(345), outer: 800 };

/** Plank: 300 mm wide, 10 mm thick, from 430 mm behind the front axle to the rear axle (3.7.11). */
export const PLANK = { front: XF - 430, rear: XR, frontHalf: 150, half: 150 };

/** Thickness-check holes, (x, z, diameter) (Drawing 1). */
export const PLANK_HOLES: [number, number, number][] = [
  [XF - 480, 0, 50],
  [XF - 1080, 90, 80],
  [XF - 1080, -90, 80],
  [XF - 1830, 100, 50],
  [XF - 1830, -100, 50],
  [XF - 2580, 0, 80],
  [XR + 330, 0, 50],
];

/** Power unit: 1.6 L 90° V6, crank axis 90 mm above the reference plane (5.3.2). */
export const PU = {
  front: XPU,
  rear: XPU - 480,
  crankY: Z(90),
  bore: 80,
  boreSpacing: 106,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

/** The engine's mounting studs on the survival cell: (y, z) on the XPU face. */
export const ENGINE_MOUNTS: [number, number][] = [
  [Z(15), 215],
  [Z(15), -215],
  [Z(260), 300],
  [Z(260), -300],
  [Z(420), 175],
  [Z(420), -175],
];

export const GEARBOX = {
  front: PU.rear,
  rear: XDIF - 250,
};

/**
 * Rear impact structure: behind 500 mm past the rear axle everything near the
 * centre line must lie between Z = 200 and 400 and end within 710 mm; its
 * rear face is centred at Z = 300 at least 575 mm behind the axle (3.6.5,
 * 15.5.3).
 */
export const CRASH = { front: XDIF - 250, rear: XDIF - 600, top: Z(372), bottom: Z(228), half: 64 };

/**
 * Exhaust: one turbine tailpipe and two wastegate pipes, their last 150 mm
 * straight, between Z = 350 and 550 and within 100 mm of the centre line,
 * exiting 220–235 mm behind the rear axle (5.8).
 */
export const TAILPIPE = { exitX: XR - 228, bore: 115, y: Z(424), wastegate: { bore: 38, z: 72, y: Z(470) } };

/** Halo: front fixing axis 975 mm ahead of C-C at Z = 640, rear mounts on Z = 675 (15.2). */
export const HALO = {
  rearX: XC + 10,
  rearZ: 262,
  rearY: Z(675),
  hoopY: 868,
  frontX: 740,
  pillarX: XC + 975,
  pillarY: Z(640),
  tube: 46,
};

/**
 * Engine cover (3.5.1): from the side the car must be filled up to a diagonal
 * from Z = 925 at 1,000 mm ahead of the rear axle to Z = 550 at 50 mm ahead,
 * and may rise no higher than a parallel line through Z = 650 on the axle
 * (the 2018 cut to the 2017 shark fins). Above the filled area it may be no
 * more than 125 mm wide.
 */
export const COVER_LINE = {
  /** Height of the 2018 limit line at x (also the 950 mm overall height). */
  top: (x: number) => Z(Math.min(950, 650 + ((925 - 550) / 950) * (x - XR))),
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1850, 566, 128], rear: [1510, 616, 196], outer: [1790, 560, 703] },
  lower: { front: [XA - 10, 296, 118], rear: [1520, 220, 210], outer: [1815, 130, 733] },
  pushrod: { outer: [1805, 159, 693], inner: [1830, 628, 132] },
  trackRod: { inner: [1845, 306, 154], outer: [1900, 281, 711] },
} as const;

export const REAR_SUSP = {
  upper: { front: [-1560, 446, 124], rear: [-1980, 458, 104], outer: [-1820, 581, 653] },
  lower: { front: [-1450, 258, 144], rear: [-1940, 300, 104], outer: [-1790, 115, 675] },
  // A pull-rod: from the top of the upright down to a rocker low on the gearbox.
  pushrod: { outer: [-1812, 552, 640], inner: [-1690, 300, 150] },
  toeLink: { inner: [-1985, 338, 104], outer: [-1985, 323, 668] },
} as const;
