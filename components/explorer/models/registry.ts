import { lazy, type ComponentType } from "react";
import type { CarId } from "@/lib/cars/types";
import { CAR as CAR_2006 } from "./car-2006/layout";
import { CAR as CAR_2009 } from "./car-2009/layout";
import { CAR as CAR_2014 } from "./car-2014/layout";
import { CAR as CAR_2017 } from "./car-2017/layout";
import { CAR as CAR_2022 } from "./car-2022/layout";
import { CAR as CAR_2026 } from "./car-2026/layout";

export interface ModelEntry {
  Model: ComponentType;
  /** Has moving parts that the animate toggle controls. */
  animated: boolean;
  /** Movable wing elements, and what their switch is called. */
  aero?: { label: string; title: string };
  /** Datums in the model's own coordinates (mm): where the axles sit, and the wheelbase. */
  car: { wheelbase: number; rearAxle: number };
}

/** Each car model is code-split and loaded only when its page opens. */
export const CAR_MODELS: Partial<Record<CarId, ModelEntry>> = {
  "2006": {
    Model: lazy(() => import("./car-2006/Car2006Model")),
    animated: false,
    car: CAR_2006,
  },
  "2009": {
    Model: lazy(() => import("./car-2009/Car2009Model")),
    animated: false,
    car: CAR_2009,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2014": {
    Model: lazy(() => import("./car-2014/Car2014Model")),
    animated: false,
    car: CAR_2014,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2017": {
    Model: lazy(() => import("./car-2017/Car2017Model")),
    animated: false,
    car: CAR_2017,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2022": {
    Model: lazy(() => import("./car-2022/Car2022Model")),
    animated: false,
    car: CAR_2022,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2026": {
    Model: lazy(() => import("./car-2026/Car2026Model")),
    animated: false,
    car: CAR_2026,
    aero: { label: "Straight mode", title: "Open the front and rear wing flaps for the straights (A)" },
  },
};
