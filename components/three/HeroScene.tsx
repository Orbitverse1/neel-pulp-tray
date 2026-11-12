"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import StageLights from "./StageLights";
import EggTrayMesh from "./EggTrayMesh";
import { getEggGeometry } from "./egg";
import { createEggMaterial } from "./materials";
import { cellCenters, EGG_SEAT_Y } from "./tray";

function HeroProduct() {
  const eggGeo = getEggGeometry();
  const eggMat = useMemo(() => createEggMaterial(), []);
  const eggs: [number, number][] = useMemo(() => {
    const all = cellCenters(3, 4);
    return [all[1], all[5], all[9]];
  }, []);
  return (
    <group>
      {/* Main stack of trays */}
      <group position={[3.1, 0, -1.2]} rotation-y={0.35}>
        {[0, 1, 2, 3].map((i) => (
          <EggTrayMesh
            key={i}
            rows={3}
            cols={4}
            position={[0, i * 0.44, 0]}
          />
        ))}
      </group>
      {/* Foreground tray with a few eggs */}
      <group position={[0.4, 0, 2.0]} rotation-y={-0.5}>
        <EggTrayMesh rows={3} cols={4} />
        {eggs.map(([x, z], i) => (
          <mesh key={i} geometry={eggGeo} material={eggMat} position={[x, EGG_SEAT_Y, z]} castShadow />
        ))}
      </group>
    </group>
  );
}

function CameraDrift({ reduced }: { reduced: boolean }) {
  useFrame(({ camera, clock }) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.18) * 0.55;
    camera.position.y = 3.4 + Math.sin(t * 0.12) * 0.22;
    camera.position.z = 12.6 + Math.cos(t * 0.15) * 0.35;
    camera.lookAt(1.4, 0.7, 0);
  });
  return null;
}

// On portrait screens the product group drops below the text block so the
// headline, paragraph and CTAs sit on clean background. Desktop unchanged.
function PortraitShift({ children }: { children: React.ReactNode }) {
  const size = useThree((s) => s.size);
  const y = size.width / size.height < 0.85 ? -5.2 : 0;
  return <group position={[0, y, 0]}>{children}</group>;
}

export default function HeroScene({ reduced, dpr, shadows, onCreated }: { reduced: boolean; dpr: number; shadows: boolean; onCreated?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        shadows={shadows}
        camera={{ position: [0, 3.4, 12.6], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={onCreated}
      >
        <StageLights />
        <PortraitShift>
          <HeroProduct />
          <ContactShadows position={[0, -0.36, 0]} opacity={0.42} scale={16} blur={2.6} far={4} color="#3a3125" />
        </PortraitShift>
        <fog attach="fog" args={["#f5f1e8", 16, 34]} />
        <CameraDrift reduced={reduced} />
      </Canvas>
    </div>
  );
}