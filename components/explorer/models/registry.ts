import { lazy, type ComponentType } from "react";
import type { CarId } from "@/lib/cars/types";

export interface ModelEntry {
  Model: ComponentType;
  /** Has moving parts that the animate toggle controls. */
  animated: boolean;
  /** Movable wing elements, and what their switch is called. */
  aero?: { label: string; title: string };
}

/** Each car model is code-split and loaded only when its page opens. */
export const CAR_MODELS: Partial<Record<CarId, ModelEntry>> = {
  "2014": {
    Model: lazy(() => import("./car-2014/Car2014Model")),
    animated: false,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2017": {
    Model: lazy(() => import("./car-2017/Car2017Model")),
    animated: false,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2022": {
    Model: lazy(() => import("./car-2022/Car2022Model")),
    animated: false,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2026": {
    Model: lazy(() => import("./car-2026/Car2026Model")),
    animated: false,
    aero: { label: "Straight mode", title: "Open the front and rear wing flaps for the straights (A)" },
  },
};
