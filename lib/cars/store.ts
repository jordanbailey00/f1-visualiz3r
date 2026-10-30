"use client";

import { create } from "zustand";
import type { CarId, PartNode } from "./types";

export type CameraCommand =
  | { type: "reset"; nonce: number }
  | { type: "focus"; id: string; nonce: number };

/** Wing setting: high downforce for corners, or opened to shed drag on straights. */
export type AeroMode = "corner" | "straight";

export interface ExplorerState {
  carId: CarId | null;
  /** Part hierarchy discovered from the scene graph after the model mounts. */
  nodes: Record<string, PartNode>;
  rootIds: string[];

  hoveredId: string | null;
  selectedId: string | null;

  /** Exploded-view amount, 0 (assembled) … 1 (fully exploded). */
  explode: number;
  /** Covers marked `cover` become see-through. */
  xray: boolean;
  /** When a part is selected, fade everything else. */
  focusMode: boolean;
  /** Parts the user has hidden from the tree. */
  hidden: Record<string, true>;
  autoRotate: boolean;
  /** Floating name tags on the main parts. */
  labels: boolean;
  /** Moving parts (wheels, turbo…) are running. */
  animate: boolean;
  /** Movable wing elements: closed (corner) or open (straight). */
  aeroMode: AeroMode;
  /** Ambient occlusion + shadows. */
  quality: "high" | "low";

  cameraCommand: CameraCommand | null;

  setCar: (id: CarId) => void;
  setTree: (nodes: Record<string, PartNode>, rootIds: string[]) => void;
  hover: (id: string | null) => void;
  select: (id: string | null, camera?: "focus" | "none") => void;
  setExplode: (v: number) => void;
  toggleXray: () => void;
  toggleFocusMode: () => void;
  toggleHidden: (id: string) => void;
  showAll: () => void;
  setAutoRotate: (v: boolean) => void;
  toggleLabels: () => void;
  setAnimate: (v: boolean) => void;
  setAeroMode: (m: AeroMode) => void;
  toggleAero: () => void;
  setQuality: (q: "high" | "low") => void;
  resetView: () => void;
  focusPart: (id: string) => void;
}

let nonce = 0;

export const useExplorer = create<ExplorerState>()((set, get) => ({
  carId: null,
  nodes: {},
  rootIds: [],
  hoveredId: null,
  selectedId: null,
  explode: 0,
  xray: false,
  focusMode: true,
  hidden: {},
  autoRotate: false,
  labels: false,
  animate: false,
  aeroMode: "corner",
  quality: "high",
  cameraCommand: null,

  setCar: (id) =>
    set({
      carId: id,
      nodes: {},
      rootIds: [],
      hoveredId: null,
      selectedId: null,
      explode: 0,
      xray: false,
      hidden: {},
      aeroMode: "corner",
      cameraCommand: null,
    }),
  setTree: (nodes, rootIds) => set({ nodes, rootIds }),
  hover: (id) => {
    if (get().hoveredId !== id) set({ hoveredId: id });
  },
  select: (id, camera = "none") => {
    const next: Partial<ExplorerState> = { selectedId: id };
    if (id && camera !== "none") {
      next.cameraCommand = { type: camera, id, nonce: ++nonce };
    }
    set(next);
  },
  setExplode: (v) => set({ explode: Math.min(1, Math.max(0, v)) }),
  toggleXray: () => set((s) => ({ xray: !s.xray })),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  toggleHidden: (id) =>
    set((s) => {
      const hidden = { ...s.hidden };
      if (hidden[id]) delete hidden[id];
      else hidden[id] = true;
      return { hidden };
    }),
  showAll: () => set({ hidden: {} }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  setAnimate: (v) => set({ animate: v }),
  setAeroMode: (m) => set({ aeroMode: m }),
  toggleAero: () => set((s) => ({ aeroMode: s.aeroMode === "corner" ? "straight" : "corner" })),
  setQuality: (q) => set({ quality: q }),
  resetView: () =>
    set({ cameraCommand: { type: "reset", nonce: ++nonce } }),
  focusPart: (id) =>
    set({ cameraCommand: { type: "focus", id, nonce: ++nonce } }),
}));

/** Ids of `id` and all of its ancestors, nearest first. */
export function ancestorsOf(
  nodes: Record<string, PartNode>,
  id: string | null,
): string[] {
  const out: string[] = [];
  let cur = id ? nodes[id] : undefined;
  while (cur) {
    out.push(cur.id);
    cur = cur.parentId ? nodes[cur.parentId] : undefined;
  }
  return out;
}

/** True when `id` is `ancestor` or lies beneath it. */
export function isWithin(
  nodes: Record<string, PartNode>,
  id: string,
  ancestor: string,
): boolean {
  let cur: PartNode | undefined = nodes[id];
  while (cur) {
    if (cur.id === ancestor) return true;
    cur = cur.parentId ? nodes[cur.parentId] : undefined;
  }
  return false;
}
