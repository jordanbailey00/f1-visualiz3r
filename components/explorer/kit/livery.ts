import { Color, MeshPhysicalMaterial, ShaderChunk, type Texture, type WebGLProgramParametersWithUniforms } from "three";
import { CAR_MAT, carbonWeave, WEAVE_REPEAT } from "./carMaterials";

/**
 * The house livery, identical for every era: one neutral satin paint on the
 * bodywork shells (survival cell, nose, engine cover, sidepods, halo fairing,
 * mirror housings), bare carbon on wings, floor, suspension and structure,
 * and natural metals on the mechanical parts. Nothing decorative, so the eye
 * goes to the parts rather than the paint.
 */
export const LIVERY = {
  paint: "#e2e5e8",
  roughness: 0.42,
  clearcoat: 0.4,
};

// ---------------------------------------------------------------------------
// Team liveries. Colour is worked out per pixel from the position on the car
// (object space, car millimetres), so a colour split runs on across separate
// panels as it does on the real car and stays crisp at any zoom. A layer
// covers what lies inside a side-view outline (x, y), a top-view outline
// (x, |z|), or both, and may be limited to surfaces facing one way. Left and
// right are alike. Layers paint in order, each over the ones before.

export type Pt = [number, number];

export interface Paint {
  color: string;
  rough?: number;
  metal?: number;
  /** Bare carbon rather than paint. */
  carbon?: boolean;
}

export interface Layer {
  /** Palette name. */
  paint: string;
  /** Side-view outline: x forward, y up. */
  side?: Pt[];
  /** Top-view outline: x forward, |z| out from the centre line. */
  top?: Pt[];
  /** Only surfaces facing up, facing down, or the flanks in between. */
  face?: "up" | "down" | "side";
  /** The colour turns into another paint along the car, from x = `from` to x = `to`. */
  fade?: { paint: string; from: number; to: number };
}

/** Wing parts a livery may paint; each is otherwise bare carbon. */
export type WingRole = "frontWing" | "frontEndplates" | "rearWing" | "rearEndplates";

export interface LiveryDesign {
  /** Chassis, e.g. "MP4-20". */
  car: string;
  season: number;
  /** One line on the colours, shown with the choice. */
  note: string;
  /** Two or three colours for the menu. */
  swatch: string[];
  palette: Record<string, Paint> & { base: Paint };
  /** Gloss of the paint; a palette entry may set its own roughness and metalness. */
  finish: { rough: number; metal?: number; clearcoat: number; clearcoatRough?: number };
  body: Layer[];
  /**
   * GLSL for what outlines cannot draw (a stripe pattern, say), run on the body
   * after the layers, with `p`, `n`, `col`, `edge()` and `ramp(a, b, x)` in scope.
   */
  glsl?: string;
  /** A palette name paints the whole part; layers paint over bare carbon. */
  wings?: Partial<Record<WingRole, string | Layer[]>>;
}

// ---------------------------------------------------------------------------
// One material per era and part group, kept for the life of the page: a
// livery change reprograms it in place, so nothing holding it (the scene,
// X-ray and focus modes) has to let go of it.

type Role = "body" | WingRole;
type Look = "house" | "carbon" | "carbonSatin";

interface Slot {
  era: string;
  role: Role;
  look: Look;
  features: string;
  material: MeshPhysicalMaterial;
}

const slots = new Map<string, Slot>();
const chosen = new Map<string, { id: string; design: LiveryDesign }>();

/**
 * Body paint for one era's car. `features` is optional GLSL for functional
 * surface detail every livery keeps (cooling louvres, exits, bare carbon
 * inside the cockpit), run after the colours in the same scope: `p`, `col`,
 * `carbon` and `edge()`.
 */
export function bodyPaint(era: string, features = "") {
  return slot(era, "body", "house", features);
}

/** A wing part that liveries may paint: bare carbon until one does. */
export function wingPaint(era: string, role: WingRole, look: "carbon" | "carbonSatin" = "carbon") {
  return slot(era, role, look, "");
}

