import assert from "node:assert/strict";
import { test } from "node:test";

import { designPatterns, type Layer, type LiveryDesign } from "../components/explorer/kit/livery";
import { CAR_MODELS } from "../components/explorer/models/registry";
import { CATALOG } from "../lib/cars/catalog";
import { TEAMS } from "../lib/cars/livery";

const HEX = /^#[0-9a-f]{6}$/i;

/** First and last season of an era, e.g. "2017–2021" → [2017, 2021]; "2026–" runs on. */
function seasons(years: string): [number, number] {
  const [a, b] = years.split("–");
  return [Number(a), b ? Number(b) : 2100];
}

function outlines(l: Layer) {
  return [l.side, l.top].filter((o): o is NonNullable<typeof o> => !!o);
}

function check(d: LiveryDesign) {
  assert.ok(d.car.trim(), "car");
  assert.ok(d.note.trim().length > 20, "note");
  assert.ok(d.swatch.length >= 2 && d.swatch.length <= 4 && d.swatch.every((c) => HEX.test(c)), "swatch");
  assert.ok(d.palette.base, "palette has a base");
  for (const [name, p] of Object.entries(d.palette)) assert.ok(HEX.test(p.color), `paint ${name}: colour`);
  const layers = [...d.body, ...Object.values(d.wings ?? {}).flatMap((w) => (typeof w === "string" ? [{ paint: w }] : w))];
  for (const l of layers) {
    assert.ok(d.palette[l.paint], `no paint "${l.paint}"`);
    if (l.fade) assert.ok(d.palette[l.fade.paint], `no paint "${l.fade.paint}"`);
    for (const o of outlines(l)) assert.ok(o.length >= 3 && o.flat().every(Number.isFinite), "outline");
  }
  // Builds every part group's shader source (throws on a bad reference).
  const glsl = designPatterns(d);
  assert.ok(glsl.body.includes("liveryPattern"), "body pattern");
}

for (const entry of CATALOG.filter((c) => c.built)) {
  test(`${entry.id}: every team has a livery from the era`, () => {
    const liveries = CAR_MODELS[entry.id]?.liveries;
    assert.ok(liveries, "no liveries");
    const [from, to] = seasons(entry.years);
    for (const t of TEAMS) {
      const d = liveries[t.id];
      assert.ok(d, `no ${t.name} livery`);
      assert.ok(d.season >= from && d.season <= to, `${t.name}: season ${d.season} is outside ${entry.years}`);
      check(d);
    }
  });
}
