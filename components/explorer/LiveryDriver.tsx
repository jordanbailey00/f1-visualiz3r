"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useLivery } from "@/lib/cars/livery";
import type { CarId } from "@/lib/cars/types";
import { applyLivery } from "./kit/livery";
import { CAR_MODELS } from "./models/registry";
import { refreshXray } from "./sceneState";

/** Paints the cars in the chosen livery, and again whenever the choice changes. */
export function LiveryDriver({ cars }: { cars: CarId[] }) {
  const livery = useLivery((s) => s.livery);
  const invalidate = useThree((s) => s.invalidate);
  // During render (it is idempotent), so a car still being built comes out in its paint.
  for (const id of cars) applyLivery(id, livery, livery === "plain" ? null : (CAR_MODELS[id]?.liveries?.[livery] ?? null));
  useEffect(() => {
    refreshXray();
    invalidate();
  }, [livery, invalidate]);
  return null;
}
