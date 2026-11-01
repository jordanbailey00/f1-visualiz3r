"use client";

import { CameraControls, CameraControlsImpl } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Box3, BufferGeometry, Float32BufferAttribute, NeutralToneMapping, PCFShadowMap, Raycaster, Vector2, Vector3, type Group, type Mesh, type OrthographicCamera } from "three";
import type { CatalogEntry } from "@/lib/cars/catalog";
import type { ModelEntry } from "@/components/explorer/models/registry";
import { SceneLights, StudioEnvironment } from "@/components/explorer/Studio";
import "@/lib/three/hdrClamp";
import { AXLE_X, FRONT_PITCH, FRONT_ROW, NARROW, PITCH, ROW, ROW_NARROW, VIEW_DIR, fitOrthographic, labelAnchor, slot, viewPadding, type CarBounds, type LineupView, type V3 } from "./stage";

export type LineupCar = ModelEntry & { entry: CatalogEntry };

type Labels = RefObject<Record<string, HTMLAnchorElement | null>>;
type Scale = RefObject<{ bar: HTMLDivElement | null; text: HTMLSpanElement | null }>;

/** Nothing here reacts to the pointer through three.js: the cars are too heavy to raycast. */
const noEvents = () => ({ enabled: false, priority: 0 });

/** Everything hidden inside the bodywork: skipping it lightens a scene of many cars. */
const INTERIOR = new Set([
  "ice",
  "plenum",
  "oil-tank",
  "heat-shield",
  "mgu-k",
  "mgu-h",
  "turbocharger",
  "energy-store",
  "control-electronics",
  "ecu",
  "adr",
  "transponders",
  "ballast",
  "radiators",
  "gear-cluster",
  "clutch",
  "differential",
  "fuel-cell",
  "extinguisher",
  "pedals",
]);

const NOT_MEASURED = new Set(["cameras", "front-rims", "rear-rims"]);

const STAGE_SIZE = 20000;

export default function LineupCanvas({
  cars,
  view,
  bounds,
  onMeasured,
  labels,
  scale,
  onHover,
}: {
  cars: LineupCar[];
  view: LineupView;
  bounds: Record<string, CarBounds>;
  onMeasured: (id: string, b: CarBounds) => void;
  labels: Labels;
  scale: Scale;
  onHover: (id: string | null) => void;
}) {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      events={noEvents as never}
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      camera={{ near: 10, far: 400000, zoom: 0.09, position: [0, 60000, 0] }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        // The cars never move on their own, so the shadows are drawn only when they are placed.
        gl.shadowMap.autoUpdate = false;
      }}
    >
      <color attach="background" args={["#07090d"]} />
      <SceneLights size={STAGE_SIZE} shadows />
      <StudioEnvironment />
      <Cars cars={cars} view={view} onMeasured={onMeasured} />
      <Ground view={view} count={cars.length} />
      <Rig cars={cars} view={view} bounds={bounds} labels={labels} scale={scale} onHover={onHover} />
      <DevHook />
    </Canvas>
  );
}

/** The cars, brought out one at a time: building a model takes the main thread for a moment. */
function Cars({ cars, view, onMeasured }: { cars: LineupCar[]; view: LineupView; onMeasured: (id: string, b: CarBounds) => void }) {
  const narrow = useThree((s) => s.size.width) < NARROW;
  const [mounted, setMounted] = useState(1);
  const ready = (i: number, id: string, b: CarBounds) => {
    onMeasured(id, b);
    setTimeout(() => setMounted((m) => Math.max(m, i + 2)), 0);
  };
  return cars
    .slice(0, mounted)
    .map((car, i) => <CarSlot key={car.entry.id} car={car} at={slot(view, i, cars.length, narrow)} onReady={(b) => ready(i, car.entry.id, b)} />);
}

/** One car, placed by its rear axle, reporting its size once it exists. */
function CarSlot({ car, at, onReady }: { car: LineupCar; at: V3; onReady: (b: CarBounds) => void }) {
  const ref = useRef<Group>(null);
  const { Model } = car;
  return (
    <group ref={ref} position={[at[0] - car.car.rearAxle, at[1], at[2]]}>
      <Suspense fallback={null}>
        <Model />
        <Measure target={ref} rearAxle={car.car.rearAxle} onDone={onReady} />
      </Suspense>
    </group>
  );
}

const meshBox = new Box3();

