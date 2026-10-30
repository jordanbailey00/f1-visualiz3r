# Development

f1 visualiz3r reuses visualiz3r's explorer: the same instrument-panel HUD, part
system, exploded-view driver, camera fitting, outlines and studio lighting. Its
models are F1 cars instead of computer hardware.

## Stack

Next.js 16 (App Router, Turbopack), React 19, three.js via React Three Fiber,
drei and `@react-three/postprocessing`, Zustand, Tailwind CSS 4.

```
app/                       routes: /  and  /[era]  (only built eras are generated)
logo.txt                   the ASCII logo on the home page
lib/cars/                  types, era catalog (+ part category colours), store, content/<era>.ts
lib/three/                 canvas painter, camera fitting, view shift, hit filtering, HDR clamp
components/explorer/       canvas, explorer page, Part system, labels, UI panels
  kit/                     modelling kit (see below)
  models/registry.ts       lazy import per era, plus whether it has movable wings
  models/car-<era>/        one folder per car
components/hud, site/      HUD pieces, home page logo + star field
scripts/                   screenshot.mjs, smoke.mjs
```

## Coordinates

Millimetres. +X forward (the nose), +Y up, +Z to the driver's right. The
wheelbase is centred on x = 0 and the tyres stand on y = 0. Heights in the
rules are measured from the reference plane (`CAR.refY`, the top of the plank).
Use `Z(mm)` from the car's layout to convert.

The FIA's own X axis runs rearward from datum planes, and each car's
`layout.ts` exports those planes as car x positions:

| Datum | Meaning |
| --- | --- |
| `XF`, `XR` | Front and rear axles |
| `XA` | Forward limit of the survival cell |
| `XC` | Rear of the cockpit |
| `XPU` | ICE mounting face |
| `XDIF` | Final-drive axis |

A rule position "XA = d" is `XA - d`. Build from the datums and the
regulation boxes rather than eyeballing.

## House livery

Every era uses the same livery (`kit/livery.ts`), so the eye goes to the parts:

- One neutral satin paint on the bodywork shells (survival cell, nose, engine
  cover, sidepods, halo fairing, mirror housings).
- Bare carbon on wings, floor, suspension and structure, and natural metals
  on the mechanical parts.
- No stripes, accent colours or race numbers.

Functional surface detail (cooling louvres, the cockpit's bare-carbon
interior) goes in the era's `livery.ts` as GLSL in the paint's pattern
function. The only colours on the car are functional: tyre compound bands,
lights, and orange high-voltage cabling.

## Parts and motion

- `<Part id explode explodeRange explodeRotate cover>`: a selectable,
  explodable group, exactly as in visualiz3r. Every `id` needs an entry in
  `lib/cars/content/<era>.ts`. `npm test` checks both directions.
- `<Mirrored out up explodeRange>`: renders a right-hand part (z > 0) and its
  mirror image, and moves them apart sideways in the exploded view.
  `useMirrorSide()` returns −1 inside the mirrored copy, so lettering can be
  flipped back.
- `<Shift>`: explode motion for a group that is not itself a part.
- `<AeroPivot hinge axis angle>`: rotates movable wing elements as the
  Straight-mode switch (key **A**) eases `aeroProgress` from 0 to 1.

## Kit

| Module | Use |
| --- | --- |
| `kit/loft` | `loft(rings)`: Catmull–Rom lofted surfaces for bodywork; `mirrorRing`, `superRing`, `superRingXY`, `spline`, `mirrorZ` |
| `kit/wing` | `naca` aerofoils, `wingElement(profile, stations)`, `fullSpan`, `plate` (endplates and fences), `smoothOutline` |
| `kit/strut` | `foilMember` (streamlined suspension legs), `rod`, `ball`, `wishbone`, `pipe` |
| `kit/tyre` | `tyreGeometry` (lathe profile resampled by arc length), `tyreMaterial` (compound band + sidewall lettering) |
| `kit/carMaterials` | `CAR_MAT` (twill carbon, titanium, Inconel, magnesium, rubber, gold foil…), `glow`, `paintColour`, `liveryMaterial` |
| `kit/geometry`, `kit/materials`, `kit/Thermal` | copied from visualiz3r: `cached`, `mergeAll`, `roundedBox`, `MAT`, `bentPath`… |

`liveryMaterial` paints the body in a shader from the object-space position,
so colour splits and stripes stay crisp and run continuously across separate
panels. Areas the pattern marks as carbon show the twill weave. Loft, wing and
plate UVs are 1 unit per 100 mm.

## Checks

The dev server for checks runs on port 4181 (`.claude/launch.json`).
`npm run dev` itself uses 4180.

```bash
npm run typecheck
npm test                 # every <Part id> has an explanation, and vice versa
npm run smoke            # home + every built era: explode, aero, select, X-ray, zoom
node scripts/screenshot.mjs /2026?clean .screenshots/car.png --wait 9000 \
  --eval "window.__explorer.getState().setExplode(1)" --then-wait 4000
```

In development `window.__explorer` is the store and `window.__three` the R3F
state (`__three.controls` is the CameraControls instance). The home page card
images live in `public/previews/<era>.webp`.

## Adding an era

1. Add `lib/cars/content/<era>.ts` and register it in `lib/cars/content/index.ts`.
2. Build `components/explorer/models/car-<era>/` with a default-export model and
   add it to `models/registry.ts`. Set `aero` for eras with DRS (2011–2025),
   labelled "DRS".
3. Set `built: true` in `lib/cars/catalog.ts`, add the era to `CARS` in
   `scripts/smoke.mjs`, and save a preview at `public/previews/<era>.webp`.
