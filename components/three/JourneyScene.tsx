"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import StageLights from "./StageLights";
import EggTrayMesh from "./EggTrayMesh";
import { createKraftMaterial, createEggMaterial } from "./materials";
import { getEggGeometry } from "./egg";
import { EGG_SEAT_Y, cellCenters } from "./tray";

const SCENE_GAP = 45;
const SCENE_COUNT = 6;

interface Key {
  pos: [number, number, number];
  look: [number, number, number];
}

const KEYS: Key[] = [
  { pos: [0, 4.8, 20], look: [0, 1.8, 0] },
  { pos: [-4.2, 3.6, 9.5], look: [0.3, 1.2, 0] },
  { pos: [4.2, 4.2, -SCENE_GAP + 10.5], look: [0, 1.8, -SCENE_GAP] },
  { pos: [-4.6, 4.0, -2 * SCENE_GAP + 10.5], look: [0, 2.0, -2 * SCENE_GAP] },
  { pos: [4.2, 4.0, -3 * SCENE_GAP + 10.5], look: [0, 1.4, -3 * SCENE_GAP] },
  { pos: [-4.2, 4.6, -4 * SCENE_GAP + 11], look: [0, 2.2, -4 * SCENE_GAP] },
  { pos: [0, 3.9, -5 * SCENE_GAP + 11], look: [0, 1.3, -5 * SCENE_GAP] },
];

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function CameraRig({ progressRef, reduced }: { progressRef: React.MutableRefObject<number>; reduced: boolean }) {
  const look = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3());
  useFrame(({ camera, clock }) => {
    const p = reduced ? 0.99 : THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const s = p * (KEYS.length - 1);
    const i = Math.min(Math.floor(s), KEYS.length - 2);
    const f = smooth(s - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const t = clock.getElapsedTime();
    const bobY = reduced ? 0 : Math.sin(t * 0.7) * 0.12;
    const bobX = reduced ? 0 : Math.cos(t * 0.5) * 0.15;
    pos.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], f) + bobX,
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], f) + bobY,
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], f)
    );
    look.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], f),
      THREE.MathUtils.lerp(a.look[1], b.look[1], f),
      THREE.MathUtils.lerp(a.look[2], b.look[2], f)
    );
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });
  return null;
}

// Fade scene groups in/out by camera distance to save draw calls.
function SceneGroup({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (!ref.current) return;
    const z = -index * SCENE_GAP;
    ref.current.visible = Math.abs(camera.position.z - z) < 62;
  });
  return (
    <group ref={ref} position={[0, 0, -index * SCENE_GAP]}>
      {children}
    </group>
  );
}

function RawPaper() {
  const kraft = useMemo(() => createKraftMaterial(), []);
  const strap = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5c5140", roughness: 0.8 }), []);
  return (
    <group>
      {[
        [-2.6, 0, -1.5, 0.25],
        [0.2, 0, -2.6, -0.15],
        [2.4, 0, -0.8, 0.45],
      ].map(([x, y, z, r], i) => (
        <group key={i} position={[x, y, z]} rotation-y={r}>
          <RoundedBox args={[2.3, 1.5, 1.7]} radius={0.08} position={[0, 0.75, 0]} material={kraft} castShadow receiveShadow />
          <mesh position={[0, 0.75, 0]} material={strap}>
            <boxGeometry args={[2.34, 1.54, 0.18]} />
          </mesh>
          <mesh position={[0, 0.75, 0]} material={strap}>
            <boxGeometry args={[0.18, 1.54, 1.74]} />
          </mesh>
        </group>
      ))}
      {/* paper rolls */}
      <group position={[-3.4, 0.75, 1.6]} rotation-z={Math.PI / 2} rotation-y={0.4}>
        <mesh material={kraft} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 24]} />
        </mesh>
      </group>
      <group position={[3.3, 0.75, 2.2]} rotation-z={Math.PI / 2} rotation-y={-0.3}>
        <mesh material={kraft} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 2.1, 24]} />
        </mesh>
      </group>
      {/* scattered sheets */}
      {[...Array(7)].map((_, i) => (
        <mesh
          key={i}
          material={kraft}
          position={[Math.sin(i * 2.3) * 3.4, 0.04 + (i % 3) * 0.02, Math.cos(i * 1.7) * 3.2]}
          rotation={[0, i * 0.9, 0]}
        >
          <boxGeometry args={[1.4, 0.02, 1.9]} />
        </mesh>
      ))}
    </group>
  );
}

