import type { CarId, CarInfo } from "../types";
import { car2017 } from "./car-2017";
import { car2022 } from "./car-2022";
import { car2026 } from "./car-2026";

const CARS: Partial<Record<CarId, CarInfo>> = {
  "2017": car2017,
  "2022": car2022,
  "2026": car2026,
};

export function getCarInfo(id: string): CarInfo | undefined {
  return (CARS as Record<string, CarInfo>)[id];
}
