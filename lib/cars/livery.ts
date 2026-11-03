"use client";

import { useEffect } from "react";
import { create } from "zustand";

/** Teams whose colours every car can wear: all three raced through every era. */
export const TEAMS = [
  { id: "mclaren", name: "McLaren" },
  { id: "ferrari", name: "Ferrari" },
  { id: "williams", name: "Williams" },
] as const;

export type TeamId = (typeof TEAMS)[number]["id"];

/** "plain" is the house livery. */
export type LiveryChoice = "plain" | TeamId;

export const isLivery = (v: unknown): v is LiveryChoice => v === "plain" || TEAMS.some((t) => t.id === v);

interface LiveryState {
  livery: LiveryChoice;
  setLivery: (livery: LiveryChoice) => void;
}

/** The livery chosen for every car: it stays as the visitor moves between cars. */
export const useLivery = create<LiveryState>()((set) => ({
  livery: "plain",
  setLivery: (livery) => set({ livery }),
}));

/** `href` with the livery added, so the link keeps it. */
export const withLivery = (href: string, livery: LiveryChoice) => (livery === "plain" ? href : `${href}?livery=${livery}`);

/** Takes the livery from the address once, then keeps the address in step with the choice. */
export function useLiveryAddress() {
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("livery");
    if (isLivery(asked)) useLivery.getState().setLivery(asked);
    const write = (livery: LiveryChoice) => {
      const url = new URL(window.location.href);
      if (livery === "plain") url.searchParams.delete("livery");
      else url.searchParams.set("livery", livery);
      if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
    };
    write(useLivery.getState().livery);
    return useLivery.subscribe((s, prev) => {
      if (s.livery !== prev.livery) write(s.livery);
    });
  }, []);
}
