/**
 * Shared types for the car explorer.
 *
 * World units are millimetres. Every car is built around the origin with +Y
 * up, resting on the ground at y = 0. +X points forward (the nose), +Z to the
 * driver's right; the wheelbase is centred on x = 0.
 */

/** One car per regulation era, keyed by the era's first season. */
export type CarId = "1998" | "2006" | "2009" | "2014" | "2017" | "2022" | "2026";

export type PartCategory =
  | "aero"
  | "chassis"
  | "safety"
  | "power"
  | "hybrid"
  | "cooling"
  | "drivetrain"
  | "suspension"
  | "wheels"
  | "cockpit"
  | "electronics";

export interface PartInfo {
  name: string;
  category: PartCategory;
  /** One plain-language sentence. Shown in tooltips, lists and as the panel lead. */
  summary: string;
  /** Main explanation: 1–3 short paragraphs. Supports **bold** and `code`. */
  details: string[];
  /** Key facts as [label, value] rows. */
  specs?: [string, string][];
  /** Optional ordered explanation of the mechanism. */
  howItWorks?: string[];
  /** Optional surprising fact. */
  didYouKnow?: string;
}

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

export interface CarInfo {
  id: CarId;
  /** e.g. "Active aero" */
  name: string;
  /** Selector label, e.g. "2026" */
  shortName: string;
  /** Seasons covered, e.g. "2026–" */
  years: string;
  /** What exactly is modelled, e.g. "Generic 2026-regulation car". */
  model: string;
  /** One-line hook for galleries. */
  tagline: string;
  /** Shown in the brief when nothing is selected. */
  intro: string[];
  /** Headline specifications for the car overview. */
  specs: [string, string][];
  /** Default camera framing (only the direction is used; the view is fitted). */
  camera: CameraPose;
  /**
   * Characteristic size of the car in mm (roughly its length). Used to scale
   * lighting, shadows, ambient occlusion and the floor grid.
   */
  size: number;
  /** Explanations for every <Part id> used by the model, keyed by part id. */
  parts: Record<string, PartInfo>;
}

/** A node of the part hierarchy, discovered from the rendered scene graph. */
export interface PartNode {
  id: string;
  parentId: string | null;
  children: string[];
  depth: number;
}
