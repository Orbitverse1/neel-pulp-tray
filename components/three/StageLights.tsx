"use client";

import { Environment, Lightformer } from "@react-three/drei";

// Warm studio lighting used across scenes. Environment is generated from
// Lightformers so no external HDR file is fetched.
export default function StageLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <hemisphereLight args={["#f5f1e8", "#4a4234", 0.55 * intensity]} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.6 * intensity}
        color="#fff2dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[-7, 5, -4]} intensity={0.5 * intensity} color="#dfe9d4" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#fff4e0" />
        <Lightformer intensity={1.1} position={[-5, 2, -1]} rotation-y={Math.PI / 2} scale={[7, 3, 1]} color="#f5f1e8" />
        <Lightformer intensity={0.9} position={[5, 2, -1]} rotation-y={-Math.PI / 2} scale={[7, 3, 1]} color="#e8efdd" />
      </Environment>
    </>
  );
}