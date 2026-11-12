import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PALETA } from "../constants";

type Vec3 = [number, number, number];

const hash = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Hemisferio low-poly: icosaedro desplazado de forma determinista (circunvoluciones). */
const makeHemisphere = (side: 1 | -1) => {
  const g = new THREE.IcosahedronGeometry(1, 3);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const kx = Math.round(v.x * 1000) / 1000;
    const ky = Math.round(v.y * 1000) / 1000;
    const kz = Math.round(v.z * 1000) / 1000;
    const bump = 1 + 0.09 * (hash(kx, ky, kz) - 0.5) + 0.06 * Math.sin(7 * kx) * Math.sin(6 * ky) * Math.sin(8 * kz);
    v.multiplyScalar(bump);
    // cara medial más plana (cisura interhemisférica)
    if (v.x * side < 0) v.x *= 0.45;
    v.set(v.x * 0.62, v.y * 0.74, v.z * 1.02);
    // lóbulo temporal ligeramente hacia abajo y adelante
    if (v.y < -0.2) v.z += 0.08;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
};

export type Brain3DProps = {
  position?: Vec3;
  rotationY?: number;
  scale?: number;
  /** 0..1 cuánto brillan las sinapsis */
  activation?: number;
  /** color de las sinapsis */
  color?: string;
};

export const Brain3D: React.FC<Brain3DProps> = ({ position = [0, 0, 0], rotationY = 0, scale = 1, activation = 1, color = PALETA.cian }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { left, right, synapses } = useMemo(() => {
    const l = makeHemisphere(1);
    const r = makeHemisphere(-1);
    const pts: { p: Vec3 }[] = [];
    [
      { g: l, off: 0.26 },
      { g: r, off: -0.26 },
    ].forEach(({ g, off }) => {
      const pos = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i += 53) {
        const x = pos.getX(i);
        // solo la superficie externa
        if (Math.sign(x) !== Math.sign(off) && Math.abs(x) > 0.05) continue;
        pts.push({ p: [x * 1.03 + off, pos.getY(i) * 1.03, pos.getZ(i) * 1.03] });
      }
    });
    return { left: l, right: r, synapses: pts };
  }, []);

  const t = frame / fps;

  return (
    <group position={position} rotation={[0.12, rotationY, 0]} scale={scale}>
      {[
        { g: left, x: 0.26 },
        { g: right, x: -0.26 },
      ].map(({ g, x }) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh geometry={g}>
            <meshStandardMaterial color="#1B3358" emissive="#0A2540" emissiveIntensity={0.6} roughness={0.55} metalness={0.15} flatShading />
          </mesh>
          <mesh geometry={g} scale={1.004}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.18 + 0.2 * activation} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* cerebelo y tronco */}
      <mesh position={[0, -0.52, -0.62]} scale={[0.62, 0.3, 0.38]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#173052" emissive="#0A2540" emissiveIntensity={0.5} flatShading />
      </mesh>
      <mesh position={[0, -0.86, -0.32]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.62, 8]} />
        <meshStandardMaterial color="#173052" emissive="#0A2540" emissiveIntensity={0.5} flatShading />
      </mesh>
      {/* sinapsis: oleada de luz de atrás hacia adelante */}
      {synapses.map(({ p }, i) => {
        const wave = 0.5 + 0.5 * Math.sin(t * 4.2 - p[2] * 3.2 - p[1] * 1.5);
        const k = Math.pow(wave, 5) * activation;
        return (
          <mesh key={i} position={p} scale={1 + k * 1.6}>
            <sphereGeometry args={[0.028, 8, 6]} />
            <meshBasicMaterial color={k > 0.35 ? PALETA.blanco : color} transparent opacity={0.25 + 0.75 * k} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};
