"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import StageLights from "./StageLights";
import EggTrayMesh from "./EggTrayMesh";
import { createKraftMaterial } from "./materials";
import { products, type Product } from "@/lib/products";
import { gsap } from "@/lib/gsap";

const GAP = 4.4;

// Pulls the camera back on narrow screens; the fog range must scale with it
// or the whole scene fogs out on portrait phones.
function aspectFixFor(width: number, height: number) {
  return THREE.MathUtils.clamp(1.3 / (width / height), 1, 1.8);
}

function FogFix() {
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const k = aspectFixFor(size.width, size.height);
    scene.fog = new THREE.Fog("#ece5d3", 18 * k, 42 * k);
  }, [scene, size.width, size.height]);
  return null;
}

function productX(i: number) {
  return (i - (products.length - 1) / 2) * GAP;
}

interface CamTarget {
  px: number;
  py: number;
  pz: number;
  lx: number;
  ly: number;
  lz: number;
}

function CameraFocus({ target }: { target: React.MutableRefObject<CamTarget> }) {
  const current = useRef<CamTarget>({ px: 0, py: 4.8, pz: 19.5, lx: 0, ly: 0.0, lz: 0 });
  useFrame(({ camera, size }) => {
    const aspectFix = aspectFixFor(size.width, size.height);
    const c = current.current;
    const t = target.current;
    c.px += (t.px - c.px) * 0.07;
    c.py += (t.py - c.py) * 0.07;
    c.pz += (t.pz - c.pz) * 0.07;
    c.lx += (t.lx - c.lx) * 0.07;
    c.ly += (t.ly - c.ly) * 0.07;
    c.lz += (t.lz - c.lz) * 0.07;
    camera.position.set(c.px * aspectFix, c.py * aspectFix, c.pz * aspectFix);
    camera.lookAt(c.lx, c.ly, c.lz);
  });
  return null;
}

function ProductItem({
  product,
  index,
  selected,
  dimmed,
  onSelect,
  reduced,
}: {
  product: Product;
  index: number;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string | null) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useMemo(() => {
    const m = createKraftMaterial();
    m.transparent = true;
    return m;
  }, []);
  const x = productX(index);

  useEffect(() => {
    if (!group.current) return;
    const g = group.current;
    gsap.to(g.position, {
      y: selected ? 0.7 : 0,
      duration: reduced ? 0 : 0.7,
      ease: "power3.out",
    });
    gsap.to(g.scale, {
      x: selected ? 1.18 : 1,
      y: selected ? 1.18 : 1,
      z: selected ? 1.18 : 1,
      duration: reduced ? 0 : 0.7,
      ease: "power3.out",
    });
    gsap.to(material, {
      opacity: dimmed ? 0.22 : 1,
      duration: reduced ? 0 : 0.5,
    });
  }, [selected, dimmed, material, reduced]);

  return (
    <group
      ref={group}
      position={[x, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(selected ? null : product.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <EggTrayMesh rows={product.rows} cols={product.cols} material={material} />
      {/* invisible hit plate so narrow trays are easy to tap */}
      <mesh visible={false} position={[0, 0.3, 0]}>
        <boxGeometry args={[Math.max(product.cols + 1, 3), 1.4, Math.max(product.rows + 1, 3)]} />
      </mesh>
    </group>
  );
}

export default function ProductsScene({
  selectedId,
  onSelect,
  reduced,
  dpr,
  shadows,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  reduced: boolean;
  dpr: number;
  shadows: boolean;
}) {
  const target = useRef<CamTarget>({ px: 0, py: 4.8, pz: 19.5, lx: 0, ly: 0.0, lz: 0 });
  const shelfMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b09a74", roughness: 0.8 }), []);
  const backMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8e1cf", roughness: 0.95 }), []);

  useEffect(() => {
    if (selectedId) {
      const i = products.findIndex((p) => p.id === selectedId);
      const x = productX(i);
      target.current = { px: x * 0.55, py: 3.1, pz: 8.6, lx: x, ly: 0.5, lz: 0 };
    } else {
      target.current = { px: 0, py: 4.8, pz: 19.5, lx: 0, ly: 0.0, lz: 0 };
    }
  }, [selectedId]);

  return (
    <Canvas
      dpr={dpr}
      shadows={shadows}
      camera={{ position: [0, 4.8, 19.5], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#ece5d3"]} />
      <FogFix />
      <StageLights />
      {/* shelf */}
      <RoundedBox args={[products.length * GAP + 3, 0.5, 5.4]} radius={0.06} position={[0, -0.62, 0]} material={shelfMat} receiveShadow castShadow />
      <mesh position={[0, 2.6, -3.2]} material={backMat} receiveShadow>
        <planeGeometry args={[products.length * GAP + 12, 9]} />
      </mesh>
      {products.map((p, i) => (
        <ProductItem
          key={p.id}
          product={p}
          index={i}
          selected={selectedId === p.id}
          dimmed={selectedId !== null && selectedId !== p.id}
          onSelect={onSelect}
          reduced={reduced}
        />
      ))}
      <ContactShadows position={[0, -0.36, 0]} opacity={0.35} scale={30} blur={2.6} far={4} color="#3a3125" />
      <CameraFocus target={target} />
    </Canvas>
  );
}