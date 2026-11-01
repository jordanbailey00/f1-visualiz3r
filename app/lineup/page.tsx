import type { Metadata } from "next";
import { LineupLoader } from "@/components/lineup/LineupLoader";

export const metadata: Metadata = {
  title: "Every car to scale",
  description: "Every regulation era of Formula 1 car side by side in real-time 3D, all at the same scale.",
};

export default function LineupPage() {
  return <LineupLoader />;
}
