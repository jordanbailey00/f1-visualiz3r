/**
 * Shared dimensions of the 1998–2005 car (mm), built to the final (2005) form
 * of those rules; article numbers refer to the 2005 Formula One Technical
 * Regulations. +X forward, +Y up, +Z to the driver's right. Plane C-C, the
 * rear of the cockpit opening, is at x = 0; the 3.11 m wheelbase runs from
 * 1,500 mm ahead of it to 1,610 mm behind.
 */

export const CAR = {
  /** No limit in these rules; refuelling kept the tanks small and the cars short. */
  wheelbase: 3110,
  /** The car may be 1,800 mm wide including the wheels (3.3); bodywork ahead of the rear axle 1,400 mm (3.4.1). */
  width: 1800,
  frontAxle: 1500,
  rearAxle: -1610,
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
/** Front bulkhead of the survival cell (A-A): at least 1,800 mm ahead of C-C (13.1.1). */
export const XA = XC + 1800;
/** Engine mounting face: the fuel cell fills the short space between here and XC. */
export const XPU = XC - 470;
/** Final drive axis on the rear wheel centre line. */
export const XDIF = XR;
export const FINAL_DRIVE_Y = Z(255);

/**
 * 13-inch wheels: complete wheel 305–355 mm wide at the front, 365–380 mm at
 * the rear, at most 660 mm across with dry tyres (12.4). `bead` is the rim's
 * bead-seat radius. Dry tyres carry four grooves.
 */
export const TYRES = {
  front: { diameter: 660, width: 345, bead: 165.1, grooves: 4 },
  rear: { diameter: 660, width: 376, bead: 165.1, grooves: 4 },
};

/** Wheel centres: the 1,800 mm width includes the tyres (3.3). */
export const WHEEL = {
  front: { x: XF, y: TYRES.front.diameter / 2, z: CAR.width / 2 - TYRES.front.width / 2 },
  rear: { x: XR, y: TYRES.rear.diameter / 2, z: CAR.width / 2 - TYRES.rear.width / 2 },
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
 * These rules set no ceiling on the tub, so it runs high and level from the
 * bulkhead to the cockpit, leaving room for air under the nose.
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(630), bottom: 262, w: 150 },
  { x: 1650, top: Z(636), bottom: 226, w: 176 },
  { x: 1450, top: Z(642), bottom: 186, w: 206 },
  { x: 1180, top: Z(646), bottom: 136, w: 244 },
  { x: 950, top: 690, bottom: 100, w: 300 },
  { x: 650, top: 702, bottom: 74, w: 348 },
  { x: 330, top: 708, bottom: 60, w: 376 },
  { x: 20, top: 712, bottom: 56, w: 384 },
  { x: -280, top: 712, bottom: 56, w: 372 },
  { x: XPU, top: 690, bottom: 60, w: 340 },
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
 * Nose stations from the bulkhead to the tip: high, so that air can reach the
 * floor underneath, sloping down to a slim tip. Within ±200 mm the car may
 * reach 1,200 mm ahead of the front axle (3.14), and 50 mm behind its tip the
 * crash structure must keep 9,000 mm² of section (15.4.3).
 */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(628), bottom: 300, w: 146 },
  { x: 1960, top: 612, bottom: 302, w: 128 },
  { x: 2130, top: 534, bottom: 298, w: 104 },
  { x: 2290, top: 456, bottom: 286, w: 80 },
  { x: 2410, top: 398, bottom: 276, w: 60 },
  { x: 2475, top: 356, bottom: 292, w: 32 },
];

/**
 * Front wing (3.7): at most 1,400 mm wide. Outside ±250 mm it must stay
 * Z = 150–350, a limit raised 50 mm for 2005; ahead of the axle nothing may be
 * below Z = 50 (3.7.2). Outside ±200 mm it may reach only 900 mm ahead of the
 * axle (3.14), and outside ±400 mm it must stop 350 mm ahead (3.11).
 */
export const FRONT_WING = {
  half: 690,
  /** Where the wing is allowed to drop towards the low middle section. */
  inner: 250,
  leadingEdge: XF + 890,
  centreEdge: XF + 985,
  trailingEdge: XF + 356,
  /** Endplates at the 1,400 mm limit. */
  endplate: { z: 694, thick: 12 },
};

/**
 * Rear wing (3.10): two sections within ±480 mm, Z = 600–800, from the rear
 * axle to 350 mm behind it, with a slot of no more than 15 mm. The endplates
 * stand just outside, up to ±500 mm; seen from the side the bodywork must
 * cover more than 230,000 mm² between Z = 300 and 800, up to 600 mm behind
 * the axle.
 */