function slot(era: string, role: Role, look: Look, features: string) {
  const key = `${era}:${role}:${look}`;
  let s = slots.get(key);
  if (!s) {
    const material = new MeshPhysicalMaterial();
    s = { era, role, look, features, material };
    slots.set(key, s);
    program(s);
  }
  return s.material;
}

/** Paints one era's car in a design, or back in the house livery (null). Returns whether anything changed. */
export function applyLivery(era: string, id: string, design: LiveryDesign | null) {
  const next = design ? id : null;
  if ((chosen.get(era)?.id ?? null) === next) return false;
  if (design) chosen.set(era, { id, design });
  else chosen.delete(era);
  for (const s of slots.values()) if (s.era === era) program(s);
  return true;
}

interface Fill {
  base: Paint;
  layers: { paint: Paint; fade?: Paint; layer: Layer }[];
  finish: LiveryDesign["finish"];
  glsl?: string;
}

const HOUSE: Fill = {
  base: { color: LIVERY.paint },
  layers: [],
  finish: { rough: LIVERY.roughness, metal: 0.04, clearcoat: LIVERY.clearcoat, clearcoatRough: 0.22 },
};

const BARE: Paint = { color: "#ffffff", carbon: true };

function fillOf(d: LiveryDesign, role: Role): Fill | null {
  const of = (name: string) => {
    const paint = d.palette[name];
    if (!paint) throw new Error(`livery ${d.car}: no paint "${name}"`);
    return paint;
  };
  const at = (layer: Layer) => ({ paint: of(layer.paint), fade: layer.fade && of(layer.fade.paint), layer });
  if (role === "body") return { base: d.palette.base, layers: d.body.map(at), finish: d.finish, glsl: d.glsl };
  const w = d.wings?.[role];
  if (!w) return null;
  return { base: BARE, layers: (typeof w === "string" ? [{ paint: w }] : w).map(at), finish: d.finish };
}

/** The GLSL each part group would run in a design, keyed by group: for checks without a renderer. */
export function designPatterns(d: LiveryDesign): Record<string, string> {
  const out: Record<string, string> = {};
  for (const role of ["body", "frontWing", "frontEndplates", "rearWing", "rearEndplates"] as const) {
    const fill = fillOf(d, role);
    if (fill) out[role] = pattern(fill, "");
  }
  return out;
}

function program(s: Slot) {
  const m = s.material;
  const pick = chosen.get(s.era);
  const fill = pick ? fillOf(pick.design, s.role) : null;
  if (fill) paint(m, s, fill, pick!.id);
  else if (s.look === "house") paint(m, s, HOUSE, "house");
  else bare(m, s.look);
  m.name = `paint:${s.era}:${s.role}`;
  m.needsUpdate = true;
}

/** Exactly the shared carbon material, so it also shares its compiled shader. */
function bare(m: MeshPhysicalMaterial, look: "carbon" | "carbonSatin") {
  m.copy(look === "carbon" ? CAR_MAT.carbon : CAR_MAT.carbonSatin);
  Reflect.deleteProperty(m, "onBeforeCompile");
  Reflect.deleteProperty(m, "customProgramCacheKey");
}

/** How the bare carbon in a painted part looks: like the material the part had in the house livery. */
interface CarbonLook {
  tint: number;
  rough: number;
  metal: number;
  clearcoat: number;
  clearcoatRough: number;
  bump: Texture | null;
  bumpScale: number;
}

function carbonLook(look: Look): CarbonLook {
  if (look === "house") return { tint: 0.9, rough: 0.46, metal: 0.04, clearcoat: LIVERY.clearcoat, clearcoatRough: 0.22, bump: null, bumpScale: 1 };
  const c = look === "carbon" ? CAR_MAT.carbon : CAR_MAT.carbonSatin;
  return { tint: c.color.r, rough: c.roughness, metal: c.metalness, clearcoat: c.clearcoat, clearcoatRough: c.clearcoatRoughness, bump: c.bumpMap, bumpScale: c.bumpScale };
}

