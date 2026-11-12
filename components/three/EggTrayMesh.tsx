"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createTrayGeometry } from "./tray";
import { createKraftMaterial } from "./materials";

export default function EggTrayMesh({
  rows,
  cols,
  material,
  ...props
}: {
  rows: number;
  cols: number;
  material?: THREE.Material;
} & Omit<React.ComponentProps<"mesh">, "children">) {
  const geometry = useMemo(() => createTrayGeometry(rows, cols), [rows, cols]);
  const fallback = useMemo(() => (material ? null : createKraftMaterial()), [material]);
  return <mesh geometry={geometry} material={material ?? fallback!} castShadow receiveShadow {...props} />;
}