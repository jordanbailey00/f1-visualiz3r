import { CanvasTexture, LatheGeometry, LinearMipmapLinearFilter, MeshPhysicalMaterial, SRGBColorSpace, Vector2 } from "three";
import { FONT_SANS } from "@/lib/three/painter";
import { cached } from "./geometry";
import { spline } from "./loft";

/**
 * Racing tyres. The cross-section is a smooth profile from bead to bead
 * (resampled by arc length so texture rows follow the rubber evenly), spun
 * round the axle, with any circumferential grooves cut into the crown. The
 * axle runs along Z; the outer sidewall faces +Z.
 */
export interface TyreSpec {
  /** Overall diameter, mm. */
  diameter: number;
  /** Section width at the sidewall bulge, mm. */
  width: number;
  /** Bead seat radius (rim), mm: 18-inch = 228.6. */
  bead?: number;
  /** Circumferential grooves in the tread (dry tyres, 1998–2008): 14 mm wide, 50 mm apart. */
  grooves?: number;
}

/** A tyre's marking: its name, and the colour of the sidewall ring and small lettering. */
export interface TyreCompound {
  name: string;
  color: string;
  /** False for no coloured ring on the sidewall. */
  ring?: boolean;
  /** Colour painted into one groove of the tread. */
  stripe?: string;
}

const GROOVE = { width: 14, floor: 10, depth: 2.5, pitch: 50 };

