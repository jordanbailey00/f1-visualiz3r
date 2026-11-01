/**
 * Shared dimensions of the 2009–2013 car (mm), built to the final (2013)
 * form of those rules; article numbers refer to the 2013 Formula 1
 * Technical Regulations. +X forward, +Y up, +Z to the driver's right. Plane
 * C-C, the rear of the cockpit opening, is at x = 0; the 3.42 m wheelbase
 * runs from 1,650 mm ahead of it to 1,770 mm behind.
 */

export const CAR = {
  /** No limit in these rules; 2013 cars were about 3.35–3.45 m. */
  wheelbase: 3420,
  /** The car may be 1,800 mm wide excluding tyres; bodywork between the axles 1,400 mm (3.3, 3.4.1). */
  width: 1800,
  frontAxle: 1650,
  rearAxle: -1770,
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
/** Front bulkhead of the survival cell, on the 1,950 mm line where the 2012 nose rule starts (3.7.9). */
export const XA = XC + 1950;
/** Engine mounting face: the fuel cell fills the space between XC and here. */
export const XPU = XC - 650;
/** Final drive axis on the rear wheel centre line. */
export const XDIF = XR;
export const FINAL_DRIVE_Y = Z(255);

/**
 * 13-inch wheels: complete wheel 305–355 mm wide at the front, 365–380 mm at
 * the rear, at most 660 mm across with dry tyres (12.4). `bead` is the rim's
 * bead-seat radius.
 */
export const TYRES = {
  front: { diameter: 660, width: 340, bead: 165.1 },
  rear: { diameter: 660, width: 376, bead: 165.1 },
};

/** Wheel centres: the rims' outer faces (24 mm narrower than the tyres) on the 1,800 mm width. */
export const WHEEL = {
  front: { x: XF, y: TYRES.front.diameter / 2, z: CAR.width / 2 - (TYRES.front.width - 24) / 2 },
  rear: { x: XR, y: TYRES.rear.diameter / 2, z: CAR.width / 2 - (TYRES.rear.width - 24) / 2 },
};

/** 13-inch rims. */
export const RIM = { bead: 165.1, flange: 178 };

/** Carbon discs: at most 278 mm across and 28 mm thick (11.3). */
export const BRAKES = {
  front: { radius: 139, thick: 28 },
  rear: { radius: 133, thick: 28 },
};

/**
 * Survival cell stations from its front bulkhead (A-A) to the engine
 * mounting face: x, top of the tub, underside, half-width at the shoulder.
 * It stays at Z = 625 back to B-B, 925 mm behind A-A (15.4.4); the rules that
 * lowered the nose in 2012 left this height alone, which made the step.
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(622), bottom: 268, w: 154 },
  { x: 1700, top: Z(622), bottom: 230, w: 180 },
  { x: 1500, top: Z(622), bottom: 194, w: 210 },
  { x: 1220, top: Z(624), bottom: 140, w: 254 },
  { x: 950, top: 684, bottom: 100, w: 300 },
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
 * Nose stations from the bulkhead to the tip. From 2012 nothing more than
 * 1,950 mm ahead of C-C may be above Z = 550 (3.7.9), but the chassis behind
 * that line stayed at Z = 625, so the top steps down 75 mm at the bulkhead.
 * The tip must stay within 1,200 mm of the front axle, and the underside
 * clear of the wing and its pylons.
 */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(548), bottom: 300, w: 150 },
  { x: 2150, top: Z(500), bottom: 296, w: 132 },
  { x: 2350, top: Z(440), bottom: 284, w: 110 },
  { x: 2520, top: Z(385), bottom: 266, w: 84 },
  { x: 2640, top: Z(335), bottom: 246, w: 56 },
  { x: 2690, top: Z(300), bottom: 256, w: 24 },
];

/**
 * The 2013 "vanity panel": an optional one-piece non-structural fairing of
 * prescribed laminate, up to Z = 625, that hides the step (3.7.9).
 */
export const VANITY = { rear: XA - 170, front: XA + 300 };

/**
 * Front wing (3.7): up to 1,800 mm wide, Z = 75–275, no further forward than
 * 1,000 mm ahead of the axle and no further back than 450 mm outboard of
 * ±400 mm. Inboard, between ±250 and ±400 mm, its trailing edge cuts forward
 * on a diagonal to 750 mm. The middle ±250 mm is the FIA's neutral section.
 */
export const FRONT_WING = {
  leadingEdge: XF + 990,
  trailingEdge: XF + 455,
  inner: 250,
  half: 793,
  /** Endplates between ±750 and ±840 mm; the foot plate out to the 900 mm tip. */
  endplate: { inner: 795, thick: 12 },
  tip: 897,
  /** Neutral section: leading edge 1,000 mm ahead of the axle, trailing edge at 760.6 mm, Z = 86.65 (Drawing 7). */
  neutral: { x: XF + 1000, chord: 239 },
};

/**
 * Rear wing (3.10): two profiles within ±355 mm, from the rear axle to 350 mm
 * behind it and Z = 730–950. The endplates stand between ±355 and ±375 mm;
 * seen from the side they must cover more than 330,000 mm² between Z = 300
 * and 950 and up to 600 mm behind the axle.
 */
export const REAR_WING = {
  half: 354,
  leadingEdge: XR - 6,
  top: Z(946),
  ep: 365,
  epFront: XR - 2,
  epRear: XR - 592,
  epBottom: Z(300),
};