/** Rendered after the model: hides what cannot be seen and measures what can. */
function Measure({ target, rearAxle, onDone }: { target: RefObject<Group | null>; rearAxle: number; onDone: (b: CarBounds) => void }) {
  const done = useRef(onDone);
  done.current = onDone;
  // After the commit, not during it: a model that was already loaded mounts in
  // one pass with its parent, whose ref is only attached after its children's
  // layout effects have run.
  useEffect(() => {
    const g = target.current;
    if (!g) return;
    g.traverse((o) => {
      if (INTERIOR.has(o.userData.partId)) o.visible = false;
    });
    const origin = g.position.clone();
    g.position.set(0, 0, 0);
    g.updateWorldMatrix(true, true);
    const all = new Box3();
    const body = new Box3();
    g.traverseVisible((o) => {
      const m = o as Mesh;
      if (!m.isMesh || !m.geometry) return;
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      meshBox.copy(m.geometry.boundingBox!).applyMatrix4(m.matrixWorld);
      all.union(meshBox);
      // The cameras stand above the car, and the wheel nuts are not what the car is measured across.
      for (let p: typeof o | null = o; p; p = p.parent) if (NOT_MEASURED.has(p.userData.partId)) return;
      body.union(meshBox);
    });
    g.position.copy(origin);
    g.updateWorldMatrix(true, true);
    done.current({
      min: [all.min.x - rearAxle, all.min.y, all.min.z],
      max: [all.max.x - rearAxle, all.max.y, all.max.z],
      width: body.max.z - body.min.z,
      height: body.max.y,
    });
  }, [target, rearAxle]);
  return null;
}

/** Line segments from a flat list of [x, y, z, x, y, z] pairs. */
function lines(points: number[]) {
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(points, 3));
  return g;
}

/** The floor and the one-metre grid the cars are measured against. */
function Ground({ view, count }: { view: LineupView; count: number }) {
  const row = useThree((s) => s.size.width) < NARROW ? ROW_NARROW : ROW;
  const span = (count / 2) * PITCH + 800;
  const grid = useMemo(() => {
    const p: number[] = [];
    if (view === "side") {
      const top = count * row - 100;
      for (let x = -1000; x <= 6000; x += 1000) p.push(AXLE_X + x, -60, -1500, AXLE_X + x, top, -1500);
      for (let r = 0; r < count; r++) p.push(AXLE_X - 1000, r * row, -1500, AXLE_X + 6000, r * row, -1500);
    } else if (view === "front") {
      const half = (Math.ceil(count / 2) / 2) * FRONT_PITCH + 300;
      for (const base of [0, FRONT_ROW]) {
        for (const y of [0, 500, 1000]) p.push(-3000, base + y, -half, -3000, base + y, half);
        for (let z = -Math.floor(half / 1000) * 1000; z <= half; z += 1000) p.push(-3000, base, z, -3000, base + 1000, z);
      }
    } else {
      for (let x = -1000; x <= 6000; x += 1000) p.push(AXLE_X + x, 0.5, -span, AXLE_X + x, 0.5, span);
      for (let z = -Math.ceil(span / 1000) * 1000; z <= span; z += 1000) p.push(AXLE_X - 1000, 0.5, z, AXLE_X + 6000, 0.5, z);
    }
    return lines(p);
  }, [view, span, count, row]);
  // The datum: the line through every rear axle.
  const axle = useMemo(() => {
    if (view === "front") return null;
    if (view === "side") return lines([AXLE_X, -60, -1490, AXLE_X, count * row - 100, -1490]);
    return lines([AXLE_X, 1, -span, AXLE_X, 1, span]);
  }, [view, span, count, row]);
  return (
    <group>
      {view === "side" || view === "front" ? (
        // The elevations stand against a backdrop, so the dark wings and tyres read against it.
        <mesh rotation-y={view === "side" ? 0 : Math.PI / 2} position={view === "side" ? [0, 0, -1600] : [-3100, 0, 0]}>
          <planeGeometry args={[160000, 160000]} />
          <meshBasicMaterial color="#151a23" toneMapped={false} />
        </mesh>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
          <planeGeometry args={[120000, 120000]} />
          <meshStandardMaterial color="#141820" roughness={0.92} metalness={0} />
        </mesh>
      )}
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#2a3448" />
      </lineSegments>
      {axle && (
        <lineSegments geometry={axle}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.55} />
        </lineSegments>
      )}
    </group>
  );
}

const ndc = new Vector2();
const ray = new Raycaster();
const screen = new Vector3();
const dirVec = new Vector3();
const STEPS = [200, 500, 1000, 2000, 5000];

/** Exposes renderer state for automated visual checks in development. */
function DevHook() {
  const state = useThree();
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") (window as unknown as { __three: typeof state }).__three = state;
  }, [state]);
  return null;
}