export const REAR_WING = {
  half: 478,
  leadingEdge: XR - 2,
  top: Z(788),
  ep: 490,
  epFront: XR - 12,
  epRear: XR - 552,
  epBottom: Z(316),
};

/** Beam wing (3.10.3): one section, 150–500 mm behind the rear axle, Z = 300–375, between ±75 and ±480 mm. */
export const BEAM_WING = { x: XR - 156, inner: 78, half: 478 };

/**
 * Floor (3.12): everything seen from below, from 330 mm behind the front axle
 * to 330 mm ahead of the rear axle, lies on the reference plane (the strip
 * that carries the plank) or 50 mm above it on the step plane. Ahead of a line
 * 800 mm behind the front axle it must stay inside ±400 mm, clear of the front
 * wheels (3.11), and for the last 400 mm before the rear axle inside ±500 mm
 * (3.8.4), the cut made for 2005. The diffuser starts 330 mm ahead of the rear
 * axle, rising to Z = 125 outside ±150 mm (3.12.7); only its middle may run
 * past the axle.
 */
export const FLOOR = {
  front: XF - 330,
  half: 696,
  /** The zone round the front wheels ends here, 800 mm behind the axle (3.11). */
  frontZone: XF - 800,
  frontHalf: 396,
  /** The step in round the rear tyres (3.8.4). */
  rearStep: XR + 400,
  rearHalf: 496,
  keel: 150,
  step: 50,
  thick: 14,
  diffuserStart: XR + 330,
  diffuserEnd: XR,
  diffuserHeight: 125,
  /** The middle of the diffuser, ±150 mm, kicks up behind the axle towards the crash structure. */
  tailEnd: XR - 262,
  tailHeight: 196,
  /** The tea tray ahead of the floor stays at least 50 mm up (3.7.2), inside ±250 mm (3.7.1). */
  trayFront: XF + 225,
  trayHalf: 244,
  trayHeight: 52,
};

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
 * Engine: 3-litre V10 (5.1). The rules set no limit on revs, bore, cylinder
 * spacing, vee angle or weight; this one has the 90° vee most teams used and
 * is about 625 mm long.
 */
export const PU = {
  front: XPU,
  rear: XPU - 625,
  crankY: Z(62),
  bore: 97,
  boreSpacing: 106,
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
 * Rear impact structure: its rearmost point at least 480 mm behind the axle,
 * with at least 9,000 mm² of section 50 mm ahead of that (15.5.3).
 */
export const CRASH = { front: XDIF - 250, rear: XDIF - 490, top: Z(404), bottom: Z(244), half: 60 };

/**
 * Exhaust: the rules forbid only variable-geometry systems (5.4), so the
 * tailpipes rise through the top of the bodywork as periscopes, well ahead of
 * the rear axle, with their gas blowing up and back over the coke bottle.
 */
export const TAILPIPE = { exitX: XR + 440, bore: 84, y: Z(598), z: 190, angle: 1 };

/**
 * Engine cover (3.16): from the side the car must be filled up to a diagonal
 * from Z = 925 at 1,000 mm ahead of the rear axle to Z = 550 at the axle, from
 * 1,330 mm ahead of the axle back. Above it it may be no more than 125 mm wide.
 */
export const COVER_LINE = {
  /** The diagonal at x, with a small margin above it. */
  top: (x: number) => Z(Math.min(925, 550 + (375 * (x - XR)) / 1000) + 8),
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1550, 566, 128], rear: [1210, 616, 196], outer: [1490, 555, 622] },
  lower: { front: [1650, 296, 118], rear: [1220, 220, 210], outer: [1515, 125, 652] },
  pushrod: { outer: [1505, 154, 612], inner: [1530, 640, 132] },
  trackRod: { inner: [1545, 306, 154], outer: [1600, 276, 630] },
} as const;

export const REAR_SUSP = {
  upper: { front: [-1370, 446, 124], rear: [-1790, 450, 84], outer: [-1630, 576, 597] },
  lower: { front: [-1260, 258, 144], rear: [-1750, 300, 84], outer: [-1600, 110, 619] },
  // A push-rod: from the bottom of the upright up to a rocker on top of the gearbox.
  pushrod: { outer: [-1614, 142, 596], inner: [-1490, 456, 100] },
  toeLink: { inner: [-1795, 338, 84], outer: [-1795, 318, 612] },
} as const;
