import type { CarId, PartCategory } from "./types";

/** Lightweight era list for navigation and galleries. */
export interface CatalogEntry {
  id: CarId;
  /** Seasons covered. */
  years: string;
  name: string;
  shortName: string;
  tagline: string;
  /** False while the era's model is still being built. */
  built: boolean;
}

export const CATALOG: CatalogEntry[] = [
  {
    id: "1998",
    years: "1998–2005",
    name: "Grooved-tyre V10",
    shortName: "1998",
    tagline: "Narrow cars, grooved tyres and 19,000 rpm V10s.",
    built: false,
  },
  {
    id: "2006",
    years: "2006–2008",
    name: "V8 aero clutter",
    shortName: "2006",
    tagline: "2.4-litre V8s under a forest of winglets and flip-ups.",
    built: false,
  },
  {
    id: "2009",
    years: "2009–2013",
    name: "Slicks & exhaust tricks",
    shortName: "2009",
    tagline: "Slick tyres return, bodywork goes clean, exhausts blow the diffuser.",
    built: false,
  },
  {
    id: "2014",
    years: "2014–2016",
    name: "Turbo-hybrid",
    shortName: "2014",
    tagline: "1.6-litre turbo V6 hybrids on narrow chassis.",
    built: false,
  },
  {
    id: "2017",
    years: "2017–2021",
    name: "Wide hybrids",
    shortName: "2017",
    tagline: "Wider cars, fatter tyres and the halo.",
    built: false,
  },
  {
    id: "2022",
    years: "2022–2025",
    name: "Ground effect",
    shortName: "2022",
    tagline: "Venturi tunnels under the floor and 18-inch wheels.",
    built: false,
  },
  {
    id: "2026",
    years: "2026–",
    name: "Active aero",
    shortName: "2026",
    tagline: "Moving wings and a hybrid that is half electric.",
    built: true,
  },
];

export const CAR_IDS = CATALOG.map((c) => c.id);
export const BUILT_IDS = CATALOG.filter((c) => c.built).map((c) => c.id);

export function catalogEntry(id: string): CatalogEntry | undefined {
  return CATALOG.find((c) => c.id === id);
}

export const CATEGORY_META: Record<PartCategory, { label: string; color: string }> = {
  aero: { label: "Aerodynamics", color: "#38bdf8" },
  chassis: { label: "Chassis", color: "#94a3b8" },
  safety: { label: "Safety", color: "#fbbf24" },
  power: { label: "Power unit", color: "#f87171" },
  hybrid: { label: "Energy recovery", color: "#a78bfa" },
  cooling: { label: "Cooling", color: "#2dd4bf" },
  drivetrain: { label: "Transmission", color: "#fb923c" },
  suspension: { label: "Suspension", color: "#f472b6" },
  wheels: { label: "Wheels & brakes", color: "#a3e635" },
  cockpit: { label: "Cockpit", color: "#34d399" },
  electronics: { label: "Electronics", color: "#e879f9" },
};