function Rig({
  cars,
  view,
  bounds,
  labels,
  scale,
  onHover,
}: {
  cars: LineupCar[];
  view: LineupView;
  bounds: Record<string, CarBounds>;
  labels: Labels;
  scale: Scale;
  onHover: (id: string | null) => void;
}) {
  const controls = useRef<CameraControlsImpl>(null);
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const router = useRouter();
  const narrow = size.width < NARROW;

  /** Each car's box in the scene, in this view. */
  const boxes = useMemo(
    () =>
      cars.map((car, i) => {
        const b = bounds[car.entry.id];
        if (!b) return null;
        const at = slot(view, i, cars.length, narrow);
        return new Box3(new Vector3(b.min[0] + at[0], b.min[1] + at[1], b.min[2] + at[2]), new Vector3(b.max[0] + at[0], b.max[1] + at[1], b.max[2] + at[2]));
      }),
    [cars, view, bounds, narrow],
  );
  const loaded = boxes.filter(Boolean).length;

  // Stacked side views would shadow each other, so only the others cast.
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh && m.userData.casts === undefined) m.userData.casts = m.castShadow;
      if (m.isMesh) m.castShadow = (view === "top" || view === "3d") && m.userData.casts;
    });
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [view, loaded, scene, gl, invalidate]);

  // Frame the whole lineup: a settled picture for the view, not the last car alone.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const all = new Box3();
    for (const b of boxes) if (b) all.union(b);
    if (all.isEmpty()) {
      // Until the first car reports in, frame the space they will take.
      const first = slot(view, 0, cars.length, narrow);
      const last = slot(view, cars.length - 1, cars.length, narrow);
      all.expandByPoint(new Vector3(AXLE_X - 700, 0, 0)).expandByPoint(new Vector3(AXLE_X + 5000, Math.max(first[1], last[1]) + 1000, 0));
      all.expandByPoint(new Vector3(AXLE_X, 0, first[2] + 1000 * Math.sign(first[2] || 1))).expandByPoint(new Vector3(AXLE_X, 0, last[2] + 1000 * Math.sign(last[2] || -1)));
    }
    dirVec.set(...VIEW_DIR[view]).normalize();
    const { target, zoom } = fitOrthographic(all, dirVec, size.width, size.height, viewPadding(view, narrow));
    const free = view === "3d";
    c.mouseButtons.left = free ? CameraControlsImpl.ACTION.ROTATE : CameraControlsImpl.ACTION.TRUCK;
    c.touches.one = free ? CameraControlsImpl.ACTION.TOUCH_ROTATE : CameraControlsImpl.ACTION.TOUCH_TRUCK;
    c.setLookAt(target.x + dirVec.x * 60000, target.y + dirVec.y * 60000, target.z + dirVec.z * 60000, target.x, target.y, target.z, false);
    c.zoomTo(zoom, false);
    c.update(0);
    invalidate();
  }, [view, boxes, cars.length, size.width, size.height, narrow, invalidate]);

  // Clicking a car opens it; only the boxes are tested, never the meshes.
  useEffect(() => {
    const el = gl.domElement;
    const pick = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      let best: string | null = null;
      let near = Infinity;
      boxes.forEach((b, i) => {
        if (!b || !ray.ray.intersectBox(b, screen)) return;
        const d = screen.distanceToSquared(ray.ray.origin);
        if (d < near) {
          near = d;
          best = cars[i].entry.id;
        }
      });
      return best as string | null;
    };
    let down: [number, number] | null = null;
    const move = (e: PointerEvent) => {
      const id = pick(e);
      el.style.cursor = id ? "pointer" : "";
      onHover(id);
    };
    const press = (e: PointerEvent) => {
      down = [e.clientX, e.clientY];
    };
    const release = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      const id = pick(e);
      if (id) router.push(`/${id}`);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", press);
    el.addEventListener("pointerup", release);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", press);
      el.removeEventListener("pointerup", release);
      el.style.cursor = "";
    };
  }, [gl, camera, boxes, cars, onHover, router]);

  const tail = Math.min(0, ...Object.values(bounds).map((b) => b.min[0]));

  // Labels and the scale bar follow the camera, written straight to the page.
  useFrame(() => {
    cars.forEach((car, i) => {
      const el = labels.current[car.entry.id];
      const b = bounds[car.entry.id];
      if (!el || !b) return;
      const { point, hang } = labelAnchor(view, slot(view, i, cars.length, narrow), b, tail, narrow);
      screen.set(...point).project(camera);
      el.style.transform = `translate(${((screen.x + 1) / 2) * size.width}px, ${((1 - screen.y) / 2) * size.height}px) ${hang}`;
    });
    const { bar, text } = scale.current;
    if (bar && text) {
      const m = STEPS.find((s) => s * camera.zoom >= 70) ?? STEPS[STEPS.length - 1];
      bar.style.width = `${m * camera.zoom}px`;
      text.textContent = m >= 1000 ? `${m / 1000} m` : `${m} mm`;
    }
  });

  return <CameraControls ref={controls} makeDefault minZoom={0.012} maxZoom={1.5} smoothTime={0.22} draggingSmoothTime={0.06} dollyToCursor maxPolarAngle={Math.PI / 2} />;
}
