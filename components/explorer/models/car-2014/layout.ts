/**
 * Shared dimensions of the 2014–2016 car (mm), built to the final (2016)
 * form of those rules; article numbers refer to the 2016 Formula 1
 * Technical Regulations. +X forward, +Y up, +Z to the driver's right. Plane
 * C-C, the rear of the cockpit opening, is at x = 0; the 3.5 m wheelbase runs
 * from 1,500 mm ahead of it to 2,000 mm behind.
 */

export const CAR = {
  /** No limit in these rules; 2016 cars were about 3.5 m. */
  wheelbase: 3500,
  /** The car may be 1,800 mm wide excluding tyres; bodywork between the axles 1,400 mm (3.3, 3.4.1). */
  width: 1800,
  frontAxle: 1500,
  rearAxle: -2000,
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
/** ICE mounting face: the fuel cell fills the space between XC and here. */
export const XPU = XC - 600;
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

/** Carbon discs: at most 278 mm across and 28 mm thick (11.3.2). */
export const BRAKES = {
  front: { radius: 139, thick: 28 },
  rear: { radius: 133, thick: 28 },
};

/**
 * Survival cell stations from its front bulkhead (A-A) to the engine
 * mounting face: x, top of the tub, underside, half-width at the shoulder.
 * At A-A it must hold a 300 × 275 mm section with its top no higher than
 * Z = 525; at B-B, 925 mm behind A-A, 450 × 400 mm; from there back to C-C at
 * least 450 mm wide and 550 mm tall (15.4).
 */
export const TUB: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(522), bottom: 268, w: 154 },
  { x: 1600, top: 610, bottom: 228, w: 190 },
  { x: 1400, top: 650, bottom: 180, w: 224 },
  { x: 1150, top: 676, bottom: 130, w: 264 },
  { x: 875, top: 692, bottom: 96, w: 302 },
  { x: 650, top: 702, bottom: 74, w: 346 },
  { x: 330, top: 708, bottom: 60, w: 372 },
  { x: 20, top: 712, bottom: 56, w: 380 },
  { x: -280, top: 714, bottom: 56, w: 368 },
  { x: XPU, top: 680, bottom: 60, w: 345 },
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
 * Nose stations from the bulkhead to the tip (from 2015). The tip must reach
 * 850 mm ahead of the front axle; 50 mm behind it the section must exceed
 * 9,000 mm² within 140 mm of width and nothing may be below Z = 135. The top
 * stays under a line from Z = 550 at A-A to Z = 220 just behind the tip
 * (15.4.3, 3.7.9).
 */
export const NOSE: { x: number; top: number; bottom: number; w: number }[] = [
  { x: XA, top: Z(522), bottom: 268, w: 154 },
  { x: 2000, top: 462, bottom: 254, w: 140 },
  { x: 2200, top: 340, bottom: 220, w: 110 },
  { x: 2300, top: 282, bottom: 186, w: 80 },
  { x: 2340, top: 262, bottom: 178, w: 62 },
  { x: 2385, top: Z(206), bottom: 186, w: 30 },
];

/**
 * Front wing (3.7): at most 1,650 mm wide, Z = 75–275, no further forward than
 * 1,000 mm ahead of the axle and no further back than 450 mm outboard of
 * ±400 mm. Inboard, between ±250 and ±400 mm, its trailing edge cuts forward
 * on a diagonal to 750 mm. The middle ±250 mm is the FIA's neutral section.
 */
export const FRONT_WING = {
  leadingEdge: XF + 990,
  trailingEdge: XF + 455,
  inner: 250,
  half: 728,
  /** Endplates between ±685 and ±775 mm; the foot plate out to the 825 mm tip. */
  endplate: { inner: 730, thick: 12 },
  tip: 822,
  /** Neutral section: leading edge 1,000 mm ahead of the axle, trailing edge at 760.6 mm, Z = 86.65 (Drawing 7). */
  neutral: { x: XF + 1000, chord: 239 },
};

