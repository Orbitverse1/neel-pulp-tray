"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import StageLights from "./StageLights";
import EggTrayMesh from "./EggTrayMesh";
import { createEggMaterial } from "./materials";
import { getEggGeometry } from "./egg";
import { cellCenters, EGG_SEAT_Y } from "./tray";

const ROWS = 5;
const COLS = 6;
const COUNT = ROWS * COLS;
// Eggs enter at this height (base y) and fall smoothly into their cups.
// Capped so the visible drop path always stays inside the scene area,
// below the fixed site navbar.
const APPEAR_Y = 1.15;

// Smooth downward fall: accelerates like a real drop, then one soft settle
// bounce on landing. Returns fraction of the drop completed (can dip below 1
// during the settle so the egg rebounds slightly above its seat).
function dropEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.78) {
    const u = t / 0.78;
    return u * u;
  }
  const v = (t - 0.78) / 0.22;
  return 1 - Math.sin(v * Math.PI) * 0.05 * (1 - v);
}

// Deterministic organic fill order.
function fillOrder(n: number): number[] {
  const order = [...Array(n).keys()];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function Eggs({ progressRef, reduced }: { progressRef: React.MutableRefObject<number>; reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const centers = useMemo(() => cellCenters(ROWS, COLS), []);
  const order = useMemo(() => fillOrder(COUNT), []);
  const jitter = useMemo(() => [...Array(COUNT)].map((_, i) => (((i * 37) % 11) - 5) * 0.09), []);
  const eggGeo = getEggGeometry();
  const eggMat = useMemo(() => createEggMaterial(), []);


  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = reduced ? 1 : THREE.MathUtils.clamp(progressRef.current, 0, 1);
    for (let k = 0; k < COUNT; k++) {
      const idx = order[k];
      const [x, z] = centers[idx];
      // one-by-one staggered windows: fills during 0..0.96 of progress
      const start = (k / COUNT) * 0.72;
      const dur = 0.24;
      const t = THREE.MathUtils.clamp((p - start) / dur, 0, 1);
      const seatY = EGG_SEAT_Y;
      const y = seatY + (1 - dropEase(t)) * (APPEAR_Y - seatY);
      const scale = t <= 0 ? 0.0001 : Math.min(1, t * 8);
      dummy.position.set(x, y, z);
      dummy.rotation.set((1 - t) * jitter[idx], (1 - t) * jitter[idx] * 1.6, (1 - t) * jitter[idx] * 0.7);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[eggGeo, eggMat, COUNT]}
      castShadow
      frustumCulled={false}
    />
  );
}

function CameraMove({ progressRef, reduced }: { progressRef: React.MutableRefObject<number>; reduced: boolean }) {
  const pos = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    const aspectFix = THREE.MathUtils.clamp(1.25 / (size.width / size.height), 1, 2.1);
    const p = reduced ? 1 : THREE.MathUtils.clamp(progressRef.current, 0, 1);
    // dolly in during the fill, then pull back once the tray is full
    const inT = THREE.MathUtils.clamp(p / 0.8, 0, 1);
    const outT = THREE.MathUtils.clamp((p - 0.8) / 0.2, 0, 1);
    const sm = (t: number) => t * t * (3 - 2 * t);
    const z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(11.2, 7.4, sm(inT)), 12.4, sm(outT));
    const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(6.6, 4.6, sm(inT)), 7.2, sm(outT));
    const x = THREE.MathUtils.lerp(2.2, 0.4, sm(inT));
    pos.current.set(x * aspectFix, y * aspectFix, z * aspectFix);
    camera.position.copy(pos.current);
    camera.lookAt(0, -0.35, 0);
  });
  return null;
}

// On portrait screens the whole scene scales down so the full tray width
// (and every drop position) fits with side margins. Desktop stays 1.
function ResponsiveGroup({ children }: { children: React.ReactNode }) {
  const size = useThree((s) => s.size);
  const scale = THREE.MathUtils.clamp(size.width / size.height / 1.15, 0.5, 1);
  return <group scale={scale}>{children}</group>;
}

export default function EggFillScene({
  progressRef,
  reduced,
  dpr,
  shadows,
}: {
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
  dpr: number;
  shadows: boolean;
}) {
  return (
    <Canvas
      dpr={dpr}
      shadows={shadows}
      camera={{ position: [2.2, 6.6, 11.2], fov: 33 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#f3eee1"]} />
      <fog attach="fog" args={["#f3eee1", 16, 34]} />
      <StageLights />
      <ResponsiveGroup>
        <EggTrayMesh rows={ROWS} cols={COLS} />
        <Eggs progressRef={progressRef} reduced={reduced} />
      </ResponsiveGroup>
      <ContactShadows position={[0, -0.42, 0]} opacity={0.4} scale={18} blur={2.4} far={4} color="#3a3125" />
      <CameraMove progressRef={progressRef} reduced={reduced} />
    </Canvas>
  );
}