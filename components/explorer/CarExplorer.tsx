"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ControlHint, ExitLink, HudBar, Lamp, pad } from "@/components/hud/Hud";
import { PresentationMode } from "@/components/site/PresentationMode";
import { CATALOG } from "@/lib/cars/catalog";
import { TEAMS, useLivery, useLiveryAddress, withLivery } from "@/lib/cars/livery";
import { useExplorer } from "@/lib/cars/store";
import type { CarInfo } from "@/lib/cars/types";
import CarCanvas from "./CarCanvas";
import { applyLivery } from "./kit/livery";
import { CAR_MODELS } from "./models/registry";
import { HoverTooltip } from "./ui/HoverTooltip";
import { InfoPanel } from "./ui/InfoPanel";
import { LiveryMenu } from "./ui/LiveryMenu";
import { PartsPanel } from "./ui/PartsPanel";
import { Toolbar } from "./ui/Toolbar";

export default function CarExplorer({ car }: { car: CarInfo }) {
  const container = useRef<HTMLDivElement>(null);
  // Everything beyond the model is summoned: the tree, the brief, the readout.
  const [treeOpen, setTreeOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const entry = CAR_MODELS[car.id]!;
  const ready = useExplorer((s) => s.carId === car.id);
  const selectedId = useExplorer((s) => s.selectedId);
  const era = CATALOG.findIndex((c) => c.id === car.id) + 1;
  const livery = useLivery((s) => s.livery);
  const team = TEAMS.find((t) => t.id === livery);
  const design = team && entry.liveries?.[team.id];

  useLiveryAddress();
  useEffect(() => {
    useExplorer.getState().setCar(car.id);
    // Handles for automated visual checks (scripts/screenshot.mjs --eval).
    if (process.env.NODE_ENV !== "production") {
      Object.assign(window, {
        __explorer: useExplorer,
        __livery: useLivery,
        __grid: () => import("./kit/liveryGrid").then(({ GRID }) => applyLivery(car.id, "grid", GRID)),
      });
    }
  }, [car.id]);

  // A part readout replaces the brief; the hint retires once a part is picked.
  useEffect(() => {
    if (!selectedId) return;
    setBriefOpen(false);
    setEngaged(true);
  }, [selectedId]);

  const toggleBrief = () => {
    const s = useExplorer.getState();
    if (s.selectedId) {
      s.select(null);
      setBriefOpen(true);
    } else setBriefOpen((o) => !o);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const s = useExplorer.getState();
      if (e.key === "Escape") {
        s.select(null);
        setBriefOpen(false);
      } else if (e.key === "r" || e.key === "R") s.resetView();
      else if (e.key === "x" || e.key === "X") s.toggleXray();
      else if (e.key === "e" || e.key === "E") s.setExplode(s.explode > 0.5 ? 0 : 1);
      else if (e.key === "l" || e.key === "L") s.toggleLabels();
      else if ((e.key === "a" || e.key === "A") && entry.aero) s.toggleAero();
      else if (e.key === "c" || e.key === "C") setTreeOpen((o) => !o);
      else if (e.key === "i" || e.key === "I") toggleBrief();
      else if ((e.key === "f" || e.key === "F") && s.selectedId) s.focusPart(s.selectedId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry.aero]);

  const briefOn = briefOpen && !selectedId;
  // Room taken by open panels (tree 248 px, readout 316 px, plus gutters).
  const readoutOpen = !!selectedId || briefOpen;
  const insets = useMemo(() => ({ left: treeOpen ? 264 : 0, right: readoutOpen ? 332 : 0 }), [treeOpen, readoutOpen]);

  return (
    <div ref={container} className="fixed inset-0 overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        {ready && <CarCanvas car={car} Model={entry.Model} insets={insets} />}
      </div>

      <PresentationMode />
      <HudBar
        exit={<ExitLink href="/" label="Home" />}
        center={
          <nav className="hud-selector" aria-label="Eras">
            {CATALOG.map((c) =>
              c.built ? (
                <Link
                  key={c.id}
                  href={withLivery(`/${c.id}`, livery)}
                  className="hud-sel"
                  data-on={c.id === car.id}
                  aria-current={c.id === car.id ? "page" : undefined}
                  title={`${c.years} · ${c.name}`}
                >
                  {c.shortName}
                </Link>
              ) : (
                <span key={c.id} className="hud-sel cursor-default opacity-40" title={`${c.years} · ${c.name} — in build`} aria-disabled>
                  {c.shortName}
                </span>
              ),
            )}
            <Link href="/lineup" className="hud-sel" title="Every car side by side, to scale">
              All
            </Link>
          </nav>
        }
        caption={`Era ${pad(era)} · ${car.years} · ${car.name}${design ? ` · in ${team.name} ${design.car} colours` : ""}`}
        right={
          <>
            <LiveryMenu designs={entry.liveries} />
            <button className="hud-btn" data-on={briefOn} onClick={toggleBrief} title="Car brief (I)" aria-pressed={briefOn}>
              <Lamp on={briefOn} /> Brief
            </button>
          </>
        }
      />

      <PartsPanel car={car} open={treeOpen} onClose={() => setTreeOpen(false)} />
      <InfoPanel car={car} briefOpen={briefOpen} onCloseBrief={() => setBriefOpen(false)} />
      <Toolbar treeOpen={treeOpen} onToggleTree={() => setTreeOpen((o) => !o)} hasAnimation={entry.animated} aero={entry.aero} />
      {!engaged && !briefOn && (
        <ControlHint
          className="bottom-[76px]"
          items={[
            ["Drag", "rotate"],
            ["Scroll", "zoom"],
            ["Click", "inspect"],
            ["Double-click", "fly to"],
          ]}
        />
      )}
      <HoverTooltip car={car} container={container} />
    </div>
  );
}
