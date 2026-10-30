"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { Vector3, type Group } from "three";
import { useExplorer } from "@/lib/cars/store";
import { aeroProgress, explodeProgress } from "./explode";

type Vec3 = [number, number, number];

export interface PartProps {
  /** Key into the car's `parts` content map. Unique within a car. */
  id: string;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
  /**
   * Displacement (parent space, mm) applied when the view is fully exploded.
   * Nested parts add their own displacement on top of their parent's.
   */
  explode?: Vec3;
  /**
   * Portion of the explode slider over which this part moves, e.g. [0, 0.5]
   * moves early and [0.5, 1] moves late. Defaults to the full range.
   */
  explodeRange?: [number, number];
  /** Extra rotation (radians, XYZ) reached when fully exploded. */
  explodeRotate?: Vec3;
  /** Shells/covers that turn see-through in X-ray mode. */
  cover?: boolean;
  children?: ReactNode;
}

/** Pointer travel (px) above which a click is treated as a drag. */
const DRAG_THRESHOLD = 5;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * A selectable, explodable piece of hardware. Everything rendered inside it
 * (that is not inside a nested Part) belongs to it for hovering, selection,
 * focus mode and X-ray.
 */
export function Part({
  id,
  position,
  rotation,
  scale,
  explode,
  explodeRange,
  explodeRotate,
  cover,
  children,
}: PartProps) {
  const ref = useRef<Group>(null);
  const userData = useMemo(() => ({ partId: id, cover: !!cover }), [id, cover]);
  const base = position ?? ZERO;

  const baseRot = rotation ?? ZERO;

  useFrame(() => {
    const g = ref.current;
    if (!g || (!explode && !explodeRotate)) return;
    const range = explodeRange ?? FULL;
    const t = smoothstep(range[0], range[1], explodeProgress.value);
    if (explode) {
      g.position.set(base[0] + explode[0] * t, base[1] + explode[1] * t, base[2] + explode[2] * t);
    }
    if (explodeRotate) {
      g.rotation.set(
        baseRot[0] + explodeRotate[0] * t,
        baseRot[1] + explodeRotate[1] * t,
        baseRot[2] + explodeRotate[2] * t,
      );
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useExplorer.getState().hover(id);
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (useExplorer.getState().hoveredId === id) useExplorer.getState().hover(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > DRAG_THRESHOLD) return;
    // Selecting leaves the camera alone; double-click (or F) flies to the part.
    useExplorer.getState().select(id);
  };
  const onDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    useExplorer.getState().select(id, "focus");
  };

  return (
    <group
      ref={ref}
      position={base}
      rotation={rotation}
      scale={scale}
      userData={userData}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </group>
  );
}

/**
 * Moves its children with the exploded view like a <Part>, but is not a part
 * itself: use it inside a part to send mirrored pieces (left and right
 * wheels, both sidepods…) in opposite directions.
 */
export function Shift({
  position,
  rotation,
  explode,
  explodeRange,
  explodeRotate,
  children,
}: Pick<PartProps, "position" | "rotation" | "explode" | "explodeRange" | "explodeRotate" | "children">) {
  const ref = useRef<Group>(null);
  const base = position ?? ZERO;
  const baseRot = rotation ?? ZERO;
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const range = explodeRange ?? FULL;
    const t = smoothstep(range[0], range[1], explodeProgress.value);
    if (explode) g.position.set(base[0] + explode[0] * t, base[1] + explode[1] * t, base[2] + explode[2] * t);
    if (explodeRotate) {
      g.rotation.set(baseRot[0] + explodeRotate[0] * t, baseRot[1] + explodeRotate[1] * t, baseRot[2] + explodeRotate[2] * t);
    }
  });
  return (
    <group ref={ref} position={base} rotation={rotation}>
      {children}
    </group>
  );
}

const MirrorSide = createContext<1 | -1>(1);

/** +1 inside the original copy of a <Mirrored> part, −1 inside its mirror image. */
export function useMirrorSide() {
  return useContext(MirrorSide);
}

/**
 * Renders a right-hand part (z > 0) and its mirror image, moving the two
 * apart sideways (and optionally up) as the view explodes.
 */
export function Mirrored({
  out = 0,
  up = 0,
  explodeRange,
  children,
}: {
  out?: number;
  up?: number;
  explodeRange?: [number, number];
  children?: ReactNode;
}) {
  return (
    <>
      <Shift explode={[0, up, out]} explodeRange={explodeRange}>
        {children}
      </Shift>
      <Shift explode={[0, up, -out]} explodeRange={explodeRange}>
        <MirrorSide.Provider value={-1}>
          <group scale={[1, 1, -1]}>{children}</group>
        </MirrorSide.Provider>
      </Shift>
    </>
  );
}

/**
 * Rotates its children about a hinge line as the wings switch from corner to
 * straight mode. `hinge` is a point on the axis (parent space), `axis` its
 * direction and `angle` the rotation (radians) reached in straight mode.
 */
export function AeroPivot({
  hinge,
  axis = [0, 0, 1],
  angle,
  children,
}: {
  hinge: Vec3;
  axis?: Vec3;
  angle: number;
  children?: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const ax = useMemo(() => new Vector3(...axis).normalize(), [axis]);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.quaternion.setFromAxisAngle(ax, angle * aeroProgress.value);
  });
  return (
    <group position={hinge}>
      <group ref={ref}>
        <group position={[-hinge[0], -hinge[1], -hinge[2]]}>{children}</group>
      </group>
    </group>
  );
}

const ZERO: Vec3 = [0, 0, 0];
const FULL: [number, number] = [0, 1];
