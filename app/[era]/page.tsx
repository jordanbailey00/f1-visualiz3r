import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarExplorerLoader } from "@/components/explorer/CarExplorerLoader";
import { BUILT_IDS } from "@/lib/cars/catalog";
import { getCarInfo } from "@/lib/cars/content";

export function generateStaticParams() {
  return BUILT_IDS.map((era) => ({ era }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ era: string }>;
}): Promise<Metadata> {
  const { era } = await params;
  const info = getCarInfo(era);
  return info
    ? { title: `${info.years} ${info.name} in 3D`, description: info.tagline || info.intro[0] }
    : {};
}

export default async function EraPage({
  params,
}: {
  params: Promise<{ era: string }>;
}) {
  const { era } = await params;
  const info = getCarInfo(era);
  if (!info) notFound();
  return <CarExplorerLoader car={info} />;
}
