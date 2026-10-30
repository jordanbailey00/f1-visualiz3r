import { CanvasTexture, LatheGeometry, LinearMipmapLinearFilter, MeshPhysicalMaterial, SRGBColorSpace, Vector2 } from "three";
import { FONT_SANS } from "@/lib/three/painter";
import { cached } from "./geometry";
import { spline } from "./loft";

/**
 * Slick racing tyres. The cross-section is a smooth profile from bead to bead
 * (resampled by arc length so texture rows follow the rubber evenly), spun
 * round the axle. The axle runs along Z; the outer sidewall faces +Z.
 */
export interface TyreSpec {
  /** Overall diameter, mm. */
  diameter: number;
  /** Section width at the sidewall bulge, mm. */
  width: number;
  /** Bead seat radius (rim), mm: 18-inch = 228.6. */
  bead?: number;
}

function profile({ diameter, width, bead = 228.6 }: TyreSpec) {
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
  return { pts, total };
}

export function tyreGeometry(spec: TyreSpec) {
  return cached(`tyre:${spec.diameter}:${spec.width}:${spec.bead ?? 228.6}`, () => {
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
export function tyreMaterial(spec: TyreSpec, compound: { name: string; color: string }, position: string) {
  const key = `${spec.diameter}:${spec.width}:${compound.name}:${position}`;
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
  for (const outer of [true, false]) {
    // Compound ring.
    const y0 = rowOf(vAt(spec, R - 34, outer));
    const y1 = rowOf(vAt(spec, R - 46, outer));
    ctx.fillStyle = compound.color;
    ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
    // Lettering, repeated twice round the tyre.
    const yText = rowOf(vAt(spec, bead + (R - bead) * 0.5, outer));
    const size = Math.abs(rowOf(vAt(spec, bead + (R - bead) * 0.36, outer)) - rowOf(vAt(spec, bead + (R - bead) * 0.66, outer)));
    // Texture u runs anticlockwise seen from the outer side and clockwise
    // from the inner side, so plain canvas text reads correctly on both.
    for (let k = 0; k < 2; k++) {
      ctx.save();
      ctx.translate(W * (k / 2 + 0.25), yText);
      ctx.fillStyle = "#d9dadc";
      ctx.font = `700 ${size * 0.8}px ${FONT_SANS}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`SLICK   ${compound.name}   18`, 0, 0);
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