function paint(m: MeshPhysicalMaterial, s: Slot, fill: Fill, id: string) {
  const carbon = carbonLook(s.look);
  m.color.set(fill.base.carbon ? "#ffffff" : fill.base.color);
  m.map = null;
  m.bumpMap = carbon.bump;
  m.bumpScale = carbon.bumpScale;
  m.roughness = fill.finish.rough;
  m.metalness = fill.finish.metal ?? 0.04;
  // Never quite zero: the bare carbon in a painted part keeps its lacquer.
  m.clearcoat = Math.max(0.02, fill.finish.clearcoat);
  m.clearcoatRoughness = fill.finish.clearcoatRough ?? 0.22;
  const glsl = pattern(fill, s.features);
  const key = `paint:${s.era}:${s.role}:${s.look}:${id}`;
  m.onBeforeCompile = (shader) => inject(shader, glsl, carbon);
  m.customProgramCacheKey = () => key;
}

// ---------------------------------------------------------------------------
// GLSL

/** A GLSL float literal. */
const f = (n: number) => {
  const s = String(Math.round(n * 1e4) / 1e4);
  return /[.e]/.test(s) ? s : `${s}.0`;
};

/** A colour as a GLSL vec3 in the renderer's (linear) working space, for a design's own GLSL. */
export function glslColor(hex: string) {
  const c = new Color(hex);
  return `vec3(${f(c.r)}, ${f(c.g)}, ${f(c.b)})`;
}

const rgb = glslColor;

/** Signed distance (mm) to a polygon, negative inside; far from it, only a bounding-box distance. */
function polygon(name: string, pts: Pt[]) {
  const v = pts.filter((p, i) => {
    const q = pts[(i + 1) % pts.length];
    return p[0] !== q[0] || p[1] !== q[1];
  });
  if (v.length < 3) throw new Error(`livery outline ${name}: fewer than three points`);
  const xs = v.map((p) => p[0]);
  const ys = v.map((p) => p[1]);
  const margin = 30;
  const x0 = Math.min(...xs) - margin;
  const x1 = Math.max(...xs) + margin;
  const y0 = Math.min(...ys) - margin;
  const y1 = Math.max(...ys) + margin;
  const n = v.length;
  return /* glsl */ `
float ${name}(vec2 q) {
  vec2 o = abs(q - vec2(${f((x0 + x1) / 2)}, ${f((y0 + y1) / 2)})) - vec2(${f((x1 - x0) / 2)}, ${f((y1 - y0) / 2)});
  if (o.x > 0.0 || o.y > 0.0) return ${f(margin)} + length(max(o, 0.0));
  const vec2 v[${n}] = vec2[${n}](${v.map(([x, y]) => `vec2(${f(x)}, ${f(y)})`).join(", ")});
  float d = dot(q - v[0], q - v[0]);
  float s = 1.0;
  for (int i = 0; i < ${n}; i++) {
    int j = i == 0 ? ${n - 1} : i - 1;
    vec2 e = v[j] - v[i];
    vec2 w = q - v[i];
    vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(q.y >= v[i].y, q.y < v[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s = -s;
  }
  return s * sqrt(d);
}`;
}

