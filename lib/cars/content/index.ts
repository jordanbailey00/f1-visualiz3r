import type { CarId, CarInfo } from "../types";
import { car2026 } from "./car-2026";

const CARS: Partial<Record<CarId, CarInfo>> = {
  "2026": car2026,
};

export function getCarInfo(id: string): CarInfo | undefined {
  return (CARS as Record<string, CarInfo>)[id];
}
