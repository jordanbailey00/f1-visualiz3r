"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function SceneLights({ size, shadows }: { size: number; shadows: boolean }) {
  const s = size;
  return (
    <>
      <hemisphereLight args={["#dfe8ff", "#1b1612", 0.45]} />
      <directionalLight
        castShadow={shadows}
        position={[s * 0.55, s * 1.3, s * 0.75]}
        intensity={1.9}
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.00015}
        shadow-normalBias={s * 0.0004}
        shadow-radius={3}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-s * 0.8, s * 0.8, s * 0.8, -s * 0.8, s * 0.1, s * 4]}
        />
      </directionalLight>
      <directionalLight position={[-s, s * 0.5, -s * 0.9]} intensity={0.7} color="#b9d3ff" />
      <directionalLight position={[-s * 0.4, s * 0.2, s]} intensity={0.35} color="#fff1dc" />
    </>
  );
}

/** Procedural studio lighting for reflections: softboxes and strip lights. */
export function StudioEnvironment() {
  return (
    <Environment resolution={512} environmentIntensity={0.62}>
      <color attach="background" args={["#0b0d12"]} />
      <Lightformer form="rect" intensity={1.3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} />
      <Lightformer form="rect" intensity={3.5} position={[-6, 2.5, 2]} rotation-y={Math.PI / 2} scale={[2.2, 9, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[6, 2, -1.5]} rotation-y={-Math.PI / 2} scale={[2, 9, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[0, 3, -8]} scale={[12, 1.6, 1]} />
      <Lightformer form="rect" intensity={0.8} position={[0, -1.5, 7]} rotation-y={Math.PI} scale={[12, 1.2, 1]} />
      <Lightformer form="ring" color="#a8c8ff" intensity={1.2} position={[3, 4, 6]} scale={2.5} />
    </Environment>
  );
}
