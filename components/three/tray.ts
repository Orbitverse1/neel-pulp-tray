import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Procedural molded paper egg tray, modeled like the real pulp sheet:
// a thin sheet with a scalloped perimeter flange, deep conical cups and tall
// pointed divider cones - the molded relief shows on the underside too.
// No boxed base or straight walls.

export const TRAY_TOP = 0.3;
export const WELL_DEPTH = 0.5;
export const DIVIDER_HEIGHT = 0.34;
const SHEET = 0.055; // pulp sheet thickness
const FLANGE = 0.36; // flat rim width around the cell field

export function trayDimensions(rows: number, cols: number, pitch = 1) {
  return { width: cols * pitch + FLANGE * 2, depth: rows * pitch + FLANGE * 2 };
}

export function cellCenters(rows: number, cols: number, pitch = 1): [number, number][] {
  const centers: [number, number][] = [];
  const w = (cols - 1) * pitch;
  const d = (rows - 1) * pitch;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      centers.push([c * pitch - w / 2, r * pitch - d / 2]);
    }
  }
  return centers;
}

// Height of the top sheet surface at (x, z): flat flange, conical wells,
// pointed divider cones at every grid intersection.
function surfaceHeight(x: number, z: number, centers: [number, number][], posts: [number, number][], pitch: number): number {
  let h = TRAY_TOP;
  const wellR = 0.43 * pitch;
  for (const [cx, cz] of centers) {
    const dx = x - cx;
    const dz = z - cz;
    const d2 = dx * dx + dz * dz;
    const rr = wellR * wellR;
    if (d2 < rr * 2.2) {
      const t = Math.max(0, 1 - d2 / rr);
      h -= WELL_DEPTH * Math.pow(t, 1.08);
    }
  }
  const pr = 0.24 * pitch;
  for (const [px, pz] of posts) {
    const dx = x - px;
    const dz = z - pz;
    const d2 = dx * dx + dz * dz;
    if (d2 < pr * pr) {
      const t = Math.max(0, 1 - d2 / (pr * pr));
      h += DIVIDER_HEIGHT * Math.pow(t, 0.85);
    }
  }
  return h;
}

export function createTrayGeometry(rows: number, cols: number, pitch = 1): THREE.BufferGeometry {
  const { width, depth } = trayDimensions(rows, cols, pitch);
  const segX = Math.max(10, cols * 14);
  const segZ = Math.max(10, rows * 14);

  const plane = new THREE.PlaneGeometry(width, depth, segX, segZ);
  plane.rotateX(-Math.PI / 2);

  const pos = plane.attributes.position as THREE.BufferAttribute;
  const centers = cellCenters(rows, cols, pitch);

  const posts: [number, number][] = [];
  const w = (cols - 1) * pitch;
  const d = (rows - 1) * pitch;
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      posts.push([c * pitch - w / 2 - pitch / 2, r * pitch - d / 2 - pitch / 2]);
    }
  }

  const hw = width / 2;
  const hh = depth / 2;
  const margin = 0.15; // scallop band along the perimeter

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let z = pos.getZ(i);

    // Scalloped outline: pull the perimeter inward in a wave aligned to the
    // cell pitch, and dip the flange height slightly in the valleys.
    const dx = hw - Math.abs(x);
    const dz = hh - Math.abs(z);
    let scallopValley = 0;
    if (dx < margin && dx <= dz) {
      const p = 1 - dx / margin;
      const wave = 0.5 + 0.5 * Math.sin((2 * Math.PI * z) / pitch);
      x -= Math.sign(x) * 0.06 * p * wave;
      scallopValley = Math.max(scallopValley, p * (1 - wave));
    }
    if (dz < margin && dz < dx) {
      const p = 1 - dz / margin;
      const wave = 0.5 + 0.5 * Math.sin((2 * Math.PI * x) / pitch);
      z -= Math.sign(z) * 0.06 * p * wave;
      scallopValley = Math.max(scallopValley, p * (1 - wave));
    }

    const h = surfaceHeight(x, z, centers, posts, pitch) - 0.02 * scallopValley;
    pos.setXYZ(i, x, h, z);
  }
  plane.computeVertexNormals();

  // Underside: same molded sheet shifted down by the pulp thickness, flipped.
  const bottom = plane.clone();
  bottom.translate(0, -SHEET, 0);
  if (bottom.index) {
    const idx = bottom.index.array as unknown as number[];
    for (let i = 0; i < idx.length; i += 3) {
      const tmp = idx[i + 1];
      idx[i + 1] = idx[i + 2];
      idx[i + 2] = tmp;
    }
    bottom.index.needsUpdate = true;
  }
  bottom.computeVertexNormals();

  // Stitch the perimeter edge between top and underside sheets.
  const colsV = segX + 1;
  const loop: number[] = [];
  for (let ix = 0; ix <= segX; ix++) loop.push(ix); // back row (iz = 0)
  for (let iz = 1; iz <= segZ; iz++) loop.push(iz * colsV + segX); // right
  for (let ix = segX - 1; ix >= 0; ix--) loop.push(segZ * colsV + ix); // front
  for (let iz = segZ - 1; iz >= 1; iz--) loop.push(iz * colsV); // left

  const n = loop.length;
  const edgePos = new Float32Array(n * 2 * 3);
  const edgeUv = new Float32Array(n * 2 * 2);
  const topPos = plane.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < n; i++) {
    const vi = loop[i];
    const x = topPos.getX(vi);
    const y = topPos.getY(vi);
    const z = topPos.getZ(vi);
    edgePos.set([x, y, z], i * 3);
    edgePos.set([x, y - SHEET, z], (n + i) * 3);
  }
  const edgeIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    edgeIdx.push(i, j, n + j, i, n + j, n + i);
  }
  const edge = new THREE.BufferGeometry();
  edge.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
  edge.setAttribute("uv", new THREE.BufferAttribute(edgeUv, 2));
  edge.setIndex(edgeIdx);
  edge.computeVertexNormals();

  const merged = mergeGeometries([plane, bottom, edge]);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

export const EGG_SEAT_Y = TRAY_TOP - WELL_DEPTH - 0.02;