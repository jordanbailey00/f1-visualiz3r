import {
  CanvasTexture,
  Color,
  DoubleSide,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type MeshPhysicalMaterialParameters,
  type Texture,
} from "three";
import { rng } from "@/lib/three/painter";

/**
 * Materials of a racing car: carbon composites, paint, titanium, Inconel,
 * magnesium, rubber. Shared and created lazily, like MAT in ./materials.
 */
const made = new Map<string, MeshPhysicalMaterial>();

function phys(key: string, p: MeshPhysicalMaterialParameters) {
  let m = made.get(key);
  if (!m) {
    m = new MeshPhysicalMaterial(p);
    m.name = key;
    made.set(key, m);
  }
  return m;
}

// ---------------------------------------------------------------------------
// Carbon fibre: a 2×2 twill weave painted into colour and height maps.
// Loft and wing UVs are 1 unit per 100 mm; the weave repeats every 66 mm with
// 16 tows, ≈4 mm each (a 3K tow is ≈2–3 mm — slightly enlarged so it reads).

interface Weave {
  map: Texture;
  bump: Texture;
}
let weave: Weave | null = null;
export const WEAVE_REPEAT = 1.5;

function weaveMaps(): Weave {
  if (weave) return weave;
  const S = 512;
  const N = 16;
  const cell = S / N;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = c.height = S;
    return c;
  };
  const cc = mk();
  const hc = mk();
  const c = cc.getContext("2d")!;
  const h = hc.getContext("2d")!;
  const r = rng(7);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      // 2/2 twill: each tow passes over two and under two, stepping one per row.
      const warp = (i + j) % 4 < 2;
      const x0 = i * cell;
      const y0 = j * cell;
      const base = warp ? 40 + r() * 6 : 27 + r() * 5;
      c.fillStyle = `rgb(${base},${base + 2},${base + 5})`;
      c.fillRect(x0, y0, cell, cell);
      // Filaments run along the tow.
      for (let k = 0; k < 14; k++) {
        const v = base + (r() - 0.5) * 16;
        c.fillStyle = `rgba(${v},${v + 2},${v + 5},0.55)`;
        const o = r() * cell;
        if (warp) c.fillRect(x0 + o, y0, 1, cell);
        else c.fillRect(x0, y0 + o, cell, 1);
      }
      // Tow cross-section: a lens, high in the middle, low at the edges.
      const g = warp ? h.createLinearGradient(x0, 0, x0 + cell, 0) : h.createLinearGradient(0, y0, 0, y0 + cell);
      g.addColorStop(0, "#202020");
      g.addColorStop(0.5, "#e8e8e8");
      g.addColorStop(1, "#202020");
      h.fillStyle = g;
      h.fillRect(x0, y0, cell, cell);
      // Dark gap where the tows cross.
      c.fillStyle = "rgba(0,0,0,0.35)";
      if (warp) {
        c.fillRect(x0, y0, 1.5, cell);
        c.fillRect(x0 + cell - 1.5, y0, 1.5, cell);
      } else {
        c.fillRect(x0, y0, cell, 1.5);
        c.fillRect(x0, y0 + cell - 1.5, cell, 1.5);
      }
    }
  }
  const tex = (cv: HTMLCanvasElement, srgb: boolean) => {
    const t = new CanvasTexture(cv);
    t.colorSpace = srgb ? SRGBColorSpace : NoColorSpace;
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(WEAVE_REPEAT, WEAVE_REPEAT);
    t.anisotropy = 8;
    t.minFilter = LinearMipmapLinearFilter;
    return t;
  };
  weave = { map: tex(cc, true), bump: tex(hc, false) };
  return weave;
}

export function carbonWeave() {
  return weaveMaps();
}

// ---------------------------------------------------------------------------