/**
 * Rear wing (3.10): two profiles within ±355 mm, from the rear axle to 350 mm
 * behind it and Z = 750–950. The endplates stand between ±355 and ±375 mm;
 * seen from the side they must cover more than 330,000 mm² between Z = 300
 * and 950 and up to 600 mm behind the axle. No beam wing: between ±100 and
 * ±355 mm nothing may sit from Z = 150 to 750.
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

/** The monkey seat: a winglet above the exhaust, within ±100 mm and below Z = 600 (2016). */
export const MONKEY_SEAT = { x: XR - 110, y: Z(540), half: 92 };

/**
 * Floor (3.12): everything seen from below between 330 mm behind the front
 * axle and the rear axle lies on the reference plane (the ±150 mm strip that
 * carries the plank) or 50 mm above it on the step plane. Ahead of the
 * sidepods the floor must keep out of the zone around the front wheels
 * (3.11.1), so it widens to ±700 mm only from 625 mm ahead of C-C. The
 * diffuser runs from the rear axle to 350 mm behind it, ±500 mm wide and up
 * to Z = 125.
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
  /** The tea tray ahead of the floor: nothing below Z = 100 at 325 mm behind the axle, rising to 135 at 450 ahead (3.11.2). */
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

/** Power unit: 1.6 L 90° V6, crank axis 90 mm above the reference plane (5.3). */
export const PU = {
  front: XPU,
  /** The gearbox studs are 480 mm behind the chassis studs (5.3.5). */
  rear: XPU - 480,
  crankY: Z(90),
  bore: 80,
  boreSpacing: 106,
  /** Vee angle between the two banks (rad). */
  vee: Math.PI / 2,
};

/** The six studs that join the ICE to the survival cell: (y, z) on the XPU face (5.3.5). */
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
  rear: XDIF - 250,
};

/**
 * Rear impact structure: behind 500 mm past the rear axle everything near the
 * centre line must lie between Z = 200 and 400; its rear face is centred at
 * Z = 300, at least 575 mm behind the axle and within the 600 mm overhang
 * (3.10.4, 15.5.3).
 */
export const CRASH = { front: XDIF - 250, rear: XDIF - 586, top: Z(372), bottom: Z(228), half: 64 };

/**
 * Exhaust (2016): one turbine tailpipe and two wastegate pipes, their last
 * 150 mm straight, between Z = 350 and 550 and within 100 mm of the centre
 * line, exiting 170–185 mm behind the rear axle (5.8).
 */
export const TAILPIPE = { exitX: XR - 178, bore: 115, y: Z(430), wastegate: { bore: 38, z: 72, y: Z(476) } };

/**
 * Engine cover (3.16): from the side the car must be filled up to a diagonal
 * from Z = 925 at 1,000 mm ahead of the rear axle to Z = 550 at 50 mm ahead,
 * from 1,330 mm ahead of the axle back. There was no limit on fins above it,
 * as long as they were no more than 125 mm wide.
 */
export const COVER_LINE = {
  /** The diagonal at x, with a small margin above it. */
  top: (x: number) => Z(Math.min(925, 550 + (375 * (x - XR - 50)) / 950) + 8),
};

/** Suspension pick-up points, right-hand side (z > 0); the left mirrors them. */
export const FRONT_SUSP = {
  upper: { front: [1550, 566, 128], rear: [1210, 616, 196], outer: [1490, 555, 622] },
  lower: { front: [1650, 296, 118], rear: [1220, 220, 210], outer: [1515, 125, 652] },
  pushrod: { outer: [1505, 154, 612], inner: [1530, 628, 132] },
  trackRod: { inner: [1545, 306, 154], outer: [1600, 276, 630] },
} as const;

export const REAR_SUSP = {
  upper: { front: [-1760, 446, 124], rear: [-2180, 458, 104], outer: [-2020, 576, 597] },
  lower: { front: [-1650, 258, 144], rear: [-2140, 300, 104], outer: [-1990, 110, 619] },
  // A pull-rod: from the top of the upright down to a rocker low on the gearbox.
  pushrod: { outer: [-2012, 547, 584], inner: [-1890, 300, 150] },
  toeLink: { inner: [-2185, 338, 104], outer: [-2185, 318, 612] },
} as const;
