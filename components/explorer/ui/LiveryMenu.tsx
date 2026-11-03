"use client";

import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Lamp } from "@/components/hud/Hud";
import { TEAMS, useLivery, type LiveryChoice, type TeamId } from "@/lib/cars/livery";
import { LIVERY, type LiveryDesign } from "../kit/livery";

type Designs = Partial<Record<TeamId, LiveryDesign>>;

function Chips({ colors }: { colors: string[] }) {
  return (
    <span className="flex shrink-0 gap-[3px]" aria-hidden>
      {colors.map((c, i) => (
        <span key={i} className="block size-[9px] border border-white/15" style={{ background: c }} />
      ))}
    </span>
  );
}

/**
 * The livery picker. Given one car's designs it names each team's car of
 * that era; given every car's (`eras`, oldest first), it shows how each
 * team's colours changed from era to era.
 */
export function LiveryMenu({
  designs,
  eras,
  onChoose = (choice) => useLivery.getState().setLivery(choice),
}: {
  designs?: Designs;
  eras?: Designs[];
  /** Applies a choice; by default straight away. */
  onChoose?: (choice: LiveryChoice) => void;
}) {
  const livery = useLivery((s) => s.livery);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  const pick = (choice: LiveryChoice) => {
    setOpen(false);
    if (choice !== livery) onChoose(choice);
  };
  const current = TEAMS.find((t) => t.id === livery);

  const row = (choice: LiveryChoice, name: string, sub: string, colors: string[], note?: string) => {
    const on = choice === livery;
    return (
      <button
        key={choice}
        role="menuitemradio"
        aria-checked={on}
        onClick={() => pick(choice)}
        className={`flex w-full items-start gap-2.5 px-2 py-2 text-left transition-colors hover:bg-white/[0.045] ${on ? "bg-white/[0.035]" : ""}`}
      >
        <span className="pt-[3px]">
          <Lamp on={on} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-3">
            <span className={`hud-label text-[10.5px] ${on ? "text-hud-text" : "text-hud-dim"}`}>{name}</span>
            <Chips colors={colors} />
          </span>
          <span className="mt-1 block font-mono text-[10px] tracking-[0.04em] text-hud-faint">{sub}</span>
          {on && note && <span className="mt-1.5 block text-[11px] leading-snug text-hud-dim">{note}</span>}
        </span>
      </button>
    );
  };

  return (
    <div ref={root} className="relative">
      <button
        className="hud-btn"
        data-on={open}
        onClick={() => setOpen((o) => !o)}
        title="Paint the car in a team's colours"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Lamp on={livery !== "plain"} />
        <span className="md:hidden">
          <Palette className="size-3.5" />
        </span>
        <span className="hidden md:inline">{current ? current.name : "Livery"}</span>
      </button>
      {open && (
        <div role="menu" aria-label="Livery" className="hud-panel absolute right-0 top-[38px] z-40 w-[272px] p-1.5">
          <p className="hud-label px-2 pb-1 pt-1.5 text-[9px] text-hud-faint">Livery</p>
          {row("plain", "Plain", "House paint, every era", [LIVERY.paint, "#16171a"], "One quiet colour, so the eye goes to the parts.")}
          {TEAMS.map((t) => {
            if (eras) {
              const all = eras.map((d) => d[t.id]).filter((d): d is LiveryDesign => !!d);
              if (!all.length) return null;
              return row(t.id, t.name, `${all[0].season}–${all[all.length - 1].season}, era by era`, all.map((d) => d.swatch[0]));
            }
            const d = designs?.[t.id];
            if (!d) return null;
            return row(t.id, t.name, `${d.car} · ${d.season}`, d.swatch, d.note);
          })}
          <p className="border-t border-hud-line px-2 pb-1.5 pt-2.5 text-[10.5px] leading-snug text-hud-faint">
            Colours only, without logos or sponsors. Unofficial: the names and colours belong to the teams.
          </p>
        </div>
      )}
    </div>
  );
}
