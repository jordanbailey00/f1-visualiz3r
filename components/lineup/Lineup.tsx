"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ControlHint, ExitLink, HudBar } from "@/components/hud/Hud";
import { CATALOG } from "@/lib/cars/catalog";
import { aeroProgress, explodeProgress } from "@/components/explorer/explode";
import { CAR_MODELS } from "@/components/explorer/models/registry";
import LineupCanvas, { type LineupCar } from "./LineupCanvas";
import { NARROW, VIEWS, type CarBounds, type LineupView } from "./stage";

const mm = (n: number) => Math.round(n).toLocaleString("en-GB");

const isView = (v: string | null): v is LineupView => VIEWS.some((o) => o.id === v);

/** The chosen view: a link can name one, and on a phone the stacked side view fits best. */
function firstView(): LineupView {
  const asked = new URLSearchParams(window.location.search).get("view");
  if (isView(asked)) return asked;
  return window.innerWidth < NARROW ? "side" : "top";
}

/** Every built car in one scene, at the same scale, oldest first. */
export default function Lineup() {
  const cars = useMemo<LineupCar[]>(() => CATALOG.filter((c) => c.built).map((entry) => ({ entry, ...CAR_MODELS[entry.id]! })), []);
  const [view, setView] = useState<LineupView>(firstView);
  const [fading, setFading] = useState(false);
  const [bounds, setBounds] = useState<Record<string, CarBounds>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const labels = useRef<Record<string, HTMLAnchorElement | null>>({});
  const scale = useRef<{ bar: HTMLDivElement | null; text: HTMLSpanElement | null }>({ bar: null, text: null });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Parts read these directly; a car left exploded must not carry over.
  useEffect(() => {
    explodeProgress.value = 0;
    aeroProgress.value = 0;
    return () => clearTimeout(timer.current);
  }, []);

  /** Views differ in layout, so the change happens behind a short fade. */
  const choose = (next: LineupView) => {
    if (next === view) return;
    setFading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setView(next);
      timer.current = setTimeout(() => setFading(false), 60);
    }, 130);
  };

  const onMeasured = useCallback((id: string, b: CarBounds) => setBounds((all) => ({ ...all, [id]: b })), []);
  const loaded = Object.keys(bounds).length;

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink-950" data-ready={loaded === cars.length}>
      <div className="absolute inset-0">
        <LineupCanvas cars={cars} view={view} bounds={bounds} onMeasured={onMeasured} labels={labels} scale={scale} onHover={setHovered} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-ink-950 transition-opacity duration-[120ms]" style={{ opacity: fading ? 1 : 0 }} />

      {/* Labels follow their cars; the scene writes their position every frame. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: fading ? 0 : 1 }}>
        {cars.map(({ entry, car }) => {
          const b = bounds[entry.id];
          const tone = hovered === entry.id ? "text-hud-accent-text" : "text-hud-text";
          return (
            <Link
              key={entry.id}
              ref={(el) => {
                labels.current[entry.id] = el;
              }}
              href={`/${entry.id}`}
              className="pointer-events-auto absolute left-0 top-0 block w-max will-change-transform"
              style={{ visibility: b ? "visible" : "hidden" }}
            >
              <span className={`block ${view === "side" ? "max-sm:text-left sm:text-right" : "text-center"}`}>
                {/* On a phone only the side view has room for the full label. */}
                {view !== "side" && <span className={`hud-label block text-[10.5px] sm:hidden ${tone}`}>{entry.shortName}</span>}
                <span className={view === "side" ? "" : "max-sm:hidden"}>
                  <span className={`hud-label block text-[10.5px] ${tone}`}>
                    {entry.years}
                    <span className="text-hud-faint"> · </span>
                    {entry.name}
                  </span>
                  {b && (
                    <span className="mt-1 block font-mono text-[10px] leading-[1.45] tracking-[0.04em] text-hud-dim">
                      <span className="max-sm:hidden">
                        {mm(b.max[0] - b.min[0])} long · {mm(b.width)} wide
                        <br />
                        {mm(b.height)} high · {mm(car.wheelbase)} wheelbase
                      </span>
                      <span className="sm:hidden">
                        {mm(b.max[0] - b.min[0])} × {mm(b.width)} × {mm(b.height)}
                      </span>
                    </span>
                  )}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <HudBar
        exit={<ExitLink href="/" label="Home" />}
        center={
          <nav className="hud-selector" aria-label="View">
            {VIEWS.map((v) => (
              <button key={v.id} className="hud-sel" data-on={v.id === view} aria-pressed={v.id === view} title={v.title} onClick={() => choose(v.id)}>
                {v.label}
              </button>
            ))}
          </nav>
        }
        caption="Every car to the same scale · lengths in mm"
      />

      {loaded < cars.length && (
        <p role="status" className="hud-label absolute inset-x-0 top-[92px] z-20 text-center text-[9.5px] text-hud-dim">
          Bringing the cars out · {loaded} of {cars.length}
        </p>
      )}

      <div className="ui-chrome pointer-events-none absolute bottom-4 left-4 z-20">
        <span
          ref={(el) => {
            scale.current.text = el;
          }}
          className="hud-label mb-1.5 block text-[9.5px] text-hud-dim"
        />
        <div
          ref={(el) => {
            scale.current.bar = el;
          }}
          className="h-1.5 border-x border-b border-hud-dim"
        />
      </div>

      <ControlHint
        className="bottom-4"
        items={
          view === "3d"
            ? [
                ["Drag", "rotate"],
                ["Scroll", "zoom"],
                ["Click a car", "explore it"],
              ]
            : [
                ["Drag", "pan"],
                ["Scroll", "zoom"],
                ["Click a car", "explore it"],
              ]
        }
      />
    </div>
  );
}