/** Beam wing (3.10.1): one section, 150–350 mm behind the rear axle, Z = 300–400, between ±75 and ±355 mm. */
export const BEAM_WING = { x: XR - 155, inner: 78, half: 352 };

/**
 * Floor (3.12): everything seen from below between 330 mm behind the front
 * axle and the rear axle lies on the reference plane (the ±150 mm strip that
 * carries the plank) or 50 mm above it on the step plane. Ahead of the
 * sidepods the floor must keep out of the zone around the front wheels
 * (3.11.1), so it widens to ±700 mm only from 625 mm ahead of C-C. The
 * diffuser runs from the rear axle to 350 mm behind it, ±500 mm wide and up
 * to Z = 125 (Z = 175 in 2009–10).
 */
export const FLOOR = {
  front: XF - 330,
  half: 700,
  /** The step in to the diffuser, ahead of the rear tyres. */
  rearStep: XR + 335,
  keel: 150,
  step: 50,
  thick: 14,
  diffuserStart: XR,
  diffuserEnd: XR - 350,
  diffuserHalf: 500,
  diffuserHeight: 125,
  /** The tea tray ahead of the floor: nothing below Z = 100 at 325 mm behind the axle, rising to Z = 200 at 450 ahead (3.11.2). */
  trayFront: XF + 400,
  trayHalf: 200,
};

/**
 * The zone around the front wheels where no bodywork may stand (3.11.1),
 * as its inboard boundary: ±165 mm forward of a line at 4.5° from
 * (875 mm ahead of C-C, ±240 mm), then a diagonal out to (625 mm, ±415 mm).
 */
export const FRONT_ZONE = { inner: 165, kink: XC + 875, kinkY: 240, back: XC + 625, backY: 415 };

/** Plank: 300 mm wide, 10 mm thick, from 330 mm behind the front axle to the rear axle (3.13). */
export const PLANK = { front: XF - 330, rear: XR, frontHalf: 150, half: 150 };

/** Thickness-check holes, (x, z, diameter), measured from the plank's leading edge (Drawing 1). */
export const PLANK_HOLES: [number, number, number][] = [
  [PLANK.front - 50, 0, 50],
  [PLANK.front - 750, 90, 80],
  [PLANK.front - 750, -90, 80],
  [PLANK.front - 1500, 100, 50],
  [PLANK.front - 1500, -100, 50],
  [PLANK.front - 2250, 0, 80],
  [XR + 330, 0, 50],
];

/**
 * Engine: 2.4 L 90° V8, bore ≤98 mm, cylinders 106.5 mm apart, crank at least
 * 58 mm above the reference plane (5.1, 5.3). About 530 mm long.
 */
export const PU = {
  front: XPU,
  rear: XPU - 530,
  crankY: Z(60),
  bore: 98,
  boreSpacing: 106.5,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

/** The studs that join the engine to the survival cell: (y, z) on the XPU face. */
export const ENGINE_MOUNTS: [number, number][] = [
  [Z(15), 200],
  [Z(15), -200],
  [Z(240), 300],
  [Z(240), -300],
  [Z(400), 175],
  [Z(400), -175],
];

export const GEARBOX = {
  front: PU.rear,
  rear: XDIF - 250,
};

/**
 * Rear impact structure: its rear face is centred at Z = 300, at least 575 mm
 * behind the axle and within the 600 mm overhang (3.14, 15.5.3).
 */
export const CRASH = { front: XDIF - 250, rear: XDIF - 586, top: Z(372), bottom: Z(228), half: 64 };

/**
 * Exhaust (2012–13): two tailpipes, their last 100 mm straight, at most 75 mm
 * bore, tilted up 10–30°, between Z = 250 and 600 and ±200–500 mm, exiting
 * 500–1,200 mm ahead of the rear axle (5.8).
 */
export const TAILPIPE = { exitX: XR + 520, bore: 72, y: Z(330), z: 250, angle: 0.24 };

/**
 * Engine cover (3.16): from the side the car must be filled up to a diagonal
 * from Z = 925 at 1,000 mm ahead of the rear axle to Z = 550 at 50 mm ahead,
 * from 1,330 mm ahead of the axle back. Above it it may be no more than
 * 125 mm wide.
 */
export const COVER_LINE = {
  /** The diagonal at x, with a small margin above it. */
  top: (x: number) => Z(Math.min(925, 550 + (375 * (x - XR - 50)) / 950) + 8),
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1700, 566, 128], rear: [1360, 616, 196], outer: [1640, 555, 622] },
  lower: { front: [1800, 296, 118], rear: [1370, 220, 210], outer: [1665, 125, 652] },
  pushrod: { outer: [1655, 154, 612], inner: [1680, 628, 132] },
  trackRod: { inner: [1695, 306, 154], outer: [1750, 276, 630] },
} as const;

export const REAR_SUSP = {
  upper: { front: [-1530, 446, 124], rear: [-1950, 458, 104], outer: [-1790, 576, 597] },
  lower: { front: [-1420, 258, 144], rear: [-1910, 300, 104], outer: [-1760, 110, 619] },
  // A pull-rod: from the top of the upright down to a rocker low on the gearbox.
  pushrod: { outer: [-1782, 547, 584], inner: [-1660, 300, 150] },
  toeLink: { inner: [-1955, 338, 104], outer: [-1955, 318, 612] },
} as const;
