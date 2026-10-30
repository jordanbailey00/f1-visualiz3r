"use client";

import { useMemo } from "react";
import { CylinderGeometry, type BufferGeometry } from "three";
import { CAR_MAT } from "../../kit/carMaterials";
import { cached, mergeAll, roundedBox } from "../../kit/geometry";
import type { V3 } from "../../kit/loft";
import { ball, foilMember, rod, wishbone } from "../../kit/strut";
import { FRONT_SUSP, REAR_SUSP } from "./layout";

// Every member here is built for the right-hand side; the model mirrors it.
const v = (p: readonly number[]) => [p[0], p[1], p[2]] as V3;

/** Upper and lower wishbones: carbon legs with titanium inserts at the joints. */
export function FrontWishbones() {
  const geo = useMemo(
    () =>
      cached("car22-fs-wishbones", () => {
        const u = FRONT_SUSP.upper;
        const l = FRONT_SUSP.lower;
        return mergeAll([wishbone(v(u.front), v(u.rear), v(u.outer), 58, 18), wishbone(v(l.front), v(l.rear), v(l.outer), 62, 20)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function FrontPushrods() {
  const geo = useMemo(
    () =>
      cached("car22-fs-pushrods", () => {
        const p = FRONT_SUSP.pushrod;
        return mergeAll([foilMember(v(p.outer), v(p.inner), 42, 24), ball(v(p.outer), 30), ball(v(p.inner), 30)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function TrackRods() {
  const geo = useMemo(
    () =>
      cached("car22-fs-trackrods", () => {
        const t = FRONT_SUSP.trackRod;
        return mergeAll([foilMember(v(t.inner), v(t.outer), 40, 16), ball(v(t.outer), 26), rod([1790, 300, 0], [1790, 300, 150], 46)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

/**
 * Inboard springs and dampers: rockers turn the push-rod load into twist in
 * torsion bars; a heave damper between the rockers controls ride height.
 */
function inboard(x: number, y: number, z: number, dir: number): { metal: BufferGeometry; dampers: BufferGeometry } {
  const rocker = mergeAll([roundedBox(70, 46, 30, 8).clone().translate(x, y + 10, z), ball([x, y, z], 34)]);
  const torsion = rod([x, y + 10, z - 30], [x - dir * 300, y + 10, z - 30], 16);
  const one = { metal: mergeAll([rocker, torsion]), damper: rod([x - dir * 40, y + 36, z - 10], [x - dir * 260, y + 30, z - 70], 30) };
  // Half the heave damper that spans the two rockers.
  const heave = new CylinderGeometry(22, 22, z - 40, 20).rotateX(Math.PI / 2).translate(x - dir * 20, y + 46, (z - 40) / 2);
  return { metal: mergeAll([one.metal, heave]), dampers: one.damper };
}

export function FrontInboard() {
  const g = useMemo(() => cached("car22-fs-inboard", () => inboard(FRONT_SUSP.pushrod.inner[0], FRONT_SUSP.pushrod.inner[1], FRONT_SUSP.pushrod.inner[2], 1)), []);
  return (
    <group>
      <mesh geometry={g.metal} material={CAR_MAT.titanium} castShadow />
      <mesh geometry={g.dampers} material={CAR_MAT.anodisedDark} castShadow />
    </group>
  );
}

export function RearWishbones() {
  const geo = useMemo(
    () =>
      cached("car22-rs-wishbones", () => {
        const u = REAR_SUSP.upper;
        const l = REAR_SUSP.lower;
        return mergeAll([wishbone(v(u.front), v(u.rear), v(u.outer), 56, 18), wishbone(v(l.front), v(l.rear), v(l.outer), 60, 20)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearPushrods() {
  const geo = useMemo(
    () =>
      cached("car22-rs-pushrods", () => {
        const p = REAR_SUSP.pushrod;
        return mergeAll([foilMember(v(p.outer), v(p.inner), 40, 24), ball(v(p.outer), 30), ball(v(p.inner), 30)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function ToeLinks() {
  const geo = useMemo(
    () =>
      cached("car22-rs-toelinks", () => {
        const t = REAR_SUSP.toeLink;
        return mergeAll([foilMember(v(t.inner), v(t.outer), 38, 16), ball(v(t.inner), 24), ball(v(t.outer), 24)]);
      }),
    [],
  );
  return <mesh geometry={geo} material={CAR_MAT.carbon} castShadow receiveShadow />;
}

export function RearInboard() {
  const g = useMemo(() => cached("car22-rs-inboard", () => inboard(REAR_SUSP.pushrod.inner[0], REAR_SUSP.pushrod.inner[1], REAR_SUSP.pushrod.inner[2], -1)), []);
  return (
    <group>
      <mesh geometry={g.metal} material={CAR_MAT.titanium} castShadow />
      <mesh geometry={g.dampers} material={CAR_MAT.anodisedDark} castShadow />
    </group>
  );
}