function profile({ diameter, width, bead = 228.6, grooves = 0 }: TyreSpec) {
  const R = diameter / 2;
  const A = width / 2;
  const side = R - bead;
  // Half profile from the outer bead (+A) over the shoulder to the crown.
  const half: [number, number][] = [
    [bead + 4, A - 24],
    [bead + side * 0.18, A - 6],
    [bead + side * 0.45, A],
    [bead + side * 0.72, A - 3],
    [R - 22, A - 16],
    [R - 6, A - 36],
    [R - 0.5, A - 62],
    [R, A * 0.35],
    [R, 0],
  ];
  // Inner bead → crown → outer bead (the inner side mirrors the outer).
  const full = [...half.map(([r, a]) => [r, -a]), ...half.slice(0, -1).reverse()];
  const dense = spline(full, 10, false);
  // Resample by arc length.
  const len = [0];
  for (let i = 1; i < dense.length; i++) len.push(len[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = len[len.length - 1];
  const n = 140;
  const pts: Vector2[] = [];
  let k = 0;
  for (let i = 0; i <= n; i++) {
    const s = (i / n) * total;
    while (k < len.length - 2 && len[k + 1] < s) k++;
    const t = (s - len[k]) / Math.max(1e-6, len[k + 1] - len[k]);
    pts.push(new Vector2(dense[k][0] + (dense[k + 1][0] - dense[k][0]) * t, dense[k][1] + (dense[k + 1][1] - dense[k][1]) * t));
  }
  if (!grooves) return { pts, total };
  // Cut the grooves: replace the crown samples they cross with exact edges.
  const centres = Array.from({ length: grooves }, (_, i) => (i - (grooves - 1) / 2) * GROOVE.pitch);
  const crown = (p: Vector2) => p.x > R - 3;
  const first = pts.findIndex(crown);
  const last = pts.length - 1 - pts.slice().reverse().findIndex(crown);
  const kept = pts.slice(first, last + 1).filter((p) => centres.every((c) => Math.abs(p.y - c) > GROOVE.width / 2 + 2));
  const cut = centres.flatMap((c) => [
    new Vector2(R, c - GROOVE.width / 2),
    new Vector2(R - GROOVE.depth, c - GROOVE.floor / 2),
    new Vector2(R - GROOVE.depth, c + GROOVE.floor / 2),
    new Vector2(R, c + GROOVE.width / 2),
  ]);
  return { pts: [...pts.slice(0, first), ...[...kept, ...cut].sort((a, b) => a.y - b.y), ...pts.slice(last + 1)], total };
}

export function tyreGeometry(spec: TyreSpec) {
  return cached(`tyre:${spec.diameter}:${spec.width}:${spec.bead ?? 228.6}:${spec.grooves ?? 0}`, () => {
    const { pts } = profile(spec);
    const g = new LatheGeometry(pts, 128);
    g.rotateX(Math.PI / 2);
    return g;
  });
}

/** Fraction along the profile (texture v) where the outer sidewall passes radius r. */
function vAt(spec: TyreSpec, r: number, outer: boolean) {
  const { pts } = profile(spec);
  const n = pts.length - 1;
  if (outer) {
    for (let i = n; i > 0; i--) if (pts[i - 1].x >= r && pts[i].x < r) return (i - 0.5) / n;
  } else {
    for (let i = 0; i < n; i++) if (pts[i].x < r && pts[i + 1].x >= r) return (i + 0.5) / n;
  }
  return outer ? 0.9 : 0.1;
}

const tyreMats = new Map<string, MeshPhysicalMaterial>();

/**
 * Rubber with sidewall markings: a compound-colour ring near the shoulder and
 * generic lettering on both sides (no manufacturer branding).
 */
export function tyreMaterial(spec: TyreSpec, compound: TyreCompound, position: string) {
  const key = `${spec.diameter}:${spec.width}:${spec.grooves ?? 0}:${compound.name}:${position}`;
  const hit = tyreMats.get(key);
  if (hit) return hit;
  const W = 4096;
  const H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1a1a1b";
  ctx.fillRect(0, 0, W, H);
  // Crown: faint scrub marks where the rubber has been worked.
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * W;
    const y = H * (0.32 + Math.random() * 0.36);
    ctx.fillStyle = `rgba(${Math.random() < 0.5 ? "0,0,0" : "60,60,62"},${0.12 + Math.random() * 0.15})`;
    ctx.fillRect(x, y, 2 + Math.random() * 18, 1 + Math.random() * 2);
  }
  const R = spec.diameter / 2;
  const bead = spec.bead ?? 228.6;
  const rowOf = (v: number) => (1 - v) * H;
  if (spec.grooves) {
    // The groove floors stay dark; the stripe marks the softer tyre.
    const { pts } = profile(spec);
    const n = pts.length - 1;
    let g = 0;
    for (let i = 0; i < n; i++) {
      if (pts[i].x !== R - GROOVE.depth || pts[i + 1].x !== R - GROOVE.depth) continue;
      const [y0, y1] = [rowOf((i - 0.4) / n), rowOf((i + 1.4) / n)];
      ctx.fillStyle = compound.stripe && g === 1 ? compound.stripe : "#090909";
      ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
      g++;
    }
  }
  for (const outer of [true, false]) {
    // Compound ring.
    if (compound.ring !== false) {
      const y0 = rowOf(vAt(spec, R - 34, outer));
      const y1 = rowOf(vAt(spec, R - 46, outer));
      ctx.fillStyle = compound.color;
      ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
    }
    // Lettering, repeated twice round the tyre.
    const yText = rowOf(vAt(spec, bead + (R - bead) * 0.5, outer));
    const size = Math.abs(rowOf(vAt(spec, bead + (R - bead) * 0.36, outer)) - rowOf(vAt(spec, bead + (R - bead) * 0.66, outer)));
    // Texture u runs anticlockwise seen from the outer side and clockwise
    // from the inner side, so plain canvas text reads correctly on both.
    for (let k = 0; k < 2; k++) {
      ctx.save();
      ctx.translate(W * (k / 2 + 0.25), yText);
      ctx.fillStyle = "#9b9ea2";
      ctx.font = `700 ${size * 0.8}px ${FONT_SANS}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${spec.grooves ? "" : "SLICK   "}${compound.name}   ${Math.round((bead * 2) / 25.4)}`, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.translate(W * (k / 2 + 0.06), yText);
      ctx.fillStyle = compound.color;
      ctx.font = `600 ${size * 0.5}px ${FONT_SANS}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(position.toUpperCase(), 0, 0);
      ctx.restore();
    }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  t.minFilter = LinearMipmapLinearFilter;
  const m = new MeshPhysicalMaterial({
    map: t,
    roughness: 0.84,
    metalness: 0,
    sheen: 0.3,
    sheenRoughness: 0.75,
    sheenColor: "#404044",
  });
  m.name = `tyre:${key}`;
  tyreMats.set(key, m);
  return m;
}