function PulpVat() {
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8a7a5e", roughness: 0.6, metalness: 0.25, side: THREE.DoubleSide }), []);
  const pulp = useMemo(() => new THREE.MeshStandardMaterial({ color: "#cbb488", roughness: 0.55 }), []);
  const liquid = useRef<THREE.Mesh>(null);
  const stream = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (liquid.current) {
      liquid.current.rotation.z = t * 0.35;
      liquid.current.position.y = 1.92 + Math.sin(t * 1.4) * 0.03;
    }
    if (stream.current) {
      stream.current.scale.y = 1 + Math.sin(t * 6) * 0.06;
    }
  });
  return (
    <group>
      <mesh position={[0, 1.2, 0]} material={wall} castShadow receiveShadow>
        <cylinderGeometry args={[2.7, 2.9, 2.4, 40, 1, true]} />
      </mesh>
      <mesh position={[0, 0.06, 0]} material={wall}>
        <cylinderGeometry args={[2.9, 2.9, 0.12, 40]} />
      </mesh>
      <mesh ref={liquid} position={[0, 1.92, 0]} rotation-x={-Math.PI / 2} material={pulp}>
        <circleGeometry args={[2.62, 40]} />
      </mesh>
      {/* feed pipe */}
      <mesh position={[1.4, 3.6, 0]} rotation-z={Math.PI / 2} material={wall}>
        <cylinderGeometry args={[0.16, 0.16, 2.6, 16]} />
      </mesh>
      <mesh ref={stream} position={[0.35, 2.75, 0]} material={pulp}>
        <cylinderGeometry args={[0.09, 0.12, 1.5, 10]} />
      </mesh>
      {/* legs */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.4, 0.5, Math.sin(a) * 2.4]} material={wall}>
            <boxGeometry args={[0.22, 1.0, 0.22]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Molder() {
  const frame = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4e5a52", roughness: 0.5, metalness: 0.5 }), []);
  const platenMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6d7a70", roughness: 0.4, metalness: 0.6 }), []);
  const screen = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111511", emissive: "#8eae75", emissiveIntensity: 0.9 }), []);
  const platen = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (platen.current) {
      platen.current.position.y = 2.9 - (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.85;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.7, 0]} material={frame} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.4, 3.2]} />
      </mesh>
      {[[-2.3, -1.3], [2.3, -1.3], [-2.3, 1.3], [2.3, 1.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.6, z]} material={frame}>
          <cylinderGeometry args={[0.14, 0.14, 2.6, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 4.0, 0]} material={frame} castShadow>
        <boxGeometry args={[5.2, 0.5, 3.2]} />
      </mesh>
      <mesh ref={platen} position={[0, 2.9, 0]} material={platenMat} castShadow>
        <boxGeometry args={[3.4, 0.5, 2.4]} />
      </mesh>
      <group position={[0, 1.45, 0]}>
        <EggTrayMesh rows={3} cols={4} />
      </group>
      <group position={[3.3, 1.8, 0.6]} rotation-y={-0.5}>
        <mesh material={frame}>
          <boxGeometry args={[0.7, 1.6, 0.5]} />
        </mesh>
        <mesh position={[0, 0.4, 0.26]} material={screen}>
          <planeGeometry args={[0.45, 0.3]} />
        </mesh>
      </group>
    </group>
  );
}

