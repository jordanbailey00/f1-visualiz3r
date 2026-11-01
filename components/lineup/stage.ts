import { Box3, Vector3 } from "three";

/**
 * The lineup is one scene in true millimetres, drawn with an orthographic
 * camera: there is no perspective, so a car further away is not smaller, and
 * every car on screen is at exactly the same scale. Cars stand on a shared
 * datum, their rear axles in line.
 */
export type LineupView = "top" | "side" | "front" | "3d";

export const VIEWS: { id: LineupView; label: string; title: string }[] = [
  { id: "top", label: "Top", title: "Plan view: length and width" },
  { id: "side", label: "Side", title: "Side view: length, wheelbase and height" },
  { id: "front", label: "Front", title: "Front view: width and height" },
  { id: "3d", label: "3D", title: "Free view: drag to turn the whole lineup" },
];

/** Where the row of rear axles stands along x: the cars then sit around the scene's origin. */
export const AXLE_X = -2100;
/** Centre-to-centre spacing of the cars, side by side. */
export const PITCH = 2500;
/** Height of one row when the side views are stacked: taller on a phone, where the label sits above the car. */
export const ROW = 1400;
export const ROW_NARROW = 1950;
/** Below this width (Tailwind's `sm`) labels shorten and the side view stacks them over the cars. */
export const NARROW = 640;
/** The front views go in two rows, each car with room for its label above it. */
export const FRONT_ROW = 1750;
export const FRONT_PITCH = 2400;

export type V3 = [number, number, number];

/** Where a car's rear axle (on the ground, on its centre line) stands in this view. */
export function slot(view: LineupView, index: number, count: number, narrow = false): V3 {
  if (view === "side") return [AXLE_X, (count - 1 - index) * (narrow ? ROW_NARROW : ROW), 0];
  if (view === "front") {
    const cols = Math.ceil(count / 2);
    const row = Math.floor(index / cols);
    const inRow = row === 0 ? cols : count - cols;
    return [AXLE_X, (1 - row) * FRONT_ROW, -((index % cols) - (inRow - 1) / 2) * FRONT_PITCH];
  }
  // Seen from ahead of the cars, the screen's right is −z: oldest on the left.
  return [AXLE_X, 0, -(index - (count - 1) / 2) * PITCH];
}

/** From the target to the camera. */
export const VIEW_DIR: Record<LineupView, V3> = {
  top: [1e-4, 1, 0],
  side: [0, 0, 1],
  front: [1, 0, 0],
  "3d": [0.72, 0.56, 0.42],
};

/** Screen pixels kept clear of the car rows: the top bar, the labels, the scale. */
export function viewPadding(view: LineupView, narrow: boolean) {
  if (view === "side") return narrow ? { left: 14, right: 14, top: 104, bottom: 52 } : { left: 250, right: 60, top: 84, bottom: 56 };
  if (view === "front") return { left: 30, right: 30, top: 150, bottom: 56 };
  if (view === "3d") return { left: 60, right: 60, top: 90, bottom: 120 };
  return { left: 30, right: 30, top: 150, bottom: 56 };
}

/** One car's measured extents, with its rear axle at the origin (mm). */
export interface CarBounds {
  min: V3;
  max: V3;
  /** Overall width across the tyres. */
  width: number;
  /** Top of the bodywork: the roof of the airbox, not the camera on top of it. */
  height: number;
}

/**
 * A label's anchor in the scene, and how it hangs from that point. `tail` is
 * the rearmost point of any car, so the side labels line up in a column.
 */
export function labelAnchor(view: LineupView, at: V3, b: CarBounds, tail: number, narrow: boolean): { point: V3; hang: string } {
  if (view === "side") {
    if (narrow) return { point: [at[0] + tail, at[1] + b.height + 40, 0], hang: "translate(0, -100%)" };
    return { point: [at[0] + tail - 90, at[1] + 470, 0], hang: "translate(-100%, -50%)" };
  }
  if (view === "front") return { point: [at[0] + 1000, at[1] + b.height + 110, at[2]], hang: "translate(-50%, -100%)" };
  if (view === "3d") return { point: [at[0] + b.max[0] + 170, 0, at[2]], hang: "translate(-50%, 0)" };
  return { point: [at[0] + b.min[0] - 150, 0, at[2]], hang: "translate(-50%, -100%)" };
}

const tmp = new Vector3();

/**
 * The camera placement that frames `box` from `dir`: the target to look at and
 * the zoom (screen pixels per millimetre), leaving `pad` pixels clear.
 */
export function fitOrthographic(box: Box3, dir: Vector3, width: number, height: number, pad: ReturnType<typeof viewPadding>) {
  const back = dir.clone().normalize();
  const worldUp = new Vector3(0, 1, 0);
  const right = worldUp.clone().cross(back);
  if (right.lengthSq() < 1e-12) right.set(0, 0, -1);
  right.normalize();
  const up = back.clone().cross(right).normalize();
  let [r0, r1, u0, u1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        tmp.set(x, y, z);
        const r = tmp.dot(right);
        const u = tmp.dot(up);
        r0 = Math.min(r0, r);
        r1 = Math.max(r1, r);
        u0 = Math.min(u0, u);
        u1 = Math.max(u1, u);
      }
  const zoom = Math.min((width - pad.left - pad.right) / (r1 - r0), (height - pad.top - pad.bottom) / (u1 - u0));
  // The framed block's centre goes to the middle of the free area, not of the canvas.
  const dx = (pad.left - pad.right) / 2 / zoom;
  const dy = (pad.bottom - pad.top) / 2 / zoom;
  const target = new Vector3()
    .addScaledVector(right, (r0 + r1) / 2 - dx)
    .addScaledVector(up, (u0 + u1) / 2 - dy)
    .addScaledVector(back, box.getCenter(tmp).dot(back));
  return { target, zoom };
}
