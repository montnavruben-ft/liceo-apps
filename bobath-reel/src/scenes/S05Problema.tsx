import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Avatar3D, hemiPose, walkPose } from "../components/Avatar3D";
import { OverlayText } from "../components/OverlayText";
import { TrailTube } from "../components/Primitives3D";
import { SceneBackground, TopShade } from "../components/Scene";
import { CameraRig, Stage } from "../components/Stage";
import { PALETA } from "../constants";
import { ease } from "../utils";
import type { SceneProps } from "./types";

type V = [number, number, number];
const Z0 = -2.6;
const Z1 = 0.9;
// Desviación de la trayectoria del avatar con tono alterado
const deviate = (z: number) => 0.22 * Math.sin((z - Z0) * 1.9) + 0.12 * (z - Z0);

// Escena 5 — El problema: marcha fluida (trayectoria recta verde) vs marcha con tono alterado
// (brazo flexionado, pierna rígida, trayectoria torcida roja y resorte apretado que vibra).
export const S05Problema: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const k = ease(frame, [10, duration], [0, 1], (x) => x);
  const z = Z0 + (Z1 - Z0) * k;
  const phase = frame * 0.16;
  const leftX = -0.62;
  const rightX = 0.62;

  const straight = useMemo<V[]>(() => [[leftX, 0.02, Z0], [leftX, 0.02, (Z0 + Z1) / 2], [leftX, 0.02, Z1 + 0.3]], [leftX]);
  const crooked = useMemo<V[]>(() => Array.from({ length: 24 }, (_, i) => {
    const zz = Z0 + ((Z1 + 0.3 - Z0) * i) / 23;
    return [rightX + deviate(zz), 0.02, zz] as V;
  }), [rightX]);
  const trail = (z - Z0) / (Z1 + 0.3 - Z0);

  // orientación del avatar derecho según la pendiente de su trayectoria
  const slope = (deviate(z + 0.01) - deviate(z)) / 0.01;
  const camX = ease(frame, [0, duration], [-0.7, 0.7]);
  const jitter = Math.sin(frame * 2.7) * 0.012;

  return (
    <AbsoluteFill>
      <SceneBackground />
      <Stage fov={40}>
        <CameraRig position={[camX, 2.1, z + 6.8]} target={[camX * 0.3, 1.2, z - 0.4]} />
        <gridHelper args={[14, 42, "#1E3A5F", "#16294A"]} />
        <mesh position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, 30]} />
          <meshBasicMaterial color="#334155" />
        </mesh>
        <TrailTube points={straight} progress={trail} color={PALETA.verde} radius={0.035} />
        <TrailTube points={crooked} progress={trail} color={PALETA.coral} radius={0.035} />
        <Avatar3D pose={walkPose(phase)} position={[leftX, 0, z]} />
        <Avatar3D
          pose={hemiPose(phase * 0.85, "L")}
          position={[rightX + deviate(z), 0, z]}
          rotationY={Math.atan(slope) * 0.8}
          color="#2A3F66"
          spring={{ side: "L", color: PALETA.coral, tension: 1, jitter }}
        />
      </Stage>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
