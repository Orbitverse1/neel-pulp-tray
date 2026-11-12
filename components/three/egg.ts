import * as THREE from "three";

// Procedural egg: a lathe profile, wider near the bottom, origin at the base.
export const EGG_HEIGHT = 0.9;
export const EGG_RADIUS = 0.32;

let cached: THREE.LatheGeometry | null = null;

export function getEggGeometry(): THREE.LatheGeometry {
  if (cached) return cached;
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI;
    let r = Math.sin(a) * EGG_RADIUS * (1 + 0.18 * Math.cos(a));
    const y = ((1 - Math.cos(a)) / 2) * EGG_HEIGHT;
    if (i === 0 || i === steps) r = 0.0001;
    pts.push(new THREE.Vector2(Math.max(r, 0.0001), y));
  }
  cached = new THREE.LatheGeometry(pts, 36);
  cached.computeVertexNormals();
  return cached;
}