import { lazy, type ComponentType } from "react";
import type { TeamId } from "@/lib/cars/livery";
import type { CarId } from "@/lib/cars/types";
import type { LiveryDesign } from "../kit/livery";
import { CAR as CAR_1998 } from "./car-1998/layout";
import { LIVERIES as LIVERIES_1998 } from "./car-1998/liveries";
import { CAR as CAR_2006 } from "./car-2006/layout";
import { LIVERIES as LIVERIES_2006 } from "./car-2006/liveries";
import { CAR as CAR_2009 } from "./car-2009/layout";
import { LIVERIES as LIVERIES_2009 } from "./car-2009/liveries";
import { CAR as CAR_2014 } from "./car-2014/layout";
import { LIVERIES as LIVERIES_2014 } from "./car-2014/liveries";
import { CAR as CAR_2017 } from "./car-2017/layout";
import { LIVERIES as LIVERIES_2017 } from "./car-2017/liveries";
import { CAR as CAR_2022 } from "./car-2022/layout";
import { LIVERIES as LIVERIES_2022 } from "./car-2022/liveries";
import { CAR as CAR_2026 } from "./car-2026/layout";
import { LIVERIES as LIVERIES_2026 } from "./car-2026/liveries";

export interface ModelEntry {
  Model: ComponentType;
  /** Has moving parts that the animate toggle controls. */
  animated: boolean;
  /** Movable wing elements, and what their switch is called. */
  aero?: { label: string; title: string };
  /** Datums in the model's own coordinates (mm): where the axles sit, and the wheelbase. */
  car: { wheelbase: number; rearAxle: number };
  /** Team colours the car can wear instead of the house livery. */
  liveries?: Partial<Record<TeamId, LiveryDesign>>;
}

/** Each car model is code-split and loaded only when its page opens. */
export const CAR_MODELS: Partial<Record<CarId, ModelEntry>> = {
  "1998": {
    Model: lazy(() => import("./car-1998/Car1998Model")),
    animated: false,
    car: CAR_1998,
    liveries: LIVERIES_1998,
  },
  "2006": {
    Model: lazy(() => import("./car-2006/Car2006Model")),
    animated: false,
    car: CAR_2006,
    liveries: LIVERIES_2006,
  },
  "2009": {
    Model: lazy(() => import("./car-2009/Car2009Model")),
    animated: false,
    car: CAR_2009,
    liveries: LIVERIES_2009,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2014": {
    Model: lazy(() => import("./car-2014/Car2014Model")),
    animated: false,
    car: CAR_2014,
    liveries: LIVERIES_2014,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2017": {
    Model: lazy(() => import("./car-2017/Car2017Model")),
    animated: false,
    car: CAR_2017,
    liveries: LIVERIES_2017,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2022": {
    Model: lazy(() => import("./car-2022/Car2022Model")),
    animated: false,
    car: CAR_2022,
    liveries: LIVERIES_2022,
    aero: { label: "DRS", title: "Open the DRS flap on the rear wing (A)" },
  },
  "2026": {
    Model: lazy(() => import("./car-2026/Car2026Model")),
    animated: false,
    car: CAR_2026,
    liveries: LIVERIES_2026,
    aero: { label: "Straight mode", title: "Open the front and rear wing flaps for the straights (A)" },
  },
};
