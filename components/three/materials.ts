import * as THREE from "three";

// Procedural molded-pulp texture maps drawn on a canvas (no external assets).
function drawPaperCanvas(base: string, fleck: string, fiber: string): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Soft mottling.
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 5;
    ctx.fillStyle = Math.random() > 0.5 ? fleck : fiber;
    ctx.globalAlpha = 0.03 + Math.random() * 0.08;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Short fibers.
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = fiber;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI;
    const l = 2 + Math.random() * 7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return canvas;
}

let cached: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

export function getKraftMaps() {
  if (cached) return cached;
  const colorCanvas = drawPaperCanvas("#ac9c82", "#9c8b71", "#c3b399");
  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2.5, 2.5);
  map.anisotropy = 4;

  const bumpCanvas = drawPaperCanvas("#808080", "#6a6a6a", "#9a9a9a");
  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2.5, 2.5);

  cached = { map, bump };
  return cached;
}

export function createKraftMaterial(color = "#ac9c82"): THREE.MeshStandardMaterial {
  const { map, bump } = getKraftMaps();
  return new THREE.MeshStandardMaterial({
    color,
    map,
    bumpMap: bump,
    bumpScale: 0.9,
    roughness: 0.97,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
}

export function createEggMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#f3ead6",
    roughness: 0.42,
    metalness: 0.0,
  });
}