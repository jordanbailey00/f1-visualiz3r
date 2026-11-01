"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/site/LoadingScreen";

const Lineup = dynamic(() => import("./Lineup"), {
  ssr: false,
  loading: () => <LoadingScreen label="Loading the lineup" />,
});

export function LineupLoader() {
  return <Lineup />;
}
