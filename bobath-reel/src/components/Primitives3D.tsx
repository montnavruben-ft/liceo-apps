import React, { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useDelayRender } from "remotion";
import { PALETA } from "../constants";
import { FUENTE_TITULO } from "../fonts";
import { seeded } from "../utils";

type Vec3 = [number, number, number];

// ---------------------------------------------------------------------------
// Partículas que suben (fondo "azul noche con partículas")
// ---------------------------------------------------------------------------
let dotTexture: THREE.Texture | null = null;
const getDotTexture = () => {
  if (dotTexture) return dotTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  return dotTexture;
};

export const Particles: React.FC<{
  count?: number;
  spread?: Vec3;
  speed?: number;
  size?: number;
  color?: string;
  opacity?: number;
  seed?: number;
  center?: Vec3;
}> = ({ count = 220, spread = [9, 16, 6], speed = 0.012, size = 0.07, color = PALETA.cian, opacity = 0.7, seed = 7, center = [0, 0, -2] }) => {
  const frame = useCurrentFrame();
  const { base, geometry } = useMemo(() => {
    const rnd = seeded(seed);
    const b = Array.from({ length: count }, () => ({
      x: (rnd() - 0.5) * spread[0],
      y: rnd() * spread[1],
      z: (rnd() - 0.5) * spread[2],
      v: 0.5 + rnd(),
    }));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return { base: b, geometry: g };
  }, [count, seed, spread]);

  const arr = geometry.attributes.position.array as Float32Array;
  base.forEach((p, i) => {
    const y = ((p.y + frame * speed * p.v) % spread[1]) - spread[1] / 2;
    arr[i * 3] = p.x + Math.sin(frame * 0.02 + i) * 0.05 + center[0];
    arr[i * 3 + 1] = y + center[1];
    arr[i * 3 + 2] = p.z + center[2];
  });
  geometry.attributes.position.needsUpdate = true;

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={size}
        map={getDotTexture()}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// ---------------------------------------------------------------------------
// Tubo que se "dibuja" (trayectorias, rutas neuronales nuevas)
// ---------------------------------------------------------------------------
export const TrailTube: React.FC<{
  points: Vec3[];
  progress: number; // 0..1
  color: string;
  radius?: number;
  opacity?: number;
  segments?: number;
}> = ({ points, progress, color, radius = 0.03, opacity = 1, segments = 120 }) => {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, segments, radius, 8, false);
  }, [points, radius, segments]);
  const total = geometry.index ? geometry.index.count : 0;
  const perSeg = total / segments;
  geometry.setDrawRange(0, Math.floor(Math.max(0, Math.min(1, progress)) * segments) * perSeg);
  if (progress <= 0) return null;
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------
// Segmento recto entre dos puntos (aristas de red neuronal)
// ---------------------------------------------------------------------------
const UP = new THREE.Vector3(0, 1, 0);
export const Edge: React.FC<{ a: Vec3; b: Vec3; radius?: number; color: string; opacity?: number; trimStart?: number; trimEnd?: number }> = ({
  a,
  b,
  radius = 0.018,
  color,
  opacity = 1,
  trimStart = 0,
  trimEnd = 1,
}) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const s = va.clone().add(dir.clone().multiplyScalar(trimStart));
  const e = va.clone().add(dir.clone().multiplyScalar(trimEnd));
  const mid = s.clone().add(e).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  const l = len * Math.max(0.0001, trimEnd - trimStart);
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[radius, radius, l, 6, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------
// Texto "3D" con capas (extrusión falsa) dibujado en CanvasTexture con Montserrat
// ---------------------------------------------------------------------------
export const Text3D: React.FC<{
  text: string;
  height?: number; // alto del plano en unidades 3D
  color?: string;
  sideColor?: string;
  layers?: number;
  depth?: number;
}> = ({ text, height = 1, color = PALETA.blanco, sideColor = "#0E7490", layers = 8, depth = 0.12 }) => {
  const [textures, setTextures] = useState<{ front: THREE.Texture; side: THREE.Texture; aspect: number } | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`Texto 3D: ${text}`));

  useEffect(() => {
    let cancelled = false;
    const draw = (fill: string, glow: boolean) => {
      const c = document.createElement("canvas");
      const fontPx = 220;
      const ctx0 = c.getContext("2d")!;
      ctx0.font = `800 ${fontPx}px ${FUENTE_TITULO}`;
      const w = Math.ceil(ctx0.measureText(text).width + fontPx * 0.6);
      c.width = w;
      c.height = Math.ceil(fontPx * 1.5);
      const ctx = c.getContext("2d")!;
      ctx.font = `800 ${fontPx}px ${FUENTE_TITULO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (glow) {
        ctx.shadowColor = PALETA.cian;
        ctx.shadowBlur = 40;
      }
      ctx.fillStyle = fill;
      ctx.fillText(text, w / 2, c.height / 2 + fontPx * 0.04);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return { t, aspect: w / c.height };
    };
    document.fonts.load(`800 220px ${FUENTE_TITULO}`).then(() => {
      if (cancelled) return;
      const f = draw(color, true);
      const s = draw(sideColor, false);
      setTextures({ front: f.t, side: s.t, aspect: f.aspect });
    });
    return () => {
      cancelled = true;
    };
  }, [text, color, sideColor, continueRender, handle]);

  // La textura llega de forma asíncrona: repintar el lienzo antes de liberar el render.
  const advance = useThree((st) => st.advance);
  useEffect(() => {
    if (!textures) return;
    advance(performance.now());
    continueRender(handle);
  }, [textures, advance, continueRender, handle]);

  if (!textures) return null;
  const w = height * textures.aspect;
  return (
    <group>
      {Array.from({ length: layers }, (_, i) => {
        const isFront = i === 0;
        return (
          <mesh key={i} position={[0, 0, -i * (depth / layers)]} renderOrder={layers - i}>
            <planeGeometry args={[w, height]} />
            <meshBasicMaterial
              map={isFront ? textures.front : textures.side}
              transparent
              depthWrite={false}
              toneMapped={false}
              opacity={isFront ? 1 : 0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Onda expansiva (anillo)
// ---------------------------------------------------------------------------
export const Ripple: React.FC<{ position: Vec3; progress: number; color: string; maxRadius?: number; rotation?: Vec3 }> = ({
  position,
  progress,
  color,
  maxRadius = 0.6,
  rotation = [0, 0, 0],
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = 0.04 + progress * maxRadius;
  return (
    <mesh position={position} rotation={rotation} scale={[r, r, r]}>
      <ringGeometry args={[0.86, 1, 48]} />
      <meshBasicMaterial color={color} transparent opacity={(1 - progress) * 0.8} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

/** Esfera brillante con halo (sinapsis, orbes de puntos clave, nodos). */
export const GlowOrb: React.FC<{ position?: Vec3; radius: number; color: string; intensity: number; halo?: number }> = ({
  position = [0, 0, 0],
  radius,
  color,
  intensity,
  halo = 2.4,
}) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[radius, 16, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.35 + 0.65 * intensity} toneMapped={false} />
    </mesh>
    {intensity > 0.01 ? (
      <mesh scale={1 + (halo - 1) * intensity}>
        <sphereGeometry args={[radius, 16, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.22 * intensity} depthWrite={false} toneMapped={false} />
      </mesh>
    ) : null}
  </group>
);
