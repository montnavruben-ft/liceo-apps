import React from "react";
import { PALETA } from "../constants";

type Vec3 = [number, number, number];

/** Mano estilizada del terapeuta (tipo maniquí). La palma mira hacia -Z local. */
export const Hand3D: React.FC<{ position: Vec3; rotation?: Vec3; scale?: number; color?: string; curl?: number }> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  color = PALETA.manos,
  curl = 0.35,
}) => {
  const mat = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.35} metalness={0.05} />;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[0.1, 0.11, 0.032]} />
        {mat}
      </mesh>
      {[-0.036, -0.012, 0.012, 0.036].map((x, i) => (
        <group key={x} position={[x, 0.055, 0]} rotation={[-curl, 0, 0]}>
          <mesh position={[0, 0.035 + (i === 1 || i === 2 ? 0.006 : 0), 0]}>
            <capsuleGeometry args={[0.011, 0.05 + (i === 1 || i === 2 ? 0.012 : 0), 4, 8]} />
            {mat}
          </mesh>
        </group>
      ))}
      <group position={[0.058, -0.01, 0]} rotation={[-0.2, 0, -0.9]}>
        <mesh position={[0, 0.03, 0]}>
          <capsuleGeometry args={[0.012, 0.04, 4, 8]} />
          {mat}
        </mesh>
      </group>
      {/* antebrazo/manga */}
      <mesh position={[0, -0.13, 0]}>
        <capsuleGeometry args={[0.04, 0.14, 4, 10]} />
        <meshStandardMaterial color={PALETA.coral} emissive={PALETA.coral} emissiveIntensity={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
};