export const CAR_MAT = {
  /** Lacquered carbon: deep weave under a mirror clear coat. */
  get carbon() {
    const w = weaveMaps();
    return phys("carbon", {
      color: "#ffffff",
      map: w.map,
      bumpMap: w.bump,
      bumpScale: 0.35,
      roughness: 0.42,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.07,
    });
  },
  /** Bare, unlacquered carbon (floor, internal structure). */
  get carbonMatte() {
    const w = weaveMaps();
    return phys("carbonMatte", {
      color: "#b8b8b8",
      map: w.map,
      bumpMap: w.bump,
      bumpScale: 0.3,
      roughness: 0.72,
      metalness: 0.02,
      // Big flat panels otherwise mirror the overhead softbox as a grey sheet.
      envMapIntensity: 0.5,
    });
  },
  /** Carbon in a satin finish (the half-gloss most 2026 cars race in). */
  get carbonSatin() {
    const w = weaveMaps();
    return phys("carbonSatin", {
      color: "#e8e8e8",
      map: w.map,
      bumpMap: w.bump,
      bumpScale: 0.3,
      roughness: 0.48,
      metalness: 0.08,
      clearcoat: 0.45,
      clearcoatRoughness: 0.32,
    });
  },
  /** Plain black composite for small parts without a visible weave. */
  get composite() {
    return phys("composite", { color: "#121315", roughness: 0.5, metalness: 0.1, clearcoat: 0.5, clearcoatRoughness: 0.3 });
  },
  get titanium() {
    return phys("titanium", { color: "#8c8a86", metalness: 1, roughness: 0.36 });
  },
  get titaniumBlue() {
    // Heat-coloured titanium (skid blocks, exhaust tips).
    return phys("titaniumBlue", { color: "#5e6f8f", metalness: 1, roughness: 0.3, iridescence: 0.6, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 500] });
  },
  /** Nickel super-alloy exhaust: straw-gold and blue heat tint. */
  get inconel() {
    return phys("inconel", {
      color: "#b0905e",
      metalness: 1,
      roughness: 0.42,
      iridescence: 0.55,
      iridescenceIOR: 1.9,
      iridescenceThicknessRange: [250, 700],
    });
  },
  get aluminium() {
    return phys("aluminium", { color: "#c2c6cb", metalness: 1, roughness: 0.32 });
  },
  get aluminiumCast() {
    return phys("aluminiumCast", { color: "#9fa3a8", metalness: 1, roughness: 0.5 });
  },
  /** Magnesium / painted castings: engine block, gearbox internals. */
  get magnesium() {
    return phys("magnesium", { color: "#6d7076", metalness: 0.8, roughness: 0.48 });
  },
  get steel() {
    return phys("steelCar", { color: "#a3a7ad", metalness: 1, roughness: 0.3 });
  },
  get gearSteel() {
    return phys("gearSteel", { color: "#8e9197", metalness: 1, roughness: 0.24, anisotropy: 0.6 });
  },
  /** Gold reflective heat-shield film (engine bay, floor above the exhaust). */
  get goldFoil() {
    return phys("goldFoil", { color: "#c9993f", metalness: 1, roughness: 0.58, side: DoubleSide, envMapIntensity: 0.55 });
  },
  /** Slick tyre rubber. */
  get rubber() {
    return phys("tyreRubber", { color: "#161617", roughness: 0.86, metalness: 0, sheen: 0.25, sheenRoughness: 0.8, sheenColor: new Color("#3a3a3c") });
  },
  /** Carbon–carbon brake disc: matte charcoal. */
  get brakeCarbon() {
    return phys("brakeCarbon", { color: "#2a2a2b", roughness: 0.78, metalness: 0.15 });
  },
  /** Anodised calipers and fittings. */
  get anodisedDark() {
    return phys("anodisedDark", { color: "#2b2d31", metalness: 0.85, roughness: 0.38 });
  },
  /** Orange high-voltage cabling and connectors. */
  get hvOrange() {
    return phys("hvOrange", { color: "#ff6a13", roughness: 0.45, metalness: 0, clearcoat: 0.3 });
  },
  get hose() {
    return phys("hose", { color: "#1d1e21", roughness: 0.7, metalness: 0 });
  },
  /** Braided stainless hose. */
  get braided() {
    return phys("braided", { color: "#8d9196", roughness: 0.55, metalness: 0.9 });
  },
  /** Seat foam, headrest padding, cockpit trim. */
  get foam() {
    return phys("foam", { color: "#1b1c1f", roughness: 0.95, metalness: 0 });
  },
  get rubberGrip() {
    return phys("rubberGrip", { color: "#151516", roughness: 0.9, metalness: 0 });
  },
  /** Mirror glass. */
  get mirror() {
    return phys("mirrorGlass", { color: "#dfe6ee", metalness: 1, roughness: 0.03 });
  },
  /** Radiator cores: fine aluminium fins seen edge-on. */
  get radiatorCore() {
    return phys("radiatorCore", { color: "#9ea4aa", metalness: 0.9, roughness: 0.55 });
  },
  /** Battery cells and electronics boxes. */
  get electronics() {
    return phys("electronicsBox", { color: "#2f3237", metalness: 0.3, roughness: 0.6 });
  },
  /** Camera housings (the T-camera is black on a team's first car). */
  get camera() {
    return phys("cameraHousing", { color: "#141518", roughness: 0.4, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  },
  get lens() {
    return phys("lens", { color: "#0a0d14", metalness: 0.2, roughness: 0.05, clearcoat: 1 });
  },
} as const;

const glows = new Map<string, MeshStandardMaterial>();

/** Emissive material for lights and screens (keep intensity ≤ 4.5: output is capped at 5). */
export function glow(color: string, intensity = 2.5) {
  const key = `${color}:${intensity}`;
  let m = glows.get(key);
  if (!m) {
    m = new MeshStandardMaterial({ color: new Color(color).multiplyScalar(0.2), emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
    glows.set(key, m);
  }
  return m;
}

const tints = new Map<string, MeshPhysicalMaterial>();

/** A cached one-off physical material (painted parts in a single colour). */
export function paintColour(key: string, color: string, extra: MeshPhysicalMaterialParameters = {}) {
  let m = tints.get(key);
  if (!m) {
    m = new MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0.05, clearcoat: 0.8, clearcoatRoughness: 0.12, ...extra });
    m.name = key;
    tints.set(key, m);
  }
  return m;
}

// ---------------------------------------------------------------------------
// Livery paint: colour is computed per pixel from the object-space position,
// so stripes and colour splits stay crisp at any zoom and follow the car's
// coordinates across separate panels. Areas the pattern marks as "carbon"
// show the bare weave.

export interface LiverySpec {
  /** Unique key (also the shader cache key). */
  key: string;
  /** Named colours available to the GLSL as `uniform vec3 <name>`. */
  colors: Record<string, string>;
  /**
   * GLSL body of `void liveryPattern(vec3 p, inout vec3 col, inout float carbon, inout float rough)`.
   * `p` is the position in car millimetres, `col` starts as the base colour,
   * `carbon` (0…1) blends in bare carbon, `rough` overrides roughness when ≥ 0.
   * Helper `float edge(float d)` gives an antialiased step at d = 0.
   */
  glsl: string;
  base: string;
  roughness?: number;
  clearcoat?: number;
}

const liveries = new Map<string, MeshPhysicalMaterial>();

export function liveryMaterial(spec: LiverySpec) {
  const hit = liveries.get(spec.key);
  if (hit) return hit;
  const w = weaveMaps();
  const m = new MeshPhysicalMaterial({
    color: spec.base,
    roughness: spec.roughness ?? 0.32,
    metalness: 0.04,
    clearcoat: spec.clearcoat ?? 0.85,
    clearcoatRoughness: 0.22,
  });
  m.name = `livery:${spec.key}`;
  const uniforms: Record<string, { value: unknown }> = {
    livWeave: { value: w.map },
    livWeaveRepeat: { value: WEAVE_REPEAT },
  };
  for (const [k, v] of Object.entries(spec.colors)) uniforms[k] = { value: new Color(v) };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLivPos;\nvarying vec2 vLivUv;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLivPos = position;\nvLivUv = uv;");
    const decl = [
      "varying vec3 vLivPos;",
      "varying vec2 vLivUv;",
      "uniform sampler2D livWeave;",
      "uniform float livWeaveRepeat;",
      ...Object.keys(spec.colors).map((k) => `uniform vec3 ${k};`),
      "float edge(float d) { float w = fwidth(d) * 0.8 + 1e-4; return smoothstep(-w, w, d); }",
      `void liveryPattern(vec3 p, inout vec3 col, inout float carbon, inout float rough) {\n${spec.glsl}\n}`,
    ].join("\n");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${decl}`)
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec3 livCol = diffuseColor.rgb;
        float livCarbon = 0.0;
        float livRough = -1.0;
        liveryPattern(vLivPos, livCol, livCarbon, livRough);
        vec3 livWeaveCol = texture2D(livWeave, vLivUv * livWeaveRepeat).rgb;
        diffuseColor.rgb = mix(livCol, livWeaveCol * 0.9, livCarbon);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        if (livRough >= 0.0) roughnessFactor = livRough;
        roughnessFactor = mix(roughnessFactor, 0.46, livCarbon);`,
      );
  };
  m.customProgramCacheKey = () => `livery:${spec.key}`;
  liveries.set(spec.key, m);
  return m;
}