/** The pattern function for one fill: `void liveryPattern(p, n, inout col, carbon, rough, metal)`. */
function pattern(fill: Fill, features: string) {
  const fns: string[] = [];
  const outline = (pts: Pt[]) => {
    const name = `livOutline${fns.length}`;
    fns.push(polygon(name, pts));
    return name;
  };
  const finishOf = (p: Paint) => ({ rough: p.rough ?? fill.finish.rough, metal: p.metal ?? fill.finish.metal ?? 0.04 });
  const parts = (p: Paint) => {
    const { rough, metal } = finishOf(p);
    return [rgb(p.carbon ? "#ffffff" : p.color), f(p.carbon ? 1 : 0), f(rough), f(metal)];
  };
  const lines = fill.layers.map(({ paint, fade, layer }) => {
    const terms: string[] = [];
    if (layer.side) terms.push(`edge(-${outline(layer.side)}(sv))`);
    if (layer.top) terms.push(`edge(-${outline(layer.top)}(tv))`);
    if (layer.face === "up") terms.push("facing(n.y - 0.45)");
    else if (layer.face === "down") terms.push("facing(-n.y - 0.45)");
    else if (layer.face === "side") terms.push("facing(0.6 - abs(n.y))");
    const a = terms.join(" * ") || "1.0";
    let values = parts(paint);
    if (fade && layer.fade) {
      const t = `ramp(${f(layer.fade.from)}, ${f(layer.fade.to)}, p.x)`;
      const to = parts(fade);
      values = values.map((v, i) => `mix(${v}, ${to[i]}, ${t})`);
    }
    return `  livLay(${a}, ${values.join(", ")}, col, carbon, rough, metal);`;
  });
  const base = finishOf(fill.base);
  return /* glsl */ `
float edge(float d) { float w = fwidth(d) * 0.8 + 1e-4; return smoothstep(-w, w, d); }
float facing(float d) { float w = max(fwidth(d), 0.04); return smoothstep(-w, w, d); }
/** 0 at x = a to 1 at x = b, smoothly, whichever way round a and b are (smoothstep needs a < b). */
float ramp(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
void livLay(float a, vec3 c, float k, float r, float m, inout vec3 col, inout float carbon, inout float rough, inout float metal) {
  col = mix(col, c, a);
  carbon = mix(carbon, k, a);
  rough = mix(rough, r, a);
  metal = mix(metal, m, a);
}
${fns.join("\n")}
void liveryPattern(vec3 p, vec3 n, inout vec3 col, inout float carbon, inout float rough, inout float metal) {
  vec2 sv = p.xy;
  vec2 tv = vec2(p.x, abs(p.z));
  col = ${rgb(fill.base.carbon ? "#ffffff" : fill.base.color)};
  carbon = ${f(fill.base.carbon ? 1 : 0)};
  rough = ${f(base.rough)};
  metal = ${f(base.metal)};
${lines.join("\n")}
  {
${fill.glsl ?? ""}
  }
  {
${features}
  }
}`;
}

function inject(shader: WebGLProgramParametersWithUniforms, glsl: string, carbon: CarbonLook) {
  shader.uniforms.livWeave = { value: carbonWeave().map };
  shader.uniforms.livWeaveRepeat = { value: WEAVE_REPEAT };
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nvarying vec3 vLivPos;\nvarying vec3 vLivNormal;\nvarying vec2 vLivUv;")
    .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLivPos = position;\nvLivNormal = normal;\nvLivUv = uv;");
  const decl = ["varying vec3 vLivPos;", "varying vec3 vLivNormal;", "varying vec2 vLivUv;", "uniform sampler2D livWeave;", "uniform float livWeaveRepeat;", glsl].join("\n");
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", `#include <common>\n${decl}`)
    .replace(
      "#include <map_fragment>",
      `#include <map_fragment>
      vec3 livCol = vec3(0.0);
      float livCarbon = 0.0, livRough = 0.0, livMetal = 0.0;
      liveryPattern(vLivPos, normalize(vLivNormal), livCol, livCarbon, livRough, livMetal);
      vec3 livWeaveCol = texture2D(livWeave, vLivUv * livWeaveRepeat).rgb;
      diffuseColor.rgb = mix(livCol, livWeaveCol * ${f(carbon.tint)}, livCarbon);`,
    )
    .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>\nroughnessFactor = mix(livRough, ${f(carbon.rough)}, livCarbon);`)
    .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>\nmetalnessFactor = mix(livMetal, ${f(carbon.metal)}, livCarbon);`)
    // The weave's relief shows only where the carbon is bare.
    .replace("#include <normal_fragment_maps>", ShaderChunk.normal_fragment_maps.replace("dHdxy_fwd()", "dHdxy_fwd() * livCarbon"))
    .replace(
      "#include <lights_physical_fragment>",
      `#include <lights_physical_fragment>
      #ifdef USE_CLEARCOAT
        material.clearcoat = mix(material.clearcoat, ${f(carbon.clearcoat)}, livCarbon);
        material.clearcoatRoughness = mix(material.clearcoatRoughness, min(${f(Math.max(carbon.clearcoatRough, 0.0525))} + geometryRoughness, 1.0), livCarbon);
      #endif`,
    );
}
