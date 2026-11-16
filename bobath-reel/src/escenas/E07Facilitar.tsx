import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayText } from "../components/OverlayText";
import { breathe, DrawPath, Glow, Orb, Plate } from "../components/Plate";
import { TopShade } from "../components/Scene";
import { PALETA } from "../constants";
import type { SceneProps } from "../scenes/types";
import { ease } from "../utils";

// Puntos clave (capas.json del agente, ×0,8 al cuadro 1080x1920, ajustados a ojo sobre la imagen)
const PUNTOS = {
  pelvis: [480, 1000],
  tronco: [520, 720],
  hombro: [650, 592],
  mano: [915, 838],
} as const;
const OBJETO: [number, number] = [980, 945];
// trayectoria del alcance: de la mano en reposo junto a la cadera hasta el objeto
const ALCANCE = "M 640 1010 C 760 1010, 860 930, 915 838";

// Escena 7 — Paso 2 Facilitar: orbes dorados que se encienden en secuencia pelvis → tronco →
// hombro → mano; trayectoria cian del alcance hacia el objeto. Plano 3/4 con tilt-up.
export const E07Facilitar: React.FC<SceneProps> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = ease(frame, [0, duration], [130, 220]); // la cámara sube: la imagen baja
  const scale = 1.06 * breathe(frame, 0.005, 60);
  const orb = (start: number) => {
    if (frame < start) return { i: 0, pop: 1 };
    const p = spring({ frame: frame - start, fps, config: { damping: 8, stiffness: 160 } });
    return { i: 0.65 + 0.35 * Math.sin((frame - start) / 7), pop: 0.6 + 0.6 * p - 0.2 * Math.max(0, p - 1) };
  };
  const seq: [keyof typeof PUNTOS, number][] = [
    ["pelvis", 18],
    ["tronco", 42],
    ["hombro", 66],
    ["mano", 90],
  ];
  const trail = ease(frame, [70, 190], [0, 1]);
  return (
    <AbsoluteFill>
      <Plate src="e07/e07_composite.png" camera={{ scale, y, origin: [560, 900] }}>
        <DrawPath d={ALCANCE} progress={trail} color={PALETA.cian} width={8} />
        <Glow x={OBJETO[0]} y={OBJETO[1]} r={160} color={PALETA.cian} opacity={0.35 + 0.35 * trail + 0.1 * Math.sin(frame / 6)} />
        {seq.map(([k, start]) => {
          const o = orb(start);
          return <Orb key={k} x={PUNTOS[k][0]} y={PUNTOS[k][1]} r={20} color={PALETA.oro} intensity={o.i} pop={o.pop} />;
        })}
      </Plate>
      <TopShade />
      <OverlayText title={scene.onScreen.title} subtitle={scene.onScreen.subtitle} durationInFrames={duration} />
    </AbsoluteFill>
  );
};