function Dryer() {
  const beltMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3a3f38", roughness: 0.85 }), []);
  const railMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5c655b", roughness: 0.5, metalness: 0.5 }), []);
  const lampMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2c2f2a", emissive: "#e6b84a", emissiveIntensity: 1.4 }), []);
  const trays = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!trays.current) return;
    trays.current.children.forEach((child, i) => {
      child.position.x = ((t * 0.85 + i * 3.1) % 11) - 5.5;
    });
  });
  return (
    <group>
      <mesh position={[0, 0.95, 0]} material={beltMat} receiveShadow>
        <boxGeometry args={[11, 0.24, 2.6]} />
      </mesh>
      {[-5.4, 5.4].map((x, i) => (
        <mesh key={i} position={[x, 0.95, 0]} rotation-x={Math.PI / 2} material={railMat}>
          <cylinderGeometry args={[0.32, 0.32, 2.6, 16]} />
        </mesh>
      ))}
      {[[-4.6, -1.1], [4.6, -1.1], [-4.6, 1.1], [4.6, 1.1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.42, z]} material={railMat}>
          <boxGeometry args={[0.2, 0.84, 0.2]} />
        </mesh>
      ))}
      <group ref={trays}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[0, 1.22, 0]} scale={0.55}>
            <EggTrayMesh rows={3} cols={4} />
          </group>
        ))}
      </group>
      {[-2.6, 0, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 3.3, 0]} material={lampMat}>
          <boxGeometry args={[1.7, 0.14, 0.6]} />
        </mesh>
      ))}
    </group>
  );
}

function Stacks() {
  const pallet = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9b7f57", roughness: 0.85 }), []);
  return (
    <group>
      {[
        [-2.8, -1.2, 7],
        [0.4, -2.2, 9],
        [3.0, -0.4, 6],
      ].map(([x, z, n], s) => (
        <group key={s} position={[x, 0.16, z]} rotation-y={s * 0.4}>
          <group>
            {[-0.8, 0, 0.8].map((sx, i) => (
              <mesh key={i} position={[sx, -0.02, 0]} material={pallet}>
                <boxGeometry args={[0.5, 0.12, 4.4]} />
              </mesh>
            ))}
            {[-1.6, 1.6].map((sz, i) => (
              <mesh key={i} position={[0, -0.12, sz]} material={pallet}>
                <boxGeometry args={[2.6, 0.1, 0.4]} />
              </mesh>
            ))}
          </group>
          {[...Array(n)].map((_, i) => (
            <EggTrayMesh key={i} rows={3} cols={4} position={[0, 0.1 + i * 0.44, 0]} />
          ))}
        </group>
      ))}
    </group>
  );
}

function Pedestal() {
  const stone = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e6dfcf", roughness: 0.9 }), []);
  return (
    <group>
      <mesh position={[0, 0.5, 0]} material={stone} receiveShadow>
        <cylinderGeometry args={[2.6, 2.9, 1.0, 36]} />
      </mesh>
      <group position={[0, 1.34, 0]} rotation-y={0.3}>
        <EggTrayMesh rows={5} cols={6} />
      </group>
      <spotLight position={[0, 8, 2]} angle={0.5} penumbra={0.6} intensity={140} color="#fff2dc" castShadow />
    </group>
  );
}

export default function JourneyScene({
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
      camera={{ position: [0, 4.8, 20], fov: 36, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#efe9db"]} />
      <fog attach="fog" args={["#efe9db", 12, 58]} />
      <StageLights intensity={0.9} />
      {/* continuous factory floor */}
      <mesh position={[0, 0, -112]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[40, 300]} />
        <meshStandardMaterial color="#e3dac6" roughness={0.95} />
      </mesh>
      <SceneGroup index={0}>
        <RawPaper />
      </SceneGroup>
      <SceneGroup index={1}>
        <PulpVat />
      </SceneGroup>
      <SceneGroup index={2}>
        <Molder />
      </SceneGroup>
      <SceneGroup index={3}>
        <Dryer />
      </SceneGroup>
      <SceneGroup index={4}>
        <Stacks />
      </SceneGroup>
      <SceneGroup index={5}>
        <Pedestal />
      </SceneGroup>
      <ContactShadows position={[0, 0.01, -112]} opacity={0.18} scale={120} blur={3} far={6} color="#4a4234" frames={1} />
      <CameraRig progressRef={progressRef} reduced={reduced} />
    </Canvas>
  );
}