"use client";

import dynamic from "next/dynamic";
import type { CarInfo } from "@/lib/cars/types";
import { LoadingScreen } from "@/components/site/LoadingScreen";

const CarExplorer = dynamic(() => import("./CarExplorer"), {
  ssr: false,
  loading: () => <LoadingScreen label="Loading 3D workspace" />,
});

export function CarExplorerLoader({ car }: { car: CarInfo }) {
  return <CarExplorer car={car} />;
}
